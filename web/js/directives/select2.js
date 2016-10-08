import Vue from 'vue'
import $ from 'jquery'
import 'select2'

Vue.directive('select2', {
    twoWay: true,

    inserted: function (el, binding) {
        $(el)
            .select2()
            .on('change', () => {
                binding.value = el.value;
            })
    },
    update: function (el, value) {
        $(el).val(value).trigger('change')
    },
    unbind: function (el) {
        $(el).off().select2('destroy')
    }
});
