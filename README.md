#========HOSTS

44.44.44.54 uniflow.darkwood.dev

#========VAGRANT

vagrant up

scp -i puphpet/files/dot/ssh/id_rsa ~/.ssh/id_rsa vagrant@uniflow.darkwood.dev:~/.ssh/id_rsa
scp -i puphpet/files/dot/ssh/id_rsa ~/.ssh/id_rsa.pub vagrant@uniflow.darkwood.dev:~/.ssh/id_rsa.pub

#========SSL

openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout server/file.key -out server/file.crt

#========FRONT

    $ cd web
    $ yarn install
    $ ./node_modules/.bin/jspm install