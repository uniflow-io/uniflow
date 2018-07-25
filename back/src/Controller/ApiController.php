<?php

namespace App\Controller;

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
use Symfony\Component\Security\Core\Authorization\AccessDecisionManagerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class ApiController extends Controller
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
     * @Route("/api/history", name="api_history")
     */
    public function listAction(Request $request)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $data = $this->historyService->getHistory($user);

        return new JsonResponse($data);
    }

    /**
     * @param Request $request
     * @param $id
     * @return JsonResponse
     * @Route("/api/history/{id}", name="api_history_data")
     * 
     */
    public function getData(Request $request, $id)
    {
        $user = $this->getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $entity = $this->historyService->findOneByUser($user, $id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find History entity.');
        }

        return new JsonResponse(array('data' => $entity->getData()));
    }
}
