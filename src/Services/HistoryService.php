<?php

namespace App\Services;

use App\Entity\Folder;
use App\Entity\History;
use App\Repository\HistoryRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;

/**
 * Class HistoryService
 *
 * Object manager of history
 *
 * @package App\Services
 */
class HistoryService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var HistoryRepository historyRepository
     */
    protected $historyRepository;

    /**
     * @var TagAwareAdapter
     */
    protected $cache;

    /**
     * @var FolderService
     */
    protected $folderService;

    public function __construct(
        EntityManagerInterface $em,
        TagAwareAdapter $cache,
        FolderService $folderService
    )
    {
        $this->em                = $em;
        $this->historyRepository = $this->em->getRepository(History::class);
        $this->cache             = $cache;
        $this->folderService     = $folderService;
    }

    /**
     * Update a history
     *
     * @param History $history
     *
     * @return History
     */
    public function save(History $history)
    {
        $history->setUpdated(new \DateTime('now'));
        $this->em->persist($history);
        $this->em->flush();

        return $history;
    }

    /**
     * Remove one history
     *
     * @param History $history
     */
    public function remove(History $history)
    {
        $this->em->remove($history);
        $this->em->flush();
    }

    /**
     * @param null $id
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        return $this->historyRepository->findOne($id);
    }

    /**
     * @param User $user
     * @param null $id
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        return $this->historyRepository->findOneByUser($user, $id);
    }

    /**
     * @param User $user
     * @param array $path
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUserAndPath(User $user, $path)
    {
        return $this->historyRepository->findOneByUserAndPath($user, $path);
    }

    public function getJsonHistory(History $history)
    {
        $tags = array();

        foreach ($history->getTags() as $tag) {
            $tags[] = $tag->getTitle();
        }

        return array(
            'id'          => $history->getId(),
            'title'       => $history->getTitle(),
            'slug'        => $history->getSlug(),
            'path'        => $this->folderService->toPath($history->getFolder()),
            'client'      => $history->getClient(),
            'tags'        => $tags,
            'description' => $history->getDescription(),
            'public'      => $history->getPublic(),
            'created'     => $history->getCreated()->format('c'),
            'updated'     => $history->getUpdated()->format('c'),
        );
    }

    public function getHistory(User $user)
    {
        $histories = $this->historyRepository->findLastByUser($user);

        $data = array();

        foreach ($histories as $history) {
            $data[] = $this->getJsonHistory($history);
        }

        return $data;
    }

    /**
     * @param User $user
     * @param null $client
     * @param Folder|null $folder
     * @return mixed
     */
    public function getHistoryByUserAndClientAndFolder(User $user, $client = null, Folder $folder = null)
    {
        return $this->historyRepository->findLastByUserAndClientAndFolder($user, $client, $folder);
    }

    /**
     * @param User $user
     * @param null $client
     * @param Folder|null $folder
     * @return mixed
     */
    public function getPublicHistoryByUserAndClientAndFolder(User $user, $client = null, Folder $folder = null)
    {
        return $this->historyRepository->getPublicHistoryByUserAndClientAndFolder($user, $client, $folder);
    }

    public function findLastPublic($limit = null)
    {
        return $this->historyRepository->findLastPublic($limit);
    }
}
