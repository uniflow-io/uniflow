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

    /**
     * PathTransformer constructor.
     * @param FolderService $folderService
     * @param User $user
     */
    public function __construct(FolderService $folderService, User $user)
    {
        $this->folderService = $folderService;
        $this->user = $user;
    }

    /**
     * @param Folder|null $value
     * @return array
     */
    public function transform($value)
    {
        return $this->folderService->toPath($value);
    }

    /**
     * @param array $value
     * @return ArrayCollection|mixed
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function reverseTransform($value)
    {
        return $this->folderService->findOneByUserAndPath($this->user, $value);
    }
}
