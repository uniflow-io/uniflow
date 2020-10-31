import App from "../../src/app";
import * as supertest from 'supertest';
import { expect } from 'chai';

describe('auth', () => {
    let app: App = new App();

    beforeAll(async () => {
        await app.start()
    });

    afterAll(async () => {
        await app.close()
    });

    it('POST /api/register', (done) => {
        supertest(app.app())
            .post('/api/register')
            .send({
                email: 'test@gmail.com',
                password: '1234'
            })
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const { data } = res.body;
                    expect(data).to.have.all.keys('token', 'uid')

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });
})