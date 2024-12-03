<?php

namespace Drupal\mautic_paragraph;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Routing\UrlGeneratorInterface;
use Drupal\Core\State\StateInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginManager;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Mautic Integration service.
 */
class MauticParagraphApi implements MauticParagraphApiInterface {

  use StringTranslationTrait;

  /**
   * The MauticParagraph config.
   *
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $mauticParagraphConfig;

  /**
   * Drupal state.
   *
   * @var \Drupal\Core\State\StateInterface
   */
  protected $state;

  /**
   * The URL generator.
   *
   * @var \Drupal\Core\Routing\UrlGeneratorInterface
   */
  protected $urlGenerator;

  /**
   * The current request object.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $request;

  /**
   * The messenger to send info or warnings to Drupal with.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * Mautic Connector Plugin Manager.
   *
   * @var \Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginManager
   */
  protected $mauticparagraphConnectorPluginManager;

  /**
   * The cache.default cache backend.
   *
   * @var \Drupal\Core\Cache\CacheBackendInterface
   */
  protected $cacheBackend;

  /**
   * Constructs a MauticParagraphApi class.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory.
   * @param \Drupal\Core\State\StateInterface $state
   *   The state.
   * @param \Drupal\Core\Routing\UrlGeneratorInterface $url_generator
   *   The URL Generator service.
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   The request stack.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger to send info or warnings to Drupal with.
   * @param \Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginManager $mautic_paragraph_connector_plugin_manager
   *   The Unomi Connector Plugin Manager.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   The cache object associated with the default bin.
   */
  public function __construct(ConfigFactoryInterface $config_factory,
                              StateInterface $state,
                              UrlGeneratorInterface $url_generator,
                              RequestStack $request_stack,
                              MessengerInterface $messenger,
                              MauticParagraphConnectorPluginManager $mautic_paragraph_connector_plugin_manager,
                              CacheBackendInterface $cache_backend) {
    $this->mauticParagraphConfig = $config_factory->get('mautic_paragraph.settings');
    $this->state = $state;
    $this->urlGenerator = $url_generator;
    $this->request = $request_stack->getCurrentRequest();
    $this->messenger = $messenger;
    $this->mauticparagraphConnectorPluginManager = $mautic_paragraph_connector_plugin_manager;
    $this->cacheBackend = $cache_backend;
  }

  /**
   * {@inheritdoc}
   */
  public function getApiClient() {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {

      // Ask the plugin to give us the MauticParagraphconnector.
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance($this->mauticParagraphConfig->get('connector'), $this->mauticParagraphConfig->get('connector_config'));
      return $connector->getApiClient();
    }
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getStatus() {

    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {

      // Ask the plugin to give us the MauticParagraphconnector.
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance($this->mauticParagraphConfig->get('connector'), $this->mauticParagraphConfig->get('connector_config'));
      return $connector->getStatus();
    }
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormTitle($id) {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {

      // Ask the plugin to give us the MauticParagraphconnector.
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance($this->mauticParagraphConfig->get('connector'), $this->mauticParagraphConfig->get('connector_config'));
      return $connector->getFormTitle($id);
    }
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getList($input = NULL, $auth = NULL) {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {

      // Ask the plugin to give us the MauticParagraphclient.
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance($this->mauticParagraphConfig->get('connector'), $this->mauticParagraphConfig->get('connector_config'));
      return $connector->getList($input, $auth);
    }
    return NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getServerUri() {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {

      // Ask the plugin to give us the MauticParagraphclient.
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance($this->mauticParagraphConfig->get('connector'), $this->mauticParagraphConfig->get('connector_config'));
      return $connector->getServerUri();
    }
    return NULL;
  }
  public function getPublicUri() {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance(
        $this->mauticParagraphConfig->get('connector'), 
        $this->mauticParagraphConfig->get('connector_config')
      );
      return $connector->getPublicUri();
    }
    return NULL;
  }
  public function getMauticFormScriptUrl($formId) {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance(
        $this->mauticParagraphConfig->get('connector'), 
        $this->mauticParagraphConfig->get('connector_config')
      );
      return $connector->getMauticFormScriptUrl($formId);
    }
    return NULL;
  }
  public function getMauticFormEmbedUrl($formId) {
    if ($this->mauticParagraphConfig->get('connector') && $this->mauticParagraphConfig->get('connector_config')) {
      /** @var \Drupal\mautic_paragraph\MauticParagraphConnectorInterface $connector */
      $connector = $this->mauticparagraphConnectorPluginManager->createInstance(
        $this->mauticParagraphConfig->get('connector'), 
        $this->mauticParagraphConfig->get('connector_config')
      );
      return $connector->getMauticFormEmbedUrl($formId);
    }
    return NULL;
  }
}
