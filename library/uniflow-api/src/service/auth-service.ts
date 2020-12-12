import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { ParamsConfig } from '../config';
import { ApiException } from '../exception';
import { UserEntity } from '../entity';
import { RequestInterface } from './request/interfaces';
import UserService from './user-service';
import { UserRepository } from '../repository';

@Service()
export default class AuthService {
  constructor(
    private paramsConfig: ParamsConfig,
    @Inject('RequestInterface')
    private request: RequestInterface,
    private userService: UserService,
    private userRepository: UserRepository,
  ) {}

  public async login(username: string, password: string): Promise<{ user: UserEntity; token: string }> {
    const user = await this.userRepository.findOne({ username })
              || await this.userRepository.findOne({ email: username });

    if (!user || !user.password) {
      throw new ApiException('Bad credentials', 401);
    }

    const validPassword = await argon2.verify(user.password, password);
    if (validPassword) {
      const token = this.generateToken(user);
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return { user, token };
    } else {
      throw new ApiException('Bad credentials', 401);
    }
  }

  public async facebookLogin(access_token: string, user?: UserEntity): Promise<{ user: UserEntity; token: string }> {
    // Get the token's Facebook app info.
    const appResponse = await this.request.get(`https://graph.facebook.com/app/?access_token=${access_token}`)

    // Make sure it's the correct app.
    if (!appResponse.data.id || appResponse.data.id !== this.paramsConfig.getConfig().get('facebookAppId')) {
      throw new ApiException('Bad credentials', 401);
    }

    // Get the token's Facebook user info.
    const tokenResponse = await this.request.get(`https://graph.facebook.com/me/?access_token=${access_token}`)

    if (!tokenResponse.data.id) {
      throw new ApiException('Bad credentials', 401);
    }

    const facebookId = tokenResponse.data.id;
    const facebookEmail = `${tokenResponse.data.id}@facebook.com`;

    if (!user) {
      user = await this.userRepository.findOne({ facebookId });
      if (!user) {
        user = await this.userRepository.findOne({ email: facebookEmail });
      }
    }

    if (!user) {
      user = await this.userService.create({
        email: facebookEmail,
        facebookId: facebookId,
        plainPassword: null,
      })
    } else if (!user.facebookId) {
      user.facebookId = facebookId;
      await this.userRepository.save(user);
    }

    const token = this.generateToken(user);

    return { user, token }
  }

  public async githubLogin(code: string, user?: UserEntity): Promise<{ user: UserEntity; token: string }> {
    // Get the token's Github app.
    const appResponse = await this.request.post(`https://github.com/login/oauth/access_token`, {
      'client_id': this.paramsConfig.getConfig().get('githubAppId'),
      'client_secret': this.paramsConfig.getConfig().get('githubAppSecret'),
      'code': code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!appResponse.data.access_token) {
      throw new ApiException('Bad credentials', 401);
    }

    // Get the token's Github user info.
    const tokenResponse = await this.request.get(`https://api.github.com/user`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Uniflow App',
        'Authorization': `Bearer ${appResponse.data.access_token}`
      }
    })

    // Try to fetch user by it's token ID, create it otherwise.
    if (!tokenResponse.data.id) {
      throw new ApiException('Bad credentials', 401);
    }

    const githubId = tokenResponse.data.id;
    const githubEmail = `${tokenResponse.data.id}@github.com`;

    if (!user) {
      user = await this.userRepository.findOne({ githubId });
      if (!user) {
        user = await this.userRepository.findOne({ email: githubEmail });
      }
    }

    if (!user) {
      user = await this.userService.create({
        email: githubEmail,
        githubId: githubId,
        plainPassword: null,
      })
    } else if (!user.githubId) {
      user.githubId = githubId;
      await this.userRepository.save(user);
    }

    const token = this.generateToken(user);

    return { user, token }
  }

  private generateToken(user: UserEntity): string {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        roles: [user.role],
        name: user.email,
        exp: exp.getTime() / 1000,
      },
      this.paramsConfig.getConfig().get('jwtSecret'),
    );
  }
}
