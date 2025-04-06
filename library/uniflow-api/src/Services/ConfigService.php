<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Config;
use App\Repository\ConfigRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

class ConfigService
{
    /**
     * @var ConfigRepository
     */
    protected $configRepository;

    public function __construct(
        protected EntityManagerInterface $em
    ) {
        $this->configRepository = $this->em->getRepository(Config::class);
    }

    public function save(Config $config): Config
    {
        $config->setUpdated(new DateTime());

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
