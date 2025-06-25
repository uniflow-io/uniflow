<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Form\LoginType;
use App\Model\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/', name: 'app_shop_')]
class LoginController extends AbstractController
{
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
            // The form is valid, but authentication is handled by Symfony's security system
            // The user will be redirected to the target page or login page with error
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
