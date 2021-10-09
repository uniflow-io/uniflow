import { Container as DIContainer, Token, Constructable } from 'typedi';

export default class Container {
  constructor(protected init: boolean = false) {}

  get<T>(id: Constructable<T>): T;
  get<T>(id: string): T;
  get<T>(id: Token<T>): T;
  get<T>(id: any): T {
    if (!this.init) {
      const env = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';
      DIContainer.set('env', env);

      this.init = true;
    }

    return DIContainer.get(id);
  }
}
