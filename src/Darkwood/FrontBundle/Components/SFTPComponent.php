<?php

namespace Darkwood\FrontBundle\Components;

use Darkwood\CoreBundle\Services\BaseService;
use League\Flysystem\Filesystem;
use League\Flysystem\Sftp\SftpAdapter;

class SFTPComponent extends BaseService
{
    public function check($config)
    {
        $sftpAdapter = new SftpAdapter($config);
        if ( ! $sftpAdapter->isConnected()) {
            $sftpAdapter->disconnect();
            $sftpAdapter->connect();
        }

        return $sftpAdapter->isConnected();
    }

    public function read($config, $path)
    {
        $sftpAdapter = new SftpAdapter($config);
        $sftp = new Filesystem($sftpAdapter);
        return $sftp->read($path);
    }

    public function tree($config, $path)
    {
        $sftpAdapter = new SftpAdapter($config);
        $sftp = new Filesystem($sftpAdapter);

        $tree = array();

        $list = $sftp->listContents($path);
        foreach ($list as $item) {
            $leaf = array(
                'file' => $item['filename']
            );

            if($item['type'] == 'dir') {
                $leaf['children'] = $this->tree($config, $item['path']);
            }

            $tree[] = $leaf;
        }

        return $tree;
    }
}