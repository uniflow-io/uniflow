import { Service } from 'typedi';
import AbstractFactory from './abstract-factory';
import { UserFactoryInterface } from './interfaces';
import { UserEntity } from '../entity';

@Service()
export default class UserFactory extends AbstractFactory<UserEntity> implements UserFactoryInterface {
    public create(entity?: UserEntity|Object): UserEntity {
        const user = super.create(entity)
        user.role = user.role ?? 'ROLE_USER'

        return user;
    }
}