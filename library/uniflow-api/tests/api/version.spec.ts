import 'mocha'
import { expect, assert } from 'chai';
import { testApp, isVersion } from '../utils';
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

    it('GET /api/version success', (done) => {
        testApp(app)
            .get('/api/version')
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('version')

                    assert.isTrue(isVersion(data.version))

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });
})