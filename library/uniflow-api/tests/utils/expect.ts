import { expect } from 'chai';
import * as request from 'superagent'
import App from '../../src/app';
import { loginApp, testApp } from './app';

export function expectAllValidationKeys(body: any, keys:string[]): any {
    expect(body).to.contain.keys('validation')
    const validationKeys = body.validation.map((item: any) => item.key)
    expect(keys).to.have.all.members(validationKeys)
}

export function expectIncludeValidationKeys(body: any, keys:string[]): any {
    expect(body).to.contain.keys('validation')
    const validationKeys = body.validation.map((item: any) => item.key)
    expect(keys).to.include.members(validationKeys)
}

const checkUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function expectUid(uid: string): Boolean {
    return checkUUID.test(uid)
}

const checkVersion = /^v[0-9]+\.[0-9]+\.[0-9]+$/i;

export function expectVersion(version: string): Boolean{
    return checkVersion.test(version)
}

async function expectCode(
    app: App,
    data: {
        protocol: 'get'|'put'|'post'|'delete',
        uri: string,
        data?: string | object
        email?: string
        code: number
    }
): Promise<request.Response>{
    let token = null
    let uri = data.uri

    if(data.email) {
        const login = await loginApp(app, data.email)
        token = login.token
        uri = uri.replace(/{{uid}}/g, login.uid)
    }
    
    let request: any
    if(data.protocol === 'get') {
        request = testApp(app).get(uri)
    } else if (data.protocol === 'put') {
        request = testApp(app).put(uri).send(data.data)
    } else if (data.protocol === 'post') {
        request = testApp(app).post(uri).send(data.data)
    } else if (data.protocol === 'delete') {
        request = testApp(app).delete(uri)
    }

    if(token) {
        request = request.set({'Uniflow-Authorization': `Bearer ${token}`})
    }

    return request.expect(data.code || 200)
}

export async function expectOkUri(
    app: App,
    data: {
        protocol: 'get'|'put'|'post'|'delete',
        uri: string,
        data?: string | object
        email?: string
    }
): Promise<request.Response>{
    return expectCode(app, {...data, code: 200})
}

export async function expectCreatedUri(
    app: App,
    data: {
        protocol: 'get'|'put'|'post'|'delete',
        uri: string,
        data?: string | object
        email?: string
    }
): Promise<request.Response>{
    return expectCode(app, {...data, code: 201})
}

export async function expectNotAuthorisedUri(
    app: App,
    data: {
        protocol: 'get'|'put'|'post'|'delete',
        uri: string,
        data?: string | object
        email?: string
    }
): Promise<request.Response>{
    return expectCode(app, {...data, code: 401})
}

export async function expectUnprocessableEntityUri(
    app: App,
    data: {
        protocol: 'get'|'put'|'post'|'delete',
        uri: string,
        data?: string | object
        email?: string
        validationKeys: string[]
    }
): Promise<request.Response>{
    const response = await expectCode(app, {...data, code: 422})
    expectIncludeValidationKeys(response.body, data.validationKeys)
    return response
}