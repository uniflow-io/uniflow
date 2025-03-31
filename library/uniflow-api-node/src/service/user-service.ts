import { Service } from 'typedi';
import { UserEntity } from '../entity';
import { ApiException } from '../exception';
import { LeadRepository, UserRepository } from '../repository';
import { TypeModel } from '../model';
import { UserFactory } from '../factory';
import { ROLE, UserApiType } from '../model/interfaces';

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
    if (user.role === ROLE.SUPER_ADMIN) {
      roles.push(ROLE.USER)
      roles.push(ROLE.SUPER_ADMIN)
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

  public async isValid(user: UserEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(user: UserEntity): Promise<UserApiType> {
    const lead = await this.leadRepository.findOne({email: user.email})

    return {
      uid: user.uid,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      facebookId: user.facebookId,
      githubId: user.githubId,
      apiKey: user.apiKey,
      roles: [user.role],
      links: {
        lead: lead?.uid
      }
    }
  }
}
