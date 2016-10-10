import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import request from 'superagent'
import serverService from './services/server.js'

const store = new Vuex.Store({
    modules: {
        history: {
            state: {
                items: {}
            },
            mutations: {
                clear: function(state) {
                    state.items = {};
                },
                update: function(state, item) {
                    state.items[item.id] = item;
                }
            },
            actions: {
                getHistory: function(context) {
                    request.get(serverService.getBaseUrl() + '/history/list')
                        .end((err, res) => {
                            if(!err) {
                                context.commit('clear');

                                for(var i = 0; i < res.body.length; i++) {
                                    context.commit('update', res.body[i]);
                                }
                            }
                        });
                }
            }
        }
    }
});

export default store;
