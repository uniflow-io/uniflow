import { Service } from 'typedi';
import { ClientEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { ClientRepository } from '../repository';
import ReferencesFixture from './references-fixture';

@Service()
export default class ClientFixture implements FixtureInterface {
    public static get CLIENTS():Array<string> {
        return Array.from(['uniflow', 'node', 'chrome', 'jetbrains', 'rust'])
    }

    constructor(
        private refs: ReferencesFixture,
        private clientRepository: ClientRepository,
    ) { }

    private async save(client: ClientEntity): Promise<ClientEntity> {
        this.refs.set(`client-${client.name}`, client);
        return await this.clientRepository.save(client)
    }

    public async load() {
        for(const client of ClientFixture.CLIENTS) {
            await this.save({
                name: client,
            } as ClientEntity)
        }
    }
}