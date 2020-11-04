import { Service, Container } from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import { ConnectionConfig } from '../config';
import { LoaderInterface } from '../types';

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
    // typedi + typeorm@
    useContainer(Container);

    // create a connection using modified connection options
    this.connection = await createConnection(await this.connectionConfig.getConfig());
  }
}
