<?php

namespace App\Controller\Api;

use App\Services\UserService;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\HistoryType;
use App\Entity\History;
use App\Services\HistoryService;
use App\Services\TagService;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class HistoryController extends AbstractController
{
    /**
     * @var HistoryService
     */
    protected $historyService;

    /**
     * @var TagService
     */
    protected $tagService;

    /**
     * @var UserService
     */
    protected $userService;

    public function __construct(
        HistoryService $historyService,
        TagService $tagService,
        UserService $userService
    )
    {
        $this->historyService = $historyService;
        $this->tagService = $tagService;
        $this->userService = $userService;
    }

    /**
     * @Route("/api/history/{username}/list/{platform}", name="api_history_list", methods={"GET"})
     *
     * @param string $username
     * @param string $platform
     * @return JsonResponse
     */
    public function listAction($username = 'me', $platform = null)
    {
        $user = $this->getUser();
        if ($username === 'me' && !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if($user instanceof UserInterface && ($username === 'me' || $username === $user->getUsername())) {
            $histories = $this->historyService->getHistoryByPlatform($user, $platform);
        } else {
            $user = $this->userService->findOneByUsername($username);
            if(is_null($user)) {
                throw new NotFoundHttpException();
            }

            $histories = $this->historyService->getPublicHistoryByUsernameAndPlatform($username, $platform);
        }

        $data = array();
        foreach ($histories as $history) {
            $data[] = $this->historyService->getJsonHistory($history);
        }

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

        if (in_array( $request->getMethod(), array('POST', 'PUT'))) {
            $content = $request->getContent();
            if (!empty($content)) {
                $data = json_decode($content, true);
                $form->submit($data);
            } else {
                $form->handleRequest($request);
            }

            if ($form->isValid()) {
                $this->historyService->save($entity);
                $this->tagService->clean();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'History saved !'
                );

                return new JsonResponse($this->historyService->getJsonHistory($entity));
            }
        }

        return new JsonResponse($this->historyService->getJsonHistory($entity), 400);
    }

    /**
     * @Route("/api/history/create", name="api_history_create", methods={"POST"})
     *
     * @param Request $request
     * @return Response
     * @throws \Exception
     */
    public function create(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if(!$this->isGranted('ROLE_USER_PRO') && $user->getHistories()->count() >= 5) {
            throw new AccessDeniedException('You are not alowed to create more history');
        }

        $entity = new History();
        $entity->setCreated(new \DateTime());
        $entity->setUser($user);

        return $this->manage($request, $entity);
    }

    /**
     * @Route("/api/history/update/{id}", name="api_history_update", methods={"PUT"})
     *
     * @param Request $request
     * @param $id
     * @return Response
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function update(Request $request, $id)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->historyService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        return $this->manage($request, $entity);
    }

    /**
     * @Route("/api/history/getData/{id}", name="api_history_get_data", methods={"GET"})
     *
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getData($id)
    {
        $entity = $this->historyService->findOne($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        if(!$entity->getPublic()) {
            $user = $this->getUser();
            if (!$user instanceof UserInterface || $entity->getUser()->getId() != $user->getId()) {
                throw $this->createAccessDeniedException('You are not allowed to view this section.');
            }
        }

        return new JsonResponse(array('data' => $entity->getData()));
    }

    /**
     * @Route("/api/history/setData/{id}", name="api_history_set_data", methods={"PUT"})
     *
     * @param Request $request
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function setData(Request $request, $id)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->historyService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        if ('PUT' === $request->getMethod()) {
            $content = $request->getContent();

            $decoder = new JsonDecode();
            try{
                $json = $decoder->decode($content, 'json');

                if(!$this->isGranted('ROLE_USER_PRO') && $json) {
                    foreach ($json as $item) {
                        if(!in_array($item->component, array('javascript', 'text'))) {
                            return new JsonResponse(false, 400);
                        }
                    }
                }
            } catch (NotEncodableValueException $e) {
                return new JsonResponse(false, 400);
            }

            $entity->setData($content);

            $this->historyService->save($entity);

            return new JsonResponse(true);
        }

        return new JsonResponse(false, 400);
    }

    /**
     * @Route("/api/history/delete/{id}", name="api_history_delete", methods={"DELETE"})
     *
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function delete($id)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->historyService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        $this->historyService->remove($entity);

        return new JsonResponse($this->historyService->getJsonHistory($entity));
    }



    /**
     * @Route("/api/history/last-public", name="api_history_last_public", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function lastPublic()
    {
        $histories = $this->historyService->findLastPublic(15);

        return new JsonResponse([
            'flow' => array_map(function(History $history) {
                return array(
                    'title' => $history->getTitle(),
                    'slug' => $history->getSlug(),
                    'description' => $history->getDescription(),
                    'username' => $history->getUser()->getUsername(),
                );
            }, $histories),
        ]);
    }
}