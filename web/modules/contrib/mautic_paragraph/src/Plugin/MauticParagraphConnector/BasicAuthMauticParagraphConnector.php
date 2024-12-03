<?php

namespace Drupal\mautic_paragraph\Plugin\MauticParagraphConnector;

use Drupal\Core\Form\FormStateInterface;
use Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginBase;
use Mautic\Auth\ApiAuth;
use Mautic\Exception\RequiredParameterMissingException;
use Mautic\MauticApi;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

/**
 * Basic auth Mautic connector.
 *
 * @MauticParagraphConnector(
 *   id = "basic_auth",
 *   label = @Translation("Basic Auth"),
 *   description = @Translation("A connector usable for Mautic installations protected by basic authentication.")
 * )
 */
class BasicAuthMauticParagraphConnector extends MauticParagraphConnectorPluginBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return parent::defaultConfiguration() + [
      'username' => '',
      'password' => '',
      'port' => NULL,
      'path' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);

    $form['auth'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('HTTP Basic Authentication'),
      '#description' => $this->t('If your Mautic server is protected by basic HTTP authentication, enter the login data here.'),
      '#collapsible' => TRUE,
      '#collapsed' => empty($this->configuration['username']),
    ];

    $form['auth']['username'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Username'),
      '#default_value' => isset($this->configuration['username']) ? $this->configuration['username'] : '',
      '#required' => TRUE,
    ];

    $form['auth']['password'] = [
      '#type' => 'password',
      '#title' => $this->t('Password'),
      '#description' => $this->t('If this field is left blank and the HTTP username is filled out, the current password will not be changed.'),
    ];

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
    $values += $values['auth'];

    // For password fields, there is no default value, they're empty by default.
    // Therefore we ignore empty submissions if the user didn't change either.
    if ($values['password'] === ''
      && isset($this->configuration['username'])
      && $values['username'] === $this->configuration['username']) {
      $values['auth']['password'] = $this->configuration['password'];
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
  public function getStatus() {
    // Check if server uri is available.
    try {
      $url = $this->getServerUri();
    }
    catch (\Exception $e) {
      return FALSE;
    }

    try {
      $auth = new ApiAuth();

      // Needed when switching from connector due to ajax.
      $saved_config = \Drupal::service('config.factory')->getEditable('mautic_paragraph.settings');

      $username = $this->configuration['username'] ?? $saved_config->get('connector_config.username');
      $password = $this->configuration['password'] ?? $saved_config->get('connector_config.password');

      if (empty($username) || empty($password) || empty($url)) {
        return FALSE;
      }
      if ($username && $password) {
        $settings = [
          'userName' => $username,
          'password' => $password,
        ];
        // Make new mauticAPI instance.
        $auth = $auth->newAuth($settings, 'BasicAuth');

        $api = new MauticApi();

        // Get API.
        $formsApi = $api->newApi('users', $auth, $url);

        // Get list.
        $response = $formsApi->getList('', 0, 0, '', 'ASC', TRUE, TRUE);

        // If error message, throw exception.
        if (isset($response['errors'])) {
          $error_message = $this->getErrorMessage($response);
          if ($response['errors']['0']['code'] == 401) {
            throw new UnauthorizedHttpException(' Basic realm="Mautic integration module', $error_message);
          }
          throw new \Exception($error_message);
        }
        return TRUE;
      }
      else {
        throw new RequiredParameterMissingException();
      }
    }
    catch (\Exception $e) {
      watchdog_exception('error', $e);
      return FALSE;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getApiClient() {
    $auth = new ApiAuth();

    $saved_config = \Drupal::service('config.factory')->getEditable('mautic_paragraph.settings');

    try {
      $settings = [
        'userName' => $saved_config->get('connector_config.username'),
        'password' => $saved_config->get('connector_config.password'),
      ];
      return $auth->newAuth($settings, 'BasicAuth');
    }
    catch (\Exception $e) {
      watchdog_exception('error', $e);
      return NULL;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getList($input = NULL, $auth = NULL) {
    $auth = $this->getApiClient();
    return parent::getList($input, $auth);
  }

}
