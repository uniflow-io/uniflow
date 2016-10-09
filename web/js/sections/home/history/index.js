import Vue from 'vue'
import template from './template.html!text'
import request from 'superagent'
import serverService from '../../../services/server.js'

export default Vue.extend({
    template: template,
    data: function() {
        return {
            history: []
        };
    },
    created: function() {
        request.get(serverService.getBaseUrl() + '/history/list')
            .end((err, res) => {
                if(!err) {
                    this.history = res.body;
                }
            });
    }
});
