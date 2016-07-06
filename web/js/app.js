import Server from 'services/server.js'

class Coucou {

    a() {
        console.log('dede ss dsd');
    }
}

(new Coucou()).a();
console.log((new Server()).getUrl());
