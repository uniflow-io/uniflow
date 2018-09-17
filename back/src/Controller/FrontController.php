<?php

namespace App\Controller;

use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\User\UserInterface;

class FrontController extends Controller
{
    /**
     * @Route("/", name="home")
     */
    public function home()
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            return $this->redirect('login');
        }

        return $this->render('default/home.html.twig');
    }

    /**
     * @Route("/faq", name="faq")
     */
    public function faq()
    {
        return $this->render('default/faq.html.twig');
    }

    /**
     * @Route("/logs", name="logs")
     */
    public function logs()
    {
        return $this->render('default/logs.html.twig');
    }

    /**
     * @Route("/me", name="dashboard")
     */
    public function dashboard()
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            return $this->redirect('login');
        }

        return $this->render('default/dashboard.html.twig');
    }

    /**
     * @Route("/me/flow/{id}", name="flow")
     */
    public function flow()
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            return $this->redirect('login');
        }

        return $this->render('default/flow.html.twig');
    }
}
