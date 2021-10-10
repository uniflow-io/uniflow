import { ClientEntity, ConfigEntity, ContactEntity, FolderEntity, LeadEntity, ProgramClientEntity, ProgramEntity, ProgramTagEntity, TagEntity, UserEntity } from "../entity";

export interface FactoryInterface<Entity> {
  create(entity?: Entity|Object): Promise<Entity>;
}

export interface ClientFactoryInterface extends FactoryInterface<ClientEntity> {}
export interface ConfigFactoryInterface extends FactoryInterface<ConfigEntity> {}
export interface ContactFactoryInterface extends FactoryInterface<ContactEntity> {}
export interface FolderFactoryInterface extends FactoryInterface<FolderEntity> {}
export interface LeadFactoryInterface extends FactoryInterface<LeadEntity> {}
export interface ProgramClientFactoryInterface extends FactoryInterface<ProgramClientEntity> {}
export interface ProgramFactoryInterface extends FactoryInterface<ProgramEntity> {}
export interface ProgramTagFactoryInterface extends FactoryInterface<ProgramTagEntity> {}
export interface TagFactoryInterface extends FactoryInterface<TagEntity> {}
export interface UserFactoryInterface extends FactoryInterface<UserEntity> {}
