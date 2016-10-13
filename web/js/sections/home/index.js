import Vue from 'vue'
import template from './template.html!text'

import History from './history/index.js'
import Show from './show/index.js'

export default Vue.extend({
    template: template,
    components: {
        'history': History,
        'show': Show
    },
    computed: {
        currentHistory: function () {
            return this.$store.state.history.current;
        }
    }
});
