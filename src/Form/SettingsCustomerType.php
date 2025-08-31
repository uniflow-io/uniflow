<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Customer\Customer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SettingsCustomerType extends AbstractType
{
    /**
     * Build Form.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('firstname', TextType::class, [
            'required' => false,
        ]);
        $builder->add('lastname', TextType::class, [
            'required' => false,
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Customer::class,
        ]);
    }
}
