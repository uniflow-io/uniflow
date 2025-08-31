<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Entity\User\ShopUser;
use App\Form\SettingsType;
use App\Model\Page;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/', name: 'app_shop_')]
class SettingsController extends AbstractController
{
    #[Route('/settings', name: 'settings', methods: ['GET', 'POST'])]
    #[IsGranted('ROLE_USER')]
    public function settings(Request $request, EntityManagerInterface $entityManager): Response
    {
        /** @var ShopUser $user */
        $user = $this->getUser();

        $form = $this->createForm(SettingsType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($user);
            $entityManager->flush();

            $this->addFlash('success', 'Your settings have been saved.');

            return $this->redirectToRoute('app_shop_settings');
        }

        return $this->render('shop/settings.html.twig', [
            'page' => new Page(
                page: 'settings',
                title: 'Settings',
                description: 'Settings',
            ),
            'form' => $form->createView(),
            'user' => $user,
        ]);
    }
}
