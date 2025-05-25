<?php

namespace App\Model;

include __DIR__ . '/../../lib/js2php/build/JSInterpreter.php';

use App\Bridge\AgentBridge;
use App\Bridge\ConsoleBridge;
use JSInterpreter;
use JSParser;
use JSCompiler;
use NeuronAI\Chat\Messages\UserMessage;

class Runner {
    private $commandArgs;
    private $api;

    public function __construct($commandArgs, $api, private AgentBridge $agentBridge) {
        $this->commandArgs = $commandArgs;
        $this->api = $api;
    }

    public function run($flows) {
        $context = [
            //'console' => (new ConsoleBridge())->getBridge(),
            'log' => function(...$args) {
                echo implode(' ', $args) . PHP_EOL;
            },
            'agent' => $this->agentBridge->getBridge(),
        ];

        /*$message = new UserMessage("I would like to respond to important emails.

        Please find important unread emails in my inbox and summarize them here (leave out details, because people are watching).

        Then, find a free slot this week (May 14 2025) in my calendar that would be ideal to respond to ALL important emails and create a calendar event.");*/
        $message = new UserMessage("fetch my last email subject from gmail");
        //$message = new UserMessage("recherche l'entreprise LaPoste à Paris");
        /** @var Agent */
        $agent = $context['agent'];
        echo $agent->chat($message)->getContent()."\n";
        die(); // @todo remove this line

        $promise = new \React\Promise\Promise(function($resolve) {
            $resolve('');
        });

        foreach ($flows as $flow) {
            $promise = $promise->then(function($totalCode) use ($flow) {
                $interpreter = null;

                if ($flow['flow'] === '@uniflow-io/uniflow-flow-object') {
                    $interpreter = [
                        'onDeserialize' => function($data) {
                            if (!$data) {
                                return ['variable' => null, 'keyValueList' => []];
                            }
                            $decoded = json_decode($data, true);
                            return [
                                'variable' => $decoded[0],
                                'keyValueList' => $this->reverseTransform($decoded[1])
                            ];
                        },
                        'onCompile' => function($data) {
                            if (!$data || !$data['variable']) {
                                return '';
                            }
                            $object = $this->transform($data['keyValueList']);
                            return 'var ' . $data['variable'] . ' = ' . json_encode($object) . ';';
                        }
                    ];
                } elseif ($flow['flow'] === '@uniflow-io/uniflow-flow-text') {
                    $interpreter = [
                        'onDeserialize' => function($data) {
                            if (!$data) {
                                return ['variable' => null, 'text' => null];
                            }
                            $decoded = json_decode($data, true);
                            return [
                                'variable' => $decoded[0],
                                'text' => $decoded[1]
                            ];
                        },
                        'onCompile' => function($data) {
                            if (!$data || !$data['variable']) {
                                return '';
                            }
                            $text = $data['text'] ?? '';
                            return 'var ' . $data['variable'] . ' = ' . json_encode($text) . ';';
                        }
                    ];
                } elseif ($flow['flow'] === '@uniflow-io/uniflow-flow-function') {
                    $interpreter = [
                        'onDeserialize' => function($data) {
                            return ['code' => $data ? json_decode($data, true) : null];
                        },
                        'onCompile' => function($data) {
                            return $data['code'] ?? '';
                        }
                    ];
                }

                if ($interpreter) {
                    $data = $interpreter['onDeserialize']($flow['data']);
                    $code = $interpreter['onCompile']($data);
                    if ($code) {
                        $totalCode .= $code;
                    }
                }

                return $totalCode;
            });
        }

        $promise->then(function($code) {
            dump($code);
            $interpreter = new JSInterpreter($code);

            echo $interpreter->run(array());
            die();

            /*// Create parser and compiler instances
            $parser = new JSParser();
            $compiler = new JSCompiler();

            // Parse the JavaScript code
            list(, $ast) = $parser->parse('
                log("Hello from JavaScript!");
            ');

            // Compile to PHP code
            $code = $compiler($ast, ['generate' => 'string']);

            // Create interpreter with compiled code
            $interpreter = new JSInterpreter($code);

            // Run the code with the context
            $interpreter->run($context);
            die();*/
        });

        return $promise;
    }

    private function transform($list) {
        $object = [];
        foreach ($list as $item) {
            if (isset($item['key'])) {
                $value = $item['value'];
                if (is_string($value) && preg_match('/^[0-9]+$/', $value)) {
                    $value = (int)$value;
                }
                $object[$item['key']] = $value;
            }
        }
        return $object;
    }

    private function reverseTransform($object, $accessors = []) {
        $list = [];
        foreach ($object as $key => $value) {
            if (is_array($value)) {
                $list = array_merge($list, $this->reverseTransform($value, array_merge($accessors, [$key])));
            } else {
                $fullKey = $key;
                for ($i = count($accessors) - 1; $i >= 0; $i--) {
                    if ($fullKey[0] !== '[') {
                        $fullKey = '.' . $fullKey;
                    }

                    if (preg_match('/^[0-9]+$/', $accessors[$i])) {
                        $fullKey = '[' . $accessors[$i] . ']' . $fullKey;
                    } else {
                        $fullKey = $accessors[$i] . $fullKey;
                    }
                }
                $list[] = ['key' => $fullKey, 'value' => $value];
            }
        }
        return $list;
    }
}
