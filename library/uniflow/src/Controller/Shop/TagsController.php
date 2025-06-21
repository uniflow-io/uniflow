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
class TagsController extends AbstractController
{
    #[Route('/tags', name: 'tags', methods: ['GET'])]
    public function tags(): Response
    {
        return $this->render('shop/tags.html.twig', [
            'page' => new Page(
                page: 'tags',
                title: 'Tags',
                description: 'Tags',
            ),
        ]);
    }
}
