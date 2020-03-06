<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Symfony\Component\Intl\Exception\NotImplementedException;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191207151619 extends AbstractMigration
{
    public function getDescription() : string
    {
        return 'Init';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE program_client (program_id INT NOT NULL, client_id INT NOT NULL, INDEX IDX_93043A0F3EB8070A (program_id), INDEX IDX_93043A0F19EB6921 (client_id), PRIMARY KEY(program_id, client_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, INDEX index_search_clients (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE program_client ADD CONSTRAINT FK_93043A0F3EB8070A FOREIGN KEY (program_id) REFERENCES program (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE program_client ADD CONSTRAINT FK_93043A0F19EB6921 FOREIGN KEY (client_id) REFERENCES client (id) ON DELETE CASCADE');
        $this->addSql('DROP INDEX index_search_tags ON tag');
        $this->addSql('ALTER TABLE tag CHANGE title name VARCHAR(255) NOT NULL');
        $this->addSql('CREATE INDEX index_search_tags ON tag (name)');
        $this->addSql('DROP INDEX index_search ON folder');
        $this->addSql('ALTER TABLE folder CHANGE title name VARCHAR(255) NOT NULL');
        $this->addSql('CREATE INDEX index_search ON folder (slug, name)');

        $clientMap = [
            'uniflow' => '1',
            'node' => '2',
            'chrome' => '3',
            'jetbrains' => '4',
        ];

        foreach ($clientMap as $client => $id) {
            $this->addSql("INSERT INTO client (id, name, created, updated) VALUES ({$id},'{$client}','2019-12-07 15:43:41','2019-12-07 15:43:41')");
        }

        $programs = $this->connection->fetchAll('SELECT id, client FROM program');
        foreach ($programs as $program) {
            $this->addSql("INSERT INTO `program_client` (`program_id`, `client_id`) VALUES ({$program['id']},{$clientMap[$program['client']]})");
        }

        $this->addSql('ALTER TABLE program DROP client');
    }

    public function down(Schema $schema) : void
    {
        throw new NotImplementedException('down not implemented');
    }
}
