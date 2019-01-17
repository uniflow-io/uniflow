<?php

namespace App\Services;

use App\Entity\Folder;
use App\Repository\FolderRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;

/**
 * Class FolderService
 *
 * Object manager of folder
 *
 * @package App\Services
 */
class FolderService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var FolderRepository folderRepository
     */
    protected $folderRepository;

    public function __construct(
        EntityManagerInterface $em
    ) {
        $this->em                = $em;
        $this->folderRepository = $this->em->getRepository(Folder::class);
    }

    /**
     * Update a folder
     *
     * @param Folder $folder
     * @return Folder
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function save(Folder $folder)
    {
        $folder->setUpdated(new \DateTime('now'));
        $this->em->persist($folder);
        $this->em->flush();

        return $folder;
    }

    /**
     * Remove one folder
     *
     * @param Folder $folder
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function remove(Folder $folder)
    {
        $this->em->remove($folder);
        $this->em->flush();
    }

    /**
     * @param null $id
     * @return Folder
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        return $this->folderRepository->findOne($id);
    }

    /**
     * @param User $user
     * @param null $id
     * @return Folder
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        return $this->folderRepository->findOneByUser($user, $id);
    }

    /**
     * @param User $user
     * @param array $path
     * @return Folder
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUserAndPath(User $user, $path)
    {
        return $this->folderRepository->findOneByUserAndPath($user, $path);
    }

    /**
     * @param Folder|null $folder
     * @return array
     */
    public function toPath(Folder $folder = null)
    {
        $path = [];

        while ($folder) {
            array_unshift($path, $folder->getSlug());

            $folder = $folder->getParent();
        }

        return $path;
    }

    /**
     * @param User $user
     * @return Folder[]
     */
    public function findByUser(User $user)
    {
        return $this->folderRepository->findByUser($user);
    }

    /**
     * @param User $user
     * @param Folder|null $folder
     * @return Folder[]
     */
    public function findByUserAndParent(User $user, Folder $folder = null) {
        return $this->folderRepository->findByUserAndParent($user, $folder);
    }

    public function getJsonFolder(Folder $folder)
    {
        return array(
            'id'          => $folder->getId(),
            'title'       => $folder->getTitle(),
            'slug'        => $folder->getSlug(),
            'path'        => $this->toPath($folder->getParent()),
            'created'     => $folder->getCreated()->format('c'),
            'updated'     => $folder->getUpdated()->format('c'),
        );
    }
}
