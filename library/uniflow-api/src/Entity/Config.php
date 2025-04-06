<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use App\Repository\ConfigRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'config')]
#[ORM\Entity(repositoryClass: ConfigRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Config
{
    use TimestampTrait;

    #[ORM\Id]
    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected ?int $id = null;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 255, nullable: true)]
    protected ?string $mediumToken = null;

    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::STRING, length: 255, nullable: true)]
    protected ?string $mediumRefreshToken = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMediumToken(): ?string
    {
        return $this->mediumToken;
    }

    public function setMediumToken(?string $mediumToken): self
    {
        $this->mediumToken = $mediumToken;

        return $this;
    }

    public function getMediumRefreshToken(): ?string
    {
        return $this->mediumRefreshToken;
    }

    public function setMediumRefreshToken(?string $mediumRefreshToken): self
    {
        $this->mediumRefreshToken = $mediumRefreshToken;

        return $this;
    }
}
