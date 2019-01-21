<?php

namespace App\Controller;

use App\Services\FolderService;
use App\Services\ProgramService;
use App\Services\UserService;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\User\UserInterface;

class FrontController extends AbstractController
{
    /**
     * @var ProgramService
     */
    protected $programService;

    /**
     * @var FolderService
     */
    protected $folderService;

    /**
     * @var UserService
     */
    protected $userService;

    public function __construct(
        ProgramService $programService,
        FolderService $folderService,
        UserService $userService
    ) {
        $this->programService = $programService;
        $this->folderService = $folderService;
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
     * @Route("/me/feed/{slug1}/{slug2}/{slug3}/{slug4}/{slug5}", name="feed")
     *
     * @param $slug1
     * @param $slug2
     * @param $slug3
     * @param $slug4
     * @param $slug5
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function feed($slug1 = null, $slug2 = null, $slug3 = null, $slug4 = null, $slug5 = null)
    {
        return $this->render('default/feed.html.twig');
    }

    /**
     * @Route("/{username}/feed/{slug1}/{slug2}/{slug3}/{slug4}/{slug5}", name="userFeed")
     *
     * @param $username
     * @param $slug1
     * @param $slug2
     * @param $slug3
     * @param $slug4
     * @param $slug5
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function userFeed($username, $slug1 = null, $slug2 = null, $slug3 = null, $slug4 = null, $slug5 = null)
    {
        $path = array_reduce([$slug1, $slug2, $slug3, $slug4, $slug5], function($path, $slug) {
            if($slug) {
                $path[] = $slug;
            }
            return $path;
        }, []);

        $user = $this->userService->findOneByUsername($username);
        if(!$user) {
            throw new NotFoundHttpException();
        }

        if(count($path) > 0) {
            $program = $this->programService->findOneByUserAndPath($user, $path);
            if (is_null($program)) {
                $folder = $this->folderService->findOneByUserAndPath($user, $path);
                if(is_null($folder)) {
                    throw new NotFoundHttpException();
                }
            }
        }

        return $this->render('default/feed.html.twig');
    }
}
