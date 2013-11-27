
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-jquery/index.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();

// Expose for component
module.exports = jQuery;

// Expose jQuery to the global object
//window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );

});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-underscore/index.js", function(exports, require, module){
//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = Math.floor(Math.random() * ++index);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = lookupIterator(obj, val);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(obj, val) {
    return _.isFunction(val) ? val : function(obj) { return obj[val]; };
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, val, behavior) {
    var result = {};
    var iterator = lookupIterator(obj, val);
    each(obj, function(value, index) {
      var key = iterator(value, index);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    return group(obj, val, function(result, key, value) {
      (result[key] || (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, val) {
    return group(obj, val, function(result, key, value) {
      result[key] || (result[key] = 0);
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var value = iterator(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    _.reduce(initial, function(memo, value, index) {
      if (isSorted ? (_.last(memo) !== value || !memo.length) : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, []);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Zip together two arrays -- an array of keys and an array of values -- into
  // a single object.
  _.zipObject = function(keys, values) {
    var result = {};
    for (var i = 0, l = keys.length; i < l; i++) {
      result[keys[i]] = values[i];
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        throttling = true;
        result = func.apply(context, args);
      }
      whenDone();
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(flatten(slice.call(arguments, 1), true, []), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // List of HTML entities for escaping.
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  // Regex containing the keys listed immediately above.
  var htmlEscaper = /[&<>"'\/]/g;

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return ('' + string).replace(htmlEscaper, function(match) {
      return htmlEscapes[match];
    });
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\':   '\\',
    "'":    "'",
    r:      '\r',
    n:      '\n',
    t:      '\t',
    u2028:  '\u2028',
    u2029:  '\u2029'
  };

  for (var key in escapes) escapes[escapes[key]] = key;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n((__t=(" + unescape(code) + "))==null?'':_.escape(__t))+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n((__t=(" + unescape(code) + "))==null?'':__t)+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result(obj, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

});
require.register("noflo-fbp/lib/fbp.js", function(exports, require, module){
module.exports = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "start": parse_start,
        "line": parse_line,
        "LineTerminator": parse_LineTerminator,
        "comment": parse_comment,
        "connection": parse_connection,
        "bridge": parse_bridge,
        "leftlet": parse_leftlet,
        "iip": parse_iip,
        "rightlet": parse_rightlet,
        "node": parse_node,
        "component": parse_component,
        "compMeta": parse_compMeta,
        "port": parse_port,
        "anychar": parse_anychar,
        "iipchar": parse_iipchar,
        "_": parse__,
        "__": parse___
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_start() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_line();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_line();
        }
        if (result0 !== null) {
          result0 = (function(offset) { return parser.getResult();  })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_line() {
        var result0, result1, result2, result3, result4, result5, result6;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse__();
        if (result0 !== null) {
          if (input.substr(pos, 7) === "EXPORT=") {
            result1 = "EXPORT=";
            pos += 7;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"EXPORT=\"");
            }
          }
          if (result1 !== null) {
            if (/^[A-Z.0-9_]/.test(input.charAt(pos))) {
              result3 = input.charAt(pos);
              pos++;
            } else {
              result3 = null;
              if (reportFailures === 0) {
                matchFailed("[A-Z.0-9_]");
              }
            }
            if (result3 !== null) {
              result2 = [];
              while (result3 !== null) {
                result2.push(result3);
                if (/^[A-Z.0-9_]/.test(input.charAt(pos))) {
                  result3 = input.charAt(pos);
                  pos++;
                } else {
                  result3 = null;
                  if (reportFailures === 0) {
                    matchFailed("[A-Z.0-9_]");
                  }
                }
              }
            } else {
              result2 = null;
            }
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 58) {
                result3 = ":";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              if (result3 !== null) {
                if (/^[A-Z0-9_]/.test(input.charAt(pos))) {
                  result5 = input.charAt(pos);
                  pos++;
                } else {
                  result5 = null;
                  if (reportFailures === 0) {
                    matchFailed("[A-Z0-9_]");
                  }
                }
                if (result5 !== null) {
                  result4 = [];
                  while (result5 !== null) {
                    result4.push(result5);
                    if (/^[A-Z0-9_]/.test(input.charAt(pos))) {
                      result5 = input.charAt(pos);
                      pos++;
                    } else {
                      result5 = null;
                      if (reportFailures === 0) {
                        matchFailed("[A-Z0-9_]");
                      }
                    }
                  }
                } else {
                  result4 = null;
                }
                if (result4 !== null) {
                  result5 = parse__();
                  if (result5 !== null) {
                    result6 = parse_LineTerminator();
                    result6 = result6 !== null ? result6 : "";
                    if (result6 !== null) {
                      result0 = [result0, result1, result2, result3, result4, result5, result6];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, priv, pub) {return parser.registerExports(priv.join(""),pub.join(""))})(pos0, result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_comment();
          if (result0 !== null) {
            if (/^[\n\r\u2028\u2029]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[\\n\\r\\u2028\\u2029]");
              }
            }
            result1 = result1 !== null ? result1 : "";
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse__();
            if (result0 !== null) {
              if (/^[\n\r\u2028\u2029]/.test(input.charAt(pos))) {
                result1 = input.charAt(pos);
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("[\\n\\r\\u2028\\u2029]");
                }
              }
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              pos1 = pos;
              result0 = parse__();
              if (result0 !== null) {
                result1 = parse_connection();
                if (result1 !== null) {
                  result2 = parse__();
                  if (result2 !== null) {
                    result3 = parse_LineTerminator();
                    result3 = result3 !== null ? result3 : "";
                    if (result3 !== null) {
                      result0 = [result0, result1, result2, result3];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 !== null) {
                result0 = (function(offset, edges) {return parser.registerEdges(edges);})(pos0, result0[1]);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
          }
        }
        return result0;
      }
      
      function parse_LineTerminator() {
        var result0, result1, result2, result3;
        var pos0;
        
        pos0 = pos;
        result0 = parse__();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 44) {
            result1 = ",";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\",\"");
            }
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_comment();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              if (/^[\n\r\u2028\u2029]/.test(input.charAt(pos))) {
                result3 = input.charAt(pos);
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("[\\n\\r\\u2028\\u2029]");
                }
              }
              result3 = result3 !== null ? result3 : "";
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_comment() {
        var result0, result1, result2, result3;
        var pos0;
        
        pos0 = pos;
        result0 = parse__();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 35) {
            result1 = "#";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"#\"");
            }
          }
          if (result1 !== null) {
            result2 = [];
            result3 = parse_anychar();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_anychar();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_connection() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_bridge();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            if (input.substr(pos, 2) === "->") {
              result2 = "->";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"->\"");
              }
            }
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_connection();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, x, y) { return [x,y]; })(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_bridge();
        }
        return result0;
      }
      
      function parse_bridge() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_port();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_node();
            if (result2 !== null) {
              result3 = parse__();
              if (result3 !== null) {
                result4 = parse_port();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, x, proc, y) { return [{"tgt":{process:proc, port:x}},{"src":{process:proc, port:y}}]; })(pos0, result0[0], result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_iip();
          if (result0 === null) {
            result0 = parse_rightlet();
            if (result0 === null) {
              result0 = parse_leftlet();
            }
          }
        }
        return result0;
      }
      
      function parse_leftlet() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_node();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_port();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, proc, port) { return {"src":{process:proc, port:port}} })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_iip() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 39) {
          result0 = "'";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"'\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_iipchar();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_iipchar();
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 39) {
              result2 = "'";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"'\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, iip) { return {"data":iip.join("")} })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_rightlet() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_port();
        if (result0 !== null) {
          result1 = parse__();
          if (result1 !== null) {
            result2 = parse_node();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, port, proc) { return {"tgt":{process:proc, port:port}} })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_node() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9_]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-zA-Z0-9_]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-zA-Z0-9_]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result1 = parse_component();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, node, comp) { if(comp){parser.addNode(node.join(""),comp);}; return node.join("")})(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_component() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          if (/^[a-zA-Z\/\-0-9_]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[a-zA-Z\\/\\-0-9_]");
            }
          }
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              if (/^[a-zA-Z\/\-0-9_]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[a-zA-Z\\/\\-0-9_]");
                }
              }
            }
          } else {
            result1 = null;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_compMeta();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 41) {
                result3 = ")";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\")\"");
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, comp, meta) { var o = {}; comp ? o.comp = comp.join("") : o.comp = ''; meta ? o.meta = meta.join("").split(',') : null; return o; })(pos0, result0[1], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_compMeta() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 58) {
          result0 = ":";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\":\"");
          }
        }
        if (result0 !== null) {
          if (/^[a-zA-Z\/]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[a-zA-Z\\/]");
            }
          }
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              if (/^[a-zA-Z\/]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[a-zA-Z\\/]");
                }
              }
            }
          } else {
            result1 = null;
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, meta) {return meta})(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_port() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (/^[A-Z.0-9_]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[A-Z.0-9_]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[A-Z.0-9_]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[A-Z.0-9_]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result1 = parse___();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, portname) {return portname.join("").toLowerCase()})(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_anychar() {
        var result0;
        
        if (/^[^\n\r\u2028\u2029]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[^\\n\\r\\u2028\\u2029]");
          }
        }
        return result0;
      }
      
      function parse_iipchar() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (/^[\\]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\\\]");
          }
        }
        if (result0 !== null) {
          if (/^[']/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[']");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) { return "'"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          if (/^[^']/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[^']");
            }
          }
        }
        return result0;
      }
      
      function parse__() {
        var result0, result1;
        
        result0 = [];
        if (input.charCodeAt(pos) === 32) {
          result1 = " ";
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("\" \"");
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          if (input.charCodeAt(pos) === 32) {
            result1 = " ";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\" \"");
            }
          }
        }
        result0 = result0 !== null ? result0 : "";
        return result0;
      }
      
      function parse___() {
        var result0, result1;
        
        if (input.charCodeAt(pos) === 32) {
          result1 = " ";
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("\" \"");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (input.charCodeAt(pos) === 32) {
              result1 = " ";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\" \"");
              }
            }
          }
        } else {
          result0 = null;
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
        var parser, edges, nodes; 
      
        parser = this;
      
        edges = parser.edges = [];
        
        parser.exports = []
      
        nodes = {};
      
        parser.addNode = function (nodeName, comp) {
          if (!nodes[nodeName]) {
            nodes[nodeName] = {}
          }
          if (!!comp.comp) {
            nodes[nodeName].component = comp.comp;
          }
          if (!!comp.meta) {
            nodes[nodeName].metadata={routes:comp.meta};
          }
         
        }
      
        parser.getResult = function () {
          return {processes:nodes, connections:parser.processEdges(), exports:parser.exports};
        }  
      
        var flatten = function (array, isShallow) {
          var index = -1,
            length = array ? array.length : 0,
            result = [];
      
          while (++index < length) {
            var value = array[index];
      
            if (value instanceof Array) {
              Array.prototype.push.apply(result, isShallow ? value : flatten(value));
            }
            else {
              result.push(value);
            }
          }
          return result;
        }
        
        parser.registerExports = function (priv, pub) {
          parser.exports.push({private:priv.toLowerCase(), public:pub.toLowerCase()})
        }
      
        parser.registerEdges = function (edges) {
      
          edges.forEach(function (o, i) {
            parser.edges.push(o);
          });
        }  
      
        parser.processEdges = function () {   
          var flats, grouped;
          flats = flatten(parser.edges);
          grouped = [];
          var current = {};
          flats.forEach(function (o, i) {
            if (i % 2 !== 0) { 
              var pair = grouped[grouped.length - 1];
              pair.tgt = o.tgt;
              return;
            }
            grouped.push(o);
          });
          return grouped;
        }
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();
});
require.register("noflo-noflo/src/lib/Graph.js", function(exports, require, module){
var EventEmitter, Graph,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  EventEmitter = require('events').EventEmitter;
} else {
  EventEmitter = require('emitter');
}

Graph = (function(_super) {
  __extends(Graph, _super);

  Graph.prototype.name = '';

  Graph.prototype.properties = {};

  Graph.prototype.nodes = [];

  Graph.prototype.edges = [];

  Graph.prototype.initializers = [];

  Graph.prototype.exports = [];

  Graph.prototype.groups = [];

  function Graph(name) {
    this.name = name != null ? name : '';
    this.properties = {};
    this.nodes = [];
    this.edges = [];
    this.initializers = [];
    this.exports = [];
    this.groups = [];
  }

  Graph.prototype.addExport = function(privatePort, publicPort, metadata) {
    return this.exports.push({
      "private": privatePort.toLowerCase(),
      "public": publicPort.toLowerCase(),
      metadata: metadata
    });
  };

  Graph.prototype.removeExport = function(publicPort) {
    var exported, _i, _len, _ref, _results;
    _ref = this.exports;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      exported = _ref[_i];
      if (!exported) {
        continue;
      }
      if (exported["public"] !== publicPort) {
        continue;
      }
      _results.push(this.exports.splice(this.exports.indexOf(exported), 1));
    }
    return _results;
  };

  Graph.prototype.addGroup = function(group, nodes, metadata) {
    return this.groups.push({
      name: group,
      nodes: nodes,
      metadata: metadata
    });
  };

  Graph.prototype.removeGroup = function(group) {
    var _i, _len, _ref, _results;
    _ref = this.groups;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      if (!group) {
        continue;
      }
      if (group.name !== group) {
        continue;
      }
      _results.push(this.groups.splice(this.groups.indexOf(group), 1));
    }
    return _results;
  };

  Graph.prototype.addNode = function(id, component, metadata) {
    var node;
    if (!metadata) {
      metadata = {};
    }
    node = {
      id: id,
      component: component,
      metadata: metadata
    };
    this.nodes.push(node);
    this.emit('addNode', node);
    return node;
  };

  Graph.prototype.removeNode = function(id) {
    var edge, exported, group, index, initializer, node, privateNode, privatePort, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
    node = this.getNode(id);
    _ref = this.edges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      edge = _ref[_i];
      if (!edge) {
        continue;
      }
      if (edge.from.node === node.id) {
        this.removeEdge(edge.from.node, edge.from.port);
      }
      if (edge.to.node === node.id) {
        this.removeEdge(edge.to.node, edge.to.port);
      }
    }
    _ref1 = this.initializers;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      initializer = _ref1[_j];
      if (!initializer) {
        continue;
      }
      if (initializer.to.node === node.id) {
        this.removeInitial(initializer.to.node, initializer.to.port);
      }
    }
    _ref2 = this.exports;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      exported = _ref2[_k];
      if (!exported) {
        continue;
      }
      _ref3 = exported["private"].split('.'), privateNode = _ref3[0], privatePort = _ref3[1];
      if (privateNode === id.toLowerCase()) {
        this.removeExport(exported["public"]);
      }
    }
    _ref4 = this.groups;
    for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
      group = _ref4[_l];
      if (!group) {
        continue;
      }
      index = group.nodes.indexOf(id) === -1;
      if (index === -1) {
        continue;
      }
      group.nodes.splice(index, 1);
    }
    if (-1 !== this.nodes.indexOf(node)) {
      this.nodes.splice(this.nodes.indexOf(node), 1);
    }
    return this.emit('removeNode', node);
  };

  Graph.prototype.getNode = function(id) {
    var node, _i, _len, _ref;
    _ref = this.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (!node) {
        continue;
      }
      if (node.id === id) {
        return node;
      }
    }
    return null;
  };

  Graph.prototype.renameNode = function(oldId, newId) {
    var edge, exported, group, iip, index, node, privateNode, privatePort, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
    node = this.getNode(oldId);
    if (!node) {
      return;
    }
    node.id = newId;
    _ref = this.edges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      edge = _ref[_i];
      if (!edge) {
        continue;
      }
      if (edge.from.node === oldId) {
        edge.from.node = newId;
      }
      if (edge.to.node === oldId) {
        edge.to.node = newId;
      }
    }
    _ref1 = this.initializers;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      iip = _ref1[_j];
      if (!iip) {
        continue;
      }
      if (iip.to.node === oldId) {
        iip.to.node = newId;
      }
    }
    _ref2 = this.exports;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      exported = _ref2[_k];
      if (!exported) {
        continue;
      }
      _ref3 = exported["private"].split('.'), privateNode = _ref3[0], privatePort = _ref3[1];
      if (privateNode !== oldId.toLowerCase()) {
        continue;
      }
      exported["private"] = "" + (newId.toLowerCase()) + "." + privatePort;
    }
    _ref4 = this.groups;
    for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
      group = _ref4[_l];
      if (!group) {
        continue;
      }
      index = group.nodes.indexOf(oldId);
      if (index === -1) {
        continue;
      }
      group.nodes[index] = newId;
    }
    return this.emit('renameNode', oldId, newId);
  };

  Graph.prototype.addEdge = function(outNode, outPort, inNode, inPort, metadata) {
    var edge;
    if (!this.getNode(outNode)) {
      return;
    }
    if (!this.getNode(inNode)) {
      return;
    }
    if (!metadata) {
      metadata = {};
    }
    edge = {
      from: {
        node: outNode,
        port: outPort
      },
      to: {
        node: inNode,
        port: inPort
      },
      metadata: metadata
    };
    this.edges.push(edge);
    this.emit('addEdge', edge);
    return edge;
  };

  Graph.prototype.removeEdge = function(node, port, node2, port2) {
    var edge, index, _i, _len, _ref, _results;
    _ref = this.edges;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      edge = _ref[index];
      if (!edge) {
        continue;
      }
      if (edge.from.node === node && edge.from.port === port) {
        if (node2 && port2) {
          if (!(edge.to.node === node2 && edge.to.port === port2)) {
            continue;
          }
        }
        this.emit('removeEdge', edge);
        this.edges.splice(index, 1);
      }
      if (edge.to.node === node && edge.to.port === port) {
        if (node2 && port2) {
          if (!(edge.from.node === node2 && edge.from.port === port2)) {
            continue;
          }
        }
        this.emit('removeEdge', edge);
        _results.push(this.edges.splice(index, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Graph.prototype.addInitial = function(data, node, port, metadata) {
    var initializer;
    if (!this.getNode(node)) {
      return;
    }
    initializer = {
      from: {
        data: data
      },
      to: {
        node: node,
        port: port
      },
      metadata: metadata
    };
    this.initializers.push(initializer);
    this.emit('addInitial', initializer);
    return initializer;
  };

  Graph.prototype.removeInitial = function(node, port) {
    var edge, index, _i, _len, _ref, _results;
    _ref = this.initializers;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      edge = _ref[index];
      if (!edge) {
        continue;
      }
      if (edge.to.node === node && edge.to.port === port) {
        this.emit('removeInitial', edge);
        _results.push(this.initializers.splice(index, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Graph.prototype.toDOT = function() {
    var cleanID, cleanPort, data, dot, edge, id, initializer, node, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    cleanID = function(id) {
      return id.replace(/\s*/g, "");
    };
    cleanPort = function(port) {
      return port.replace(/\./g, "");
    };
    dot = "digraph {\n";
    _ref = this.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      dot += "    " + (cleanID(node.id)) + " [label=" + node.id + " shape=box]\n";
    }
    _ref1 = this.initializers;
    for (id = _j = 0, _len1 = _ref1.length; _j < _len1; id = ++_j) {
      initializer = _ref1[id];
      if (typeof initializer.from.data === 'function') {
        data = 'Function';
      } else {
        data = initializer.from.data;
      }
      dot += "    data" + id + " [label=\"'" + data + "'\" shape=plaintext]\n";
      dot += "    data" + id + " -> " + (cleanID(initializer.to.node)) + "[headlabel=" + (cleanPort(initializer.to.port)) + " labelfontcolor=blue labelfontsize=8.0]\n";
    }
    _ref2 = this.edges;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      edge = _ref2[_k];
      dot += "    " + (cleanID(edge.from.node)) + " -> " + (cleanID(edge.to.node)) + "[taillabel=" + (cleanPort(edge.from.port)) + " headlabel=" + (cleanPort(edge.to.port)) + " labelfontcolor=blue labelfontsize=8.0]\n";
    }
    dot += "}";
    return dot;
  };

  Graph.prototype.toYUML = function() {
    var edge, initializer, yuml, _i, _j, _len, _len1, _ref, _ref1;
    yuml = [];
    _ref = this.initializers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      initializer = _ref[_i];
      yuml.push("(start)[" + initializer.to.port + "]->(" + initializer.to.node + ")");
    }
    _ref1 = this.edges;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      edge = _ref1[_j];
      yuml.push("(" + edge.from.node + ")[" + edge.from.port + "]->(" + edge.to.node + ")");
    }
    return yuml.join(",");
  };

  Graph.prototype.toJSON = function() {
    var connection, edge, exported, exportedData, group, groupData, initializer, json, node, property, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    json = {
      properties: {},
      exports: [],
      groups: [],
      processes: {},
      connections: []
    };
    if (this.name) {
      json.properties.name = this.name;
    }
    _ref = this.properties;
    for (property in _ref) {
      value = _ref[property];
      json.properties[property] = value;
    }
    _ref1 = this.exports;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      exported = _ref1[_i];
      exportedData = {
        "public": exported["public"],
        "private": exported["private"]
      };
      if (exported.metadata) {
        exportedData.metadata = exported.metadata;
      }
      json.exports.push(exportedData);
    }
    _ref2 = this.groups;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      group = _ref2[_j];
      groupData = {
        name: group.name,
        nodes: group.nodes
      };
      if (group.metadata) {
        groupData.metadata = group.metadata;
      }
      json.groups.push(groupData);
    }
    _ref3 = this.nodes;
    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
      node = _ref3[_k];
      json.processes[node.id] = {
        component: node.component
      };
      if (node.metadata) {
        json.processes[node.id].metadata = node.metadata;
      }
    }
    _ref4 = this.edges;
    for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
      edge = _ref4[_l];
      connection = {
        src: {
          process: edge.from.node,
          port: edge.from.port
        },
        tgt: {
          process: edge.to.node,
          port: edge.to.port
        }
      };
      if (Object.keys(edge.metadata).length) {
        connection.metadata = edge.metadata;
      }
      json.connections.push(connection);
    }
    _ref5 = this.initializers;
    for (_m = 0, _len4 = _ref5.length; _m < _len4; _m++) {
      initializer = _ref5[_m];
      json.connections.push({
        data: initializer.from.data,
        tgt: {
          process: initializer.to.node,
          port: initializer.to.port
        }
      });
    }
    return json;
  };

  Graph.prototype.save = function(file, success) {
    var json;
    json = JSON.stringify(this.toJSON(), null, 4);
    return require('fs').writeFile("" + file + ".json", json, "utf-8", function(err, data) {
      if (err) {
        throw err;
      }
      return success(file);
    });
  };

  return Graph;

})(EventEmitter);

exports.Graph = Graph;

exports.createGraph = function(name) {
  return new Graph(name);
};

exports.loadJSON = function(definition, success) {
  var conn, def, exported, graph, group, id, metadata, property, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4;
  if (!definition.properties) {
    definition.properties = {};
  }
  if (!definition.processes) {
    definition.processes = {};
  }
  if (!definition.connections) {
    definition.connections = [];
  }
  graph = new Graph(definition.properties.name);
  _ref = definition.properties;
  for (property in _ref) {
    value = _ref[property];
    if (property === 'name') {
      continue;
    }
    graph.properties[property] = value;
  }
  _ref1 = definition.processes;
  for (id in _ref1) {
    def = _ref1[id];
    if (!def.metadata) {
      def.metadata = {};
    }
    graph.addNode(id, def.component, def.metadata);
  }
  _ref2 = definition.connections;
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    conn = _ref2[_i];
    if (conn.data !== void 0) {
      graph.addInitial(conn.data, conn.tgt.process, conn.tgt.port.toLowerCase());
      continue;
    }
    metadata = conn.metadata ? conn.metadata : {};
    graph.addEdge(conn.src.process, conn.src.port.toLowerCase(), conn.tgt.process, conn.tgt.port.toLowerCase(), metadata);
  }
  if (definition.exports) {
    _ref3 = definition.exports;
    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
      exported = _ref3[_j];
      graph.addExport(exported["private"], exported["public"], exported.metadata);
    }
  }
  if (definition.groups) {
    _ref4 = definition.groups;
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      group = _ref4[_k];
      graph.addGroup(group.name, group.nodes, group.metadata);
    }
  }
  return success(graph);
};

exports.loadFBP = function(fbpData, success) {
  var definition;
  definition = require('fbp').parse(fbpData);
  return exports.loadJSON(definition, success);
};

exports.loadFile = function(file, success) {
  var definition, e;
  if (!(typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1)) {
    try {
      definition = require(file);
      exports.loadJSON(definition, success);
    } catch (_error) {
      e = _error;
      throw new Error("Failed to load graph " + file + ": " + e.message);
    }
    return;
  }
  return require('fs').readFile(file, "utf-8", function(err, data) {
    if (err) {
      throw err;
    }
    if (file.split('.').pop() === 'fbp') {
      return exports.loadFBP(data, success);
    }
    definition = JSON.parse(data);
    return exports.loadJSON(definition, success);
  });
};

});
require.register("noflo-noflo/src/lib/InternalSocket.js", function(exports, require, module){
var EventEmitter, InternalSocket,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  EventEmitter = require('events').EventEmitter;
} else {
  EventEmitter = require('emitter');
}

InternalSocket = (function(_super) {
  __extends(InternalSocket, _super);

  function InternalSocket() {
    this.connected = false;
    this.groups = [];
  }

  InternalSocket.prototype.connect = function() {
    if (this.connected) {
      return;
    }
    this.connected = true;
    return this.emit('connect', this);
  };

  InternalSocket.prototype.disconnect = function() {
    if (!this.connected) {
      return;
    }
    this.connected = false;
    return this.emit('disconnect', this);
  };

  InternalSocket.prototype.isConnected = function() {
    return this.connected;
  };

  InternalSocket.prototype.send = function(data) {
    if (!this.connected) {
      this.connect();
    }
    return this.emit('data', data);
  };

  InternalSocket.prototype.beginGroup = function(group) {
    this.groups.push(group);
    return this.emit('begingroup', group);
  };

  InternalSocket.prototype.endGroup = function() {
    return this.emit('endgroup', this.groups.pop());
  };

  InternalSocket.prototype.getId = function() {
    var fromStr, toStr;
    fromStr = function(from) {
      return "" + from.process.id + "() " + (from.port.toUpperCase());
    };
    toStr = function(to) {
      return "" + (to.port.toUpperCase()) + " " + to.process.id + "()";
    };
    if (!(this.from || this.to)) {
      return "UNDEFINED";
    }
    if (this.from && !this.to) {
      return "" + (fromStr(this.from)) + " -> ANON";
    }
    if (!this.from) {
      return "DATA -> " + (toStr(this.to));
    }
    return "" + (fromStr(this.from)) + " -> " + (toStr(this.to));
  };

  return InternalSocket;

})(EventEmitter);

exports.InternalSocket = InternalSocket;

exports.createSocket = function() {
  return new InternalSocket;
};

});
require.register("noflo-noflo/src/lib/Port.js", function(exports, require, module){
var EventEmitter, Port,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  EventEmitter = require('events').EventEmitter;
} else {
  EventEmitter = require('emitter');
}

Port = (function(_super) {
  __extends(Port, _super);

  function Port(type) {
    this.type = type;
    if (!this.type) {
      this.type = 'all';
    }
    this.socket = null;
    this.from = null;
    this.node = null;
    this.name = null;
  }

  Port.prototype.getId = function() {
    if (!(this.node && this.name)) {
      return 'Port';
    }
    return "" + this.node + " " + (this.name.toUpperCase());
  };

  Port.prototype.attach = function(socket) {
    if (this.isAttached()) {
      throw new Error("" + (this.getId()) + ": Socket already attached " + (this.socket.getId()) + " - " + (socket.getId()));
    }
    this.socket = socket;
    return this.attachSocket(socket);
  };

  Port.prototype.attachSocket = function(socket, localId) {
    var _this = this;
    if (localId == null) {
      localId = null;
    }
    this.emit("attach", socket);
    this.from = socket.from;
    if (socket.setMaxListeners) {
      socket.setMaxListeners(0);
    }
    socket.on("connect", function() {
      return _this.emit("connect", socket, localId);
    });
    socket.on("begingroup", function(group) {
      return _this.emit("begingroup", group, localId);
    });
    socket.on("data", function(data) {
      return _this.emit("data", data, localId);
    });
    socket.on("endgroup", function(group) {
      return _this.emit("endgroup", group, localId);
    });
    return socket.on("disconnect", function() {
      return _this.emit("disconnect", socket, localId);
    });
  };

  Port.prototype.connect = function() {
    if (!this.socket) {
      throw new Error("" + (this.getId()) + ": No connection available");
    }
    return this.socket.connect();
  };

  Port.prototype.beginGroup = function(group) {
    var _this = this;
    if (!this.socket) {
      throw new Error("" + (this.getId()) + ": No connection available");
    }
    if (this.isConnected()) {
      return this.socket.beginGroup(group);
    }
    this.socket.once("connect", function() {
      return _this.socket.beginGroup(group);
    });
    return this.socket.connect();
  };

  Port.prototype.send = function(data) {
    var _this = this;
    if (!this.socket) {
      throw new Error("" + (this.getId()) + ": No connection available");
    }
    if (this.isConnected()) {
      return this.socket.send(data);
    }
    this.socket.once("connect", function() {
      return _this.socket.send(data);
    });
    return this.socket.connect();
  };

  Port.prototype.endGroup = function() {
    if (!this.socket) {
      throw new Error("" + (this.getId()) + ": No connection available");
    }
    return this.socket.endGroup();
  };

  Port.prototype.disconnect = function() {
    if (!this.socket) {
      throw new Error("" + (this.getId()) + ": No connection available");
    }
    return this.socket.disconnect();
  };

  Port.prototype.detach = function(socket) {
    if (!this.isAttached(socket)) {
      return;
    }
    this.emit("detach", this.socket);
    this.from = null;
    return this.socket = null;
  };

  Port.prototype.isConnected = function() {
    if (!this.socket) {
      return false;
    }
    return this.socket.isConnected();
  };

  Port.prototype.isAttached = function() {
    return this.socket !== null;
  };

  Port.prototype.canAttach = function() {
    if (this.isAttached()) {
      return false;
    }
    return true;
  };

  return Port;

})(EventEmitter);

exports.Port = Port;

});
require.register("noflo-noflo/src/lib/ArrayPort.js", function(exports, require, module){
var ArrayPort, port,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

port = require("./Port");

ArrayPort = (function(_super) {
  __extends(ArrayPort, _super);

  function ArrayPort(type) {
    this.type = type;
    if (!this.type) {
      this.type = 'all';
    }
    this.sockets = [];
  }

  ArrayPort.prototype.attach = function(socket) {
    this.sockets.push(socket);
    return this.attachSocket(socket, this.sockets.length - 1);
  };

  ArrayPort.prototype.connect = function(socketId) {
    if (socketId == null) {
      socketId = null;
    }
    if (socketId === null) {
      if (!this.sockets.length) {
        throw new Error("" + (this.getId()) + ": No connections available");
      }
      this.sockets.forEach(function(socket) {
        return socket.connect();
      });
      return;
    }
    if (!this.sockets[socketId]) {
      throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
    }
    return this.sockets[socketId].connect();
  };

  ArrayPort.prototype.beginGroup = function(group, socketId) {
    var _this = this;
    if (socketId == null) {
      socketId = null;
    }
    if (socketId === null) {
      if (!this.sockets.length) {
        throw new Error("" + (this.getId()) + ": No connections available");
      }
      this.sockets.forEach(function(socket, index) {
        return _this.beginGroup(group, index);
      });
      return;
    }
    if (!this.sockets[socketId]) {
      throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
    }
    if (this.isConnected(socketId)) {
      return this.sockets[socketId].beginGroup(group);
    }
    this.sockets[socketId].once("connect", function() {
      return _this.sockets[socketId].beginGroup(group);
    });
    return this.sockets[socketId].connect();
  };

  ArrayPort.prototype.send = function(data, socketId) {
    var _this = this;
    if (socketId == null) {
      socketId = null;
    }
    if (socketId === null) {
      if (!this.sockets.length) {
        throw new Error("" + (this.getId()) + ": No connections available");
      }
      this.sockets.forEach(function(socket, index) {
        return _this.send(data, index);
      });
      return;
    }
    if (!this.sockets[socketId]) {
      throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
    }
    if (this.isConnected(socketId)) {
      return this.sockets[socketId].send(data);
    }
    this.sockets[socketId].once("connect", function() {
      return _this.sockets[socketId].send(data);
    });
    return this.sockets[socketId].connect();
  };

  ArrayPort.prototype.endGroup = function(socketId) {
    var _this = this;
    if (socketId == null) {
      socketId = null;
    }
    if (socketId === null) {
      if (!this.sockets.length) {
        throw new Error("" + (this.getId()) + ": No connections available");
      }
      this.sockets.forEach(function(socket, index) {
        return _this.endGroup(index);
      });
      return;
    }
    if (!this.sockets[socketId]) {
      throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
    }
    return this.sockets[socketId].endGroup();
  };

  ArrayPort.prototype.disconnect = function(socketId) {
    var socket, _i, _len, _ref;
    if (socketId == null) {
      socketId = null;
    }
    if (socketId === null) {
      if (!this.sockets.length) {
        throw new Error("" + (this.getId()) + ": No connections available");
      }
      _ref = this.sockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        socket = _ref[_i];
        socket.disconnect();
      }
      return;
    }
    if (!this.sockets[socketId]) {
      return;
    }
    return this.sockets[socketId].disconnect();
  };

  ArrayPort.prototype.detach = function(socket) {
    if (this.sockets.indexOf(socket) === -1) {
      return;
    }
    this.sockets.splice(this.sockets.indexOf(socket), 1);
    return this.emit("detach", socket);
  };

  ArrayPort.prototype.isConnected = function(socketId) {
    var connected,
      _this = this;
    if (socketId == null) {
      socketId = null;
    }
    if (socketId === null) {
      connected = false;
      this.sockets.forEach(function(socket) {
        if (socket.isConnected()) {
          return connected = true;
        }
      });
      return connected;
    }
    if (!this.sockets[socketId]) {
      return false;
    }
    return this.sockets[socketId].isConnected();
  };

  ArrayPort.prototype.isAttached = function(socketId) {
    if (socketId === void 0) {
      if (this.sockets.length > 0) {
        return true;
      }
      return false;
    }
    if (this.sockets[socketId]) {
      return true;
    }
    return false;
  };

  ArrayPort.prototype.canAttach = function() {
    return true;
  };

  return ArrayPort;

})(port.Port);

exports.ArrayPort = ArrayPort;

});
require.register("noflo-noflo/src/lib/Component.js", function(exports, require, module){
var Component, EventEmitter, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  EventEmitter = require('events').EventEmitter;
} else {
  EventEmitter = require('emitter');
}

Component = (function(_super) {
  __extends(Component, _super);

  function Component() {
    _ref = Component.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Component.prototype.description = '';

  Component.prototype.icon = null;

  Component.prototype.getDescription = function() {
    return this.description;
  };

  Component.prototype.isReady = function() {
    return true;
  };

  Component.prototype.isSubgraph = function() {
    return false;
  };

  Component.prototype.setIcon = function(icon) {
    this.icon = icon;
    return this.emit('icon', this.icon);
  };

  Component.prototype.getIcon = function() {
    return this.icon;
  };

  Component.prototype.shutdown = function() {};

  return Component;

})(EventEmitter);

exports.Component = Component;

});
require.register("noflo-noflo/src/lib/AsyncComponent.js", function(exports, require, module){
var AsyncComponent, component, port,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

port = require("./Port");

component = require("./Component");

AsyncComponent = (function(_super) {
  __extends(AsyncComponent, _super);

  function AsyncComponent(inPortName, outPortName, errPortName) {
    var _this = this;
    this.inPortName = inPortName != null ? inPortName : "in";
    this.outPortName = outPortName != null ? outPortName : "out";
    this.errPortName = errPortName != null ? errPortName : "error";
    if (!this.inPorts[this.inPortName]) {
      throw new Error("no inPort named '" + this.inPortName + "'");
    }
    if (!this.outPorts[this.outPortName]) {
      throw new Error("no outPort named '" + this.outPortName + "'");
    }
    this.load = 0;
    this.q = [];
    this.outPorts.load = new port.Port();
    this.inPorts[this.inPortName].on("begingroup", function(group) {
      if (_this.load > 0) {
        return _this.q.push({
          name: "begingroup",
          data: group
        });
      }
      return _this.outPorts[_this.outPortName].beginGroup(group);
    });
    this.inPorts[this.inPortName].on("endgroup", function() {
      if (_this.load > 0) {
        return _this.q.push({
          name: "endgroup"
        });
      }
      return _this.outPorts[_this.outPortName].endGroup();
    });
    this.inPorts[this.inPortName].on("disconnect", function() {
      if (_this.load > 0) {
        return _this.q.push({
          name: "disconnect"
        });
      }
      _this.outPorts[_this.outPortName].disconnect();
      if (_this.outPorts.load.isAttached()) {
        return _this.outPorts.load.disconnect();
      }
    });
    this.inPorts[this.inPortName].on("data", function(data) {
      if (_this.q.length > 0) {
        return _this.q.push({
          name: "data",
          data: data
        });
      }
      return _this.processData(data);
    });
  }

  AsyncComponent.prototype.processData = function(data) {
    var _this = this;
    this.incrementLoad();
    return this.doAsync(data, function(err) {
      if (err) {
        if (_this.outPorts[_this.errPortName] && _this.outPorts[_this.errPortName].isAttached()) {
          _this.outPorts[_this.errPortName].send(err);
          _this.outPorts[_this.errPortName].disconnect();
        } else {
          throw err;
        }
      }
      return _this.decrementLoad();
    });
  };

  AsyncComponent.prototype.incrementLoad = function() {
    this.load++;
    if (this.outPorts.load.isAttached()) {
      this.outPorts.load.send(this.load);
    }
    if (this.outPorts.load.isAttached()) {
      return this.outPorts.load.disconnect();
    }
  };

  AsyncComponent.prototype.doAsync = function(data, callback) {
    return callback(new Error("AsyncComponents must implement doAsync"));
  };

  AsyncComponent.prototype.decrementLoad = function() {
    var _this = this;
    if (this.load === 0) {
      throw new Error("load cannot be negative");
    }
    this.load--;
    if (this.outPorts.load.isAttached()) {
      this.outPorts.load.send(this.load);
    }
    if (this.outPorts.load.isAttached()) {
      this.outPorts.load.disconnect();
    }
    if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
      return process.nextTick(function() {
        return _this.processQueue();
      });
    } else {
      return setTimeout(function() {
        return _this.processQueue();
      }, 0);
    }
  };

  AsyncComponent.prototype.processQueue = function() {
    var event, processedData;
    if (this.load > 0) {
      return;
    }
    processedData = false;
    while (this.q.length > 0) {
      event = this.q[0];
      switch (event.name) {
        case "begingroup":
          if (processedData) {
            return;
          }
          this.outPorts[this.outPortName].beginGroup(event.data);
          this.q.shift();
          break;
        case "endgroup":
          if (processedData) {
            return;
          }
          this.outPorts[this.outPortName].endGroup();
          this.q.shift();
          break;
        case "disconnect":
          if (processedData) {
            return;
          }
          this.outPorts[this.outPortName].disconnect();
          if (this.outPorts.load.isAttached()) {
            this.outPorts.load.disconnect();
          }
          this.q.shift();
          break;
        case "data":
          this.processData(event.data);
          this.q.shift();
          processedData = true;
      }
    }
  };

  return AsyncComponent;

})(component.Component);

exports.AsyncComponent = AsyncComponent;

});
require.register("noflo-noflo/src/lib/LoggingComponent.js", function(exports, require, module){
var Component, Port, util,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require("./Component").Component;

Port = require("./Port").Port;

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  util = require("util");
} else {
  util = {
    inspect: function(data) {
      return data;
    }
  };
}

exports.LoggingComponent = (function(_super) {
  __extends(LoggingComponent, _super);

  function LoggingComponent() {
    this.sendLog = __bind(this.sendLog, this);
    this.outPorts = {
      log: new Port()
    };
  }

  LoggingComponent.prototype.sendLog = function(message) {
    if (typeof message === "object") {
      message.when = new Date;
      message.source = this.constructor.name;
      if (this.nodeId != null) {
        message.nodeID = this.nodeId;
      }
    }
    if ((this.outPorts.log != null) && this.outPorts.log.isAttached()) {
      return this.outPorts.log.send(message);
    } else {
      return console.log(util.inspect(message, 4, true, true));
    }
  };

  return LoggingComponent;

})(Component);

});
require.register("noflo-noflo/src/lib/ComponentLoader.js", function(exports, require, module){
var ComponentLoader, internalSocket, nofloGraph;

internalSocket = require('./InternalSocket');

nofloGraph = require('./Graph');

ComponentLoader = (function() {
  function ComponentLoader(baseDir) {
    this.baseDir = baseDir;
    this.components = null;
    this.checked = [];
    this.revalidate = false;
    this.libraryIcons = {};
  }

  ComponentLoader.prototype.getModulePrefix = function(name) {
    if (!name) {
      return '';
    }
    if (name === 'noflo') {
      return '';
    }
    return name.replace('noflo-', '');
  };

  ComponentLoader.prototype.getModuleComponents = function(moduleName) {
    var cPath, definition, dependency, e, loader, name, prefix, _ref, _ref1, _results;
    if (this.checked.indexOf(moduleName) !== -1) {
      return;
    }
    this.checked.push(moduleName);
    try {
      definition = require("/" + moduleName + "/component.json");
    } catch (_error) {
      e = _error;
      if (moduleName.substr(0, 1) === '/') {
        return this.getModuleComponents("noflo-" + (moduleName.substr(1)));
      }
      return;
    }
    for (dependency in definition.dependencies) {
      this.getModuleComponents(dependency.replace('/', '-'));
    }
    if (!definition.noflo) {
      return;
    }
    prefix = this.getModulePrefix(definition.name);
    if (definition.noflo.icon) {
      this.libraryIcons[prefix] = definition.noflo.icon;
    }
    if (moduleName[0] === '/') {
      moduleName = moduleName.substr(1);
    }
    if (definition.noflo.loader) {
      loader = require("/" + moduleName + "/" + definition.noflo.loader);
      loader(this);
    }
    if (definition.noflo.components) {
      _ref = definition.noflo.components;
      for (name in _ref) {
        cPath = _ref[name];
        if (cPath.indexOf('.js') !== -1) {
          cPath = cPath.replace('.js', '.js');
        }
        this.registerComponent(prefix, name, "/" + moduleName + "/" + cPath);
      }
    }
    if (definition.noflo.graphs) {
      _ref1 = definition.noflo.graphs;
      _results = [];
      for (name in _ref1) {
        cPath = _ref1[name];
        _results.push(this.registerComponent(prefix, name, "/" + moduleName + "/" + cPath));
      }
      return _results;
    }
  };

  ComponentLoader.prototype.listComponents = function(callback) {
    if (this.components !== null) {
      return callback(this.components);
    }
    this.components = {};
    this.getModuleComponents(this.baseDir);
    return callback(this.components);
  };

  ComponentLoader.prototype.load = function(name, callback) {
    var component, componentName, implementation, instance,
      _this = this;
    if (!this.components) {
      this.listComponents(function(components) {
        return _this.load(name, callback);
      });
      return;
    }
    component = this.components[name];
    if (!component) {
      for (componentName in this.components) {
        if (componentName.split('/')[1] === name) {
          component = this.components[componentName];
          break;
        }
      }
      if (!component) {
        throw new Error("Component " + name + " not available with base " + this.baseDir);
        return;
      }
    }
    if (this.isGraph(component)) {
      if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
        process.nextTick(function() {
          return _this.loadGraph(name, component, callback);
        });
      } else {
        setTimeout(function() {
          return _this.loadGraph(name, component, callback);
        }, 0);
      }
      return;
    }
    if (typeof component === 'function') {
      implementation = component;
      instance = new component;
    } else {
      implementation = require(component);
      instance = implementation.getComponent();
    }
    if (name === 'Graph') {
      instance.baseDir = this.baseDir;
    }
    this.setIcon(name, instance);
    return callback(instance);
  };

  ComponentLoader.prototype.isGraph = function(cPath) {
    if (typeof cPath === 'object' && cPath instanceof nofloGraph.Graph) {
      return true;
    }
    if (typeof cPath !== 'string') {
      return false;
    }
    return cPath.indexOf('.fbp') !== -1 || cPath.indexOf('.json') !== -1;
  };

  ComponentLoader.prototype.loadGraph = function(name, component, callback) {
    var graph, graphImplementation, graphSocket;
    graphImplementation = require(this.components['Graph']);
    graphSocket = internalSocket.createSocket();
    graph = graphImplementation.getComponent();
    graph.baseDir = this.baseDir;
    graph.inPorts.graph.attach(graphSocket);
    graphSocket.send(component);
    graphSocket.disconnect();
    delete graph.inPorts.graph;
    delete graph.inPorts.start;
    this.setIcon(name, graph);
    return callback(graph);
  };

  ComponentLoader.prototype.setIcon = function(name, instance) {
    var componentName, library, _ref;
    if (instance.getIcon()) {
      return;
    }
    _ref = name.split('/'), library = _ref[0], componentName = _ref[1];
    if (componentName && this.getLibraryIcon(library)) {
      instance.setIcon(this.getLibraryIcon(library));
      return;
    }
    if (instance.isSubgraph()) {
      instance.setIcon('sitemap');
      return;
    }
    instance.setIcon('blank');
  };

  ComponentLoader.prototype.getLibraryIcon = function(prefix) {
    if (this.libraryIcons[prefix]) {
      return this.libraryIcons[prefix];
    }
    return null;
  };

  ComponentLoader.prototype.registerComponent = function(packageId, name, cPath, callback) {
    var fullName, prefix;
    prefix = this.getModulePrefix(packageId);
    fullName = "" + prefix + "/" + name;
    if (!packageId) {
      fullName = name;
    }
    this.components[fullName] = cPath;
    if (callback) {
      return callback();
    }
  };

  ComponentLoader.prototype.registerGraph = function(packageId, name, gPath, callback) {
    return this.registerComponent(packageId, name, gPath, callback);
  };

  ComponentLoader.prototype.clear = function() {
    this.components = null;
    this.checked = [];
    return this.revalidate = true;
  };

  return ComponentLoader;

})();

exports.ComponentLoader = ComponentLoader;

});
require.register("noflo-noflo/src/lib/NoFlo.js", function(exports, require, module){
exports.graph = require('./Graph');

exports.Graph = exports.graph.Graph;

exports.Network = require('./Network').Network;

exports.isBrowser = function() {
  if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
    return false;
  }
  return true;
};

if (!exports.isBrowser()) {
  exports.ComponentLoader = require('./nodejs/ComponentLoader').ComponentLoader;
} else {
  exports.ComponentLoader = require('./ComponentLoader').ComponentLoader;
}

exports.Component = require('./Component').Component;

exports.AsyncComponent = require('./AsyncComponent').AsyncComponent;

exports.LoggingComponent = require('./LoggingComponent').LoggingComponent;

exports.Port = require('./Port').Port;

exports.ArrayPort = require('./ArrayPort').ArrayPort;

exports.internalSocket = require('./InternalSocket');

exports.createNetwork = function(graph, callback, delay) {
  var network, networkReady;
  network = new exports.Network(graph);
  networkReady = function(network) {
    if (callback != null) {
      callback(network);
    }
    return network.start();
  };
  if (graph.nodes.length === 0) {
    setTimeout(function() {
      return networkReady(network);
    }, 0);
    return network;
  }
  network.loader.listComponents(function() {
    if (delay) {
      if (callback != null) {
        callback(network);
      }
      return;
    }
    return network.connect(function() {
      return networkReady(network);
    });
  });
  return network;
};

exports.loadFile = function(file, callback) {
  return exports.graph.loadFile(file, function(net) {
    return exports.createNetwork(net, callback);
  });
};

exports.saveFile = function(graph, file, callback) {
  return exports.graph.save(file, function() {
    return callback(file);
  });
};

});
require.register("noflo-noflo/src/lib/Network.js", function(exports, require, module){
var EventEmitter, Network, componentLoader, graph, internalSocket, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require("underscore");

internalSocket = require("./InternalSocket");

graph = require("./Graph");

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  componentLoader = require("./nodejs/ComponentLoader");
  EventEmitter = require('events').EventEmitter;
} else {
  componentLoader = require('./ComponentLoader');
  EventEmitter = require('emitter');
}

Network = (function(_super) {
  __extends(Network, _super);

  Network.prototype.processes = {};

  Network.prototype.connections = [];

  Network.prototype.initials = [];

  Network.prototype.graph = null;

  Network.prototype.startupDate = null;

  Network.prototype.portBuffer = {};

  function Network(graph) {
    var _this = this;
    this.processes = {};
    this.connections = [];
    this.initials = [];
    this.graph = graph;
    if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
      this.baseDir = graph.baseDir || process.cwd();
    } else {
      this.baseDir = graph.baseDir || '/';
    }
    this.startupDate = new Date();
    this.graph.on('addNode', function(node) {
      return _this.addNode(node);
    });
    this.graph.on('removeNode', function(node) {
      return _this.removeNode(node);
    });
    this.graph.on('renameNode', function(oldId, newId) {
      return _this.renameNode(oldId, newId);
    });
    this.graph.on('addEdge', function(edge) {
      return _this.addEdge(edge);
    });
    this.graph.on('removeEdge', function(edge) {
      return _this.removeEdge(edge);
    });
    this.graph.on('addInitial', function(iip) {
      return _this.addInitial(iip);
    });
    this.graph.on('removeInitial', function(iip) {
      return _this.removeInitial(iip);
    });
    this.loader = new componentLoader.ComponentLoader(this.baseDir);
  }

  Network.prototype.uptime = function() {
    return new Date() - this.startupDate;
  };

  Network.prototype.connectionCount = 0;

  Network.prototype.increaseConnections = function() {
    if (this.connectionCount === 0) {
      this.emit('start', {
        start: this.startupDate
      });
    }
    return this.connectionCount++;
  };

  Network.prototype.decreaseConnections = function() {
    var ender,
      _this = this;
    this.connectionCount--;
    if (this.connectionCount === 0) {
      ender = _.debounce(function() {
        if (_this.connectionCount) {
          return;
        }
        return _this.emit('end', {
          start: _this.startupDate,
          end: new Date,
          uptime: _this.uptime()
        });
      }, 10);
      return ender();
    }
  };

  Network.prototype.load = function(component, callback) {
    if (typeof component === 'object') {
      return callback(component);
    }
    return this.loader.load(component, callback);
  };

  Network.prototype.addNode = function(node, callback) {
    var process,
      _this = this;
    if (this.processes[node.id]) {
      if (callback) {
        callback(this.processes[node.id]);
      }
      return;
    }
    process = {
      id: node.id
    };
    if (!node.component) {
      this.processes[process.id] = process;
      if (callback) {
        callback(process);
      }
      return;
    }
    return this.load(node.component, function(instance) {
      var name, port, _ref, _ref1;
      instance.nodeId = node.id;
      process.component = instance;
      _ref = process.component.inPorts;
      for (name in _ref) {
        port = _ref[name];
        port.node = node.id;
        port.name = name;
      }
      _ref1 = process.component.outPorts;
      for (name in _ref1) {
        port = _ref1[name];
        port.node = node.id;
        port.name = name;
      }
      if (instance.isSubgraph()) {
        _this.subscribeSubgraph(node.id, instance);
      }
      _this.processes[process.id] = process;
      if (callback) {
        return callback(process);
      }
    });
  };

  Network.prototype.removeNode = function(node) {
    if (!this.processes[node.id]) {
      return;
    }
    this.processes[node.id].component.shutdown();
    return delete this.processes[node.id];
  };

  Network.prototype.renameNode = function(oldId, newId) {
    var name, port, process, _ref, _ref1;
    process = this.getNode(oldId);
    if (!process) {
      return;
    }
    process.id = newId;
    _ref = process.component.inPorts;
    for (name in _ref) {
      port = _ref[name];
      port.node = newId;
    }
    _ref1 = process.component.outPorts;
    for (name in _ref1) {
      port = _ref1[name];
      port.node = newId;
    }
    this.processes[newId] = process;
    return delete this.processes[oldId];
  };

  Network.prototype.getNode = function(id) {
    return this.processes[id];
  };

  Network.prototype.connect = function(done) {
    var edges, initializers, nodes, serialize,
      _this = this;
    if (done == null) {
      done = function() {};
    }
    serialize = function(next, add) {
      return function(type) {
        return _this["add" + type](add, function() {
          return next(type);
        });
      };
    };
    initializers = _.reduceRight(this.graph.initializers, serialize, done);
    edges = _.reduceRight(this.graph.edges, serialize, function() {
      return initializers("Initial");
    });
    nodes = _.reduceRight(this.graph.nodes, serialize, function() {
      return edges("Edge");
    });
    return nodes("Node");
  };

  Network.prototype.connectPort = function(socket, process, port, inbound) {
    if (inbound) {
      socket.to = {
        process: process,
        port: port
      };
      if (!(process.component.inPorts && process.component.inPorts[port])) {
        throw new Error("No inport '" + port + "' defined in process " + process.id + " (" + (socket.getId()) + ")");
        return;
      }
      return process.component.inPorts[port].attach(socket);
    }
    socket.from = {
      process: process,
      port: port
    };
    if (!(process.component.outPorts && process.component.outPorts[port])) {
      throw new Error("No outport '" + port + "' defined in process " + process.id + " (" + (socket.getId()) + ")");
      return;
    }
    return process.component.outPorts[port].attach(socket);
  };

  Network.prototype.subscribeSubgraph = function(nodeName, process) {
    var emitSub,
      _this = this;
    if (!process.isReady()) {
      process.once('ready', function() {
        _this.subscribeSubgraph(nodeName, process);
      });
    }
    if (!process.network) {
      return;
    }
    emitSub = function(type, data) {
      if (type === 'connect') {
        _this.increaseConnections();
      }
      if (type === 'disconnect') {
        _this.decreaseConnections();
      }
      if (!data) {
        data = {};
      }
      if (data.subgraph) {
        data.subgraph = "" + nodeName + ":" + data.subgraph;
      } else {
        data.subgraph = nodeName;
      }
      return _this.emit(type, data);
    };
    process.network.on('connect', function(data) {
      return emitSub('connect', data);
    });
    process.network.on('begingroup', function(data) {
      return emitSub('begingroup', data);
    });
    process.network.on('data', function(data) {
      return emitSub('data', data);
    });
    process.network.on('endgroup', function(data) {
      return emitSub('endgroup', data);
    });
    return process.network.on('disconnect', function(data) {
      return emitSub('disconnect', data);
    });
  };

  Network.prototype.subscribeSocket = function(socket) {
    var _this = this;
    socket.on('connect', function() {
      _this.increaseConnections();
      return _this.emit('connect', {
        id: socket.getId(),
        socket: socket
      });
    });
    socket.on('begingroup', function(group) {
      return _this.emit('begingroup', {
        id: socket.getId(),
        socket: socket,
        group: group
      });
    });
    socket.on('data', function(data) {
      return _this.emit('data', {
        id: socket.getId(),
        socket: socket,
        data: data
      });
    });
    socket.on('endgroup', function(group) {
      return _this.emit('endgroup', {
        id: socket.getId(),
        socket: socket,
        group: group
      });
    });
    return socket.on('disconnect', function() {
      _this.decreaseConnections();
      return _this.emit('disconnect', {
        id: socket.getId(),
        socket: socket
      });
    });
  };

  Network.prototype.addEdge = function(edge, callback) {
    var from, socket, to,
      _this = this;
    socket = internalSocket.createSocket();
    from = this.getNode(edge.from.node);
    if (!from) {
      throw new Error("No process defined for outbound node " + edge.from.node);
    }
    if (!from.component) {
      throw new Error("No component defined for outbound node " + edge.from.node);
    }
    if (!from.component.isReady()) {
      from.component.once("ready", function() {
        return _this.addEdge(edge, callback);
      });
      return;
    }
    to = this.getNode(edge.to.node);
    if (!to) {
      throw new Error("No process defined for inbound node " + edge.to.node);
    }
    if (!to.component) {
      throw new Error("No component defined for inbound node " + edge.to.node);
    }
    if (!to.component.isReady()) {
      to.component.once("ready", function() {
        return _this.addEdge(edge, callback);
      });
      return;
    }
    this.connectPort(socket, to, edge.to.port, true);
    this.connectPort(socket, from, edge.from.port, false);
    this.subscribeSocket(socket);
    this.connections.push(socket);
    if (callback) {
      return callback();
    }
  };

  Network.prototype.removeEdge = function(edge) {
    var connection, _i, _len, _ref, _results;
    _ref = this.connections;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      connection = _ref[_i];
      if (!connection) {
        continue;
      }
      if (!(edge.to.node === connection.to.process.id && edge.to.port === connection.to.port)) {
        continue;
      }
      connection.to.process.component.inPorts[connection.to.port].detach(connection);
      if (edge.from.node) {
        if (connection.from && edge.from.node === connection.from.process.id && edge.from.port === connection.from.port) {
          connection.from.process.component.outPorts[connection.from.port].detach(connection);
        }
      }
      _results.push(this.connections.splice(this.connections.indexOf(connection), 1));
    }
    return _results;
  };

  Network.prototype.addInitial = function(initializer, callback) {
    var socket, to,
      _this = this;
    socket = internalSocket.createSocket();
    this.subscribeSocket(socket);
    to = this.getNode(initializer.to.node);
    if (!to) {
      throw new Error("No process defined for inbound node " + initializer.to.node);
    }
    if (!(to.component.isReady() || to.component.inPorts[initializer.to.port])) {
      to.component.setMaxListeners(0);
      to.component.once("ready", function() {
        return _this.addInitial(initializer, callback);
      });
      return;
    }
    this.connectPort(socket, to, initializer.to.port, true);
    this.connections.push(socket);
    this.initials.push({
      socket: socket,
      data: initializer.from.data
    });
    if (callback) {
      return callback();
    }
  };

  Network.prototype.removeInitial = function(initializer) {
    var connection, _i, _len, _ref, _results;
    _ref = this.connections;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      connection = _ref[_i];
      if (!connection) {
        continue;
      }
      if (!(initializer.to.node === connection.to.process.id && initializer.to.port === connection.to.port)) {
        continue;
      }
      connection.to.process.component.inPorts[connection.to.port].detach(connection);
      _results.push(this.connections.splice(this.connections.indexOf(connection), 1));
    }
    return _results;
  };

  Network.prototype.sendInitial = function(initial) {
    initial.socket.connect();
    initial.socket.send(initial.data);
    return initial.socket.disconnect();
  };

  Network.prototype.sendInitials = function() {
    var send,
      _this = this;
    send = function() {
      var initial, _i, _len, _ref;
      _ref = _this.initials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        initial = _ref[_i];
        _this.sendInitial(initial);
      }
      return _this.initials = [];
    };
    if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
      return process.nextTick(send);
    } else {
      return setTimeout(send, 0);
    }
  };

  Network.prototype.start = function() {
    return this.sendInitials();
  };

  Network.prototype.stop = function() {
    var connection, id, process, _i, _len, _ref, _ref1, _results;
    _ref = this.connections;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      connection = _ref[_i];
      if (!connection.isConnected()) {
        continue;
      }
      connection.disconnect();
    }
    _ref1 = this.processes;
    _results = [];
    for (id in _ref1) {
      process = _ref1[id];
      _results.push(process.component.shutdown());
    }
    return _results;
  };

  return Network;

})(EventEmitter);

exports.Network = Network;

});
require.register("noflo-noflo/src/components/Graph.js", function(exports, require, module){
var Graph, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
  noflo = require("../../lib/NoFlo");
} else {
  noflo = require('../lib/NoFlo');
}

Graph = (function(_super) {
  __extends(Graph, _super);

  function Graph() {
    var _this = this;
    this.network = null;
    this.ready = true;
    this.started = false;
    this.baseDir = null;
    this.inPorts = {
      graph: new noflo.Port('all'),
      start: new noflo.Port('bang')
    };
    this.outPorts = {};
    this.inPorts.graph.on("data", function(data) {
      return _this.setGraph(data);
    });
    this.inPorts.start.on("data", function() {
      _this.started = true;
      if (!_this.network) {
        return;
      }
      return _this.network.connect(function() {
        var name, notReady, process, _ref;
        _this.network.sendInitials();
        notReady = false;
        _ref = _this.network.processes;
        for (name in _ref) {
          process = _ref[name];
          if (!_this.checkComponent(name, process)) {
            notReady = true;
          }
        }
        if (!notReady) {
          return _this.setToReady();
        }
      });
    });
  }

  Graph.prototype.setGraph = function(graph) {
    var _this = this;
    this.ready = false;
    if (typeof graph === 'object') {
      if (typeof graph.addNode === 'function') {
        return this.createNetwork(graph);
      }
      noflo.graph.loadJSON(graph, function(instance) {
        instance.baseDir = _this.baseDir;
        return _this.createNetwork(instance);
      });
      return;
    }
    if (graph.substr(0, 1) !== "/") {
      graph = "" + (process.cwd()) + "/" + graph;
    }
    return graph = noflo.graph.loadFile(graph, function(instance) {
      instance.baseDir = _this.baseDir;
      return _this.createNetwork(instance);
    });
  };

  Graph.prototype.createNetwork = function(graph) {
    var _ref,
      _this = this;
    if (((_ref = this.inPorts.start) != null ? _ref.isAttached() : void 0) && !this.started) {
      noflo.createNetwork(graph, function(network) {
        _this.network = network;
        return _this.emit('network', _this.network);
      }, true);
      return;
    }
    return noflo.createNetwork(graph, function(network) {
      var name, notReady, process, _ref1;
      _this.network = network;
      _this.emit('network', _this.network);
      notReady = false;
      _ref1 = _this.network.processes;
      for (name in _ref1) {
        process = _ref1[name];
        if (!_this.checkComponent(name, process)) {
          notReady = true;
        }
      }
      if (!notReady) {
        return _this.setToReady();
      }
    });
  };

  Graph.prototype.checkComponent = function(name, process) {
    var _this = this;
    if (!process.component.isReady()) {
      process.component.once("ready", function() {
        _this.checkComponent(name, process);
        return _this.setToReady();
      });
      return false;
    }
    this.findEdgePorts(name, process);
    return true;
  };

  Graph.prototype.portName = function(nodeName, portName) {
    return "" + (nodeName.toLowerCase()) + "." + portName;
  };

  Graph.prototype.isExported = function(port, nodeName, portName) {
    var exported, newPort, _i, _len, _ref;
    newPort = this.portName(nodeName, portName);
    if (!port.canAttach()) {
      return false;
    }
    if (this.network.graph.exports.length === 0) {
      return newPort;
    }
    _ref = this.network.graph.exports;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      exported = _ref[_i];
      if (exported["private"] === newPort) {
        return exported["public"];
      }
    }
    return false;
  };

  Graph.prototype.setToReady = function() {
    var _this = this;
    if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
      return process.nextTick(function() {
        _this.ready = true;
        return _this.emit('ready');
      });
    } else {
      return setTimeout(function() {
        _this.ready = true;
        return _this.emit('ready');
      }, 0);
    }
  };

  Graph.prototype.findEdgePorts = function(name, process) {
    var port, portName, targetPortName, _ref, _ref1;
    _ref = process.component.inPorts;
    for (portName in _ref) {
      port = _ref[portName];
      targetPortName = this.isExported(port, name, portName);
      if (targetPortName === false) {
        continue;
      }
      this.inPorts[targetPortName] = port;
    }
    _ref1 = process.component.outPorts;
    for (portName in _ref1) {
      port = _ref1[portName];
      targetPortName = this.isExported(port, name, portName);
      if (targetPortName === false) {
        continue;
      }
      this.outPorts[targetPortName] = port;
    }
    return true;
  };

  Graph.prototype.isReady = function() {
    return this.ready;
  };

  Graph.prototype.isSubgraph = function() {
    return true;
  };

  Graph.prototype.shutdown = function() {
    if (!this.network) {
      return;
    }
    return this.network.stop();
  };

  return Graph;

})(noflo.Component);

exports.getComponent = function() {
  return new Graph;
};

});
require.register("noflo-noflo/component.json", function(exports, require, module){
module.exports = JSON.parse('{"name":"noflo","description":"Flow-Based Programming environment for JavaScript","keywords":["fbp","workflow","flow"],"repo":"noflo/noflo","version":"0.4.1","dependencies":{"component/emitter":"*","component/underscore":"*","noflo/fbp":"*"},"development":{},"license":"MIT","main":"src/lib/NoFlo.js","scripts":["src/lib/Graph.js","src/lib/InternalSocket.js","src/lib/Port.js","src/lib/ArrayPort.js","src/lib/Component.js","src/lib/AsyncComponent.js","src/lib/LoggingComponent.js","src/lib/ComponentLoader.js","src/lib/NoFlo.js","src/lib/Network.js","src/components/Graph.js"],"json":["component.json"],"noflo":{"components":{"Graph":"src/components/Graph.js"}}}');
});
require.register("noflo-noflo-core/index.js", function(exports, require, module){
/*
 * This file can be used for general library features of core.
 *
 * The library features can be made available as CommonJS modules that the
 * components in this project utilize.
 */

});
require.register("noflo-noflo-core/components/Callback.js", function(exports, require, module){
var Callback, noflo, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

_ = require('underscore')._;

Callback = (function(_super) {
  __extends(Callback, _super);

  Callback.prototype.description = 'This component calls a given callback function for each\
  IP it receives.  The Callback component is typically used to connect\
  NoFlo with external Node.js code.';

  Callback.prototype.icon = 'sign-out';

  function Callback() {
    var _this = this;
    this.callback = null;
    this.inPorts = {
      "in": new noflo.Port('all'),
      callback: new noflo.Port('function')
    };
    this.outPorts = {
      error: new noflo.Port('object')
    };
    this.inPorts.callback.on('data', function(data) {
      if (!_.isFunction(data)) {
        _this.error('The provided callback must be a function');
        return;
      }
      return _this.callback = data;
    });
    this.inPorts["in"].on('data', function(data) {
      if (!_this.callback) {
        _this.error('No callback provided');
        return;
      }
      return _this.callback(data);
    });
  }

  Callback.prototype.error = function(msg) {
    if (this.outPorts.error.isAttached()) {
      this.outPorts.error.send(new Error(msg));
      this.outPorts.error.disconnect();
      return;
    }
    throw new Error(msg);
  };

  return Callback;

})(noflo.Component);

exports.getComponent = function() {
  return new Callback;
};

});
require.register("noflo-noflo-core/components/DisconnectAfterPacket.js", function(exports, require, module){
var DisconnectAfterPacket, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

DisconnectAfterPacket = (function(_super) {
  __extends(DisconnectAfterPacket, _super);

  DisconnectAfterPacket.prototype.description = 'Forwards any packets, but also sends a disconnect after each of them';

  DisconnectAfterPacket.prototype.icon = 'pause';

  function DisconnectAfterPacket() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.Port('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.outPorts.out.beginGroup(group);
    });
    this.inPorts["in"].on('data', function(data) {
      _this.outPorts.out.send(data);
      return _this.outPorts.out.disconnect();
    });
    this.inPorts["in"].on('endgroup', function() {
      return _this.outPorts.out.endGroup();
    });
  }

  return DisconnectAfterPacket;

})(noflo.Component);

exports.getComponent = function() {
  return new DisconnectAfterPacket;
};

});
require.register("noflo-noflo-core/components/Drop.js", function(exports, require, module){
var Drop, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

Drop = (function(_super) {
  __extends(Drop, _super);

  Drop.prototype.description = 'This component drops every packet it receives with no\
  action';

  Drop.prototype.icon = 'trash-o';

  function Drop() {
    this.inPorts = {
      "in": new noflo.ArrayPort('all')
    };
    this.outPorts = {};
  }

  return Drop;

})(noflo.Component);

exports.getComponent = function() {
  return new Drop;
};

});
require.register("noflo-noflo-core/components/Group.js", function(exports, require, module){
var Group, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

Group = (function(_super) {
  __extends(Group, _super);

  Group.prototype.description = 'Adds a set of groups around the packets received at each connection';

  Group.prototype.icon = 'tags';

  function Group() {
    var _this = this;
    this.groups = [];
    this.newGroups = [];
    this.threshold = null;
    this.inPorts = {
      "in": new noflo.ArrayPort('all'),
      group: new noflo.ArrayPort('string'),
      threshold: new noflo.Port('integer')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('connect', function() {
      var group, _i, _len, _ref, _results;
      _ref = _this.newGroups;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        _results.push(_this.outPorts.out.beginGroup(group));
      }
      return _results;
    });
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.outPorts.out.beginGroup(group);
    });
    this.inPorts["in"].on('data', function(data) {
      return _this.outPorts.out.send(data);
    });
    this.inPorts["in"].on('endgroup', function(group) {
      return _this.outPorts.out.endGroup();
    });
    this.inPorts["in"].on('disconnect', function() {
      var group, _i, _len, _ref;
      _ref = _this.newGroups;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        _this.outPorts.out.endGroup();
      }
      _this.outPorts.out.disconnect();
      return _this.groups = [];
    });
    this.inPorts.group.on('data', function(data) {
      var diff;
      if (_this.threshold) {
        diff = _this.newGroups.length - _this.threshold + 1;
        if (diff > 0) {
          _this.newGroups = _this.newGroups.slice(diff);
        }
      }
      return _this.newGroups.push(data);
    });
    this.inPorts.threshold.on('data', function(threshold) {
      _this.threshold = threshold;
    });
  }

  return Group;

})(noflo.Component);

exports.getComponent = function() {
  return new Group;
};

});
require.register("noflo-noflo-core/components/Kick.js", function(exports, require, module){
var Kick, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

Kick = (function(_super) {
  __extends(Kick, _super);

  Kick.prototype.description = 'This component generates a single packet and sends it to\
  the output port. Mostly usable for debugging, but can also be useful\
  for starting up networks.';

  Kick.prototype.icon = 'share';

  function Kick() {
    var _this = this;
    this.data = {
      packet: null,
      group: []
    };
    this.groups = [];
    this.inPorts = {
      "in": new noflo.Port('bang'),
      data: new noflo.Port('all')
    };
    this.outPorts = {
      out: new noflo.ArrayPort('all')
    };
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.groups.push(group);
    });
    this.inPorts["in"].on('data', function() {
      return _this.data.group = _this.groups.slice(0);
    });
    this.inPorts["in"].on('endgroup', function(group) {
      return _this.groups.pop();
    });
    this.inPorts["in"].on('disconnect', function() {
      _this.sendKick(_this.data);
      return _this.groups = [];
    });
    this.inPorts.data.on('data', function(data) {
      return _this.data.packet = data;
    });
  }

  Kick.prototype.sendKick = function(kick) {
    var group, _i, _j, _len, _len1, _ref, _ref1;
    _ref = kick.group;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      this.outPorts.out.beginGroup(group);
    }
    this.outPorts.out.send(kick.packet);
    _ref1 = kick.group;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      group = _ref1[_j];
      this.outPorts.out.endGroup();
    }
    return this.outPorts.out.disconnect();
  };

  return Kick;

})(noflo.Component);

exports.getComponent = function() {
  return new Kick;
};

});
require.register("noflo-noflo-core/components/Merge.js", function(exports, require, module){
var Merge, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

Merge = (function(_super) {
  __extends(Merge, _super);

  Merge.prototype.description = 'This component receives data on multiple input ports and\
    sends the same data out to the connected output port';

  Merge.prototype.icon = 'compress';

  function Merge() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.ArrayPort('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('connect', function() {
      return _this.outPorts.out.connect();
    });
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.outPorts.out.beginGroup(group);
    });
    this.inPorts["in"].on('data', function(data) {
      return _this.outPorts.out.send(data);
    });
    this.inPorts["in"].on('endgroup', function() {
      return _this.outPorts.out.endGroup();
    });
    this.inPorts["in"].on('disconnect', function() {
      var socket, _i, _len, _ref;
      _ref = _this.inPorts["in"].sockets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        socket = _ref[_i];
        if (socket.connected) {
          return;
        }
      }
      return _this.outPorts.out.disconnect();
    });
  }

  return Merge;

})(noflo.Component);

exports.getComponent = function() {
  return new Merge;
};

});
require.register("noflo-noflo-core/components/Output.js", function(exports, require, module){
var Output, noflo, util,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

if (!noflo.isBrowser()) {
  util = require('util');
} else {
  util = {
    inspect: function(data) {
      return data;
    }
  };
}

Output = (function(_super) {
  __extends(Output, _super);

  Output.prototype.description = 'This component receives input on a single inport, and\
    sends the data items directly to console.log';

  Output.prototype.icon = 'bug';

  function Output() {
    var _this = this;
    this.options = null;
    this.inPorts = {
      "in": new noflo.ArrayPort('all'),
      options: new noflo.Port('object')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('data', function(data) {
      _this.log(data);
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.send(data);
      }
    });
    this.inPorts["in"].on('disconnect', function() {
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.disconnect();
      }
    });
    this.inPorts.options.on('data', function(data) {
      return _this.setOptions(data);
    });
  }

  Output.prototype.setOptions = function(options) {
    var key, value, _results;
    if (typeof options !== 'object') {
      throw new Error('Options is not an object');
    }
    if (this.options == null) {
      this.options = {};
    }
    _results = [];
    for (key in options) {
      if (!__hasProp.call(options, key)) continue;
      value = options[key];
      _results.push(this.options[key] = value);
    }
    return _results;
  };

  Output.prototype.log = function(data) {
    if (this.options != null) {
      return console.log(util.inspect(data, this.options.showHidden, this.options.depth, this.options.colors));
    } else {
      return console.log(data);
    }
  };

  return Output;

})(noflo.Component);

exports.getComponent = function() {
  return new Output();
};

});
require.register("noflo-noflo-core/components/Repeat.js", function(exports, require, module){
var Repeat, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

Repeat = (function(_super) {
  __extends(Repeat, _super);

  Repeat.prototype.description = 'Forwards packets and metadata in the same way it receives them';

  Repeat.prototype.icon = 'forward';

  function Repeat() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.Port()
    };
    this.outPorts = {
      out: new noflo.Port()
    };
    this.inPorts["in"].on('connect', function() {
      return _this.outPorts.out.connect();
    });
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.outPorts.out.beginGroup(group);
    });
    this.inPorts["in"].on('data', function(data) {
      return _this.outPorts.out.send(data);
    });
    this.inPorts["in"].on('endgroup', function() {
      return _this.outPorts.out.endGroup();
    });
    this.inPorts["in"].on('disconnect', function() {
      return _this.outPorts.out.disconnect();
    });
  }

  return Repeat;

})(noflo.Component);

exports.getComponent = function() {
  return new Repeat();
};

});
require.register("noflo-noflo-core/components/RepeatAsync.js", function(exports, require, module){
var RepeatAsync, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

RepeatAsync = (function(_super) {
  __extends(RepeatAsync, _super);

  RepeatAsync.prototype.description = "Like 'Repeat', except repeat on next tick";

  RepeatAsync.prototype.icon = 'step-forward';

  function RepeatAsync() {
    var _this = this;
    this.groups = [];
    this.inPorts = {
      "in": new noflo.Port('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.groups.push(group);
    });
    this.inPorts["in"].on('data', function(data) {
      var groups, later;
      groups = _this.groups;
      later = function() {
        var group, _i, _j, _len, _len1;
        for (_i = 0, _len = groups.length; _i < _len; _i++) {
          group = groups[_i];
          _this.outPorts.out.beginGroup(group);
        }
        _this.outPorts.out.send(data);
        for (_j = 0, _len1 = groups.length; _j < _len1; _j++) {
          group = groups[_j];
          _this.outPorts.out.endGroup();
        }
        return _this.outPorts.out.disconnect();
      };
      return setTimeout(later, 0);
    });
    this.inPorts["in"].on('disconnect', function() {
      return _this.groups = [];
    });
  }

  return RepeatAsync;

})(noflo.Component);

exports.getComponent = function() {
  return new RepeatAsync;
};

});
require.register("noflo-noflo-core/components/Split.js", function(exports, require, module){
var Split, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

Split = (function(_super) {
  __extends(Split, _super);

  Split.prototype.description = 'This component receives data on a single input port and\
    sends the same data out to all connected output ports';

  Split.prototype.icon = 'expand';

  function Split() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.Port('all')
    };
    this.outPorts = {
      out: new noflo.ArrayPort('all')
    };
    this.inPorts["in"].on('connect', function() {
      return _this.outPorts.out.connect();
    });
    this.inPorts["in"].on('begingroup', function(group) {
      return _this.outPorts.out.beginGroup(group);
    });
    this.inPorts["in"].on('data', function(data) {
      return _this.outPorts.out.send(data);
    });
    this.inPorts["in"].on('endgroup', function() {
      return _this.outPorts.out.endGroup();
    });
    this.inPorts["in"].on('disconnect', function() {
      return _this.outPorts.out.disconnect();
    });
  }

  return Split;

})(noflo.Component);

exports.getComponent = function() {
  return new Split;
};

});
require.register("noflo-noflo-core/components/RunInterval.js", function(exports, require, module){
var RunInterval, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

RunInterval = (function(_super) {
  __extends(RunInterval, _super);

  RunInterval.prototype.description = 'Send a packet at the given interval';

  RunInterval.prototype.icon = 'clock-o';

  function RunInterval() {
    var _this = this;
    this.timer = null;
    this.interval = null;
    this.inPorts = {
      interval: new noflo.Port('number'),
      start: new noflo.Port('bang'),
      stop: new noflo.Port('bang')
    };
    this.outPorts = {
      out: new noflo.Port('bang')
    };
    this.inPorts.interval.on('data', function(interval) {
      _this.interval = interval;
      if (_this.timer != null) {
        clearInterval(_this.timer);
        return _this.timer = setInterval(function() {
          return _this.outPorts.out.send(true);
        }, _this.interval);
      }
    });
    this.inPorts.start.on('data', function() {
      if (_this.timer != null) {
        clearInterval(_this.timer);
      }
      _this.outPorts.out.connect();
      return _this.timer = setInterval(function() {
        return _this.outPorts.out.send(true);
      }, _this.interval);
    });
    this.inPorts.stop.on('data', function() {
      if (!_this.timer) {
        return;
      }
      clearInterval(_this.timer);
      _this.timer = null;
      return _this.outPorts.out.disconnect();
    });
  }

  RunInterval.prototype.shutdown = function() {
    if (this.timer != null) {
      return clearInterval(this.timer);
    }
  };

  return RunInterval;

})(noflo.Component);

exports.getComponent = function() {
  return new RunInterval;
};

});
require.register("noflo-noflo-core/components/MakeFunction.js", function(exports, require, module){
var MakeFunction, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

MakeFunction = (function(_super) {
  __extends(MakeFunction, _super);

  MakeFunction.prototype.description = 'Evaluates a function each time data hits the "in" port\
  and sends the return value to "out". Within the function "x" will\
  be the variable from the in port. For example, to make a ^2 function\
  input "return x*x;" to the function port.';

  MakeFunction.prototype.icon = 'code';

  function MakeFunction() {
    var _this = this;
    this.f = null;
    this.inPorts = {
      "in": new noflo.Port('all'),
      "function": new noflo.Port('string')
    };
    this.outPorts = {
      out: new noflo.Port('all'),
      "function": new noflo.Port('function'),
      error: new noflo.Port('object')
    };
    this.inPorts["function"].on('data', function(data) {
      var error;
      if (typeof data === "function") {
        _this.f = data;
      } else {
        try {
          _this.f = Function("x", data);
        } catch (_error) {
          error = _error;
          _this.error('Error creating function: ' + data);
        }
      }
      if (_this.f) {
        try {
          _this.f(true);
          if (_this.outPorts["function"].isAttached()) {
            return _this.outPorts["function"].send(_this.f);
          }
        } catch (_error) {
          error = _error;
          return _this.error('Error evaluating function: ' + data);
        }
      }
    });
    this.inPorts["in"].on('data', function(data) {
      if (!_this.f) {
        _this.error('No function defined');
        return;
      }
      return _this.outPorts.out.send(_this.f(data));
    });
  }

  MakeFunction.prototype.error = function(msg) {
    if (this.outPorts.error.isAttached()) {
      this.outPorts.error.send(new Error(msg));
      this.outPorts.error.disconnect();
      return;
    }
    throw new Error(msg);
  };

  return MakeFunction;

})(noflo.Component);

exports.getComponent = function() {
  return new MakeFunction;
};

});
require.register("noflo-noflo-core/component.json", function(exports, require, module){
module.exports = JSON.parse('{"name":"noflo-core","description":"NoFlo Essentials","repo":"noflo/noflo-core","version":"0.1.0","author":{"name":"Henri Bergius","email":"henri.bergius@iki.fi"},"contributors":[{"name":"Kenneth Kan","email":"kenhkan@gmail.com"},{"name":"Ryan Shaw","email":"ryanshaw@unc.edu"}],"keywords":[],"dependencies":{"noflo/noflo":"*","component/underscore":"*"},"scripts":["components/Callback.js","components/DisconnectAfterPacket.js","components/Drop.js","components/Group.js","components/Kick.js","components/Merge.js","components/Output.js","components/Repeat.js","components/RepeatAsync.js","components/Split.js","components/RunInterval.js","components/MakeFunction.js","index.js"],"json":["component.json"],"noflo":{"components":{"Callback":"components/Callback.js","DisconnectAfterPacket":"components/DisconnectAfterPacket.js","Drop":"components/Drop.js","Group":"components/Group.js","Kick":"components/Kick.js","Merge":"components/Merge.js","Output":"components/Output.js","Repeat":"components/Repeat.js","RepeatAsync":"components/RepeatAsync.js","Split":"components/Split.js","RunInterval":"components/RunInterval.js","MakeFunction":"components/MakeFunction.js"}}}');
});
require.register("searchreplace/web/js/lib/php/PHP.js", function(exports, require, module){
/*
  php.js 0.1.0 <http://phpjs.hertzen.com/>
  Copyright (c) 2013 Niklas von Hertzen

  Released under MIT License
*/

var PHP = function( code, opts ) {

    var iniContent = opts.filesystem.readFileSync( "cfg/php.ini" ),
    iniSet = opts.ini || {};
    opts.ini = PHP.ini( iniContent );

    Object.keys( iniSet ).forEach(function(key){
        this[ key ] = iniSet[ key ];
    }, opts.ini);

    this.tokens = PHP.Lexer( code, opts.ini );
    try {
        this.AST = new PHP.Parser( this.tokens );
    } catch( e ) {
        this.vm = {};
        this.vm.OUTPUT_BUFFER = "Parse error: " + e.message + " in " + opts.SERVER.SCRIPT_FILENAME + " on line " + e.line;
        return this;
    }


    var POST = opts.POST,
    RAW_POST = opts.RAW_POST,
    RAW = (RAW_POST !== undefined ) ? PHP.RAWPost( RAW_POST ) : {};

    opts.POST = ( POST !== undefined ) ? PHP.Utils.QueryString( POST ) : (RAW_POST !== undefined ) ? RAW.Post() : {};
    opts.RAW_POST = ( RAW_POST !== undefined ) ? RAW.Raw() : (POST !== undefined ) ? POST.trim() :  "";
    opts.GET = ( opts.GET !== undefined ) ? PHP.Utils.QueryString( opts.GET ) : {};

    opts.FILES = (RAW_POST !== undefined ) ? RAW.Files( opts.ini.upload_max_filesize, opts.ini.max_file_uploads, opts.ini.upload_tmp_dir ) : {};

    // needs to be called after RAW.Files
    if (RAW_POST !== undefined ) {
        RAW.WriteFiles( opts.filesystem.writeFileSync );
    }



    this.compiler = new PHP.Compiler( this.AST, opts.SERVER.SCRIPT_FILENAME );

    this.vm = new PHP.VM( this.compiler.src, opts );

    if (RAW_POST !== undefined ) {
        RAW.Error(this.vm[ PHP.Compiler.prototype.ERROR ].bind( this.vm ), opts.SERVER.SCRIPT_FILENAME);
    }

    this.vm.Run();
};

PHP.Constants = {};

PHP.Modules = function() {
    this.OUTPUT_BUFFER = "";
};

PHP.Adapters = {};

PHP.Utils = {};


PHP.Utils.$A = function( arr) {
    return Array.prototype.slice.call( arr );
};

PHP.Utils.ClassName = function( classVar ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    if ( classVar instanceof PHP.VM.Variable ) {
        if ( classVar[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
            return classVar[ COMPILER.VARIABLE_VALUE ]
        } else {
            return classVar[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ];
        }
    }

};

PHP.Utils.Merge = function(obj1, obj2) {

    Object.keys( obj2 ).forEach(function( key ){
        obj1[ key ] = obj2 [ key ];
    });

    return obj1;
};

PHP.Utils.Path = function( path ) {

    path = path.substring(0, path.lastIndexOf("/"));

    return path;
};

PHP.Utils.Visible = function( name, objectValue, ctx ) {

    // helper function for checking whether variable/method is of type
    function checkType( name, type) {
        var value = objectValue[ PROPERTY_TYPE + name ];
        if (value === undefined) {
            return true;
        }

        if ( type === "PUBLIC") {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]) || (value  === PHP.VM.Class.STATIC);
        } else {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]);
        }

    }

    function hasProperty( proto, prop ) {
        while( proto !== undefined &&  proto[ PHP.VM.Class.PROPERTY + prop ] !== undefined ) {
            proto = Object.getPrototypeOf( proto );
        }

        return proto;

    }

    var COMPILER = PHP.Compiler.prototype,
    PROPERTY_TYPE = PHP.VM.Class.PROPERTY_TYPE,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( (ctx instanceof PHP.VM.ClassPrototype) && objectValue[ COMPILER.CLASS_NAME ] === ctx[ COMPILER.CLASS_NAME ] ) {
        return true;
    } else {

        if ( (ctx instanceof PHP.VM.ClassPrototype) && this.$Class.Inherits( objectValue, ctx[ COMPILER.CLASS_NAME ] ) && checkType( name, "PROTECTED")) {

            return true;
        } else  if ( (ctx instanceof PHP.VM.ClassPrototype) && this.$Class.Inherits( objectValue, ctx[ COMPILER.CLASS_NAME ] ) && checkType( name, "PRIVATE")) {

            if (hasProperty( ctx, name ) ===  ctx) {
                return true;
            }


        } else if (checkType(name, "PUBLIC")) {

            return true;
        }
    }

    return false;

};

PHP.Utils.ArgumentHandler = function( ENV, arg, argObject, value, index, functionName ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( argObject[ COMPILER.PARAM_BYREF ] === true ) {

        // check that we aren't passing a constant for arg which is defined byRef
        if ( ENV.FUNCTION_REFS[ functionName ] !==  true && ( value[ VARIABLE.CLASS_CONSTANT ] === true || value[ VARIABLE.CONSTANT ] === true || value[ COMPILER.NAV ] === true) ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Only variables can be passed by reference", PHP.Constants.E_ERROR, true );
        }


        // check that we aren't passing a function return value
        if (   value[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.FUNCTION ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Only variables should be passed by reference", PHP.Constants.E_STRICT, true );
            value[ VARIABLE.VARIABLE_TYPE ] = undefined;
            value = new PHP.VM.Variable( value[ COMPILER.VARIABLE_VALUE ] );

        }

        if (value[ VARIABLE.DEFINED ] !== true ) {
            // trigger setter
            value[ COMPILER.VARIABLE_VALUE ] = null;
        }

        arg[ VARIABLE.REF ]( value );
    } else {

        if ( value !== undefined ) {

            if ( value instanceof PHP.VM.VariableProto) {

                if ( value[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
                    // Array assignment always involves value copying. Use the reference operator to copy an array by reference.
                    arg[ COMPILER.VARIABLE_VALUE ] = value[ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  );

                } else {
                    arg[ COMPILER.VARIABLE_VALUE ] = value[ COMPILER.VARIABLE_VALUE ];
                }
            } else {
                arg[ COMPILER.VARIABLE_VALUE ] = value;
            }


        } else {
            if ( argObject[ COMPILER.PROPERTY_DEFAULT ] !== undefined ) {
                arg[ COMPILER.VARIABLE_VALUE ] = argObject[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
            } else {
                arg[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
            }
        }
    }



    if ( argObject[ COMPILER.PROPERTY_TYPE ] !== undefined ) {
        ENV[ COMPILER.TYPE_CHECK ]( arg, argObject[ COMPILER.PROPERTY_TYPE ], argObject[ COMPILER.PROPERTY_DEFAULT ], index, functionName );
    }
};

PHP.Utils.StaticHandler = function( staticHandler, staticVars, handler, $Global ) {

    var COMPILER = PHP.Compiler.prototype,
     VARIABLE = PHP.VM.Variable.prototype;

    staticHandler[ COMPILER.FUNCTION_STATIC_SET ] = function( name, def ) {

        if ( staticVars[ name ] === undefined ) {
            // store it to storage for this variable
            staticVars[ name ] = {
                def: def[ COMPILER.VARIABLE_VALUE ],
                val: def
            };

            // assign it to current running context as well
            handler( name, def );

        } else {
            if ( def [ COMPILER.VARIABLE_VALUE ] === staticVars[ name ].def ) {
                handler( name, staticVars[ name ].val );
            } else {
                staticVars[ name ] = {
                    def: def[ COMPILER.VARIABLE_VALUE ],
                    val: def
                };
                handler( name, def );
            }
        }


        return staticHandler;


    };


    // global handler
    staticHandler[ COMPILER.FUNCTION_GLOBAL ] = function( vars ) {
        vars.forEach(function( varName ){
            var val = $Global( varName );
            val[ VARIABLE.DEFINED ] = true;
            handler( varName, val )
        });
    };

    return staticHandler;

};

PHP.Utils.CheckRef = function( ret, byRef ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( ret instanceof PHP.VM.Variable) {
        if ( byRef !== true) {

            ret[ VARIABLE.VARIABLE_TYPE ] = VARIABLE.FUNCTION;
        } else if (byRef === true){

            if (ret[ VARIABLE.REFERRING] === undefined && (ret[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.NEW_VARIABLE || ret[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.FUNCTION )) {

               this[ PHP.Compiler.prototype.ERROR ]( "Only variable references should be returned by reference", PHP.Constants.E_NOTICE, true );
            }
            ret[ VARIABLE.VARIABLE_TYPE ] = undefined;
        }
    }

};


PHP.Utils.TokenName = function( token ) {
    var constants = ["T_INCLUDE","T_INCLUDE_ONCE","T_EVAL","T_REQUIRE","T_REQUIRE_ONCE","T_LOGICAL_OR","T_LOGICAL_XOR","T_LOGICAL_AND","T_PRINT","T_PLUS_EQUAL","T_MINUS_EQUAL","T_MUL_EQUAL","T_DIV_EQUAL","T_CONCAT_EQUAL","T_MOD_EQUAL","T_AND_EQUAL","T_OR_EQUAL","T_XOR_EQUAL","T_SL_EQUAL","T_SR_EQUAL","T_BOOLEAN_OR","T_BOOLEAN_AND","T_IS_EQUAL","T_IS_NOT_EQUAL","T_IS_IDENTICAL","T_IS_NOT_IDENTICAL","T_IS_SMALLER_OR_EQUAL","T_IS_GREATER_OR_EQUAL","T_SL","T_SR","T_INSTANCEOF","T_INC","T_DEC","T_INT_CAST","T_DOUBLE_CAST","T_STRING_CAST","T_ARRAY_CAST","T_OBJECT_CAST","T_BOOL_CAST","T_UNSET_CAST","T_NEW","T_CLONE","T_EXIT","T_IF","T_ELSEIF","T_ELSE","T_ENDIF","T_LNUMBER","T_DNUMBER","T_STRING","T_STRING_VARNAME","T_VARIABLE","T_NUM_STRING","T_INLINE_HTML","T_CHARACTER","T_BAD_CHARACTER","T_ENCAPSED_AND_WHITESPACE","T_CONSTANT_ENCAPSED_STRING","T_ECHO","T_DO","T_WHILE","T_ENDWHILE","T_FOR","T_ENDFOR","T_FOREACH","T_ENDFOREACH","T_DECLARE","T_ENDDECLARE","T_AS","T_SWITCH","T_ENDSWITCH","T_CASE","T_DEFAULT","T_BREAK","T_CONTINUE","T_GOTO","T_FUNCTION","T_CONST","T_RETURN","T_TRY","T_CATCH","T_THROW","T_USE","T_INSTEADOF","T_GLOBAL","T_STATIC","T_ABSTRACT","T_FINAL","T_PRIVATE","T_PROTECTED","T_PUBLIC","T_VAR","T_UNSET","T_ISSET","T_EMPTY","T_HALT_COMPILER","T_CLASS","T_TRAIT","T_INTERFACE","T_EXTENDS","T_IMPLEMENTS","T_OBJECT_OPERATOR","T_DOUBLE_ARROW","T_LIST","T_ARRAY","T_CALLABLE","T_CLASS_C","T_TRAIT_C","T_METHOD_C","T_FUNC_C","T_LINE","T_FILE","T_COMMENT","T_DOC_COMMENT","T_OPEN_TAG","T_OPEN_TAG_WITH_ECHO","T_CLOSE_TAG","T_WHITESPACE","T_START_HEREDOC","T_END_HEREDOC","T_DOLLAR_OPEN_CURLY_BRACES","T_CURLY_OPEN","T_PAAMAYIM_NEKUDOTAYIM","T_DOUBLE_COLON","T_NAMESPACE","T_NS_C","T_DIR","T_NS_SEPARATOR"];
    var current = "UNKNOWN";
    constants.some(function( constant ) {
        if (PHP.Constants[ constant ] === token) {
            current = constant;
            return true;
        } else {
            return false;
        }
    });

    return current;
};

PHP.Utils.Filesize = function( size ) {

    if ( /^\d+M$/i.test( size )) {
        return (size.replace(/M/g,"") - 0) * 1024 * 1024;
    } else if ( /^\d+K$/i.test( size )) {
        return (size.replace(/K/g,"") - 0) * 1024;
    }

    return size;

};

PHP.Utils.QueryString = function( str ) {
    str = str.trim();
    var variables = str.split(/&/);

    var items = {};

    // going through each variable which have been split by &
    variables.forEach( function( variable ) {

        var parts = variable.split(/=/),
            key = decodeURIComponent( parts[ 0 ] ),
            value = (parts.length > 1 ) ? decodeURIComponent( parts[ 1 ] ) : null,

            arrayManager = function( item, parse, value ) {
                var arraySearch = parse.match(/^\[([a-z0-9+_\-\[]*)\]/i);
                if ( arraySearch !== null ) {
                    var key = ( arraySearch[ 1 ] === undefined ) ? Object.keys( item ).length : arraySearch[ 1 ];

                    if ( key.length === 0 ) {
                        key = Object.keys(item).length;

                    }
                    parse = parse.substring( arraySearch[ 0 ].length );

                    if ( parse.length > 0  ) {
                        if ( typeof item[ key ] !== "object" && item[ key ] !== null ) {
                            item[ key ] = {};
                        }

                        var ret = arrayManager( item[ key ], parse, value );

                        if ( ret !== undefined ) {
                            item[ key ] = ret;
                        }

                    } else {

                        item[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
                    }


                } else {
                    if ( parse === "]") {
                        item = value;
                        return value;
                    }

                }


            };


            var arraySearch = key.match(/^(.*?)((\[[a-z+0-9_\-\[\]]*\])+)$/i);

            if ( arraySearch !== null ) {
                key =  arraySearch[ 1 ];



                if ( typeof items[ key ] !== "object" ) {
                    items[ key ] = {};

                }

                arrayManager( items[ key ], arraySearch[ 2 ], value );


            }
            else  {
                items[ key ] = ( value !== null) ? value.replace(/\+/g," ") : null;
            }

        }, this);

    return items;
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 5.7.2012 
* @website http://hertzen.com
 */


PHP.Halt = function( msg, level, lineAppend, catchable  ) {
    
    this.msg = msg;
    this.level = level;
    this.lineAppend = lineAppend;
    this.catchable = catchable;
    
};

PHP.Compiler = function( AST, file, opts ) {
    
    this.file = file;
    this.src = "";
    this.FOREACH_COUNT = 0;
    opts = opts || {};
 
    this.FUNC_NUM = 0;
    this.dimVars = "";
    this.tmpDimVars = "";
    this.DEPRECATED = [];
    this.dimPrev = "";
    
    this.INSIDE_METHOD = (opts.INSIDE_METHOD !== undefined ) ? opts.INSIDE_METHOD  : false;
        
    this.src += this.stmts( AST, true );
    
    /*
    AST.forEach( function( action ){
        if ( this.FATAL_ERROR !== undefined ) {
            return;
        }
        this.src += this[ action.type ]( action ) + ";\n";     
    }, this );*/

    if ( this.FATAL_ERROR !== undefined ) {
        this.src = 'this[ PHP.Compiler.prototype.ERROR ]("' + this.FATAL_ERROR + '", ' +((  this.ERROR_TYPE === undefined ) ? "PHP.Constants.E_ERROR" : this.ERROR_TYPE ) + ');';
    }
    var tmp = "";
    this.DEPRECATED.forEach(function( error ){
        
        tmp +=   'this[ PHP.Compiler.prototype.ERROR ]("' + error[ 0 ] + ' in ' + this.file + ' on line ' + error[ 1 ] + '", PHP.Constants.E_DEPRECATED);';
    
    }, this);
    
    this.src = tmp + this.src;
    


};

var COMPILER = PHP.Compiler.prototype;

COMPILER.getName = function( item ) {
    var parts = item.parts;
    if (Array.isArray( parts )) {
        return parts[ 0 ];
    } else {
        return parts;
    }

};

COMPILER.stmts = function( stmts, main ) {
    var src = "";
    
    stmts.forEach(function( stmt ){
        if ( this.FATAL_ERROR !== undefined ) {
            return;
        }
        
        var tmp = this.source( stmt );
        
        if ( this.dimVars.length > 0 || this.tmpDimVars.length > 0 ) {
            src +=  this.dimVars + this.tmpDimVars;
            this.dimVars = this.tmpDimVars = "";
        }   
        
        src += tmp;
        
        if ( stmt.type === "Node_Expr_New") {
            // init class without assign, call destruct ( this might not be valid in all cases )
            src += "." + this.UNSET + "()";
            
        }
        
        if (  /^Node_Expr_Post(Inc|Dec)$/.test( stmt.type ) ) {
            // trigger POST_MOD
            src += "." + this.VARIABLE_VALUE;
        }
        
        src += ";\n";
    }, this);
  
    return src;
};

COMPILER.source = function( action ) {
    
   
    
    if ( action === null ) {
        return "undefined";
    }
    
    
    if (typeof action === "string") {
        return action;
    } else if ( action === undefined ) {
        
        return undefined;
    } else if ( action.type === "Node_Name" ) {
        return this.getName( action );
    }
     
    if ( Array.isArray( action )) {
        return this[ action[0].type ]( action[0] );
    }
  
    return this[ action.type ]( action );
};

COMPILER.FILE_PATH = "$FILE_PATH"; 

COMPILER.NAV = "$NaV"; // not a variable;

COMPILER.FILESYSTEM = "$FS";

COMPILER.RESOURCES = "\π";

COMPILER.TIMER = "$Timer";

COMPILER.ENV = "ENV";

COMPILER.OUTPUT_BUFFER = "OUTPUT_BUFFER";

COMPILER.OUTPUT_BUFFERS = "OUTPUT_BUFFERS";

COMPILER.CTX = COMPILER.ENV + ".";

COMPILER.PARAM_NAME = "n";

COMPILER.PARAM_BYREF = "r";

COMPILER.CATCH = "$Catch";

COMPILER.EXCEPTION = "$Exception";

COMPILER.SUPPRESS = "$Suppress";

COMPILER.CONSTANTS = "$Constants";

COMPILER.CONSTANT_GET = "get";

COMPILER.CLASS_CONSTANT_GET = "$Class.ConstantGet";

COMPILER.CONSTANT_SET = "set";

COMPILER.CONSTANT_DEFINED = "defined";

COMPILER.MAGIC_CONSTANTS = "$MConstants";

COMPILER.ASSIGN = "_";

COMPILER.ASSIGN_PLUS = "_Plus";

COMPILER.ASSIGN_MINUS = "_Minus";

COMPILER.ASSIGN_CONCAT = "_Concat";

COMPILER.NEG = "$Neg";

COMPILER.ADD = "$Add";

COMPILER.MUL = "$Mul";

COMPILER.MOD = "$Mod";

COMPILER.DIV = "$Div";

COMPILER.FUNCTION = "$F";

COMPILER.FUNCTION_HANDLER = "$FHandler";

COMPILER.FUNCTION_STATIC = "$Static";

COMPILER.FUNCTION_GLOBAL = "$Global";

COMPILER.FUNCTION_STATIC_SET = "$Set";

COMPILER.BOOLEAN_OR = "$Or";

COMPILER.PRE_INC = "$PreInc";

COMPILER.PRE_DEC = "$PreDec";

COMPILER.POST_INC = "$PostInc";

COMPILER.POST_DEC = "$PostDec";

COMPILER.MINUS = "$Minus";

COMPILER.CONCAT = "$Concat";

COMPILER.UNSET = "$Unset";

COMPILER.NOT_IDENTICAL = "$NIdentical";

COMPILER.IDENTICAL = "$Identical";

COMPILER.BOOLEAN_NOT = "$Not";

COMPILER.BOOLEAN_AND = "$And";

COMPILER.EQUAL = "$Equal";

COMPILER.NOT_EQUAL = "$Equal";

COMPILER.SMALLER = "$Smaller";

COMPILER.SMALLER_OR_EQUAL = "$S_Equal";

COMPILER.GREATER = "$Greater";

COMPILER.GREATER_OR_EQUAL = "$G_Equal";

COMPILER.LABEL = "LABEL";

COMPILER.LABEL_COUNT = 0;

COMPILER.VARIABLE = "$";

COMPILER.VARIABLE_VALUE = "$";

COMPILER.CREATE_VARIABLE = "$$";

COMPILER.ARRAY_CLONE = "$AClone";

COMPILER.VARIABLE_CLONE = "$VClone";

COMPILER.ARRAY_GET = "offsetGet";

COMPILER.ARRAY_SET = "offsetSet";

COMPILER.METHOD_CALL = "$Call";

COMPILER.DIM_FETCH = "$Dim";

COMPILER.DIM_ISSET = "$DimIsset";

COMPILER.DIM_UNSET = "$DimUnset";

COMPILER.DIM_EMPTY = "$DimEmpty";

COMPILER.STATIC_CALL = "$StaticCall";

COMPILER.CLASS_NAME = "$Name";

COMPILER.INTERFACE_NEW = "$Class.INew";

COMPILER.CLASS_NEW = "$Class.New";

COMPILER.CLASS_GET = "$Class.Get";

COMPILER.CLASS_STORED = "$StoredIn";

COMPILER.CLASS_CLONE = "$CClone";

COMPILER.CLASS_PROPERTY_GET = "$Prop";

COMPILER.CLASS_PROPERTY_ISSET = "$PropIsset";

COMPILER.CLASS_STATIC_PROPERTY_ISSET = "$SPropIsset";

COMPILER.STATIC_PROPERTY_GET = "$SProp";

COMPILER.CLASS_METHOD = "Method";

COMPILER.CLASS_CONSTANT = "Constant";

COMPILER.CLASS_CONSTANT_FETCH = "$Constant";

COMPILER.PROPERTY_TYPE = "p";

COMPILER.PROPERTY_DEFAULT = "d";

COMPILER.CLASS_PROPERTY = "Variable";

COMPILER.CLASS_DECLARE = "Create";

COMPILER.CLASS_NAMES = "$CLASSNAMES";

COMPILER.CLASS_DESTRUCT = "$Destruct";

COMPILER.CLASS_TYPE = "$CType";

COMPILER.ARRAY_VALUE = "v";

COMPILER.ARRAY_KEY = "k";

COMPILER.ERROR  = "$ERROR";

COMPILER.GLOBAL  = "$Global";

COMPILER.SIGNATURE  = "$SIGNATURE";

COMPILER.DISPLAY_HANDLER  = "$DisplayHandler";

COMPILER.TYPE_CHECK  = "$TypeCheck";

COMPILER.INSTANCEOF  = "$InstanceOf";

COMPILER.fixString =  function( result ) {
    
    

    
    if ( result.match(/^("|')/) === null) {
        result = '"' + result + '"';
    }
    

    
    if (result.match(/\r\n/) !== null) {
        var quote = result.substring(0, 1);
        

        
        // this might have unexpected consequenses
        result = result.replace(/\r\n"$/,'"');
        
        result = '[' + result.split(/\r\n/).map(function( item ){
            var a = item.replace(/\r/g,"").replace(/\n/,"\\n");
            return a;
        }).join( quote + "," + quote ) + '].join("\\n")';
                
    }
    
    result = result.replace(/([^\\])\\([^\\nrt\$'"])/g, "$1\\\\$2");
        
    return result;
    
/*
    $val = str_replace("\\", "\\\\", $val);
    //$val = str_replace("\n", "\\n", $val);
    //$val = str_replace("\t", "\\t", $val);
    $val = str_replace('"', '\\"', $val);
    //$val = str_replace('\\\\', '\\\\\\\\', $val);

    $val = str_replace("\n", "\\n", $val);
    $val = str_replace("\t", "\\t", $val);
*/


}


PHP.Compiler.prototype.Node_Expr_ArrayDimFetch = function( action ) {

    var part;

    if ( action.dim !== undefined &&  action.dim !== null && (/^Node_Expr_(FuncCall|Plus)$/.test(action.dim.type) )) {


        var tmp ="var dim" + ++this.FUNC_NUM + " = " + this.CREATE_VARIABLE + "(" + this.source( action.dim ) + "." + this.VARIABLE_VALUE + ");";



        if (this.tmpDimVars.length === 0 ) {
            this.tmpDimVars += tmp;
        } else {
            if ( this.dimPrev ===  "Node_Expr_Plus" ) {
                this.dimVars += this.tmpDimVars + tmp;
            } else {
                this.dimVars += tmp + this.tmpDimVars;
            }
            this.tmpDimVars = "";
        }
        this.dimPrev = action.dim.type;



        part = "dim" + this.FUNC_NUM;
    } else {
        part = this.source( action.dim );
    }

    var src = "", variable;

    if ( action.variable.type === "Node_Expr_PropertyFetch") {
        variable = this.Node_Expr_PropertyFetch( action.variable, true );
    } else {
        variable = this.source( action.variable );
    }

    src += variable + "."  + this.DIM_FETCH + '( this, ' + part + " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Assign = function( action ) {

    if ( action.variable.type === "Node_Expr_Variable" && action.variable.name === "this") {
        this.FATAL_ERROR = "Cannot re-assign $this in " + this.file + " on line " + action.attributes.startLine;
    }


    var src = this.source( action.variable ) + "." + this.ASSIGN;
    if ( action.expr !== undefined ) {
        if ( action.expr.type !== "Node_Expr_Assign") {
            src += "(" + this.source( action.expr ) + ")";
        } else {
            src += "(" + this.source( action.expr.variable ) + ", " + this.source( action.expr.expr ) + ")";
        }
    } else  {
        src += "(" + this.source( action.refVar ) + ")";

    }
    /*
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }*/
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignMinus = function( action ) {
    var src = this.source( action.variable ) + "." + this.ASSIGN_MINUS + "(" + this.source( action.expr ) + ")";
    /*
  if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }*/
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignPlus = function( action ) {
    var src = this.source( action.variable ) + "." + this.ASSIGN_PLUS + "(" + this.source( action.expr ) + ")";
    /*
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }*/
    return src;
};


PHP.Compiler.prototype.Node_Expr_AssignMul = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " *= " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};


PHP.Compiler.prototype.Node_Expr_AssignDiv = function( action ) {
    var src = this.source( action.variable ) + "." + this.VARIABLE_VALUE + " /= " + this.source( action.expr );
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignConcat = function( action ) {
    var src = this.source( action.variable ) + "." + this.ASSIGN_CONCAT + "(" + this.source( action.expr ) + ")";
    /*
    if (!/Node_Expr_(Plus|Mul|Div|Minus|BitwiseOr|BitwiseAnd)/.test(action.expr.type)) {
        src += "." + this.VARIABLE_VALUE;
    }*/
    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignRef = function( action ) {
    if ( action.refVar.type === "Node_Expr_New") {
        this.DEPRECATED.push(["Assigning the return value of new by reference is deprecated", action.attributes.startLine]);
    }


    var src = "";
    if (action.variable.type === "Node_Expr_StaticPropertyFetch") {
        src +=  this.Node_Expr_StaticPropertyFetch( action.variable, true );
    } else {
        src += this.source( action.variable );
    }
    src += "." + PHP.VM.Variable.prototype.REF + "(" + this.source( action.refVar ) + ")";
    return src;
};

PHP.Compiler.prototype.Node_Expr_Ternary = function( action ) {
    var src = "(( " + this.source( action.cond ) + "." + this.VARIABLE_VALUE + " ) ? " + this.source( action.If ) + " : " + this.source( action.Else ) + ")";

    return src;
};

PHP.Compiler.prototype.Node_Expr_ErrorSuppress = function( action ) {
    var src = this.CTX + this.SUPPRESS + "(function() { return " + this.source( action.expr ) + " })";
    return src;
};

PHP.Compiler.prototype.Node_Expr_FuncCall = function( action ) {

    var src = "(" + this.CTX + this.FUNCTION + '(';


    if ( action.func.type !== "Node_Name") {
        src +=  this.source( action.func ) + "." + this.VARIABLE_VALUE + ", arguments";
    } else {
        src += '"' + this.getName( action.func ) + '", arguments';

        if (this.getName( action.func ) === "eval") {
            src += ", $, $Static, this";

            if (this.INSIDE_METHOD ) {
                src += ", ctx";
            } else {
                src += ", undefined"
            }
            src += ", ENV";
        // args.push("$");
        }

    }

    action.args.forEach(function( arg ){
        if (arg.value.type === "Node_Expr_PropertyFetch") {
            src += ", " + this.Node_Expr_PropertyFetch( arg.value, true );
        } else {
            src += ", " + this.source( arg.value );
        }

    //    args.push( this.source( arg.value ) );
    }, this);

    src += "))";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Exit = function( action ) {
    var src = this.CTX + "exit( " + this.source(action.expr) + " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_AssignList = function( action ) {

    var src = this.CTX + "list( ";




    var addList = function( assignList ) {
        var first = "";
        assignList.forEach(function( item ){
            if (Array.isArray( item )) {
                src += first + " [";
                addList( item );
                src += "]";

            } else {
                src += first + " " + this.source(item) ;
            }
            first = ", ";
        }, this);

    }.bind(this);
    addList( action.assignList );
    src += ", " + this.source(action.expr) + " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Isset = function( action ) {

    var src = this.CTX + "$isset( ";

    var args = [];
    action.variables.forEach(function( arg ){

        switch (arg.type) {

            case "Node_Expr_ArrayDimFetch":
                args.push( this.source( arg.variable ) + "."  + this.DIM_ISSET + '( this, ' + this.source( arg.dim ) + " )" );
                break;
            case "Node_Expr_PropertyFetch":

                args.push(  this.source( arg.variable ) + "." + this.VARIABLE_VALUE + "." + this.CLASS_PROPERTY_ISSET + '( this, "' + this.source( arg.name ) + '" )');

                break;

            case "Node_Expr_StaticPropertyFetch":

                args.push(  this.Node_Expr_StaticPropertyFetch( arg, undefined, true ));

                break;
            default:
                args.push( this.source( arg) );
        }


    }, this);

    src += args.join(", ") + " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Empty = function( action ) {

    var src = this.CTX + "$empty( ";
    switch (action.variable.type) {
        case "Node_Expr_ArrayDimFetch":
            src += this.source( action.variable.variable ) + "."  + this.DIM_EMPTY + '( this, ' + this.source( action.variable.dim ) + " )";
            break;
        default:
            src += this.source( action.variable ) ;
    }
    src += " )";

    return src;
};

PHP.Compiler.prototype.Node_Expr_Instanceof = function( action ) {


    var classPart;

    if (action.right.type === "Node_Name") {
        classPart = '"' + this.source(action.right) +'"';
    } else {
        classPart = this.source(action.right) + "." + this.VARIABLE_VALUE;
    }

    return this.source( action.left ) + "." + this.INSTANCEOF + '('  + classPart + ')';
};

PHP.Compiler.prototype.Node_Expr_UnaryPlus = function( action ) {
    return this.source( action.expr );
};

PHP.Compiler.prototype.Node_Expr_UnaryMinus = function( action ) {
    return this.source( action.expr ) + "." + this.NEG + "()";
};

PHP.Compiler.prototype.Node_Expr_BitwiseOr = function( action ) {
    return this.CREATE_VARIABLE + "(" + this.source( action.left )  + "." + this.VARIABLE_VALUE + " | " + this.source( action.right ) + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_BitwiseAnd = function( action ) {
    return this.CREATE_VARIABLE + "(" + this.source( action.left )  + "." + this.VARIABLE_VALUE + " & " + this.source( action.right ) + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_BitwiseNot = function( action ) {
    return this.CREATE_VARIABLE + "(" + "~" + this.source( action.expr ) + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_Div = function( action ) {
    return this.source( action.left ) + "." + this.DIV + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Minus = function( action ) {
    return this.source( action.left ) + "." + this.MINUS + "(" + this.source( action.right ) + ( /^Node_Expr_Post/.test( action.right.type ) ? ", true" : "" ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Mul = function( action ) {
    return this.source( action.left ) + "." + this.MUL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Mod = function( action ) {
    return this.source( action.left ) + "." + this.MOD + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Plus = function( action ) {

    var str =  "";


    if ( /^Node_Expr_((Static)?Property|ArrayDim)Fetch$/.test(action.left.type) ) {
        str += this.CREATE_VARIABLE + "(" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_DOUBLE + "." + this.VARIABLE_VALUE + ")";
    } else {
        str += this.source( action.left );
    }

    str += "." + this.ADD + "(" + this.source( action.right ) + ")";

    return str;


};

PHP.Compiler.prototype.Node_Expr_Equal = function( action ) {
    return this.source( action.left ) + "." + this.EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_NotEqual = function( action ) {
    return this.source( action.left ) + "." + this.NOT_EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_NotIdentical = function( action ) {
    return this.source( action.left ) + "." + this.NOT_IDENTICAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Identical = function( action ) {
    return this.source( action.left ) + "." + this.IDENTICAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_LogicalOr = function( action ) {
    return  this.CREATE_VARIABLE + "(" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + " || " + this.source( action.right )  + "." +PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_LogicalAnd = function( action ) {
    return  this.CREATE_VARIABLE + "(" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + " && " + this.source( action.right )  + "." +PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_LogicalXor = function( action ) {
    return  this.CREATE_VARIABLE + "(" + "!" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + " != " + "!" + this.source( action.right )  + "." +PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_BooleanOr = function( action ) {
    return  this.CREATE_VARIABLE + "(" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + " || " + this.source( action.right )  + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_BooleanAnd = function( action ) {
    return  this.CREATE_VARIABLE + "(" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + " && " + this.source( action.right )  + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_BooleanNot = function( action ) {
    return this.CREATE_VARIABLE + "(" + "!" + this.source( action.expr ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";
};

PHP.Compiler.prototype.Node_Expr_Smaller = function( action ) {
    return this.source( action.left ) + "." + this.SMALLER+ "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_Greater = function( action ) {
    return this.source( action.left ) + "." + this.GREATER+ "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_GreaterOrEqual = function( action ) {
    return this.source( action.left ) + "." + this.GREATER_OR_EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_SmallerOrEqual = function( action ) {
    return this.source( action.left ) + "." + this.SMALLER_OR_EQUAL + "(" + this.source( action.right ) + ")";
};

PHP.Compiler.prototype.Node_Expr_PreInc = function( action ) {
    return this.source( action.variable ) + "." + this.PRE_INC + "()";
};

PHP.Compiler.prototype.Node_Expr_PreDec = function( action ) {
    return this.source( action.variable ) + "." + this.PRE_DEC + "()";
};

PHP.Compiler.prototype.Node_Expr_PostInc = function( action ) {
    return this.source( action.variable ) + "." + this.POST_INC + "()";
};

PHP.Compiler.prototype.Node_Expr_PostDec = function( action ) {
    return this.source( action.variable ) + "." + this.POST_DEC + "()";
};

PHP.Compiler.prototype.Node_Expr_Concat = function( action ) {
    var str =  "";


    if ( /^Node_Expr_((Static)?Property|ArrayDim)Fetch$/.test(action.left.type) )  {
        str += this.CREATE_VARIABLE + "(" + this.source( action.left ) + "." + PHP.VM.Variable.prototype.CAST_STRING + "." + this.VARIABLE_VALUE + ")";
    } else {
        str += this.source( action.left );
    }

    str += "." + this.CONCAT + "(" + this.source( action.right ) + ")";

    return str;

};

PHP.Compiler.prototype.Node_Expr_Print = function( action ) {

    var src = this.CTX + 'print( ';

    src += this.source(action.expr);


    src += ' )';
    return src;
};

PHP.Compiler.prototype.Node_Expr_Variable = function( action ) {
    var src = this.VARIABLE + "(";

    if ( action.name === "this" ) {
        src += '"' + this.source( action.name ) + '"';
    //  return action.name;
    } else {

        if ( typeof action.name === "string" ) {
            src += '"' + this.source( action.name ) + '"';
        } else {
            src += this.source( action.name ) + "." + this.VARIABLE_VALUE;
        }

    //  return this.VARIABLE + '("' + this.source( action.name ) + '")';
    }

    return src + ")";
};

PHP.Compiler.prototype.Node_Expr_Cast_String = function( action ) {
    return  this.source( action.expr ) + "." + PHP.VM.Variable.prototype.CAST_STRING;
};

PHP.Compiler.prototype.Node_Expr_Cast_Int = function( action ) {
    return  this.source( action.expr ) + "." + PHP.VM.Variable.prototype.CAST_INT;
};

PHP.Compiler.prototype.Node_Expr_Cast_Double = function( action ) {
    return  this.source( action.expr ) + "." + PHP.VM.Variable.prototype.CAST_DOUBLE;
};

PHP.Compiler.prototype.Node_Expr_Cast_Bool = function( action ) {
    return  this.source( action.expr ) + "." + PHP.VM.Variable.prototype.CAST_BOOL;
};

PHP.Compiler.prototype.Node_Expr_Include = function( action ) {
    return  this.CTX + "include( " +this.VARIABLE + ", " + this.FUNCTION_STATIC + ", " + this.source( action.expr ) + " )";
};

PHP.Compiler.prototype.Node_Expr_IncludeOnce = function( action ) {
    return  this.CTX + "include_once( " +this.VARIABLE + ", " + this.FUNCTION_STATIC + ", " + this.source( action.expr ) + " )";
};

PHP.Compiler.prototype.Node_Expr_Require = function( action ) {
    return  this.CTX + "require( " +this.VARIABLE + ", " + this.FUNCTION_STATIC + ", " + this.source( action.expr ) + " )";
};

PHP.Compiler.prototype.Node_Expr_RequireOnce = function( action ) {
    return  this.CTX + "require_once( " +this.VARIABLE + ", " + this.FUNCTION_STATIC + ", " + this.source( action.expr ) + " )";
};

PHP.Compiler.prototype.Node_Expr_New = function( action ) {


    var classPart,
    src = "";

    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }

    src += this.CREATE_VARIABLE + '(new (' + this.CTX + this.CLASS_GET + '(' + classPart + '))( this';

    action.args.forEach(function( arg ) {
        if (arg.value.type === "Node_Expr_PropertyFetch") {
            src += ", " + this.Node_Expr_PropertyFetch( arg.value, true );
        } else {
            src += ", " + this.source( arg.value );
        }
    //   src += ", "  + this.source( arg.value );
    }, this);

    src += " ))";

    return src;
};



PHP.Compiler.prototype.Node_Expr_ConstFetch = function( action ) {

    if (/true|false|null/i.test(action.name.parts)) {
        return this.CREATE_VARIABLE + '(' + action.name.parts.toString().toLowerCase() + ')';
    } else {
        return this.CTX + this.CONSTANTS + '.' + this.CONSTANT_GET + '("' + this.source( action.name ) + '")';
    }

};


PHP.Compiler.prototype.Node_Expr_MethodCall = function( action ) {

    var classPart, src = "";


    if (action.name.type === undefined) {
        classPart = '"' + action.name +'"';
    } else {
        classPart = this.source(action.name) + "." + this.VARIABLE_VALUE;
    }


    src += this.source( action.variable ) + "." + this.METHOD_CALL + '( ';

    src += ( action.variable.name === "this") ? "ctx" : "this";

    src += ', ' + classPart;

    action.args.forEach(function( arg ) {

        if (arg.value.type === "Node_Expr_PropertyFetch") {
            src += ", " + this.Node_Expr_PropertyFetch( arg.value, true );
        } else {
            src += ", " + this.source( arg.value );
        }

    // src += ", " + this.source( arg.value );
    }, this);



    src += ")";

    return src;

};

PHP.Compiler.prototype.Node_Expr_PropertyFetch = function( action, funcCall ) {

    var classParts = "";

    if ( typeof action.name === "string" ) {
        classParts += '"' +  this.source( action.name ) + '"';
    } else {
        classParts +=  this.source( action.name ) + "." +  this.VARIABLE_VALUE;
    }
    var extra = "";
    if ( funcCall === true ) {
        extra = ", true";
    }

    var variable;
    if ( action.variable.type === "Node_Expr_PropertyFetch") {
        variable = this.Node_Expr_PropertyFetch( action.variable, funcCall );
    } else {
        variable = this.source( action.variable );
    }

    if ( action.variable.name !== "this" ) {
        return variable + "." + this.CLASS_PROPERTY_GET + '( this, ' + classParts + extra + ' )';
    } else {
        return variable + "." + this.CLASS_PROPERTY_GET + '( ctx, ' + classParts + extra + ' )';
    }

};

PHP.Compiler.prototype.Node_Expr_ClassConstFetch = function( action ) {

    var classPart;

    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }


    return this.CTX + this.CLASS_CONSTANT_GET + '(' + classPart + ', this, "' + action.name  + '" )';


};

PHP.Compiler.prototype.Node_Expr_StaticCall = function( action ) {

    var src = "";

    var classPart,
    funcPart;

    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }

    if (typeof action.func === "string") {
        funcPart = '"' + this.source(action.func) + '"';
    } else {
        funcPart = this.source(action.func) + "." + this.VARIABLE_VALUE;
    }

    if (/^(parent|self)$/i.test( action.Class.parts )) {
        src += "this." + this.STATIC_CALL + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', ' + funcPart;
    } else {
        src += this.CTX + this.CLASS_GET + '(' + classPart + ', this).' + this.STATIC_CALL + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', ' + funcPart ;
    }


    action.args.forEach(function( arg ) {

        if (arg.value.type === "Node_Expr_PropertyFetch") {
            src += ", " + this.Node_Expr_PropertyFetch( arg.value, true );
        } else {
            src += ", " + this.source( arg.value );
        }

    //  src += ", " + this.source( arg.value );
    }, this);

    src += ")";

    return src;

};

PHP.Compiler.prototype.Node_Expr_StaticPropertyFetch = function( action, ref, isset ) {

    var src = "",
    extra = "",
    classPart;


    var actionParts = "";

    if ( typeof action.name === "string" ) {
        actionParts += '"' +  this.source( action.name ) + '"';
    } else {
        actionParts +=  this.source( action.name ) + "." +  this.VARIABLE_VALUE;
    }



    if (action.Class.type === "Node_Name") {
        classPart = '"' + this.source(action.Class) +'"';
    } else {
        classPart = this.source(action.Class) + "." + this.VARIABLE_VALUE;
    }

    if ( ref === true) {
        extra = ", true";
    }





    if (/^(parent|self)$/i.test( action.Class.parts )) {
        src += "this." + (( isset === true ) ? this.CLASS_STATIC_PROPERTY_ISSET : this.STATIC_PROPERTY_GET  ) + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', ' + actionParts;
    } else {
        src += this.CTX + this.CLASS_GET + '(' + classPart + ', this).' + (( isset === true ) ? this.CLASS_STATIC_PROPERTY_ISSET : this.STATIC_PROPERTY_GET  ) + '( ' + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ', ' + classPart +', ' + actionParts;
    }


    src += extra + ")";

    return src;

};

PHP.Compiler.prototype.Node_Expr_Array = function( action ) {

    var src = this.CTX + "array([",
    items = [];

    ((Array.isArray(action.items)) ? action.items : [ action.items ]).forEach(function( item ){
        if (item.value !== undefined ) {
            items.push("{" + this.ARRAY_VALUE + ":" + this.source( item.value ) + ( ( item.key !== undefined) ? ", " + this.ARRAY_KEY + ":" + this.source( item.key ) : "") +  "}");
        }
    }, this);

    src += items.join(", ") + "])";
    return src;

};

PHP.Compiler.prototype.Node_Expr_Clone = function( action ) {

    var src = "";
    src += this.source( action.expr ) + "." + this.VARIABLE_VALUE + "." + this.CLASS_CLONE + "( this )";
    return src;

};
PHP.Compiler.prototype.Node_Stmt_Interface = function( action ) {
    action.stmts.forEach(function( stmt ){
        if ( stmt.type === "Node_Stmt_ClassMethod" && stmt.stmts !== null) {
            this.FATAL_ERROR = "Interface function " + action.name + "::" + stmt.name + "() cannot contain body {} on line " + action.attributes.startLine;
        }
    }, this);

    var src = this.CTX + this.INTERFACE_NEW + '( "' + action.name + '", [';

    
    var ints = [];

    function addInterface( interf ) {

        interf.forEach( function( item ){
            if  (Array.isArray( item )) {
                addInterface( item );
            } else {

                ints.push( '"' + item.parts + '"' );
            }
        });
    }

    addInterface( action.Extends );
    /*
        src += (Array.isArray(action.Implements[ 0 ]) ? action.Implements[ 0 ] : action.Implements ).map(function( item ){

            return '"' + item.parts + '"';
        }).join(", ");
        */
    src += ints.join(", ");

    /*
    var exts = [];

    action.Extends.forEach(function( ext ){
        exts.push( '"' + ext.parts + '"' );
    }, this);

    src += exts.join(", ")
    */
    src += "], function( M, $, $$ ){\n M";

    this.currentClass = action.name;
    action.stmts.forEach(function( stmt ) {
        src += this.source( stmt );
    }, this);


    src += "." + this.CLASS_DECLARE + '()})'


    return src;
};

PHP.Compiler.prototype.Node_Stmt_Class = function( action ) {
    var src = this.CTX + this.CLASS_NEW + '( "' + action.name + '", ' + action.Type + ', {';

    if ( action.Extends !== null ) {
        src += 'Extends: "' + this.source(action.Extends) + '"';
    }

    if ( action.Implements.length > 0 ) {
        if ( action.Extends !== null ) {
            src += ", "
        }

        // properly borken somewhere in the parser
        src += 'Implements: [';

        var ints = [];

        function addInterface( interf ) {

            interf.forEach( function( item ){
                if  (Array.isArray( item )) {
                    addInterface( item );
                } else {

                    ints.push( '"' + item.parts + '"' );
                }
            });
        }

        addInterface( action.Implements );
        /*
        src += (Array.isArray(action.Implements[ 0 ]) ? action.Implements[ 0 ] : action.Implements ).map(function( item ){

            return '"' + item.parts + '"';
        }).join(", ");
        */
        src += ints.join(", ");
        src += "]";
    }

    src += "}, function( M, $, $$ ){\n M";

    this.currentClass = action.name;
    action.stmts.forEach(function( stmt ) {
        src += this.source( stmt );
    }, this);

    src += "." + this.CLASS_DECLARE + '()'

    src += "})"




    return src;
};


PHP.Compiler.prototype.Node_Stmt_Echo = function( action ) {
    var src = this.CTX + 'echo( ',
    args = [];
    if ( Array.isArray(action.exprs) ) {
        action.exprs.forEach(function( arg ){
            args.push( this.source( arg ) );
        }, this);
        src += args.join(", ");
    } else {
        src += this.source(action.exprs);
    }

    src += ' )';
    return src;
};

PHP.Compiler.prototype.Node_Stmt_For = function( action ) {

    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";

    src += "for( ";

    if ( !Array.isArray(action.init) || action.init.length !== 0 ) {
        src += this.source( action.init );
    }

    src += "; ";

    if ( !Array.isArray(action.cond) || action.cond.length !== 0 ) {
        src += "(" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE;
    }

    src += "; "

    // if ( !Array.isArray(action.loop) || action.loop.length !== 1 ) { // change

    if ( action.loop.length > 0 ) {
        src += this.source( action.loop ) + "." + this.VARIABLE_VALUE;
    }
    // }
    src += " ) { ";

    src += this.CTX + this.TIMER + "();\n";

    src += this.stmts( action.stmts );

    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_While = function( action ) {

    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";

    src += "while( " + this.source( action.cond ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {";

    src += this.CTX + this.TIMER + "(); \n";

    src += this.stmts( action.stmts );

    src += "}";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Do = function( action ) {

    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";
    src += "do {\n"
    src += this.stmts( action.stmts );
    src += "} while( " + this.source( action.cond ) + "." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ")";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Switch = function( action ) {
    var src = this.LABEL + this.LABEL_COUNT++ + ":\n";
    src += "switch(" + this.source( action.cond ) + "." + this.VARIABLE_VALUE+ ") {\n";

    action.cases.forEach(function( item ){
        src += this.source( item ) + ";\n";
    }, this);
    src += "}";


    return src;
};

PHP.Compiler.prototype.Node_Stmt_Case = function( action ) {

    var src = "";
    if (action.cond === null) {
        src += "default:\n";
    } else {
        src += "case (" + this.source( action.cond ) + "." + this.VARIABLE_VALUE+ "):\n";
    }


    action.stmts.forEach(function( item ){
        src += this.source( item ) + ";\n";
    }, this);



    return src;
};

PHP.Compiler.prototype.Node_Stmt_Foreach = function( action ) {

    if ( action.expr.type === "Node_Expr_Array" && action.byRef === true ) {

        if (action.keyVar === null) {
            this.FATAL_ERROR = "syntax error, unexpected '&' in " + this.file + " on line " + action.attributes.startLine;
            this.ERROR_TYPE = PHP.Constants.E_PARSE;
        } else {
            this.FATAL_ERROR = "Cannot create references to elements of a temporary array expression in " + this.file + " on line " + action.attributes.startLine;
        }
        return;
    }

    var count = ++this.FOREACH_COUNT;
    var src = "var iterator" + count + " = " + this.CTX + "$foreachInit(" + this.source( action.expr ) + ", " + ( (this.INSIDE_METHOD === true) ? "ctx" : "this") + ");\n";
    src += "while(" + this.CTX + 'foreach( iterator' + count + ', ' + action.byRef + ", " + this.source( action.valueVar );

    if (action.keyVar !== null) {
        src += ', ' + this.source( action.keyVar );
    }
    src += ')) {\n'

    src += this.stmts( action.stmts );

    src += '} '

    src += this.CTX + "$foreachEnd( iterator" + count + " )";
    return src;
};


PHP.Compiler.prototype.Node_Stmt_Continue = function( action ) {

    var src = "continue";
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Break = function( action ) {

    var src = "break"

    if (action.num !== null) {
        src += " " + this.LABEL + (this.LABEL_COUNT - action.num.value );
    }
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Function = function( action ) {

    var src = this.CTX +  action.name + " = Function.prototype.bind.apply( function( " + this.VARIABLE + ", " + this.FUNCTION_STATIC + ", " + this.FUNCTION_GLOBAL + "  ) {\n";

    src += this.VARIABLE + " = " + this.VARIABLE + "(["
    var params = [];
    ((action.params[ 0 ] === undefined || !Array.isArray( action.params[ 0 ] ) ) ? action.params : action.params[ 0 ]).forEach(function( param ){

        if ( param.type === "Node_Param" ) {
            var item = '{' + this.PARAM_NAME +':"' + param.name + '"';

            if ( param.byRef === true ) {
                item += "," + this.PARAM_BYREF + ':true'
            }

            if (param.def !== null) {
                item += ", " + this.PROPERTY_DEFAULT  + ": " + this.source( param.def )
            }

            if (param.Type !== null ) {
                item += ", " +  this.PROPERTY_TYPE + ': "' + this.source( param.Type ) + '"'
            }


            item += '}'
            params.push( item );
        }

    }, this);

    src += params.join(", ") + "], arguments);\n"

    src += this.stmts( action.stmts );



    src += "}, (" + this.CTX + this.FUNCTION_HANDLER + ')( ENV, "' + action.name + '", ' + action.byRef + '  ))';


    return src;
};

PHP.Compiler.prototype.Node_Stmt_Static = function( action ) {
    // todo fix
    var src = this.FUNCTION_STATIC;
    action.vars.forEach( function( variable ){
        src += this.source( variable );
    }, this);


    return src;
};


PHP.Compiler.prototype.Node_Stmt_Global = function( action ) {
    // todo fix
    var src = this.FUNCTION_STATIC + "." + this.FUNCTION_GLOBAL + "([",
    vars = [];

    action.vars.forEach( function( variable ){
        vars.push( '"' + variable.name + '"' );

    }, this);
    src += vars.join(", ") + "])";
    return src;
};

PHP.Compiler.prototype.Node_Stmt_StaticVar = function( action ) {
    // todo fix
    var src = "." + this.FUNCTION_STATIC_SET + '("' + action.name + '", ' + (( action.def === null) ? "new PHP.VM.Variable()" : this.source( action.def )) + ")";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Property = function( action ) {
    var src = "";

    action.props.forEach(function( prop ){

        src += "." + this.CLASS_PROPERTY + '( "' + prop.name + '", ' + action.Type;
        if ( prop.def !== null ) {
            src += ', ' + this.source( prop.def );
        }

        src += " )\n";

    }, this);

    return src;
};

PHP.Compiler.prototype.Node_Stmt_Unset = function( action ) {
    var src = this.CTX + "unset( ",
    vars = [];

    action.variables.forEach(function( variable ){
        switch (variable.type) {

            case "Node_Expr_ArrayDimFetch":
                vars.push( this.source( variable.variable ) + "."  + this.DIM_UNSET + '( this, ' + this.source( variable.dim ) + " )" );
                break;
            default:
                vars.push( this.source( variable ) );
        }


    }, this);

    src += vars.join(", ") + " )";

    return src;
};

PHP.Compiler.prototype.Node_Stmt_InlineHTML = function( action ) {
    var src = this.CTX + '$ob("' + action.value.replace(/[\\"]/g, '\\$&').replace(/\n/g,"\\n").replace(/\r/g,"") + '")';

    return src;
};

PHP.Compiler.prototype.Node_Stmt_If = function( action ) {
    var src = "if ( (" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {\n";

    action.stmts.forEach(function( stmt ){
        src += this.source( stmt) + ";\n";
    }, this);

    action.elseifs.forEach(function( Elseif ){
        src += this.source( Elseif) + "\n";
    }, this);


    if ( action.Else !== null ) {
        src += "} else {\n";

        action.Else.stmts.forEach(function( stmt ){
            src += this.source( stmt) + ";\n";
        }, this);
    }

    src += "}"



    return src;
};

PHP.Compiler.prototype.Node_Stmt_ElseIf = function( action ) {
    var src = "} else if ( (" + this.source( action.cond ) + ")." + PHP.VM.Variable.prototype.CAST_BOOL + "." + this.VARIABLE_VALUE + ") {\n";

    action.stmts.forEach(function( stmt ){
        src += this.source( stmt) + ";\n";
    }, this);

    return src;
};


PHP.Compiler.prototype.Node_Stmt_Throw = function( action ) {
    var src = "throw " + this.source( action.expr );
    return src;
};

PHP.Compiler.prototype.Node_Stmt_TryCatch = function( action ) {
    var src = "try {\n";
    src += this.stmts( action.stmts ) + "} catch( emAll ) {\n";
    src += this.CTX + this.EXCEPTION + '( emAll )';

    action.catches.forEach(function( Catch ){
        src += this.source( Catch );
    }, this);

    src += ";\n }"


    this.source( action.expr );
    return src;
};

PHP.Compiler.prototype.Node_Stmt_Catch = function( action ) {
    var src = "." + this.CATCH + '( "' + action.variable + '", "' + action.Type.parts + '", ' + this.VARIABLE + ', function() {\n';
    src += this.stmts( action.stmts );
    src += "})"
    return src;

};

PHP.Compiler.prototype.Node_Stmt_ClassMethod = function( action ) {



    this.INSIDE_METHOD = true;
    var src = "." + this.CLASS_METHOD + '( "' + action.name + '", ' + action.Type + ', [';
    var props = [];



    ((Array.isArray(action.params[ 0 ])) ? action.params[ 0 ] : action.params).forEach(function( prop ){


        var obj = '{name:"' + prop.name +'"';



        if (prop.def !== null) {
            obj += ", " + this.PROPERTY_DEFAULT  + ": " + this.source( prop.def )
        }

        if (prop.Type !== null ) {
            obj += ", " +  this.PROPERTY_TYPE + ': "' + this.source( prop.Type ) + '"'
        }

        if (prop.byRef === true) {
            obj += ", " +  this.PARAM_BYREF + ': true'
        }

        obj += "}";

        props.push( obj );

    }, this)

    src +=  props.join(", ")  + '], ' + action.byRef + ', function( ' + this.VARIABLE + ', ctx, $Static ) {\n';

    if (action.stmts !== null ) {
        src += this.stmts( action.stmts );
    }

    src += '})\n';
    this.INSIDE_METHOD = false;
    return src;
};

PHP.Compiler.prototype.Node_Stmt_ClassConst = function( action ) {
    var src = "";

    ((Array.isArray( action.consts[ 0 ] )) ?  action.consts[ 0 ] : action.consts ).forEach(function( constant ){
        src += "." + this.CLASS_CONSTANT + '("' + constant.name + '", ' + this.source( constant.value ) + ")\n"
    }, this);
    return src;

};

PHP.Compiler.prototype.Node_Stmt_Return = function( action ) {
    return "return " + this.source( action.expr );

};
PHP.Compiler.prototype.Node_Scalar_String = function( action ) {

    return this.CREATE_VARIABLE + '(' + this.fixString(action.value) + ')';
       
};

PHP.Compiler.prototype.Node_Scalar_Encapsed = function( action ) {

    var parts = [],
    VARIABLE = PHP.VM.Variable.prototype;
    
    action.parts.forEach(function( part ){
        if ( typeof part === "string" ) {
            parts.push( this.fixString( part ) )
        } else {
            
            
            
            parts.push( this.source( (part[ 0 ] === undefined) ? part : part[ 0 ] ) + "." + VARIABLE.CAST_STRING + "." + this.VARIABLE_VALUE );
        }
    }, this);
    
    var src = this.CREATE_VARIABLE + "(" + parts.join(" + ") + ")";
    return src;

    
};

PHP.Compiler.prototype.Node_Scalar_LNumber = function( action ) {

    return this.CREATE_VARIABLE + '(' + action.value + ')';
    
};


PHP.Compiler.prototype.Node_Scalar_DNumber = function( action ) {

    return this.CREATE_VARIABLE + '(' + action.value + ')';
    
};


PHP.Compiler.prototype.Node_Scalar_LNumber = function( action ) {

    return this.CREATE_VARIABLE + '(' + action.value + ')';
    
};

PHP.Compiler.prototype.Node_Scalar_MethodConst = function( action ) {

    return this.VARIABLE + '("$__METHOD__")';  
};

PHP.Compiler.prototype.Node_Scalar_FuncConst = function( action ) {

    return this.VARIABLE + '("$__FUNCTION__")';  
};

PHP.Compiler.prototype.Node_Scalar_ClassConst = function( action ) {

    return this.VARIABLE + '("$__CLASS__")';  
};

PHP.Compiler.prototype.Node_Scalar_FileConst = function( action ) {

    return this.VARIABLE + '("$__FILE__")';  
//   return this.CTX + PHP.Compiler.prototype.MAGIC_CONSTANTS + '("FILE")';
    
};

PHP.Compiler.prototype.Node_Scalar_LineConst = function( action ) {
    return this.VARIABLE + '("$__LINE__")';  
//    return this.CTX + PHP.Compiler.prototype.MAGIC_CONSTANTS + '("LINE")';
    
};

PHP.Compiler.prototype.Node_Scalar_DirConst = function( action ) {
    return this.VARIABLE + '("$__DIR__")';  
  
};
/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 29.6.2012
 * @website http://hertzen.com
 */

PHP.Modules.prototype[ PHP.Compiler.prototype.FUNCTION_HANDLER ] = function( ENV, functionName, funcByRef ) {
    var args = [ null ], // undefined context for bind
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    handler,
    staticHandler = {},
    $GLOBAL = this[ COMPILER.GLOBAL ],
    __FILE__ = "$__FILE__",
    staticVars = {}; // static variable storage

    ENV.FUNCTION_REFS[ functionName ] = funcByRef;

    // initializer
    args.push( function( args, values ) {

        handler = PHP.VM.VariableHandler( ENV );
        var vals = Array.prototype.slice.call( values, 2 );



        args.forEach(function( argObject, index ){
            var arg = handler( argObject[ COMPILER.PARAM_NAME ] );

            PHP.Utils.ArgumentHandler( ENV, arg, argObject, vals[index], index, functionName );

            // redefine item in arguments object, to be used by func_get_arg(s)

            if ( argObject[ COMPILER.PARAM_BYREF ] === true ) {
                values[ index + 2 ] = arg;
            } else {
                values[ index + 2 ] = new PHP.VM.Variable( arg[ COMPILER.VARIABLE_VALUE ] );
            }
        });

        handler("GLOBALS", $GLOBAL( "GLOBALS") );

        // magic constants
        handler( "$__FILE__" )[ COMPILER.VARIABLE_VALUE ] = $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ];

        handler( "$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = functionName;
        handler( "$__FUNCTION__" )[ COMPILER.VARIABLE_VALUE ] = functionName;


        // static handler, the messed up ordering of things is needed due to js execution order
        PHP.Utils.StaticHandler( staticHandler, staticVars,  handler, ENV[ COMPILER.GLOBAL ] );




        return handler;
    } );

    args.push( staticHandler );


    return args;

};

PHP.Modules.prototype[ PHP.Compiler.prototype.FUNCTION ] = function( functionName, args ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    func_num_args = "func_num_args",
    message = "():  Called from the global scope - no function context",
    func_get_arg = "func_get_arg",
    func_get_args = "func_get_args",
    ret,
    item = PHP.VM.Array.arrayItem;

    if ( /^func_(get_args?|num_args)$/.test( functionName )) {
        if ( args[ 2 ] instanceof PHP.VM ) {
            this[ PHP.Compiler.prototype.ERROR ]( functionName + message, PHP.Constants.E_CORE_WARNING, true );
            if ( functionName === func_num_args ) {
                return new PHP.VM.Variable( -1 );
            } else {
                return new PHP.VM.Variable( false );
            }
        }

    }


    if ( functionName === func_num_args ) {


        return new PHP.VM.Variable( args.length - 2 );

    } else if ( functionName === func_get_arg ) {

        if ( !this[ COMPILER.SIGNATURE ]( Array.prototype.slice.call(arguments,2 ), func_get_arg, 1, [ VARIABLE.INT ] ) ) {
            return new PHP.VM.Variable( false );
        }

        if ( arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] < 0 ) {
            this[ PHP.Compiler.prototype.ERROR ]( func_get_arg + "():  The argument number should be >= 0", PHP.Constants.E_WARNING, true );
            return new PHP.VM.Variable( false );
        }


        if ( args[ arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] + 2 ] === undefined ) {
            this[ PHP.Compiler.prototype.ERROR ]( func_get_arg + "():  Argument " + arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] + " not passed to function", PHP.Constants.E_CORE_WARNING, true );
            return new PHP.VM.Variable( false );
        } else {
            return args[ arguments[ 2 ][ COMPILER.VARIABLE_VALUE ] + 2 ];
        }

    } else if ( functionName === func_get_args ) {
        var props = [];

        Array.prototype.slice.call( args, 2 ).forEach(function( val, index ){

            props.push(item( index, val  ));
        });

        return this.array( props );
    } else if ( typeof functionName === "function" ) {
        // anonymous lambda function
        ret = functionName.apply( this, Array.prototype.slice.call( arguments, 2 ) );

    } else if ( this[ functionName ] === undefined ) {
        this[ PHP.Compiler.prototype.ERROR ]( "Call to undefined function " + functionName + "()", PHP.Constants.E_ERROR, true );
    } else {
        ret = this[ functionName ].apply( this, Array.prototype.slice.call( arguments, 2 ) );
    }

    PHP.Utils.CheckRef.call( this, ret, this.FUNCTION_REFS[ functionName ] );


    return ret;
};

PHP.Modules.prototype[ PHP.Compiler.prototype.TYPE_CHECK ] = function( variable, propertyType, propertyDefault, index, name ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    classObj,
    typeInterface = false;

    classObj = variable[ COMPILER.VARIABLE_VALUE ];
    if ( propertyDefault === undefined || (propertyDefault[ VARIABLE.TYPE ] !==  VARIABLE.NULL || variable[ VARIABLE.TYPE ] !== VARIABLE.NULL ) ) {

        var argPassedTo = "Argument " + (index + 1) + " passed to " + name + "() must ",
        argGiven,
        variableType = variable[ VARIABLE.TYPE ],
        errorMsg;

        switch ( variableType  ) {

            case VARIABLE.OBJECT:
                argGiven = ", instance of " + classObj[ COMPILER.CLASS_NAME ] + " given";
                break;

            case VARIABLE.INT:
                argGiven = ", integer given";
                break;

            case VARIABLE.NULL:
                argGiven = ", none given";
                break;

        }

        // check if we are looking for implement or instance
        // do a check if it exists before getting, so we don't trigger an __autoload
        if ( this.$Class.Exists( propertyType ) &&  this.$Class.Get( propertyType ).prototype[ COMPILER.CLASS_TYPE ] === PHP.VM.Class.INTERFACE) {
            typeInterface = true;
        }


        switch( propertyType.toLowerCase() ) {

            case "array":
                if ( VARIABLE.ARRAY !== variableType) {
                    errorMsg = argPassedTo + "be of the type array" + argGiven;
                }
                break;

            default:
                // we are looking for an instance
                if ( classObj === null) {
                    errorMsg = argPassedTo + "be an instance of " + propertyType + argGiven;
                }

                else if ( !typeInterface && classObj[ COMPILER.CLASS_NAME ] !== propertyType ) {
                    // not of same class type
                    errorMsg = argPassedTo + "be an instance of " + propertyType + argGiven;

                }

                // we are looking for an implementation of interface
                else if ( typeInterface && classObj[ PHP.VM.Class.INTERFACES ].indexOf( propertyType ) === -1) {
                    errorMsg = argPassedTo + "implement interface " + propertyType + argGiven;
                }

        }


        if ( errorMsg !== undefined ) {
            this[ COMPILER.ERROR ]( errorMsg , PHP.Constants.E_RECOVERABLE_ERROR, false );
        }

    }



};

PHP.Modules.prototype[ PHP.Compiler.prototype.SIGNATURE ] = function( args, name, len, types ) {
    var COMPILER = PHP.Compiler.prototype,
    $GLOBAL = this[ COMPILER.GLOBAL ],
    __FILE__ = "$__FILE__",
    VARIABLE = PHP.VM.Variable.prototype,
    typeStrings = {};

    typeStrings[ VARIABLE.NULL ] = "null";
    typeStrings[ VARIABLE.BOOL ] = "boolean";
    typeStrings[ VARIABLE.INT ] = "long";
    typeStrings[ VARIABLE.FLOAT ] = "float";
    typeStrings[ VARIABLE.STRING ] = "string";
    typeStrings[ VARIABLE.ARRAY ] = "array";
    typeStrings[ VARIABLE.OBJECT ] = "object";
    typeStrings[ VARIABLE.RESOURCE ] = "resource";

    if ( len < 0 && args.length > -len) {
        len = -len;
        this[ COMPILER.ERROR ]( name + "() expects at most " + len + " parameter" + (( len !== 1 ) ? "s" : "") + ", " + args.length + " given", PHP.Constants.E_WARNING, true );
        return false;
    } else if ( args.length !== len && len >= 0 ) {

        this[ COMPILER.ERROR ]( name + "() expects exactly " + len + " parameter" + (( len !== 1 ) ? "s" : "") + ", " + args.length + " given", PHP.Constants.E_WARNING, true );
        return false;
    } else {

        if ( Array.isArray( types ) ) {
            var fail = false;
            types.forEach(function( type, paramIndex ){

                if ( Array.isArray( type ) ) {

                    if ( type.indexOf( args[ paramIndex ][ VARIABLE.TYPE ] ) === -1 ) {
                        if ( type.indexOf( VARIABLE.STRING ) === -1 || ( args[ paramIndex ][ VARIABLE.CAST_STRING ][ VARIABLE.TYPE ] !== VARIABLE.STRING )  ) {

                            this[ COMPILER.ERROR ]( name + "() expects parameter " + ( paramIndex + 1 ) + " to be " + typeStrings[ type[ 0 ] ] + ", " + typeStrings[ args[ paramIndex ][ VARIABLE.TYPE ] ] + " given in " +
                                $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] +
                                " on line " + 0, PHP.Constants.E_CORE_WARNING );
                            fail = true;
                        }
                    }

                } else {

                    if ( args[ paramIndex ] !== undefined && type !== args[ paramIndex ][ VARIABLE.TYPE ] && type !== null ) {

                        if ( type === VARIABLE.INT && args[ paramIndex ][ VARIABLE.TYPE ] === VARIABLE.BOOL  ) {
                            return;
                        }


                        if ( type !== VARIABLE.STRING || ( typeof args[ paramIndex ][ VARIABLE.CAST_STRING ] !== "function" )  ) {
                            this[ COMPILER.ERROR ]( name + "() expects parameter " + ( paramIndex + 1 ) + " to be " + typeStrings[ type ] + ", " + typeStrings[ args[ paramIndex ][ VARIABLE.TYPE ] ] + " given in " +
                                $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] +
                                " on line " + 0, PHP.Constants.E_CORE_WARNING );
                            fail = true;
                        }
                    }
                }



            }, this);
            if ( fail === true ) {
                return false;
            }

        }

        return true;
    }
};

(function( MODULES ){

    var COMPILER = PHP.Compiler.prototype,
    lastError,
    errorHandler,
    reportingLevel = 32767,
    shutdownFunc,
    shutdownParams,
    suppress = false;

    MODULES.$ErrorReset = function() {
        lastError = undefined;
        errorHandler = undefined;
        shutdownFunc = undefined;
        shutdownParams = undefined;
        suppress = false;
        reportingLevel = 32767; // E_ALL
    };

    MODULES.register_shutdown_function = function( func ) {
        shutdownFunc = func;
        shutdownParams = Array.prototype.slice.call( arguments, 1 );
    };

    MODULES.$shutdown = function( ) {

        this.$Class.Shutdown();

        if ( shutdownFunc !== undefined ) {
            this.call_user_func.apply( this, [ shutdownFunc ].concat( arguments ) );
        }
    };


    MODULES[ COMPILER.SUPPRESS ] = function( expr ) {
        suppress = true;

        var result = expr();

        if ( result === undefined ) {
            result = new PHP.VM.Variable();
        }

        result[ COMPILER.SUPPRESS ] = true;

        suppress = false;
        return result;
    };

    MODULES[ COMPILER.EXCEPTION ] = function( variable ) {

        var methods =  {},
        VARIABLE = PHP.VM.Variable.prototype,
        caught = false;

        methods[ COMPILER.CATCH ] = function( name, type, $, func ) {
            if ( caught ) return methods;
            if ( variable[ VARIABLE.TYPE ] === VARIABLE.OBJECT  ) {

                var classObj = variable[ COMPILER.VARIABLE_VALUE ];

                if ( this.$Class.Inherits( classObj, type ) || classObj[ PHP.VM.Class.INTERFACES ].indexOf( type ) !== -1   ) {
                    $( name, variable );
                    caught = true;
                    func();
                }
            } else if ( variable instanceof PHP.Halt && /^Exception$/i.test( type )) {

                if ( variable.catchable !== true ) {

                    $( name, new (this.$Class.Get( "Exception"  ))( this, new PHP.VM.Variable( variable.msg )  ) );
                    caught = true;
                    func();
                } else {
                    throw variable;
                }
            }
            return methods;

        }.bind( this );

        return methods;
    };

    MODULES.error_get_last = function()  {
        var item = PHP.VM.Array.arrayItem;

        return this.array([
            item("type", lastError.type),
            item("message", lastError.message),
            item("file", lastError.file),
            item("line", lastError.line)
            ]);

    };

    MODULES.error_reporting = function( level ) {
        reportingLevel = level[ COMPILER.VARIABLE_VALUE ];
    };

    MODULES.set_error_handler = function( error_handler, error_types )  {
        errorHandler = error_handler;
    };

    MODULES[ COMPILER.ERROR ] = function( msg, level, lineAppend, strict, catchable ) {

        var C = PHP.Constants,
        $GLOBAL = this[ COMPILER.GLOBAL ],
        __FILE__ = "$__FILE__";
        lastError = {
            message: msg,
            line: 1,
            type: level,
            file: $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ]
        };

        function checkType( type ) {

            return ((reportingLevel & C[ type ]) === C[ type ]);
        }

        if ( lineAppend === false ) {
            lineAppend = ", called in " + $GLOBAL( __FILE__ )[ COMPILER.VARIABLE_VALUE ] + " on line 1 and defined in " + $GLOBAL( __FILE__ )[ COMPILER.VARIABLE_VALUE ] + " on line 1";
        } else if ( lineAppend === true ) {
            if (this.EVALING === true ) {
                lineAppend = " in " + $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] + "(1) : eval()'d code on line 1";
            } else {
                lineAppend = " in " + $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] + " on line 1";
            }
        } else {
            lineAppend = "";
        }

        if ( this.$ini.track_errors == 1 ||  this.$ini.track_errors == "On") {
            $GLOBAL("php_errormsg")[ COMPILER.VARIABLE_VALUE ] = msg;
        }


        if (reportingLevel !== 0) {
            if ( suppress === false ) {
                if ( errorHandler !== undefined ) {


                    this.call_user_func(
                        errorHandler,
                        new PHP.VM.Variable( level ),
                        new PHP.VM.Variable( msg ),
                        new PHP.VM.Variable( $GLOBAL(__FILE__)[ COMPILER.VARIABLE_VALUE ] ),
                        new PHP.VM.Variable( 1 ),
                        this.array([])
                        );

                } else {
                    switch ( level ) {
                        case C.E_ERROR:
                            this[ COMPILER.DISPLAY_HANDLER ] = false;
                            throw new PHP.Halt( msg, level, lineAppend, catchable );
                            return;
                            break;
                        case C.E_RECOVERABLE_ERROR:
                            this[ COMPILER.DISPLAY_HANDLER ] = false;
                            //    this.$ob( "\nCatchable fatal error: " + msg + lineAppend + "\n");

                            throw new PHP.Halt( msg, level, lineAppend, catchable );
                            //   throw new PHP.Halt( level );
                            return;
                            break;

                        case C.E_WARNING:
                        case C.E_CORE_WARNING:
                        case C.E_COMPILE_WARNING:
                        case C.E_USER_WARNING:
                            if (this.$ini.display_errors != 0 && this.$ini.display_errors != "Off") {
                                this.echo( new PHP.VM.Variable("\nWarning: " + msg + lineAppend + "\n"));
                            }
                            return;
                            break;
                        case C.E_PARSE:
                            this.echo( new PHP.VM.Variable("\nParse error: " + msg + lineAppend + "\n"));
                            return;
                            break;
                        case C.E_CORE_NOTICE:
                        case C.E_NOTICE:
                            if (checkType("E_NOTICE")) {
                                this.echo( new PHP.VM.Variable("\nNotice: " + msg + lineAppend + "\n"));
                                return;
                            }
                            break;
                        case C.E_STRICT:
                            if (checkType("E_STRICT")) {
                                if ( strict ) {
                                    this.$strict += "Strict Standards: " + msg + lineAppend + "\n";
                                } else {
                                    this.echo( new PHP.VM.Variable("\nStrict Standards: " + msg + lineAppend + "\n"));
                                }
                            }
                            return;
                            break;
                        case C.E_DEPRECATED:
                            if (checkType("E_DEPRECATED")) {
                                this.echo( new PHP.VM.Variable("\nDeprecated: " + msg + lineAppend + "\n"));
                                return;
                            }

                            break;

                        default:
                            this.echo( new PHP.VM.Variable("\nDefault Warning: " + msg + lineAppend + "\n"));
                            return;


                    }
                }
            }
        }

    };

})( PHP.Modules.prototype )






/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array = function( ) {
    
    var arr;
   
    if ( Array.isArray( arguments[ 0 ]) ) {
        arr = new (this.$Class.Get("ArrayObject"))( this, arguments[ 0 ] );
    } else {
        arr = new (this.$Class.Get("ArrayObject"))( this );
    }
   
    return new PHP.VM.Variable( arr );
    
};

PHP.Modules.prototype.array_key_exists = function( key, search ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    if ( search[ VAR.TYPE ] === VAR.ARRAY ) {
        var keys = search[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
        
        
                 
        var index = -1,
        value = key[ COMPILER.VARIABLE_VALUE ];
        
        
        
        keys.some(function( item, i ){
                
            if ( item instanceof PHP.VM.Variable ) {
                item = item[ COMPILER.VARIABLE_VALUE ];
            } 
                
          
                
            if ( item === value) {
                index = i;
                return true;
            }
                
            return false;
        });
        
        return new PHP.VM.Variable( ( index !== -1) );
    }
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 19.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.$array_merge = function() {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS_PROPERTY = PHP.VM.Class.PROPERTY;
    
    var array = this.array([]);

    var value = array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].pop(),
    key =  array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].pop();

        
    return array;

};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 14.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array_pop = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS_PROPERTY = PHP.VM.Class.PROPERTY;
    

    var value = array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].pop(),
    key =  array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].pop();
 
    this.reset( array );
    
    return value;

};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 14.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.array_push = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    array[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, "append", arguments[ 1 ] )
};


/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array_search = function( needle, haystack, strict ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    if ( haystack[ VAR.TYPE ] === VAR.ARRAY ) {
        var values = haystack[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ],
        keys = haystack[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
        
        
                 
        var index = -1,
        value = needle[ COMPILER.VARIABLE_VALUE ];
        
        
        
        values.some(function( item, i ){
                
            if ( item instanceof PHP.VM.Variable ) {
                item = item[ COMPILER.VARIABLE_VALUE ];
            } 
                
          
                
            if ( item === value) {
                index = i;
                return true;
            }
                
            return false;
        });
        
        if ( index !== -1 ) {
            return new PHP.VM.Variable(  keys[ index ] );
        } 
        
        return new PHP.VM.Variable( false );
    }
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array_shift = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS_PROPERTY = PHP.VM.Class.PROPERTY;
    

    if ( array[ VARIABLE.VARIABLE_TYPE ] === VARIABLE.FUNCTION  ) {
        this.ENV[ COMPILER.ERROR ]("Only variables should be passed by reference", PHP.Constants.E_STRICT, true );

    }
    
    
    var value = array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].shift(),
    key =  array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].shift();
   
    this.reset( array );   
    
    
    // key remapper    
    array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.METHOD + "remap"]();
    
    
    return value;

};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.array_unshift = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS_PROPERTY = PHP.VM.Class.PROPERTY;
    
    var items = Array.prototype.slice.call( arguments, 1),
    vals = [],
    lastIndex,
    keys = [];
    items.forEach(function( item, index ){
        if ( item[ VARIABLE.IS_REF ] ) {
            vals.push( item );
        } else {
            vals.push( new PHP.VM.Variable( item[ COMPILER.VARIABLE_VALUE ]) );
        }
        keys.push( index );
        lastIndex = index;
    });
    lastIndex++;
    var value = Array.prototype.unshift.apply(array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ], vals);
    
    // remap keys
    array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].forEach(function( key, index ){
        // todo take into account other type of keys
        if ( typeof key === "number" && key % 1 === 0) {
            array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ][ index ] = key + lastIndex;
        }
    });
    
    Array.prototype.unshift.apply(array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ], keys);
    array[ COMPILER.VARIABLE_VALUE ][ CLASS_PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ] -= vals.length;
        
    return new PHP.VM.Variable( value.length );

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.count = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    if ( variable[ VAR.TYPE ] === VAR.ARRAY ) {
        var values = variable[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
        
        return new PHP.VM.Variable( values.length );
    }
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.current = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    

        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
        
        if ( pointer[ COMPILER.VARIABLE_VALUE ] >= values.length ) {
            return new PHP.VM.Variable( false );
        } else {
            return new PHP.VM.Variable( values [ pointer[ COMPILER.VARIABLE_VALUE ] ] );
        }
        
       
    } 
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.each = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    item = PHP.VM.Array.arrayItem;
        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
       
       var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
        
        if ( pointer[ COMPILER.VARIABLE_VALUE ] >= values.length ) {
            return new PHP.VM.Variable( false );
        }
       
        var value = this.current( array ),
        key = this.key( array );
        
        this.next( array );
        
        return this.array( [ item( 0, key ), item( 1, value ) ] );
        
       
    } 
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 2.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.is_array = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    

    return new PHP.VM.Variable( ( variable[ VAR.TYPE ] === VAR.ARRAY ) );
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.key = function( array ) {
      var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
        ARRAY = PHP.VM.Array.prototype;
    

        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        keys = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ];
        
        if ( pointer[ COMPILER.VARIABLE_VALUE ] >= keys.length ) {
            return new PHP.VM.Variable( false );
        } else {
            return new PHP.VM.Variable( keys[ pointer[ COMPILER.VARIABLE_VALUE ] ] );
        }
        
       
    } 
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.list = function() {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    array = Array.prototype.pop.call(arguments);
        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
       
        Array.prototype.slice.call( arguments, 0 ).forEach(function( variable, index ){
            if ( variable instanceof PHP.VM.Variable ) {
                if ( values[ index ] !== undefined ) {
                    variable[ COMPILER.VARIABLE_VALUE ] = values[ index ][ COMPILER.VARIABLE_VALUE ];
                } else {
                    this.ENV[ COMPILER.ERROR ]("Undefined offset: " + index, PHP.Constants.E_NOTICE, true );
                    variable[ COMPILER.VARIABLE_VALUE ] = new PHP.VM.Variable();
                }
            } else if ( Array.isArray( variable )) {
                this.list.apply( this, variable.concat(values[ index ]) );
            }
        }, this);
        
        
        return array;
        
        
       
    } 
    
    // fill with null
    Array.prototype.slice.call( arguments, 0 ).forEach(function( variable ){
        if ( variable instanceof PHP.VM.Variable ) {
            variable[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
        }
    });
    
    return new PHP.VM.Variable(false);
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.next = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    

        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
        pointer[ COMPILER.VARIABLE_VALUE ]++; // advance pointer
        
        if ( pointer[ COMPILER.VARIABLE_VALUE ] >= values.length ) {
            return new PHP.VM.Variable( false );
        } else {

            return new PHP.VM.Variable( values [ pointer[ COMPILER.VARIABLE_VALUE ] ] );
        }
        
       
    } 
    
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.reset = function( array ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;
    

        
    if ( array [ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var pointer = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER],
        values = array[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];
        
        pointer[ COMPILER.VARIABLE_VALUE ] = 0;
        
        if ( values.length === 0 ) {
            return new PHP.VM.Variable( false );
        } else {
            return values[ 0 ];
        }
    } 
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.class_exists = function( class_name, autoload ) {
    var COMPILER = PHP.Compiler.prototype;
    
    if ( (autoload === undefined || autoload[ COMPILER.VARIABLE_VALUE ] === true) && !this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] ) ) {
        return new PHP.VM.Variable( this.$Class.__autoload( class_name[ COMPILER.VARIABLE_VALUE ] ) );
    }
    
    return new PHP.VM.Variable( this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] )  );
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.get_class = function( object ) {
    var COMPILER = PHP.Compiler.prototype;
 
    if (object instanceof PHP.VM.Variable ) {
           return new PHP.VM.Variable( object[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ] );
    } else {
           return new PHP.VM.Variable( object[ COMPILER.CLASS_NAME ] );
    }
 
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.get_declared_classes = function( ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    item = PHP.VM.Array.arrayItem;
    
    var items = [];
    this.$Class.DeclaredClasses().forEach(function( name, index ){
        items.push( item( index, name ));
    });
    
    return this.array( items );
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 12.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.get_class_methods = function( object ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var prefix = PHP.VM.Class.METHOD,
    items = [],
    classObj,
    index = 0;

    if ( object[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        classObj = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ]).prototype;
    } else if ( object[ VARIABLE.TYPE ] === VARIABLE.OBJECT ) {
        classObj =  object[ COMPILER.VARIABLE_VALUE ];
    }
    var item = PHP.VM.Array.arrayItem;
       
    

    for ( var key in classObj )  {
        if ( key.substring(0, prefix.length ) === prefix ) {
            var name = key.substring( prefix.length );
            
            
            items.push( item( index++, classObj[ PHP.VM.Class.METHOD_REALNAME + name ]) );
        }
    }

    return this.array( items );
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 13.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.get_parent_class = function( object ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    classObj,
    parent;
    
    if ( object[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        classObj = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ] ).prototype;
    } else {
        classObj = Object.getPrototypeOf(object[ COMPILER.VARIABLE_VALUE ] );
    }
    
    if ( (parent = Object.getPrototypeOf( classObj )[ COMPILER.CLASS_NAME ]) === undefined ) {
        return new PHP.VM.Variable( false );
    } else {
        return new PHP.VM.Variable( parent );
    }
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.interface_exists = function( class_name, autoload ) {
    var COMPILER = PHP.Compiler.prototype;
     
    if ( (autoload === undefined || autoload[ COMPILER.VARIABLE_VALUE ] === true) && !this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] ) ) {
        return new PHP.VM.Variable( this.$Class.__autoload( class_name[ COMPILER.VARIABLE_VALUE ] ) );
    }

    return new PHP.VM.Variable( this.$Class.Exists( class_name[ COMPILER.VARIABLE_VALUE ] )  );
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 13.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.is_subclass_of = function( object, classNameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    classObj,
    parent,
    className = classNameObj[ COMPILER.VARIABLE_VALUE ];
    
    if ( object[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        classObj = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ] ).prototype;
    } else {
        classObj = Object.getPrototypeOf(object[ COMPILER.VARIABLE_VALUE ] );
    }
    
    
    while ( (parent = Object.getPrototypeOf( classObj )[ COMPILER.CLASS_NAME ]) !== undefined && parent !== className ) {
        
    }
    
    if ( parent === undefined ) {
        return new PHP.VM.Variable( false );
    } else {
        return new PHP.VM.Variable( true );
    }
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.method_exists = function( object, method ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    if ( object instanceof PHP.VM.Variable && object[ VARIABLE.TYPE ] === VARIABLE.STRING) {
        object = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ]).prototype;
    }
    
    if ( object instanceof PHP.VM.Variable ) {
        if (object[ VARIABLE.TYPE ] === VARIABLE.STRING) {
            object = this.$Class.Get( object[ COMPILER.VARIABLE_VALUE ]).prototype;
        }
        
        return new PHP.VM.Variable( (object[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.METHOD + method[ COMPILER.VARIABLE_VALUE ].toLowerCase()] ) !== undefined );
    } else {
        return new PHP.VM.Variable( (object[ PHP.VM.Class.METHOD + method[ COMPILER.VARIABLE_VALUE ].toLowerCase()] ) !== undefined ); 
    }
    
};
PHP.Modules.prototype.$foreachInit = function( expr, ctx ) {

    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype;

    var itm = expr[ COMPILER.VARIABLE_VALUE ]; // trigger get

    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var pointer = itm[ PHP.VM.Class.PROPERTY + ARRAY.POINTER];
        pointer[ COMPILER.VARIABLE_VALUE ] = 0;

        return {
            len: itm[ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ].length,
            expr: expr,
            clone: itm[ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_CLONE )
        };

    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = itm;


        // iteratorAggregate implemented objects

        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Traversable") !== -1 ) {

            var iterator = objectValue;

            try {
                while( (iterator instanceof PHP.VM.ClassPrototype) && iterator[ PHP.VM.Class.INTERFACES ].indexOf("Iterator") === -1  ) {
                    iterator = iterator[ COMPILER.METHOD_CALL ]( this, "getIterator" )[ COMPILER.VARIABLE_VALUE ];
                }
            }catch(e) {

            }
            if ( !(iterator instanceof PHP.VM.ClassPrototype) || iterator[ PHP.VM.Class.INTERFACES ].indexOf("Iterator") === -1) {
                this[ COMPILER.ERROR ]( "Objects returned by " + objectValue[ COMPILER.CLASS_NAME ] + "::getIterator() must be traversable or implement interface Iterator", PHP.Constants.E_ERROR, true );
                return;
            }

            iterator[ COMPILER.METHOD_CALL ]( this, "rewind" );

            return {
                expr: expr,
                Class:iterator
            };
        } else {
            //  members in object

            var classProperty = PHP.VM.Class.PROPERTY;

            return {
                expr: expr,
                pointer: 0,
                keys:  (function( objectValue ) {
                    var items = [],

                    needReorder = false;
                    for (var key in objectValue) {

                        if ( key.substring(0, classProperty.length ) === classProperty) {

                            var name = key.substring( classProperty.length );

                            if (PHP.Utils.Visible.call( this, name, objectValue, ctx )) {
                                items.push( name );
                            }

                        }

                        if (((objectValue[ PHP.VM.Class.PROPERTY_TYPE + name ] & PHP.VM.Class.PUBLIC) === PHP.VM.Class.PUBLIC) || objectValue[ PHP.VM.Class.PROPERTY_TYPE + name ] === undefined) {


                        } else {
                            needReorder = true;
                        }
                    }
                    if ( needReorder ) {
                        items.sort();
                    }

                    return items;
                }.bind(this))( objectValue )

            };

        }
    } else {
        this[ COMPILER.ERROR ]( "Invalid argument supplied for foreach()", PHP.Constants.E_CORE_WARNING, true );

    }

};

PHP.Modules.prototype.$foreachEnd = function( iterator ) {

    var COMPILER = PHP.Compiler.prototype;

    // destruct iterator
    if ( iterator !== undefined && iterator.Class !== undefined ) {
        iterator.Class[ COMPILER.CLASS_DESTRUCT ]();
    }

};

PHP.Modules.prototype.foreach = function( iterator, byRef, value, key ) {

    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    expr;

    if ( iterator === undefined  || iterator.expr === undefined ) {
        return false;
    }
    expr = iterator.expr;

    if ( iterator.count === undefined ) {
        iterator.count = 0;
    }

    if ( expr[ VAR.TYPE ] === VAR.ARRAY ) {
        var clonedValues = iterator.clone[ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        clonedKeys =  iterator.clone[ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        origValues = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        origKeys = expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ],
        len = ( byRef === true || iterator.expr[ VAR.IS_REF ] === true ) ? origValues.length : iterator.len,
        pointer = (( byRef === true || iterator.expr[ VAR.IS_REF ] === true) ? expr[ COMPILER.VARIABLE_VALUE ] : iterator.clone )[ PHP.VM.Class.PROPERTY + ARRAY.POINTER];

        var compareTo = (byRef === true || iterator.expr[ VAR.IS_REF ] === true)  ? origValues : clonedValues,
        result;

        var index, lowerLoop = function( index ) {
            while( compareTo [ --index ] === undefined && index > 0 ) {}
            return index;
        }

        if (  iterator.breakNext ===  true) {
            return false;
        }

        if ( pointer[ COMPILER.VARIABLE_VALUE ] !== iterator.count ) {
            if ( iterator.last !== undefined && iterator.last !== compareTo [ pointer[ COMPILER.VARIABLE_VALUE ] ] ) {
                index = pointer[ COMPILER.VARIABLE_VALUE ];
            } else if ( compareTo [ iterator.count ] !== undefined ) {
                index = iterator.count;
            } else if ( compareTo [ pointer[ COMPILER.VARIABLE_VALUE ] ] !== undefined ) {
                index = pointer[ COMPILER.VARIABLE_VALUE ];
            } else {
                index =  lowerLoop( pointer[ COMPILER.VARIABLE_VALUE ] );
            }

        } else if ( compareTo [ iterator.count ] !== undefined ){
            index = iterator.count;
        } else {
            index =  lowerLoop( pointer[ COMPILER.VARIABLE_VALUE ] );
        }


        if ( byRef === true || iterator.expr[ VAR.IS_REF ] === true) {
            result = ( origValues[ pointer[ COMPILER.VARIABLE_VALUE ] ] !== undefined && (iterator.count <= origValues.length || iterator.diff || iterator.first !== origValues[ 0 ]) );

        } else {
            result = ( clonedValues[ iterator.count ] !== undefined );
        }



        iterator.first = origValues[ 0 ];
        iterator.last = compareTo[ index ];
        iterator.diff = (iterator.count === origValues.length);


        if ( result === true ) {




            if ( byRef === true || iterator.expr[ VAR.IS_REF ] === true ) {
                value[ VAR.REF ]( origValues[ index ] );
            } else {
                value[ COMPILER.VARIABLE_VALUE ] = clonedValues[ iterator.count ][ COMPILER.VARIABLE_VALUE ];
            }
            if ( key instanceof PHP.VM.Variable ) {
                if (byRef === true || iterator.expr[ VAR.IS_REF ] === true ) {
                    key[ COMPILER.VARIABLE_VALUE ] = origKeys[ index ];
                } else {
                    key[ COMPILER.VARIABLE_VALUE ] = clonedKeys[ index ];
                }

            }
            /*
            if (!byRef && iterator.expr[ VAR.IS_REF ] !== true ) {
                iterator.expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            }*/
            iterator.prev = origValues[ index ];
            iterator.count++;

            expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            iterator.clone[ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ]++;
            if (( byRef === true || iterator.expr[ VAR.IS_REF ] === true ) && expr[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.POINTER][ COMPILER.VARIABLE_VALUE ] >= origValues.length ) {

                iterator.breakNext = true;
            }

        // pointer[ COMPILER.VARIABLE_VALUE ]++;

        }

        return result;




    } else if ( expr[ VAR.TYPE ] === VAR.OBJECT ) {
        var objectValue = expr[ COMPILER.VARIABLE_VALUE ]


        // iteratorAggregate implemented objects
        if ( objectValue[ PHP.VM.Class.INTERFACES ].indexOf("Traversable") !== -1 ) {

            if ( byRef === true ) {
                this.ENV[ PHP.Compiler.prototype.ERROR ]( "An iterator cannot be used with foreach by reference", PHP.Constants.E_ERROR, true );
            }


            if ( iterator.first === undefined ) {
                iterator.first = true;
            } else {
                if ( iterator.Class[ COMPILER.METHOD_CALL ]( this, "next" )[ VAR.DEFINED ]  !== true ) {
                    this.ENV[ PHP.Compiler.prototype.ERROR ]( "Undefined offset: 3", PHP.Constants.E_NOTICE, true );
                }
            }

            var result = iterator.Class[ COMPILER.METHOD_CALL ]( this, "valid" )[ VAR.CAST_BOOL ][ COMPILER.VARIABLE_VALUE ];

            if ( result === true ) {

                value[ COMPILER.VARIABLE_VALUE ] = iterator.Class[ COMPILER.METHOD_CALL ]( this, "current" )[ COMPILER.VARIABLE_VALUE ];

                if ( key instanceof PHP.VM.Variable ) {
                    key[ COMPILER.VARIABLE_VALUE ] = iterator.Class[ COMPILER.METHOD_CALL ]( this, "key" )[ COMPILER.VARIABLE_VALUE ];
                }
            }

            return result;

        } else {
            // loop through public members



            if ( iterator.pointer < iterator.keys.length) {

                value[ COMPILER.VARIABLE_VALUE ] = objectValue[ PHP.VM.Class.PROPERTY + iterator.keys[ iterator.pointer ]];

                if ( key instanceof PHP.VM.Variable ) {
                    key[ COMPILER.VARIABLE_VALUE ] =  iterator.keys[ iterator.pointer ];
                }
                iterator.pointer++;
                return true;
            }
            return false;
        }
    } else {
        this[ COMPILER.ERROR ]( "Invalid argument supplied for foreach()", PHP.Constants.E_CORE_WARNING, true );
        return false;
    }
};
PHP.Modules.prototype.$include = function( $, $Static, file ) {

    var COMPILER = PHP.Compiler.prototype,
    filename = file[ COMPILER.VARIABLE_VALUE ];


    var path = this[ COMPILER.FILE_PATH ];


    var loaded_file = (/^(.:|\/)/.test( filename ) ) ? filename : path + "/" + filename;
    var $this = this;
    this.$Included.Include( loaded_file );
    try {
    var source = this[ COMPILER.FILESYSTEM ].readFileSync( loaded_file );
    }
    catch( e ) {

         $this.ENV[ COMPILER.ERROR ]("include(" + filename + "): failed to open stream: No such file or directory", PHP.Constants.E_CORE_WARNING, true );
         $this.ENV[ COMPILER.ERROR ]("include(): Failed opening '" +  filename + "' for inclusion (include_path='" + path + "')", PHP.Constants.E_CORE_WARNING, true );
    }

    var COMPILER = PHP.Compiler.prototype;

    // tokenizer
    var tokens = new PHP.Lexer( source );

    // build ast tree

    var AST = new PHP.Parser( tokens );

    // compile tree into JS
    var compiler = new PHP.Compiler( AST );

    // execture code in current context ($)
    var exec = new Function( "$$", "$", "ENV", "$Static", compiler.src  );

    this[ COMPILER.FILE_PATH ] = PHP.Utils.Path( loaded_file );
    
    exec.call(this, function( arg ) {
        return new PHP.VM.Variable( arg );
    }, $, this, $Static);
};


PHP.Modules.prototype.include = function() {
    this.$include.apply(this, arguments);
};
PHP.Modules.prototype.include_once = function( $, $Static, file ) {
    
    var COMPILER = PHP.Compiler.prototype,
    filename = file[ COMPILER.VARIABLE_VALUE ];
    
    
    var path = this[ COMPILER.FILE_PATH ];
    
    
    var loaded_file = (/^(.:|\/)/.test( filename ) ) ? filename : path + "/" + filename;
    
    if (!this.$Included.Included( loaded_file )) {
        this.$include.apply(this, arguments);
    }
    
};
PHP.Modules.prototype.require = function() {
    this.$include.apply(this, arguments);
};
PHP.Modules.prototype.require_once = function( $, $Static, file ) {
    
    var COMPILER = PHP.Compiler.prototype,
    filename = file[ COMPILER.VARIABLE_VALUE ];
    
    
    var path = this[ COMPILER.FILE_PATH ];
    
    
    var loaded_file = (/^(.:|\/)/.test( filename ) ) ? filename : path + "/" + filename;
    
    if (!this.$Included.Included( loaded_file )) {
        this.$include.apply(this, arguments);
    }
    
};
/* Automatically built from PHP version: 5.4.0-ZS5.6.0 */
PHP.Constants.DATE_ATOM = "Y-m-d\\TH:i:sP";
PHP.Constants.DATE_COOKIE = "l, d-M-y H:i:s T";
PHP.Constants.DATE_ISO8601 = "Y-m-d\\TH:i:sO";
PHP.Constants.DATE_RFC822 = "D, d M y H:i:s O";
PHP.Constants.DATE_RFC850 = "l, d-M-y H:i:s T";
PHP.Constants.DATE_RFC1036 = "D, d M y H:i:s O";
PHP.Constants.DATE_RFC1123 = "D, d M Y H:i:s O";
PHP.Constants.DATE_RFC2822 = "D, d M Y H:i:s O";
PHP.Constants.DATE_RFC3339 = "Y-m-d\\TH:i:sP";
PHP.Constants.DATE_RSS = "D, d M Y H:i:s O";
PHP.Constants.DATE_W3C = "Y-m-d\\TH:i:sP";
PHP.Constants.SUNFUNCS_RET_TIMESTAMP = 0;
PHP.Constants.SUNFUNCS_RET_STRING = 1;
PHP.Constants.SUNFUNCS_RET_DOUBLE = 2;

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.date_default_timezone_set = function() {
    // todo add functionality
    return new PHP.VM.Variable( true );
};



/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.mktime = function( hour, minute, second, month, day, year, is_dst ) {
    
    var date = new Date(),
    COMPILER = PHP.Compiler.prototype;
    
    hour = ( hour === undefined ) ?  date.getHours()  : hour[ COMPILER.VARIABLE_VALUE ];
    minute = ( minute === undefined ) ?  date.getMinutes() : minute[ COMPILER.VARIABLE_VALUE ]; 
    second = ( second === undefined ) ? date.getSeconds()  : second[ COMPILER.VARIABLE_VALUE ];
    month = ( month === undefined ) ?  date.getMonth() : month[ COMPILER.VARIABLE_VALUE ];
    day = ( day === undefined ) ?  date.getDay() : day[ COMPILER.VARIABLE_VALUE ];
    year = ( year === undefined ) ?  date.getFullYear() : year[ COMPILER.VARIABLE_VALUE ];
    
    
    var createDate = new Date(year, month, day, hour, minute, second);
    
    
    return new PHP.VM.Variable( Math.round( createDate.getTime() / 1000 ) );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.time = function() {
    
    return new PHP.VM.Variable( Math.round( Date.now() / 1000 ) );
};


/* Automatically built from PHP version: 5.4.0-ZS5.6.0 */
PHP.Constants.E_ERROR = 1;
PHP.Constants.E_RECOVERABLE_ERROR = 4096;
PHP.Constants.E_WARNING = 2;
PHP.Constants.E_PARSE = 4;
PHP.Constants.E_NOTICE = 8;
PHP.Constants.E_STRICT = 2048;
PHP.Constants.E_DEPRECATED = 8192;
PHP.Constants.E_CORE_ERROR = 16;
PHP.Constants.E_CORE_WARNING = 32;
PHP.Constants.E_COMPILE_ERROR = 64;
PHP.Constants.E_COMPILE_WARNING = 128;
PHP.Constants.E_USER_ERROR = 256;
PHP.Constants.E_USER_WARNING = 512;
PHP.Constants.E_USER_NOTICE = 1024;
PHP.Constants.E_USER_DEPRECATED = 16384;
PHP.Constants.E_ALL = 32767;

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.trigger_error = function( msg, level ) {
          this[ PHP.Compiler.prototype.ERROR ]( msg.$, ( level !== undefined ) ? level.$ : PHP.Constants.E_USER_NOTICE  , true );    
 //   throw new Error( "Fatal error: " + msg.$ );
    
};
/* Automatically built from PHP version: 5.4.0-ZS5.6.0 */
PHP.Constants.UPLOAD_ERR_OK = 0;
PHP.Constants.UPLOAD_ERR_INI_SIZE = 1;
PHP.Constants.UPLOAD_ERR_FORM_SIZE = 2;
PHP.Constants.UPLOAD_ERR_PARTIAL = 3;
PHP.Constants.UPLOAD_ERR_NO_FILE = 4;
PHP.Constants.UPLOAD_ERR_NO_TMP_DIR = 6;
PHP.Constants.UPLOAD_ERR_CANT_WRITE = 7;
PHP.Constants.UPLOAD_ERR_EXTENSION = 8;

PHP.Modules.prototype.dirname = function( path ) {
    var COMPILER = PHP.Compiler.prototype,
    dir = PHP.Utils.Path( path[ COMPILER.VARIABLE_VALUE ] )
    return new PHP.VM.Variable( dir );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 30.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.fclose = function( fp ) {

    return new PHP.VM.Variable( true );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.file_get_contents = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    if ( filename === "php://input") {
        return new PHP.VM.Variable( this.INPUT_BUFFER );
    } else {

        try {
            if ( PHP.Adapters.XHRFileSystem !== undefined ) {
                return new PHP.VM.Variable(  this[ COMPILER.FILESYSTEM ].readFileSync( filename, true ) );
            } else {
                return new PHP.VM.Variable(  this[ COMPILER.FILESYSTEM ].readFileSync( filename ).toString() );
            }
        } catch( e ) {
            this.ENV[ COMPILER.ERROR ]("file_get_contents(" + filename + "): failed to open stream: No such file or directory", PHP.Constants.E_WARNING, true );    
            return new PHP.VM.Variable( false );
        }
    }            

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 29.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.fopen = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    this.ENV[ COMPILER.ERROR ]("fopen(" + filename + "): failed to open stream: No such file or directory", PHP.Constants.E_WARNING, true );    
                        
    return new PHP.VM.Variable( new PHP.VM.Resource() );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.is_uploaded_file = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    // todo add check to see it is an uploaded file
    try {
        var stats = this[ COMPILER.FILESYSTEM ].lstatSync( filename );
    } catch(e) {
        return new PHP.VM.Variable( false );
    }
  
                        
    return new PHP.VM.Variable( true );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.realpath = function( filenameObj ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = filenameObj[ COMPILER.VARIABLE_VALUE ];
    
    // todo implement properly
                        
    return new PHP.VM.Variable( filename );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.rename = function( from, to ) {
    var COMPILER = PHP.Compiler.prototype,
    filename = from[ COMPILER.VARIABLE_VALUE ],
    filename2  = to[ COMPILER.VARIABLE_VALUE ];
    
    this.ENV[ COMPILER.ERROR ]("rename(" + filename + "," + filename2 + "):  The system cannot find the file specified. (code: 2)", PHP.Constants.E_WARNING, true );    
                        
    return new PHP.VM.Variable( false );
};


/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.call_user_func = function( callback ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    Class,
    methodParts;
  
    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {

        var ClassVar = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 ),
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ],
        args;
        
        methodParts = methodName.split("::");
        
      
       
        if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.STRING ) {
            Class = this.$Class.Get(ClassVar[ COMPILER.VARIABLE_VALUE ]).prototype;
        } else if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.OBJECT ) {
            Class = ClassVar[ COMPILER.VARIABLE_VALUE ];
        }
        
        // method call
        if ( methodParts.length === 1 ) {
            args = [ this, methodName].concat( Array.prototype.slice.call( arguments, 1 ) );
            return Class[ COMPILER.METHOD_CALL ].apply( Class, args );
        } else {
            args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
        }
        
    } else {
        methodParts = callback[ COMPILER.VARIABLE_VALUE ].split("::");
        
        if ( methodParts.length === 1 ) {
            // function call
            args = Array.prototype.slice.call( arguments, 1 );
            
                return this[ callback[ COMPILER.VARIABLE_VALUE ]].apply( this, args  );
        } else {
            // static call
            
            if ( this.$Class.__autoload(methodParts[ 0 ]) ) {
                Class = this.$Class.Get(methodParts[ 0 ]).prototype;
            
                args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            
                return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
            } else {
                this[ PHP.Compiler.prototype.ERROR ]( "call_user_func() expects parameter 1 to be a valid callback, class '" + methodParts[ 0 ] + "' not found", PHP.Constants.E_CORE_WARNING, true );
            }
            

        }
       
       
    }
    
   
  
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.call_user_func_array = function( callback ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    Class,
    methodParts;
  
    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {

        var ClassVar = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 ),
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ],
        args;
        
        methodParts = methodName.split("::");
        
      
       
        if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.STRING ) {
            Class = this.$Class.Get(ClassVar[ COMPILER.VARIABLE_VALUE ]).prototype;
        } else if ( ClassVar[ VARIABLE.TYPE] === VARIABLE.OBJECT ) {
            Class = ClassVar[ COMPILER.VARIABLE_VALUE ];
        }
        
        // method call
        if ( methodParts.length === 1 ) {
            args = [ this, methodName].concat( Array.prototype.slice.call( arguments, 1 ) );
            
            if ((Class[ "$£" + methodName] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) {
                    this[ COMPILER.ERROR ]( "call_user_func_array() expects parameter 1 to be a valid callback, cannot access private method " + Class[ COMPILER.CLASS_NAME ] + "::"+ methodName + "()", PHP.Constants.E_WARNING, true );
            
            }
            
            
            return Class[ COMPILER.METHOD_CALL ].apply( Class, args );
        } else {
            args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
        }
        
    } else {
        methodParts = callback[ COMPILER.VARIABLE_VALUE ].split("::");
        
        if ( methodParts.length === 1 ) {
            // function call
            args = Array.prototype.slice.call( arguments, 1 );
            
                return this[ callback[ COMPILER.VARIABLE_VALUE ]].apply( this, args  );
        } else {
            // static call
            
            if ( this.$Class.__autoload(methodParts[ 0 ]) ) {
                Class = this.$Class.Get(methodParts[ 0 ]).prototype;
            
                args = [ this, methodParts[ 0 ], methodParts[ 1 ] ].concat( Array.prototype.slice.call( arguments, 1 ) );
            
                return Class[ COMPILER.STATIC_CALL ].apply( Class, args );
            } else {
                this[ PHP.Compiler.prototype.ERROR ]( "call_user_func() expects parameter 1 to be a valid callback, class '" + methodParts[ 0 ] + "' not found", PHP.Constants.E_CORE_WARNING, true );
            }
            

        }
       
       
    }
    
   
  
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.create_function = function( args, source ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    
    // tokenizer
    var tokens = new PHP.Lexer( "<?php " + source[ COMPILER.VARIABLE_VALUE ] );
   
    // build ast tree
    
    var AST = new PHP.Parser( tokens );
  
    if ( Array.isArray(AST) ) {
        
    
  
        // compile tree into JS
        var compiler = new PHP.Compiler( AST );
   
    
    }
    
    var src = "function " + COMPILER.CREATE_VARIABLE + "( val ) { return new PHP.VM.Variable( val ); }\n" + COMPILER.VARIABLE + " = " + COMPILER.VARIABLE + "(";
    src += "[]"; // todo, add function variables
    src += ", arguments";

    src += ");\n" +compiler.src;
    
    
    // execture code in current context ($)
        
    var lambda = new PHP.VM.Variable( Function.prototype.bind.apply( 
        new Function( "$", COMPILER.FUNCTION_STATIC, COMPILER.FUNCTION_GLOBAL, src  ), 
        ( this.$FHandler )( this, "anonymous"  )) 
    );


    
    return lambda;
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.function_exists = function( function_name ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    

    return new PHP.VM.Variable(typeof this[ function_name[ COMPILER.VARIABLE_VALUE ]] === "function");
    
    
   
  
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.dechex = function( variable ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var num = variable[ COMPILER.VARIABLE_VALUE ];
    
    return new PHP.VM.Variable( parseInt( num, 10 ).toString( 16 ) );
};
PHP.Modules.prototype.constant = function( name ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    variableValue = name[ COMPILER.VARIABLE_VALUE ];

    var constant = this[ COMPILER.CONSTANTS ][ COMPILER.CONSTANT_GET ]( variableValue );
    if ( constant[ VARIABLE.DEFINED ] !== true ) {
        this.ENV[ COMPILER.ERROR ]("constant(): Couldn't find constant " + variableValue, PHP.Constants.E_CORE_WARNING, true );
        return new PHP.VM.Variable();
    }
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 7.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.define = function( name, value, case_insensitive ) {
    
    var COMPILER = PHP.Compiler.prototype,
    
    variableValue = value[ COMPILER.VARIABLE_VALUE ],
    variableName = name[ COMPILER.VARIABLE_VALUE ];
    
    if ( variableName.indexOf("::") !== -1 ) {
          this.ENV[ COMPILER.ERROR ]("Class constants cannot be defined or redefined", PHP.Constants.E_CORE_WARNING, true );    
          return new PHP.VM.Variable( false );
    }
   
    
    this[ COMPILER.CONSTANTS ][ COMPILER.CONSTANT_SET ]( variableName, variableValue );
    
     return new PHP.VM.Variable( true );
  
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 7.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.defined = function( name ) {
    
    var COMPILER = PHP.Compiler.prototype,
    
    variableName = name[ COMPILER.VARIABLE_VALUE ];
    

     return new PHP.VM.Variable( this.$Constants[ COMPILER.CONSTANT_DEFINED ]( variableName ) );
  
};


PHP.Modules.prototype.eval = function( $, $Static, $this, ctx, ENV, code) {
    var COMPILER = PHP.Compiler.prototype;

    var source = code[ COMPILER.VARIABLE_VALUE ];


    // tokenizer
    var tokens = new PHP.Lexer( "<?php " + source );

    // build ast tree

    var AST = new PHP.Parser( tokens, true );

    if ( Array.isArray(AST) ) {
        // compile tree into JS
        var compiler = new PHP.Compiler( AST, undefined, {
            INSIDE_METHOD: ( ctx !== undefined) ? true : false
        } );


        // execture code in current context ($)
        var exec = new Function( "$$", "$", "ENV", "$Static", "ctx",  compiler.src  );
        this.EVALING = true;
        var ret = exec.call($this, function( arg ) {
            return new PHP.VM.Variable( arg );
        }, $, ENV, $Static, ctx);

        this.EVALING = undefined;
        return ret;
    } else {

                this[ COMPILER.ERROR ]( "syntax error, unexpected $end in " +
            this[ COMPILER.GLOBAL ]("$__FILE__")[ COMPILER.VARIABLE_VALUE ] +
            "(1) : eval()'d code on line " + 1, PHP.Constants.E_PARSE );

    }

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.exit = function( message ) {
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.php_egg_logo_guid = function(  ) {
    
    return new PHP.VM.Variable("PHPE9568F36-D428-11d2-A769-00AA001ACF42");
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.php_logo_guid = function(  ) {
    
    return new PHP.VM.Variable("PHPE9568F34-D428-11d2-A769-00AA001ACF42");
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.php_real_logo_guid = function(  ) {
    
    return new PHP.VM.Variable("PHPE9568F34-D428-11d2-A769-00AA001ACF42");
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 9.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.zend_logo_guid = function(  ) {
    
    return new PHP.VM.Variable("PHPE9568F35-D428-11d2-A769-00AA001ACF42");
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.header= function( string ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    variableValue = string[ COMPILER.VARIABLE_VALUE ];
    
    // todo add to output
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 14.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.assert = function( assertion ) {
    // todo add  
    var COMPILER = PHP.Compiler.prototype;
    return (new PHP.VM.Variable( assertion[ COMPILER.VARIABLE_VALUE] ));
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ini_get = function( varname ) {
    var COMPILER = PHP.Compiler.prototype,
    old = this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ];
   
    if (old === undefined ) {
        return new PHP.VM.Variable( false );
    } else {
        
        old = old.toString().replace(/^On$/i,"1");
        old = old.toString().replace(/^Off$/i,"0");
        
        return new PHP.VM.Variable( old + "" );
    }
    
    
  
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ini_restore = function( varname ) {
  var COMPILER = PHP.Compiler.prototype;
    this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ] = Object.getPrototypeOf(this.$ini)[ varname[ COMPILER.VARIABLE_VALUE ] ];
    

    return new PHP.VM.Variable();
    
    
    
  
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 5.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.ini_set = PHP.Modules.prototype.ini_alter = function( varname, newvalue ) {
      var COMPILER = PHP.Compiler.prototype;
    var old = this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ];
    
    this.$ini[ varname[ COMPILER.VARIABLE_VALUE ] ] = newvalue[ COMPILER.VARIABLE_VALUE ];
    
    
    return new PHP.VM.Variable( old );
};


PHP.Modules.prototype.getenv = function( name ) {
    var COMPILER = PHP.Compiler.prototype,
    variableValue = name[ COMPILER.VARIABLE_VALUE ];


    switch( variableValue ) {
        case "TEST_PHP_EXECUTABLE":
            return new PHP.VM.Variable( PHP.Constants.PHP_BINARY )
            break;
        default:
            return new PHP.VM.Variable( false );

    }
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 11.7.2012 
* @website http://hertzen.com
 */

( function( MODULES ){
    MODULES.set_time_limit = function(  newvalue ) {
        
        var COMPILER = PHP.Compiler.prototype;
    
    
        this.$ini.max_execution_time = newvalue[ COMPILER.VARIABLE_VALUE ];
     
    };
})( PHP.Modules.prototype );

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.zend_version = function(  ) {
    
    return new PHP.VM.Variable("1.0.0");
};
/* Automatically built from PHP version: 5.4.0-ZS5.6.0 */
PHP.Constants.PHP_OUTPUT_HANDLER_START = 1;
PHP.Constants.PHP_OUTPUT_HANDLER_WRITE = 0;
PHP.Constants.PHP_OUTPUT_HANDLER_FLUSH = 4;
PHP.Constants.PHP_OUTPUT_HANDLER_CLEAN = 2;
PHP.Constants.PHP_OUTPUT_HANDLER_FINAL = 8;
PHP.Constants.PHP_OUTPUT_HANDLER_CONT = 0;
PHP.Constants.PHP_OUTPUT_HANDLER_END = 8;
PHP.Constants.PHP_OUTPUT_HANDLER_CLEANABLE = 16;
PHP.Constants.PHP_OUTPUT_HANDLER_FLUSHABLE = 32;
PHP.Constants.PHP_OUTPUT_HANDLER_REMOVABLE = 64;
PHP.Constants.PHP_OUTPUT_HANDLER_STDFLAGS = 112;
PHP.Constants.PHP_OUTPUT_HANDLER_STARTED = 4096;
PHP.Constants.PHP_OUTPUT_HANDLER_DISABLED = 8192;

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.flush = function() {
    return new PHP.VM.Variable();
};

/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 10.7.2012 
 * @website http://hertzen.com
 */

(function( MODULES ) {
    
    var DEFAULT = "default output handler",
    COMPILER = PHP.Compiler.prototype,
    OUTPUT_BUFFERS = COMPILER.OUTPUT_BUFFERS,
    CONSTANTS = PHP.Constants,
    flags = [],
    types = [],
    erasable = [],
    recurring = 0,
    NO_BUFFER_MSG = "(): failed to delete buffer. No buffer to delete",
    handlers = [];
    
    function pop() {
        handlers.pop();
        flags.pop();
        types.pop();
        erasable.pop();
    }
    
    MODULES.ob_gzhandler = function( str ) {
        return str; 
    };
    
    MODULES.$obreset = function() {
        flags = [];
        types = [];
        handlers = [];
        erasable = [];
        recurring = 0;
    };
    
    MODULES.$ob = function( str )  {

        var index = this[ OUTPUT_BUFFERS ].length - 1,
        VARIABLE = PHP.VM.Variable.prototype;
      
        this[ OUTPUT_BUFFERS ][ index ] += str;
        
        

    };
    
    MODULES.$flush = function( str, minus ) {
        minus = (minus === undefined) ? 1 : 0;
        var index = (this[ COMPILER.OUTPUT_BUFFERS ].length - 1) - minus,
        VARIABLE = PHP.VM.Variable.prototype;
        // trigger flush
        if ( handlers[ index ] !== DEFAULT &&  handlers[ index  ] !== undefined &&  this[ COMPILER.DISPLAY_HANDLER ] !== false) {
            recurring++;
            // check that we aren't ending up in any endless error loop
       
            if ( recurring <= 10 ) {
                this[ COMPILER.DISPLAY_HANDLER ] = true;

                var result = this[ handlers[ index ] ].call( this, new PHP.VM.Variable( str ), new PHP.VM.Variable( types[ index ] ) );
                         
                recurring = 0;
                this[ COMPILER.DISPLAY_HANDLER ] = undefined;
                if ( result[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {
                    return result[ COMPILER.VARIABLE_VALUE ];
                } 
                
               
                
               
            }
            return "";
        } else {
            return str;
        }
    };
    
    MODULES.ob_clean = function() {

    
        if ( !this[ COMPILER.SIGNATURE ]( arguments, "ob_clean", 0, [ ] ) ) {
            return new PHP.VM.Variable( null );
        }
    
        var index = erasable.length - 1;

        if ( erasable[ index ] === false ) {
            this[ COMPILER.ERROR ]("ob_clean(): failed to delete buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
            return new PHP.VM.Variable( false ); 
        }
    
        if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
            this[ COMPILER.OUTPUT_BUFFERS ].pop();
            this[ COMPILER.OUTPUT_BUFFERS ].push("");
            return new PHP.VM.Variable( true );
        } else {
            this[ COMPILER.ERROR ]("ob_clean(): failed to delete buffer. No buffer to delete", PHP.Constants.E_CORE_NOTICE, true );
            return new PHP.VM.Variable( false );
        }
    };

    
    MODULES.$obflush = function() {
        var index = this[ COMPILER.OUTPUT_BUFFERS ].length - 1,
        VARIABLE = PHP.VM.Variable.prototype;
        var content = this[ COMPILER.OUTPUT_BUFFERS ][ index ];
        this[ COMPILER.OUTPUT_BUFFERS ][ index ] = "";
        var value = this.$flush.call( this, content );
       
        this[ COMPILER.OUTPUT_BUFFERS ][ index ] = value;
        
    }
    
    MODULES.ob_start = function( output_callback, chunk_size, erase ) {
        
        var FUNCTION_NAME = "ob_start",
        VARIABLE = PHP.VM.Variable.prototype;
        
        if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, -3, [null, VARIABLE.INT, VARIABLE.INT ] ) ) {
            return new PHP.VM.Variable( null );
        }
        
        if (output_callback !== undefined ) {
            var fail = false,
            splitClassVar;
            if ( ( output_callback[ VARIABLE.TYPE ] !== VARIABLE.STRING && output_callback[ VARIABLE.TYPE ] !== VARIABLE.ARRAY  && output_callback[ VARIABLE.TYPE ] !== VARIABLE.LAMBDA ) ) {
                this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): no array or string given", PHP.Constants.E_WARNING, true ); 
                fail = true;

            } else if (  output_callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY || ( output_callback[ VARIABLE.TYPE ] === VARIABLE.STRING && (splitClassVar = output_callback[ COMPILER.VARIABLE_VALUE].split("::")).length > 1))  {
                // method call
                var classVar,
                methodVar;
                    
                if ( output_callback[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
                    classVar = new PHP.VM.Variable( splitClassVar[ 0 ] );
                    methodVar = new PHP.VM.Variable( splitClassVar[ 1 ] );
                } else { 
                    classVar = output_callback[ COMPILER.DIM_FETCH ]( this, new PHP.VM.Variable(0));
                    methodVar = output_callback[ COMPILER.DIM_FETCH ]( this, new PHP.VM.Variable(1));
                    
                    if ( this.count( output_callback )[ COMPILER.VARIABLE_VALUE] !== 2 ) {
                        this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): array must have exactly two members", PHP.Constants.E_WARNING, true ); 
                        fail = true;
                    } 
                    
                }
                
                if ( !fail ) {
                    if ( classVar[ VARIABLE.TYPE ] === VARIABLE.STRING && this.class_exists( classVar )[ COMPILER.VARIABLE_VALUE] === false ) { 
                        this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): class '" + PHP.Utils.ClassName( classVar ) + "' not found", PHP.Constants.E_WARNING, true ); 
                        fail = true;
                    } else if (this.method_exists( classVar, methodVar )[ COMPILER.VARIABLE_VALUE ] === false ) {
                        this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): class '" + PHP.Utils.ClassName( classVar ) + "' does not have a method '" + methodVar[ COMPILER.VARIABLE_VALUE ]  + "'", PHP.Constants.E_WARNING, true ); 
                        fail = true;
                    
                    }
                }
            } else if ( output_callback[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
                // function call
                if (this.function_exists(output_callback)[ COMPILER.VARIABLE_VALUE ] === false ) {
                    this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): function '" + output_callback[ COMPILER.VARIABLE_VALUE ] + "' not found or invalid function name", PHP.Constants.E_WARNING, true ); 
                    fail = true;
                }
            } 
            
            if ( fail ) {
                this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to create buffer", PHP.Constants.E_CORE_NOTICE, true );
                return new PHP.VM.Variable( false ); 
            }
        }
        
        var handler = DEFAULT, type;
        
        if ( output_callback !== undefined ) {
            handler = output_callback[ COMPILER.VARIABLE_VALUE ];
            type = CONSTANTS.PHP_OUTPUT_HANDLER_START;          
        } else {
            type = CONSTANTS.PHP_OUTPUT_HANDLER_WRITE;
        }
        
        this[ OUTPUT_BUFFERS ].push("");
        types.push( type )
        flags.push( CONSTANTS.PHP_OUTPUT_HANDLER_STDFLAGS | type );
        handlers.push( handler );
        
        if ( erase === undefined || erase[ COMPILER.VARIABLE_VALUE ] === true ) {
            erasable.push( true );
        } else {
            erasable.push( false );
        }
        
        return new PHP.VM.Variable( true );
    };
    
    MODULES.ob_end_clean = function() {

        var FUNCTION_NAME = "ob_end_clean";
        
        if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
            return new PHP.VM.Variable( null );
        }
        
        var index = erasable.length - 1;
        if ( erasable[ index ] === false ) {
            this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to discard buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
            return new PHP.VM.Variable( false ); 
        }
    
        if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
            this[ OUTPUT_BUFFERS ].pop();
            pop();
            return new PHP.VM.Variable( true );
        } else {
            this[ COMPILER.ERROR ]( FUNCTION_NAME + NO_BUFFER_MSG, PHP.Constants.E_CORE_NOTICE, true );
            return new PHP.VM.Variable( false );
        }
        
       
        
    };


    MODULES.ob_end_flush = function() {
             
        var FUNCTION_NAME = "ob_end_flush";
        
        if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
            return new PHP.VM.Variable( null );
        }
        
        var index = erasable.length - 1;
        if ( erasable[ index ] === false ) {
            this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to send buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
            return new PHP.VM.Variable( false ); 
        }
    
        if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
            var flush = this[ OUTPUT_BUFFERS ].pop();
            this[ OUTPUT_BUFFERS ][ this[ OUTPUT_BUFFERS ].length - 1 ] += this.$flush( flush, 1 );
            pop();

            return new PHP.VM.Variable( true );
        } else {
            this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to delete and flush buffer. No buffer to delete or flush", PHP.Constants.E_CORE_NOTICE, true );
            return new PHP.VM.Variable( false );
        }

    };

    MODULES.ob_get_flush = function() {
        var FUNCTION_NAME = "ob_get_flush";
        
        if (this[ COMPILER.DISPLAY_HANDLER ] === true) {
            this[ COMPILER.ERROR ]( "ob_get_flush(): Cannot use output buffering in output buffering display handlers", PHP.Constants.E_ERROR, true );  
        }
        
        //  var flush = this[ OUTPUT_BUFFERS ].pop();
        var index = erasable.length - 1;
        var flush =  this[ OUTPUT_BUFFERS ][ this[ OUTPUT_BUFFERS ].length - 1];
            
        if ( erasable[ index ] === false ) {
            this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to send buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
                
            this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to delete buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
        } else {
            this[ OUTPUT_BUFFERS ].pop();
            this[ OUTPUT_BUFFERS ][ this[ OUTPUT_BUFFERS ].length - 1 ] += this.$flush( flush, 1 );
            
            pop();
        }
        
        

        return new PHP.VM.Variable( flush );
    };


    MODULES.ob_get_clean = function() {
        
        var FUNCTION_NAME = "ob_get_clean";
        
        if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
            return new PHP.VM.Variable( null );
        }
        
                
        var index = erasable.length - 1;

       
        if ( this[ OUTPUT_BUFFERS ].length > 1 ) {
            
            var flush =  this[ OUTPUT_BUFFERS ][ this[ OUTPUT_BUFFERS ].length - 1];
            
            if ( erasable[ index ] === false ) {
                this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to discard buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
                
                this[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to delete buffer of "  + handlers[ index ] + " (0)", PHP.Constants.E_CORE_NOTICE, true );
            } else {
                this[ OUTPUT_BUFFERS ].pop();
                pop();
            }
            return new PHP.VM.Variable( flush );
        } else {
            return new PHP.VM.Variable( false );
        }
        
    };

    MODULES.ob_list_handlers = function() {
        return PHP.VM.Array.fromObject.call( this, handlers );
    };
    
    MODULES.ob_get_status = function( full_status ) {

        var item = PHP.VM.Array.arrayItem,
       
        get_status = function( index ) { 
            return [ 
            item("name", handlers[ index ]), 
            item("type", types[ index ]), 
            item("flags", flags[ index ]),
            item("level", index), 
            item("chunk_size", 0),
            item("buffer_size", 16384),
            item("buffer_used", this[ OUTPUT_BUFFERS ][ index + 1 ].length )
               
            ];
          
        }.bind(this);
       
       
                  
        if (this[ OUTPUT_BUFFERS ].length === 1 ) {
            return this.array([]);
        }
        
        if ( full_status !== undefined && full_status[COMPILER.VARIABLE_VALUE] === true ) {
            var arr = [];
            handlers.forEach(function( handler, index ){
                arr.push( item( index, this.array( get_status( index) ) ) )
            }, this);
            return this.array( arr );
        } else{
            return this.array( get_status( handlers.length - 1 ) );
        }
        
        
       
    };
    
    MODULES.ob_implicit_flush = function() {
        var FUNCTION_NAME = "ob_implicit_flush";
        
        if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, -1, [ ] ) ) {
            return new PHP.VM.Variable( null );
        }
        return new PHP.VM.Variable();
    };
    
})( PHP.Modules.prototype );

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_flush = function() {
    
    var FUNCTION_NAME = "ob_flush",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
     
    if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
        var flush = this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].pop();
        this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ][ this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].length - 1 ] += flush;
        this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].push("");
        this.$obflush();  
        return new PHP.VM.Variable( true );
    } else {
        this.ENV[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to flush buffer. No buffer to flush", PHP.Constants.E_CORE_NOTICE, true );
        return new PHP.VM.Variable( false );
    }
    
};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_get_contents = function() {
    var FUNCTION_NAME = "ob_get_contents",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
        return new PHP.VM.Variable( this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ][this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].length - 1] );
    } else {
        //   this.ENV[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to flush buffer. No buffer to flush", PHP.Constants.E_CORE_NOTICE, true );
        return new PHP.VM.Variable( false );
    }

};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_get_length = function() {
    var FUNCTION_NAME = "ob_get_length",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    if ( this[ COMPILER.OUTPUT_BUFFERS ].length > 1 ) {
        return new PHP.VM.Variable( this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ][this[ PHP.Compiler.prototype.OUTPUT_BUFFERS ].length - 1].length );
    } else {
        //   this.ENV[ COMPILER.ERROR ]( FUNCTION_NAME + "(): failed to flush buffer. No buffer to flush", PHP.Constants.E_CORE_NOTICE, true );
        return new PHP.VM.Variable( false );
    }

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.ob_get_level = function() {
    
    var FUNCTION_NAME = "ob_get_level",
    COMPILER = PHP.Compiler.prototype;
    
    if ( !this[ COMPILER.SIGNATURE ]( arguments, FUNCTION_NAME, 0, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    return new PHP.VM.Variable( this[ COMPILER.OUTPUT_BUFFERS ].length - 1 );

};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 16.7.2012 
* @website http://hertzen.com
 */

// todo improve
PHP.Modules.prototype.preg_match = function( pattern, subject, matches ) {
    var COMPILER = PHP.Compiler.prototype;
    
    var re = new RegExp( pattern[ COMPILER.VARIABLE_VALUE ].substr(1, pattern[ COMPILER.VARIABLE_VALUE ].length - 2) );
    var result = subject[ COMPILER.VARIABLE_VALUE ].toString().match( re );
        
    return new PHP.VM.Variable( ( result === null ) ? 0 : result.length );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 24.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.echo = function() {
    var COMPILER = PHP.Compiler.prototype,
    __toString = "__toString",
    VARIABLE = PHP.VM.Variable.prototype;
    Array.prototype.slice.call( arguments ).forEach(function( arg ){
        
        if (arg instanceof PHP.VM.VariableProto) {
            var value = arg[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ];
            
            if ( arg[ VARIABLE.TYPE ] === VARIABLE.FLOAT ) {
                this.$ob( value.toString().replace(/\./, this.$locale.decimal_point ) );
             } else if ( arg[ VARIABLE.TYPE ] === VARIABLE.BOOL && value != 1 ) { 
                 return;
            } else if ( arg[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {
                
                this.$ob( value );
                
            }
            
        } else {
            this.$ob( arg );
        //   this[ COMPILER.OUTPUT_BUFFERS ][this[ COMPILER.OUTPUT_BUFFERS ].length - 1] += arg;
        }
        
    }, this);
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.explode = function( delim, string ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype,
    item = PHP.VM.Array.arrayItem;
    
    if ( string[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
        // Defaults to an empty string
        var items = string[ COMPILER.VARIABLE_VALUE ].split( delim[ COMPILER.VARIABLE_VALUE ] ),
        arr = [];
        
        
        items.forEach(function( val, index ){
            arr.push( item( index, val ) )
        });
       
        return this.array( arr );
    }

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.implode = function( glue, pieces ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    if ( glue[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        // Defaults to an empty string
        pieces = glue;
        glue = "";
    } else {
        glue = glue[ COMPILER.VARIABLE_VALUE ];
    }
    
    var values = pieces[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
    
    
    
    return new PHP.VM.Variable( values.map(function( val ){
        return val[ COMPILER.VARIABLE_VALUE ];
    }).join( glue ) );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.localeconv = function(  ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
     item = PHP.VM.Array.arrayItem;
    
    var locale = this.$locale;
   
    
    // todo add all
    return this.array( [ 
        item( "decimal_point", locale.decimal_point ), 
        item( "thousands_sep", locale.thousands_sep ) ] 
);
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 27.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.parse_str = function( str, arr ) {
    
    
 
    
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.print = function( variable ) {
    this.echo( variable );
    return new PHP.VM.Variable(1);
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.printf = function( format ) {
    var COMPILER = PHP.Compiler.prototype,
    __toString = "__toString",
    VARIABLE = PHP.VM.Variable.prototype;
 
        
    if (format instanceof PHP.VM.VariableProto) {
        
        

        
        var value = format[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ];
        
                if (format[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_NAME ] === "stdClass") {
            this.ENV[ COMPILER.ERROR ]("Object of class stdClass to string conversion", PHP.Constants.E_NOTICE, true );    
            value = "Object";
        } 
        
        if ( format[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {
            
            
            // todo fix to make more specific
            Array.prototype.slice.call( arguments, 1 ).forEach( function( item ) {
                value = value.replace(/%./, item[ COMPILER.VARIABLE_VALUE ] );
            });
            this.$ob( value );
                
        }
            
    } 
        

    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.setlocale = function( category ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var cat = category[ COMPILER.VARIABLE_VALUE ],
    localeObj,
    localeName;
    
    Array.prototype.slice.call( arguments, 1).some( function( localeVar ) {
        
        var locale = localeVar[ COMPILER.VARIABLE_VALUE ]
        
        return Object.keys( PHP.Locales ).some( function( key ){
        
            if ( key === locale) {
                localeName = key;
                localeObj = PHP.Locales[ key ];
                return true;
            }
            return false;
        
        });
    
    });
    
    if ( localeObj === undefined ) {
        return new PHP.VM.Variable( false );
    }
    
   // console.log( cat );
    
    Object.keys( this.$locale ).forEach( function( key ){
        
        if ( localeObj [ key ] !== undefined ) {
            this.$locale[ key ] = localeObj [ key ];
        }
        
    }, this);
    
    return new PHP.VM.Variable( localeName );
    
};
/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 23.7.2012
* @website http://hertzen.com
 */



PHP.Modules.prototype.sprintf = function( format ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if (format instanceof PHP.VM.VariableProto) {
        var value = format[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ];
        if ( format[ VARIABLE.TYPE ] !== VARIABLE.NULL ) {

            // todo fix to make more specific
            Array.prototype.slice.call( arguments, 1 ).forEach( function( item ) {
               value = value.replace(/%./, item[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] );
            });

            return new PHP.VM.Variable( value );
        }
    }
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 18.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.str_repeat = function( input, multiplier ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    variableValue = input[ COMPILER.VARIABLE_VALUE ];
    var str = "";
    
    for ( var i = 0, len = multiplier[ COMPILER.VARIABLE_VALUE ]; i < len; i++ ) {
        str += variableValue;
    }
    
    return new PHP.VM.Variable( str );
    
};
PHP.Modules.prototype.str_replace = function( search, replace, subject ) {
    var COMPILER = PHP.Compiler.prototype;

    var re = new RegExp( search[ COMPILER.VARIABLE_VALUE ], "g");
    return new PHP.VM.Variable( subject[ COMPILER.VARIABLE_VALUE ].replace( re, replace[ COMPILER.VARIABLE_VALUE ] ) );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */

PHP.Modules.prototype.str_rot13 = function( str, arr ) {
    
    var FUNCTION_NAME = "str_rot13";
        
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, FUNCTION_NAME, 1, [ ] ) ) {
        return new PHP.VM.Variable( null );
    }
 
    
    
    
};
  
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.strlen = function( string ) {
    
    var COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( string[ COMPILER.VARIABLE_VALUE ].length );
    
};
PHP.Modules.prototype.strncmp = function( str1, str2, len ) {

    var COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;

    if ( ( str1[ VAR.CAST_STRING ][ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) === str2[ VAR.CAST_STRING ][ COMPILER.VARIABLE_VALUE ].substring(0, len[ COMPILER.VARIABLE_VALUE ] ) ) ) {
         return new PHP.VM.Variable( 0 );
    } else {
         return new PHP.VM.Variable( 1 );
    }
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.strtolower = function( str ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( str[ COMPILER.VARIABLE_VALUE ].toLowerCase() );
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 10.7.2012 
* @website http://hertzen.com
 */



PHP.Modules.prototype.strtoupper = function( str ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    return new PHP.VM.Variable( str[ COMPILER.VARIABLE_VALUE ].toUpperCase() );
};
PHP.Modules.prototype.trim = function( variable ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( variable[ VARIABLE.TYPE ] !== VARIABLE.STRING ) {
        variable = variable[ VARIABLE.CAST_STRING ];
    }

    return new PHP.VM.Variable( variable[ COMPILER.VARIABLE_VALUE ].toString().trim() );
};




PHP.Constants.T_INCLUDE = 262;
PHP.Constants.T_INCLUDE_ONCE = 261;
PHP.Constants.T_EVAL = 260;
PHP.Constants.T_REQUIRE = 259;
PHP.Constants.T_REQUIRE_ONCE = 258;
PHP.Constants.T_LOGICAL_OR = 263;
PHP.Constants.T_LOGICAL_XOR = 264;
PHP.Constants.T_LOGICAL_AND = 265;
PHP.Constants.T_PRINT = 266;
PHP.Constants.T_PLUS_EQUAL = 277;
PHP.Constants.T_MINUS_EQUAL = 276;
PHP.Constants.T_MUL_EQUAL = 275;
PHP.Constants.T_DIV_EQUAL = 274;
PHP.Constants.T_CONCAT_EQUAL = 273;
PHP.Constants.T_MOD_EQUAL = 272;
PHP.Constants.T_AND_EQUAL = 271;
PHP.Constants.T_OR_EQUAL = 270;
PHP.Constants.T_XOR_EQUAL = 269;
PHP.Constants.T_SL_EQUAL = 268;
PHP.Constants.T_SR_EQUAL = 267;
PHP.Constants.T_BOOLEAN_OR = 278;
PHP.Constants.T_BOOLEAN_AND = 279;
PHP.Constants.T_IS_EQUAL = 283;
PHP.Constants.T_IS_NOT_EQUAL = 282;
PHP.Constants.T_IS_IDENTICAL = 281;
PHP.Constants.T_IS_NOT_IDENTICAL = 280;
PHP.Constants.T_IS_SMALLER_OR_EQUAL = 285;
PHP.Constants.T_IS_GREATER_OR_EQUAL = 284;
PHP.Constants.T_SL = 287;
PHP.Constants.T_SR = 286;
PHP.Constants.T_INSTANCEOF = 288;
PHP.Constants.T_INC = 297;
PHP.Constants.T_DEC = 296;
PHP.Constants.T_INT_CAST = 295;
PHP.Constants.T_DOUBLE_CAST = 294;
PHP.Constants.T_STRING_CAST = 293;
PHP.Constants.T_ARRAY_CAST = 292;
PHP.Constants.T_OBJECT_CAST = 291;
PHP.Constants.T_BOOL_CAST = 290;
PHP.Constants.T_UNSET_CAST = 289;
PHP.Constants.T_NEW = 299;
PHP.Constants.T_CLONE = 298;
PHP.Constants.T_EXIT = 300;
PHP.Constants.T_IF = 301;
PHP.Constants.T_ELSEIF = 302;
PHP.Constants.T_ELSE = 303;
PHP.Constants.T_ENDIF = 304;
PHP.Constants.T_LNUMBER = 305;
PHP.Constants.T_DNUMBER = 306;
PHP.Constants.T_STRING = 307;
PHP.Constants.T_STRING_VARNAME = 308;
PHP.Constants.T_VARIABLE = 309;
PHP.Constants.T_NUM_STRING = 310;
PHP.Constants.T_INLINE_HTML = 311;
PHP.Constants.T_CHARACTER = 312;
PHP.Constants.T_BAD_CHARACTER = 313;
PHP.Constants.T_ENCAPSED_AND_WHITESPACE = 314;
PHP.Constants.T_CONSTANT_ENCAPSED_STRING = 315;
PHP.Constants.T_ECHO = 316;
PHP.Constants.T_DO = 317;
PHP.Constants.T_WHILE = 318;
PHP.Constants.T_ENDWHILE = 319;
PHP.Constants.T_FOR = 320;
PHP.Constants.T_ENDFOR = 321;
PHP.Constants.T_FOREACH = 322;
PHP.Constants.T_ENDFOREACH = 323;
PHP.Constants.T_DECLARE = 324;
PHP.Constants.T_ENDDECLARE = 325;
PHP.Constants.T_AS = 326;
PHP.Constants.T_SWITCH = 327;
PHP.Constants.T_ENDSWITCH = 328;
PHP.Constants.T_CASE = 329;
PHP.Constants.T_DEFAULT = 330;
PHP.Constants.T_BREAK = 331;
PHP.Constants.T_CONTINUE = 332;
PHP.Constants.T_GOTO = 333;
PHP.Constants.T_FUNCTION = 334;
PHP.Constants.T_CONST = 335;
PHP.Constants.T_RETURN = 336;
PHP.Constants.T_TRY = 337;
PHP.Constants.T_CATCH = 338;
PHP.Constants.T_THROW = 339;
PHP.Constants.T_USE = 340;
//PHP.Constants.T_INSTEADOF = ;
PHP.Constants.T_GLOBAL = 341;
PHP.Constants.T_STATIC = 347;
PHP.Constants.T_ABSTRACT = 346;
PHP.Constants.T_FINAL = 345;
PHP.Constants.T_PRIVATE = 344;
PHP.Constants.T_PROTECTED = 343;
PHP.Constants.T_PUBLIC = 342;
PHP.Constants.T_VAR = 348;
PHP.Constants.T_UNSET = 349;
PHP.Constants.T_ISSET = 350;
PHP.Constants.T_EMPTY = 351;
PHP.Constants.T_HALT_COMPILER = 352;
PHP.Constants.T_CLASS = 353;
//PHP.Constants.T_TRAIT = ;
PHP.Constants.T_INTERFACE = 354;
PHP.Constants.T_EXTENDS = 355;
PHP.Constants.T_IMPLEMENTS = 356;
PHP.Constants.T_OBJECT_OPERATOR = 357;
PHP.Constants.T_DOUBLE_ARROW = 358;
PHP.Constants.T_LIST = 359;
PHP.Constants.T_ARRAY = 360;
//PHP.Constants.T_CALLABLE = ;
PHP.Constants.T_CLASS_C = 361;
PHP.Constants.T_TRAIT_C = 381;
PHP.Constants.T_METHOD_C = 362;
PHP.Constants.T_FUNC_C = 363;
PHP.Constants.T_LINE = 364;
PHP.Constants.T_FILE = 365;
PHP.Constants.T_COMMENT = 366;
PHP.Constants.T_DOC_COMMENT = 367;
PHP.Constants.T_OPEN_TAG = 368;
PHP.Constants.T_OPEN_TAG_WITH_ECHO = 369;
PHP.Constants.T_CLOSE_TAG = 370;
PHP.Constants.T_WHITESPACE = 371;
PHP.Constants.T_START_HEREDOC = 372;
PHP.Constants.T_END_HEREDOC = 373;
PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES = 374;
PHP.Constants.T_CURLY_OPEN = 375;
PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM = 376;
PHP.Constants.T_DOUBLE_COLON = 376;
PHP.Constants.T_NAMESPACE = 377;
PHP.Constants.T_NS_C = 378;
PHP.Constants.T_DIR = 379;
PHP.Constants.T_NS_SEPARATOR = 380;
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 28.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.token_get_all = function( code ) {
    var VARIABLE = PHP.VM.Variable.prototype,
    COMPILER = PHP.Compiler.prototype;
    
    
    if ( !this[ COMPILER.SIGNATURE ]( arguments, "token_get_all", 1, [ [ VARIABLE.STRING, VARIABLE.NULL ] ] ) ) {
        return new PHP.VM.Variable( null );
    }
   
    switch( code[ VARIABLE.TYPE ] ) {
        
        case VARIABLE.BOOL:
            if ( code[ COMPILER.VARIABLE_VALUE ] === true ) {
                return PHP.VM.Array.fromObject.call( this, PHP.Lexer( "1" ));
            } else {
                return PHP.VM.Array.fromObject.call( this, PHP.Lexer( null ));
            }
            break;
        case VARIABLE.STRING:
        case VARIABLE.NULL:
            return PHP.VM.Array.fromObject.call( this, PHP.Lexer( code[ COMPILER.VARIABLE_VALUE ] ));
            break;
            
         default:
             return PHP.VM.Array.fromObject.call( this, PHP.Lexer( code[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] ));
        
    }
    
    
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.6.2012 
* @website http://hertzen.com
 */

/* token_name — Get the symbolic name of a given PHP token
 * string token_name ( int $token )
 */

PHP.Modules.prototype.token_name = function( token ) {
    
    if ( !this[ PHP.Compiler.prototype.SIGNATURE ]( arguments, "token_name", 1, [ PHP.VM.Variable.prototype.INT ] ) ) {
        return new PHP.VM.Variable( null );
    }
    
    // TODO invert this for faster performance
    var constants = {};
    constants.T_INCLUDE = 262;
    constants.T_INCLUDE_ONCE = 261;
    constants.T_EVAL = 260;
    constants.T_REQUIRE = 259;
    constants.T_REQUIRE_ONCE = 258;
    constants.T_LOGICAL_OR = 263;
    constants.T_LOGICAL_XOR = 264;
    constants.T_LOGICAL_AND = 265;
    constants.T_PRINT = 266;
    constants.T_PLUS_EQUAL = 277;
    constants.T_MINUS_EQUAL = 276;
    constants.T_MUL_EQUAL = 275;
    constants.T_DIV_EQUAL = 274;
    constants.T_CONCAT_EQUAL = 273;
    constants.T_MOD_EQUAL = 272;
    constants.T_AND_EQUAL = 271;
    constants.T_OR_EQUAL = 270;
    constants.T_XOR_EQUAL = 269;
    constants.T_SL_EQUAL = 268;
    constants.T_SR_EQUAL = 267;
    constants.T_BOOLEAN_OR = 278;
    constants.T_BOOLEAN_AND = 279;
    constants.T_IS_EQUAL = 283;
    constants.T_IS_NOT_EQUAL = 282;
    constants.T_IS_IDENTICAL = 281;
    constants.T_IS_NOT_IDENTICAL = 280;
    constants.T_IS_SMALLER_OR_EQUAL = 285;
    constants.T_IS_GREATER_OR_EQUAL = 284;
    constants.T_SL = 287;
    constants.T_SR = 286;
    constants.T_INSTANCEOF = 288;
    constants.T_INC = 297;
    constants.T_DEC = 296;
    constants.T_INT_CAST = 295;
    constants.T_DOUBLE_CAST = 294;
    constants.T_STRING_CAST = 293;
    constants.T_ARRAY_CAST = 292;
    constants.T_OBJECT_CAST = 291;
    constants.T_BOOL_CAST = 290;
    constants.T_UNSET_CAST = 289;
    constants.T_NEW = 299;
    constants.T_CLONE = 298;
    constants.T_EXIT = 300;
    constants.T_IF = 301;
    constants.T_ELSEIF = 302;
    constants.T_ELSE = 303;
    constants.T_ENDIF = 304;
    constants.T_LNUMBER = 305;
    constants.T_DNUMBER = 306;
    constants.T_STRING = 307;
    constants.T_STRING_VARNAME = 308;
    constants.T_VARIABLE = 309;
    constants.T_NUM_STRING = 310;
    constants.T_INLINE_HTML = 311;
    constants.T_CHARACTER = 312;
    constants.T_BAD_CHARACTER = 313;
    constants.T_ENCAPSED_AND_WHITESPACE = 314;
    constants.T_CONSTANT_ENCAPSED_STRING = 315;
    constants.T_ECHO = 316;
    constants.T_DO = 317;
    constants.T_WHILE = 318;
    constants.T_ENDWHILE = 319;
    constants.T_FOR = 320;
    constants.T_ENDFOR = 321;
    constants.T_FOREACH = 322;
    constants.T_ENDFOREACH = 323;
    constants.T_DECLARE = 324;
    constants.T_ENDDECLARE = 325;
    constants.T_AS = 326;
    constants.T_SWITCH = 327;
    constants.T_ENDSWITCH = 328;
    constants.T_CASE = 329;
    constants.T_DEFAULT = 330;
    constants.T_BREAK = 331;
    constants.T_CONTINUE = 332;
    constants.T_GOTO = 333;
    constants.T_FUNCTION = 334;
    constants.T_CONST = 335;
    constants.T_RETURN = 336;
    constants.T_TRY = 337;
    constants.T_CATCH = 338;
    constants.T_THROW = 339;
    constants.T_USE = 340;
    //constants.T_INSTEADOF = ;
    constants.T_GLOBAL = 341;
    constants.T_STATIC = 347;
    constants.T_ABSTRACT = 346;
    constants.T_FINAL = 345;
    constants.T_PRIVATE = 344;
    constants.T_PROTECTED = 343;
    constants.T_PUBLIC = 342;
    constants.T_VAR = 348;
    constants.T_UNSET = 349;
    constants.T_ISSET = 350;
    constants.T_EMPTY = 351;
    constants.T_HALT_COMPILER = 352;
    constants.T_CLASS = 353;
    //constants.T_TRAIT = ;
    constants.T_INTERFACE = 354;
    constants.T_EXTENDS = 355;
    constants.T_IMPLEMENTS = 356;
    constants.T_OBJECT_OPERATOR = 357;
    constants.T_DOUBLE_ARROW = 358;
    constants.T_LIST = 359;
    constants.T_ARRAY = 360;
    //constants.T_CALLABLE = ;
    constants.T_CLASS_C = 361;
    //constants.T_TRAIT_C = ;
    constants.T_METHOD_C = 362;
    constants.T_FUNC_C = 363;
    constants.T_LINE = 364;
    constants.T_FILE = 365;
    constants.T_COMMENT = 366;
    constants.T_DOC_COMMENT = 367;
    constants.T_OPEN_TAG = 368;
    constants.T_OPEN_TAG_WITH_ECHO = 369;
    constants.T_CLOSE_TAG = 370;
    constants.T_WHITESPACE = 371;
    constants.T_START_HEREDOC = 372;
    constants.T_END_HEREDOC = 373;
    constants.T_DOLLAR_OPEN_CURLY_BRACES = 374;
    constants.T_CURLY_OPEN = 375;
    constants.T_DOUBLE_COLON = 376;
    constants.T_PAAMAYIM_NEKUDOTAYIM = 376;
    constants.T_NAMESPACE = 377;
    constants.T_NS_C = 378;
    constants.T_DIR = 379;
    constants.T_NS_SEPARATOR = 380;
    
    
 
    for (var key in constants) {
        if (constants[ key ] === token[ PHP.Compiler.prototype.VARIABLE_VALUE ]) {
            return new PHP.VM.Variable( key );
        }
    }
    
    return new PHP.VM.Variable( "UNKNOWN" );
    
 
    
    

};
/* Automatically built from PHP version: 5.4.0-ZS5.6.0 */
PHP.Constants.CONNECTION_ABORTED = 1;
PHP.Constants.CONNECTION_NORMAL = 0;
PHP.Constants.CONNECTION_TIMEOUT = 2;
PHP.Constants.INI_USER = 1;
PHP.Constants.INI_PERDIR = 2;
PHP.Constants.INI_SYSTEM = 4;
PHP.Constants.INI_ALL = 7;
PHP.Constants.INI_SCANNER_NORMAL = 0;
PHP.Constants.INI_SCANNER_RAW = 1;
PHP.Constants.PHP_URL_SCHEME = 0;
PHP.Constants.PHP_URL_HOST = 1;
PHP.Constants.PHP_URL_PORT = 2;
PHP.Constants.PHP_URL_USER = 3;
PHP.Constants.PHP_URL_PASS = 4;
PHP.Constants.PHP_URL_PATH = 5;
PHP.Constants.PHP_URL_QUERY = 6;
PHP.Constants.PHP_URL_FRAGMENT = 7;
PHP.Constants.PHP_QUERY_RFC1738 = 1;
PHP.Constants.PHP_QUERY_RFC3986 = 2;
PHP.Constants.M_E = 2.718281828459;
PHP.Constants.M_LOG2E = 1.442695040889;
PHP.Constants.M_LOG10E = 0.43429448190325;
PHP.Constants.M_LN2 = 0.69314718055995;
PHP.Constants.M_LN10 = 2.302585092994;
PHP.Constants.M_PI = 3.1415926535898;
PHP.Constants.M_PI_2 = 1.5707963267949;
PHP.Constants.M_PI_4 = 0.78539816339745;
PHP.Constants.M_1_PI = 0.31830988618379;
PHP.Constants.M_2_PI = 0.63661977236758;
PHP.Constants.M_SQRTPI = 1.7724538509055;
PHP.Constants.M_2_SQRTPI = 1.1283791670955;
PHP.Constants.M_LNPI = 1.1447298858494;
PHP.Constants.M_EULER = 0.57721566490153;
PHP.Constants.M_SQRT2 = 1.4142135623731;
PHP.Constants.M_SQRT1_2 = 0.70710678118655;
PHP.Constants.M_SQRT3 = 1.7320508075689;
PHP.Constants.INF = "INF";
PHP.Constants.NAN = "NAN";
PHP.Constants.PHP_ROUND_HALF_UP = 1;
PHP.Constants.PHP_ROUND_HALF_DOWN = 2;
PHP.Constants.PHP_ROUND_HALF_EVEN = 3;
PHP.Constants.PHP_ROUND_HALF_ODD = 4;
PHP.Constants.INFO_GENERAL = 1;
PHP.Constants.INFO_CREDITS = 2;
PHP.Constants.INFO_CONFIGURATION = 4;
PHP.Constants.INFO_MODULES = 8;
PHP.Constants.INFO_ENVIRONMENT = 16;
PHP.Constants.INFO_VARIABLES = 32;
PHP.Constants.INFO_LICENSE = 64;
PHP.Constants.INFO_ALL = -1;
PHP.Constants.CREDITS_GROUP = 1;
PHP.Constants.CREDITS_GENERAL = 2;
PHP.Constants.CREDITS_SAPI = 4;
PHP.Constants.CREDITS_MODULES = 8;
PHP.Constants.CREDITS_DOCS = 16;
PHP.Constants.CREDITS_FULLPAGE = 32;
PHP.Constants.CREDITS_QA = 64;
PHP.Constants.CREDITS_ALL = -1;
PHP.Constants.HTML_SPECIALCHARS = 0;
PHP.Constants.HTML_ENTITIES = 1;
PHP.Constants.ENT_COMPAT = 2;
PHP.Constants.ENT_QUOTES = 3;
PHP.Constants.ENT_NOQUOTES = 0;
PHP.Constants.ENT_IGNORE = 4;
PHP.Constants.ENT_SUBSTITUTE = 8;
PHP.Constants.ENT_DISALLOWED = 128;
PHP.Constants.ENT_HTML401 = 0;
PHP.Constants.ENT_XML1 = 16;
PHP.Constants.ENT_XHTML = 32;
PHP.Constants.ENT_HTML5 = 48;
PHP.Constants.STR_PAD_LEFT = 0;
PHP.Constants.STR_PAD_RIGHT = 1;
PHP.Constants.STR_PAD_BOTH = 2;
PHP.Constants.PATHINFO_DIRNAME = 1;
PHP.Constants.PATHINFO_BASENAME = 2;
PHP.Constants.PATHINFO_EXTENSION = 4;
PHP.Constants.PATHINFO_FILENAME = 8;
PHP.Constants.CHAR_MAX = 127;
PHP.Constants.LC_CTYPE = 2;
PHP.Constants.LC_NUMERIC = 4;
PHP.Constants.LC_TIME = 5;
PHP.Constants.LC_COLLATE = 1;
PHP.Constants.LC_MONETARY = 3;
PHP.Constants.LC_ALL = 0;
PHP.Constants.SEEK_SET = 0;
PHP.Constants.SEEK_CUR = 1;
PHP.Constants.SEEK_END = 2;
PHP.Constants.LOCK_SH = 1;
PHP.Constants.LOCK_EX = 2;
PHP.Constants.LOCK_UN = 3;
PHP.Constants.LOCK_NB = 4;
PHP.Constants.STREAM_NOTIFY_CONNECT = 2;
PHP.Constants.STREAM_NOTIFY_AUTH_REQUIRED = 3;
PHP.Constants.STREAM_NOTIFY_AUTH_RESULT = 10;
PHP.Constants.STREAM_NOTIFY_MIME_TYPE_IS = 4;
PHP.Constants.STREAM_NOTIFY_FILE_SIZE_IS = 5;
PHP.Constants.STREAM_NOTIFY_REDIRECTED = 6;
PHP.Constants.STREAM_NOTIFY_PROGRESS = 7;
PHP.Constants.STREAM_NOTIFY_FAILURE = 9;
PHP.Constants.STREAM_NOTIFY_COMPLETED = 8;
PHP.Constants.STREAM_NOTIFY_RESOLVE = 1;
PHP.Constants.STREAM_NOTIFY_SEVERITY_INFO = 0;
PHP.Constants.STREAM_NOTIFY_SEVERITY_WARN = 1;
PHP.Constants.STREAM_NOTIFY_SEVERITY_ERR = 2;
PHP.Constants.STREAM_FILTER_READ = 1;
PHP.Constants.STREAM_FILTER_WRITE = 2;
PHP.Constants.STREAM_FILTER_ALL = 3;
PHP.Constants.STREAM_CLIENT_PERSISTENT = 1;
PHP.Constants.STREAM_CLIENT_ASYNC_CONNECT = 2;
PHP.Constants.STREAM_CLIENT_CONNECT = 4;
PHP.Constants.STREAM_CRYPTO_METHOD_SSLv2_CLIENT = 0;
PHP.Constants.STREAM_CRYPTO_METHOD_SSLv3_CLIENT = 1;
PHP.Constants.STREAM_CRYPTO_METHOD_SSLv23_CLIENT = 2;
PHP.Constants.STREAM_CRYPTO_METHOD_TLS_CLIENT = 3;
PHP.Constants.STREAM_CRYPTO_METHOD_SSLv2_SERVER = 4;
PHP.Constants.STREAM_CRYPTO_METHOD_SSLv3_SERVER = 5;
PHP.Constants.STREAM_CRYPTO_METHOD_SSLv23_SERVER = 6;
PHP.Constants.STREAM_CRYPTO_METHOD_TLS_SERVER = 7;
PHP.Constants.STREAM_SHUT_RD = 0;
PHP.Constants.STREAM_SHUT_WR = 1;
PHP.Constants.STREAM_SHUT_RDWR = 2;
PHP.Constants.STREAM_PF_INET = 2;
PHP.Constants.STREAM_PF_UNIX = 1;
PHP.Constants.STREAM_IPPROTO_IP = 0;
PHP.Constants.STREAM_IPPROTO_TCP = 6;
PHP.Constants.STREAM_IPPROTO_UDP = 17;
PHP.Constants.STREAM_IPPROTO_ICMP = 1;
PHP.Constants.STREAM_IPPROTO_RAW = 255;
PHP.Constants.STREAM_SOCK_STREAM = 1;
PHP.Constants.STREAM_SOCK_DGRAM = 2;
PHP.Constants.STREAM_SOCK_RAW = 3;
PHP.Constants.STREAM_SOCK_SEQPACKET = 5;
PHP.Constants.STREAM_SOCK_RDM = 4;
PHP.Constants.STREAM_PEEK = 2;
PHP.Constants.STREAM_OOB = 1;
PHP.Constants.STREAM_SERVER_BIND = 4;
PHP.Constants.STREAM_SERVER_LISTEN = 8;
PHP.Constants.FILE_USE_INCLUDE_PATH = 1;
PHP.Constants.FILE_IGNORE_NEW_LINES = 2;
PHP.Constants.FILE_SKIP_EMPTY_LINES = 4;
PHP.Constants.FILE_APPEND = 8;
PHP.Constants.FILE_NO_DEFAULT_CONTEXT = 16;
PHP.Constants.FILE_TEXT = 0;
PHP.Constants.FILE_BINARY = 0;
PHP.Constants.FNM_NOESCAPE = 1;
PHP.Constants.FNM_PATHNAME = 2;
PHP.Constants.FNM_PERIOD = 4;
PHP.Constants.FNM_CASEFOLD = 16;
PHP.Constants.PSFS_PASS_ON = 2;
PHP.Constants.PSFS_FEED_ME = 1;
PHP.Constants.PSFS_ERR_FATAL = 0;
PHP.Constants.PSFS_FLAG_NORMAL = 0;
PHP.Constants.PSFS_FLAG_FLUSH_INC = 1;
PHP.Constants.PSFS_FLAG_FLUSH_CLOSE = 2;
PHP.Constants.CRYPT_SALT_LENGTH = 123;
PHP.Constants.CRYPT_STD_DES = 1;
PHP.Constants.CRYPT_EXT_DES = 1;
PHP.Constants.CRYPT_MD5 = 1;
PHP.Constants.CRYPT_BLOWFISH = 1;
PHP.Constants.CRYPT_SHA256 = 1;
PHP.Constants.CRYPT_SHA512 = 1;
PHP.Constants.DIRECTORY_SEPARATOR = "\\";
PHP.Constants.PATH_SEPARATOR = ";";
PHP.Constants.SCANDIR_SORT_ASCENDING = 0;
PHP.Constants.SCANDIR_SORT_DESCENDING = 1;
PHP.Constants.SCANDIR_SORT_NONE = 2;
PHP.Constants.GLOB_BRACE = 128;
PHP.Constants.GLOB_MARK = 8;
PHP.Constants.GLOB_NOSORT = 32;
PHP.Constants.GLOB_NOCHECK = 16;
PHP.Constants.GLOB_NOESCAPE = 4096;
PHP.Constants.GLOB_ERR = 4;
PHP.Constants.GLOB_ONLYDIR = 1073741824;
PHP.Constants.GLOB_AVAILABLE_FLAGS = 1073746108;
PHP.Constants.LOG_EMERG = 1;
PHP.Constants.LOG_ALERT = 1;
PHP.Constants.LOG_CRIT = 1;
PHP.Constants.LOG_ERR = 4;
PHP.Constants.LOG_WARNING = 5;
PHP.Constants.LOG_NOTICE = 6;
PHP.Constants.LOG_INFO = 6;
PHP.Constants.LOG_DEBUG = 6;
PHP.Constants.LOG_KERN = 0;
PHP.Constants.LOG_USER = 8;
PHP.Constants.LOG_MAIL = 16;
PHP.Constants.LOG_DAEMON = 24;
PHP.Constants.LOG_AUTH = 32;
PHP.Constants.LOG_SYSLOG = 40;
PHP.Constants.LOG_LPR = 48;
PHP.Constants.LOG_NEWS = 56;
PHP.Constants.LOG_UUCP = 64;
PHP.Constants.LOG_CRON = 72;
PHP.Constants.LOG_AUTHPRIV = 80;
PHP.Constants.LOG_PID = 1;
PHP.Constants.LOG_CONS = 2;
PHP.Constants.LOG_ODELAY = 4;
PHP.Constants.LOG_NDELAY = 8;
PHP.Constants.LOG_NOWAIT = 16;
PHP.Constants.LOG_PERROR = 32;
PHP.Constants.EXTR_OVERWRITE = 0;
PHP.Constants.EXTR_SKIP = 1;
PHP.Constants.EXTR_PREFIX_SAME = 2;
PHP.Constants.EXTR_PREFIX_ALL = 3;
PHP.Constants.EXTR_PREFIX_INVALID = 4;
PHP.Constants.EXTR_PREFIX_IF_EXISTS = 5;
PHP.Constants.EXTR_IF_EXISTS = 6;
PHP.Constants.EXTR_REFS = 256;
PHP.Constants.SORT_ASC = 4;
PHP.Constants.SORT_DESC = 3;
PHP.Constants.SORT_REGULAR = 0;
PHP.Constants.SORT_NUMERIC = 1;
PHP.Constants.SORT_STRING = 2;
PHP.Constants.SORT_LOCALE_STRING = 5;
PHP.Constants.SORT_NATURAL = 6;
PHP.Constants.SORT_FLAG_CASE = 8;
PHP.Constants.CASE_LOWER = 0;
PHP.Constants.CASE_UPPER = 1;
PHP.Constants.COUNT_NORMAL = 0;
PHP.Constants.COUNT_RECURSIVE = 1;
PHP.Constants.ASSERT_ACTIVE = 1;
PHP.Constants.ASSERT_CALLBACK = 2;
PHP.Constants.ASSERT_BAIL = 3;
PHP.Constants.ASSERT_WARNING = 4;
PHP.Constants.ASSERT_QUIET_EVAL = 5;
PHP.Constants.STREAM_USE_PATH = 1;
PHP.Constants.STREAM_IGNORE_URL = 2;
PHP.Constants.STREAM_REPORT_ERRORS = 8;
PHP.Constants.STREAM_MUST_SEEK = 16;
PHP.Constants.STREAM_URL_STAT_LINK = 1;
PHP.Constants.STREAM_URL_STAT_QUIET = 2;
PHP.Constants.STREAM_MKDIR_RECURSIVE = 1;
PHP.Constants.STREAM_IS_URL = 1;
PHP.Constants.STREAM_OPTION_BLOCKING = 1;
PHP.Constants.STREAM_OPTION_READ_TIMEOUT = 4;
PHP.Constants.STREAM_OPTION_READ_BUFFER = 2;
PHP.Constants.STREAM_OPTION_WRITE_BUFFER = 3;
PHP.Constants.STREAM_BUFFER_NONE = 0;
PHP.Constants.STREAM_BUFFER_LINE = 1;
PHP.Constants.STREAM_BUFFER_FULL = 2;
PHP.Constants.STREAM_CAST_AS_STREAM = 0;
PHP.Constants.STREAM_CAST_FOR_SELECT = 3;
PHP.Constants.STREAM_META_TOUCH = 1;
PHP.Constants.STREAM_META_OWNER = 3;
PHP.Constants.STREAM_META_OWNER_NAME = 2;
PHP.Constants.STREAM_META_GROUP = 5;
PHP.Constants.STREAM_META_GROUP_NAME = 4;
PHP.Constants.STREAM_META_ACCESS = 6;
PHP.Constants.IMAGETYPE_GIF = 1;
PHP.Constants.IMAGETYPE_JPEG = 2;
PHP.Constants.IMAGETYPE_PNG = 3;
PHP.Constants.IMAGETYPE_SWF = 4;
PHP.Constants.IMAGETYPE_PSD = 5;
PHP.Constants.IMAGETYPE_BMP = 6;
PHP.Constants.IMAGETYPE_TIFF_II = 7;
PHP.Constants.IMAGETYPE_TIFF_MM = 8;
PHP.Constants.IMAGETYPE_JPC = 9;
PHP.Constants.IMAGETYPE_JP2 = 10;
PHP.Constants.IMAGETYPE_JPX = 11;
PHP.Constants.IMAGETYPE_JB2 = 12;
PHP.Constants.IMAGETYPE_SWC = 13;
PHP.Constants.IMAGETYPE_IFF = 14;
PHP.Constants.IMAGETYPE_WBMP = 15;
PHP.Constants.IMAGETYPE_JPEG2000 = 9;
PHP.Constants.IMAGETYPE_XBM = 16;
PHP.Constants.IMAGETYPE_ICO = 17;
PHP.Constants.IMAGETYPE_UNKNOWN = 0;
PHP.Constants.IMAGETYPE_COUNT = 18;
PHP.Constants.DNS_A = 1;
PHP.Constants.DNS_NS = 2;
PHP.Constants.DNS_CNAME = 16;
PHP.Constants.DNS_SOA = 32;
PHP.Constants.DNS_PTR = 2048;
PHP.Constants.DNS_HINFO = 4096;
PHP.Constants.DNS_MX = 16384;
PHP.Constants.DNS_TXT = 32768;
PHP.Constants.DNS_SRV = 33554432;
PHP.Constants.DNS_NAPTR = 67108864;
PHP.Constants.DNS_AAAA = 134217728;
PHP.Constants.DNS_A6 = 16777216;
PHP.Constants.DNS_ANY = 268435456;
PHP.Constants.DNS_ALL = 251713587;

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 6.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.$empty = function( arg) {

    var len = arguments.length, i = -1, arg,
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;


    // http://www.php.net/manual/en/types.comparisons.php
        
    if ( arg instanceof PHP.VM.Variable ) {
        var tmp = arg[ COMPILER.VARIABLE_VALUE ];
        return new PHP.VM.Variable( ((arg[ VARIABLE.TYPE ] === VARIABLE.NULL || tmp === "" || tmp == 0 || tmp === false)) );
    } else {
        return new PHP.VM.Variable( arg );
    }
        


};

/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.gettype = function( arg ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;



    var tmp = arg[ COMPILER.VARIABLE_VALUE ], // trigger get
    type = "unknown type";
    
    switch ( arg[ VARIABLE.TYPE ]) {
        
        case VARIABLE.BOOL:
            type = "boolean";
            break;
        case VARIABLE.INT:
            type = "integer";
            break;
        case VARIABLE.FLOAT:
            type = "double";
            break;
        case VARIABLE.STRING:
            type =  "string";
            break;
        case VARIABLE.ARRAY:
            type = "array";
            break;
        case VARIABLE.OBJECT:
            type = "object";
            break;
        case VARIABLE.RESOURCE:
            type = "resource";
            break;
        case VARIABLE.NULL:
            type = "NULL";
            break;
                   
               
        
    }
        
    return new PHP.VM.Variable( type );


};

/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 4.7.2012
* @website http://hertzen.com
 */


PHP.Modules.prototype.is_callable = function( callback ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    if ( callback[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
        var Class = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 0 )[ COMPILER.VARIABLE_VALUE ],
        methodName = callback[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( this, COMPILER.ARRAY_GET, 1 )[ COMPILER.VARIABLE_VALUE ];

        return new PHP.VM.Variable( typeof Class[ PHP.VM.Class.METHOD + methodName.toLowerCase()] === "function" );

    } 
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 13.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.is_float = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    return new PHP.VM.Variable( variable[ VARIABLE.TYPE ] === VARIABLE.FLOAT );
    
 
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.is_null = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    return new PHP.VM.Variable( variable[ VARIABLE.TYPE ] === VARIABLE.NULL );
    
 
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 13.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.is_string = function( variable ) {
    
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    return new PHP.VM.Variable( variable[ VARIABLE.TYPE ] === VARIABLE.STRING );
    
 
    
};
PHP.Modules.prototype.$isset = function() {

    var len = arguments.length, i = -1, arg,
    VARIABLE = PHP.VM.Variable.prototype;

    while( ++i < len ) {
        arg = arguments[ i ];
        
        // http://www.php.net/manual/en/types.comparisons.php
        
        if ( arg instanceof PHP.VM.Variable ) {
            if ( arg[ VARIABLE.TYPE ] === VARIABLE.NULL ) {
                return new PHP.VM.Variable( false );
            }
        } else if ( arg === false) {
            return new PHP.VM.Variable( false );
        }


        
    }

    return new PHP.VM.Variable( true );

};


/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012
* @website http://hertzen.com
 */


PHP.Modules.prototype.print_r = function() {

    var str = "",
    indent = 0,
    COMPILER = PHP.Compiler.prototype,
    PRIVATE = PHP.VM.Class.PRIVATE,
    PROTECTED = PHP.VM.Class.PROTECTED,
    PROPERTY = PHP.VM.Class.PROPERTY,
    VAR = PHP.VM.Variable.prototype;

    if (this[ COMPILER.DISPLAY_HANDLER ] === true) {
        this[ COMPILER.ERROR ]( "print_r(): Cannot use output buffering in output buffering display handlers", PHP.Constants.E_ERROR, true );
    }

    var $dump = function( argument, indent ) {
        var str = "",
        value = argument[ COMPILER.VARIABLE_VALUE ],
        ARG_TYPE = argument[ VAR.TYPE ]; // trigger get for undefined

        if ( ARG_TYPE === VAR.ARRAY ) {
            str += "Array\n";
            str += $INDENT( indent ) + "(";
            var values = value[ PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            var keys = value[ PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];

            str += "\n";

            keys.forEach(function( key, index ){
                str += $INDENT( indent + 4 ) + "[";
                if ( key instanceof PHP.VM.Variable) {
                    str += key[ COMPILER.VARIABLE_VALUE ]; // constants
                } else {
                    str += key;
                }
                str += "] => ";

                str += $dump( values[ index ], indent + 8 ) + "\n";



            }, this);

            str += $INDENT( indent ) + ")\n";
        } else if( ARG_TYPE === VAR.OBJECT || argument instanceof PHP.VM.ClassPrototype) {
            var classObj;
            if (argument instanceof PHP.VM.Variable ){
                classObj = value;
            } else {
                classObj = argument;
            }
            str += classObj[ COMPILER.CLASS_NAME ] + " Object\n";
            str += $INDENT( indent ) + "(\n";


            var added = false,
            definedItems = [],
            tmp = "";

            // search whole prototype chain
            for ( var item in classObj ) {
                if (item.substring(0, PROPERTY.length) === PROPERTY) {


                    if ( classObj.hasOwnProperty( item )) {
                        definedItems.push( item );
                        str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length );
                        str += '] => ';
                        str += $dump( classObj[ item ], indent + 8 );
                        str += "\n";
                    }
                    //  props.push( item );

                    var parent = classObj;
                    // search for overwritten private members
                    do {

                        if ( parent.hasOwnProperty(item) ) {

                            if ((Object.getPrototypeOf( parent )[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PROPERTY.length ) ] & PRIVATE) === PRIVATE) {
                                str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length ) + ':' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +':private] => ';
                                str += $dump( parent[ item ], indent + 8 );
                                str += "\n";
                            } else if ((Object.getPrototypeOf( parent )[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PROPERTY.length ) ] & PROTECTED) === PROTECTED && definedItems.indexOf( item ) === -1) {
                                str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length ) + ':' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +':protected] => ';
                                str += $dump( parent[ item ], indent + 8 );
                                str += "\n";
                                definedItems.push( item );
                            } else if ( definedItems.indexOf( item ) === -1 ) {
                                str += $INDENT( indent + 4 ) + '[' + item.substring( PROPERTY.length ) + '] => ';
                                str += $dump( parent[ item ], indent + 8 );
                                str += "\n";
                                definedItems.push( item );
                            }
                        }
                        parent = Object.getPrototypeOf( parent );
                    } while( parent instanceof PHP.VM.ClassPrototype);




                }
            }
            str += tmp;




            str += $INDENT( indent ) + ")\n";

        } else if( ARG_TYPE === VAR.NULL ) {
            str += $INDENT( indent ) + "NULL";
        } else if( ARG_TYPE === VAR.STRING ) {


            str += value;
        } else if( ARG_TYPE === VAR.INT ) {


            str += value;

        }
        return str;
    },
    $INDENT = function( num ) {
        var str = "", i ;
        for (i = 0; i < num; i++) {
            str += " ";
        }
        return str;
    };

    PHP.Utils.$A( arguments ).forEach( function( argument ) {
        str += $dump( argument, 0 );
    }, this );

    this.echo( str );
};
/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 22.7.2012
 * @website http://hertzen.com
 */
PHP.Modules.prototype.serialize = function( valueObj ) {

    var COMPILER = PHP.Compiler.prototype,
    serialize = "serialize",
    __sleep = "__sleep",
    VARIABLE = PHP.VM.Variable.prototype;

    var item,
    str = "",
    func = function( item ) {
        var val  = item[ COMPILER.VARIABLE_VALUE ],
        str = "";

        switch( item[ VARIABLE.TYPE ] ) {

            case VARIABLE.NULL:
                str += "N;";
                break;

            case VARIABLE.STRING:

                str += val.length + ":{" + val + "}";


                break;
            default:

        }

        return str;

    }.bind( this ),
    value = valueObj[ COMPILER.VARIABLE_VALUE ];

    // serializable interface
    if( (value[ PHP.VM.Class.METHOD + serialize] ) !== undefined ) {
        item = value[ COMPILER.METHOD_CALL ]( this, serialize );

        if ( item[ VARIABLE.TYPE] !== VARIABLE.NULL && item[ VARIABLE.TYPE] !== VARIABLE.STRING  ) {
            this.ENV[ COMPILER.ERROR ](value[ COMPILER.CLASS_NAME ] + "::" + serialize + "() must return a string or NULL", PHP.Constants.E_ERROR, true );
            return new PHP.VM.Variable();
        }

    } else {

        item = value;

        if( (value[ PHP.VM.Class.METHOD + __sleep] ) !== undefined ) {
            item = value[ COMPILER.METHOD_CALL ]( this, __sleep );

            if ( item[ VARIABLE.TYPE] !== VARIABLE.ARRAY  ) {
                this.ENV[ COMPILER.ERROR ](value[ COMPILER.CLASS_NAME ] + "::" + serialize + "() must return a string or NULL", PHP.Constants.E_ERROR, true );
                return new PHP.VM.Variable();
            }

            item[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ].forEach( function( member ){

                if ( value[ PHP.VM.Class.PROPERTY + member[ COMPILER.VARIABLE_VALUE ]] === undefined ) {
                    this.ENV[ COMPILER.ERROR ](serialize + '(): "' + member[ COMPILER.VARIABLE_VALUE ] + '" returned as member variable from ' + __sleep + "() but does not exist", PHP.Constants.E_NOTICE, true );
                }


            }, this);

            str += "O:" + value[ COMPILER.CLASS_NAME ].length + ':"' + value[ COMPILER.CLASS_NAME ] + '":';



        }

    }

    if ( item instanceof PHP.VM.Variable ) {
        if( item[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
            var arr = item[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            str += arr.length + ":{";
            arr.forEach(function( arrItem ){

                if(( value[ PHP.VM.Class.PROPERTY_TYPE + arrItem[ COMPILER.VARIABLE_VALUE ]] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) {
                    str += "s:" + (2 + value[ COMPILER.CLASS_NAME ].length + arrItem[ COMPILER.VARIABLE_VALUE ].length) + ":";
                    str += '"\\0' + value[ COMPILER.CLASS_NAME ] + "\\0" + arrItem[ COMPILER.VARIABLE_VALUE ] +'";';
                } else if (( value[ PHP.VM.Class.PROPERTY_TYPE + arrItem[ COMPILER.VARIABLE_VALUE ]] & PHP.VM.Class.PROTECTED) === PHP.VM.Class.PROTECTED) {
                    str += "s:" + (3 + arrItem[ COMPILER.VARIABLE_VALUE ].length) + ":";
                    str += '"\\0*\\0'  + arrItem[ COMPILER.VARIABLE_VALUE ] +'";';
                } else {
                    str += "s:" + (arrItem[ COMPILER.VARIABLE_VALUE ].length) + ":";
                    str += '"'  + arrItem[ COMPILER.VARIABLE_VALUE ] +'";';
                }

                var tmp = value[ PHP.VM.Class.PROPERTY + arrItem[ COMPILER.VARIABLE_VALUE ]];

                if ( tmp !== undefined ) {
                    tmp = tmp[ COMPILER.VARIABLE_VALUE ];
                    str += "s:" + tmp.length + ':"' + tmp + '";';
                }else {
                    str += "N;";
                }


            });
            str += "}"
        } else if ( item[ VARIABLE.TYPE] !== VARIABLE.NULL ) {
            str += "C:" + value[ COMPILER.CLASS_NAME ].length + ':"' + value[ COMPILER.CLASS_NAME ] + '":' + func( item );
        } else {
            str += "N;"
        }

    }


    return new PHP.VM.Variable( str );



};



/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 22.7.2012 
* @website http://hertzen.com
 */
PHP.Modules.prototype.unserialize = function( valueObj ) {

    var COMPILER = PHP.Compiler.prototype,
    unserialize = "unserialize",
    VARIABLE = PHP.VM.Variable.prototype;


    var value =  valueObj[ COMPILER.VARIABLE_VALUE ],
    parts = value.split(":");
    
    
    var item, pos, len, val;
    /*
    switch( parts[ 0 ]) {
        case "C":
            
            item = new (this.$Class.Get( parts[ 2 ].substring(1, parts[ 2 ].length - 1 ) ))( true );
            pos = 6 + parts[ 1 ].length + (parts[ 1 ]-0);
            
            break;
        case "N;":
            item = null;
            pos = 2;
            break;
    }
    */

    
    //value = value.substring( pos );
    
    // todo add proper unserialization
    while( value.length > 0 ) {
        var pos = value.indexOf(":");
        if (pos !== -1) {
            if ( item === undefined ) {
                len = value.substring( 0, pos );
                switch( len ) {
                    
                    case "O":
                        var className = parts[ 2 ].substring(1, parts[ 2 ].length - 1),
                        tmp = this.$Class.__autoload( className );
                        item = new (this.$Class.Get( "__PHP_Incomplete_Class" ))( this, className );
                        value = value.substring( 100 ); // tmp fix
                        break;
                    
                    case "C":
            
                        item = new (this.$Class.Get( parts[ 2 ].substring(1, parts[ 2 ].length - 1 ) ))( true );
                        pos = 6 + parts[ 1 ].length + (parts[ 1 ]-0);
                        value = value.substring( pos );
                        continue;
                        
                        break;
                    case "N;":
                        item = null;
                        pos = 2;
                        value = value.substring( pos );
                        continue;
                        break;
                        
                }
            } else {
                len = value.substring( 0, pos );
            }
        } else {
            break;
        }
        value = value.substring( len.length + 1 );
        val = value.substr( 1, len  );
        value = value.substring( val.length + 2);
     
        
        
    }
    


    if(  item !== null && item !== undefined && (item[ PHP.VM.Class.METHOD + unserialize] ) !== undefined ) {
        item[ COMPILER.METHOD_CALL ]( this, unserialize, new PHP.VM.Variable( val ) );
            
    }
    


    return new PHP.VM.Variable( item );
        


};



/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 1.7.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.unset = function() {
    
    PHP.Utils.$A( arguments ).forEach(function( arg ){
        if ( arg  !== undefined ) {
            arg[ PHP.Compiler.prototype.UNSET ]();
        }
    }, this );  
    
};
PHP.Modules.prototype.var_dump = function() {

    var str = "",
    indent = 0,
    COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;

    var $dump = function( argument, indent ) {

        var str = "",
        value = argument[ COMPILER.VARIABLE_VALUE ],
        ARG_TYPE = argument[ VAR.TYPE ]; // trigger get for undefined
        str += $INDENT( indent );

        if( ARG_TYPE === VAR.NULL || (argument[ VAR.DEFINED ] !== true && !(argument instanceof PHP.VM.ClassPrototype)) ) {

            str += "NULL\n";
        } else if ( ARG_TYPE === VAR.ARRAY ) {
            str += "array(";

            var values = value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            var keys = value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];

            str += values.length;

            str += ") {\n";

            keys.forEach(function( key, index ){

                if (key instanceof PHP.VM.Variable) {
                    key = key[ COMPILER.VARIABLE_VALUE ];
                }

                str += $INDENT( indent + 2 ) + "[";
                if ( typeof key === "string" ) {
                    str += '"' + key + '"';
                } else {
                    str += key;
                }
                str += "]=>\n";
                str += $dump( values[ index ], indent + 2 );

            }, this);

            str += $INDENT( indent ) + "}\n";
        } else if( ARG_TYPE === VAR.BOOL ) {
            str += "bool(" + value + ")\n";
        } else if( ARG_TYPE === VAR.STRING ) {

            str += "string(" + value.length + ') "' + value + '"\n';
        } else if( ARG_TYPE === VAR.INT ) {
            str += "int(" + value + ')\n';
        } else if( argument instanceof PHP.VM.ClassPrototype || ARG_TYPE === VAR.OBJECT ) {
            // todo, complete
            if( ARG_TYPE === VAR.OBJECT ) {
                argument = value;
            }

            str += "object(" + argument[ COMPILER.CLASS_NAME ] + ')#1 ';



            // search whole prototype chain

            var tmp = "",
            count = 0;

            for ( var item in argument ) {
                var ignore = false,
                parent;
                if (item.substring(0, PHP.VM.Class.PROPERTY.length) === PHP.VM.Class.PROPERTY) {

                    if (!((argument[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PHP.VM.Class.PROPERTY.length ) ] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) && !((argument[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PHP.VM.Class.PROPERTY.length ) ] & PHP.VM.Class.PROTECTED) === PHP.VM.Class.PROTECTED)) {

                        tmp += $INDENT( indent + 2 ) + '["' + item.substring( PHP.VM.Class.PROPERTY.length );
                        tmp += '"]=>\n';
                        tmp += $dump( argument[ item ], indent + 2 );
                        count++;
                    } else {
                        ignore = true;
                    }

                }

                parent = argument;
                // search for overwritten private members
                do {
                    if ( ( argument[ item ] !== parent[ item ] || ignore ) && parent[ item ] instanceof PHP.VM.Variable && parent.hasOwnProperty( item )) {


                        tmp += $INDENT( indent + 2 ) + '["' + item.substring( PHP.VM.Class.PROPERTY.length ) + '":';
                        if ((argument[ PHP.VM.Class.PROPERTY_TYPE + item.substring( PHP.VM.Class.PROPERTY.length ) ] & PHP.VM.Class.PRIVATE) === PHP.VM.Class.PRIVATE) {
                            tmp +=  '"' + Object.getPrototypeOf(parent)[ COMPILER.CLASS_NAME ] +'":' + "private";
                        } else {
                            tmp +=  "protected";
                        }

                        tmp += ']=>\n';
                        tmp += $dump( parent[ item ], indent + 2 );
                        count++;
                    }
                    parent = Object.getPrototypeOf( parent );
                } while( parent instanceof PHP.VM.ClassPrototype);

            }


            str += '(' + count + ') {\n' + tmp;





            str += $INDENT( indent ) + '}\n';
        } else if( ARG_TYPE === VAR.FLOAT ) {
            str += "float(" + value + ')\n';
        }

        return str;
    }.bind(this),
    $INDENT = function( num ) {
        var str = "", i ;
        for (i = 0; i < num; i++) {
            str += " ";
        }
        return str;
    };

    PHP.Utils.$A( arguments ).forEach( function( argument ) {
        str += $dump( argument, 0 );
    }, this );

    this.echo( str );

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 15.7.2012 
* @website http://hertzen.com
 */




PHP.Modules.prototype.var_export = function( variable, ret ) {
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    
    var val = "";
   
    switch (variable[ VARIABLE.TYPE ] ) {
        case VARIABLE.STRING:
            val += "'" + variable[ COMPILER.VARIABLE_VALUE ] + "'";
            break;
    }
    
    val = new PHP.VM.Variable( val );

    if ( ret === undefined || ret[ COMPILER.VARIABLE_VALUE ] === false) { 
        this.echo( val );
    } else {
        return val;
    }
    
    return new PHP.VM.Variable();

};
PHP.Lexer = function( src, ini ) {


    var heredoc,
    lineBreaker = function( result ) {
        if (result.match(/\n/) !== null) {
            var quote = result.substring(0, 1);
            result = '[' + result.split(/\n/).join( quote + "," + quote ) + '].join("\\n")';

        }

        return result;
    },
    prev,

    openTag = (ini === undefined || (/^(on|true|1)$/i.test(ini.short_open_tag) ) ? /(\<\?php\s|\<\?|\<\%|\<script language\=('|")?php('|")?\>)/i : /(\<\?php\s|<\?=|\<script language\=('|")?php('|")?\>)/i),
        openTagStart = (ini === undefined || (/^(on|true|1)$/i.test(ini.short_open_tag)) ? /^(\<\?php\s|\<\?|\<\%|\<script language\=('|")?php('|")?\>)/i : /^(\<\?php\s|<\?=|\<script language\=('|")?php('|")?\>)/i),
            tokens = [
            {
                value: PHP.Constants.T_ABSTRACT,
                re: /^abstract(?=\s)/i
            },
            {
                value: PHP.Constants.T_IMPLEMENTS,
                re: /^implements(?=\s)/i
            },
            {
                value: PHP.Constants.T_INTERFACE,
                re: /^interface(?=\s)/i
            },
            {
                value: PHP.Constants.T_CONST,
                re: /^const(?=\s)/i
            },
            {
                value: PHP.Constants.T_STATIC,
                re: /^static(?=\s)/i
            },
            {
                value: PHP.Constants.T_FINAL,
                re: /^final(?=\s)/i
            },
            {
                value: PHP.Constants.T_VAR,
                re: /^var(?=\s)/i
            },
            {
                value: PHP.Constants.T_GLOBAL,
                re: /^global(?=\s)/i
            },
            {
                value: PHP.Constants.T_CLONE,
                re: /^clone(?=\s)/i
            },
            {
                value: PHP.Constants.T_THROW,
                re: /^throw(?=\s)/i
            },
            {
                value: PHP.Constants.T_EXTENDS,
                re: /^extends(?=\s)/i
            },
            {
                value: PHP.Constants.T_AND_EQUAL,
                re: /^&=/
            },
            {
                value: PHP.Constants.T_AS,
                re: /^as(?=\s)/i
            },
            {
                value: PHP.Constants.T_ARRAY_CAST,
                re: /^\(array\)/i
            },
            {
                value: PHP.Constants.T_BOOL_CAST,
                re: /^\((bool|boolean)\)/i
            },
            {
                value: PHP.Constants.T_DOUBLE_CAST,
                re: /^\((real|float|double)\)/i
            },
            {
                value: PHP.Constants.T_INT_CAST,
                re: /^\((int|integer)\)/i
            },
            {
                value: PHP.Constants.T_OBJECT_CAST,
                re: /^\(object\)/i
            },
            {
                value: PHP.Constants.T_STRING_CAST,
                re: /^\(string\)/i
            },
            {
                value: PHP.Constants.T_UNSET_CAST,
                re: /^\(unset\)/i
            },
            {
                value: PHP.Constants.T_TRY,
                re: /^try(?=\s*{)/i
            },
            {
                value: PHP.Constants.T_CATCH,
                re: /^catch(?=\s*\()/i
            },
            {
                value: PHP.Constants.T_INSTANCEOF,
                re: /^instanceof(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_OR,
                re: /^or(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_AND,
                re: /^and(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_XOR,
                re: /^xor(?=\s)/i
            },
            {
                value: PHP.Constants.T_BOOLEAN_AND,
                re: /^&&/
            },
            {
                value: PHP.Constants.T_BOOLEAN_OR,
                re: /^\|\|/
            },
            {
                value: PHP.Constants.T_CONTINUE,
                re: /^continue(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_BREAK,
                re: /^break(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDDECLARE,
                re: /^enddeclare(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDFOR,
                re: /^endfor(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDFOREACH,
                re: /^endforeach(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDIF,
                re: /^endif(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDSWITCH,
                re: /^endswitch(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDWHILE,
                re: /^endwhile(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_CASE,
                re: /^case(?=\s)/i
            },
            {
                value: PHP.Constants.T_DEFAULT,
                re: /^default(?=\s|:)/i
            },
            {
                value: PHP.Constants.T_SWITCH,
                re: /^switch(?=[ (])/i
            },
            {
                value: PHP.Constants.T_EXIT,
                re: /^(exit|die)(?=[ \(;])/i
            },
            {
                value: PHP.Constants.T_CLOSE_TAG,
                re: /^(\?\>|\%\>|\<\/script\>)\s?\s?/i,
                func: function( result ) {
                    insidePHP = false;
                    return result;
                }
            },
            {
                value: PHP.Constants.T_DOUBLE_ARROW,
                re: /^\=\>/
            },
            {
                value: PHP.Constants.T_DOUBLE_COLON,
                re: /^\:\:/
            },
            {
                value: PHP.Constants.T_METHOD_C,
                re: /^__METHOD__/
            },
            {
                value: PHP.Constants.T_LINE,
                re: /^__LINE__/
            },
            {
                value: PHP.Constants.T_FILE,
                re: /^__FILE__/
            },
            {
                value: PHP.Constants.T_FUNC_C,
                re: /^__FUNCTION__/
            },
            {
                value: PHP.Constants.T_NS_C,
                re: /^__NAMESPACE__/
            },
            {
                value: PHP.Constants.T_TRAIT_C,
                re: /^__TRAIT__/
            },
            {
                value: PHP.Constants.T_DIR,
                re: /^__DIR__/
            },
            {
                value: PHP.Constants.T_CLASS_C,
                re: /^__CLASS__/
            },
            {
                value: PHP.Constants.T_INC,
                re: /^\+\+/
            },
            {
                value: PHP.Constants.T_DEC,
                re: /^\-\-/
            },
            {
                value: PHP.Constants.T_CONCAT_EQUAL,
                re: /^\.\=/
            },
            {
                value: PHP.Constants.T_DIV_EQUAL,
                re: /^\/\=/
            },
            {
                value: PHP.Constants.T_XOR_EQUAL,
                re: /^\^\=/
            },
            {
                value: PHP.Constants.T_MUL_EQUAL,
                re: /^\*\=/
            },
            {
                value: PHP.Constants.T_MOD_EQUAL,
                re: /^\%\=/
            },
            {
                value: PHP.Constants.T_SL_EQUAL,
                re: /^<<=/
            },
            {
                value: PHP.Constants.T_START_HEREDOC,
                re: /^<<<[A-Z_0-9]+\s/i,
                func: function( result ){
                    heredoc = result.substring(3, result.length - 1);
                    return result;
                }
            },
            {
                value: PHP.Constants.T_SL,
                re: /^<</
            },
            {
                value: PHP.Constants.T_IS_SMALLER_OR_EQUAL,
                re: /^<=/
            },
            {
                value: PHP.Constants.T_SR_EQUAL,
                re: /^>>=/
            },
            {
                value: PHP.Constants.T_SR,
                re: /^>>/
            },
            {
                value: PHP.Constants.T_IS_GREATER_OR_EQUAL,
                re: /^>=/
            },
            {
                value: PHP.Constants.T_OR_EQUAL,
                re: /^\|\=/
            },
            {
                value: PHP.Constants.T_PLUS_EQUAL,
                re: /^\+\=/
            },
            {
                value: PHP.Constants.T_MINUS_EQUAL,
                re: /^-\=/
            },
            {
                value: PHP.Constants.T_OBJECT_OPERATOR,
                re: /^\-\>/i
            },
            {
                value: PHP.Constants.T_CLASS,
                re: /^class(?=[\s\{])/i,
                afterWhitespace: true
            },
            {
                value: PHP.Constants.T_PUBLIC,
                re: /^public(?=[\s])/i
            },
            {
                value: PHP.Constants.T_PRIVATE,
                re: /^private(?=[\s])/i
            },
            {
                value: PHP.Constants.T_PROTECTED,
                re: /^protected(?=[\s])/i
            },
            {
                value: PHP.Constants.T_ARRAY,
                re: /^array(?=\s*?\()/i
            },
            {
                value: PHP.Constants.T_EMPTY,
                re: /^empty(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_UNSET,
                re: /^unset(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_RETURN,
                re: /^return(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_FUNCTION,
                re: /^function(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_ECHO,
                re: /^echo(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_LIST,
                re: /^list(?=\s*?\()/i
            },
            {
                value: PHP.Constants.T_PRINT,
                re: /^print(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_INCLUDE,
                re: /^include(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_INCLUDE_ONCE,
                re: /^include_once(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_REQUIRE,
                re: /^require(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_REQUIRE_ONCE,
                re: /^require_once(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_NEW,
                re: /^new(?=[ ])/i
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\*([\S\s]*?)(?:\*\/|$)/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\/.*(\s)?/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\#.*(\s)?/
            },
            {
                value: PHP.Constants.T_ELSEIF,
                re: /^elseif(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_GOTO,
                re: /^goto(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_ELSE,
                re: /^else(?=[\s{:])/i
            },
            {
                value: PHP.Constants.T_IF,
                re: /^if(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_DO,
                re: /^do(?=[ {])/i
            },
            {
                value: PHP.Constants.T_WHILE,
                re: /^while(?=[ (])/i
            },
            {
                value: PHP.Constants.T_FOREACH,
                re: /^foreach(?=[ (])/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset(?=[ (])/i
            },
            {
                value: PHP.Constants.T_IS_IDENTICAL,
                re: /^===/
            },
            {
                value: PHP.Constants.T_IS_EQUAL,
                re: /^==/
            },
            {
                value: PHP.Constants.T_IS_NOT_IDENTICAL,
                re: /^\!==/
            },
            {
                value: PHP.Constants.T_IS_NOT_EQUAL,
                re: /^(\!=|\<\>)/
            },
            {
                value: PHP.Constants.T_FOR,
                re: /^for(?=[ (])/i
            },

            {
                value: PHP.Constants.T_DNUMBER,
                re: /^[0-9]*\.[0-9]+([eE][-]?[0-9]*)?/
            /*,
        func: function( result ) {

            // transform e to E - token_get_all_variation1.phpt
            return (result - 0).toString().toUpperCase();
        }*/

            },
            {
                value: PHP.Constants.T_LNUMBER,
                re: /^(0x[0-9A-F]+|[0-9]+)/i
            },
            {
                value: PHP.Constants.T_OPEN_TAG_WITH_ECHO,
                re: /^(\<\?=|\<\%=)/i
            },
            {
                value: PHP.Constants.T_OPEN_TAG,
                re: openTagStart
            },
            {
                value: PHP.Constants.T_VARIABLE,
                re: /^\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            },
            {
                value: PHP.Constants.T_WHITESPACE,
                re: /^\s+/
            },
            {
                value: PHP.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: /^("(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*')/,
                func: function( result, token ) {

                    var curlyOpen = 0,
                    len,
                    bracketOpen = 0;

                    if (result.substring( 0,1 ) === "'") {
                        return result;
                    }

                    var match = result.match( /(?:[^\\]|\\.)*[^\\]\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/g );
                    if ( match !== null ) {
                        // string has a variable

                        while( result.length > 0 ) {
                            len = result.length;
                            match = result.match( /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\@\^\%\"\'\{\}]/ );

                            if ( match !== null ) {

                                results.push( match[ 0 ] );
                                result = result.substring( 1 );

                                if ( curlyOpen > 0 && match[ 0 ] === "}") {
                                    curlyOpen--;
                                }

                                if ( match[ 0 ] === "[" ) {
                                    bracketOpen++;
                                }

                                if ( match[ 0 ] === "]" ) {
                                    bracketOpen--;
                                }

                            }

                            match = result.match(/^\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/);



                            if ( match !== null ) {

                                results.push([
                                    parseInt(PHP.Constants.T_VARIABLE, 10),
                                    match[ 0 ],
                                    line
                                    ]);

                                result = result.substring( match[ 0 ].length );

                                match = result.match(/^(\-\>)([a-zA-Z0-9_\x7f-\xff]*)/);

                                if ( match !== null ) {

                                    results.push([
                                        parseInt(PHP.Constants.T_OBJECT_OPERATOR, 10),
                                        match[ 1 ],
                                        line
                                        ]);
                                    results.push([
                                        parseInt(PHP.Constants.T_STRING, 10),
                                        match[ 2 ],
                                        line
                                        ]);
                                    result = result.substring( match[ 0 ].length );
                                }


                                if ( result.match( /^\[/g ) !== null ) {
                                    continue;
                                }
                            }

                            var re;
                            if ( curlyOpen > 0) {
                                re = /^([^\\\$"{}\]]|\\.)+/g;
                            } else {
                                re = /^([^\\\$"{]|\\.|{[^\$])+/g;
                            }

                            while(( match = result.match( re )) !== null ) {


                                if (result.length === 1) {
                                    throw new Error(match);
                                }



                                results.push([
                                    parseInt(( curlyOpen > 0 ) ? PHP.Constants.T_CONSTANT_ENCAPSED_STRING : PHP.Constants.T_ENCAPSED_AND_WHITESPACE, 10),
                                    match[ 0 ].replace(/\n/g,"\\n").replace(/\r/g,""),
                                    line
                                    ]);

                                line += match[ 0 ].split('\n').length - 1;

                                result = result.substring( match[ 0 ].length );

                            }

                            if( result.match(/^{\$/) !== null ) {

                                results.push([
                                    parseInt(PHP.Constants.T_CURLY_OPEN, 10),
                                    "{",
                                    line
                                    ]);
                                result = result.substring( 1 );
                                curlyOpen++;
                            }

                            if (len === result.length) {
                                //  nothing has been found yet
                                if ((match =  result.match( /^(([^\\]|\\.)*?[^\\]\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g )) !== null) {
                                    return;
                                }
                            }

                        }

                        return undefined;

                    } else {
                        result = result.replace(/\n/g,"\\n").replace(/\r/g,"");
                    }

                    /*
            if (result.match(/\r\n/) !== null) {
                var quote = result.substring(0, 1);

                result = '[' + result.split(/\r\n/).join( quote + "," + quote ) + '].join("\\n")';

            }
             */
                    return result;
                }
            },
            {
                value: PHP.Constants.T_STRING,
                re: /^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            },
            {
                value: -1,
                re: /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\{\}\@\^\%\"\'\$\~]/
            }];





            var results = [],
            line = 1,
            insidePHP = false,
            cancel = true;

            if ( src === null ) {
                return results;
            }

            if ( typeof src !== "string" ) {
                src = src.toString();
            }



            while (src.length > 0 && cancel === true) {

                if ( insidePHP === true ) {

                    if ( heredoc !== undefined ) {
                        // we are in a heredoc

                        var regexp = new RegExp('([\\S\\s]*)(\\r\\n|\\n|\\r)(' + heredoc + ')(;|\\r\\n|\\n)',"i");



                        var result = src.match( regexp );
                        if ( result !== null ) {
                            // contents

                            results.push([
                                parseInt(PHP.Constants.T_ENCAPSED_AND_WHITESPACE, 10),
                                result[ 1 ].replace(/^\n/g,"").replace(/\\\$/g,"$") + "\n",
                                line
                                ]);


                            // note the no - 1 for length as regexp include one line as well
                            line += result[ 1 ].split('\n').length;

                            // heredoc end tag
                            results.push([
                                parseInt(PHP.Constants.T_END_HEREDOC, 10),
                                result[ 3 ],
                                line
                                ]);

                            src = src.substring( result[1].length + result[2].length + result[3].length );
                            heredoc = undefined;
                        }

                        if (result === null) {
                            throw Error("sup");
                        }


                    } else {
                        cancel =  tokens.some(function( token ){
                            if ( token.afterWhitespace === true ) {
                                // check last
                                var last = results[ results.length - 1 ];
                                if ( !Array.isArray( last ) || (last[ 0 ] !== PHP.Constants.T_WHITESPACE && last[ 0 ] !== PHP.Constants.T_OPEN_TAG  && last[ 0 ] !== PHP.Constants.T_COMMENT)) {
                                    return false;
                                }
                            }
                            var result = src.match( token.re );

                            if ( result !== null ) {
                                if ( token.value !== -1) {
                                    var resultString = result[ 0 ];



                                    if (token.func !== undefined ) {
                                        resultString = token.func( resultString, token );
                                    }
                                    if (resultString !== undefined ) {

                                        results.push([
                                            parseInt(token.value, 10),
                                            resultString,
                                            line
                                            ]);
                                        line += resultString.split('\n').length - 1;
                                    }

                                } else {
                                    // character token
                                    results.push( result[ 0 ] );
                                }

                                src = src.substring(result[ 0 ].length);

                                return true;
                            }
                            return false;


                        });
                    }

                } else {

                    var result = openTag.exec( src );


                    if ( result !== null ) {
                        if ( result.index > 0 ) {
                            var resultString = src.substring(0, result.index);
                            results.push ([
                                parseInt(PHP.Constants.T_INLINE_HTML, 10),
                                resultString,
                                line
                                ]);

                            line += resultString.split('\n').length - 1;

                            src = src.substring( result.index );
                        }

                        insidePHP = true;
                    } else {

                        results.push ([
                            parseInt(PHP.Constants.T_INLINE_HTML, 10),
                            src.replace(/^\n/, ""),
                            line
                            ]);
                        return results;
                    }

                //    src = src.substring(result[ 0 ].length);

                }



            }



            return results;



        };


/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 15.6.2012
 * @website http://hertzen.com
 */

/*
 * The skeleton for this parser was written by Moriyoshi Koizumi and is based on
 * the work by Masato Bito and is in the PUBLIC DOMAIN.
 * Ported to JavaScript by Niklas von Hertzen
 */


PHP.Parser = function ( preprocessedTokens, eval ) {

    var yybase = this.yybase,
    yydefault = this.yydefault,
    yycheck = this.yycheck,
    yyaction = this.yyaction,
    yylen = this.yylen,
    yygbase = this.yygbase,
    yygcheck = this.yygcheck,
    yyp = this.yyp,
    yygoto = this.yygoto,
    yylhs = this.yylhs,
    terminals = this.terminals,
    translate = this.translate,
    yygdefault = this.yygdefault;


    this.pos = -1;
    this.line = 1;

    this.tokenMap = this.createTokenMap( );

    this.dropTokens = {};
    this.dropTokens[ PHP.Constants.T_WHITESPACE ] = 1;
    this.dropTokens[ PHP.Constants.T_OPEN_TAG ] = 1;
    var tokens = [];

    // pre-process
    preprocessedTokens.forEach( function( token, index ) {
        if ( typeof token === "object" && token[ 0 ] === PHP.Constants.T_OPEN_TAG_WITH_ECHO) {
            tokens.push([
                PHP.Constants.T_OPEN_TAG,
                token[ 1 ],
                token[ 2 ]
                ]);
            tokens.push([
                PHP.Constants.T_ECHO,
                token[ 1 ],
                token[ 2 ]
                ]);
        } else {
            tokens.push( token );
        }
    });
    this.tokens = tokens;

    // We start off with no lookahead-token
    var tokenId = this.TOKEN_NONE;

    // The attributes for a node are taken from the first and last token of the node.
    // From the first token only the startAttributes are taken and from the last only
    // the endAttributes. Both are merged using the array union operator (+).
    this.startAttributes = {
        'startLine': 1
    };

    this.endAttributes = {};

    // In order to figure out the attributes for the starting token, we have to keep
    // them in a stack
    var attributeStack = [ this.startAttributes ];

    // Start off in the initial state and keep a stack of previous states
    var state = 0;
    var stateStack = [ state ];

    // AST stack
    this.yyastk = [];

    // Current position in the stack(s)
    this.stackPos  = 0;

    var yyn;

    var origTokenId;


    for (;;) {

        if ( yybase[ state ] === 0 ) {
            yyn = yydefault[ state ];
        } else {
            if (tokenId === this.TOKEN_NONE ) {
                // fetch the next token id from the lexer and fetch additional info by-ref
                origTokenId = this.getNextToken( );

                // map the lexer token id to the internally used token id's
                tokenId = (origTokenId >= 0 && origTokenId < this.TOKEN_MAP_SIZE) ? translate[ origTokenId ] : this.TOKEN_INVALID;

                attributeStack[ this.stackPos ] = this.startAttributes;
            }

            if (((yyn = yybase[ state ] + tokenId) >= 0
                && yyn < this.YYLAST && yycheck[ yyn ] === tokenId
                || (state < this.YY2TBLSTATE
                    && (yyn = yybase[state + this.YYNLSTATES] + tokenId) >= 0
                    && yyn < this.YYLAST
                    && yycheck[ yyn ] === tokenId))
            && (yyn = yyaction[ yyn ]) !== this.YYDEFAULT ) {
                /*
                 * >= YYNLSTATE: shift and reduce
                 * > 0: shift
                 * = 0: accept
                 * < 0: reduce
                 * = -YYUNEXPECTED: error
                 */
                if (yyn > 0) {
                    /* shift */
                    ++this.stackPos;

                    stateStack[ this.stackPos ] = state = yyn;
                    this.yyastk[ this.stackPos ] = this.tokenValue;
                    attributeStack[ this.stackPos ] = this.startAttributes;
                    tokenId = this.TOKEN_NONE;

                    if (yyn < this.YYNLSTATES)
                        continue;

                    /* $yyn >= YYNLSTATES means shift-and-reduce */
                    yyn -= this.YYNLSTATES;
                } else {
                    yyn = -yyn;
                }
            } else {
                yyn = yydefault[ state ];
            }
        }

        for (;;) {
            /* reduce/error */

            if ( yyn === 0 ) {
                /* accept */
                return this.yyval;
            } else if (yyn !== this.YYUNEXPECTED ) {
                /* reduce */
                try {
                    this['yyn' + yyn](PHP.Utils.Merge(attributeStack[this.stackPos - yylen[ yyn ] ], this.endAttributes));
                } catch (e) {
                    /*
                        if (-1 === $e->getRawLine()) {
                            $e->setRawLine($startAttributes['startLine']);
                        }
                     */
                    throw e;
                }

                /* Goto - shift nonterminal */
                this.stackPos -= yylen[ yyn ];
                yyn = yylhs[ yyn ];
                if ((yyp = yygbase[ yyn ] + stateStack[ this.stackPos ]) >= 0
                    && yyp < this.YYGLAST
                    && yygcheck[ yyp ] === yyn) {
                    state = yygoto[ yyp ];
                } else {
                    state = yygdefault[ yyn ];
                }

                ++this.stackPos;

                stateStack[ this.stackPos ] = state;
                this.yyastk[ this.stackPos ] = this.yyval;
                attributeStack[ this.stackPos ] = this.startAttributes;
            } else {
                /* error */
                if (eval !== true) {

                    var expected = [];

                    for (var i = 0; i < this.TOKEN_MAP_SIZE; ++i) {
                        if ((yyn = yybase[ state ] + i) >= 0 && yyn < this.YYLAST && yycheck[ yyn ] == i
                         || state < this.YY2TBLSTATE
                            && (yyn = yybase[ state + this.YYNLSTATES] + i)
                            && yyn < this.YYLAST && yycheck[ yyn ] == i
                        ) {
                            if (yyaction[ yyn ] != this.YYUNEXPECTED) {
                                if (expected.length == 4) {
                                    /* Too many expected tokens */
                                    expected = [];
                                    break;
                                }

                                expected.push( this.terminals[ i ] );
                            }
                        }
                    }

                    var expectedString = '';
                    if (expected.length) {
                        expectedString = ', expecting ' + expected.join(' or ');
                    }
                    throw new PHP.ParseError('syntax error, unexpected ' + terminals[ tokenId ] + expectedString, this.startAttributes['startLine']);
                } else {
                    return this.startAttributes['startLine'];
                }

            }

            if (state < this.YYNLSTATES)
                break;
            /* >= YYNLSTATES means shift-and-reduce */
            yyn = state - this.YYNLSTATES;
        }
    }
};

PHP.ParseError = function( msg, line ) {
    this.message = msg;
    this.line = line;
};

PHP.Parser.prototype.MODIFIER_PUBLIC    =  1;
PHP.Parser.prototype.MODIFIER_PROTECTED =  2;
PHP.Parser.prototype.MODIFIER_PRIVATE   =  4;
PHP.Parser.prototype.MODIFIER_STATIC    =  8;
PHP.Parser.prototype.MODIFIER_ABSTRACT  = 16;
PHP.Parser.prototype.MODIFIER_FINAL     = 32;

PHP.Parser.prototype.getNextToken = function( ) {

    this.startAttributes = {};
    this.endAttributes = {};

    var token,
    tmp;

    while (this.tokens[++this.pos] !== undefined) {
        token = this.tokens[this.pos];

        if (typeof token === "string") {
            this.startAttributes['startLine'] = this.line;
            this.endAttributes['endLine'] = this.line;

            // bug in token_get_all
            if ('b"' === token) {
                this.tokenValue = 'b"';
                return '"'.charCodeAt(0);
            } else {
                this.tokenValue = token;
                return token.charCodeAt(0);
            }
        } else {



            this.line += ((tmp = token[ 1 ].match(/\n/g)) === null) ? 0 : tmp.length;

            if (PHP.Constants.T_COMMENT === token[0]) {

                if (!Array.isArray(this.startAttributes['comments'])) {
                    this.startAttributes['comments'] = [];
                }

                this.startAttributes['comments'].push( {
                    type: "comment",
                    comment: token[1],
                    line: token[2]
                });

            } else if (PHP.Constants.T_DOC_COMMENT === token[0]) {
                this.startAttributes['comments'].push( new PHPParser_Comment_Doc(token[1], token[2]) );
            } else if (this.dropTokens[token[0]] === undefined) {
                this.tokenValue = token[1];
                this.startAttributes['startLine'] = token[2];
                this.endAttributes['endLine'] = this.line;

                return this.tokenMap[token[0]];
            }
        }
    }

    this.startAttributes['startLine'] = this.line;

    // 0 is the EOF token
    return 0;
};


/**
 * Creates the token map.
 *
 * The token map maps the PHP internal token identifiers
 * to the identifiers used by the PHP.Parser. Additionally it
 * maps T_OPEN_TAG_WITH_ECHO to T_ECHO and T_CLOSE_TAG to ';'.
 *
 * @return array The token map
 */

PHP.Parser.prototype.createTokenMap = function() {
    var tokenMap = {},
    name,
    i;
    var T_DOUBLE_COLON = PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM;
    // 256 is the minimum possible token number, as everything below
    // it is an ASCII value
    for ( i = 256; i < 1000; ++i ) {
        // T_DOUBLE_COLON is equivalent to T_PAAMAYIM_NEKUDOTAYIM
        if ( T_DOUBLE_COLON === i ) {
            tokenMap[ i ] = this.T_PAAMAYIM_NEKUDOTAYIM;
        // T_OPEN_TAG_WITH_ECHO with dropped T_OPEN_TAG results in T_ECHO
        } else if( PHP.Constants.T_OPEN_TAG_WITH_ECHO === i ) {
            tokenMap[ i ] = PHP.Constants.T_ECHO;
        // T_CLOSE_TAG is equivalent to ';'
        } else if( PHP.Constants.T_CLOSE_TAG === i ) {
            tokenMap[ i ] = 59;
        // and the others can be mapped directly
        } else if ( 'UNKNOWN' !== (name = PHP.Utils.TokenName( i ) ) ) {
            tokenMap[ i ] =  this[name];
        }
    }
    return tokenMap;
};

var yynStandard = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};
// todo fix

PHP.Parser.prototype.MakeArray = function( arr ) {
    return Array.isArray( arr ) ? arr : [ arr ];
}


PHP.Parser.prototype.parseString = function( str ) {
    var bLength = 0;
    if ('b' === str[0]) {
        bLength = 1;
    }

    if ('\'' === str[ bLength ]) {
        str = str.replace(
            ['\\\\', '\\\''],
            [  '\\',   '\'']);
    } else {

        str = this.parseEscapeSequences( str, '"');

    }

    return str;

};

PHP.Parser.prototype.parseEscapeSequences = function( str, quote ) {



    if (undefined !== quote) {
        str = str.replace(new RegExp('\\' + quote, "g"), quote);
    }

    var replacements = {
        '\\': '\\',
        '$':  '$',
        'n': "\n",
        'r': "\r",
        't': "\t",
        'f': "\f",
        'v': "\v",
        'e': "\x1B"
    };

    return str.replace(
        /~\\\\([\\\\$nrtfve]|[xX][0-9a-fA-F]{1,2}|[0-7]{1,3})~/g,
        function ( matches ){
            var str = matches[1];

            if ( replacements[ str ] !== undefined ) {
                return replacements[ str ];
            } else if ('x' === str[ 0 ] || 'X' === str[ 0 ]) {
                return chr(hexdec(str));
            } else {
                return chr(octdec(str));
            }
        }
        );

    return str;
};


/* This is an automatically GENERATED file, which should not be manually edited.
 * Instead edit one of the following:
 *  * the grammar file grammar/zend_language_parser.jsy
 *  * the parser skeleton grammar/kymacc.js.parser
 *  * the preprocessing script grammar/rebuildParser.php
 *
 * The skeleton for this parser was written by Moriyoshi Koizumi and is based on
 * the work by Masato Bito and is in the PUBLIC DOMAIN.
 * Ported to JavaScript by Niklas von Hertzen
 */

PHP.Parser.prototype.TOKEN_NONE    = -1;
PHP.Parser.prototype.TOKEN_INVALID = 149;

PHP.Parser.prototype.TOKEN_MAP_SIZE = 384;

PHP.Parser.prototype.YYLAST       = 913;
PHP.Parser.prototype.YY2TBLSTATE  = 328;
PHP.Parser.prototype.YYGLAST      = 415;
PHP.Parser.prototype.YYNLSTATES   = 544;
PHP.Parser.prototype.YYUNEXPECTED = 32767;
PHP.Parser.prototype.YYDEFAULT    = -32766;

// {{{ Tokens
PHP.Parser.prototype.YYERRTOK = 256;
PHP.Parser.prototype.T_INCLUDE = 257;
PHP.Parser.prototype.T_INCLUDE_ONCE = 258;
PHP.Parser.prototype.T_EVAL = 259;
PHP.Parser.prototype.T_REQUIRE = 260;
PHP.Parser.prototype.T_REQUIRE_ONCE = 261;
PHP.Parser.prototype.T_LOGICAL_OR = 262;
PHP.Parser.prototype.T_LOGICAL_XOR = 263;
PHP.Parser.prototype.T_LOGICAL_AND = 264;
PHP.Parser.prototype.T_PRINT = 265;
PHP.Parser.prototype.T_PLUS_EQUAL = 266;
PHP.Parser.prototype.T_MINUS_EQUAL = 267;
PHP.Parser.prototype.T_MUL_EQUAL = 268;
PHP.Parser.prototype.T_DIV_EQUAL = 269;
PHP.Parser.prototype.T_CONCAT_EQUAL = 270;
PHP.Parser.prototype.T_MOD_EQUAL = 271;
PHP.Parser.prototype.T_AND_EQUAL = 272;
PHP.Parser.prototype.T_OR_EQUAL = 273;
PHP.Parser.prototype.T_XOR_EQUAL = 274;
PHP.Parser.prototype.T_SL_EQUAL = 275;
PHP.Parser.prototype.T_SR_EQUAL = 276;
PHP.Parser.prototype.T_BOOLEAN_OR = 277;
PHP.Parser.prototype.T_BOOLEAN_AND = 278;
PHP.Parser.prototype.T_IS_EQUAL = 279;
PHP.Parser.prototype.T_IS_NOT_EQUAL = 280;
PHP.Parser.prototype.T_IS_IDENTICAL = 281;
PHP.Parser.prototype.T_IS_NOT_IDENTICAL = 282;
PHP.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 283;
PHP.Parser.prototype.T_IS_GREATER_OR_EQUAL = 284;
PHP.Parser.prototype.T_SL = 285;
PHP.Parser.prototype.T_SR = 286;
PHP.Parser.prototype.T_INSTANCEOF = 287;
PHP.Parser.prototype.T_INC = 288;
PHP.Parser.prototype.T_DEC = 289;
PHP.Parser.prototype.T_INT_CAST = 290;
PHP.Parser.prototype.T_DOUBLE_CAST = 291;
PHP.Parser.prototype.T_STRING_CAST = 292;
PHP.Parser.prototype.T_ARRAY_CAST = 293;
PHP.Parser.prototype.T_OBJECT_CAST = 294;
PHP.Parser.prototype.T_BOOL_CAST = 295;
PHP.Parser.prototype.T_UNSET_CAST = 296;
PHP.Parser.prototype.T_NEW = 297;
PHP.Parser.prototype.T_CLONE = 298;
PHP.Parser.prototype.T_EXIT = 299;
PHP.Parser.prototype.T_IF = 300;
PHP.Parser.prototype.T_ELSEIF = 301;
PHP.Parser.prototype.T_ELSE = 302;
PHP.Parser.prototype.T_ENDIF = 303;
PHP.Parser.prototype.T_LNUMBER = 304;
PHP.Parser.prototype.T_DNUMBER = 305;
PHP.Parser.prototype.T_STRING = 306;
PHP.Parser.prototype.T_STRING_VARNAME = 307;
PHP.Parser.prototype.T_VARIABLE = 308;
PHP.Parser.prototype.T_NUM_STRING = 309;
PHP.Parser.prototype.T_INLINE_HTML = 310;
PHP.Parser.prototype.T_CHARACTER = 311;
PHP.Parser.prototype.T_BAD_CHARACTER = 312;
PHP.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 313;
PHP.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 314;
PHP.Parser.prototype.T_ECHO = 315;
PHP.Parser.prototype.T_DO = 316;
PHP.Parser.prototype.T_WHILE = 317;
PHP.Parser.prototype.T_ENDWHILE = 318;
PHP.Parser.prototype.T_FOR = 319;
PHP.Parser.prototype.T_ENDFOR = 320;
PHP.Parser.prototype.T_FOREACH = 321;
PHP.Parser.prototype.T_ENDFOREACH = 322;
PHP.Parser.prototype.T_DECLARE = 323;
PHP.Parser.prototype.T_ENDDECLARE = 324;
PHP.Parser.prototype.T_AS = 325;
PHP.Parser.prototype.T_SWITCH = 326;
PHP.Parser.prototype.T_ENDSWITCH = 327;
PHP.Parser.prototype.T_CASE = 328;
PHP.Parser.prototype.T_DEFAULT = 329;
PHP.Parser.prototype.T_BREAK = 330;
PHP.Parser.prototype.T_CONTINUE = 331;
PHP.Parser.prototype.T_GOTO = 332;
PHP.Parser.prototype.T_FUNCTION = 333;
PHP.Parser.prototype.T_CONST = 334;
PHP.Parser.prototype.T_RETURN = 335;
PHP.Parser.prototype.T_TRY = 336;
PHP.Parser.prototype.T_CATCH = 337;
PHP.Parser.prototype.T_THROW = 338;
PHP.Parser.prototype.T_USE = 339;
PHP.Parser.prototype.T_INSTEADOF = 340;
PHP.Parser.prototype.T_GLOBAL = 341;
PHP.Parser.prototype.T_STATIC = 342;
PHP.Parser.prototype.T_ABSTRACT = 343;
PHP.Parser.prototype.T_FINAL = 344;
PHP.Parser.prototype.T_PRIVATE = 345;
PHP.Parser.prototype.T_PROTECTED = 346;
PHP.Parser.prototype.T_PUBLIC = 347;
PHP.Parser.prototype.T_VAR = 348;
PHP.Parser.prototype.T_UNSET = 349;
PHP.Parser.prototype.T_ISSET = 350;
PHP.Parser.prototype.T_EMPTY = 351;
PHP.Parser.prototype.T_HALT_COMPILER = 352;
PHP.Parser.prototype.T_CLASS = 353;
PHP.Parser.prototype.T_TRAIT = 354;
PHP.Parser.prototype.T_INTERFACE = 355;
PHP.Parser.prototype.T_EXTENDS = 356;
PHP.Parser.prototype.T_IMPLEMENTS = 357;
PHP.Parser.prototype.T_OBJECT_OPERATOR = 358;
PHP.Parser.prototype.T_DOUBLE_ARROW = 359;
PHP.Parser.prototype.T_LIST = 360;
PHP.Parser.prototype.T_ARRAY = 361;
PHP.Parser.prototype.T_CALLABLE = 362;
PHP.Parser.prototype.T_CLASS_C = 363;
PHP.Parser.prototype.T_TRAIT_C = 364;
PHP.Parser.prototype.T_METHOD_C = 365;
PHP.Parser.prototype.T_FUNC_C = 366;
PHP.Parser.prototype.T_LINE = 367;
PHP.Parser.prototype.T_FILE = 368;
PHP.Parser.prototype.T_COMMENT = 369;
PHP.Parser.prototype.T_DOC_COMMENT = 370;
PHP.Parser.prototype.T_OPEN_TAG = 371;
PHP.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 372;
PHP.Parser.prototype.T_CLOSE_TAG = 373;
PHP.Parser.prototype.T_WHITESPACE = 374;
PHP.Parser.prototype.T_START_HEREDOC = 375;
PHP.Parser.prototype.T_END_HEREDOC = 376;
PHP.Parser.prototype.T_DOLLAR_OPEN_CURLY_BRACES = 377;
PHP.Parser.prototype.T_CURLY_OPEN = 378;
PHP.Parser.prototype.T_PAAMAYIM_NEKUDOTAYIM = 379;
PHP.Parser.prototype.T_NAMESPACE = 380;
PHP.Parser.prototype.T_NS_C = 381;
PHP.Parser.prototype.T_DIR = 382;
PHP.Parser.prototype.T_NS_SEPARATOR = 383;
// }}}

/* @var array Map of token ids to their respective names */
PHP.Parser.prototype.terminals = [
    "$EOF",
    "error",
    "T_INCLUDE",
    "T_INCLUDE_ONCE",
    "T_EVAL",
    "T_REQUIRE",
    "T_REQUIRE_ONCE",
    "','",
    "T_LOGICAL_OR",
    "T_LOGICAL_XOR",
    "T_LOGICAL_AND",
    "T_PRINT",
    "'='",
    "T_PLUS_EQUAL",
    "T_MINUS_EQUAL",
    "T_MUL_EQUAL",
    "T_DIV_EQUAL",
    "T_CONCAT_EQUAL",
    "T_MOD_EQUAL",
    "T_AND_EQUAL",
    "T_OR_EQUAL",
    "T_XOR_EQUAL",
    "T_SL_EQUAL",
    "T_SR_EQUAL",
    "'?'",
    "':'",
    "T_BOOLEAN_OR",
    "T_BOOLEAN_AND",
    "'|'",
    "'^'",
    "'&'",
    "T_IS_EQUAL",
    "T_IS_NOT_EQUAL",
    "T_IS_IDENTICAL",
    "T_IS_NOT_IDENTICAL",
    "'<'",
    "T_IS_SMALLER_OR_EQUAL",
    "'>'",
    "T_IS_GREATER_OR_EQUAL",
    "T_SL",
    "T_SR",
    "'+'",
    "'-'",
    "'.'",
    "'*'",
    "'/'",
    "'%'",
    "'!'",
    "T_INSTANCEOF",
    "'~'",
    "T_INC",
    "T_DEC",
    "T_INT_CAST",
    "T_DOUBLE_CAST",
    "T_STRING_CAST",
    "T_ARRAY_CAST",
    "T_OBJECT_CAST",
    "T_BOOL_CAST",
    "T_UNSET_CAST",
    "'@'",
    "'['",
    "T_NEW",
    "T_CLONE",
    "T_EXIT",
    "T_IF",
    "T_ELSEIF",
    "T_ELSE",
    "T_ENDIF",
    "T_LNUMBER",
    "T_DNUMBER",
    "T_STRING",
    "T_STRING_VARNAME",
    "T_VARIABLE",
    "T_NUM_STRING",
    "T_INLINE_HTML",
    "T_ENCAPSED_AND_WHITESPACE",
    "T_CONSTANT_ENCAPSED_STRING",
    "T_ECHO",
    "T_DO",
    "T_WHILE",
    "T_ENDWHILE",
    "T_FOR",
    "T_ENDFOR",
    "T_FOREACH",
    "T_ENDFOREACH",
    "T_DECLARE",
    "T_ENDDECLARE",
    "T_AS",
    "T_SWITCH",
    "T_ENDSWITCH",
    "T_CASE",
    "T_DEFAULT",
    "T_BREAK",
    "T_CONTINUE",
    "T_GOTO",
    "T_FUNCTION",
    "T_CONST",
    "T_RETURN",
    "T_TRY",
    "T_CATCH",
    "T_THROW",
    "T_USE",
    "T_INSTEADOF",
    "T_GLOBAL",
    "T_STATIC",
    "T_ABSTRACT",
    "T_FINAL",
    "T_PRIVATE",
    "T_PROTECTED",
    "T_PUBLIC",
    "T_VAR",
    "T_UNSET",
    "T_ISSET",
    "T_EMPTY",
    "T_HALT_COMPILER",
    "T_CLASS",
    "T_TRAIT",
    "T_INTERFACE",
    "T_EXTENDS",
    "T_IMPLEMENTS",
    "T_OBJECT_OPERATOR",
    "T_DOUBLE_ARROW",
    "T_LIST",
    "T_ARRAY",
    "T_CALLABLE",
    "T_CLASS_C",
    "T_TRAIT_C",
    "T_METHOD_C",
    "T_FUNC_C",
    "T_LINE",
    "T_FILE",
    "T_START_HEREDOC",
    "T_END_HEREDOC",
    "T_DOLLAR_OPEN_CURLY_BRACES",
    "T_CURLY_OPEN",
    "T_PAAMAYIM_NEKUDOTAYIM",
    "T_NAMESPACE",
    "T_NS_C",
    "T_DIR",
    "T_NS_SEPARATOR",
    "';'",
    "'{'",
    "'}'",
    "'('",
    "')'",
    "'$'",
    "']'",
    "'`'",
    "'\"'"
    , "???"
];

/* @var Map which translates lexer tokens to internal tokens */
PHP.Parser.prototype.translate = [
        0,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,   47,  148,  149,  145,   46,   30,  149,
      143,  144,   44,   41,    7,   42,   43,   45,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,   25,  140,
       35,   12,   37,   24,   59,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,   60,  149,  146,   29,  149,  147,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  141,   28,  142,   49,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,    1,    2,    3,    4,
        5,    6,    8,    9,   10,   11,   13,   14,   15,   16,
       17,   18,   19,   20,   21,   22,   23,   26,   27,   31,
       32,   33,   34,   36,   38,   39,   40,   48,   50,   51,
       52,   53,   54,   55,   56,   57,   58,   61,   62,   63,
       64,   65,   66,   67,   68,   69,   70,   71,   72,   73,
       74,  149,  149,   75,   76,   77,   78,   79,   80,   81,
       82,   83,   84,   85,   86,   87,   88,   89,   90,   91,
       92,   93,   94,   95,   96,   97,   98,   99,  100,  101,
      102,  103,  104,  105,  106,  107,  108,  109,  110,  111,
      112,  113,  114,  115,  116,  117,  118,  119,  120,  121,
      122,  123,  124,  125,  126,  127,  128,  129,  130,  149,
      149,  149,  149,  149,  149,  131,  132,  133,  134,  135,
      136,  137,  138,  139
];

PHP.Parser.prototype.yyaction = [
       61,   62,  363,   63,   64,-32766,-32766,-32766,  509,   65,
      708,  709,  710,  707,  706,  705,-32766,-32766,-32766,-32766,
    -32766,-32766,  132,-32766,-32766,-32766,-32766,-32766,-32767,-32767,
    -32767,-32767,-32766,  335,-32766,-32766,-32766,-32766,-32766,   66,
       67,  351,  663,  664,   40,   68,  548,   69,  232,  233,
       70,   71,   72,   73,   74,   75,   76,   77,   30,  246,
       78,  336,  364, -112,    0,  469,  833,  834,  365,  641,
      890,  436,  590,   41,  835,   53,   27,  366,  294,  367,
      687,  368,  921,  369,  923,  922,  370,-32766,-32766,-32766,
       42,   43,  371,  339,  126,   44,  372,  337,   79,  297,
      349,  292,  293,-32766,  918,-32766,-32766,  373,  374,  375,
      376,  377,  391,  199,  361,  338,  573,  613,  378,  379,
      380,  381,  845,  839,  840,  841,  842,  836,  837,  253,
    -32766,   87,   88,   89,  391,  843,  838,  338,  597,  519,
      128,   80,  129,  273,  332,  257,  261,   47,  673,   90,
       91,   92,   93,   94,   95,   96,   97,   98,   99,  100,
      101,  102,  103,  104,  105,  106,  107,  108,  109,  110,
      799,  247,  884,  108,  109,  110,  226,  247,   21,-32766,
      310,-32766,-32766,-32766,  642,  548,-32766,-32766,-32766,-32766,
       56,  353,-32766,-32766,-32766,   55,-32766,-32766,-32766,-32766,
    -32766,   58,-32766,-32766,-32766,-32766,-32766,-32766,-32766,-32766,
    -32766,  557,-32766,-32766,  518,-32766,  548,  890,-32766,  390,
    -32766,  228,  252,-32766,-32766,-32766,-32766,-32766,  275,-32766,
      234,-32766,  587,  588,-32766,-32766,-32766,-32766,-32766,-32766,
    -32766,   46,  236,-32766,-32766,  281,-32766,  682,  348,-32766,
      390,-32766,  346,  333,  521,-32766,-32766,-32766,  271,  911,
      262,  237,  446,  911,-32766,  894,   59,  700,  358,  135,
      548,  123,  538,   35,-32766,  333,  122,-32766,-32766,-32766,
      271,-32766,  124,-32766,  692,-32766,-32766,-32766,-32766,  700,
      273,   22,-32766,-32766,-32766,-32766,  239,-32766,-32766,  612,
    -32766,  548,  134,-32766,  390,-32766,  462,  354,-32766,-32766,
    -32766,-32766,-32766,  227,-32766,  238,-32766,  845,  542,-32766,
      856,  611,  200,-32766,-32766,-32766,  259,  280,-32766,-32766,
      201,-32766,  855,  129,-32766,  390,  130,  202,  333,  206,
    -32766,-32766,-32766,  271,-32766,-32766,-32766,  125,  601,-32766,
      136,  299,  700,  489,   28,  548,  105,  106,  107,-32766,
      498,  499,-32766,-32766,-32766,  207,-32766,  133,-32766,  525,
    -32766,-32766,-32766,-32766,  663,  664,  527,-32766,-32766,-32766,
    -32766,  528,-32766,-32766,  610,-32766,  548,  427,-32766,  390,
    -32766,  532,  539,-32766,-32766,-32766,-32766,-32766,  240,-32766,
      247,-32766,  697,  543,-32766,  554,  523,  608,-32766,-32766,
    -32766,  686,  535,-32766,-32766,   54,-32766,   57,   60,-32766,
      390,  246, -155,  278,  345,-32766,-32766,-32766,  506,  347,
     -152,  471,  402,  403,-32766,  405,  404,  272,  493,  416,
      548,  318,  417,  505,-32766,  517,  548,-32766,-32766,-32766,
      549,-32766,  562,-32766,  916,-32766,-32766,-32766,-32766,  564,
      826,  848,-32766,-32766,-32766,-32766,  694,-32766,-32766,  485,
    -32766,  548,  487,-32766,  390,-32766,  504,  802,-32766,-32766,
    -32766,-32766,-32766,  279,-32766,  911,-32766,  502,  492,-32766,
      413,  483,  269,-32766,-32766,-32766,  243,  337,-32766,-32766,
      418,-32766,  454,  229,-32766,  390,  274,  373,  374,  344,
    -32766,-32766,-32766,  360,  614,-32766,  573,  613,  378,  379,
     -274,  548,  615, -332,  844,-32766,  258,   51,-32766,-32766,
    -32766,  270,-32766,  346,-32766,   52,-32766,  260,    0,-32766,
     -333,-32766,-32766,-32766,-32766,-32766,-32766,  205,-32766,-32766,
       49,-32766,  548,  424,-32766,  390,-32766, -266,  264,-32766,
    -32766,-32766,-32766,-32766,  409,-32766,  343,-32766,  265,  312,
    -32766,  470,  513, -275,-32766,-32766,-32766,  920,  337,-32766,
    -32766,  530,-32766,  531,  600,-32766,  390,  592,  373,  374,
      578,  581,-32766,-32766,  644,  629,-32766,  573,  613,  378,
      379,  635,  548,  636,  576,  627,-32766,  625,  693,-32766,
    -32766,-32766,  691,-32766,  591,-32766,  582,-32766,  203,  204,
    -32766,  584,  583,-32766,-32766,-32766,-32766,  586,  599,-32766,
    -32766,  589,-32766,  690,  558,-32766,  390,  197,  683,  919,
       86,  520,  522,-32766,  524,  833,  834,  529,  533,-32766,
      534,  537,  541,  835,   48,  111,  112,  113,  114,  115,
      116,  117,  118,  119,  120,  121,  127,   31,  633,  337,
      330,  634,  585,-32766,   32,  291,  337,  330,  478,  373,
      374,  917,  291,  891,  889,  875,  373,  374,  553,  613,
      378,  379,  737,  739,  887,  553,  613,  378,  379,  824,
      451,  675,  839,  840,  841,  842,  836,  837,  320,  895,
      277,  885,   23,   33,  843,  838,  556,  277,  337,  330,
    -32766,   34,-32766,  555,  291,   36,   37,   38,  373,  374,
       39,   45,   50,   81,   82,   83,   84,  553,  613,  378,
      379,-32767,-32767,-32767,-32767,  103,  104,  105,  106,  107,
      337,   85,  131,  137,  337,  138,  198,  224,  225,  277,
      373,  374, -332,  230,  373,  374,   24,  337,  231,  573,
      613,  378,  379,  573,  613,  378,  379,  373,  374,  235,
      248,  249,  250,  337,  251,    0,  573,  613,  378,  379,
      276,  329,  331,  373,  374,-32766,  337,  574,  490,  792,
      337,  609,  573,  613,  378,  379,  373,  374,   25,  300,
      373,  374,  319,  337,  795,  573,  613,  378,  379,  573,
      613,  378,  379,  373,  374,  516,  355,  359,  445,  482,
      796,  507,  573,  613,  378,  379,  508,  548,  337,  890,
      775,  791,  337,  604,  803,  808,  806,  698,  373,  374,
      888,  807,  373,  374,-32766,-32766,-32766,  573,  613,  378,
      379,  573,  613,  378,  379,  873,  832,  804,  872,  851,
    -32766,  809,-32766,-32766,-32766,-32766,  805,   20,   26,   29,
      298,  480,  515,  770,  778,  827,  457,    0,  900,  455,
      774,    0,    0,    0,  874,  870,  886,  823,  915,  852,
      869,  488,    0,  391,  793,    0,  338,    0,    0,    0,
      340,    0,  273
];

PHP.Parser.prototype.yycheck = [
        2,    3,    4,    5,    6,    8,    9,   10,   70,   11,
      104,  105,  106,  107,  108,  109,    8,    9,   10,    8,
        9,   24,   60,   26,   27,   28,   29,   30,   31,   32,
       33,   34,   24,    7,   26,   27,   28,   29,   30,   41,
       42,    7,  123,  124,    7,   47,   70,   49,   50,   51,
       52,   53,   54,   55,   56,   57,   58,   59,   60,   61,
       62,   63,   64,  144,    0,   75,   68,   69,   70,   25,
       72,   70,   74,    7,   76,   77,   78,   79,    7,   81,
      142,   83,   70,   85,   72,   73,   88,    8,    9,   10,
       92,   93,   94,   95,    7,   97,   98,   95,  100,    7,
        7,  103,  104,   24,  142,   26,   27,  105,  106,  111,
      112,  113,  136,    7,    7,  139,  114,  115,  116,  117,
      122,  123,  132,  125,  126,  127,  128,  129,  130,  131,
        8,    8,    9,   10,  136,  137,  138,  139,  140,  141,
       25,  143,  141,  145,  142,  147,  148,   24,   72,   26,
       27,   28,   29,   30,   31,   32,   33,   34,   35,   36,
       37,   38,   39,   40,   41,   42,   43,   44,   45,   46,
      144,   48,   72,   44,   45,   46,   30,   48,  144,   64,
       72,    8,    9,   10,  140,   70,    8,    9,   10,   74,
       60,   25,   77,   78,   79,   60,   81,   24,   83,   26,
       85,   60,   24,   88,   26,   27,   28,   92,   93,   94,
       64,  140,   97,   98,   70,  100,   70,   72,  103,  104,
       74,  145,    7,   77,   78,   79,  111,   81,    7,   83,
       30,   85,  140,  140,   88,    8,    9,   10,   92,   93,
       94,  133,  134,   97,   98,  145,  100,  140,    7,  103,
      104,   24,  139,   96,  141,  140,  141,  111,  101,   75,
       75,   30,   70,   75,   64,   70,   60,  110,  121,   12,
       70,  141,   25,  143,   74,   96,  141,   77,   78,   79,
      101,   81,  141,   83,  140,   85,  140,  141,   88,  110,
      145,  144,   92,   93,   94,   64,    7,   97,   98,  142,
      100,   70,  141,  103,  104,   74,  145,  141,   77,   78,
       79,  111,   81,    7,   83,   30,   85,  132,   25,   88,
      132,  142,   12,   92,   93,   94,  120,   60,   97,   98,
       12,  100,  148,  141,  103,  104,  141,   12,   96,   12,
      140,  141,  111,  101,    8,    9,   10,  141,   25,   64,
       90,   91,  110,   65,   66,   70,   41,   42,   43,   74,
       65,   66,   77,   78,   79,   12,   81,   25,   83,   25,
       85,  140,  141,   88,  123,  124,   25,   92,   93,   94,
       64,   25,   97,   98,  142,  100,   70,  120,  103,  104,
       74,   25,   25,   77,   78,   79,  111,   81,   30,   83,
       48,   85,  140,  141,   88,  140,  141,   30,   92,   93,
       94,  140,  141,   97,   98,   60,  100,   60,   60,  103,
      104,   61,   72,   75,   70,  140,  141,  111,   67,   70,
       87,   99,   70,   70,   64,   70,   72,  102,   89,   70,
       70,   71,   70,   70,   74,   70,   70,   77,   78,   79,
       70,   81,   70,   83,   70,   85,  140,  141,   88,   70,
      144,   70,   92,   93,   94,   64,   70,   97,   98,   72,
      100,   70,   72,  103,  104,   74,   72,   72,   77,   78,
       79,  111,   81,   75,   83,   75,   85,   89,   86,   88,
       79,  101,  118,   92,   93,   94,   87,   95,   97,   98,
       87,  100,   87,   87,  103,  104,  118,  105,  106,   95,
      140,  141,  111,   95,  115,   64,  114,  115,  116,  117,
      135,   70,  115,  120,  132,   74,  120,  140,   77,   78,
       79,  119,   81,  139,   83,  140,   85,  120,   -1,   88,
      120,  140,  141,   92,   93,   94,   64,  121,   97,   98,
      121,  100,   70,  122,  103,  104,   74,  135,  135,   77,
       78,   79,  111,   81,  139,   83,  139,   85,  135,  135,
       88,  135,  135,  135,   92,   93,   94,  142,   95,   97,
       98,  140,  100,  140,  140,  103,  104,  140,  105,  106,
      140,  140,  141,  111,  140,  140,   64,  114,  115,  116,
      117,  140,   70,  140,  140,  140,   74,  140,  140,   77,
       78,   79,  140,   81,  140,   83,  140,   85,   41,   42,
       88,  140,  140,  141,   92,   93,   94,  140,  140,   97,
       98,  140,  100,  140,  140,  103,  104,   60,  140,  142,
      141,  141,  141,  111,  141,   68,   69,  141,  141,   72,
      141,  141,  141,   76,   12,   13,   14,   15,   16,   17,
       18,   19,   20,   21,   22,   23,  141,  143,  142,   95,
       96,  142,  140,  141,  143,  101,   95,   96,  142,  105,
      106,  142,  101,  142,  142,  142,  105,  106,  114,  115,
      116,  117,   50,   51,  142,  114,  115,  116,  117,  142,
      123,  142,  125,  126,  127,  128,  129,  130,  131,  142,
      136,  142,  144,  143,  137,  138,  142,  136,   95,   96,
      143,  143,  145,  142,  101,  143,  143,  143,  105,  106,
      143,  143,  143,  143,  143,  143,  143,  114,  115,  116,
      117,   35,   36,   37,   38,   39,   40,   41,   42,   43,
       95,  143,  143,  143,   95,  143,  143,  143,  143,  136,
      105,  106,  120,  143,  105,  106,  144,   95,  143,  114,
      115,  116,  117,  114,  115,  116,  117,  105,  106,  143,
      143,  143,  143,   95,  143,   -1,  114,  115,  116,  117,
      143,  143,  143,  105,  106,  143,   95,  142,   80,  146,
       95,  142,  114,  115,  116,  117,  105,  106,  144,  144,
      105,  106,  144,   95,  142,  114,  115,  116,  117,  114,
      115,  116,  117,  105,  106,   82,  144,  144,  144,  144,
      142,   84,  114,  115,  116,  117,  144,   70,   95,   72,
      144,  144,   95,  142,  144,  146,  144,  142,  105,  106,
      146,  144,  105,  106,    8,    9,   10,  114,  115,  116,
      117,  114,  115,  116,  117,  144,  144,  144,  144,  144,
       24,  104,   26,   27,   28,   29,  144,  144,  144,  144,
      144,  144,  144,  144,  144,  144,  144,   -1,  144,  144,
      144,   -1,   -1,   -1,  146,  146,  146,  146,  146,  146,
      146,  146,   -1,  136,  147,   -1,  139,   -1,   -1,   -1,
      143,   -1,  145
];

PHP.Parser.prototype.yybase = [
        0,  574,  581,  623,  655,    2,  718,  402,  747,  659,
      672,  688,  743,  701,  705,  483,  483,  483,  483,  483,
      351,  356,  366,  366,  367,  366,  344,   -2,   -2,   -2,
      200,  200,  231,  231,  231,  231,  231,  231,  231,  231,
      200,  231,  451,  482,  532,  316,  370,  115,  146,  285,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,   44,
      474,  429,  476,  481,  487,  488,  739,  740,  741,  734,
      733,  416,  736,  539,  541,  342,  542,  543,  552,  557,
      559,  536,  567,  737,  755,  569,  735,  738,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  122,   11,  336,
      336,  336,  336,  336,  336,  336,  336,  336,  336,  336,
      336,  336,  336,  336,  227,  227,  173,  577,  577,  577,
      577,  577,  577,  577,  577,  577,  577,  577,   79,  178,
      846,    8,   -3,   -3,   -3,   -3,  642,  706,  706,  706,
      706,  157,  179,  242,  431,  431,  360,  431,  525,  368,
      767,  767,  767,  767,  767,  767,  767,  767,  767,  767,
      767,  767,  350,  375,  315,  315,  652,  652,  -81,  -81,
      -81,  -81,  251,  185,  188,  184,  -62,  348,  195,  195,
      195,  408,  392,  410,    1,  192,  129,  129,  129,  -24,
      -24,  -24,  -24,  499,  -24,  -24,  -24,  113,  108,  108,
       12,  161,  349,  526,  271,  398,  529,  438,  130,  206,
      265,  427,   76,  414,  427,  288,  295,   76,  166,   44,
      262,  422,  141,  491,  372,  494,  413,   71,   92,   93,
      267,  135,  100,   34,  415,  745,  746,  742,  -38,  420,
      -10,  135,  147,  744,  498,  107,   26,  493,  144,  377,
      363,  369,  332,  363,  400,  377,  588,  377,  376,  377,
      360,   37,  582,  376,  377,  374,  376,  388,  363,  364,
      412,  369,  377,  441,  443,  390,  106,  332,  377,  390,
      377,  400,   64,  590,  591,  323,  592,  589,  593,  649,
      608,  362,  500,  399,  407,  620,  625,  636,  365,  354,
      614,  524,  425,  359,  355,  423,  570,  578,  357,  406,
      414,  394,  352,  403,  531,  433,  403,  653,  434,  385,
      417,  411,  444,  310,  318,  501,  425,  668,  757,  380,
      637,  684,  403,  609,  387,   87,  325,  638,  382,  403,
      639,  403,  696,  503,  615,  403,  697,  384,  435,  425,
      352,  352,  352,  700,   66,  699,  583,  702,  707,  704,
      748,  721,  749,  584,  750,  358,  583,  722,  751,  682,
      215,  613,  422,  436,  389,  447,  221,  257,  752,  403,
      403,  506,  499,  403,  395,  685,  397,  426,  753,  392,
      391,  647,  683,  403,  418,  754,  221,  723,  587,  724,
      450,  568,  507,  648,  509,  327,  725,  353,  497,  610,
      454,  622,  455,  461,  404,  510,  373,  732,  612,  247,
      361,  664,  463,  405,  692,  641,  464,  465,  511,  343,
      437,  335,  409,  396,  665,  293,  467,  468,  472,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,    0,    0,    0,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,  123,  123,  123,  123,  123,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  123,    0,    0,    0,    0,    0,    0,    0,    0,
        0,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  767,  767,  767,  767,  767,  767,  767,  767,  767,
      767,  767,  123,  123,  123,  123,  123,  123,  123,  123,
        0,  129,  129,  129,  129,  -94,  -94,  -94,  767,  767,
      767,  767,  767,  767,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,  -94,  -94,  129,  129,
      767,  767,  -24,  -24,  -24,  -24,  -24,  108,  108,  108,
      -24,  108,  145,  145,  145,  108,  108,  108,  100,  100,
        0,    0,    0,    0,    0,    0,    0,  145,    0,    0,
        0,  376,    0,    0,    0,  145,  260,  260,  221,  260,
      260,  135,    0,    0,  425,  376,    0,  364,  376,    0,
        0,    0,    0,    0,    0,  531,    0,   87,  637,  241,
      425,    0,    0,    0,    0,    0,    0,    0,  425,  289,
      289,  306,    0,  358,    0,    0,    0,  306,  241,    0,
        0,  221
];

PHP.Parser.prototype.yydefault = [
        3,32767,32767,    1,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,  104,   96,  110,   95,  106,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
      358,  358,  122,  122,  122,  122,  122,  122,  122,  122,
      316,32767,32767,32767,32767,32767,32767,32767,32767,32767,
      173,  173,  173,32767,  348,  348,  348,  348,  348,  348,
      348,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,  363,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,  232,  233,
      235,  236,  172,  125,  349,  362,  171,  199,  201,  250,
      200,  177,  182,  183,  184,  185,  186,  187,  188,  189,
      190,  191,  192,  176,  229,  228,  197,  313,  313,  316,
    32767,32767,32767,32767,32767,32767,32767,32767,  198,  202,
      204,  203,  219,  220,  217,  218,  175,  221,  222,  223,
      224,  157,  157,  157,  357,  357,32767,  357,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,  158,32767,  211,  212,  276,  276,  117,  117,
      117,  117,  117,32767,32767,32767,32767,  284,32767,32767,
    32767,32767,32767,  286,32767,32767,  206,  207,  205,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,  285,32767,
    32767,32767,32767,32767,32767,32767,32767,  334,  321,  272,
    32767,32767,32767,  265,32767,  107,  109,32767,32767,32767,
    32767,  302,  339,32767,32767,32767,   17,32767,32767,32767,
      370,  334,32767,32767,   19,32767,32767,32767,32767,  227,
    32767,  338,  332,32767,32767,32767,32767,32767,32767,   63,
    32767,32767,32767,32767,32767,   63,  281,   63,32767,   63,
    32767,  315,  287,32767,   63,   74,32767,   72,32767,32767,
       76,32767,   63,   93,   93,  254,  315,   54,   63,  254,
       63,32767,32767,32767,32767,    4,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,  267,32767,  323,32767,  337,  336,  324,32767,
      265,32767,  215,  194,  266,32767,  196,32767,32767,  270,
      273,32767,32767,32767,  134,32767,  268,  180,32767,32767,
    32767,32767,  365,32767,32767,  174,32767,32767,32767,  130,
    32767,   61,  332,32767,32767,  355,32767,32767,  332,  269,
      208,  209,  210,32767,  121,32767,  310,32767,32767,32767,
    32767,32767,32767,  327,32767,  333,32767,32767,32767,32767,
      111,32767,  302,32767,32767,32767,   75,32767,32767,  178,
      126,32767,32767,  364,32767,32767,32767,  320,32767,32767,
    32767,32767,32767,   62,32767,32767,   77,32767,32767,32767,
    32767,  332,32767,32767,32767,  115,32767,  169,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,  332,32767,32767,32767,32767,32767,32767,32767,    4,
    32767,  151,32767,32767,32767,32767,32767,32767,32767,   25,
       25,    3,  137,    3,  137,   25,  101,   25,   25,  137,
       93,   93,   25,   25,   25,  144,   25,   25,   25,   25,
       25,   25,   25,   25
];

PHP.Parser.prototype.yygoto = [
      141,  141,  173,  173,  173,  173,  173,  173,  173,  173,
      141,  173,  142,  143,  144,  148,  153,  155,  181,  175,
      172,  172,  172,  172,  174,  174,  174,  174,  174,  174,
      174,  168,  169,  170,  171,  179,  757,  758,  392,  760,
      781,  782,  783,  784,  785,  786,  787,  789,  725,  145,
      146,  147,  149,  150,  151,  152,  154,  177,  178,  180,
      196,  208,  209,  210,  211,  212,  213,  214,  215,  217,
      218,  219,  220,  244,  245,  266,  267,  268,  430,  431,
      432,  182,  183,  184,  185,  186,  187,  188,  189,  190,
      191,  192,  156,  157,  158,  159,  176,  160,  194,  161,
      162,  163,  164,  195,  165,  193,  139,  166,  167,  452,
      452,  452,  452,  452,  452,  452,  452,  452,  452,  452,
      453,  453,  453,  453,  453,  453,  453,  453,  453,  453,
      453,  551,  551,  551,  464,  491,  394,  394,  394,  394,
      394,  394,  394,  394,  394,  394,  394,  394,  394,  394,
      394,  394,  394,  394,  407,  552,  552,  552,  810,  810,
      662,  662,  662,  662,  662,  594,  283,  595,  510,  399,
      399,  567,  679,  632,  849,  850,  863,  660,  714,  426,
      222,  622,  622,  622,  622,  223,  617,  623,  494,  395,
      395,  395,  395,  395,  395,  395,  395,  395,  395,  395,
      395,  395,  395,  395,  395,  395,  395,  465,  472,  514,
      904,  398,  398,  425,  425,  459,  425,  419,  322,  421,
      421,  393,  396,  412,  422,  428,  460,  463,  473,  481,
      501,    5,  476,  284,  327,    1,   15,    2,    6,    7,
      550,  550,  550,    8,    9,   10,  668,   16,   11,   17,
       12,   18,   13,   19,   14,  704,  328,  881,  881,  643,
      628,  626,  626,  624,  626,  526,  401,  652,  647,  847,
      847,  847,  847,  847,  847,  847,  847,  847,  847,  847,
      437,  438,  441,  447,  477,  479,  497,  290,  910,  910,
      400,  400,  486,  880,  880,  263,  913,  910,  303,  255,
      723,  306,  822,  821,  306,  896,  896,  896,  861,  304,
      323,  410,  913,  913,  897,  316,  420,  769,  658,  559,
      879,  671,  536,  324,  466,  565,  311,  311,  311,  801,
      241,  676,  496,  439,  440,  442,  444,  448,  475,  631,
      858,  311,  285,  286,  603,  495,  712,    0,  406,  321,
        0,    0,    0,  314,    0,    0,  429,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,  411
];

PHP.Parser.prototype.yygcheck = [
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   35,
       35,   35,   35,   35,   35,   35,   35,   35,   35,   35,
       86,   86,   86,   86,   86,   86,   86,   86,   86,   86,
       86,    6,    6,    6,   21,   21,   35,   35,   35,   35,
       35,   35,   35,   35,   35,   35,   35,   35,   35,   35,
       35,   35,   35,   35,   71,    7,    7,    7,   35,   35,
       35,   35,   35,   35,   35,   29,   44,   29,   35,   86,
       86,   12,   12,   12,   12,   12,   12,   12,   12,   75,
       40,   35,   35,   35,   35,   40,   35,   35,   35,   82,
       82,   82,   82,   82,   82,   82,   82,   82,   82,   82,
       82,   82,   82,   82,   82,   82,   82,   36,   36,   36,
      104,   82,   82,   28,   28,   28,   28,   28,   28,   28,
       28,   28,   28,   28,   28,   28,   28,   28,   28,   28,
       28,   13,   42,   42,   42,    2,   13,    2,   13,   13,
        5,    5,    5,   13,   13,   13,   54,   13,   13,   13,
       13,   13,   13,   13,   13,   67,   67,   83,   83,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,   93,
       93,   93,   93,   93,   93,   93,   93,   93,   93,   93,
       52,   52,   52,   52,   52,   52,   52,    4,  105,  105,
       89,   89,   94,   84,   84,   92,  105,  105,   26,   92,
       71,    4,   91,   91,    4,   84,   84,   84,   97,   30,
       70,   30,  105,  105,  102,   27,   30,   72,   50,   10,
       84,   55,   46,    9,   30,   11,   90,   90,   90,   80,
       30,   56,   30,   85,   85,   85,   85,   85,   85,   43,
       96,   90,   44,   44,   34,   77,   69,   -1,    4,   90,
       -1,   -1,   -1,    4,   -1,   -1,    4,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   71
];

PHP.Parser.prototype.yygbase = [
        0,    0, -286,    0,   10,  239,  130,  154,    0,  -10,
       25,  -23,  -29, -289,    0,  -30,    0,    0,    0,    0,
        0,   83,    0,    0,    0,    0,  245,   84,  -11,  142,
      -28,    0,    0,    0,  -13,  -88,  -42,    0,    0,    0,
     -344,    0,  -38,  -12, -188,    0,   23,    0,    0,    0,
       66,    0,  247,    0,  205,   24,  -18,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,   13,    0,  -15,
       85,   74,   70,    0,    0,  148,    0,  -14,    0,    0,
       -6,    0,  -35,   11,   47,  278,  -77,    0,    0,   44,
       68,   43,   38,   72,   94,    0,  -16,  109,    0,    0,
        0,    0,   87,    0,  170,   34,    0
];

PHP.Parser.prototype.yygdefault = [
    -32768,  362,    3,  546,  382,  570,  571,  572,  307,  305,
      560,  566,  467,    4,  568,  140,  295,  575,  296,  500,
      577,  414,  579,  580,  308,  309,  415,  315,  216,  593,
      503,  313,  596,  357,  602,  301,  449,  383,  350,  461,
      221,  423,  456,  630,  282,  638,  540,  646,  649,  450,
      657,  352,  433,  434,  667,  672,  677,  680,  334,  325,
      474,  684,  685,  256,  689,  511,  512,  703,  242,  711,
      317,  724,  342,  788,  790,  397,  408,  484,  797,  326,
      800,  384,  385,  386,  387,  435,  818,  815,  289,  866,
      287,  443,  254,  853,  468,  356,  903,  862,  288,  388,
      389,  302,  898,  341,  905,  912,  458
];

PHP.Parser.prototype.yylhs = [
        0,    1,    2,    2,    4,    4,    3,    3,    3,    3,
        3,    3,    3,    3,    3,    8,    8,   10,   10,   10,
       10,    9,    9,   11,   13,   13,   14,   14,   14,   14,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,   33,   33,
       34,   27,   27,   30,   30,    6,    7,    7,    7,   37,
       37,   37,   38,   38,   41,   41,   39,   39,   42,   42,
       22,   22,   29,   29,   32,   32,   31,   31,   43,   23,
       23,   23,   23,   44,   44,   45,   45,   46,   46,   20,
       20,   16,   16,   47,   18,   18,   48,   17,   17,   19,
       19,   36,   36,   49,   49,   50,   50,   51,   51,   51,
       51,   52,   52,   53,   53,   54,   54,   24,   24,   55,
       55,   55,   25,   25,   56,   56,   40,   40,   57,   57,
       57,   57,   62,   62,   63,   63,   64,   64,   64,   64,
       65,   66,   66,   61,   61,   58,   58,   60,   60,   68,
       68,   67,   67,   67,   67,   67,   67,   59,   59,   69,
       69,   26,   26,   21,   21,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   71,   77,   77,   79,   79,   80,   81,
       81,   81,   81,   81,   81,   86,   86,   35,   35,   35,
       72,   72,   87,   87,   82,   82,   88,   88,   88,   88,
       88,   73,   73,   73,   76,   76,   76,   78,   78,   93,
       93,   93,   93,   93,   93,   93,   93,   93,   93,   93,
       93,   93,   93,   12,   12,   12,   12,   12,   12,   74,
       74,   74,   74,   94,   94,   96,   96,   95,   95,   97,
       97,   28,   28,   28,   28,   99,   99,   98,   98,   98,
       98,   98,  100,  100,   84,   84,   89,   89,   83,   83,
      101,  101,  101,  101,   90,   90,   90,   90,   85,   85,
       91,   91,   91,   70,   70,  102,  102,  102,   75,   75,
      103,  103,  104,  104,  104,  104,   92,   92,   92,   92,
      105,  105,  105,  105,  105,  105,  105,  106,  106,  106
];

PHP.Parser.prototype.yylen = [
        1,    1,    2,    0,    1,    3,    1,    1,    1,    1,
        3,    5,    4,    3,    3,    3,    1,    1,    3,    2,
        4,    3,    1,    3,    2,    0,    1,    1,    1,    1,
        3,    7,   10,    5,    7,    9,    5,    2,    3,    2,
        3,    2,    3,    3,    3,    3,    1,    2,    5,    7,
        8,   10,    5,    1,    5,    3,    3,    2,    1,    2,
        8,    1,    3,    0,    1,    9,    7,    6,    5,    1,
        2,    2,    0,    2,    0,    2,    0,    2,    1,    3,
        1,    4,    1,    4,    1,    4,    1,    3,    3,    3,
        4,    4,    5,    0,    2,    4,    3,    1,    1,    1,
        4,    0,    2,    5,    0,    2,    6,    0,    2,    0,
        3,    1,    0,    1,    3,    3,    5,    0,    1,    1,
        1,    1,    0,    1,    3,    1,    2,    3,    1,    1,
        2,    4,    3,    1,    1,    3,    2,    0,    3,    3,
        8,    3,    1,    3,    0,    2,    4,    5,    4,    4,
        3,    1,    1,    1,    3,    1,    1,    0,    1,    1,
        2,    1,    1,    1,    1,    1,    1,    1,    3,    1,
        3,    3,    1,    0,    1,    1,    6,    3,    4,    4,
        1,    2,    3,    3,    3,    3,    3,    3,    3,    3,
        3,    3,    3,    2,    2,    2,    2,    3,    3,    3,
        3,    3,    3,    3,    3,    3,    3,    3,    3,    3,
        3,    3,    3,    2,    2,    2,    2,    3,    3,    3,
        3,    3,    3,    3,    3,    3,    3,    3,    5,    4,
        4,    4,    2,    2,    4,    2,    2,    2,    2,    2,
        2,    2,    2,    2,    2,    2,    1,    4,    3,    3,
        2,    9,   10,    3,    0,    4,    1,    3,    2,    4,
        6,    8,    4,    4,    4,    1,    1,    1,    2,    3,
        1,    1,    1,    1,    1,    1,    0,    3,    3,    4,
        4,    0,    2,    3,    0,    1,    1,    0,    3,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        3,    2,    1,    1,    3,    2,    2,    4,    3,    1,
        3,    3,    3,    0,    2,    0,    1,    3,    1,    3,
        1,    1,    1,    1,    1,    6,    4,    3,    6,    4,
        4,    4,    1,    3,    1,    2,    1,    1,    4,    1,
        3,    6,    4,    4,    4,    4,    1,    4,    0,    1,
        1,    3,    1,    3,    1,    1,    4,    0,    0,    2,
        3,    1,    3,    1,    4,    2,    2,    2,    1,    2,
        1,    4,    3,    3,    3,    6,    3,    1,    1,    1
];







PHP.Parser.prototype.yyn0 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn1 = function ( attributes ) {
     this.yyval = this.Stmt_Namespace_postprocess(this.yyastk[ this.stackPos-(1-1) ]); 
};

PHP.Parser.prototype.yyn2 = function ( attributes ) {
     if (Array.isArray(this.yyastk[ this.stackPos-(2-2) ])) { this.yyval = this.yyastk[ this.stackPos-(2-1) ].concat( this.yyastk[ this.stackPos-(2-2) ]); } else { this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; }; 
};

PHP.Parser.prototype.yyn3 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn4 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn5 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn6 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn7 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn8 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn9 = function ( attributes ) {
     this.yyval = this.Node_Stmt_HaltCompiler(attributes); 
};

PHP.Parser.prototype.yyn10 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Namespace(this.Node_Name(this.yyastk[ this.stackPos-(3-2) ], attributes), null, attributes); 
};

PHP.Parser.prototype.yyn11 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Namespace(this.Node_Name(this.yyastk[ this.stackPos-(5-2) ], attributes), this.yyastk[ this.stackPos-(5-4) ], attributes); 
};

PHP.Parser.prototype.yyn12 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Namespace(null, this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn13 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Use(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn14 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Const(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn15 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn16 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn17 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(1-1) ], attributes), null, attributes); 
};

PHP.Parser.prototype.yyn18 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(3-1) ], attributes), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn19 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(2-2) ], attributes), null, attributes); 
};

PHP.Parser.prototype.yyn20 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(4-2) ], attributes), this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn21 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn22 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn23 = function ( attributes ) {
     this.yyval = this.Node_Const(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn24 = function ( attributes ) {
     if (Array.isArray(this.yyastk[ this.stackPos-(2-2) ])) { this.yyval = this.yyastk[ this.stackPos-(2-1) ].concat( this.yyastk[ this.stackPos-(2-2) ]); } else { this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; }; 
};

PHP.Parser.prototype.yyn25 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn26 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn27 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn28 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn29 = function ( attributes ) {
     throw new Error('__halt_compiler() can only be used from the outermost scope'); 
};

PHP.Parser.prototype.yyn30 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn31 = function ( attributes ) {
     this.yyval = this.Node_Stmt_If(this.yyastk[ this.stackPos-(7-3) ], {'stmts':  Array.isArray(this.yyastk[ this.stackPos-(7-5) ]) ? this.yyastk[ this.stackPos-(7-5) ] : [this.yyastk[ this.stackPos-(7-5) ]], 'elseifs':  this.yyastk[ this.stackPos-(7-6) ], 'Else':  this.yyastk[ this.stackPos-(7-7) ]}, attributes); 
};

PHP.Parser.prototype.yyn32 = function ( attributes ) {
     this.yyval = this.Node_Stmt_If(this.yyastk[ this.stackPos-(10-3) ], {'stmts':  this.yyastk[ this.stackPos-(10-6) ], 'elseifs':  this.yyastk[ this.stackPos-(10-7) ], 'else':  this.yyastk[ this.stackPos-(10-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn33 = function ( attributes ) {
     this.yyval = this.Node_Stmt_While(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn34 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Do(this.yyastk[ this.stackPos-(7-5) ], Array.isArray(this.yyastk[ this.stackPos-(7-2) ]) ? this.yyastk[ this.stackPos-(7-2) ] : [this.yyastk[ this.stackPos-(7-2) ]], attributes); 
};

PHP.Parser.prototype.yyn35 = function ( attributes ) {
     this.yyval = this.Node_Stmt_For({'init':  this.yyastk[ this.stackPos-(9-3) ], 'cond':  this.yyastk[ this.stackPos-(9-5) ], 'loop':  this.yyastk[ this.stackPos-(9-7) ], 'stmts':  this.yyastk[ this.stackPos-(9-9) ]}, attributes); 
};

PHP.Parser.prototype.yyn36 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Switch(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn37 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Break(null, attributes); 
};

PHP.Parser.prototype.yyn38 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Break(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn39 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Continue(null, attributes); 
};

PHP.Parser.prototype.yyn40 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Continue(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn41 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Return(null, attributes); 
};

PHP.Parser.prototype.yyn42 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Return(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn43 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Global(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn44 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Static(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn45 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Echo(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn46 = function ( attributes ) {
     this.yyval = this.Node_Stmt_InlineHTML(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn47 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn48 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Unset(this.yyastk[ this.stackPos-(5-3) ], attributes); 
};

PHP.Parser.prototype.yyn49 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Foreach(this.yyastk[ this.stackPos-(7-3) ], this.yyastk[ this.stackPos-(7-5) ], {'keyVar':  null, 'byRef':  false, 'stmts':  this.yyastk[ this.stackPos-(7-7) ]}, attributes); 
};

PHP.Parser.prototype.yyn50 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Foreach(this.yyastk[ this.stackPos-(8-3) ], this.yyastk[ this.stackPos-(8-6) ], {'keyVar':  null, 'byRef':  true, 'stmts':  this.yyastk[ this.stackPos-(8-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn51 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Foreach(this.yyastk[ this.stackPos-(10-3) ], this.yyastk[ this.stackPos-(10-8) ], {'keyVar':  this.yyastk[ this.stackPos-(10-5) ], 'byRef':  this.yyastk[ this.stackPos-(10-7) ], 'stmts':  this.yyastk[ this.stackPos-(10-10) ]}, attributes); 
};

PHP.Parser.prototype.yyn52 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Declare(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn53 = function ( attributes ) {
     this.yyval = []; /* means: no statement */ 
};

PHP.Parser.prototype.yyn54 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TryCatch(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn55 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Throw(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn56 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Goto(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn57 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Label(this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn58 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn59 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn60 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Catch(this.yyastk[ this.stackPos-(8-3) ], this.yyastk[ this.stackPos-(8-4) ].substring( 1 ), this.yyastk[ this.stackPos-(8-7) ], attributes); 
};

PHP.Parser.prototype.yyn61 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn62 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn63 = function ( attributes ) {
     this.yyval = false; 
};

PHP.Parser.prototype.yyn64 = function ( attributes ) {
     this.yyval = true; 
};

PHP.Parser.prototype.yyn65 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Function(this.yyastk[ this.stackPos-(9-3) ], {'byRef':  this.yyastk[ this.stackPos-(9-2) ], 'params':  this.yyastk[ this.stackPos-(9-5) ], 'stmts':  this.yyastk[ this.stackPos-(9-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn66 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Class(this.yyastk[ this.stackPos-(7-2) ], {'type':  this.yyastk[ this.stackPos-(7-1) ], 'Extends':  this.yyastk[ this.stackPos-(7-3) ], 'Implements':  this.yyastk[ this.stackPos-(7-4) ], 'stmts':  this.yyastk[ this.stackPos-(7-6) ]}, attributes); 
};

PHP.Parser.prototype.yyn67 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Interface(this.yyastk[ this.stackPos-(6-2) ], {'Extends':  this.yyastk[ this.stackPos-(6-3) ], 'stmts':  this.yyastk[ this.stackPos-(6-5) ]}, attributes); 
};

PHP.Parser.prototype.yyn68 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Trait(this.yyastk[ this.stackPos-(5-2) ], this.yyastk[ this.stackPos-(5-4) ], attributes); 
};

PHP.Parser.prototype.yyn69 = function ( attributes ) {
     this.yyval = 0; 
};

PHP.Parser.prototype.yyn70 = function ( attributes ) {
     this.yyval = this.MODIFIER_ABSTRACT; 
};

PHP.Parser.prototype.yyn71 = function ( attributes ) {
     this.yyval = this.MODIFIER_FINAL; 
};

PHP.Parser.prototype.yyn72 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn73 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn74 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn75 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn76 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn77 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn78 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn79 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn80 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn81 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn82 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn83 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn84 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn85 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn86 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn87 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn88 = function ( attributes ) {
     this.yyval = this.Node_Stmt_DeclareDeclare(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn89 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn90 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-3) ]; 
};

PHP.Parser.prototype.yyn91 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn92 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(5-3) ]; 
};

PHP.Parser.prototype.yyn93 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn94 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn95 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Case(this.yyastk[ this.stackPos-(4-2) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn96 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Case(null, this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn97 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn98 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn99 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn100 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn101 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn102 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn103 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ElseIf(this.yyastk[ this.stackPos-(5-3) ], Array.isArray(this.yyastk[ this.stackPos-(5-5) ]) ? this.yyastk[ this.stackPos-(5-5) ] : [this.yyastk[ this.stackPos-(5-5) ]], attributes); 
};

PHP.Parser.prototype.yyn104 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn105 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn106 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ElseIf(this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-6) ], attributes); 
};

PHP.Parser.prototype.yyn107 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn108 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Else(Array.isArray(this.yyastk[ this.stackPos-(2-2) ]) ? this.yyastk[ this.stackPos-(2-2) ] : [this.yyastk[ this.stackPos-(2-2) ]], attributes); 
};

PHP.Parser.prototype.yyn109 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn110 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Else(this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn111 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn112 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn113 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn114 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn115 = function ( attributes ) {
     this.yyval = this.Node_Param(this.yyastk[ this.stackPos-(3-3) ].substring( 1 ), null, this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn116 = function ( attributes ) {
     this.yyval = this.Node_Param(this.yyastk[ this.stackPos-(5-3) ].substring( 1 ), this.yyastk[ this.stackPos-(5-5) ], this.yyastk[ this.stackPos-(5-1) ], this.yyastk[ this.stackPos-(5-2) ], attributes); 
};

PHP.Parser.prototype.yyn117 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn118 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn119 = function ( attributes ) {
     this.yyval = 'array'; 
};

PHP.Parser.prototype.yyn120 = function ( attributes ) {
     this.yyval = 'callable'; 
};

PHP.Parser.prototype.yyn121 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn122 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn123 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn124 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn125 = function ( attributes ) {
     this.yyval = this.Node_Arg(this.yyastk[ this.stackPos-(1-1) ], false, attributes); 
};

PHP.Parser.prototype.yyn126 = function ( attributes ) {
     this.yyval = this.Node_Arg(this.yyastk[ this.stackPos-(2-2) ], true, attributes); 
};

PHP.Parser.prototype.yyn127 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn128 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn129 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn130 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn131 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn132 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn133 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn134 = function ( attributes ) {
     this.yyval = this.Node_Stmt_StaticVar(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), null, attributes); 
};

PHP.Parser.prototype.yyn135 = function ( attributes ) {
     this.yyval = this.Node_Stmt_StaticVar(this.yyastk[ this.stackPos-(3-1) ].substring( 1 ), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn136 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn137 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn138 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Property(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn139 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ClassConst(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn140 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ClassMethod(this.yyastk[ this.stackPos-(8-4) ], {'type':  this.yyastk[ this.stackPos-(8-1) ], 'byRef':  this.yyastk[ this.stackPos-(8-3) ], 'params':  this.yyastk[ this.stackPos-(8-6) ], 'stmts':  this.yyastk[ this.stackPos-(8-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn141 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUse(this.yyastk[ this.stackPos-(3-2) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn142 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn143 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn144 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn145 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn146 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Precedence(this.yyastk[ this.stackPos-(4-1) ][0], this.yyastk[ this.stackPos-(4-1) ][1], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn147 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Alias(this.yyastk[ this.stackPos-(5-1) ][0], this.yyastk[ this.stackPos-(5-1) ][1], this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-4) ], attributes); 
};

PHP.Parser.prototype.yyn148 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Alias(this.yyastk[ this.stackPos-(4-1) ][0], this.yyastk[ this.stackPos-(4-1) ][1], this.yyastk[ this.stackPos-(4-3) ], null, attributes); 
};

PHP.Parser.prototype.yyn149 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Alias(this.yyastk[ this.stackPos-(4-1) ][0], this.yyastk[ this.stackPos-(4-1) ][1], null, this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn150 = function ( attributes ) {
     this.yyval = array(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ]); 
};

PHP.Parser.prototype.yyn151 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn152 = function ( attributes ) {
     this.yyval = array(null, this.yyastk[ this.stackPos-(1-1) ]); 
};

PHP.Parser.prototype.yyn153 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn154 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn155 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn156 = function ( attributes ) {
     this.yyval = this.MODIFIER_PUBLIC; 
};

PHP.Parser.prototype.yyn157 = function ( attributes ) {
     this.yyval = this.MODIFIER_PUBLIC; 
};

PHP.Parser.prototype.yyn158 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn159 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn160 = function ( attributes ) {
     this.Stmt_Class_verifyModifier(this.yyastk[ this.stackPos-(2-1) ], this.yyastk[ this.stackPos-(2-2) ]); this.yyval = this.yyastk[ this.stackPos-(2-1) ] | this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn161 = function ( attributes ) {
     this.yyval = this.MODIFIER_PUBLIC; 
};

PHP.Parser.prototype.yyn162 = function ( attributes ) {
     this.yyval = this.MODIFIER_PROTECTED; 
};

PHP.Parser.prototype.yyn163 = function ( attributes ) {
     this.yyval = this.MODIFIER_PRIVATE; 
};

PHP.Parser.prototype.yyn164 = function ( attributes ) {
     this.yyval = this.MODIFIER_STATIC; 
};

PHP.Parser.prototype.yyn165 = function ( attributes ) {
     this.yyval = this.MODIFIER_ABSTRACT; 
};

PHP.Parser.prototype.yyn166 = function ( attributes ) {
     this.yyval = this.MODIFIER_FINAL; 
};

PHP.Parser.prototype.yyn167 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn168 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn169 = function ( attributes ) {
     this.yyval = this.Node_Stmt_PropertyProperty(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), null, attributes); 
};

PHP.Parser.prototype.yyn170 = function ( attributes ) {
     this.yyval = this.Node_Stmt_PropertyProperty(this.yyastk[ this.stackPos-(3-1) ].substring( 1 ), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn171 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn172 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn173 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn174 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn175 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn176 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignList(this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-6) ], attributes); 
};

PHP.Parser.prototype.yyn177 = function ( attributes ) {
     this.yyval = this.Node_Expr_Assign(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn178 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignRef(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn179 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignRef(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn180 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn181 = function ( attributes ) {
     this.yyval = this.Node_Expr_Clone(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn182 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignPlus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn183 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignMinus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn184 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignMul(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn185 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignDiv(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn186 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignConcat(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn187 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignMod(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn188 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignBitwiseAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn189 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignBitwiseOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn190 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignBitwiseXor(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn191 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignShiftLeft(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn192 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignShiftRight(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn193 = function ( attributes ) {
     this.yyval = this.Node_Expr_PostInc(this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn194 = function ( attributes ) {
     this.yyval = this.Node_Expr_PreInc(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn195 = function ( attributes ) {
     this.yyval = this.Node_Expr_PostDec(this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn196 = function ( attributes ) {
     this.yyval = this.Node_Expr_PreDec(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn197 = function ( attributes ) {
     this.yyval = this.Node_Expr_BooleanOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn198 = function ( attributes ) {
     this.yyval = this.Node_Expr_BooleanAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn199 = function ( attributes ) {
     this.yyval = this.Node_Expr_LogicalOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn200 = function ( attributes ) {
     this.yyval = this.Node_Expr_LogicalAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn201 = function ( attributes ) {
     this.yyval = this.Node_Expr_LogicalXor(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn202 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn203 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn204 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseXor(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn205 = function ( attributes ) {
     this.yyval = this.Node_Expr_Concat(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn206 = function ( attributes ) {
     this.yyval = this.Node_Expr_Plus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn207 = function ( attributes ) {
     this.yyval = this.Node_Expr_Minus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn208 = function ( attributes ) {
     this.yyval = this.Node_Expr_Mul(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn209 = function ( attributes ) {
     this.yyval = this.Node_Expr_Div(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn210 = function ( attributes ) {
     this.yyval = this.Node_Expr_Mod(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn211 = function ( attributes ) {
     this.yyval = this.Node_Expr_ShiftLeft(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn212 = function ( attributes ) {
     this.yyval = this.Node_Expr_ShiftRight(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn213 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryPlus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn214 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryMinus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn215 = function ( attributes ) {
     this.yyval = this.Node_Expr_BooleanNot(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn216 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseNot(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn217 = function ( attributes ) {
     this.yyval = this.Node_Expr_Identical(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn218 = function ( attributes ) {
     this.yyval = this.Node_Expr_NotIdentical(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn219 = function ( attributes ) {
     this.yyval = this.Node_Expr_Equal(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn220 = function ( attributes ) {
     this.yyval = this.Node_Expr_NotEqual(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn221 = function ( attributes ) {
     this.yyval = this.Node_Expr_Smaller(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn222 = function ( attributes ) {
     this.yyval = this.Node_Expr_SmallerOrEqual(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn223 = function ( attributes ) {
     this.yyval = this.Node_Expr_Greater(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn224 = function ( attributes ) {
     this.yyval = this.Node_Expr_GreaterOrEqual(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn225 = function ( attributes ) {
     this.yyval = this.Node_Expr_Instanceof(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn226 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn227 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn228 = function ( attributes ) {
     this.yyval = this.Node_Expr_Ternary(this.yyastk[ this.stackPos-(5-1) ], this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn229 = function ( attributes ) {
     this.yyval = this.Node_Expr_Ternary(this.yyastk[ this.stackPos-(4-1) ], null, this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn230 = function ( attributes ) {
     this.yyval = this.Node_Expr_Isset(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn231 = function ( attributes ) {
     this.yyval = this.Node_Expr_Empty(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn232 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_Include", attributes); 
};

PHP.Parser.prototype.yyn233 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_IncludeOnce", attributes); 
};

PHP.Parser.prototype.yyn234 = function ( attributes ) {
     this.yyval = this.Node_Expr_Eval(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn235 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_Require", attributes); 
};

PHP.Parser.prototype.yyn236 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_RequireOnce", attributes); 
};

PHP.Parser.prototype.yyn237 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Int(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn238 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Double(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn239 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_String(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn240 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Array(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn241 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Object(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn242 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Bool(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn243 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Unset(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn244 = function ( attributes ) {
     this.yyval = this.Node_Expr_Exit(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn245 = function ( attributes ) {
     this.yyval = this.Node_Expr_ErrorSuppress(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn246 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn247 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn248 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn249 = function ( attributes ) {
     this.yyval = this.Node_Expr_ShellExec(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn250 = function ( attributes ) {
     this.yyval = this.Node_Expr_Print(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn251 = function ( attributes ) {
     this.yyval = this.Node_Expr_Closure({'static':  false, 'byRef':  this.yyastk[ this.stackPos-(9-2) ], 'params':  this.yyastk[ this.stackPos-(9-4) ], 'uses':  this.yyastk[ this.stackPos-(9-6) ], 'stmts':  this.yyastk[ this.stackPos-(9-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn252 = function ( attributes ) {
     this.yyval = this.Node_Expr_Closure({'static':  true, 'byRef':  this.yyastk[ this.stackPos-(10-3) ], 'params':  this.yyastk[ this.stackPos-(10-5) ], 'uses':  this.yyastk[ this.stackPos-(10-7) ], 'stmts':  this.yyastk[ this.stackPos-(10-9) ]}, attributes); 
};

PHP.Parser.prototype.yyn253 = function ( attributes ) {
     this.yyval = this.Node_Expr_New(this.yyastk[ this.stackPos-(3-2) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn254 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn255 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-3) ]; 
};

PHP.Parser.prototype.yyn256 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn257 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn258 = function ( attributes ) {
     this.yyval = this.Node_Expr_ClosureUse(this.yyastk[ this.stackPos-(2-2) ].substring( 1 ), this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn259 = function ( attributes ) {
     this.yyval = this.Node_Expr_FuncCall(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn260 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticCall(this.yyastk[ this.stackPos-(6-1) ], this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn261 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticCall(this.yyastk[ this.stackPos-(8-1) ], this.yyastk[ this.stackPos-(8-4) ], this.yyastk[ this.stackPos-(8-7) ], attributes); 
};

PHP.Parser.prototype.yyn262 = function ( attributes ) {
    
            if (this.yyastk[ this.stackPos-(4-1) ].type === "Node_Expr_StaticPropertyFetch") {
                this.yyval = this.Node_Expr_StaticCall(this.yyastk[ this.stackPos-(4-1) ].Class, this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-1) ].name, attributes), this.yyastk[ this.stackPos-(4-3) ], attributes);
            } else if (this.yyastk[ this.stackPos-(4-1) ].type === "Node_Expr_ArrayDimFetch") {
                var tmp = this.yyastk[ this.stackPos-(4-1) ];
                while (tmp.variable.type === "Node_Expr_ArrayDimFetch") {
                    tmp = tmp.variable;
                }

                this.yyval = this.Node_Expr_StaticCall(tmp.variable.Class, this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes);
                tmp.variable = this.Node_Expr_Variable(tmp.variable.name, attributes);
            } else {
                throw new Exception;
            }
          
};

PHP.Parser.prototype.yyn263 = function ( attributes ) {
     this.yyval = this.Node_Expr_FuncCall(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn264 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn265 = function ( attributes ) {
     this.yyval = this.Node_Name('static', attributes); 
};

PHP.Parser.prototype.yyn266 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn267 = function ( attributes ) {
     this.yyval = this.Node_Name(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn268 = function ( attributes ) {
     this.yyval = this.Node_Name_FullyQualified(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn269 = function ( attributes ) {
     this.yyval = this.Node_Name_Relative(this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn270 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn271 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn272 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn273 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn274 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn275 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn276 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn277 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn278 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn279 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn280 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn281 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn282 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn283 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn284 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn285 = function ( attributes ) {
     this.yyval = [this.Scalar_String_parseEscapeSequences(this.yyastk[ this.stackPos-(1-1) ], '`')]; 
};

PHP.Parser.prototype.yyn286 = function ( attributes ) {
     ; this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn287 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn288 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn289 = function ( attributes ) {
     this.yyval = this.Node_Scalar_LNumber(this.Scalar_LNumber_parse(this.yyastk[ this.stackPos-(1-1) ]), attributes); 
};

PHP.Parser.prototype.yyn290 = function ( attributes ) {
     this.yyval = this.Node_Scalar_DNumber(this.Scalar_DNumber_parse(this.yyastk[ this.stackPos-(1-1) ]), attributes); 
};

PHP.Parser.prototype.yyn291 = function ( attributes ) {
     this.yyval = this.Scalar_String_create(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn292 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_LineConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn293 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_FileConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn294 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_DirConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn295 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_ClassConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn296 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_TraitConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn297 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_MethodConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn298 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_FuncConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn299 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_NSConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn300 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String(this.Scalar_String_parseDocString(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-2) ]), attributes); 
};

PHP.Parser.prototype.yyn301 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String('', attributes); 
};

PHP.Parser.prototype.yyn302 = function ( attributes ) {
     this.yyval = this.Node_Expr_ConstFetch(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn303 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn304 = function ( attributes ) {
     this.yyval = this.Node_Expr_ClassConstFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn305 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryPlus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn306 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryMinus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn307 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn308 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn309 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn310 = function ( attributes ) {
     this.yyval = this.Node_Expr_ClassConstFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn311 = function ( attributes ) {
     ; this.yyval = this.Node_Scalar_Encapsed(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn312 = function ( attributes ) {
     ; this.yyval = this.Node_Scalar_Encapsed(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn313 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn314 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn315 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn316 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn317 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn318 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn319 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(3-3) ], this.yyastk[ this.stackPos-(3-1) ], false, attributes); 
};

PHP.Parser.prototype.yyn320 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(1-1) ], null, false, attributes); 
};

PHP.Parser.prototype.yyn321 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn322 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn323 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn324 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn325 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(6-2) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn326 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn327 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn328 = function ( attributes ) {
     this.yyval = this.Node_Expr_MethodCall(this.yyastk[ this.stackPos-(6-1) ], this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn329 = function ( attributes ) {
     this.yyval = this.Node_Expr_FuncCall(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn330 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn331 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn332 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn333 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn334 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn335 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn336 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn337 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn338 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticPropertyFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn339 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn340 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticPropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn341 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticPropertyFetch(this.yyastk[ this.stackPos-(6-1) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn342 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn343 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn344 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn345 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn346 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn347 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn348 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn349 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn350 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn351 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn352 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn353 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn354 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn355 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn356 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-3) ]; 
};

PHP.Parser.prototype.yyn357 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn358 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn359 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn360 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn361 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn362 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(3-3) ], this.yyastk[ this.stackPos-(3-1) ], false, attributes); 
};

PHP.Parser.prototype.yyn363 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(1-1) ], null, false, attributes); 
};

PHP.Parser.prototype.yyn364 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(4-4) ], this.yyastk[ this.stackPos-(4-1) ], true, attributes); 
};

PHP.Parser.prototype.yyn365 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(2-2) ], null, true, attributes); 
};

PHP.Parser.prototype.yyn366 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn367 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn368 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn369 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(2-1) ], this.yyastk[ this.stackPos-(2-2) ]]; 
};

PHP.Parser.prototype.yyn370 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn371 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-1) ].substring( 1 ), attributes), this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn372 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.Node_Expr_Variable(this.yyastk[ this.stackPos-(3-1) ].substring( 1 ), attributes), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn373 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn374 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn375 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.Node_Expr_Variable(this.yyastk[ this.stackPos-(6-2) ], attributes), this.yyastk[ this.stackPos-(6-4) ], attributes); 
};

PHP.Parser.prototype.yyn376 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn377 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn378 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn379 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};


/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */


PHP.Parser.prototype.Stmt_Namespace_postprocess = function( a ) {
  return a;  
};


PHP.Parser.prototype.Node_Stmt_Echo = function() {
    return {
        type: "Node_Stmt_Echo",
        exprs: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_If = function() {
    return {
        type: "Node_Stmt_If",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ].stmts,
        elseifs: arguments[ 1 ].elseifs,
        Else: arguments[ 1 ].Else || null,
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_For = function() {
    
    return {
        type: "Node_Stmt_For",
        init: arguments[ 0 ].init,
        cond: arguments[ 0 ].cond,
        loop: arguments[ 0 ].loop,
        stmts: arguments[ 0 ].stmts,
        attributes: arguments[ 1 ]
    };   

};

PHP.Parser.prototype.Node_Stmt_Function = function() {
    return {
        type: "Node_Stmt_Function",
        name: arguments[ 0 ],
        byRef: arguments[ 1 ].byRef,
        params: arguments[ 1 ].params,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Stmt_Class_verifyModifier = function() {
  

};

PHP.Parser.prototype.Node_Stmt_Class = function() {
    return {
        type: "Node_Stmt_Class",
        name: arguments[ 0 ],
        Type: arguments[ 1 ].type,
        Extends: arguments[ 1 ].Extends,
        Implements: arguments[ 1 ].Implements,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_ClassMethod = function() {
    return {
        type: "Node_Stmt_ClassMethod",
        name: arguments[ 0 ],
        Type: arguments[ 1 ].type,
        byRef: arguments[ 1 ].byRef,
        params: arguments[ 1 ].params,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_ClassConst = function() {
    return {
        type: "Node_Stmt_ClassConst",
        consts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Interface = function() {
    return {
        type: "Node_Stmt_Interface",
        name: arguments[ 0 ],
        Extends: arguments[ 1 ].Extends,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Throw = function() {
    return {
        type: "Node_Stmt_Throw",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Catch = function() {
    return {
        type: "Node_Stmt_Catch",
        Type: arguments[ 0 ],
        variable: arguments[ 1 ],
        stmts: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_TryCatch = function() {
    return {
        type: "Node_Stmt_TryCatch",
        stmts: arguments[ 0 ],
        catches: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Foreach = function() {
    return {
        type: "Node_Stmt_Foreach",
        expr: arguments[ 0 ],
        valueVar: arguments[ 1 ],
        keyVar: arguments[ 2 ].keyVar,
        byRef: arguments[ 2 ].byRef,
        stmts: arguments[ 2 ].stmts,
        attributes: arguments[ 3 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_While = function() {
    return {
        type: "Node_Stmt_While",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Do = function() {
    return {
        type: "Node_Stmt_Do",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Break = function() {
    return {
        type: "Node_Stmt_Break",
        num: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Continue = function() {
    return {
        type: "Node_Stmt_Continue",
        num: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Return = function() {
    return {
        type: "Node_Stmt_Return",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Case = function() {
    return {
        type: "Node_Stmt_Case",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Switch = function() {
    return {
        type: "Node_Stmt_Switch",
        cond: arguments[ 0 ],
        cases: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Else = function() {
   
    return {
        type: "Node_Stmt_Else",
        stmts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_ElseIf = function() {
    return {
        type: "Node_Stmt_ElseIf",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_InlineHTML = function() {
    return {
        type: "Node_Stmt_InlineHTML",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_StaticVar = function() {
    return {
        type: "Node_Stmt_StaticVar",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Static = function() {
    return {
        type: "Node_Stmt_Static",
        vars: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Global = function() {
    return {
        type: "Node_Stmt_Global",
        vars: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_PropertyProperty = function() {
    return {
        type: "Node_Stmt_PropertyProperty",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Property = function() {
    return {
        type: "Node_Stmt_Property",
        Type: arguments[ 0 ],
        props: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Unset = function() {
    return {
        type: "Node_Stmt_Unset",
        variables: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};
/*
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012
* @website http://hertzen.com
 */


PHP.Parser.prototype.Node_Expr_Variable = function( a ) {
    return {
        type: "Node_Expr_Variable",
        name: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };
};

PHP.Parser.prototype.Node_Expr_FuncCall = function() {

    return {
        type: "Node_Expr_FuncCall",
        func: arguments[ 0 ],
        args: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_MethodCall = function() {

    return {
        type: "Node_Expr_MethodCall",
        variable: arguments[ 0 ],
        name: arguments[ 1 ],
        args: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_StaticCall = function() {

    return {
        type: "Node_Expr_StaticCall",
        Class: arguments[ 0 ],
        func: arguments[ 1 ],
        args: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};


PHP.Parser.prototype.Node_Expr_Ternary = function() {

    return {
        type: "Node_Expr_Ternary",
        cond: arguments[ 0 ],
        If: arguments[ 1 ],
        Else: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignList = function() {

    return {
        type: "Node_Expr_AssignList",
        assignList: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Assign = function() {

    return {
        type: "Node_Expr_Assign",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignConcat = function() {

    return {
        type: "Node_Expr_AssignConcat",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMinus = function() {

    return {
        type: "Node_Expr_AssignMinus",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignPlus = function() {

    return {
        type: "Node_Expr_AssignPlus",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignDiv = function() {

    return {
        type: "Node_Expr_AssignDiv",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignRef = function() {

    return {
        type: "Node_Expr_AssignRef",
        variable: arguments[ 0 ],
        refVar: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMul = function() {

    return {
        type: "Node_Expr_AssignMul",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMod = function() {

    return {
        type: "Node_Expr_AssignMod",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Plus = function() {

    return {
        type: "Node_Expr_Plus",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Minus = function() {

    return {
        type: "Node_Expr_Minus",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Mul = function() {

    return {
        type: "Node_Expr_Mul",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Div = function() {

    return {
        type: "Node_Expr_Div",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Mod = function() {

    return {
        type: "Node_Expr_Mod",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Greater = function() {

    return {
        type: "Node_Expr_Greater",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Equal = function() {

    return {
        type: "Node_Expr_Equal",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_NotEqual = function() {

    return {
        type: "Node_Expr_NotEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Identical = function() {

    return {
        type: "Node_Expr_Identical",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_NotIdentical = function() {

    return {
        type: "Node_Expr_NotIdentical",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_GreaterOrEqual = function() {

    return {
        type: "Node_Expr_GreaterOrEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_SmallerOrEqual = function() {

    return {
        type: "Node_Expr_SmallerOrEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Concat = function() {

    return {
        type: "Node_Expr_Concat",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Smaller = function() {

    return {
        type: "Node_Expr_Smaller",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_PostInc = function() {

    return {
        type: "Node_Expr_PostInc",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PostDec = function() {

    return {
        type: "Node_Expr_PostDec",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PreInc = function() {

    return {
        type: "Node_Expr_PreInc",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PreDec = function() {

    return {
        type: "Node_Expr_PreDec",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Include = function() {
    return {
        expr: arguments[ 0 ],
        type: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };
};

PHP.Parser.prototype.Node_Expr_ArrayDimFetch = function() {

    return {
        type: "Node_Expr_ArrayDimFetch",
        variable: arguments[ 0 ],
        dim: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_StaticPropertyFetch = function() {

    return {
        type: "Node_Expr_StaticPropertyFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_ClassConstFetch = function() {

    return {
        type: "Node_Expr_ClassConstFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_StaticPropertyFetch = function() {

    return {
        type: "Node_Expr_StaticPropertyFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_ConstFetch = function() {

    return {
        type: "Node_Expr_ConstFetch",
        name: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_ArrayItem = function() {

    return {
        type: "Node_Expr_ArrayItem",
        value: arguments[ 0 ],
        key: arguments[ 1 ],
        byRef: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_Array = function() {

    return {
        type: "Node_Expr_Array",
        items: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PropertyFetch = function() {

    return {
        type: "Node_Expr_PropertyFetch",
        variable: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_New = function() {

    return {
        type: "Node_Expr_New",
        Class: arguments[ 0 ],
        args: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Print = function() {
    return {
        type: "Node_Expr_Print",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Exit = function() {
    return {
        type: "Node_Expr_Exit",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Cast_Bool = function() {
    return {
        type: "Node_Expr_Cast_Bool",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Int = function() {
    return {
        type: "Node_Expr_Cast_Int",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_String = function() {
    return {
        type: "Node_Expr_Cast_String",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Double = function() {
    return {
        type: "Node_Expr_Cast_Double",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Array = function() {
    return {
        type: "Node_Expr_Cast_Array",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Object = function() {
    return {
        type: "Node_Expr_Cast_Object",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_ErrorSuppress = function() {
    return {
        type: "Node_Expr_ErrorSuppress",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Isset = function() {
    return {
        type: "Node_Expr_Isset",
        variables: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};




PHP.Parser.prototype.Node_Expr_UnaryMinus = function() {
    return {
        type: "Node_Expr_UnaryMinus",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_UnaryPlus = function() {
    return {
        type: "Node_Expr_UnaryPlus",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Empty = function() {
    return {
        type: "Node_Expr_Empty",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanOr = function() {
    return {
        type: "Node_Expr_BooleanOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_LogicalOr = function() {
    return {
        type: "Node_Expr_LogicalOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_LogicalAnd = function() {
    return {
        type: "Node_Expr_LogicalAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_LogicalXor = function() {
    return {
        type: "Node_Expr_LogicalXor",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseAnd = function() {
    return {
        type: "Node_Expr_BitwiseAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseOr = function() {
    return {
        type: "Node_Expr_BitwiseOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseNot = function() {
    return {
        type: "Node_Expr_BitwiseNot",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanNot = function() {
    return {
        type: "Node_Expr_BooleanNot",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanAnd = function() {
    return {
        type: "Node_Expr_BooleanAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Instanceof = function() {

    return {
        type: "Node_Expr_Instanceof",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Clone = function() {

    return {
        type: "Node_Expr_Clone",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 20.7.2012 
* @website http://hertzen.com
 */



PHP.Parser.prototype.Scalar_LNumber_parse = function( a ) {
   
    return a;  
};

PHP.Parser.prototype.Scalar_DNumber_parse = function( a ) {
   
    return a;  
};

PHP.Parser.prototype.Scalar_String_parseDocString = function() {
    
    return '"' + arguments[ 1 ].replace(/([^"\\]*(?:\\.[^"\\]*)*)"/g, '$1\\"') + '"';
};


PHP.Parser.prototype.Node_Scalar_String = function( ) {
   
    return {
        type: "Node_Scalar_String",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Scalar_String_create = function( ) {
    return {
        type: "Node_Scalar_String",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Scalar_LNumber = function() {
   
    return {
        type: "Node_Scalar_LNumber",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};


PHP.Parser.prototype.Node_Scalar_DNumber = function() {
   
    return {
        type: "Node_Scalar_DNumber",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};


PHP.Parser.prototype.Node_Scalar_Encapsed = function() {
   
    return {
        type: "Node_Scalar_Encapsed",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name = function() {
   
    return {
        type: "Node_Name",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Param = function() {
   
    return {
        type: "Node_Param",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        Type: arguments[ 2 ],
        byRef: arguments[ 3 ],
        attributes: arguments[ 4 ]
    };  
  
};

PHP.Parser.prototype.Node_Arg = function() {
   
    return {
        type: "Node_Name",
        value: arguments[ 0 ],
        byRef: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  
  
};


PHP.Parser.prototype.Node_Const = function() {
   
    return {
        type: "Node_Const",
        name: arguments[ 0 ],
        value: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  
  
};


/* 
 * based on node-iniparser Copyright (c) 2009-2010 Jordy van Gelder <jordyvangelder@gmail.com>
 * The MIT License
 */


PHP.ini = function( contents ) {
    
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*"?(.*?)"?\s*$/,
        comment: /^\s*;.*$/
    },
    section = null,
    value = {};
    contents.toString().split(/\r\n|\r|\n/).forEach( function( line ) {
        var match;
        
        if ( regex.comment.test( line ) ){
            return;
            
        } else if ( regex.param.test( line ) ){
            
            match = line.match( regex.param );
            
            if ( section ) {
                value[ section ][ match[ 1 ] ] = match[ 2 ];
            }else{
                value[ match[ 1 ] ] = match[ 2 ];
            }
            
        } else if ( regex.section.test( line ) ){
            
            match = line.match( regex.section );
            value[ match[ 1 ] ] = {};
            section = match[ 1 ];
            
        } else if ( line.length === 0 && section ){
            section = null;
        }
        
    });
    
    return value;
    
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */


PHP.RAWPost = function( content ) {
    
    var lines = content.split(/\r\n|\r|\n/),
    CONTENT_TYPE = "Content-Type:",
    CONTENT_DISPOSITION = "Content-Disposition:",
    BOUNDARY = "boundary=",
    item,
    items = [],
    startCapture,
    itemValue,
    boundary,
    storedFiles = [],
    emptyFiles = [],
    totalFiles = 0,
    errors = [],
    post;
    
    
    function is( part, item ) {
        return ( part !== undefined && part.substring(0, item.length ) === item );
    }
 
    lines.forEach(function( line ){


        var parts = line.split(";")
        if ( boundary === line.replace(/-/g,"").trim()) {
            if ( item !== undefined ) {
                item.value = itemValue;
                items.push( item );
            }
            startCapture = false;
            itemValue = "";
            item = {};
        } else if ( is( parts[ 0 ], CONTENT_TYPE ) ) {
            
            if ( item !== undefined ) {
                item.contentType = parts[ 0 ].substring( CONTENT_TYPE.length ).trim();
            }
            
          
            
            parts[ 1 ] = ( parts[ 1 ] !== undefined ) ? parts[ 1 ].trim() : undefined;
            
            
            if (parts[ 0 ].substring( CONTENT_TYPE.length ).trim() === "multipart/form-data") {
                if ( is( parts[ 1 ], BOUNDARY) ) {

                  
                    var part = parts[ 1 ].split(",");
                    part = part[ 0 ];
               
                    boundary = part.substring( BOUNDARY.length ).replace(/[-]/g,"").trim(); 
              
                    // starts OR finishes with quotes
                    if (boundary.substring(0,1) === '"' || boundary.substr(-1,1) === '"') {
                        // starts AND finishes with quotes
                        if (boundary.substring(0,1) === '"' && boundary.substr(-1,1) === '"') {
                            boundary = boundary.substring(1, boundary.length - 1);
                        } else {
                            errors.push(["Invalid boundary in multipart/form-data POST data", PHP.Constants.E_WARNING, true]);
                        }
                    }
                
                } else {
                    errors.push(["Missing boundary in multipart/form-data POST data", PHP.Constants.E_WARNING, true]);
                }
            }
        } else if ( is( parts[ 0 ], CONTENT_DISPOSITION ) ) {
            if ( item !== undefined ) {
                item.contentDisposition = parts[ 0 ].substring( CONTENT_DISPOSITION.length ).trim();
                parts.shift();
                parts.forEach(function( part ){
                    var vals = part.split("=");
                
                    if ( vals.length === 2 ) {
                        var val = vals[ 1 ].trim();
                        val = val.replace( /\\\\/g,"\\"); 
                        if (/^('|").*('|")$/.test(val)) {
                            var quote = val.substring( 0, 1);
                            val = val.substring( 1, val.length - 1 ); 
                            val = val.replace( new RegExp("\\\\" + quote, "g"), quote);
                           
                        } 
                        
                        item[ vals[ 0 ].trim() ] = val;
                    }
                });
            }
            
            if ( parts.length === 0 && item !== undefined ) {
                item.garbled = true;
            }
            
        } else if ( startCapture ) {    
            if (line.length === 0 && itemValue !== undefined && itemValue.length > 0) {
                line =  "\n";
            }
            itemValue += line;
        } else {
            startCapture = true;
        }
        
       
        
        
    });
    
    if ( item !== undefined && Object.keys( item ).length > 0 ) {
        item.value = itemValue;
        item.contentType  = "";
        items.push( item );
    }
    


    
    return {
        Post: function() {
            var arr = {};
            items.forEach(function( item ){
                if ( item.filename === undefined ) {
                    
                    if ( item.garbled === true )  {
                        errors.push(["File Upload Mime headers garbled", PHP.Constants.E_WARNING, true]);
                        return;
                    } 
                    
                    arr[ item.name ] = item.value;
                }
            });
            post = arr;
            return arr;
        },  
        Files: function( max_filesize, max_files, path ) {
            var arr = {};
            items.forEach(function( item, index ){
  
                
                if ( item.filename !== undefined ) {
                    
                                  
                    
                    
                    if ( !/^[a-z0-9]+\[.*[a-z]+.*\]/i.test(item.name) ) {
                       
                        var error = 0;
                        if ( item.filename.length === 0 ) {
                            error = PHP.Constants.UPLOAD_ERR_NO_FILE;
                            
                        } else if (post.MAX_FILE_SIZE !== undefined && post.MAX_FILE_SIZE < item.value.length) {
                            error = PHP.Constants.UPLOAD_ERR_FORM_SIZE;
                            
                        } else if (item.value.length > max_filesize) {  
                            error = PHP.Constants.UPLOAD_ERR_INI_SIZE;
                            
                        } else if (item.contentType.length === 0) {
                            error = PHP.Constants.UPLOAD_ERR_PARTIAL;
                            
                        }
                        
                 
                        item.filename = item.filename.substring(item.filename.lastIndexOf("/") + 1); 
                        item.filename = item.filename.substring(item.filename.lastIndexOf("\\") + 1);
                         
                       
                        if ( /^[a-z0-9]+\[\d*\]/i.test(item.name) ) {
                          
                            if (!/^[a-z0-9]+\[\d*\]$/i.test(item.name)) {
                                // malicious input
                                return;
                            }
                            
                            var name = item.name.substring(0, item.name.indexOf("["));
                            //replace(/\[\]/g,"");
                            
                            if ( arr[ name ] === undefined ) {
                                arr[ name ] = {
                                    name: [],
                                    type: [],
                                    tmp_name: [],
                                    error: [],
                                    size: []
                                }
                            } 
                            
                            arr[ name ].name.push( item.filename );
                            arr[ name ].type.push( ( error ) ? "" :item.contentType );
                            arr[ name ].tmp_name.push( ( error ) ? "" : path + item.filename );
                            arr[ name ].error.push(  error );
                            arr[ name ].size.push( ( error ) ? 0 : item.value.length );
                            

                            
                        } else {
                            arr[ (item.name === undefined ) ? index : item.name ] = {
                                name: item.filename,
                                type: ( error ) ? "" : item.contentType,
                                tmp_name: ( error ) ? "" : path + item.filename,
                                error: error,
                                size: ( error ) ? 0 : item.value.length
                            }
                            
                           
                        }
                        
                        // store file
                        if ( !error ) {
                            if (item.value.length === 0) {
                                emptyFiles.push({
                                    real: (item.name === undefined ) ? index : item.name,
                                    name: path + item.filename, 
                                    content: item.value
                                });
                            } else {
                                storedFiles.push({
                                    name: path + item.filename, 
                                    content: item.value
                                });  
                                totalFiles++;
                            }
                            
                           
                        }
                    }
                }
            });
          
            while( totalFiles <  max_files && emptyFiles.length > 0) {
                var item = emptyFiles.shift();
                storedFiles.push( item );
                totalFiles++;
            }
            
            // no room
            emptyFiles.forEach(function( file ){

                var item = arr[ file.real ];
                item.error = 5;
                item.tmp_name = "";
                item.type = "";
                errors.push(["No file uploaded in Unknown on line 0", PHP.Constants.E_NOTICE ]);
                errors.push(["No file uploaded in Unknown on line 0", PHP.Constants.E_NOTICE ]);
                errors.push(["Uploaded file size 0 - file [" + file.real + "=" + item.name + "] not saved in Unknown on line 0", PHP.Constants.E_WARNING ]);

            });
          
            return arr;
        },
        WriteFiles: function( func ) {
            storedFiles.forEach( function( item ){
                              
                func( item.name, item.content );
            });
        },
        Error: function( func, file ) {
            errors.forEach(function( err ){
                func( err[ 0 ] + (( err[2] === true ) ? " in " + file : ""), err[1] );
            });
            
        },
        Raw: function() {
            lines = content.split(/\r\n|\r|\n/);
            lines.shift();
            lines.pop();
            return lines.join("\n");
        }
    };
    
 
    
};



PHP.VM = function( src, opts ) {

    var $ = PHP.VM.VariableHandler( this );

    var $$ = function( arg ) {

        var item = new PHP.VM.Variable( arg );
        item[ PHP.Compiler.prototype.NAV ] = true;

        return item;
    },
    COMPILER = PHP.Compiler.prototype,
    ENV = this;

    this.ENV = ENV;

    PHP.VM.Variable.prototype.ENV = ENV;

    ENV [ PHP.Compiler.prototype.FILESYSTEM ] = (opts.filesystem === undefined ) ? {} : opts.filesystem;

    // bind global variablehandler to ENV
    ENV[ PHP.Compiler.prototype.GLOBAL ] = $;

    ENV[ PHP.Compiler.prototype.CONSTANTS ] = PHP.VM.Constants( PHP.Constants, ENV );

    ENV.$ini = Object.create(opts.ini);

    ENV.$locale = {
        decimal_point: ".",
        thousands_sep: ","
    };

    ENV.$Included = (function(){

        var files = [];

        return {
            Include: function( file ) {
                files.push( file.toLowerCase() );
            },
            Included: function( file ) {
                return (files.indexOf( file.toLowerCase() ) !== -1)
            }
        }

    })();

    ENV.$Class = (function( declaredClasses ) {
        var classRegistry = {},
        COMPILER = PHP.Compiler.prototype,
        VARIABLE = PHP.VM.Variable.prototype,
        magicConstants = {},
        initiatedClasses = [],
        undefinedConstants = {},
        declaredClasses = [],
        autoloadedClasses = [],
        classHandler = new PHP.VM.Class( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants, declaredClasses );

        ENV[ COMPILER.MAGIC_CONSTANTS ] = function( constantName ) {
            return new PHP.VM.Variable( magicConstants[ constantName ] );
        };

        var methods =  {
            Shutdown: function() {

                initiatedClasses.forEach( function( classObj ) {
                    classObj[  COMPILER.CLASS_DESTRUCT ]( ENV, true );
                });

            },
            __autoload: function( name ) {

                if ( typeof ENV.__autoload === "function" && autoloadedClasses.indexOf( name.toLowerCase() ) === -1) {
                    autoloadedClasses.push( name.toLowerCase() )
                    ENV.__autoload( new PHP.VM.Variable( name ) );
                }

                return methods.Exists( name );
            },
            Inherits: function(  obj, name ) {
                do {
                    if ( obj[ COMPILER.CLASS_NAME ] === name) {
                        return true;
                    }

                    obj = Object.getPrototypeOf( obj );
                }

                while( obj !== undefined && obj instanceof PHP.VM.ClassPrototype );
                return false;
            },
            INew: function( name, exts, func ) {
                return classHandler( name, PHP.VM.Class.INTERFACE, exts, func );
            },
            DeclaredClasses: function() {
                return declaredClasses;
            },
            New: function() {
                return classHandler.apply( null, arguments );
            },
            Exists: function( name ) {
                return (classRegistry[ name.toLowerCase() ] !== undefined);
            },
            ConstantGet: function( className, state, constantName ) {

                if ( !/^(self|parent)$/i.test( className ) && classRegistry[ className.toLowerCase() ] === undefined ) {
                    if ( undefinedConstants[ className + "::" + constantName] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.CLASS_CONSTANT ] = true;
                        variable[ VARIABLE.REGISTER_GETTER ] = function() {
                            if (classRegistry[ className.toLowerCase() ] === undefined ) {
                                ENV[ COMPILER.ERROR ]( "Class '" + className + "' not found", PHP.Constants.E_ERROR, true );
                            }
                        }
                        variable[ VARIABLE.DEFINED ] = className + "::$" + constantName;
                        undefinedConstants[ className + "::" + constantName] = variable;

                    }

                    return undefinedConstants[ className + "::" + constantName];

                } else if ( /^(self|parent)$/i.test( className )) {

                    if (/^(self)$/i.test( className)) {

                        return (( typeof state === "function") ? state.prototype : state)[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );

                    } else {
                        return Object.getPrototypeOf( ( typeof state === "function") ? state.prototype : state )[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );
                    }


                } else {

                    return methods.Get(  className, state )[ COMPILER.CLASS_CONSTANT_FETCH ]( state, constantName );
                }

            },
            Get: function( className, state, isInterface ) {

                if ( !/^(self|parent)$/i.test( className ) ) {

                    if (classRegistry[ className.toLowerCase() ] === undefined && methods.__autoload( className ) === false ) {

                        ENV[ COMPILER.ERROR ]( (( isInterface === true) ? "Interface" :  "Class") + " '" + className + "' not found", PHP.Constants.E_ERROR, true );
                    }

                    if (state !== undefined) {
                        return classRegistry[ className.toLowerCase() ].prototype;
                    } else {
                        return classRegistry[ className.toLowerCase() ];
                    }
                } else if ( /^self$/i.test( className ) ) {
                    return state.prototype;
                //      return Object.getPrototypeOf( state );
                } else if ( /parent/i.test( className ) ) {
                    return Object.getPrototypeOf( state.prototype  );
                //   return Object.getPrototypeOf( Object.getPrototypeOf( state ) );
                } else {

            }



            }
        };

        return methods;
    })();

    ENV[ PHP.Compiler.prototype.RESOURCES ] = PHP.VM.ResourceManager( ENV );

    ENV.$Array = new PHP.VM.Array( ENV );
    var variables_order = this.$ini.variables_order;

    this.FUNCTION_REFS = {};
    $('php_errormsg').$ = new PHP.VM.Variable();

    ENV[ PHP.Compiler.prototype.FILE_PATH ] = PHP.Utils.Path( opts.SERVER.SCRIPT_FILENAME );

    this.OUTPUT_BUFFERS = [""];
    this.$obreset();
    this.$ErrorReset();
    this.$strict = "";
    this.INPUT_BUFFER = opts.RAW_POST;

    // todo add error reporting level parser

    if (isNaN( this.$ini.error_reporting - 0)) {
        var lvl = this.$ini.error_reporting;
        ["E_ERROR",
        "E_RECOVERABLE_ERROR",
        "E_WARNING",
        "E_PARSE" ,
        "E_NOTICE" ,
        "E_STRICT",
        "E_DEPRECATED",
        "E_CORE_ERROR",
        "E_CORE_WARNING",
        "E_COMPILE_ERROR",
        "E_COMPILE_WARNING",
        "E_USER_ERROR",
        "E_USER_WARNING",
        "E_USER_NOTICE",
        "E_USER_DEPRECATED",
        "E_ALL"].forEach(function( err ){
            lvl = lvl.replace(err, PHP.Constants[ err ]);
        });
        this.$ini.error_reporting = eval(lvl);


    }
    this.error_reporting(new PHP.VM.Variable( this.$ini.error_reporting ));




    $('$__FILE__').$ = opts.SERVER.SCRIPT_FILENAME;
    $('$__DIR__').$ = ENV[ PHP.Compiler.prototype.FILE_PATH ];

    var post_max_size;

    if (  (post_max_size = PHP.Utils.Filesize(this.$ini.post_max_size)) > opts.RAW_POST.length || post_max_size == 0 ) {
        if (this.$ini.enable_post_data_reading != 0) {
            $('_POST').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("P") !== -1 ) ? opts.POST : {} ).$;
            $('HTTP_RAW_POST_DATA').$ = opts.RAW_POST;
        } else {
            $('_POST').$ = PHP.VM.Array.fromObject.call( this, {} ).$;
        }
    } else {
        $('_POST').$ = PHP.VM.Array.fromObject.call( this, {} ).$;
        if (this.$ini.always_populate_raw_post_data == 1 ) {
            ENV[ PHP.Compiler.prototype.ERROR ]( "Unknown: POST Content-Length of " + opts.RAW_POST.length + " bytes exceeds the limit of " + post_max_size + " bytes in Unknown on line 0", PHP.Constants.E_WARNING );
            ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot modify header information - headers already sent in Unknown on line 0", PHP.Constants.E_WARNING );
        } else {
            ENV[ PHP.Compiler.prototype.ERROR ]( "POST Content-Length of " + opts.RAW_POST.length + " bytes exceeds the limit of " + post_max_size + " bytes in Unknown on line 0", PHP.Constants.E_WARNING );
        }
    }

    $('_GET').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("G") !== -1 ) ? opts.GET : {} ).$;


    $('_SERVER').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("S") !== -1 ) ? opts.SERVER : {} ).$;
    $('_FILES').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("P") !== -1 && this.$ini.enable_post_data_reading != 0 && this.$ini.file_uploads == 1 ) ? opts.FILES : {} ).$;

    $('_ENV').$ = PHP.VM.Array.fromObject.call( this, ( variables_order.indexOf("E") !== -1 ) ? {} : {} ).$;


    var staticHandler = {}, staticVars = {};

    PHP.Utils.StaticHandler( staticHandler, staticVars, $, $ );

    this.$Static = staticHandler;

    Object.keys( PHP.VM.Class.Predefined ).forEach(function( className ){
        PHP.VM.Class.Predefined[ className ]( ENV, $$ );
    });

    //$('GLOBALS').$ = new (ENV.$Class.Get("__Globals"))( this );

    var obj = {};

    obj[ COMPILER.DIM_FETCH ] = function( ctx, variable ) {
        return $( variable[ COMPILER.VARIABLE_VALUE ] );
    };



    $('GLOBALS', obj);

    var shutdown = false;
    ENV[ COMPILER.TIMER ] = function(){
        if ( Date.now() > this.start + (this.$ini.max_execution_time - 0)*1000) {

            if (this.$ini.display_errors != 0) {
                this.$ob( "\nFatal error: Maximum execution time of " + this.$ini.max_execution_time + " second exceeded in " + $('$__FILE__').$ + " on line 1\n");

            }
            if (shutdown === false ){
                shutdown = true;
                this.$obflush.call( ENV );
                this.$shutdown.call( ENV );
            }

            // we aint killing it always with a single throw?? todo examine why
            throw Error;
            throw Error;
            throw Error;
            throw Error;
        }
    }.bind(this);

    this.Run = function() {
        this.start = Date.now();

        if ( false ) {


            var exec = new Function( "$$", "$", "ENV", "$Static", src  );
            exec.call(this, $$, $, ENV, staticHandler);


        } else {
            try {


                var exec = new Function( "$$", "$", "ENV", "$Static", src  );
                exec.call(this, $$, $, ENV, staticHandler);
                if (shutdown === false ){
                    shutdown = true;
                    this.$obflush.call( ENV );
                    this.$shutdown.call( ENV );
                }

            } catch( e ) {
                var C = PHP.Constants;
                if ( e instanceof PHP.Halt) {
                    switch (e.level) {
                        case C.E_ERROR:
                            this.$ob( "\nFatal error: " + e.msg + e.lineAppend + "\n");
                            break;
                        case C.E_RECOVERABLE_ERROR:
                            this.$ob( "\nCatchable fatal error: " + e.msg + e.lineAppend + "\n");
                            break;
                    }
                }
            }
        }

        this.OUTPUT_BUFFER = this.$strict + this.OUTPUT_BUFFERS.join("");
    }.bind( this );


};

PHP.VM.prototype = new PHP.Modules();


/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 26.6.2012
 * @website http://hertzen.com
 */


PHP.VM.Class = function( ENV, classRegistry, magicConstants, initiatedClasses, undefinedConstants, declaredClasses ) {

    var methodPrefix = PHP.VM.Class.METHOD,
    methodArgumentPrefix = "_$_",
    propertyPrefix = PHP.VM.Class.PROPERTY,
    methodTypePrefix = "$£",
    methodByRef = "__byRef",
    propertyTypePrefix = PHP.VM.Class.PROPERTY_TYPE,
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    __call = "__call",
    __set = "__set",
    __get = "__get",
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
    STATIC = "STATIC",
    ABSTRACT = "ABSTRACT",
    FINAL = "FINAL",
    INTERFACE = "INTERFACE",
    PROTECTED = "PROTECTED",
    __destruct = "__destruct",
    __construct = "__construct";


    // helper function for checking whether variable/method is of type
    function checkType( value, type) {
        if ( type === PUBLIC) {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]) || (value  === PHP.VM.Class[ STATIC ]);
        } else {
            return ((value & PHP.VM.Class[ type ]) === PHP.VM.Class[ type ]);
        }

    }

    // check if obj inherits className
    function inherits( obj, name ) {
        return ENV.$Class.Inherits( obj, name );
    }

    var buildVariableContext = function( methodName, args, className, realName, ctx ) {

        var $ = PHP.VM.VariableHandler( ENV ),
        argumentObj = this[ methodArgumentPrefix + methodName ];

        if ( Array.isArray(argumentObj) ) {
            argumentObj.forEach( function( argObject, index  ) {


                var arg = $( argObject.name );

                PHP.Utils.ArgumentHandler( ENV, arg, argObject, args[ index ], index, className + "::" + realName );
            /*

                // assign arguments to correct variable names
                if ( args[ index ] !== undefined ) {


                    if ( args[ index ] instanceof PHP.VM.VariableProto) {
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = args[ index ][ COMPILER.VARIABLE_VALUE ];
                    } else {
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = args[ index ];
                    }
                } else {
                    // no argument passed for the specified index

                    if ( arg[ COMPILER.PROPERTY_DEFAULT ] !== undefined ) {
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = arg[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
                    } else {
                        $( arg.name )[ COMPILER.VARIABLE_VALUE ] = (new PHP.VM.Variable())[ COMPILER.VARIABLE_VALUE ];
                    }
                }


                // perform type hint check

                if ( arg[ COMPILER.PROPERTY_TYPE ] !== undefined ) {
                    ENV[ COMPILER.TYPE_CHECK ]( $( arg.name ), arg[ COMPILER.PROPERTY_TYPE ], arg[ COMPILER.PROPERTY_DEFAULT ], index, className + "::" + realName );
                }

                 */


            });
        }

        $("GLOBALS", ENV[ COMPILER.GLOBAL ]( "GLOBALS" ));

        $("$__CLASS__")[ COMPILER.VARIABLE_VALUE ] = className;
        $("$__FUNCTION__")[ COMPILER.VARIABLE_VALUE ] = realName;
        $("$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = className + "::" + realName;

        if ( ctx !== false ) {
            $("this")[ COMPILER.VARIABLE_VALUE ] = ( ctx !== undefined ) ? ctx : this;
        }

        return $;
    }



    return function() {

        var className = arguments[ 0 ],
        classType = arguments[ 1 ],
        opts = arguments[ 2 ],
        classDefinition = arguments[ 3 ],
        DECLARED = false,
        staticVars = {},
        props = {},

        callMethod = function( methodName, args, variablesCallback ) {
            var $ = buildVariableContext.call( this, methodName, args, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ], this[ PHP.VM.Class.METHOD_REALNAME + methodName ], (checkType( this[ methodTypePrefix + methodName ], STATIC )) ? false : this );

            if (staticVars[ methodName ] === undefined) {
                staticVars[ methodName ] = {};
            }

            Object.keys( staticVars[ methodName ] ).forEach(function( key ){

                $( key, staticVars[ methodName ][ key ] );
            });

            var staticHandler = {};
            PHP.Utils.StaticHandler.call( this, staticHandler, staticVars, $, ENV[ COMPILER.GLOBAL ] );

            if (variablesCallback !== undefined ) {
                variablesCallback();
            }

            return this[ methodPrefix + methodName ].call( this, $, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ], staticHandler );
        };

        var Class = function( ctx ) {
            Object.keys( props ).forEach(function( propertyName ){

                if ( checkType(this[propertyTypePrefix + propertyName], STATIC)) {
                // static, so refer to the one and only same value defined in actual prototype
                } else {
                    if ( Array.isArray( props[ propertyName ] ) ) {
                        this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( [] );
                    } else {
                        this[ propertyPrefix + propertyName ] = new PHP.VM.Variable( props[ propertyName ] );
                    }
                }

                this [ PHP.VM.Class.CLASS_PROPERTY + className + "_" + propertyPrefix + propertyName] = this[ propertyPrefix + propertyName ];
            }, this);


            var callConstruct = function( $this, name, args, ctx ) {

                if ( checkType( $this[ methodTypePrefix + name ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + name ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + $this[ PHP.VM.Class.METHOD_PROTOTYPE + name ][ COMPILER.CLASS_NAME ] + "::" + name + "() from invalid context", PHP.Constants.E_ERROR, true );
                }

                if ( checkType( this[ methodTypePrefix + name ], PROTECTED) && (!( ctx instanceof PHP.VM.ClassPrototype) || !inherits( ctx, this[ COMPILER.CLASS_NAME ] ))) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + className + "::" + name + "() from invalid context", PHP.Constants.E_ERROR, true );
                }

                this[ PHP.VM.Class.KILLED ] = true;
                var ret = callMethod.call( $this, name, Array.prototype.slice.call( args, 1 ) );
                this[ PHP.VM.Class.KILLED ] = undefined;
                return ret;
            }.bind( this );

            // call constructor

            if ( ctx !== true ) {
                // check if we are extending class, i.e. don't call constructors
                if ( !/^(ArrayObject|__Globals)$/i.test( className ) ) {
                    Object.keys(undefinedConstants).forEach(function( itm ){
                        var parts = itm.split("::");
                        if (!this.$Class.Exists( parts[ 0 ])) {
                            ENV[ PHP.Compiler.prototype.ERROR ]( "Class '" + parts[0] + "' not found", PHP.Constants.E_ERROR, true );
                        }
                    }, ENV);
                    undefinedConstants = [];
                }

                this[ COMPILER.CLASS_STORED ] = []; // variables that store an instance of this class, needed for destructors


                // make sure we aren't initiating an abstract class
                if (checkType( this[ COMPILER.CLASS_TYPE ], ABSTRACT ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot instantiate abstract class " + className, PHP.Constants.E_ERROR, true );
                }

                // make sure we aren't initiating an interface
                if (checkType( this[ COMPILER.CLASS_TYPE ], INTERFACE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot instantiate interface " + className, PHP.Constants.E_ERROR, true );
                }

                // register new class initiated into registry (for destructors at shutdown)
                if ( className !== "ArrayObject") {
                    initiatedClasses.push ( this );

                    this[ PHP.VM.Class.CLASS_INDEX ] = initiatedClasses.length;
                }

                // PHP 5 style constructor in current class
                if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + __construct  ) ) {
                    return callConstruct( this, __construct, arguments, ctx );
                }

                // PHP 4 style constructor in current class

                else if ( Object.getPrototypeOf( this ).hasOwnProperty(  methodPrefix + className.toLowerCase()  ) ) {
                    return callConstruct( this, className.toLowerCase(), arguments, ctx  );
                }

                // PHP 5 style constructor in any inherited class

                else if ( typeof this[ methodPrefix + __construct ] === "function" ) {
                    return callConstruct( this, __construct, arguments, ctx  );
                }

                // PHP 4 style constructor in any inherited class

                else {
                    var proto = this;

                    while ( ( proto = Object.getPrototypeOf( proto ) ) instanceof PHP.VM.ClassPrototype ) {

                        if ( proto.hasOwnProperty( methodPrefix + proto[ COMPILER.CLASS_NAME  ].toLowerCase() ) ) {
                            return callConstruct( proto, proto[ COMPILER.CLASS_NAME  ].toLowerCase(), arguments, ctx  );
                        }


                    }

                }
            }



        },
        methods = {};

        /*
         * Declare class constant
         */
        methods [ COMPILER.CLASS_CONSTANT ] = function( constantName, constantValue ) {

            if ( classType === PHP.VM.Class.INTERFACE ) {
                Class.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName ){
                    if (ENV.$Class.Get( interfaceName ).prototype[ PHP.VM.Class.CONSTANT + constantName ] !== undefined ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot inherit previously-inherited or override constant " + constantName + " from interface " + interfaceName, PHP.Constants.E_ERROR, true );
                    }

                }, this);

            }

            if (  Class.prototype[ PHP.VM.Class.CONSTANT + className  + "$" + constantName] !== undefined ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot redefine class constant " + className + "::" + constantName, PHP.Constants.E_ERROR, true );
            }



            if ( undefinedConstants[ className + "::" + constantName] !== undefined ) {

                Class.prototype[ PHP.VM.Class.CONSTANT + constantName ] = undefinedConstants[ className + "::" + constantName];

                if ( constantValue[ VARIABLE.CLASS_CONSTANT ] ) {
                    // class constant referring another class constant, use reference
                    undefinedConstants[ className + "::" + constantName][ VARIABLE.REFERRING ] = constantValue;
                    undefinedConstants[ className + "::" + constantName][ VARIABLE.DEFINED ] = true;
                } else {
                    Class.prototype[ PHP.VM.Class.CONSTANT + constantName ][ COMPILER.VARIABLE_VALUE ] = constantValue[ COMPILER.VARIABLE_VALUE ];
                }


            } else {
                constantValue[ VARIABLE.CLASS_CONSTANT ] = true;
                Class.prototype[ PHP.VM.Class.CONSTANT + constantName ] = constantValue;
            }

            Class.prototype[ PHP.VM.Class.CONSTANT + className  + "$" + constantName] = Class.prototype[ PHP.VM.Class.CONSTANT + constantName ];

            if (Class.prototype[ PHP.VM.Class.CONSTANT + constantName ][ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Arrays are not allowed in class constants", PHP.Constants.E_ERROR, true );
            }

            return methods;
        };

        /*
         * Declare class property
         */

        methods [ COMPILER.CLASS_PROPERTY ] = function( propertyName, propertyType, propertyDefault ) {
            props[ propertyName ] = propertyDefault;

            // can't define members for interface
            if ( classType === PHP.VM.Class.INTERFACE ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Interfaces may not include member variables", PHP.Constants.E_ERROR, true );
            }

            if ( Class.prototype[ propertyTypePrefix + propertyName ] !== undefined &&  Class.prototype[ propertyTypePrefix + propertyName ] !== propertyType ) {
                // property has been defined in an inherited class and isn't of same type as newly defined one,
                // so let's make sure it is weaker or throw an error

                var type = Class.prototype[ propertyTypePrefix + propertyName ],
                inheritClass = Object.getPrototypeOf( Class.prototype )[ COMPILER.CLASS_NAME ];

                // redeclaring a (non-private) static as non-static
                if (!checkType( propertyType, STATIC ) && checkType( type, STATIC ) && !checkType( type, PRIVATE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot redeclare static " + inheritClass + "::$" + propertyName + " as non static " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                }

                // redeclaring a (non-private) non-static as static
                if (checkType( propertyType, STATIC ) && !checkType( type, STATIC ) && !checkType( type, PRIVATE ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot redeclare non static " + inheritClass + "::$" + propertyName + " as static " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                }

                if (!checkType( propertyType, PUBLIC ) ) {

                    if ( ( checkType( propertyType, PRIVATE ) || checkType( propertyType, PROTECTED ) ) && checkType( type, PUBLIC )  ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::$" + propertyName + " must be public (as in class " + inheritClass + ")", PHP.Constants.E_ERROR, true );
                    }

                    if ( ( checkType( propertyType, PRIVATE )  ) && checkType( type, PROTECTED )  ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::$" + propertyName + " must be protected (as in class " + inheritClass + ") or weaker", PHP.Constants.E_ERROR, true );
                    }

                }


            }



            if ( checkType( propertyType, STATIC )) {
                /*
                Object.defineProperty( Class.prototype,  propertyPrefix + propertyName, {
                    value: propertyDefault
                });
                 */
                Object.defineProperty( Class.prototype,  PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName, {
                    value: propertyDefault || new PHP.VM.Variable(null)
                });


            }




            Object.defineProperty( Class.prototype, propertyTypePrefix + propertyName, {
                value: propertyType
            });

            return methods;
        };

        /*
         * Declare method
         */

        methods [ COMPILER.CLASS_METHOD ] = function( realName, methodType, methodProps, byRef, methodFunc ) {

            /*
             * signature checks
             */
            var methodName = realName.toLowerCase();

            // can't override final
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "()", PHP.Constants.E_ERROR, true );
            }

            // can't override final php4 ctor extending php5 ctor
            if ( methodName === className.toLowerCase() && Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + __construct ] !== undefined && checkType( Class.prototype[ methodTypePrefix + __construct ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + __construct ][ COMPILER.CLASS_NAME ] + "::" + __construct + "() with " + className + "::" + realName + "()", PHP.Constants.E_ERROR, true );
            }

            var ctorProto = ( function( proto ){


                while ( ( proto = Object.getPrototypeOf( proto ) ) instanceof PHP.VM.ClassPrototype ) {

                    if ( proto.hasOwnProperty( methodPrefix + proto[ COMPILER.CLASS_NAME  ].toLowerCase() ) ) {
                        return proto;
                    }

                }

            })( Class.prototype );

            // can't override final php5 ctor extending php4 ctor
            if ( methodName === __construct && ctorProto !== undefined && checkType( ctorProto[ methodTypePrefix + ctorProto[ COMPILER.CLASS_NAME ].toLowerCase() ], FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot override final " + ctorProto[ COMPILER.CLASS_NAME ] + "::" + ctorProto[ COMPILER.CLASS_NAME ] + "() with " + className + "::" + realName + "()", PHP.Constants.E_ERROR, true );
            }

            // can't make static non-static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], STATIC ) && !checkType( methodType, STATIC ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() non static in class " + className, PHP.Constants.E_ERROR, true );
            }

            // can't make non-static  static
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && !checkType( Class.prototype[ methodTypePrefix + methodName ], STATIC ) && checkType( methodType, STATIC ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot make non static method " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() static in class " + className, PHP.Constants.E_ERROR, true );
            }

            // A final method cannot be abstract
            if ( checkType( methodType, ABSTRACT ) && checkType( methodType, FINAL ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot use the final modifier on an abstract class member", PHP.Constants.E_ERROR, true );
            }

            // abstract static warning
            if ( !checkType( classType, INTERFACE ) && checkType( methodType, STATIC ) && checkType( methodType, ABSTRACT ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Static function " + className + "::" + methodName + "() should not be abstract", PHP.Constants.E_STRICT, true );
            }

            // visibility from public
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], PUBLIC ) && (checkType( methodType, PROTECTED ) || checkType( methodType, PRIVATE ) ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::" + realName + "() must be public (as in class same)", PHP.Constants.E_ERROR, true );
            }
            // visibility from protected
            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined && checkType( Class.prototype[ methodTypePrefix + methodName ], PROTECTED ) && checkType( methodType, PRIVATE ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access level to " + className + "::" + realName + "() must be protected (as in class same) or weaker", PHP.Constants.E_ERROR, true );
            }

            // interface methods can't be private
            if ( classType === PHP.VM.Class.INTERFACE && checkType( methodType, PRIVATE ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access type for interface method " + className + "::" + realName + "() must be omitted", PHP.Constants.E_ERROR, true );
            }

            // Default value for parameters with a class type hint can only be NULL
            methodProps.forEach(function( prop ){
                if ( prop[ COMPILER.PROPERTY_TYPE ] !== undefined && prop[ COMPILER.PROPERTY_DEFAULT ] instanceof PHP.VM.Variable && !/^(string|array)$/i.test(prop[ COMPILER.PROPERTY_TYPE ]) && prop[ COMPILER.PROPERTY_DEFAULT ][ VARIABLE.TYPE] !== VARIABLE.NULL ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Default value for parameters with a class type hint can only be NULL", PHP.Constants.E_ERROR, true );
                }
            }, this);


            // __call
            if ( methodName === __call  ) {

                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + realName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }

                if ( !checkType( methodType, PUBLIC ) || checkType( methodType, STATIC ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "The magic method " + realName + "() must have public visibility and cannot be static", PHP.Constants.E_CORE_WARNING, true );
                }

            }

            // __get

            else if ( methodName === __get  ) {
                if ( methodProps.length !== 1 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + realName + "() must take exactly 1 argument", PHP.Constants.E_ERROR, true );
                }
            }

            // __set

            else if ( methodName === __set  ) {
                if ( methodProps.length !== 2 ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Method " + className + "::" + realName + "() must take exactly 2 arguments", PHP.Constants.E_ERROR, true );
                }
            }


            // strict standards checks

            if ( Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined ) {

                // method has been defined in an inherited class
                var propName,
                propDef,
                lastIndex = -1;
                if ( methodName !== __construct && (!Class.prototype[ methodArgumentPrefix + methodName ].every(function( item, index ){
                    propName = item;
                    lastIndex = index;

                    if ( (methodProps[ index ] !== undefined || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) ) {

                        if (methodProps[ index ] !== undefined) {

                            if ( item[ COMPILER.PROPERTY_TYPE ] === methodProps[ index ][ COMPILER.PROPERTY_TYPE ]  ) {

                                return true;
                            }
                        }
                    }
                    // or
                    if (item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) {
                        propDef = item[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];
                    }
                    return false;

                // return (( (methodProps[ index ] !== undefined || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) && methodProps[ index ] !== undefined && item[ COMPILER.PROPERTY_TYPE ] === methodProps[ index ][ COMPILER.PROPERTY_TYPE ]) || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined);
                //                                                                                                ^^ ^^^^^^ rechecking it on purpose
                }) || ( methodProps[ ++lastIndex ] !== undefined && methodProps[ lastIndex][ COMPILER.PROPERTY_DEFAULT ] === undefined) ) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Declaration of " + className + "::" + realName + "() should be compatible with " + Class.prototype[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "(" + ((  propName !== undefined ) ? ((propName[ COMPILER.PROPERTY_TYPE ] === undefined ) ? "" : propName[ COMPILER.PROPERTY_TYPE ] + " ") + "$" + propName.name : "" ) + (( propDef !== undefined) ? " = " + propDef : "") + ")", PHP.Constants.E_STRICT, true, true );
                }


            }


            // end signature checks

            Object.defineProperty( Class.prototype, PHP.VM.Class.METHOD_PROTOTYPE + methodName, {
                value: Class.prototype
            });

            Object.defineProperty( Class.prototype, PHP.VM.Class.METHOD_REALNAME + methodName, {
                value: realName
            });

            Object.defineProperty( Class.prototype, methodTypePrefix + methodName, {
                value: methodType
            });

            Object.defineProperty( Class.prototype, methodByRef  + methodName, {
                value: byRef
            });

            Object.defineProperty( Class.prototype, methodPrefix + methodName, {
                value: methodFunc,
                enumerable: true
            });

            Object.defineProperty( Class.prototype, methodArgumentPrefix + methodName, {
                value: methodProps
            });

            return methods;
        };

        methods [ COMPILER.CLASS_DECLARE ] = function() {

            if ( !checkType( classType, ABSTRACT ) ) {
                // make sure there are no abstract methods left undeclared

                if ( classType !== PHP.VM.Class.INTERFACE) {
                    Object.keys( Class.prototype ).forEach(function( item ){
                        if ( item.substring( 0, methodPrefix.length ) === methodPrefix ) {

                            var methodName = item.substring( methodPrefix.length );
                            if ( checkType( Class.prototype[ methodTypePrefix + methodName ], ABSTRACT ) ) {
                                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (" + className + "::" + methodName + ")", PHP.Constants.E_ERROR, true );
                            }

                        }
                    });

                    // interfaces

                    Class.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName ){

                        var interfaceProto = classRegistry[ interfaceName.toLowerCase() ].prototype;
                        Object.keys( interfaceProto ).forEach(function( item ){




                            if ( item.substring( 0, PHP.VM.Class.CONSTANT.length ) === PHP.VM.Class.CONSTANT ) {

                                if ( Class.prototype[ item ] !== undefined ) {
                                    Class.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName2 ){
                                        if ( interfaceName2 === interfaceName ) {
                                            if (ENV.$Class.Get( interfaceName2 ).prototype[ item ] !== undefined ) {
                                                ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot inherit previously-inherited or override constant " + item.substring( PHP.VM.Class.CONSTANT.length ) + " from interface " + interfaceName2, PHP.Constants.E_ERROR, true );
                                            }
                                        }
                                    }, this);
                                }

                                methods [ COMPILER.CLASS_CONSTANT ]( item.substring( PHP.VM.Class.CONSTANT.length ), interfaceProto[ item ] );
                            }




                            // method checks
                            if ( item.substring( 0, methodPrefix.length ) === methodPrefix ) {

                                var methodName = item.substring( methodPrefix.length ),
                                propName,
                                propDef,
                                lastIndex = -1;

                                if (Class.prototype[ methodTypePrefix + methodName ] === undefined ) {
                                    ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " contains 1 abstract method and must therefore be declared abstract or implement the remaining methods (" + interfaceName + "::" + methodName + ")", PHP.Constants.E_ERROR, true );
                                }

                                if ( methodName === __construct && interfaceProto[ methodTypePrefix + methodName ] !== undefined ||  interfaceProto[ methodTypePrefix + interfaceName.toLowerCase() ] !== undefined) {

                                    var methodProps = Class.prototype[ methodArgumentPrefix + __construct ];

                                    if ((!interfaceProto[ methodArgumentPrefix + __construct ].every(function( item, index ){

                                        propName = item;
                                        lastIndex = index;

                                        if ( (methodProps[ index ] !== undefined || item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) ) {

                                            if (methodProps[ index ] !== undefined) {

                                                if ( item[ COMPILER.PROPERTY_TYPE ] === methodProps[ index ][ COMPILER.PROPERTY_TYPE ]  ) {

                                                    return true;
                                                }
                                            }
                                        }
                                        if (item[ COMPILER.PROPERTY_DEFAULT ] !== undefined) {
                                            propDef = item[ COMPILER.PROPERTY_DEFAULT ][ COMPILER.VARIABLE_VALUE ];

                                        }

                                        return false;

                                    }) || ( methodProps[ ++lastIndex ] !== undefined && methodProps[ lastIndex][ COMPILER.PROPERTY_DEFAULT ] === undefined) ) ) {
                                        ENV[ PHP.Compiler.prototype.ERROR ]( "Declaration of " + className + "::" + __construct + "() must be compatible with " + interfaceName + "::" + __construct + "(" + ((  propName !== undefined ) ? ((propName[ COMPILER.PROPERTY_TYPE ] === undefined ) ? "" : propName[ COMPILER.PROPERTY_TYPE ] + " ") + "$" + propName.name : "" ) + (( propDef !== undefined) ? " = " + propDef : "") + ")", PHP.Constants.E_ERROR, true );
                                    }


                                }
                            }
                        });

                    });
                }


            }


            DECLARED = true;

            if ( classType !== PHP.VM.Class.INTERFACE ) {
                declaredClasses.push( className );
            }

            return Class;
        };


        /*
         * Extends and implements
         */

        if (opts.Extends  !== undefined) {

            var Extends = ENV.$Class.Get( opts.Extends );

            if ( Extends.prototype[ COMPILER.CLASS_TYPE ] === PHP.VM.Class.INTERFACE ) {
                // can't extend interface
                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " cannot extend from interface " + opts.Extends, PHP.Constants.E_ERROR, true );

            } else if ( checkType(Extends.prototype[ COMPILER.CLASS_TYPE ], FINAL ) ) {
                // can't extend final class
                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " may not inherit from final class (" + opts.Extends + ")", PHP.Constants.E_ERROR, true );

            }

            Class.prototype = new Extends( true );
        } else {
            Class.prototype = new PHP.VM.ClassPrototype();

        }


        Class.prototype[ PHP.VM.Class.INTERFACES ] = (Class.prototype[ PHP.VM.Class.INTERFACES ] === undefined ) ? [] : Array.prototype.slice.call(Class.prototype[ PHP.VM.Class.INTERFACES ], 0);

        var pushInterface = function( interfaceName, interfaces, ignore ) {

            if ( interfaceName.toLowerCase() === "traversable" && ignore !== true && !/^iterato(r|raggregate)$/i.test( className ) ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Class " + className + " must implement interface Traversable as part of either Iterator or IteratorAggregate", PHP.Constants.E_ERROR, true );
            }



            if ( interfaces.indexOf( interfaceName ) === -1 ) {
                // only add interface if it isn't present already
                interfaces.push( interfaceName );
            }


        }

        if (opts.Implements !== undefined || classType === PHP.VM.Class.INTERFACE) {

            (( classType === PHP.VM.Class.INTERFACE) ? opts : opts.Implements).forEach(function( interfaceName ){

                var Implements = ENV.$Class.Get( interfaceName, undefined, true );

                if ( Implements.prototype[ COMPILER.CLASS_TYPE ] !== PHP.VM.Class.INTERFACE ) {
                    // can't implement non-interface
                    ENV[ PHP.Compiler.prototype.ERROR ]( className + " cannot implement " + interfaceName + " - it is not an interface", PHP.Constants.E_ERROR, true );
                }

                pushInterface( interfaceName, Class.prototype[ PHP.VM.Class.INTERFACES ] );

                // add interfaces from interface

                Implements.prototype[ PHP.VM.Class.INTERFACES ].forEach( function( interfaceName ) {
                    pushInterface( interfaceName, Class.prototype[ PHP.VM.Class.INTERFACES ], true );
                });

            });
        }


        Class.prototype[ COMPILER.CLASS_TYPE ] = classType;

        Class.prototype[ COMPILER.CLASS_NAME ] = className;

        Class.prototype[ COMPILER.METHOD_CALL ] = function( ctx, methodName ) {
            methodName = methodName.toLowerCase();
            var args = Array.prototype.slice.call( arguments, 2 ),
            value;

            if ( typeof this[ methodPrefix + methodName ] !== "function" ) {
                // no method with that name found

                if ( typeof this[ methodPrefix + __call ] === "function" ) {
                    // __call method defined, let's call that instead then


                    // determine which __call to use in case there are several defined
                    if ( ctx instanceof PHP.VM ) {
                        // normal call, use current context
                        value = callMethod.call( this, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    } else {
                        // static call, ensure current scope's __call() is favoured over the specified class's  __call()
                        value = ctx.callMethod.call( ctx, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    }

                    return (( value === undefined ) ? new PHP.VM.Variable() : value);

                }

            } else {

                if ( checkType( this[ methodTypePrefix + methodName ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {

                    // targeted function is private and inaccessible from current context,
                    // but let's make sure current context doesn't have it's own private method that has been overwritten
                    if ( !ctx instanceof PHP.VM.ClassPrototype ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] === undefined ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }

                } else if ( checkType( this[ methodTypePrefix + methodName ], PROTECTED ) ) {
                    // we are calling a protected method, let's see if we are inside it
                    if ( !( ctx instanceof PHP.VM.ClassPrototype) ) { // todo check actually parents as well
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + methodName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }
                }


            }



            // favor current context's private method
            if ( ctx instanceof PHP.VM.ClassPrototype &&
                ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ] !== undefined &&
                checkType( ctx[ methodTypePrefix + methodName ], PRIVATE ) &&
                ctx[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] === ctx[ COMPILER.CLASS_NAME ] ) {

                value = this.callMethod.call( ctx, methodName, args );

            } else {
                value = this.callMethod.call( this, methodName, args );

            }

            value = (( value === undefined ) ? new PHP.VM.Variable() : value);
            if (className !== "ArrayObject") {
                PHP.Utils.CheckRef.call( ENV, value, this[ methodByRef  + methodName ] );
            }
            return value;


        };

        Class.prototype.callMethod = callMethod;


        Class.prototype[  COMPILER.STATIC_CALL  ] = function( ctx, methodClass, realName ) {
            var methodName = realName.toLowerCase();
            var ret;
            var args = Array.prototype.slice.call( arguments, 3 );

            if ( typeof this[ methodPrefix + methodName ] !== "function" ) {
                // no method with that name found

                if ( typeof this[ methodPrefix + __call ] === "function" ) {
                    // __call method defined, let's call that instead then


                    // determine which __call to use in case there are several defined
                    if ( ctx instanceof PHP.VM ) {
                        // normal call, use current context
                        return callMethod.call( this, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    } else {
                        // static call, ensure current scope's __call() is favoured over the specified class's  __call()
                        return ctx.callMethod.call( ctx, __call, [ new PHP.VM.Variable( methodName ), new PHP.VM.Variable( PHP.VM.Array.fromObject.call( ENV, args ) ) ] );
                    }

                }

            } else {

                if ( checkType( this[ methodTypePrefix + methodName ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                } else if ( checkType( this[ methodTypePrefix + methodName ], PROTECTED ) ) {
                    // we are calling a protected method, let's see if we are inside it
                    if ( !( ctx instanceof PHP.VM.ClassPrototype) || !inherits( ctx, this[ COMPILER.CLASS_NAME ] ) ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }

                }



            }


            var methodToCall,
            methodCTX,
            $;
            var proto;



            if ( /^parent$/i.test( methodClass ) ) {
                proto = Object.getPrototypeOf( Object.getPrototypeOf( this ) );

            } else if ( /^self$/i.test( methodClass ) ) {
                proto = Object.getPrototypeOf( this );

            } else if ( methodClass !== className ){


                proto = Object.getPrototypeOf( this );
                while ( proto !== null && proto[ COMPILER.CLASS_NAME ] !== methodClass ) {
                    proto = Object.getPrototypeOf( proto );
                }

            }

            if ( proto !== undefined ) {
                methodToCall = proto[ methodPrefix + methodName ];
                methodCTX = proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ];

                $ = buildVariableContext.call( proto, methodName, args, methodCTX[ COMPILER.CLASS_NAME ], realName, (checkType( proto[ methodTypePrefix + methodName ], STATIC )) ? false : this );



                if ( checkType( proto[ methodTypePrefix + methodName ], PRIVATE ) && methodCTX[ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                    if ( methodName === __construct ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot call private " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + realName + "()", PHP.Constants.E_ERROR, true );
                    }

                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private method " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + realName + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );

                }

                if ( checkType( proto[ methodTypePrefix + methodName ], ABSTRACT ) ) {

                    ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot call abstract method " + methodCTX[ COMPILER.CLASS_NAME ] + "::" + realName + "()", PHP.Constants.E_ERROR, true );
                }

                if ( !checkType( proto[ methodTypePrefix + methodName ], STATIC ) && !/^(parent|self)$/i.test( methodClass ) && !inherits(ctx, proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ]) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Non-static method " + proto[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() should not be called statically", PHP.Constants.E_STRICT, true );
                }

                ret = methodToCall.call( this, $, methodCTX );


                PHP.Utils.CheckRef.call( ENV, ret, methodCTX[ methodByRef  + methodName ] );

                return ret;
            }



            ret = this.callMethod.call( this, methodName, args, function(){
                if ( !checkType( this[ methodTypePrefix + methodName ], STATIC ) && !/^(parent|self)$/i.test( methodClass ) && !inherits(ctx, this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ]) ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Non-static method " + this[ PHP.VM.Class.METHOD_PROTOTYPE + methodName ][ COMPILER.CLASS_NAME ] + "::" + realName + "() should not be called statically", PHP.Constants.E_STRICT, true );
                }

            }.bind(this));


            PHP.Utils.CheckRef.call( ENV, ret, this[ methodByRef  + methodName ] );


            return ret;

        };

        Class.prototype[ COMPILER.STATIC_PROPERTY_GET ] = function( ctx, propertyClass, propertyName, ref ) {

            var methodCTX;
            if ( /^self$/i.test( propertyClass ) ) {
                methodCTX = ctx;
            } else if ( /^parent$/i.test( propertyClass )) {
                methodCTX = Object.getPrototypeOf( ctx );
            } else {
                methodCTX = this;
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] === undefined ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Access to undeclared static property: " + methodCTX[ COMPILER.CLASS_NAME ] + "::$" + propertyName, PHP.Constants.E_ERROR, true );
            }


            if ( ref === true && !methodCTX.hasOwnProperty( PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName )) {
                methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ] = new PHP.VM.Variable();
                return methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ];
            }



            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ] !== undefined ) {
                return methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ];
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] !== undefined ) {

                return methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ];
            } else {

        //      return methodCTX[ propertyPrefix + propertyName ];
        }


        };


        Class.prototype[ COMPILER.CLASS_STATIC_PROPERTY_ISSET ] = function( ctx, propertyClass, propertyName ) {

            var methodCTX;
            if ( /^self$/i.test( propertyClass ) ) {
                methodCTX = ctx;
            } else if ( /^parent$/i.test( propertyClass )) {
                methodCTX = Object.getPrototypeOf( ctx );
            } else {
                methodCTX = this;
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] === undefined ) {
                return false;
            }




            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY_REF + propertyClass + "$" + propertyName ] !== undefined ) {
                return true;
            }

            if (methodCTX[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName ] !== undefined ) {

                return true;
            }

            return false;


        };

        Class.prototype[ COMPILER.CLASS_CONSTANT_FETCH ] = function( ctx, constantName ) {
            if ( this[ PHP.VM.Class.CONSTANT + constantName ] === undefined && DECLARED === true ) {
                ENV[ PHP.Compiler.prototype.ERROR ]( "Undefined class constant '" + constantName + "'", PHP.Constants.E_ERROR, true );
            } else if ( this[ PHP.VM.Class.CONSTANT + constantName ] === undefined ) {
                //  undefinedConstants
                if ( undefinedConstants[ className + "::" + constantName] === undefined ) {
                    var variable = new PHP.VM.Variable();
                    variable[ VARIABLE.CLASS_CONSTANT ] = true;
                    variable[ VARIABLE.DEFINED ] = className + "::$" + constantName;
                    undefinedConstants[ className + "::" + constantName] = variable;

                }

                return undefinedConstants[ className + "::" + constantName];
            }



            return this[ PHP.VM.Class.CONSTANT + constantName ];

        };

        Class.prototype[ COMPILER.CLASS_PROPERTY_ISSET ] = function( ctx, propertyName ) {
            if ( this[ propertyPrefix + propertyName ] === undefined || checkType( this[ propertyTypePrefix + propertyName ], STATIC )) {
                return false;
            } else {
                return true;
            }

        };

        Class.prototype[ COMPILER.CLASS_PROPERTY_GET ] = function( ctx, propertyName ) {

            if ( this[ propertyPrefix + propertyName ] === undefined && this[ PHP.VM.Class.CLASS_STATIC_PROPERTY + propertyName] === undefined ) {


                var obj = {}, props = {};

                // property set
                if ( this[ methodPrefix + __set ] !== undefined ) {
                    obj [ COMPILER.ASSIGN ] = function( value ) {

                        callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), value ] );
                        return value;
                    }.bind( this );
                }

                // Post inc ++
                // getting value

                obj [ VARIABLE.DEFINED ] = true;

                obj [ COMPILER.POST_INC ] = function() {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );


                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {

                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? ++value[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );
                        }
                        if ( value === undefined ) {
                            return new PHP.VM.Variable();
                        }
                        return value;

                    }
                }.bind( this );


                obj [ COMPILER.PRE_INC ] = function() {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );


                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {

                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? ++value[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );
                        }

                        return value;

                    }
                }.bind( this );

                obj [ COMPILER.ASSIGN_PLUS ] = function( combined ) {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );


                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {

                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? value[ COMPILER.VARIABLE_VALUE ] + combined[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );
                        }

                        return value;

                    }
                }.bind( this );

                obj [ COMPILER.CLASS_PROPERTY_GET ] = function() {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );

                        return value[ COMPILER.CLASS_PROPERTY_GET ].apply( value, arguments );
                    }

                }.bind( this );

                obj [ COMPILER.ASSIGN_MINUS ] = function( combined ) {

                    if ( this[ methodPrefix + __get ] !== undefined ) {

                        var value = callMethod.call( this, __get, [ new PHP.VM.Variable( propertyName ) ] );


                        // setting ++
                        if ( this[ methodPrefix + __set ] !== undefined ) {

                            callMethod.call( this, __set,  [ new PHP.VM.Variable( propertyName ), ( value instanceof PHP.VM.Variable ) ? value[ COMPILER.VARIABLE_VALUE ] - combined[ COMPILER.VARIABLE_VALUE ] : new PHP.VM.Variable( 1 ) ] );
                        }

                        return value;

                    }
                }.bind( this );


                var $this = this;
                // property get
                if ( this[ methodPrefix + __get ] !== undefined ) {

                    props[ COMPILER.VARIABLE_VALUE ] = {
                        get : function(){

                            if (obj.__get === undefined ) {
                                obj.__get = callMethod.call( $this, __get, [ new PHP.VM.Variable( propertyName ) ] );
                            }
                            return obj.__get[ COMPILER.VARIABLE_VALUE ];


                        }
                    };

                    props[ VARIABLE.TYPE ] = {
                        get: function() {

                            if (obj.__get === undefined ) {
                                obj.__get = callMethod.call( $this, __get, [ new PHP.VM.Variable( propertyName ) ] );
                            }
                            return obj.__get[ VARIABLE.TYPE ];
                        }

                    };

                    Object.defineProperties( obj, props );

                } else {



                    if ( this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.PROPERTY ] = true;
                        variable[ VARIABLE.DEFINED ] = className + "::$" + propertyName;

                        this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] = variable;

                        variable[ VARIABLE.REGISTER_SETTER ] = function() {
                            this[ propertyPrefix + propertyName ] = variable;
                        }.bind(this);



                        return variable;
                    } else {
                        return this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ];
                    }

                }
                return obj;


            } else {

                var checkPermissions = function( propertyPrefix ) {
                    if ( checkType( this[ propertyTypePrefix + propertyName ], PROTECTED ) && !(ctx instanceof PHP.VM.ClassPrototype) ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access protected property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                    }

                    if ( checkType( this[ propertyTypePrefix + propertyName ], PRIVATE ) && !(ctx instanceof PHP.VM.ClassPrototype) ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access private property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                    }

                    if (this[ propertyPrefix + propertyName ][ VARIABLE.DEFINED ] !== true && (!(ctx instanceof PHP.VM.ClassPrototype) || this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ] === undefined  )) {
                        if (!(ctx instanceof PHP.VM.ClassPrototype) && checkType( this[ propertyTypePrefix + propertyName ], PRIVATE )) {
                            ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot access private property " + className + "::$" + propertyName, PHP.Constants.E_ERROR, true );
                        }

                        if (checkType( this[ propertyTypePrefix + propertyName ], PROTECTED ) && ctx instanceof PHP.VM.ClassPrototype) {
                        // no change?
                        } else {
                            Object.getPrototypeOf(this)[ propertyTypePrefix + propertyName ] = 1;
                        }


                    }

                    if ( ctx instanceof PHP.VM.ClassPrototype && this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ] !== undefined ) {
                        // favor current context over object only if current context property is private
                        if ( checkType( ctx[ propertyTypePrefix + propertyName ], PRIVATE ) ) {
                            return this[ PHP.VM.Class.CLASS_PROPERTY + ctx[ COMPILER.CLASS_NAME ] + "_" + propertyPrefix + propertyName ];
                        }
                    }

                }.bind(this),
                ret;

                if ( this[ propertyPrefix + propertyName ] !== undefined ) {
                    ret = checkPermissions( propertyPrefix );

                    if (ret !== undefined ) {
                        return ret;
                    }

                }

                if ( checkType( this[ propertyTypePrefix + propertyName ], STATIC ) ) {



                    ret = checkPermissions( PHP.VM.Class.CLASS_STATIC_PROPERTY );
                    if (ret !== undefined ) {
                        return ret;
                    }

                    ENV[ PHP.Compiler.prototype.ERROR ]( "Accessing static property " + className + "::$" + propertyName + " as non static", PHP.Constants.E_STRICT, true );
                    if ( this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] === undefined ) {
                        var variable = new PHP.VM.Variable();
                        variable[ VARIABLE.PROPERTY ] = true;
                        variable[ VARIABLE.DEFINED ] = className + "::$" + propertyName;

                        this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ] = variable;

                        variable[ VARIABLE.REGISTER_SETTER ] = function() {
                            this[ propertyPrefix + propertyName ] = variable;
                        }.bind(this);



                        return variable;
                    } else {
                        if ( this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ][ VARIABLE.DEFINED ] !== true ) {
                            this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ][ VARIABLE.DEFINED ] = className + "::$" + propertyName;
                        }
                        return this[ PHP.VM.Class.CLASS_UNDEFINED_PROPERTY + propertyName ];
                    }
                }


                return this[ propertyPrefix + propertyName ];
            }


        };

        Class.prototype[  COMPILER.CLASS_CLONE  ] = function( ctx ) {

            var cloned = new (ENV.$Class.Get( this[ COMPILER.CLASS_NAME ] ))( true ),
            __clone = "__clone";
            cloned[ COMPILER.CLASS_STORED ] = []; // variables that store an instance of this class, needed for destructors

            // for...in, since we wanna go through the whole proto chain
            for (var prop in this) {
                if ( prop.substring(0, propertyPrefix.length) === propertyPrefix) {

                    if ( cloned[ prop ] === undefined ) {
                        cloned[ prop ] = new PHP.VM.Variable( this[ prop ][ COMPILER.VARIABLE_VALUE ] );
                    } else {
                        cloned[ prop ][ COMPILER.VARIABLE_VALUE ] = this[ prop ][ COMPILER.VARIABLE_VALUE ];
                    }
                }
            }

            if ( this[ methodPrefix + __clone ] !== undefined ) {


                if ( checkType( this[ methodTypePrefix + __clone ], PRIVATE ) && this[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {

                    // targeted function is private and inaccessible from current context,
                    // but let's make sure current context doesn't have it's own private method that has been overwritten
                    if ( !ctx instanceof PHP.VM.ClassPrototype ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ] === undefined ||
                        ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + this[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] + "::" + __clone + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }

                } else if ( checkType( this[ methodTypePrefix + __clone ], PROTECTED ) ) {
                    // we are calling a protected method, let's see if we are inside it
                    if ( !( ctx instanceof PHP.VM.ClassPrototype) ) { // todo check actually parents as well
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + this[ PHP.VM.Class.METHOD_PROTOTYPE + __clone ][ COMPILER.CLASS_NAME ] + "::" + __clone + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }
                }




                var $ = buildVariableContext.call( this, __clone, [], className, __clone, cloned );



                this[ methodPrefix + __clone ].call( this, $, Object.getPrototypeOf(this) );


            // cloned.callMethod.call( cloned, __clone );
            }








            return new PHP.VM.Variable( cloned );
        };


        Class.prototype[ COMPILER.CLASS_DESTRUCT ] = function( ctx, shutdown ) {
            // check if this class has been destructed already



            if ( this[ PHP.VM.Class.KILLED ] === true ) {
                return;
            }

            // go through all assigned class props to see if we have closure classes to be killed
            // for...in, since we wanna go through the whole proto chain
            for (var prop in this) {
                if ( prop.substring(0, propertyPrefix.length) === propertyPrefix) {
                    this[ prop ][ PHP.VM.Class.KILLED ] = true;
                }
            }


            if ( checkType( this[ methodTypePrefix + __destruct ], PRIVATE ) && ( !(ctx instanceof PHP.VM.ClassPrototype) || this[ PHP.VM.Class.METHOD_PROTOTYPE + __destruct ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ]  )) {

                // targeted function is private and inaccessible from current context,
                // but let's make sure current context doesn't have it's own private method that has been overwritten
                if ( !(ctx instanceof PHP.VM.ClassPrototype) ||
                    ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __destruct ] === undefined ||
                    ctx[ PHP.VM.Class.METHOD_PROTOTYPE + __destruct ][ COMPILER.CLASS_NAME ] !== ctx[ COMPILER.CLASS_NAME ] ) {

                    if ( shutdown === true ) {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "' during shutdown ignored in Unknown on line 0", PHP.Constants.E_WARNING );
                        return;
                    } else {
                        ENV[ PHP.Compiler.prototype.ERROR ]( "Call to private " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                    }
                }

            }


            if ( checkType( this[ methodTypePrefix + __destruct ], PROTECTED) && (!( ctx instanceof PHP.VM.ClassPrototype) || !inherits( ctx, this[ COMPILER.CLASS_NAME ] ))) {

                if ( shutdown === true ) {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "' during shutdown ignored in Unknown on line 0", PHP.Constants.E_WARNING );
                    return;
                } else {
                    ENV[ PHP.Compiler.prototype.ERROR ]( "Call to protected " + className + "::" + __destruct + "() from context '" + ((ctx instanceof PHP.VM.ClassPrototype) ? ctx[ COMPILER.CLASS_NAME ] : '') + "'", PHP.Constants.E_ERROR, true );
                }

            }


            this[ PHP.VM.Class.KILLED ] = true;

            if ( this[  methodPrefix + __destruct  ] !== undefined ) {
                return callMethod.call( this, __destruct, [] );
            }


        };

        // register class
        classRegistry[ className.toLowerCase() ] = Class;


        var constant$ = PHP.VM.VariableHandler();


        constant$("$__FILE__")[ COMPILER.VARIABLE_VALUE ] = "__FILE__";

        //   constant$("$__FILE__")[ COMPILER.VARIABLE_VALUE ] = ENV[ COMPILER.GLOBAL ]('_SERVER')[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( ENV, COMPILER.ARRAY_GET, 'SCRIPT_FILENAME' )[ COMPILER.VARIABLE_VALUE ];

        constant$("$__METHOD__")[ COMPILER.VARIABLE_VALUE ] = className;

        constant$("$__CLASS__")[ COMPILER.VARIABLE_VALUE ] = className;

        constant$("$__FUNCTION__")[ COMPILER.VARIABLE_VALUE ] = "";

        constant$("$__LINE__")[ COMPILER.VARIABLE_VALUE ] = 1;

        classDefinition.call( Class, methods, constant$, function( arg ) {
            var item = new PHP.VM.Variable( arg );
            item[ PHP.Compiler.prototype.NAV ] = true;
            item[ VARIABLE.INSTANCE ] = Class.prototype;

            return item;
        } );

        return methods;
    };



};
PHP.VM.Class.KILLED = "$Killed";

PHP.VM.ClassPrototype = function() {};

PHP.VM.Class.METHOD = "_";

PHP.VM.Class.METHOD_REALNAME = "€€";

PHP.VM.Class.CLASS_UNDEFINED_PROPERTY = "_£$";

PHP.VM.Class.CLASS_PROPERTY = "_£";

PHP.VM.Class.CLASS_STATIC_PROPERTY = "$_";

PHP.VM.Class.CLASS_STATIC_PROPERTY_REF = "Ö";

PHP.VM.Class.INTERFACES = "$Interfaces";

PHP.VM.Class.METHOD_PROTOTYPE = "$MP";

PHP.VM.Class.CONSTANT = "€";

PHP.VM.Class.PROPERTY = "$$";

PHP.VM.Class.PROPERTY_TYPE = "$£$";

PHP.VM.Class.CLASS_INDEX = "$CIndex";

PHP.VM.Class.Predefined = {};

PHP.VM.Class.PUBLIC = 1;
PHP.VM.Class.PROTECTED = 2;
PHP.VM.Class.PRIVATE = 4;
PHP.VM.Class.STATIC = 8;
PHP.VM.Class.ABSTRACT = 16;
PHP.VM.Class.FINAL = 32;
PHP.VM.Class.INTERFACE = 64;


/*
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 24.6.2012
 * @website http://hertzen.com
 */

PHP.VM.VariableHandler = function( ENV ) {

    var variables = {},
    methods = function( variableName, setTo ) {

        if ( setTo !== undefined ) {
            variables[ variableName ] = setTo;
            return methods;
        }

        if ( variables[ variableName ] === undefined ) {
            variables[ variableName ] = new PHP.VM.Variable();
            variables[ variableName ][ PHP.VM.Variable.prototype.DEFINED ] = variableName;
            variables[ variableName ].ENV = ENV;
            variables[ variableName ][ PHP.VM.Variable.prototype.NAME ] = variableName;
        }
        return variables[ variableName ];
    };

    return methods;
};

PHP.VM.VariableProto = function() {

    }

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    this[ VARIABLE.VARIABLE_TYPE ] = undefined;

    if ( arguments.length > 1 ) {
        // chaining, todo make it work for unlimited vars
        this[ COMPILER.VARIABLE_VALUE ] = arguments[ 0 ][ COMPILER.VARIABLE_VALUE ] = arguments[ 1 ][ COMPILER.VARIABLE_VALUE ];
    } else {
        var val = combinedVariable[ COMPILER.VARIABLE_VALUE ]; // trigger get
        if ( combinedVariable[ VARIABLE.TYPE ] === VARIABLE.ARRAY ) {
            // Array assignment always involves value copying. Use the reference operator to copy an array by reference.
            this[ COMPILER.VARIABLE_VALUE ] = val[ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  );

        } else {
            if (combinedVariable[ VARIABLE.TYPE ] === VARIABLE.NULL && this[ VARIABLE.TYPE ] === VARIABLE.OBJECT) {
                this.TMPCTX =   combinedVariable[ VARIABLE.INSTANCE ];
            }

            this[ COMPILER.VARIABLE_VALUE ] = val;
        }

        if ( combinedVariable[ VARIABLE.TYPE ] === VARIABLE.ARRAY || combinedVariable[ VARIABLE.TYPE ] === VARIABLE.OBJECT ) {
            this[ COMPILER.VARIABLE_VALUE ][ COMPILER.CLASS_STORED ].push( this );
        }


    }

    return this;

};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.INSTANCEOF ] = function( instanceName ) {

    var COMPILER = PHP.Compiler.prototype;

    var className,
    classObj = this[ COMPILER.VARIABLE_VALUE ];

    // search interfaces
    if ( classObj[ PHP.VM.Class.INTERFACES ].indexOf( instanceName ) !== -1 ) {

        return new PHP.VM.Variable( true );
    }

    // search parents
    do {
        className = classObj[ COMPILER.CLASS_NAME ];
        if (className === instanceName) {
            return new PHP.VM.Variable( true );
        }
        classObj = Object.getPrototypeOf( classObj );
    } while( className !== undefined );
    return new PHP.VM.Variable( false );

};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.CONCAT ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;

    return new PHP.VM.Variable( this[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] + "" + combinedVariable[ VARIABLE.CAST_STRING ][ COMPILER.VARIABLE_VALUE ] );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN_CONCAT ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    this.NO_ERROR = true;

    var val = this[ COMPILER.VARIABLE_VALUE ]; // trigger get

    if ( this[ this.TYPE ] === this.NULL ) {
        this[ COMPILER.VARIABLE_VALUE ] = "" + combinedVariable[ COMPILER.VARIABLE_VALUE ];
    } else {
        this[ COMPILER.VARIABLE_VALUE ] = val + "" + combinedVariable[ COMPILER.VARIABLE_VALUE ];
    }
    this.NO_ERROR = false;
    return this;
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN_PLUS ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    this[ COMPILER.VARIABLE_VALUE ] = (this[ COMPILER.VARIABLE_VALUE ] - 0) + (combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0);
    return this;
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ASSIGN_MINUS ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype;
    this[ COMPILER.VARIABLE_VALUE ] = this[ COMPILER.VARIABLE_VALUE ] - combinedVariable[ COMPILER.VARIABLE_VALUE ];
    return this;
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.ADD ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype,
    val1 = this[ COMPILER.VARIABLE_VALUE ],
    val2 = combinedVariable[ COMPILER.VARIABLE_VALUE ];

    if ( isNaN(val1 - 0) ) {
        val1 = 0;
    }

    if ( isNaN(val2 - 0) ) {
        val2 = 0;
    }

    return new PHP.VM.Variable( (val1 - 0) + (val2 - 0) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MUL ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) * ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.DIV ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype;

    var val = (this[ COMPILER.VARIABLE_VALUE ] - 0) / ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 );
    if ( val === Number.POSITIVE_INFINITY ) {
        this.ENV[ COMPILER.ERROR ]("Division by zero", PHP.Constants.E_WARNING, true );
        return new PHP.VM.Variable( );
    }
    return new PHP.VM.Variable( val );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MOD ] = function( combinedVariable ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) % ( combinedVariable[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.MINUS ] = function( combinedVariable, post ) {

    var COMPILER = PHP.Compiler.prototype;

    if ( post === true ) {
        var after = combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0,
        before = this[ COMPILER.VARIABLE_VALUE ] - 0;
        return new PHP.VM.Variable( before - after );

    } else {
        return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ] - 0) - ( combinedVariable[ COMPILER.VARIABLE_VALUE ] - 0 ) );
    }
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.METHOD_CALL ] = function() {

    var COMPILER = PHP.Compiler.prototype;

    return this[ COMPILER.VARIABLE_VALUE ][ PHP.Compiler.prototype.METHOD_CALL ].apply( this[ COMPILER.VARIABLE_VALUE ], arguments );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.BOOLEAN_NOT ] = function() {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( !(this[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.IDENTICAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) === ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.NOT_IDENTICAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) !== ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.EQUAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype,
    ARRAY = PHP.VM.Array.prototype,
    first = this,
    second = compareTo,
    cast;

    if ( first[ this.TYPE ] === this.OBJECT && second[ this.TYPE ] === this.OBJECT ) {
        cast = (first[ COMPILER.VARIABLE_VALUE ].Native === true || second[ COMPILER.VARIABLE_VALUE ].Native === true);
        if ( cast ) {
            first = first[ this.CAST_INT ];
            second = second[ this.CAST_INT ];
        }
    } else if ( first[ this.TYPE ] === this.ARRAY && second[ this.TYPE ] === this.ARRAY ) {
        var firstVals = first[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ],
        secondVals = second[ COMPILER.VARIABLE_VALUE ][ PHP.VM.Class.PROPERTY + ARRAY.VALUES ][ COMPILER.VARIABLE_VALUE ];

        if (firstVals.length !== secondVals.length) {
            return new PHP.VM.Variable( false );
        }

        var result = firstVals.every(function( val,index ){
            return (val[ COMPILER.VARIABLE_VALUE ] == secondVals[ index ][ COMPILER.VARIABLE_VALUE ]);
        });

        return new PHP.VM.Variable( result );

    }



    return new PHP.VM.Variable( (first[ COMPILER.VARIABLE_VALUE ]) == ( second[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.SMALLER_OR_EQUAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) <= ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.GREATER_OR_EQUAL ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) >= ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.SMALLER ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ COMPILER.VARIABLE_VALUE ]) < ( compareTo[ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.GREATER ] = function( compareTo ) {

    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ this.CAST_DOUBLE ][ COMPILER.VARIABLE_VALUE ]) > ( compareTo[ this.CAST_DOUBLE ][ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.VariableProto.prototype[ PHP.Compiler.prototype.BOOLEAN_OR ] = function( compareTo ) {
    var COMPILER = PHP.Compiler.prototype;
    return new PHP.VM.Variable( (this[ this.CAST_STRING ][ COMPILER.VARIABLE_VALUE ]) | ( compareTo[ this.CAST_STRING ][ COMPILER.VARIABLE_VALUE ]) );
};

PHP.VM.Variable = function( arg ) {

    var value,
    POST_MOD = 0,
    __toString = "__toString",
    COMPILER = PHP.Compiler.prototype,

    setValue = function( newValue ) {

        var prev = value;
        var setType = function( newValue ) {
            if (this[ this.OVERLOADED ] === undefined) {



                if ( newValue === undefined ) {
                    newValue = null;
                }

                if ( newValue instanceof PHP.VM.Variable ) {
                    newValue = newValue[ COMPILER.VARIABLE_VALUE ];
                }

                if ( typeof newValue === "string" ) {
                    this[ this.TYPE ] = this.STRING;
                } else if ( typeof newValue === "function" ) {
                    this[ this.TYPE ] = this.LAMBDA;
                } else if ( typeof newValue === "number" ) {
                    if ( newValue % 1 === 0 ) {
                        this[ this.TYPE ] = this.INT;
                    } else {
                        this[ this.TYPE ] = this.FLOAT;
                    }
                } else if ( newValue === null ) {
                    if ( this[ this.TYPE ] === this.OBJECT && value instanceof PHP.VM.ClassPrototype ) {

                        this[ PHP.VM.Class.KILLED ] = true;
                        if (value[ COMPILER.CLASS_STORED ].every(function( variable ){

                            return ( variable[ PHP.VM.Class.KILLED ] === true );
                        })) {
                            // all variable instances have been killed, can safely destruct

                            value[ COMPILER.CLASS_DESTRUCT ]( this.TMPCTX );
                        }

                    }

                    this[ this.TYPE ] = this.NULL;

                } else if ( typeof newValue === "boolean" ) {
                    this[ this.TYPE ] = this.BOOL;
                } else if ( newValue instanceof PHP.VM.ClassPrototype ) {
                    if ( newValue[ COMPILER.CLASS_NAME ] === PHP.VM.Array.prototype.CLASS_NAME ) {
                        this[ this.TYPE ] = this.ARRAY;

                    } else {

                        this[ this.TYPE ] = this.OBJECT;
                    }
                } else if ( newValue instanceof PHP.VM.Resource ) {
                    this[ this.TYPE ] = this.RESOURCE;
                } else {

                }
                this[ this.DEFINED ] = true;

                // is variable a reference
                if ( this[ this.REFERRING ] !== undefined ) {

                    this[ this.REFERRING ][ COMPILER.VARIABLE_VALUE ] = newValue;
                } else {

                    value = newValue;

                    // remove this later, debugging only
                    this.val = newValue;

                }
            }

        }.bind(this);
        setType( newValue );
        if ( typeof this[this.REGISTER_SETTER ] === "function" ) {
            var ret =  this[ this.REGISTER_SETTER ]( value );
            if ( ret === false ) {
                setType( prev );
                value = prev;
            }
        }

    }.bind( this ); // something strange going on with context in node.js?? iterators_2.phpt

    this.rand = Math.random();
    this.NO_ERROR = false;
    setValue.call( this, arg );


    if (this[ this.TYPE ] === this.INT) {
        this[ this.VARIABLE_TYPE ] = this.NEW_VARIABLE;
    }

    this[ COMPILER.VARIABLE_CLONE ] = function() {
        var variable;

        if ( this[ this.IS_REF ]) {
            return this;
        }

        switch( this[ this.TYPE ] ) {
            case this.NULL:
            case this.BOOL:
            case this.INT:
            case this.FLOAT:
            case this.STRING:
                variable = new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ] );
                break;
            case this.OBJECT:
            case this.RESOURCE:
                return this;
            case this.ARRAY:
                variable = new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( {}, COMPILER.ARRAY_CLONE  ) )
                break;
            default:
                return this;
        }

        variable[ this.REFERRING ] = this[ this.REFERRING ];




        return variable;

    };

    this [ this.REF ] = function( variable ) {

        if (this === variable) {
            /// hehehehehe referring yourself... results in thread lock
            return this;
        }
        if ( variable [ this.VARIABLE_TYPE ] === this.FUNCTION  ) {
            this.ENV[ COMPILER.ERROR ]("Only variables should be assigned by reference", PHP.Constants.E_STRICT, true );
            this[ COMPILER.ASSIGN ]( variable );
            return this;
        }

        var tmp = variable[ COMPILER.VARIABLE_VALUE ]; // trigger get

        // call setter incase we need to complete array push transaction
        if ( typeof this[this.REGISTER_SETTER ] === "function" ) {
            this[this.REGISTER_SETTER ]();
        }

        this[ this.REFERRING ] = variable;
        this[ this.DEFINED ] = true;

        variable[ this.IS_REF ] = true;

        return this;
    };

    this[ COMPILER.NEG ] = function() {
        return new PHP.VM.Variable(-this[ COMPILER.VARIABLE_VALUE ]);
    };

    this[ COMPILER.PRE_INC ] = function() {
        this[ COMPILER.VARIABLE_VALUE ]++;
        return this;
    };

    this[ COMPILER.PRE_DEC ] = function() {
        this[ COMPILER.VARIABLE_VALUE ]--;
        return this;
    };

    this[ COMPILER.POST_INC ] = function() {
        this.NO_ERROR = true;
        var tmp = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD

        if (this[ this.DEFINED ] !== true) {
            this[ COMPILER.VARIABLE_VALUE ] = 0;
        }

        this.NO_ERROR = false;
        POST_MOD++;
        this.POST_MOD = POST_MOD;
        return this;

    };


    this[ COMPILER.POST_DEC ] = function() {
        var tmp = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD
        POST_MOD--;
        this.POST_MOD = POST_MOD;
        return this;
    };




    this[ PHP.Compiler.prototype.UNSET ] = function() {

        setValue( null );
        this[ this.DEFINED ] = this[ this.NAME ];

        if ( this[ this.REFERRING ] !== undefined ) {
            this [ this.REFERRING ][ PHP.Compiler.prototype.UNSET ]();
        }
    };
    // property get proxy
    this[ COMPILER.CLASS_PROPERTY_GET ] = function( ctx, propertyName, funcCall ) {
        var val, $this = this;

        if ( this[ this.REFERRING ] !== undefined ) {
            $this = this [ this.REFERRING ];
        }

        if ($this[ this.TYPE ] !== this.OBJECT){

            val = new (this.ENV.$Class.Get("stdClass"))( this );

            if ($this[ this.TYPE ] === this.NULL ||
                ($this[ this.TYPE ] === this.BOOL && $this[ COMPILER.VARIABLE_VALUE ] === false) ||
                ($this[ this.TYPE ] === this.STRING && $this[ COMPILER.VARIABLE_VALUE ].length === 0)
                ) {
                if ( funcCall !== true ) {
                    if ( $this[ this.PROPERTY ] !== true ) {
                        this.ENV[ COMPILER.ERROR ]("Creating default object from empty value", PHP.Constants.E_WARNING, true );
                    }
                }
                $this[ COMPILER.VARIABLE_VALUE ] = val;
            } else {
                this.ENV[ COMPILER.ERROR ]("Attempt to assign property of non-object", PHP.Constants.E_WARNING, true );


            }

        } else {
            val =  $this[ COMPILER.VARIABLE_VALUE ];
        }
        return val[ COMPILER.CLASS_PROPERTY_GET ].apply( val, arguments );
    };

    Object.defineProperty( this, COMPILER.VARIABLE_VALUE,
    {
        get : function(){
            var $this = this,
            returning;
            if ( this[ this.REFERRING ] !== undefined ) {
                $this = this[this.REFERRING];
            }

            if ( typeof this[this.REGISTER_GETTER ] === "function" ) {
                var returned = this[ this.REGISTER_GETTER ]();
                if ( returned instanceof PHP.VM.Variable ) {
                    this[ this.TYPE ] = returned[ this.TYPE ];
                    this[ this.DEFINED ] = returned[ this.DEFINED ];
                    return returned[ COMPILER.VARIABLE_VALUE ];
                }

            }

            if ( $this[ this.DEFINED ] !== true && $this[ COMPILER.SUPPRESS ] !== true ) {

                if ( $this[ this.CONSTANT ] === true ) {
                    this.ENV[ COMPILER.ERROR ]("Use of undefined constant " + $this[ this.DEFINED ] + " - assumed '" + $this[ this.DEFINED ] + "'", PHP.Constants.E_CORE_NOTICE, true );
                    $this[ this.TYPE ] = this.STRING;

                    returning = $this[ this.DEFINED ];
                    $this[ COMPILER.VARIABLE_VALUE ] = $this[ this.DEFINED ];
                    $this[ this.DEFINED ] = true;

                    return returning;
                } else {
                    if (this.NO_ERROR !==  true ) {
                        this.ENV[ COMPILER.ERROR ]("Undefined " + ($this[ this.PROPERTY ] === true ? "property" : "variable") + ": " + $this[ this.DEFINED ], PHP.Constants.E_NOTICE, true );
                    }
                }
            }
            if ( this[ this.REFERRING ] === undefined ) {
                returning = value;
            } else {
                var referLoop = $this;

                while( referLoop[ this.REFERRING ] !== undefined ) {
                    referLoop = referLoop[ this.REFERRING ];
                }

                this[ this.TYPE ] = referLoop[ this.TYPE ];
                returning = $this[ COMPILER.VARIABLE_VALUE ];
            }

            // perform POST_MOD change

            if ( POST_MOD !== 0 ) {
                var setPOST_MOD = POST_MOD;
                POST_MOD = 0; // reset counter
                $this[ COMPILER.VARIABLE_VALUE ] += setPOST_MOD - 0;
            //     value = POST_MOD + (value - 0);

            }


            return returning;
        },
        set : setValue
    }
    );

    Object.defineProperty( this, this.CAST_BOOL,
    {
        get : function(){
            // http://www.php.net/manual/en/language.types.boolean.php#language.types.boolean.casting

            var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD

            switch( this[ this.TYPE ]) {
                case this.INT:
                case this.FLOAT:
                    if ( value === 0 ) {
                        return new PHP.VM.Variable( false );
                    } else {
                        return new PHP.VM.Variable( true );
                    }
                    break;

                case this.STRING:
                    if ( value.length === 0 || value === "0" ) {
                        return new PHP.VM.Variable( false );
                    } else {
                        return new PHP.VM.Variable( true );
                    }
                    break;

                case this.ARRAY:
                    if ( value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ].length === 0 ) {
                        return new PHP.VM.Variable( false );
                    } else {
                        return new PHP.VM.Variable( true );
                    }
                    break;

                case this.OBJECT:
                    // TODO
                    return new PHP.VM.Variable( true );

                case this.NULL:
                    return new PHP.VM.Variable( false );
                    break;
            }


            return this;
        }
    }
    );

    Object.defineProperty( this, this.CAST_INT,
    {
        get : function(){
            // http://www.php.net/manual/en/language.types.integer.php

            var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD


            switch ( this[ this.TYPE ] ) {

                case this.BOOL:
                    return new PHP.VM.Variable( ( value === true ) ? 1 : 0 );
                    break;

                case this.FLOAT:
                    return new PHP.VM.Variable( Math.floor( value ) );
                    break;
                case this.STRING:
                    if (isNaN( parseInt(value, 10))) {
                        return new PHP.VM.Variable( 0 );
                    } else {
                        return new PHP.VM.Variable( parseInt(value, 10) );
                    }
                    break;
                case this.OBJECT:
                    this.ENV[ COMPILER.ERROR ]("Object of class " + value[ COMPILER.CLASS_NAME ] + " could not be converted to int", PHP.Constants.E_NOTICE, true );
                    return new PHP.VM.Variable();
                    break;

                default:
                    return this;
            }

        }
    }
    );


    Object.defineProperty( this, this.CAST_DOUBLE,
    {
        get : function(){
            // http://www.php.net/manual/en/language.types.integer.php

            var value = this[ COMPILER.VARIABLE_VALUE ], // trigger get, incase there is POST_MOD
            ret;


            switch ( this[ this.TYPE ] ) {

                case this.BOOL:
                    return new PHP.VM.Variable( ( value === true ) ? 1.0 : 0.0 );
                    break;

                case this.INT:

                    ret =  new PHP.VM.Variable( parseFloat(value) );
                    ret[ this.TYPE ] = this.FLOAT;
                    return ret;
                    break;
                case this.STRING:
                    if (isNaN( parseFloat(value) ) ) {
                        ret = new PHP.VM.Variable( 0.0 );

                    } else {
                        ret =  new PHP.VM.Variable( parseFloat(value) );
                    }
                    ret[ this.TYPE ] = this.FLOAT;
                    return ret;
                    break;

                default:
                    return this;
            }

        }
    }
    );

    Object.defineProperty( this, this.CAST_STRING,
    {
        get : function() {
            //   http://www.php.net/manual/en/language.types.string.php#language.types.string.casting

            var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get, incase there is POST_MOD

            if ( value instanceof PHP.VM.ClassPrototype && value[ COMPILER.CLASS_NAME ] !== PHP.VM.Array.prototype.CLASS_NAME  ) {
                // class
                // check for __toString();



                if ( typeof value[PHP.VM.Class.METHOD + __toString.toLowerCase() ] === "function" ) {
                    try {
                        var val = value[ COMPILER.METHOD_CALL ]( this, __toString );
                    } catch( e ) {
                        this.ENV[ COMPILER.ERROR ]("Method " + value[ COMPILER.CLASS_NAME ] + "::" + __toString + "() must not throw an exception", PHP.Constants.E_ERROR, true, false, true );
                        return new PHP.VM.Variable("");
                    }
                    if (val[ this.TYPE ] !==  this.STRING) {
                        this.ENV[ COMPILER.ERROR ]("Method " + value[ COMPILER.CLASS_NAME ] + "::" + __toString + "() must return a string value", PHP.Constants.E_RECOVERABLE_ERROR, true );
                        return new PHP.VM.Variable("");
                    }
                    val[ this.VARIABLE_TYPE ] = this.FUNCTION;
                    return val;
                //  return new PHP.VM.Variable( value[PHP.VM.Class.METHOD + __toString ]() );
                } else {
                    this.ENV[ COMPILER.ERROR ]("Object of class " + value[ COMPILER.CLASS_NAME ] + " could not be converted to string", PHP.Constants.E_RECOVERABLE_ERROR, true );



                    return new PHP.VM.Variable("");
                }

            }
            else if (this[ this.TYPE ] === this.BOOL) {
                return new PHP.VM.Variable( ( value ) ? "1" : "" );
            } else if (this[ this.TYPE ] === this.INT) {
                return new PHP.VM.Variable(  value + "" );
            } else if (this[ this.TYPE ] === this.NULL) {
                return new PHP.VM.Variable( "" );
            }
            return this;
        }
    }
    );

    this[ COMPILER.DIM_UNSET ] = function( ctx, variable  ) {

        var value = this[ COMPILER.VARIABLE_VALUE ]; // trigger get

        if ( this[ this.TYPE ] !== this.ARRAY ) {
            if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                value[ COMPILER.METHOD_CALL ]( ctx, "offsetUnset", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetUnset
            }
        } else {

            value[ COMPILER.METHOD_CALL ]( ctx, "offsetUnset", variable );
        }



    };

    this[ COMPILER.DIM_ISSET ] = function( ctx, variable  ) {

        var $this = this;

        if ( this[ this.REFERRING ] !== undefined ) {

            var referLoop = $this;

            while( referLoop[ this.REFERRING ] !== undefined ) {
                referLoop = referLoop[ this.REFERRING ];
            }

            $this = referLoop;

        }

        if ( $this[ this.TYPE ] !== this.ARRAY ) {
            if ( $this[ this.TYPE ] === this.OBJECT && $this.val[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                var exists = $this.val[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists
                return exists;


            } else {

                return false;
            }
        }

        var returning = $this.val[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );

        return (returning[ this.DEFINED ] === true );

    };

    this[ COMPILER.DIM_EMPTY ] = function( ctx, variable  ) {

        if ( this[ this.TYPE ] !== this.ARRAY ) {

            if ( this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                var exists = value[ COMPILER.METHOD_CALL ]( ctx, "offsetExists", variable )[ COMPILER.VARIABLE_VALUE ]; // trigger offsetExists


                if ( exists === true ) {
                    var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ); // trigger offsetGet
                    return val;

                } else {
                    return true;
                }


            } else {
                // looking in a non-existant array, so obviously its empty
                return true;
            }
        } else {
            return this[ COMPILER.DIM_FETCH ]( ctx, variable);
        }



    };

    Object.defineProperty( this, COMPILER.DIM_FETCH,
    {
        get : function(){

            return function( ctx, variable ) {

                var $this = this;

                if ( variable instanceof PHP.VM.Variable && variable[ this.TYPE ] === this.OBJECT ) {
                    this.ENV[ COMPILER.ERROR ]("Illegal offset type", PHP.Constants.E_WARNING, true );
                    return new PHP.VM.Variable();
                }

                if ( typeof this[this.REGISTER_GETTER ] === "function" ) {
                    var returned = this[ this.REGISTER_GETTER ]();
                    if ( returned instanceof PHP.VM.Variable ) {

                        this[ this.TYPE ] = returned[ this.TYPE ];
                        this[ this.DEFINED ] = returned[ this.DEFINED ];
                        var item = returned[ COMPILER.DIM_FETCH ]( ctx, variable );
                        /*
                        if (returned[ this.OVERLOADING ] !== undefined) {
                            item[ this.OVERLOADED ] = returned[ this.OVERLOADING ];

                        }

                        item[ this.REGISTER_SETTER ] = function() {

                            if (item[ this.OVERLOADING ] !== undefined) {
                                this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + item[ this.OVERLOADING ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                                item[ this.OVERLOADED ] = item[ this.OVERLOADING ];
                            //   item[ this.OVERLOADED ] = returned[ this.OVERLOADING ];
                            }
                        }
                     */
                        return item;
                    }

                }

                if ( this[ this.TYPE ] === this.INT ) {
                    this.ENV[ COMPILER.ERROR ]("Cannot use a scalar value as an array", PHP.Constants.E_WARNING, true );
                    return new PHP.VM.Variable();
                } else if (this[ this.TYPE ] === this.STRING) {
                    if ( variable[ this.TYPE ] !== this.INT ) {
                        this.ENV[ COMPILER.ERROR ]("Illegal string offset '" + variable[ COMPILER.VARIABLE_VALUE ] + "'", PHP.Constants.E_WARNING, true );
                        return new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ] );
                    } else {
                        var ret = new PHP.VM.Variable( this[ COMPILER.VARIABLE_VALUE ].substr( variable[ COMPILER.VARIABLE_VALUE ], 1 ));

                        ret[ this.REGISTER_SETTER ] = function( value ) {
                            this[ COMPILER.VARIABLE_VALUE ] = this[ COMPILER.VARIABLE_VALUE ].substr( 0, variable[ COMPILER.VARIABLE_VALUE ] ) + value + this[ COMPILER.VARIABLE_VALUE ].substr( 1 + variable[ COMPILER.VARIABLE_VALUE ]);
                        }.bind( this );

                        return ret;
                    }
                }


                if ( this[ this.REFERRING ] !== undefined ) {
                    $this = this[this.REFERRING];
                }



                if ( $this[ this.TYPE ] !== this.ARRAY ) {
                    if ( $this[ this.TYPE ] === this.OBJECT && value[ PHP.VM.Class.INTERFACES ].indexOf("ArrayAccess") !== -1) {

                        var dimHandler = new PHP.VM.Variable();
                        dimHandler[ this.REGISTER_GETTER ] = function() {
                            var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                            val [ $this.OVERLOADING ] = value[ COMPILER.CLASS_NAME ];
                            if ( val[ this.DEFINED ] !== true ) {
                                this.ENV[ COMPILER.ERROR ]("Undefined " + (variable[ this.TYPE ] === this.INT ? "offset" : "index") + ": " + variable[ COMPILER.VARIABLE_VALUE ], PHP.Constants.E_CORE_NOTICE, true );
                                return new PHP.VM.Variable();
                            }

                            if ( val[ this.TYPE ] === this.ARRAY ) {

                                val[ COMPILER.VARIABLE_VALUE ][ this.REGISTER_ARRAY_SETTER ] = function() {

                                    this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + value[ COMPILER.CLASS_NAME ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                                    return false;
                                }.bind( val );
                            }

                            return val;
                        };

                        dimHandler[ this.REGISTER_SETTER ] = function( val ) {

                            if ( val === null ) {
                                this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + value[ COMPILER.CLASS_NAME ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                            }


                            var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_SET, variable, val );

                            if ( val[ this.DEFINED ] !== true ) {
                                this.ENV[ COMPILER.ERROR ]("Undefined " + (variable[ this.TYPE ] === this.INT ? "offset" : "index") + ": " + variable[ COMPILER.VARIABLE_VALUE ], PHP.Constants.E_CORE_NOTICE, true );
                                return new PHP.VM.Variable();
                            }
                            return val;
                        };

                        dimHandler[ COMPILER.POST_INC ] = function() {
                            var val = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable ); // trigger get
                            this.ENV[ COMPILER.ERROR ]("Indirect modification of overloaded element of " + value[ COMPILER.CLASS_NAME ] + " has no effect", PHP.Constants.E_CORE_NOTICE, true );
                            return val;
                        };

                        dimHandler[ this.REF ] = function() {
                            this.ENV[ PHP.Compiler.prototype.ERROR ]( "Cannot assign by reference to overloaded object", PHP.Constants.E_ERROR, true );
                        };

                        return dimHandler;
                    } else {

                        var notdefined = false;

                        // cache DEFINED value
                        if ( $this[ this.DEFINED ] !== true && $this[ COMPILER.SUPPRESS ] !== true ) {
                            notdefined = $this[ this.DEFINED ];
                        }

                        $this[ COMPILER.VARIABLE_VALUE ] = this.ENV.array([]);
                        if ( notdefined !== false ) {
                            $this[ this.DEFINED ] = notdefined;
                        }
                    }
                }

                var returning;
                if ( value === null ) {
                    returning = this[ COMPILER.VARIABLE_VALUE ][ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                } else {
                    returning = value[ COMPILER.METHOD_CALL ]( ctx, COMPILER.ARRAY_GET, variable );
                }

                if (returning[ this.DEFINED ] !== true ) {
                    var saveFunc = returning[ this.REGISTER_SETTER ],
                    arrThis = this;


                    returning[ this.REGISTER_SETTER ] = function( val ) {
                        arrThis[ this.DEFINED ] = true;
                        if (saveFunc !== undefined ) {
                            saveFunc( val );
                        }
                    };

                    if ( this[ this.DEFINED ] !== true ) {
                        returning[ this.DEFINED ] = this[ this.DEFINED ];
                    }

                //
                }

                return  returning

            };
        },
        set : setValue
    }
    );


    return this;

};

PHP.VM.Variable.prototype = new PHP.VM.VariableProto();

PHP.VM.Variable.prototype.NAME = "$Name";

PHP.VM.Variable.prototype.DEFINED = "$Defined";

PHP.VM.Variable.prototype.CAST_INT = "$Int";

PHP.VM.Variable.prototype.CAST_DOUBLE = "$Double";

PHP.VM.Variable.prototype.CAST_BOOL = "$Bool";

PHP.VM.Variable.prototype.CAST_STRING = "$String";

PHP.VM.Variable.prototype.NULL = 0;
PHP.VM.Variable.prototype.BOOL = 1;
PHP.VM.Variable.prototype.INT = 2;
PHP.VM.Variable.prototype.FLOAT = 3;
PHP.VM.Variable.prototype.STRING = 4;
PHP.VM.Variable.prototype.ARRAY = 5;
PHP.VM.Variable.prototype.OBJECT = 6;
PHP.VM.Variable.prototype.RESOURCE = 7;
PHP.VM.Variable.prototype.LAMBDA = 8;

// variable types
PHP.VM.Variable.prototype.FUNCTION = 0;

PHP.VM.Variable.prototype.NEW_VARIABLE = 1;

PHP.VM.Variable.prototype.OVERLOADING = "$Overloading";

PHP.VM.Variable.prototype.OVERLOADED = "$Overloaded";

PHP.VM.Variable.prototype.TYPE = "type";

PHP.VM.Variable.prototype.VARIABLE_TYPE = "vtype";

PHP.VM.Variable.prototype.PROPERTY = "$Property";

PHP.VM.Variable.prototype.CONSTANT = "$Constant";

PHP.VM.Variable.prototype.CLASS_CONSTANT = "$ClassConstant";

PHP.VM.Variable.prototype.REF = "$Ref";

PHP.VM.Variable.prototype.IS_REF = "$IsRef";

PHP.VM.Variable.prototype.REFERRING = "$Referring";

PHP.VM.Variable.prototype.REGISTER_SETTER = "$Setter";

PHP.VM.Variable.prototype.REGISTER_ARRAY_SETTER = "$ASetter";

PHP.VM.Variable.prototype.REGISTER_GETTER = "$Getter";

PHP.VM.Variable.prototype.INSTANCE = "$Instance";
/* 
 * @author Niklas von Hertzen <niklas at hertzen.com>
 * @created 27.6.2012 
 * @website http://hertzen.com
 */

PHP.VM.Array = function( ENV ) {
   
    var COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    ARRAY = PHP.VM.Array.prototype,
    CLASS = PHP.VM.Class,
    $this = this;
    
    ENV.$Class.New( "ArrayObject", 0, {}, function( M ) {
    
        // internal storage for keys/values
        M[ COMPILER.CLASS_PROPERTY ]( $this.KEYS, PHP.VM.Class.PRIVATE, [] )
        [ COMPILER.CLASS_PROPERTY ]( $this.VALUES, PHP.VM.Class.PRIVATE, [] )
    
        // internal key of largest previously used (int) key
        [ COMPILER.CLASS_PROPERTY ]( $this.INTKEY, PHP.VM.Class.PRIVATE, -1 )
    
    
        // internal pointer
        [ COMPILER.CLASS_PROPERTY ]( $this.POINTER, PHP.VM.Class.PRIVATE, 0 )
    
        /*
         * __construct method
         */ 
        [ COMPILER.CLASS_METHOD ]( "__construct", PHP.VM.Class.PUBLIC, [{
            "name":"input"
        }], false, function( $ ) {
            this[ COMPILER.CLASS_NAME ] = $this.CLASS_NAME;
                  
            var items = $('input')[ COMPILER.VARIABLE_VALUE ];
            
            
            if ( Array.isArray( items ) ) {
       
                items.forEach( function( item ) {
                 
                    // this.$Prop( this, $this.VALUES ).$.push( item[ COMPILER.ARRAY_VALUE ] );
                    if (item[ COMPILER.ARRAY_VALUE ][ VARIABLE.CLASS_CONSTANT ] !== true && item[ COMPILER.ARRAY_VALUE ][ VARIABLE.CONSTANT ] !== true) {
                        this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( new PHP.VM.Variable( item[ COMPILER.ARRAY_VALUE ][ COMPILER.VARIABLE_VALUE ] ) );
                    } else {
                        this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_VALUE ] );
                    }
                    
                
                    if ( item[ COMPILER.ARRAY_KEY ] !== undefined ) {
                        if ( !item[ COMPILER.ARRAY_KEY ] instanceof PHP.VM.Variable || (item[ COMPILER.ARRAY_KEY ][ VARIABLE.CLASS_CONSTANT ] !== true && item[ COMPILER.ARRAY_KEY ][ VARIABLE.CONSTANT ] !== true )) {
                            var key = ( item[ COMPILER.ARRAY_KEY ] instanceof PHP.VM.Variable ) ? item[ COMPILER.ARRAY_KEY ][ COMPILER.VARIABLE_VALUE ] : item[ COMPILER.ARRAY_KEY ];
                            if ( key === true || key === false ) {
                                key = ( key === true ) ? 1 : 0;
                            }
                            if ( /^\d+$/.test( key )) {
                                // integer key
                        
                                this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( key );
                        
                                // todo complete
                                this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] = Math.max( this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ], key );
                            } else {
                                // custom text key
                                this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( key );
                            }
                        } else {
                            // class constant as key
                                                         
                            this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_KEY ] );
                      
                        }
                    } else {
                        this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] );
                    }
                
                

                }, this);
            }
    
       
        
        } )
        /*
         * append
         */
        [ COMPILER.CLASS_METHOD ]( "append", PHP.VM.Class.PUBLIC, [{
            "name":"value"
        }], false, function( $ ) {


            var append = function( item ) {
      
                if (item[ VARIABLE.CLASS_CONSTANT ] !== true && item[ VARIABLE.CONSTANT ] !== true) {
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( new PHP.VM.Variable( item[ COMPILER.VARIABLE_VALUE ] ) );
                } else {
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( item[ COMPILER.ARRAY_VALUE ] );
                }
            
           
                this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ] );
            
            }.bind( this );
            
            var value = $("value");
            
            if ( value[ VARIABLE.TYPE ] === VARIABLE.STRING ) {
                append( $("value") );
            }
        

            
        
        })
        
        /*
         * Custom $clone method, shouldn't be triggerable by php manually
         */
        [ COMPILER.CLASS_METHOD ]( COMPILER.ARRAY_CLONE, PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], false, function( $ ) {
            var newArr = new (ENV.$Class.Get("ArrayObject"))( ENV );
        

            // copy keys, can do direct copy ( probably? ) 
            var keys = newArr[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
            this[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ].forEach( function( key ){
                keys.push( key );
            });
            
            // copy values, need to do deep clone
            var values = newArr[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            this[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ].forEach( function( valueObj ) {
                
                values.push( valueObj[ COMPILER.VARIABLE_CLONE ]() );
                
            });
        
            // reset pointers
            this [ PHP.VM.Class.PROPERTY +  PHP.VM.Array.prototype.POINTER ][ COMPILER.VARIABLE_VALUE ] = 0;
            
            // copy key index
            newArr[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.INTKEY][ COMPILER.VARIABLE_VALUE ] = this[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.INTKEY][ COMPILER.VARIABLE_VALUE ];
            return newArr;
            
        
        })
        
        /*
         * offsetUnset method
         */ 
        [ COMPILER.CLASS_METHOD ]( "offsetUnset", PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], false, function( $ ) {
        
            var value = $('index')[ COMPILER.VARIABLE_VALUE ];
            var keys = this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ],
            removeIndex = keys.indexOf( value );
            
            if ( removeIndex !== -1 ) {
                keys.splice( removeIndex, 1);
                this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].splice( removeIndex, 1);
            }
            
            if (removeIndex <= this [ CLASS.PROPERTY + ARRAY.POINTER ][ COMPILER.VARIABLE_VALUE ]) {
                this [ CLASS.PROPERTY +  ARRAY.POINTER ][ COMPILER.VARIABLE_VALUE ]--;
            }
          

            
            
        })
        // remap keys
        [ COMPILER.CLASS_METHOD ]( "remap", PHP.VM.Class.PRIVATE, [], false, function( $ ) {
                     
            this[ CLASS.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ].forEach(function( key, index ){
                // todo take into account other type of keys
                if ( typeof key === "number" && key % 1 === 0) {
                  
                    this[ CLASS.PROPERTY + ARRAY.KEYS ][ COMPILER.VARIABLE_VALUE ][ index ]--;
                }
            }, this);
            
        })
        
        /*
         * offsetGet method
         */ 
        [ COMPILER.CLASS_METHOD ]( COMPILER.ARRAY_GET, PHP.VM.Class.PUBLIC, [{
            "name":"index"
        }], false, function( $ ) {
         
            var index = -1,
            value = $('index')[ COMPILER.VARIABLE_VALUE ];
            
            this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].some(function( item, i ){
                
                if ( item instanceof PHP.VM.Variable ) {
                    item = item[ COMPILER.VARIABLE_VALUE ];
                } 
                
          
                
                if ( item === value) {
                    index = i;
                    return true;
                }
                
                return false;
            });

            if ( index !== -1 ) {
                var item = this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ][ index ];
                if (this[ VARIABLE.REGISTER_ARRAY_SETTER ] !== undefined) {
                    var func = this[ VARIABLE.REGISTER_ARRAY_SETTER ];
                    item[ VARIABLE.REGISTER_SETTER ] = function( val ) {
                        return func( val );
                    };
                }
                return item;
            } else {
                // no such key found in array, let's create one
                //    
             
                var variable = new PHP.VM.Variable();
               
                variable[ VARIABLE.REGISTER_SETTER ] = function() {
                    // the value was actually defined, let's register item into array
            
                    var key = ++this.$Prop( this, $this.INTKEY )[ COMPILER.VARIABLE_VALUE ];
                    
                    this.$Prop( this, $this.KEYS )[ COMPILER.VARIABLE_VALUE ].push( ($('index')[ COMPILER.VARIABLE_VALUE ] !== null) ? $('index')[ COMPILER.VARIABLE_VALUE ] : key );
                    this.$Prop( this, $this.VALUES )[ COMPILER.VARIABLE_VALUE ].push( variable );
                    delete variable[ VARIABLE.REGISTER_SETTER ];
                }.bind(this);
                variable[ VARIABLE.DEFINED  ] = false;
                return variable;
            
            }

        
        } )
    
        .Create();
    
    });

    /*
 Convert JavaScript array/object into a PHP array 
     */

    PHP.VM.Array.arrayItem = function( key, value ) {
        var obj = {};
        
        obj[ COMPILER.ARRAY_KEY ] = ( key instanceof PHP.VM.Variable ) ? key : new PHP.VM.Variable( key );
        obj[ COMPILER.ARRAY_VALUE ] = ( value instanceof PHP.VM.Variable ) ? value : new PHP.VM.Variable( value );
        return obj;
    };


    PHP.VM.Array.fromObject = function( items, depth ) {
        var COMPILER = PHP.Compiler.prototype,
        arr = [],
        obj,
        depth = (depth === undefined) ? 0 : depth,
   
        addItem = function( value, key ) {
            obj = {};
            
            obj[ PHP.Compiler.prototype.ARRAY_KEY ] = ( /^\d+$/.test( key )) ? key - 0 : key; // use int for int
        
            if ( value instanceof PHP.VM.Variable ) {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = value;
            } else if ( typeof value === "object" && value !== null ) {
                if ( depth >= this.$ini.max_input_nesting_level ) {
                    throw Error;
                } else {
                    obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = PHP.VM.Array.fromObject.call( this, value, depth + 1 );
                }
            } else {
                obj[ PHP.Compiler.prototype.ARRAY_VALUE ] = new PHP.VM.Variable( value );
            }
            arr.push( obj );
        
        }.bind(this);
     
     
        var $this = this;
        if (Array.isArray( items ) ) {
            items.forEach( addItem );
        } else {
            Object.keys( items ).forEach( function( key ) {
                try {
                    addItem( items[ key ], key );   
                } catch( e ) {
                    // error all the way down the array
                    if ( depth !== 0 ) {
                        throw Error;
                    } else if( $this.$ini.track_errors == 1 ) {
                        $this[ COMPILER.GLOBAL ]("php_errormsg")[ COMPILER.VARIABLE_VALUE ] = "Unknown: Input variable nesting level exceeded " + $this.$ini.max_input_nesting_level + ". To increase the limit change max_input_nesting_level in php.ini.";
                    }
                
                    
                }
            }), this;
        }
    
   
        var arr = this.array( arr );
      

        return arr;


    };
};

PHP.VM.Array.prototype.KEYS = "keys";
PHP.VM.Array.prototype.VALUES = "values";

PHP.VM.Array.prototype.INTKEY = "intkey";

PHP.VM.Array.prototype.POINTER = "pointer";

PHP.VM.Array.prototype.CLASS_NAME = "array";
PHP.VM.ResourceManager = function() {
    var resources = [],
    RESOURCE = PHP.VM.ResourceManager.prototype,
    id = 0,
    methods = {};

    methods[ RESOURCE.REGISTER ] = function() {
        var resource = new PHP.VM.Resource( id++ );
        resources.push( resource );
        return resource;
    };

    return methods;
};

PHP.VM.ResourceManager.prototype.ID = "$Id";

PHP.VM.ResourceManager.prototype.REGISTER = "$Register";

PHP.VM.Resource = function( id ) {
    this[ PHP.VM.ResourceManager.prototype.ID ] = id;
};
PHP.VM.Constants = function(  predefined, ENV ) {

    var constants = {},
    constantVariables = {},
    COMPILER = PHP.Compiler.prototype,
    VARIABLE = PHP.VM.Variable.prototype,
    methods = {};

    Object.keys( predefined ).forEach(function( key ){

        constants[ key ] = predefined[ key ];
    }, this);

    methods[ COMPILER.CONSTANT_GET ] = function( constantName ) {

        var variable = new PHP.VM.Variable( constants[ constantName ] );

        if ( constants[ constantName ] === undefined  ) {

            if ( constantVariables[ constantName ] === undefined ) {
                constantVariables[ constantName ] = variable;
            } else {
                return constantVariables[ constantName ];
            }
            variable[ VARIABLE.DEFINED ] = constantName;
            variable[ VARIABLE.CONSTANT ] = true;
        }
        return variable;
    };

    methods[ COMPILER.CONSTANT_DEFINED ] = function( constantName ) {
        return ( constants[ constantName ] === undefined  );
    };

    methods[ COMPILER.CONSTANT_SET ] = function( constantName, constantValue ) {

        if ( constantVariables[ constantName ] !== undefined ) {
            constantVariables[ constantName ][ COMPILER.VARIABLE_VALUE ] = constantValue;
        }
        constants[ constantName ] = constantValue;
    };

    return methods;

};

// manually defined constants

PHP.Constants.PHP_BINARY = "/bin/php";
/* automatically built from DateTime.php*/
PHP.VM.Class.Predefined.DateTime = function( ENV, $$ ) {
ENV.$Class.New( "DateTime", 0, {}, function( M, $, $$ ){
 M.Constant("ATOM", $$("Y-m-d\\TH:i:sP"))
.Constant("COOKIE", $$("l, d-M-y H:i:s T"))
.Constant("ISO8601", $$("Y-m-d\\TH:i:sO"))
.Constant("RFC822", $$("D, d M y H:i:s O"))
.Constant("RFC850", $$("l, d-M-y H:i:s T"))
.Constant("RFC1036", $$("D, d M y H:i:s O"))
.Constant("RFC1123", $$("D, d M Y H:i:s O"))
.Constant("RFC2822", $$("D, d M Y H:i:s O"))
.Constant("RFC3339", $$("Y-m-d\\TH:i:sP"))
.Constant("RSS", $$("D, d M Y H:i:s O"))
.Constant("W3C", $$("Y-m-d\\TH:i:sP"))
.Method( "__construct", 1, [{name:"time", d: $$("now")}, {name:"timezone", d: $$(null), p: "DateTimeZone"}], false, function( $, ctx, $Static ) {
})
.Method( "add", 1, [{name:"interval", p: "DateInterval"}], false, function( $, ctx, $Static ) {
})
.Method( "createFromFormat", 9, [{name:"format", p: "string"}, {name:"time", p: "string"}, {name:"timezone", p: "DateTimeZone"}], false, function( $, ctx, $Static ) {
})
.Method( "diff", 1, [{name:"datetime2", p: "DateTime"}, {name:"absolute", d: $$(false)}], false, function( $, ctx, $Static ) {
})
.Method( "format", 1, [{name:"format"}], false, function( $, ctx, $Static ) {
})
.Method( "getLastErrors", 9, [], false, function( $, ctx, $Static ) {
})
.Method( "getOffset", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "getTimestamp", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "getTimezone", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "modify", 1, [{name:"modify"}], false, function( $, ctx, $Static ) {
})
.Method( "__set_state", 9, [{name:"array", p: "array"}], false, function( $, ctx, $Static ) {
})
.Method( "setDate", 1, [{name:"year"}, {name:"month"}, {name:"day"}], false, function( $, ctx, $Static ) {
})
.Method( "setISODate", 1, [{name:"year"}, {name:"week"}, {name:"day", d: $$(1)}], false, function( $, ctx, $Static ) {
})
.Method( "setTime", 1, [{name:"hour"}, {name:"minute"}, {name:"second", d: $$(0)}], false, function( $, ctx, $Static ) {
})
.Method( "setTimestamp", 1, [{name:"unixtimestamp"}], false, function( $, ctx, $Static ) {
})
.Method( "setTimezone", 1, [{name:"timezone", p: "DateTimeZone"}], false, function( $, ctx, $Static ) {
})
.Method( "sub", 1, [{name:"interval", p: "DateInterval"}], false, function( $, ctx, $Static ) {
})
.Method( "__wakeup", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from Exception.php*/
PHP.VM.Class.Predefined.Exception = function( ENV, $$ ) {
ENV.$Class.New( "Exception", 0, {}, function( M, $, $$ ){
 M.Variable( "message", 2 )
.Variable( "code", 2 )
.Variable( "file", 2 )
.Variable( "line", 2 )
.Method( "__construct", 1, [{name:"message", d: $$("")}, {name:"code", d: $$(0)}, {name:"previous", d: $$(null)}], false, function( $, ctx, $Static ) {
$("this").$Prop( ctx, "message" )._($("message"));
$("this").$Prop( ctx, "line" )._($$(1));
})
.Method( "getMessage", 33, [], false, function( $, ctx, $Static ) {
return $("this").$Prop( ctx, "message" );
})
.Method( "getPrevious", 33, [], false, function( $, ctx, $Static ) {
})
.Method( "getCode", 33, [], false, function( $, ctx, $Static ) {
})
.Method( "getFile", 33, [], false, function( $, ctx, $Static ) {
})
.Method( "getLine", 33, [], false, function( $, ctx, $Static ) {
return $("this").$Prop( ctx, "line" );
})
.Method( "getTrace", 33, [], false, function( $, ctx, $Static ) {
return ENV.array([{v:ENV.array([{v:$$("Error2Exception"), k:$$("function")}]), k:undefined}, {v:ENV.array([{v:$$("fopen"), k:$$("function")}]), k:undefined}]);
})
.Method( "getTraceAsString", 33, [], false, function( $, ctx, $Static ) {
})
.Method( "__toString", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "__clone", 36, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from ReflectionClass.php*/
PHP.VM.Class.Predefined.ReflectionClass = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionClass", 0, {}, function( M, $, $$ ){
 M.Constant("IS_IMPLICIT_ABSTRACT", $$(16))
.Constant("IS_EXPLICIT_ABSTRACT", $$(32))
.Constant("IS_FINAL", $$(64))
.Variable( "name", 1 )
.Variable( "class", 4 )
.Method( "__construct", 1, [{name:"argument"}], false, function( $, ctx, $Static ) {
if ( ((ENV.$F("is_string", arguments, $("argument")))).$Bool.$) {
if ( ($$(!(ENV.$F("class_exists", arguments, $("argument"))).$Bool.$)).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("argument")).$Concat($$(" does not exist ")) ));
} else {
$("this").$Prop( ctx, "name" )._($("argument"));
};
};
})
.Method( "getMethods", 1, [], false, function( $, ctx, $Static ) {
$("methods")._((ENV.$F("get_class_methods", arguments, $("this").$Prop( ctx, "name", true ))));
$("arr")._(ENV.array([]));
var iterator1 = ENV.$foreachInit($("methods"), ctx);
while(ENV.foreach( iterator1, false, $("methodName"))) {
$("parent")._((ENV.$F("get_parent_class", arguments, $("this").$Prop( ctx, "name", true ))));
if ( ((ENV.$F("method_exists", arguments, $("parent"), $("methodName")))).$Bool.$) {
$("arr").$Dim( this, undefined )._($$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("parent"), $("methodName") )));
} else {
$("arr").$Dim( this, undefined )._($$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("this").$Prop( ctx, "name", true ), $("methodName") )));
};
} ENV.$foreachEnd( iterator1 );
return $("arr");
})
.Method( "getProperty", 1, [{name:"name"}], false, function( $, ctx, $Static ) {
$("parts")._((ENV.$F("explode", arguments, $$("::"), $("name"))));
if ( ((ENV.$F("count", arguments, $("parts"))).$Greater($$(1))).$Bool.$) {
$$(new (ENV.$Class.Get("ReflectionMethod"))( this, $("parts").$Dim( this, $$(0) ), $("parts").$Dim( this, $$(1) ) ));
};
})
.Method( "implementsInterface", 1, [{name:"interface"}], false, function( $, ctx, $Static ) {
if ( ($$(!(ENV.$F("interface_exists", arguments, $("interface"))).$Bool.$)).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Interface ").$Concat($("interface")).$Concat($$(" does not exist ")) ));
};
})
.Method( "export", 9, [{name:"argument"}, {name:"return", d: $$(false)}], false, function( $, ctx, $Static ) {
})
.Method( "__toString", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from ReflectionException.php*/
PHP.VM.Class.Predefined.ReflectionException = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionException", 0, {Extends: "Exception"}, function( M, $, $$ ){
 M.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from ReflectionMethod.php*/
PHP.VM.Class.Predefined.ReflectionMethod = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionMethod", 0, {}, function( M, $, $$ ){
 M.Constant("IS_IMPLICIT_ABSTRACT", $$(16))
.Constant("IS_EXPLICIT_ABSTRACT", $$(32))
.Constant("IS_FINAL", $$(64))
.Variable( "name", 1 )
.Variable( "class", 1 )
.Method( "__construct", 1, [{name:"class"}, {name:"name", d: $$(null)}], false, function( $, ctx, $Static ) {
$("parts")._((ENV.$F("explode", arguments, $$("::"), $("class"))));
if ( ((ENV.$F("count", arguments, $("parts"))).$Greater($$(1))).$Bool.$) {
$("class")._($("parts").$Dim( this, $$(0) ));
$("name")._($("parts").$Dim( this, $$(1) ));
};
if ( ($$(!(ENV.$F("class_exists", arguments, $("class"))).$Bool.$)).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("class")).$Concat($$(" does not exist ")) ));
};
$("this").$Prop( ctx, "name" )._($("name"));
$("this").$Prop( ctx, "class" )._($("class"));
})
.Method( "export", 9, [{name:"argument"}, {name:"return", d: $$(false)}], false, function( $, ctx, $Static ) {
})
.Method( "__toString", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from ReflectionProperty.php*/
PHP.VM.Class.Predefined.ReflectionProperty = function( ENV, $$ ) {
ENV.$Class.New( "ReflectionProperty", 0, {}, function( M, $, $$ ){
 M.Constant("IS_STATIC", $$(1))
.Constant("IS_PUBLIC", $$(256))
.Constant("IS_PROTECTED", $$(512))
.Constant("IS_PRIVATE", $$(1024))
.Variable( "name", 1 )
.Variable( "class", 1 )
.Method( "__construct", 1, [{name:"class"}, {name:"name", d: $$(null)}], false, function( $, ctx, $Static ) {
if ( ($$(!(ENV.$F("class_exists", arguments, $("class"))).$Bool.$)).$Bool.$) {
throw $$(new (ENV.$Class.Get("ReflectionException"))( this, $$("Class ").$Concat($("class")).$Concat($$(" does not exist ")) ));
};
})
.Method( "export", 9, [{name:"argument"}, {name:"return", d: $$(false)}], false, function( $, ctx, $Static ) {
})
.Method( "__toString", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from __PHP_Incomplete_Class.php*/
PHP.VM.Class.Predefined.__PHP_Incomplete_Class = function( ENV, $$ ) {
ENV.$Class.New( "__PHP_Incomplete_Class", 0, {}, function( M, $, $$ ){
 M.Variable( "__PHP_Incomplete_Class_Name", 1 )
.Method( "__construct", 1, [{name:"name"}], false, function( $, ctx, $Static ) {
$("this").$Prop( ctx, "__PHP_Incomplete_Class_Name" )._($("name"));
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from stdClass.php*/
PHP.VM.Class.Predefined.stdClass = function( ENV, $$ ) {
ENV.$Class.New( "stdClass", 0, {}, function( M, $, $$ ){
 M.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from Traversable.php*/
PHP.VM.Class.Predefined.Traversable = function( ENV, $$ ) {
ENV.$Class.INew( "Traversable", [], function( M, $, $$ ){
 M.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from ArrayAccess.php*/
PHP.VM.Class.Predefined.ArrayAccess = function( ENV, $$ ) {
ENV.$Class.INew( "ArrayAccess", [], function( M, $, $$ ){
 M.Method( "offsetExists", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
})
.Method( "offsetGet", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
})
.Method( "offsetSet", 1, [{name:"offset"}, {name:"value"}], false, function( $, ctx, $Static ) {
})
.Method( "offsetUnset", 1, [{name:"offset"}], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from Iterator.php*/
PHP.VM.Class.Predefined.Iterator = function( ENV, $$ ) {
ENV.$Class.INew( "Iterator", ["Traversable"], function( M, $, $$ ){
 M.Method( "current", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "key", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "next", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "rewind", 1, [], false, function( $, ctx, $Static ) {
})
.Method( "valid", 1, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from IteratorAggregate.php*/
PHP.VM.Class.Predefined.IteratorAggregate = function( ENV, $$ ) {
ENV.$Class.INew( "IteratorAggregate", ["Traversable"], function( M, $, $$ ){
 M.Method( "getIterator", 17, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from Reflector.php*/
PHP.VM.Class.Predefined.Reflector = function( ENV, $$ ) {
ENV.$Class.INew( "Reflector", [], function( M, $, $$ ){
 M.Method( "export", 25, [], false, function( $, ctx, $Static ) {
})
.Method( "__toString", 17, [], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* automatically built from Serializable.php*/
PHP.VM.Class.Predefined.Serializable = function( ENV, $$ ) {
ENV.$Class.INew( "Serializable", [], function( M, $, $$ ){
 M.Method( "serialize", 17, [], false, function( $, ctx, $Static ) {
})
.Method( "unserialize", 17, [{name:"serialized"}], false, function( $, ctx, $Static ) {
})
.Create()});

ENV.$Class.Get( "DateTime").prototype.Native = true;
};
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 17.7.2012 
* @website http://hertzen.com
 */

PHP.Locales = {
  
    de_DE: {
        decimal_point: ",",
        thousands_sep: "."
    }  
    
    
};

//AMD
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = PHP;
    }
}

});
require.register("searchreplace/web/js/lib/php/xhr.js", function(exports, require, module){
/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 3.7.2012 
* @website http://hertzen.com
 */

var PHP = require('/searchreplace/web/js/lib/php/PHP');

PHP.Adapters.XHRFileSystem = function() {
    /*
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB,
    request = indexedDB.open("filesystem"),
    $this = this;

    request.onsuccess = function(e) {

        $this.db = e.target.result;
  
    };
    
    request.onupgradeneeded = function( e ) {
      
        $this.db.createObjectStore( $this.FILES,
        {
            keyPath: "filename"
        });
        
    };

    request.onfailure = this.error;
    */
    
    
    }; 

PHP.Adapters.XHRFileSystem.prototype.lstatSync = function( filename ) {
    
    if (localStorage[ filename ] === undefined ) {
        throw Error; 
    } else {
        return true;
    }
    
}

PHP.Adapters.XHRFileSystem.prototype.error = function( e ) {
    this.db = false;
    console.log( e );
    throw e; 
}

PHP.Adapters.XHRFileSystem.prototype.writeFileSync = function( filename, data ) {
    
    
    localStorage[ filename ] = data;
    
/*
    if ( this.db === false ) {
        return;
    }
    console.log( this.db );
    var db = this.db,
    trans = db.transaction([ this.files ], IDBTransaction.READ_WRITE, 0),
    store = trans.objectStore( this.files );
    
    var request = store.put({
        "filename": filename,
        "content" : data
    });
    
    var processing = true;

    request.onsuccess = function(e) {
        processing = false;
    };

    request.onerror = function(e) {
        processing = false;
        console.log(e.value);
    };
    
    while ( processing ) {}
    
    */

    
};

PHP.Adapters.XHRFileSystem.prototype.readFileSync = function( filename, xhr ) {
    
    if ( xhr === undefined ) {
    
        var xhr = new XMLHttpRequest();
    
        xhr.open('GET', filename, false); // async set to false!
    
        var response; 
        xhr.onload = function() {
            response = this.response; 
   
        };

        xhr.send();
    
        return response;
    } else {
        if (localStorage[ filename ] === undefined ) {
            throw Error; 
        } else {
            return localStorage[ filename ];
        }
    }

    
};
PHP.Adapters.XHRFileSystem.prototype.xhr = true;
 
PHP.Adapters.XHRFileSystem.prototype.version = "1.2";

PHP.Adapters.XHRFileSystem.prototype.FILES = "files";
});
require.register("searchreplace/components/SRComponent.js", function(exports, require, module){
var SRComponent, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

SRComponent = (function(_super) {
  __extends(SRComponent, _super);

  SRComponent.prototype.description = 'SRComponent component base';

  SRComponent.prototype.icon = 'SRComponent';

  function SRComponent() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.ArrayPort('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('data', function(data) {
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.send(data);
      }
    });
    this.inPorts["in"].on('disconnect', function() {
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.disconnect();
      }
    });
  }

  return SRComponent;

})(noflo.Component);

exports.getComponent = function() {
  return new SRComponent();
};

});
require.register("searchreplace/components/SRPHP.js", function(exports, require, module){
var PHP, SRPHP, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

PHP = require('/searchreplace/web/js/lib/php/PHP');

require('/searchreplace/web/js/lib/php/xhr');

SRPHP = (function(_super) {
  __extends(SRPHP, _super);

  SRPHP.prototype.description = 'SRPHP component base';

  SRPHP.prototype.icon = 'SRPHP';

  function SRPHP() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.ArrayPort('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('data', function(data) {
      var opts, path, php;
      path = window.location.pathname;
      opts = {
        SERVER: {
          SCRIPT_FILENAME: path.substring(0, path.length - 1)
        },
        filesystem: new PHP.Adapters.XHRFileSystem()
      };
      php = new PHP(data, opts);
      data = php.vm.OUTPUT_BUFFER;
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.send(data);
      }
    });
    this.inPorts["in"].on('disconnect', function() {
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.disconnect();
      }
    });
  }

  return SRPHP;

})(noflo.Component);

exports.getComponent = function() {
  return new SRPHP();
};

});
require.register("searchreplace/components/SRGettersAndSetters.js", function(exports, require, module){
var PHP, SRGettersAndSetters, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

PHP = require('/searchreplace/web/js/lib/php/PHP');

require('/searchreplace/web/js/lib/php/xhr');

SRGettersAndSetters = (function(_super) {
  __extends(SRGettersAndSetters, _super);

  SRGettersAndSetters.prototype.description = 'SRGettersAndSetters component base';

  SRGettersAndSetters.prototype.icon = 'SRGettersAndSetters';

  function SRGettersAndSetters() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.ArrayPort('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('data', function(data) {
      var opts, path, php;
      path = window.location.pathname;
      opts = {
        SERVER: {
          SCRIPT_FILENAME: path.substring(0, path.length - 1)
        },
        filesystem: new PHP.Adapters.XHRFileSystem()
      };
      php = new PHP(data, opts);
      data = php.vm.OUTPUT_BUFFER;
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.send(data);
      }
    });
    this.inPorts["in"].on('disconnect', function() {
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.disconnect();
      }
    });
  }

  return SRGettersAndSetters;

})(noflo.Component);

exports.getComponent = function() {
  return new SRGettersAndSetters();
};

});
require.register("searchreplace/components/SRBankToEldorado.js", function(exports, require, module){
var $, SRBankToEldorado, noflo,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

noflo = require('noflo');

$ = require('jquery');

SRBankToEldorado = (function(_super) {
  __extends(SRBankToEldorado, _super);

  SRBankToEldorado.prototype.description = 'SRBankToEldorado component base';

  SRBankToEldorado.prototype.icon = 'SRBankToEldorado';

  function SRBankToEldorado() {
    var _this = this;
    this.inPorts = {
      "in": new noflo.ArrayPort('all')
    };
    this.outPorts = {
      out: new noflo.Port('all')
    };
    this.inPorts["in"].on('data', function(data) {
      var $input, $lines, lines;
      lines = ['!type Bank'];
      $input = $(data);
      $lines = $input.find('tr');
      $lines.each(function() {
        var $tr, line;
        $tr = $(this);
        data = {
          'datecompta': $tr.find('td:eq(0) .itemFormReadOnly').text(),
          'libelleop': $tr.find('td:eq(1) .itemFormReadOnly').text(),
          'ref': $tr.find('td:eq(2) .itemFormReadOnly').text(),
          'dateope': $tr.find('td:eq(3) .itemFormReadOnly').text(),
          'dateval': $tr.find('td:eq(4) .itemFormReadOnly').text(),
          'debit': $tr.find('td:eq(5) .itemFormReadOnly').text().replace(' ', ''),
          'credit': $tr.find('td:eq(6) .itemFormReadOnly').text().replace(' ', '')
        };
        line = ['D' + data['datecompta'], 'T' + (data['debit'] !== '' ? '-' + data['debit'] : '+' + data['credit']), 'N' + data['ref'], 'M' + data['libelleop']];
        /*
        label = data['libelleop']
        if label.match /(MONOPRIX|FRANPRIX)/
          line.push 'L' + 'Alimentation quotidienne'
        else if label.match /SNCF/
          line.push 'L' + 'Transports'
        else if label.match /BIG YOUTH/
          line.push 'L' + 'Salaire'
        */

        line.push('^');
        return lines = lines.concat(line);
      });
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.send(lines.join("\n"));
      }
    });
    this.inPorts["in"].on('disconnect', function() {
      if (_this.outPorts.out.isAttached()) {
        return _this.outPorts.out.disconnect();
      }
    });
  }

  return SRBankToEldorado;

})(noflo.Component);

exports.getComponent = function() {
  return new SRBankToEldorado();
};

});
require.register("searchreplace/component.json", function(exports, require, module){
module.exports = JSON.parse('{"name":"searchreplace","description":"SearchReplace tool","author":"Mathieu Ledru <matyo91@gmail.com>","repo":"darkwood/searchreplace","version":"0.1.0","keywords":[],"dependencies":{"component/jquery":"*","noflo/noflo":"*","noflo/noflo-core":"*"},"scripts":["web/js/lib/php/PHP.js","web/js/lib/php/xhr.js","components/SRComponent.js","components/SRPHP.js","components/SRGettersAndSetters.js","components/SRBankToEldorado.js"],"json":["component.json"],"noflo":{"components":{"SRComponent":"components/SRComponent.js","SRPHP":"components/SRPHP.js","SRGettersAndSetters":"components/SRGettersAndSetters.js","SRBankToEldorado":"components/SRBankToEldorado.js"}}}');
});
require.alias("component-jquery/index.js", "searchreplace/deps/jquery/index.js");
require.alias("component-jquery/index.js", "jquery/index.js");

require.alias("noflo-noflo/src/lib/Graph.js", "searchreplace/deps/noflo/src/lib/Graph.js");
require.alias("noflo-noflo/src/lib/InternalSocket.js", "searchreplace/deps/noflo/src/lib/InternalSocket.js");
require.alias("noflo-noflo/src/lib/Port.js", "searchreplace/deps/noflo/src/lib/Port.js");
require.alias("noflo-noflo/src/lib/ArrayPort.js", "searchreplace/deps/noflo/src/lib/ArrayPort.js");
require.alias("noflo-noflo/src/lib/Component.js", "searchreplace/deps/noflo/src/lib/Component.js");
require.alias("noflo-noflo/src/lib/AsyncComponent.js", "searchreplace/deps/noflo/src/lib/AsyncComponent.js");
require.alias("noflo-noflo/src/lib/LoggingComponent.js", "searchreplace/deps/noflo/src/lib/LoggingComponent.js");
require.alias("noflo-noflo/src/lib/ComponentLoader.js", "searchreplace/deps/noflo/src/lib/ComponentLoader.js");
require.alias("noflo-noflo/src/lib/NoFlo.js", "searchreplace/deps/noflo/src/lib/NoFlo.js");
require.alias("noflo-noflo/src/lib/Network.js", "searchreplace/deps/noflo/src/lib/Network.js");
require.alias("noflo-noflo/src/components/Graph.js", "searchreplace/deps/noflo/src/components/Graph.js");
require.alias("noflo-noflo/src/lib/NoFlo.js", "searchreplace/deps/noflo/index.js");
require.alias("noflo-noflo/src/lib/NoFlo.js", "noflo/index.js");
require.alias("component-emitter/index.js", "noflo-noflo/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-underscore/index.js", "noflo-noflo/deps/underscore/index.js");

require.alias("noflo-fbp/lib/fbp.js", "noflo-noflo/deps/fbp/lib/fbp.js");
require.alias("noflo-fbp/lib/fbp.js", "noflo-noflo/deps/fbp/index.js");
require.alias("noflo-fbp/lib/fbp.js", "noflo-fbp/index.js");

require.alias("noflo-noflo/src/lib/NoFlo.js", "noflo-noflo/index.js");

require.alias("noflo-noflo-core/components/Callback.js", "searchreplace/deps/noflo-core/components/Callback.js");
require.alias("noflo-noflo-core/components/DisconnectAfterPacket.js", "searchreplace/deps/noflo-core/components/DisconnectAfterPacket.js");
require.alias("noflo-noflo-core/components/Drop.js", "searchreplace/deps/noflo-core/components/Drop.js");
require.alias("noflo-noflo-core/components/Group.js", "searchreplace/deps/noflo-core/components/Group.js");
require.alias("noflo-noflo-core/components/Kick.js", "searchreplace/deps/noflo-core/components/Kick.js");
require.alias("noflo-noflo-core/components/Merge.js", "searchreplace/deps/noflo-core/components/Merge.js");
require.alias("noflo-noflo-core/components/Output.js", "searchreplace/deps/noflo-core/components/Output.js");
require.alias("noflo-noflo-core/components/Repeat.js", "searchreplace/deps/noflo-core/components/Repeat.js");
require.alias("noflo-noflo-core/components/RepeatAsync.js", "searchreplace/deps/noflo-core/components/RepeatAsync.js");
require.alias("noflo-noflo-core/components/Split.js", "searchreplace/deps/noflo-core/components/Split.js");
require.alias("noflo-noflo-core/components/RunInterval.js", "searchreplace/deps/noflo-core/components/RunInterval.js");
require.alias("noflo-noflo-core/components/MakeFunction.js", "searchreplace/deps/noflo-core/components/MakeFunction.js");
require.alias("noflo-noflo-core/index.js", "searchreplace/deps/noflo-core/index.js");
require.alias("noflo-noflo-core/index.js", "noflo-core/index.js");
require.alias("noflo-noflo/src/lib/Graph.js", "noflo-noflo-core/deps/noflo/src/lib/Graph.js");
require.alias("noflo-noflo/src/lib/InternalSocket.js", "noflo-noflo-core/deps/noflo/src/lib/InternalSocket.js");
require.alias("noflo-noflo/src/lib/Port.js", "noflo-noflo-core/deps/noflo/src/lib/Port.js");
require.alias("noflo-noflo/src/lib/ArrayPort.js", "noflo-noflo-core/deps/noflo/src/lib/ArrayPort.js");
require.alias("noflo-noflo/src/lib/Component.js", "noflo-noflo-core/deps/noflo/src/lib/Component.js");
require.alias("noflo-noflo/src/lib/AsyncComponent.js", "noflo-noflo-core/deps/noflo/src/lib/AsyncComponent.js");
require.alias("noflo-noflo/src/lib/LoggingComponent.js", "noflo-noflo-core/deps/noflo/src/lib/LoggingComponent.js");
require.alias("noflo-noflo/src/lib/ComponentLoader.js", "noflo-noflo-core/deps/noflo/src/lib/ComponentLoader.js");
require.alias("noflo-noflo/src/lib/NoFlo.js", "noflo-noflo-core/deps/noflo/src/lib/NoFlo.js");
require.alias("noflo-noflo/src/lib/Network.js", "noflo-noflo-core/deps/noflo/src/lib/Network.js");
require.alias("noflo-noflo/src/components/Graph.js", "noflo-noflo-core/deps/noflo/src/components/Graph.js");
require.alias("noflo-noflo/src/lib/NoFlo.js", "noflo-noflo-core/deps/noflo/index.js");
require.alias("component-emitter/index.js", "noflo-noflo/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-underscore/index.js", "noflo-noflo/deps/underscore/index.js");

require.alias("noflo-fbp/lib/fbp.js", "noflo-noflo/deps/fbp/lib/fbp.js");
require.alias("noflo-fbp/lib/fbp.js", "noflo-noflo/deps/fbp/index.js");
require.alias("noflo-fbp/lib/fbp.js", "noflo-fbp/index.js");

require.alias("noflo-noflo/src/lib/NoFlo.js", "noflo-noflo/index.js");

require.alias("component-underscore/index.js", "noflo-noflo-core/deps/underscore/index.js");

