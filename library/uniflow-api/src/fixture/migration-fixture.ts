import * as faker from 'faker'
import { Service } from 'typedi';
import { Connection, MigrationExecutor } from 'typeorm';
import { DatabaseLoader } from '../loader';
import { FixtureInterface } from './interfaces';

@Service()
export default class MigrationFixture implements FixtureInterface {
    constructor(
        private databaseLoader: DatabaseLoader,
    ) {}

    public async load() {
        const connection: Connection = this.databaseLoader.getConnection()
        const migrationExecutor = new MigrationExecutor(connection)
        await migrationExecutor.showMigrations() //create migration table
        const migrations = await migrationExecutor.getAllMigrations()
        for (const migration of migrations) {
            await migrationExecutor.insertMigration(migration)
        }
    }
}