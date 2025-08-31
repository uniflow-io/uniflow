<?php

declare(strict_types=1);

namespace App\Form\Transformer;

use App\Entity\Client;
use App\Service\ClientService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Uid\Uuid;

class ClientTransformer implements DataTransformerInterface
{
    public function __construct(protected ClientService $clientService) {}

    /**
     * @param null|Client[] $clients
     */
    public function transform($clients): mixed
    {
        if (null === $clients) {
            return [];
        }

        $arrayClients = [];
        foreach ($clients as $client) {
            $arrayClients[] = $client->getName();
        }

        return $arrayClients;
    }

    /**
     * @param mixed $arrayClients
     */
    public function reverseTransform($arrayClients): ArrayCollection
    {
        if (null === $arrayClients) {
            return new ArrayCollection();
        }

        $clients = new ArrayCollection();

        foreach ($arrayClients as $clientName) {
            $client = $this->clientService->findOneByClient($clientName);

            if (!$client instanceof Client) {
                $client = new Client();
                $client->setUid(Uuid::v7()->toString());
                $client->setName($clientName);
                $this->clientService->save($client);
            }

            $clients->add($client);
        }

        return $clients;
    }
}
