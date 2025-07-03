<?php

declare(strict_types=1);

namespace App\Repository\User;

use App\Entity\User\ShopUser as User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ShopUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findOneByUidOrUsername(string $uidOrUsername): User
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u')
        ;

        $qb->andWhere($qb->expr()->orX('u.username = :uidOrUsername', 'u.uid = :uidOrUsername'))
            ->setParameter('uidOrUsername', $uidOrUsername)
        ;
        $qb->setMaxResults(1);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }
}
