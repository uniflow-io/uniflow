define(['vuejs', 'superagent'], function(Vue, superagent) {
    superagent
        .get('/js/pages/layout/template.html')
        .end(function(err, res) {
            return Vue.extend({
                template: res.text
            });
        });
});
