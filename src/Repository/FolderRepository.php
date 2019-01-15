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
     * @return Folder|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
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

    /**
     * @param User $user
     * @param null $id
     * @return Folder|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
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

    /**
     * @param User $user
     * @param array $path
     * @return Folder|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUserAndPath(User $user, $path)
    {
        $level = count($path);
        $slug  = $path[$level - 1];

        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        if ($level === 1) {
            $qb->andWhere('f.slug = :slug')->setParameter('slug', $slug);
            $qb->andWhere('f.parent IS NULL');
        } else if ($level > 1) {
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
     * @param User $user
     * @return Folder[]
     */
    public function findByUser(User $user)
    {
        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        return $qb->getQuery()->getResult();
    }

    /**
     * @param User $user
     * @param Folder|null $folder
     * @return Folder[]
     */
    public function findByUserAndParent(User $user, Folder $folder = null)
    {
        $qb = $this->createQueryBuilder('f')
            ->select('f')
            ->andWhere('f.user = :user')->setParameter('user', $user)
        ;

        if($folder) {
            $qb->andWhere('f.parent = :parent')->setParameter('parent', $folder);
        } else {
            $qb->andWhere('f.parent is NULL');
        }

        return $qb->getQuery()->getResult();
    }
}
