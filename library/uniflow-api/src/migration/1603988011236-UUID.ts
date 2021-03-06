import { MigrationInterface, QueryRunner, getRepository, Repository } from "typeorm";
import { RandomGenerator } from "typeorm/util/RandomGenerator"
import { UserEntity, FolderEntity, TagEntity, ProgramEntity, ClientEntity, ConfigEntity, ContactEntity } from '../entity';

export class UUID1603988011236 implements MigrationInterface {
    name = 'UUID1603988011236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `uid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `folder` ADD `uid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `tag` ADD `uid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `program` ADD `uid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `client` ADD `uid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `config` ADD `uid` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `contact` ADD `uid` varchar(36) NOT NULL");

        const seedUID = async (EntityRepository: any) => {
            const userRepository: Repository<typeof EntityRepository> = getRepository(EntityRepository)
            const users = await userRepository.find()
            for (const user of users) {
                user.uid = RandomGenerator.uuid4()
                await userRepository.save(user)
            }
        }
        await seedUID(UserEntity)
        await seedUID(FolderEntity)
        await seedUID(TagEntity)
        await seedUID(ProgramEntity)
        await seedUID(ClientEntity)
        await seedUID(ConfigEntity)
        await seedUID(ContactEntity)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contact` DROP COLUMN `uid`");
        await queryRunner.query("ALTER TABLE `config` DROP COLUMN `uid`");
        await queryRunner.query("ALTER TABLE `client` DROP COLUMN `uid`");
        await queryRunner.query("ALTER TABLE `program` DROP COLUMN `uid`");
        await queryRunner.query("ALTER TABLE `tag` DROP COLUMN `uid`");
        await queryRunner.query("ALTER TABLE `folder` DROP COLUMN `uid`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `uid`");
    }
}
