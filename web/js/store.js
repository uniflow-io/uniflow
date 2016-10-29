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
                    state.stack.splice(payload.index, 0, payload.item);
                },
                popFlow: function (state, payload) {
                    state.stack.splice(payload.index, 1);
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
                getDetailHistory: function(context) {

                }
            }
        }
    }
});

export default store;
