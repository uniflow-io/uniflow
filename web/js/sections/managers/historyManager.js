import Vue from 'vue'

export default Vue.extend({
    created: function () {
        this.$store.dispatch('fetchHistory').then(() => {
            if(this.$route.name == 'homeDetail') {
                this.$store.dispatch('setCurrentHistory', this.$route.params.id);
            } else {
                var keys = Object.keys(this.history);
                if(keys.length > 0) {
                    var item = this.history[keys[0]];
                    this.$store.dispatch('setCurrentHistory', item.id);
                }
            }
        })
    },
    computed: {
        history: function() {
            return this.$store.state.history.items
        }
    },
    watch: {
        '$route': function(to) {
            if(to.name == 'homeDetail') {
                this.$store.dispatch('setCurrentHistory', to.params.id);
            }
        },
        history: {
            handler: function (val, oldVal) {
                //console.log('historyManagerWatch', val, oldVal);
            },
            deep: true
        }
    }
});
