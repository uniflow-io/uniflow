(function() {
    Vue.component('home-page', function(resolve) {
        superagent
            .get('/js/pages/home/template.html')
            .end(function(err, res) {
                var component = Vue.extend({
                    template: res.text
                });

                resolve(component);
            });
    })
})();