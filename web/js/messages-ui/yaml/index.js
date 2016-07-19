import Vue from 'vue'
import template from './template.html!text'

import SFTPMessage from 'messages/sftp.js'

var component = Vue.extend({
    template: template,
    props: ['message'],
    data() {
        return {
            content: null
        }
    },
    created: function() {
        this.content = this.message;
    },

    methods: {
    }
});

Vue.component('yaml-component', component);

export default component;