import App from "../src/app";
import * as supertest from 'supertest';

describe('front', () => {
    let app: App = new App();

    beforeAll(async () => {
        await app.start()
    });

    afterAll(async () => {
        await app.close()
    });

    it('GET /', (done) => {
        supertest(app.app())
            .get('/')
            .send()
            .expect(200, done);
    });
})