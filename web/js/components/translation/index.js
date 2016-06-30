define(['vuejs', 'superagent'], function(Vue, superagent) {
    Vue.component('translation-component', function(resolve) {
        superagent
            .get('/js/components/translation/template.html')
            .end(function(err, res) {
                var component = Vue.extend({
                    template: res.text,
                    data() {
                        return {
                            'host': 'localhost',
                            'port':  2222,
                            'username': 'math',
                            'root': '/Users/math/Sites',
                            'privateKey': '/var/www/puphpet/files/dot/ssh/my_id_rsa',
                            'symfonyPath': '/Users/math/Sites/decleor',
                            'content': 'coucuo'
                        }
                    },
                    onSubmit() {
                        console.log('deed')
                    }
                });

                resolve(component);
            });
    })
});