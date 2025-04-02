<?php

namespace App\Form\Transformer;

use App\Entity\Tag;
use App\Services\TagService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\DataTransformerInterface;

class TagTransformer implements DataTransformerInterface
{
    /**
     * @var TagService
     */
    protected $tagService;

    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    /**
     * @param Tag[]|null $tags
     * @return mixed
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
     * @return ArrayCollection
     */
    public function reverseTransform($arrayTags): mixed
    {
        if (null === $arrayTags) {
            return new ArrayCollection();
        }

        $tags = new ArrayCollection();

        foreach ($arrayTags as $tagName) {
            $tag = $this->tagService->findOneByTag($tagName);

            if (!$tag) {
                $tag = new Tag();
                $tag->setName($tagName);
                $this->tagService->save($tag);
            }

            $tags->add($tag);
        }

        return $tags;
    }
}
