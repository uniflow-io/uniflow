import * as supertest from "supertest";
import * as request from 'superagent'
import App from "../../src/app";
import { expectCreatedUri } from "./expect";

export function testApp(app: App): supertest.SuperTest<supertest.Test> {
    return supertest(app.getApp())
}

export async function loginApp(app: App, username?: string): Promise<{token: string, uid: string}> {
    let password = ''
    if(username === 'admin@uniflow.io') {
        password = 'admin_password'
    } else if(!username || username === 'user@uniflow.io') {
        username = 'user@uniflow.io'
        password = 'user_password'
    }

    const { body } = await expectCreatedUri(app, {
        protocol: 'post',
        uri: '/api/login',
        data: {
            username: username,
            password: password
        }
    })

    return {
        token: body.token,
        uid: body.uid,
    }
}

export async function uriApp(
    app: App,
    data: {
        protocol: 'get'|'put'|'post'|'delete',
        uri: string,
        data?: string | object
        email?: string
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

    return request
}
