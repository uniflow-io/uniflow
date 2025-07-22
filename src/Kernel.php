<?php

declare(strict_types=1);

namespace App;

use App\DependencyInjection\Compiler\SyliusDefaultUsernameListenerPass;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

final class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    protected function build(ContainerBuilder $container): void
    {
        parent::build($container);

        $container->addCompilerPass(new SyliusDefaultUsernameListenerPass());
    }
}
