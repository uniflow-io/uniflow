<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\Traits\TimestampTrait;
use App\Entity\Traits\UidTrait;
use App\Entity\User\ShopUser as User;
use App\Repository\ProgramRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation\Slug;
use Stringable;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
        new Put(),
        new Delete(),
    ]
)]
#[ORM\Table(name: 'program')]
#[ORM\Index(name: 'index_search', columns: ['slug', 'name'])]
#[ORM\UniqueConstraint(name: 'unique_slug', columns: ['user_id', 'slug'])]
#[ORM\Entity(repositoryClass: ProgramRepository::class)]
#[UniqueEntity(fields: ['user', 'slug'], message: "The slug '{{ value }}' is already taken.")]
#[ORM\HasLifecycleCallbacks]
class Program implements Stringable
{
    use TimestampTrait;
    use UidTrait;

    #[Groups(['program'])]
    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue(strategy: 'AUTO')]
    protected ?int $id = null;

    #[Assert\NotBlank(message: 'The name is required')]
    #[Groups(['program'])]
    #[ORM\Column(type: Types::STRING, length: 255, nullable: false)]
    protected string $name = '';

    #[Assert\NotBlank(message: 'The slug is required')]
    #[Slug(fields: ['slug'], unique: true, updatable: true)]
    #[ORM\Column(type: Types::STRING, length: 255, unique: true, nullable: false)]
    protected string $slug = '';

    #[Assert\NotBlank(message: 'The user is required')]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'programs', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', onDelete: 'cascade')]
    protected User $user;

    #[ORM\ManyToOne(targetEntity: Folder::class, inversedBy: 'programs', cascade: ['persist'])]
    #[ORM\JoinColumn(name: 'folder_id', referencedColumnName: 'id', onDelete: 'cascade')]
    protected ?Folder $folder = null;

    /**
     * @var \Doctrine\Common\Collections\Collection<int, \App\Entity\Client>
     */
    #[Assert\NotBlank(message: "The client can't be empty")]
    #[ORM\ManyToMany(targetEntity: Client::class, inversedBy: 'clients', cascade: ['persist'])]
    #[ORM\JoinTable(name: 'program_client')]
    protected Collection $clients;

    /**
     * @var \Doctrine\Common\Collections\Collection<int, \App\Entity\Tag>
     */
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'programs', cascade: ['persist'])]
    #[ORM\JoinTable(name: 'program_tag')]
    protected Collection $tags;

    #[Groups(['program'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    protected ?string $description = null;

    #[Groups(['program'])]
    #[ORM\Column(name: 'is_public', type: Types::BOOLEAN, nullable: false)]
    protected bool $public = false;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    protected ?string $data = null;

    public function __construct()
    {
        $this->clients = new ArrayCollection();
        $this->tags = new ArrayCollection();
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
