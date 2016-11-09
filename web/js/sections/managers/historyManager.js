import Vue from 'vue'

export default Vue.extend({
    created: function () {
        this.$store.dispatch('fetchHistory').then(() => {
            if(this.$route.name == 'homeDetail') {
                this.changeHistory(this.$route.params.id);
            } else {
                var keys = Object.keys(this.history);
                if(keys.length > 0) {
                    var item = this.history[keys[0]];
                    this.changeHistory(item.id);
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
                this.changeHistory(to.params.id);
            }
        },
        history: {
            handler: function (val, oldVal) {
                console.log('historyManagerWatch', val, oldVal);
            },
            deep: true
        }
    },
    methods: {
        serialiseFlowData: function (data) {
            data = data.slice(0);

            for(let i = 0; i < data.length; i++) {
                delete data[i].bus
            }

            return data;
        },
        deserialiseFlowData: function (data) {
            data = data.slice(0);

            for(let i = 0; i < data.length; i++) {
                data[i].bus = new Vue();
            }

            return data;
        },
        changeHistory: function (current) {
            Promise.resolve()
                .then(() => {
                    var currentHistory = this.$store.getters.currentHistory;
                    if(currentHistory) {
                        currentHistory.data = this.serialiseFlowData(this.$store.state.flow.stack);
                        return this.$store.commit('updateHistory', currentHistory);
                    }
                })
                .then(() => {
                    return this.$store.dispatch('setCurrentHistory', current);
                })
                .then(() => {
                    return this.$store.dispatch('setFlow', []);
                })
                .then(() => {
                    var currentHistory = this.$store.getters.currentHistory;
                    if(currentHistory && currentHistory.data) {
                        return this.$store.dispatch('setFlow', this.deserialiseFlowData(currentHistory.data));
                    }
                })
            ;
        }
    }
});
