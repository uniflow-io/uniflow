import { Repository, getRepository } from 'typeorm';
import { User } from '../entities';

export default async () => {
    let user: User = new User()
    user.firstname = 'test'
    user.lastname = 'test'
    user.email = 'test@gmail.com'
    user.password = 'test'
    user.salt = 'salt'
    user.role = 'ROLE_USER'

    let userRepository: Repository<User> = getRepository(User)
    await userRepository.save(user)
}