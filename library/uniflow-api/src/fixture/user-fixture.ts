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

        await this.save({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: 'user@uniflow.io',
            password: 'user_password',
        } as UserEntity)
    }
}