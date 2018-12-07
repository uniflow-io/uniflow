<?php

/**
 * Repository.
 *
 * @author Mathieu Ledru <mathieu.ledru@darkwood.fr>
 */

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class UserRepository.
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @return User[]
     */
    public function findAll()
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u');

        $query = $qb->getQuery();

        return $query->getResult();
    }

    /**
     * @param null $id
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
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

    /**
     * @param $username
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByEmailOrUsername($username)
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

    /**
     * @param array $filters
     * @return \Doctrine\ORM\Query
     */
    public function queryForSearch($filters = array())
    {
        $qb = $this->createQueryBuilder('u')
            ->select('u');

        if (count($filters) > 0) {
            foreach ($filters as $key => $filter) {
                if (!empty($filter)) {
                    $qb->andWhere('u.' . $key . ' LIKE :' . $key);
                    $qb->setParameter($key, '%' . $filter . '%');
                }
            }
        }

        return $qb->getQuery();
    }
}
