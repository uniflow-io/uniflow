import Vue from 'vue'
import $ from 'jquery'
import 'icheck'

Vue.component('icheckbox', {
    props: ['value'],
    template: '<input type="checkbox">',
    mounted: function () {

        let vm = this;
        vm.silence = false;
        $(this.$el)
            .iCheck({
                handle: 'checkbox',
                checkboxClass: 'icheckbox_square-blue'
            })
            .on('ifChecked', function () {
                if(vm.silence) return;

                vm.$emit('input', true)
            })
            .on('ifUnchecked', function () {
                if(vm.silence) return;

                vm.$emit('input', false)
            });
        this.setValue(this.value);
    },
    watch: {
        value: function (value) {
            this.setValue(value)
        }
    },
    methods: {
        setValue: function (value) {
            let vm = this;

            vm.silence = true;
            if(value) {
                $(this.$el).iCheck('check', function() {
                    vm.silence = false;
                });
            } else {
                $(this.$el).iCheck('uncheck', function() {
                    vm.silence = false;
                });
            }
        }
    },
    destroyed: function () {
        $(this.$el).iCheck('destroy');
    }
});
