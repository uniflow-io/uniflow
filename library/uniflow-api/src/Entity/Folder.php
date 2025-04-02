<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use App\Entity\User\ShopUser as User;
use App\Repository\FolderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Slug;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Table(name: 'folder')]
#[ORM\Index(name: 'index_search', columns: ['slug', 'name'])]
#[ORM\Entity(repositoryClass: FolderRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Folder
{
    use TimestampTrait;

    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected ?int $id = null;

    #[Assert\NotBlank(message: 'The name is required')]
    #[ORM\Column(type: 'string', length: 255, nullable: false)]
    protected string $name = '';

    #[Assert\NotBlank(message: 'The slug is required')]
    #[Slug(fields: ['slug'], unique: true, updatable: true)]
    #[ORM\Column(type: 'string', length: 255, unique: true, nullable: false)]
    protected string $slug = '';

    #[Assert\NotBlank(message: 'The user is required')]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'folders', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', onDelete: 'cascade')]
    protected User $user;

    #[ORM\ManyToOne(targetEntity: Folder::class, inversedBy: 'children', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'cascade')]
    protected ?Folder $parent = null;

    #[ORM\OneToMany(targetEntity: Folder::class, mappedBy: 'parent', cascade: ['persist'])]
    protected Collection $children;

    #[ORM\OneToMany(targetEntity: Program::class, mappedBy: 'folder', cascade: ['persist'])]
    protected Collection $programs;

    public function __construct()
    {
        $this->children = new ArrayCollection();
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

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
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

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getParent(): ?Folder
    {
        return $this->parent;
    }

    public function setParent(?Folder $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    public function addFolder(Folder $child): self
    {
        $this->children->add($child);
        $child->setParent($this);

        return $this;
    }

    public function removeFolder(Folder $child): self
    {
        $this->children->removeElement($child);
        $child->setParent(null);

        return $this;
    }

    public function getFolders(): Collection
    {
        return $this->children;
    }

    public function addProgram(Program $program): self
    {
        $this->programs->add($program);
        $program->setFolder($this);

        return $this;
    }

    public function removeProgram(Program $program): self
    {
        $this->programs->removeElement($program);
        $program->setFolder(null);

        return $this;
    }

    public function getPrograms(): Collection
    {
        return $this->programs;
    }
}
