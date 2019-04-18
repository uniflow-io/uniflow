<?php

namespace App\Services;

use App\Entity\Contact;
use Doctrine\ORM\EntityManager;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ContactService
 * `
 * Object manager of contact.
 */
class ContactService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * Repository
     *
     * @var ContactRepository
     */
    protected $contactRepository;

    public function __construct(
        EntityManagerInterface $em
    ) {
        $this->em             = $em;
        $this->contactRepository = $this->em->getRepository(Contact::class);
    }

    /**
     * Save one contact
     *
     * @param Contact $contact
     * @return Contact
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function save(Contact $contact)
    {
        // Save contact
        $contact->setUpdated(new \DateTime());

        $this->em->persist($contact);
        $this->em->flush();

        return $contact;
    }

    /**
     * Remove one contact
     *
     * @param Contact $contact
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function remove(Contact $contact)
    {
        $this->em->remove($contact);
        $this->em->flush();
    }

    /**
     * @return Contact[]
     */
    public function findAll()
    {
        return $this->contactRepository->findAll();
    }

    /**
     * @param null $id
     * @return Contact
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        return $this->contactRepository->findOne($id);
    }
}
