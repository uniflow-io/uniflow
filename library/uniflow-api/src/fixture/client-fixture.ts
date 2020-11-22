import { Service } from 'typedi';
import { ClientEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { ClientRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import { FakeClientFactory } from '../factory';

@Service()
export default class ClientFixture implements FixtureInterface {
    private clients: ClientEntity[]

    constructor(
        private refs: ReferencesFixture,
        private clientRepository: ClientRepository,
        private clientFactory: FakeClientFactory,
    ) {
        this.clients = []
    }

    public get CLIENT_KEYS():Array<string> {
        return this.clients.map(client => `client-${client.name}`)
    }

    private async save(client: ClientEntity): Promise<ClientEntity> {
        this.refs.set(`client-${client.name}`, client);
        return await this.clientRepository.save(client)
    }

    public async load() {
        for(const name of ['uniflow', 'node', 'chrome', 'jetbrains', 'rust']) {
            const client = await this.clientFactory.create({name})
            this.clients.push(client)
            await this.save(client)
        }
    }
}