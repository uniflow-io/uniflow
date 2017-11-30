import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    props: ['bus'],
    template: template,
    data() {
        return {
            variable: null,
            keyvaluelist: []
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
        keyvaluelist: {
            handler: function () {
                this.onUpdate();
            },
            deep: true
        }
    },
    methods: {
        transform: function () {
            return this.keyvaluelist.reduce(function(object, item) {
                if(item.key) {
                    let value = item.value
                    if(Number.isInteger(value)) {
                        value = Number.parseInt(value)
                    }

                    object[item.key] = value
                }
                return object
            }, {})
        },
        reverseTransform: function (object) {
            this.keyvaluelist = Object.entries(object).reduce(function(list, item) {
                list.push(item[0], item[1])
                return list
            }, [])
        },
        serialise: function () {
            let object = this.transform()
            return [this.variable, object];
        },
        deserialise: function (data) {
            let object;
            [this.variable, object] = data ? data : [null, {}];
            this.reverseTransform(object)
        },
        onUpdate: function () {
            this.$emit('update', this.serialise());
        },
        onDelete: function () {
            this.$emit('pop');
        },
        onUpdateItem: function () {
            this.onUpdate();
        },
        onRemoveItem: function (index) {
            this.keyvaluelist.splice(index, 1);

            this.onUpdate();
        },
        onAddItem: function () {
            this.keyvaluelist.push({key: '', value: ''});

            this.onUpdate();
        },
        onCompile: function (interpreter, scope) {

        },
        onExecute: function (runner) {
            if (this.variable) {
                if (runner.hasValue(this.variable)) {
                    let object = runner.getValue(this.variable);
                    this.reverseTransform(object);
                } else {
                    let object = this.transform();
                    runner.setValue(this.variable, object);
                }
            }
        }
    }
});