import * as argon2 from 'argon2';
import * as faker from 'faker'
import { Service } from 'typedi';
import { randomBytes } from 'crypto';
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
        for(let i = 0; i < 10; i++) {
            this.users.push(this.userFactory.create({
                username: faker.random.arrayElement<string|undefined>([undefined, `user${i?i:''}`]),
                email: `user${i?i:''}@uniflow.io`,
                password: `user${i?i:''}_password`,
            }))
        }
    }

    public get USER_KEYS():Array<string> {
        return this.users.map(user => `user-${user.email}`)
    }

    private async save(user: UserEntity): Promise<UserEntity> {
        const salt = randomBytes(32);
        user.salt = salt.toString('hex')
        user.password = await argon2.hash(user.password as string, { salt });

        this.refs.set(`user-${user.email}`, user)
        return await this.userRepository.save(user)
    }

    public async load() {
        await this.save(this.userFactory.create({
            email: 'admin@uniflow.io',
            password: 'admin_password',
            role: 'ROLE_SUPER_ADMIN',
        }))

        for(const user of this.users) {
            await this.save(user)
        }
    }
}