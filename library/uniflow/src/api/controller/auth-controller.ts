import * as express from "express";
import { Service } from 'typedi';
import { Controller, Response, SuccessResponse, BodyProp, Post, Route, Tags, Security, Request } from "tsoa";
import { AuthService } from '../service';
import { EmailOrUsernameType, PasswordType } from '../model/interfaces';
import { ErrorJSON, ValidateErrorJSON } from './interfaces';

@Route()
@Tags("auth")
@Service()
class AuthController extends Controller {
  constructor(
    private authService: AuthService
  ) {
    super()
  }

  @Post('login')
  @SuccessResponse(201, "Valid credentials")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Bad credentials")
  public async login(@BodyProp() username: EmailOrUsernameType, @BodyProp() password: PasswordType): Promise<{token: string, uid: string}> {
    this.setStatus(201)
    const { token, user } = await this.authService.login(username, password);
    return { token, uid: user.uid };
  }

  @Post('login-facebook')
  @SuccessResponse(201, "Valid credentials")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Bad credentials")
  @Security('role')
  public async loginFacebook(@Request() req: express.Request, @BodyProp() access_token: string): Promise<{token: string, uid: string}> {
    this.setStatus(201)
    const { token, user } = await this.authService.facebookLogin(access_token, req.user);
    return { token, uid: user.uid };
  }

  @Post('login-github')
  @SuccessResponse(201, "Valid credentials")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Bad credentials")
  @Security('role')
  public async loginGithub(@Request() req: express.Request, @BodyProp() code: string): Promise<{token: string, uid: string}> {
    this.setStatus(201)
    const { token, user } = await this.authService.githubLogin(code, req.user);
    return { token, uid: user.uid };
  }
}

export { AuthController }
