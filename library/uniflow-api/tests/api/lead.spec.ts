import 'mocha'
import { expect } from 'chai';
import { testApp } from '../utils';
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('auth', () => {
    const app: App = Container.get(App)

    it('POST /api/leads success', (done) => {
        testApp(app)
            .post('/api/leads')
            .send({
                email: 'test@gmail.com',
            })
            .expect(201)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('email')

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });
})