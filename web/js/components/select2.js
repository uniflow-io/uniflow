import Vue from 'vue'
import $ from 'jquery'
import 'select2'

Vue.component('select2', {
    props: ['options', 'value'],
    template: '<select><slot></slot></select>',
    mounted: function () {
        var vm = this;
        $(this.$el)
            .val(this.value)
            .select2({ data: this.options })
            .on('change', function () {
                vm.$emit('input', this.value)
            })
    },
    watch: {
        value: function (value) {
            //$(this.$el).select2('val', value)

            $(this.$el).val(value);
            $(this.$el).trigger('change.select2');
        },
        options: function (options) {
            $(this.$el).select2({ data: options })
        }
    },
    destroyed: function () {
        $(this.$el).off().select2('destroy')
    }
});
