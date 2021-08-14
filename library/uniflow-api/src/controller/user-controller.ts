import * as express from "express";
import { Service} from "typedi";
import { Controller, Get, Request, Response, SuccessResponse, BodyProp, Post, Route, Path, Tags, Security, Put, ValidateError, Body, Query } from "tsoa";
import { UserService, ConfigService, FolderService, ProgramService, ProgramClientService, ProgramTagService } from "../service";
import { ConfigRepository, FolderRepository, ProgramRepository, TagRepository, UserRepository } from "../repository";
import { ApiException } from "../exception";
import { IsNull } from "typeorm";
import { ConfigFactory, ProgramFactory, FolderFactory } from "../factory";
import { ConfigApiType, EmailType, FolderApiType, NotEmptyStringType, PageType, PartialType, PathType, PerPageType, ProgramApiType, SlugType, UserApiType, UuidOrUsernameType } from "../model/interfaces";
import { ErrorJSON, ValidateErrorJSON } from './interfaces'

@Route("users")
@Tags("user")
@Service()
class UserController extends Controller {
  constructor(
    private tagRepository: TagRepository,
    private programRepository: ProgramRepository,
    private userRepository: UserRepository,
    private configRepository: ConfigRepository,
    private folderRepository: FolderRepository,
    private userService: UserService,
    private configService: ConfigService,
    private folderService: FolderService,
    private programService: ProgramService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService,
    private configFactory: ConfigFactory,
    private folderFactory: FolderFactory,
    private programFactory: ProgramFactory,
  ) {
    super()
  }

  @Post()
  @SuccessResponse(201, "Created")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async createUser(@BodyProp() email: EmailType, @BodyProp('password') plainPassword: string): Promise<UserApiType> {
    this.setStatus(201)
    const user = await this.userService.create({email, plainPassword});
    return this.userService.getJson(user);
  }

  @Get('{uid}/settings')
  @Security('role', ['same-user'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async getUserSettings(@Request() req: express.Request, @Path('uid') _uid: UuidOrUsernameType): Promise<UserApiType> {
    if (!req.user) {
      throw new ApiException('Not authorized', 401);
    }

    return await this.userService.getJson(req.user);
  }

  @Put('{uid}/settings')
  @Security('role', ['same-user'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async updateUserSettings(@Request() req: express.Request, @Path('uid') _uid: UuidOrUsernameType, @Body() body: PartialType<UserApiType>): Promise<UserApiType> {
    if(!req.user) {
      throw new ApiException('Not authorized', 401);
    }

    const user = await this.userRepository.findOne(req.user.id);
    if (!user) {
      throw new ApiException('User not found', 404);
    }

    user.firstname = body.firstname ? body.firstname : null
    user.lastname = body.lastname ? body.lastname : null
    user.username = body.username ? user.username : null
    user.apiKey = body.apiKey ? body.apiKey : null
    user.facebookId = body.facebookId ? body.facebookId : null
    user.githubId = body.githubId ? body.githubId : null
    
    if(body.username && body.username !== req.user.username) {
      await this.userService.setUsername(user, body.username)
    }

    if(await this.userService.isValid(user)) {
      await this.userRepository.save(user)

      return await this.userService.getJson(user);
    }

    throw new ValidateError({}, 'User not valid')
  }

  @Get('{uid}/admin-config')
  @Security('role', ['same-user', 'admin'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async getAdminConfig(@Path('uid') _uid: UuidOrUsernameType): Promise<ConfigApiType> {
    const config = await this.configFactory.create(await this.configRepository.findOne());
    
    return await this.configService.getJson(config);
  }

  @Put('{uid}/admin-config')
  @Security('role', ['same-user', 'admin'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async updateAdminConfig(@Path('uid') _uid: UuidOrUsernameType): Promise<ConfigApiType> {
    const config = await this.configFactory.create(await this.configRepository.findOne());
  
    if(await this.configService.isValid(config)) {
      await this.configRepository.save(config)

      return await this.configService.getJson(config);
    }

    throw new ValidateError({}, 'Config not valid')
  }

  @Get('{uid}/folders')
  @Security('role')
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async getUserFolders(@Path('uid') uid: UuidOrUsernameType, @Query() page: PageType = 1, @Query() perPage: PerPageType = 10, @Query() path?: PathType): Promise<{data:FolderApiType[], total: number}> {
    const user = await this.userRepository.findOneByUidOrUsername(uid)
    if (!user) {
      throw new ApiException('User not found', 404);
    }

    let where: any = {user}
    if(path) {
      const parent = await this.folderService.fromPath(user, path as string)
      where = {...where, parent: parent ? parent : IsNull()}
    }
    const [folders, total] = await this.folderRepository.findAndCount({
      where,
      relations: ['parent', 'user'],
      skip: (page - 1) * perPage,
      take: perPage,
    })
    
    const data = []
    for (const folder of folders) {
      data.push(await this.folderService.getJson(folder))
    }

    return {data, total};
  }

  @Post('{uid}/folders')
  @Security('role', ['same-user'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async createUserFolder(@Request() req: express.Request, @Path('uid') _uid: UuidOrUsernameType, @Body() body: {name: NotEmptyStringType, slug?: SlugType, path?: PathType}): Promise<FolderApiType> {
    if(!req.user) {
      throw new ApiException('Not authorized', 401);
    }

    const folder = await this.folderFactory.create({
      name: body.name,
      parent: await this.folderService.fromPath(req.user, body.path || '/') || null,
      user: req.user,
    })
    await this.folderService.setSlug(folder, body.slug || body.name)

    if(await this.folderService.isValid(folder)) {
      await this.folderRepository.save(folder)

      return await this.folderService.getJson(folder);
    }

    throw new ValidateError({}, 'Folder not valid')
  }

  @Get('{uid}/programs')
  @Security('role')
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async getUserPrograms(@Request() req: express.Request, @Path('uid') uid: UuidOrUsernameType, @Query() page: PageType = 1, @Query() perPage: PerPageType = 10, @Query() path?: PathType): Promise<{data:ProgramApiType[], total:number}> {
    const user = await this.userRepository.findOneByUidOrUsername(uid)
    if (!user) {
      throw new ApiException('User not found', 404);
    }

    let where: any = {user}
    const isPublicOnly = !req.user || !(uid === req.user.uid || uid === req.user.username)
    if(isPublicOnly) {
      where = {...where, public: true}
    }
    if(path) {
      const folder = await this.folderService.fromPath(user, path as string)
      where = {...where, folder: folder ? folder : IsNull()}
    }
    const [programs, total] = await this.programRepository.findAndCount({
      where,
      relations: ['folder', 'user'],
      skip: (page - 1) * perPage,
      take: perPage,
    })
    
    const data = []
    for (const program of programs) {
      data.push(await this.programService.getJson(program))
    }

    return {data, total};
  }

  @Post('{uid}/programs')
  @Security('role', ['same-user'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(401, "Not authorized")
  public async createUserProgram(@Request() req: express.Request, @Path('uid') _uid: UuidOrUsernameType, @Body() body: {
    name: NotEmptyStringType
    slug?: SlugType
    path?: PathType
    clients?: NotEmptyStringType[]
    tags?: NotEmptyStringType[]
    description?: NotEmptyStringType | null
    public?: boolean
  }): Promise<ProgramApiType> {
    if(!req.user) {
      throw new ApiException('Not authorized', 401);
    }

    const program = await this.programFactory.create({
      name: body.name,
      user: req.user,
      folder: await this.folderService.fromPath(req.user, body.path || '/') || null,
      description: body.description ? body.description : null,
      public: body.public || false,
    })
    await this.folderService.setSlug(program, body.slug || body.name)
    program.clients = await this.programClientService.manageByProgramAndClientNames(program, body.clients || [])
    program.tags = await this.programTagService.manageByProgramAndTagNames(program, body.tags || [])

    if(await this.programService.isValid(program)) {
      await this.programRepository.save(program)
      await this.tagRepository.clear()

      return await this.programService.getJson(program);
    }

    throw new ValidateError({}, 'Program not valid')
  }
}

export { UserController }
