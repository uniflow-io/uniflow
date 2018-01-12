<?php

namespace Darkwood\FrontBundle\Controller;

use FOS\UserBundle\Model\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class UserController extends Controller
{
    public function componentsAction(Request $request)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $data = [];
        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();
            if (!empty($content)) {
                $data = json_decode($content, true);

                if(!$this->isGranted('ROLE_SUPER_ADMIN') && $data) {
                    $data = array_filter($data, function($item) {
                        return in_array($item, array('core-javascript', 'core-text'));
                    });
                }
            }
        }

        return new JsonResponse($data);
    }
}
