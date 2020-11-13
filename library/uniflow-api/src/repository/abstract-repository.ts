import { Service } from 'typedi';
import { FindConditions, FindOneOptions, ObjectID, RemoveOptions, Repository } from 'typeorm';
import { RepositoryInterface } from './interfaces';

@Service()
export default abstract class AbstractRepository<Entity> implements RepositoryInterface<Entity> {
  abstract getRepository<Entity>(): Repository<Entity>;

  public async save(entity: Entity): Promise<Entity> {
    return await this.getRepository<Entity>().save(entity);
  }

  public async remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
  public async remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
  public async remove(entityOrEntities: any, options?: RemoveOptions): Promise<Entity | Entity[]> {
    return await this.getRepository<Entity>().remove(entityOrEntities, options);
  }

  public async findOne(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  public async findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  public async findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  public async findOne(optionsOrConditions?: any, maybeOptions?: FindOneOptions<Entity>): Promise<Entity | undefined> {
    return await this.getRepository<Entity>().findOne(optionsOrConditions, maybeOptions);
  }
}
