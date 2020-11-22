import * as faker from 'faker'
import { Service } from 'typedi';
import { ClientEntity } from '../entity';
import ClientFactory from './client-factory';

@Service()
export default class FakeClientFactory extends ClientFactory {
    public async create(entity?: ClientEntity|Object): Promise<ClientEntity> {
        const client = await super.create(entity)
        client.name = client.name ?? faker.fake('Client {{random.word}}')

        return client;
    }
}