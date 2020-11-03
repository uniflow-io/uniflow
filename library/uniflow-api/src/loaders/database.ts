import * as convict from 'convict'
import Container from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import { connection } from '../config';
import { AppConfig } from '../config/params';

export default async (params: convict.Config<AppConfig>): Promise<Connection> => {
  // typedi + typeorm@
  useContainer(Container);

  // create a connection using modified connection options
  return await createConnection(await connection(params));
};
