import { Service } from "typedi";
import { Controller, Response, SuccessResponse, Post, Route, Tags, Body, ValidateError } from "tsoa";
import { ContactService } from "../service";
import { ContactRepository } from '../repository';
import { ContactFactory } from '../factory';
import { ContactApiType } from "../model/interfaces";
import { ValidateErrorJSON } from "./interfaces";

@Route('contacts')
@Tags("contact")
@Service()
class ContactController extends Controller {
  constructor(
    private contactRepository: ContactRepository,
    private contactService: ContactService,
    private contactFactory: ContactFactory
  ) {
    super()
  }

  @Post()
  @SuccessResponse(201, "Created")
  @Response<ValidateErrorJSON>(422, "Validation failed")
  public async createContact(@Body() body: Pick<ContactApiType, 'email'|'message'>): Promise<boolean> {
    const contact = await this.contactFactory.create(body)
    
    if(await this.contactService.isValid(contact)) {
      await this.contactRepository.save(contact)
      await this.contactService.send(contact)
      
      this.setStatus(201)
      return true;
    }

    throw new ValidateError({}, 'Contact not valid')
  }
}

export { ContactController }