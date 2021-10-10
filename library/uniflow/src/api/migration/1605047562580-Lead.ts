import {MigrationInterface, QueryRunner} from "typeorm";

export class Lead1605047562580 implements MigrationInterface {
    name = 'Lead1605047562580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `lead` (`id` int NOT NULL AUTO_INCREMENT, `uid` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `optinNewsletter` tinyint NOT NULL DEFAULT 0, `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_82927bc307d97fe09c616cd3f5` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_82927bc307d97fe09c616cd3f5` ON `lead`");
        await queryRunner.query("DROP TABLE `lead`");
    }

}
