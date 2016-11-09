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
        },
        current: function() {
            return this.$store.state.history.current
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
        },
        current: function (val, oldVal) {
            Promise.resolve()
                .then(() => {
                    var item = this.$store.state.history.items[oldVal];
                    if(item) {
                        item.data = this.serialiseFlowData(this.$store.state.flow.stack);
                        return this.$store.commit('updateHistory', item);
                    }
                })
                .then(() => {
                    return this.$store.dispatch('setFlow', []);
                })
                .then(() => {
                    var item = this.$store.state.history.items[val];
                    if(item && item.data) {
                        return this.$store.dispatch('setFlow', this.deserialiseFlowData(item.data));
                    }
                })
            ;
        }
    },
    methods: {
        serialiseFlowData: function (data) {
            var rawData = [];

            for(let i = 0; i < data.length; i++) {
                rawData.push({
                    component: data[i].component,
                    data: data[i].data
                });
            }

            return rawData;
        },
        deserialiseFlowData: function (rawData) {
            var data = [];

            for(let i = 0; i < rawData.length; i++) {
                data.push({
                    component: rawData[i].component,
                    data: rawData[i].data,
                    bus: new Vue()
                });
            }

            return data;
        }
    }
});
