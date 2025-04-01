<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Table(
 *     name="client",
 *     indexes={@ORM\Index(name="index_search_clients", columns={"name"})}
 * )
 * @ORM\Entity(repositoryClass="App\Repository\ClientRepository")
 * @UniqueEntity("name", message="The name '{{ value }}' is already taken.")
 */
class Client
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
     * @var string
     *
     * @Assert\NotBlank(
     *     message="The name is required"
     * )
     * @ORM\Column(name="name", type="string", length=255, nullable=false)
     */
    protected $name = '';

    /**
     * @var Collection|Program[]
     *
     * @ORM\ManyToMany(targetEntity="App\Entity\Program", mappedBy="clients", cascade={"persist"})
     */
    protected $programs;

    public function __construct()
    {
        $this->programs = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getName();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName($name): self
    {
        $this->name = $name;

        return $this;
    }

    public function addProgram(Program $program): self
    {
        $this->programs->add($program);

        return $this;
    }

    public function removeProgram(Program $program): self
    {
        $this->programs->removeElement($program);

        return $this;
    }

    /**
     * @return Collection|Program[]
     */
    public function getPrograms()
    {
        return $this->programs;
    }
}
