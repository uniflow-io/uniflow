import 'mocha'
import { assert } from 'chai';
import { testApp } from '../utils';
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

    it('POST /api/contacts success', (done) => {
        testApp(app)
            .post('/api/contacts')
            .send({
                email: 'test@gmail.com',
                message: 'test message'
            })
            .expect(201)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;

                    assert.isTrue(data)

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });
})