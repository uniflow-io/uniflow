<?php

namespace Darkwood\FrontBundle\Repository;
use Darkwood\CoreBundle\Repository\BaseRepository;

/**
 * Class TagRepository
 *
 * @package Darkwood\FrontBundle\Repository
 */
class TagRepository extends BaseRepository
{
    public function findOneByTag($tag)
    {
        $qb = $this->createQueryBuilder('e')
            ->select('e')
        ;

        $qb->where('e.title = :title')
            ->setParameter('title', $tag);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }
}
