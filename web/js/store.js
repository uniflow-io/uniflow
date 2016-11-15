import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

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
                },
                tags: function (state) {
                    var tags = Object.keys(state.items).reduce(function(previous, key) {
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
                    return new Promise((resolve, reject) => {
                        request.get(serverService.getBaseUrl() + '/history/list')
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    context.commit('clearHistory');

                                    for (var i = 0; i < res.body.length; i++) {
                                        var item = res.body[i];
                                        item.created = moment(item.created);
                                        item.updated = moment(item.updated);

                                        context.commit('updateHistory', item);
                                    }

                                    resolve();
                                }
                            });
                    });
                },
                createHistory: function (context, item) {
                    var data = {
                        title: item.title,
                        tags: item.tags
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
                updateHistory: function (context, item) {
                    var data = {
                        title: item.title,
                        tags: item.tags
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
                },
                getHistoryData: function (context, item) {
                    return new Promise((resolve, reject) => {
                        request.get(serverService.getBaseUrl() + '/history/getData/'+item.id)
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(res.body.data);
                                }
                            });
                    });
                },
                setHistoryData: function (context, item) {
                    return new Promise((resolve, reject) => {
                        request.post(serverService.getBaseUrl() + '/history/setData/'+item.id)
                            .send(item.data)
                            .end((error, res) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(res.body);
                                }
                            });
                    });
                },
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
