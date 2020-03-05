<?php

namespace App\Repository;

use App\Entity\Folder;
use App\Entity\Program;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

class ProgramRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Program::class);
    }

    public function findOne(?int $id = null): ?Program
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p');

        if ($id) {
            $qb->andWhere('p.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByUser(User $user, ?int $id = null): ?Program
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user);

        if ($id) {
            $qb->andWhere('p.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByUserAndPath(User $user, array $path): ?Program
    {
        $level = count($path);
        if ($level === 0) {
            return null;
        }

        $slug  = $path[$level - 1];

        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user)
            ->andWhere('p.slug = :slug')->setParameter('slug', $slug);

        if ($level === 1) {
            $qb->andWhere('p.folder IS NULL');
        } elseif ($level > 1) {
            for ($i = $level - 2; $i >= 0; $i--) {
                $slug = $path[$i];
                if ($i === $level - 2) {
                    $qb->leftJoin('p.folder', 'f' . $i);
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
     * @return Program[]
     */
    public function findByUser(User $user): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user);

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Program[]
     */
    public function findLastByUser(User $user): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user)
            ->addOrderBy('p.updated', 'DESC');

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Program[]
     */
    public function findLastByUserAndClient(User $user, ?string $client): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user)
            ->addOrderBy('p.updated', 'DESC');

        if ($client) {
            $qb->leftJoin('p.clients', 'c');
            $qb->andWhere('c.name = :name')->setParameter('name', $client);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Program[]
     */
    public function findLastByUserAndClientAndFolder(User $user, ?string $client, ?Folder $folder): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user)
            ->addOrderBy('p.updated', 'DESC');

        if ($client) {
            $qb->leftJoin('p.clients', 'c');
            $qb->andWhere('c.name = :name')->setParameter('name', $client);
        }

        if ($folder) {
            $qb->andWhere('p.folder = :folder')->setParameter('folder', $folder);
        } else {
            $qb->andWhere('p.folder is NULL');
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Program[]
     */
    public function findLastPublicByUserAndClient(User $user, ?string $client): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user)
            ->andWhere('p.public = :public')->setParameter('public', true)
            ->addOrderBy('p.updated', 'DESC');

        if ($client) {
            $qb->leftJoin('p.clients', 'c');
            $qb->andWhere('c.name = :name')->setParameter('name', $client);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Program[]
     */
    public function findLastPublicByUserAndClientAndFolder(User $user, ?string $client, ?Folder $folder): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.user = :user')->setParameter('user', $user)
            ->andWhere('p.public = :public')->setParameter('public', true)
            ->addOrderBy('p.updated', 'DESC');

        if ($client) {
            $qb->leftJoin('p.clients', 'c');
            $qb->andWhere('c.name = :name')->setParameter('name', $client);
        }

        if ($folder) {
            $qb->andWhere('p.folder = :folder')->setParameter('folder', $folder);
        } else {
            $qb->andWhere('p.folder is NULL');
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Program[]
     */
    public function findLastPublic(?int $limit): array
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p')
            ->andWhere('p.public = :public')->setParameter('public', true)
            ->addOrderBy('p.updated', 'DESC');

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }
}
