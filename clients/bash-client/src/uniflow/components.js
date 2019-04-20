const BashComponent = require('uniflow-bash-component/clients/bash/index')
const IncludeComponent = require('uniflow-include-component/clients/bash/index')
const PromptComponent = require('uniflow-prompt-component/clients/bash/index')
const TextComponent = require('uniflow-text-component/clients/bash/index')

module.exports = {
    'bash': BashComponent,
    'include': IncludeComponent,
    'prompt': PromptComponent,
    'text': TextComponent,
}
