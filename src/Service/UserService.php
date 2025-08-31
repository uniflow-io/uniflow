<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Customer\Customer;
use App\Entity\User\ShopUser as User;
use App\Repository\User\ShopUserRepository as UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Uid\Uuid;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class UserService
{
    /**
     * @var UserRepository
     */
    // protected $userRepository;

    public function __construct(
        protected EntityManagerInterface $entityManager,
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly JWTTokenManagerInterface $jwtManager,
        private readonly HttpClientInterface $httpClient,
        /*private readonly string $facebookAppId,
        private readonly string $githubAppId,
        private readonly string $githubAppSecret*/
    ) {
        // $this->userRepository = $this->entityManager->getRepository(User::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function save(User $user): void
    {
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public function remove(User $user): void
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();
    }

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function create(array $data): User
    {
        $user = new User();
        $user->setUid(Uuid::v7()->toString());
        $user->setCustomer(new Customer());

        if (isset($data['email'])) {
            $existingUser = $this->userRepository->findOneByEmail($data['email']);
            if ($existingUser !== null) {
                throw new AuthenticationException('User with this email already exists');
            }

            $user->setEmail($data['email']);
            // $user->setUsername($data['email']); // Using email as username
        }

        if (isset($data['plainPassword'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['plainPassword']);
            $user->setPassword($hashedPassword);
        }

        // Set default role and enable the user
        $user->addRole('ROLE_USER');
        $user->setEnabled(true);
        $user->setVerifiedAt(new DateTime());

        $this->save($user);

        return $user;
    }

    /**
     * @throws NonUniqueResultException
     */
    public function login(string $username, string $password): array
    {
        $user = $this->userRepository->findOneByUsername($username) ?? $this->userRepository->findOneByEmail($username);

        if (!$user || !$user->getPassword()) {
            throw new AuthenticationException('Bad credentials');
        }

        if (!$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new AuthenticationException('Bad credentials');
        }

        if (!$user->isEnabled()) {
            throw new AuthenticationException('Account is disabled');
        }

        return [
            'user' => $user,
            'token' => $this->jwtManager->create($user),
        ];
    }

    public function getJsonSettings(User $user): array
    {
        return [
            'uid' => $user->getUid(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'firstname' => $user->getCustomer()->getFirstName(),
            'lastname' => $user->getCustomer()->getLastName(),
            // 'facebookId' => $user->getFacebookId(),
            // 'githubId' => $user->getGithubId(),
            'apiKey' => $user->getApiKey(),
            'roles' => $user->getRoles(),
            'links' => [
                'lead' => null,
            ],
        ];
    }
}
