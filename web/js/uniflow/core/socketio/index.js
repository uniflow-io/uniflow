import Vue from 'vue'
import template from './template.html!text'
import io from 'socket.io';

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            host: null,
            port: null
        }
    },
    created: function () {
        this.bus.$on('reset', this.deserialise);
        this.bus.$on('compile', this.onCompile);
        this.bus.$on('execute', this.onExecute);
    },
    destroyed: function () {
        this.bus.$off('reset', this.deserialise);
        this.bus.$off('compile', this.onCompile);
        this.bus.$off('execute', this.onExecute);
    },
    watch: {
        variable: function () {
            this.onUpdate();
        },
        host: function () {
            this.onUpdate();
        },
        port: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.host, this.port];
        },
        deserialise: function (data) {
            [this.variable, this.host, this.port] = data ? data : [null, null];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onCompile: function(interpreter) {

        },
        onExecute: function (runner) {
            if(this.variable) {
                let socket = function(text) {
                    return io('http://'+this.host+':'+this.port);
                };
                runner.setValue(this.variable, socket);
            }
        }
    }
});