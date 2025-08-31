<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/', name: 'app_shop_')]
class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin', methods: ['GET'])]
    #[IsGranted('ROLE_SUPER_ADMIN')]
    public function admin(): Response
    {
        return $this->render('shop/admin.html.twig', [
            'page' => new Page(
                page: 'admin',
                title: 'Admin',
                description: 'Admin',
            ),
        ]);
    }
}
