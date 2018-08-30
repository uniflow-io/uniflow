<?php

namespace App\Repository;
use App\Entity\History;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class HistoryRepository
 *
 * @package App\Repository
 */
class HistoryRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, History::class);
    }

    /**
     * @param User $user
     * @param null $id
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
        ;

        if($id) {
            $qb->andWhere('h.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    /**
     * @param User $user
     * @return History[]
     */
    public function findByUser(User $user)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
        ;

        return $qb->getQuery()->getResult();
    }

    /**
     * @param User $user
     * @return History[]
     */
    public function findLastByUser(User $user)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
            ->addOrderBy('h.updated', 'DESC')
        ;

        return $qb->getQuery()->getResult();
    }

    public function findLastByUserAndPlatform(User $user, $platform)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
            ->andWhere('h.platform = :platform')->setParameter('platform', $platform)
            ->addOrderBy('h.updated', 'DESC')
        ;

        return $qb->getQuery()->getResult();
    }

    public function clearHistoryByUser(User $user)
    {
        $qb = $this->getEntityManager()->createQueryBuilder()
            ->delete($this->getEntityName(), 'h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
        ;

        $qb->getQuery()->execute();
    }
}
