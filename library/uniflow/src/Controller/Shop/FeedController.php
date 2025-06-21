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
class FeedController extends AbstractController
{
    #[Route('/feed', name: 'feed', methods: ['GET'])]
    public function feed(): Response
    {
        return $this->render('shop/changelog.html.twig', [
            'page' => new Page(
                page: 'feed',
                title: 'Feed',
                description: 'Feed',
            ),
        ]);
    }
}
