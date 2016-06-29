<?php

namespace Darkwood\FrontBundle\Controller;

use Darkwood\FrontBundle\Entity\Contact;
use Darkwood\FrontBundle\Entity\Page;
use Darkwood\FrontBundle\Entity\PageTranslation;
use Darkwood\FrontBundle\Form\Type\ContactType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Debug\Exception\FlattenException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;

/**
 * Class DefaultController.
 */
class DefaultController extends Controller
{
    /**
     * Remove slash and redirect 301.
     *
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function removeTrailingSlashAction(Request $request)
    {
        $pathInfo = $request->getPathInfo();
        $requestUri = $request->getRequestUri();

        $url = str_replace($pathInfo, rtrim($pathInfo, ' /'), $requestUri);

        return $this->redirect($url, 301);
    }

    public function homeAction(Request $request)
    {
        return $this->render('FrontBundle::layout.html.twig');
    }
}
