<?php

namespace App\Twig\Components;

use App\Form\ProgramType;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\UX\LiveComponent\Attribute\LiveAction;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\ComponentWithFormTrait;

#[AsLiveComponent]
final class Program extends AbstractController
{
    use ComponentWithFormTrait;
    use DefaultActionTrait;

    public $program;
    public $token;

    protected function instantiateForm(): FormInterface
    {
        return $this->createForm(ProgramType::class, $this->program);
    }
}
