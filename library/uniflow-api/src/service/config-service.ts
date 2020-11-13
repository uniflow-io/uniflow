import { Service } from 'typedi';
import { ConfigEntity } from '../entity';
import { ConfigRepository } from '../repository';

@Service()
export default class ConfigService {
  constructor(
    private configRepository: ConfigRepository,
  ) {}
  
  public async isValid(config: ConfigEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(config: ConfigEntity): Promise<Object> {
    return {}
  }
}
