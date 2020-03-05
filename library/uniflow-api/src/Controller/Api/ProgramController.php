<?php

namespace App\Controller\Api;

use App\Services\FolderService;
use App\Services\UserService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\ProgramType;
use App\Entity\Program;
use App\Services\ProgramService;
use App\Services\TagService;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class ProgramController extends AbstractController
{
    /**
     * @var ProgramService
     */
    protected $programService;

    /**
     * @var TagService
     */
    protected $tagService;

    /**
     * @var UserService
     */
    protected $userService;

    /**
     * @var FolderService
     */
    protected $folderService;

    public function __construct(
        ProgramService $programService,
        TagService $tagService,
        UserService $userService,
        FolderService $folderService
    ) {
        $this->programService = $programService;
        $this->tagService = $tagService;
        $this->userService = $userService;
        $this->folderService = $folderService;
    }

    /**
     * @Route("/api/program/{username}/list", name="api_program_list", methods={"GET"})
     */
    public function listAction(Request $request, $username = 'me')
    {
        $user = $this->getUser();
        if ($username === 'me' && !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $fetchUser = null;
        if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
            $fetchUser = $user;
        } else {
            $fetchUser = $this->userService->findOneByUsername($username);
            if (is_null($fetchUser)) {
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

    /**
     * @Route("/api/program/{username}/tree/{slug1}/{slug2}/{slug3}/{slug4}/{slug5}", name="api_program_tree", methods={"GET"})
     */
    public function treeAction(Request $request, $username = 'me', $slug1 = null, $slug2 = null, $slug3 = null, $slug4 = null, $slug5 = null)
    {
        $user = $this->getUser();
        if ($username === 'me' && !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $fetchUser = null;
        if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
            $fetchUser = $user;
        } else {
            $fetchUser = $this->userService->findOneByUsername($username);
            if ($fetchUser === null) {
                throw new NotFoundHttpException();
            }
        }

        $client = $request->get('client');

        $path = array_reduce([$slug1, $slug2, $slug3, $slug4, $slug5], function ($path, $slug) {
            if ($slug) {
                $path[] = $slug;
            }
            return $path;
        }, []);

        $parentFolder = null;
        if (count($path) > 0) {
            $program = $this->programService->findOneByUserAndPath($fetchUser, $path);
            if ($program) {
                $parentFolder = $program->getFolder();
            } else {
                $parentFolder = $this->folderService->findOneByUserAndPath($fetchUser, $path);
                if (!$parentFolder) {
                    throw new NotFoundHttpException();
                }
            }
        }

        $folders = [];
        if ($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
            $programs = $this->programService->findLastByUserAndClientAndFolder($fetchUser, $client, $parentFolder);
            $folders = $this->folderService->findByUserAndParent($fetchUser, $parentFolder);
        } else {
            $programs = $this->programService->findLastPublicByUserAndClientAndFolder($fetchUser, $client, $parentFolder);
        }

        $children = [];
        foreach ($programs as $program) {
            $d = $this->programService->getJsonProgram($program);
            $d['type'] = 'program';

            $children[] = $d;
        }
        foreach ($folders as $folder) {
            $d = $this->folderService->getJsonFolder($folder);
            $d['type'] = 'folder';

            $children[] = $d;
        }

        $data = [
            'folder' => $parentFolder ? $this->folderService->getJsonFolder($parentFolder) : null,
            'children' => $children,
        ];
        return new JsonResponse($data);
    }

    private function manage(Request $request, Program $entity): JsonResponse
    {
        $form = $this->createForm(ProgramType::class, $entity, [
            'csrf_protection' => false,
        ]);

        if (in_array($request->getMethod(), ['POST', 'PUT'])) {
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

    /**
     * @Route("/api/program/create", name="api_program_create", methods={"POST"})
     */
    public function create(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = new Program();
        $entity->setCreated(new \DateTime());
        $entity->setUser($user);

        return $this->manage($request, $entity);
    }

    /**
     * @Route("/api/program/update/{id}", name="api_program_update", methods={"PUT"})
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->programService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        return $this->manage($request, $entity);
    }

    /**
     * @Route("/api/program/getData/{id}", name="api_program_get_data", methods={"GET"})
     */
    public function getData($id): JsonResponse
    {
        $entity = $this->programService->findOne($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        if (!$entity->getPublic()) {
            $user = $this->getUser();
            if (!$user instanceof UserInterface || $entity->getUser()->getId() != $user->getId()) {
                throw $this->createAccessDeniedException('You are not allowed to view this section.');
            }
        }

        return new JsonResponse(['data' => $entity->getData()]);
    }

    /**
     * @Route("/api/program/setData/{id}", name="api_program_set_data", methods={"PUT"})
     */
    public function setData(Request $request, $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->programService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Program entity.');
        }

        if ('PUT' === $request->getMethod()) {
            $content = $request->getContent();

            $entity->setData($content);

            $this->programService->save($entity);

            return new JsonResponse(true);
        }

        return new JsonResponse(false, Response::HTTP_BAD_REQUEST);
    }

    /**
     * @Route("/api/program/delete/{id}", name="api_program_delete", methods={"DELETE"})
     */
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

    /**
     * @Route("/api/program/last-public", name="api_program_last_public", methods={"GET"})
     */
    public function lastPublic(): JsonResponse
    {
        $programs = $this->programService->findLastPublic(15);

        return new JsonResponse([
            'programs' => array_map(function (Program $program) {
                return [
                    'name' => $program->getName(),
                    'slug' => $program->getSlug(),
                    'path' => $this->folderService->toPath($program->getFolder()),
                    'description' => $program->getDescription(),
                    'username' => $program->getUser()->getUsername(),
                ];
            }, $programs),
        ]);
    }
}
