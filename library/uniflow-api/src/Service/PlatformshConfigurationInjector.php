<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class PlatformshConfigurationInjector
{
    private ParameterBagInterface $params;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
    }

    public function injectDatabaseConfiguration(object $credentials): void
    {
        // Skip if we're not on Upsun/Platform.sh
        if (!$credentials) {
            return;
        }

        // Build the PostgreSQL DSN
        $databaseUrl = sprintf(
            'postgresql://%s:%s@%s:%d/%s',
            $credentials->username,
            $credentials->password,
            $credentials->host,
            $credentials->port,
            $credentials->path
        );

        // Set the DATABASE_URL environment variable
        $_SERVER['DATABASE_URL'] = $databaseUrl;
        $_ENV['DATABASE_URL'] = $databaseUrl;
    }
}
