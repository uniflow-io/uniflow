import Container from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import { connection } from '../config';

export default async (): Promise<Connection> => {
  // typedi + typeorm@
  useContainer(Container);

  // create a connection using modified connection options
  return await createConnection(await connection());
};
