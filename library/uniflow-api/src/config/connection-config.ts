import { Service } from 'typedi';
import { ConnectionOptions } from 'typeorm';
import { ClientEntity, ConfigEntity, ContactEntity, FolderEntity, ProgramEntity, ProgramClientEntity, ProgramTagEntity, TagEntity, UserEntity } from '../entity';
import ParamsConfig from './params-config';

@Service()
export default class ConnectionConfig {
  constructor(
    private params: ParamsConfig
  ) {}

  public async getConfig(): Promise<ConnectionOptions> {
    const dbType = await this.params.getConfig().get('database.type') as string;

    let connectionOptions: ConnectionOptions
  
    switch (dbType) {
      case 'mongodb':
        connectionOptions = {
          type: 'mongodb',
          url: await this.params.getConfig().get('database.mongodb.connectionUrl') as string,
          useNewUrlParser: true,
        };
        break;
  
      case 'postgres':
        connectionOptions = {
          type: 'postgres',
          database: await this.params.getConfig().get('database.postgres.database') as string,
          host: await this.params.getConfig().get('database.postgres.host') as string,
          password: await this.params.getConfig().get('database.postgres.password') as string,
          port: await this.params.getConfig().get('database.postgres.port') as number,
          username: await this.params.getConfig().get('database.postgres.user') as string,
        };
        break;
  
      case 'mysql':
        connectionOptions = {
          type: 'mysql',
          database: await this.params.getConfig().get('database.mysql.database') as string,
          host: await this.params.getConfig().get('database.mysql.host') as string,
          password: await this.params.getConfig().get('database.mysql.password') as string,
          port: await this.params.getConfig().get('database.mysql.port') as number,
          username: await this.params.getConfig().get('database.mysql.user') as string
        };
        break;
  
      case 'sqlite':
        connectionOptions = {
          type: 'sqlite',
          database: await this.params.getConfig().get('database.sqlite.database') as string,
        };
        break;
        
      default:
        throw new Error(`The database "${dbType}" is currently not supported!`);
    }
  
    Object.assign(connectionOptions, {
      entities: [ClientEntity, ConfigEntity, ContactEntity, FolderEntity, ProgramEntity, ProgramClientEntity, ProgramTagEntity, TagEntity, UserEntity],
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
}