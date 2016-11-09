<?php

namespace Darkwood\FrontBundle\Controller;

use Darkwood\FrontBundle\Form\HistoryType;
use Darkwood\FrontBundle\Entity\History;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SFTPComponentController.
 */
class HistoryController extends Controller
{
    public function listAction(Request $request)
    {
        $data = $this->get('dw.history')->getHistory();

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
        $entity = new History();
        $entity->setCreated(new \DateTime());

        return $this->manage($request, $entity);
    }

    /**
     * Displays a form to edit an existing History entity.
     *
     */
    public function editAction(Request $request, $id)
    {
        $entity = $this->get('dw.history')->findOne($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        return $this->manage($request, $entity);
    }
    
    public function deleteAction(Request $request, $id)
    {
        $entity = $this->get('dw.history')->findOne($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        $this->get('dw.history')->remove($entity);
    }
}
