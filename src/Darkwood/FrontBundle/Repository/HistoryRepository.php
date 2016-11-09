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
     * Find one for edit profile
     *
     * @param $id
     * @return mixed
     */
    public function findOne($id = null)
    {
        $qb = $this->createQueryBuilder('e')
            ->select('e')
        ;

        if($id) {
            $qb->where('e.id = :id')
                ->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

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
