<?php

namespace App\Services;

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

    public function __construct(
        EntityManagerInterface $em,
        TagAwareAdapter $cache
    )
    {
        $this->em                = $em;
        $this->historyRepository = $this->em->getRepository(History::class);
        $this->cache             = $cache;
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
     * @param string $username
     * @param string $slug
     * @param null $id
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUsernameAndSlug($username, $slug)
    {
        return $this->historyRepository->findOneByUsernameAndSlug($username, $slug);
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
            'platform'    => $history->getPlatform(),
            'tags'        => $tags,
            'description' => $history->getDescription(),
            'private'     => $history->getPrivate(),
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

    public function getHistoryByPlatform(User $user, $platform = null)
    {
        $histories = $this->historyRepository->findLastByUserAndPlatform($user, $platform);

        $data = array();

        foreach ($histories as $history) {
            $data[] = $this->getJsonHistory($history);
        }

        return $data;
    }

    public function findLastPublic($limit = null)
    {
        return $this->historyRepository->findLastPublic($limit);
    }
}
