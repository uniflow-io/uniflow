import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from '../../../messages/sftp.js'

export default Vue.extend({
    template: template,
    props: ['message'],
    created: function() {
        this.handle(this.message);
    },
    data() {
        return {
            config: {
                'host': 'localhost',
                'port':  2222,
                'username': 'math',
                'root': '/Users/math/Sites',
                'privateKey': '/var/www/puphpet/files/dot/ssh/my_id_rsa'
            },
            content: null,
            projectDir: '/decleor',
            viewsDir: '/src/Bigyouth/AdminBundle/Resources/views/FlagshipPage',
            progress: null
        }
    },
    methods: {
        handleTypes: function() {
            return [undefined];
        },
        handle: function (message) {

        },
        onSubmit: function(e) {
            this.progress = 0;
            var message = new SFTPMessage(this.config);

            message
                .tree(this.projectDir + this.viewsDir)
                .then((data) => {
                    this.progress = 20;
                    console.log('tree', data);

                }).then(() => {
                    this.progress = 100;
                });
        }
    }
});