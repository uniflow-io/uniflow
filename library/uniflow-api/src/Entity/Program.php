<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"program"}},
 *     collectionOperations={"get"},
 *     itemOperations={
 *         "get"={"security"="is_granted('view', object)"}
 *     },
 * )
 * @ORM\Table(
 *     name="program",
 *     indexes={@ORM\Index(name="index_search", columns={"slug", "name"})},
 *     uniqueConstraints={@ORM\UniqueConstraint(name="unique_slug", columns={"user_id", "slug"})}
 * )
 * @ORM\Entity(repositoryClass="App\Repository\ProgramRepository")
 * @UniqueEntity(fields={"user", "slug"}, message="The slug '{{ value }}' is already taken.")
 * @ORM\HasLifecycleCallbacks
 */
class Program
{
    use TimestampTrait;

    /**
     * @var int|null
     *
     * @Groups({"program"})
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
     * @Groups({"program"})
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
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="programs", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $user;

    /**
     * @var Folder|null
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Folder", inversedBy="programs", cascade={"persist"})
     * @ORM\JoinColumn(name="folder_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $folder;

    /**
     * @var Collection|Client[]
     *
     * @Assert\NotBlank(
     *     message="The client can't be empty"
     * )
     * @ORM\ManyToMany(targetEntity="App\Entity\Client", inversedBy="clients", cascade={"persist"})
     * @ORM\JoinTable(name="program_client")
     */
    protected $clients;

    /**
     * @var Collection|Tag[]
     *
     * @ORM\ManyToMany(targetEntity="App\Entity\Tag", inversedBy="programs", cascade={"persist"})
     * @ORM\JoinTable(name="program_tag")
     */
    protected $tags;

    /**
     * @var string|null
     *
     * @Groups({"program"})
     * @ORM\Column(type="text", nullable=true)
     */
    protected $description;

    /**
     * @var boolean
     *
     * @Groups({"program"})
     * @ORM\Column(type="boolean", nullable=false)
     */
    protected $public = false;

    /**
     * @var string|null
     *
     * @ORM\Column(type="text", nullable=true)
     */
    protected $data;

    public function __construct()
    {
        $this->clients = new ArrayCollection();
        $this->tags = new ArrayCollection();
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

    public function getFolder(): ?Folder
    {
        return $this->folder;
    }

    public function setFolder(?Folder $folder): self
    {
        $this->folder = $folder;

        return $this;
    }

    public function addClient(Client $client): self
    {
        $this->clients->add($client);
        $client->addProgram($this);

        return $this;
    }

    public function removeClient(Client $client): self
    {
        $this->clients->removeElement($client);
        $client->removeProgram($this);

        return $this;
    }

    /**
     * @return Collection|Client[]
     */
    public function getClients(): Collection
    {
        return $this->clients;
    }

    public function addTag(Tag $tag): self
    {
        $this->tags->add($tag);
        $tag->addProgram($this);

        return $this;
    }

    public function removeTag(Tag $tag): self
    {
        $this->tags->removeElement($tag);
        $tag->removeProgram($this);

        return $this;
    }

    /**
     * @return Collection|Tag[]
     */
    public function getTags(): Collection
    {
        return $this->tags;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPublic(): bool
    {
        return $this->public;
    }

    public function setPublic(bool $public): self
    {
        $this->public = $public;

        return $this;
    }

    public function getData(): ?string
    {
        return $this->data;
    }

    public function setData(?string $data): self
    {
        $this->data = $data;

        return $this;
    }
}
