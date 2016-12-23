<?php

namespace Darkwood\FrontBundle\Entity;

use Darkwood\FrontBundle\Annotation as Templated;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\ExecutionContextInterface;
use Darkwood\FrontBundle\Entity\Globals;
use Doctrine\ORM\Mapping\Entity;

/**
 * @ORM\Entity(repositoryClass="Darkwood\FrontBundle\Repository\HistoryRepository")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="dw_history", indexes={@ORM\Index(name="index_search", columns={"title"})})
 *
 */
class History
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    protected $title;

    /**
     *
     * @Gedmo\Slug(fields={"title"}, unique=true, updatable=false)
     *
     * @ORM\Column(length=255, unique=true)
     */
    protected $slug;

    /**
     * @var \Datetime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @var \Datetime $updated
     *
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @var Tag[]
     *
     * @ORM\ManyToMany(targetEntity="Darkwood\FrontBundle\Entity\Tag", inversedBy="historys", cascade={"persist"})
     * @ORM\JoinTable(name="dw_history_tag")
     */
    protected $tags;

    /**
     * @ORM\Column(type="text", nullable=false)
     */
    protected $description;

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
        $this->tags = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString() {
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
     * Set created
     *
     * @param \DateTime $created
     * @return History
     */
    public function setCreated($created)
    {
        $this->created = $created;

        return $this;
    }

    /**
     * Get created
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * Set updated
     *
     * @param \DateTime $updated
     * @return History
     */
    public function setUpdated($updated)
    {
        $this->updated = $updated;

        return $this;
    }

    /**
     * Get updated
     *
     * @return \DateTime
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * Add tags
     *
     * @param \Darkwood\FrontBundle\Entity\Tag $tag
     * @return History
     */
    public function addTag(\Darkwood\FrontBundle\Entity\Tag $tag)
    {
        $this->tags[] = $tag;

        $tag->addHistory($this);

        return $this;
    }

    /**
     * Remove tags
     *
     * @param \Darkwood\FrontBundle\Entity\Tag $tag
     */
    public function removeTag(\Darkwood\FrontBundle\Entity\Tag $tag)
    {
        $this->tags->removeElement($tag);

        $tag->removeHistory($this);
    }

    public function removeAllTags()
    {
        foreach($this->getTags() as $tag)
        {
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
