// from @uniflow-io/uniflow-api/src/model/api-type-interface

import { ApiKeyType, EmailType, UsernameType, UuidType, SlugType, NotEmptyStringType, PathType, UuidOrUsernameType } from "./type-interface"

export interface ClientApiType {
    uid: UuidType
    name: NotEmptyStringType
}

export interface ConfigApiType {
    uid: UuidType
}

export interface ContactApiType {
    uid: UuidType
    email: EmailType
    message: NotEmptyStringType
}

export interface FolderApiType {
    uid: UuidType
    name: NotEmptyStringType
    slug: SlugType
    path: PathType
    user: UuidOrUsernameType
    created: Date
    updated: Date
}

export interface LeadApiType {
    uid: UuidType
    email: EmailType
    githubUsername: NotEmptyStringType | null
    optinNewsletter: boolean
    optinBlog: boolean
    optinGithub: boolean
}

export interface ProgramApiType {
    uid: UuidType
    name: NotEmptyStringType
    slug: SlugType
    path: PathType
    clients: NotEmptyStringType[]
    tags: NotEmptyStringType[]
    description: NotEmptyStringType | null
    isPublic: boolean
    user: UuidOrUsernameType
    created: Date
    updated: Date
}

export interface TagApiType {
    uid: UuidType
    name: NotEmptyStringType
}

export enum ROLE {
    USER = 'USER',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface UserApiType {
    uid: UuidType
    username: UsernameType | null
    email: EmailType
    firstname: NotEmptyStringType | null
    lastname: NotEmptyStringType | null
    facebookId: NotEmptyStringType | null
    githubId: NotEmptyStringType | null
    apiKey: ApiKeyType | null
    roles: ROLE[]
    links: {
        lead?: string
    }
}
