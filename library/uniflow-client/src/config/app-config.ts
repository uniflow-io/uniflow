import { default as convict } from 'convict';
import * as dotenv from 'dotenv';

type AppConfigData = {
  env: 'development' | 'preprod' | 'production' | 'test',
  port: number,
  clientUrl: string,
  apiUrl: string,
  facebookAppId: string,
  githubAppId: string,
  trackingId: string,
};

const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

const envFound = dotenv.config({
  path: `.env.${activeEnv}`,
});
if (!envFound) {
  // Throw generic error
  throw new Error(`Couldn't find .env.${activeEnv} file`);
}

const appConfig = convict<AppConfigData>({
  env: {
    doc: 'Running environment',
    format: ['development' , 'preprod' , 'production' , 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    format: Number,
    default: 8016,
    arg: 'port',
    env: 'PORT',
    doc: 'HTTP port uniflow api can be reached',
  },
  clientUrl: {
    format: String,
    default: '',
    env: 'GATSBY_CLIENT_URL',
    doc: 'Client'
  },
  apiUrl: {
    format: String,
    default: '',
    env: 'GATSBY_API_URL',
    doc: 'Api Url'
  },
  facebookAppId: {
    format: String,
    default: '',
    env: 'GATSBY_FACEBOOK_APP_ID',
    doc: 'Facebook App Id'
  },
  githubAppId: {
    format: String,
    default: '',
    env: 'GATSBY_GITHUB_APP_ID',
    doc: 'Github App Id'
  },
  trackingId: {
    format: String,
    default: '',
    env: 'GATSBY_TRACKING_ID',
    doc: 'Tracking Id'
  },
});

appConfig.validate({
  allowed: 'strict',
});

export default appConfig;
