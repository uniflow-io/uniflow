import { Service } from 'typedi';
import { ConfigEntity } from '../entity';
import { ConfigApiType } from '../model/interfaces';

@Service()
export default class ConfigService {
  public async isValid(config: ConfigEntity): Promise<boolean> {
    return true
  }
  
  public async getJson(config: ConfigEntity): Promise<ConfigApiType> {
    return {
      uid: config.uid
    }
  }
}
