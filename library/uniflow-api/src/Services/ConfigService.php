<?php

namespace App\Services;

use App\Entity\Config;
use Doctrine\ORM\EntityManager;
use App\Repository\ConfigRepository;
use Doctrine\ORM\EntityManagerInterface;

class ConfigService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var ConfigRepository
     */
    protected $configRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em = $em;
        $this->configRepository = $this->em->getRepository(Config::class);
    }

    public function save(Config $config): Config
    {
        $config->setUpdated(new \DateTime());

        $this->em->persist($config);
        $this->em->flush();

        return $config;
    }

    public function remove(Config $config): void
    {
        $this->em->remove($config);
        $this->em->flush();
    }

    public function findOne(?int $id = null): ?Config
    {
        return $this->configRepository->findOne($id);
    }

    public function getJson(Config $config): array
    {
        return [
            'mediumToken' => $config->getMediumToken(),
        ];
    }
}
