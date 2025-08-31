<?php

declare(strict_types=1);

namespace App\Form\Transformer;

use App\Entity\Folder;
use App\Entity\User\ShopUser as User;
use App\Service\FolderService;
use Symfony\Component\Form\DataTransformerInterface;

class PathTransformer implements DataTransformerInterface
{
    public function __construct(protected FolderService $folderService, protected User $user) {}

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
     */
    public function reverseTransform($value): ?Folder
    {
        return $this->folderService->findOneByUserAndPath($this->user, $value);
    }
}
