(function ($, Drupal, once) {

  'use strict';

  Drupal.behaviors.mauticBehavior = {
    attach: function () {
      // find the layout pickers:
      once('js-once-p-layoutMautic', '.field--name-field-mautic-layout.field--widget-options-buttons').forEach(function (group) {
        group.classList.add('p-field-layouts-mautic');

        once('js-once-p-layoutMautic-radio', $(group).find('input:radio')).forEach(function (input) {
          const optionLabel = $(input).next('label');
          const layout = $(input).val();

          // wrap the text in a div & put under the radio
          optionLabel.parent().append('<div class="text">' + optionLabel.text() + '</div>');

          // add a class for styling
          const optionClass = layout.replace('_', '-');
          optionLabel.addClass('layout-' + optionClass);
        });
      });
    }
  };
})(jQuery, Drupal, once);
