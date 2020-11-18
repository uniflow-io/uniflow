import type { Global } from '@jest/types'
import { default as Container } from "../src/container"
import { default as App } from "../src/app";

declare const beforeAll: Global.GlobalAdditions['beforeAll'];
declare const afterAll: Global.GlobalAdditions['afterAll'];

const app: App = Container.get(App)

beforeAll(async () => {
    await app.start()
});
  
afterAll(async () => {
    await app.close()
});