<?php

namespace App\Twig;

use App\Service\ChangelogService;
use App\Twig\Runtime\AppExtensionRuntime;
use Twig\Attribute\AsTwigFunction;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class AppExtension
{
    public function __construct(private ChangelogService $changelogService)
    {
    }

    #[AsTwigFunction('display_version')]
    public function displayVersion(): string
    {
        return $this->changelogService->getLatestVersion();
    }
}
