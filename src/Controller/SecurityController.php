<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegisterType;
use App\Services\UserService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\LogicException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends Controller
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
