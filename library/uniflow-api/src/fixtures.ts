import { default as Container } from "./container";
import { DatabaseLoader } from "./loader";
import { FolderFixture, UserFixture } from "./fixture";

const loadFixtures = async () => {
    const databaseLoader = Container.get(DatabaseLoader)
    const userFixture = Container.get(UserFixture)
    const folderFixture = Container.get(FolderFixture)

    try {
        await databaseLoader.load()
        await userFixture.load()
        await folderFixture.load()
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