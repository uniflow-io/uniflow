<?php

namespace Darkwood\FrontBundle\Repository;
use Darkwood\CoreBundle\Repository\BaseRepository;
use Darkwood\FrontBundle\Entity\History;
use Darkwood\UserBundle\Entity\User;

/**
 * Class HistoryRepository
 *
 * @package Darkwood\FrontBundle\Repository
 */
class HistoryRepository extends BaseRepository
{
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

    public function clearHistoryByUser(User $user)
    {
        $qb = $this->getEntityManager()->createQueryBuilder()
            ->delete($this->getEntityName(), 'h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
        ;

        $qb->getQuery()->execute();
    }
}
