<?php

namespace App\Twig\Components\Flow;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class CanvasFlow
{
    use DefaultActionTrait;
}
