import { Service } from 'typedi';
import {
  Controller,
  Get,
  Route,
} from "tsoa";

@Route("version")
@Service()
class VersionController extends Controller {
  @Get()
  public async getVersion(): Promise<{version: string}> {
    return {
      version: `v${require('../../package.json').version}`
    }
  }
}

export { VersionController }