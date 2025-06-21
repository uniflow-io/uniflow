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
class DocController extends AbstractController
{
    #[Route('/doc/{slug?}', name: 'doc', methods: ['GET'])]
    public function doc(string $slug = 'index'): Response
    {
        return $this->render('shop/doc.html.twig', [
            'page' => new Page(
                page: 'doc',
                title: 'Doc',
                description: 'Doc',
            ),
        ]);
    }
}
