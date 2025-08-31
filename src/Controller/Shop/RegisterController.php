<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Entity\Customer\Customer;
use App\Entity\User\ShopUser;
use App\Form\RegisterType;
use App\Model\Page;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/', name: 'app_shop_')]
class RegisterController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/register', name: 'register', methods: ['GET', 'POST'])]
    public function register(Request $request): Response
    {
        $form = $this->createForm(RegisterType::class);
        $form->handleRequest($request);

        $errors = [];

        if ($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();

            // Check if user already exists by checking customer email
            $existingCustomer = $this->entityManager->getRepository(Customer::class)
                ->findOneBy(['email' => $formData['email']])
            ;

            if ($existingCustomer !== null) {
                $errors['email'] = ['This email is already registered.'];
            } else {
                // Create a new user
                $user = new ShopUser();
                $user->setUid(Uuid::v7()->toString());

                // Create a customer and set it on the user
                $customer = new Customer();
                $customer->setEmail($formData['email']);
                $customer->setEmailCanonical($formData['email']);
                $user->setCustomer($customer);

                // Hash the password
                $hashedPassword = $this->passwordHasher->hashPassword($user, $formData['password']);
                $user->setPassword($hashedPassword);

                // Set username to email
                // $user->setUsername($formData['email']);
                // $user->setUsernameCanonical($formData['email']);

                // Set default role and enable the user
                $user->setRoles(['ROLE_USER']);
                $user->setEnabled(true);

                // Persist both customer and user
                $this->entityManager->persist($customer);
                $this->entityManager->persist($user);
                $this->entityManager->flush();

                // Redirect to login page with success message
                $this->addFlash('success', 'Registration successful! Please log in.');

                return $this->redirectToRoute('app_shop_login');
            }
        } elseif ($form->isSubmitted() && !$form->isValid()) {
            // Handle form validation errors
            foreach ($form->getErrors(true) as $error) {
                $fieldName = $error->getOrigin()->getName();
                if (!isset($errors[$fieldName])) {
                    $errors[$fieldName] = [];
                }

                $errors[$fieldName][] = $error->getMessage();
            }
        }

        return $this->render('shop/register.html.twig', [
            'page' => new Page(
                page: 'register',
                title: 'Register',
                description: 'Register',
            ),
            'form' => $form->createView(),
            'errors' => $errors,
        ]);
    }
}
