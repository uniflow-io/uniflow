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
        onExecute: function (runner) {
            if(this.variable && runner.hasValue(this.variable)) {
                let values = runner.getValue(this.variable);

                let textlist = [];
                for (let i = 0; i < values.length; i++) {
                    textlist[values[i]] = this.textlist[values[i]] || false
                }
                this.textlist = textlist;

                runner.setValue(this.variable, values);
            }
        }
    }
});