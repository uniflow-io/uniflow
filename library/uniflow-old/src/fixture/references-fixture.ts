import { Service } from "typedi";
import { ObjectLiteral } from "typeorm";

@Service()
export default class ReferencesFixtures {
    private refs: Map<string, ObjectLiteral>

    constructor(
    ) {
        this.refs = new Map<string, ObjectLiteral>()
    }
    
    get(key: string): ObjectLiteral | undefined {
        return this.refs.get(key);
    }

    set(key: string, entity: ObjectLiteral): ObjectLiteral {
        this.refs.set(key, entity);
        return entity;
    }
}