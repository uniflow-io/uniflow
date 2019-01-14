<?php

namespace App\Repository;

use App\Entity\Folder;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class FolderRepository
 *
 * @package App\Repository
 */
class FolderRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Folder::class);
    }

    /**
     * @param null $id
     * @return Folder
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
        ;

        if ($id) {
            $qb->andWhere('h.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    /**
     * @param User $user
     * @param null $id
     * @return Folder
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
        ;

        if ($id) {
            $qb->andWhere('h.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    /**
     * @param $username
     * @param $slug
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUsernameAndSlug($username, $slug)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->leftJoin('h.user', 'u')
            ->andWhere('u.username = :username')->setParameter('username', $username)
            ->andWhere('h.slug = :slug')->setParameter('slug', $slug)
        ;

        $qb->setMaxResults(1);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    /**
     * @param User $user
     * @return Folder[]
     */
    public function findByUser(User $user)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
        ;

        return $qb->getQuery()->getResult();
    }
}
