<?php

namespace App\Services;

use App\Entity\Contact;
use Doctrine\ORM\EntityManager;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;

class ContactService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var ContactRepository
     */
    protected $contactRepository;

    public function __construct(
        EntityManagerInterface $em
    )
    {
        $this->em = $em;
        $this->contactRepository = $this->em->getRepository(Contact::class);
    }

    public function save(Contact $contact): Contact
    {
        $contact->setUpdated(new \DateTime());

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
