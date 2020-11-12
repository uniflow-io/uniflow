##
##usage :
##-------

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

typeorm-cli: ## typeorm-cli : NODE_ENV=development make typeorm-cli CMD="migration:generate -n Name"
	$(NPM_BIN)/ts-node --transpile-only $(NPM_BIN)/typeorm -f ./src/ormconfig.ts $(CMD)

test: ## test
	if [ -f database.test.sqlite ]; then rm database.test.sqlite; fi
	NODE_ENV=test $(NPM_BIN)/ts-node --transpile-only $(NPM_BIN)/typeorm -f ./src/ormconfig.ts schema:sync
	NODE_ENV=test $(NPM_BIN)/ts-node --transpile-only ./src/fixtures.ts
	NODE_ENV=test $(NPM_BIN)/jest --maxWorkers=1

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##