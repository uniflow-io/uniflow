import Vue from 'vue'
import template from './template.html!text'

import SearchMessage from '../../messages/search.js';

import SearchMessageUI from '../../messages-ui/search/index.js';
import SFTPMessageUI from '../../messages-ui/sftp/index.js';
import YAMLMessageUI from '../../messages-ui/yaml/index.js';

var messageUIs = {
    'search': SearchMessageUI,
    'sftp': SFTPMessageUI,
    'yaml': YAMLMessageUI
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
            if(messageUIs[key].prototype.constructor.options.methods.handle(messageType)) {
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
            }]
        };
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
