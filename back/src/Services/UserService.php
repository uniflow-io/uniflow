<?php

namespace App\Services;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;

/**
 * Class UserService
 * `
 * Object manager of user.
 */
class UserService
{
    /**
     * Repository
     *
     * @var UserRepository
     */
    protected $userRepository;

    /**
     * Save a user
     *
     * @param User $user
     */
    public function save(User $user)
    {
        // Save user
        $user->setUpdated(new \DateTime());

        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();

        $this->clearResultCache();
    }

    /**
     * Remove one user
     *
     * @param User $user
     */
    public function remove(User $user)
    {
        $this->getEntityManager()->remove($user);
        $this->getEntityManager()->flush();
    }

    /**
     * @return User[]
     */
    public function findAll()
    {
        return $this->userRepository->findAll();
    }

    /**
     * Find user by id for edit profile
     *
     * @param string $id
     *
     * @return User
     */
    public function findOne($id = null)
    {
        return $this->userRepository->findOne($id);
    }

    /**
     * @param array $filters
     * @return \Doctrine\ORM\Query
     */
    public function getQueryForSearch($filters = array())
    {
        return $this->userRepository->queryForSearch($filters);
    }

    public function findOneByUsername($username)
    {
        return $this->userRepository->findOneBy(array('username' => $username));
    }
}
