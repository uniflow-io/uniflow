import App from "../../src/app";
import * as supertest from 'supertest';
import { expect, assert } from 'chai';
import { isUid } from '../utils'

describe('auth', () => {
    let app: App = new App();

    beforeAll(async () => {
        await app.start()
    });

    afterAll(async () => {
        await app.close()
    });

    it('POST /api/register success', (done) => {
        supertest(app.app())
            .post('/api/register')
            .send({
                email: 'test.register@gmail.com',
                password: '1234'
            })
            .expect(200)
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
        supertest(app.app())
            .post('/api/register')
            .send({
                email: 'test@gmail.com',
                password: '1234'
            })
            .expect(401, done)
    });

    it('POST /api/login success', (done) => {
        supertest(app.app())
            .post('/api/login')
            .send({
                username: 'test@gmail.com',
                password: 'test'
            })
            .expect(200)
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
        supertest(app.app())
            .post('/api/login')
            .send({
                username: 'test@gmail.com',
                password: 'badpassword'
            })
            .expect(401, done)
    });
})