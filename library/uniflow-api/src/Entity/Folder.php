<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Table(
 *     name="folder",
 *     indexes={@ORM\Index(name="index_search", columns={"slug", "name"})}
 * )
 * @ORM\Entity(repositoryClass="App\Repository\FolderRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Folder
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
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    protected $name = '';

    /**
     * @var string
     *
     * @Assert\NotBlank(
     *     message="The slug is required"
     * )
     * @Gedmo\Slug(fields={"slug"}, unique=true, updatable=true)
     * @ORM\Column(type="string", length=255, unique=true, nullable=false)
     */
    protected $slug = '';

    /**
     * @var User
     *
     * @Assert\NotBlank(
     *     message="The user is required"
     * )
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="folders", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $user;

    /**
     * @var Folder|null
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Folder", inversedBy="children", cascade={"persist"})
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $parent;

    /**
     * @var Collection|Folder[]
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Folder", mappedBy="parent", cascade={"persist"})
     */
    protected $children;

    /**
     * @var Collection|Program[]
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Program", mappedBy="folder", cascade={"persist"})
     */
    protected $programs;

    public function __construct()
    {
        $this->children = new ArrayCollection();
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

    public function setParent($parent): self
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

    /**
     * @return Collection|Program[]
     */
    public function getPrograms(): Collection
    {
        return $this->programs;
    }
}
