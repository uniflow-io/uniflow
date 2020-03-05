<?php

namespace App\Repository;

use App\Entity\Config;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

class ConfigRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Config::class);
    }

    public function findOne(?int $id = null): ?Config
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c')
        ;

        if ($id) {
            $qb->andWhere('c.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }
}
