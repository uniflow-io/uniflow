<?php

namespace App\Services;

use App\Entity\Config;
use Doctrine\ORM\EntityManager;
use App\Repository\ConfigRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ConfigService
 * `
 * Object manager of config.
 */
class ConfigService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * Repository
     *
     * @var ConfigRepository
     */
    protected $configRepository;

    public function __construct(
        EntityManagerInterface $em
    ) {
        $this->em             = $em;
        $this->configRepository = $this->em->getRepository(Config::class);
    }

    /**
     * Save one config
     *
     * @param Config $config
     * @return Config
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function save(Config $config)
    {
        // Save config
        $config->setUpdated(new \DateTime());

        $this->em->persist($config);
        $this->em->flush();

        return $config;
    }

    /**
     * Remove one config
     *
     * @param Config $config
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function remove(Config $config)
    {
        $this->em->remove($config);
        $this->em->flush();
    }

    /**
     * @return Config[]
     */
    public function findAll()
    {
        return $this->configRepository->findAll();
    }

    /**
     * @param null $id
     * @return Config
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        return $this->configRepository->findOne($id);
    }

    public function getJson(Config $config)
    {
        return array(
            'mediumToken' => $config->getMediumToken(),
        );
    }
}
