import { Service } from 'typedi';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import AbstractFactory from './abstract-factory';
import { ClientFactoryInterface, ConfigFactoryInterface, ContactFactoryInterface, FolderFactoryInterface, LeadFactoryInterface, ProgramClientFactoryInterface, ProgramFactoryInterface, ProgramTagFactoryInterface, TagFactoryInterface, UserFactoryInterface } from './interfaces';
import { ClientEntity, ConfigEntity, ContactEntity, FolderEntity, LeadEntity, ProgramClientEntity, ProgramEntity, ProgramTagEntity, TagEntity, UserEntity } from '../entity';
import { ROLE } from '../model/api-type-interface';

@Service()
export class ClientFactory extends AbstractFactory<ClientEntity> implements ClientFactoryInterface {
}

@Service()
export class ConfigFactory extends AbstractFactory<ConfigEntity> implements ConfigFactoryInterface {
}

@Service()
export class ContactFactory extends AbstractFactory<ContactEntity> implements ContactFactoryInterface {
}

@Service()
export class FolderFactory extends AbstractFactory<FolderEntity> implements FolderFactoryInterface {
    public async create(entity?: FolderEntity|Object): Promise<FolderEntity> {
        const folder = await super.create(entity)
        folder.parent = folder.parent ?? null

        return folder;
    }
}

@Service()
export class LeadFactory extends AbstractFactory<LeadEntity> implements LeadFactoryInterface {
}

@Service()
export class ProgramClientFactory extends AbstractFactory<ProgramClientEntity> implements ProgramClientFactoryInterface {
}

@Service()
export class ProgramFactory extends AbstractFactory<ProgramEntity> implements ProgramFactoryInterface {
    public async create(entity?: ProgramEntity|Object): Promise<ProgramEntity> {
        const program = await super.create(entity)
        program.folder = program.folder ?? null

        return program;
    }
}

@Service()
export class ProgramTagFactory extends AbstractFactory<ProgramTagEntity> implements ProgramTagFactoryInterface {
}

@Service()
export class TagFactory extends AbstractFactory<TagEntity> implements TagFactoryInterface {
}

@Service()
export class UserFactory extends AbstractFactory<UserEntity> implements UserFactoryInterface {
    public async create(entity?: UserEntity|Object): Promise<UserEntity> {
        const user = await super.create(entity)
        user.role = user.role ?? ROLE.USER

        if(user.plainPassword === null) {
            const salt = randomBytes(32);
            user.password = null
            user.salt = salt.toString('hex')
        } else if(user.plainPassword !== undefined) {
            const salt = randomBytes(32);
            user.password = await argon2.hash(user.plainPassword, { salt })
            user.salt = salt.toString('hex')
        } else if(user.salt === undefined || user.password === undefined) {
            const salt = randomBytes(32);
            user.password = null
            user.salt = salt.toString('hex')
        }

        return user;
    }
}