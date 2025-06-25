<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\Yaml\Yaml;

class ChangelogService
{
    private string $changelogPath;

    public function __construct(string $kernelProjectDir)
    {
        $this->changelogPath = $kernelProjectDir . '/assets/docs/changelog.yaml';
    }

    public function getChangelogItems(): array
    {
        $yamlContent = file_get_contents($this->changelogPath);
        $data = Yaml::parse($yamlContent);

        // Sort by date in descending order (newest first)
        usort($data, function ($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return $data;
    }

    public function getLatestVersion(): string
    {
        $items = $this->getChangelogItems();
        return $items[0]['tag'];
    }
}