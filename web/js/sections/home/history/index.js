import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    data: function () {
        return {
            search: ""
        }
    },
    computed: {
        history: function() {
            return this.$store.state.history.items
        }
    },
    methods: {
        onSearch: function () {
            if(this.search) {
                this.$store.dispatch('newHistory', {
                    'title': this.search
                }).then((item) => {
                    this.$store.dispatch('setCurrentHistory', item.id);
                });
            }
        }
    }
});
