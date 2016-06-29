<?php

namespace Darkwood\FrontBundle\Components;

use Darkwood\CoreBundle\Services\BaseService;
use League\Flysystem\Filesystem;
use League\Flysystem\Sftp\SftpAdapter;

class SFTPComponent extends BaseService
{
    public function read($file)
    {
        $sftpAdapter = new SftpAdapter(array(
            'host' => 'localhost',
            'port' =>  2222,
            'username' => 'math',
            'root' => '/Users/math/Sites'
        ));
        $sftp = new Filesystem($sftpAdapter);
        $a = $sftp->read($file);
    }
}