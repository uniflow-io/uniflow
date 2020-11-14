import { default as Container } from "./container";
import { DatabaseLoader } from "./loader";
import { ClientFixture, FolderFixture, TagFixture, UserFixture, ProgramFixture } from "./fixture";

const loadFixtures = async () => {
    const databaseLoader = Container.get(DatabaseLoader)
    const userFixture = Container.get(UserFixture)
    const folderFixture = Container.get(FolderFixture)
    const clientFixture = Container.get(ClientFixture)
    const tagFixture = Container.get(TagFixture)
    const programFixture = Container.get(ProgramFixture)

    try {
        await databaseLoader.load()
        await userFixture.load()
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