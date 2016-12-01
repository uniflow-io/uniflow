import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            select: null
        }
    },
    created: function () {
        this.bus.$on('reset', this.deserialise);
        this.bus.$on('execute', this.onExecute);
    },
    destroyed: function () {
        this.bus.$off('reset', this.deserialise);
        this.bus.$off('execute', this.onExecute);
    },
    watch: {
        variable: function () {
            this.onUpdate();
        },
        select: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.select];
        },
        deserialise: function (data) {
            [this.variable, this.select] = data ? data : [null, null];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onExecute: function (runner) {
            if(this.variable) {
                if(runner.hasValue(this.variable)) {
                    this.select = runner.getValue(this.variable);
                } else {
                    runner.setValue(this.variable, this.select);
                }
            }
        }
    }
});