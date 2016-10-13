import Vue from 'vue'
import template from './template.html!text'

import SearchMessage from '../../../messages/search.js';

import CoreSearchMessageUI from '../../../messages-ui/core/search/index.js';
import CoreSFTPMessageUI from '../../../messages-ui/core/sftp/index.js';
import CoreTextMessageUI from '../../../messages-ui/core/text/index.js';
import CoreYAMLMessageUI from '../../../messages-ui/core/yaml/index.js';
import CoreReplaceMessageUI from '../../../messages-ui/core/replace/index.js';

import DecleorTradsMessageUI from '../../../messages-ui/decleor/trads/index.js';

var messageUIs = {
    'core-search': CoreSearchMessageUI,
    'core-sftp': CoreSFTPMessageUI,
    'core-yaml': CoreYAMLMessageUI,
    'core-text': CoreTextMessageUI,
    'core-replace': CoreReplaceMessageUI,

    'decleor-trads': DecleorTradsMessageUI,
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
                if(undefined === handleTypes[i] || messageType === handleTypes[i] || messageType instanceof handleTypes[i]) {
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
            stack: [{
                component: 'core-search-message-ui',
                message: new SearchMessage(dependComponents())
            }, {
                component: 'decleor-trads-message-ui',
                message: new SearchMessage(dependComponents())
            }]
        };
    },
    computed: {
        history: {
            get: function () {
                return this.$store.getters.currentHistory;
            },
            set: function (value) {
                console.log('de ', value)
            }
        }
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
                    component: 'core-search-message-ui',
                    message: new SearchMessage(dependComponents(data), data)
                });
            }
        }
    },
    components: components
});
