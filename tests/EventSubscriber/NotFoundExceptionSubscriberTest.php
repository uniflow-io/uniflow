<?php

declare(strict_types=1);

namespace App\Tests\EventSubscriber;

use App\EventSubscriber\NotFoundExceptionSubscriber;
use PHPUnit\Framework\TestCase;
use RuntimeException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\HttpKernelInterface;

final class NotFoundExceptionSubscriberTest extends TestCase
{
    public function testItConvertsOnlyNotFoundExceptionsToA404Response(): void
    {
        $kernel = $this->createMock(HttpKernelInterface::class);
        $event = new ExceptionEvent($kernel, Request::create('/missing'), HttpKernelInterface::MAIN_REQUEST, new NotFoundHttpException());

        (new NotFoundExceptionSubscriber())->onKernelException($event);

        self::assertSame(404, $event->getResponse()?->getStatusCode());
        self::assertStringContainsString('Page not found', (string) $event->getResponse()?->getContent());

        $serverError = new ExceptionEvent($kernel, Request::create('/broken'), HttpKernelInterface::MAIN_REQUEST, new RuntimeException());
        (new NotFoundExceptionSubscriber())->onKernelException($serverError);
        self::assertNull($serverError->getResponse());
    }
}
