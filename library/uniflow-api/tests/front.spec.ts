import { describe, test } from '@jest/globals'
import { expectOkUri } from './utils';
import { default as Container } from "../src/container"
import { default as App } from "../src/app";

describe('front', () => {
    const app: App = Container.get(App)

    test('GET /', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/`,
        });
    });
})