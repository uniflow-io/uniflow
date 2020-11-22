import { describe, test } from '@jest/globals'
import { expect } from 'chai'
import * as faker from 'faker'
import { expectCreatedUri, expectUnprocessableEntityUri } from '../utils';
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-lead', () => {
    const app: App = Container.get(App)

    test.each([faker.internet.email()])('POST /api/leads success', async (email: string) => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/leads',
            data: {
                email: email,
            }
        })
        expect(body).to.have.all.keys('email')
    });

    test.each([null, '', faker.random.word()])('POST /api/leads bad email format', async (email: any) => {
        await expectUnprocessableEntityUri(app, {
            protocol: 'post',
            uri: '/api/contacts',
            data: {
                email: email,
            },
            validationKeys: ['email']
        })
    });
})