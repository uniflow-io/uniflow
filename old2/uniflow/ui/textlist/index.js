import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            textlist: []
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
        textlist: {
            handler: function () {
                this.onUpdate();
            },
            deep: true
        }
    },
    methods: {
        serialise: function () {
            return [this.variable, this.textlist];
        },
        deserialise: function (data) {
            [this.variable, this.textlist] = data ? data : [null, []];
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onUpdateText: function () {
            this.onUpdate();
        },
        onRemoveText: function (index) {
            this.textlist.splice(index, 1);

            this.onUpdate();
        },
        onAddText: function () {
            this.textlist.push('');

            this.onUpdate();
        },
        onCompile: function(interpreter, scope) {

        },
        onExecute: function (runner) {
            if(this.variable) {
                if(runner.hasValue(this.variable)) {
                    this.textlist = runner.getValue(this.variable);
                } else {
                    runner.setValue(this.variable, this.textlist);
                }
            }
        }
    }
});