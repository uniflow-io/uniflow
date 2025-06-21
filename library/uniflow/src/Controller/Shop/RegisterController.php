<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/', name: 'app_shop_')]
class RegisterController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['GET'])]
    public function register(): Response
    {
        return $this->render('shop/register.html.twig', [
            'page' => new Page(
                page: 'register',
                title: 'Register',
                description: 'Register',
            ),
        ]);
    }
}
