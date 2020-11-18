import 'mocha'
import { testApp } from './utils';
import { default as Container } from "../src/container"
import { default as App } from "../src/app";

describe('front', () => {
    const app: App = Container.get(App)

    it('GET /', (done) => {
        testApp(app)
            .get('/')
            .send()
            .expect(200, done);
    });
})