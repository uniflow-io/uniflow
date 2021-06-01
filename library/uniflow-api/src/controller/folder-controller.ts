import * as express from "express";
import { Service } from "typedi";
import { Controller, Response, SuccessResponse, Route, Tags, Put, Security, Path, Delete, Request, Body, ValidateError } from "tsoa";
import { FolderService } from "../service";
import { ApiException } from "../exception";
import { FolderRepository } from '../repository';
import { FolderApiType, PartialType, UuidType } from "../model/interfaces";
import { ErrorJSON, ValidateErrorJSON } from "./interfaces";

@Route('folders')
@Tags("folder")
@Service()
class FolderController extends Controller {
  constructor(
    private folderRepository: FolderRepository,
    private folderService: FolderService
  ) {
    super()
  }

  @Put('{uid}')
  @Security('role', ['user'])
  @SuccessResponse(201, "Updated")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  @Response<ErrorJSON>(401, "Not authorized")
  public async updateFolder(@Request() req: express.Request, @Path() uid: UuidType, @Body() body: PartialType<FolderApiType>): Promise<FolderApiType> {
    const folder = await this.folderRepository.findOne({
      where: {user: req.user, uid},
      relations: ['user', 'parent']
    })
    if (!folder) {
      throw new ApiException('Folder not found', 404);
    }
    
    if(body.name) {
      folder.name = body.name
    }
    if(body.path) {
      const parentFolder = await this.folderService.fromPath(req.user, body.path) || null
      if(parentFolder && await this.folderRepository.isCircular(folder, parentFolder)) {
        throw new ValidateError({'body.path': {
          message: 'path provided is not accepted'
        }}, 'Validation failed')
      }
      folder.parent = parentFolder
      await this.folderService.setSlug(folder, folder.slug) // in case of slug conflict when moving folder
    }
    folder.user = req.user
    if (body.slug && folder.slug !== body.slug) {
      await this.folderService.setSlug(folder, body.slug)
    }

    if(await this.folderService.isValid(folder)) {
      await this.folderRepository.save(folder)
      
      return await this.folderService.getJson(folder);
    }

    throw new ValidateError({}, 'Folder not valid')
  }

  @Delete('{uid}')
  @Security('role', ['user'])
  @SuccessResponse(200, "Deleted")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  @Response<ErrorJSON>(404, "Not found")
  @Response<ErrorJSON>(401, "Not authorized")
  public async deleteFolder(@Request() req: express.Request, @Path() uid: UuidType): Promise<boolean> {
    const folder = await this.folderRepository.findOne({user: req.user, uid})
    if (!folder) {
      throw new ApiException('Folder not found', 404);
    }

    await this.folderRepository.safeRemove(folder)

    return true;
  }
}

export { FolderController }
