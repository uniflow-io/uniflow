##
##usage :
##-------

MAKE = make
NODE_ENV ?= local
NPM_BIN = ./node_modules/.bin

build: clean ## build
	if [ ! -f .env.$(NODE_ENV) ]; then cp .env .env.$(NODE_ENV); fi
	$(NPM_BIN)/tsc -b
	$(NPM_BIN)/oclif-dev manifest

clean: ## clean
	rm -rf dist database.sqlite oclif.manifest.json

dev: ## dev
	NODE_ENV=development $(NPM_BIN)/nodemon

serve: build ## serve
	./bin/uniflow-api

typeorm: ## typeorm
	$(NPM_BIN)/ts-node --transpile-only $(NPM_BIN)/typeorm -f ./src/ormconfig.ts $(CMD)

fixtures: ## fixtures
	$(MAKE) typeorm CMD="schema:drop"
	$(MAKE) typeorm CMD="schema:sync"
	$(NPM_BIN)/ts-node --transpile-only ./src/fixtures.ts

test: ## test
	if [ -f database.test.sqlite ]; then rm database.test.sqlite; fi
	NODE_ENV=test $(MAKE) fixtures
	NODE_ENV=test $(NPM_BIN)/jest --maxWorkers=1

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
