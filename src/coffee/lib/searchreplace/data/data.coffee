# This file is part of the searchreplace package.
#
# (c) Mathieu Ledru <matyo91@gmail.com>
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

###
The main class required to get started with searchreplace

@class DefaultFilter
###
define ->
  "use strict"

  class SRData
    constructor: (@data = null) ->
    set: (@data) -> @
    get: -> @data

  SRData