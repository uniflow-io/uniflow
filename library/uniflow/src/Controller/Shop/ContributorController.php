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
class ContributorController extends AbstractController
{
    #[Route('/contributor/{slug}', name: 'contributor', methods: ['GET'])]
    public function contributor(string $slug): Response
    {
        return $this->render('shop/contributor.html.twig', [
            'page' => new Page(
                page: 'contributor',
                title: 'Contributor',
                description: 'Contributor',
            ),
        ]);
    }
}
