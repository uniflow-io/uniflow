##
##usage :
##-------

build: clean ## build
	test ! -f .env.local && cp .env .env.local
	tsc -b
	oclif-dev manifest
	GATSBY_ACTIVE_ENV=local gatsby build

clean: ## clean
	rm -rf .cache dist public

dev: ## dev
	GATSBY_ACTIVE_ENV=development gatsby develop -p 8090

serve: build ## serve
	NODE_ENV=local ./bin/uniflow-client

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
