import { describe, test } from '@jest/globals'
import { assert } from 'chai';
import * as faker from 'faker'
import { expectCreatedUri, expectUnprocessableEntityUri } from '../utils';
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-contact', () => {
    const app: App = new Container().get(App)

    test.each([{
        email: faker.internet.email(),
        message: faker.random.words(),
    }])('POST /api/contacts success', async (data: any) => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/contacts',
            data: data
        })
        assert.isTrue(body)
    });

    test.each([{
        email: faker.internet.email(),
        message: null,
    }, {
        email: faker.internet.email(),
        message: '',
    }, {
        email: null,
        message: faker.random.words(),
    }, {
        email: '',
        message: faker.random.words(),
    }])('POST /api/contacts bad data format', async (data: any) => {
        await expectUnprocessableEntityUri(app, {
            protocol: 'post',
            uri: '/api/contacts',
            data: data,
            validationKeys: ['email', 'message']
        })
    });
})