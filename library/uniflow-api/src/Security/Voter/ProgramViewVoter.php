<?php


namespace App\Security\Voter;


use App\Entity\Program;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProgramViewVoter extends Voter
{
    public const VIEW = 'view';

    /**
     * @inheritDoc
     */
    protected function supports(string $attribute, $subject)
    {
        return $attribute === self::VIEW && $subject instanceof Program;
    }

    /**
     * @inheritDoc
     * @var Program $subject
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token)
    {
        if($subject->getPublic())
        {
            return true;
        }

        return $token->getUser() === $subject->getUser();
    }
}
