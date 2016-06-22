noflo = require 'noflo'
$ = require 'jquery'

class SRBankToEldorado extends noflo.Component
  description: 'SRBankToEldorado component base'
  icon: 'SRBankToEldorado'

  constructor: ->
    @inPorts =
      in: new noflo.ArrayPort 'all'

    @outPorts =
      out: new noflo.Port 'all'

    @inPorts.in.on 'data', (data) =>
      lines = ['!type Bank']
      $input = $(data)
      $lines = $input.find('tr')
      $lines.each ->
        $tr = $(@)

        data =
          'datecompta': $tr.find('td:eq(0) .itemFormReadOnly').text()
          'libelleop' : $tr.find('td:eq(1) .itemFormReadOnly').text()
          'ref'       : $tr.find('td:eq(2) .itemFormReadOnly').text()
          'dateope'   : $tr.find('td:eq(3) .itemFormReadOnly').text()
          'dateval'   : $tr.find('td:eq(4) .itemFormReadOnly').text()
          'debit'     : $tr.find('td:eq(5) .itemFormReadOnly').text().replace(' ', '')
          'credit'    : $tr.find('td:eq(6) .itemFormReadOnly').text().replace(' ', '')

        line = [
          'D' + data['datecompta'],
          'T' + if data['debit'] isnt '' then '-' + data['debit'] else '+' + data['credit'],
          'N' + data['ref'],
          'M' + data['libelleop']
        ]

        ###
        label = data['libelleop']
        if label.match /(MONOPRIX|FRANPRIX)/
          line.push 'L' + 'Alimentation quotidienne'
        else if label.match /SNCF/
          line.push 'L' + 'Transports'
        else if label.match /BIG YOUTH/
          line.push 'L' + 'Salaire'
        ###

        line.push '^'

        lines = lines.concat line

      @outPorts.out.send lines.join("\n") if @outPorts.out.isAttached()

    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect() if @outPorts.out.isAttached()

exports.getComponent = -> new SRBankToEldorado()
