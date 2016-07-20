import Vue from 'vue'
import $ from 'jquery'
import 'tagit'

Vue.directive('tagit', {
    twoWay: true,

    bind: function () {
        console.log(this.tags);

        $(this.el)
            .tagit()
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
