noflo = require 'noflo'

PHP = require '/searchreplace/web/js/lib/php/PHP'
require '/searchreplace/web/js/lib/php/xhr'

class SRGettersAndSetters extends noflo.Component
  description: 'SRGettersAndSetters component base'
  icon: 'SRGettersAndSetters'

  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'all'

    @outPorts =
      out: new noflo.Port 'all'

    @inPorts.in.on 'data', (data) =>
      path = window.location.pathname
      opts =
        SERVER:
          SCRIPT_FILENAME: path.substring(0, path.length - 1)
        filesystem: new PHP.Adapters.XHRFileSystem()

      php = new PHP(data, opts)
      data = php.vm.OUTPUT_BUFFER

      @outPorts.out.send data if @outPorts.out.isAttached()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()

exports.getComponent = -> new SRGettersAndSetters()
