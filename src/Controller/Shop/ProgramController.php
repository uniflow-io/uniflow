<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Entity\Program;
use App\Repository\ProgramRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;

#[Route('/', name: 'app_shop_')]
class ProgramController extends AbstractController
{
    public function __construct(
        private readonly ProgramRepository $programRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {}

    #[Route('/program/duplicate/{uid}', name: 'program_duplicate', methods: ['GET'])]
    public function programDuplicate(string $uid): Response
    {
        $user = $this->getUser();
        $program = $this->programRepository->findOneByUid($user, $uid);
        if (!$program instanceof Program) {
            throw $this->createNotFoundException('Program not found');
        }

        // Create a new program instance instead of cloning
        $duplicate = new Program();

        $duplicate->setUid(Uuid::v7()->toString());
        $duplicate->setName($program->getName() . ' (copy)');
        $duplicate->setSlug($program->getSlug() . '-copy');
        $duplicate->setUser($program->getUser());
        $duplicate->setFolder($program->getFolder());
        $duplicate->setData($program->getData());
        $duplicate->setCreated(new DateTime());
        $duplicate->setUpdated(new DateTime());

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
