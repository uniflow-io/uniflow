import { helpers } from "faker";
import { UserEntity } from "../entity";

const checkUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const checkUsername = /^[0-9a-z-]+$/i;
const checkPath = /^\/|(\/[a-z0-9-]+)+$/i;
const checkSlug = /^[0-9a-z-]+$/i;

export default class TypeChecker {
    public static isUuid(value: string): boolean {
        return checkUUID.test(value)
    }
    
    public static isUsername(value: string): boolean {
        return checkUsername.test(value)
    }

    public static isPath(value: string): boolean {
        return checkPath.test(value)
    }

    public static isSlug(value: string): boolean {
        return checkSlug.test(value)
    }

    public static isSameUser(value: string, user: UserEntity): boolean {
        if(TypeChecker.isUuid(value) && value === user.uid) {
            return true
        } else if (user.username && value === user.username) {
            return true
        }

        return false
    }
    
    public static joiUuid(value: any, helpers: any) {
        if(TypeChecker.isUuid(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }

    public static joiUsername(value: any, helpers: any) {
        if(TypeChecker.isUsername(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }
    
    public static joiUuidOrUsername(value: any, helpers: any) {
        if(TypeChecker.isUuid(value) || TypeChecker.isUsername(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }

    public static joiPath(value: any, helpers: any) {
        if(TypeChecker.isPath(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }

    public static joiSlug(value: any, helpers: any) {
        if(TypeChecker.isSlug(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }
}
