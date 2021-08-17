import * as express from "express";
import { Service} from "typedi";
import { Controller, Get, Response, SuccessResponse, Route, Tags, Security, Put, Request, Path, Body, ValidateError, Delete, Query } from "tsoa";
import { ProgramService, ProgramClientService, ProgramTagService, FolderService } from "../service";
import { ApiException } from "../exception";
import { ProgramRepository, TagRepository } from '../repository';
import { PageNumberType, PaginationType, PartialType, PerPageType, ProgramApiType, UuidType } from "../model/interfaces";
import { ErrorJSON, ValidateErrorJSON } from "./interfaces";

@Route('programs')
@Tags("program")
@Service()
class ProgramController extends Controller {
  constructor(
    private tagRepository: TagRepository,
    private programRepository: ProgramRepository,
    private folderService: FolderService,
    private programService: ProgramService,
    private programClientService: ProgramClientService,
    private programTagService: ProgramTagService
  ) {
    super()
  }

  @Get()
  public async getPrograms(@Query() page: PageNumberType = 1, @Query() perPage: PerPageType = 10): Promise<PaginationType<ProgramApiType>> {
    const data = []
    const [programs, total] = await this.programRepository.findAndCount({
      where: { public: true },
      relations: ['folder', 'user'],
      order: { updated: "DESC" },
      skip: (page - 1) * perPage,
      take: perPage
    })
    for (const program of programs) {
      data.push(await this.programService.getJson(program))
    }

    return {data,total};
  }

  @Put('{uid}')
  @Security('role', ['user'])
  @SuccessResponse(201, "Updated")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  @Response<ErrorJSON>(401, "Not authorized")
  public async updateProgram(@Request() req: express.Request, @Path() uid: UuidType, @Body() body: PartialType<ProgramApiType>): Promise<ProgramApiType> {
    if (!req.user) {
      throw new ApiException('Not authorized', 401);
    }

    const program = await this.programRepository.findOne({
      where: {user: req.user, uid},
      relations: ['user', 'folder'],
    })
    if (!program) {
      throw new ApiException('Program not found', 404);
    }
    
    if(body.name) {
      program.name = body.name
    }
    program.user = req.user
    if(body.path) {
      program.folder = await this.folderService.fromPath(req.user, body.path) || null
      await this.folderService.setSlug(program, program.slug) // in case of slug conflict when moving program
    }
    if (body.slug && program.slug !== body.slug) {
      await this.folderService.setSlug(program, body.slug)
    }
    if(body.clients) {
      program.clients = await this.programClientService.manageByProgramAndClientNames(program, body.clients)
    }
    if(body.tags) {
      program.tags = await this.programTagService.manageByProgramAndTagNames(program, body.tags)
    }
    if(body.description) {
      program.description = body.description
    }
    if(body.public || body.public === false) {
      program.public = body.public
    }

    if(await this.programService.isValid(program)) {
      await this.programRepository.save(program)
      await this.tagRepository.clear()

      return await this.programService.getJson(program);
    }

    throw new ValidateError({}, 'Program not valid')
  }

  @Delete('{uid}')
  @Security('role', ['user'])
  @SuccessResponse(200, "Deleted")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  @Response<ErrorJSON>(401, "Not authorized")
  public async deleteProgram(@Request() req: express.Request, @Path() uid: UuidType): Promise<boolean> {
    const program = await this.programRepository.findOne({user: req.user, uid})
    if (!program) {
      throw new ApiException('Program not found', 404);
    }

    await this.programRepository.safeRemove(program)

    return true;
  }

  @Get('{uid}/flows')
  @Security('role')
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  @Response<ErrorJSON>(401, "Not authorized")
  public async getProgramFlows(@Request() req: express.Request, @Path() uid: UuidType): Promise<{data: string|null}> {
    const program = await this.programRepository.findOne({
      where: {uid},
      relations: ['user']
    })
    if (!program) {
      throw new ApiException('Program not found', 404);
    }
    
    if(!program.public) {
      if(!req.user || program.user.id !== req.user.id) {
        throw new ApiException('Not authorized', 401);
      }
    }

    return {data: program.data};
  }

  @Put('{uid}/flows')
  @Security('role', ['user'])
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  @Response<ErrorJSON>(401, "Not authorized")
  public async updateProgramFlows(@Request() req: express.Request, @Path() uid: UuidType, @Body() body: {data: string|null}): Promise<boolean> {
    const program = await this.programRepository.findOne({user: req.user, uid})
    if (!program) {
      throw new ApiException('Program not found', 404);
    }

    program.data = body.data

    if(await this.programService.isValid(program)) {
      await this.programRepository.save(program)

      return true;
    }

    throw new ValidateError({}, 'Program not valid')
  }
};

export { ProgramController }
