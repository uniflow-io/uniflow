<?php

namespace App\Form;

use App\Entity\History;
use App\Form\Transformer\TagTransformer;
use App\Services\TagService;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichFileType;

class HistoryType extends AbstractType
{
    /**
     * @var TagService
     */
    protected $tagService;

    /**
     * TagTransformer constructor.
     * @param $tagService
     */
    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    /**
     * Build Form
     *
     * @param FormBuilderInterface $builder
     * @param array                $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title', TextType::class);
        $builder->add('slug', TextType::class);
        $builder->add('platform', TextType::class);
        $builder->add('tags', CollectionType::class, array(
            'entry_type' => TextType::class,
            'allow_add' => true,
            'allow_delete' => true,
        ));
        $builder->add('description', TextareaType::class);

        $tagsTransformer = new TagTransformer($this->tagService);
        $builder->get('tags')->addModelTransformer($tagsTransformer);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => History::class,
        ));
    }
}
