<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @return User[]
     */
    public function findAll(): array
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u');

        $query = $qb->getQuery();

        return $query->getResult();
    }

    public function findOne(?int $id = null): ?User
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u');

        if ($id) {
            $qb->where('u.id = :id')
                ->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByEmailOrUsername(string $username): User
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u')
        ;

        $qb->andWhere($qb->expr()->orX('u.email = :username', 'u.username = :username'))
            ->setParameter('username', $username);
        $qb->setMaxResults(1);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByFacebookId(string $facebookId): ?User
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u')
        ;

        $qb->where('u.facebookId = :facebookId')
            ->setParameter('facebookId', $facebookId);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByGithubId(string $githubId): ?User
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u')
        ;

        $qb->where('u.githubId = :githubId')
            ->setParameter('githubId', $githubId);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }
}
