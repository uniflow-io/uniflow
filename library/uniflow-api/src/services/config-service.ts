import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ConfigEntity } from '../entities';

@Service()
export default class ConfigService {
  private getConfigRepository(): Repository<ConfigEntity> {
    return getRepository(ConfigEntity)
  }
  
  public async save(config: ConfigEntity): Promise<ConfigEntity> {
    return await this.getConfigRepository().save(config);
  }

  public async findOne(id?: string | number): Promise<ConfigEntity | undefined> {
    return await this.getConfigRepository().findOne(id);
  }

  public async isValid(config: ConfigEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(config: ConfigEntity): Promise<Object> {
    return {}
  }
}
