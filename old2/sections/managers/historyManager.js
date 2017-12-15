import Vue from 'vue'

export default Vue.extend({
    created: function () {
        this.$store.dispatch('fetchHistory').then(() => {
            if(this.$route.name == 'homeDetail') {
                this.$store.dispatch('setCurrentHistory', this.$route.params.id);
            } else {
                let keys = Object.keys(this.history);

                keys.sort((keyA, keyB) => {
                    let itemA = this.history[keyA],
                        itemB = this.history[keyB];

                    return itemB.updated.diff(itemA.updated);
                });

                if(keys.length > 0) {
                    let item = this.history[keys[0]];
                    this.$store.dispatch('setCurrentHistory', item.id);
                }
            }
        })
    },
    computed: {
        history: function() {
            return this.$store.state.history.items
        },
        current: function() {
            return this.$store.state.history.current
        }
    },
    watch: {
        current: function (id) {
            if(id) {
                this.$router.push({ name: 'homeDetail', params: { id: id }});
            }
        },
        '$route': function(to) {
            if(to.name == 'homeDetail') {
                this.$store.dispatch('setCurrentHistory', to.params.id);
            }
        }
    }
});
