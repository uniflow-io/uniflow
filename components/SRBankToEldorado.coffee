noflo = require 'noflo'

class SRBankToEldorado extends noflo.Component
  description: 'SRBankToEldorado component base'
  icon: 'SRBankToEldorado'

  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'all'

    @outPorts =
      out: new noflo.Port 'all'

    @inPorts.in.on 'data', (data) =>
      @outPorts.out.send data if @outPorts.out.isAttached()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()

exports.getComponent = -> new SRBankToEldorado()
