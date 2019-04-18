<?php

namespace App\Form\Type;

use App\Form\EventListener\ResizeArrayFormListener;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class ArrayType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $resizeListener = new ResizeArrayFormListener(
            '\Symfony\Component\Form\Extension\Core\Type\TextType',
            array(),
            true,
            true
        );

        $builder->addEventSubscriber($resizeListener);
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'array';
    }
}
