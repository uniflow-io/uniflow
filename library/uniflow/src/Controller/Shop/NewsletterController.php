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
class NewsletterController extends AbstractController
{
    #[Route('/newsletter', name: 'newsletter', methods: ['GET'])]
    public function newsletter(): Response
    {
        return $this->render('shop/newsletter.html.twig', [
            'page' => new Page(
                page: 'newsletter',
                title: 'Newsletter',
                description: 'Newsletter',
            ),
        ]);
    }
}
