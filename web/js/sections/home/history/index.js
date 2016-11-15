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

            if(this.search) {
                keys = keys.filter((key) => {
                    var item = this.$store.state.history.items[key];
                    var words = item.title;
                    words += item.tags.join('');
                    words = words.toLowerCase();

                    return words.indexOf(this.search) !== -1;
                });
            }

            keys.sort((keyA, keyB) => {
                var itemA = this.$store.state.history.items[keyA],
                    itemB = this.$store.state.history.items[keyB];

                return itemB.updated.diff(itemA.updated);
            });

            return keys.map((key) => {
                return this.$store.state.history.items[key];
            });
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
