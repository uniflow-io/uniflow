<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use App\Service\ChangelogService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/', name: 'app_shop_')]
class ChangelogController extends AbstractController
{
    public function __construct(
        private readonly ChangelogService $changelogService
    ) {}

    #[Route('/changelog', name: 'changelog', methods: ['GET'])]
    public function changelog(): Response
    {
        return $this->render('shop/changelog.html.twig', [
            'page' => new Page(
                page: 'changelog',
                title: 'Changelog',
                description: 'Changelog',
            ),
            'changelogItems' => $this->changelogService->getChangelogItems(),
        ]);
    }
}
