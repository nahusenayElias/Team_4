<?php

namespace Drupal\mautic_paragraph\MauticParagraphConnector;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * A plugin manager for Mautic connector plugins.
 *
 * @see \Drupal\mautic_paragraph\Annotation\MauticParagraphConnector
 * @see \Drupal\mautic_paragraph\MauticParagraphConnectorInterface
 * @see \Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginBase
 *
 * @ingroup plugin_api
 */
class MauticParagraphConnectorPluginManager extends DefaultPluginManager {

  /**
   * Constructs a MauticParagraphConnectorManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    $this->alterInfo('mautic_paragraph_connector_info');
    $this->setCacheBackend($cache_backend, 'mautic_paragraph_connector_plugins');

    parent::__construct('Plugin/MauticParagraphConnector', $namespaces, $module_handler, 'Drupal\mautic_paragraph\MauticParagraphConnectorInterface', 'Drupal\mautic_paragraph\Annotation\MauticParagraphConnector');
  }

}
