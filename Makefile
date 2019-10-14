run: ## Run local server (with multi-sessions)
	if [ ! -x "$$(command -v tmux)" ]; then brew install tmux; fi
	tmux   new-session "(cd uniflow-api && make run); read" \;  \
	       split-window -h \; \
	       select-pane -t 0  \; \
	       split-window -v "(cd uniflow-front && make run); read" \; \
	       select-pane -t 2

run-api:
	(cd uniflow-api && make run)

run-front:
	(cd uniflow-front && make run)

install-node-client:
	(cd clients/node-client && yarn install)

install-chrome-client:
	(cd clients/chrome-client && yarn install)

install-front:
	(cd clients/uniflow-client && yarn install && yarn link)
	(cd uniflow-front && yarn link uniflow-uniflow-client)

init-remotes:
	git remote add uniflow-api git@gitlab.com:uniflow-io/uniflow-api.git
	git remote add uniflow-front git@gitlab.com:uniflow-io/uniflow-front.git
	git remote add uniflow git@github.com:uniflow-io/uniflow.git
	git remote add docker git@github.com:uniflow-io/docker.git
	git remote add clients-node-client git@github.com:uniflow-io/node-client.git
	git remote add clients-chrome-client git@github.com:uniflow-io/chrome-client.git
	git remote add clients-mac-client git@github.com:uniflow-io/mac-client.git
	git remote add clients-phpstorm-client git@github.com:uniflow-io/phpstorm-client.git
	git remote add clients-server-client git@github.com:uniflow-io/server-client.git
	git remote add clients-uniflow-client git@github.com:uniflow-io/uniflow-client.git

push:
	splitsh-lite --prefix=uniflow-api --target=refs/heads/uniflow-api && git push uniflow-api uniflow-api:master
	splitsh-lite --prefix=uniflow-front --target=refs/heads/uniflow-front && git push uniflow-front uniflow-front:master
	splitsh-lite --prefix=uniflow --target=refs/heads/uniflow && git push uniflow uniflow:master
	splitsh-lite --prefix=docker --target=refs/heads/docker && git push docker docker:master
	splitsh-lite --prefix=clients/node-client --target=refs/heads/clients-node-client && git push clients-node-client clients-node-client:master
	splitsh-lite --prefix=clients/chrome-client --target=refs/heads/clients-chrome-client && git push clients-chrome-client clients-chrome-client:master
	splitsh-lite --prefix=clients/mac-client --target=refs/heads/clients-mac-client && git push clients-mac-client clients-mac-client:master
	splitsh-lite --prefix=clients/phpstorm-client --target=refs/heads/clients-phpstorm-client && git push clients-phpstorm-client clients-phpstorm-client:master
	splitsh-lite --prefix=clients/server-client --target=refs/heads/clients-server-client && git push clients-server-client clients-server-client:master
	splitsh-lite --prefix=clients/uniflow-client --target=refs/heads/clients-uniflow-client && git push clients-uniflow-client clients-uniflow-client:master
