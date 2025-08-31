<?php

declare(strict_types=1);

namespace App\Entity\User;

use App\Entity\Folder;
use App\Entity\Program;
use App\Entity\Traits\UidTrait;
use App\Repository\User\ShopUserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Sylius\Component\Core\Model\ShopUser as BaseShopUser;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: ShopUserRepository::class)]
#[ORM\Table(name: 'sylius_shop_user')]
class ShopUser extends BaseShopUser implements PasswordAuthenticatedUserInterface
{
    use UidTrait;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    protected ?string $apiKey = null;

    /**
     * @var Collection<int, Program>
     */
    #[ORM\OneToMany(targetEntity: Program::class, mappedBy: 'user', cascade: ['persist'])]
    protected Collection $programs;

    /**
     * @var Collection<int, Folder>
     */
    #[ORM\OneToMany(targetEntity: Folder::class, mappedBy: 'user', cascade: ['persist'])]
    protected Collection $folders;

    public function __construct()
    {
        parent::__construct();
        // UidTrait::__construct();

        $this->programs = new ArrayCollection();
        $this->folders = new ArrayCollection();
    }

    public function getSalt()
    {
        return null;
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getJwtUsername()
    {
        return $this->getUsername() ?? $this->getUid();
    }
}
