import {MigrationInterface, QueryRunner} from "typeorm";

export class GithubLead1606597375604 implements MigrationInterface {
    name = 'GithubLead1606597375604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lead` ADD `githubUsername` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `lead` ADD `optinGithub` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lead` DROP COLUMN `optinGithub`");
        await queryRunner.query("ALTER TABLE `lead` DROP COLUMN `githubUsername`");
    }

}
