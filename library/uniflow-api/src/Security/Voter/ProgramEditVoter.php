<?php


namespace App\Security\Voter;


use App\Entity\Program;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProgramEditVoter extends Voter
{
    public const EDIT = 'edit';

    /**
     * @inheritDoc
     */
    protected function supports(string $attribute, $subject)
    {
        return $attribute === self::EDIT && $subject instanceof Program;
    }

    /**
     * @inheritDoc
     * @var Program $subject
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token)
    {
        return $token->getUser() === $subject->getUser();
    }
}
