import { Service } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import { Client } from '../entities';

@Service()
export default class ClientService {
  private clientRepository: Repository<Client>;

  constructor() {
    this.clientRepository = getRepository(Client)
  }

  public async save(client: Client): Promise<Client> {
    return await this.clientRepository.save(client);
  }

  public async findOne(id?: string | number): Promise<Client | undefined> {
    return await this.clientRepository.findOne(id);
  }

  public async findOrCreateByNames(names: string[]): Promise<Client[]> {
    let clients = []
    for(const name of names) {
      let client = await this.clientRepository.findOne({name})
      if(!client) {
        client = new Client()
        client.name = name
        await this.save(client)
      }
    
      clients.push(client);
    }
    
    return clients
  }

  public async toNames(clients: Client[]): Promise<string[]> {
    return clients.map((client) => {
      return client.name
    })
  }
}
