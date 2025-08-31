<?php

declare(strict_types=1);

namespace App\DependencyInjection\Compiler;

use App\EventListener\DefaultUsernameORMListener;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;

class SyliusDefaultUsernameListenerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        if ($container->hasDefinition('sylius.listener.default_username_orm')) {
            $container->setDefinition('sylius.listener.default_username_orm', new Definition(DefaultUsernameORMListener::class));
        }
    }
}
