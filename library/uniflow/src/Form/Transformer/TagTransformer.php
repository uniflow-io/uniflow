<?php

declare(strict_types=1);

namespace App\Form\Transformer;

use App\Entity\Tag;
use App\Service\TagService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Uid\Uuid;

class TagTransformer implements DataTransformerInterface
{
    public function __construct(protected TagService $tagService) {}

    /**
     * @param null|Tag[] $tags
     */
    public function transform($tags): mixed
    {
        if (null === $tags) {
            return [];
        }

        $arrayTags = [];
        foreach ($tags as $tag) {
            $arrayTags[] = $tag->getName();
        }

        return $arrayTags;
    }

    /**
     * @param mixed $arrayTags
     */
    public function reverseTransform($arrayTags): ArrayCollection
    {
        if (null === $arrayTags) {
            return new ArrayCollection();
        }

        $tags = new ArrayCollection();

        foreach ($arrayTags as $tagName) {
            $tag = $this->tagService->findOneByTag($tagName);

            if (!$tag) {
                $tag = new Tag();
                $tag->setUid(Uuid::v7()->toString());
                $tag->setName($tagName);
                $this->tagService->save($tag);
            }

            $tags->add($tag);
        }

        return $tags;
    }
}
