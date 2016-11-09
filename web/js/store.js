import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import request from 'superagent'
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
                }
            },
            mutations: {
                clearHistory: function(state) {
                    state.items = {};
                },
                updateHistory: function(state, item) {
                    Vue.set(state.items, item.id, item);
                },
                setCurrentHistory: function (state, current) {
                    state.current = current;
                }
            },
            actions: {
                fetchHistory: function(context) {
                    return new Promise((resolve, reject) => {
                        request.get(serverService.getBaseUrl() + '/history/list')
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    context.commit('clearHistory');

                                    for (var i = 0; i < res.body.length; i++) {
                                        context.commit('updateHistory', res.body[i]);
                                    }

                                    resolve();
                                }
                            });
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
