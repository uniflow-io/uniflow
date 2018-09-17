<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ProfileType;
use App\Services\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends Controller
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
     * @param Request $request
     * @return JsonResponse
     * @Route("/user/components", name="user_components")
     */
    public function components(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $data = [];
        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();
            if (!empty($content)) {
                $data = json_decode($content, true);

                if(!$this->isGranted('ROLE_SUPER_ADMIN') && $data) {
                    $data = array_filter($data, function($item) {
                        return in_array($item, array('code', 'text'));
                    });
                }
            }
        }

        return new JsonResponse($data);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/user/profile", name="user_profile")
     */
    public function profile(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ('POST' === $request->getMethod()) {
            $form = $this->createForm(ProfileType::class, $user, array(
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
                $this->userService->save($user);

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'User saved !'
                );

                return new JsonResponse($this->userService->getJsonProfile($user));
            }

            return new JsonResponse($this->userService->getJsonProfile($user), 400);
        }

        return new JsonResponse($this->userService->getJsonProfile($user));
    }
}
