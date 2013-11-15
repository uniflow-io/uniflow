# This file is part of the searchreplace package.
#
# (c) Mathieu Ledru <matyo91@gmail.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

###
@class GettersAndSettersFilter
###
define ['searchreplace/filter/filter', 'php', 'php.xhr'], (SRFilter) ->
  "use strict"

  class SRPHPFilter extends SRFilter
    ###
    @param {*} input
    @returns {*}
    ###
    update: (input) ->
      path = window.location.pathname
      opts =
        SERVER:
          SCRIPT_FILENAME: path.substring(0, path.length - 1)
        filesystem: new PHP.Adapters.XHRFileSystem()

      php = new PHP(input, opts)
      php.vm.OUTPUT_BUFFER

  SRPHPFilter