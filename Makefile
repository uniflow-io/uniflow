##
##usage :
##-------

.PHONY: run

DOCKER_COMPOSE ?= docker compose
DOCKER_USER ?= "$(shell id -u):$(shell id -g)"
ENV ?= "dev"

NIX=nix develop --extra-experimental-features nix-command --extra-experimental-features flakes
EXEC_PHP        = php -d memory_limit=-1
CONSOLE         = $(EXEC_PHP) bin/console
COMPOSER        = composer
SYMFONY         = symfony

##
##Dev
##-------------

nix: ## Start nix development
	$(NIX)

php-serve: ## Start php server
	(cd public && php -d memory_limit=-1 -S localhost:8016)

php-asset:
	# php -d memory_limit=-1 bin/console importmap:install
	# php -d memory_limit=-1 bin/console sass:build
	php -d memory_limit=-1 bin/console asset-map:compile

front:
	npm run watch

front-build:
	npm run build

init: ## init
	@make -s docker-compose-check
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm php composer install --no-interaction --no-scripts
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm nodejs
	@make -s install
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) up -d

run: ## run
	@make -s up

asset: ## Build
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm php bin/console sass:build
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm php bin/console asset-map:compile

cache: ## cache
    @ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) exec rm -rf var/cache/* && php -d memory_limit=512M bin/console cache:clear --env=prod --no-warmup && php -d memory_limit=512M bin/console cache:warmup --env=prod

debug: ## debug
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) -f compose.yml -f compose.override.yml -f compose.debug.yml up -d

up: ## up
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) up -d

down: ## down
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) down

install: ## install
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm php bin/console doctrine:database:create
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm php bin/console doctrine:schema:update --force
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm php bin/console sylius:install -s default -n

clean: ## clean
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) down -v

php-shell: ## php-shell
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) exec php sh

node-shell: ## node-shell
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm -i nodejs sh

node-watch: ## node-watch
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) run --rm -i nodejs "npm run watch"

docker-compose-check: ## docker-compose-check
	@$(DOCKER_COMPOSE) version >/dev/null 2>&1 || (echo "Please install docker compose binary or set DOCKER_COMPOSE=\"docker-compose\" for legacy binary" && exit 1)
	@echo "You are using \"$(DOCKER_COMPOSE)\" binary"
	@echo "Current version is \"$$($(DOCKER_COMPOSE) version)\""

dump-database: ## dump-database
	docker compose exec mysql mysqldump -u root uniflow_dev > dump.sql

import-database: ## import-database
	cat dump.sql | docker compose exec -T mysql mysql -u root uniflow_dev

##
##DevOps
##-------------

php-cs-fixer: ## Check and fix coding styles using PHP CS Fixer
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) exec php "(cd tools/php-cs-fixer && composer install && ./vendor/bin/php-cs-fixer fix --config ./.php-cs-fixer.php)"

phpstan: ## Execute PHPStan analysis
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) exec php "(cd tools/phpstan && composer install && ./vendor/bin/phpstan --configuration=../../phpstan.neon)"

phpunit: ## Launch PHPUnit test suite
	composer phpunit

rector: ## Instant Upgrades and Automated Refactoring
	@ENV=$(ENV) DOCKER_USER=$(DOCKER_USER) $(DOCKER_COMPOSE) exec php "(cd tools/rector && composer install && ./vendor/bin/rector process)"


##
## Upsun
##-------------
upsun-init: ## Initialize Upsun project
	upsun init

upsun-push: ## Push to Upsun
	git push upsun

upsun-ssh: ## SSH into Upsun environment
	upsun ssh

upsun-db-dump: ## Create database dump from Upsun
	upsun db:dump

upsun-redeploy: ## Trigger a redeployment on Upsun
	upsun redeploy

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
