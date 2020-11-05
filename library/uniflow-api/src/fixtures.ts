import { default as Container } from "./container";
import { DatabaseLoader } from "./loader";
import { UserFixture } from "./fixture";

const loadFixtures = async () => {
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