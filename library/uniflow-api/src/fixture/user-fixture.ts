import * as faker from 'faker'
import { Service } from 'typedi';
import { UserEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { UserRepository } from '../repository';
import ReferencesFixture from './references-fixture';
import { FakeUserFactory } from '../factory';

@Service()
export default class UserFixture implements FixtureInterface {
    private users: UserEntity[]

    constructor(
        private refs: ReferencesFixture,
        private userRepository: UserRepository,
        private userFactory: FakeUserFactory,
    ) {
        this.users = []
    }

    public get USER_KEYS():Array<string> {
        return this.users.map(user => `user-${user.email}`)
    }

    private async save(user: UserEntity): Promise<UserEntity> {
        this.refs.set(`user-${user.email}`, user)
        return await this.userRepository.save(user)
    }

    public async load() {
        await this.save(await this.userFactory.create({
            email: 'admin@uniflow.io',
            plainPassword: 'admin_password',
            role: 'ROLE_SUPER_ADMIN',
        }))

        for(let i = 0; i < 10; i++) {
            const user = await this.userFactory.create({
                username: faker.random.arrayElement<string|undefined>([undefined, `user${i?i:''}`]),
                email: `user${i?i:''}@uniflow.io`,
                plainPassword: `user${i?i:''}_password`,
            })
            this.users.push(user)
            await this.save(user)
        }
    }
}