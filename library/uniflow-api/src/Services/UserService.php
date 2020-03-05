<?php

namespace App\Services;

use App\Entity\User;
use Doctrine\ORM\EntityManager;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var UserRepository
     */
    protected $userRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em = $em;
        $this->userRepository = $this->em->getRepository(User::class);
    }

    public function save(User $user): User
    {
        $user->setUpdated(new \DateTime());

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    public function remove(User $user): void
    {
        $this->em->remove($user);
        $this->em->flush();
    }

    public function findOne(?int $id = null): ?User
    {
        return $this->userRepository->findOne($id);
    }

    public function findOneByUsername(string $username): ?User
    {
        return $this->userRepository->findOneBy(['username' => $username]);
    }

    public function findOneByEmail(string $email): ?User
    {
        return $this->userRepository->findOneBy(['email' => $email]);
    }

    public function findOneByEmailOrUsername(string $username): ?User
    {
        return $this->userRepository->findOneByEmailOrUsername($username);
    }

    public function findOneByFacebookId(string $facebookId): ?User
    {
        return $this->userRepository->findOneByFacebookId($facebookId);
    }

    public function findOneByGithubId(string $githubId): ?User
    {
        return $this->userRepository->findOneByGithubId($githubId);
    }

    public function findOneByApiKey(string $apiKey): ?User
    {
        return $this->userRepository->findOneBy(['apiKey' => $apiKey]);
    }

    public function getJsonSettings(User $user): array
    {
        return [
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'username' => $user->getUsername(),
            'facebookId' => $user->getFacebookId(),
            'githubId' => $user->getGithubId(),
            'apiKey' => $user->getApiKey(),
            'roles' => $user->getRoles(),
        ];
    }
}
