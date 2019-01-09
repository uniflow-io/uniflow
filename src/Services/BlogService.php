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
    /** @var string  */
    private $url = 'https://api.medium.com/v1/';

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
        $client = new Client([
            'base_uri' => $this->url,
            'exceptions' => false,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'Accept-Charset' => 'utf-8',
                'Authorization' => 'Bearer ',
            ],
        ]);


        $response = $client->get('me');

        $me = json_decode((string) $response->getBody(), true);


        $response = $client->get('users/' . $me['data']['id'] . '/publications');

        $data = json_decode((string) $response->getBody(), true);

        return [];
    }
}
