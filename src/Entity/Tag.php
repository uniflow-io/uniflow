<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TagRepository")
 * @ORM\Table(name="dw_tag", indexes={@ORM\Index(name="index_search_tags", columns={"title"})})
 *
 */
class Tag
{
    use TimestampTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @Assert\NotBlank(
     *     message="The title is required"
     * )
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    protected $title;

    /**
     * @var ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="App\Entity\History", mappedBy="tags", cascade={"persist"})
     */
    protected $histories;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->histories = new \Doctrine\Common\Collections\ArrayCollection();
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
     * @param mixed $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Add histories
     *
     * @param \App\Entity\History $history
     * @return Tag
     */
    public function addHistory(\App\Entity\History $history)
    {
        $this->histories[] = $history;

        return $this;
    }

    /**
     * Remove histories
     *
     * @param \App\Entity\History $history
     */
    public function removeHistory(\App\Entity\History $history)
    {
        $this->histories->removeElement($history);
    }

    public function removeAllHistories()
    {
        foreach ($this->getHistories() as $history) {
            $this->removeHistory($history);
        }
    }

    /**
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getHistories()
    {
        return $this->histories;
    }
}
