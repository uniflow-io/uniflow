import { describe, test } from '@jest/globals'
import { expect } from 'chai';
import { expectVersion, expectOkUri } from '../utils';
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";

describe('api-version', () => {
    const app: App = new Container().get(App)

    test('GET /api/version success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/version`,
        });
        expect(body).to.have.all.keys('version')
        expectVersion(body.version)
    });
})