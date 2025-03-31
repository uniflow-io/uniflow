import { Service } from 'typedi';
import { ClientEntity } from '../entity';
import { ClientFactory } from '../factory';
import { ClientRepository } from '../repository';

@Service()
export default class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private clientFactory: ClientFactory,
  ) {}
  
  public async findOrCreateByNames(names: string[]): Promise<ClientEntity[]> {
    let clients = []
    for(const name of names) {
      let client = await this.clientRepository.findOne({name})
      if(!client) {
        client = await this.clientFactory.create({name})
        await this.clientRepository.save(client)
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
