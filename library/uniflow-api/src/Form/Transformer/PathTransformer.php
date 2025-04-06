<?php

declare(strict_types=1);

namespace App\Form\Transformer;

use App\Entity\Folder;
use App\Entity\User;
use App\Services\FolderService;
use Symfony\Component\Form\DataTransformerInterface;

class PathTransformer implements DataTransformerInterface
{
    /**
     * @var User
     */
    protected $user;

    public function __construct(protected FolderService $folderService, User $user)
    {
        $this->user = $user;
    }

    /**
     * @param null|Folder $value
     *
     * @return array|mixed
     */
    public function transform($value): mixed
    {
        return $this->folderService->toPath($value);
    }

    /**
     * @param array $value
     *
     * @return null|Folder
     */
    public function reverseTransform($value): mixed
    {
        return $this->folderService->findOneByUserAndPath($this->user, $value);
    }
}
