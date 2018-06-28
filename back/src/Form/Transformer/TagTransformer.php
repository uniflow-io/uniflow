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

    /**
     * TagTransformer constructor.
     * 
     * @param $tagService
     */
    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    /**
     * @param Tag[] $tags
     * @return mixed|string
     */
    public function transform($tags)
    {
        $arrayTags = array();

        foreach($tags as $tag){
            $arrayTags[] = $tag->getTitle();
        }

        return $arrayTags;
    }

    /**
     * Transforms the value the users has typed to a value that suits the field in the Document
     */
    public function reverseTransform($arrayTags)
    {
        $tags = new ArrayCollection();

        foreach($arrayTags as $tagTitle){

            $tag = $this->tagService->findOneByTag($tagTitle);

            if(!$tag){
                $tag = new Tag();
                $tag->setTitle($tagTitle);
                $this->tagService->save($tag);
            }

            $tags->add($tag);
        }

        return $tags;
    }
}
