define(['vuejs', 'superagent'], function(Vue, superagent) {
    Vue.component('text-component', function(resolve) {
        superagent
            .get('/js/components/text/template.html')
            .end(function(err, res) {
                var component = Vue.extend({
                    template: res.text
                });

                resolve(component);
            });
    })
});