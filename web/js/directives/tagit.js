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
    update: function (el, binding) {
        if(binding.value) {
            var tags = $(el).tagit("assignedTags"), i;

            for (i = 0; i < binding.value.length; i++) {
                if(tags.indexOf(binding.value[i]) == -1)
                {
                    $(el).tagit("createTag", binding.value[i]);
                }
            }

            for (i = 0; i < tags.length; i++) {
                if(binding.value.indexOf(tags[i]) == -1)
                {
                    $(el).tagit("removeTagByLabel", tags[i]);
                }
            }
        }
    },
    unbind: function (el) {
        $(el).off().tagit('destroy')
    }
});
