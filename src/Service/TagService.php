<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Tag;
use App\Repository\TagRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class TagService
{
    /**
     * @var TagRepository
     */
    protected EntityRepository $tagRepository;

    public function __construct(
        protected EntityManagerInterface $em
    ) {
        $this->tagRepository = $this->em->getRepository(Tag::class);
    }

    public function save(Tag $tag): Tag
    {
        $tag->setUpdated(new DateTime());
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
