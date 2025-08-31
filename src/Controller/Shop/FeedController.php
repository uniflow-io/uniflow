<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Entity\Program;
use App\Form\ProgramType;
use App\Model\Page;
use App\Repository\FolderRepository;
use App\Repository\ProgramRepository;
use App\Repository\User\ShopUserRepository;
use App\Service\FolderService;
use App\Service\ProgramService;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

#[Route('/', name: 'app_shop_')]
class FeedController extends AbstractController
{
    public function __construct(
        private readonly ShopUserRepository $shopUserRepository,
        private readonly ProgramRepository $programRepository,
        private readonly ProgramService $programService,
        private readonly FolderRepository $folderRepository,
        private readonly FolderService $folderService,
        private readonly JWTTokenManagerInterface $jwtManager,
    ) {}

    #[Route('/feed/{user?me}{path?}', name: 'feed', methods: ['GET', 'POST'], requirements: ['user' => '[a-zA-Z0-9-]+', 'path' => '.*'])]
    public function feed(Request $request, string $user = 'me', ?string $path = null): Response
    {
        $user = $user === 'me' ? $this->getUser() : $this->shopUserRepository->findOneByUidOrUsername($user);

        if (!$user instanceof UserInterface) {
            throw $this->createNotFoundException('User not found');
        }

        $search = $request->get('search');
        if ($search !== null) {
            $program = $this->programService->createProgram($user, ['name' => $search]);
            $program = $this->programService->getJsonProgram($program);

            return $this->redirectToRoute('app_shop_feed', ['user' => $program['user'], 'path' => $program['path']]);
        }

        $program = $this->programRepository->findOneByUserAndPath($user, $path);
        $folder = null;
        if ($program instanceof Program) {
            $folder = $program->getFolder();
        }

        $programForm = $this->createForm(ProgramType::class, $program);

        $navigation = [];
        $navigationFolders = $this->folderRepository->findByUserAndParent($user, $folder);
        foreach ($navigationFolders as $navigationFolder) {
            $navigation[] = [
                'type' => 'folder',
                'entity' => $this->folderService->getJsonFolder($navigationFolder),
            ];
        }

        $navigationPrograms = $this->programRepository->findByUserAndFolder($user, $folder);
        foreach ($navigationPrograms as $navigationProgram) {
            $navigation[] = [
                'type' => 'program',
                'entity' => $this->programService->getJsonProgram($navigationProgram),
            ];
        }

        $token = null;
        $currentUser = $this->getUser();
        if ($currentUser && $currentUser->getId() === $user->getId()) {
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
