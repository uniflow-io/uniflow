FROM php:7.2-apache-stretch
MAINTAINER Mathieu Ledru <matyo91@gmail.com>

## update system

RUN set -ex; \
    \
    apt-get update; \
    apt-get upgrade -y; \
    apt-get install -y --no-install-recommends \
        unzip \
        gnupg \
        git \
    ; \
    rm -rf /var/lib/apt/lists/*;

## configure PHP

# install the PHP extensions we need
RUN set -ex; \
    \
    savedAptMark="$(apt-mark showmanual)"; \
    \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        libcurl4-openssl-dev \
        libfreetype6-dev \
        libicu-dev \
        libjpeg-dev \
        libldap2-dev \
        libmcrypt-dev \
        libmemcached-dev \
        libpng-dev \
        libpq-dev \
        libxml2-dev \
    ; \
    \
    debMultiarch="$(dpkg-architecture --query DEB_BUILD_MULTIARCH)"; \
    docker-php-ext-configure gd --with-freetype-dir=/usr --with-png-dir=/usr --with-jpeg-dir=/usr; \
    docker-php-ext-configure ldap --with-libdir="lib/$debMultiarch"; \
    docker-php-ext-install \
        exif \
        gd \
        intl \
        ldap \
        opcache \
        pcntl \
        pdo_mysql \
        pdo_pgsql \
        zip \
    ; \
    \
# pecl will claim success even if one install fails, so we need to perform each install separately
    pecl install APCu-5.1.14; \
    pecl install memcached-3.0.4; \
    pecl install redis-4.2.0; \
    \
    docker-php-ext-enable \
        apcu \
        memcached \
        redis \
    ; \
    \
# reset apt-mark's "manual" list so that "purge --auto-remove" will remove all build dependencies
    apt-mark auto '.*' > /dev/null; \
    apt-mark manual $savedAptMark; \
    ldd "$(php -r 'echo ini_get("extension_dir");')"/*.so \
        | awk '/=>/ { print $3 }' \
        | sort -u \
        | xargs -r dpkg-query -S \
        | cut -d: -f1 \
        | sort -u \
        | xargs -rt apt-mark manual; \
    \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
    rm -rf /var/lib/apt/lists/*

# set recommended PHP.ini settings
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=1'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=10000'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.save_comments=1'; \
        echo 'opcache.revalidate_freq=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini; \
    \
    echo 'apc.enable_cli=1' >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini; \
    \
    echo 'memory_limit=512M' > /usr/local/etc/php/conf.d/memory-limit.ini;


## configure apache

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/back/public

COPY config/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# configure nodejs

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs build-essential

RUN npm install -g yarn

## install uniflow

# download uniflow
ENV UNIFLOW_VERSION 1.1.0

RUN set -ex; \
    \
    curl -fsSL -o uniflow.zip \
        "https://github.com/uniflow-io/app/archive/v${UNIFLOW_VERSION}.zip"; \
    unzip uniflow.zip -d /tmp/; \
    mv /tmp/app-${UNIFLOW_VERSION} /tmp/www; \
    rm -rf /var/www; \
    mv /tmp/www /var;

# fix permissions
RUN set -ex; \
    \
    chown -R www-data:root /var/www; \
    chmod -R g=u /var/www

# install composer
RUN set -ex; \
    \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"; \
    php composer-setup.php --install-dir=/usr/bin --filename=composer; \
    php -r "unlink('composer-setup.php');";

RUN set -ex; \
    \
    (cd /var/www/back; composer install)

# generate JWT
RUN set -ex; \
    \
    mkdir -p /var/www/back/config/jwt; \
    openssl genrsa -out /var/www/back/config/jwt/private.pem -aes256 -passout pass:uniflow 4096; \
    openssl rsa -pubout -in /var/www/back/config/jwt/private.pem -out /var/www/back/config/jwt/public.pem -passin pass:uniflow; \
    chown -R www-data:root /var/www/back/config/jwt

## build front
#RUN set -ex; \
#    \
#    (cd /var/www/front; yarn install); \
#    (cd /var/www/front; yarn build)
#
## build bash
#RUN set -ex; \
#    \
#    (cd /var/www/platform-bash; yarn install); \
#    (cd /var/www/platform-bash; yarn build)

# apply config
COPY config/.env.local /var/www/back/.env.local

VOLUME /var/www
WORKDIR /var/www/back

CMD ["apache2-foreground"]
