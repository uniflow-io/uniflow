<?php

/**
 * Form type
 *
 * @author Alexis Smadja <alexis.smadja@bigyouth.fr>
 */

namespace Darkwood\UserBundle\Form\Type;

use Darkwood\UserBundle\Entity\User;
use Darkwood\UserBundle\Form\Transformer\RoleTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;

/**
 *  Form Type
 *
 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
 */
class UserType extends AbstractType
{
    /**
     * Build Form
     *
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('firstName', TextType::class, [
            'label' => 'user.labels.firstName'
        ]);
        $builder->add('lastName', TextType::class, [
            'label' => 'user.labels.lastName'
        ]);
        $builder->add('username', TextType::class, [
            'label' => 'user.labels.username'
        ]);
        $builder->add('email', EmailType::class, [
            'label' => 'user.labels.email'
        ]);

        $builder->add('roles', ChoiceType::class, [
            'label'    => 'user.labels.roles',
            'choices'  => [
                'user.roles.ROLE_SUPER_ADMIN' => 'ROLE_SUPER_ADMIN',
                'user.roles.ROLE_USER'        => 'ROLE_USER'
            ],
            'multiple' => true,
            'expanded' => false,
        ]);

        $builder->add('plainPassword', RepeatedType::class, [
            'type'            => PasswordType::class,
            'first_options'   => [
                'label' => 'user.labels.passwordFirst'
            ],
            'second_options'  => [
                'label' => 'user.labels.passwordSecond'
            ],
            'options'         => [
                'required' => false
            ],
            'invalid_message' => 'errors.password'
        ]);

        $builder->add('enabled', CheckboxType::class, [
            'label'    => 'user.labels.enabled',
            'required' => false,
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class'         => User::class,
            'translation_domain' => 'back',
            'attr'               => [
                'id' => 'form-' . $this->getBlockPrefix()
            ]
        ]);
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getBlockPrefix()
    {
        return 'user';
    }
}
