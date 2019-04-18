<?php

namespace App\Repository;

use App\Entity\Config;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ConfigRepository
 *
 * @package App\Repository
 */
class ConfigRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Config::class);
    }

    /**
     * @param null $id
     * @return Config
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
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
