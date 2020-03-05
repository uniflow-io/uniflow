<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setFirstName('Mathieu');
        $user->setLastName('Ledru');
        $user->setPassword($this->passwordEncoder->encodePassword($user, 'admin'));
        $user->setEmail('matyo@uniflow.io');
        $user->setRoles(['ROLE_SUPER_ADMIN']);

        $manager->persist($user);
        $manager->flush();
    }
}
