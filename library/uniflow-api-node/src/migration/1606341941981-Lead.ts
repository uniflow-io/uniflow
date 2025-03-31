import {MigrationInterface, QueryRunner} from "typeorm";

export class Lead1606341941981 implements MigrationInterface {
    name = 'Lead1606341941981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lead` ADD `optinBlog` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lead` DROP COLUMN `optinBlog`");
    }

}
