import { FindConditions, FindManyOptions, FindOneOptions, ObjectID, RemoveOptions, Repository } from "typeorm";

export interface RepositoryInterface<Entity> {
  getRepository<Entity>(): Repository<Entity>;
  save(entity: Entity): Promise<Entity>;
  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
  count(options?: FindManyOptions<Entity>): Promise<number>;
  count(conditions?: FindConditions<Entity>): Promise<number>;
  find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  find(conditions?: FindConditions<Entity>): Promise<Entity[]>;
  findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
  findAndCount(conditions?: FindConditions<Entity>): Promise<[Entity[], number]>;
  findOne(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
}
