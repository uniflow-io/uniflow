<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Form\ProgramType;
use App\Model\Page;
use App\Repository\FolderRepository;
use App\Service\FolderService;
use App\Service\ProgramService;
use App\Repository\User\ShopUserRepository;
use App\Repository\ProgramRepository;
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
    public function __construct(
        private ShopUserRepository $shopUserRepository,
        private ProgramRepository $programRepository,
        private ProgramService $programService,
        private FolderRepository $folderRepository,
        private FolderService $folderService,
    ) {}

    #[Route('/feed/{user}{path}', name: 'feed', methods: ['GET'], requirements: ['user' => '[a-zA-Z0-9-]+', 'path' => '.*'])]
    public function feed(string $user, string $path): Response
    {
        if($user === 'me') {
            $user = $this->getUser();
        } else {
            $user = $this->shopUserRepository->findOneByUidOrUsername($user);
        }

        if(!$user) {
            throw $this->createNotFoundException('User not found');
        }

        $program = $this->programRepository->findOneByUserAndPath($user, $path);

        if(!$program) {
            throw $this->createNotFoundException('Program not found');
        }

        $programForm = $this->createForm(ProgramType::class, $program);

        $navigation = [];
        $navigationFolders = $this->folderRepository->findByUserAndParent($user, $program->getFolder());
        foreach($navigationFolders as $navigationFolder) {
            $navigation[] = [
                'type' => 'folder',
                'entity' => $this->folderService->getJsonFolder($navigationFolder),
            ];
        }
        $navigationPrograms = $this->programRepository->findByUserAndFolder($user, $program->getFolder());
        foreach($navigationPrograms as $navigationProgram) {
            $navigation[] = [
                'type' => 'program',
                'entity' => $this->programService->getJsonProgram($navigationProgram),
            ];
        }

        return $this->render('shop/feed/feed.html.twig', [
            'page' => new Page(
                page: 'feed',
                title: 'Feed',
                description: 'Feed',
            ),
            'program' => $program,
            'programForm' => $programForm->createView(),
            'navigation' => $navigation,
        ]);
    }
}
