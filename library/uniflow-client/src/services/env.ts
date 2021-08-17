import { Service } from 'typedi';

type EnvData = {
  env?: string;
  clientUrl?: string;
  apiUrl?: string;
  facebookAppId?: string;
  githubAppId?: string;
  trackingId?: string;
};

@Service()
class Env {
  envs: EnvData;
  constructor() {
    this.envs = {
      env: process.env.GATSBY_ACTIVE_ENV,
      clientUrl: process.env.GATSBY_CLIENT_URL,
      apiUrl: process.env.GATSBY_API_URL,
      facebookAppId: process.env.GATSBY_FACEBOOK_APP_ID,
      githubAppId: process.env.GATSBY_GITHUB_APP_ID,
      trackingId: process.env.GATSBY_TRACKING_ID,
    };
  }

  get(name: keyof EnvData): string | undefined {
    return this.envs[name];
  }
}

export default Env;
