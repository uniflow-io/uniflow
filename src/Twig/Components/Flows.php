<?php

namespace App\Twig\Components;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class Flows
{
    use DefaultActionTrait;

    public function getFlowItems() {
        return [
            [
                'key' => 'uniflow-flow-assets',
                'label' => 'Assets',
            ],
            [
                'key' => 'uniflow-flow-canvas',
                'label' => 'Canvas',
            ],
            [
                'key' => 'uniflow-flow-function',
                'label' => 'Function',
            ],
            [
                'key' => 'uniflow-flow-object',
                'label' => 'Object',
            ],
            [
                'key' => 'uniflow-flow-prompt',
                'label' => 'Prompt',
            ],
            [
                'key' => 'uniflow-flow-text',
                'label' => 'Text',
            ],
        ];
    }
}
