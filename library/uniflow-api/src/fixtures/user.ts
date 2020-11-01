import { Repository, getRepository } from 'typeorm';
import { User } from '../entities';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

export default async () => {
    const salt = randomBytes(32);

    let user: User = new User()
    user.firstname = 'test'
    user.lastname = 'test'
    user.email = 'test@gmail.com'
    user.salt = salt.toString('hex')
    user.password = await argon2.hash('test', { salt });
    user.role = 'ROLE_USER'

    let userRepository: Repository<User> = getRepository(User)
    await userRepository.save(user)
}