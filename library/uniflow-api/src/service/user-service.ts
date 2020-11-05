import slugify from "slugify";
import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity';

@Service()
export default class UserService {
  private getUserRepository(): Repository<UserEntity> {
    return getRepository(UserEntity)
  }

  public async save(user: UserEntity): Promise<UserEntity> {
    return await this.getUserRepository().save(user);
  }

  public async findOne(id?: string | number): Promise<UserEntity | undefined> {
    return await this.getUserRepository().findOne(id);
  }

  public async findOneByUsername(username: string): Promise<UserEntity | undefined> {
    return await this.getUserRepository().findOne({username});
  }

  public async generateUniqueUsername(username: string): Promise<string> {
    username = slugify(username, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const user = await this.getUserRepository().findOne({username})
    if(user) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueUsername(`${username}-${suffix}` )
    }

    return username
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
