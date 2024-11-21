<?php

namespace Drupal\mautic_proxy\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\mautic_proxy\Service\MauticService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class MauticController extends ControllerBase
{
    protected $mauticService;

    public function __construct(MauticService $mauticService)
    {
        $this->mauticService = $mauticService;
    }

    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('mautic_proxy.mautic_service')
        );
    }

    public function getContactSegments($contactId)
    {
        try {
            $contactSegments = $this->mauticService->fetchContactSegments($contactId);
            return new JsonResponse([
                'contact_id' => $contactId,
                'segments' => $contactSegments['lists'] ?? [],
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
