<?php

namespace App\Form\Transformer;

use App\Entity\Folder;
use App\Entity\User;
use App\Services\FolderService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\DataTransformerInterface;

class PathTransformer implements DataTransformerInterface
{
    /**
     * @var FolderService
     */
    protected $folderService;

    /**
     * @var User
     */
    protected $user;

    public function __construct(FolderService $folderService, User $user)
    {
        $this->folderService = $folderService;
        $this->user = $user;
    }

    /**
     * @param Folder|null $value
     * @return array|mixed
     */
    public function transform($value): mixed
    {
        return $this->folderService->toPath($value);
    }

    /**
     * @param array $value
     * @return Folder|null
     */
    public function reverseTransform($value): mixed
    {
        return $this->folderService->findOneByUserAndPath($this->user, $value);
    }
}
