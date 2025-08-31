<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Program;
use App\Entity\User\ShopUser as User;
use App\Repository\ProgramRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;
use Symfony\Component\Uid\Uuid;

class ProgramService
{
    /**
     * @var ProgramRepository
     */
    protected EntityRepository $programRepository;

    public function __construct(
        protected EntityManagerInterface $em,
        protected TagAwareAdapter $cache,
        protected FolderService $folderService
    ) {
        $this->programRepository = $this->em->getRepository(Program::class);
    }

    public function save(Program $program): Program
    {
        $program->setUpdated(new DateTime());

        $this->em->persist($program);
        $this->em->flush();

        return $program;
    }

    public function remove(Program $program): void
    {
        $this->em->remove($program);
        $this->em->flush();
    }

    public function getUserPrograms(string $uid, int $page, int $perPage, ?string $path = null): array
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['uid' => $uid]);
        if ($user === null) {
            return [];
        }

        $folder = null;
        if ($path) {
            $folder = $this->folderService->findOneByUserAndPath($user, explode('/', trim($path, '/')));
        }

        $offset = ($page - 1) * $perPage;

        return $this->programRepository->findBy(
            ['user' => $user, 'folder' => $folder],
            ['created' => 'DESC'],
            $perPage,
            $offset
        );
    }

    public function countUserPrograms(string $uid, ?string $path = null): int
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['uid' => $uid]);
        if ($user === null) {
            return 0;
        }

        $folder = null;
        if ($path) {
            $folder = $this->folderService->findOneByUserAndPath($user, explode('/', trim($path, '/')));
        }

        return $this->programRepository->count(['user' => $user, 'folder' => $folder]);
    }

    public function createProgram(User $user, array $data): ?Program
    {
        $program = new Program();
        $program->setUid(Uuid::v7()->toString());
        $program->setUser($user);
        $program->setName($data['name']);

        if (isset($data['path'])) {
            $folder = $this->folderService->findOneByUserAndPath($user, explode('/', trim((string) $data['path'], '/')));
            $program->setFolder($folder);
        }

        if (isset($data['slug'])) {
            $program->setSlug($data['slug']);
        } else {
            $program->setSlug($data['name']);
        }

        if (isset($data['description'])) {
            $program->setDescription($data['description']);
        }

        $program->setPublic($data['isPublic'] ?? false);
        $program->setCreated(new DateTime());
        $program->setUpdated(new DateTime());

        $this->save($program);

        return $program;
    }

    public function toPath(Program $program): string
    {
        return $this->folderService->toPath($program->getFolder()) . $program->getSlug();
    }

    public function toUser(Program $program): string
    {
        return $program->getUser()->getUsername() ?? $program->getUser()->getUid();
    }

    public function getJsonProgram(Program $program): array
    {
        $clients = [];
        foreach ($program->getClients() as $client) {
            $clients[] = $client->getName();
        }

        $tags = [];
        foreach ($program->getTags() as $tag) {
            $tags[] = $tag->getName();
        }

        return [
            'uid' => $program->getUid(),
            'name' => $program->getName(),
            'slug' => $program->getSlug(),
            'path' => $this->toPath($program),
            'clients' => $clients,
            'tags' => $tags,
            'description' => $program->getDescription() ?? '',
            'isPublic' => $program->getPublic(),
            'user' => $this->toUser($program),
            'created' => $program->getCreated()->format('c'),
            'updated' => $program->getUpdated()->format('c'),
        ];
    }
}
