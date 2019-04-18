<?php

namespace App\Repository;

use App\Entity\Contact;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ContactRepository
 *
 * @package App\Repository
 */
class ContactRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Contact::class);
    }

    /**
     * @param null $id
     * @return Contact
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
