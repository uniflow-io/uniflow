import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            checkboxes: {}
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
        checkboxes: {
            handler: function () {
                this.onUpdate();
            },
            deep: true
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.checkboxes];
        },
        deserialise: function (data) {
            [this.variable, this.checkboxes] = data ? data : [null, {}];
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
            if(this.variable && runner.hasValue(this.variable)) {
                let values = runner.getValue(this.variable);

                let checkboxes = {};
                for (let i = 0; i < values.length; i++) {
                    checkboxes[values[i]] = this.checkboxes[values[i]] || false
                }
                this.checkboxes = checkboxes;

                values = values.filter((value) => {
                    return checkboxes[value];
                });

                runner.setValue(this.variable, values);
            }
        }
    }
});