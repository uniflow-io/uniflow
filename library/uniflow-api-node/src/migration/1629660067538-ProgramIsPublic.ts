import {MigrationInterface, QueryRunner} from "typeorm";

export class ProgramIsPublic1629660067538 implements MigrationInterface {
    name = 'ProgramIsPublic1629660067538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `program` CHANGE `public` `isPublic` tinyint NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `program` CHANGE `isPublic` `public` tinyint NOT NULL DEFAULT '0'");
    }

}
