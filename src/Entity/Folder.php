<?php

declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use App\Entity\Traits\UidTrait;
use App\Entity\User\ShopUser as User;
use App\Repository\FolderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Slug;
use Stringable;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Table(name: 'uniflow_folder')]
#[ORM\Index(name: 'index_search', columns: ['slug', 'name'])]
#[ORM\Entity(repositoryClass: FolderRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Folder implements Stringable
{
    use TimestampTrait;
    use UidTrait;

    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected ?int $id = null;

    #[Assert\NotBlank(message: 'The name is required')]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: false)]
    protected string $name = '';

    #[Assert\NotBlank(message: 'The slug is required')]
    #[Slug(fields: ['slug'], unique: true, updatable: true)]
    #[ORM\Column(type: Types::STRING, length: 255, unique: true, nullable: false)]
    protected string $slug = '';

    #[Assert\NotBlank(message: 'The user is required')]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'folders', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', onDelete: 'cascade')]
    protected User $user;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', onDelete: 'cascade')]
    protected ?Folder $parent = null;

    /**
     * @var Collection<int, Folder>
     */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent', cascade: ['persist'])]
    protected Collection $children;

    /**
     * @var Collection<int, Program>
     */
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

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    public function addFolder(self $child): self
    {
        $this->children->add($child);
        $child->setParent($this);

        return $this;
    }

    public function removeFolder(self $child): self
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
