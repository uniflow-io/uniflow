<?php

namespace App\Services;

use App\Entity\Folder;
use App\Entity\Program;
use App\Repository\ProgramRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;

/**
 * Class ProgramService
 *
 * Object manager of program
 *
 * @package App\Services
 */
class ProgramService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var ProgramRepository programRepository
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
        $this->em                = $em;
        $this->programRepository = $this->em->getRepository(Program::class);
        $this->cache             = $cache;
        $this->folderService     = $folderService;
    }

    /**
     * Update a program
     *
     * @param Program $program
     *
     * @return Program
     */
    public function save(Program $program)
    {
        $program->setUpdated(new \DateTime('now'));
        $this->em->persist($program);
        $this->em->flush();

        return $program;
    }

    /**
     * Remove one program
     *
     * @param Program $program
     */
    public function remove(Program $program)
    {
        $this->em->remove($program);
        $this->em->flush();
    }

    /**
     * @param null $id
     * @return Program
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOne($id = null)
    {
        return $this->programRepository->findOne($id);
    }

    /**
     * @param User $user
     * @param null $id
     * @return Program
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        return $this->programRepository->findOneByUser($user, $id);
    }

    /**
     * @param User $user
     * @param array $path
     * @return Program
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUserAndPath(User $user, $path)
    {
        return $this->programRepository->findOneByUserAndPath($user, $path);
    }

    public function getJsonProgram(Program $program)
    {
        $tags = array();

        foreach ($program->getTags() as $tag) {
            $tags[] = $tag->getTitle();
        }

        return array(
            'id'          => $program->getId(),
            'title'       => $program->getTitle(),
            'slug'        => $program->getSlug(),
            'path'        => $this->folderService->toPath($program->getFolder()),
            'client'      => $program->getClient(),
            'tags'        => $tags,
            'description' => $program->getDescription(),
            'public'      => $program->getPublic(),
            'created'     => $program->getCreated()->format('c'),
            'updated'     => $program->getUpdated()->format('c'),
        );
    }

    public function getProgram(User $user)
    {
        $programs = $this->programRepository->findLastByUser($user);

        $data = array();

        foreach ($programs as $program) {
            $data[] = $this->getJsonProgram($program);
        }

        return $data;
    }

    /**
     * @param User $user
     * @param null $client
     * @param Folder|null $folder
     * @return mixed
     */
    public function getProgramByUserAndClient(User $user, $client = null)
    {
        return $this->programRepository->findLastByUserAndClient($user, $client);
    }

    /**
     * @param User $user
     * @param null $client
     * @return mixed
     */
    public function getProgramByUserAndClientAndFolder(User $user, $client = null, Folder $folder = null)
    {
        return $this->programRepository->findLastByUserAndClientAndFolder($user, $client, $folder);
    }

    /**
     * @param User $user
     * @param null $client
     * @return mixed
     */
    public function getPublicProgramByUserAndClient(User $user, $client = null)
    {
        return $this->programRepository->getPublicProgramByUserAndClient($user, $client);
    }

    /**
     * @param User $user
     * @param null $client
     * @param Folder|null $folder
     * @return mixed
     */
    public function getPublicProgramByUserAndClientAndFolder(User $user, $client = null, Folder $folder = null)
    {
        return $this->programRepository->getPublicProgramByUserAndClientAndFolder($user, $client, $folder);
    }

    public function findLastPublic($limit = null)
    {
        return $this->programRepository->findLastPublic($limit);
    }
}
