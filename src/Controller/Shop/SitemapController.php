<?php

declare(strict_types=1);

namespace App\Controller\Shop;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use XMLWriter;

final readonly class SitemapController
{
    public function __construct(#[Autowire('%kernel.project_dir%')] private string $projectDir) {}

    #[Route('/sitemap.xml', name: 'app_sitemap', methods: ['GET'])]
    public function __invoke(UrlGeneratorInterface $urlGenerator): Response
    {
        $urls = [
            $urlGenerator->generate('app_shop_home', referenceType: UrlGeneratorInterface::ABSOLUTE_URL),
            $urlGenerator->generate('app_shop_blog', referenceType: UrlGeneratorInterface::ABSOLUTE_URL),
            $urlGenerator->generate('app_shop_tags', referenceType: UrlGeneratorInterface::ABSOLUTE_URL),
        ];

        $blogDirectory = $this->projectDir . '/assets/docs/blog';
        if (is_dir($blogDirectory)) {
            $directories = Finder::create()->directories()->in($blogDirectory)->depth(0)->sortByName();

            foreach ($directories as $directory) {
                $urls[] = $urlGenerator->generate(
                    'app_shop_article',
                    ['slug' => $directory->getFilename()],
                    UrlGeneratorInterface::ABSOLUTE_URL,
                );
            }
        }

        $xml = new XMLWriter();
        $xml->openMemory();
        $xml->startDocument('1.0', 'UTF-8');
        $xml->startElement('urlset');
        $xml->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        foreach (array_unique($urls) as $url) {
            $xml->startElement('url');
            $xml->writeElement('loc', $url);
            $xml->endElement();
        }

        $xml->endElement();
        $xml->endDocument();

        return new Response($xml->outputMemory(), Response::HTTP_OK, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
