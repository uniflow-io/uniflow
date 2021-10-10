import { Service } from 'typedi';
import { Connection, createConnection } from 'typeorm';
import { ConnectionConfig } from '../config';
import { LoaderInterface } from './interfaces';

@Service()
export default class DatabaseLoader implements LoaderInterface {
  private connection: Connection
  
  constructor(
    private connectionConfig: ConnectionConfig,
  ) {}

  public getConnection(): Connection {
    return this.connection
  }

  public async load() {
    // create a connection using modified connection options
    this.connection = await createConnection(await this.connectionConfig.getConfig());
  }
}
