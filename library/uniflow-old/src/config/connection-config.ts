import { Service } from 'typedi';
import { ConnectionOptions } from 'typeorm';
import { ClientEntity, ConfigEntity, ContactEntity, FolderEntity, LeadEntity, ProgramEntity, ProgramClientEntity, ProgramTagEntity, TagEntity, UserEntity } from '../entity';
import appConfig from './app-config';

@Service()
export default class ConnectionConfig {
  public async getConfig(): Promise<ConnectionOptions> {
    const dbType = await appConfig.get('database.type') as string;

    let connectionOptions: ConnectionOptions
  
    switch (dbType) {
      case 'mongodb':
        connectionOptions = {
          type: 'mongodb',
          url: await appConfig.get('database.mongodb.connectionUrl') as string,
          useNewUrlParser: true,
        };
        break;
  
      case 'postgres':
        connectionOptions = {
          type: 'postgres',
          database: await appConfig.get('database.postgres.database') as string,
          host: await appConfig.get('database.postgres.host') as string,
          password: await appConfig.get('database.postgres.password') as string,
          port: await appConfig.get('database.postgres.port') as number,
          username: await appConfig.get('database.postgres.user') as string,
        };
        break;
  
      case 'mysql':
        connectionOptions = {
          type: 'mysql',
          database: await appConfig.get('database.mysql.database') as string,
          host: await appConfig.get('database.mysql.host') as string,
          password: await appConfig.get('database.mysql.password') as string,
          port: await appConfig.get('database.mysql.port') as number,
          username: await appConfig.get('database.mysql.user') as string
        };
        break;
  
      case 'sqlite':
        connectionOptions = {
          type: 'sqlite',
          database: await appConfig.get('database.sqlite.database') as string,
        };
        break;
        
      default:
        throw new Error(`The database "${dbType}" is currently not supported!`);
    }

    let basePath = './src'
    let extension = 'ts'
    if(appConfig.get('env') === 'production' || appConfig.get('env') === 'preprod') {
      basePath = './dist'
      extension = 'js'
    }
  
    Object.assign(connectionOptions, {
      entities: [ClientEntity, ConfigEntity, ContactEntity, FolderEntity, LeadEntity, ProgramEntity, ProgramClientEntity, ProgramTagEntity, TagEntity, UserEntity],
      //synchronize: true,
      migrationsTableName: `migration`,
      migrations: [`${basePath}/migration/*.${extension}`],
      cli: {
        "entitiesDir": `${basePath}/entity`,
        "migrationsDir": `${basePath}/migration`
      },
      logging: false
    });
  
    return connectionOptions
  }
}