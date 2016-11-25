import Vue from 'vue'
import Vuex from 'vuex'
import History from './models/history.js'
import moment from 'moment'

Vue.use(Vuex);

import request from 'axios'
import serverService from './services/server.js'

const store = new Vuex.Store({
    modules: {
        flow: {
            state: {
                stack: []
            },
            mutations: {
                pushFlow: function (state, payload) {
                    state.stack.splice(payload.index, 0, {
                        component: payload.component,
                        bus: new Vue()
                    });
                },
                popFlow: function (state, payload) {
                    state.stack.splice(payload.index, 1);
                },
                updateFlow: function (state, payload) {
                    state.stack[payload.index].data = payload.data;
                },
                setFlow: function (state, stack) {
                    state.stack = stack;
                }
            },
            actions: {
                setFlow: function (context, stack) {
                    return new Promise((resolve) => {
                        context.commit('setFlow', []);

                        Vue.nextTick(() => {
                            context.commit('setFlow', stack.slice(0));

                            Vue.nextTick(resolve);
                        });
                    });
                }
            }
        },
        history: {
            state: {
                items: {},
                current: null,
            },
            getters: {
                currentHistory: function(state) {
                    return state.current ? state.items[state.current] : null;
                },
                tags: function (state) {
                    let tags = Object.keys(state.items).reduce(function(previous, key) {
                        return previous.concat(state.items[key].tags);
                    }, []);

                    //filter unique
                    tags = tags.filter(function(value, index, self) {
                        return self.indexOf(value) === index;
                    });

                    return tags;
                }
            },
            mutations: {
                clearHistory: function(state) {
                    state.items = {};
                },
                updateHistory: function(state, item) {
                    Vue.set(state.items, item.id, item);
                },
                deleteHistory: function(state, item) {
                    if(item.id == state.current) {
                        state.current = null;
                    }

                    Vue.delete(state.items, item.id);
                },
                setCurrentHistory: function (state, current) {
                    state.current = current;
                }
            },
            actions: {
                fetchHistory: function(context) {
                    return request
                        .get(serverService.getBaseUrl() + '/history/list')
                        .then((response) => {
                            context.commit('clearHistory');

                            for (let i = 0; i < response.data.length; i++) {
                                let item = new History(response.data[i]);

                                context.commit('updateHistory', item);
                            }
                        });
                },
                createHistory: function (context, item) {
                    let data = {
                        title: item.title,
                        tags: item.tags
                    };

                    return request
                        .post(serverService.getBaseUrl() + '/history/create', data)
                        .then((response) => {
                            let item = new History(response.data);

                            context.commit('updateHistory', item);

                            return item;
                        });
                },
                updateHistory: function (context, item) {
                    let data = {
                        title: item.title,
                        tags: item.tags
                    };

                    return request
                        .post(serverService.getBaseUrl() + '/history/edit/'+item.id, data)
                        .then((response) => {
                            let item = new History(response.data);

                            context.commit('updateHistory', item);

                            return item;
                        });
                },
                getHistoryData: function (context, item) {
                    return request
                        .get(serverService.getBaseUrl() + '/history/getData/'+item.id)
                        .then((response) => {
                            return response.data.data;
                        });
                },
                setHistoryData: function (context, item) {
                    return request
                        .post(serverService.getBaseUrl() + '/history/setData/'+item.id, item.data)
                        .then((response) => {
                            item.updated = moment();

                            context.commit('updateHistory', item);

                            return response.data;
                        });
                },
                deleteHistory: function (context, item) {
                    return request
                        .delete(serverService.getBaseUrl() + '/history/delete/'+item.id)
                        .then((response) => {
                            context.commit('deleteHistory', item);

                            return response.data;
                        });
                },
                setCurrentHistory: function (context, current) {
                    context.commit('setCurrentHistory', current);

                    return Promise.resolve(current);
                }
            }
        }
    }
});

export default store;
