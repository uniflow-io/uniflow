// from @uniflow-io/uniflow-api/src/model/api-type-interfaces

import {
  ApiKeyType,
  EmailType,
  UsernameType,
  UuidType,
  SlugType,
  NotEmptyStringType,
  PathType,
  UuidOrUsernameType,
  DateType,
} from './type-interfaces';

export interface ClientApiType {
  uid: UuidType;
  name: NotEmptyStringType;
}

export interface ConfigApiType {
  uid: UuidType;
}

export interface ContactApiType {
  uid: UuidType;
  email: EmailType;
  message: NotEmptyStringType;
}

export interface FolderApiType {
  uid: UuidType;
  name: NotEmptyStringType;
  slug: SlugType;
  path: PathType;
  user: UuidOrUsernameType;
  created: DateType;
  updated: DateType;
}

export interface LeadApiType {
  uid: UuidType;
  email: EmailType;
  githubUsername: NotEmptyStringType | null;
  optinNewsletter: boolean;
  optinBlog: boolean;
  optinGithub: boolean;
}

export interface ProgramApiType {
  uid: UuidType;
  name: NotEmptyStringType;
  slug: SlugType;
  path: PathType;
  clients: NotEmptyStringType[];
  tags: NotEmptyStringType[];
  description: NotEmptyStringType | null;
  isPublic: boolean;
  user: UuidOrUsernameType;
  created: DateType;
  updated: DateType;
}

export interface TagApiType {
  uid: UuidType;
  name: NotEmptyStringType;
}

export enum ROLE {
  USER = 'ROLE_USER',
  SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
}

export interface UserApiType {
  uid: UuidType;
  username: UsernameType | null;
  email: EmailType;
  firstname: NotEmptyStringType | null;
  lastname: NotEmptyStringType | null;
  facebookId: NotEmptyStringType | null;
  githubId: NotEmptyStringType | null;
  apiKey: ApiKeyType | null;
  roles: ROLE[];
  links: {
    lead?: string;
  };
}
