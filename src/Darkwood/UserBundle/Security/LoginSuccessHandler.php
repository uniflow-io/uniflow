<?php

namespace Darkwood\UserBundle\Security;

use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Router;

/**
 * The LoginSuccessHandler class is call after authentication.
 */
class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    /**
     * Router.
     *
     * @var Router
     */
    protected $router;

    /**
     * Initialize authentication.
     *
     * @param Router          $router   Router
     */
    public function __construct($router)
    {
        $this->router = $router;
    }

    /**
     * Redirect user after authentication at the correct url.
     * Display a flash message in order to inform him of his connexion.
     *
     * @param Request        $request Request
     * @param TokenInterface $token   Token
     *
     * @return RedirectResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        $session = $request->getSession();

        // redirect the user to where they were before the login process begun.
        $refererUrl = $session->get('login_redirect');
        if (!empty($refererUrl)) {
            $redirectUrl = $refererUrl;
        } else {
            $redirectUrl = $request->headers->get('Referer');
            if (strpos($redirectUrl, 'login') !== false) {
                $redirectUrl = $this->router->generate('homepage', array(), true);
            }
        }

        if (is_object($user = $token->getUser())) {
            $request->getSession()->set('user_id', $user->getId());
        }

        $response = new RedirectResponse($redirectUrl);

        // Generate new security token
        $session->set('token', md5(uniqid(rand(), true)));

        return $response;
    }
}
