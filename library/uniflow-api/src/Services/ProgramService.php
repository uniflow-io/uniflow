<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Folder;
use App\Entity\Program;
use App\Entity\User\ShopUser as User;
use App\Repository\ProgramRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;
use Symfony\Component\Uid\Uuid;

class ProgramService
{
    /**
     * @var ProgramRepository
     */
    protected $programRepository;

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

    public function findOne(?int $id = null): ?Program
    {
        return $this->programRepository->findOne($id);
    }

    public function findOneByUid(?User $user, ?string $uid = null): ?Program
    {
        return $this->programRepository->findOneByUid($user, $uid);
    }

    public function findOneByUser(User $user, ?int $id = null): ?Program
    {
        return $this->programRepository->findOneByUser($user, $id);
    }

    public function findOneByUserAndPath(User $user, array $path): ?Program
    {
        return $this->programRepository->findOneByUserAndPath($user, $path);
    }

    /**
     * @return Program[]
     */
    public function findLastByUserAndClient(User $user, ?string $client): array
    {
        return $this->programRepository->findLastByUserAndClient($user, $client);
    }

    /**
     * @return Program[]
     */
    public function findLastByUserAndClientAndFolder(User $user, ?string $client, ?Folder $folder): array
    {
        return $this->programRepository->findLastByUserAndClientAndFolder($user, $client, $folder);
    }

    /**
     * @return Program[]
     */
    public function findLastPublicByUserAndClient(User $user, ?string $client): array
    {
        return $this->programRepository->findLastPublicByUserAndClient($user, $client);
    }

    /**
     * @return Program[]
     */
    public function findLastPublicByUserAndClientAndFolder(User $user, ?string $client, ?Folder $folder): array
    {
        return $this->programRepository->findLastPublicByUserAndClientAndFolder($user, $client, $folder);
    }

    /**
     * @return Program[]
     */
    public function findLastPublic(?int $limit): array
    {
        return $this->programRepository->findLastPublic($limit);
    }

    public function getUserPrograms(string $uid, int $page, int $perPage, ?string $path = null): array
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['uid' => $uid]);
        if (!$user) {
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
        if (!$user) {
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
            $folder = $this->folderService->findOneByUserAndPath($user, explode('/', trim($data['path'], '/')));
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

        try {
            $this->save($program);

            return $program;
        } catch (Exception $e) {
            return null;
        }
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
            'path' => $this->folderService->toPath($program->getFolder()),
            'clients' => $clients,
            'tags' => $tags,
            'description' => $program->getDescription(),
            'isPublic' => $program->getPublic(),
            'user' => $program->getUser()->getUsername() ?? $program->getUser()->getUid(),
            'created' => $program->getCreated()->format('c'),
            'updated' => $program->getUpdated()->format('c'),
        ];
    }
}
