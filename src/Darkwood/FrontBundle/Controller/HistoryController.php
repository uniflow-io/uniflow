<?php

namespace Darkwood\FrontBundle\Controller;

use Darkwood\FrontBundle\Form\HistoryType;
use Darkwood\FrontBundle\Entity\History;
use Darkwood\FrontBundle\Services\HistoryService;
use Darkwood\FrontBundle\Services\TagService;
use Darkwood\UserBundle\Entity\User;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Class SFTPComponentController.
 */
class HistoryController extends Controller
{
    public function listAction(Request $request)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $data = $this->get('dw.history')->getHistory($user);

        return new JsonResponse($data);
    }

    /**
     * Creates a form to create a History entity.
     *
     * @param Request $request
     * @param History $entity The entity
     * @return Response
     */
    private function manage(Request $request, History $entity)
    {
        $form = $this->createForm(HistoryType::class, $entity, array(
            'csrf_protection' => false,
        ));

        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();
            if (!empty($content)) {
                $data = json_decode($content, true);
                $form->submit($data);
            } else {
                $form->handleRequest($request);
            }

            if ($form->isValid()) {
                $this->get('dw.history')->save($entity);
                $this->get('dw.tag')->clean();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Tendance sauvegardée !'
                );

                return new JsonResponse($this->get('dw.history')->getJsonHistory($entity));
            }
        }

        return new JsonResponse($this->get('dw.history')->getJsonHistory($entity), 400);
    }

    /**
     * Displays a form to create a new History entity.
     *
     */
    public function createAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if(!$this->isGranted('ROLE_SUPER_ADMIN') && $user->getHistories()->count() >= 5) {
            throw new AccessDeniedException('You are not alowed to create more history');
        }

        $entity = new History();
        $entity->setCreated(new \DateTime());
        $entity->setUser($user);

        return $this->manage($request, $entity);
    }

    /**
     * Displays a form to edit an existing History entity.
     *
     */
    public function editAction(Request $request, $id)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->get('dw.history')->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        return $this->manage($request, $entity);
    }

    public function getDataAction(Request $request, $id)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->get('dw.history')->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        return new JsonResponse(array('data' => $entity->getData()));
    }

    public function setDataAction(Request $request, $id)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->get('dw.history')->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();
            $entity->setData($content);

            $this->get('dw.history')->save($entity);

            return new JsonResponse(true);
        }

        return new JsonResponse(false, 400);
    }

    public function deleteAction(Request $request, $id)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->get('dw.history')->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        $this->get('dw.history')->remove($entity);

        return new JsonResponse($this->get('dw.history')->getJsonHistory($entity));
    }
}
