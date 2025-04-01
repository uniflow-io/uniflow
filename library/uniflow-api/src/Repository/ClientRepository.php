<?php

namespace App\Repository;

use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    public function findOneByClient(string $client): ?Client
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c')
        ;

        $qb->where('c.name = :name')
            ->setParameter('name', $client);

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    /**
     * @return Client[]
     */
    public function findOrphan(): array
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c')
        ;

        $qb->leftJoin('c.programs', 'p')
            ->andWhere('p.id IS NULL');

        $query = $qb->getQuery();

        return $query->getResult();
    }
}
