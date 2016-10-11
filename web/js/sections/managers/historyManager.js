import Vue from 'vue'

export default Vue.extend({
    created: function () {
        this.$store.dispatch('fetchHistory')
    },
    computed: {
        history: function() {
            return this.$store.state.history.items
        }
    },
    watch: {
        history: {
            handler: function (val, oldVal) {
                console.log('historyManagerWatch', val, oldVal);
            },
            deep: true
        }
    }
});
