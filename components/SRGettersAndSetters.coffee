noflo = require 'noflo'

class SRGettersAndSetters extends noflo.Component
  description: 'SRGettersAndSetters component base'
  icon: 'SRGettersAndSetters'

  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'all'

    @outPorts =
      out: new noflo.Port 'all'

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send data if @outPorts.out.isAttached()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()

exports.getComponent = -> new SRGettersAndSetters()
