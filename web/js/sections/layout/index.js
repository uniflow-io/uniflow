import Vue from 'vue'
import template from './template.html!text'

import HistoryManager from '../managers/historyManager.js'

export default {
    template: template,
    components: {
        'history-manager': HistoryManager
    }
};
