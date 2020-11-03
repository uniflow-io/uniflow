import Container from 'typedi';
import { ConnectionOptions } from 'typeorm';
import { Client, Config, Contact, Folder, Program, ProgramClient, ProgramTag, Tag, User } from '../entities';
import * as convict from 'convict';
import { AppConfig } from './params';

export default async (params: convict.Config<AppConfig>): Promise<ConnectionOptions> => {
  const dbType = await params.get('database.type') as string;

  let connectionOptions: ConnectionOptions

  switch (dbType) {
    case 'mongodb':
      connectionOptions = {
        type: 'mongodb',
        url: await params.get('database.mongodb.connectionUrl') as string,
        useNewUrlParser: true,
      };
      break;

    case 'postgres':
      connectionOptions = {
        type: 'postgres',
        database: await params.get('database.postgres.database') as string,
        host: await params.get('database.postgres.host') as string,
        password: await params.get('database.postgres.password') as string,
        port: await params.get('database.postgres.port') as number,
        username: await params.get('database.postgres.user') as string,
      };
      break;

    case 'mysql':
      connectionOptions = {
        type: 'mysql',
        database: await params.get('database.mysql.database') as string,
        host: await params.get('database.mysql.host') as string,
        password: await params.get('database.mysql.password') as string,
        port: await params.get('database.mysql.port') as number,
        username: await params.get('database.mysql.user') as string
      };
      break;

    case 'sqlite':
      connectionOptions = {
        type: 'sqlite',
        database: await params.get('database.sqlite.database') as string,
      };
      break;
      
    default:
      throw new Error(`The database "${dbType}" is currently not supported!`);
  }

  Object.assign(connectionOptions, {
    entities: [Client, Config, Contact, Folder, Program, ProgramClient, ProgramTag, Tag, User],
    //synchronize: true,
    migrationsTableName: "migration",
    migrations: ["src/migrations/*.ts"],
    cli: {
      "entitiesDir": "src/models",
      "migrationsDir": "src/migrations"
    },
    logging: false
  });

  return connectionOptions
}