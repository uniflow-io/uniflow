<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Form\ConfigType;
use App\Services\ConfigService;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Config;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

class ConfigController extends AbstractController
{
    /**
     * @var ConfigService
     */
    protected $configService;

    public function __construct(
        ConfigService $configService
    ) {
        $this->configService = $configService;
    }

    /**
     * @Route("/api/config/getConfig", name="api_config_get", methods={"GET"})
     *
     * @param Request $request
     * @return object|JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getConfig(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This config does not have access to this section.');
        }

        $config = $this->configService->findOne();
        if (!$config) {
            $config = new Config();
        }

        return new JsonResponse($this->configService->getJson($config));
    }

    /**
     * @Route("/api/config/setConfig", name="api_config_set", methods={"PUT"})
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function setConfig(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This config does not have access to this section.');
        }

        $config = $this->configService->findOne();
        if (!$config) {
            $config = new Config();
        }

        $form = $this->createForm(ConfigType::class, $config, array(
            'csrf_protection' => false,
        ));

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

        return new JsonResponse(array(
            'message' => $form->getErrors(true)->current()->getMessage(),
        ), 400);
    }
}
