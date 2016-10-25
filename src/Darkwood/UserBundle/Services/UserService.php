<?php

namespace Darkwood\UserBundle\Services;

use Darkwood\UserBundle\Entity\User;
use Doctrine\ORM\EntityManager;
use Darkwood\UserBundle\Repository\UserRepository;

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
    private $em;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
        $this->userRepository = $em->getRepository('UserBundle:User');
    }

    /**
     * Save a user.
     *
     * @param User $user
     */
    public function save(User $user)
    {
        $this->em->persist($user);
        $this->em->flush();
    }

    /**
     * Remove one user.
     *
     * @param User $user
     */
    public function remove(User $user)
    {
        $this->em->remove($user);
        $this->em->flush();
    }

    public function findAll()
    {
        return $this->userRepository->findAll();
    }

    public function findOneByUsername($username)
    {
        return $this->userRepository->findOneBy(array('username' => $username));
    }
}
