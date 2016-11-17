import Vue from 'vue'
import $ from 'jquery'
import 'tagit'

Vue.component('tagit', {
    props: ['options', 'value'],
    template: '<input />',
    mounted: function () {
        this.silence = false;

        $(this.$el)
            .val(this.value)
            .tagit(this.options)
            .on('change', () => {
                if(this.silence) return;

                this.$emit('input', $(this.$el).tagit('assignedTags'));
            })
    },
    watch: {
        value: function (value) {
            this.silence = true;

            var tags = $(this.$el).tagit('assignedTags'), i;

            for (i = 0; i < value.length; i++) {
                if(tags.indexOf(value[i]) == -1)
                {
                    $(this.$el).tagit('createTag', value[i]);
                }
            }

            for (i = 0; i < tags.length; i++) {
                if(value.indexOf(tags[i]) == -1)
                {
                    $(this.$el).tagit('removeTagByLabel', tags[i]);
                }
            }

            this.silence = false;
        },
        options: function (options) {
            $(this.$el).tagit(options)
        }
    },
    destroyed: function () {
        $(this.$el).off().tagit('destroy')
    }
});
