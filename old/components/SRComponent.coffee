noflo = require 'noflo'

class SRComponent extends noflo.Component
  description: 'SRComponent component base'
  icon: 'SRComponent'

  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'all'

    @outPorts =
      out: new noflo.Port 'all'

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send data if @outPorts.out.isAttached()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()

exports.getComponent = -> new SRComponent()
