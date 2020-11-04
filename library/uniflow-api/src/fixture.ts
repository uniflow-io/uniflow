import Container from "typedi";
import { DatabaseLoader } from "./loaders";
import { UserFixture } from "./fixtures";

const loadFixtures = async () => {
    Container.set('env', process.env.NODE_ENV || 'development')
    const databaseLoader = Container.get(DatabaseLoader)
    const userFixture = Container.get(UserFixture)

    try {
        await databaseLoader.load()
        await userFixture.load()
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