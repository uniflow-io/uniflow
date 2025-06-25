<?php

declare(strict_types=1);

namespace App\Services;

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

    public function findOne(?int $id = null): ?User
    {
        return $this->userRepository->findOne($id);
    }

    /**
     * @throws NonUniqueResultException
     */
    public function findOneByEmail(string $email): ?User
    {
        return $this->userRepository->findOneByEmail($email);
    }

    /**
     * @throws NonUniqueResultException
     */
    public function findOneByUsername(string $username): ?User
    {
        return $this->userRepository->findOneByUsername($username);
    }

    public function findOneByEmailOrUsername(string $username): ?User
    {
        return $this->userRepository->findOneByEmailOrUsername($username);
    }

    public function findOneByApiKey(string $apiKey): ?User
    {
        return $this->userRepository->findOneBy(['apiKey' => $apiKey]);
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
            $existingUser = $this->findOneByEmail($data['email']);
            if ($existingUser !== null) {
                throw new AuthenticationException('User with this email already exists');
            }
            $user->setEmail($data['email']);
            $user->setUsername($data['email']); // Using email as username
        }

        if (isset($data['plainPassword'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['plainPassword']);
            $user->setPassword($hashedPassword);
        }

        if (isset($data['facebookId'])) {
            $user->setFacebookId($data['facebookId']);
        }

        if (isset($data['githubId'])) {
            $user->setGithubId($data['githubId']);
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
        $user = $this->findOneByUsername($username) ?? $this->findOneByEmail($username);

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

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     */
    /*
    public function facebookLogin(string $accessToken, ?User $currentUser = null): array
    {
        // Get the token's Facebook app info
        $appResponse = $this->httpClient->request('GET', "https://graph.facebook.com/app/?access_token={$accessToken}");
        $appData = json_decode($appResponse->getContent(), true);

        if (!isset($appData['id']) || $appData['id'] !== $this->facebookAppId) {
            throw new AuthenticationException('Bad credentials');
        }

        // Get the token's Facebook user info
        $userResponse = $this->httpClient->request('GET', "https://graph.facebook.com/me/?access_token={$accessToken}");
        $userData = json_decode($userResponse->getContent(), true);

        if (!isset($userData['id'])) {
            throw new AuthenticationException('Bad credentials');
        }

        $facebookId = $userData['id'];
        $facebookEmail = "{$userData['id']}@facebook.com";

        $user = $currentUser;
        if (!$user) {
            $user = $this->findOneByFacebookId($facebookId);
            if (!$user) {
                $user = $this->findOneByEmail($facebookEmail);
            }
        }

        if (!$user) {
            $user = $this->create([
                'email' => $facebookEmail,
                'facebookId' => $facebookId,
            ]);
        } elseif (!$user->getFacebookId()) {
            $user->setFacebookId($facebookId);
            $this->save($user);
        }

        return [
            'user' => $user,
            'token' => $this->jwtManager->create($user),
        ];
    }
    */

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     */
    /*
    public function githubLogin(string $code, ?User $currentUser = null): array
    {
        // Get the token's Github app
        $tokenResponse = $this->httpClient->request('POST', 'https://github.com/login/oauth/access_token', [
            'headers' => [
                'Accept' => 'application/json',
            ],
            'body' => [
                'client_id' => $this->githubAppId,
                'client_secret' => $this->githubAppSecret,
                'code' => $code,
            ],
        ]);

        $tokenData = json_decode($tokenResponse->getContent(), true);
        if (!isset($tokenData['access_token'])) {
            throw new AuthenticationException('Bad credentials');
        }

        // Get the token's Github user info
        $userResponse = $this->httpClient->request('GET', 'https://api.github.com/user', [
            'headers' => [
                'Accept' => 'application/json',
                'User-Agent' => 'Uniflow App',
                'Authorization' => "Bearer {$tokenData['access_token']}",
            ],
        ]);

        $userData = json_decode($userResponse->getContent(), true);
        if (!isset($userData['id'])) {
            throw new AuthenticationException('Bad credentials');
        }

        $githubId = (string) $userData['id'];
        $githubEmail = "{$userData['id']}@github.com";

        $user = $currentUser;
        if (!$user) {
            $user = $this->findOneByGithubId($githubId);
            if (!$user) {
                $user = $this->findOneByEmail($githubEmail);
            }
        }

        if (!$user) {
            $user = $this->create([
                'email' => $githubEmail,
                'githubId' => $githubId,
            ]);
        } elseif (!$user->getGithubId()) {
            $user->setGithubId($githubId);
            $this->save($user);
        }

        return [
            'user' => $user,
            'token' => $this->jwtManager->create($user),
        ];
    }
    */

    public function getJsonSettings(User $user): array
    {
        return [
            'uid' => $user->getUid(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'firstname' => $user->getCustomer()->getFirstName(),
            'lastname' => $user->getCustomer()->getLastName(),
            'facebookId' => $user->getFacebookId(),
            'githubId' => $user->getGithubId(),
            'apiKey' => $user->getApiKey(),
            'roles' => $user->getRoles(),
            'links' => [
                'lead' => null,
            ],
        ];
    }
}
