<?php

namespace App\Controller\Api;

use App\Services\UserService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\FolderType;
use App\Entity\Folder;
use App\Services\FolderService;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

class FolderController extends AbstractController
{
    /**
     * @var FolderService
     */
    protected $folderService;

    /**
     * @var UserService
     */
    protected $userService;

    public function __construct(
        FolderService $folderService,
        UserService $userService
    ) {
        $this->folderService = $folderService;
        $this->userService = $userService;
    }

    /**
     * @Route("/api/folder/{username}/tree", name="api_folder_tree", methods={"GET"})
     *
     * @param string $username
     * @return JsonResponse
     */
    public function tree($username = 'me')
    {
        $user = $this->getUser();
        if ($username === 'me' && !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        } else if ($username !== 'me') {
            $user = $this->userService->findOneByUsername($username);
            if (is_null($user)) {
                throw new NotFoundHttpException();
            }
        }

        $data = [[]];
        $folders = $this->folderService->findByUser($user);
        foreach ($folders as $folder) {
            $data[] = $this->folderService->toPath($folder);
        }
        usort($data, function($path1, $path2) {
            return strcmp(implode('/', $path1), implode('/', $path2));
        });

        return new JsonResponse($data);
    }

    /**
     * @param Request $request
     * @param Folder $entity
     * @return JsonResponse
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    private function manage(Request $request, Folder $entity)
    {
        $form = $this->createForm(FolderType::class, $entity, array(
            'csrf_protection' => false,
        ));

        if (in_array($request->getMethod(), array('POST', 'PUT'))) {
            $content = $request->getContent();
            if (!empty($content)) {
                $data = json_decode($content, true);
                $form->submit($data);
            } else {
                $form->handleRequest($request);
            }

            if ($form->isValid()) {
                $this->folderService->save($entity);

                return new JsonResponse($this->folderService->getJsonFolder($entity));
            }
        }

        return new JsonResponse($this->folderService->getJsonFolder($entity), 400);
    }

    /**
     * @Route("/api/folder/create", name="api_folder_create", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     * @throws \Exception
     */
    public function create(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = new Folder();
        $entity->setCreated(new \DateTime());
        $entity->setUser($user);

        return $this->manage($request, $entity);
    }

    /**
     * @Route("/api/folder/update/{id}", name="api_folder_update", methods={"PUT"})
     *
     * @param Request $request
     * @param $id
     * @return Response
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function update(Request $request, $id)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->folderService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Folder entity.');
        }

        return $this->manage($request, $entity);
    }

    /**
     * @Route("/api/folder/delete/{id}", name="api_folder_delete", methods={"DELETE"})
     *
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function delete($id)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->folderService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Folder entity.');
        }

        $this->folderService->remove($entity);

        return new JsonResponse($this->folderService->getJsonFolder($entity));
    }
}