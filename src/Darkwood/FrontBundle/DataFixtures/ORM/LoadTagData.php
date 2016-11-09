<?php

/**
 * Fixture
 *
 * @author Adrien Jerphagnon <adrien.jerphagnon@bigyouth.fr>
 */

namespace Darkwood\FrontBundle\DataFixtures\ORM;

use Darkwood\FrontBundle\Entity\Tag;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class LoadTagData
 *
 * Load user's fixtures
 *
 * @package Darkwood\SiteBundle\DataFixtures\ORM
 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
 */
class LoadTagData extends AbstractFixture implements FixtureInterface, ContainerAwareInterface, OrderedFixtureInterface
{
    /**
     * Container
     *
     * @var ContainerInterface
     */
    private $container;

    /**
     * {@inheritDoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $this->createTag(array(
            'title' => 'Traduction',
        ));

        $this->createTag(array(
            'title' => 'Decleor',
        ));

        $this->createTag(array(
            'title' => 'Ricard',
        ));
    }

    public function createTag($datas = array())
    {
        $tag = new Tag();
        $tag->setTitle(isset($datas['title']) ? $datas['title'] : '');

        $tag = $this->container->get('dw.tag')->save($tag);
        $this->addReference('tag-'.$tag->getTitle(), $tag);

        return $tag;
    }


    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 3;
    }
}
