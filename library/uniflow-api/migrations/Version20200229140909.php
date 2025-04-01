<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Symfony\Component\Intl\Exception\NotImplementedException;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200229140909 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX index_search ON program');
        $this->addSql('ALTER TABLE program CHANGE title name VARCHAR(255) NOT NULL');
        $this->addSql('CREATE INDEX index_search ON program (slug, name)');
    }

    public function down(Schema $schema) : void
    {
        throw new NotImplementedException('down not implemented');
    }
}
