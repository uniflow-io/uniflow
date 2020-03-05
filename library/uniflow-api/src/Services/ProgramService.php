<?php

namespace App\Services;

use App\Entity\Folder;
use App\Entity\Program;
use App\Repository\ProgramRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;

class ProgramService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var ProgramRepository
     */
    protected $programRepository;

    /**
     * @var TagAwareAdapter
     */
    protected $cache;

    /**
     * @var FolderService
     */
    protected $folderService;

    public function __construct(
        EntityManagerInterface $em,
        TagAwareAdapter $cache,
        FolderService $folderService
    )
    {
        $this->em = $em;
        $this->programRepository = $this->em->getRepository(Program::class);
        $this->cache = $cache;
        $this->folderService = $folderService;
    }

    public function save(Program $program): Program
    {
        $program->setUpdated(new \DateTime());

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
            'id' => $program->getId(),
            'name' => $program->getName(),
            'slug' => $program->getSlug(),
            'path' => $this->folderService->toPath($program->getFolder()),
            'clients' => $clients,
            'tags' => $tags,
            'description' => $program->getDescription(),
            'public' => $program->getPublic(),
            'created' => $program->getCreated()->format('c'),
            'updated' => $program->getUpdated()->format('c'),
        ];
    }
}
