import { Service } from 'typedi';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Config } from '../models';

@Service()
export default class ConfigService {
  constructor(@InjectRepository(Config) private readonly configRepository: Repository<Config>) {}

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
