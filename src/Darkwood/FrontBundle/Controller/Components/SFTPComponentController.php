<?php

namespace Darkwood\FrontBundle\Controller\Components;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SFTPComponentController.
 */
class SFTPComponentController extends Controller
{
    public function readAction(Request $request)
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
        $config = array_filter($config, function($value) {
            return !is_null($value);
        });

        $path = $request->get('path');

        return $this->get('dw.component.sftp')->read($config, $path);
    }
}
