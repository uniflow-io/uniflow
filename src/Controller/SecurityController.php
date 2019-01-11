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

class SecurityController extends AbstractController
{
    /**
     * @var string
     */
    protected $appOauthFacebookId;

    /**
     * @var string
     */
    protected $appOauthGithubId;

    /**
     * @var string
     */
    protected $appOauthGithubSecret;

    /**
     * @var string
     */
    protected $appOauthMediumId;

    /**
     * @var string
     */
    protected $appOauthMediumSecret;

    /**
     * @var UserService
     */
    protected $userService;

    /**
     * @var ConfigService
     */
    protected $configService;

    /**
     * @var JWTTokenManagerInterface
     */
    protected $jwtTokenManager;

    /**
     * @var UserPasswordEncoderInterface
     */
    protected $userPasswordEncoder;

    /**
     * @var Session
     */
    protected $session;

    public function __construct(
        $appOauthFacebookId,
        $appOauthGithubId,
        $appOauthGithubSecret,
        $appOauthMediumId,
        $appOauthMediumSecret,
        UserService $userService,
        ConfigService $configService,
        JWTTokenManagerInterface $jwtTokenManager,
        UserPasswordEncoderInterface $userPasswordEncoder,
        SessionInterface $session
    ) {
        $this->appOauthFacebookId = $appOauthFacebookId;
        $this->appOauthGithubId = $appOauthGithubId;
        $this->appOauthGithubSecret = $appOauthGithubSecret;
        $this->appOauthMediumId = $appOauthMediumId;
        $this->appOauthMediumSecret = $appOauthMediumSecret;
        $this->userService = $userService;
        $this->configService = $configService;
        $this->jwtTokenManager = $jwtTokenManager;
        $this->userPasswordEncoder = $userPasswordEncoder;
        $this->session = $session;
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
     */
    public function facebookLogin(Request $request)
    {
        $token = null;

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $token = isset($data['access_token']) ? $data['access_token'] : null;
        }

        $client = new Client();

        // Get the token's Facebook app info.
        $response = $client->get('https://graph.facebook.com/app/?access_token=' . $token);

        // Make sure it's the correct app.
        $tokenApp = json_decode((string) $response->getBody(), true);
        if (!$tokenApp || !isset($tokenApp['id']) || $tokenApp['id'] != $this->appOauthFacebookId) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        // Get the token's Facebook user info.
        $response = $client->get('https://graph.facebook.com/me/?access_token=' . $token);

        // Try to fetch user by it's token ID, create it otherwise.
        $tokenUser = json_decode((string) $response->getBody(), true);
        if (!$tokenUser || !isset($tokenUser['id'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        $facebookId = $tokenUser['id'];
        $facebookEmail = $tokenUser['id'].'@facebook.com';

        $user = $this->getUser();
        if (is_null($user)) {
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

        return new JsonResponse(array(
            'token' => $this->jwtTokenManager->create($user)
        ));
    }

    /**
     * @Route("/api/login/github", name="api_login_github", methods={"POST"})
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function githubLogin(Request $request)
    {
        $code = null;

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $code = isset($data['code']) ? $data['code'] : null;
        }

        $client = new Client();

        // Get the token's Github app.
        $response = $client->post('https://github.com/login/oauth/access_token', [
            'headers' => [
                'Accept' => 'application/json'
            ],
            'form_params' => [
                'client_id' => $this->appOauthGithubId,
                'client_secret' => $this->appOauthGithubSecret,
                'code' => $code
            ]
        ]);

        $tokenResp = json_decode((string) $response->getBody(), true);
        if (!$tokenResp || !isset($tokenResp['access_token'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }
        $token = $tokenResp['access_token'];

        // Get the token's Github user info.
        $response = $client->get('https://api.github.com/user', [
            'headers' => [
                'Accept' => 'application/json',
                'User-Agent' => 'Uniflow App',
                'Authorization' => 'Bearer ' . $token
            ]
        ]);

        // Try to fetch user by it's token ID, create it otherwise.
        $tokenUser = json_decode((string) $response->getBody(), true);
        if (!$tokenUser || !isset($tokenUser['id'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        $githubId = $tokenUser['id'];
        $githubEmail = $tokenUser['id'].'@github.com';

        $user = $this->getUser();
        if (is_null($user)) {
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

        return new JsonResponse(array(
            'token' => $this->jwtTokenManager->create($user)
        ));
    }

    /**
     * @Route("/api/login/medium", name="api_login_medium", methods={"POST"})
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function mediumLogin(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if (!$this->isGranted('ROLE_USER_PRO') && $user->getHistories()->count() >= 5) {
            throw new AccessDeniedException('You are not alowed to create more history');
        }

        $code = null;

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $code = isset($data['code']) ? $data['code'] : null;
        }

        $client = new Client();

        // Get the token's Medium app.
        $response = $client->post('https://api.medium.com/v1/tokens', [
            'headers' => [
                'Accept' => 'application/json'
            ],
            'form_params' => [
                'client_id' => $this->appOauthMediumId,
                'client_secret' => $this->appOauthMediumSecret,
                'code' => $code,
                'grant_type' => 'authorization_code',
                'redirect_uri' => 'https:'.$this->generateUrl('loginMedium', [], UrlGeneratorInterface::NETWORK_PATH),
            ]
        ]);

        $tokenResp = json_decode((string) $response->getBody(), true);
        if (!$tokenResp || !isset($tokenResp['access_token'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }
        $token = $tokenResp['access_token'];
        $refreshToken = $tokenResp['refresh_token'];

        $config = $this->configService->findOne();
        if (!$config) {
            $config = new Config();
        }
        $config->setMediumToken($token);
        $config->setMediumRefreshToken($refreshToken);

        $this->configService->save($config);

        return new JsonResponse();
    }

    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     *
     * @throws \Exception
     */
    public function register(Request $request)
    {
        $user = new User();

        $form = $this->createForm(RegisterType::class, $user, array(
            'csrf_protection' => false,
        ));

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

            return new JsonResponse(array(
                'token' => $this->jwtTokenManager->create($user)
            ));
        }

        return new JsonResponse(array(
            'message' => $form->getErrors(true)->current()->getMessage(),
        ), 401);
    }
}
