<?php

declare(strict_types=1);

namespace App\Form\Transformer;

use App\Entity\Client;
use App\Services\ClientService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Form\DataTransformerInterface;

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
     *
     * @return ArrayCollection
     */
    public function reverseTransform($arrayClients): mixed
    {
        if (null === $arrayClients) {
            return new ArrayCollection();
        }

        $clients = new ArrayCollection();

        foreach ($arrayClients as $clientName) {
            $client = $this->clientService->findOneByClient($clientName);

            if (!$client) {
                $client = new Client();
                $client->setName($clientName);
                $this->clientService->save($client);
            }

            $clients->add($client);
        }

        return $clients;
    }
}
