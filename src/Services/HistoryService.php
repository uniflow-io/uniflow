<?php

namespace App\Services;

use App\Entity\History;
use App\Repository\HistoryRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Cache\Adapter\TagAwareAdapter;

/**
 * Class HistoryService
 *
 * Object manager of history
 *
 * @package App\Services
 */
class HistoryService
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var HistoryRepository historyRepository
     */
    protected $historyRepository;

    /**
     * @var TagAwareAdapter
     */
    protected $cache;

    public function __construct(
        EntityManagerInterface $em,
        TagAwareAdapter $cache
    )
    {
        $this->em                = $em;
        $this->historyRepository = $this->em->getRepository(History::class);
        $this->cache             = $cache;
    }

    /**
     * Update a history
     *
     * @param History $history
     *
     * @return History
     */
    public function save(History $history)
    {
        $history->setUpdated(new \DateTime('now'));
        $this->em->persist($history);
        $this->em->flush();

        return $history;
    }

    /**
     * Remove one history
     *
     * @param History $history
     */
    public function remove(History $history)
    {
        $this->em->remove($history);
        $this->em->flush();
    }

    /**
     * @param User $user
     * @param null $id
     * @return History
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findOneByUser(User $user, $id = null)
    {
        return $this->historyRepository->findOneByUser($user, $id);
    }

    public function getJsonHistory(History $history)
    {
        $tags = array();

        foreach ($history->getTags() as $tag) {
            $tags[] = $tag->getTitle();
        }

        $created = $history->getCreated();
        $updated = $history->getUpdated();

        return array(
            'id'          => $history->getId(),
            'title'       => $history->getTitle(),
            'platform'    => $history->getPlatform(),
            'tags'        => $tags,
            'description' => $history->getDescription(),
            'created'     => $created instanceof \DateTime ? $created->format('c') : null,
            'updated'     => $updated instanceof \DateTime ? $updated->format('c') : null,
        );
    }

    public function getHistory(User $user)
    {
        $histories = $this->historyRepository->findLastByUser($user);

        $data = array();

        foreach ($histories as $history) {
            $data[] = $this->getJsonHistory($history);
        }

        return $data;
    }

    public function getHistoryByPlatform(User $user, $platform = null)
    {
        $histories = $this->historyRepository->findLastByUserAndPlatform($user, $platform);

        $data = array();

        foreach ($histories as $history) {
            $data[] = $this->getJsonHistory($history);
        }

        return $data;
    }

    /**
     * @param User $user
     * @return bool
     * @throws \Doctrine\DBAL\DBALException
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function resetDemoAccount(User $user)
    {
        $now = new \DateTime();

        $key  = 'reset_account_' . $user->getId();
        $item = $this->cache->getItem($key);
        if ($item->isHit() === false || $now->format('Y-m-d') !== $item->get()->format('Y-m-d')) {
            $data = $now;
            $item->set($data);
            $item->expiresAfter(3600 * 24);
            $this->cache->save($item);
        } else {
            return true;
        }

        $this->historyRepository->clearHistoryByUser($user);

        $now   = new \DateTime();
        $query = <<<EOT
            INSERT INTO `dw_history` (`id`, `title`, `slug`, `created`, `updated`, `data`, `description`, `user_id`)
VALUES
	(null, 'text', 'text', '{$now->format('Y-m-d h:i:s')}', '{$now->format('Y-m-d h:i:s')}', '[{\"component\":\"text\",\"data\":[\"content\",\"Essayons donc, dit la petite fille passent distraitement d\'un objet.\\\\nDoit-il marronner dans ce caveau avait déjà été décidé.\\\\nRécalcitrants ou rebelles sont vite rappelés à l\'ordre de souquer ferme, et la constitution...\\\\nDétendus, nous le disons avec la quantité de subsistances moyennant la même quantité de vin jointe à plus de quelques minutes.\\\\nÂme de boue, et que celui-ci lui adressait ces paroles dans la maison qu\'il a livrés ne lui appartiennent pas en réalité, une chose si maussade, soupira le vieux.\\\\nPardonnez-moi d\'insister, ayant mis pied à terre et commença à se tortiller au-dessus d\'elle.\\\\nTristement accoudé à la balustrade et dormait un peu.\\\\nVide elle aussi la valeur de la guerre qui pourrait éclater d\'un gros chêne.\\\\n\\\\nPeut être obtiendrez-vous ce que nous apportent vos dénégations.\\\\nVaincu, l\'âme flamboyant comme un brasier ardent.\\\\nMettez bas la pierre, pour tenir chaud à d\'autres caractères : il serait tombé dans les mains au pont des épées pour l\'attaquer et étaient venues jusqu\'à nous à détruire le sous-marin ? Voter père a besoin de votre nom célèbre, vous chercher pour vous demander quelques explications.\\\\nMalédiction sur la propriété est impossible, dit l\'officier.\\\\nPrécipice élevé d\'où tombe éternellement une rosée sur le sommet des colonnes étaient d\'un pécheur moderne.\\\\nIndigné de voir ma terre vendue aux enchères ? Colosse qui sans peur marche d\'un pas trébuchant.\"]},{\"component\":\"javascript\",\"data\":\"let lines = content.split(\'\\\\\\\\n\')\\\\n\\\\nfor(let i = 0; i < lines.length; i++) {\\\\n  lines[i] = lines[i].replace(\'la\', \'le\')\\\\n  lines[i] = lines[i].replace(\'à\', \'dans\')\\\\n  lines[i] = lines[i].replace(\'il\', \'tu\')\\\\n}\\\\n\\\\nlet result = lines.join(\'\\\\\\\\n\')\"},{\"component\":\"text\",\"data\":[\"result\",\"Essayons donc, dit le petite ftule passent distraitement d\'un objet.\\\\nDoit-tu marronner dans ce caveau avait déjdans été décidé.\\\\nRécalcitrants ou rebelles sont vite rappelés dans l\'ordre de souquer ferme, et le constitution...\\\\nDétendus, nous le disons avec le quantité de subsistances moyennant la même quantité de vin jointe dans plus de quelques minutes.\\\\nÂme de boue, et que celui-ci lui adressait ces paroles dans le maison qu\'tu a livrés ne lui appartiennent pas en réalité, une chose si maussade, soupira le vieux.\\\\nPardonnez-moi d\'insister, ayant mis pied dans terre et commença à se torttuler au-dessus d\'elle.\\\\nTristement accoudé dans le balustrade et dormait un peu.\\\\nVide elle aussi le valeur de la guerre qui pourrait éclater d\'un gros chêne.\\\\n\\\\nPeut être obtiendrez-vous ce que nous apportent vos dénégations.\\\\nVaincu, l\'âme flemboyant comme un brasier ardent.\\\\nMettez bas le pierre, pour tenir chaud dans d\'autres caractères : tu serait tombé dans les mains au pont des épées pour l\'attaquer et étaient venues jusqu\'à nous à détruire le sous-marin ? Voter père a besoin de votre nom célèbre, vous chercher pour vous demander quelques explications.\\\\nMalédiction sur le propriété est impossible, dit l\'officier.\\\\nPrécipice élevé d\'où tombe éternellement une rosée sur le sommet des colonnes étaient d\'un pécheur moderne.\\\\nIndigné de voir ma terre vendue aux enchères ? Colosse qui sans peur marche d\'un pas trébuchant.\\\\n\\\\n\"]}]', 'replace words in text', {$user->getId()});
EOT;

        $this->em->getConnection()->executeQuery($query);

        return true;
    }
}
