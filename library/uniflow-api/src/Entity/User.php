<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity("email", message="The email '{{ value }}' is already used.")
 * @UniqueEntity("username", message="The username '{{ value }}' is already taken.")
 */
class User implements UserInterface, \Serializable
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
     * @Assert\Length(
     *      min = 2,
     *      max = 32,
     *      minMessage = "The username must be at least {{ limit }} characters long",
     *      maxMessage = "The username cannot be longer than {{ limit }} characters"
     * )
     * @ORM\Column(type="string", length=32, unique=true, nullable=true)
     */
    protected $username = '';

    /**
     * @var string
     *
     * @Assert\NotBlank(
     *     message="An email is required"
     * )
     * @Assert\Email(
     *     message = "The email '{{ value }}' is not a valid email.",
     *     mode = "strict"
     * )
     * @ORM\Column(type="string", length=255, unique=true, nullable=false)
     */
    protected $email = '';

    /**
     * @var string
     *
     * @Assert\NotBlank(
     *     message="A password is required"
     * )
     * @ORM\Column(type="string", length=64, nullable=false)
     */
    protected $password = '';

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $firstname;

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $lastname;

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $facebookId;

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $githubId;

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $apiKey;

    /**
     * @var Collection|Program[]
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Program", mappedBy="user", cascade={"persist"})
     */
    protected $programs;

    /**
     * @var Collection|Folder[]
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Folder", mappedBy="user", cascade={"persist"})
     */
    protected $folders;

    /**
     * @var array
     *
     * @ORM\Column(type="array")
     */
    protected $roles = [];

    public function __construct()
    {
        $this->programs = new ArrayCollection();
        $this->folders = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->firstname . ' ' . $this->lastname;
    }

    public function getSalt()
    {
        return null;
    }

    public function eraseCredentials()
    {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(?string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFacebookId(): ?string
    {
        return $this->facebookId;
    }

    public function setFacebookId(?string $facebookId): self
    {
        $this->facebookId = $facebookId;

        return $this;
    }

    public function getGithubId(): ?string
    {
        return $this->githubId;
    }

    public function setGithubId(?string $githubId): self
    {
        $this->githubId = $githubId;

        return $this;
    }

    public function getApiKey(): ?string
    {
        return $this->apiKey;
    }

    public function setApiKey(?string $apiKey): self
    {
        $this->apiKey = $apiKey;

        return $this;
    }

    public function addProgram(Program $program): self
    {
        $this->programs->add($program);
        $program->setUser($this);

        return $this;
    }

    public function removeProgram(Program $program): self
    {
        $this->programs->removeElement($program);
        $program->setUser(null);

        return $this;
    }

    /**
     * @return Collection|Program[]
     */
    public function getPrograms(): Collection
    {
        return $this->programs;
    }

    public function addFolder(Folder $folder): self
    {
        $this->folders->add($folder);
        $folder->setUser($this);

        return $this;
    }

    public function removeFolder(Folder $folder): self
    {
        $this->folders->removeElement($folder);
        $folder->setUser(null);

        return $this;
    }

    /**
     * @return Collection|Folder[]
     */
    public function getFolders(): Collection
    {
        return $this->folders;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;

        if (empty($roles)) {
            $roles[] = 'ROLE_USER';
        }

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function serialize()
    {
        return serialize([
            $this->id,
            $this->email,
            $this->password,
            // $this->salt,
        ]);
    }

    public function unserialize($serialized)
    {
        [
            $this->id,
            $this->email,
            $this->password,
            // $this->salt
        ] = unserialize($serialized, ['allowed_classes' => false]);
    }
}
