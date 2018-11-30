<?php

namespace App\Controller\Api;

use App\Form\SettingsType;
use App\Services\UserService;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

class UserController extends AbstractController
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
     * @Route("/api/user/register", name="api_user_register", methods={"POST"})
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request)
    {
        $data = [];

        return new JsonResponse($data);
    }

    /**
     * @Route("/api/user/getComponents", name="api_user_get_components", methods={"PUT"})
     *
     * @param Request $request
     * @return JsonResponse
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

            /*if(!$this->isGranted('ROLE_SUPER_ADMIN') && $data) {
                $data = array_filter($data, function($item) {
                    return in_array($item, array('code', 'text'));
                });
            }*/
        }

        return new JsonResponse($data);
    }

    /**
     * @Route("/api/user/getSettings", name="api_user_get_settings", methods={"GET"})
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getSettings(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        return new JsonResponse($this->userService->getJsonSettings($user));
    }

    /**
     * @Route("/api/user/setSettings", name="api_user_set_settings", methods={"PUT"})
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function setSettings(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

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

        return new JsonResponse(array(
            'message' => $form->getErrors(true)->current()->getMessage(),
        ), 400);
    }
}
