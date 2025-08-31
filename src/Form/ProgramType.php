<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Program;
use App\Form\Transformer\ClientTransformer;
use App\Form\Transformer\PathTransformer;
use App\Form\Transformer\TagTransformer;
use App\Form\Type\ArrayType;
use App\Service\ClientService;
use App\Service\FolderService;
use App\Service\TagService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProgramType extends AbstractType
{
    public function __construct(protected ClientService $clientService, protected TagService $tagService, protected FolderService $folderService) {}

    /**
     * Build Form.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('name', TextType::class);
        $builder->add('slug', TextType::class);
        $builder->add('clients', CollectionType::class, [
            'entry_type' => TextType::class,
            'allow_add' => true,
            'allow_delete' => true,
        ]);
        $builder->add('tags', CollectionType::class, [
            'entry_type' => TextType::class,
            'allow_add' => true,
            'allow_delete' => true,
        ]);
        $builder->add('description', TextareaType::class);
        $builder->add('public', CheckboxType::class);
        /*$builder->add('path', ArrayType::class, [
            'property_path' => 'folder',
        ]);*/

        $clientTransformer = new ClientTransformer($this->clientService);
        $builder->get('clients')->addModelTransformer($clientTransformer);
        $tagTransformer = new TagTransformer($this->tagService);
        $builder->get('tags')->addModelTransformer($tagTransformer);
        // $pathTransformer = new PathTransformer($this->folderService, $options['data']->getUser());
        // $builder->get('path')->addModelTransformer($pathTransformer);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Program::class,
        ]);
    }
}
