import { Service } from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Client } from '../models';

@Service()
export default class ClientService {
  constructor(@InjectRepository(Client) private readonly clientRepository: Repository<Client>) {}

  public async save(client: Client): Promise<Client> {
    return await this.clientRepository.save(client);
  }

  public async findOne(id?: string | number): Promise<Client | undefined> {
    return await this.clientRepository.findOne(id);
  }

  public async findOrCreateByNames(names: string[]): Promise<Client[] | undefined> {
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

  public async toNames(clients: Client[]): Promise<string[] | undefined> {
    return clients.map((client) => {
      return client.name
    })
  }
}
