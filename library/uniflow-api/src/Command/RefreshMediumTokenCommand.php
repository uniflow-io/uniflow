<?php

namespace App\Command;

use App\Services\ConfigService;
use GuzzleHttp\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AsCommand(
    name: 'app:refresh-medium-token',
    description: 'Refresh Medium token'
)]
class RefreshMediumTokenCommand extends Command
{



    public function __construct(
        private readonly string $appOauthMediumId,
        private readonly string $appOauthMediumSecret,
        private readonly ConfigService $configService,
        private readonly HttpClientInterface $httpClient
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $config = $this->configService->findOne();
        if ($config && $config->getMediumToken() && $config->getMediumRefreshToken()) {
            // Get the token's Medium app.
            $response = $this->httpClient->request('POST', 'https://api.medium.com/v1/tokens', [
                'headers' => [
                    'Accept' => 'application/json'
                ],
                'body' => [
                    'refresh_token' => $config->getMediumRefreshToken(),
                    'client_id' => $this->appOauthMediumId,
                    'client_secret' => $this->appOauthMediumSecret,
                    'grant_type' => 'refresh_token',
                ]
            ]);

            $tokenResp = $response->toArray();

            $token = $tokenResp['access_token'];
            $refreshToken = $tokenResp['refresh_token'];

            $config->setMediumToken($token);
            $config->setMediumRefreshToken($refreshToken);

            $this->configService->save($config);
        }

        $io->success('Medium token is refreshed');
        return Command::SUCCESS;
    }
}
