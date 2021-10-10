import { default as Container } from "./container";
import { DatabaseLoader } from "./loader";
import { ClientFixture, FolderFixture, TagFixture, UserFixture, ProgramFixture, MigrationFixture, LeadFixture } from "./fixture";

const loadFixtures = async () => {
    const container = new Container()
    const databaseLoader = container.get(DatabaseLoader)
    const migrationFixture = container.get(MigrationFixture)
    const userFixture = container.get(UserFixture)
    const leadFixture = container.get(LeadFixture)
    const folderFixture = container.get(FolderFixture)
    const clientFixture = container.get(ClientFixture)
    const tagFixture = container.get(TagFixture)
    const programFixture = container.get(ProgramFixture)

    try {
        await databaseLoader.load()
        await migrationFixture.load()
        await userFixture.load()
        await leadFixture.load()
        await clientFixture.load()
        await tagFixture.load()
        await folderFixture.load()
        await programFixture.load()
    } catch (err) {
        throw err;
    } finally {
        const connection = databaseLoader.getConnection()
        if (connection) {
            await connection.close();
        }
    }
}

loadFixtures()
  .then(() => {
    console.log('Fixtures are successfully loaded.');
  })
  .catch(err => console.log(err));