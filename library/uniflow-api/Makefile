##
##usage :
##-------

build: clean ## build
	test ! -f .env.local && cp .env .env.local
	tsc -b
	oclif-dev manifest

clean: ## clean
	rm -rf dist database.sqlite oclif.manifest.json

dev: ## dev
	NODE_ENV=development nodemon

serve: build ## serve
	NODE_ENV=local ./bin/uniflow-api

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
