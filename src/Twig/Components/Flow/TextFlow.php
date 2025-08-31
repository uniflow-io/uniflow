<?php

declare(strict_types=1);

namespace App\Twig\Components\Flow;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsLiveComponent]
final class TextFlow
{
    use DefaultActionTrait;

    public ?string $variable = null;

    public ?string $text = null;

    #[PreMount]
    public function preMount(array $data)
    {
        $decodedData = $this->onDeserialize($data['data']);
        $this->variable = $decodedData['variable'];
        $this->text = $decodedData['text'];

        return $data;
    }

    public function onSerialize(array $decodedData): string
    {
        return json_encode($decodedData['variable'] ?? null, $decodedData['text'] ?? null);
    }

    public function onDeserialize(?string $data = null): array
    {
        if ($data === null) {
            return ['variable' => null, 'text' => null];
        }

        [$variable, $text] = json_decode($data, true);

        return ['variable' => $variable, 'text' => $text];
    }

    public function onCompile(array $decodedData): string
    {
        if (empty($decodedData['variable'])) {
            return '';
        }

        $text = $decodedData['text'] ?? '';
        $text = json_encode($text);

        return $decodedData['variable'] . ' = ' . $text;
    }
}
