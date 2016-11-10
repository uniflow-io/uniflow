<?php

namespace Darkwood\FrontBundle\Services;
use Darkwood\CoreBundle\Services\BaseService;
use Darkwood\FrontBundle\Entity\Tag;
use Darkwood\FrontBundle\Repository\TagRepository;


/**
 * Class TagService
 *
 * Object manager of tags
 *
 * @package Darkwood\FrontBundle\Services
 */
class TagService extends BaseService
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

    public function findOneByTag($tag)
    {
        return $this->tagRepository->findOneByTag($tag);
    }
}
