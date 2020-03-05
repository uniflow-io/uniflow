<?php

namespace App\Services;

use App\Entity\Client;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;

class ClientService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var ClientRepository
     */
    protected $clientRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em = $em;
        $this->clientRepository = $this->em->getRepository(Client::class);
    }

    public function save(Client $client): Client
    {
        $client->setUpdated(new \DateTime());

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
