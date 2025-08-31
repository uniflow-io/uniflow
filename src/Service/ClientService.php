<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Client;
use App\Repository\ClientRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class ClientService
{
    /**
     * @var ClientRepository
     */
    protected EntityRepository $clientRepository;

    public function __construct(
        protected EntityManagerInterface $em
    ) {
        $this->clientRepository = $this->em->getRepository(Client::class);
    }

    public function save(Client $client): Client
    {
        $client->setUpdated(new DateTime());

        $this->em->persist($client);
        $this->em->flush();

        return $client;
    }

    public function remove(Client $client): void
    {
        $this->em->remove($client);
        $this->em->flush();
    }

    public function clean(): void
    {
        $clients = $this->clientRepository->findOrphan();

        foreach ($clients as $client) {
            $this->remove($client);
        }
    }

    public function findOneByClient(string $client): ?Client
    {
        return $this->clientRepository->findOneByClient($client);
    }
}
