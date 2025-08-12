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
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Uid\Uuid;

#[Route('/', name: 'app_shop_')]
class ProgramController extends AbstractController
{
    public function __construct(
        private ProgramRepository $programRepository,
        private EntityManagerInterface $entityManager,
    ) {}

    #[Route('/program/duplicate/{uid}', name: 'program_duplicate', methods: ['GET'])]
    public function programDuplicate(string $uid): Response
    {
        $user = $this->getUser();
        $program = $this->programRepository->findOneByUid($user, $uid);
        if (!$program) {
            throw $this->createNotFoundException('Program not found');
        }

        // Create a new program instance instead of cloning
        $duplicate = new \App\Entity\Program();

        $duplicate->setUid(Uuid::v7()->toString());
        $duplicate->setName($program->getName() . ' (copy)');
        $duplicate->setSlug($program->getSlug() . '-copy');
        $duplicate->setUser($program->getUser());
        $duplicate->setFolder($program->getFolder());
        $duplicate->setData($program->getData());
        // $duplicate->setIsPublic($program->isPublic());
        // $duplicate->setClients($program->getClients());
        // $duplicate->setTags($program->getTags());
        // $duplicate->setUid(uniqid('', true)); // Generate a new unique ID
        $duplicate->setCreated(new \DateTime());
        $duplicate->setUpdated(new \DateTime());

        $this->entityManager->persist($duplicate);
        $this->entityManager->flush();

        return $this->redirectToRoute('app_shop_feed');
    }

    #[Route('/program/remove/{uid}', name: 'program_remove', methods: ['GET'])]
    public function programRemove(string $uid): Response
    {
        $user = $this->getUser();
        $program = $this->programRepository->findOneByUid($user, $uid);
        $this->entityManager->remove($program);
        $this->entityManager->flush();

        return $this->redirectToRoute('app_shop_feed');
    }
}
