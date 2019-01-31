clean:
	rm -rf .cache public/*

deploy-staging: clean
	yarn build-staging
	ssh admin@ssh.darkwood.fr rm -rf /var/www/preprod.uniflow.io/public/*
	scp -r ./public admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io
	(cd ../clients/bash-client;yarn staging-build)
	ssh admin@ssh.darkwood.fr mkdir -p /var/www/preprod.uniflow.io/public/assets
	scp ../clients/bash-client/dist/js/bash.js admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io/public/assets/bash.js

deploy: clean
	yarn build
	ssh admin@ssh.darkwood.fr rm -rf /var/www/uniflow.io/public/*
	scp -r ./public admin@ssh.darkwood.fr:/var/www/uniflow.io
	(cd ../clients/bash-client;yarn build)
	ssh admin@ssh.darkwood.fr mkdir -p /var/www/uniflow.io/public/assets
	scp ../clients/bash-client/dist/js/bash.js admin@ssh.darkwood.fr:/var/www/uniflow.io/public/assets/bash.js
