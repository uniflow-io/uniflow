<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Folder;
use App\Form\Transformer\PathTransformer;
use App\Form\Type\ArrayType;
use App\Service\FolderService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FolderType extends AbstractType
{
    public function __construct(protected FolderService $folderService) {}

    /**
     * Build Form.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('name', TextType::class);
        $builder->add('slug', TextType::class);
        $builder->add('path', ArrayType::class, [
            'property_path' => 'parent',
        ]);

        $pathTransformer = new PathTransformer($this->folderService, $options['data']->getUser());
        $builder->get('path')->addModelTransformer($pathTransformer);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Folder::class,
        ]);
    }
}
