clean:
	rm -rf .cache public/*

deploy-preprod: clean
	yarn build-preprod
	ssh admin@ssh.darkwood.fr rm -rf /var/www/preprod.uniflow.io/public/*
	scp -r ./public admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io
	(cd ../clients/node-client;yarn build-preprod)
	ssh admin@ssh.darkwood.fr mkdir -p /var/www/preprod.uniflow.io/public/assets
	scp ../clients/node-client/dist/js/node.js admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io/public/assets/node.js

deploy: clean
	yarn build
	ssh admin@ssh.darkwood.fr rm -rf /var/www/uniflow.io/public/*
	scp -r ./public admin@ssh.darkwood.fr:/var/www/uniflow.io
	(cd ../clients/node-client;yarn build)
	ssh admin@ssh.darkwood.fr mkdir -p /var/www/uniflow.io/public/assets
	scp ../clients/node-client/dist/js/node.js admin@ssh.darkwood.fr:/var/www/uniflow.io/public/assets/node.js

run:
	yarn dev
