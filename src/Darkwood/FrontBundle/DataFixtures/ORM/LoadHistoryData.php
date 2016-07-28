<?php

/**
 * Fixture
 *
 * @author Adrien Jerphagnon <adrien.jerphagnon@bigyouth.fr>
 */

namespace Darkwood\FrontBundle\DataFixtures\ORM;

use Darkwood\FrontBundle\Entity\Block;
use Darkwood\FrontBundle\Entity\BrickBoolean;
use Darkwood\FrontBundle\Entity\BrickButton;
use Darkwood\FrontBundle\Entity\BrickChoice;
use Darkwood\FrontBundle\Entity\BrickChoiceMulti;
use Darkwood\FrontBundle\Entity\BrickDate;
use Darkwood\FrontBundle\Entity\BrickEntity;
use Darkwood\FrontBundle\Entity\BrickImage;
use Darkwood\FrontBundle\Entity\BrickQuery;
use Darkwood\FrontBundle\Entity\BrickReaction;
use Darkwood\FrontBundle\Entity\BrickSearch;
use Darkwood\FrontBundle\Entity\BrickSitemap;
use Darkwood\FrontBundle\Entity\BrickSlide;
use Darkwood\FrontBundle\Entity\BrickSlider;
use Darkwood\FrontBundle\Entity\BrickText;
use Darkwood\FrontBundle\Entity\BrickTitle;
use Darkwood\FrontBundle\Entity\BrickTwitter;
use Darkwood\FrontBundle\Entity\BrickVideo;
use Darkwood\FrontBundle\Entity\History;
use Darkwood\FrontBundle\Entity\Reaction;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Zend\I18n\Validator\DateTime;

/**
 * Class LoadHistoryData
 *
 * Load user's fixtures
 *
 * @package Bigyouth\SiteBundle\DataFixtures\ORM
 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
 */
class LoadHistoryData extends AbstractFixture implements FixtureInterface, ContainerAwareInterface, OrderedFixtureInterface
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
        $history = new History();
        $history->setTitle('Trads add');

        $this->container->get('dw.history')->save($history);
    }

    /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 7;
    }
}
