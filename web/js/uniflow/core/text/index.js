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
        text: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return this.text;
        },
        deserialise: function (data) {
            this.text = data;
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onExecute: function (runner) {
            runner.eval(this.text);
        }
    }
});