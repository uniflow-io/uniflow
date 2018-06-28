<?php

namespace App\Repository;
use Darkwood\CoreBundle\Repository\BaseRepository;
use Doctrine\ORM\Query\Expr;

/**
 * Class TagRepository
 *
 * @package App\Repository
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

    public function findOrphan()
    {
        $qb = $this->createQueryBuilder('e')
            ->select('e')
        ;

        $qb->leftJoin('e.histories', 'h')
            ->andWhere('h.id IS NULL');

        $query = $qb->getQuery();

        return $query->getResult();
    }
}
