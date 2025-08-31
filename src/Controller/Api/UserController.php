<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Folder;
use App\Entity\Program;
use App\Entity\User\ShopUser as User;
use App\Form\SettingsType;
use App\Service\ConfigService;
use App\Service\FolderService;
use App\Service\ProgramService;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/v1/uniflow/user')]
class UserController extends AbstractController
{
    public function __construct(
        protected UserService $userService,
        protected ConfigService $configService,
        protected FolderService $folderService,
        protected ProgramService $programService,
        protected EntityManagerInterface $entityManager,
        protected ValidatorInterface $validator
    ) {}

    #[Route(path: '', name: 'api_user_create', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent(), true);

        if (!isset($content['email']) || !isset($content['password'])) {
            return new JsonResponse([
                'message' => 'Email and password are required',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $user = $this->userService->create([
                'email' => $content['email'],
                'plainPassword' => $content['password'],
            ]);

            return new JsonResponse(
                $this->userService->getJsonSettings($user),
                Response::HTTP_CREATED
            );
        } catch (Exception $exception) {
            return new JsonResponse([
                'message' => $exception->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    #[Route(path: '/{uid}/settings', name: 'api_user_get_settings', methods: ['GET'])]
    public function getSettings(string $uid): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        return new JsonResponse($this->userService->getJsonSettings($user));
    }

    #[Route(path: '/{uid}/settings', name: 'api_user_set_settings', methods: ['PUT'])]
    public function setSettings(Request $request, string $uid): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $form = $this->createForm(SettingsType::class, $user, [
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
            $this->userService->save($user);

            return new JsonResponse($this->userService->getJsonSettings($user));
        }

        return new JsonResponse([
            'message' => $form->getErrors(true)->current()->getMessage(),
        ], Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/{uid}/admin-config', name: 'api_user_get_admin_config', methods: ['GET'])]
    public function getAdminConfig(string $uid): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface || !$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $config = $this->configService->getConfig();

        return new JsonResponse($this->configService->getJsonConfig($config));
    }

    #[Route(path: '/{uid}/admin-config', name: 'api_user_set_admin_config', methods: ['PUT'])]
    public function setAdminConfig(Request $request, string $uid): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface || !$this->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $config = $this->configService->getConfig();
        $content = json_decode($request->getContent(), true);

        if ($this->configService->updateConfig($config, $content)) {
            return new JsonResponse($this->configService->getJsonConfig($config));
        }

        return new JsonResponse(['message' => 'Invalid configuration'], Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/{uid}/folders', name: 'api_user_get_folders', methods: ['GET'])]
    public function getFolders(Request $request, string $uid): JsonResponse
    {
        $page = (int) $request->query->get('page', 1);
        $perPage = (int) $request->query->get('perPage', 10);
        $path = $request->query->get('path');

        $folders = $this->folderService->getUserFolders($uid, $page, $perPage, $path);
        $total = $this->folderService->countUserFolders($uid, $path);

        return new JsonResponse([
            'data' => array_map(fn ($folder) => $this->folderService->getJsonFolder($folder), $folders),
            'total' => $total,
        ]);
    }

    #[Route(path: '/{uid}/folders', name: 'api_user_create_folder', methods: ['POST'])]
    public function createFolder(Request $request, string $uid): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $content = json_decode($request->getContent(), true);
        $folder = $this->folderService->createFolder($user, $content);

        if ($folder instanceof Folder) {
            return new JsonResponse(
                $this->folderService->getJsonFolder($folder),
                Response::HTTP_CREATED
            );
        }

        return new JsonResponse(['message' => 'Invalid folder data'], Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/{uid}/programs', name: 'api_user_get_programs', methods: ['GET'])]
    public function getPrograms(Request $request, string $uid): JsonResponse
    {
        $page = (int) $request->query->get('page', 1);
        $perPage = (int) $request->query->get('perPage', 10);
        $path = $request->query->get('path');

        $programs = $this->programService->getUserPrograms($uid, $page, $perPage, $path);
        $total = $this->programService->countUserPrograms($uid, $path);

        return new JsonResponse([
            'data' => array_map(fn ($program) => $this->programService->getJsonProgram($program), $programs),
            'total' => $total,
        ]);
    }

    #[Route(path: '/{uid}/programs', name: 'api_user_create_program', methods: ['POST'])]
    public function createProgram(Request $request, string $uid): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $content = json_decode($request->getContent(), true);
        $program = $this->programService->createProgram($user, $content);

        if ($program instanceof Program) {
            return new JsonResponse(
                $this->programService->getJsonProgram($program),
                Response::HTTP_CREATED
            );
        }

        return new JsonResponse(['message' => 'Invalid program data'], Response::HTTP_BAD_REQUEST);
    }
}
