<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ConfigRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="dw_config")
 *
 */
class Config
{
    use TimestampTrait;

    /**
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

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getMediumToken()
    {
        return $this->mediumToken;
    }

    /**
     * @param mixed $mediumToken
     */
    public function setMediumToken($mediumToken): void
    {
        $this->mediumToken = $mediumToken;
    }

    /**
     * @return mixed
     */
    public function getMediumRefreshToken()
    {
        return $this->mediumRefreshToken;
    }

    /**
     * @param mixed $mediumRefreshToken
     */
    public function setMediumRefreshToken($mediumRefreshToken): void
    {
        $this->mediumRefreshToken = $mediumRefreshToken;
    }
}
