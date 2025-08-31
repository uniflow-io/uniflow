<?php

declare(strict_types=1);

namespace App\Entity\Traits;

use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Timestampable;

trait TimestampTrait
{
    #[Timestampable(on: 'create')]
    #[ORM\Column(name: 'created', type: Types::DATETIME_MUTABLE, nullable: false)]
    protected DateTime $created;

    #[Timestampable(on: 'update')]
    #[ORM\Column(name: 'updated', type: Types::DATETIME_MUTABLE, nullable: false)]
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
