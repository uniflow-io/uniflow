import Vue from 'vue'
import template from './template.html!text'

import components from '../../../../uniflow/components.js';

export default Vue.extend({
    template: template,
    data() {
        return {
            search: 'core-javascript',
            optionGroups: {}
        }
    },
    created: function() {
        for(let key in components) {
            if(components.hasOwnProperty(key)) {
                let [group, label] = key.split('-');

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
                this.$emit('push', this.search);
            }
        }
    }
});