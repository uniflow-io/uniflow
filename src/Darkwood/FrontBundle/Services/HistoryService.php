<?php

namespace Darkwood\FrontBundle\Services;

use Darkwood\CoreBundle\Services\BaseService;
use Darkwood\FrontBundle\Entity\History;
use Darkwood\FrontBundle\Repository\HistoryRepository;
use Darkwood\UserBundle\Entity\User;
use Doctrine\Common\Cache\Cache;
use Doctrine\Common\Cache\CacheProvider;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Class HistoryService
 *
 * Object manager of history
 *
 * @package Darkwood\FrontBundle\Services
 */
class HistoryService extends BaseService
{
    /**
     * @var HistoryRepository historyRepository
     */
    protected $historyRepository;

    /**
     * @var CacheProvider
     */
    protected $cache;

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
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();

        return $history;
    }

    /**
     * Remove one history
     *
     * @param History $history
     */
    public function remove(History $history)
    {
        $this->getEntityManager()->remove($history);
        $this->getEntityManager()->flush();
    }

    /**
     * @param User|null $user
     * @param null $id
     * @return History
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
            'tags'        => $tags,
            'description' => $history->getDescription(),
            'created'     => $created instanceof \DateTime ? $created->format('c') : null,
            'updated'     => $updated instanceof \DateTime ? $updated->format('c') : null,
        );
    }

    public function getHistory(User $user)
    {
        $histories = $this->historyRepository->findByUser($user);

        $data = array();

        foreach ($histories as $history) {
            $data[] = $this->getJsonHistory($history);
        }

        return $data;
    }

    public function resetDemoAccount(User $user)
    {
        return true;

        $now = new \DateTime();

        $key  = 'reset_account_' . $user->getId();
        $data = $this->cache->fetch($key);
        if ($data === false || $now->format('Y-m-d') !== $data->format('Y-m-d')) {
            $data = $now;
            $this->cache->save($key, $data, 3600 * 24);
        } else {
            return true;
        }

        $this->historyRepository->clearHistoryByUser($user);

        $now   = new \DateTime();
        $query = <<<EOT
            INSERT INTO `dw_history` (`id`, `title`, `slug`, `created`, `updated`, `data`, `description`, `user_id`)
VALUES
	(null, 'sum', 'sum', '{$now->format('Y-m-d h:i:s')}', '{$now->format('Y-m-d h:i:s')}', '[{\"component\":\"ui-object\",\"data\":[\"sum\",{\"left\":2,\"right\":3}]},{\"component\":\"core-javascript\",\"data\":\"sum = sum.left + sum.right\\\\nconsole.log(sum)\"}]', 'Calculate the result of 2 numbers', {$user->getId()}),
	(null, 'text', 'text', '{$now->format('Y-m-d h:i:s')}', '{$now->format('Y-m-d h:i:s')}', '[{\"component\":\"core-text\",\"data\":[\"content\",\"Essayons donc, dit la petite fille passent distraitement d\'un objet.\\\\nDoit-il marronner dans ce caveau avait déjà été décidé.\\\\nRécalcitrants ou rebelles sont vite rappelés à l\'ordre de souquer ferme, et la constitution...\\\\nDétendus, nous le disons avec la quantité de subsistances moyennant la même quantité de vin jointe à plus de quelques minutes.\\\\nÂme de boue, et que celui-ci lui adressait ces paroles dans la maison qu\'il a livrés ne lui appartiennent pas en réalité, une chose si maussade, soupira le vieux.\\\\nPardonnez-moi d\'insister, ayant mis pied à terre et commença à se tortiller au-dessus d\'elle.\\\\nTristement accoudé à la balustrade et dormait un peu.\\\\nVide elle aussi la valeur de la guerre qui pourrait éclater d\'un gros chêne.\\\\n\\\\nPeut être obtiendrez-vous ce que nous apportent vos dénégations.\\\\nVaincu, l\'âme flamboyant comme un brasier ardent.\\\\nMettez bas la pierre, pour tenir chaud à d\'autres caractères : il serait tombé dans les mains au pont des épées pour l\'attaquer et étaient venues jusqu\'à nous à détruire le sous-marin ? Voter père a besoin de votre nom célèbre, vous chercher pour vous demander quelques explications.\\\\nMalédiction sur la propriété est impossible, dit l\'officier.\\\\nPrécipice élevé d\'où tombe éternellement une rosée sur le sommet des colonnes étaient d\'un pécheur moderne.\\\\nIndigné de voir ma terre vendue aux enchères ? Colosse qui sans peur marche d\'un pas trébuchant.\"]},{\"component\":\"core-javascript\",\"data\":\"let lines = content.split(\'\\\\\\n\')\\\\n\\\\nfor(let i = 0; i < lines.length; i++) {\\\\n  lines[i] = lines[i].replace(\'la\', \'le\')\\\\n  lines[i] = lines[i].replace(\'à\', \'dans\')\\\\n  lines[i] = lines[i].replace(\'il\', \'tu\')\\\\n}\\\\n\\\\nlet result = lines.join(\'\\\\\\n\')\"},{\"component\":\"core-text\",\"data\":[\"result\",\"Essayons donc, dit le petite ftule passent distraitement d\'un objet.\\\\nDoit-tu marronner dans ce caveau avait déjdans été décidé.\\\\nRécalcitrants ou rebelles sont vite rappelés dans l\'ordre de souquer ferme, et le constitution...\\\\nDétendus, nous le disons avec le quantité de subsistances moyennant la même quantité de vin jointe dans plus de quelques minutes.\\\\nÂme de boue, et que celui-ci lui adressait ces paroles dans le maison qu\'tu a livrés ne lui appartiennent pas en réalité, une chose si maussade, soupira le vieux.\\\\nPardonnez-moi d\'insister, ayant mis pied dans terre et commença à se torttuler au-dessus d\'elle.\\\\nTristement accoudé dans le balustrade et dormait un peu.\\\\nVide elle aussi le valeur de la guerre qui pourrait éclater d\'un gros chêne.\\\\n\\\\nPeut être obtiendrez-vous ce que nous apportent vos dénégations.\\\\nVaincu, l\'âme flemboyant comme un brasier ardent.\\\\nMettez bas le pierre, pour tenir chaud dans d\'autres caractères : tu serait tombé dans les mains au pont des épées pour l\'attaquer et étaient venues jusqu\'à nous à détruire le sous-marin ? Voter père a besoin de votre nom célèbre, vous chercher pour vous demander quelques explications.\\\\nMalédiction sur le propriété est impossible, dit l\'officier.\\\\nPrécipice élevé d\'où tombe éternellement une rosée sur le sommet des colonnes étaient d\'un pécheur moderne.\\\\nIndigné de voir ma terre vendue aux enchères ? Colosse qui sans peur marche d\'un pas trébuchant.\\\\n\\\\n\"]}]', 'replace words in text', {$user->getId()});
EOT;

        $this->getEntityManager()->getConnection()->executeQuery($query);

        return true;
    }
}
