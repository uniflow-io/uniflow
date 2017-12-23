import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from '../../../messages/sftp.js'
import TextMessage from '../../../messages/text.js'

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
            path: '/decleor/app/Resources/translations/messages.fr.yml',
            isFile: false,
            fetchStatus: true
        }
    },
    methods: {
        onDelete: function () {
            this.$emit('pop');
        },
        handleTypes: function() {
            return [undefined];
        },
        handle: function (message) {
        },
        onSubmit: function(e) {
            let message = new SFTPMessage(this.config);
            message
                .check()
                .then((data) => {
                    if(data == true) {
                        this.fetchStatus = true;
                    }
                }, () => {
                    this.fetchStatus = false;
                }).then(() => {
                    if(this.isFile) {
                        message
                            .read(this.path)
                            .then((data) => {
                                this.$dispatch('message', new TextMessage(data));
                            });
                    } else {
                        this.$dispatch('message', message);
                    }
                })
            ;
        }
    }
});