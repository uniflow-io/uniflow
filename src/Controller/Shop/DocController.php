<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Yaml\Yaml;
use Twig\Extra\Markdown\DefaultMarkdown as Markdown;

use function count;

#[Route('/', name: 'app_shop_')]
class DocController extends AbstractController
{
    public function __construct(
        private readonly Markdown $markdown,
    ) {}

    #[Route('/docs/{slug?}', name: 'doc', methods: ['GET'])]
    public function doc(?string $slug = null): Response
    {
        $doc = $this->getDoc($slug ?? 'introduction');
        if ($doc === null) {
            throw $this->createNotFoundException('Doc not found');
        }

        $docs = $this->getDocs();

        return $this->render('shop/docs/doc.html.twig', [
            'page' => new Page(
                page: 'doc',
                title: 'Doc',
                description: 'Doc',
            ),
            'docs' => $docs,
            'doc' => $doc,
            'previous' => $this->getPreviousDoc($doc),
            'next' => $this->getNextDoc($doc),
        ]);
    }

    private function getDocs(): ?array
    {
        $docsContent = file_get_contents($this->getParameter('kernel.project_dir') . '/assets/docs/docs.yaml');

        return Yaml::parse($docsContent);
    }

    private function getDoc(?string $slug = null): ?array
    {
        $slugger = new AsciiSlugger();

        $docs = $this->getDocs();

        $docDatas = [];
        $docsDir = $this->getParameter('kernel.project_dir') . '/assets/docs/docs';
        $finder = new Finder();
        $finder->files()->in($docsDir)->depth(0);
        foreach ($finder as $markdownDoc) {
            $doc = [];
            $file = $markdownDoc->getFilename();
            $fileContent = file_get_contents($docsDir . '/' . $file);
            $doc['raw_content'] = $fileContent;

            if (preg_match('/^---\s*(.*?)\s*---\s*(.*)/s', $fileContent, $matches)) {
                $data = Yaml::parse($matches[1]);
                $markdown = $matches[2];
            } else {
                $data = [];
                $markdown = $fileContent;
            }

            $data['slug'] = $slugger->slug($data['title'])->lower()->toString();

            $doc['data'] = $data;
            $doc['markdown'] = $markdown;

            $docDatas[] = $doc;
        }

        $index = 0;
        foreach ($docs as $doc) {
            foreach ($doc['items'] as $item) {
                $itemSlug = $slugger->slug($item['title'])->lower()->toString();
                $index++;

                foreach ($docDatas as $i => $docData) {
                    if ($itemSlug === $docData['data']['slug']) {
                        $docDatas[$i]['data']['index'] = $index;

                        break;
                    }
                }
            }
        }

        foreach ($docDatas as $docData) {
            if ($slug === $docData['data']['slug']) {
                return $docData;
            }
        }

        if ($slug !== null) {
            return null;
        }

        usort($docDatas, static fn ($a, $b) => $a['data']['index'] <=> $b['data']['index']);

        return $docDatas;
    }

    private function getPreviousDoc(array $doc): ?array
    {
        $docs = $this->getDoc();
        $index = array_search($doc['data']['slug'], array_map(static fn ($doc) => $doc['data']['slug'], $docs), true);
        if ($index === false || $index === 0) {
            return null;
        }

        return $docs[$index - 1];
    }

    private function getNextDoc(array $doc): ?array
    {
        $docs = $this->getDoc();
        $index = array_search($doc['data']['slug'], array_map(static fn ($doc) => $doc['data']['slug'], $docs), true);
        if ($index === false || $index === count($docs) - 1) {
            return null;
        }

        return $docs[$index + 1];
    }
}
