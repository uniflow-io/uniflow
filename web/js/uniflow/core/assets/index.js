import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            assets: []
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
        }
    },
    methods: {
        serialise: function () {
            return JSON.stringify([this.variable, this.assets]);
        },
        deserialise: function (data) {
            [this.variable, this.code] = data ? JSON.parse(data) : [null, []];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onExecute: function (runner) {
            if(this.variable) {
                runner.eval('var ' + this.variable + ' = [];');
            }
        }
    }
});