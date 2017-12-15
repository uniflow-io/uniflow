import Vue from 'vue'
import $ from 'jquery'
import 'select2'

Vue.component('select2', {
    props: ['options', 'value'],
    template: '<select><slot></slot></select>',
    mounted: function () {
        let vm = this;
        vm.silence = false;
        $(this.$el)
            .val(this.value)
            .select2({ data: this.options })
            .on('change', function () {
                if(vm.silence) return;

                vm.$emit('input', this.value)
            })
    },
    watch: {
        value: function (value) {
            let vm = this;
            //$(this.$el).select2('val', value)

            vm.silence = true;
            $(this.$el).val(value);
            $(this.$el).trigger('change.select2');
            vm.silence = false;
        },
        options: function (options) {
            $(this.$el).select2({ data: options })
        }
    },
    destroyed: function () {
        $(this.$el).off().select2('destroy')
    }
});
