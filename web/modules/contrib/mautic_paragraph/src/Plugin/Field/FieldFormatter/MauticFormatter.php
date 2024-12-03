<?php

namespace Drupal\mautic_paragraph\Plugin\Field\FieldFormatter;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\mautic_paragraph\MauticParagraphApiInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * Plugin implementation of the 'mautic_form_list' formatter.
 *
 * @FieldFormatter(
 *   id = "mautic_form_list",
 *   label = @Translation("Mautic Formid list"),
 *   field_types = {
 *     "list_integer"
 *   }
 * )
 */
class MauticFormatter extends FormatterBase implements ContainerFactoryPluginInterface {

  /**
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The config factory service.
   *
   * @var \Drupal\mautic_paragraph\MauticParagraphApiInterface
   */
  protected $mauticParagraphApi;

  /**
   * Constructs a StringFormatter instance.
   *
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the formatter is associated.
   * @param array $settings
   *   The formatter settings.
   * @param string $label
   *   The formatter label display setting.
   * @param string $view_mode
   *   The view mode.
   * @param array $third_party_settings
   *   Any third party settings settings.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   *   Config factory service.
   * @param \Drupal\mautic_paragraph\MauticParagraphApiInterface $mauticParagraphApi
   *   Mautic Paragraph Api service.
   */
  public function __construct($plugin_id,
                              $plugin_definition,
                              FieldDefinitionInterface $field_definition,
                              array $settings,
                              $label,
                              $view_mode,
                              array $third_party_settings,
                              ConfigFactoryInterface $configFactory,
                              MauticParagraphApiInterface $mauticParagraphApi) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $label, $view_mode, $third_party_settings);
    $this->configFactory = $configFactory;
    $this->mauticParagraphApi = $mauticParagraphApi;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $container->get('config.factory'),
      $container->get('mautic_paragraph_api')
    );
  }

  /**
   * Builds a renderable array for a field value.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $items
   *   The field values to be rendered.
   * @param string $langcode
   *   The language that should be used to render the field.
   *
   * @return array
   *   A render array for $items.
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    \Drupal::logger('mautic_paragraph')->notice('API Configuration: @config', [
      '@config' => print_r($this->mauticParagraphApi->getPublicUri(), TRUE)
    ]);

  

    foreach ($items as $delta => $item) {
      $id = $item->value;

      \Drupal::logger('mautic_paragraph')->notice('Connector Methods: Public URI=@uri, Script URL=@script', [
        '@uri' => $this->mauticParagraphApi->getPublicUri(),
        '@script' => $this->mauticParagraphApi->getMauticFormScriptUrl($id)
      ]);


      $elements[$delta] = [
        '#theme' => 'mautic_field_formatter',
        '#connector' => $this->mauticParagraphApi,
        '#form_id' => $id,
        '#cache' => [
          'max-age' => 0,
        ],
      ];
    }
   /*  $elements += [
      '#cache' => [
        'tags' => Cache::mergeTags(['config:mautic_paragraph.settings'], $items->getEntity()->getCacheTags()),
      ],
    ]; */
    return $elements;
  }

}
