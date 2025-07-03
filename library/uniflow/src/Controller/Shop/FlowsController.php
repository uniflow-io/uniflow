<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use App\Repository\ProgramRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/', name: 'app_shop_')]
class FlowsController extends AbstractController
{
    public function __construct(
        private ProgramRepository $programRepository,
    ) {}

    #[Route('/flows', name: 'flows', methods: ['GET'])]
    public function flows(): Response
    {
        $programs = $this->programRepository->findLastPublic(10);

        return $this->render('shop/flows.html.twig', [
            'page' => new Page(
                page: 'flows',
                title: 'Flows',
                description: 'Flows',
            ),
            'programs' => $programs,
        ]);
    }
}
