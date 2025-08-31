<?php

declare(strict_types=1);

namespace App\Twig\Components\Flow;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class AssetsFlow
{
    use DefaultActionTrait;
}
