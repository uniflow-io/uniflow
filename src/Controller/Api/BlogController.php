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
     * @Route("/api/blog", name="api_blog_list", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function listAction()
    {
        $data = $this->blogService->getBlog();

        return new JsonResponse($data);
    }
}
