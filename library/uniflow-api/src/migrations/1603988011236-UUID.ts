import {MigrationInterface, QueryRunner, getRepository, Repository} from "typeorm";
import {RandomGenerator} from "typeorm/util/RandomGenerator"
import { User, Folder, Tag, Program, Client, Config, Contact } from '../models';

export class UUID1603988011236 implements MigrationInterface {
    name = 'UUID1603988011236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `uuid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `folder` ADD `uuid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `tag` ADD `uuid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `program` ADD `uuid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `client` ADD `uuid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `config` ADD `uuid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `contact` ADD `uuid` varchar(36) NOT NULL");

        const seedUUID = async (EntityRepository: any) => {
            const userRepository: Repository<typeof EntityRepository> = getRepository(EntityRepository)
            const users = await userRepository.find()
            for (const user of users) {
                user.uuid = RandomGenerator.uuid4()
                await userRepository.save(user)
            }
        }
        await seedUUID(User)
        await seedUUID(Folder)
        await seedUUID(Tag)
        await seedUUID(Program)
        await seedUUID(Client)
        await seedUUID(Config)
        await seedUUID(Contact)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contact` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `config` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `client` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `program` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `tag` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `folder` DROP COLUMN `uuid`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `uuid`");
    }

}
