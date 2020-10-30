import { Service } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import { User } from '../entities';
import slugify from "slugify";

@Service()
export default class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User)
  }

  public async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async findOne(id?: string | number): Promise<User | undefined> {
    return await this.userRepository.findOne(id);
  }

  public async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({username});
  }

  public async generateUniqueUsername(username: string): Promise<string> {
    username = slugify(username, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const user = await this.userRepository.findOne({username})
    if(user) {
      const suffix = Math.floor(Math.random() * 1000) + 1 // returns a random integer from 1 to 1000
      return await this.generateUniqueUsername(`${username}-${suffix}` )
    }

    return username
  }

  public async isValid(user: User): Promise<boolean> {
    return true
  }
  
  public async getJson(user: User): Promise<Object> {
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
