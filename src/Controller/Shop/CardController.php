<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/', name: 'app_shop_')]
class CardController extends AbstractController
{
    #[Route('/card/{slug}', name: 'card', methods: ['GET'])]
    public function card(string $slug): Response
    {
        return $this->render('shop/card.html.twig', [
            'page' => new Page(
                page: 'card',
                title: 'Card',
                description: 'Card',
            ),
        ]);
    }
}
