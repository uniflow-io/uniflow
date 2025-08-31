<?php

declare(strict_types=1);

namespace App\Twig;

use App\Service\ChangelogService;
use Twig\Attribute\AsTwigFunction;

class AppExtension
{
    public function __construct(private readonly ChangelogService $changelogService) {}

    #[AsTwigFunction('display_version')]
    public function displayVersion(): string
    {
        return $this->changelogService->getLatestVersion();
    }
}
