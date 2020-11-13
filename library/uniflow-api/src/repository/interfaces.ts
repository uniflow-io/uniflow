import { FindConditions, FindOneOptions, ObjectID, RemoveOptions, Repository } from "typeorm";

export interface RepositoryInterface<Entity> {
  getRepository<Entity>(): Repository<Entity>;
  save(entity: Entity): Promise<Entity>;
  remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
  remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
  findOne(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
}
