<?php

declare(strict_types=1);

namespace App\Entity\User;

use App\Entity\Folder;
use App\Entity\Program;
use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\ORM\Mapping as ORM;
use Sylius\Component\Core\Model\ShopUser as BaseShopUser;

#[ORM\Entity]
#[ORM\Table(name: 'sylius_shop_user')]
class ShopUser extends BaseShopUser implements PasswordAuthenticatedUserInterface
{
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


    public function __construct()
    {
        parent::__construct();

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

    public function getId(): ?int
    {
        return $this->id;
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
