.PHONY: clean local-testing-build build-preprod build deploy-preprod deploy run

clean:
	rm -rf .cache public

local-testing-build: clean
	npm run build-preprod
	symfony server:ca:install
	(cd public; symfony server:start)

run:
	npm run dev

build-development: clean
	npm run build-development

build-preprod: clean
	npm run build-preprod

build: clean
	npm run build

serve: build-development
	npm run serve

