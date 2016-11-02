import Vue from 'vue'
import template from './template.html!text'

import TextMessage from '../../../messages/text.js'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            code: null
        }
    },
    created: function () {
        this.bus.$on('execute', this.onExecute);
    },
    destroyed: function () {
        this.bus.$off('execute', this.onExecute);
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
            console.log('code '+this.code);
            //resolve(this.code);
        }
    }
});