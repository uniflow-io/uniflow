<?php

declare(strict_types=1);

namespace App;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260206234936 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE uniflow_client (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, uid VARCHAR(36) NOT NULL, UNIQUE INDEX UNIQ_B777649539B0606 (uid), INDEX index_search_clients (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_config (id INT AUTO_INCREMENT NOT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, uid VARCHAR(36) NOT NULL, UNIQUE INDEX UNIQ_18B95D60539B0606 (uid), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_contact (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL, message LONGTEXT NOT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, uid VARCHAR(36) NOT NULL, UNIQUE INDEX UNIQ_58AF8905539B0606 (uid), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_folder (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, uid VARCHAR(36) NOT NULL, UNIQUE INDEX UNIQ_20917BD1989D9B62 (slug), UNIQUE INDEX UNIQ_20917BD1539B0606 (uid), INDEX IDX_20917BD1A76ED395 (user_id), INDEX IDX_20917BD1727ACA70 (parent_id), INDEX index_search (slug, name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_program (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, folder_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, is_public TINYINT(1) NOT NULL, data JSON DEFAULT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, uid VARCHAR(36) NOT NULL, UNIQUE INDEX UNIQ_862018B9989D9B62 (slug), UNIQUE INDEX UNIQ_862018B9539B0606 (uid), INDEX IDX_862018B9A76ED395 (user_id), INDEX IDX_862018B9162CB942 (folder_id), INDEX index_search (slug, name), UNIQUE INDEX unique_slug (user_id, slug), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_program_client (program_id INT NOT NULL, client_id INT NOT NULL, INDEX IDX_6DECAFB03EB8070A (program_id), INDEX IDX_6DECAFB019EB6921 (client_id), PRIMARY KEY(program_id, client_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_program_tag (program_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_ADF25F163EB8070A (program_id), INDEX IDX_ADF25F16BAD26311 (tag_id), PRIMARY KEY(program_id, tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE uniflow_tag (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, created DATETIME NOT NULL, updated DATETIME NOT NULL, uid VARCHAR(36) NOT NULL, UNIQUE INDEX UNIQ_5C7833F9539B0606 (uid), INDEX index_search_tags (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE uniflow_folder ADD CONSTRAINT FK_20917BD1A76ED395 FOREIGN KEY (user_id) REFERENCES sylius_shop_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_folder ADD CONSTRAINT FK_20917BD1727ACA70 FOREIGN KEY (parent_id) REFERENCES uniflow_folder (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_program ADD CONSTRAINT FK_862018B9A76ED395 FOREIGN KEY (user_id) REFERENCES sylius_shop_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_program ADD CONSTRAINT FK_862018B9162CB942 FOREIGN KEY (folder_id) REFERENCES uniflow_folder (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_program_client ADD CONSTRAINT FK_6DECAFB03EB8070A FOREIGN KEY (program_id) REFERENCES uniflow_program (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_program_client ADD CONSTRAINT FK_6DECAFB019EB6921 FOREIGN KEY (client_id) REFERENCES uniflow_client (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_program_tag ADD CONSTRAINT FK_ADF25F163EB8070A FOREIGN KEY (program_id) REFERENCES uniflow_program (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE uniflow_program_tag ADD CONSTRAINT FK_ADF25F16BAD26311 FOREIGN KEY (tag_id) REFERENCES uniflow_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sylius_shop_user ADD apiKey VARCHAR(255) DEFAULT NULL, ADD uid VARCHAR(36) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7C2B7480539B0606 ON sylius_shop_user (uid)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE uniflow_folder DROP FOREIGN KEY FK_20917BD1A76ED395');
        $this->addSql('ALTER TABLE uniflow_folder DROP FOREIGN KEY FK_20917BD1727ACA70');
        $this->addSql('ALTER TABLE uniflow_program DROP FOREIGN KEY FK_862018B9A76ED395');
        $this->addSql('ALTER TABLE uniflow_program DROP FOREIGN KEY FK_862018B9162CB942');
        $this->addSql('ALTER TABLE uniflow_program_client DROP FOREIGN KEY FK_6DECAFB03EB8070A');
        $this->addSql('ALTER TABLE uniflow_program_client DROP FOREIGN KEY FK_6DECAFB019EB6921');
        $this->addSql('ALTER TABLE uniflow_program_tag DROP FOREIGN KEY FK_ADF25F163EB8070A');
        $this->addSql('ALTER TABLE uniflow_program_tag DROP FOREIGN KEY FK_ADF25F16BAD26311');
        $this->addSql('DROP TABLE uniflow_client');
        $this->addSql('DROP TABLE uniflow_config');
        $this->addSql('DROP TABLE uniflow_contact');
        $this->addSql('DROP TABLE uniflow_folder');
        $this->addSql('DROP TABLE uniflow_program');
        $this->addSql('DROP TABLE uniflow_program_client');
        $this->addSql('DROP TABLE uniflow_program_tag');
        $this->addSql('DROP TABLE uniflow_tag');
        $this->addSql('DROP INDEX UNIQ_7C2B7480539B0606 ON sylius_shop_user');
        $this->addSql('ALTER TABLE sylius_shop_user DROP apiKey, DROP uid');
    }
}
