<?php

namespace App\Services;

use App\Entity\Folder;
use App\Repository\FolderRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;

class FolderService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var FolderRepository
     */
    protected $folderRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em = $em;
        $this->folderRepository = $this->em->getRepository(Folder::class);
    }

    public function save(Folder $folder): Folder
    {
        $folder->setUpdated(new \DateTime());

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

    public function toPath(?Folder $folder): array
    {
        $path = [];

        while ($folder) {
            array_unshift($path, $folder->getSlug());

            $folder = $folder->getParent();
        }

        return $path;
    }

    public function getJsonFolder(Folder $folder): array
    {
        return [
            'id' => $folder->getId(),
            'name' => $folder->getName(),
            'slug' => $folder->getSlug(),
            'path' => $this->toPath($folder->getParent()),
            'created' => $folder->getCreated()->format('c'),
            'updated' => $folder->getUpdated()->format('c'),
        ];
    }
}
