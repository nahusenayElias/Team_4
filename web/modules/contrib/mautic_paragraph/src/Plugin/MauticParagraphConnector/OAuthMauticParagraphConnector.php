<?php

namespace Drupal\mautic_paragraph\Plugin\MauticParagraphConnector;

use Drupal\Core\Form\FormStateInterface;
use Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginBase;
use Mautic\Auth\ApiAuth;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * OAuth Mautic connector.
 *
 * @MauticParagraphConnector(
 *   id = "oauth",
 *   label = @Translation("Oauth"),
 *   description = @Translation("OAuth connector for Mautic.")
 * )
 */
class OAuthMauticParagraphConnector extends MauticParagraphConnectorPluginBase {

  /**
   * Drupal state.
   *
   * @var \Drupal\Core\State\StateInterface
   */
  protected $state;

  /**
   * The current request object.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $request;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->state = $container->get('state');
    $instance->request = $container->get('request_stack')->getCurrentRequest();
    $instance->messenger = $container->get('messenger');

    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return parent::defaultConfiguration() + [
      'client_id' => '',
      'client_secret' => '',
      'scheme' => 'https',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);

    $form['auth'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Mautic OAuth Integration settings'),
      '#description' => $this->t(
        'To retrieve your client ID & secret: <ol>
          <li>Visit your mautic instance and retrieve your base url under general settings</li>
          <li>Create API credentials in Mautic : <a id="baseurlmautic" href="baseurlmautic/s/credentials/new" target="_blank">baseurlmautic/s/credentials/new</a>. Choose for OAuth2 protocol.</li>
            <strong>Note:</strong> The redirect URI in Mautic need to be publicly accessible.
          <li>Retrieve your client ID/Secret from the created API credentials.</li>
          </ol>'
      ),
      '#collapsible' => TRUE,
      '#collapsed' => empty($this->configuration['client_id']),
    ];

    $form['auth']['client_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Client ID'),
      '#default_value' => $this->configuration['client_id'] ?? '',
      '#required' => TRUE,
    ];

    $form['auth']['client_secret'] = [
      '#type' => 'password',
      '#title' => $this->t('Client Secret'),
      '#default_value' => $this->configuration['client_secret'] ?? '',
      '#description' => $this->t('If this field is left blank and the Client Secret was previously filled out, the current Client Secret will not be changed.'),
    ];

    $form['#attached']['library'][] = 'mautic_paragraph/admin_mautic_settings';

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    // Since the form is nested into another, we can't simply use #parents for
    // doing this array restructuring magic. (At least not without creating an
    // unnecessary dependency on internal implementation.)
    // For password fields, there is no default value, they're empty by default.
    // Therefore we ignore empty submissions if the user didn't change either.
    if ($values['auth']['client_secret'] === ''
      && isset($this->configuration['client_id'])
      && $values['auth']['client_id'] === $this->configuration['client_id']) {
      // Set the client_secret even though it wasn't filled in.
      $values['auth']['client_secret'] = $this->configuration['client_secret'];
    }

    foreach ($values['auth'] as $key => $value) {
      $form_state->setValue($key, $value);
    }

    // Clean-up the form to avoid redundant entries in the stored configuration.
    $form_state->unsetValue('auth');

    parent::submitConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function afterSubmit() {
    $this->startAuthorization();
  }

  /**
   * Clear the old access token data.
   */
  protected function cleanUpAuthenticationState() {
    $session = $this->request->getSession();
    $session->remove('oauth2state');
    $this->state->set('mautic_access_token_data', []);
  }

  /**
   * @return false|\Mautic\Auth\TwoLeggedOAuth2
   */
  protected function getValidAuthenticationObject($clean = FALSE) {
    if ($clean) {
      $this->cleanUpAuthenticationState();
    }

    $accessTokenData = $this->state->get('mautic_access_token_data', []);

    try {
      $base_url = $this->getServerUri();
    }
    catch (\Exception $e) {
      return FALSE;
    }

    try {
      $settings = [
        'baseUrl' => $base_url,
        'clientKey' => $this->configuration['client_id'],
        'clientSecret' => $this->configuration['client_secret'],
        'accessToken' => $accessTokenData['access_token'] ?? NULL,
        'accessTokenExpires' => $accessTokenData['expires'] ?? NULL,
      ];

      /** @var \Mautic\Auth\TwoLeggedOAuth2 $auth */
      $auth = (new ApiAuth())->newAuth(
        $settings,
        'TwoLeggedOAuth2'
      );

      $accessTokenData = $auth->getAccessTokenData();
      if ($clean || empty($accessTokenData['access_token']) || !$auth->validateAccessToken()) {
        $auth->setAccessTokenDetails(['access_token' => '']);
        $auth->requestAccessToken();
        $accessTokenData = $auth->getAccessTokenData();
        $this->state->set('mautic_access_token_data', $accessTokenData);
      }
      return $auth;
    }
    catch (\Exception $e) {
      $this->messenger()->addError($e->getMessage());
      watchdog_exception('mautic_paragraph', $e);
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getApiClient() {
    return $this->getValidAuthenticationObject();
  }

  /**
   * {@inheritdoc}
   */
  public function getStatus() {
    // Needed when switching from connector due to ajax.
    $config = $this->configFactory->getEditable('mautic_paragraph.settings');

    $this->configuration['client_id'] = !empty($this->configuration['client_id'])
      ? $this->configuration['client_id']
      : $config->get('connector_config.client_id');
    $this->configuration['client_secret'] = !empty($this->configuration['client_secret'])
      ? $this->configuration['client_secret']
      : $config->get('connector_config.client_secret');

    return $this->getValidAuthenticationObject();
  }

  /**
   * Starts the OAuth authorization flow.
   */
  public function startAuthorization() {
    $this->getValidAuthenticationObject(TRUE);
  }

  /**
   * {@inheritdoc}
   */
  public function getList($input = NULL, $auth = NULL) {
    $auth = $this->getValidAuthenticationObject();
    return parent::getList($input, $auth);
  }

}
