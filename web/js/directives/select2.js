import Vue from 'vue'
import $ from 'jquery'
import 'select2'

Vue.directive('select2', {
    twoWay: true,

    bind: function () {
        $(this.el)
            .select2()
            .on('change', () => {
                this.set(this.el.value)
            })
    },
    update: function (value) {
        $(this.el).val(value).trigger('change')
    },
    unbind: function () {
        $(this.el).off().select2('destroy')
    }
});
