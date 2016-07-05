define(['vuejs', 'superagent', 'messages/sftp'], function(Vue, superagent, SFTPMessage) {
    Vue.component('sftp-component', function(resolve) {
        superagent
            .get('/js/components/sftp/template.html')
            .end(function(err, res) {
                var component = Vue.extend({
                    template: res.text,
                    data() {
                        return {
                            config: {
                                'host': 'localhost',
                                'port':  2222,
                                'username': 'math',
                                'root': '/Users/math/Sites',
                                'privateKey': '/var/www/puphpet/files/dot/ssh/my_id_rsa'
                            }
                        }
                    },

                    methods: {
                        onSubmit: function() {
                            var message = new SFTPMessage(this.config);
                            message.check().then(function(data) {
                                if(data) {
                                    return message.read('/decleor/app/Resources/translations/messages.fr.yml');
                                }

                                return null;
                            }).then(function(data) {
                                console.log(data);
                            });
                        }
                    }
                });

                resolve(component);
            });
    })
});