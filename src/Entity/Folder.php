<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\FolderRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="dw_folder", indexes={@ORM\Index(name="index_search", columns={"slug", "title"})})
 *
 */
class Folder
{
    use TimestampTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @Assert\NotBlank(
     *     message="The title is required"
     * )
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    protected $title;

    /**
     * @Assert\NotBlank(
     *     message="The slug is required"
     * )
     * @Gedmo\Slug(fields={"slug"}, unique=true, updatable=true)
     * @ORM\Column(type="string", length=255, unique=true, nullable=false)
     */
    protected $slug;

    /**
     * @Assert\NotBlank(
     *     message="The user is required"
     * )
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="folders", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Folder", inversedBy="children", cascade={"persist"})
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $parent;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Folder", mappedBy="parent", cascade={"persist"})
     */
    protected $children;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\History", mappedBy="folder", cascade={"persist"})
     */
    protected $histories;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->children = new ArrayCollection();
        $this->histories = new ArrayCollection();
    }

    public function __toString()
    {
        return $this->getTitle();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * @param mixed $slug
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;
    }

    /**
     * Set Title
     *
     * @param $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * Get Title
     *
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set user
     *
     * @param User $user
     *
     * @return Folder
     */
    public function setUser(User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return mixed
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * @param mixed $parent
     */
    public function setParent($parent): void
    {
        $this->parent = $parent;
    }

    /**
     * @param Folder $child
     * @return $this
     */
    public function addFolder(Folder $child)
    {
        $this->children[] = $child;

        $child->setParent($this);

        return $this;
    }

    /**
     * @param Folder $child
     */
    public function removeFolder(Folder $child)
    {
        $this->children->removeElement($child);

        $child->setParent(null);
    }

    /**
     * @return ArrayCollection
     */
    public function getFolders()
    {
        return $this->children;
    }

    /**
     * @param History $history
     * @return $this
     */
    public function addHistory(History $history)
    {
        $this->histories[] = $history;

        $history->setFolder($this);

        return $this;
    }

    /**
     * @param History $history
     */
    public function removeHistory(History $history)
    {
        $this->histories->removeElement($history);

        $history->setFolder(null);
    }

    /**
     * @return ArrayCollection
     */
    public function getHistories()
    {
        return $this->histories;
    }
}
