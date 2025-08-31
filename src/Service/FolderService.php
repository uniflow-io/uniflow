<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Folder;
use App\Entity\User\ShopUser as User;
use App\Repository\FolderRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Exception;
use Symfony\Component\Uid\Uuid;

class FolderService
{
    /**
     * @var FolderRepository
     */
    protected EntityRepository $folderRepository;

    public function __construct(
        protected EntityManagerInterface $em
    ) {
        $this->folderRepository = $this->em->getRepository(Folder::class);
    }

    public function save(Folder $folder): Folder
    {
        $folder->setUpdated(new DateTime());

        $this->em->persist($folder);
        $this->em->flush();

        return $folder;
    }

    public function remove(Folder $folder): void
    {
        $this->em->remove($folder);
        $this->em->flush();
    }

    public function findOne(?int $id = null): ?Folder
    {
        return $this->folderRepository->findOne($id);
    }

    public function findOneByUser(User $user, ?int $id = null): ?Folder
    {
        return $this->folderRepository->findOneByUser($user, $id);
    }

    public function findOneByUserAndPath(User $user, array $path): ?Folder
    {
        return $this->folderRepository->findOneByUserAndPath($user, $path);
    }

    /**
     * @return Folder[]
     */
    public function findByUser(User $user): array
    {
        return $this->folderRepository->findByUser($user);
    }

    /**
     * @return Folder[]
     */
    public function findByUserAndParent(User $user, ?Folder $folder): array
    {
        return $this->folderRepository->findByUserAndParent($user, $folder);
    }

    public function getUserFolders(string $uid, int $page, int $perPage, ?string $path = null): array
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['uid' => $uid]);
        if ($user === null) {
            return [];
        }

        $parent = null;
        if ($path) {
            $parent = $this->findOneByUserAndPath($user, explode('/', trim($path, '/')));
        }

        $offset = ($page - 1) * $perPage;

        return $this->folderRepository->findBy(
            ['user' => $user, 'parent' => $parent],
            ['created' => 'DESC'],
            $perPage,
            $offset
        );
    }

    public function countUserFolders(string $uid, ?string $path = null): int
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['uid' => $uid]);
        if ($user === null) {
            return 0;
        }

        $parent = null;
        if ($path) {
            $parent = $this->findOneByUserAndPath($user, explode('/', trim($path, '/')));
        }

        return $this->folderRepository->count(['user' => $user, 'parent' => $parent]);
    }

    public function createFolder(User $user, array $data): ?Folder
    {
        $folder = new Folder();
        $folder->setUid(Uuid::v7()->toString());
        $folder->setUser($user);
        $folder->setName($data['name']);

        if (isset($data['path'])) {
            $parent = $this->findOneByUserAndPath($user, explode('/', trim((string) $data['path'], '/')));
            $folder->setParent($parent);
        }

        if (isset($data['slug'])) {
            $folder->setSlug($data['slug']);
        } else {
            $folder->setSlug($data['name']);
        }

        $folder->setCreated(new DateTime());
        $folder->setUpdated(new DateTime());

        try {
            $this->save($folder);

            return $folder;
        } catch (Exception) {
            return null;
        }
    }

    public function toPath(?Folder $folder = null): string
    {
        $paths = [];

        while ($folder instanceof Folder) {
            array_unshift($paths, $folder->getSlug());

            $folder = $folder->getParent();
        }

        return '/' . implode('/', $paths);
    }

    public function toUser(Folder $folder): string
    {
        return $folder->getUser()->getUsername() ?? $folder->getUser()->getUid();
    }

    public function getJsonFolder(Folder $folder): array
    {
        return [
            'id' => $folder->getId(),
            'name' => $folder->getName(),
            'slug' => $folder->getSlug(),
            'path' => $this->toPath($folder->getParent()),
            'user' => $this->toUser($folder),
            'created' => $folder->getCreated()->format('c'),
            'updated' => $folder->getUpdated()->format('c'),
        ];
    }
}
