<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\Program;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ProgramViewVoter extends Voter
{
    public const VIEW = 'view';

    protected function supports(string $attribute, $subject): bool
    {
        return $attribute === self::VIEW && $subject instanceof Program;
    }

    /**
     * @var Program
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        if ($subject->getPublic()) {
            return true;
        }

        return $token->getUser() === $subject->getUser();
    }
}
