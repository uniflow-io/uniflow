import * as argon2 from 'argon2';
import { Service } from 'typedi';
import { UserEntity } from '../entity';
import { randomBytes } from 'crypto';
import { ApiException } from '../exception';
import { UserRepository } from '../repository';
import { TypeModel } from '../model';
import { UserFactory } from '../factory';

@Service()
export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private userFactory: UserFactory,
  ) {}

  public isGranted(user: UserEntity, attributes: Array<string> | string): boolean {
    if (!Array.isArray(attributes)) {
      attributes = [attributes]
    }
  
    let roles = []
    if (user.role === 'ROLE_SUPER_ADMIN') {
      roles.push('ROLE_USER')
      roles.push('ROLE_SUPER_ADMIN')
    } else {
      roles.push(user.role)
    }
  
    for (const attribute of attributes) {
      for (const role of roles) {
        if (attribute === role) {
          return true
        }
      }
    }

    return false
  }

  public async create(inputUser: UserEntity): Promise<UserEntity> {
    try {
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(inputUser.password as string, { salt });
      const user = await this.userRepository.save(this.userFactory.create({
        ...inputUser,
        password: hashedPassword,
        salt: salt.toString('hex'),
        role: 'ROLE_USER',
      }));

      if (!user) {
        throw new Error('User cannot be created');
      }

      // await this.mailer.sendWelcomeEmail(user);

      return user;
    } catch (error) {
      throw new ApiException('Not authorized', 401);
    }
  }
  
  public async setUsername(user: UserEntity, username: string): Promise<UserEntity> {
    username = TypeModel.generateSlug(username)

    const existUser = await this.userRepository.findOne({username})
    if(existUser) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.setUsername(user, `${username}-${suffix}`)
    }

    user.username = username

    return user
  }

  public async isValid(user: UserEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(user: UserEntity): Promise<Object> {
    return {
      'uid': user.uid,
      'firstname': user.firstname,
      'lastname': user.lastname,
      'username': user.username,
      'facebookId': user.facebookId,
      'githubId': user.githubId,
      'apiKey': user.apiKey,
      'roles': [user.role],
    }
  }
}
