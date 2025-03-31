import { Service } from 'typedi';
import { FactoryInterface } from './interfaces';

@Service()
export default abstract class AbstractFactory<Entity> implements FactoryInterface<Entity> {
    public async create(entity?: Entity|Object): Promise<Entity> {
        return (entity ?? {}) as Entity
    }
}