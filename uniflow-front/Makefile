clean:
	rm -rf .cache public/*

deploy-preprod: clean
	yarn build-preprod
	ssh admin@ssh.darkwood.fr rm -rf /var/www/preprod.uniflow.io/public/*
	scp -r ./public admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io
	(cd ../clients/bash-client;yarn build-preprod)
	ssh admin@ssh.darkwood.fr mkdir -p /var/www/preprod.uniflow.io/public/assets
	scp ../clients/bash-client/dist/js/bash.js admin@ssh.darkwood.fr:/var/www/preprod.uniflow.io/public/assets/bash.js

deploy: clean
	yarn build
	ssh admin@ssh.darkwood.fr rm -rf /var/www/uniflow.io/public/*
	scp -r ./public admin@ssh.darkwood.fr:/var/www/uniflow.io
	(cd ../clients/bash-client;yarn build)
	ssh admin@ssh.darkwood.fr mkdir -p /var/www/uniflow.io/public/assets
	scp ../clients/bash-client/dist/js/bash.js admin@ssh.darkwood.fr:/var/www/uniflow.io/public/assets/bash.js

run: ## Run local server (with multi-sessions)
	if [ ! -x "$(command -v tmux)" ]; then brew install tmux; fi
	tmux   new-session "(cd ../uniflow-api && make run-back); read" \;  \
	       split-window -h \; \
	       select-pane -t 0  \; \
	       split-window -v "yarn dev; read" \; \
	       select-pane -t 2
