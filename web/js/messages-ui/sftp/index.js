import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from 'messages/sftp.js'

var component = Vue.extend({
    template: template,
    data() {
        return {
            config: {
                'host': 'localhost',
                'port':  2222,
                'username': 'math',
                'root': '/Users/math/Sites',
                'privateKey': '/var/www/puphpet/files/dot/ssh/my_id_rsa'
            },
            fetchStatus: true
        }
    },

    methods: {
        onSubmit: function() {
            var message = new SFTPMessage(this.config);
            message.check().then((data) => {
                if(data == true) {
                    this.fetchStatus = true;
                    this.$dispatch('message', message);
                }
            }, () => {
                this.fetchStatus = false;
            });/*.then(function(data) {
                if(data) {
                    return message.read('/decleor/app/Resources/translations/messages.fr.yml');
                }

                return null;
            }).then((data) => {
                //this.content = data;
                this.$dispatch('message', data);
            });*/
        }
    }
});

Vue.component('sftp-message-ui', component);

export default component;