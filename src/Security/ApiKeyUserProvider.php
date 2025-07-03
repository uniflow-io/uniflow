<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User\ShopUser;
use App\Service\UserService;
use Sylius\Component\User\Model\UserInterface as SyliusUserInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class ApiKeyUserProvider implements UserProviderInterface
{
    public function __construct(protected UserService $userService) {}

    public function loadUserByApiKey($apiKey): UserInterface
    {
        $user = $this->userService->findOneByApiKey($apiKey);
        if (!$user instanceof SyliusUserInterface) {
            throw new UserNotFoundException();
        }

        return $user;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        return $this->loadUserByUsername($identifier);
    }

    /**
     * @deprecated since Symfony 5.3, use loadUserByIdentifier() instead
     */
    public function loadUserByUsername($username): UserInterface
    {
        $user = $this->userService->findOneByEmailOrUsername($username);
        if (!$user instanceof SyliusUserInterface) {
            throw new UserNotFoundException();
        }

        return $user;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        // this is used for storing authentication in the session
        // but in this example, the token is sent in each request,
        // so authentication can be stateless. Throwing this exception
        // is proper to make things stateless
        throw new UnsupportedUserException();
    }

    public function supportsClass(string $class): bool
    {
        return ShopUser::class === $class;
    }
}
