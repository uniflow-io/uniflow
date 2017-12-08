<?php

namespace Darkwood\UserBundle\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Httpfoundation\Response;
use Symfony\Component\Routing\Router;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    /**
     * Router
     *
     * @var Router
     */
    protected $router;

    /**
     * @var AuthorizationChecker
     */
    protected $securityAuthorizationChecker;

    /**
     * Initialize authentication
     *
     * @param Router          $router   Router
     * @param AuthorizationChecker $securityAuthorizationChecker
     *
     * @return void
     */
    public function __construct($router, $securityAuthorizationChecker)
    {
        $this->router = $router;
        $this->securityAuthorizationChecker = $securityAuthorizationChecker;
    }

    /**
     * Redirect user after authentication at the correct url.
     * Display a flash message in order to inform him of his connexion.
     *
     * @param Request        $request Request
     * @param TokenInterface $token   Token
     *
     * @return Response
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        $session = $request->getSession();

        // redirect the user to where they were before the login process begun.
        $redirectUrl = $request->get('_target_path', $session->get('login_redirect'));
        if (empty($redirectUrl)) {
            $redirectUrl = $request->headers->get('Referer');
            if (strpos($redirectUrl, 'login') !== false) {
                $redirectUrl = $this->router->generate('back_home', array(), true);
            }
        }

        if ($this->securityAuthorizationChecker->isGranted('ROLE_BACK')) {
            $redirectUrl = $this->router->generate('back_home', array(), true);
        }

        $response = new RedirectResponse($redirectUrl);
        return $response;
    }
}
