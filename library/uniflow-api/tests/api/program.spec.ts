import 'mocha'
import { expect, assert } from 'chai';
import { testApp } from '../utils'
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('auth', () => {
    const app: App = Container.get(App)

    beforeAll(async () => {
        await app.start()
    });

    afterAll(async () => {
        await app.close()
    });

    it('GET /api/programs success', (done) => {
        testApp(app)
            .get('/api/programs')
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;

                    assert.isArray(data)

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });
})