import { Service } from 'typedi';
import { UserEntity } from '../entity';
import { ApiException } from '../exception';
import { LeadRepository, UserRepository } from '../repository';
import { TypeModel } from '../model';
import { UserFactory } from '../factory';

@Service()
export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private userFactory: UserFactory,
    private leadRepository: LeadRepository,
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

  public async create(user?: UserEntity|Object): Promise<UserEntity> {
    try {
      let newUser = await this.userFactory.create(user)
      newUser = await this.userRepository.save(newUser)
      if (!newUser) {
        throw new Error('User cannot be created');
      }

      // await this.mailer.sendWelcomeEmail(user);

      return newUser;
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
    const lead = await this.leadRepository.findOne({email: user.email})

    return {
      'uid': user.uid,
      'firstname': user.firstname,
      'lastname': user.lastname,
      'username': user.username,
      'email': user.email,
      'facebookId': user.facebookId,
      'githubId': user.githubId,
      'apiKey': user.apiKey,
      'roles': [user.role],
      "links": {
        "lead": lead?.uid
      }
    }
  }
}
