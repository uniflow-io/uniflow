<?php

namespace App\Form\Transformer;

use App\Entity\Client;
use App\Services\ClientService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\DataTransformerInterface;

class ClientTransformer implements DataTransformerInterface
{
    /**
     * @var ClientService
     */
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    /**
     * @param Client[] $clients
     * @return mixed|string
     */
    public function transform($clients)
    {
        $arrayClients = [];

        foreach ($clients as $client) {
            $arrayClients[] = $client->getName();
        }

        return $arrayClients;
    }

    /**
     * Transforms the value the users has typed to a value that suits the field in the Document
     */
    public function reverseTransform($arrayClients)
    {
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
