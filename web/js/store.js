import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

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
                createHistory: function (context, item) {
                    var data = {
                        title: item.title
                    };

                    return new Promise((resolve, reject) => {
                        request.post(serverService.getBaseUrl() + '/history/create')
                            .send(data)
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    context.commit('updateHistory', res.body);

                                    resolve(res.body);
                                }
                            });
                    });
                },
                updateHistory: _.debounce(function (context, item) {
                    var data = {
                        title: item.title
                    };

                    return new Promise((resolve, reject) => {
                        request.post(serverService.getBaseUrl() + '/history/edit/'+item.id)
                            .send(data)
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    //context.commit('updateHistory', res.body);

                                    resolve(res.body);
                                }
                            });
                    });
                }, 500),
                deleteHistory: function (context, item) {
                    return new Promise((resolve, reject) => {
                        request.del(serverService.getBaseUrl() + '/history/delete/'+item.id)
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    context.commit('deleteHistory', item);

                                    resolve(res.body);
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
