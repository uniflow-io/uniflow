<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Config;
use App\Repository\ConfigRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Exception;
use Symfony\Component\Uid\Uuid;

class ConfigService
{
    /**
     * @var ConfigRepository
     */
    protected EntityRepository $configRepository;

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

    public function getConfig(): Config
    {
        $config = $this->findOne();
        if (!$config instanceof Config) {
            $config = new Config();
            $config->setUid(Uuid::v7()->toString());
            $this->save($config);
        }

        return $config;
    }

    public function updateConfig(Config $config, array $data): bool
    {
        if (isset($data['mediumToken'])) {
            $config->setMediumToken($data['mediumToken']);
        }

        try {
            $this->save($config);

            return true;
        } catch (Exception) {
            return false;
        }
    }

    public function getJsonConfig(Config $config): array
    {
        return $this->getJson($config);
    }

    public function getJson(Config $config): array
    {
        return [
            'mediumToken' => $config->getMediumToken(),
        ];
    }
}
