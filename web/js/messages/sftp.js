define(['superagent', 'services/server'], function(superagent, server) {
    class SFTPMessage {
        constructor(config) {
            this.config = config;
        }

        check() {
            return new Promise((resolve, reject) => {
                superagent.post(server.getUrl() + '/component/sftp/check')
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

                superagent.post(server.getUrl() + '/component/sftp/read')
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
    }

    return SFTPMessage;
});