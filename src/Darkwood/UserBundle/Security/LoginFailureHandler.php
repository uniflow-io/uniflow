<?php

namespace Darkwood\UserBundle\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Httpfoundation\Response;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

class LoginFailureHandler implements AuthenticationFailureHandlerInterface
{
    /**
     * Router
     *
     * @var Router
     */
    protected $router;

    /**
     * @var \Symfony\Component\Security\Csrf\CsrfTokenManager
     */
    protected $tokenManager;

    /**
     * Initialize authentication
     *
     * @param Router $router Router
     *
     * @return void
     */
    public function __construct($router, $tokenManager)
    {
        $this->router = $router;
        $this->tokenManager = $tokenManager;
    }

    /**
     * Redirect user after authentication at the correct url.
     * Display a flash message in order to inform him of his connexion.
     *
     * @param Request $request Request
     * @param TokenInterface $token Token
     *
     * @return RedirectResponse
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $url = $request->headers->get('Referer');
        if (null !== $url) {
            return new RedirectResponse($url);
        }

        return new RedirectResponse($this->router->generate('fos_user_security_login', array(), Router::ABSOLUTE_URL));
    }
}
