import { beforeAll, afterAll } from '@jest/globals'
import { default as Container } from "../src/container"
import { default as App } from "../src/app";

const app: App = Container.get(App)

beforeAll(async () => {
    await app.start()
});
  
afterAll(async () => {
    await app.stop()
});