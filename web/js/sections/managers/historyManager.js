import Vue from 'vue'

export default Vue.extend({
    created: function () {
        this.$store.dispatch('getHistory')
    }
});
