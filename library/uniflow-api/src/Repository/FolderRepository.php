<?php

namespace App\Repository;

use App\Entity\Folder;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

class FolderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Folder::class);
    }

    public function findOne(?int $id = null): ?Folder
    {
        $qb = $this->createQueryBuilder('f')
            ->select('f')
        ;

        if ($id) {
            $qb->andWhere('f.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByUser(User $user, ?int $id = null): ?Folder
    {
        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        if ($id) {
            $qb->andWhere('f.id = :id')->setParameter('id', $id);
        } else {
            $qb->setMaxResults(1);
        }

        $query = $qb->getQuery();

        return $query->getOneOrNullResult();
    }

    public function findOneByUserAndPath(User $user, array $path): ?Folder
    {
        $level = count($path);
        if ($level === 0) {
            return null;
        }

        $slug  = $path[$level - 1];

        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        if ($level === 1) {
            $qb->andWhere('f.slug = :slug')->setParameter('slug', $slug);
            $qb->andWhere('f.parent IS NULL');
        } elseif ($level > 1) {
            for ($i = $level - 2; $i >= 0; $i--) {
                $slug = $path[$i];
                if ($i === $level - 2) {
                    $qb->leftJoin('f.parent', 'f' . $i);
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
     * @return Folder[]
     */
    public function findByUser(User $user): array
    {
        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Folder[]
     */
    public function findByUserAndParent(User $user, ?Folder $folder): array
    {
        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        if ($folder) {
            $qb->andWhere('f.parent = :parent')->setParameter('parent', $folder);
        } else {
            $qb->andWhere('f.parent is NULL');
        }

        return $qb->getQuery()->getResult();
    }
}
