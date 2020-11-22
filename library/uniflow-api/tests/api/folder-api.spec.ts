import { describe, test, beforeAll } from '@jest/globals'
import { assert } from 'chai';
import * as faker from 'faker'
import { expectOkUri, uriApp } from '../utils'
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-folder', () => {
    const app: App = Container.get(App)
    let userFolder: any, userDeleteFolder: any

    beforeAll(async () => {
        const { body } = await uriApp(app, {
            protocol: 'get',
            uri: `/api/users/{{uid}}/folders`,
            email: 'user@uniflow.io'
        })
        userFolder = body[0]
        userDeleteFolder = body[1]
    })

    test.each([faker.random.word()])('PUT /api/folders/:uid success', async (name: string) => {
        const { body } = await expectOkUri(app, {
            protocol: 'put',
            uri: `/api/folders/${userFolder.uid}`,
            email: 'user@uniflow.io',
            data: { name },
        });
        assert.isObject(body)
    });

    test('DELETE /api/folders/:uid success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'delete',
            uri: `/api/folders/${userDeleteFolder.uid}`,
            email: 'user@uniflow.io',
        });
        assert.isTrue(body)
    });
})