<?php

namespace Drupal\mautic_paragraph;

/**
 * Interface for Mautic service.
 */
interface MauticParagraphApiInterface {

  /**
   * Get a Mautic API client.
   *
   * @return \Mautic\Auth\AbstractAuth|null
   *   The Mautic API client object.
   */
  public function getApiClient();

  /**
   * Check connection.
   *
   * @return bool
   *   Connection established.
   */
  public function getStatus();

  /**
   * Provides a list of forms.
   *
   * @param string $input
   *   Search string for fetching forms.
   * @param \Mautic\Auth\AbstractAuth|null $auth
   *   Auth object.
   *
   * @return array
   *   List of forms from Mautic.
   */
  public function getList($input = NULL, $auth = NULL);

  /**
   * Fetches the form title from an id.
   *
   * @param int $id
   *   The form id.
   *
   * @return string
   *   Name of the form.
   */
  public function getFormTitle($id);

  /**
   * Returns the Mautic server URI.
   *
   * @return string
   *   The validated URL to Mautic
   */
  public function getServerUri();

}
