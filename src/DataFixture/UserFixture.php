<?php

declare(strict_types=1);

namespace App\DataFixture;

use App\Entity\User\ShopUser as User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixture extends Fixture
{
    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher) {}

    public function load(ObjectManager $manager): void
    {
        /*$user = new User();
        $user->setFirstName('Mathieu');
        $user->setLastName('Ledru');
        $user->setPassword($this->passwordHasher->hashPassword($user, 'admin'));
        $user->setEmail('matyo@uniflow.io');
        $user->setRoles(['ROLE_SUPER_ADMIN']);

        $manager->persist($user);
        $manager->flush();*/
    }
}
