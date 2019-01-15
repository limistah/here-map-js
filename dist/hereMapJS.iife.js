var bundle = (function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var util = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isArray = function isArray(v) {
	  return Object.prototype.toString.call(v) === '[object Array]';
	};
	var isString = function isString(v) {
	  return typeof v === 'string';
	};
	var isFunction = function isFunction(v) {
	  return typeof v === 'function';
	};

	exports.isArray = isArray;
	exports.isString = isString;
	exports.isFunction = isFunction;
	});

	unwrapExports(util);
	var util_1 = util.isArray;
	var util_2 = util.isString;
	var util_3 = util.isFunction;

	var get_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});



	var resolved = {};

	function loadScript(url, callback, errorCallback) {
	    var invokeCallback = function invokeCallback() {
	        resolved[url] = true;

	        if ((0, util.isFunction)(callback)) {
	            callback();
	        }
	    };

	    if (resolved[url]) {
	        invokeCallback();

	        return;
	    }

	    var script = document.createElement('script');
	    script.type = 'text/javascript';

	    if (script.readyState) {
	        //IE
	        script.onreadystatechange = function () {
	            if (script.readyState == 'loaded' || script.readyState == 'complete') {
	                script.onreadystatechange = null;
	                invokeCallback();
	            }
	        };
	    } else {
	        //Others
	        script.onload = function () {
	            invokeCallback();
	        };
	    }

	    script.onerror = function (e) {
	        resolved[url] = false;
	        console.log('error', e);
	        if ((0, util.isFunction)(errorCallback)) {
	            errorCallback();
	        }
	    };

	    script.src = url;
	    var parent = document.body || document.head || document;
	    parent.appendChild(script);
	}

	function get(src, opts) {
	    if ((0, util.isString)(src)) {
	        return new Promise(function (resolve, reject) {
	            loadScript(src, function () {
	                return resolve(true);
	            }, function () {
	                return reject();
	            });
	        });
	    } else if ((0, util.isArray)(src)) {
	        var p = Promise.resolve(true);

	        src.forEach(function (url) {
	            p = p.then(function () {
	                return get(url);
	            });
	        });

	        return p;
	    }

	    throw new Error('Invalid argument for get()');
	}

	exports.default = get;
	});

	unwrapExports(get_1);

	var getJs = get_1.default;

	var defaults = {
	  VERSION: "v3/3.0",
	  // Version of the script to load
	  interactive: false,
	  // Loads interactivity script
	  includeUI: false // Load the default UI

	};

	var merge = createCommonjsModule(function (module) {
	(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					if (key === '__proto__') continue;

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(module && 'object' === 'object' && module.exports);
	});

	var buildScriptURLs = function buildScriptURLs() {
	  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults.VERSION;
	  return ["https://js.api.here.com/".concat(version, "/mapsjs-service.js"), // Service
	  "https://js.api.here.com/".concat(version, "/mapsjs-ui.js"), // UI
	  "https://js.api.here.com/".concat(version, "/mapsjs-mapevents.js") // Events
	  ];
	};

	var merger = function merger(options) {
	  return merge(defaults, options);
	};

	var scriptLoader = function scriptLoader(options) {
	  var _options = merger(options || {});

	  var VERSION = _options.VERSION,
	      version = _options.version,
	      interactive = _options.interactive,
	      includeUI = _options.includeUI;

	  var _v = version || VERSION;

	  var urls = buildScriptURLs(_v); // First let us remove the events if it is not needed. PERFORMANCE!!!

	  !interactive ? urls.splice(2, 1) : null; // Removes the UI if not needed

	  !includeUI ? urls.splice(1, 1) : null;
	  var coreURL = "https://js.api.here.com/".concat(_v, "/mapsjs-core.js");
	  return getJs(coreURL).then(function () {
	    if (includeUI) {
	      var link = document.createElement("link");
	      link.setAttribute("rel", "stylesheet");
	      link.setAttribute("type", "text/css");
	      link.setAttribute("href", "https://js.api.here.com/".concat(_v, "/mapsjs-ui.css"));
	      document.getElementsByTagName("head")[0].append(link);
	    }

	    return getJs(urls);
	  }).catch(function (error) {
	    console.log(error);
	  });
	};

	return scriptLoader;

}());
