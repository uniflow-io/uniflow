<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Table(name: 'client')]
#[ORM\Index(name: 'index_search_clients', columns: ['name'])]
#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[UniqueEntity('name', message: "The name '{{ value }}' is already taken.")]
class Client implements \Stringable
{
    use TimestampTrait;

    #[ORM\Id]
    #[ORM\Column(type: \Doctrine\DBAL\Types\Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected ?int $id = null;

    #[Assert\NotBlank(message: 'The name is required')]
    #[ORM\Column(name: 'name', type: \Doctrine\DBAL\Types\Types::STRING, length: 255, nullable: false)]
    protected string $name = '';

    /**
     * @var \Doctrine\Common\Collections\Collection<int, \App\Entity\Program>
     */
    #[ORM\ManyToMany(targetEntity: Program::class, mappedBy: 'clients', cascade: ['persist'])]
    protected Collection $programs;

    public function __construct()
    {
        $this->programs = new ArrayCollection();
    }

    public function __toString(): string
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

    public function setName(string $name): self
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

    public function getPrograms(): Collection
    {
        return $this->programs;
    }
}
