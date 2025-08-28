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
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
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
        private JWTTokenManagerInterface $jwtManager,
    ) {}

    #[Route('/feed/{user?me}{path?}', name: 'feed', methods: ['GET', 'POST'], requirements: ['user' => '[a-zA-Z0-9-]+', 'path' => '.*'])]
    public function feed(Request $request, string $user = 'me', ?string $path = null): Response
    {
        if($user === 'me') {
            $user = $this->getUser();
        } else {
            $user = $this->shopUserRepository->findOneByUidOrUsername($user);
        }

        if(!$user) {
            throw $this->createNotFoundException('User not found');
        }

        $search = $request->get('search');
        if($search !== null) {
            $program = $this->programService->createProgram($user, ['name' => $search]);
            $program = $this->programService->getJsonProgram($program);
            return $this->redirectToRoute('app_shop_feed', ['user' => $program['user'], 'path' => $program['path']]);
        }

        $program = $this->programRepository->findOneByUserAndPath($user, $path);
        $folder = null;
        if($program !== null) {
            $folder = $program->getFolder();
        }

        $programForm = $this->createForm(ProgramType::class, $program);

        $navigation = [];
        $navigationFolders = $this->folderRepository->findByUserAndParent($user, $folder);
        foreach($navigationFolders as $navigationFolder) {
            $navigation[] = [
                'type' => 'folder',
                'entity' => $this->folderService->getJsonFolder($navigationFolder),
            ];
        }
        $navigationPrograms = $this->programRepository->findByUserAndFolder($user, $folder);
        foreach($navigationPrograms as $navigationProgram) {
            $navigation[] = [
                'type' => 'program',
                'entity' => $this->programService->getJsonProgram($navigationProgram),
            ];
        }


        $token = null;
        $currentUser = $this->getUser();
        if($currentUser && $currentUser->getId() === $user->getId()) {
            $token = $this->jwtManager->create($user);
        }

        return $this->render('shop/feed/feed.html.twig', [
            'page' => new Page(
                page: 'feed',
                title: 'Feed',
                description: 'Feed',
            ),
            'folder' => $folder,
            'program' => $program,
            'programForm' => $programForm->createView(),
            'navigation' => $navigation,
            'token' => $token,
        ]);
    }
}
