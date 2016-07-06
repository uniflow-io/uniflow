define(['vuejs', 'superagent'], function(Vue, superagent) {
    Vue.component('faq-page', function(resolve) {
        superagent
            .get('/js/pages/faq/template.html')
            .end(function(err, res) {
                var component = Vue.extend({
                    template: res.text
                });

                resolve(component);
            });
    })
});
