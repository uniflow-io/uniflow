import pathToRegexp from 'path-to-regexp'

let patternCache = {}
let cacheLimit = 10000
let cacheCount = 0

let compilePath = function compilePath(pattern, options) {
  let cacheKey = '' + options.end + options.strict + options.sensitive
  let cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

  if (cache[pattern]) return cache[pattern]

  let keys = []
  let re = pathToRegexp(pattern, keys, options)
  let compiledPattern = { re: re, keys: keys }

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern
    cacheCount++
  }

  return compiledPattern
}

/**
 * Public API for matching a URL pathname to a path pattern.
 */
let matchPath = function matchPath(pathname) {
  let options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
  let parent = arguments[2]

  if (typeof options === 'string') options = { path: options }

  let _options = options,
    path = _options.path,
    _options$exact = _options.exact,
    exact = _options$exact === undefined ? false : _options$exact,
    _options$strict = _options.strict,
    strict = _options$strict === undefined ? false : _options$strict,
    _options$sensitive = _options.sensitive,
    sensitive = _options$sensitive === undefined ? false : _options$sensitive

  if (path == null) return parent

  let _compilePath = compilePath(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive,
    }),
    re = _compilePath.re,
    keys = _compilePath.keys

  let match = re.exec(pathname)

  if (!match) return null

  let url = match[0],
    values = match.slice(1)

  let isExact = pathname === url

  if (exact && !isExact) return null

  return {
    path: path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact: isExact, // whether or not we matched exactly
    params: keys.reduce(function(memo, key, index) {
      memo[key.name] = values[index]
      return memo
    }, {}),
  }
}

export default matchPath
