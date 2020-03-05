<?php

namespace App\DataFixtures;

use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ClientFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        foreach (['uniflow', 'node', 'chome', 'jetbrains', 'rust'] as $name) {
            $client = new Client();
            $client->setName($name);

            $manager->persist($client);
        }

        $manager->flush();
    }
}
