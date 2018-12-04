DOCKER FOR UNIFLOW
==================

This is a complete stack for running [Uniflow](https://github.com/uniflow-io/uniflow) in [Docker](https://www.docker.com/).

Usage
-----

The image contains a LAMP webserver and exposes port 80. To start the container type:

```console
$ docker run -d -p 8080:80 uniflow
```

Now you can access Uniflow at http://localhost:8080/ from your host system.
