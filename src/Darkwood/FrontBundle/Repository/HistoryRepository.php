<?php

namespace Darkwood\FrontBundle\Repository;
use Darkwood\CoreBundle\Repository\BaseRepository;
use Darkwood\FrontBundle\Entity\History;

/**
 * Class HistoryRepository
 *
 * @package Darkwood\FrontBundle\Repository
 */
class HistoryRepository extends BaseRepository
{
    /**
     * @return History[]
     */
    public function findAll()
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h');

        return $qb->getQuery()->getResult();
    }
}
