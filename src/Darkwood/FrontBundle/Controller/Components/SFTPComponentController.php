<?php

namespace Darkwood\FrontBundle\Controller\Components;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SFTPComponentController.
 */
class SFTPComponentController extends Controller
{
    private function getConfig(Request $request)
    {
        $config = array(
            'host' => null,
            'port' => null,
            'username' => null,
            'password' => null,
            'privateKey' => null,
            'root' => null,
            'timeout' => null,
            'directoryPerm' => null
        );
        foreach($config as $key => $value) {
            $config[$key] = $request->get($key);
        }

        return array_filter($config, function($value) {
            return !is_null($value);
        });
    }

    public function checkAction(Request $request)
    {
        $config = $this->getConfig($request);

        $data = array(
            'error' => false,
            'result' => false,
        );

        try {
            $data['result'] = $this->get('dw.component.sftp')->check($config);
        } catch(\Exception $e) {
            $data['error'] = true;
            $data['message'] = $e->getMessage();
        }

        return new JsonResponse($data);
    }

    public function readAction(Request $request)
    {
        $config = $this->getConfig($request);
        $path = $request->get('path');

        $data = array(
            'error' => false,
            'content' => null,
        );

        try {
            $data['content'] = $this->get('dw.component.sftp')->read($config, $path);
        } catch(\Exception $e) {
            $data['error'] = true;
            $data['message'] = $e->getMessage();
        }

        return new JsonResponse($data);
    }
}
