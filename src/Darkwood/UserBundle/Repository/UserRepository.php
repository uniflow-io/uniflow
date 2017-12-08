<?php

/**
 * Repository.
 *
 * @author Mathieu Ledru <mathieu.ledru@darkwood.fr>
 */

namespace Darkwood\UserBundle\Repository;

use Darkwood\UserBundle\Entity\User;
use Doctrine\ORM\EntityRepository;

/**
 * Class UserRepository.
 */
class UserRepository extends EntityRepository
{
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
     * Find one for edit profile
     *
     * @param $id
     * @return User
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
