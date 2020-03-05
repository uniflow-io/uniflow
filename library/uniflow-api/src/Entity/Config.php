<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="config")
 * @ORM\Entity(repositoryClass="App\Repository\ConfigRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Config
{
    use TimestampTrait;

    /**
     * @var int|null
     *
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $mediumToken;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $mediumRefreshToken;

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
