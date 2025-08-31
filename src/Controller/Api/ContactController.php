<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Contact;
use App\Form\ContactType;
use App\Service\ContactService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Uid\Uuid;
use Twig\Environment;

#[Route('/api/v1/uniflow/contact')]
class ContactController extends AbstractController
{
    public function __construct(protected ContactService $contactService, protected Environment $twig, protected MailerInterface $mailer) {}

    #[Route(path: '/create', name: 'api_contact_set', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $contact = new Contact();
        $contact->setUid(Uuid::v7()->toString());

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

    private function send(string $templateName, array $context, string $fromEmail, string $toEmail): void
    {
        $template = $this->twig->load($templateName);
        $subject = $template->renderBlock('subject', $context);
        $textBody = $template->renderBlock('body_text', $context);
        $htmlBody = $template->renderBlock('body_html', $context);

        $message = (new Email())
            ->from($fromEmail)
            ->to($toEmail)
            ->subject($subject)
        ;

        if ($htmlBody !== '' && $htmlBody !== '0') {
            $message
                ->html($htmlBody)
                ->text($textBody)
            ;
        } else {
            $message->html($textBody);
        }

        $this->mailer->send($message);
    }
}
