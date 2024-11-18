<?php

namespace Drupal\MauticAPI\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\field\Plugin\Field;
use Drupal\Core\Annotation\FieldWidget;
use Drupal\MauticAPI\MauticAPI;

/**
 * Plugin implementation of the 'mautic_segment_dropdown' widget.
 *
 * @FieldWidget(
 *   id = "mautic_segment_dropdown",
 *   label = @Translation("Mautic Segment Dropdown"),
 *   field_types = {
 *     "list_string"
 *   }
 * )
 */
class MauticSegmentDropdown extends ListWidget {
 
  public static function defaultSettings() {
    return parent::defaultSettings();
  }

  
  public function formElement(FieldItemListInterface $items, $delta, array $element, array $values, FormStateInterface $form_state) {
    // Fetch the Mautic segments
    $segments = \Drupal::service('MauticAPI.mautic_service')->fetchMauticSegments();

    // Populate the dropdown options
    $element['#options'] = $segments;

    // Set the default value
    $element['#default_value'] = isset($items[$delta]->value) ? $items[$delta]->value : NULL;

    return parent::formElement($items, $delta, $element, $values, $form_state);
  }
}

