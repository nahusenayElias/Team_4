<?php

namespace Drupal\mautic_paragraph\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\mautic_paragraph\MauticParagraphApi;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Component\Utility\Xss;

/**
 * Defines a route controller for watches autocomplete form elements.
 */
class FormAutocompleteController extends ControllerBase {

  /**
   * The MauticParagraphApi service.
   *
   * @var \Drupal\mautic_paragraph\MauticParagraphApi
   */
  protected $mauticParagraphApi;

  /**
   * Construct FormAutoCompleteController class.
   *
   * @param \Drupal\mautic_paragraph\MauticParagraphApi $mauticParagraphApi
   *   The MauticParagraph service.
   */
  public function __construct(MauticParagraphApi $mauticParagraphApi) {
    $this->mauticParagraphApi = $mauticParagraphApi;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    // Instantiates this form class.
    return new static(
      $container->get('mautic_paragraph_api')
    );
  }

  /**
   * Handler for autocomplete request.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   HTTP request.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   Return formlist as Json.
   */
  public function handleAutocomplete(Request $request) {
    $results = [];
    $input = $request->query->get('q');

    // Get the typed string from the URL, if it exists.
    if (!$input) {
      return new JsonResponse($results);
    }

    $input = Xss::filter($input);
    $list = $this->mauticParagraphApi->getList($input);

    foreach ($list as $item) {
      $results[] = [
        'label' => $item['name'],
        'value' => $item['name'] . ' (' . $item['id'] . ')',
      ];
    }
    return new JsonResponse($results);
  }

}
