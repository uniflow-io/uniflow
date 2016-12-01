import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            checkboxes: {'coco': true, 'dodo': false}
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
        checkboxes: function () {
            this.onUpdate();
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.checkboxes];
        },
        deserialise: function (data) {
            //[this.variable, this.checkboxes] = data ? data : [null, null];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onExecute: function (runner) {
            if(this.variable && runner.hasValue(this.variable)) {
                var values = runner.getValue(this.variable).data;

                runner.setValue(this.variable, runner.createValue(this.checkboxes));
            }
        }
    }
});