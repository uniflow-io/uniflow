import { Service } from 'typedi';
import { pathToRegexp, Key } from 'path-to-regexp';

const patternCache: {[key: string]: {[key: string]: {re: RegExp, keys: Key[]}}} = {};
const cacheLimit = 10000;
let cacheCount = 0;

@Service()
class Path {
  private compilePath(
    pattern: string,
    options: { end: boolean; strict: boolean; sensitive: boolean }
  ) {
    const cacheKey = '' + options.end + options.strict + options.sensitive;
    const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

    if (cache[pattern]) return cache[pattern];

    const keys: Key[] = [];
    const re = pathToRegexp(pattern, keys, options);
    const compiledPattern = { re: re, keys: keys };

    if (cacheCount < cacheLimit) {
      cache[pattern] = compiledPattern;
      cacheCount++;
    }

    return compiledPattern;
  }

  matchPath(
    pathname: string,
    options: { path: string; exact?: boolean; strict?: boolean; sensitive?: boolean }
  ) {
    const parent = arguments[2];

    if (typeof options === 'string') options = { path: options };

    const _options = options;
    const path = _options.path;
    const _options$exact = _options.exact;
    const exact = _options$exact === undefined ? false : _options$exact;
    const _options$strict = _options.strict;
    const strict = _options$strict === undefined ? false : _options$strict;
    const _options$sensitive = _options.sensitive;
    const sensitive = _options$sensitive === undefined ? false : _options$sensitive;

    if (path == null) return parent;

    const _compilePath = this.compilePath(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive,
    });

    const re = _compilePath.re;
    const keys = _compilePath.keys;
    const match = re.exec(pathname);

    if (!match) return null;

    const url = match[0];
    const values = match.slice(1);
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path: path, // the path pattern used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact: isExact, // whether or not we matched exactly
      params: keys.reduce(function (memo: {[key: string]: string}, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {}),
    };
  }
}

export default Path;
