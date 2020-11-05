import * as argon2 from 'argon2';
import * as faker from 'faker'
import { Service } from 'typedi';
import { randomBytes } from 'crypto';
import { Repository, getRepository } from 'typeorm';
import { UserEntity } from '../entity';
import { FixtureInterface } from './interfaces';

@Service()
export default class UserFixture implements FixtureInterface {
    private getUserRepository(): Repository<UserEntity> {
        return getRepository(UserEntity)
    }

    private async saveUser(user: UserEntity) {
        const salt = randomBytes(32);

        user.salt = salt.toString('hex')
        user.password = await argon2.hash(user.password, { salt });
        user.role = user.role || 'ROLE_USER'

        await this.getUserRepository().save(user)
    }

    public async load() {
        await this.saveUser({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: 'admin@uniflow.io',
            password: 'admin_password',
            role: 'ROLE_SUPER_ADMIN',
        } as UserEntity)

        await this.saveUser({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email: 'user@uniflow.io',
            password: 'user_password',
        } as UserEntity)
    }
}