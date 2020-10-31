import { database } from '../loaders';
import { default as loadUserFixtures } from './user'

const loadFixtures = async () => {
    let connection;

    try {
        connection = await database();

        await loadUserFixtures()
    } catch (err) {
        throw err;
    } finally {
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