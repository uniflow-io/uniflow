<?php

namespace Darkwood\FrontBundle\Services;
use Darkwood\CoreBundle\Services\BaseService;
use Darkwood\FrontBundle\Entity\History;
use Darkwood\FrontBundle\Repository\HistoryRepository;

/**
 * Class HistoryService
 *
 * Object manager of history
 *
 * @package Darkwood\FrontBundle\Services
 */
class HistoryService extends BaseService
{
    /**
     * @var HistoryRepository historyRepository
     */
    protected $historyRepository;

    /**
     * @var TagService
     */
    protected $tagService;

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
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();

        return $history;
    }

    /**
     * Remove one history
     *
     * @param History $history
     */
    public function remove(History $history)
    {
        $this->getEntityManager()->remove($history);
        $this->getEntityManager()->flush();
    }

    /**
     * @param integer $id
     * @return History
     */
    public function findOne($id = null)
    {
        return $this->historyRepository->findOne($id);
    }

    public function getJsonHistory(History $history)
    {
        $tags = array();

        foreach ($history->getTags() as $tag)
        {
            $tags[] = $tag->getTitle();
        }

        $created = $history->getCreated();
        $updated = $history->getUpdated();

        return array(
            'id' => $history->getId(),
            'title' => $history->getTitle(),
            'tags' => $tags,
            'description' => $history->getDescription(),
            'created' => $created instanceof \DateTime ? $created->format('c') : null,
            'updated' => $updated instanceof \DateTime ? $updated->format('c') : null,
        );
    }

    public function getHistory()
    {
        $histories = $this->historyRepository->findAll();

        $data = array();

        foreach ($histories as $history)
        {
            $data[] = $this->getJsonHistory($history);
        }

        return $data;
    }
}
