<?php

namespace Drupal\mautic_proxy\Service;

use GuzzleHttp\Client;

class MauticService
{
    protected $httpClient;

    public function __construct(Client $http_client)
    {
        $this->httpClient = $http_client;
    }

    public function fetchContactSegments($contactId)
    {
        $username = $_ENV['API_USER']; // Securely fetch credentials
        $password = $_ENV['API_KEY'];
        $mautic_url = 'http://appserver.mauticapp.internal';

        if (!$username || !$password || !$mautic_url) {
            throw new \Exception('Mautic credentials or base URL are missing in the environment variables.');
        }

        $auth = base64_encode("$username:$password");

        $response = $this->httpClient->request('GET', "$mautic_url/api/contacts/$contactId/segments", [
            'headers' => [
                'Authorization' => 'Basic ' . $auth,
                'Accept' => 'application/json',
            ],
        ]);
        $data = json_decode($response->getBody()->getContents(), true);

        if (isset($data['lists'])) {
            return $data;
        }

        throw new \Exception('No segments found for this contact.');

    }
}
