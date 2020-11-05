import 'mocha'
import { expect, assert } from 'chai';
import { loginApp, testApp } from '../utils';
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

    it('GET /api/users/:uid/settings success', async (done) => {
        const { token, uid } = await loginApp(app, 'user@uniflow.io')
        
        testApp(app)
            .get(`/api/users/${uid}/settings`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('apiKey', 'facebookId', 'firstname', 'githubId', 'lastname', 'roles', 'uid', 'username')

                    assert.isArray(data.roles)

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });

    it('GET /api/users/:uid/settings not authorised :uid', async (done) => {
        const badUid = '81f012db-7f94-4e69-9390-05610959cf7a'
        const { token } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .get(`/api/users/${badUid}/settings`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .expect(401, done)
    })

    it('PUT /api/users/:uid/settings success', async (done) => {
        const { token, uid } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .put(`/api/users/${uid}/settings`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .send({})
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;
                    expect(data).to.have.all.keys('apiKey', 'facebookId', 'firstname', 'githubId', 'lastname', 'roles', 'uid', 'username')

                    assert.isArray(data.roles)

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    })

    it('PUT /api/users/:uid/settings not authorised :uid', async (done) => {
        const badUid = '81f012db-7f94-4e69-9390-05610959cf7a'
        const { token } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .put(`/api/users/${badUid}/settings`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .send({})
            .expect(401, done)
    })

    it('GET /api/users/:uid/admin-config success', async (done) => {
        const { token, uid } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .get(`/api/users/${uid}/admin-config`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;

                    assert.isObject(data)

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    });

    it('GET /api/users/:uid/admin-config not authorised :uid', async (done) => {
        const badUid = '81f012db-7f94-4e69-9390-05610959cf7a'
        const { token } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .get(`/api/users/${badUid}/admin-config`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .expect(401, done)
    })

    it('GET /api/users/:uid/admin-config not authorised rigths', async (done) => {
        const { token, uid } = await loginApp(app, 'user@uniflow.io')
        
        testApp(app)
            .get(`/api/users/${uid}/admin-config`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .expect(401, done)
    })

    it('PUT /api/users/:uid/admin-config success', async (done) => {
        const { token, uid } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .put(`/api/users/${uid}/admin-config`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .send({})
            .expect(200)
            .end((err, res) => {
                try {
                    if (err) throw err;

                    const data = res.body;

                    assert.isObject(data)

                    return done();
                } catch (err) {
                    return done(err);
                }
            })
    })

    it('PUT /api/users/:uid/admin-config not authorised :uid', async (done) => {
        const badUid = '81f012db-7f94-4e69-9390-05610959cf7a'
        const { token } = await loginApp(app, 'admin@uniflow.io')
        
        testApp(app)
            .put(`/api/users/${badUid}/admin-config`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .send({})
            .expect(401, done)
    })

    it('PUT /api/users/:uid/admin-config not authorised rigths', async (done) => {
        const { token, uid } = await loginApp(app, 'user@uniflow.io')
        
        testApp(app)
            .put(`/api/users/${uid}/admin-config`)
            .set({'Uniflow-Authorization': `Bearer ${token}`})
            .send({})
            .expect(401, done)
    })
})