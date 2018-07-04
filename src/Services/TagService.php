<?php

namespace App\Services;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;


/**
 * Class TagService
 *
 * Object manager of tags
 *
 * @package App\Services
 */
class TagService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var TagRepository tagRepository
     */
    protected $tagRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em            = $em;
        $this->tagRepository = $this->em->getRepository(Tag::class);
    }

    /**
     * Update a tag
     *
     * @param Tag $tag
     *
     * @return Tag
     */
    public function save(Tag $tag)
    {
        $tag->setUpdated(new \DateTime('now'));
        $this->em->persist($tag);
        $this->em->flush();

        return $tag;
    }

    /**
     * Remove one tag
     *
     * @param Tag $tag
     */
    public function remove(Tag $tag)
    {
        $this->em->remove($tag);
        $this->em->flush();
    }

    public function clean()
    {
        $tags = $this->tagRepository->findOrphan();

        foreach ($tags as $tag) {
            $this->remove($tag);
        }
    }

    public function findOneByTag($tag)
    {
        return $this->tagRepository->findOneByTag($tag);
    }
}
