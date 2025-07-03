<?php

declare(strict_types=1);

namespace App\Entity\Traits;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

trait UidTrait
{
    #[ORM\Column(type: Types::STRING, length: 36, unique: true, nullable: false)]
    protected string $uid = '';

    /*public function __construct()
    {
        $this->uid = Uuid::v7()->toString();
    }*/

    public function getUid(): string
    {
        return $this->uid;
    }

    public function setUid(string $uid): self
    {
        $this->uid = $uid;

        return $this;
    }
}
