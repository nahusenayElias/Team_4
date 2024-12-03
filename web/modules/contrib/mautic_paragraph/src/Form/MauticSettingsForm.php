<?php

namespace Drupal\mautic_paragraph\Form;

use Drupal\Component\Utility\Html;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Datetime\DateFormatterInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Plugin\PluginFormInterface;
use Drupal\mautic_paragraph\MauticParagraphApiInterface;
use Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configure Mautic Integration settings for this site.
 */
class MauticSettingsForm extends ConfigFormBase {

  /**
   * Config settings.
   *
   * @var string
   */
  const SETTINGS = 'mautic_paragraph.settings';

  /**
   * The MauticParagraphAPI service.
   *
   * @var \Drupal\mautic_paragraph\MauticParagraphApiInterface
   */
  protected $mauticParagraphApi;

  /**
   * The backend plugin manager.
   *
   * @var \Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginManager
   */
  protected $mauticparagraphConnectorPluginManager;

  /**
   * The messenger to send info or warnings to Drupal with.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * The Mautic configuration object.
   *
   * @var \Drupal\Core\Config\Config|\Drupal\Core\Config\ImmutableConfig
   */
  protected $configuration;

  /**
   * The date formatter service.
   *
   * @var \Drupal\Core\Datetime\DateFormatterInterface
   */
  protected $dateFormatter;

  /**
   * MauticSettingsForm constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\mautic_paragraph\MauticParagraphApiInterface $mautic_paragraph_api
   *   The Unomi API service.
   * @param \Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginManager $mautic_paragraph_connector_plugin_manager
   *   The Unomi Connector Plugin Manager.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger to send info or warnings to Drupal with.
   * @param \Drupal\Core\Datetime\DateFormatterInterface $date_formatter
   *   The date formatter service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, MauticParagraphApiInterface $mautic_paragraph_api, MauticParagraphConnectorPluginManager $mautic_paragraph_connector_plugin_manager, MessengerInterface $messenger, DateFormatterInterface $date_formatter) {
    parent::__construct($config_factory);

    $this->mauticParagraphApi = $mautic_paragraph_api;
    $this->mauticparagraphConnectorPluginManager = $mautic_paragraph_connector_plugin_manager;
    $this->messenger = $messenger;
    $this->dateFormatter = $date_formatter;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('mautic_paragraph_api'),
      $container->get('plugin.manager.mautic_paragraph.connector'),
      $container->get('messenger'),
      $container->get('date.formatter')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'mautic_paragraph_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);

    $configuration = $this->config(static::SETTINGS);
    $mautic_paragraph_connector_options = $this->getMauticparagraphConnectorOptions();
    $form['connector'] = [
      '#type' => 'radios',
      '#title' => $this->t('Mautic Paragraph Connector'),
      '#description' => $this->t('Choose a connector to use for this Mautic server.'),
      '#empty_value' => '',
      '#options' => $mautic_paragraph_connector_options,
      '#default_value' => $configuration->get('connector'),
      '#required' => TRUE,
      '#ajax' => [
        'callback' => [get_class($this), 'buildAjaxMauticparagraphConnectorConfigForm'],
        'wrapper' => 'mautic_paragraph-connector-config-form',
        'method' => 'replace',
        'effect' => 'fade',
      ],
    ];

    $form['limit'] = [
      '#type' => 'number',
      '#title' => $this->t('Limit'),
      '#min' => 0,
      '#description' => $this->t('Limit number of entities to return.'),
      '#default_value' => $configuration->get('limit'),
    ];

    // Prepare period options.
    $period = [0, 60, 180, 300, 600, 900, 1800, 2700, 3600, 10800, 21600, 32400, 43200, 86400];
    $period = array_map([$this->dateFormatter, 'formatInterval'], array_combine($period, $period));
    $period[0] = '<' . $this->t('no caching') . '>';

    $form['cache'] = [
      '#type' => 'select',
      '#title' => $this->t('Cache mautic form list for:'),
      '#options' => $period,
      '#default_value' => $configuration->get('cache'),
      '#description' => $this->t('List of mautic forms will be cached for certain amount of time.'),
    ];

    $this->buildConnectorConfigForm($form, $form_state);

    $form['actions']['submit']['#value'] = $this->t('Connect to Mautic');

    return $form;
  }

  /**
   * Handles switching the selected Mautic connector plugin.
   */
  public static function buildAjaxMauticparagraphConnectorConfigForm(array $form, FormStateInterface $form_state) {
    // The work is already done in form(), where we rebuild the entity according
    // to the current form values and then create the backend configuration form
    // based on that. So we just need to return the relevant part of the form
    // here.
    return $form['connector_config'];
  }

  /**
   * Builds the backend-specific configuration form.
   *
   * @param array $form
   *   The form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   *
   * @throws \Drupal\Component\Plugin\Exception\PluginException
   */
  public function buildConnectorConfigForm(array &$form, FormStateInterface $form_state) {
    $form['connector_config'] = [];
    $configuration = $this->config(static::SETTINGS);

    $connector_id = $configuration->get('connector');
    if ($form_state->getValue('connector') != '') {
      // It is due to the ajax.
      $connector_id = $form_state->getValue('connector');
    }

    $connector_config = [];
    if (!empty($configuration->get('connector_config'))) {
      $connector_config = $configuration->get('connector_config');
    }

    if ($connector_id) {
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance($connector_id, $connector_config);
      if ($connector instanceof PluginFormInterface) {
        $form_state->set('connector', $connector_id);
        if ($form_state->isRebuilding()) {
          $this->messenger->addWarning($this->t('Please configure the selected Mautic connector.'));
        }
        // Attach the Mautic connector plugin configuration form.
        $connector_form_state = SubformState::createForSubform($form['connector_config'], $form, $form_state);
        $form['connector_config'] = $connector->buildConfigurationForm($form['connector_config'], $connector_form_state);

        // Modify the backend plugin configuration container element.
        $form['connector_config']['#type'] = 'details';
        $form['connector_config']['#title'] = $this->t('Configure %plugin Mautic connector', ['%plugin' => $connector->label()]);
        $form['connector_config']['#description'] = $connector->getDescription();
        $form['connector_config']['#open'] = TRUE;
      }
    }
    $form['connector_config'] += ['#type' => 'container'];
    $form['connector_config']['#attributes'] = [
      'id' => 'mautic_paragraph-connector-config-form',
    ];
    $form['connector_config']['#tree'] = TRUE;

    try {
      $cid = $form_state->getValue('connector') ? $form_state->getValue('connector') : $connector_id;
      $cconfig = $form_state->getValue('connector_config') ? $form_state->getValue('connector_config') : $connector_config;
      if (isset($cid) && isset($cconfig)) {
        if ($connector instanceof PluginFormInterface) {
          $connector = $this->mauticparagraphConnectorPluginManager->createInstance($cid, $cconfig);
          $form['connector_config']['status'] = [
            '#type' => 'fieldset',
            '#title' => $this->t('Status'),
            '#title_display' => 'before',
            '#open' => TRUE,
          ];
          $form['connector_config']['status']['description'] = [
            '#type' => 'markup',
            '#markup' => $connector->getStatus() ? $this->t('Connection successfully established via @type!', ['@type' => $connector_id]) : $this->t('Connection failed, there was a problem with the connection to the Mautic API instance.'),
          ];
        }
      }
    }
    catch (\Exception $e) {
      watchdog_exception('error', $e);
      $form['connector_config']['status'] = [
        '#type' => 'fieldset',
        '#title' => $this->t('Status'),
        '#title_display' => 'before',
        '#open' => TRUE,
        '#description' => $this->t('Connection failed, there was a problem with the connection to the Mautic API instance.'),
      ];
    }
  }

  /**
   * Returns all available backend plugins, as an options list.
   *
   * @return string[]
   *   An associative array mapping backend plugin IDs to their (HTML-escaped)
   *   labels.
   */
  protected function getMauticparagraphConnectorOptions() {
    $options = [];
    foreach ($this->mauticparagraphConnectorPluginManager->getDefinitions() as $plugin_id => $plugin_definition) {
      $options[$plugin_id] = Html::escape($plugin_definition['label']);
    }
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);

    // Load the configuration to get our existing state. This way we can save
    // our password.
    $configuration = $this->config(static::SETTINGS);
    $connector = $this->mauticparagraphConnectorPluginManager->createInstance($form_state->getValue('connector'), $configuration->get('connector_config'));
    if ($connector instanceof PluginFormInterface) {
      $connector_form_state = SubformState::createForSubform($form['connector_config'], $form, $form_state);
      $connector->validateConfigurationForm($form['connector_config'], $connector_form_state);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Load the configuration to get our existing state. This way we can save
    // our password.
    $configuration = $this->config(static::SETTINGS);
    $connector = $this->mauticparagraphConnectorPluginManager->createInstance($form_state->getValue('connector'), $configuration->get('connector_config'));
    if ($connector instanceof PluginFormInterface) {
      $connector_form_state = SubformState::createForSubform($form['connector_config'], $form, $form_state);
      $connector->submitConfigurationForm($form['connector_config'], $connector_form_state);
      // Overwrite the form values with type casted values.
      // @see \Drupal\mautic_paragraph\UnomiConnector\UnomiConnectorPluginBase::setConfiguration()
      $form_state->setValue('connector_config', $connector->getConfiguration());
    }

    // Retrieve the configuration.
    $this->configFactory->getEditable(static::SETTINGS)
      ->set('cache', $form_state->getValue('cache'))
      ->set('connector', $form_state->getValue('connector'))
      ->set('connector_config', $form_state->getValue('connector_config'))
      ->set('limit', $form_state->getValue('limit'))
      ->save();

    $connector->afterSubmit();
    parent::submitForm($form, $form_state);
  }

}
