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

node-link-bash-client:
	(cd clients/bash-client && yarn install \
	&& yarn link uniflow-bash-component \
	&& yarn link uniflow-include-component \
	&& yarn link uniflow-prompt-component \
	&& yarn link uniflow-text-component  \
	)

node-link-chrome-client:
	(cd clients/chrome-client && yarn install \
	&& yarn link uniflow-chrome-component \
	&& yarn link uniflow-javascript-component \
	&& yarn link uniflow-text-component  \
	)

node-link:
	(cd uniflow && yarn install && yarn link)
	(cd clients/uniflow-client && yarn install && yarn link)
	(cd clients/bash-client && yarn install && yarn link uniflow-bash-component)
	for d in ./components/*; do (cd "$$d" && yarn install && yarn link && yarn link uniflow); done
	for d in ./components/*; do (c=$${d/.\/components\//uniflow-} && cd uniflow-front && yarn link $$c) done
	(cd uniflow-front && yarn link uniflow && yarn link uniflow-uniflow-client)
