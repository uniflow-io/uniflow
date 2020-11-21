import * as faker from 'faker'
import { Service } from 'typedi';
import { ClientEntity } from '../entity';
import ClientFactory from './client-factory';

@Service()
export default class FakeClientFactory extends ClientFactory {
    public create(entity?: ClientEntity|Object): ClientEntity {
        const client = super.create(entity)
        client.name = client.name ?? faker.fake('Client {{random.word}}')

        return client;
    }
}