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
        onCompile: function(interpreter, scope) {
            let obj = {};

            let wrapper = function(url) {
                let newIO = interpreter.createObjectProto(obj.IO_PROTO);
                this.data = io(url);
                return newIO;
            };
            obj.IO = interpreter.createNativeFunction(wrapper, true);
            obj.IO_PROTO = interpreter.getProperty(obj.IO, 'prototype');
            interpreter.setProperty(scope, 'IO', obj.IO);

            wrapper = function(eventName, callback) {
                this.data.on(eventName, callback);
                return this;
            };
            interpreter.setProperty(obj.IO, 'on', interpreter.createNativeFunction(wrapper, false));

            wrapper = function(eventName, args) {
                this.data.emit(eventName, args);
                return this;
            };
            interpreter.setProperty(obj.IO, 'emit', interpreter.createNativeFunction(wrapper, false));
        },
        onExecute: function (runner) {
            runner.eval('var ' + this.variable + ' = new IO(\'http://'+this.host+':'+this.port+'\')')
        }
    }
});