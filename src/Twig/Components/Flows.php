<?php

declare(strict_types=1);

namespace App\Twig\Components;

use App\Entity\Program;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class Flows
{
    use DefaultActionTrait;

    public Program $program;

    public function getFlows()
    {
        return json_decode($this->program->getData(), true);
    }
}
