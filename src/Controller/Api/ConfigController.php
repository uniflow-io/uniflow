<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Config;
use App\Entity\User\ShopUser as User;
use App\Form\ConfigType;
use App\Service\ConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;

#[Route('/api/v1/uniflow/config')]
class ConfigController extends AbstractController
{
    public function __construct(protected ConfigService $configService) {}

    #[Route(path: '/getConfig', name: 'api_config_get', methods: ['GET'])]
    public function getConfig(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This config does not have access to this section.');
        }

        $config = $this->configService->findOne();
        if (!$config instanceof Config) {
            $config = new Config();
        }

        return new JsonResponse($this->configService->getJson($config));
    }

    #[Route(path: '/setConfig', name: 'api_config_set', methods: ['PUT'])]
    public function setConfig(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This config does not have access to this section.');
        }

        $config = $this->configService->findOne();
        if (!$config instanceof Config) {
            $config = new Config();
            $config->setUid(Uuid::v7()->toString());
        }

        $form = $this->createForm(ConfigType::class, $config, [
            'csrf_protection' => false,
        ]);

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $form->submit($data);
        } else {
            $form->handleRequest($request);
        }

        if ($form->isValid()) {
            $this->configService->save($config);

            return new JsonResponse($this->configService->getJson($config));
        }

        return new JsonResponse([
            'message' => $form->getErrors(true)->current()->getMessage(),
        ], Response::HTTP_BAD_REQUEST);
    }
}
