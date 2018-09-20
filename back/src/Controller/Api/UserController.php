<?php

namespace App\Controller\Api;

use App\Form\SettingsType;
use App\Services\UserService;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

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
     * @Route("/api/user/components", name="api_user_components", methods={"PUT"})
     */
    public function components(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $data = [];
        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);

            if(!$this->isGranted('ROLE_SUPER_ADMIN') && $data) {
                $data = array_filter($data, function($item) {
                    return in_array($item, array('code', 'text'));
                });
            }
        }

        return new JsonResponse($data);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/api/user/settings", name="api_user_settings", methods={"GET", "PUT"})
     */
    public function settings(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ('PUT' === $request->getMethod()) {
            $form = $this->createForm(SettingsType::class, $user, array(
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
                    'Settings saved !'
                );

                return new JsonResponse($this->userService->getJsonSettings($user));
            }

            return new JsonResponse($this->userService->getJsonSettings($user), 400);
        }

        return new JsonResponse($this->userService->getJsonSettings($user));
    }
}
