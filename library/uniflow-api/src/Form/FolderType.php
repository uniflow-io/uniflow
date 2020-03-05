<?php

namespace App\Form;

use App\Entity\Folder;
use App\Form\Transformer\PathTransformer;
use App\Form\Type\ArrayType;
use App\Services\FolderService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FolderType extends AbstractType
{
    /**
     * @var FolderService
     */
    protected $folderService;

    public function __construct(FolderService $folderService)
    {
        $this->folderService = $folderService;
    }

    /**
     * Build Form
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class);
        $builder->add('slug', TextType::class);
        $builder->add('path', ArrayType::class, [
            'property_path' => 'parent',
        ]);

        $pathTransformer = new PathTransformer($this->folderService, $options['data']->getUser());
        $builder->get('path')->addModelTransformer($pathTransformer);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Folder::class,
        ]);
    }
}
