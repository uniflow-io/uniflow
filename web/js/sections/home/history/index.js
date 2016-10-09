import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    computed: function() {
        return {
            history: this.$store.history.items
        };
    },
    created: function() {
        this.$store.dispatch('getHistory')
    }
});
