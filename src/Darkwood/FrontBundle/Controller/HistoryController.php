<?php

namespace Darkwood\FrontBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SFTPComponentController.
 */
class HistoryController extends Controller
{
    public function listAction(Request $request)
    {
        $data = array(
            'error' => false,
            'result' => false,
        );

        return new JsonResponse($data);
    }
}
