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

class RefreshMediumTokenCommand extends Command
{
    protected static $defaultName = 'app:refresh-medium-token';

    /**
     * @var string
     */
    protected $appOauthMediumId;

    /**
     * @var string
     */
    protected $appOauthMediumSecret;

    /**
     * @var ConfigService
     */
    protected $configService;

    public function __construct(
        $appOauthMediumId,
        $appOauthMediumSecret,
        ConfigService $configService
    )
    {
        $this->appOauthMediumId = $appOauthMediumId;
        $this->appOauthMediumSecret = $appOauthMediumSecret;
        $this->configService = $configService;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Refresh Medium token')
        ;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|void|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);

        $config = $this->configService->findOne();
        if($config && $config->getMediumToken() && $config->getMediumRefreshToken()) {

            $client = new Client();

            // Get the token's Medium app.
            $response = $client->post('https://api.medium.com/v1/tokens', [
                'headers' => [
                    'Accept' => 'application/json'
                ],
                'form_params' => [
                    'refresh_token' => $config->getMediumRefreshToken(),
                    'client_id' => $this->appOauthMediumId,
                    'client_secret' => $this->appOauthMediumSecret,
                    'grant_type' => 'refresh_token',
                ]
            ]);

            $tokenResp = json_decode((string) $response->getBody(), true);

            $token = $tokenResp['access_token'];
            $refreshToken = $tokenResp['refresh_token'];

            $config->setMediumToken($token);
            $config->setMediumRefreshToken($refreshToken);

            $this->configService->save($config);

        }

        $io->success('Medium token is refreshed');
    }
}
