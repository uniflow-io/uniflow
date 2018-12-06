<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegisterType;
use App\Services\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\LogicException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    /**
     * @var UserService
     */
    protected $userService;

    public function __construct(
        UserService $userService
    )
    {
        $this->userService = $userService;
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
     */
    public function facebookLogin(Request $request)
    {
        $token = null;

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $token = isset($data['access_token']) ? $data['access_token'] : null;
        }

        // Get the token's FB app info.
        @$tokenAppResp = file_get_contents('https://graph.facebook.com/app/?access_token=' . $token);
        if (!$tokenAppResp) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        // Make sure it's the correct app.
        $tokenApp = json_decode($tokenAppResp, true);
        if (!$tokenApp || !isset($tokenApp['id']) || $tokenApp['id'] != $this->container->getParameter('oauth.facebook.id')) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        // Get the token's FB user info.
        @$tokenUserResp = file_get_contents('https://graph.facebook.com/me/?access_token=' . $token);
        if (!$tokenUserResp) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        // Try to fetch user by it's token ID, create it otherwise.
        $tokenUser = json_decode($tokenUserResp, true);
        if (!$tokenUser || !isset($tokenUser['id'])) {
            throw new AccessDeniedHttpException('Bad credentials.');
        }

        $userProvider = $this->get("user_bundle.oauth_user_provider");
        $user = $userProvider->loadUserByUsername($tokenUser['id']);

        if ($user === null) {
            /** @var UserManager $userManager */
            $userManager = $this->get("fos_user.user_manager");
            /** @var AuthUser $user */
            $user = $userManager->createUser();
            $user->setFacebookID($tokenUser['id']);
            $user->setFacebookAccessToken($token);
            //I have set all requested data with the user's username
            //modify here with relevant data
            $user->setUsername($tokenUser['id']);
            $user->setFirstName($tokenUser['first_name']);
            $user->setLastName($tokenUser['last_name']);
            $user->setEmail($tokenUser['email']);
            $user->setPlainPassword(substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil(10 / strlen($x)))), 1, 10));
            $user->setEnabled(true);
            $userManager->updateUser($user);
        }

        return new JsonResponse(array(
            'token' => $this->get('lexik_jwt_authentication.jwt_manager')->create($user)
        ));
    }

    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     *
     * @throws \Exception
     */
    public function register(Request $request, UserPasswordEncoderInterface $encoder)
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
            $user->setPassword($encoder->encodePassword($user, $user->getPassword()));
            $this->userService->save($user);

            $this->get('session')->getFlashBag()->add(
                'notice',
                'User registered !'
            );

            return new JsonResponse(array(
                'token' => $this->get('lexik_jwt_authentication.jwt_manager')->create($user)
            ));
        }

        return new JsonResponse(array(
            'message' => $form->getErrors(true)->current()->getMessage(),
        ), 401);
    }
}
