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
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\String\Slugger\AsciiSlugger;

#[Route('/', name: 'app_shop_')]
class LibraryController extends AbstractController
{
    #[Route('/library/{slug?}', name: 'library', methods: ['GET'])]
    public function library(?string $slug = null): Response
    {
        $library = $this->getLibrary();

        if($slug === null) {
            return $this->render('shop/library/library.html.twig', [
                'page' => new Page(
                    page: 'library',
                    title: 'Library',
                    description: 'Library',
                ),
                'library' => $library,
                'card' => [
                    'slug' => null,
                ]
            ]);
        }

        $card = $this->getCard($slug);
        if($card === null) {
            throw $this->createNotFoundException('Card not found');
        }

        $card['readme'] = file_get_contents(sprintf(
            __DIR__ . '/../../../library/%s/README.md',
            str_replace('@uniflow-io/', '', $card['package'])
        ));

        return $this->render('shop/library/card.html.twig', [
            'page' => new Page(
                page: 'library',
                title: 'Library',
                description: 'Library',
            ),
            'library' => $library,
            'card' => $card,
        ]);
    }

    private function getLibrary(): array|null
    {
        $slugger = new AsciiSlugger();

        $libraryContent = file_get_contents($this->getParameter('kernel.project_dir') . '/assets/docs/library.yaml');
        $library = Yaml::parse($libraryContent);

        foreach($library as $key => $card) {
            $library[$key]['slug'] = $slugger->slug($card['title'])->lower()->toString();
        }

        return $library;
    }

    private function getCard(?string $slug = null): array|null
    {
        $library = $this->getLibrary();

        foreach($library as $card) {
            if($card['slug'] === $slug) {
                return $card;
            }
        }

        if($slug !== null) {
            return null;
        }

        return $library[0];
    }
}
