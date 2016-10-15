import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import request from 'superagent'
import serverService from './services/server.js'

const store = new Vuex.Store({
    modules: {
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
                    state.items[item.id] = item;
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
