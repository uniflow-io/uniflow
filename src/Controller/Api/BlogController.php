<?php

namespace App\Controller\Api;

use Symfony\Component\Routing\Annotation\Route;
use App\Services\BlogService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class BlogController extends AbstractController
{
    /**
     * @var BlogService
     */
    protected $blogService;

    public function __construct(
        BlogService $blogService
    ) {
        $this->blogService = $blogService;
    }

    /**
     * @Route("/api/blog/{slug}", name="api_blog_article", methods={"GET"})
     *
     * @param $slug
     * @return JsonResponse
     * @throws \Psr\Cache\CacheException
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function article($slug)
    {
        $data = $this->blogService->getArticle($slug);

        return new JsonResponse($data);
    }

    /**
     * @Route("/api/blog", name="api_blog_list", methods={"GET"})
     *
     * @return JsonResponse
     * @throws \Psr\Cache\CacheException
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function listAction()
    {
        $data = $this->blogService->getBlog();

        return new JsonResponse($data);
    }
}
