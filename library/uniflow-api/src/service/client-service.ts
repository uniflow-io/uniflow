import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ClientEntity } from '../entity';

@Service()
export default class ClientEntityService {
  private getClientRepository(): Repository<ClientEntity> {
    return getRepository(ClientEntity)
  }

  public async save(client: ClientEntity): Promise<ClientEntity> {
    return await this.getClientRepository().save(client);
  }

  public async findOne(id?: string | number): Promise<ClientEntity | undefined> {
    return await this.getClientRepository().findOne(id);
  }

  public async findOrCreateByNames(names: string[]): Promise<ClientEntity[]> {
    let clients = []
    for(const name of names) {
      let client = await this.getClientRepository().findOne({name})
      if(!client) {
        client = new ClientEntity()
        client.name = name
        await this.save(client)
      }
    
      clients.push(client);
    }
    
    return clients
  }

  public async toNames(clients: ClientEntity[]): Promise<string[]> {
    return clients.map((client) => {
      return client.name
    })
  }
}
