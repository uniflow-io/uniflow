import * as argon2 from 'argon2';
import * as faker from 'faker'
import { Service } from 'typedi';
import { randomBytes } from 'crypto';
import { UserEntity } from '../entity';
import { FixtureInterface } from './interfaces';
import { UserRepository } from '../repository';
import ReferencesFixture from './references-fixture';

@Service()
export default class UserFixture implements FixtureInterface {
    public static get USERS():Array<string> {
        return Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `user${i?i:''}@uniflow.io`))
    }

    constructor(
        private refs: ReferencesFixture,
        private userRepository: UserRepository,
    ) {}

    private async save(user: UserEntity): Promise<UserEntity> {
        const salt = randomBytes(32);

        user.salt = salt.toString('hex')
        user.password = await argon2.hash(user.password, { salt });
        user.role = user.role || 'ROLE_USER'

        this.refs.set(`user-${user.email}`, user)
        return await this.userRepository.save(user)
    }

    public async load() {
        await this.save({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: 'admin@uniflow.io',
            password: 'admin_password',
            role: 'ROLE_SUPER_ADMIN',
        } as UserEntity)

        for(let i = 0; i < 10; i++) {
            await this.save({
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                username: faker.random.arrayElement<string|undefined>([undefined, `user${i?i:''}`]),
                email: `user${i?i:''}@uniflow.io`,
                password: `user${i?i:''}_password`,
            } as UserEntity)
        }
    }
}