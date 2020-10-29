import Container from 'typedi';
import { ConnectionOptions } from 'typeorm';
import env from './env';
import { Client, Config, Contact, Folder, Program, Tag, User } from '../models';
import {ProgramClient, ProgramTag} from "../models";

export default async (): Promise<ConnectionOptions> => {
  const dbType = await env.get('database.type') as string;

  let connectionOptions: ConnectionOptions

  switch (dbType) {
    case 'mongodb':
      connectionOptions = {
        type: 'mongodb',
        url: await env.get('database.mongodb.connectionUrl') as string,
        useNewUrlParser: true,
      };
      break;

    case 'postgres':
      connectionOptions = {
        type: 'postgres',
        database: await env.get('database.postgres.database') as string,
        host: await env.get('database.postgres.host') as string,
        password: await env.get('database.postgres.password') as string,
        port: await env.get('database.postgres.port') as number,
        username: await env.get('database.postgres.user') as string,
      };
      break;

    case 'mysql':
      connectionOptions = {
        type: 'mysql',
        database: await env.get('database.mysql.database') as string,
        host: await env.get('database.mysql.host') as string,
        password: await env.get('database.mysql.password') as string,
        port: await env.get('database.mysql.port') as number,
        username: await env.get('database.mysql.user') as string
      };
      break;

    case 'sqlite':
      connectionOptions = {
        type: 'sqlite',
        database: await env.get('database.sqlite.database') as string,
      };
      break;
      
    default:
      throw new Error(`The database "${dbType}" is currently not supported!`);
  }

  Object.assign(connectionOptions, {
    entities: [Client, Config, Contact, Folder, Program, ProgramClient, ProgramTag, Tag, User],
    //synchronize: true,
    migrationsTableName: "migration",
    migrations: ["migrations/*.js"],
    cli: {
        "migrationsDir": "migrations"
    },
    logging: false
  });

  return connectionOptions
}