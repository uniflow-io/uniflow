<?php

namespace Darkwood\FrontBundle\Components;

use Darkwood\CoreBundle\Services\BaseService;
use League\Flysystem\Filesystem;
use League\Flysystem\Sftp\SftpAdapter;

class SFTPComponent extends BaseService
{
    public function read($config, $path)
    {
        $sftpAdapter = new SftpAdapter(array(
            'host' => 'localhost',
            'port' =>  2222,
            'username' => 'math',
            'root' => '/Users/math/Sites',
            'privateKey' => __DIR__ . '/../../../../puphpet/files/dot/ssh/my_id_rsa',
        ));
        $sftp = new Filesystem($sftpAdapter);
        return $sftp->read($path);
    }
}