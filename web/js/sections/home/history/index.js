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
        orderedHistory: function() {
            var items = this.$store.state.history.items

            console.log(items)

            return items;
        }
    },
    methods: {
        onSearch: function () {
            if(this.search) {
                this.$store.dispatch('createHistory', {
                    'title': this.search
                }).then((item) => {
                    this.$store.dispatch('setCurrentHistory', item.id);
                });
            }
        }
    }
});
