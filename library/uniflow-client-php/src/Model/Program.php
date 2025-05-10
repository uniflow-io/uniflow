<?php

namespace App\Model;

class Program {
    private $programData;

    public function __construct($programData) {
        $this->programData = $programData;
    }

    public function serializeFlowsData($data) {
        $this->programData['data'] = json_encode($data);
    }

    public function deserializeFlowsData() {
        return json_decode($this->programData['data'], true);
    }
}
