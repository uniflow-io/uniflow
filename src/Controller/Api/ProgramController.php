<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Program;
use App\Entity\User\ShopUser as User;
use App\Form\ProgramType;
use App\Repository\ProgramRepository;
use App\Service\FolderService;
use App\Service\ProgramService;
use App\Service\TagService;
use App\Service\UserService;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Uuid;

use function count;
use function in_array;

#[Route('/api/v1/uniflow/program')]
class ProgramController extends AbstractController
{
    public function __construct(
        protected ProgramService $programService,
        protected ProgramRepository $programRepository,
        protected TagService $tagService,
        protected UserService $userService,
        protected FolderService $folderService
    ) {}

    #[Route(path: '/{username}/list', name: 'api_program_list', methods: ['GET'])]
    public function list(Request $request, $username = 'me'): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if ($username === 'me' && !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $fetchUser = null;
        if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
            $fetchUser = $user;
        } else {
            $fetchUser = $this->userService->findOneByUsername($username);
            if (null === $fetchUser) {
                throw new NotFoundHttpException();
            }
        }

        $client = $request->get('client');

        if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
            $programs = $this->programService->findLastByUserAndClient($fetchUser, $client);
        } else {
            $programs = $this->programService->findLastPublicByUserAndClient($fetchUser, $client);
        }

        $data = [];
        foreach ($programs as $program) {
            $d = $this->programService->getJsonProgram($program);

            $data[] = $d;
        }

        return new JsonResponse($data);
    }

    #[Route(path: '/public', name: 'api_program_last_public', methods: ['GET'])]
    public function lastPublic(): JsonResponse // to deprecate => use api_program_list
    {
        $programs = $this->programService->findLastPublic(15);

        return new JsonResponse([
            'data' => array_map(fn (Program $program) => [
                $this->programService->getJsonProgram($program),
            ], $programs),
            'total' => count($programs),
        ]);
    }

    /**
     * #[Route(path: '/{username}/tree/{slug1}/{slug2}/{slug3}/{slug4}/{slug5}', name: 'api_program_tree', methods: ['GET'])]
     * public function tree(Request $request, $username = 'me', $slug1 = null, $slug2 = null, $slug3 = null, $slug4 = null, $slug5 = null): JsonResponse
     * {
     * // @var User $user
     * $user = $this->getUser();
     * if ($username === 'me' && !$user instanceof UserInterface) {
     * throw new AccessDeniedException('This user does not have access to this section.');
     * }.
     *
     * $fetchUser = null;
     * if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
     * $fetchUser = $user;
     * } else {
     * $fetchUser = $this->userService->findOneByUsername($username);
     * if ($fetchUser === null) {
     * throw new NotFoundHttpException();
     * }
     * }
     *
     * $client = $request->get('client');
     *
     * $path = array_reduce([$slug1, $slug2, $slug3, $slug4, $slug5], static function ($path, $slug) {
     * if ($slug) {
     * $path[] = $slug;
     * }
     *
     * return $path;
     * }, []);
     *
     * $parentFolder = null;
     * if (count($path) > 0) {
     * $program = $this->programService->findOneByUserAndPath($fetchUser, $path);
     * if ($program) {
     * $parentFolder = $program->getFolder();
     * } else {
     * $parentFolder = $this->folderService->findOneByUserAndPath($fetchUser, $path);
     * if (!$parentFolder) {
     * throw new NotFoundHttpException();
     * }
     * }
     * }
     *
     * $folders = [];
     * if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
     * $programs = $this->programService->findLastByUserAndClientAndFolder($fetchUser, $client, $parentFolder);
     * $folders = $this->folderService->findByUserAndParent($fetchUser, $parentFolder);
     * } else {
     * $programs = $this->programService->findLastPublicByUserAndClientAndFolder($fetchUser, $client, $parentFolder);
     * }
     *
     * $children = [];
     * foreach ($programs as $program) {
     * $d = $this->programService->getJsonProgram($program);
     * $d['type'] = 'program';
     *
     * $children[] = $d;
     * }
     *
     * foreach ($folders as $folder) {
     * $d = $this->folderService->getJsonFolder($folder);
     * $d['type'] = 'folder';
     *
     * $children[] = $d;
     * }
     *
     * $data = [
     * 'folder' => $parentFolder ? $this->folderService->getJsonFolder($parentFolder) : null,
     * 'children' => $children,
     * ];
     *
     * return new JsonResponse($data);
     * }
     */
    #[Route(path: '/{uid}', name: 'api_program_get', methods: ['GET'])]
    public function get($uid): JsonResponse
    {
        $user = $this->getUser();

        $entity = $this->programRepository->findOneByUid($user, $uid);

        if (!$entity instanceof Program) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        return new JsonResponse($this->programService->getJsonProgram($entity));
    }

    #[Route(path: '/create', name: 'api_program_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $entity = new Program();
        $entity->setUid(Uuid::v7()->toString());
        $entity->setCreated(new DateTime());
        $entity->setUser($user);

        return $this->manage($request, $entity);
    }

    #[Route(path: '/{uid}', name: 'api_program_update', methods: ['PUT'])]
    public function update(Request $request, $uid): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        $entity = $this->programRepository->findOneByUid($user, $uid);

        if (!$entity instanceof Program) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        return $this->manage($request, $entity);
    }

    #[Route(path: '/{uid}/flows', name: 'api_program_get_flows', methods: ['GET'])]
    public function getFlows($uid): JsonResponse
    {
        $entity = $this->programRepository->findOneByUid(null, $uid);

        if (!$entity instanceof Program) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        // Authentication is required only for non-public programs
        if (!$entity->getPublic()) {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user instanceof UserInterface || $entity->getUser()->getId() !== $user->getId()) {
                throw $this->createAccessDeniedException('You are not allowed to view this section.');
            }
        }

        return new JsonResponse($entity->getData());
    }

    #[Route(path: '/{uid}/flows', name: 'api_program_set_flows', methods: ['PUT'])]
    public function setFlows(Request $request, $uid): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->programRepository->findOneByUid($user, $uid);

        if (!$entity instanceof Program) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        if ('PUT' === $request->getMethod()) {
            $data = $request->toArray();
            $entity->setData($data);

            $this->programService->save($entity);

            return new JsonResponse(true);
        }

        return new JsonResponse(false, Response::HTTP_BAD_REQUEST);
    }

    #[Route(path: '/delete/{id}', name: 'api_program_delete', methods: ['DELETE'])]
    public function delete($id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->programService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        $this->programService->remove($entity);

        return new JsonResponse($this->programService->getJsonProgram($entity));
    }

    private function manage(Request $request, Program $entity): JsonResponse
    {
        $form = $this->createForm(ProgramType::class, $entity, [
            'csrf_protection' => false,
        ]);

        if (in_array($request->getMethod(), ['POST', 'PUT'], true)) {
            $content = $request->getContent();
            if (!empty($content)) {
                $data = json_decode($content, true);
                $form->submit($data);
            } else {
                $form->handleRequest($request);
            }

            if ($form->isValid()) {
                $this->programService->save($entity);
                $this->tagService->clean();

                return new JsonResponse($this->programService->getJsonProgram($entity));
            }
        }

        return new JsonResponse($this->programService->getJsonProgram($entity), Response::HTTP_BAD_REQUEST);
    }
}
