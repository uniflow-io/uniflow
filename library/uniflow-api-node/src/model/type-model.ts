import slugify from 'slugify'

const checkUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const checkUsername = /^[0-9a-z-]+$/
const checkPath = /^\/|(\/[a-z0-9-]+)+$/
const checkApiKey = /^[0-9a-z]{32}$/
const checkEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

export default class TypeModel {
    public static isUuid(value: any): boolean {
        return checkUUID.test(value)
    }
    
    public static isUsername(value: any): boolean {
        return checkUsername.test(value)
    }

    public static isPath(value: any): boolean {
        return checkPath.test(value)
    }

    public static isApiKey(value: any): boolean {
        return checkApiKey.test(value)
    }

    public static isEmail(value: any): boolean {
        return checkEmail.test(value)
    }

    public static generateSlug(value: string): string {
        return slugify(value, {
            replacement: '-',
            lower: true,
            strict: true,
        })
    }
}
