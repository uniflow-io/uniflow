import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            text: null
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
        text: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.text];
        },
        deserialise: function (data) {
            [this.variable, this.text] = data ? data : [null, null];
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
            if(this.variable) {
                if(runner.hasValue(this.variable)) {
                    this.text = runner.getValue(this.variable);
                } else {
                    runner.setValue(this.variable, this.text);
                }
            }
        }
    }
});