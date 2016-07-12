import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from 'messages/sftp.js'

export default Vue.extend({
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
            content: null
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
            }).then((data) => {
                //this.content = data;
                this.$dispatch('message', data);
            });
        }
    }
});
