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
            console.log(interpreter)
            let obj = {};

            let wrapper = function(var_args) {
                if (interpreter.calledWithNew()) {
                    // Called as new IO().
                    var newIO = this;
                } else {
                    // Called as IO().
                    var newIO = interpreter.createObjectProto(obj.IO_PROTO);
                }
                var first = arguments[0];
                if (arguments.length === 1 && typeof first === 'number') {
                    if (isNaN(Interpreter.legalArrayLength(first))) {
                        interpreter.throwException(interpreter.RANGE_ERROR,
                            'Invalid array length');
                    }
                    newIO.properties.length = first;
                } else {
                    for (var i = 0; i < arguments.length; i++) {
                        newIO.properties[i] = arguments[i];
                    }
                    newIO.properties.length = i;
                }
                return newIO;
            };
            obj.IO = interpreter.createNativeFunction(wrapper, true);
            obj.IO_PROTO = obj.IO.properties['prototype'];
            interpreter.setProperty(scope, 'IO', obj.IO);

            // Static methods on Array.
            /*wrapper = function(obj) {
                return obj && obj.class === 'Array';
            };
            interpreter.setProperty(obj.IO, 'isArray',
                this.createNativeFunction(wrapper, false),
                Interpreter.NONENUMERABLE_DESCRIPTOR)*/
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