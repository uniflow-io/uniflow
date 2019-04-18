DOCKER FOR UNIFLOW
==================

This is a complete stack for running [Uniflow](https://github.com/uniflow-io/uniflow) in [Docker](https://www.docker.com/).

Usage
-----

The image contains a LAMP webserver and exposes port 80. To start the container type:

```console
$ docker-compose up -d
```

Then create the database

```console
$ docker-compose exec app bin/console doctrine:database:create
$ docker-compose exec app bin/console doctrine:schema:update --force
$ docker-compose exec app bin/console --env=dev doctrine:fixtures:load --append
```

Now you can access Uniflow at http://localhost:8080/ from your host system.
