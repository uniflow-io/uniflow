clean:
	rm -rf .cache public/*

deploy-staging: clean
	yarn build-staging
	ssh admin@ssh.darkwood.fr rm -rf /var/www/preprod.uniflow.io/public/*
    scp -r ./public admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io

deploy: clean
	yarn build
	ssh admin@ssh.darkwood.fr rm -rf /var/www/uniflow.io/public/*
    scp -r ./public admin@ssh.darkwood.fr:/var/www/uniflow.io
