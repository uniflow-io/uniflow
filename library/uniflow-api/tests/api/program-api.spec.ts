import { describe, test, beforeAll } from '@jest/globals'
import { assert } from 'chai';
import * as faker from 'faker'
import { expectOkUri, uriApp } from '../utils'
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-program', () => {
    const app: App = new Container().get(App)
    let userProgram: any, userDeleteProgram: any

    beforeAll(async () => {
        const { body } = await uriApp(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/programs`,
            email: 'user@uniflow.io'
        })
        userProgram = body[0]
        userDeleteProgram = body[1]
    })

    test('GET /api/programs success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: '/api/programs',
        })
        assert.isArray(body)
    });

    test.each([faker.random.word()])('PUT /api/programs/:uid success', async (name: string) => {
        const { body } = await expectOkUri(app, {
            protocol: 'put',
            uri: `/api/programs/${userProgram.uid}`,
            email: 'user@uniflow.io',
            data: { name },
        });
        assert.isObject(body)
    });

    test('DELETE /api/programs/:uid success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'delete',
            uri: `/api/programs/${userDeleteProgram.uid}`,
            email: 'user@uniflow.io',
        });
        assert.isTrue(body)
    });

    test('GET /api/programs/:uid/flows success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/programs/${userProgram.uid}/flows`,
            email: 'user@uniflow.io',
        });
        assert.isObject(body)
    });

    test('PUT /api/programs/:uid/flows success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'put',
            uri: `/api/programs/${userProgram.uid}/flows`,
            email: 'user@uniflow.io',
            data: { data: '{}'},
        });
        assert.isTrue(body)
    });
})