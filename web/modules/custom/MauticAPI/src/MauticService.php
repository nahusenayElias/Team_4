<?php

namespace Drupal\mymodule;

use GuzzleHttp\ClientInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MauticService {

  protected $httpClient;

  public function __construct(ClientInterface $http_client) {
    $this->httpClient = $http_client;
  }

  public function fetchMauticSegments() {
    $segments = [];
    $username = $_ENV['API_USER'];
    $api_key = $_ENV['API_KEY'];  
    $mautic_url = 'http://appserver.mauticapp.internal';
    $auth = base64_encode($username . ':' . $api_key);

    try {
      $response = $this->httpClient->request('GET', $mautic_url . '/api/segments', [
        'headers' => [
          'Authorization' => 'Basic ' . $auth,
        ],
        'verify' => FALSE,
      ]);


      $data = json_decode($response->getBody()->getContents(), TRUE);

      foreach ($data['lists'] as $segment) {
        $segments[$segment['id']] = $segment['name'];
      }
    }
    catch (\Exception $e) {
      \Drupal::logger('MauticAPI')->error($e->getMessage());
    }

    return $segments;
  }
}
