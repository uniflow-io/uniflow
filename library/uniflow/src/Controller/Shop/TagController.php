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
class TagController extends AbstractController
{
    #[Route('/tag/{slug}', name: 'tag', methods: ['GET'])]
    public function tag(string $slug): Response
    {
        return $this->render('shop/tag.html.twig', [
            'page' => new Page(
                page: 'tag',
                title: 'Tag',
                description: 'Tag',
            ),
        ]);
    }
}
