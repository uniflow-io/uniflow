<?php

namespace App\Controller;

use App\Form\SettingsType;
use App\Services\UserService;
use Symfony\Component\Routing\Annotation\Route;
use App\Form\HistoryType;
use App\Entity\History;
use App\Services\HistoryService;
use App\Services\TagService;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class ApiHistoryController extends Controller
{
    /**
     * @var HistoryService
     */
    protected $historyService;

    /**
     * @var TagService
     */
    protected $tagService;

    public function __construct(
        HistoryService $historyService,
        TagService $tagService
    )
    {
        $this->historyService = $historyService;
        $this->tagService = $tagService;
    }

    /**
     * @param Request $request
     * @param string $platform
     * @return JsonResponse
     * @Route("/api/history/list/{platform}", name="api_history_list")
     */
    public function listAction(Request $request, $platform = null)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $data = $this->historyService->getHistoryByPlatform($user, $platform);

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
     * Displays a form to create a new History entity.
     * @Route("/api/history/create", name="api_history_create")
     */
    public function create(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
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
     * @param Request $request
     * @param $id
     * @return Response
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @Route("/api/history/update/{id}", name="api_history_update")
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
     * @param Request $request
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @Route("/api/history/getData/{id}", name="api_history_get_data")
     */
    public function getData(Request $request, $id)
    {
        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->historyService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        return new JsonResponse(array('data' => $entity->getData()));
    }

    /**
     * @param Request $request
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @Route("/api/history/setData/{id}", name="api_history_set_data")
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

        if ('POST' === $request->getMethod()) {
            $content = $request->getContent();

            $decoder = new JsonDecode();
            try{
                $json = $decoder->decode($content, 'json');

                if(!$this->isGranted('ROLE_SUPER_ADMIN') && $json) {
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
     * @param Request $request
     * @param $id
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @Route("/api/history/delete/{id}", name="api_history_delete")
     */
    public function delete(Request $request, $id)
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
}
