<?php

namespace Drupal\mautic_paragraph\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a connector plugin annotation object.
 *
 * Condition plugins provide generalized conditions for use in other
 * operations, such as conditional block placement.
 *
 * Plugin Namespace: Plugin\MauticParagraphConnector
 *
 * @see \Drupal\mautic_paragraph\Plugin\MauticParagraphConnector\MauticParagraphConnectorPluginManager
 * @see \Drupal\mautic_paragraph\MauticParagraphConnectorInterface
 * @see \Drupal\mautic_paragraph\MauticParagraphConnector\MauticParagraphConnectorPluginBase
 *
 * @ingroup plugin_api
 *
 * @Annotation
 */
class MauticParagraphConnector extends Plugin {

  /**
   * The MauticParagraph connector plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The human-readable name of the Mautic connector.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $label;

  /**
   * The backend description.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $description;

}
