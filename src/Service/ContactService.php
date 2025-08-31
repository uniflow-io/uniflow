<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Contact;
use App\Repository\ContactRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class ContactService
{
    /**
     * @var ContactRepository
     */
    protected EntityRepository $contactRepository;

    public function __construct(
        protected EntityManagerInterface $em
    ) {
        $this->contactRepository = $this->em->getRepository(Contact::class);
    }

    public function save(Contact $contact): Contact
    {
        $contact->setUpdated(new DateTime());

        $this->em->persist($contact);
        $this->em->flush();

        return $contact;
    }

    public function remove(Contact $contact): void
    {
        $this->em->remove($contact);
        $this->em->flush();
    }

    public function findOne(?int $id = null): ?Contact
    {
        return $this->contactRepository->findOne($id);
    }
}
