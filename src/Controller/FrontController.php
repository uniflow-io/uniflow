<?php

namespace App\Controller;

use App\Services\HistoryService;
use App\Services\UserService;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\User\UserInterface;

class FrontController extends AbstractController
{
    /**
     * @var HistoryService
     */
    protected $historyService;

    /**
     * @var UserService
     */
    protected $userService;

    public function __construct(
        HistoryService $historyService,
        UserService $userService
    ) {
        $this->historyService = $historyService;
        $this->userService = $userService;
    }

    /**
     * @Route("/", name="home")
     */
    public function home()
    {
        return $this->render('default/home.html.twig');
    }

    /**
     * @Route("/login", name="login")
     */
    public function login()
    {
        return $this->render('default/login.html.twig');
    }

    /**
     * @Route("/login/facebook", name="loginFacebook")
     */
    public function loginFacebook()
    {
        return $this->render('default/login/facebook.html.twig');
    }

    /**
     * @Route("/login/github", name="loginGithub")
     */
    public function loginGithub()
    {
        return $this->render('default/login/github.html.twig');
    }

    /**
     * @Route("/login/medium", name="loginMedium")
     */
    public function loginMedium()
    {
        return $this->render('default/login/medium.html.twig');
    }

    /**
     * @Route("/register", name="register")
     */
    public function register()
    {
        return $this->render('default/register.html.twig');
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
        return $this->render('default/logout.html.twig');
    }

    /**
     * @Route("/faq", name="faq")
     */
    public function faq()
    {
        return $this->render('default/faq.html.twig');
    }

    /**
     * @Route("/blog/{slug}", name="article")
     */
    public function article()
    {
        return $this->render('default/article.html.twig');
    }

    /**
     * @Route("/blog", name="blog")
     */
    public function blog()
    {
        return $this->render('default/blog.html.twig');
    }

    /**
     * @Route("/versions", name="versions")
     */
    public function versions()
    {
        return $this->render('default/versions.html.twig');
    }

    /**
     * @Route("/settings", name="settings")
     */
    public function settings()
    {
        return $this->render('default/settings.html.twig');
    }

    /**
     * @Route("/admin", name="admin")
     */
    public function admin()
    {
        return $this->render('default/admin.html.twig');
    }

    /**
     * @Route("/me/flow/{slug1}/{slug2}/{slug3}", name="flow")
     *
     * @param $slug1
     * @param $slug2
     * @param $slug3
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function flow($slug1, $slug2 = null, $slug3 = null)
    {
        return $this->render('default/flow.html.twig');
    }

    /**
     * @Route("/me", name="dashboard")
     */
    public function dashboard()
    {
        return $this->render('default/dashboard.html.twig');
    }

    /**
     * @Route("/{username}/flow/{slug1}/{slug2}/{slug3}", name="userFlow")
     *
     * @param $username
     * @param $slug1
     * @param $slug2
     * @param $slug3
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function userFlow($username, $slug1, $slug2 = null, $slug3 = null)
    {
        $history = $this->historyService->findOneByUsernameAndSlug($username, $slug1);
        if (is_null($history)) {
            throw new NotFoundHttpException();
        }

        return $this->render('default/flow.html.twig');
    }

    /**
     * @Route("/{username}", name="userDashboard")
     *
     * @param $username
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function userDashboard($username)
    {
        $user = $this->userService->findOneByUsername($username);
        if (is_null($user)) {
            throw new NotFoundHttpException();
        }

        return $this->render('default/dashboard.html.twig');
    }
}
