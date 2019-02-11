<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Form\ContactType;
use App\Services\ContactService;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;

class ContactController extends AbstractController
{
    /**
     * @var ContactService
     */
    protected $contactService;

    public function __construct(
        ContactService $contactService
    ) {
        $this->contactService = $contactService;
    }

    /**
     * @Route("/api/contact/create", name="api_contact_set", methods={"POST"})
     *
     * @param Request $request
     * @return JsonResponse
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function create(Request $request)
    {
        $contact = new Contact();

        $form = $this->createForm(ContactType::class, $contact, array(
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
            $this->contactService->save($contact);

            return new JsonResponse(true);
        }

        return new JsonResponse(array(
            'message' => $form->getErrors(true)->current()->getMessage(),
        ), 400);
    }
}
