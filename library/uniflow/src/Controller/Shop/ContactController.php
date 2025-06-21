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
class ContactController extends AbstractController
{
    #[Route('/contact', name: 'contact', methods: ['GET'])]
    public function contact(): Response
    {
        return $this->render('shop/changelog.html.twig', [
            'page' => new Page(
                page: 'contact',
                title: 'Contact',
                description: 'Contact',
            ),
        ]);
    }
}
