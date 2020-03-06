<?php

namespace App\Controller;

use App\Entity\Config;
use App\Entity\User;
use App\Form\RegisterType;
use App\Services\ConfigService;
use App\Services\UserService;
use GuzzleHttp\Client;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\LogicException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SecurityController extends AbstractController
{
    /** @var string */
    protected $appOauthFacebookId;

    /** @var string */
    protected $appOauthGithubId;

    /** @var string */
    protected $appOauthGithubSecret;

    /** @var UserService */
    protected $userService;

    /** @var ConfigService */
    protected $configService;

    /** @var JWTTokenManagerInterface */
    protected $jwtTokenManager;

    /** @var UserPasswordEncoderInterface */
    protected $userPasswordEncoder;

    /** @var Session */
    protected $session;

    /** @var HttpClientInterface */
    protected $httpClient;

    public function __construct(
        $appOauthFacebookId,
        $appOauthGithubId,
        $appOauthGithubSecret,
        UserService $userService,
        ConfigService $configService,
        JWTTokenManagerInterface $jwtTokenManager,
        UserPasswordEncoderInterface $userPasswordEncoder,
        SessionInterface $session,
        HttpClientInterface $httpClient
    ) {
        $this->appOauthFacebookId = $appOauthFacebookId;
        $this->appOauthGithubId = $appOauthGithubId;
        $this->appOauthGithubSecret = $appOauthGithubSecret;
        $this->userService = $userService;
        $this->configService = $configService;
        $this->jwtTokenManager = $jwtTokenManager;
        $this->userPasswordEncoder = $userPasswordEncoder;
        $this->session = $session;
        $this->httpClient = $httpClient;
    }
    /**
     * @Route("/api/login_check", name="api_login_check")
     *
     * @throws \Exception
     */
    public function loginCheck(Request $request)
    {
        throw new LogicException('This should never be reached!');
    }

    /**
     * @Route("/api/login/facebook", name="api_login_facebook", methods={"POST"})
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function facebookLogin(Request $request)
    {
        $token = null;

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $token = isset($data['access_token']) ? $data['access_token'] : null;
        }

        // Get the token's Facebook app info.
        $response = $this->httpClient->request('GET', 'https://graph.facebook.com/app/?access_token=' . $token);

        // Make sure it's the correct app.
        $tokenApp = $response->toArray();
        if (!$tokenApp || !isset($tokenApp['id']) || $tokenApp['id'] != $this->appOauthFacebookId) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        // Get the token's Facebook user info.
        $response = $this->httpClient->request('GET', 'https://graph.facebook.com/me/?access_token=' . $token);

        // Try to fetch user by it's token ID, create it otherwise.
        $tokenUser = $response->toArray();
        if (!$tokenUser || !isset($tokenUser['id'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        $facebookId = $tokenUser['id'];
        $facebookEmail = $tokenUser['id'].'@facebook.com';

        $user = $this->getUser();
        if ($user === null) {
            $user = $this->userService->findOneByFacebookId($facebookId);
            if ($user === null) {
                $user = $this->userService->findOneByEmail($facebookEmail);
            }
        }

        if ($user === null) {
            $user = new User();
            $user->setFacebookId($facebookId);
            $user->setEmail($facebookEmail);
            $user->setPassword($this->userPasswordEncoder->encodePassword($user, uniqid('uniflow', true)));
            $this->userService->save($user);

            $this->session->getFlashBag()->add(
                'notice',
                'User registered !'
            );
        } elseif ($user->getFacebookId() === null) {
            $user->setFacebookId($facebookId);
            $this->userService->save($user);
        }

        return new JsonResponse([
            'token' => $this->jwtTokenManager->create($user)
        ]);
    }

    /**
     * @Route("/api/login/github", name="api_login_github", methods={"POST"})
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function githubLogin(Request $request)
    {
        $code = null;

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $code = isset($data['code']) ? $data['code'] : null;
        }

        // Get the token's Github app.
        $response = $this->httpClient->request('POST', 'https://github.com/login/oauth/access_token', [
            'headers' => [
                'Accept' => 'application/json'
            ],
            'body' => [
                'client_id' => $this->appOauthGithubId,
                'client_secret' => $this->appOauthGithubSecret,
                'code' => $code
            ]
        ]);

        $tokenResp = $response->toArray();
        if (!$tokenResp || !isset($tokenResp['access_token'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }
        $token = $tokenResp['access_token'];

        // Get the token's Github user info.
        $response = $this->httpClient->request('GET', 'https://api.github.com/user', [
            'headers' => [
                'Accept' => 'application/json',
                'User-Agent' => 'Uniflow App',
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        // Try to fetch user by it's token ID, create it otherwise.
        $tokenUser = $response->toArray();
        if (!$tokenUser || !isset($tokenUser['id'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        $githubId = $tokenUser['id'];
        $githubEmail = $tokenUser['id'].'@github.com';

        $user = $this->getUser();
        if ($user === null) {
            $user = $this->userService->findOneByGithubId($githubId);
            if ($user === null) {
                $user = $this->userService->findOneByEmail($githubEmail);
            }
        }

        if ($user === null) {
            $user = new User();
            $user->setGithubId($githubId);
            $user->setEmail($githubEmail);
            $user->setPassword($this->userPasswordEncoder->encodePassword($user, uniqid('uniflow', true)));
            $this->userService->save($user);

            $this->session->getFlashBag()->add(
                'notice',
                'User registered !'
            );
        } elseif ($user->getGithubId() === null) {
            $user->setGithubId($githubId);
            $this->userService->save($user);
        }

        return new JsonResponse([
            'token' => $this->jwtTokenManager->create($user)
        ]);
    }

    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     *
     * @throws \Exception
     */
    public function register(Request $request)
    {
        $user = new User();

        $form = $this->createForm(RegisterType::class, $user, [
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
            $user->setPassword($this->userPasswordEncoder->encodePassword($user, $user->getPassword()));
            $this->userService->save($user);

            $this->session->getFlashBag()->add(
                'notice',
                'User registered !'
            );

            return new JsonResponse([
                'token' => $this->jwtTokenManager->create($user)
            ]);
        }

        return new JsonResponse([
            'message' => $form->getErrors(true)->current()->getMessage(),
        ], 401);
    }
}
