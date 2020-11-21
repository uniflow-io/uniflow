import * as faker from 'faker'
import { Service } from 'typedi';
import { UserEntity } from '../entity';
import UserFactory from './user-factory';

@Service()
export default class FakeUserFactory extends UserFactory {
    public create(entity?: UserEntity|Object): UserEntity {
        const user = super.create(entity)
        user.firstname = user.firstname ?? faker.name.firstName()
        user.lastname = user.lastname ?? faker.name.lastName()

        return user;
    }
}