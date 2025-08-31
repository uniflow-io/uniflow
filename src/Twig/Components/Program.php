<?php

declare(strict_types=1);

namespace App\Twig\Components;

use App\Form\ProgramType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\ComponentWithFormTrait;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
final class Program extends AbstractController
{
    use ComponentWithFormTrait;
    use DefaultActionTrait;

    public $program;

    public $token;

    public $apiHost;

    protected function instantiateForm(): FormInterface
    {
        return $this->createForm(ProgramType::class, $this->program);
    }
}
