<?php

namespace Drupal\MauticAPI\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;


class MauticAPIController extends ControllerBase {
    use StringTranslationTrait;
      /**
     * The HTTP client service.
     *
     * @var \Drupal\Core\Http\ClientInterface
     */
    protected $httpClient;

    public function __construct(ClientInterface $http_client) {
        $this->httpClient = $http_client;
      }
    
        /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('http_client')
    );
  }
  
    public function fetch() {
        $username = $_ENV['API_USER'];
        $api_key = $_ENV['API_KEY'];  
        $mautic_url = 'http://appserver.mauticapp.internal';
    
        // Encoding basic authentication header
        $auth = base64_encode($username . ':' . $api_key);
    
        try {
          $response = $this->httpClient->get($mautic_url . '/api/segments', [
            'headers' => [
              'Authorization' => 'Basic ' . $auth,
            ],
            'verify' => FALSE,
          ]);
    
    
          $data = json_decode($response->getBody()->getContents(), TRUE);
    
          if (isset($data['lists'])) {
            $segments = $data['lists'];
            \Drupal::state()->set('MauticAPI.mautic_segments', $segments);
            return [
              '#theme' => 'item_list',
              '#items' => array_map(function ($segment) {
                return $segment['name'];
              }, $data['lists']),
              '#title' => $this->t('Mautic Segments'),
            ];
          }
          else {
            return [
              '#markup' => $this->t('No segments found in Mautic.'),
            ];
          }
        }
        catch (\Exception $e) {
          \Drupal::logger('mautic_api')->error('Error fetching segments from Mautic: @error', ['@error' => $e->getMessage()]);
          return [
            '#markup' => $this->t('An error occurred while fetching segments from Mautic.'),
          ];
        }
        }
    }
    