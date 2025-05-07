<?php

declare(strict_types=1);

namespace App\Form\Type;

use App\Form\EventListener\ResizeArrayFormListener;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class ArrayType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $resizeListener = new ResizeArrayFormListener(
            TextType::class,
            [],
            true,
            true
        );

        $builder->addEventSubscriber($resizeListener);
    }

    public function getBlockPrefix(): string
    {
        return 'array';
    }
}
