<?php

namespace App\Command;

use App\Bridge\AgentBridge;
use App\Model\Api;
use App\Model\Program;
use App\Model\Runner;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:client',
    description: 'Uniflow client command for program execution',
)]
class ClientCommand extends Command
{
    private ?string $apiKey;
    private string $environment;

    public function __construct(private AgentBridge $agentBridge)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('identifier', InputArgument::REQUIRED, 'Program identifier')
            ->addArgument('command_args', InputArgument::IS_ARRAY, 'Additional command arguments')
            ->addOption('api-key', null, InputOption::VALUE_REQUIRED, 'API Key for authentication')
            ->addOption('environment', null, InputOption::VALUE_OPTIONAL, 'Environment (default: prod)', 'prod')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Get and validate API key
        $this->apiKey = $input->getOption('api-key');
        if (!$this->apiKey) {
            $io->error('You must provide an API key: use --api-key=[Your Api Key]');
            return Command::FAILURE;
        }

        // Get environment
        $this->environment = $input->getOption('environment');

        // Get identifier and command args
        $api = new Api($this->environment, $this->apiKey);
        $identifier = $input->getArgument('identifier');
        $commandArgs = $input->getArgument('command_args');

        //try {
            // Fetch program data
            $response = $api->endpoint('program');
            $data = json_decode($response, true);

            // Find program by identifier
            $programData = null;
            foreach ($data as $program) {
                if ($program['slug'] === $identifier) {
                    $programData = $program;
                    break;
                }
            }

            if (!$programData) {
                $io->error('No such program [' . $identifier . ']');
                return Command::FAILURE;
            }

            // Fetch program flows
            $response = $api->endpoint('program_flows', ['uid' => $programData['uid']]);
            $data = json_decode($response, true);
            $programData['data'] = $data['data'];

            // Create program instance and run flows
            $program = new Program($programData);
            $flows = $program->deserializeFlowsData();
            $runner = new Runner($commandArgs, $api, $this->agentBridge);
            $runner->run($flows);

            $io->success('Program execution completed successfully');
            return Command::SUCCESS;
        /*} catch (\Exception $e) {
            $io->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }*/
    }
}
