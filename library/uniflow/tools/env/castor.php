<?php

declare(strict_types=1);

namespace App\Tools;

use Castor\Attribute\AsTask;

use function Castor\run;

#[AsTask(description: 'Start dev server', aliases: ['env-dev'])]
function envDev(): int
{
    return run(
        ['nix shell github:loophp/nix-shell#env-php82 --extra-experimental-features nix-command --extra-experimental-features flakes'],
        tty: true,
        allowFailure: true,
    )->getExitCode();
}
