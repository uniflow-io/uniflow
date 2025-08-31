<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Folder;
use App\Entity\User\ShopUser as User;
use App\Form\FolderType;
use App\Service\FolderService;
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

use function in_array;

#[Route('/api/v1/uniflow/folder')]
class FolderController extends AbstractController
{
    public function __construct(protected FolderService $folderService, protected UserService $userService) {}

    /**
     * @param string $username
     */
    #[Route(path: '/{username}/tree', name: 'api_folder_tree', methods: ['GET'])]
    public function tree($username = 'me'): JsonResponse
    {
        $user = $this->getUser();
        if ($username === 'me' && !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ($username !== 'me') {
            $user = $this->userService->findOneByUsername($username);
            if ($user === null) {
                throw new NotFoundHttpException();
            }
        }

        $data = [[]];
        $folders = $this->folderService->findByUser($user);
        foreach ($folders as $folder) {
            $data[] = $this->folderService->toPath($folder);
        }

        usort($data, static fn ($path1, $path2) => strcmp(implode('/', $path1), implode('/', $path2)));

        return new JsonResponse($data);
    }

    #[Route(path: '/create', name: 'api_folder_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = new Folder();
        $entity->setUid(Uuid::v7()->toString());
        $entity->setCreated(new DateTime());
        $entity->setUser($user);

        return $this->manage($request, $entity);
    }

    #[Route(path: '/update/{id}', name: 'api_folder_update', methods: ['PUT'])]
    public function update(Request $request, $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->folderService->findOneByUser($user, $id);

        if (!$entity instanceof Folder) {
            throw $this->createNotFoundException('Unable to find Folder entity.');
        }

        return $this->manage($request, $entity);
    }

    #[Route(path: '/delete/{id}', name: 'api_folder_delete', methods: ['DELETE'])]
    public function delete($id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->folderService->findOneByUser($user, $id);

        if (!$entity instanceof Folder) {
            throw $this->createNotFoundException('Unable to find Folder entity.');
        }

        $this->folderService->remove($entity);

        return new JsonResponse($this->folderService->getJsonFolder($entity));
    }

    private function manage(Request $request, Folder $entity): JsonResponse
    {
        $form = $this->createForm(FolderType::class, $entity, [
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
                $this->folderService->save($entity);

                return new JsonResponse($this->folderService->getJsonFolder($entity));
            }
        }

        return new JsonResponse('folder not created', Response::HTTP_BAD_REQUEST);
    }
}
