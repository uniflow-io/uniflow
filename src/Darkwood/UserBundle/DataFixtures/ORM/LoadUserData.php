<?php

namespace Darkwood\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Darkwood\UserBundle\Entity\User;

/**
 * Class LoadUserData.
 *
 * Load user's fixtures
 */
class LoadUserData extends AbstractFixture implements FixtureInterface,  ContainerAwareInterface, OrderedFixtureInterface
{
    /**
     * Container.
     *
     * @var ContainerInterface
     */
    private $container;

    /**
     * Set container.
     *
     * @param ContainerInterface $container
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * Load.
     *
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $user = $this->addUser(array(
            'username' => 'admin',
            'email'    => 'admin@example.com',
            'password' => 'admin',
            'role'     => 'ROLE_SUPER_ADMIN',
            'enabled'  => true,
            'firstname' => 'admin',
            'lastname' => 'admin',
        ));
        $this->addReference('admin-user', $user);
    }

    /**
     * Add user on base.
     *
     * @param $settings
     */
    protected function addUser($settings)
    {
        $userManager = $this->container->get('fos_user.user_manager');

        /** @var \Darkwood\UserBundle\Entity\User $user */
        $user = $userManager->createUser();
        $user->setUsername($settings['username']);
        $user->setEmail($settings['email']);
        $user->setFirstName($settings['firstname']);
        $user->setLastName($settings['lastname']);
        $user->setPlainPassword($settings['password']);
        $user->setEnabled($settings['enabled']);

        if (isset($settings['role'])) {
            $user->addRole($settings['role']);
        }

        $userManager->updateUser($user, true);

        $this->addReference('user-'.strtolower($settings['username']), $user);

        return $user;
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 1;
    }
}
