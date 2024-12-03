(function ($, Drupal, window, document) {

  "use strict";

  Drupal.behaviors.mauticSettingBehavior = {
    attach: function (context, settings) {

      $('#edit-connector-config-base-url,#edit-connector-config-port,#edit-connector-config-path,#edit-connector-config-scheme').on('input', function () {
        const portValue = $('#edit-connector-config-port').val();
        const padValue = $('#edit-connector-config-path').val();
        const protocolValue = $('#edit-connector-config-scheme').find(":selected").text();
        const baseurlValue = $('#edit-connector-config-base-url').val();

        const port = portValue.length !== 0 ? ':' + portValue : '';
        const pad = padValue.length !== 0 ? padValue : '';
        const baseurl = baseurlValue.length !== 0 ? baseurlValue : '';
        const protocol = protocolValue.length !== 0 ? protocolValue + '://' : '';

        var urlName = baseurl + port + pad + '/s/credentials/new';
        var url = protocol + urlName;
        $('#baseurlmautic').attr("href", url).html(urlName);
      });
    }
  };
})(jQuery, Drupal, window, document);
