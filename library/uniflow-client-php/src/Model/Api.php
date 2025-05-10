<?php

namespace App\Model;

class Api {
    private $env;
    private $key;

    public function __construct($env, $key) {
        $this->env = $env;
        $this->key = $key;
    }

    public function endpoint($endpoint, $params = []) {
        $httpHost = 'https://api.uniflow.io';
        if ($this->env === 'dev') {
            $httpHost = 'http://127.0.0.1:8017';
        }

        $endpoints = [
            'program' => "/api/v1/uniflow/program/me/list?client=php&apiKey={$this->key}",
            'program_flows' => "/api/v1/uniflow/program/{uid}/flows?apiKey={$this->key}"
        ];

        $path = $endpoints[$endpoint];
        foreach ($params as $key => $value) {
            $path = str_replace('{' . $key . '}', $value, $path);
        }

        return file_get_contents($httpHost . $path);
    }
}
