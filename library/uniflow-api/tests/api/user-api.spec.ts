import { describe, test } from '@jest/globals'
import { expect, assert } from 'chai';
import * as faker from 'faker'
import { expectCreatedUri, expectNotAuthorisedUri, expectOkUri, expectUid, expectUnprocessableEntityUri } from '../utils';
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-user', () => {
    const app: App = new Container().get(App)

    test.each([{
        email: faker.internet.email(),
        password: faker.random.words(),
    }])('POST /api/users success', async (data) => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/users',
            data
        })
        expect(body).to.have.all.keys('apiKey', 'facebookId', 'firstname', 'githubId', 'lastname', 'roles', 'uid', 'username', 'email', 'links')
        expectUid(body.uid)
    });

    test.each([faker.random.words()])('POST /api/users already exist', async (password: string) => {
        await expectNotAuthorisedUri(app, {
            protocol: 'post',
            uri: '/api/users',
            data: {
                email: 'user@uniflow.io',
                password: password,
            }
        })
    });

    test.each([{
        email: null,
        password: faker.random.words(),
    }, {
        email: '',
        password: faker.random.words(),
    }, {
        email: faker.random.word(),
        password: faker.random.words(),
    }])('POST /api/users bad email', async (data) => {
        await expectUnprocessableEntityUri(app, {
            protocol: 'post',
            uri: '/api/users',
            data,
            validationKeys: ['email']
        })
    });

    test('GET /api/users/:uid/settings success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/settings`,
            email: 'user@uniflow.io',
        });
        expect(body).to.have.all.keys('apiKey', 'facebookId', 'firstname', 'githubId', 'lastname', 'roles', 'uid', 'username', 'email', 'links')
        assert.isArray(body.roles)
    });

    test('PUT /api/users/:uid/settings success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'put',
            uri: `/api/users/{{uid}}/settings`,
            email: 'user@uniflow.io',
            data: {}
        });
        expect(body).to.have.all.keys('apiKey', 'facebookId', 'firstname', 'githubId', 'lastname', 'roles', 'uid', 'username', 'email', 'links')
        assert.isArray(body.roles)
    })

    test('GET /api/users/:uid/admin-config success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/admin-config`,
            email: 'admin@uniflow.io',
        });
        assert.isObject(body)
    });

    test('GET /api/users/:uid/admin-config not authorised rigths', async () => {
        await expectNotAuthorisedUri(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/admin-config`,
            email: 'user@uniflow.io',
        });
    })

    test('PUT /api/users/:uid/admin-config success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'put',
            uri: `/api/users/{{uid}}/admin-config`,
            email: 'admin@uniflow.io',
            data: {}
        });
        assert.isObject(body)
    })

    test('PUT /api/users/:uid/admin-config not authorised rigths', async () => {
        await expectNotAuthorisedUri(app, {
            protocol: 'put',
            uri: `/api/users/{{uid}}/admin-config`,
            email: 'user@uniflow.io',
        });
    })

    for(const {protocol, suffixUri, email} of [{
        protocol: 'get',
        suffixUri: 'settings',
    }, {
        protocol: 'put',
        suffixUri: 'settings',
    }, {
        protocol: 'get',
        suffixUri: 'admin-config',
        email: 'admin@uniflow.io',
    }, {
        protocol: 'put',
        suffixUri: 'admin-config',
        email: 'admin@uniflow.io',
    }]) {
        test.each([faker.random.uuid()])(`GET /api/users/:uid/${suffixUri} not authorised :uid`, async (uid: string) => {
            await expectNotAuthorisedUri(app, {
                protocol: protocol as 'get'|'put'|'post',
                uri: `/api/users/${uid}/${suffixUri}`,
                email : email ?? 'user@uniflow.io',
            });
        })
    }

    test('GET /api/users/:uid/folders success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/folders`,
            email: 'user@uniflow.io'
        });
        expect(body).to.have.all.keys('data', 'total')
        assert.isArray(body.data)
    });

    test.each([faker.random.word()])('POST /api/users/:uid/folders success', async (name: string) => {
        const { body } = await expectOkUri(app, {
            protocol: 'post',
            uri: `/api/users/{{uid}}/folders`,
            data: { name },
            email: 'user@uniflow.io'
        });
        assert.isObject(body)
    });

    test('GET /api/users/:uid/programs success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/programs`,
            email: 'user@uniflow.io'
        });
        expect(body).to.have.all.keys('data', 'total')
        assert.isArray(body.data)
    });

    test.each([faker.random.word()])('POST /api/users/:uid/programs success', async (name: string) => {
        const { body } = await expectOkUri(app, {
            protocol: 'post',
            uri: `/api/users/{{uid}}/programs`,
            data: { name },
            email: 'user@uniflow.io'
        });
        assert.isObject(body)
    });
})