<?php

namespace App\Entity;

use App\Entity\Traits\TimestampTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TagRepository")
 * @ORM\Table(name="tag", indexes={@ORM\Index(name="index_search_tags", columns={"title"})})
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
     * @ORM\ManyToMany(targetEntity="App\Entity\Program", mappedBy="tags", cascade={"persist"})
     */
    protected $programs;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->programs = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Add programs
     *
     * @param \App\Entity\Program $program
     * @return Tag
     */
    public function addProgram(\App\Entity\Program $program)
    {
        $this->programs[] = $program;

        return $this;
    }

    /**
     * Remove programs
     *
     * @param \App\Entity\Program $program
     */
    public function removeProgram(\App\Entity\Program $program)
    {
        $this->programs->removeElement($program);
    }

    public function removeAllHistories()
    {
        foreach ($this->getHistories() as $program) {
            $this->removeProgram($program);
        }
    }

    /**
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getHistories()
    {
        return $this->programs;
    }
}
