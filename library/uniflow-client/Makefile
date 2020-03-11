##
##usage :
##-------

NPM_BIN = ./node_modules/.bin

build: clean ## build
	if [ ! -f .env.local ]; then cp .env .env.local; fi
	$(NPM_BIN)/tsc -b
	$(NPM_BIN)/oclif-dev manifest
	GATSBY_ACTIVE_ENV=local $(NPM_BIN)/gatsby build

clean: ## clean
	rm -rf .cache dist public

dev: ## dev
	GATSBY_ACTIVE_ENV=development $(NPM_BIN)/gatsby develop -p 8090

serve: build ## serve
	NODE_ENV=local ./bin/uniflow-client

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
