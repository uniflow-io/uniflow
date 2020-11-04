import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import request from 'axios'
import { randomBytes } from 'crypto';
import { Service } from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { ParamsConfig } from '../config';
import { Exception } from '../exception';
import { UserEntity } from '../entities';

@Service()
export default class AuthService {
  constructor(
    private paramsConfig: ParamsConfig
  ) { }

  private getUserRepository(): Repository<UserEntity> {
    return getRepository(UserEntity)
  }

  public async register(inputUser: UserEntity): Promise<{ user: UserEntity; token: string }> {
    try {
      const salt = randomBytes(32);

      /**
       * Hash password first
       */
      const hashedPassword = await argon2.hash(inputUser.password, { salt });
      const userRecord = await this.getUserRepository().save({
        ...inputUser,
        salt: salt.toString('hex'),
        password: hashedPassword,
        role: 'ROLE_USER',
      });

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      // await this.mailer.SendWelcomeEmail(userRecord);

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       */
      const token = this.generateToken(userRecord);
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (error) {
      throw new Exception('Not authorized', 401);
    }
  }

  public async login(username: string, password: string): Promise<{ user: UserEntity; token: string }> {
    const userRecord =
      await this.getUserRepository().findOne({ username })
      || await this.getUserRepository().findOne({ email: username });

    if (!userRecord) {
      throw new Exception('Bad credentials', 401);
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      /**
       * Return user and token
       */
      return { user, token };
    } else {
      throw new Exception('Bad credentials', 401);
    }
  }

  public async facebookLogin(access_token: string, user?: UserEntity): Promise<{ user: UserEntity; token: string }> {
    // Get the token's Facebook app info.
    const appResponse = await request.get(`https://graph.facebook.com/app/?access_token=${access_token}`)

    // Make sure it's the correct app.
    if (!appResponse.data.id || appResponse.data.id !== this.paramsConfig.getConfig().get('facebookAppId')) {
      throw new Exception('Bad credentials', 401);
    }

    // Get the token's Facebook user info.
    const tokenResponse = await request.get(`https://graph.facebook.com/me/?access_token=${access_token}`)

    if (!tokenResponse.data.id) {
      throw new Exception('Bad credentials', 401);
    }

    const facebookId = tokenResponse.data.id;
    const facebookEmail = `${tokenResponse.data.id}@facebook.com`;

    if (!user) {
      user = await this.getUserRepository().findOne({ facebookId });
      if (!user) {
        user = await this.getUserRepository().findOne({ email: facebookEmail });
      }
    }

    if (!user) {
      user = new UserEntity();
      user.facebookId = facebookId;
      user.email = facebookEmail;
      user.password = Math.random().toString(36).slice(-8)

      return this.register(user)
    } else if (!user.facebookId) {
      user.facebookId = facebookId;

      await this.getUserRepository().save(user);
    }

    const token = this.generateToken(user);

    return { user, token }
  }

  public async githubLogin(code: string, user?: UserEntity): Promise<{ user: UserEntity; token: string }> {
    // Get the token's Github app.
    const appResponse = await request.post(`https://github.com/login/oauth/access_token`, {
      'client_id': this.paramsConfig.getConfig().get('githubAppId'),
      'client_secret': this.paramsConfig.getConfig().get('githubAppSecret'),
      'code': code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!appResponse.data.access_token) {
      throw new Exception('Bad credentials', 401);
    }

    // Get the token's Github user info.
    const tokenResponse = await request.get(`https://api.github.com/user`, {
      'headers': {
        'Accept': 'application/json',
        'User-Agent': 'Uniflow App',
        'Authorization': `Bearer ${appResponse.data.access_token}`
      }
    })

    // Try to fetch user by it's token ID, create it otherwise.
    if (!tokenResponse.data.id) {
      throw new Exception('Bad credentials', 401);
    }

    const githubId = tokenResponse.data.id;
    const githubEmail = `${tokenResponse.data.id}@github.com`;

    if (!user) {
      user = await this.getUserRepository().findOne({ githubId });
      if (!user) {
        user = await this.getUserRepository().findOne({ email: githubEmail });
      }
    }

    if (!user) {
      user = new UserEntity();
      user.githubId = githubId;
      user.email = githubEmail;
      user.password = Math.random().toString(36).slice(-8)

      return this.register(user)
    } else if (!user.facebookId) {
      user.githubId = githubId;

      await this.getUserRepository().save(user);
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
        role: user.role,
        name: user.email,
        exp: exp.getTime() / 1000,
      },
      this.paramsConfig.getConfig().get('jwtSecret'),
    );
  }
}
