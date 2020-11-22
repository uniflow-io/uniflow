import { Service } from 'typedi';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import AbstractFactory from './abstract-factory';
import { UserFactoryInterface } from './interfaces';
import { UserEntity } from '../entity';

@Service()
export default class UserFactory extends AbstractFactory<UserEntity> implements UserFactoryInterface {
    public async create(entity?: UserEntity|Object): Promise<UserEntity> {
        const user = await super.create(entity)
        user.role = user.role ?? 'ROLE_USER'

        if(user.plainPassword === null) {
            const salt = randomBytes(32);
            user.password = null
            user.salt = salt.toString('hex')
        } else if(user.plainPassword !== undefined) {
            const salt = randomBytes(32);
            user.password = await argon2.hash(user.plainPassword, { salt })
            user.salt = salt.toString('hex')
        } else if(user.salt === undefined || user.password === undefined) {
            const salt = randomBytes(32);
            user.password = null
            user.salt = salt.toString('hex')
        }

        return user;
    }
}