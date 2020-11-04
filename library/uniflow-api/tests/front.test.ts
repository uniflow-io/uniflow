import App from "../src/app";
import * as supertest from 'supertest';
import Container from "typedi";

describe('front', () => {
    Container.set('env', process.env.NODE_ENV || 'test')
    const app: App = Container.get(App)

    beforeAll(async () => {
        await app.start()
    });

    afterAll(async () => {
        await app.close()
    });

    it('GET /', (done) => {
        supertest(app.getApp())
            .get('/')
            .send()
            .expect(200, done);
    });
})