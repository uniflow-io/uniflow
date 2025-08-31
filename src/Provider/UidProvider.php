<?php

/*
 * This file is part of the Sylius package.
 *
 * (c) Sylius Sp. z o.o.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace App\Provider;

use App\Entity\User\ShopUser;
use App\Repository\User\ShopUserRepository;
use Symfony\Component\Security\Core\Exception\UserNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

use function sprintf;

class UidProvider implements UserProviderInterface
{
    public function __construct(
        private readonly ShopUserRepository $shopUserRepository
    ) {}

    public function refreshUser(UserInterface $user): UserInterface
    {
        return null;
    }

    public function supportsClass(string $class): bool
    {
        return $class === ShopUser::class;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        $user = $this->shopUserRepository->findOneByUidOrUsername($identifier);

        if (!$user instanceof ShopUser) {
            throw new UserNotFoundException(
                sprintf('Username "%s" does not exist.', $identifier),
            );
        }

        return $user;
    }
}
