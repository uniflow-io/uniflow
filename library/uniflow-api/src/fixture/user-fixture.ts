import * as argon2 from 'argon2';
import { Service } from 'typedi';
import { randomBytes } from 'crypto';
import { Repository, getRepository } from 'typeorm';
import { UserEntity } from '../entity';
import { FixtureInterface } from '../type';

@Service()
export default class UserFixture implements FixtureInterface {
    private getUserRepository(): Repository<UserEntity> {
        return getRepository(UserEntity)
    }

    public async load() {
        const salt = randomBytes(32);

        let user: UserEntity = new UserEntity()
        user.firstname = 'test'
        user.lastname = 'test'
        user.email = 'test@gmail.com'
        user.salt = salt.toString('hex')
        user.password = await argon2.hash('test', { salt });
        user.role = 'ROLE_USER'
        
        await this.getUserRepository().save(user)
    }
}