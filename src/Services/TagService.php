<?php

namespace App\Services;
use App\Entity\Tag;
use App\Repository\TagRepository;


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
     * @var TagRepository tagRepository
     */
    protected $tagRepository;

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
        $this->getEntityManager()->persist($tag);
        $this->getEntityManager()->flush();

        return $tag;
    }

    /**
     * Remove one tag
     *
     * @param Tag $tag
     */
    public function remove(Tag $tag)
    {
        $this->getEntityManager()->remove($tag);
        $this->getEntityManager()->flush();
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
