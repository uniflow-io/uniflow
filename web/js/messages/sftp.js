import request from 'superagent'
import serverService from 'services/server.js'

class SFTPMessage {
    constructor(config) {
        this.config = config;
    }

    check() {
        return new Promise((resolve, reject) => {
            request.post(serverService.getBaseUrl() + '/component/sftp/check')
                .type('form')
                .send(this.config)
                .end((err, res) => {
                    if(err) {
                        reject(err);
                    } else if(res.body.error) {
                        reject(res.body.message);
                    } else {
                        resolve(res.body.result);
                    }
                });
        });
    }

    read(path) {
        return new Promise((resolve, reject) => {
            var data = this.config;
            data['path'] = path;

            request.post(serverService.getBaseUrl() + '/component/sftp/read')
                .type('form')
                .send(data)
                .end((err, res) => {
                    if(err) {
                        reject(err);
                    } else if(res.body.error) {
                        reject(res.body.message);
                    } else {
                        resolve(res.body.content);
                    }
                });
        });
    }

    tree(path) {
        return new Promise((resolve, reject) => {
            var data = this.config;
            data['path'] = path;

            request.post(serverService.getBaseUrl() + '/component/sftp/tree')
                .type('form')
                .send(data)
                .end((err, res) => {
                    if(err) {
                        reject(err);
                    } else if(res.body.error) {
                        reject(res.body.message);
                    } else {
                        resolve(res.body.tree);
                    }
                });
        });
    }
}

export default SFTPMessage;