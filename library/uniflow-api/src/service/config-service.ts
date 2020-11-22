import { Service } from 'typedi';
import { ConfigEntity } from '../entity';

@Service()
export default class ConfigService {
  public async isValid(config: ConfigEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(config: ConfigEntity): Promise<Object> {
    return {}
  }
}
