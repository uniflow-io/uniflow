<?php

declare(strict_types=1);

namespace App\Form\EventListener;

use ArrayAccess;
use Symfony\Component\Form\Extension\Core\EventListener\ResizeFormListener;
use Symfony\Component\Form\FormEvent;
use Traversable;

use function is_array;

class ResizeArrayFormListener extends ResizeFormListener
{
    protected $type;

    protected array $options;

    public function __construct($type = '', array $options = [], bool $allowAdd = false, bool $allowDelete = false, $deleteEmpty = false)
    {
        parent::__construct($type, $options, $allowAdd, $allowDelete, $deleteEmpty);
        $this->type = $type;
        $this->options = $options;
    }

    public function preSetData(FormEvent $event): void
    {
        $form = $event->getForm();
        $data = $event->getData();

        if (null === $data) {
            $data = [];
        }

        if (!is_array($data) && !($data instanceof Traversable && $data instanceof ArrayAccess)) {
            $data = [];
        }

        // First remove all rows
        foreach ($form as $name => $child) {
            $form->remove($name);
        }

        // Then add all rows again in the correct order
        foreach ($data as $name => $value) {
            $form->add($name, $this->type, array_replace([
                'property_path' => '[' . $name . ']',
            ], $this->options));
        }
    }
}
