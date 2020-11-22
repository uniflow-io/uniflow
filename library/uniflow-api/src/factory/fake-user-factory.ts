import * as faker from 'faker'
import { Service } from 'typedi';
import { UserEntity } from '../entity';
import UserFactory from './user-factory';

@Service()
export default class FakeUserFactory extends UserFactory {
    public async create(entity?: UserEntity|Object): Promise<UserEntity> {
        const user = await super.create(entity)
        user.firstname = user.firstname ?? faker.name.firstName()
        user.lastname = user.lastname ?? faker.name.lastName()
        user.email = user.email ?? faker.internet.email()

        return user;
    }
}