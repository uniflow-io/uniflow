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
     * @param null $id
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h');

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
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user);

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
     * @param array $path
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUsernameAndPath($username, $path)
    {
        $level = count($path);
        $slug  = $path[$level - 1];

        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->leftJoin('h.user', 'u')
            ->andWhere('u.username = :username')->setParameter('username', $username)
            ->andWhere('h.slug = :slug')->setParameter('slug', $slug);

        if ($level === 1) {
            $qb->andWhere('h.folder IS NULL');
        } else if ($level > 1) {
            for ($i = $level - 2; $i >= 0; $i--) {
                $slug = $path[$i];
                if ($i === $level - 2) {
                    $qb->leftJoin('h.folder', 'f' . $i);
                } else {
                    $qb->leftJoin('f' . ($i + 1) . '.parent', 'f' . $i);
                }
                $qb->andWhere('f' . $i . '.slug = :slug' . $i)->setParameter('slug' . $i, $slug);
            }
            $qb->andWhere('f0.parent IS NULL');
        }

        $qb->setMaxResults(1);

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
            ->andWhere('h.user = :user')->setParameter('user', $user);

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
            ->addOrderBy('h.updated', 'DESC');

        return $qb->getQuery()->getResult();
    }

    public function findLastByUserAndClient(User $user, $client = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.user = :user')->setParameter('user', $user)
            ->addOrderBy('h.updated', 'DESC');

        if ($client) {
            $qb->andWhere('h.client = :client')->setParameter('client', $client);
        }

        return $qb->getQuery()->getResult();
    }

    public function getPublicHistoryByUsernameAndClient($username, $client = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->leftJoin('h.user', 'u')
            ->andWhere('u.username = :username')->setParameter('username', $username)
            ->andWhere('h.public = :public')->setParameter('public', true)
            ->addOrderBy('h.updated', 'DESC');

        if ($client) {
            $qb->andWhere('h.client = :client')->setParameter('client', $client);
        }

        return $qb->getQuery()->getResult();
    }

    public function clearHistoryByUser(User $user)
    {
        $qb = $this->getEntityManager()->createQueryBuilder()
            ->delete($this->getEntityName(), 'h')
            ->andWhere('h.user = :user')->setParameter('user', $user);

        $qb->getQuery()->execute();
    }

    public function findLastPublic($limit = null)
    {
        $qb = $this->createQueryBuilder('h')
            ->select('h')
            ->andWhere('h.public = :public')->setParameter('public', true)
            ->addOrderBy('h.updated', 'DESC');

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }
}
