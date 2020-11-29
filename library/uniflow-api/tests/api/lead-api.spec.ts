import * as faker from 'faker'
import { describe, test, beforeAll } from '@jest/globals'
import { expect, assert } from 'chai'
import { expectCreatedUri, expectOkUri, expectUnprocessableEntityUri } from '../utils';
import { default as Container } from "../../src/container";
import { default as App } from "../../src/app";
import { LeadRepository } from '../../src/repository';
import { LeadEntity } from '../../src/entity';

describe('api-lead', () => {
    const app: App = Container.get(App)
    let lead: LeadEntity

    beforeAll(async () => {
        const leadRepository = Container.get(LeadRepository)
        const oneLead = await leadRepository.findOne()
        if(!oneLead) {
            throw new Error('Lead expected from fixtures')
        }
        lead = oneLead
    })

    test.each([{
        email: faker.internet.email(),
        optinNewsletter: true,
        optinBlog: faker.random.boolean(),
    }])('POST /api/leads success', async (data) => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: '/api/leads',
            data
        })
        expect(body).to.have.all.keys('uid', 'email', 'optinNewsletter', 'optinBlog', 'optinGithub', 'githubUsername')
        assert.strictEqual(body.email, data.email)
        assert.strictEqual(body.optinNewsletter, data.optinNewsletter)
        assert.strictEqual(body.optinBlog, data.optinBlog)
    });

    test.each([null, '', faker.random.word()])('POST /api/leads bad email format', async (email: any) => {
        await expectUnprocessableEntityUri(app, {
            protocol: 'post',
            uri: '/api/leads',
            data: {
                email: email,
            },
            validationKeys: ['email']
        })
    });

    test('GET /api/leads/:uid success', async () => {
        const { body } = await expectOkUri(app, {
            protocol: 'get',
            uri: `/api/leads/${lead.uid}`
        });
        expect(body).to.have.all.keys('uid', 'email', 'optinNewsletter', 'optinBlog', 'optinGithub', 'githubUsername')
        assert.strictEqual(body.email, lead.email)
        assert.strictEqual(body.optinNewsletter, lead.optinNewsletter)
        assert.strictEqual(body.optinBlog, lead.optinBlog)
    });

    test.each([{
        optinNewsletter: faker.random.boolean(),
        optinBlog: faker.random.boolean(),
    }])('PUT /api/leads/:uid success', async (data) => {
        const { body } = await expectOkUri(app, {
            protocol: 'put',
            uri: `/api/leads/${lead.uid}`,
            data,
        });
        expect(body).to.have.all.keys('uid', 'email', 'optinNewsletter', 'optinBlog', 'optinGithub', 'githubUsername')
        assert.strictEqual(body.email, lead.email)
        assert.strictEqual(body.optinNewsletter, data.optinNewsletter)
        assert.strictEqual(body.optinBlog, data.optinBlog)
    });

    test('POST /api/leads/github-webhook success', async () => {
        const { body } = await expectCreatedUri(app, {
            protocol: 'post',
            uri: `/api/leads/github-webhook`,
            data: {
                action: 'created',
                sender: {
                    login: 'github_username'
                }
            },
            headers: {
                'X-Hub-Signature': 'sha1=e717896263bb2650c3b1639813acc4e5deae7cd3' //generated digest from POST data
            }
        });
        expect(body).to.have.all.keys('uid', 'email', 'optinNewsletter', 'optinBlog', 'optinGithub', 'githubUsername')
        assert.strictEqual(body.email, 'github_username@gmail.com')
        assert.strictEqual(body.optinNewsletter, false)
        assert.strictEqual(body.optinBlog, false)
        assert.strictEqual(body.optinGithub, true)
    });
})