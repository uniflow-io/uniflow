import Container from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import config from '../config';
import { Client, Config, Contact, Folder, Program, Tag, User } from '../models';
import {ProgramClient} from "../models/program-client";
import {ProgramTag} from "../models/program-tag";

export default async (): Promise<Connection> => {
  const dbType = await config.get('database.type') as string;

  let connectionOptions

  switch (dbType) {
    case 'mongodb':
      connectionOptions = {
        type: 'mongodb',
        url: await config.get('database.mongodb.connectionUrl') as string,
        useNewUrlParser: true,
      };
      break;

    case 'postgresdb':
      connectionOptions = {
        type: 'postgres',
        database: await config.get('database.postgresdb.database') as string,
        host: await config.get('database.postgresdb.host') as string,
        password: await config.get('database.postgresdb.password') as string,
        port: await config.get('database.postgresdb.port') as number,
        username: await config.get('database.postgresdb.user') as string,
      };
      break;

    case 'mysqldb':
      connectionOptions = {
        type: 'mysql',
        database: await config.get('database.mysqldb.database') as string,
        host: await config.get('database.mysqldb.host') as string,
        password: await config.get('database.mysqldb.password') as string,
        port: await config.get('database.mysqldb.port') as number,
        username: await config.get('database.mysqldb.user') as string
      };
      break;

    case 'sqlite':
      connectionOptions = {
        type: 'sqlite',
        database: './database.sqlite',
      };
      break;
      
    default:
      throw new Error(`The database "${dbType}" is currently not supported!`);
  }

  Object.assign(connectionOptions, {
    entities: [Client, Config, Contact, Folder, Program, ProgramClient, ProgramTag, Tag, User],
    synchronize: true,
    logging: false
  });

  // typedi + typeorm@
  useContainer(Container);

  // create a connection using modified connection options
  return await createConnection(connectionOptions);;
};
