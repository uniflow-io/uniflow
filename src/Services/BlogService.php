<?php

namespace App\Services;

use GuzzleHttp\Client;
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
    /** @var string */
    private $url = 'https://medium.com/@uniflow.io';

    /**
     * @var TagAwareAdapter
     */
    protected $cache;

    public function __construct(
        TagAwareAdapter $cache
    )
    {
        $this->cache = $cache;
    }

    /**
     * @param bool $force
     * @return mixed
     * @throws \Psr\Cache\CacheException
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function getBlog($force = false)
    {
        $key       = 'blog';
        $ttl       = 3600 * 24;
        $cacheItem = $this->cache->getItem($key);
        $cacheItem->tag('blog');

        if (!$cacheItem->isHit() || $force) {
            $client   = new Client();
            $response = $client->get($this->url . '/latest?format=json');

            $data = (string)$response->getBody();
            $data = substr($data, 16); //remove '])}while(1);</x>'
            $data = json_decode($data, true);
            $data = $data['payload']['references']['Post'];

            $cacheItem->set($data);
            $cacheItem->expiresAfter($ttl);
            $this->cache->save($cacheItem);
        }

        return $cacheItem->get();
    }

    /**
     * @param $slug
     * @param bool $force
     * @return mixed
     * @throws \Psr\Cache\CacheException
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function getArticle($slug, $force = false)
    {
        $blog    = $this->getBlog($force);
        $article = current(array_filter($blog, function ($item) use ($slug) {
            return $item['slug'] === $slug;
        }));
        if (!$article) {
            return null;
        }

        $key       = 'blog-' . $slug;
        $cacheItem = $this->cache->getItem($key);
        $cacheItem->tag('blog');

        if (!$cacheItem->isHit() || $force) {
            $client   = new Client();
            $response = $client->get($this->url . '/' . $article['uniqueSlug'] . '?format=json');

            $data = (string)$response->getBody();
            $data = substr($data, 16); //remove '])}while(1);</x>'
            $data = json_decode($data, true);
            $data = $data['payload']['value'];

            $cacheItem->set($data);
            $this->cache->save($cacheItem);
        }

        return $cacheItem->get();
    }
}
