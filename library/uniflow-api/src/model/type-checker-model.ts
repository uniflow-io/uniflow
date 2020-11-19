import { UserEntity } from "../entity";
import { Joi } from 'celebrate';
import { CustomHelpers, ErrorReport } from "joi";

const checkUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const checkUsername = /^[0-9a-z-]+$/
const checkPath = /^\/|(\/[a-z0-9-]+)+$/
const checkSlug = /^[0-9a-z-]+$/
const checkApiKey = /^[0-9a-z]{32}$/
const checkEmail = Joi.string().email().required()

export default class TypeCheckerModel {
    public static isUuid(value: any): boolean {
        return checkUUID.test(value)
    }
    
    public static isUsername(value: any): boolean {
        return checkUsername.test(value)
    }

    public static isPath(value: any): boolean {
        return checkPath.test(value)
    }

    public static isSlug(value: any): boolean {
        return checkSlug.test(value)
    }

    public static isApiKey(value: any): boolean {
        return checkApiKey.test(value)
    }

    public static isSameUser(value: any, user: UserEntity): boolean {
        if(TypeCheckerModel.isUuid(value) && value === user.uid) {
            return true
        } else if (user.username && value === user.username) {
            return true
        }

        return false
    }
    
    public static joiUuid<V = any>(value: V, helpers: CustomHelpers): V | ErrorReport {
        if(TypeCheckerModel.isUuid(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }

    public static joiUsername<V = any>(value: any, helpers: CustomHelpers): V | ErrorReport {
        if(TypeCheckerModel.isUsername(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }
    
    public static joiUuidOrUsername<V = any>(value: any, helpers: CustomHelpers): V | ErrorReport {
        if(TypeCheckerModel.isUuid(value) || TypeCheckerModel.isUsername(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }
    
    public static joiEmailOrUsername<V = any>(value: any, helpers: CustomHelpers): V | ErrorReport {
        const { error } =  Joi.string().email().validate(value)
        if(error === undefined || TypeCheckerModel.isUsername(value)) {
            return value
        }

        return helpers.error('any.invalid')
    }

    public static joiPath<V = any>(value: any, helpers: CustomHelpers): V | ErrorReport {
        if(TypeCheckerModel.isPath(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }

    public static joiSlug<V = any>(value: any, helpers: CustomHelpers): V | ErrorReport {
        if(TypeCheckerModel.isSlug(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }

    public static joiApiKey<V = any>(value: any, helpers: CustomHelpers): V | ErrorReport {
        if(TypeCheckerModel.isApiKey(value)) {
            return value
        }
        
        return helpers.error('any.invalid')
    }
}
