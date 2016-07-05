define(['vuejs', 'superagent', 'services/server'], function(Vue, superagent, server) {
    Vue.component('symfony-component', function(resolve) {
        superagent
            .get('/js/components/symfony/template.html')
            .end(function(err, res) {
                var component = Vue.extend({
                    template: res.text,
                    data() {
                        return {
                            'symfonyPath': '/decleor'
                        }
                    },

                    methods: {
                        onSubmit: function() {
                            superagent.post(server.getUrl() + '/component/sftp/check')
                                .type('form')
                                .send({
                                    'host': this.host,
                                    'port':  this.port,
                                    'username': this.username,
                                    'root': this.root + this.symfonyPath,
                                    'privateKey': this.privateKey,
                                    'path': 'app/Resources/translations/messages.fr.yml'
                                }).end((err, res) => {
                                    console.log(res);
                                    this.content = res.body.content;
                                });
                        }
                    }
                });

                resolve(component);
            });
    })
});