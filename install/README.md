Altarea site officiel x Docker
======

## Vhost

First

`./install/run.sh` 

Then copy your generated vhost file to by-docker-env/apache/vhosts.

## Docker Sync

Add the code below to your docker-sync.yml :

```
syncs:
    ....
    darkwood-uniflow-sync:
        src: './../darkwood-uniflow'
        sync_args: '-prefer newer'
        sync_excludes: ['.gitignore', '.git/', '.idea/', 'puphpet/', 'var/cache/', 'var/logs/']
```

Add the code below to your docker-composer.yml on php-fpm and apache containers :

```
apache: (or php-fpm:)
    volumes:
        ...
        - darkwood-uniflow-sync:/var/www/darkwood-uniflow:rw
```

And this on the key `volumes` of your docker-composer.yml file

```
volumes:
  ...
  darkwood-uniflow-sync:
    external: true
```