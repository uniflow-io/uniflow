<?php

declare(strict_types=1);

namespace App\Twig\Components\Flow;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\UX\TwigComponent\Attribute\PreMount;

#[AsLiveComponent]
final class FunctionFlow
{
    use DefaultActionTrait;

    public string $code;

    #[PreMount]
    public function preMount(array $data)
    {
        $decodedData = $this->onDeserialize($data['data']);
        $this->code = $decodedData['code'];

        return $data;
    }

    public function onSerialize(array $decodedData): string
    {
        return json_encode($decodedData['code'] ?? null);
    }

    public function onDeserialize(?string $data = null): array
    {
        $code = $data ? json_decode($data, true) : null;

        return ['code' => $code];
    }

    public function onCompile(array $decodedData): string
    {
        return $decodedData['code'] ?? '';
    }
}
