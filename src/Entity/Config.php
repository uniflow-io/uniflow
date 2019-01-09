<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ConfigRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="dw_config", indexes={@ORM\Index(name="index_search", columns={"slug", "title"})}, uniqueConstraints={@ORM\UniqueConstraint(name="unique_slug", columns={"user_id", "slug"})})
 * @UniqueEntity(fields={"user", "slug"}, message="The slug '{{ value }}' is already taken.")
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
}
