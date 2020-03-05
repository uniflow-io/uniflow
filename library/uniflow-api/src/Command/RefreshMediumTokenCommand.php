<?php

namespace App\Command;

use App\Services\ConfigService;
use GuzzleHttp\Client;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RefreshMediumTokenCommand extends Command
{
    protected static $defaultName = 'app:refresh-medium-token';

    /** @var string */
    protected $appOauthMediumId;

    /** @var string */
    protected $appOauthMediumSecret;

    /** @var ConfigService */
    protected $configService;

    /** @var HttpClientInterface */
    protected $httpClient;

    public function __construct(
        $appOauthMediumId,
        $appOauthMediumSecret,
        ConfigService $configService,
        HttpClientInterface $httpClient
    ) {
        $this->appOauthMediumId = $appOauthMediumId;
        $this->appOauthMediumSecret = $appOauthMediumSecret;
        $this->configService = $configService;
        $this->httpClient = $httpClient;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Refresh Medium token')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
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
    }
}
