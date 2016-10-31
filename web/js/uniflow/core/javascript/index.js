import Vue from 'vue'
import template from './template.html!text'

import TextMessage from '../../../messages/text.js'

export default Vue.extend({
    template: template,
    data() {
        return {
            code: null
        }
    },
    watch: {
        code: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return this.code;
        },
        deserialise: function (data) {
            this.code = data;
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onExecute: function (resolve, reject) {
            resolve(this.code);
        }
    }
});