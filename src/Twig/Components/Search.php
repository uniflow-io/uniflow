<?php

declare(strict_types=1);

namespace App\Twig\Components;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class Search
{
    use DefaultActionTrait;

    public function getFlowItems()
    {
        return [
            /*[
                'key' => 'uniflow-flow-assets',
                'label' => 'Assets',
            ],
            [
                'key' => 'uniflow-flow-canvas',
                'label' => 'Canvas',
            ],*/
            [
                'key' => 'uniflow-flow-function',
                'label' => 'Function',
            ],
            [
                'key' => 'uniflow-flow-object',
                'label' => 'Object',
            ],
            /*[
                'key' => 'uniflow-flow-prompt',
                'label' => 'Prompt',
            ],*/
            [
                'key' => 'uniflow-flow-text',
                'label' => 'Text',
            ],
        ];
    }
}
