<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\HistoryRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="dw_history", indexes={@ORM\Index(name="index_search", columns={"slug", "title"})}, uniqueConstraints={@ORM\UniqueConstraint(name="unique_slug", columns={"user_id", "slug"})})
 * @UniqueEntity(fields={"user", "slug"}, message="The slug '{{ value }}' is already taken.")
 *
 */
class History
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
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="histories", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="cascade")
     */
    protected $user;

    /**
     * @Assert\NotBlank(
     *     message="The client can't be empty"
     * )
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    protected $client;

    /**
     * @var Tag[]
     *
     * @ORM\ManyToMany(targetEntity="App\Entity\Tag", inversedBy="histories", cascade={"persist"})
     * @ORM\JoinTable(name="dw_history_tag")
     */
    protected $tags;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $description;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    protected $public;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    protected $data;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->tags = new ArrayCollection();
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
     * @return History
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
    public function getClient()
    {
        return $this->client;
    }

    /**
     * @param mixed $client
     */
    public function setClient($client): void
    {
        $this->client = $client;
    }

    /**
     * Add tags
     *
     * @param \App\Entity\Tag $tag
     * @return History
     */
    public function addTag(\App\Entity\Tag $tag)
    {
        $this->tags[] = $tag;

        $tag->addHistory($this);

        return $this;
    }

    /**
     * Remove tags
     *
     * @param \App\Entity\Tag $tag
     */
    public function removeTag(\App\Entity\Tag $tag)
    {
        $this->tags->removeElement($tag);

        $tag->removeHistory($this);
    }

    public function removeAllTags()
    {
        foreach ($this->getTags() as $tag) {
            $this->removeTag($tag);
        }
    }

    /**
     * @return Tag[]
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set Description
     *
     * @param $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Get Description
     *
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @return mixed
     */
    public function getPublic()
    {
        return $this->public;
    }

    /**
     * @param mixed $public
     */
    public function setPublic($public)
    {
        $this->public = $public;
    }

    /**
     * Set data
     *
     * @param string $data
     *
     * @return History
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get data
     *
     * @return string
     */
    public function getData()
    {
        return $this->data;
    }
}
