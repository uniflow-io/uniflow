<?php

namespace App\Bridge;

use NeuronAI\Agent;
use NeuronAI\MCP\McpConnector;
use NeuronAI\Providers\AIProviderInterface;
use NeuronAI\Providers\OpenAI\OpenAI;
use NeuronAI\SystemPrompt;

class AgentBridge extends Agent {
    public function __construct(private string $apiKey) {
    }

    protected function provider(): AIProviderInterface
    {
        return new OpenAI(
            key: $this->apiKey,
            model: 'gpt-4.1'
        );
    }

    public function instructions(): string
	{
        return "";

        /*return new SystemPrompt(
            background: [
                "I am an AI assistant designed to help users with their questions and tasks",
                "I aim to be helpful, friendly, and provide accurate information",
                "I will communicate clearly and professionally"
            ],
            steps: [
                "Listen carefully to the user's question or request",
                "Process the information and formulate a clear, relevant response",
                "Provide accurate and helpful information in a friendly manner",
                "Ask clarifying questions if needed to better assist the user"
            ],
            output: [
                "Clear and concise responses that directly address the user's needs",
                "Professional and friendly communication style",
                "Accurate information and helpful suggestions when appropriate"
            ],
        );*/
	}

    public function getTools(): array
    {
        return [
            ...McpConnector::make([
                'command' => 'php',
                'args' => ['/Users/math/Sites/darkwood/composio-php-mcp-server/mcp-server.php'],
            ])->tools(),
            /*...McpConnector::make([
                'command' => 'bash',
                'args' => ['Users/math/Sites/darkwood/recherche-entreprise-mcp-server/bin/mcp.sh'],
            ])->tools(),*/
        ];
    }

    public function getBridge() {
        return self::make($this->apiKey);
    }
}
