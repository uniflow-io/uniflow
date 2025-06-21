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
class ArticleController extends AbstractController
{
    #[Route('/article/{slug}', name: 'article', methods: ['GET'])]
    public function article(string $slug): Response
    {
        return $this->render('shop/article.html.twig', [
            'page' => new Page(
                page: 'article',
                title: 'Article',
                description: 'Article',
            ),
        ]);
    }
}
