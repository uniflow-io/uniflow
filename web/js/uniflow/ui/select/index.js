import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            choices: [],
            selected: null
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
        choices: function () {
            this.onUpdate();
        },
        selected: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.choices, this.selected];
        },
        deserialise: function (data) {
            [this.variable, this.choices, this.selected] = data ? data : [null, [], null];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onExecute: function (runner) {
            if(this.variable && runner.hasValue(this.variable)) {
                this.choices = runner.getValue(this.variable);

                runner.setValue(this.variable, this.selected);
            }
        }
    }
});