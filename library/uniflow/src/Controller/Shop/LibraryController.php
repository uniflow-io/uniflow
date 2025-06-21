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
class LibraryController extends AbstractController
{
    #[Route('/library', name: 'library', methods: ['GET'])]
    public function library(): Response
    {
        return $this->render('shop/flows.html.twig', [
            'page' => new Page(
                page: 'library',
                title: 'Library',
                description: 'Library',
            ),
        ]);
    }
}
