<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use App\Model\Page;
use App\Service\AppService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Yaml\Yaml;
use Twig\Extra\Markdown\DefaultMarkdown as Markdown;

use function count;
use function in_array;

#[Route('/', name: 'app_shop_')]
class BlogController extends AbstractController
{
    public function __construct(
        private readonly AppService $appService,
        private readonly Markdown $markdown,
    ) {}

    #[Route('/blog', name: 'blog', methods: ['GET'])]
    public function blog(): Response
    {
        $articles = $this->getBlogArticles();

        return $this->render('shop/blog.html.twig', [
            'page' => new Page(
                page: 'blog',
                title: 'Blog',
                description: 'Blog',
            ),
            'articles' => $articles,
        ]);
    }

    #[Route('/blog/tags', name: 'tags', methods: ['GET'])]
    public function tags(): Response
    {
        $articles = $this->getBlogArticles();
        $tags = [];

        foreach ($articles as $article) {
            foreach ($article['data']['tags'] as $tag) {
                $tags[$tag] = [
                    'tag' => $tag,
                    'count' => isset($tags[$tag]) ? $tags[$tag]['count'] + 1 : 1,
                ];
            }
        }

        return $this->render('shop/blog/tags.html.twig', [
            'page' => new Page(
                page: 'tags',
                title: 'Tags',
                description: 'Tags',
            ),
            'tags' => $tags,
        ]);
    }

    #[Route('/blog/tag/{slug}', name: 'tag', methods: ['GET'])]
    public function tag(string $slug): Response
    {
        $articles = $this->getBlogArticles();
        $articles = array_filter($articles, static fn ($article) => in_array($slug, $article['data']['tags'], true));

        return $this->render('shop/blog/tag.html.twig', [
            'page' => new Page(
                page: 'tag',
                title: 'Tag',
                description: 'Tag',
            ),
            'articles' => $articles,
        ]);
    }

    #[Route('/blog/{slug}', name: 'article', methods: ['GET'])]
    public function article(string $slug): Response
    {
        $article = $this->getBlogArticles($slug);

        if ($article === null) {
            throw $this->createNotFoundException('Article not found');
        }

        return $this->render('shop/blog/article.html.twig', [
            'page' => new Page(
                page: 'article',
                title: 'Article',
                description: 'Article',
            ),
            'article' => $article,
            'previous' => $this->getPreviousArticle($article),
            'next' => $this->getNextArticle($article),
        ]);
    }

    #[Route('/contributor/{slug}', name: 'contributor', methods: ['GET'])]
    public function contributor(string $slug): Response
    {
        $contributor = $this->getContributors($slug);

        if ($contributor === null) {
            throw $this->createNotFoundException('Contributor not found');
        }

        $articles = $this->getBlogArticles();
        $articles = array_filter($articles, static fn ($article) => $article['data']['author']['slug'] === $slug);

        return $this->render('shop/blog/contributor.html.twig', [
            'page' => new Page(
                page: 'contributor',
                title: 'Contributor',
                description: 'Contributor',
            ),
            'contributor' => $contributor,
            'articles' => $articles,
        ]);
    }

    private function getBlogArticles(?string $slug = null): ?array
    {
        $blogDir = $this->getParameter('kernel.project_dir') . '/assets/docs/blog';
        $finder = new Finder();
        $articles = [];

        if (is_dir($blogDir)) {
            $finder->directories()->in($blogDir)->depth(0);

            foreach ($finder as $directory) {
                $articleSlug = $directory->getFilename();

                $file = $directory->getFilename() . '/index.md';
                $fileContent = file_get_contents($blogDir . '/' . $file);
                $article['raw_content'] = $fileContent;

                if (preg_match('/^---\s*(.*?)\s*---\s*(.*)/s', $fileContent, $matches)) {
                    $data = Yaml::parse($matches[1]);
                    $markdown = $matches[2];
                } else {
                    $data = [];
                    $markdown = $fileContent;
                }

                $htmlMarkdown = $this->markdown->convert($markdown);

                $data['slug'] = $articleSlug;
                $data['short_description'] = $this->appService->truncateHtml($htmlMarkdown, 150);
                $data['author'] = $this->getContributors($data['author']);

                $article['data'] = $data;
                $article['markdown'] = $markdown;

                $articles[] = $article;

                if ($slug !== null && $articleSlug === $slug) {
                    return $article;
                }
            }
        }

        if ($slug !== null) {
            return null;
        }

        // Sort by date in descending order (newest first)
        usort($articles, static fn ($a, $b) => $b['data']['date'] - $a['data']['date']);

        return $articles;
    }

    private function getPreviousArticle(array $article): ?array
    {
        $articles = $this->getBlogArticles();
        $index = array_search($article['data']['slug'], array_map(static fn ($article) => $article['data']['slug'], $articles), true);
        if ($index === false || $index === 0) {
            return null;
        }

        return $articles[$index - 1];
    }

    private function getNextArticle(array $article): ?array
    {
        $articles = $this->getBlogArticles();
        $index = array_search($article['data']['slug'], array_map(static fn ($article) => $article['data']['slug'], $articles), true);
        if ($index === false || $index === count($articles) - 1) {
            return null;
        }

        return $articles[$index + 1];
    }

    private function getContributors(?string $nameOrSlug = null): ?array
    {
        $slugger = new AsciiSlugger();

        if ($nameOrSlug !== null) {
            $nameOrSlug = $slugger->slug($nameOrSlug)->lower()->toString();
        }

        $yamlContent = file_get_contents($this->getParameter('kernel.project_dir') . '/assets/docs/contributors/contributors.yaml');
        $contributors = Yaml::parse($yamlContent);

        foreach ($contributors as $contributor) {
            $slug = $slugger->slug($contributor['name'])->lower()->toString();
            $contributor['slug'] = $slug;
            $contributors[$slug] = $contributor;

            if ($slug !== null && $nameOrSlug === $slug) {
                return $contributor;
            }
        }

        if ($nameOrSlug !== null) {
            return null;
        }

        return $contributors;
    }
}
