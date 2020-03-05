<?php

namespace App\Services;

use App\Entity\Tag;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;

class TagService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var TagRepository
     */
    protected $tagRepository;

    public function __construct(
        EntityManagerInterface $em
    ) {
        $this->em            = $em;
        $this->tagRepository = $this->em->getRepository(Tag::class);
    }

    public function save(Tag $tag): Tag
    {
        $tag->setUpdated(new \DateTime());
        $this->em->persist($tag);
        $this->em->flush();

        return $tag;
    }

    public function remove(Tag $tag): void
    {
        $this->em->remove($tag);
        $this->em->flush();
    }

    public function clean(): void
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
