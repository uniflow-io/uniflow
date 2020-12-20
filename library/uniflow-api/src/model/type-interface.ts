// https://tsoa-community.github.io/docs/upgrading.html#new-features
export type PartialType<T> = {
  [P in keyof T]?: T[P];
};

/**
 * @isInt
 * @minimum 1
 */
export type PageType = number

/**
 * @isInt
 * @minimum 1
 * @maximum 100
 */
export type PerPageType = number

/**
 * @format email
 * @pattern `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`
 */
export type EmailType = string;

/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @format uuid
 * @pattern `^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$`
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UuidType = string;

/**
 * @pattern `^[0-9a-z-]+$`
 */
export type UsernameType = string;

/**
 * @pattern `^[a-z0-9-]+$`
 * @example "slug-1"
 */
export type SlugType = string;

/**
 * @pattern `^\/|(\/[a-z0-9-]+)+$`
 * @example "/folder-1/folder-2"
 */
export type PathType = string;

/**
 * @pattern `^[0-9a-z]{32}$`
 */
export type ApiKeyType = string

/**
 * @minLength 1
 */
export type NotEmptyStringType = string

export type UuidOrUsernameType = UuidType|UsernameType
export type EmailOrUsernameType = EmailType|UsernameType