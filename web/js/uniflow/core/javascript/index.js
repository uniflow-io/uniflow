import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            code: null
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
        onCompile: function(interpreter, scope) {

        },
        onExecute: function (runner) {
            runner.eval(this.code);
        }
    }
});