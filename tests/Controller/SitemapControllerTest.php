<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use App\Controller\Shop\SitemapController;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use function dirname;
use function sprintf;

final class SitemapControllerTest extends TestCase
{
    public function testItReturnsAValidXmlSitemap(): void
    {
        $generator = $this->createMock(UrlGeneratorInterface::class);
        $generator->method('generate')->willReturnCallback(
            static fn (string $name, array $parameters = []): string => sprintf(
                'https://uniflow.io/%s%s',
                $name,
                isset($parameters['slug']) ? '/' . $parameters['slug'] : '',
            ),
        );

        $response = (new SitemapController(dirname(__DIR__, 2)))($generator);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame('application/xml; charset=UTF-8', $response->headers->get('Content-Type'));
        self::assertStringContainsString('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', $response->getContent());
        self::assertStringContainsString('https://uniflow.io/app_shop_home', $response->getContent());
        self::assertNotFalse(simplexml_load_string($response->getContent()));
    }
}
