<?php

declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use App\Entity\Traits\UidTrait;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Stringable;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Table(name: 'uniflow_client')]
#[ORM\Index(name: 'index_search_clients', columns: ['name'])]
#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[UniqueEntity('name', message: "The name '{{ value }}' is already taken.")]
class Client implements Stringable
{
    use TimestampTrait;
    use UidTrait;

    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected ?int $id = null;

    #[Assert\NotBlank(message: 'The name is required')]
    #[ORM\Column(name: 'name', type: Types::STRING, length: 255, nullable: false)]
    protected string $name = '';

    /**
     * @var Collection<int, Program>
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
