import Vue from 'vue'
import $ from 'jquery'
import 'tagit'

Vue.directive('tagit', {
    twoWay: true,
    params: ['value'],
    priority: -1,

    bind: function () {
        var self = this;

        $(this.el)
            .tagit()
            .on('change', () => {
                self.set(this.value)
            })
    },
    update: function (value) {
        $(this.el).val(value).trigger('change')
    },
    unbind: function () {
        $(this.el).off().select2('destroy')
    }
});
