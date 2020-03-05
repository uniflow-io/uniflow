##

EXEC_PHP        = php
CONSOLE         = $(EXEC_PHP) bin/console
COMPOSER        = composer
SYMFONY         = symfony

jwt: ## Generate JWT Certificates
jwt:
	@echo "-------\n>> Get the content of the variable JWT_PASSPHRASE in .env file to use as passphrase\n-------"
	mkdir -p config/jwt
	openssl genrsa -out config/jwt/private.pem -aes256 4096
	openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem

##Symfony
##-------------

first-install: ## First install (DB/Schema/fixtures)
	$(COMPOSER) install
	$(CONSOLE) doctrine:database:create
	$(CONSOLE) doctrine:schema:create
	$(CONSOLE) doctrine:fixtures:load -vvv --no-interaction
	$(CONSOLE) cache:clear --env=prod

fixtures: ## Replay fixtures
	$(CONSOLE) cache:clear
	$(CONSOLE) doctrine:database:drop --force
	$(CONSOLE) doctrine:database:create
	$(CONSOLE) doctrine:schema:update --force
	$(CONSOLE) doctrine:fixtures:load --env=dev --no-interaction

reload-db: ## Reload initial db
	$(CONSOLE) doctrine:schema:drop --force
	bzip2 -dk ./db/dump.sql.bz2
	$(CONSOLE) doctrine:database:import ./db/dump.sql
	rm ./db/dump.sql

schema: ## Update database schema
	$(CONSOLE) doctrine:schema:update --force

update: ## Stop the crap and start working
	$(COMPOSER) install
	$(CONSOLE) doctrine:schema:update --force
	#$(CONSOLE) search:clear
	#$(CONSOLE) search:import
	$(CONSOLE) cache:clear
	$(CONSOLE) cache:clear --env=prod
	php bin/opcache.php

cache: .env vendor
	$(CONSOLE) cache:clear

docker-run:
	docker-compose up -d

run:
	docker-compose up -d
	$(SYMFONY) server:start --port=8091

##
##DevOps
##-------------
fix-cs: ## Fix PHP Coding style
	vendor/bin/php-cs-fixer fix src  --verbose --show-progress=estimating \
    --rules='{"@Symfony" : true, "binary_operator_spaces": {"default" : "align"}, "phpdoc_summary" : false, "phpdoc_no_package" : false, "concat_space": {"spacing": "one"}, "phpdoc_no_empty_return" : false, "trailing_comma_in_multiline_array" : false, "yoda_style" : false}'

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help

##
