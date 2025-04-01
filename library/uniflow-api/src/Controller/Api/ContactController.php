<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Form\ContactType;
use App\Services\ContactService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Contact;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Twig\Environment;

class ContactController extends AbstractController
{
    /**
     * @var ContactService
     */
    protected $contactService;

    /**
     * @var Environment
     */
    protected $twig;

    /**
     * @var MailerInterface
     */
    protected $mailer;

    public function __construct(
        ContactService $contactService,
        Environment $twig,
        MailerInterface $mailer
    ) {
        $this->contactService = $contactService;
        $this->twig = $twig;
        $this->mailer = $mailer;
    }

    private function send(string $templateName, array $context, string $fromEmail, string $toEmail): void
    {
        $template = $this->twig->load($templateName);
        $subject = $template->renderBlock('subject', $context);
        $textBody = $template->renderBlock('body_text', $context);
        $htmlBody = $template->renderBlock('body_html', $context);

        $message = (new Email())
            ->from($fromEmail)
            ->to($toEmail)
            ->subject($subject);

        if (!empty($htmlBody)) {
            $message
                ->html($htmlBody)
                ->text($textBody);
        } else {
            $message->html($textBody);
        }

        $this->mailer->send($message);
    }

    /**
     * @Route("/api/contact/create", name="api_contact_set", methods={"POST"})
     */
    public function create(Request $request): JsonResponse
    {
        $contact = new Contact();

        $form = $this->createForm(ContactType::class, $contact, [
            'csrf_protection' => false,
        ]);

        $content = $request->getContent();
        if (!empty($content)) {
            $data = json_decode($content, true);
            $form->submit($data);
        } else {
            $form->handleRequest($request);
        }

        if ($form->isValid()) {
            $this->contactService->save($contact);

            $this->send('mails/contact.html.twig', [
                'contact' => $contact,
            ], 'matyo@uniflow.io', 'matyo@uniflow.io');

            return new JsonResponse(true);
        }

        return new JsonResponse([
            'message' => $form->getErrors(true)->current()->getMessage(),
        ], Response::HTTP_BAD_REQUEST);
    }
}
