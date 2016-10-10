import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    computed: {
        history: function() {
            return this.$store.state.history.items
        }
    }
});
