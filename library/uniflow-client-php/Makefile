NIX=nix develop --extra-experimental-features nix-command --extra-experimental-features flakes

##
##Dev
##-------------

nix: ## Start nix development
	$(NIX)

install: ## Install dependencies
	$(NIX) --command composer install

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
.PHONY: help

##
