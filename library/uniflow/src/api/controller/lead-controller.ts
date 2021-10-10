import { Inject, Service } from "typedi";
import { Controller, Get, Response, SuccessResponse, Post, Route, Tags, ValidateError, Body, Path, Put, Security } from "tsoa";
import { AppConfig } from '../config';
import { ApiException } from '../exception';
import { LeadFactory } from '../factory';
import { LeadRepository } from '../repository';
import { LeadService } from "../service";
import { LeadSubscriberInterface } from '../service/lead-subscriber/interfaces';
import { RequestInterface } from '../service/request/interfaces';
import { ErrorJSON, GithubUser, ValidateErrorJSON } from './interfaces';
import { LeadApiType, UuidType, PartialType } from "../model/interfaces";

@Route('leads')
@Tags("lead")
@Service()
class LeadController extends Controller {
  constructor(
    private leadService: LeadService,
    private leadRepository: LeadRepository,
    private leadFactory: LeadFactory,
    @Inject('LeadSubscriberInterface')
    private leadSubscriber: LeadSubscriberInterface,
    private appConfig: AppConfig,
    @Inject('RequestInterface')
    private request: RequestInterface,
  ) {
    super()
  }

  @Post()
  @SuccessResponse(201, "Created")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  public async createLead(@Body() body: PartialType<LeadApiType>): Promise<LeadApiType> {
    const lead = await this.leadFactory.create(await this.leadRepository.findOne({email: body.email}) || {email: body.email})

    if(body.optinNewsletter || body.optinNewsletter === false) {
      lead.optinNewsletter = body.optinNewsletter
    }

    if(body.optinBlog || body.optinBlog === false) {
      lead.optinBlog = body.optinBlog
    }

    if(await this.leadService.isValid(lead) && (lead.optinNewsletter || lead.optinBlog)) { // ensure lead creation only if one optin is true
      await this.leadRepository.save(lead) //ensure lead uid is defined before subscribing
      await this.leadSubscriber.update(lead)
      await this.leadRepository.save(lead)

      this.setStatus(201)
      return await this.leadService.getJson(lead);
    }

    throw new ValidateError({}, 'Lead not valid')
  }

  @Get('{uid}')
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  public async getLead(@Path() uid: UuidType): Promise<LeadApiType> {
    const lead = await this.leadRepository.findOne({uid})
    if (!lead) {
      throw new ApiException('Lead not found', 404);
    }

    return await this.leadService.getJson(lead);
  }

  @Put('{uid}')
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  public async updateLead(@Path() uid: UuidType, @Body() body: PartialType<LeadApiType>): Promise<LeadApiType> {
    const lead = await this.leadRepository.findOne({uid})
    if (!lead) {
      throw new ApiException('Lead not found', 404);
    }

    if(body.optinNewsletter || body.optinNewsletter === false) {
      lead.optinNewsletter = body.optinNewsletter
    }

    if(body.optinBlog || body.optinBlog === false) {
      lead.optinBlog = body.optinBlog
    }

    if(lead.githubUsername && (body.optinGithub || body.optinGithub === false)) {
      lead.optinGithub = body.optinGithub
    }

    if(await this.leadService.isValid(lead)) {
      await this.leadRepository.save(lead) //ensure lead uid is defined before subscribing
      await this.leadSubscriber.update(lead)
      await this.leadRepository.save(lead)

      return await this.leadService.getJson(lead);
    }

    throw new ValidateError({}, 'Lead not valid')
  }

  @Post('github-webhook')
  @Security('github_token')
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  public async githubWebhook(@Body() body: {action: string, sender: {login: string}}): Promise<LeadApiType|boolean> {
    //create a new lead if receive github star from github webhook !
    const githubEmailToken = this.appConfig.getConfig().get('githubEmailToken')
    if(body.action === 'created' && body.sender.login && githubEmailToken) {
      // retrive github user email with a personal github access token
      const githubResponse = await this.request.get(`https://api.github.com/users/${body.sender.login}`, {
        headers: {
          Authorization: `token ${githubEmailToken}`,
        }
      })
      const githubUser = githubResponse.data as GithubUser
      if(githubUser && githubUser.email && githubUser.login) {
        const lead = await this.leadFactory.create(await this.leadRepository.findOne({email: githubUser.email}) || {email: githubUser.email})
        lead.githubUsername = githubUser.login
        lead.optinGithub = true

        if(await this.leadService.isValid(lead)) {
          await this.leadRepository.save(lead) //ensure lead uid is defined before subscribing
          await this.leadSubscriber.update(lead)
          await this.leadRepository.save(lead)

          this.setStatus(201)
          return await this.leadService.getJson(lead);
        }
      }
    }

    return false;
  }
}

export { LeadController }