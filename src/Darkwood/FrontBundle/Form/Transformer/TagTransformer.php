<?php

namespace Darkwood\FrontBundle\Form\Transformer;

use Darkwood\FrontBundle\Entity\Tag;
use Darkwood\FrontBundle\Services\TagService;
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
    public function __construct($tagService)
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

        foreach($arrayTags as $tag){

            $tag = $this->tagService->findOneByTag($tag);

            if(!$tag){
                $tag = new Tag();
                $tag->setTitle($tag);
                $this->tagService->save($tag);
            }

            $tags->add($tag);
        }

        return $tags;
    }
}
