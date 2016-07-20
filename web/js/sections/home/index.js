import Vue from 'vue'
import template from './template.html!text'
import $ from 'jquery'

import SearchComponent from './search/index.js'

import SearchMessage from '../../messages/search.js'

import SFTPMessageUI from '../../messages-ui/sftp/index.js';
import YAMLMessageUI from '../../messages-ui/yaml/index.js';

var messageUIs = {
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
            options[key + '-message-ui'] = key;
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
                component: 'search-component',
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
            }
        }
    },
    components: $.extend({
        'search-component': SearchComponent,
    }, components)
});
