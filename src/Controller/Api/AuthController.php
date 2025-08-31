<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Service\AuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

#[Route('/api/v1/uniflow/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /*#[Route(path: '/login', name: 'api_auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent(), true);

        if (!isset($content['username']) || !isset($content['password'])) {
            return new JsonResponse([
                'message' => 'Username and password are required',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $result = $this->authService->login($content['username'], $content['password']);

            return new JsonResponse([
                'token' => $result['token'],
                'uid' => $result['user']->getUid(),
            ], Response::HTTP_CREATED);
        } catch (AuthenticationException $e) {
            return new JsonResponse([
                'message' => 'Bad credentials',
            ], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    #[Route(path: '/login-facebook', name: 'api_auth_login_facebook', methods: ['POST'])]
    public function loginFacebook(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent(), true);

        if (!isset($content['access_token'])) {
            return new JsonResponse([
                'message' => 'Access token is required',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $result = $this->authService->facebookLogin(
                $content['access_token'],
                $this->getUser()
            );

            return new JsonResponse([
                'token' => $result['token'],
                'uid' => $result['user']->getUid(),
            ], Response::HTTP_CREATED);
        } catch (AuthenticationException $e) {
            return new JsonResponse([
                'message' => 'Bad credentials',
            ], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    #[Route(path: '/login-github', name: 'api_auth_login_github', methods: ['POST'])]
    public function loginGithub(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent(), true);

        if (!isset($content['code'])) {
            return new JsonResponse([
                'message' => 'GitHub code is required',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $result = $this->authService->githubLogin(
                $content['code'],
                $this->getUser()
            );

            return new JsonResponse([
                'token' => $result['token'],
                'uid' => $result['user']->getUid(),
            ], Response::HTTP_CREATED);
        } catch (AuthenticationException $e) {
            return new JsonResponse([
                'message' => 'Bad credentials',
            ], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }*/
}
