<?php

namespace App\Bridge;

class ConsoleBridge {
    private $bridge;

    public function __construct() {
        $this->bridge = [
            'log' => function(...$args) {
                echo implode(' ', $args) . PHP_EOL;
            },
            'info' => function(...$args) {
                echo implode(' ', $args) . PHP_EOL;
            },
            'warn' => function(...$args) {
                echo implode(' ', $args) . PHP_EOL;
            },
            'error' => function(...$args) {
                echo implode(' ', $args) . PHP_EOL;
            }
        ];
    }

    public function getBridge() {
        return $this->bridge;
    }
}
