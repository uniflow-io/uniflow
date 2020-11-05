import 'mocha'
import { expect, assert } from 'chai';
import { testApp, isUid } from '../utils'
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

    it('POST /api/register success', (done) => {
        testApp(app)
            .post('/api/register')
            .send({
                email: 'user_register@uniflow.io',
                password: 'user_register'
            })
            .expect(201)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('token', 'uid')

                    assert.isTrue(isUid(data.uid))

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });

    it('POST /api/register already exist', (done) => {
        testApp(app)
            .post('/api/register')
            .send({
                email: 'user@uniflow.io',
                password: '1234'
            })
            .expect(401, done)
    });

    it('POST /api/login success', (done) => {
        testApp(app)
            .post('/api/login')
            .send({
                username: 'user@uniflow.io',
                password: 'user_password'
            })
            .expect(201)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('token', 'uid')

                    assert.isTrue(isUid(data.uid))

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });

    it('POST /api/login bad credentials', (done) => {
        testApp(app)
            .post('/api/login')
            .send({
                username: 'user@uniflow.io',
                password: 'badpassword'
            })
            .expect(401, done)
    });

    it('POST /api/login-facebook success', (done) => {
        testApp(app)
            .post('/api/login-facebook')
            .send({
                access_token: 'valid-facebook-token',
            })
            .expect(201)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('token', 'uid')

                    assert.isTrue(isUid(data.uid))

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });

    it('POST /api/login-facebook bad credentials', (done) => {
        testApp(app)
            .post('/api/login-facebook')
            .send({
                access_token: 'invalid-facebook-token',
            })
            .expect(401, done)
    });

    it('POST /api/login-github success', (done) => {
        testApp(app)
            .post('/api/login-github')
            .send({
                code: 'valid-github-code',
            })
            .expect(201)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('token', 'uid')

                    assert.isTrue(isUid(data.uid))

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });

    it('POST /api/login-github bad credentials', (done) => {
        testApp(app)
            .post('/api/login-github')
            .send({
                code: 'invalid-github-code',
            })
            .expect(401, done)
    });
})