<?php

declare(strict_types=1);

namespace App\Form;

use App\Entity\Contact;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;

class ContactType extends AbstractType
{
    /**
     * Build Form.
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('email', EmailType::class, [
            'constraints' => [
                new Assert\NotBlank(['message' => 'Email is required']),
                new Assert\Email(['message' => 'Please enter a valid email address']),
            ],
        ]);
        $builder->add('message', TextareaType::class, [
            'constraints' => [
                new Assert\NotBlank(['message' => 'Message is required']),
            ],
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Contact::class,
        ]);
    }
}
