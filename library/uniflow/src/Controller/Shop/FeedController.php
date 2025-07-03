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
    #[Route('/feed/{username}/{slug}', name: 'feed', methods: ['GET'], requirements: ['username' => '[a-zA-Z0-9-]+', 'slug' => '.+'])]
    public function feed(string $username, string $slug): Response
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
