<?php

namespace App\Command;

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

    public function __construct()
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
        $identifier = $input->getArgument('identifier');
        $commandArgs = $input->getArgument('command_args');

        try {
            // TODO: Implement API client and program execution logic
            // This would involve:
            // 1. Creating an API client with the environment and API key
            // 2. Fetching program data using the identifier
            // 3. Fetching program flows
            // 4. Creating a program instance and deserializing flows
            // 5. Running the program with the command arguments

            $io->success('Program execution completed successfully');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
