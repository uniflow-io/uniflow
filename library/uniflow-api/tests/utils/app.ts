import * as supertest from "supertest";
import App from "../../src/app";

const loginApp = (app: App, username: string): Promise<{token: string, uid: string}> => {
    return new Promise(resolve => {
        let password = ''
        if(username === 'admin@uniflow.io') {
            password = 'admin_password'
        } else if(username === 'user@uniflow.io') {
            password = 'user_password'
        }
        
        supertest(app.getApp())
            .post('/api/login')
            .send({
                username: username,
                password: password
            })
            .expect(201)
            .end((err, res) => {
                const data = res.body;

                resolve({
                    token: data.token,
                    uid: data.uid,
                })
            })
    })
}

const testApp = (app: App): supertest.SuperTest<supertest.Test> => {
    return supertest(app.getApp())
}

export { loginApp, testApp }