<?php

declare(strict_types=1);

namespace App\Entity\Traits;

use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Timestampable;
use Symfony\Component\Uid\Ulid;
use Symfony\Bridge\Doctrine\Types\UlidType;

trait UidTrait
{
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    protected Ulid $uid;

    public function __construct()
    {
        $this->uid = new Ulid();
    }

    public function getUid(): Ulid
    {
        return $this->uid;
    }

    public function setUid(Ulid $uid): self
    {
        $this->uid = $uid;

        return $this;
    }
}
