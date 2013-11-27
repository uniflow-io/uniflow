noflo = require 'noflo'

class SRReplace extends noflo.Component
  description: 'SRReplace component base'
  icon: 'SRReplace'

  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'all'

    @outPorts =
      out: new noflo.Port 'all'

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send data if @outPorts.out.isAttached()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()

exports.getComponent = -> new SRReplace()
