<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\User\ShopUser as User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AuthService
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserService $userService,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly JWTTokenManagerInterface $jwtManager,
        private readonly HttpClientInterface $httpClient,
        // private string $facebookAppId,
        // private string $facebookAppSecret,
        // private string $githubClientId,
        // private string $githubClientSecret
    ) {}

    public function login(string $username, string $password): array
    {
        $user = $this->userService->findOneByEmailOrUsername($username);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new AuthenticationException('Bad credentials');
        }

        if (!$user->isEnabled()) {
            throw new AuthenticationException('Account is disabled');
        }

        return [
            'token' => $this->jwtManager->create($user),
            'user' => $user,
        ];
    }

    /*
    public function facebookLogin(string $accessToken, ?UserInterface $currentUser = null): array
    {
        // Verify Facebook access token and get user info
        $response = $this->httpClient->request('GET', 'https://graph.facebook.com/me', [
            'query' => [
                'access_token' => $accessToken,
                'fields' => 'id,email',
            ],
        ]);

        $data = json_decode($response->getContent(), true);

        if (!isset($data['id'])) {
            throw new AuthenticationException('Invalid Facebook access token');
        }

        // Find or create user
        $user = $this->userService->findOneByFacebookId($data['id']);

        if (!$user && isset($data['email'])) {
            $user = $this->userService->findOneByEmail($data['email']);
        }

        if (!$user && $currentUser instanceof User) {
            $user = $currentUser;
            $user->setFacebookId($data['id']);
            $this->userService->save($user);
        }

        if (!$user && isset($data['email'])) {
            $user = $this->userService->create([
                'email' => $data['email'],
                'plainPassword' => bin2hex(random_bytes(16)),
                'facebookId' => $data['id'],
            ]);
        }

        if (!$user) {
            throw new AuthenticationException('Could not create user from Facebook data');
        }

        return [
            'token' => $this->jwtManager->create($user),
            'user' => $user,
        ];
    }

    public function githubLogin(string $code, ?UserInterface $currentUser = null): array
    {
        // Exchange code for access token
        $response = $this->httpClient->request('POST', 'https://github.com/login/oauth/access_token', [
            'headers' => [
                'Accept' => 'application/json',
            ],
            'query' => [
                'client_id' => $this->githubClientId,
                'client_secret' => $this->githubClientSecret,
                'code' => $code,
            ],
        ]);

        $data = json_decode($response->getContent(), true);

        if (!isset($data['access_token'])) {
            throw new AuthenticationException('Invalid GitHub code');
        }

        // Get user info
        $response = $this->httpClient->request('GET', 'https://api.github.com/user', [
            'headers' => [
                'Authorization' => 'token ' . $data['access_token'],
                'Accept' => 'application/json',
            ],
        ]);

        $userData = json_decode($response->getContent(), true);

        if (!isset($userData['id'])) {
            throw new AuthenticationException('Could not get GitHub user info');
        }

        // Find or create user
        $user = $this->userService->findOneByGithubId((string) $userData['id']);

        if (!$user && isset($userData['email'])) {
            $user = $this->userService->findOneByEmail($userData['email']);
        }

        if (!$user && $currentUser instanceof User) {
            $user = $currentUser;
            $user->setGithubId((string) $userData['id']);
            $this->userService->save($user);
        }

        if (!$user && isset($userData['email'])) {
            $user = $this->userService->create([
                'email' => $userData['email'],
                'plainPassword' => bin2hex(random_bytes(16)),
                'githubId' => (string) $userData['id'],
            ]);
        }

        if (!$user) {
            throw new AuthenticationException('Could not create user from GitHub data');
        }

        return [
            'token' => $this->jwtManager->create($user),
            'user' => $user,
        ];
    }
    */
}
