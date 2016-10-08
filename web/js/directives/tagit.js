import Vue from 'vue'
import $ from 'jquery'
import 'tagit'

Vue.directive('tagit', {
    twoWay: true,

    inserted: function (el, binding) {
        $(el)
            .tagit()
            .on('change', () => {
                binding.value = el.value;
            })
    },
    update: function (el, value) {
        $(el).val(value).trigger('change')
    },
    unbind: function (el) {
        $(el).off().tagit('destroy')
    }
});
