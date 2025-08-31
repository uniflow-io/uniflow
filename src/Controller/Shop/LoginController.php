<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Form\LoginType;
use App\Model\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[Route('/', name: 'app_shop_')]
class LoginController extends AbstractController
{
    public function __construct(
        private readonly UserProviderInterface $userProvider,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EventDispatcherInterface $eventDispatcher
    ) {}

    #[Route('/login', name: 'login', methods: ['GET', 'POST'])]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): Response
    {
        // Get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // Last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        // Create the form
        $form = $this->createForm(LoginType::class, [
            'username' => $lastUsername,
        ]);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();
            $username = $formData['username'];
            $password = $formData['password'];

            // Load the user using the injected user provider
            /** @var PasswordAuthenticatedUserInterface $user */
            $user = $this->userProvider->loadUserByIdentifier($username);

            // Check if the password is valid using the injected password hasher
            if ($this->passwordHasher->isPasswordValid($user, $password)) {
                // Create authentication token
                $token = new UsernamePasswordToken(
                    $user,
                    'shop',
                    $user->getRoles()
                );

                // Set the token in the security context
                $this->container->get('security.token_storage')->setToken($token);

                // Dispatch the interactive login event
                $event = new InteractiveLoginEvent($request, $token);
                $this->eventDispatcher->dispatch($event, 'security.interactive_login');

                return $this->redirectToRoute('app_shop_feed');
            }

            $error = new AuthenticationException('Invalid credentials.');
        }

        return $this->render('shop/login.html.twig', [
            'page' => new Page(
                page: 'login',
                title: 'Login',
                description: 'Login to your account',
            ),
            'form' => $form->createView(),
            'error' => $error,
            'last_username' => $lastUsername,
        ]);
    }
}
