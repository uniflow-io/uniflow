<?php

namespace App\Repository;

use App\Entity\Tag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class TagRepository
 *
 * @package App\Repository
 */
class TagRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Tag::class);
    }

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
