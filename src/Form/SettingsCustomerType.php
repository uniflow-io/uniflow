<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Customer\Customer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class SettingsCustomerType extends AbstractType
{
    /**
     * Build Form.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('firstname', TextType::class, [
            'constraints' => [
                new Assert\NotBlank([
                    'message' => 'Firstname is required.',
                ]),
                new Assert\Length([
                    'min' => 2,
                    'max' => 100,
                    'minMessage' => 'Firstname must be at least {{ limit }} characters long.',
                    'maxMessage' => 'Firstname cannot be longer than {{ limit }} characters.',
                ]),
            ],
        ]);
        $builder->add('lastname', TextType::class, [
            'constraints' => [
                new Assert\NotBlank([
                    'message' => 'Lastname is required.',
                ]),
                new Assert\Length([
                    'min' => 2,
                    'max' => 100,
                    'minMessage' => 'Lastname must be at least {{ limit }} characters long.',
                    'maxMessage' => 'Lastname cannot be longer than {{ limit }} characters.',
                ]),
            ],
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Customer::class,
        ]);
    }
}
