<?php

namespace App\Services;

use Symfony\Component\Cache\Adapter\TagAwareAdapter;

/**
 * Class BlogService
 *
 * Object manager of blog
 *
 * @package App\Services
 */
class BlogService
{
    /** @var string  */
    const url = 'https://api.medium.com/v1/';

    /**
     * @var TagAwareAdapter
     */
    protected $cache;

    public function __construct(
        TagAwareAdapter $cache
    ) {
        $this->cache             = $cache;
    }

    public function getBlog()
    {

        return [];
    }
}
