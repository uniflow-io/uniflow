(function() {
    Vue.component('text-component', function(resolve) {
        superagent.get('/js/components/text/template.html')
            .end(function(err, res) {
                resolve({
                    template: res.text
                });
            });
    })
})();