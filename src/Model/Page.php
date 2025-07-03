<?php

declare(strict_types=1);

namespace App\Model;

class Page
{
    public function __construct(
        public readonly string $page,
        public readonly string $title,
        public readonly string $description,
        public readonly array $data = []
    ) {
    }
}
