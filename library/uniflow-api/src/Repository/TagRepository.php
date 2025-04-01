<?php

namespace App\Repository;

use App\Entity\Tag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

class TagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tag::class);
    }

    public function findOneByTag(string $tag): ?Tag
    {
        $qb = $this->createQueryBuilder('t')
            ->select('t')
        ;

        $qb->where('t.name = :name')
            ->setParameter('name', $tag);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    /**
     * @return Tag[]
     */
    public function findOrphan(): array
    {
        $qb = $this->createQueryBuilder('t')
            ->select('t')
        ;

        $qb->leftJoin('t.programs', 'p')
            ->andWhere('p.id IS NULL');

        $query = $qb->getQuery();

        return $query->getResult();
    }
}
