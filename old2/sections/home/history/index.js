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
        filteredHistory: function () {
            let keys = Object.keys(this.$store.state.history.items);

            if (this.search) {
                keys = keys.filter((key) => {
                    let item = this.$store.state.history.items[key];
                    let words = item.title;
                    words += item.tags.join(' ');
                    words = words.toLowerCase();

                    return words.indexOf(this.search) !== -1;
                });
            }

            keys.sort((keyA, keyB) => {
                let itemA = this.$store.state.history.items[keyA],
                    itemB = this.$store.state.history.items[keyB];

                return itemB.updated.diff(itemA.updated);
            });

            return keys.map((key) => {
                return this.$store.state.history.items[key];
            });
        },
        history: function () {
            return this.$store.getters.currentHistory;
        }
    },
    methods: {
        onSearch: function () {
            if (this.search) {
                this.$store.dispatch('createHistory', {
                    'title': this.search,
                    'tags': [],
                    'description': ''
                }).then((item) => {
                    return this.$store.dispatch('setCurrentHistory', item.id);
                });
            }
        }
    }
});
