import Vue from 'vue'
import template from './template.html!text'

export default Vue.extend({
    template: template,
    data: function() {
        return {
            items: [{
                component: 'search-component'
            }]
        };
    },
    events: {
        'message': function(data) {
            //console.log(data);

            this.items.push({
                component: 'yaml-component',
                message: data
            });
        }
    }
});
