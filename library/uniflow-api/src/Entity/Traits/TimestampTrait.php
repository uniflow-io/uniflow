<?php

namespace App\Entity\Traits;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Timestampable;
use DateTime;

trait TimestampTrait
{
    #[Timestampable(on: 'create')]
    #[ORM\Column(name: 'created', type: \Doctrine\DBAL\Types\Types::DATETIME_MUTABLE, nullable: false)]
    protected DateTime $created;

    #[Timestampable(on: 'update')]
    #[ORM\Column(name: 'updated', type: \Doctrine\DBAL\Types\Types::DATETIME_MUTABLE, nullable: false)]
    protected DateTime $updated;

    public function getCreated(): DateTime
    {
        return $this->created;
    }

    public function setCreated(DateTime $created): self
    {
        $this->created = $created;

        return $this;
    }

    public function getUpdated(): DateTime
    {
        return $this->updated;
    }

    public function setUpdated(DateTime $updated): self
    {
        $this->updated = $updated;

        return $this;
    }
}
