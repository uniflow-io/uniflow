import { describe, test } from '@jest/globals'
import { expect } from 'chai';
import * as faker from 'faker'
import { expectUid, expectNotAuthorisedUri, expectUnprocessableEntityUri, expectCreatedUri } from '../utils'
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-auth', () => {
    const app: App = Container.get(App)

    test('POST /api/login success', async () => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/login',
            data: {
                username: 'user@uniflow.io',
                password: 'user_password'
            }
        })
        expect(body).to.have.all.keys('token', 'uid')
        expectUid(body.uid)
    });

    test('POST /api/login bad credentials', async () => {
        await expectNotAuthorisedUri(app, {
            protocol: 'post',
            uri: '/api/login',
            data: {
                username: 'user@uniflow.io',
                password: 'badpassword'
            }
        })
    });

    test.each([null, '', '$user#*', faker.random.words(3)])('POST /api/login bad username format', async (username: string) => {
        await expectUnprocessableEntityUri(app, {
            protocol: 'post',
            uri: '/api/login',
            data: {
                username: username,
                password: 'anypassword',
            },
            validationKeys: ['username']
        })
    });

    test('POST /api/login-facebook success', async () => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/login-facebook',
            data: {
                access_token: 'valid-facebook-token',
            }
        })
        expect(body).to.have.all.keys('token', 'uid')
        expectUid(body.uid)
    });

    test('POST /api/login-facebook bad credentials', async () => {
        await expectNotAuthorisedUri(app, {
            protocol: 'post',
            uri: '/api/login-facebook',
            data: {
                access_token: 'invalid-facebook-token',
            }
        })
    });

    test('POST /api/login-github success', async () => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/login-github',
            data: {
                code: 'valid-github-code',
            }
        })
        expect(body).to.have.all.keys('token', 'uid')
        expectUid(body.uid)
    });

    test('POST /api/login-github bad credentials', async () => {
        await expectNotAuthorisedUri(app, {
            protocol: 'post',
            uri: '/api/login-github',
            data: {
                code: 'invalid-github-code',
            }
        })
    });
})