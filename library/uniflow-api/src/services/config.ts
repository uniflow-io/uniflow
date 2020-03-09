import { Service, Inject } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import { Config } from '../models';

@Service()
export default class ConfigService {
  private configRepository: Repository<Config>;

  constructor(
    @Inject(type => Config) config: Config
  ) {
    this.configRepository = getRepository(Config)
  }
  
  public async save(config: Config): Promise<Config> {
    return await this.configRepository.save(config);
  }

  public async findOne(id?: string | number): Promise<Config | undefined> {
    return await this.configRepository.findOne(id);
  }

  public async isValid(config: Config): Promise<boolean> {
    return true
  }
  
  public async getJson(config: Config): Promise<Object> {
    return {}
  }
}
