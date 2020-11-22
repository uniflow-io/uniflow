##
##usage :
##-------

LERNA        = ./node_modules/.bin/lerna

clean: ## clean
	$(LERNA) run clean;
	$(LERNA) clean -y;
	rm -rf ./node_modules

install: ## install
	npm install
	$(LERNA) bootstrap --hoist --no-ci

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
