<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

final class NotFoundExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        // Run before Sylius resolves a channel for its error page. A request
        // without a matching route must remain a 404 even without a channel.
        return [KernelEvents::EXCEPTION => ['onKernelException', 128]];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        if (!$event->getThrowable() instanceof NotFoundHttpException) {
            return;
        }

        $request = $event->getRequest();
        if (str_starts_with($request->getPathInfo(), '/api/')) {
            $event->setResponse(new JsonResponse(['error' => 'Not Found'], Response::HTTP_NOT_FOUND));

            return;
        }

        $event->setResponse(new Response(
            <<<'HTML'
                <!doctype html>
                <html lang="en">
                    <head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found</title></head>
                    <body><main><h1>Page not found</h1><p><a href="/">Return to Uniflow</a></p></main></body>
                </html>
                HTML,
            Response::HTTP_NOT_FOUND,
            ['Content-Type' => 'text/html; charset=UTF-8'],
        ));
    }
}
