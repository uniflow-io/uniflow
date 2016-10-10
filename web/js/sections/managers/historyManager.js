import Vue from 'vue'

export default Vue.extend({
    created: function () {
        this.$store.dispatch('getHistory')
    },
    computed: {
        history: function() {
            return this.$store.state.history.items
        }
    },
    watch: {
        history: {
            handler: function (val, oldVal) {
                console.log(val, oldVal);
            },
            deep: true
        }
    }
});
