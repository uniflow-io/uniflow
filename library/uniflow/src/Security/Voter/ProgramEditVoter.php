<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\Program;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProgramEditVoter extends Voter
{
    public const EDIT = 'edit';

    protected function supports(string $attribute, $subject): bool
    {
        return $attribute === self::EDIT && $subject instanceof Program;
    }

    /**
     * @var Program
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        return $token->getUser() === $subject->getUser();
    }
}
