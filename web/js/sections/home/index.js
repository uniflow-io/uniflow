import Vue from 'vue'
import template from './template.html!text'
import request from 'superagent'
import serverService from 'services/server.js'

import SearchMessage from '../../messages/search.js';

import SearchMessageUI from '../../messages-ui/search/index.js';
import SFTPMessageUI from '../../messages-ui/sftp/index.js';
import TextMessageUI from '../../messages-ui/text/index.js';
import YAMLMessageUI from '../../messages-ui/yaml/index.js';
import ReplaceMessageUI from '../../messages-ui/replace/index.js';

var messageUIs = {
    'search': SearchMessageUI,
    'sftp': SFTPMessageUI,
    'yaml': YAMLMessageUI,
    'text': TextMessageUI,
    'replace': ReplaceMessageUI
};

var components = {};
for (var key in messageUIs) {
    if(messageUIs.hasOwnProperty(key)) {

        components[key + '-message-ui'] = messageUIs[key];
    }
}

var dependComponents = function(messageType) {
    var options = {};

    for (var key in messageUIs) {
        if(messageUIs.hasOwnProperty(key)) {
            var canHandleTyle = false;
            var handleTypes = messageUIs[key].prototype.constructor.options.methods.handleTypes();
            for(var i = 0; i < handleTypes.length; i++) {
                if(messageType === handleTypes[i] || messageType instanceof handleTypes[i]) {
                    canHandleTyle = true;
                }
            }
            if(canHandleTyle) {
                options[key + '-message-ui'] = key;
            }
        }
    }

    return options;
};

export default Vue.extend({
    template: template,
    data: function() {
        return {
            title: 'Trads add',
            tags: ['decleor', 'traductions'],
            stack: [{
                component: 'search-message-ui',
                message: new SearchMessage(dependComponents())
            }],
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
    },
    events: {
        'message': function(data) {
            if(data instanceof SearchMessage) {
                this.stack.pop();
                this.stack.push({
                    component: data.search,
                    message: data.message
                });
            } else {
                this.stack.push({
                    component: 'search-message-ui',
                    message: new SearchMessage(dependComponents(data), data)
                });
            }
        }
    },
    components: components
});
