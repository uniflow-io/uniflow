<?php

namespace App\Services;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class UserService
 * `
 * Object manager of user.
 */
class UserService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * Repository
     *
     * @var UserRepository
     */
    protected $userRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em             = $em;
        $this->userRepository = $this->em->getRepository(User::class);
    }

    /**
     * @param User $user
     * @return User
     */
    public function save(User $user)
    {
        // Save user
        $user->setUpdated(new \DateTime());

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    /**
     * Remove one user
     *
     * @param User $user
     */
    public function remove(User $user)
    {
        $this->em->remove($user);
        $this->em->flush();
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

    /**
     * @param $username
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByEmailOrUsername($username)
    {
        return $this->userRepository->findOneByEmailOrUsername($username);
    }

    public function findOneByApiKey($apiKey)
    {
        return $this->userRepository->findOneBy(array('apiKey' => $apiKey));
    }

    public function getJsonSettings(User $user)
    {
        return array(
            'apiKey' => $user->getApiKey(),
        );
    }
}
