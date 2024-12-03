<?php

namespace Drupal\mautic_paragraph\Plugin\Field\FieldWidget;

use Drupal\Core\Entity\Element\EntityAutocomplete;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\mautic_paragraph\MauticParagraphApi;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation of the 'autocomplete_mautic' widget.
 *
 * @FieldWidget(
 *   id = "autocomplete_mautic",
 *   label = @Translation("Autocomplete mautic forms list"),
 *   field_types = {
 *     "list_integer"
 *   }
 * )
 */
class AutocompleteWidget extends WidgetBase implements ContainerFactoryPluginInterface {

  /**
   * The Mautic Api.
   *
   * @var \Drupal\mautic_paragraph\MauticParagraphApi
   */
  protected $mauticParagraphApi;

  /**
   * Constructs a WidgetBase object.
   *
   * @param string $plugin_id
   *   The plugin_id for the widget.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Field\FieldDefinitionInterface $field_definition
   *   The definition of the field to which the widget is associated.
   * @param array $settings
   *   The widget settings.
   * @param array $third_party_settings
   *   Any third party settings.
   * @param \Drupal\mautic_paragraph\MauticParagraphApi $mauticParagraphApi
   *   The Mautic Api.
   */
  public function __construct($plugin_id,
                              $plugin_definition,
                              FieldDefinitionInterface $field_definition,
                              array $settings,
                              array $third_party_settings,
                              MauticParagraphApi $mauticParagraphApi) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $third_party_settings);
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
      $configuration['third_party_settings'],
      $container->get('mautic_paragraph_api')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = $items[$delta]->value ?? '';
    $title = '';

    if ($value !== '') {
      $title = $this->mauticParagraphApi->getFormTitle($value);
    }

    $element += [
      '#type' => 'textfield',
      '#default_value' => $value === '' ? '' : $title . ' (' . $value . ')',
      '#autocomplete_route_name' => 'mautic_paragraph.autocomplete.forms',
    ];
    return ['value' => $element];
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    $old_value = $values[0]['value'];
    $values[0]['value'] = EntityAutocomplete::extractEntityIdFromAutocompleteInput($old_value);
    return parent::massageFormValues($values, $form, $form_state);
  }

}
