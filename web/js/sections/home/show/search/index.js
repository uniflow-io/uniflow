import Vue from 'vue'
import template from './template.html!text'

import components from '../../../../noflo/components.js';

export default Vue.extend({
    template: template,
    data() {
        return {
            search: null,
            optionGroups: {}
        }
    },
    created: function() {
        for(var key in components) {
            if(components.hasOwnProperty(key)) {
                var [group, label] = key.split('-');

                if(!this.optionGroups[group]) {
                    this.optionGroups[group] = [];
                }

                this.optionGroups[group].push({
                    id: key, text: label
                });
            }
        }
    },
    methods: {
        onSubmit: function() {
            if(this.search) {
                this.message.search = this.search;

                this.$dispatch('message', this.message);
            }
        }
    }
});