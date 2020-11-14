import {MigrationInterface, QueryRunner} from "typeorm";

export class Slugs1605387326437 implements MigrationInterface {
    name = 'Slugs1605387326437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_46dc4690d5061f5815a6dd8712` ON `folder`");
        await queryRunner.query("DROP INDEX `IDX_47cad5c026f06153b40724baff` ON `program`");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_47cad5c026f06153b40724baff` ON `program` (`slug`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_46dc4690d5061f5815a6dd8712` ON `folder` (`slug`)");
    }

}
