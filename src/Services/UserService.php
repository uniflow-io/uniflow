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
    ) {
        $this->em             = $em;
        $this->userRepository = $this->em->getRepository(User::class);
    }

    /**
     * Save one user
     *
     * @param User $user
     * @return User
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
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
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
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
     * @param null $id
     * @return User|null
     * @throws \Doctrine\ORM\NonUniqueResultException
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

    /**
     * @param $username
     * @return User|null
     */
    public function findOneByUsername($username)
    {
        return $this->userRepository->findOneBy(array('username' => $username));
    }

    /**
     * @param $email
     * @return User|null
     */
    public function findOneByEmail($email)
    {
        return $this->userRepository->findOneBy(array('email' => $email));
    }

    /**
     * @param $username
     * @return User|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByEmailOrUsername($username)
    {
        return $this->userRepository->findOneByEmailOrUsername($username);
    }

    /**
     * @param $facebookId
     * @return User|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByFacebookId($facebookId)
    {
        return $this->userRepository->findOneByFacebookId($facebookId);
    }

    /**
     * @param $githubId
     * @return User|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByGithubId($githubId)
    {
        return $this->userRepository->findOneByGithubId($githubId);
    }

    /**
     * @param $apiKey
     * @return User|null
     */
    public function findOneByApiKey($apiKey)
    {
        return $this->userRepository->findOneBy(array('apiKey' => $apiKey));
    }

    public function getJsonSettings(User $user)
    {
        return array(
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'username' => $user->getUsername(),
            'facebookId' => $user->getFacebookId(),
            'githubId' => $user->getGithubId(),
            'apiKey' => $user->getApiKey(),
            'roles' => $user->getRoles(),
        );
    }
}
