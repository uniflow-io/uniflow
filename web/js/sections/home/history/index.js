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
            var keys = Object.keys(this.$store.state.history.items);
            keys.sort((keyA, keyB) => {
                var itemA = this.$store.state.history.items[keyA],
                    itemB = this.$store.state.history.items[keyB];

                return itemB.updated.diff(itemA.updated);
            });

            var items = {}, key, i;
            for(i = 0; i < keys.length; i++) {
                key = keys[i];
                items['sorted'+key] = this.$store.state.history.items[key];
            }

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
