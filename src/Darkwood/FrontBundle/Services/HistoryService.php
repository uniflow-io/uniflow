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
}
