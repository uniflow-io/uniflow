import * as faker from 'faker'
import { Service } from 'typedi';
import { ClientEntity, FolderEntity, LeadEntity, ProgramEntity, TagEntity, UserEntity } from '../entity';
import { TypeModel } from '../model';
import { ClientFactory, ConfigFactory, ContactFactory, FolderFactory, LeadFactory, ProgramClientFactory, ProgramFactory, ProgramTagFactory, TagFactory, UserFactory } from './entity-factory';

@Service()
export class FakeClientFactory extends ClientFactory {
    public async create(entity?: ClientEntity|Object): Promise<ClientEntity> {
        const client = await super.create(entity)
        client.name = client.name ?? faker.fake('Client {{random.word}}')

        return client;
    }
}


@Service()
export class FakeConfigFactory extends ConfigFactory {
}

@Service()
export class FakeContactFactory extends ContactFactory {
}

@Service()
export class FakeFolderFactory extends FolderFactory {
    public async create(entity?: FolderEntity|Object): Promise<FolderEntity> {
        const folder = await super.create(entity)
        folder.name = folder.name ?? faker.fake('Folder {{random.word}}')
        folder.slug = folder.slug ?? TypeModel.generateSlug(folder.name)

        return folder;
    }
}

@Service()
export class FakeLeadFactory extends LeadFactory {
    public async create(entity?: LeadEntity|Object): Promise<LeadEntity> {
        const lead = await super.create(entity)
        lead.email = lead.email ?? faker.internet.email()
        lead.optinNewsletter = lead.optinNewsletter ?? faker.datatype.boolean()
        lead.optinBlog = lead.optinBlog ?? faker.datatype.boolean()

        return lead;
    }
}

@Service()
export class FakeProgramClientFactory extends ProgramClientFactory {
}

@Service()
export class FakeProgramFactory extends ProgramFactory {
    public async create(entity?: ProgramEntity|Object): Promise<ProgramEntity> {
        const program = await super.create(entity)
        program.name = program.name ?? faker.random.word()
        program.description = program.description ?? faker.random.word()

        return program;
    }
}

@Service()
export class FakeProgramTagFactory extends ProgramTagFactory {
}

@Service()
export class FakeTagFactory extends TagFactory {
    public async create(entity?: TagEntity|Object): Promise<TagEntity> {
        const tag = await super.create(entity)
        tag.name = tag.name ?? faker.fake('Tag {{random.word}}')

        return tag;
    }
}

@Service()
export class FakeUserFactory extends UserFactory {
    public async create(entity?: UserEntity|Object): Promise<UserEntity> {
        const user = await super.create(entity)
        user.firstname = user.firstname ?? faker.name.firstName()
        user.lastname = user.lastname ?? faker.name.lastName()
        user.email = user.email ?? faker.internet.email()

        return user;
    }
}