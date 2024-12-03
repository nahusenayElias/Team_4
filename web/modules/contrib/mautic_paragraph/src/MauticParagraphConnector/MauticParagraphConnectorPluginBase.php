<?php

namespace Drupal\mautic_paragraph\MauticParagraphConnector;

use Drupal\Component\Plugin\ConfigurableInterface;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\Core\Plugin\PluginFormInterface;
use Drupal\Core\Url;
use Drupal\mautic_paragraph\MauticParagraphConnectorInterface;
use Mautic\Exception\ContextNotFoundException;
use Mautic\Exception\RequiredParameterMissingException;
use Mautic\MauticApi;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

/**
 * Defines a base class for Mautic connector plugins.
 *
 * Plugins extending this class need to define a plugin definition array through
 * annotation. These definition arrays may be altered through
 * hook_mautic_connector_info_alter(). The definition includes the
 * following keys:
 * - id: The unique, system-wide identifier of the backend class.
 * - label: The human-readable name of the backend class, translated.
 * - description: A human-readable description for the backend class,
 *   translated.
 *
 * A complete plugin definition should be written as in this example:
 *
 * @code
 * @MauticParagraphConnector(
 *   id = "my_connector",
 *   label = @Translation("My connector"),
 *   description = @Translation("Authenticates with SuperAuth™.")
 * )
 * @endcode
 *
 * @see \Drupal\mautic_paragraph\Annotation\MauticParagraphConnector
 * @see \Drupal\mautic_paragraph\Plugin\MauticParagraphConnector\MauticParagraphConnectorPluginManager
 * @see \Drupal\mautic_paragraph\MauticParagraphConnectorInterface
 * @see plugin_api
 */
abstract class MauticParagraphConnectorPluginBase extends PluginBase implements MauticParagraphConnectorInterface, PluginFormInterface, ContainerFactoryPluginInterface {

  /**
   * The cache backend service.
   *
   * @var \Drupal\Core\Cache\CacheBackendInterface
   */
  protected $cacheBackend;

  /**
   * The configuration factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('cache.default'),
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, CacheBackendInterface $cache_backend, ConfigFactoryInterface $config_factory) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->cacheBackend = $cache_backend;
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'scheme' => 'https',
      'base_url' => 'localhost',
      'port' => NULL,
      'path' => '',
      'public_url' => 'localhost',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getConfiguration() {
    return $this->configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function setConfiguration(array $configuration) {
    $this->configuration = $configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function label() {
    $plugin_definition = $this->getPluginDefinition();
    return $plugin_definition['label'];
  }

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    $plugin_definition = $this->getPluginDefinition();
    return isset($plugin_definition['description']) ? $plugin_definition['description'] : '';
  }

  /**
   * {@inheritdoc}
   */
  public function getServerUri() {
    $host = $this->configuration['base_url'] ?? '';

    if (!$host) {
      throw new \Exception('Server uri is not available');
    }

    $scheme = isset($this->configuration['scheme']) ? $this->configuration['scheme'] . '://' : '';
    $port = $this->configuration['port'] ?? '';
    $path = $this->configuration['path'] ?? '';
    $uri = implode('', [$scheme, $host, $port, $path]);
    $url = Url::fromUri($uri);

    // Return the validated URL.
    return $url->toString();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['scheme'] = [
      '#type' => 'select',
      '#title' => $this->t('HTTP protocol'),
      '#description' => $this->t('The HTTP protocol to use for sending queries.'),
      '#default_value' => $this->configuration['scheme'] ?? 'http',
      '#options' => [
        'http' => 'http',
        'https' => 'https',
      ],
    ];

    $form['base_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Mautic base url'),
      '#description' => $this->t('The base url name or IP of your Mautic server, e.g. <code>localhost</code> or <code>example.com</code>.'),
      '#default_value' => $this->configuration['base_url'] ?? '',
      '#required' => TRUE,
    ];

    $form['port'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Mautic port'),
      '#description' => $this->t('An example port can be 3306.'),
      '#default_value' => $this->configuration['port'] ?? '',
    ];

    $form['path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Mautic path'),
      '#description' => $this->t('The path that identifies the Mautic instance to use on the server.'),
      '#default_value' => $this->configuration['path'] ?? '',
    ];

    $form['public_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Mautic public url'),
      '#description' => $this->t('The public url of your Mautic server, e.g. <code>example.com</code>.'),
      '#default_value' => $this->configuration['public_url'] ?? '',
      '#required' => TRUE,
    ];

    return $form;
  }

  public function getPublicUri() {
    $host = $this->configuration['public_url'] ?? '';

    \Drupal::logger('mautic_paragraph')->notice('Public URL configuration: @config', [
      '@config' => print_r($this->configuration, TRUE)
  ]);
    if (!$host) {
      return $this->getServerUri();
    }
    $scheme = isset($this->configuration['scheme']) ? $this->configuration['scheme'] . '://' : '';
    $port = $this->configuration['port'] ?? '';
    if ($port) {
      $port = ':' . $port;  // Add colon prefix if port exists
  }
    $path = $this->configuration['path'] ?? '';
    if ($path && strpos($path, '/') !== 0) {
      $path = '/' . $path;  // Add leading slash if missing
  }
    $uri = implode('', [$scheme, $host, $port, $path]);
    \Drupal::logger('mautic_paragraph')->notice('Generated public URI: @uri', [
      '@uri' => $uri
  ]);
    // $url = Url::fromUri($uri);
    return $uri;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    if (!empty($values['path']) && strpos($values['path'], '/') !== 0) {
      $form_state->setError($form['path'], $this->t('If provided the path has to start with "/".'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    if ($this instanceof ConfigurableInterface) {
      $this->setConfiguration($form_state->getValues());
    }
  }

  /**
   * Returns a response message based on Mautic API response.
   *
   * @param array|mixed $response
   *   Mautic API response array.
   *
   * @return string
   *   A proper response message.
   */
  protected function getErrorMessage($response) {
    return explode('Response:', $response['errors']['0']['message'])[0];
  }

  /**
   * {@inheritdoc}
   */
  public function afterSubmit() {
    // Gives a way to start an auth flow after submit for the connectors.
  }

  protected function fetchForms($auth = NULL) {
    try {
      // Get base url from config.
      $url = $this->getServerUri();
      \Drupal::logger('mautic_paragraph')->notice('Attempting to connect to Mautic at: @url', ['@url' => $url]);

      // Make new mauticAPI instance.
      $api = new MauticApi();

      // Get formsAPI.
      $config = $this->configFactory->get('mautic_paragraph.settings');
      $formsApi = $api->newApi('forms', $auth, $url);
      $options = [
        'verify' => FALSE,
        'timeout' => 30,
        'connect_timeout' => 5,
      ];
      $response = $formsApi->getList('', 0, $config->get('limit'), '', 'ASC', TRUE, TRUE, $options);

      // Check for errors.
      if (!empty($response['errors'])) {
        // Get error message.
        $error_message = $this->getErrorMessage($response);

        // Check if unauthorized error code, throws another exception.
        if ($response['errors']['0']['code'] == 401) {
          throw new UnauthorizedHttpException(' Basic realm="Mautic integration module', $error_message);
        }
        throw new \Exception($error_message);
      }

      return $response['forms'] ?? [];
    }
    catch (RequiredParameterMissingException $e) {
      watchdog_exception('error', $e);
      // Display credentials error message.
      $this->getCredentialsErrorMessage();
      return [];
    }
    catch (ContextNotFoundException $e) {
      watchdog_exception('error', $e);
      $this->messenger()->addError($this->t('Failed to retrieve forms, invalid Context.'));
      return [];
    }
    catch (UnauthorizedHttpException $e) {
      watchdog_exception('error', $e);
      $this->messenger()->addError($this->t('Failed to retrieve forms. Your credentials in the Mautic Integration settings page are wrong.'));
      return [];
    }
    catch (\Exception $e) {
      watchdog_exception('error', $e);
      \Drupal::logger('mautic_paragraph')->error('Connection details: URL=@url, Error=@error', [
        '@url' => $this->getServerUri(),
        '@error' => $e->getMessage()
      ]);
      $this->messenger()->addError($this->t('Failed to retrieve forms. Verify your settings on the Mautic paragraph Integration settings page.'));
      return [];
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getList($input = NULL, $auth = NULL) {
    $settings = $this->configFactory->get('mautic_paragraph.settings');

    // Default cache is one hour.
    $cache_period = $settings->get('cache') ?? 3600;

    // Returns actual data from the api if no caching exists.
    if (!$cache_period) {
      $forms = $this->fetchForms($auth) ?? [];
    }
    else {
      // First check data in the cache.
      $cache = $this->cacheBackend->get('mautic_form_list');
      $forms = $cache->data ?? [];

      // If empty, get the actual data and put in the cache.
      if (!$forms) {
        $forms = $this->fetchForms($auth) ?? [];
        $this->cacheBackend->set('mautic_form_list', $forms, time() + $cache_period, $settings->getCacheTags());
      }
    }

    if ($input && is_array($forms)) {
      $forms = array_filter($forms, function ($form) use (&$input) {
        return strpos(strtolower($form['name']), strtolower($input)) !== FALSE;
      });
    }

    return $forms;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormTitle($id) {
    // Get unfiltered list of forms.
    $formList = $this->getList();

    // Loop over formList to get name of matching form.
    $form = array_filter($formList, function ($item) use (&$id) {
      return $item['id'] == $id;
    });

    // When there is no match, return null.
    if (count($form) === 0) {
      return NULL;
    }
    return array_shift($form)['name'];
  }

  /**
   * Display credentials error message.
   */
  protected function getCredentialsErrorMessage() {
    // Get link from route settings page.
    $link = Url::fromRoute('mautic_paragraph.route_settings');
    // Make the link.
    $link_message = Link::fromTextAndUrl($this->t('mautic settings page'), $link)->toString();
    // Display error.
    $this->messenger()->addError($this->t('Failed to retrieve forms, missing credentials. Check %link .', ['%link' => $link_message]));
  }

  public function getMauticFormScriptUrl($formId) {
    $baseUrl = rtrim($this->getPublicUri(), '/');
    $url = $baseUrl . '/form/generate.js?id=' . $formId;
    
    // Debug log
    \Drupal::logger('mautic_paragraph')->notice('Generated script URL: @url', [
        '@url' => $url
    ]);
    
    return $url;
  }

  public function getMauticFormEmbedUrl($formId) {
    $baseUrl = rtrim($this->getPublicUri(), '/');
    $url = $baseUrl . '/form/' . $formId;
    
    // Debug log
    \Drupal::logger('mautic_paragraph')->notice('Generated embed URL: @url', [
        '@url' => $url
    ]);
    
    return $url;
  }
}
