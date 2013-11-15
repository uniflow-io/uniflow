# This file is part of the searchreplace package.
#
# (c) Mathieu Ledru <matyo91@gmail.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

###
@class BankToEldoradoFilter
###
define ['searchreplace/filter/filter', 'jquery'], (SRFilter, $) ->
  "use strict"

  class SRBankToEldoradoFilter extends SRFilter
    ###
    @param {*} input
    @returns {*}
    ###
    update: (input) ->
      lines = ['!type Bank']
      $input = $(input)
      $lines = $input.find('tr')
      $lines.each (i)->
        return if i == 0

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
          'D' + data['dateval'],
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

      lines.join("\n")

  SRBankToEldoradoFilter
