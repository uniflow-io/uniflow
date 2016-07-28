<?php

namespace Darkwood\FrontBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping\Entity;

/**
 * @ORM\Entity(repositoryClass="Darkwood\FrontBundle\Repository\TagRepository")
 * @ORM\Table(name="dw_tag", indexes={@ORM\Index(name="index_search_tags", columns={"title"})})
 *
 */
class Tag
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=false)
     */
    protected $title;

    /**
     * @var \DateTime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    protected $created;

    /**
     * @var \DateTime $updated
     *
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    protected $updated;

    /**
     * @var ArrayCollection
     *
     * @ORM\ManyToMany(targetEntity="Darkwood\FrontBundle\Entity\History", mappedBy="tags", cascade={"persist"})
     */
    protected $historys;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->historys = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set created
     *
     * @param \DateTime $created
     * @return Tag
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
     * @return Tag
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
     * Add historys
     *
     * @param \Darkwood\FrontBundle\Entity\History $history
     * @return Tag
     */
    public function addHistory(\Darkwood\FrontBundle\Entity\History $history)
    {
        $this->historys[] = $history;

        return $this;
    }

    /**
     * Remove historys
     *
     * @param \Darkwood\FrontBundle\Entity\History $history
     */
    public function removeHistory(\Darkwood\FrontBundle\Entity\History $history)
    {
        $this->historys->removeElement($history);
    }

    public function removeAllHistorys()
    {
        foreach($this->getHistorys() as $history)
        {
            $this->removeHistory($history);
        }
    }

    /**
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getHistorys()
    {
        return $this->historys;
    }
}
