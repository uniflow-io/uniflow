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

init-remotes:
	git remote add uniflow-api git@gitlab.com:uniflow-io/uniflow-api.git
	git remote add uniflow-front git@gitlab.com:uniflow-io/uniflow-front.git
	git remote add uniflow git@github.com:uniflow-io/uniflow.git
	git remote add docker git@github.com:uniflow-io/docker.git
	git remote add clients-bash-client git@github.com:uniflow-io/bash-client.git
	git remote add clients-chrome-client git@github.com:uniflow-io/chrome-client.git
	git remote add clients-mac-client git@github.com:uniflow-io/mac-client.git
	git remote add clients-phpstorm-client git@github.com:uniflow-io/phpstorm-client.git
	git remote add clients-server-client git@github.com:uniflow-io/server-client.git
	git remote add clients-uniflow-client git@github.com:uniflow-io/uniflow-client.git
	# git remote add components-assets-component git@github.com:uniflow-io/assets-component.git
	# git remote add components-bash-component git@github.com:uniflow-io/bash-component.git
	# git remote add components-browser-component git@github.com:uniflow-io/browser-component.git
	# git remote add components-canvas-component git@github.com:uniflow-io/canvas-component.git
	# git remote add components-checkboxes-component git@github.com:uniflow-io/checkboxes-component.git
	# git remote add components-chrome-component git@github.com:uniflow-io/chrome-component.git
	# git remote add components-if-component git@github.com:uniflow-io/if-component.git
	# git remote add components-include-component git@github.com:uniflow-io/include-component.git
	# git remote add components-javascript-component git@github.com:uniflow-io/javascript-component.git
	# git remote add components-object-component git@github.com:uniflow-io/object-component.git
	# git remote add components-prompt-component git@github.com:uniflow-io/prompt-component.git
	# git remote add components-regex-component git@github.com:uniflow-io/regex-component.git
	# git remote add components-select-component git@github.com:uniflow-io/select-component.git
	# git remote add components-socketio-component git@github.com:uniflow-io/socketio-component.git
	# git remote add components-text-component git@github.com:uniflow-io/text-component.git
	# git remote add components-textlist-component git@github.com:uniflow-io/textlist-component.git
	# git remote add components-while-component git@github.com:uniflow-io/while-component.git
	# git remote add components-yaml-component git@github.com:uniflow-io/yaml-component.git


split:
	splitsh-lite --prefix=uniflow-api --target=refs/heads/uniflow-api && git push uniflow-api uniflow-api:master
	splitsh-lite --prefix=uniflow-front --target=refs/heads/uniflow-front && git push uniflow-front uniflow-front:master
	splitsh-lite --prefix=uniflow --target=refs/heads/uniflow && git push uniflow uniflow:master
	splitsh-lite --prefix=docker --target=refs/heads/docker && git push docker docker:master
	splitsh-lite --prefix=clients/bash-client --target=refs/heads/clients-bash-client && git push clients-bash-client clients-bash-client:master
	splitsh-lite --prefix=clients/chrome-client --target=refs/heads/clients-chrome-client && git push clients-chrome-client clients-chrome-client:master
	splitsh-lite --prefix=clients/mac-client --target=refs/heads/clients-mac-client && git push clients-mac-client clients-mac-client:master
	splitsh-lite --prefix=clients/phpstorm-client --target=refs/heads/clients-phpstorm-client && git push clients-phpstorm-client clients-phpstorm-client:master
	splitsh-lite --prefix=clients/server-client --target=refs/heads/clients-server-client && git push clients-server-client clients-server-client:master
	splitsh-lite --prefix=clients/uniflow-client --target=refs/heads/clients-uniflow-client && git push clients-uniflow-client clients-uniflow-client:master
	# splitsh-lite --prefix=components/assets-component --target=refs/heads/components-assets-component && git push components-assets-component components-assets-component:master
	# splitsh-lite --prefix=components/bash-component --target=refs/heads/components-bash-component && git push components-bash-component components-bash-component:master
	# splitsh-lite --prefix=components/browser-component --target=refs/heads/components-browser-component && git push components-browser-component components-browser-component:master
	# splitsh-lite --prefix=components/canvas-component --target=refs/heads/components-canvas-component && git push components-canvas-component components-canvas-component:master
	# splitsh-lite --prefix=components/checkboxes-component --target=refs/heads/components-checkboxes-component && git push components-checkboxes-component components-checkboxes-component:master
	# splitsh-lite --prefix=components/chrome-component --target=refs/heads/components-chrome-component && git push components-chrome-component components-chrome-component:master
	# splitsh-lite --prefix=components/if-component --target=refs/heads/components-if-component && git push components-if-component components-if-component:master
	# splitsh-lite --prefix=components/include-component --target=refs/heads/components-include-component && git push components-include-component components-include-component:master
	# splitsh-lite --prefix=components/javascript-component --target=refs/heads/components-javascript-component && git push components-javascript-component components-javascript-component:master
	# splitsh-lite --prefix=components/object-component --target=refs/heads/components-object-component && git push components-object-component components-object-component:master
	# splitsh-lite --prefix=components/prompt-component --target=refs/heads/components-prompt-component && git push components-prompt-component components-prompt-component:master
	# splitsh-lite --prefix=components/regex-component --target=refs/heads/components-regex-component && git push components-regex-component components-regex-component:master
	# splitsh-lite --prefix=components/select-component --target=refs/heads/components-select-component && git push components-select-component components-select-component:master
	# splitsh-lite --prefix=components/socketio-component --target=refs/heads/components-socketio-component && git push components-socketio-component components-socketio-component:master
	# splitsh-lite --prefix=components/text-component --target=refs/heads/components-text-component && git push components-text-component components-text-component:master
	# splitsh-lite --prefix=components/textlist-component --target=refs/heads/components-textlist-component && git push components-textlist-component components-textlist-component:master
	# splitsh-lite --prefix=components/while-component --target=refs/heads/components-while-component && git push components-while-component components-while-component:master
	# splitsh-lite --prefix=components/yaml-component --target=refs/heads/components-yaml-component && git push components-yaml-component components-yaml-component:master
