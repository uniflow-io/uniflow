import { Service } from 'typedi';
import { FactoryInterface } from './interfaces';

@Service()
export default abstract class AbstractFactory<Entity> implements FactoryInterface<Entity> {
    public create(entity?: Entity|Object): Entity {
        return (entity ?? {}) as Entity
    }
}