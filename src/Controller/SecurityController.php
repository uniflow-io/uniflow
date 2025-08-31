<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Config;
use App\Entity\User\ShopUser as User;
use App\Form\RegisterType;
use App\Service\AuthService;
use App\Service\ConfigService;
use App\Service\UserService;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\LogicException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api/v1/uniflow')]
class SecurityController extends AbstractController
{
    public function __construct(
        protected AuthService $authService,
        protected UserService $userService,
        protected ConfigService $configService,
        protected JWTTokenManagerInterface $jwtTokenManager,
        protected UserPasswordHasherInterface $userPasswordHasher,
        protected HttpClientInterface $httpClient,
        /*protected string $appOauthFacebookId,
        protected string $appOauthGithubId,
        protected string $appOauthGithubSecret,
        protected string $appOauthMediumId,
        protected string $appOauthMediumSecret*/
    ) {}

    /**
     * @throws Exception
     */
    #[Route(path: '/login_check', name: 'api_login_check')]
    public function loginCheck(): never
    {
        throw new LogicException('This should never be reached!');
    }

    #[Route(path: '/login', name: 'api_auth_login', methods: ['POST'])]
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
        } catch (AuthenticationException) {
            return new JsonResponse([
                'message' => 'Bad credentials',
            ], Response::HTTP_UNAUTHORIZED);
        } catch (Exception $e) {
            return new JsonResponse([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     * @throws TransportExceptionInterface
     */
    /**
     * #[Route(path: '/login-facebook', name: 'api_auth_login_facebook', methods: ['POST'])]
     * public function facebookLogin(Request $request): JsonResponse
     * {
     * $content = json_decode($request->getContent(), true);.
     *
     * if (!isset($content['access_token'])) {
     * return new JsonResponse([
     * 'message' => 'Access token is required',
     * ], Response::HTTP_UNPROCESSABLE_ENTITY);
     * }
     *
     * try {
     * $result = $this->authService->facebookLogin(
     * $content['access_token'],
     * $this->getUser()
     * );
     *
     * return new JsonResponse([
     * 'token' => $result['token'],
     * 'uid' => $result['user']->getUid(),
     * ], Response::HTTP_CREATED);
     * } catch (AuthenticationException $e) {
     * return new JsonResponse([
     * 'message' => 'Bad credentials',
     * ], Response::HTTP_UNAUTHORIZED);
     * } catch (Exception $e) {
     * return new JsonResponse([
     * 'message' => $e->getMessage(),
     * ], Response::HTTP_UNPROCESSABLE_ENTITY);
     * }
     * }
     */

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     * @throws TransportExceptionInterface
     */
    /**
     * #[Route(path: '/login-github', name: 'api_auth_login_github', methods: ['POST'])]
     * public function githubLogin(Request $request): JsonResponse
     * {
     * $content = json_decode($request->getContent(), true);.
     *
     * if (!isset($content['code'])) {
     * return new JsonResponse([
     * 'message' => 'GitHub code is required',
     * ], Response::HTTP_UNPROCESSABLE_ENTITY);
     * }
     *
     * try {
     * $result = $this->authService->githubLogin(
     * $content['code'],
     * $this->getUser()
     * );
     *
     * return new JsonResponse([
     * 'token' => $result['token'],
     * 'uid' => $result['user']->getUid(),
     * ], Response::HTTP_CREATED);
     * } catch (AuthenticationException $e) {
     * return new JsonResponse([
     * 'message' => 'Bad credentials',
     * ], Response::HTTP_UNAUTHORIZED);
     * } catch (Exception $e) {
     * return new JsonResponse([
     * 'message' => $e->getMessage(),
     * ], Response::HTTP_UNPROCESSABLE_ENTITY);
     * }
     * }
     */

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     */
    /**
     * #[Route(path: '/login/medium', name: 'api_login_medium', methods: ['POST'])]
     * public function mediumLogin(Request $request): JsonResponse
     * {
     * // @var User $user
     * $user = $this->getUser();
     * if (!$user instanceof UserInterface) {
     * throw new AccessDeniedException('This user does not have access to this section.');
     * }.
     *
     * $code = null;
     *
     * $content = $request->getContent();
     * if (!empty($content)) {
     * $data = json_decode($content, true);
     * $code = $data['code'] ?? null;
     * }
     *
     * // Get the token's Medium app.
     * $response = $this->httpClient->request('POST', 'https://api.medium.com/v1/tokens', [
     * 'headers' => [
     * 'Accept' => 'application/json',
     * 'Content-Type' => 'application/x-www-form-urlencoded',
     * ],
     * 'body' => [
     * 'code' => $code,
     * 'client_id' => $this->appOauthMediumId,
     * 'client_secret' => $this->appOauthMediumSecret,
     * 'grant_type' => 'authorization_code',
     * 'redirect_uri' => $this->generateUrl('api_login_medium', [], UrlGeneratorInterface::ABSOLUTE_URL),
     * ],
     * ]);
     *
     * $tokenResp = $response->toArray();
     * if (!$tokenResp || !isset($tokenResp['access_token'])) {
     * throw new AccessDeniedHttpException('Bad credentials.');
     * }
     *
     * $token = $tokenResp['access_token'];
     *
     * $config = $this->configService->findOne();
     * if ($config === null) {
     * $config = new Config();
     * }
     *
     * $config->setMediumToken($token);
     * $this->configService->save($config);
     *
     * return new JsonResponse([
     * 'token' => $this->jwtTokenManager->create($user),
     * ]);
     * }
     */

    /**
     * @throws NonUniqueResultException
     * @throws ORMException
     * @throws OptimisticLockException
     */
    #[Route(path: '/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $form = $this->createForm(RegisterType::class, new User(), [
            'csrf_protection' => false,
        ]);

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $form->submit($data);
        } else {
            $form->handleRequest($request);
        }

        if ($form->isValid()) {
            /** @var User $user */
            $user = $form->getData();
            $user->setPassword($this->userPasswordHasher->hashPassword($user, $user->getPlainPassword()));
            $this->userService->save($user);

            return new JsonResponse([
                'token' => $this->jwtTokenManager->create($user),
            ]);
        }

        return new JsonResponse([
            'message' => $form->getErrors(true)->current()->getMessage(),
        ], Response::HTTP_BAD_REQUEST);
    }
}
