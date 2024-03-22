var BeaconLiveAdmin = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element2) {
              var currTime = (/* @__PURE__ */ new Date()).getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, currentProgress, showing, progressTimerId = null, fadeTimerId = null, delayTimerId = null, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function(delay) {
            if (showing)
              return;
            if (delay) {
              if (delayTimerId)
                return;
              delayTimerId = setTimeout(() => topbar2.show(), delay);
            } else {
              showing = true;
              if (fadeTimerId !== null)
                window2.cancelAnimationFrame(fadeTimerId);
              if (!canvas)
                createCanvas();
              canvas.style.opacity = 1;
              canvas.style.display = "block";
              topbar2.progress(0);
              if (options.autoRun) {
                ;
                (function loop2() {
                  progressTimerId = window2.requestAnimationFrame(loop2);
                  topbar2.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
                })();
              }
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            clearTimeout(delayTimerId);
            delayTimerId = null;
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            ;
            (function loop2() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop2);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // js/beacon_live_admin.js
  var import_topbar = __toESM(require_topbar());

  // ../deps/live_monaco_editor/priv/static/live_monaco_editor.esm.js
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _defineProperty2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys2(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread22(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys2(Object(source), true).forEach(function(key) {
          _defineProperty2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys2(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function compose() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x) {
      return fns.reduceRight(function(y, f) {
        return f(y);
      }, x);
    };
  }
  function curry(fn) {
    return function curried() {
      var _this = this;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          nextArgs[_key3] = arguments[_key3];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  function isObject(value) {
    return {}.toString.call(value).includes("Object");
  }
  function isEmpty(obj) {
    return !Object.keys(obj).length;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  function validateChanges(initial, changes) {
    if (!isObject(changes))
      errorHandler("changeType");
    if (Object.keys(changes).some(function(field) {
      return !hasOwnProperty(initial, field);
    }))
      errorHandler("changeField");
    return changes;
  }
  function validateSelector(selector) {
    if (!isFunction(selector))
      errorHandler("selectorType");
  }
  function validateHandler(handler) {
    if (!(isFunction(handler) || isObject(handler)))
      errorHandler("handlerType");
    if (isObject(handler) && Object.values(handler).some(function(_handler) {
      return !isFunction(_handler);
    }))
      errorHandler("handlersType");
  }
  function validateInitial(initial) {
    if (!initial)
      errorHandler("initialIsRequired");
    if (!isObject(initial))
      errorHandler("initialType");
    if (isEmpty(initial))
      errorHandler("initialContent");
  }
  function throwError(errorMessages32, type) {
    throw new Error(errorMessages32[type] || errorMessages32["default"]);
  }
  var errorMessages = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
    "default": "an unknown error accured in `state-local` package"
  };
  var errorHandler = curry(throwError)(errorMessages);
  var validators = {
    changes: validateChanges,
    selector: validateSelector,
    handler: validateHandler,
    initial: validateInitial
  };
  function create(initial) {
    var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    validators.initial(initial);
    validators.handler(handler);
    var state = {
      current: initial
    };
    var didUpdate = curry(didStateUpdate)(state, handler);
    var update2 = curry(updateState)(state);
    var validate = curry(validators.changes)(initial);
    var getChanges = curry(extractChanges)(state);
    function getState22() {
      var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
        return state2;
      };
      validators.selector(selector);
      return selector(state.current);
    }
    function setState22(causedChanges) {
      compose(didUpdate, update2, validate, getChanges)(causedChanges);
    }
    return [getState22, setState22];
  }
  function extractChanges(state, causedChanges) {
    return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
  }
  function updateState(state, changes) {
    state.current = _objectSpread22(_objectSpread22({}, state.current), changes);
    return changes;
  }
  function didStateUpdate(state, handler, changes) {
    isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
      var _handler$field;
      return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
    });
    return changes;
  }
  var index = {
    create
  };
  var state_local_default = index;
  var config = {
    paths: {
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
    }
  };
  var config_default = config;
  function curry2(fn) {
    return function curried() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nextArgs[_key2] = arguments[_key2];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  var curry_default = curry2;
  function isObject2(value) {
    return {}.toString.call(value).includes("Object");
  }
  var isObject_default = isObject2;
  function validateConfig(config32) {
    if (!config32)
      errorHandler2("configIsRequired");
    if (!isObject_default(config32))
      errorHandler2("configType");
    if (config32.urls) {
      informAboutDeprecation();
      return {
        paths: {
          vs: config32.urls.monacoBase
        }
      };
    }
    return config32;
  }
  function informAboutDeprecation() {
    console.warn(errorMessages2.deprecation);
  }
  function throwError2(errorMessages32, type) {
    throw new Error(errorMessages32[type] || errorMessages32["default"]);
  }
  var errorMessages2 = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    "default": "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
  };
  var errorHandler2 = curry_default(throwError2)(errorMessages2);
  var validators2 = {
    config: validateConfig
  };
  var validators_default = validators2;
  var compose2 = function compose3() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x) {
      return fns.reduceRight(function(y, f) {
        return f(y);
      }, x);
    };
  };
  var compose_default = compose2;
  function merge(target, source) {
    Object.keys(source).forEach(function(key) {
      if (source[key] instanceof Object) {
        if (target[key]) {
          Object.assign(source[key], merge(target[key], source[key]));
        }
      }
    });
    return _objectSpread2(_objectSpread2({}, target), source);
  }
  var deepMerge_default = merge;
  var CANCELATION_MESSAGE = {
    type: "cancelation",
    msg: "operation is manually canceled"
  };
  function makeCancelable(promise2) {
    var hasCanceled_ = false;
    var wrappedPromise = new Promise(function(resolve, reject) {
      promise2.then(function(val) {
        return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
      });
      promise2["catch"](reject);
    });
    return wrappedPromise.cancel = function() {
      return hasCanceled_ = true;
    }, wrappedPromise;
  }
  var makeCancelable_default = makeCancelable;
  var _state$create = state_local_default.create({
    config: config_default,
    isInitialized: false,
    resolve: null,
    reject: null,
    monaco: null
  });
  var _state$create2 = _slicedToArray(_state$create, 2);
  var getState = _state$create2[0];
  var setState = _state$create2[1];
  function config2(globalConfig) {
    var _validators$config = validators_default.config(globalConfig), monaco = _validators$config.monaco, config32 = _objectWithoutProperties(_validators$config, ["monaco"]);
    setState(function(state) {
      return {
        config: deepMerge_default(state.config, config32),
        monaco
      };
    });
  }
  function init() {
    var state = getState(function(_ref) {
      var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
      return {
        monaco,
        isInitialized,
        resolve
      };
    });
    if (!state.isInitialized) {
      setState({
        isInitialized: true
      });
      if (state.monaco) {
        state.resolve(state.monaco);
        return makeCancelable_default(wrapperPromise);
      }
      if (window.monaco && window.monaco.editor) {
        storeMonacoInstance(window.monaco);
        state.resolve(window.monaco);
        return makeCancelable_default(wrapperPromise);
      }
      compose_default(injectScripts, getMonacoLoaderScript)(configureLoader);
    }
    return makeCancelable_default(wrapperPromise);
  }
  function injectScripts(script) {
    return document.body.appendChild(script);
  }
  function createScript(src) {
    var script = document.createElement("script");
    return src && (script.src = src), script;
  }
  function getMonacoLoaderScript(configureLoader22) {
    var state = getState(function(_ref2) {
      var config32 = _ref2.config, reject = _ref2.reject;
      return {
        config: config32,
        reject
      };
    });
    var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
    loaderScript.onload = function() {
      return configureLoader22();
    };
    loaderScript.onerror = state.reject;
    return loaderScript;
  }
  function configureLoader() {
    var state = getState(function(_ref3) {
      var config32 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
      return {
        config: config32,
        resolve,
        reject
      };
    });
    var require2 = window.require;
    require2.config(state.config);
    require2(["vs/editor/editor.main"], function(monaco) {
      storeMonacoInstance(monaco);
      state.resolve(monaco);
    }, function(error) {
      state.reject(error);
    });
  }
  function storeMonacoInstance(monaco) {
    if (!getState().monaco) {
      setState({
        monaco
      });
    }
  }
  function __getMonacoInstance() {
    return getState(function(_ref4) {
      var monaco = _ref4.monaco;
      return monaco;
    });
  }
  var wrapperPromise = new Promise(function(resolve, reject) {
    return setState({
      resolve,
      reject
    });
  });
  var loader = {
    config: config2,
    init,
    __getMonacoInstance
  };
  var loader_default = loader;
  var colors = {
    background: "#282c34",
    default: "#c4cad6",
    lightRed: "#e06c75",
    blue: "#61afef",
    gray: "#8c92a3",
    green: "#98c379",
    purple: "#c678dd",
    red: "#be5046",
    teal: "#56b6c2",
    peach: "#d19a66"
  };
  var rules = (colors2) => [
    { token: "", foreground: colors2.default },
    { token: "variable", foreground: colors2.lightRed },
    { token: "constant", foreground: colors2.blue },
    { token: "constant.character.escape", foreground: colors2.blue },
    { token: "comment", foreground: colors2.gray },
    { token: "number", foreground: colors2.blue },
    { token: "regexp", foreground: colors2.lightRed },
    { token: "type", foreground: colors2.lightRed },
    { token: "string", foreground: colors2.green },
    { token: "keyword", foreground: colors2.purple },
    { token: "operator", foreground: colors2.peach },
    { token: "delimiter.bracket.embed", foreground: colors2.red },
    { token: "sigil", foreground: colors2.teal },
    { token: "function", foreground: colors2.blue },
    { token: "function.call", foreground: colors2.default },
    // Markdown specific
    { token: "emphasis", fontStyle: "italic" },
    { token: "strong", fontStyle: "bold" },
    { token: "keyword.md", foreground: colors2.lightRed },
    { token: "keyword.table", foreground: colors2.lightRed },
    { token: "string.link.md", foreground: colors2.blue },
    { token: "variable.md", foreground: colors2.teal },
    { token: "string.md", foreground: colors2.default },
    { token: "variable.source.md", foreground: colors2.default },
    // XML specific
    { token: "tag", foreground: colors2.lightRed },
    { token: "metatag", foreground: colors2.lightRed },
    { token: "attribute.name", foreground: colors2.peach },
    { token: "attribute.value", foreground: colors2.green },
    // JSON specific
    { token: "string.key", foreground: colors2.lightRed },
    { token: "keyword.json", foreground: colors2.blue },
    // SQL specific
    { token: "operator.sql", foreground: colors2.purple }
  ];
  var theme = {
    base: "vs-dark",
    inherit: false,
    rules: rules(colors),
    colors: {
      "editor.background": colors.background,
      "editor.foreground": colors.default,
      "editorLineNumber.foreground": "#636d83",
      "editorCursor.foreground": "#636d83",
      "editor.selectionBackground": "#3e4451",
      "editor.findMatchHighlightBackground": "#528bff3d",
      "editorSuggestWidget.background": "#21252b",
      "editorSuggestWidget.border": "#181a1f",
      "editorSuggestWidget.selectedBackground": "#2c313a",
      "input.background": "#1b1d23",
      "input.border": "#181a1f",
      "editorBracketMatch.border": "#282c34",
      "editorBracketMatch.background": "#3e4451"
    }
  };
  var CodeEditor = class {
    constructor(el, path, value, opts) {
      this.el = el;
      this.path = path;
      this.value = value;
      this.opts = opts;
      this.standalone_code_editor = null;
      this._onMount = [];
    }
    isMounted() {
      return !!this.standalone_code_editor;
    }
    mount() {
      if (this.isMounted()) {
        throw new Error("The monaco editor is already mounted");
      }
      this._mountEditor();
    }
    onMount(callback) {
      this._onMount.push(callback);
    }
    dispose() {
      if (this.isMounted()) {
        const model = this.standalone_code_editor.getModel();
        if (model) {
          model.dispose();
        }
        this.standalone_code_editor.dispose();
      }
    }
    _mountEditor() {
      this.opts.value = this.value;
      loader_default.config({
        paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" }
      });
      loader_default.init().then((monaco) => {
        monaco.editor.defineTheme("default", theme);
        let modelUri = monaco.Uri.parse(this.path);
        let language = this.opts.language;
        let model = monaco.editor.createModel(this.value, language, modelUri);
        this.opts.language = void 0;
        this.opts.model = model;
        this.standalone_code_editor = monaco.editor.create(this.el, this.opts);
        this._onMount.forEach((callback) => callback(monaco));
        this._setScreenDependantEditorOptions();
        this.standalone_code_editor.addAction({
          contextMenuGroupId: "word-wrapping",
          id: "enable-word-wrapping",
          label: "Enable word wrapping",
          precondition: "config.editor.wordWrap == off",
          keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
          run: (editor) => editor.updateOptions({ wordWrap: "on" })
        });
        this.standalone_code_editor.addAction({
          contextMenuGroupId: "word-wrapping",
          id: "disable-word-wrapping",
          label: "Disable word wrapping",
          precondition: "config.editor.wordWrap == on",
          keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
          run: (editor) => editor.updateOptions({ wordWrap: "off" })
        });
        const resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(() => {
            if (this.el.offsetHeight > 0) {
              this._setScreenDependantEditorOptions();
              this.standalone_code_editor.layout();
            }
          });
        });
        resizeObserver.observe(this.el);
        this.standalone_code_editor.onDidContentSizeChange(() => {
          const contentHeight = this.standalone_code_editor.getContentHeight();
          this.el.style.height = `${contentHeight}px`;
        });
      });
    }
    _setScreenDependantEditorOptions() {
      if (window.screen.width < 768) {
        this.standalone_code_editor.updateOptions({
          folding: false,
          lineDecorationsWidth: 16,
          lineNumbersMinChars: Math.floor(
            Math.log10(this.standalone_code_editor.getModel().getLineCount())
          ) + 3
        });
      } else {
        this.standalone_code_editor.updateOptions({
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 5
        });
      }
    }
  };
  var code_editor_default = CodeEditor;
  var CodeEditorHook = {
    mounted() {
      const opts = JSON.parse(this.el.dataset.opts);
      this.codeEditor = new code_editor_default(
        this.el,
        this.el.dataset.path,
        this.el.dataset.value,
        opts
      );
      this.codeEditor.onMount((monaco) => {
        if (this.el.dataset.changeEvent && this.el.dataset.changeEvent !== "") {
          this.codeEditor.standalone_code_editor.onDidChangeModelContent(() => {
            if (this.el.dataset.target && this.el.dataset.target !== "") {
              this.pushEventTo(
                this.el.dataset.target,
                this.el.dataset.changeEvent,
                {
                  value: this.codeEditor.standalone_code_editor.getValue()
                }
              );
            } else {
              this.pushEvent(this.el.dataset.changeEvent, {
                value: this.codeEditor.standalone_code_editor.getValue()
              });
            }
          });
        }
        this.handleEvent(
          "lme:change_language:" + this.el.dataset.path,
          (data) => {
            const model = this.codeEditor.standalone_code_editor.getModel();
            if (model.getLanguageId() !== data.mimeTypeOrLanguageId) {
              monaco.editor.setModelLanguage(model, data.mimeTypeOrLanguageId);
            }
          }
        );
        this.handleEvent("lme:set_value:" + this.el.dataset.path, (data) => {
          this.codeEditor.standalone_code_editor.setValue(data.value);
        });
        this.el.querySelectorAll("textarea").forEach((textarea) => {
          textarea.setAttribute(
            "name",
            "live_monaco_editor[" + this.el.dataset.path + "]"
          );
        });
        this.el.removeAttribute("data-value");
        this.el.removeAttribute("data-opts");
        this.el.dispatchEvent(
          new CustomEvent("lme:editor_mounted", {
            detail: { hook: this, editor: this.codeEditor },
            bubbles: true
          })
        );
      });
      if (!this.codeEditor.isMounted()) {
        this.codeEditor.mount();
      }
    },
    destroyed() {
      if (this.codeEditor) {
        this.codeEditor.dispose();
      }
    }
  };

  // ../deps/live_svelte/priv/static/live_svelte.esm.js
  function normalizeComponents(components) {
    if (!Array.isArray(components.default) || !Array.isArray(components.filenames))
      return components;
    const normalized = {};
    for (const [index3, module] of components.default.entries()) {
      const Component = module.default;
      const name = components.filenames[index3].replace("../svelte/", "").replace(".svelte", "");
      normalized[name] = Component;
    }
    return normalized;
  }
  function getAttributeJson(ref, attributeName) {
    const data = ref.el.getAttribute(attributeName);
    return data ? JSON.parse(data) : {};
  }
  function detach(node) {
    node.parentNode?.removeChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function noop() {
  }
  function getSlots(ref) {
    const slots = {};
    for (const slotName in getAttributeJson(ref, "data-slots")) {
      const slot = () => {
        return {
          getElement() {
            const base64 = getAttributeJson(ref, "data-slots")[slotName];
            const element2 = document.createElement("div");
            element2.innerHTML = atob(base64).trim();
            return element2;
          },
          update() {
            detach(this.savedElement);
            this.savedElement = this.getElement();
            insert(this.savedTarget, this.savedElement, this.savedAnchor);
          },
          c: noop,
          m(target, anchor) {
            this.savedTarget = target;
            this.savedAnchor = anchor;
            this.savedElement = this.getElement();
            insert(this.savedTarget, this.savedElement, this.savedAnchor);
          },
          d(detaching) {
            if (detaching)
              detach(this.savedElement);
          },
          l: noop
        };
      };
      slots[slotName] = [slot];
    }
    return slots;
  }
  function getLiveJsonProps(ref) {
    const json = getAttributeJson(ref, "data-live-json");
    if (!Array.isArray(json))
      return json;
    const liveJsonData = {};
    for (const liveJsonVariable of json) {
      const data = window[liveJsonVariable];
      if (data)
        liveJsonData[liveJsonVariable] = data;
    }
    return liveJsonData;
  }
  function getProps(ref) {
    return {
      ...getAttributeJson(ref, "data-props"),
      ...getLiveJsonProps(ref),
      live: ref,
      $$slots: getSlots(ref),
      $$scope: {}
    };
  }
  function findSlotCtx(component) {
    return component.$$.ctx.find((ctxElement) => ctxElement?.default);
  }
  function getHooks(components) {
    components = normalizeComponents(components);
    const SvelteHook = {
      mounted() {
        const componentName = this.el.getAttribute("data-name");
        if (!componentName) {
          throw new Error("Component name must be provided");
        }
        const Component = components[componentName];
        if (!Component) {
          throw new Error(`Unable to find ${componentName} component.`);
        }
        for (const liveJsonElement of Object.keys(getAttributeJson(this, "data-live-json"))) {
          window.addEventListener(`${liveJsonElement}_initialized`, (event) => this._instance.$set(getProps(this)), false);
          window.addEventListener(`${liveJsonElement}_patched`, (event) => this._instance.$set(getProps(this)), false);
        }
        this._instance = new Component({
          target: this.el,
          props: getProps(this),
          hydrate: this.el.hasAttribute("data-ssr")
        });
      },
      updated() {
        this._instance.$set(getProps(this));
        const slotCtx = findSlotCtx(this._instance);
        for (const key in slotCtx) {
          slotCtx[key][0]().update();
        }
      },
      destroyed() {
      }
    };
    return {
      SvelteHook
    };
  }

  // import-glob:../svelte/**/*.svelte
  var __exports = {};
  __export(__exports, {
    default: () => __default,
    filenames: () => filenames
  });

  // svelte/components/Backdrop.svelte
  var Backdrop_exports = {};
  __export(Backdrop_exports, {
    backdropVisible: () => backdropVisible,
    default: () => Backdrop_default
  });

  // node_modules/svelte/src/runtime/internal/utils.js
  function noop2() {
  }
  var identity = (x) => x;
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return (
      /** @type {T & S} */
      tar
    );
  }
  function add_location(element2, file13, line, column, char) {
    element2.__svelte_meta = {
      loc: { file: file13, line, column, char }
    };
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  var src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (element_src === url)
      return true;
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== "function") {
      throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      for (const callback of callbacks) {
        callback(void 0);
      }
      return noop2;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function get_store_value(store) {
    let value;
    subscribe(store, (_) => value = _)();
    return value;
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function compute_slots(slots) {
    const result = {};
    for (const key in slots) {
      result[key] = true;
    }
    return result;
  }
  function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop2;
  }

  // node_modules/svelte/src/runtime/internal/environment.js
  var is_client = typeof window !== "undefined";
  var now = is_client ? () => window.performance.now() : () => Date.now();
  var raf = is_client ? (cb) => requestAnimationFrame(cb) : noop2;

  // node_modules/svelte/src/runtime/internal/loop.js
  var tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0)
      raf(run_tasks);
  }
  function loop(callback) {
    let task;
    if (tasks.size === 0)
      raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }

  // node_modules/svelte/src/runtime/internal/globals.js
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
    // @ts-ignore Node typings have this
    global
  );

  // node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
  var ResizeObserverSingleton = class _ResizeObserverSingleton {
    /** @param {ResizeObserverOptions} options */
    constructor(options) {
      /**
       * @private
       * @readonly
       * @type {WeakMap<Element, import('./private.js').Listener>}
       */
      __publicField(this, "_listeners", "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0);
      /**
       * @private
       * @type {ResizeObserver}
       */
      __publicField(this, "_observer");
      /** @type {ResizeObserverOptions} */
      __publicField(this, "options");
      this.options = options;
    }
    /**
     * @param {Element} element
     * @param {import('./private.js').Listener} listener
     * @returns {() => void}
     */
    observe(element2, listener) {
      this._listeners.set(element2, listener);
      this._getObserver().observe(element2, this.options);
      return () => {
        this._listeners.delete(element2);
        this._observer.unobserve(element2);
      };
    }
    /**
     * @private
     */
    _getObserver() {
      return this._observer ?? (this._observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          _ResizeObserverSingleton.entries.set(entry.target, entry);
          this._listeners.get(entry.target)?.(entry);
        }
      }));
    }
  };
  ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

  // node_modules/svelte/src/runtime/internal/dom.js
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function upper_bound(low, high, key, value) {
    while (low < high) {
      const mid = low + (high - low >> 1);
      if (key(mid) <= value) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }
  function init_hydrate(target) {
    if (target.hydrate_init)
      return;
    target.hydrate_init = true;
    let children2 = (
      /** @type {ArrayLike<NodeEx2>} */
      target.childNodes
    );
    if (target.nodeName === "HEAD") {
      const my_children = [];
      for (let i = 0; i < children2.length; i++) {
        const node = children2[i];
        if (node.claim_order !== void 0) {
          my_children.push(node);
        }
      }
      children2 = my_children;
    }
    const m = new Int32Array(children2.length + 1);
    const p = new Int32Array(children2.length);
    m[0] = -1;
    let longest = 0;
    for (let i = 0; i < children2.length; i++) {
      const current = children2[i].claim_order;
      const seq_len = (longest > 0 && children2[m[longest]].claim_order <= current ? longest + 1 : upper_bound(1, longest, (idx) => children2[m[idx]].claim_order, current)) - 1;
      p[i] = m[seq_len] + 1;
      const new_len = seq_len + 1;
      m[new_len] = i;
      longest = Math.max(new_len, longest);
    }
    const lis = [];
    const to_move = [];
    let last = children2.length - 1;
    for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
      lis.push(children2[cur - 1]);
      for (; last >= cur; last--) {
        to_move.push(children2[last]);
      }
      last--;
    }
    for (; last >= 0; last--) {
      to_move.push(children2[last]);
    }
    lis.reverse();
    to_move.sort((a, b) => a.claim_order - b.claim_order);
    for (let i = 0, j = 0; i < to_move.length; i++) {
      while (j < lis.length && to_move[i].claim_order >= lis[j].claim_order) {
        j++;
      }
      const anchor = j < lis.length ? lis[j] : null;
      target.insertBefore(to_move[i], anchor);
    }
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
      const style = element("style");
      style.id = style_sheet_id;
      style.textContent = styles;
      append_stylesheet(append_styles_to, style);
    }
  }
  function get_root_for_style(node) {
    if (!node)
      return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && /** @type {ShadowRoot} */
    root.host) {
      return (
        /** @type {ShadowRoot} */
        root
      );
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    style_element.textContent = "/* empty */";
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(
      /** @type {Document} */
      node.head || node,
      style
    );
    return style.sheet;
  }
  function append_hydration(target, node) {
    if (is_hydrating) {
      init_hydrate(target);
      if (target.actual_end_child === void 0 || target.actual_end_child !== null && target.actual_end_child.parentNode !== target) {
        target.actual_end_child = target.firstChild;
      }
      while (target.actual_end_child !== null && target.actual_end_child.claim_order === void 0) {
        target.actual_end_child = target.actual_end_child.nextSibling;
      }
      if (node !== target.actual_end_child) {
        if (node.claim_order !== void 0 || node.parentNode !== target) {
          target.insertBefore(node, target.actual_end_child);
        }
      } else {
        target.actual_end_child = node.nextSibling;
      }
    } else if (node.parentNode !== target || node.nextSibling !== null) {
      target.appendChild(node);
    }
  }
  function insert2(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function insert_hydration(target, node, anchor) {
    if (is_hydrating && !anchor) {
      append_hydration(target, node);
    } else if (node.parentNode !== target || node.nextSibling != anchor) {
      target.insertBefore(node, anchor || null);
    }
  }
  function detach2(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i])
        iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function prevent_default(fn) {
    return function(event) {
      event.preventDefault();
      return fn.call(this, event);
    };
  }
  function stop_propagation(fn) {
    return function(event) {
      event.stopPropagation();
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  var always_set_through_set_attribute = ["width", "height"];
  function set_attributes(node, attributes) {
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
      if (attributes[key] == null) {
        node.removeAttribute(key);
      } else if (key === "style") {
        node.style.cssText = attributes[key];
      } else if (key === "__value") {
        node.value = node[key] = attributes[key];
      } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
        node[key] = attributes[key];
      } else {
        attr(node, key, attributes[key]);
      }
    }
  }
  function set_custom_element_data_map(node, data_map) {
    Object.keys(data_map).forEach((key) => {
      set_custom_element_data(node, key, data_map[key]);
    });
  }
  function set_custom_element_data(node, prop, value) {
    const lower = prop.toLowerCase();
    if (lower in node) {
      node[lower] = typeof node[lower] === "boolean" && value === "" ? true : value;
    } else if (prop in node) {
      node[prop] = typeof node[prop] === "boolean" && value === "" ? true : value;
    } else {
      attr(node, prop, value);
    }
  }
  function set_dynamic_element_data(tag) {
    return /-/.test(tag) ? set_custom_element_data_map : set_attributes;
  }
  function get_svelte_dataset(node) {
    return node.dataset.svelteH;
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function init_claim_info(nodes) {
    if (nodes.claim_info === void 0) {
      nodes.claim_info = { last_index: 0, total_claimed: 0 };
    }
  }
  function claim_node(nodes, predicate, process_node, create_node, dont_update_last_index = false) {
    init_claim_info(nodes);
    const result_node = (() => {
      for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
        const node = nodes[i];
        if (predicate(node)) {
          const replacement = process_node(node);
          if (replacement === void 0) {
            nodes.splice(i, 1);
          } else {
            nodes[i] = replacement;
          }
          if (!dont_update_last_index) {
            nodes.claim_info.last_index = i;
          }
          return node;
        }
      }
      for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
        const node = nodes[i];
        if (predicate(node)) {
          const replacement = process_node(node);
          if (replacement === void 0) {
            nodes.splice(i, 1);
          } else {
            nodes[i] = replacement;
          }
          if (!dont_update_last_index) {
            nodes.claim_info.last_index = i;
          } else if (replacement === void 0) {
            nodes.claim_info.last_index--;
          }
          return node;
        }
      }
      return create_node();
    })();
    result_node.claim_order = nodes.claim_info.total_claimed;
    nodes.claim_info.total_claimed += 1;
    return result_node;
  }
  function claim_element_base(nodes, name, attributes, create_element) {
    return claim_node(
      nodes,
      /** @returns {node is Element | SVGElement} */
      (node) => node.nodeName === name,
      /** @param {Element} node */
      (node) => {
        const remove = [];
        for (let j = 0; j < node.attributes.length; j++) {
          const attribute = node.attributes[j];
          if (!attributes[attribute.name]) {
            remove.push(attribute.name);
          }
        }
        remove.forEach((v) => node.removeAttribute(v));
        return void 0;
      },
      () => create_element(name)
    );
  }
  function claim_element(nodes, name, attributes) {
    return claim_element_base(nodes, name, attributes, element);
  }
  function claim_svg_element(nodes, name, attributes) {
    return claim_element_base(nodes, name, attributes, svg_element);
  }
  function claim_text(nodes, data) {
    return claim_node(
      nodes,
      /** @returns {node is Text} */
      (node) => node.nodeType === 3,
      /** @param {Text} node */
      (node) => {
        const data_str = "" + data;
        if (node.data.startsWith(data_str)) {
          if (node.data.length !== data_str.length) {
            return node.splitText(data_str.length);
          }
        } else {
          node.data = data_str;
        }
      },
      () => text(data),
      true
      // Text nodes should not update last index since it is likely not worth it to eliminate an increasing subsequence of actual elements
    );
  }
  function claim_space(nodes) {
    return claim_text(nodes, " ");
  }
  function get_comment_idx(nodes, text2, start) {
    for (let i = start; i < nodes.length; i += 1) {
      const node = nodes[i];
      if (node.nodeType === 8 && node.textContent.trim() === text2) {
        return i;
      }
    }
    return -1;
  }
  function claim_html_tag(nodes, is_svg) {
    const start_index = get_comment_idx(nodes, "HTML_TAG_START", 0);
    const end_index = get_comment_idx(nodes, "HTML_TAG_END", start_index + 1);
    if (start_index === -1 || end_index === -1) {
      return new HtmlTagHydration(is_svg);
    }
    init_claim_info(nodes);
    const html_tag_nodes = nodes.splice(start_index, end_index - start_index + 1);
    detach2(html_tag_nodes[0]);
    detach2(html_tag_nodes[html_tag_nodes.length - 1]);
    const claimed_nodes = html_tag_nodes.slice(1, html_tag_nodes.length - 1);
    if (claimed_nodes.length === 0) {
      return new HtmlTagHydration(is_svg);
    }
    for (const n of claimed_nodes) {
      n.claim_order = nodes.claim_info.total_claimed;
      nodes.claim_info.total_claimed += 1;
    }
    return new HtmlTagHydration(is_svg, claimed_nodes);
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element2, name, toggle) {
    element2.classList.toggle(name, !!toggle);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    return new CustomEvent(type, { detail, bubbles, cancelable });
  }
  var HtmlTag = class {
    constructor(is_svg = false) {
      /**
       * @private
       * @default false
       */
      __publicField(this, "is_svg", false);
      /** parent for creating node */
      __publicField(this, "e");
      /** html tag nodes */
      __publicField(this, "n");
      /** target */
      __publicField(this, "t");
      /** anchor */
      __publicField(this, "a");
      this.is_svg = is_svg;
      this.e = this.n = null;
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    c(html) {
      this.h(html);
    }
    /**
     * @param {string} html
     * @param {HTMLElement | SVGElement} target
     * @param {HTMLElement | SVGElement} anchor
     * @returns {void}
     */
    m(html, target, anchor = null) {
      if (!this.e) {
        if (this.is_svg)
          this.e = svg_element(
            /** @type {keyof SVGElementTagNameMap} */
            target.nodeName
          );
        else
          this.e = element(
            /** @type {keyof HTMLElementTagNameMap} */
            target.nodeType === 11 ? "TEMPLATE" : target.nodeName
          );
        this.t = target.tagName !== "TEMPLATE" ? target : (
          /** @type {HTMLTemplateElement} */
          target.content
        );
        this.c(html);
      }
      this.i(anchor);
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    h(html) {
      this.e.innerHTML = html;
      this.n = Array.from(
        this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes
      );
    }
    /**
     * @returns {void} */
    i(anchor) {
      for (let i = 0; i < this.n.length; i += 1) {
        insert2(this.t, this.n[i], anchor);
      }
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    p(html) {
      this.d();
      this.h(html);
      this.i(this.a);
    }
    /**
     * @returns {void} */
    d() {
      this.n.forEach(detach2);
    }
  };
  var HtmlTagHydration = class extends HtmlTag {
    constructor(is_svg = false, claimed_nodes) {
      super(is_svg);
      /** @type {Element[]} hydration claimed nodes */
      __publicField(this, "l");
      this.e = this.n = null;
      this.l = claimed_nodes;
    }
    /**
     * @param {string} html
     * @returns {void}
     */
    c(html) {
      if (this.l) {
        this.n = this.l;
      } else {
        super.c(html);
      }
    }
    /**
     * @returns {void} */
    i(anchor) {
      for (let i = 0; i < this.n.length; i += 1) {
        insert_hydration(this.t, this.n[i], anchor);
      }
    }
  };
  function get_custom_elements_slots(element2) {
    const result = {};
    element2.childNodes.forEach(
      /** @param {Element} node */
      (node) => {
        result[node.slot || "default"] = true;
      }
    );
    return result;
  }

  // node_modules/svelte/src/runtime/internal/style_manager.js
  var managed_styles = /* @__PURE__ */ new Map();
  var active = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--)
      hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules: rules2 } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules2[name]) {
      rules2[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
      // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active)
        clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active)
        return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        if (ownerNode)
          detach2(ownerNode);
      });
      managed_styles.clear();
    });
  }

  // node_modules/svelte/src/runtime/internal/lifecycle.js
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        const event = custom_event(
          /** @type {string} */
          type,
          detail,
          { cancelable }
        );
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
  }

  // node_modules/svelte/src/runtime/internal/scheduler.js
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = /* @__PURE__ */ Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var seen_callbacks = /* @__PURE__ */ new Set();
  var flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }

  // node_modules/svelte/src/runtime/internal/transitions.js
  var promise;
  function wait() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
  }
  var outroing = /* @__PURE__ */ new Set();
  var outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach3, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach3)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  var null_transition = { duration: 0 };
  function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: "both" };
    let config5 = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    let original_inert_value;
    function clear_animation() {
      if (animation_name)
        delete_rule(node, animation_name);
    }
    function init4(program, duration) {
      const d = (
        /** @type {Program['d']} */
        program.b - t
      );
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }
    function go(b) {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick: tick2 = noop2,
        css
      } = config5 || null_transition;
      const program = {
        start: now() + delay,
        b
      };
      if (!b) {
        program.group = outros;
        outros.r += 1;
      }
      if ("inert" in node) {
        if (b) {
          if (original_inert_value !== void 0) {
            node.inert = original_inert_value;
          }
        } else {
          original_inert_value = /** @type {HTMLElement} */
          node.inert;
          node.inert = true;
        }
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t, b, duration, delay, easing, css);
        }
        if (b)
          tick2(0, 1);
        running_program = init4(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop((now2) => {
          if (pending_program && now2 > pending_program.start) {
            running_program = init4(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(
                node,
                t,
                running_program.b,
                running_program.duration,
                0,
                easing,
                config5.css
              );
            }
          }
          if (running_program) {
            if (now2 >= running_program.end) {
              tick2(t = running_program.b, 1 - t);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                if (running_program.b) {
                  clear_animation();
                } else {
                  if (!--running_program.group.r)
                    run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now2 >= running_program.start) {
              const p = now2 - running_program.start;
              t = running_program.a + running_program.d * easing(p / running_program.duration);
              tick2(t, 1 - t);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config5)) {
          wait().then(() => {
            const opts = { direction: b ? "in" : "out" };
            config5 = config5(opts);
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }

  // node_modules/svelte/src/runtime/internal/each.js
  function ensure_array_like(array_like_or_iterator) {
    return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block7, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
      old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block7(key, child_ctx);
        block.c();
      } else if (dynamic) {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes)
        deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert3(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert3(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert3(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key))
        destroy(old_block, lookup);
    }
    while (n)
      insert3(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
  }
  function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = /* @__PURE__ */ new Map();
    for (let i = 0; i < list.length; i++) {
      const key = get_key(get_context(ctx, list, i));
      if (keys.has(key)) {
        let value = "";
        try {
          value = `with value '${String(key)}' `;
        } catch (e) {
        }
        throw new Error(
          `Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
            key
          )} and ${i} ${value}are duplicates`
        );
      }
      keys.set(key, i);
    }
  }

  // node_modules/svelte/src/runtime/internal/spread.js
  function get_spread_update(levels, updates) {
    const update2 = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
      const o = levels[i];
      const n = updates[i];
      if (n) {
        for (const key in o) {
          if (!(key in n))
            to_null_out[key] = 1;
        }
        for (const key in n) {
          if (!accounted_for[key]) {
            update2[key] = n[key];
            accounted_for[key] = 1;
          }
        }
        levels[i] = n;
      } else {
        for (const key in o) {
          accounted_for[key] = 1;
        }
      }
    }
    for (const key in to_null_out) {
      if (!(key in update2))
        update2[key] = void 0;
    }
    return update2;
  }

  // node_modules/svelte/src/shared/boolean_attributes.js
  var _boolean_attributes = (
    /** @type {const} */
    [
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "inert",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ]
  );
  var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

  // node_modules/svelte/src/shared/utils/names.js
  var void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
  function is_void(name) {
    return void_element_names.test(name) || name.toLowerCase() === "!doctype";
  }

  // node_modules/svelte/src/runtime/internal/Component.js
  function create_component(block) {
    block && block.c();
  }
  function claim_component(block, parent_nodes) {
    block && block.l(parent_nodes);
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init2(component, options, instance13, create_fragment13, not_equal, props, append_styles2 = null, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop2,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles2 && append_styles2($$.root);
    let ready = false;
    $$.ctx = instance13 ? instance13(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment13 ? create_fragment13($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach2);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor($$componentCtor, $$slots, use_shadow_dom) {
        super();
        /** The Svelte component constructor */
        __publicField(this, "$$ctor");
        /** Slots */
        __publicField(this, "$$s");
        /** The Svelte component instance */
        __publicField(this, "$$c");
        /** Whether or not the custom element is connected */
        __publicField(this, "$$cn", false);
        /** Component props data */
        __publicField(this, "$$d", {});
        /** `true` if currently in the process of reflecting component props back to attributes */
        __publicField(this, "$$r", false);
        /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
        __publicField(this, "$$p_d", {});
        /** @type {Record<string, Function[]>} Event listeners */
        __publicField(this, "$$l", {});
        /** @type {Map<Function, Function>} Event listener unsubscribe functions */
        __publicField(this, "$$l_u", /* @__PURE__ */ new Map());
        this.$$ctor = $$componentCtor;
        this.$$s = $$slots;
        if (use_shadow_dom) {
          this.attachShadow({ mode: "open" });
        }
      }
      addEventListener(type, listener, options) {
        this.$$l[type] = this.$$l[type] || [];
        this.$$l[type].push(listener);
        if (this.$$c) {
          const unsub = this.$$c.$on(type, listener);
          this.$$l_u.set(listener, unsub);
        }
        super.addEventListener(type, listener, options);
      }
      removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
        if (this.$$c) {
          const unsub = this.$$l_u.get(listener);
          if (unsub) {
            unsub();
            this.$$l_u.delete(listener);
          }
        }
      }
      async connectedCallback() {
        this.$$cn = true;
        if (!this.$$c) {
          let create_slot2 = function(name) {
            return () => {
              let node;
              const obj = {
                c: function create3() {
                  node = element("slot");
                  if (name !== "default") {
                    attr(node, "name", name);
                  }
                },
                /**
                 * @param {HTMLElement} target
                 * @param {HTMLElement} [anchor]
                 */
                m: function mount(target, anchor) {
                  insert2(target, node, anchor);
                },
                d: function destroy(detaching) {
                  if (detaching) {
                    detach2(node);
                  }
                }
              };
              return obj;
            };
          };
          await Promise.resolve();
          if (!this.$$cn || this.$$c) {
            return;
          }
          const $$slots = {};
          const existing_slots = get_custom_elements_slots(this);
          for (const name of this.$$s) {
            if (name in existing_slots) {
              $$slots[name] = [create_slot2(name)];
            }
          }
          for (const attribute of this.attributes) {
            const name = this.$$g_p(attribute.name);
            if (!(name in this.$$d)) {
              this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
            }
          }
          for (const key in this.$$p_d) {
            if (!(key in this.$$d) && this[key] !== void 0) {
              this.$$d[key] = this[key];
              delete this[key];
            }
          }
          this.$$c = new this.$$ctor({
            target: this.shadowRoot || this,
            props: {
              ...this.$$d,
              $$slots,
              $$scope: {
                ctx: []
              }
            }
          });
          const reflect_attributes = () => {
            this.$$r = true;
            for (const key in this.$$p_d) {
              this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
              if (this.$$p_d[key].reflect) {
                const attribute_value = get_custom_element_value(
                  key,
                  this.$$d[key],
                  this.$$p_d,
                  "toAttribute"
                );
                if (attribute_value == null) {
                  this.removeAttribute(this.$$p_d[key].attribute || key);
                } else {
                  this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
                }
              }
            }
            this.$$r = false;
          };
          this.$$c.$$.after_update.push(reflect_attributes);
          reflect_attributes();
          for (const type in this.$$l) {
            for (const listener of this.$$l[type]) {
              const unsub = this.$$c.$on(type, listener);
              this.$$l_u.set(listener, unsub);
            }
          }
          this.$$l = {};
        }
      }
      // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
      // and setting attributes through setAttribute etc, this is helpful
      attributeChangedCallback(attr2, _oldValue, newValue) {
        if (this.$$r)
          return;
        attr2 = this.$$g_p(attr2);
        this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
        this.$$c?.$set({ [attr2]: this.$$d[attr2] });
      }
      disconnectedCallback() {
        this.$$cn = false;
        Promise.resolve().then(() => {
          if (!this.$$cn) {
            this.$$c.$destroy();
            this.$$c = void 0;
          }
        });
      }
      $$g_p(attribute_name) {
        return Object.keys(this.$$p_d).find(
          (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
        ) || attribute_name;
      }
    };
  }
  function get_custom_element_value(prop, value, props_definition, transform) {
    const type = props_definition[prop]?.type;
    value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
    if (!transform || !props_definition[prop]) {
      return value;
    } else if (transform === "toAttribute") {
      switch (type) {
        case "Object":
        case "Array":
          return value == null ? null : JSON.stringify(value);
        case "Boolean":
          return value ? "" : null;
        case "Number":
          return value == null ? null : value;
        default:
          return value;
      }
    } else {
      switch (type) {
        case "Object":
        case "Array":
          return value && JSON.parse(value);
        case "Boolean":
          return value;
        case "Number":
          return value != null ? +value : value;
        default:
          return value;
      }
    }
  }
  function create_custom_element(Component, props_definition, slots, accessors, use_shadow_dom, extend) {
    let Class = class extends SvelteElement {
      constructor() {
        super(Component, slots, use_shadow_dom);
        this.$$p_d = props_definition;
      }
      static get observedAttributes() {
        return Object.keys(props_definition).map(
          (key) => (props_definition[key].attribute || key).toLowerCase()
        );
      }
    };
    Object.keys(props_definition).forEach((prop) => {
      Object.defineProperty(Class.prototype, prop, {
        get() {
          return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
        },
        set(value) {
          value = get_custom_element_value(prop, value, props_definition);
          this.$$d[prop] = value;
          this.$$c?.$set({ [prop]: value });
        }
      });
    });
    accessors.forEach((accessor) => {
      Object.defineProperty(Class.prototype, accessor, {
        get() {
          return this.$$c?.[accessor];
        }
      });
    });
    if (extend) {
      Class = extend(Class);
    }
    Component.element = /** @type {any} */
    Class;
    return Class;
  }
  var SvelteComponent = class {
    constructor() {
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$");
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$set");
    }
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop2;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index3 = callbacks.indexOf(callback);
        if (index3 !== -1)
          callbacks.splice(index3, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  };

  // node_modules/svelte/src/shared/version.js
  var VERSION = "4.2.12";
  var PUBLIC_VERSION = "4";

  // node_modules/svelte/src/runtime/internal/dev.js
  function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
  }
  function append_hydration_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append_hydration(target, node);
  }
  function insert_hydration_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert_hydration(target, node, anchor);
  }
  function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach2(node);
  }
  function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
      modifiers.push("preventDefault");
    if (has_stop_propagation)
      modifiers.push("stopPropagation");
    if (has_stop_immediate_propagation)
      modifiers.push("stopImmediatePropagation");
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
      dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
      dispose();
    };
  }
  function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
      dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
      dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
  }
  function set_data_dev(text2, data) {
    data = "" + data;
    if (text2.data === data)
      return;
    dispatch_dev("SvelteDOMSetData", { node: text2, data });
    text2.data = /** @type {string} */
    data;
  }
  function ensure_array_like_dev(arg) {
    if (typeof arg !== "string" && !(arg && typeof arg === "object" && "length" in arg) && !(typeof Symbol === "function" && arg && Symbol.iterator in arg)) {
      throw new Error("{#each} only works with iterable values.");
    }
    return ensure_array_like(arg);
  }
  function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
      if (!~keys.indexOf(slot_key)) {
        console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
      }
    }
  }
  function validate_dynamic_element(tag) {
    const is_string = typeof tag === "string";
    if (tag && !is_string) {
      throw new Error('<svelte:element> expects "this" attribute to be a string.');
    }
  }
  function validate_void_dynamic_element(tag) {
    if (tag && is_void(tag)) {
      console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
    }
  }
  var SvelteComponentDev = class extends SvelteComponent {
    /** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
    constructor(options) {
      if (!options || !options.target && !options.$$inline) {
        throw new Error("'target' is a required option");
      }
      super();
      /**
       * For type checking capabilities only.
       * Does not exist at runtime.
       * ### DO NOT USE!
       *
       * @type {Props}
       */
      __publicField(this, "$$prop_def");
      /**
       * For type checking capabilities only.
       * Does not exist at runtime.
       * ### DO NOT USE!
       *
       * @type {Events}
       */
      __publicField(this, "$$events_def");
      /**
       * For type checking capabilities only.
       * Does not exist at runtime.
       * ### DO NOT USE!
       *
       * @type {Slots}
       */
      __publicField(this, "$$slot_def");
    }
    /** @returns {void} */
    $destroy() {
      super.$destroy();
      this.$destroy = () => {
        console.warn("Component was already destroyed");
      };
    }
    /** @returns {void} */
    $capture_state() {
    }
    /** @returns {void} */
    $inject_state() {
    }
  };

  // node_modules/svelte/src/runtime/internal/disclose-version/index.js
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

  // node_modules/svelte/src/runtime/transition/index.js
  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`
    };
  }

  // node_modules/svelte/src/runtime/store/index.js
  var subscriber_queue = [];
  function readable(value, start) {
    return {
      subscribe: writable(value, start).subscribe
    };
  }
  function writable(value, start = noop2) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop2) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update2) || noop2;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    if (!stores_array.every(Boolean)) {
      throw new Error("derived() expects stores as input, got a falsy value");
    }
    const auto = fn.length < 2;
    return readable(initial_value, (set, update2) => {
      let started = false;
      const values = [];
      let pending = 0;
      let cleanup = noop2;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup();
        const result = fn(single ? values[0] : values, set, update2);
        if (auto) {
          set(result);
        } else {
          cleanup = is_function(result) ? result : noop2;
        }
      };
      const unsubscribers = stores_array.map(
        (store, i) => subscribe(
          store,
          (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (started) {
              sync();
            }
          },
          () => {
            pending |= 1 << i;
          }
        )
      );
      started = true;
      sync();
      return function stop() {
        run_all(unsubscribers);
        cleanup();
        started = false;
      };
    });
  }

  // svelte/components/Backdrop.svelte
  var file = "svelte/components/Backdrop.svelte";
  function create_if_block(ctx) {
    let div;
    let div_transition;
    let current;
    const block = {
      c: function create3() {
        div = element("div");
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true, "data-test-id": true });
        children(div).forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "bg-black/50 absolute inset-0 z-30");
        attr_dev(div, "data-test-id", "backdrop");
        add_location(div, file, 8, 2, 202);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        current = true;
      },
      i: function intro(local) {
        if (current)
          return;
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!div_transition)
              div_transition = create_bidirectional_transition(div, fade, {}, true);
            div_transition.run(1);
          });
        }
        current = true;
      },
      o: function outro(local) {
        if (local) {
          if (!div_transition)
            div_transition = create_bidirectional_transition(div, fade, {}, false);
          div_transition.run(0);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        if (detaching && div_transition)
          div_transition.end();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block.name,
      type: "if",
      source: "(6:0) {#if $backdropVisible}",
      ctx
    });
    return block;
  }
  function create_fragment(ctx) {
    let if_block_anchor;
    let if_block = (
      /*$backdropVisible*/
      ctx[0] && create_if_block(ctx)
    );
    const block = {
      c: function create3() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        if (if_block)
          if_block.l(nodes);
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (if_block)
          if_block.m(target, anchor);
        insert_hydration_dev(target, if_block_anchor, anchor);
      },
      p: function update2(ctx2, [dirty]) {
        if (
          /*$backdropVisible*/
          ctx2[0]
        ) {
          if (if_block) {
            if (dirty & /*$backdropVisible*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i: function intro(local) {
        transition_in(if_block);
      },
      o: function outro(local) {
        transition_out(if_block);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(if_block_anchor);
        }
        if (if_block)
          if_block.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  var backdropVisible = writable(false);
  function instance($$self, $$props, $$invalidate) {
    let $backdropVisible, $$unsubscribe_backdropVisible = noop2, $$subscribe_backdropVisible = () => ($$unsubscribe_backdropVisible(), $$unsubscribe_backdropVisible = subscribe(backdropVisible, ($$value) => $$invalidate(0, $backdropVisible = $$value)), backdropVisible);
    validate_store(backdropVisible, "backdropVisible");
    component_subscribe($$self, backdropVisible, ($$value) => $$invalidate(0, $backdropVisible = $$value));
    $$self.$$.on_destroy.push(() => $$unsubscribe_backdropVisible());
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Backdrop", slots, []);
    const writable_props = [];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<Backdrop> was created with unknown prop '${key}'`);
    });
    $$self.$capture_state = () => ({
      writable,
      fade,
      backdropVisible,
      $backdropVisible
    });
    return [$backdropVisible];
  }
  var Backdrop = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance, create_fragment, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Backdrop",
        options,
        id: create_fragment.name
      });
    }
  };
  create_custom_element(Backdrop, {}, [], [], true);
  var Backdrop_default = Backdrop;

  // svelte/components/BrowserFrame.svelte
  var BrowserFrame_exports = {};
  __export(BrowserFrame_exports, {
    default: () => BrowserFrame_default
  });
  var file2 = "svelte/components/BrowserFrame.svelte";
  function create_fragment2(ctx) {
    let div5;
    let div4;
    let div0;
    let span0;
    let t0;
    let span1;
    let t1;
    let span2;
    let t2;
    let div2;
    let div1;
    let span3;
    let t3_value = getPageName(
      /*page*/
      ctx[0]
    ) + "";
    let t3;
    let t4;
    let div3;
    let textContent = ``;
    let t5;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[1],
      null
    );
    const block = {
      c: function create3() {
        div5 = element("div");
        div4 = element("div");
        div0 = element("div");
        span0 = element("span");
        t0 = space();
        span1 = element("span");
        t1 = space();
        span2 = element("span");
        t2 = space();
        div2 = element("div");
        div1 = element("div");
        span3 = element("span");
        t3 = text(t3_value);
        t4 = space();
        div3 = element("div");
        div3.innerHTML = textContent;
        t5 = space();
        if (default_slot)
          default_slot.c();
        this.h();
      },
      l: function claim(nodes) {
        div5 = claim_element(nodes, "DIV", { class: true, "data-test-id": true });
        var div5_nodes = children(div5);
        div4 = claim_element(div5_nodes, "DIV", { class: true, "data-test-id": true });
        var div4_nodes = children(div4);
        div0 = claim_element(div4_nodes, "DIV", { class: true });
        var div0_nodes = children(div0);
        span0 = claim_element(div0_nodes, "SPAN", { class: true });
        children(span0).forEach(detach_dev);
        t0 = claim_space(div0_nodes);
        span1 = claim_element(div0_nodes, "SPAN", { class: true });
        children(span1).forEach(detach_dev);
        t1 = claim_space(div0_nodes);
        span2 = claim_element(div0_nodes, "SPAN", { class: true });
        children(span2).forEach(detach_dev);
        div0_nodes.forEach(detach_dev);
        t2 = claim_space(div4_nodes);
        div2 = claim_element(div4_nodes, "DIV", { class: true });
        var div2_nodes = children(div2);
        div1 = claim_element(div2_nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        span3 = claim_element(div1_nodes, "SPAN", { "data-test-id": true });
        var span3_nodes = children(span3);
        t3 = claim_text(span3_nodes, t3_value);
        span3_nodes.forEach(detach_dev);
        div1_nodes.forEach(detach_dev);
        div2_nodes.forEach(detach_dev);
        t4 = claim_space(div4_nodes);
        div3 = claim_element(div4_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(div3) !== "svelte-1czp51h")
          div3.innerHTML = textContent;
        div4_nodes.forEach(detach_dev);
        t5 = claim_space(div5_nodes);
        if (default_slot)
          default_slot.l(div5_nodes);
        div5_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span0, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-red-800");
        add_location(span0, file2, 16, 6, 367);
        attr_dev(span1, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-amber-400");
        add_location(span1, file2, 17, 6, 445);
        attr_dev(span2, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-lime-600");
        add_location(span2, file2, 18, 6, 525);
        attr_dev(div0, "class", "py-2");
        add_location(div0, file2, 15, 4, 342);
        attr_dev(span3, "data-test-id", "url-box");
        add_location(span3, file2, 22, 8, 782);
        attr_dev(div1, "class", "rounded bg-gray-50 border-b border-gray-200 shadow max-w-xs mx-auto text-center py-0.5 relative");
        add_location(div1, file2, 21, 6, 664);
        attr_dev(div2, "class", "flex-1 py-2.5 overflow-visible");
        add_location(div2, file2, 20, 4, 613);
        attr_dev(div3, "class", "py-3");
        add_location(div3, file2, 25, 4, 866);
        attr_dev(div4, "class", "bg-gray-50 border-b border-gray-200 border-solid rounded-t-xl h-12 px-3.5 flex");
        attr_dev(div4, "data-test-id", "address-bar");
        add_location(div4, file2, 11, 2, 207);
        attr_dev(div5, "class", "flex-1 flex flex-col");
        attr_dev(div5, "data-test-id", "fake-browser");
        add_location(div5, file2, 10, 0, 142);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div5, anchor);
        append_hydration_dev(div5, div4);
        append_hydration_dev(div4, div0);
        append_hydration_dev(div0, span0);
        append_hydration_dev(div0, t0);
        append_hydration_dev(div0, span1);
        append_hydration_dev(div0, t1);
        append_hydration_dev(div0, span2);
        append_hydration_dev(div4, t2);
        append_hydration_dev(div4, div2);
        append_hydration_dev(div2, div1);
        append_hydration_dev(div1, span3);
        append_hydration_dev(span3, t3);
        append_hydration_dev(div4, t4);
        append_hydration_dev(div4, div3);
        append_hydration_dev(div5, t5);
        if (default_slot) {
          default_slot.m(div5, null);
        }
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        if ((!current || dirty & /*page*/
        1) && t3_value !== (t3_value = getPageName(
          /*page*/
          ctx2[0]
        ) + ""))
          set_data_dev(t3, t3_value);
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[1],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[1]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[1],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div5);
        }
        if (default_slot)
          default_slot.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment2.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function getPageName(page2) {
    return !page2.path || page2.path === "" ? "index" : page2.path;
  }
  function instance2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("BrowserFrame", slots, ["default"]);
    let { page: page2 } = $$props;
    $$self.$$.on_mount.push(function() {
      if (page2 === void 0 && !("page" in $$props || $$self.$$.bound[$$self.$$.props["page"]])) {
        console.warn("<BrowserFrame> was created without expected prop 'page'");
      }
    });
    const writable_props = ["page"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<BrowserFrame> was created with unknown prop '${key}'`);
    });
    $$self.$$set = ($$props2) => {
      if ("page" in $$props2)
        $$invalidate(0, page2 = $$props2.page);
      if ("$$scope" in $$props2)
        $$invalidate(1, $$scope = $$props2.$$scope);
    };
    $$self.$capture_state = () => ({ page: page2, getPageName });
    $$self.$inject_state = ($$props2) => {
      if ("page" in $$props2)
        $$invalidate(0, page2 = $$props2.page);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    return [page2, $$scope, slots];
  }
  var BrowserFrame = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance2, create_fragment2, safe_not_equal, { page: 0 });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "BrowserFrame",
        options,
        id: create_fragment2.name
      });
    }
    get page() {
      return this.$$.ctx[0];
    }
    set page(page2) {
      this.$$set({ page: page2 });
      flush();
    }
  };
  create_custom_element(BrowserFrame, { "page": {} }, ["default"], [], true);
  var BrowserFrame_default = BrowserFrame;

  // svelte/components/CodeEditor.svelte
  var CodeEditor_exports = {};
  __export(CodeEditor_exports, {
    default: () => CodeEditor_default
  });

  // node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js
  function _defineProperty3(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys3(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread23(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys3(Object(source), true).forEach(function(key) {
          _defineProperty3(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys3(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose2(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties2(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose2(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _slicedToArray2(arr, i) {
    return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest2();
  }
  function _arrayWithHoles2(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArrayLimit2(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray2(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray2(o, minLen);
  }
  function _arrayLikeToArray2(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // node_modules/state-local/lib/es/state-local.js
  function _defineProperty4(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys4(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread24(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys4(Object(source), true).forEach(function(key) {
          _defineProperty4(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys4(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function compose4() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x) {
      return fns.reduceRight(function(y, f) {
        return f(y);
      }, x);
    };
  }
  function curry3(fn) {
    return function curried() {
      var _this = this;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          nextArgs[_key3] = arguments[_key3];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  function isObject3(value) {
    return {}.toString.call(value).includes("Object");
  }
  function isEmpty2(obj) {
    return !Object.keys(obj).length;
  }
  function isFunction2(value) {
    return typeof value === "function";
  }
  function hasOwnProperty2(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  function validateChanges2(initial, changes) {
    if (!isObject3(changes))
      errorHandler3("changeType");
    if (Object.keys(changes).some(function(field) {
      return !hasOwnProperty2(initial, field);
    }))
      errorHandler3("changeField");
    return changes;
  }
  function validateSelector2(selector) {
    if (!isFunction2(selector))
      errorHandler3("selectorType");
  }
  function validateHandler2(handler) {
    if (!(isFunction2(handler) || isObject3(handler)))
      errorHandler3("handlerType");
    if (isObject3(handler) && Object.values(handler).some(function(_handler) {
      return !isFunction2(_handler);
    }))
      errorHandler3("handlersType");
  }
  function validateInitial2(initial) {
    if (!initial)
      errorHandler3("initialIsRequired");
    if (!isObject3(initial))
      errorHandler3("initialType");
    if (isEmpty2(initial))
      errorHandler3("initialContent");
  }
  function throwError3(errorMessages5, type) {
    throw new Error(errorMessages5[type] || errorMessages5["default"]);
  }
  var errorMessages3 = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
    "default": "an unknown error accured in `state-local` package"
  };
  var errorHandler3 = curry3(throwError3)(errorMessages3);
  var validators3 = {
    changes: validateChanges2,
    selector: validateSelector2,
    handler: validateHandler2,
    initial: validateInitial2
  };
  function create2(initial) {
    var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    validators3.initial(initial);
    validators3.handler(handler);
    var state = {
      current: initial
    };
    var didUpdate = curry3(didStateUpdate2)(state, handler);
    var update2 = curry3(updateState2)(state);
    var validate = curry3(validators3.changes)(initial);
    var getChanges = curry3(extractChanges2)(state);
    function getState3() {
      var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
        return state2;
      };
      validators3.selector(selector);
      return selector(state.current);
    }
    function setState3(causedChanges) {
      compose4(didUpdate, update2, validate, getChanges)(causedChanges);
    }
    return [getState3, setState3];
  }
  function extractChanges2(state, causedChanges) {
    return isFunction2(causedChanges) ? causedChanges(state.current) : causedChanges;
  }
  function updateState2(state, changes) {
    state.current = _objectSpread24(_objectSpread24({}, state.current), changes);
    return changes;
  }
  function didStateUpdate2(state, handler, changes) {
    isFunction2(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
      var _handler$field;
      return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
    });
    return changes;
  }
  var index2 = {
    create: create2
  };
  var state_local_default2 = index2;

  // node_modules/@monaco-editor/loader/lib/es/config/index.js
  var config3 = {
    paths: {
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
    }
  };
  var config_default2 = config3;

  // node_modules/@monaco-editor/loader/lib/es/utils/curry.js
  function curry4(fn) {
    return function curried() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nextArgs[_key2] = arguments[_key2];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  var curry_default2 = curry4;

  // node_modules/@monaco-editor/loader/lib/es/utils/isObject.js
  function isObject4(value) {
    return {}.toString.call(value).includes("Object");
  }
  var isObject_default2 = isObject4;

  // node_modules/@monaco-editor/loader/lib/es/validators/index.js
  function validateConfig2(config5) {
    if (!config5)
      errorHandler4("configIsRequired");
    if (!isObject_default2(config5))
      errorHandler4("configType");
    if (config5.urls) {
      informAboutDeprecation2();
      return {
        paths: {
          vs: config5.urls.monacoBase
        }
      };
    }
    return config5;
  }
  function informAboutDeprecation2() {
    console.warn(errorMessages4.deprecation);
  }
  function throwError4(errorMessages5, type) {
    throw new Error(errorMessages5[type] || errorMessages5["default"]);
  }
  var errorMessages4 = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    "default": "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
  };
  var errorHandler4 = curry_default2(throwError4)(errorMessages4);
  var validators4 = {
    config: validateConfig2
  };
  var validators_default2 = validators4;

  // node_modules/@monaco-editor/loader/lib/es/utils/compose.js
  var compose5 = function compose6() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x) {
      return fns.reduceRight(function(y, f) {
        return f(y);
      }, x);
    };
  };
  var compose_default2 = compose5;

  // node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js
  function merge2(target, source) {
    Object.keys(source).forEach(function(key) {
      if (source[key] instanceof Object) {
        if (target[key]) {
          Object.assign(source[key], merge2(target[key], source[key]));
        }
      }
    });
    return _objectSpread23(_objectSpread23({}, target), source);
  }
  var deepMerge_default2 = merge2;

  // node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js
  var CANCELATION_MESSAGE2 = {
    type: "cancelation",
    msg: "operation is manually canceled"
  };
  function makeCancelable2(promise2) {
    var hasCanceled_ = false;
    var wrappedPromise = new Promise(function(resolve, reject) {
      promise2.then(function(val) {
        return hasCanceled_ ? reject(CANCELATION_MESSAGE2) : resolve(val);
      });
      promise2["catch"](reject);
    });
    return wrappedPromise.cancel = function() {
      return hasCanceled_ = true;
    }, wrappedPromise;
  }
  var makeCancelable_default2 = makeCancelable2;

  // node_modules/@monaco-editor/loader/lib/es/loader/index.js
  var _state$create3 = state_local_default2.create({
    config: config_default2,
    isInitialized: false,
    resolve: null,
    reject: null,
    monaco: null
  });
  var _state$create22 = _slicedToArray2(_state$create3, 2);
  var getState2 = _state$create22[0];
  var setState2 = _state$create22[1];
  function config4(globalConfig) {
    var _validators$config = validators_default2.config(globalConfig), monaco = _validators$config.monaco, config5 = _objectWithoutProperties2(_validators$config, ["monaco"]);
    setState2(function(state) {
      return {
        config: deepMerge_default2(state.config, config5),
        monaco
      };
    });
  }
  function init3() {
    var state = getState2(function(_ref) {
      var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
      return {
        monaco,
        isInitialized,
        resolve
      };
    });
    if (!state.isInitialized) {
      setState2({
        isInitialized: true
      });
      if (state.monaco) {
        state.resolve(state.monaco);
        return makeCancelable_default2(wrapperPromise2);
      }
      if (window.monaco && window.monaco.editor) {
        storeMonacoInstance2(window.monaco);
        state.resolve(window.monaco);
        return makeCancelable_default2(wrapperPromise2);
      }
      compose_default2(injectScripts2, getMonacoLoaderScript2)(configureLoader2);
    }
    return makeCancelable_default2(wrapperPromise2);
  }
  function injectScripts2(script) {
    return document.body.appendChild(script);
  }
  function createScript2(src) {
    var script = document.createElement("script");
    return src && (script.src = src), script;
  }
  function getMonacoLoaderScript2(configureLoader3) {
    var state = getState2(function(_ref2) {
      var config5 = _ref2.config, reject = _ref2.reject;
      return {
        config: config5,
        reject
      };
    });
    var loaderScript = createScript2("".concat(state.config.paths.vs, "/loader.js"));
    loaderScript.onload = function() {
      return configureLoader3();
    };
    loaderScript.onerror = state.reject;
    return loaderScript;
  }
  function configureLoader2() {
    var state = getState2(function(_ref3) {
      var config5 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
      return {
        config: config5,
        resolve,
        reject
      };
    });
    var require2 = window.require;
    require2.config(state.config);
    require2(["vs/editor/editor.main"], function(monaco) {
      storeMonacoInstance2(monaco);
      state.resolve(monaco);
    }, function(error) {
      state.reject(error);
    });
  }
  function storeMonacoInstance2(monaco) {
    if (!getState2().monaco) {
      setState2({
        monaco
      });
    }
  }
  function __getMonacoInstance2() {
    return getState2(function(_ref4) {
      var monaco = _ref4.monaco;
      return monaco;
    });
  }
  var wrapperPromise2 = new Promise(function(resolve, reject) {
    return setState2({
      resolve,
      reject
    });
  });
  var loader2 = {
    config: config4,
    init: init3,
    __getMonacoInstance: __getMonacoInstance2
  };
  var loader_default2 = loader2;

  // svelte/components/CodeEditor.svelte
  var { console: console_1 } = globals;
  var file3 = "svelte/components/CodeEditor.svelte";
  function create_fragment3(ctx) {
    let div;
    const block = {
      c: function create3() {
        div = element("div");
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true });
        children(div).forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "w-52 h-24 py-0.5 px-0.5 bg-gray-100");
        add_location(div, file3, 40, 0, 1711);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        ctx[2](div);
      },
      p: noop2,
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        ctx[2](null);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment3.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance3($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("CodeEditor", slots, []);
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value2) {
        return value2 instanceof P ? value2 : new P(function(resolve) {
          resolve(value2);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value2) {
          try {
            step(generator.next(value2));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value2) {
          try {
            step(generator["throw"](value2));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    let { value } = $$props;
    let dispatch2 = createEventDispatcher();
    let editor;
    let monaco;
    let editorContainer;
    onMount(() => __awaiter(void 0, void 0, void 0, function* () {
      loader_default2.config({
        paths: { vs: "/node_modules/monaco-editor/min/vs" }
      });
      monaco = yield loader_default2.init();
      const editor2 = monaco.editor.create(editorContainer, {
        value,
        language: "elixir",
        minimap: { enabled: false },
        lineNumbers: "off",
        automaticLayout: true
      });
      editor2.onDidBlurEditorWidget((e) => {
        let content = editor2.getValue();
        dispatch2("change", content);
      });
    }));
    onDestroy(() => {
      monaco === null || monaco === void 0 ? void 0 : monaco.editor.getModels().forEach((model) => model.dispose());
    });
    $$self.$$.on_mount.push(function() {
      if (value === void 0 && !("value" in $$props || $$self.$$.bound[$$self.$$.props["value"]])) {
        console_1.warn("<CodeEditor> was created without expected prop 'value'");
      }
    });
    const writable_props = ["value"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console_1.warn(`<CodeEditor> was created with unknown prop '${key}'`);
    });
    function div_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        editorContainer = $$value;
        $$invalidate(0, editorContainer);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("value" in $$props2)
        $$invalidate(1, value = $$props2.value);
    };
    $$self.$capture_state = () => ({
      __awaiter,
      loader: loader_default2,
      onDestroy,
      onMount,
      value,
      createEventDispatcher,
      dispatch: dispatch2,
      editor,
      monaco,
      editorContainer
    });
    $$self.$inject_state = ($$props2) => {
      if ("__awaiter" in $$props2)
        __awaiter = $$props2.__awaiter;
      if ("value" in $$props2)
        $$invalidate(1, value = $$props2.value);
      if ("dispatch" in $$props2)
        dispatch2 = $$props2.dispatch;
      if ("editor" in $$props2)
        $$invalidate(6, editor = $$props2.editor);
      if ("monaco" in $$props2)
        monaco = $$props2.monaco;
      if ("editorContainer" in $$props2)
        $$invalidate(0, editorContainer = $$props2.editorContainer);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*value*/
      2) {
        $: {
          if (editor) {
            console.log("code editor value", value);
            editor.setValue(value);
          }
        }
      }
    };
    return [editorContainer, value, div_binding];
  }
  var CodeEditor2 = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance3, create_fragment3, safe_not_equal, { value: 1 });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "CodeEditor",
        options,
        id: create_fragment3.name
      });
    }
    get value() {
      return this.$$.ctx[1];
    }
    set value(value) {
      this.$$set({ value });
      flush();
    }
  };
  create_custom_element(CodeEditor2, { "value": {} }, [], [], true);
  var CodeEditor_default = CodeEditor2;

  // svelte/components/ComponentsSidebar.svelte
  var ComponentsSidebar_exports = {};
  __export(ComponentsSidebar_exports, {
    default: () => ComponentsSidebar_default
  });

  // svelte/utils/animations.ts
  function translate(_node, { delay = 0, duration = 300, x = 0, y = 0 }) {
    return {
      delay,
      duration,
      css: (t) => `transform: translate(${x * t}px, ${y * t}px)`
    };
  }

  // svelte/stores/currentComponentCategory.ts
  var currentComponentCategory = writable(null);

  // svelte/stores/dragAndDrop.ts
  var draggedObject = writable(null);

  // svelte/components/ComponentsSidebar.svelte
  var file4 = "svelte/components/ComponentsSidebar.svelte";
  function add_css(target) {
    append_styles(target, "svelte-uvq63b", "#left-sidebar.svelte-uvq63b{z-index:1000}#backdrop.svelte-uvq63b{z-index:999}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQTRJRSwyQkFBYyxDQUNaLE9BQU8sQ0FBRSxJQUNYLENBQ0EsdUJBQVUsQ0FDUixPQUFPLENBQUUsR0FDWCIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJDb21wb25lbnRzU2lkZWJhci5zdmVsdGUiXX0= */");
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[17] = list[i];
    return child_ctx;
  }
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[20] = list[i];
    return child_ctx;
  }
  function get_each_context_2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[23] = list[i];
    return child_ctx;
  }
  function create_each_block_2(ctx) {
    let li;
    let div;
    let t0_value = (
      /*sectionTitles*/
      ctx[4][
        /*item*/
        ctx[23].name
      ] + ""
    );
    let t0;
    let t1;
    let mounted;
    let dispose;
    function mouseenter_handler() {
      return (
        /*mouseenter_handler*/
        ctx[13](
          /*item*/
          ctx[23]
        )
      );
    }
    const block = {
      c: function create3() {
        li = element("li");
        div = element("div");
        t0 = text(t0_value);
        t1 = space();
        this.h();
      },
      l: function claim(nodes) {
        li = claim_element(nodes, "LI", { class: true, "data-test-id": true });
        var li_nodes = children(li);
        div = claim_element(li_nodes, "DIV", {});
        var div_nodes = children(div);
        t0 = claim_text(div_nodes, t0_value);
        div_nodes.forEach(detach_dev);
        t1 = claim_space(li_nodes);
        li_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        add_location(div, file4, 87, 12, 2587);
        attr_dev(li, "class", "p-2 pl-6 hover:bg-slate-50 hover:cursor-pointer");
        attr_dev(li, "data-test-id", "nav-item");
        add_location(li, file4, 81, 10, 2347);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, li, anchor);
        append_hydration_dev(li, div);
        append_hydration_dev(div, t0);
        append_hydration_dev(li, t1);
        if (!mounted) {
          dispose = [
            listen_dev(li, "mouseenter", mouseenter_handler, false, false, false, false),
            listen_dev(
              li,
              "mouseleave",
              /*collapseCategoryMenu*/
              ctx[5],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*menuCategories*/
        2 && t0_value !== (t0_value = /*sectionTitles*/
        ctx[4][
          /*item*/
          ctx[23].name
        ] + ""))
          set_data_dev(t0, t0_value);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(li);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block_2.name,
      type: "each",
      source: "(70:8) {#each category.items as item}",
      ctx
    });
    return block;
  }
  function create_each_block_1(ctx) {
    let li;
    let h3;
    let t0_value = (
      /*category*/
      ctx[20].name + ""
    );
    let t0;
    let t1;
    let each_1_anchor;
    let each_value_2 = ensure_array_like_dev(
      /*category*/
      ctx[20].items
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_2.length; i += 1) {
      each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    }
    const block = {
      c: function create3() {
        li = element("li");
        h3 = element("h3");
        t0 = text(t0_value);
        t1 = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        li = claim_element(nodes, "LI", { class: true, "data-test-id": true });
        var li_nodes = children(li);
        h3 = claim_element(li_nodes, "H3", { class: true });
        var h3_nodes = children(h3);
        t0 = claim_text(h3_nodes, t0_value);
        h3_nodes.forEach(detach_dev);
        li_nodes.forEach(detach_dev);
        t1 = claim_space(nodes);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        attr_dev(h3, "class", "text-xs font-bold uppercase");
        add_location(h3, file4, 78, 10, 2223);
        attr_dev(li, "class", "mb-1 px-4");
        attr_dev(li, "data-test-id", "nav-item");
        add_location(li, file4, 77, 8, 2166);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, li, anchor);
        append_hydration_dev(li, h3);
        append_hydration_dev(h3, t0);
        insert_hydration_dev(target, t1, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*menuCategories*/
        2 && t0_value !== (t0_value = /*category*/
        ctx2[20].name + ""))
          set_data_dev(t0, t0_value);
        if (dirty & /*expandCategoryMenu, menuCategories, collapseCategoryMenu, sectionTitles*/
        178) {
          each_value_2 = ensure_array_like_dev(
            /*category*/
            ctx2[20].items
          );
          let i;
          for (i = 0; i < each_value_2.length; i += 1) {
            const child_ctx = get_each_context_2(ctx2, each_value_2, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block_2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value_2.length;
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(li);
          detach_dev(t1);
          detach_dev(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block_1.name,
      type: "each",
      source: "(66:6) {#each menuCategories as category}",
      ctx
    });
    return block;
  }
  function create_if_block_1(ctx) {
    let each_1_anchor;
    let each_value = ensure_array_like_dev(
      /*currentDefinitions*/
      ctx[3]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    const block = {
      c: function create3() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      l: function claim(nodes) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*dragStart, currentDefinitions, dragEnd*/
        776) {
          each_value = ensure_array_like_dev(
            /*currentDefinitions*/
            ctx2[3]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1.name,
      type: "if",
      source: "(96:6) {#if currentDefinitions}",
      ctx
    });
    return block;
  }
  function create_each_block(ctx) {
    let div;
    let p;
    let t0_value = (
      /*example*/
      ctx[17].name + ""
    );
    let t0;
    let t1;
    let img;
    let img_src_value;
    let img_alt_value;
    let t2;
    let mounted;
    let dispose;
    function dragstart_handler(...args) {
      return (
        /*dragstart_handler*/
        ctx[14](
          /*example*/
          ctx[17],
          ...args
        )
      );
    }
    const block = {
      c: function create3() {
        div = element("div");
        p = element("p");
        t0 = text(t0_value);
        t1 = space();
        img = element("img");
        t2 = space();
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", {
          draggable: true,
          class: true,
          "data-test-id": true
        });
        var div_nodes = children(div);
        p = claim_element(div_nodes, "P", { class: true });
        var p_nodes = children(p);
        t0 = claim_text(p_nodes, t0_value);
        p_nodes.forEach(detach_dev);
        t1 = claim_space(div_nodes);
        img = claim_element(div_nodes, "IMG", { class: true, src: true, alt: true });
        t2 = claim_space(div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(p, "class", "mb-1 text-xs font-bold uppercase tracking-wider");
        add_location(p, file4, 116, 12, 3811);
        attr_dev(img, "class", "w-full h-auto rounded ring-offset-2 ring-blue-500 transition hover:cursor-grab hover:ring-2");
        if (!src_url_equal(img.src, img_src_value = /*example*/
        ctx[17].thumbnail ? (
          /*example*/
          ctx[17].thumbnail
        ) : `https://placehold.co/400x75?text=${/*example*/
        ctx[17].name}`))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", img_alt_value = /*example*/
        ctx[17].name);
        add_location(img, file4, 118, 12, 3974);
        attr_dev(div, "draggable", "true");
        attr_dev(div, "class", "pt-6");
        attr_dev(div, "data-test-id", "component-preview-card");
        add_location(div, file4, 109, 10, 3589);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        append_hydration_dev(div, p);
        append_hydration_dev(p, t0);
        append_hydration_dev(div, t1);
        append_hydration_dev(div, img);
        append_hydration_dev(div, t2);
        if (!mounted) {
          dispose = [
            listen_dev(div, "dragstart", dragstart_handler, false, false, false, false),
            listen_dev(
              div,
              "dragend",
              /*dragEnd*/
              ctx[9],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*currentDefinitions*/
        8 && t0_value !== (t0_value = /*example*/
        ctx[17].name + ""))
          set_data_dev(t0, t0_value);
        if (dirty & /*currentDefinitions*/
        8 && !src_url_equal(img.src, img_src_value = /*example*/
        ctx[17].thumbnail ? (
          /*example*/
          ctx[17].thumbnail
        ) : `https://placehold.co/400x75?text=${/*example*/
        ctx[17].name}`)) {
          attr_dev(img, "src", img_src_value);
        }
        if (dirty & /*currentDefinitions*/
        8 && img_alt_value !== (img_alt_value = /*example*/
        ctx[17].name)) {
          attr_dev(img, "alt", img_alt_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block.name,
      type: "each",
      source: "(97:8) {#each currentDefinitions as example}",
      ctx
    });
    return block;
  }
  function create_if_block2(ctx) {
    let div;
    let div_transition;
    let current;
    const block = {
      c: function create3() {
        div = element("div");
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", {
          class: true,
          id: true,
          "data-test-id": true
        });
        children(div).forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "bg-black/50 absolute inset-0 z-50 svelte-uvq63b");
        attr_dev(div, "id", "backdrop");
        attr_dev(div, "data-test-id", "backdrop");
        add_location(div, file4, 131, 2, 4346);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        current = true;
      },
      i: function intro(local) {
        if (current)
          return;
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!div_transition)
              div_transition = create_bidirectional_transition(div, fade, { duration: 300 }, true);
            div_transition.run(1);
          });
        }
        current = true;
      },
      o: function outro(local) {
        if (local) {
          if (!div_transition)
            div_transition = create_bidirectional_transition(div, fade, { duration: 300 }, false);
          div_transition.run(0);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        if (detaching && div_transition)
          div_transition.end();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block2.name,
      type: "if",
      source: "(120:0) {#if showExamples}",
      ctx
    });
    return block;
  }
  function create_fragment4(ctx) {
    let div3;
    let div2;
    let div0;
    let h2;
    let textContent = "Components";
    let t1;
    let ul;
    let t2;
    let div1;
    let h4;
    let t3_value = (
      /*sectionTitles*/
      ctx[4][
        /*$currentComponentCategory*/
        ctx[0]?.name
      ] + ""
    );
    let t3;
    let t4;
    let p;
    let textContent_1 = "Select a component \u{1F447} and drag it to the canvas \u{1F449}";
    let t6;
    let div1_transition;
    let t7;
    let if_block1_anchor;
    let current;
    let mounted;
    let dispose;
    let each_value_1 = ensure_array_like_dev(
      /*menuCategories*/
      ctx[1]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    }
    let if_block0 = (
      /*currentDefinitions*/
      ctx[3] && create_if_block_1(ctx)
    );
    let if_block1 = (
      /*showExamples*/
      ctx[2] && create_if_block2(ctx)
    );
    const block = {
      c: function create3() {
        div3 = element("div");
        div2 = element("div");
        div0 = element("div");
        h2 = element("h2");
        h2.textContent = textContent;
        t1 = space();
        ul = element("ul");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t2 = space();
        div1 = element("div");
        h4 = element("h4");
        t3 = text(t3_value);
        t4 = space();
        p = element("p");
        p.textContent = textContent_1;
        t6 = space();
        if (if_block0)
          if_block0.c();
        t7 = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        div3 = claim_element(nodes, "DIV", {
          class: true,
          id: true,
          "data-test-id": true
        });
        var div3_nodes = children(div3);
        div2 = claim_element(div3_nodes, "DIV", { class: true });
        var div2_nodes = children(div2);
        div0 = claim_element(div2_nodes, "DIV", { class: true, "data-test-id": true });
        var div0_nodes = children(div0);
        h2 = claim_element(div0_nodes, "H2", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(h2) !== "svelte-1ke8ds1")
          h2.textContent = textContent;
        div0_nodes.forEach(detach_dev);
        t1 = claim_space(div2_nodes);
        ul = claim_element(div2_nodes, "UL", { class: true, "data-test-id": true });
        var ul_nodes = children(ul);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(ul_nodes);
        }
        ul_nodes.forEach(detach_dev);
        t2 = claim_space(div2_nodes);
        div1 = claim_element(div2_nodes, "DIV", {
          class: true,
          id: true,
          "data-test-id": true
        });
        var div1_nodes = children(div1);
        h4 = claim_element(div1_nodes, "H4", { class: true });
        var h4_nodes = children(h4);
        t3 = claim_text(h4_nodes, t3_value);
        h4_nodes.forEach(detach_dev);
        t4 = claim_space(div1_nodes);
        p = claim_element(div1_nodes, "P", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(p) !== "svelte-6fsgsi")
          p.textContent = textContent_1;
        t6 = claim_space(div1_nodes);
        if (if_block0)
          if_block0.l(div1_nodes);
        div1_nodes.forEach(detach_dev);
        div2_nodes.forEach(detach_dev);
        div3_nodes.forEach(detach_dev);
        t7 = claim_space(nodes);
        if (if_block1)
          if_block1.l(nodes);
        if_block1_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        attr_dev(h2, "class", "text-lg font-bold");
        add_location(h2, file4, 73, 6, 1969);
        attr_dev(div0, "class", "border-b border-slate-100 border-solid py-4 px-4");
        attr_dev(div0, "data-test-id", "logo");
        add_location(div0, file4, 72, 4, 1880);
        attr_dev(ul, "class", "py-4 h-[calc(100vh_-_61px)] overflow-y-auto");
        attr_dev(ul, "data-test-id", "component-tree");
        add_location(ul, file4, 75, 4, 2030);
        attr_dev(h4, "class", "mb-4 font-bold text-2xl");
        add_location(h4, file4, 104, 6, 3259);
        attr_dev(p, "class", "font-medium");
        add_location(p, file4, 105, 6, 3355);
        attr_dev(div1, "class", "absolute w-96 left-0 bg-slate-50 inset-y-0 shadow-sm z-50 pt-3 pb-4 px-5 transition-transform duration-500 opacity-0 invisible overflow-y-auto min-h-screen");
        attr_dev(div1, "id", "component-previews");
        attr_dev(div1, "data-test-id", "component-previews");
        toggle_class(
          div1,
          "translate-x-[255px]",
          /*showExamples*/
          ctx[2]
        );
        toggle_class(
          div1,
          "!opacity-100",
          /*showExamples*/
          ctx[2]
        );
        toggle_class(
          div1,
          "!visible",
          /*showExamples*/
          ctx[2]
        );
        add_location(div1, file4, 93, 4, 2748);
        attr_dev(div2, "class", "sticky top-0");
        add_location(div2, file4, 71, 2, 1849);
        attr_dev(div3, "class", "w-64 bg-white border-slate-100 border-solid border-r svelte-uvq63b");
        attr_dev(div3, "id", "left-sidebar");
        attr_dev(div3, "data-test-id", "left-sidebar");
        add_location(div3, file4, 70, 0, 1734);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div3, anchor);
        append_hydration_dev(div3, div2);
        append_hydration_dev(div2, div0);
        append_hydration_dev(div0, h2);
        append_hydration_dev(div2, t1);
        append_hydration_dev(div2, ul);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(ul, null);
          }
        }
        append_hydration_dev(div2, t2);
        append_hydration_dev(div2, div1);
        append_hydration_dev(div1, h4);
        append_hydration_dev(h4, t3);
        append_hydration_dev(div1, t4);
        append_hydration_dev(div1, p);
        append_hydration_dev(div1, t6);
        if (if_block0)
          if_block0.m(div1, null);
        insert_hydration_dev(target, t7, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert_hydration_dev(target, if_block1_anchor, anchor);
        current = true;
        if (!mounted) {
          dispose = [
            listen_dev(
              div1,
              "mouseenter",
              /*abortCollapseCategoryMenu*/
              ctx[6],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              div1,
              "mouseleave",
              /*collapseCategoryMenu*/
              ctx[5],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, [dirty]) {
        if (dirty & /*menuCategories, expandCategoryMenu, collapseCategoryMenu, sectionTitles*/
        178) {
          each_value_1 = ensure_array_like_dev(
            /*menuCategories*/
            ctx2[1]
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1(ctx2, each_value_1, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block_1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(ul, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value_1.length;
        }
        if ((!current || dirty & /*$currentComponentCategory*/
        1) && t3_value !== (t3_value = /*sectionTitles*/
        ctx2[4][
          /*$currentComponentCategory*/
          ctx2[0]?.name
        ] + ""))
          set_data_dev(t3, t3_value);
        if (
          /*currentDefinitions*/
          ctx2[3]
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_1(ctx2);
            if_block0.c();
            if_block0.m(div1, null);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (!current || dirty & /*showExamples*/
        4) {
          toggle_class(
            div1,
            "translate-x-[255px]",
            /*showExamples*/
            ctx2[2]
          );
        }
        if (!current || dirty & /*showExamples*/
        4) {
          toggle_class(
            div1,
            "!opacity-100",
            /*showExamples*/
            ctx2[2]
          );
        }
        if (!current || dirty & /*showExamples*/
        4) {
          toggle_class(
            div1,
            "!visible",
            /*showExamples*/
            ctx2[2]
          );
        }
        if (
          /*showExamples*/
          ctx2[2]
        ) {
          if (if_block1) {
            if (dirty & /*showExamples*/
            4) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block2(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!div1_transition)
              div1_transition = create_bidirectional_transition(div1, translate, { x: 384 }, true);
            div1_transition.run(1);
          });
        }
        transition_in(if_block1);
        current = true;
      },
      o: function outro(local) {
        if (local) {
          if (!div1_transition)
            div1_transition = create_bidirectional_transition(div1, translate, { x: 384 }, false);
          div1_transition.run(0);
        }
        transition_out(if_block1);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div3);
          detach_dev(t7);
          detach_dev(if_block1_anchor);
        }
        destroy_each(each_blocks, detaching);
        if (if_block0)
          if_block0.d();
        if (detaching && div1_transition)
          div1_transition.end();
        if (if_block1)
          if_block1.d(detaching);
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment4.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance4($$self, $$props, $$invalidate) {
    let componentDefinitions;
    let componentDefinitionsByCategory;
    let currentDefinitions;
    let $draggedObject;
    let $currentComponentCategory;
    validate_store(draggedObject, "draggedObject");
    component_subscribe($$self, draggedObject, ($$value) => $$invalidate(16, $draggedObject = $$value));
    validate_store(currentComponentCategory, "currentComponentCategory");
    component_subscribe($$self, currentComponentCategory, ($$value) => $$invalidate(0, $currentComponentCategory = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("ComponentsSidebar", slots, []);
    let { components } = $$props;
    let menuCategories = [];
    const sectionTitles = {
      nav: "Navs",
      header: "Headers",
      sign_in: "Sign ins",
      sign_up: "Sign ups",
      stats: "Stats",
      footer: "Footers",
      basic: "Basics",
      other: "Other"
    };
    let showExamples = false;
    let hideComponentTimer;
    function collapseCategoryMenu() {
      hideComponentTimer = setTimeout(
        () => {
          $$invalidate(2, showExamples = false);
        },
        400
      );
    }
    function abortCollapseCategoryMenu() {
      clearTimeout(hideComponentTimer);
    }
    function expandCategoryMenu(componentCategory) {
      if ($draggedObject)
        return;
      clearTimeout(hideComponentTimer);
      set_store_value(currentComponentCategory, $currentComponentCategory = componentCategory, $currentComponentCategory);
      $$invalidate(2, showExamples = true);
    }
    function dragStart(componentDefinition, e) {
      setTimeout(
        () => {
          set_store_value(draggedObject, $draggedObject = componentDefinition, $draggedObject);
          $$invalidate(2, showExamples = false);
        },
        100
      );
    }
    function dragEnd() {
      set_store_value(draggedObject, $draggedObject = null, $draggedObject);
    }
    $$self.$$.on_mount.push(function() {
      if (components === void 0 && !("components" in $$props || $$self.$$.bound[$$self.$$.props["components"]])) {
        console.warn("<ComponentsSidebar> was created without expected prop 'components'");
      }
    });
    const writable_props = ["components"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<ComponentsSidebar> was created with unknown prop '${key}'`);
    });
    const mouseenter_handler = (item) => expandCategoryMenu(item);
    const dragstart_handler = (example, e) => dragStart(example, e);
    $$self.$$set = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(10, components = $$props2.components);
    };
    $$self.$capture_state = () => ({
      fade,
      translate,
      currentComponentCategory,
      draggedObject,
      components,
      menuCategories,
      sectionTitles,
      showExamples,
      hideComponentTimer,
      collapseCategoryMenu,
      abortCollapseCategoryMenu,
      expandCategoryMenu,
      dragStart,
      dragEnd,
      componentDefinitionsByCategory,
      currentDefinitions,
      componentDefinitions,
      $draggedObject,
      $currentComponentCategory
    });
    $$self.$inject_state = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(10, components = $$props2.components);
      if ("menuCategories" in $$props2)
        $$invalidate(1, menuCategories = $$props2.menuCategories);
      if ("showExamples" in $$props2)
        $$invalidate(2, showExamples = $$props2.showExamples);
      if ("hideComponentTimer" in $$props2)
        hideComponentTimer = $$props2.hideComponentTimer;
      if ("componentDefinitionsByCategory" in $$props2)
        $$invalidate(11, componentDefinitionsByCategory = $$props2.componentDefinitionsByCategory);
      if ("currentDefinitions" in $$props2)
        $$invalidate(3, currentDefinitions = $$props2.currentDefinitions);
      if ("componentDefinitions" in $$props2)
        $$invalidate(12, componentDefinitions = $$props2.componentDefinitions);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*components*/
      1024) {
        $:
          $$invalidate(12, componentDefinitions = components);
      }
      if ($$self.$$.dirty & /*componentDefinitions*/
      4096) {
        $:
          $$invalidate(1, menuCategories = [
            {
              name: "Base",
              items: Array.from(new Set(componentDefinitions.map((d) => d.category))).map((id) => ({ id, name: id }))
            }
          ]);
      }
      if ($$self.$$.dirty & /*componentDefinitions*/
      4096) {
        $:
          $$invalidate(11, componentDefinitionsByCategory = (componentDefinitions || []).reduce(
            (acc, comp) => {
              var _a;
              acc[_a = comp.category] || (acc[_a] = []);
              acc[comp.category].push(comp);
              return acc;
            },
            {}
          ));
      }
      if ($$self.$$.dirty & /*$currentComponentCategory, componentDefinitionsByCategory*/
      2049) {
        $:
          $$invalidate(3, currentDefinitions = $currentComponentCategory ? componentDefinitionsByCategory[$currentComponentCategory.id] : []);
      }
    };
    return [
      $currentComponentCategory,
      menuCategories,
      showExamples,
      currentDefinitions,
      sectionTitles,
      collapseCategoryMenu,
      abortCollapseCategoryMenu,
      expandCategoryMenu,
      dragStart,
      dragEnd,
      components,
      componentDefinitionsByCategory,
      componentDefinitions,
      mouseenter_handler,
      dragstart_handler
    ];
  }
  var ComponentsSidebar = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance4, create_fragment4, safe_not_equal, { components: 10 }, add_css);
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "ComponentsSidebar",
        options,
        id: create_fragment4.name
      });
    }
    get components() {
      return this.$$.ctx[10];
    }
    set components(components) {
      this.$$set({ components });
      flush();
    }
  };
  create_custom_element(ComponentsSidebar, { "components": {} }, [], [], true);
  var ComponentsSidebar_default = ComponentsSidebar;

  // svelte/components/LayoutAstNode.svelte
  var LayoutAstNode_exports = {};
  __export(LayoutAstNode_exports, {
    default: () => LayoutAstNode_default
  });

  // svelte/stores/page.ts
  var page = writable();
  var selectedAstElementId = writable();
  var highlightedAstElement = writable();
  var slotTargetElement = writable();
  var rootAstElement = derived([page], ([$page]) => {
    return { tag: "root", attrs: {}, content: $page.ast };
  });
  var selectedAstElement = derived(
    [page, selectedAstElementId],
    ([$page, $selectedAstElementId]) => {
      if ($selectedAstElementId) {
        if ($selectedAstElementId === "root")
          return get_store_value(rootAstElement);
        return findAstElement($page.ast, $selectedAstElementId);
      }
    }
  );
  function isAstElement(maybeNode) {
    return typeof maybeNode !== "string";
  }
  function findAstElement(ast, id) {
    let indexes = id.split(".").map((s) => parseInt(s, 10));
    let node = ast[indexes[0]];
    ast = node.content;
    for (let i = 1; i < indexes.length; i++) {
      node = ast[indexes[i]];
      ast = node.content;
    }
    return node;
  }
  function findAstElementId(astNode) {
    let $page = get_store_value(page);
    return _findAstElementId($page.ast, astNode, "");
  }
  function _findAstElementId(ast, astNode, id) {
    for (let i = 0; i < ast.length; i++) {
      let currentNode = ast[i];
      if (currentNode === astNode) {
        return id + i;
      } else if (isAstElement(currentNode)) {
        let result = _findAstElementId(currentNode.content, astNode, id + i + ".");
        if (result) {
          return result;
        }
      }
    }
  }

  // svelte/components/LayoutAstNode.svelte
  var file5 = "svelte/components/LayoutAstNode.svelte";
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[3] = list[i];
    child_ctx[5] = i;
    return child_ctx;
  }
  function create_else_block_1(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text(
          /*node*/
          ctx[0]
        );
      },
      l: function claim(nodes) {
        t = claim_text(
          nodes,
          /*node*/
          ctx[0]
        );
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1)
          set_data_dev(
            t,
            /*node*/
            ctx2[0]
          );
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block_1.name,
      type: "else",
      source: "(25:0) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block3(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [
      create_if_block_12,
      create_if_block_2,
      create_if_block_3,
      create_if_block_4,
      create_if_block_5,
      create_else_block
    ];
    const if_blocks = [];
    function select_block_type_1(ctx2, dirty) {
      if (
        /*node*/
        ctx2[0].tag === "html_comment"
      )
        return 0;
      if (
        /*node*/
        ctx2[0].tag === "eex_comment"
      )
        return 1;
      if (
        /*node*/
        ctx2[0].tag === "eex" && /*node*/
        ctx2[0].content[0] === "@inner_content"
      )
        return 2;
      if (
        /*node*/
        ctx2[0].rendered_html
      )
        return 3;
      if (
        /*node*/
        ctx2[0].attrs?.selfClose
      )
        return 4;
      return 5;
    }
    current_block_type_index = select_block_type_1(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const block = {
      c: function create3() {
        if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        if_block.l(nodes);
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_hydration_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block3.name,
      type: "if",
      source: "(5:0) {#if isAstElement(node)}",
      ctx
    });
    return block;
  }
  function create_else_block(ctx) {
    let previous_tag = (
      /*node*/
      ctx[0].tag
    );
    let svelte_element_anchor;
    let current;
    validate_dynamic_element(
      /*node*/
      ctx[0].tag
    );
    validate_void_dynamic_element(
      /*node*/
      ctx[0].tag
    );
    let svelte_element = (
      /*node*/
      ctx[0].tag && create_dynamic_element_1(ctx)
    );
    const block = {
      c: function create3() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      l: function claim(nodes) {
        if (svelte_element)
          svelte_element.l(nodes);
        svelte_element_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert_hydration_dev(target, svelte_element_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (
          /*node*/
          ctx2[0].tag
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element_1(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*node*/
            ctx2[0].tag
          )) {
            svelte_element.d(1);
            validate_dynamic_element(
              /*node*/
              ctx2[0].tag
            );
            validate_void_dynamic_element(
              /*node*/
              ctx2[0].tag
            );
            svelte_element = create_dynamic_element_1(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*node*/
          ctx2[0].tag;
        }
      },
      i: noop2,
      o: function outro(local) {
        transition_out(svelte_element, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block.name,
      type: "else",
      source: "(16:2) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block_5(ctx) {
    let previous_tag = (
      /*node*/
      ctx[0].tag
    );
    let svelte_element_anchor;
    validate_dynamic_element(
      /*node*/
      ctx[0].tag
    );
    let svelte_element = (
      /*node*/
      ctx[0].tag && create_dynamic_element(ctx)
    );
    const block = {
      c: function create3() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      l: function claim(nodes) {
        if (svelte_element)
          svelte_element.l(nodes);
        svelte_element_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert_hydration_dev(target, svelte_element_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (
          /*node*/
          ctx2[0].tag
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*node*/
            ctx2[0].tag
          )) {
            svelte_element.d(1);
            validate_dynamic_element(
              /*node*/
              ctx2[0].tag
            );
            svelte_element = create_dynamic_element(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*node*/
          ctx2[0].tag;
        }
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_5.name,
      type: "if",
      source: "(14:34) ",
      ctx
    });
    return block;
  }
  function create_if_block_4(ctx) {
    let html_tag;
    let raw_value = (
      /*node*/
      ctx[0].rendered_html + ""
    );
    let html_anchor;
    const block = {
      c: function create3() {
        html_tag = new HtmlTagHydration(false);
        html_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        html_tag = claim_html_tag(nodes, false);
        html_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        html_tag.a = html_anchor;
      },
      m: function mount(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert_hydration_dev(target, html_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1 && raw_value !== (raw_value = /*node*/
        ctx2[0].rendered_html + ""))
          html_tag.p(raw_value);
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(html_anchor);
          html_tag.d();
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_4.name,
      type: "if",
      source: "(12:31) ",
      ctx
    });
    return block;
  }
  function create_if_block_3(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[1],
      null
    );
    const block = {
      c: function create3() {
        if (default_slot)
          default_slot.c();
      },
      l: function claim(nodes) {
        if (default_slot)
          default_slot.l(nodes);
      },
      m: function mount(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[1],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[1]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[1],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3.name,
      type: "if",
      source: "(10:71) ",
      ctx
    });
    return block;
  }
  function create_if_block_2(ctx) {
    let html_tag;
    let raw_value = "<!--" + /*node*/
    ctx[0].content + "-->";
    let html_anchor;
    const block = {
      c: function create3() {
        html_tag = new HtmlTagHydration(false);
        html_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        html_tag = claim_html_tag(nodes, false);
        html_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        html_tag.a = html_anchor;
      },
      m: function mount(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert_hydration_dev(target, html_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1 && raw_value !== (raw_value = "<!--" + /*node*/
        ctx2[0].content + "-->"))
          html_tag.p(raw_value);
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(html_anchor);
          html_tag.d();
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2.name,
      type: "if",
      source: "(8:39) ",
      ctx
    });
    return block;
  }
  function create_if_block_12(ctx) {
    let html_tag;
    let raw_value = "<!--" + /*node*/
    ctx[0].content + "-->";
    let html_anchor;
    const block = {
      c: function create3() {
        html_tag = new HtmlTagHydration(false);
        html_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        html_tag = claim_html_tag(nodes, false);
        html_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        html_tag.a = html_anchor;
      },
      m: function mount(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert_hydration_dev(target, html_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1 && raw_value !== (raw_value = "<!--" + /*node*/
        ctx2[0].content + "-->"))
          html_tag.p(raw_value);
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(html_anchor);
          html_tag.d();
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_12.name,
      type: "if",
      source: '(6:2) {#if node.tag === \\"html_comment\\"}',
      ctx
    });
    return block;
  }
  function create_if_block_6(ctx) {
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like_dev(
      /*node*/
      ctx[0].content
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    const block = {
      c: function create3() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      l: function claim(nodes) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1) {
          each_value = ensure_array_like_dev(
            /*node*/
            ctx2[0].content
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block2(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_6.name,
      type: "if",
      source: "(18:6) {#if node.content}",
      ctx
    });
    return block;
  }
  function create_each_block2(ctx) {
    let layoutastnode;
    let current;
    layoutastnode = new LayoutAstNode({
      props: { node: (
        /*subnode*/
        ctx[3]
      ) },
      $$inline: true
    });
    const block = {
      c: function create3() {
        create_component(layoutastnode.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(layoutastnode.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(layoutastnode, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const layoutastnode_changes = {};
        if (dirty & /*node*/
        1)
          layoutastnode_changes.node = /*subnode*/
          ctx2[3];
        layoutastnode.$set(layoutastnode_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(layoutastnode.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(layoutastnode.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(layoutastnode, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block2.name,
      type: "each",
      source: "(19:8) {#each node.content as subnode, index}",
      ctx
    });
    return block;
  }
  function create_dynamic_element_1(ctx) {
    let svelte_element;
    let current;
    let if_block = (
      /*node*/
      ctx[0].content && create_if_block_6(ctx)
    );
    let svelte_element_levels = [
      /*node*/
      ctx[0].attrs
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    const block = {
      c: function create3() {
        svelte_element = element(
          /*node*/
          ctx[0].tag
        );
        if (if_block)
          if_block.c();
        this.h();
      },
      l: function claim(nodes) {
        svelte_element = claim_element(
          nodes,
          /*node*/
          (ctx[0].tag || "null").toUpperCase(),
          {}
        );
        var svelte_element_nodes = children(svelte_element);
        if (if_block)
          if_block.l(svelte_element_nodes);
        svelte_element_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        set_dynamic_element_data(
          /*node*/
          ctx[0].tag
        )(svelte_element, svelte_element_data);
        add_location(svelte_element, file5, 18, 4, 532);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, svelte_element, anchor);
        if (if_block)
          if_block.m(svelte_element, null);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (
          /*node*/
          ctx2[0].content
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*node*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_6(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(svelte_element, null);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        set_dynamic_element_data(
          /*node*/
          ctx2[0].tag
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*node*/
        1 && /*node*/
        ctx2[0].attrs]));
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element);
        }
        if (if_block)
          if_block.d();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_dynamic_element_1.name,
      type: "child_dynamic_element",
      source: "(17:4) <svelte:element this={node.tag} {...node.attrs}>",
      ctx
    });
    return block;
  }
  function create_dynamic_element(ctx) {
    let svelte_element;
    let svelte_element_levels = [
      /*node*/
      ctx[0].attrs
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    const block = {
      c: function create3() {
        svelte_element = element(
          /*node*/
          ctx[0].tag
        );
        this.h();
      },
      l: function claim(nodes) {
        svelte_element = claim_element(
          nodes,
          /*node*/
          (ctx[0].tag || "null").toUpperCase(),
          {}
        );
        children(svelte_element).forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        set_dynamic_element_data(
          /*node*/
          ctx[0].tag
        )(svelte_element, svelte_element_data);
        add_location(svelte_element, file5, 16, 4, 467);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, svelte_element, anchor);
      },
      p: function update2(ctx2, dirty) {
        set_dynamic_element_data(
          /*node*/
          ctx2[0].tag
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*node*/
        1 && /*node*/
        ctx2[0].attrs]));
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_dynamic_element.name,
      type: "child_dynamic_element",
      source: "(15:4) <svelte:element this={node.tag} {...node.attrs} />",
      ctx
    });
    return block;
  }
  function create_fragment5(ctx) {
    let show_if;
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block3, create_else_block_1];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (dirty & /*node*/
      1)
        show_if = null;
      if (show_if == null)
        show_if = !!isAstElement(
          /*node*/
          ctx2[0]
        );
      if (show_if)
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const block = {
      c: function create3() {
        if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        if_block.l(nodes);
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_hydration_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment5.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance5($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("LayoutAstNode", slots, ["default"]);
    let { node } = $$props;
    $$self.$$.on_mount.push(function() {
      if (node === void 0 && !("node" in $$props || $$self.$$.bound[$$self.$$.props["node"]])) {
        console.warn("<LayoutAstNode> was created without expected prop 'node'");
      }
    });
    const writable_props = ["node"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<LayoutAstNode> was created with unknown prop '${key}'`);
    });
    $$self.$$set = ($$props2) => {
      if ("node" in $$props2)
        $$invalidate(0, node = $$props2.node);
      if ("$$scope" in $$props2)
        $$invalidate(1, $$scope = $$props2.$$scope);
    };
    $$self.$capture_state = () => ({ isAstElement, node });
    $$self.$inject_state = ($$props2) => {
      if ("node" in $$props2)
        $$invalidate(0, node = $$props2.node);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    return [node, $$scope, slots];
  }
  var LayoutAstNode = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance5, create_fragment5, safe_not_equal, { node: 0 });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "LayoutAstNode",
        options,
        id: create_fragment5.name
      });
    }
    get node() {
      return this.$$.ctx[0];
    }
    set node(node) {
      this.$$set({ node });
      flush();
    }
  };
  create_custom_element(LayoutAstNode, { "node": {} }, ["default"], [], true);
  var LayoutAstNode_default = LayoutAstNode;

  // svelte/components/PageAstNode.svelte
  var PageAstNode_exports = {};
  __export(PageAstNode_exports, {
    default: () => PageAstNode_default
  });
  var file6 = "svelte/components/PageAstNode.svelte";
  function get_each_context3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[16] = list[i];
    child_ctx[18] = i;
    return child_ctx;
  }
  function create_else_block_12(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text(
          /*node*/
          ctx[0]
        );
      },
      l: function claim(nodes) {
        t = claim_text(
          nodes,
          /*node*/
          ctx[0]
        );
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1)
          set_data_dev(
            t,
            /*node*/
            ctx2[0]
          );
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block_12.name,
      type: "else",
      source: "(106:0) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block4(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [
      create_if_block_13,
      create_if_block_22,
      create_if_block_32,
      create_if_block_42,
      create_if_block_52,
      create_else_block2
    ];
    const if_blocks = [];
    function select_block_type_1(ctx2, dirty) {
      if (
        /*node*/
        ctx2[0].tag === "html_comment"
      )
        return 0;
      if (
        /*node*/
        ctx2[0].tag === "eex_comment"
      )
        return 1;
      if (
        /*node*/
        ctx2[0].tag === "eex" && /*node*/
        ctx2[0].content[0] === "@inner_content"
      )
        return 2;
      if (
        /*node*/
        ctx2[0].rendered_html
      )
        return 3;
      if (
        /*node*/
        ctx2[0].attrs?.selfClose
      )
        return 4;
      return 5;
    }
    current_block_type_index = select_block_type_1(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const block = {
      c: function create3() {
        if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        if_block.l(nodes);
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_hydration_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block4.name,
      type: "if",
      source: "(58:0) {#if isAstElement(node)}",
      ctx
    });
    return block;
  }
  function create_else_block2(ctx) {
    let previous_tag = (
      /*node*/
      ctx[0].tag
    );
    let svelte_element_anchor;
    let current;
    validate_dynamic_element(
      /*node*/
      ctx[0].tag
    );
    validate_void_dynamic_element(
      /*node*/
      ctx[0].tag
    );
    let svelte_element = (
      /*node*/
      ctx[0].tag && create_dynamic_element_12(ctx)
    );
    const block = {
      c: function create3() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      l: function claim(nodes) {
        if (svelte_element)
          svelte_element.l(nodes);
        svelte_element_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert_hydration_dev(target, svelte_element_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (
          /*node*/
          ctx2[0].tag
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element_12(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*node*/
            ctx2[0].tag
          )) {
            svelte_element.d(1);
            validate_dynamic_element(
              /*node*/
              ctx2[0].tag
            );
            validate_void_dynamic_element(
              /*node*/
              ctx2[0].tag
            );
            svelte_element = create_dynamic_element_12(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*node*/
          ctx2[0].tag;
        }
      },
      i: noop2,
      o: function outro(local) {
        transition_out(svelte_element, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block2.name,
      type: "else",
      source: "(88:2) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block_52(ctx) {
    let previous_tag = (
      /*node*/
      ctx[0].tag
    );
    let svelte_element_anchor;
    validate_dynamic_element(
      /*node*/
      ctx[0].tag
    );
    let svelte_element = (
      /*node*/
      ctx[0].tag && create_dynamic_element2(ctx)
    );
    const block = {
      c: function create3() {
        if (svelte_element)
          svelte_element.c();
        svelte_element_anchor = empty();
      },
      l: function claim(nodes) {
        if (svelte_element)
          svelte_element.l(nodes);
        svelte_element_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (svelte_element)
          svelte_element.m(target, anchor);
        insert_hydration_dev(target, svelte_element_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (
          /*node*/
          ctx2[0].tag
        ) {
          if (!previous_tag) {
            svelte_element = create_dynamic_element2(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else if (safe_not_equal(
            previous_tag,
            /*node*/
            ctx2[0].tag
          )) {
            svelte_element.d(1);
            validate_dynamic_element(
              /*node*/
              ctx2[0].tag
            );
            svelte_element = create_dynamic_element2(ctx2);
            previous_tag = /*node*/
            ctx2[0].tag;
            svelte_element.c();
            svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
          } else {
            svelte_element.p(ctx2, dirty);
          }
        } else if (previous_tag) {
          svelte_element.d(1);
          svelte_element = null;
          previous_tag = /*node*/
          ctx2[0].tag;
        }
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element_anchor);
        }
        if (svelte_element)
          svelte_element.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_52.name,
      type: "if",
      source: "(75:34) ",
      ctx
    });
    return block;
  }
  function create_if_block_42(ctx) {
    let div;
    let html_tag;
    let raw_value = (
      /*node*/
      ctx[0].rendered_html + ""
    );
    let highlightContent_action;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        div = element("div");
        html_tag = new HtmlTagHydration(false);
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true });
        var div_nodes = children(div);
        html_tag = claim_html_tag(div_nodes, false);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        html_tag.a = null;
        attr_dev(div, "class", "contents");
        add_location(div, file6, 79, 4, 2659);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        html_tag.m(raw_value, div);
        if (!mounted) {
          dispose = [
            listen_dev(div, "mouseover", stop_propagation(
              /*handleMouseOver*/
              ctx[8]
            ), false, false, true, false),
            listen_dev(div, "mouseout", stop_propagation(
              /*handleMouseOut*/
              ctx[9]
            ), false, false, true, false),
            listen_dev(div, "click", stop_propagation(prevent_default(
              /*click_handler*/
              ctx[13]
            )), false, true, true, false),
            action_destroyer(highlightContent_action = highlightContent.call(null, div, {
              selected: (
                /*$selectedAstElement*/
                ctx[5] === /*node*/
                ctx[0]
              ),
              highlighted: (
                /*$highlightedAstElement*/
                ctx[3] === /*node*/
                ctx[0]
              )
            }))
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1 && raw_value !== (raw_value = /*node*/
        ctx2[0].rendered_html + ""))
          html_tag.p(raw_value);
        if (highlightContent_action && is_function(highlightContent_action.update) && dirty & /*$selectedAstElement, node, $highlightedAstElement*/
        41)
          highlightContent_action.update.call(null, {
            selected: (
              /*$selectedAstElement*/
              ctx2[5] === /*node*/
              ctx2[0]
            ),
            highlighted: (
              /*$highlightedAstElement*/
              ctx2[3] === /*node*/
              ctx2[0]
            )
          });
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_42.name,
      type: "if",
      source: "(65:31) ",
      ctx
    });
    return block;
  }
  function create_if_block_32(ctx) {
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[12].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[11],
      null
    );
    const block = {
      c: function create3() {
        if (default_slot)
          default_slot.c();
      },
      l: function claim(nodes) {
        if (default_slot)
          default_slot.l(nodes);
      },
      m: function mount(target, anchor) {
        if (default_slot) {
          default_slot.m(target, anchor);
        }
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          2048)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[11],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[11]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[11],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (default_slot)
          default_slot.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_32.name,
      type: "if",
      source: "(63:71) ",
      ctx
    });
    return block;
  }
  function create_if_block_22(ctx) {
    let html_tag;
    let raw_value = "<!--" + /*node*/
    ctx[0].content + "-->";
    let html_anchor;
    const block = {
      c: function create3() {
        html_tag = new HtmlTagHydration(false);
        html_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        html_tag = claim_html_tag(nodes, false);
        html_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        html_tag.a = html_anchor;
      },
      m: function mount(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert_hydration_dev(target, html_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1 && raw_value !== (raw_value = "<!--" + /*node*/
        ctx2[0].content + "-->"))
          html_tag.p(raw_value);
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(html_anchor);
          html_tag.d();
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_22.name,
      type: "if",
      source: "(61:39) ",
      ctx
    });
    return block;
  }
  function create_if_block_13(ctx) {
    let html_tag;
    let raw_value = "<!--" + /*node*/
    ctx[0].content + "-->";
    let html_anchor;
    const block = {
      c: function create3() {
        html_tag = new HtmlTagHydration(false);
        html_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        html_tag = claim_html_tag(nodes, false);
        html_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        html_tag.a = html_anchor;
      },
      m: function mount(target, anchor) {
        html_tag.m(raw_value, target, anchor);
        insert_hydration_dev(target, html_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node*/
        1 && raw_value !== (raw_value = "<!--" + /*node*/
        ctx2[0].content + "-->"))
          html_tag.p(raw_value);
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(html_anchor);
          html_tag.d();
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_13.name,
      type: "if",
      source: '(59:2) {#if node.tag === \\"html_comment\\"}',
      ctx
    });
    return block;
  }
  function create_each_block3(ctx) {
    let pageastnode;
    let current;
    pageastnode = new PageAstNode({
      props: {
        node: (
          /*subnode*/
          ctx[16]
        ),
        nodeId: (
          /*nodeId*/
          ctx[1] + "." + /*index*/
          ctx[18]
        )
      },
      $$inline: true
    });
    const block = {
      c: function create3() {
        create_component(pageastnode.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(pageastnode.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(pageastnode, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const pageastnode_changes = {};
        if (dirty & /*node*/
        1)
          pageastnode_changes.node = /*subnode*/
          ctx2[16];
        if (dirty & /*nodeId*/
        2)
          pageastnode_changes.nodeId = /*nodeId*/
          ctx2[1] + "." + /*index*/
          ctx2[18];
        pageastnode.$set(pageastnode_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(pageastnode.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(pageastnode.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(pageastnode, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block3.name,
      type: "each",
      source: "(101:6) {#each node.content as subnode, index}",
      ctx
    });
    return block;
  }
  function create_dynamic_element_12(ctx) {
    let svelte_element;
    let svelte_element_data_selected_value;
    let svelte_element_data_highlighted_value;
    let svelte_element_data_slot_target_value;
    let current;
    let mounted;
    let dispose;
    let each_value = ensure_array_like_dev(
      /*node*/
      ctx[0].content
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block3(get_each_context3(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    let svelte_element_levels = [
      /*node*/
      ctx[0].attrs,
      {
        "data-selected": svelte_element_data_selected_value = /*$selectedAstElement*/
        ctx[5] === /*node*/
        ctx[0]
      },
      {
        "data-highlighted": svelte_element_data_highlighted_value = /*$highlightedAstElement*/
        ctx[3] === /*node*/
        ctx[0]
      },
      {
        "data-slot-target": svelte_element_data_slot_target_value = /*$slotTargetElement*/
        ctx[4] === /*node*/
        ctx[0]
      }
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    const block = {
      c: function create3() {
        svelte_element = element(
          /*node*/
          ctx[0].tag
        );
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        this.h();
      },
      l: function claim(nodes) {
        svelte_element = claim_element(
          nodes,
          /*node*/
          (ctx[0].tag || "null").toUpperCase(),
          {
            "data-selected": true,
            "data-highlighted": true,
            "data-slot-target": true
          }
        );
        var svelte_element_nodes = children(svelte_element);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(svelte_element_nodes);
        }
        svelte_element_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        set_dynamic_element_data(
          /*node*/
          ctx[0].tag
        )(svelte_element, svelte_element_data);
        add_location(svelte_element, file6, 102, 4, 3636);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, svelte_element, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(svelte_element, null);
          }
        }
        current = true;
        if (!mounted) {
          dispose = [
            listen_dev(svelte_element, "dragenter", stop_propagation(
              /*handleDragEnter*/
              ctx[6]
            ), false, false, true, false),
            listen_dev(svelte_element, "dragleave", stop_propagation(
              /*handleDragLeave*/
              ctx[7]
            ), false, false, true, false),
            listen_dev(svelte_element, "mouseover", stop_propagation(
              /*handleMouseOver*/
              ctx[8]
            ), false, false, true, false),
            listen_dev(svelte_element, "mouseout", stop_propagation(
              /*handleMouseOut*/
              ctx[9]
            ), false, false, true, false),
            listen_dev(svelte_element, "click", stop_propagation(prevent_default(
              /*click_handler_1*/
              ctx[14]
            )), false, true, true, false)
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*node, nodeId*/
        3) {
          each_value = ensure_array_like_dev(
            /*node*/
            ctx2[0].content
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context3(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block3(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(svelte_element, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        set_dynamic_element_data(
          /*node*/
          ctx2[0].tag
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
          dirty & /*node*/
          1 && /*node*/
          ctx2[0].attrs,
          (!current || dirty & /*$selectedAstElement, node*/
          33 && svelte_element_data_selected_value !== (svelte_element_data_selected_value = /*$selectedAstElement*/
          ctx2[5] === /*node*/
          ctx2[0])) && {
            "data-selected": svelte_element_data_selected_value
          },
          (!current || dirty & /*$highlightedAstElement, node*/
          9 && svelte_element_data_highlighted_value !== (svelte_element_data_highlighted_value = /*$highlightedAstElement*/
          ctx2[3] === /*node*/
          ctx2[0])) && {
            "data-highlighted": svelte_element_data_highlighted_value
          },
          (!current || dirty & /*$slotTargetElement, node*/
          17 && svelte_element_data_slot_target_value !== (svelte_element_data_slot_target_value = /*$slotTargetElement*/
          ctx2[4] === /*node*/
          ctx2[0])) && {
            "data-slot-target": svelte_element_data_slot_target_value
          }
        ]));
      },
      i: function intro(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element);
        }
        destroy_each(each_blocks, detaching);
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_dynamic_element_12.name,
      type: "child_dynamic_element",
      source: "(89:4) <svelte:element       this={node.tag}       {...node.attrs}       data-selected={$selectedAstElement === node}       data-highlighted={$highlightedAstElement === node}       data-slot-target={$slotTargetElement === node}       on:dragenter|stopPropagation={handleDragEnter}       on:dragleave|stopPropagation={handleDragLeave}       on:mouseover|stopPropagation={handleMouseOver}       on:mouseout|stopPropagation={handleMouseOut}       on:click|preventDefault|stopPropagation={() => ($selectedAstElementId = nodeId)}     >",
      ctx
    });
    return block;
  }
  function create_dynamic_element2(ctx) {
    let svelte_element;
    let svelte_element_data_selected_value;
    let svelte_element_data_highlighted_value;
    let svelte_element_data_slot_target_value;
    let mounted;
    let dispose;
    let svelte_element_levels = [
      /*node*/
      ctx[0].attrs,
      {
        "data-selected": svelte_element_data_selected_value = /*$selectedAstElement*/
        ctx[5] === /*node*/
        ctx[0]
      },
      {
        "data-highlighted": svelte_element_data_highlighted_value = /*$highlightedAstElement*/
        ctx[3] === /*node*/
        ctx[0]
      },
      {
        "data-slot-target": svelte_element_data_slot_target_value = /*$slotTargetElement*/
        ctx[4] === /*node*/
        ctx[0] && !/*$slotTargetElement*/
        ctx[4].attrs.selfClose
      }
    ];
    let svelte_element_data = {};
    for (let i = 0; i < svelte_element_levels.length; i += 1) {
      svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    }
    const block = {
      c: function create3() {
        svelte_element = element(
          /*node*/
          ctx[0].tag
        );
        this.h();
      },
      l: function claim(nodes) {
        svelte_element = claim_element(
          nodes,
          /*node*/
          (ctx[0].tag || "null").toUpperCase(),
          {
            "data-selected": true,
            "data-highlighted": true,
            "data-slot-target": true
          }
        );
        children(svelte_element).forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        set_dynamic_element_data(
          /*node*/
          ctx[0].tag
        )(svelte_element, svelte_element_data);
        add_location(svelte_element, file6, 89, 4, 3085);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, svelte_element, anchor);
        if (!mounted) {
          dispose = [
            listen_dev(svelte_element, "dragenter", stop_propagation(
              /*handleDragEnter*/
              ctx[6]
            ), false, false, true, false),
            listen_dev(svelte_element, "dragleave", stop_propagation(
              /*handleDragLeave*/
              ctx[7]
            ), false, false, true, false),
            listen_dev(svelte_element, "mouseover", stop_propagation(
              /*handleMouseOver*/
              ctx[8]
            ), false, false, true, false),
            listen_dev(svelte_element, "mouseout", stop_propagation(
              /*handleMouseOut*/
              ctx[9]
            ), false, false, true, false),
            listen_dev(svelte_element, "click", stop_propagation(prevent_default(
              /*handleClick*/
              ctx[10]
            )), false, true, true, false)
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        set_dynamic_element_data(
          /*node*/
          ctx2[0].tag
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
          dirty & /*node*/
          1 && /*node*/
          ctx2[0].attrs,
          dirty & /*$selectedAstElement, node*/
          33 && svelte_element_data_selected_value !== (svelte_element_data_selected_value = /*$selectedAstElement*/
          ctx2[5] === /*node*/
          ctx2[0]) && {
            "data-selected": svelte_element_data_selected_value
          },
          dirty & /*$highlightedAstElement, node*/
          9 && svelte_element_data_highlighted_value !== (svelte_element_data_highlighted_value = /*$highlightedAstElement*/
          ctx2[3] === /*node*/
          ctx2[0]) && {
            "data-highlighted": svelte_element_data_highlighted_value
          },
          dirty & /*$slotTargetElement, node*/
          17 && svelte_element_data_slot_target_value !== (svelte_element_data_slot_target_value = /*$slotTargetElement*/
          ctx2[4] === /*node*/
          ctx2[0] && !/*$slotTargetElement*/
          ctx2[4].attrs.selfClose) && {
            "data-slot-target": svelte_element_data_slot_target_value
          }
        ]));
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(svelte_element);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_dynamic_element2.name,
      type: "child_dynamic_element",
      source: "(76:4) <svelte:element       this={node.tag}       {...node.attrs}       data-selected={$selectedAstElement === node}       data-highlighted={$highlightedAstElement === node}       data-slot-target={$slotTargetElement === node && !$slotTargetElement.attrs.selfClose}       on:dragenter|stopPropagation={handleDragEnter}       on:dragleave|stopPropagation={handleDragLeave}       on:mouseover|stopPropagation={handleMouseOver}       on:mouseout|stopPropagation={handleMouseOut}       on:click|preventDefault|stopPropagation={handleClick}     />",
      ctx
    });
    return block;
  }
  function create_fragment6(ctx) {
    let show_if;
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block4, create_else_block_12];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (dirty & /*node*/
      1)
        show_if = null;
      if (show_if == null)
        show_if = !!isAstElement(
          /*node*/
          ctx2[0]
        );
      if (show_if)
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, -1);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const block = {
      c: function create3() {
        if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        if_block.l(nodes);
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_blocks[current_block_type_index].m(target, anchor);
        insert_hydration_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(if_block_anchor);
        }
        if_blocks[current_block_type_index].d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment6.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function highlightContent(wrapperDiv, { selected, highlighted }) {
    let startsWithOneChildren = wrapperDiv.children.length === 1;
    if (startsWithOneChildren) {
      let child = wrapperDiv.children[0];
      child.setAttribute("data-selected", String(selected));
      child.setAttribute("data-highlighted", String(highlighted));
    }
    return {
      update({ selected: selected2, highlighted: highlighted2 }) {
        if (wrapperDiv.children.length === 1) {
          let child = wrapperDiv.children[0];
          child.setAttribute("data-selected", String(selected2));
          child.setAttribute("data-highlighted", String(highlighted2));
        } else if (wrapperDiv.children.length === 0 && wrapperDiv.childNodes.length === 1) {
          wrapperDiv.setAttribute("data-nochildren", "true");
          wrapperDiv.setAttribute("data-selected", String(selected2));
          wrapperDiv.setAttribute("data-highlighted", String(highlighted2));
        } else if (startsWithOneChildren) {
          Array.from(wrapperDiv.children).forEach((child) => {
            child.removeAttribute("data-selected");
            child.removeAttribute("data-highlighted");
          });
        }
      },
      destroy() {
      }
      // noop
      // noop
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let $selectedAstElementId;
    let $highlightedAstElement;
    let $slotTargetElement;
    let $draggedObject;
    let $selectedAstElement;
    validate_store(selectedAstElementId, "selectedAstElementId");
    component_subscribe($$self, selectedAstElementId, ($$value) => $$invalidate(2, $selectedAstElementId = $$value));
    validate_store(highlightedAstElement, "highlightedAstElement");
    component_subscribe($$self, highlightedAstElement, ($$value) => $$invalidate(3, $highlightedAstElement = $$value));
    validate_store(slotTargetElement, "slotTargetElement");
    component_subscribe($$self, slotTargetElement, ($$value) => $$invalidate(4, $slotTargetElement = $$value));
    validate_store(draggedObject, "draggedObject");
    component_subscribe($$self, draggedObject, ($$value) => $$invalidate(15, $draggedObject = $$value));
    validate_store(selectedAstElement, "selectedAstElement");
    component_subscribe($$self, selectedAstElement, ($$value) => $$invalidate(5, $selectedAstElement = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("PageAstNode", slots, ["default"]);
    let { node } = $$props;
    let { nodeId } = $$props;
    function handleDragEnter() {
      if (isAstElement(node) && ($draggedObject === null || $draggedObject === void 0 ? void 0 : $draggedObject.category) === "basic") {
        set_store_value(slotTargetElement, $slotTargetElement = node, $slotTargetElement);
      }
    }
    function handleDragLeave() {
      if (isAstElement(node) && ($draggedObject === null || $draggedObject === void 0 ? void 0 : $draggedObject.category) === "basic" && $slotTargetElement === node) {
        set_store_value(slotTargetElement, $slotTargetElement = void 0, $slotTargetElement);
      }
    }
    function handleMouseOver() {
      isAstElement(node) && set_store_value(highlightedAstElement, $highlightedAstElement = node, $highlightedAstElement);
    }
    function handleMouseOut() {
      set_store_value(highlightedAstElement, $highlightedAstElement = void 0, $highlightedAstElement);
    }
    function handleClick() {
      set_store_value(selectedAstElementId, $selectedAstElementId = nodeId, $selectedAstElementId);
    }
    $$self.$$.on_mount.push(function() {
      if (node === void 0 && !("node" in $$props || $$self.$$.bound[$$self.$$.props["node"]])) {
        console.warn("<PageAstNode> was created without expected prop 'node'");
      }
      if (nodeId === void 0 && !("nodeId" in $$props || $$self.$$.bound[$$self.$$.props["nodeId"]])) {
        console.warn("<PageAstNode> was created without expected prop 'nodeId'");
      }
    });
    const writable_props = ["node", "nodeId"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<PageAstNode> was created with unknown prop '${key}'`);
    });
    const click_handler = () => set_store_value(selectedAstElementId, $selectedAstElementId = nodeId, $selectedAstElementId);
    const click_handler_1 = () => set_store_value(selectedAstElementId, $selectedAstElementId = nodeId, $selectedAstElementId);
    $$self.$$set = ($$props2) => {
      if ("node" in $$props2)
        $$invalidate(0, node = $$props2.node);
      if ("nodeId" in $$props2)
        $$invalidate(1, nodeId = $$props2.nodeId);
      if ("$$scope" in $$props2)
        $$invalidate(11, $$scope = $$props2.$$scope);
    };
    $$self.$capture_state = () => ({
      selectedAstElement,
      slotTargetElement,
      selectedAstElementId,
      highlightedAstElement,
      isAstElement,
      node,
      nodeId,
      draggedObject,
      handleDragEnter,
      handleDragLeave,
      handleMouseOver,
      handleMouseOut,
      handleClick,
      highlightContent,
      $selectedAstElementId,
      $highlightedAstElement,
      $slotTargetElement,
      $draggedObject,
      $selectedAstElement
    });
    $$self.$inject_state = ($$props2) => {
      if ("node" in $$props2)
        $$invalidate(0, node = $$props2.node);
      if ("nodeId" in $$props2)
        $$invalidate(1, nodeId = $$props2.nodeId);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    return [
      node,
      nodeId,
      $selectedAstElementId,
      $highlightedAstElement,
      $slotTargetElement,
      $selectedAstElement,
      handleDragEnter,
      handleDragLeave,
      handleMouseOver,
      handleMouseOut,
      handleClick,
      $$scope,
      slots,
      click_handler,
      click_handler_1
    ];
  }
  var PageAstNode = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance6, create_fragment6, safe_not_equal, { node: 0, nodeId: 1 });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PageAstNode",
        options,
        id: create_fragment6.name
      });
    }
    get node() {
      return this.$$.ctx[0];
    }
    set node(node) {
      this.$$set({ node });
      flush();
    }
    get nodeId() {
      return this.$$.ctx[1];
    }
    set nodeId(nodeId) {
      this.$$set({ nodeId });
      flush();
    }
  };
  create_custom_element(PageAstNode, { "node": {}, "nodeId": {} }, ["default"], [], true);
  var PageAstNode_default = PageAstNode;

  // svelte/components/PagePreview.svelte
  var PagePreview_exports = {};
  __export(PagePreview_exports, {
    default: () => PagePreview_default
  });
  var file7 = "svelte/components/PagePreview.svelte";
  function add_css2(target) {
    append_styles(target, "svelte-1fsqk14", '.contents[data-nochildren="true"], .contents[data-nochildren="true"]{display:inline}[data-slot-target="true"]{outline-color:red;outline-width:2px;outline-style:dashed}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZVByZXZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQWtGVSxvRUFBc0UsQ0FJNUUsT0FBTyxDQUFFLE1BQ1gsQ0FDUSx5QkFBMkIsQ0FDakMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLE1BQ2pCIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlBhZ2VQcmV2aWV3LnN2ZWx0ZSJdfQ== */');
  }
  function create_if_block5(ctx) {
    let browserframe;
    let current;
    browserframe = new BrowserFrame_default({
      props: {
        page: (
          /*$page*/
          ctx[1]
        ),
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      },
      $$inline: true
    });
    const block = {
      c: function create3() {
        create_component(browserframe.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(browserframe.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(browserframe, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const browserframe_changes = {};
        if (dirty & /*$page*/
        2)
          browserframe_changes.page = /*$page*/
          ctx2[1];
        if (dirty & /*$$scope, isDraggingOver, $selectedAstElementId*/
        2053) {
          browserframe_changes.$$scope = { dirty, ctx: ctx2 };
        }
        browserframe.$set(browserframe_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(browserframe.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(browserframe.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(browserframe, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block5.name,
      type: "if",
      source: "(63:2) {#if $page}",
      ctx
    });
    return block;
  }
  function create_default_slot(ctx) {
    let div1;
    let div0;
    let page_wrapper;
    let div0_data_selected_value;
    let div1_class_value;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        div1 = element("div");
        div0 = element("div");
        page_wrapper = element("page-wrapper");
        this.h();
      },
      l: function claim(nodes) {
        div1 = claim_element(nodes, "DIV", {
          role: true,
          style: true,
          id: true,
          class: true,
          "data-test-id": true
        });
        var div1_nodes = children(div1);
        div0 = claim_element(div1_nodes, "DIV", {
          id: true,
          class: true,
          "data-selected": true
        });
        var div0_nodes = children(div0);
        page_wrapper = claim_element(div0_nodes, "PAGE-WRAPPER", {});
        children(page_wrapper).forEach(detach_dev);
        div0_nodes.forEach(detach_dev);
        div1_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        add_location(page_wrapper, file7, 69, 10, 3394);
        attr_dev(div0, "id", "page-wrapper");
        attr_dev(div0, "class", "p-1 m-1");
        attr_dev(div0, "data-selected", div0_data_selected_value = /*$selectedAstElementId*/
        ctx[2] === "root");
        add_location(div0, file7, 68, 8, 3295);
        attr_dev(div1, "role", "document");
        set_style(div1, "--outlined-id", "title-1");
        attr_dev(div1, "id", "fake-browser-content");
        attr_dev(div1, "class", div1_class_value = "bg-white rounded-b-xl relative overflow-hidden flex-1 " + /*isDraggingOver*/
        (ctx[0] && "border-dashed border-blue-500 border-2"));
        attr_dev(div1, "data-test-id", "browser-content");
        add_location(div1, file7, 58, 6, 2903);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div1, anchor);
        append_hydration_dev(div1, div0);
        append_hydration_dev(div0, page_wrapper);
        if (!mounted) {
          dispose = [
            listen_dev(div1, "drop", prevent_default(
              /*handleDragDrop*/
              ctx[3]
            ), false, true, false, false),
            listen_dev(div1, "dragover", prevent_default(
              /*dragOver*/
              ctx[4]
            ), false, true, false, false)
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*$selectedAstElementId*/
        4 && div0_data_selected_value !== (div0_data_selected_value = /*$selectedAstElementId*/
        ctx2[2] === "root")) {
          attr_dev(div0, "data-selected", div0_data_selected_value);
        }
        if (dirty & /*isDraggingOver*/
        1 && div1_class_value !== (div1_class_value = "bg-white rounded-b-xl relative overflow-hidden flex-1 " + /*isDraggingOver*/
        (ctx2[0] && "border-dashed border-blue-500 border-2"))) {
          attr_dev(div1, "class", div1_class_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div1);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot.name,
      type: "slot",
      source: "(64:4) <BrowserFrame page={$page}>",
      ctx
    });
    return block;
  }
  function create_fragment7(ctx) {
    let div;
    let current;
    let if_block = (
      /*$page*/
      ctx[1] && create_if_block5(ctx)
    );
    const block = {
      c: function create3() {
        div = element("div");
        if (if_block)
          if_block.c();
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true, "data-test-id": true });
        var div_nodes = children(div);
        if (if_block)
          if_block.l(div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "flex-1 px-8 pb-4 flex max-h-full");
        attr_dev(div, "data-test-id", "main");
        add_location(div, file7, 55, 0, 2784);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        if (if_block)
          if_block.m(div, null);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        if (
          /*$page*/
          ctx2[1]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$page*/
            2) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block5(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div, null);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        if (if_block)
          if_block.d();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment7.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance7($$self, $$props, $$invalidate) {
    let $page;
    let $slotTargetElement;
    let $draggedObject;
    let $currentComponentCategory;
    let $selectedAstElementId;
    validate_store(page, "page");
    component_subscribe($$self, page, ($$value) => $$invalidate(1, $page = $$value));
    validate_store(slotTargetElement, "slotTargetElement");
    component_subscribe($$self, slotTargetElement, ($$value) => $$invalidate(6, $slotTargetElement = $$value));
    validate_store(draggedObject, "draggedObject");
    component_subscribe($$self, draggedObject, ($$value) => $$invalidate(7, $draggedObject = $$value));
    validate_store(currentComponentCategory, "currentComponentCategory");
    component_subscribe($$self, currentComponentCategory, ($$value) => $$invalidate(8, $currentComponentCategory = $$value));
    validate_store(selectedAstElementId, "selectedAstElementId");
    component_subscribe($$self, selectedAstElementId, ($$value) => $$invalidate(2, $selectedAstElementId = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("PagePreview", slots, []);
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    let { live } = $$props;
    let isDraggingOver = false;
    function handleDragDrop(e) {
      return __awaiter(this, void 0, void 0, function* () {
        let { target } = e;
        set_store_value(currentComponentCategory, $currentComponentCategory = null, $currentComponentCategory);
        if (!$draggedObject)
          return;
        if ($draggedObject.category === "basic") {
          if (!(target instanceof HTMLElement))
            return;
          if (target.id === "fake-browser-content")
            return;
          if (!$slotTargetElement)
            return;
          if ($slotTargetElement.attrs.selfClose)
            return;
          addBasicComponentToTarget2($slotTargetElement);
        } else {
          live.pushEvent(
            "render_component_in_page",
            {
              component_id: $draggedObject.id,
              page_id: $page.id
            },
            ({ ast }) => {
              live.pushEvent("update_page_ast", {
                id: $page.id,
                ast: [...$page.ast, ...ast]
              });
            }
          );
        }
        $$invalidate(0, isDraggingOver = false);
      });
    }
    function addBasicComponentToTarget2(astElement) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!$draggedObject)
          return;
        let componentDefinition = $draggedObject;
        set_store_value(draggedObject, $draggedObject = null, $draggedObject);
        let targetNode = astElement;
        live.pushEvent(
          "render_component_in_page",
          {
            component_id: componentDefinition.id,
            page_id: $page.id
          },
          ({ ast }) => {
            targetNode === null || targetNode === void 0 ? void 0 : targetNode.content.push(...ast);
            set_store_value(slotTargetElement, $slotTargetElement = void 0, $slotTargetElement);
            live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
          }
        );
      });
    }
    function dragOver() {
      $$invalidate(0, isDraggingOver = true);
    }
    $$self.$$.on_mount.push(function() {
      if (live === void 0 && !("live" in $$props || $$self.$$.bound[$$self.$$.props["live"]])) {
        console.warn("<PagePreview> was created without expected prop 'live'");
      }
    });
    const writable_props = ["live"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<PagePreview> was created with unknown prop '${key}'`);
    });
    $$self.$$set = ($$props2) => {
      if ("live" in $$props2)
        $$invalidate(5, live = $$props2.live);
    };
    $$self.$capture_state = () => ({
      __awaiter,
      BrowserFrame: BrowserFrame_default,
      selectedAstElementId,
      currentComponentCategory,
      page,
      slotTargetElement,
      draggedObject,
      live,
      isDraggingOver,
      handleDragDrop,
      addBasicComponentToTarget: addBasicComponentToTarget2,
      dragOver,
      $page,
      $slotTargetElement,
      $draggedObject,
      $currentComponentCategory,
      $selectedAstElementId
    });
    $$self.$inject_state = ($$props2) => {
      if ("__awaiter" in $$props2)
        __awaiter = $$props2.__awaiter;
      if ("live" in $$props2)
        $$invalidate(5, live = $$props2.live);
      if ("isDraggingOver" in $$props2)
        $$invalidate(0, isDraggingOver = $$props2.isDraggingOver);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    return [isDraggingOver, $page, $selectedAstElementId, handleDragDrop, dragOver, live];
  }
  var PagePreview = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance7, create_fragment7, safe_not_equal, { live: 5 }, add_css2);
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PagePreview",
        options,
        id: create_fragment7.name
      });
    }
    get live() {
      return this.$$.ctx[5];
    }
    set live(live) {
      this.$$set({ live });
      flush();
    }
  };
  create_custom_element(PagePreview, { "live": {} }, [], [], true);
  var PagePreview_default = PagePreview;

  // svelte/components/PageWrapper.svelte
  var PageWrapper_exports = {};
  __export(PageWrapper_exports, {
    default: () => PageWrapper_default
  });
  var { console: console_12 } = globals;
  var file8 = "svelte/components/PageWrapper.svelte";
  function add_css3(target) {
    append_styles(target, "svelte-xbvayw", '[data-selected="true"], [data-highlighted="true"]{outline-color:#06b6d4;outline-width:2px;outline-style:dashed}:before, :after{pointer-events:none}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZVdyYXBwZXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQStDVSxpREFBbUQsQ0FDekQsYUFBYSxDQUFFLE9BQU8sQ0FDdEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLE1BQ2pCLENBRVEsZUFBaUIsQ0FDdkIsY0FBYyxDQUFFLElBQ2xCIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlBhZ2VXcmFwcGVyLnN2ZWx0ZSJdfQ== */');
  }
  function get_each_context4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    return child_ctx;
  }
  function get_each_context_12(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[8] = list[i];
    child_ctx[10] = i;
    return child_ctx;
  }
  function create_each_block_12(ctx) {
    let pageastnode;
    let current;
    pageastnode = new PageAstNode_default({
      props: {
        node: (
          /*astNode*/
          ctx[8]
        ),
        nodeId: String(
          /*index*/
          ctx[10]
        )
      },
      $$inline: true
    });
    const block = {
      c: function create3() {
        create_component(pageastnode.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(pageastnode.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(pageastnode, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const pageastnode_changes = {};
        if (dirty & /*$page*/
        2)
          pageastnode_changes.node = /*astNode*/
          ctx2[8];
        pageastnode.$set(pageastnode_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(pageastnode.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(pageastnode.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(pageastnode, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block_12.name,
      type: "each",
      source: "(37:6) {#each $page.ast as astNode, index}",
      ctx
    });
    return block;
  }
  function create_default_slot2(ctx) {
    let t;
    let current;
    let each_value_1 = ensure_array_like_dev(
      /*$page*/
      ctx[1].ast
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_12(get_each_context_12(ctx, each_value_1, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    const block = {
      c: function create3() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = space();
      },
      l: function claim(nodes) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        t = claim_space(nodes);
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, t, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*$page, String*/
        2) {
          each_value_1 = ensure_array_like_dev(
            /*$page*/
            ctx2[1].ast
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_12(ctx2, each_value_1, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block_12(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(t.parentNode, t);
            }
          }
          group_outros();
          for (i = each_value_1.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        for (let i = 0; i < each_value_1.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
        destroy_each(each_blocks, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot2.name,
      type: "slot",
      source: "(36:4) <LayoutAstNode node={layoutAstNode}>",
      ctx
    });
    return block;
  }
  function create_each_block4(ctx) {
    let layoutastnode;
    let current;
    layoutastnode = new LayoutAstNode_default({
      props: {
        node: (
          /*layoutAstNode*/
          ctx[5]
        ),
        $$slots: { default: [create_default_slot2] },
        $$scope: { ctx }
      },
      $$inline: true
    });
    const block = {
      c: function create3() {
        create_component(layoutastnode.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(layoutastnode.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(layoutastnode, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const layoutastnode_changes = {};
        if (dirty & /*$page*/
        2)
          layoutastnode_changes.node = /*layoutAstNode*/
          ctx2[5];
        if (dirty & /*$$scope, $page*/
        2050) {
          layoutastnode_changes.$$scope = { dirty, ctx: ctx2 };
        }
        layoutastnode.$set(layoutastnode_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(layoutastnode.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(layoutastnode.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(layoutastnode, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block4.name,
      type: "each",
      source: "(35:2) {#each $page.layout.ast as layoutAstNode}",
      ctx
    });
    return block;
  }
  function create_fragment8(ctx) {
    let div;
    let current;
    let each_value = ensure_array_like_dev(
      /*$page*/
      ctx[1].layout.ast
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block4(get_each_context4(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    const block = {
      c: function create3() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { id: true });
        var div_nodes = children(div);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(div_nodes);
        }
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "id", "page-wrapper-content");
        add_location(div, file8, 36, 0, 1546);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        ctx[2](div);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        if (dirty & /*$page, String*/
        2) {
          each_value = ensure_array_like_dev(
            /*$page*/
            ctx2[1].layout.ast
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context4(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block4(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        destroy_each(each_blocks, detaching);
        ctx[2](null);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment8.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance8($$self, $$props, $$invalidate) {
    let $page;
    validate_store(page, "page");
    component_subscribe($$self, page, ($$value) => $$invalidate(1, $page = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("page-wrapper", slots, []);
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    let wrapper;
    onMount(() => {
      console.log(wrapper);
    });
    const reloadStylesheet = () => __awaiter(void 0, void 0, void 0, function* () {
      yield import("https://unpkg.com/@mhsdesign/jit-browser-tailwindcss@0.4.0/dist/cdn.min.js");
      const content = `<div class="bg-red-500">el</div>`;
      const css = yield window.jitBrowserTailwindcss(
        `
      @tailwind components;
      @tailwind utilities;
      `,
        content
      );
      console.log(css);
    });
    window.reloadStylesheet = reloadStylesheet;
    const writable_props = [];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console_12.warn(`<page-wrapper> was created with unknown prop '${key}'`);
    });
    function div_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        wrapper = $$value;
        $$invalidate(0, wrapper);
      });
    }
    $$self.$capture_state = () => ({
      __awaiter,
      LayoutAstNode: LayoutAstNode_default,
      PageAstNode: PageAstNode_default,
      page,
      onMount,
      wrapper,
      reloadStylesheet,
      $page
    });
    $$self.$inject_state = ($$props2) => {
      if ("__awaiter" in $$props2)
        __awaiter = $$props2.__awaiter;
      if ("wrapper" in $$props2)
        $$invalidate(0, wrapper = $$props2.wrapper);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    return [wrapper, $page, div_binding];
  }
  var PageWrapper = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance8, create_fragment8, safe_not_equal, {}, add_css3);
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PageWrapper",
        options,
        id: create_fragment8.name
      });
    }
  };
  customElements.define("page-wrapper", create_custom_element(PageWrapper, {}, [], [], true));
  var PageWrapper_default = PageWrapper;

  // svelte/components/Pill.svelte
  var Pill_exports = {};
  __export(Pill_exports, {
    default: () => Pill_default
  });
  var file9 = "svelte/components/Pill.svelte";
  function create_fragment9(ctx) {
    let div;
    let t0;
    let button;
    let span;
    let t1;
    let t2;
    let svg;
    let path;
    let current;
    let mounted;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[1],
      null
    );
    const default_slot_template_1 = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot_1 = create_slot(
      default_slot_template_1,
      ctx,
      /*$$scope*/
      ctx[1],
      null
    );
    const block = {
      c: function create3() {
        div = element("div");
        if (default_slot)
          default_slot.c();
        t0 = space();
        button = element("button");
        span = element("span");
        t1 = text("Delete class: ");
        if (default_slot_1)
          default_slot_1.c();
        t2 = space();
        svg = svg_element("svg");
        path = svg_element("path");
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true });
        var div_nodes = children(div);
        if (default_slot)
          default_slot.l(div_nodes);
        t0 = claim_space(div_nodes);
        button = claim_element(div_nodes, "BUTTON", { class: true, type: true });
        var button_nodes = children(button);
        span = claim_element(button_nodes, "SPAN", { class: true });
        var span_nodes = children(span);
        t1 = claim_text(span_nodes, "Delete class: ");
        if (default_slot_1)
          default_slot_1.l(span_nodes);
        span_nodes.forEach(detach_dev);
        t2 = claim_space(button_nodes);
        svg = claim_svg_element(button_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg_nodes = children(svg);
        path = claim_svg_element(svg_nodes, "path", {
          "fill-rule": true,
          d: true,
          "clip-rule": true
        });
        children(path).forEach(detach_dev);
        svg_nodes.forEach(detach_dev);
        button_nodes.forEach(detach_dev);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span, "class", "sr-only");
        add_location(span, file9, 12, 4, 436);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file9, 14, 6, 595);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-3 h-3");
        add_location(svg, file9, 13, 4, 492);
        attr_dev(button, "class", "p-2 rounded-full inline-block bg-slate-700 text-white hover:text-blue-400 active:text-blue-500");
        attr_dev(button, "type", "button");
        add_location(button, file9, 7, 2, 240);
        attr_dev(div, "class", "inline-flex items-center rounded-full bg-slate-700 text-white text-xs px-3 pr-0 m-1 leading-4");
        add_location(div, file9, 5, 0, 119);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        if (default_slot) {
          default_slot.m(div, null);
        }
        append_hydration_dev(div, t0);
        append_hydration_dev(div, button);
        append_hydration_dev(button, span);
        append_hydration_dev(span, t1);
        if (default_slot_1) {
          default_slot_1.m(span, null);
        }
        append_hydration_dev(button, t2);
        append_hydration_dev(button, svg);
        append_hydration_dev(svg, path);
        current = true;
        if (!mounted) {
          dispose = listen_dev(button, "click", prevent_default(
            /*click_handler*/
            ctx[3]
          ), false, true, false, false);
          mounted = true;
        }
      },
      p: function update2(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[1],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[1]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[1],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (default_slot_1) {
          if (default_slot_1.p && (!current || dirty & /*$$scope*/
          2)) {
            update_slot_base(
              default_slot_1,
              default_slot_template_1,
              ctx2,
              /*$$scope*/
              ctx2[1],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[1]
              ) : get_slot_changes(
                default_slot_template_1,
                /*$$scope*/
                ctx2[1],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        transition_in(default_slot_1, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(default_slot, local);
        transition_out(default_slot_1, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        if (default_slot)
          default_slot.d(detaching);
        if (default_slot_1)
          default_slot_1.d(detaching);
        mounted = false;
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment9.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Pill", slots, ["default"]);
    const dispatch2 = createEventDispatcher();
    const writable_props = [];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<Pill> was created with unknown prop '${key}'`);
    });
    const click_handler = () => dispatch2("delete");
    $$self.$$set = ($$props2) => {
      if ("$$scope" in $$props2)
        $$invalidate(1, $$scope = $$props2.$$scope);
    };
    $$self.$capture_state = () => ({ createEventDispatcher, dispatch: dispatch2 });
    return [dispatch2, $$scope, slots, click_handler];
  }
  var Pill = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance9, create_fragment9, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Pill",
        options,
        id: create_fragment9.name
      });
    }
  };
  create_custom_element(Pill, {}, ["default"], [], true);
  var Pill_default = Pill;

  // svelte/components/PropertiesSidebar.svelte
  var PropertiesSidebar_exports = {};
  __export(PropertiesSidebar_exports, {
    default: () => PropertiesSidebar_default
  });

  // svelte/components/SidebarSection.svelte
  var SidebarSection_exports = {};
  __export(SidebarSection_exports, {
    default: () => SidebarSection_default
  });
  var file10 = "svelte/components/SidebarSection.svelte";
  function get_each_context5(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[26] = list[i];
    child_ctx[28] = i;
    return child_ctx;
  }
  var get_value_slot_changes_1 = (dirty) => ({});
  var get_value_slot_context_1 = (ctx) => ({});
  var get_input_slot_changes_1 = (dirty) => ({});
  var get_input_slot_context_1 = (ctx) => ({});
  var get_value_slot_changes = (dirty) => ({});
  var get_value_slot_context = (ctx) => ({});
  var get_input_slot_changes = (dirty) => ({});
  var get_input_slot_context = (ctx) => ({});
  var get_heading_slot_changes = (dirty) => ({});
  var get_heading_slot_context = (ctx) => ({});
  function create_if_block_14(ctx) {
    let current;
    const input_slot_template = (
      /*#slots*/
      ctx[16].input
    );
    const input_slot = create_slot(
      input_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_input_slot_context_1
    );
    const input_slot_or_fallback = input_slot || fallback_block_1(ctx);
    const block = {
      c: function create3() {
        if (input_slot_or_fallback)
          input_slot_or_fallback.c();
      },
      l: function claim(nodes) {
        if (input_slot_or_fallback)
          input_slot_or_fallback.l(nodes);
      },
      m: function mount(target, anchor) {
        if (input_slot_or_fallback) {
          input_slot_or_fallback.m(target, anchor);
        }
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (input_slot) {
          if (input_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              input_slot,
              input_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                input_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_input_slot_changes_1
              ),
              get_input_slot_context_1
            );
          }
        } else {
          if (input_slot_or_fallback && input_slot_or_fallback.p && (!current || dirty & /*$$scope, $$slots, placeholder, internalValue, large, astElements*/
          34846)) {
            input_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(input_slot_or_fallback, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(input_slot_or_fallback, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (input_slot_or_fallback)
          input_slot_or_fallback.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_14.name,
      type: "if",
      source: "(99:21) ",
      ctx
    });
    return block;
  }
  function create_if_block6(ctx) {
    let t;
    let div;
    let current;
    const input_slot_template = (
      /*#slots*/
      ctx[16].input
    );
    const input_slot = create_slot(
      input_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_input_slot_context
    );
    const input_slot_or_fallback = input_slot || fallback_block(ctx);
    const value_slot_template = (
      /*#slots*/
      ctx[16].value
    );
    const value_slot = create_slot(
      value_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_value_slot_context
    );
    const block = {
      c: function create3() {
        if (input_slot_or_fallback)
          input_slot_or_fallback.c();
        t = space();
        div = element("div");
        if (value_slot)
          value_slot.c();
        this.h();
      },
      l: function claim(nodes) {
        if (input_slot_or_fallback)
          input_slot_or_fallback.l(nodes);
        t = claim_space(nodes);
        div = claim_element(nodes, "DIV", { class: true });
        var div_nodes = children(div);
        if (value_slot)
          value_slot.l(div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "pt-3");
        add_location(div, file10, 100, 4, 3239);
      },
      m: function mount(target, anchor) {
        if (input_slot_or_fallback) {
          input_slot_or_fallback.m(target, anchor);
        }
        insert_hydration_dev(target, t, anchor);
        insert_hydration_dev(target, div, anchor);
        if (value_slot) {
          value_slot.m(div, null);
        }
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (input_slot) {
          if (input_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              input_slot,
              input_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                input_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_input_slot_changes
              ),
              get_input_slot_context
            );
          }
        } else {
          if (input_slot_or_fallback && input_slot_or_fallback.p && (!current || dirty & /*placeholder, internalValue*/
          10)) {
            input_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
          }
        }
        if (value_slot) {
          if (value_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              value_slot,
              value_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                value_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_value_slot_changes
              ),
              get_value_slot_context
            );
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(input_slot_or_fallback, local);
        transition_in(value_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(input_slot_or_fallback, local);
        transition_out(value_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
          detach_dev(div);
        }
        if (input_slot_or_fallback)
          input_slot_or_fallback.d(detaching);
        if (value_slot)
          value_slot.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block6.name,
      type: "if",
      source: '(87:2) {#if $$slots[\\"value\\"]}',
      ctx
    });
    return block;
  }
  function create_if_block_53(ctx) {
    let each_1_anchor;
    let each_value = ensure_array_like_dev(
      /*astElements*/
      ctx[4]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block5(get_each_context5(ctx, each_value, i));
    }
    const block = {
      c: function create3() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      l: function claim(nodes) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*highlightAstElement, astElements, unhighlightAstElement, moveAstElement, select*/
        1648) {
          each_value = ensure_array_like_dev(
            /*astElements*/
            ctx2[4]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context5(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block5(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_53.name,
      type: "if",
      source: "(124:28) ",
      ctx
    });
    return block;
  }
  function create_if_block_23(ctx) {
    let t;
    let if_block1_anchor;
    let current;
    function select_block_type_2(ctx2, dirty) {
      if (
        /*large*/
        ctx2[2]
      )
        return create_if_block_43;
      return create_else_block3;
    }
    let current_block_type = select_block_type_2(ctx, -1);
    let if_block0 = current_block_type(ctx);
    let if_block1 = (
      /*$$slots*/
      ctx[11]["value"] && create_if_block_33(ctx)
    );
    const block = {
      c: function create3() {
        if_block0.c();
        t = space();
        if (if_block1)
          if_block1.c();
        if_block1_anchor = empty();
      },
      l: function claim(nodes) {
        if_block0.l(nodes);
        t = claim_space(nodes);
        if (if_block1)
          if_block1.l(nodes);
        if_block1_anchor = empty();
      },
      m: function mount(target, anchor) {
        if_block0.m(target, anchor);
        insert_hydration_dev(target, t, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert_hydration_dev(target, if_block1_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (current_block_type === (current_block_type = select_block_type_2(ctx2, dirty)) && if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0.d(1);
          if_block0 = current_block_type(ctx2);
          if (if_block0) {
            if_block0.c();
            if_block0.m(t.parentNode, t);
          }
        }
        if (
          /*$$slots*/
          ctx2[11]["value"]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & /*$$slots*/
            2048) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_33(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block1);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block1);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
          detach_dev(if_block1_anchor);
        }
        if_block0.d(detaching);
        if (if_block1)
          if_block1.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_23.name,
      type: "if",
      source: "(101:6) {#if internalValue}",
      ctx
    });
    return block;
  }
  function create_each_block5(ctx) {
    let div2;
    let div0;
    let span0;
    let code;
    let t0;
    let t1_value = (
      /*astElement*/
      ctx[26].tag + ""
    );
    let t1;
    let t2;
    let t3;
    let button0;
    let t4;
    let span1;
    let t5_value = (
      /*astElement*/
      ctx[26].tag + ""
    );
    let t5;
    let t6;
    let t7;
    let svg0;
    let path0;
    let path1;
    let t8;
    let div1;
    let button1;
    let span3;
    let t9;
    let span2;
    let t10_value = (
      /*astElement*/
      ctx[26].tag + ""
    );
    let t10;
    let t11;
    let t12;
    let t13;
    let svg1;
    let path2;
    let button1_disabled_value;
    let t14;
    let button2;
    let span5;
    let t15;
    let span4;
    let t16_value = (
      /*astElement*/
      ctx[26].tag + ""
    );
    let t16;
    let t17;
    let t18;
    let t19;
    let svg2;
    let path3;
    let button2_disabled_value;
    let t20;
    let mounted;
    let dispose;
    function click_handler_1() {
      return (
        /*click_handler_1*/
        ctx[18](
          /*astElement*/
          ctx[26]
        )
      );
    }
    function click_handler_2() {
      return (
        /*click_handler_2*/
        ctx[19](
          /*astElement*/
          ctx[26]
        )
      );
    }
    function click_handler_3() {
      return (
        /*click_handler_3*/
        ctx[20](
          /*astElement*/
          ctx[26]
        )
      );
    }
    function mouseenter_handler() {
      return (
        /*mouseenter_handler*/
        ctx[21](
          /*astElement*/
          ctx[26]
        )
      );
    }
    const block = {
      c: function create3() {
        div2 = element("div");
        div0 = element("div");
        span0 = element("span");
        code = element("code");
        t0 = text("<");
        t1 = text(t1_value);
        t2 = text(">");
        t3 = space();
        button0 = element("button");
        t4 = text("Edit ");
        span1 = element("span");
        t5 = text(t5_value);
        t6 = text(" element");
        t7 = space();
        svg0 = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        t8 = space();
        div1 = element("div");
        button1 = element("button");
        span3 = element("span");
        t9 = text("Move ");
        span2 = element("span");
        t10 = text(t10_value);
        t11 = text(" element");
        t12 = text(" up");
        t13 = space();
        svg1 = svg_element("svg");
        path2 = svg_element("path");
        t14 = space();
        button2 = element("button");
        span5 = element("span");
        t15 = text("Move ");
        span4 = element("span");
        t16 = text(t16_value);
        t17 = text(" element");
        t18 = text(" down");
        t19 = space();
        svg2 = svg_element("svg");
        path3 = svg_element("path");
        t20 = space();
        this.h();
      },
      l: function claim(nodes) {
        div2 = claim_element(nodes, "DIV", { class: true });
        var div2_nodes = children(div2);
        div0 = claim_element(div2_nodes, "DIV", { class: true });
        var div0_nodes = children(div0);
        span0 = claim_element(div0_nodes, "SPAN", {});
        var span0_nodes = children(span0);
        code = claim_element(span0_nodes, "CODE", {});
        var code_nodes = children(code);
        t0 = claim_text(code_nodes, "<");
        t1 = claim_text(code_nodes, t1_value);
        t2 = claim_text(code_nodes, ">");
        code_nodes.forEach(detach_dev);
        span0_nodes.forEach(detach_dev);
        t3 = claim_space(div0_nodes);
        button0 = claim_element(div0_nodes, "BUTTON", { class: true });
        var button0_nodes = children(button0);
        t4 = claim_text(button0_nodes, "Edit ");
        span1 = claim_element(button0_nodes, "SPAN", { class: true });
        var span1_nodes = children(span1);
        t5 = claim_text(span1_nodes, t5_value);
        t6 = claim_text(span1_nodes, " element");
        span1_nodes.forEach(detach_dev);
        t7 = claim_space(button0_nodes);
        svg0 = claim_svg_element(button0_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg0_nodes = children(svg0);
        path0 = claim_svg_element(svg0_nodes, "path", { d: true });
        children(path0).forEach(detach_dev);
        path1 = claim_svg_element(svg0_nodes, "path", { d: true });
        children(path1).forEach(detach_dev);
        svg0_nodes.forEach(detach_dev);
        button0_nodes.forEach(detach_dev);
        div0_nodes.forEach(detach_dev);
        t8 = claim_space(div2_nodes);
        div1 = claim_element(div2_nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        button1 = claim_element(div1_nodes, "BUTTON", { class: true });
        var button1_nodes = children(button1);
        span3 = claim_element(button1_nodes, "SPAN", {});
        var span3_nodes = children(span3);
        t9 = claim_text(span3_nodes, "Move ");
        span2 = claim_element(span3_nodes, "SPAN", { class: true });
        var span2_nodes = children(span2);
        t10 = claim_text(span2_nodes, t10_value);
        t11 = claim_text(span2_nodes, " element");
        span2_nodes.forEach(detach_dev);
        t12 = claim_text(span3_nodes, " up");
        span3_nodes.forEach(detach_dev);
        t13 = claim_space(button1_nodes);
        svg1 = claim_svg_element(button1_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg1_nodes = children(svg1);
        path2 = claim_svg_element(svg1_nodes, "path", {
          "fill-rule": true,
          d: true,
          "clip-rule": true
        });
        children(path2).forEach(detach_dev);
        svg1_nodes.forEach(detach_dev);
        button1_nodes.forEach(detach_dev);
        t14 = claim_space(div1_nodes);
        button2 = claim_element(div1_nodes, "BUTTON", { class: true });
        var button2_nodes = children(button2);
        span5 = claim_element(button2_nodes, "SPAN", {});
        var span5_nodes = children(span5);
        t15 = claim_text(span5_nodes, "Move ");
        span4 = claim_element(span5_nodes, "SPAN", { class: true });
        var span4_nodes = children(span4);
        t16 = claim_text(span4_nodes, t16_value);
        t17 = claim_text(span4_nodes, " element");
        span4_nodes.forEach(detach_dev);
        t18 = claim_text(span5_nodes, " down");
        span5_nodes.forEach(detach_dev);
        t19 = claim_space(button2_nodes);
        svg2 = claim_svg_element(button2_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg2_nodes = children(svg2);
        path3 = claim_svg_element(svg2_nodes, "path", {
          "fill-rule": true,
          d: true,
          "clip-rule": true
        });
        children(path3).forEach(detach_dev);
        svg2_nodes.forEach(detach_dev);
        button2_nodes.forEach(detach_dev);
        div1_nodes.forEach(detach_dev);
        t20 = claim_space(div2_nodes);
        div2_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        add_location(code, file10, 135, 20, 4585);
        add_location(span0, file10, 135, 14, 4579);
        attr_dev(span1, "class", "sr-only");
        add_location(span1, file10, 140, 21, 4952);
        attr_dev(path0, "d", "M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z");
        add_location(path0, file10, 142, 18, 5137);
        attr_dev(path1, "d", "M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z");
        add_location(path1, file10, 145, 18, 5448);
        attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg0, "viewBox", "0 0 24 24");
        attr_dev(svg0, "fill", "currentColor");
        attr_dev(svg0, "class", "w-3 h-3");
        add_location(svg0, file10, 141, 16, 5022);
        attr_dev(button0, "class", "flex items-center justify-center gap-x-0.5 px-2 py-1 bg-cyan-300 font-bold text-xs uppercase tracking-wide rounded transition-colors hover:bg-cyan-900 active:bg-cyan-700 hover:text-white");
        add_location(button0, file10, 136, 14, 4644);
        attr_dev(div0, "class", "flex items-center justify-between");
        add_location(div0, file10, 134, 12, 4517);
        attr_dev(span2, "class", "sr-only");
        add_location(span2, file10, 157, 27, 6223);
        add_location(span3, file10, 157, 16, 6212);
        attr_dev(path2, "fill-rule", "evenodd");
        attr_dev(path2, "d", "M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z");
        attr_dev(path2, "clip-rule", "evenodd");
        add_location(path2, file10, 159, 18, 6418);
        attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg1, "viewBox", "0 0 24 24");
        attr_dev(svg1, "fill", "currentColor");
        attr_dev(svg1, "class", "w-3 h-3");
        add_location(svg1, file10, 158, 16, 6303);
        attr_dev(button1, "class", "flex items-center justify-center gap-x-0.5 px-1.5 py-1 bg-cyan-800 font-bold text-xs uppercase tracking-wide rounded hover:bg-cyan-950 active:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white");
        button1.disabled = button1_disabled_value = /*idx*/
        ctx[28] === 0;
        add_location(button1, file10, 152, 14, 5833);
        attr_dev(span4, "class", "sr-only");
        add_location(span4, file10, 171, 27, 7164);
        add_location(span5, file10, 171, 16, 7153);
        attr_dev(path3, "fill-rule", "evenodd");
        attr_dev(path3, "d", "M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z");
        attr_dev(path3, "clip-rule", "evenodd");
        add_location(path3, file10, 173, 18, 7361);
        attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg2, "viewBox", "0 0 24 24");
        attr_dev(svg2, "fill", "currentColor");
        attr_dev(svg2, "class", "w-3 h-3");
        add_location(svg2, file10, 172, 16, 7246);
        attr_dev(button2, "class", "flex items-center justify-center gap-x-0.5 px-1.5 py-1 bg-cyan-800 font-bold text-xs uppercase tracking-wide rounded hover:bg-cyan-950 active:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white");
        button2.disabled = button2_disabled_value = /*idx*/
        ctx[28] === /*astElements*/
        ctx[4].length - 1;
        add_location(button2, file10, 166, 14, 6754);
        attr_dev(div1, "class", "mt-2 grid grid-cols-2 gap-x-1");
        add_location(div1, file10, 151, 12, 5775);
        attr_dev(div2, "class", "mt-5");
        add_location(div2, file10, 129, 10, 4339);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div2, anchor);
        append_hydration_dev(div2, div0);
        append_hydration_dev(div0, span0);
        append_hydration_dev(span0, code);
        append_hydration_dev(code, t0);
        append_hydration_dev(code, t1);
        append_hydration_dev(code, t2);
        append_hydration_dev(div0, t3);
        append_hydration_dev(div0, button0);
        append_hydration_dev(button0, t4);
        append_hydration_dev(button0, span1);
        append_hydration_dev(span1, t5);
        append_hydration_dev(span1, t6);
        append_hydration_dev(button0, t7);
        append_hydration_dev(button0, svg0);
        append_hydration_dev(svg0, path0);
        append_hydration_dev(svg0, path1);
        append_hydration_dev(div2, t8);
        append_hydration_dev(div2, div1);
        append_hydration_dev(div1, button1);
        append_hydration_dev(button1, span3);
        append_hydration_dev(span3, t9);
        append_hydration_dev(span3, span2);
        append_hydration_dev(span2, t10);
        append_hydration_dev(span2, t11);
        append_hydration_dev(span3, t12);
        append_hydration_dev(button1, t13);
        append_hydration_dev(button1, svg1);
        append_hydration_dev(svg1, path2);
        append_hydration_dev(div1, t14);
        append_hydration_dev(div1, button2);
        append_hydration_dev(button2, span5);
        append_hydration_dev(span5, t15);
        append_hydration_dev(span5, span4);
        append_hydration_dev(span4, t16);
        append_hydration_dev(span4, t17);
        append_hydration_dev(span5, t18);
        append_hydration_dev(button2, t19);
        append_hydration_dev(button2, svg2);
        append_hydration_dev(svg2, path3);
        append_hydration_dev(div2, t20);
        if (!mounted) {
          dispose = [
            listen_dev(button0, "click", click_handler_1, false, false, false, false),
            listen_dev(button1, "click", click_handler_2, false, false, false, false),
            listen_dev(button2, "click", click_handler_3, false, false, false, false),
            listen_dev(div2, "mouseenter", mouseenter_handler, false, false, false, false),
            listen_dev(
              div2,
              "mouseleave",
              /*mouseleave_handler*/
              ctx[22],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*astElements*/
        16 && t1_value !== (t1_value = /*astElement*/
        ctx[26].tag + ""))
          set_data_dev(t1, t1_value);
        if (dirty & /*astElements*/
        16 && t5_value !== (t5_value = /*astElement*/
        ctx[26].tag + ""))
          set_data_dev(t5, t5_value);
        if (dirty & /*astElements*/
        16 && t10_value !== (t10_value = /*astElement*/
        ctx[26].tag + ""))
          set_data_dev(t10, t10_value);
        if (dirty & /*astElements*/
        16 && t16_value !== (t16_value = /*astElement*/
        ctx[26].tag + ""))
          set_data_dev(t16, t16_value);
        if (dirty & /*astElements*/
        16 && button2_disabled_value !== (button2_disabled_value = /*idx*/
        ctx[28] === /*astElements*/
        ctx[4].length - 1)) {
          prop_dev(button2, "disabled", button2_disabled_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div2);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block5.name,
      type: "each",
      source: "(125:8) {#each astElements as astElement, idx}",
      ctx
    });
    return block;
  }
  function create_else_block3(ctx) {
    let input;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        input = element("input");
        this.h();
      },
      l: function claim(nodes) {
        input = claim_element(nodes, "INPUT", {
          type: true,
          class: true,
          placeholder: true
        });
        this.h();
      },
      h: function hydrate() {
        attr_dev(input, "type", "text");
        attr_dev(input, "class", "w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm");
        attr_dev(
          input,
          "placeholder",
          /*placeholder*/
          ctx[1]
        );
        input.value = /*internalValue*/
        ctx[3];
        add_location(input, file10, 114, 10, 3789);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, input, anchor);
        if (!mounted) {
          dispose = [
            listen_dev(
              input,
              "keydown",
              /*handleKeydown*/
              ctx[7],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              input,
              "change",
              /*handleTextChange*/
              ctx[8],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*placeholder*/
        2) {
          attr_dev(
            input,
            "placeholder",
            /*placeholder*/
            ctx2[1]
          );
        }
        if (dirty & /*internalValue*/
        8 && input.value !== /*internalValue*/
        ctx2[3]) {
          prop_dev(
            input,
            "value",
            /*internalValue*/
            ctx2[3]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(input);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block3.name,
      type: "else",
      source: "(111:8) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block_43(ctx) {
    let textarea;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        textarea = element("textarea");
        this.h();
      },
      l: function claim(nodes) {
        textarea = claim_element(nodes, "TEXTAREA", { class: true, placeholder: true });
        children(textarea).forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(textarea, "class", "w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm");
        attr_dev(
          textarea,
          "placeholder",
          /*placeholder*/
          ctx[1]
        );
        textarea.value = /*internalValue*/
        ctx[3];
        add_location(textarea, file10, 106, 10, 3494);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, textarea, anchor);
        if (!mounted) {
          dispose = [
            listen_dev(
              textarea,
              "keydown",
              /*handleKeydown*/
              ctx[7],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              textarea,
              "change",
              /*handleTextChange*/
              ctx[8],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*placeholder*/
        2) {
          attr_dev(
            textarea,
            "placeholder",
            /*placeholder*/
            ctx2[1]
          );
        }
        if (dirty & /*internalValue*/
        8) {
          prop_dev(
            textarea,
            "value",
            /*internalValue*/
            ctx2[3]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(textarea);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_43.name,
      type: "if",
      source: "(102:8) {#if large}",
      ctx
    });
    return block;
  }
  function create_if_block_33(ctx) {
    let div;
    let current;
    const value_slot_template = (
      /*#slots*/
      ctx[16].value
    );
    const value_slot = create_slot(
      value_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_value_slot_context_1
    );
    const block = {
      c: function create3() {
        div = element("div");
        if (value_slot)
          value_slot.c();
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true });
        var div_nodes = children(div);
        if (value_slot)
          value_slot.l(div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "pt-3");
        add_location(div, file10, 124, 10, 4124);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        if (value_slot) {
          value_slot.m(div, null);
        }
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (value_slot) {
          if (value_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              value_slot,
              value_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                value_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_value_slot_changes_1
              ),
              get_value_slot_context_1
            );
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(value_slot, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(value_slot, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
        if (value_slot)
          value_slot.d(detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_33.name,
      type: "if",
      source: '(121:8) {#if $$slots[\\"value\\"]}',
      ctx
    });
    return block;
  }
  function fallback_block_1(ctx) {
    let current_block_type_index;
    let if_block;
    let if_block_anchor;
    let current;
    const if_block_creators = [create_if_block_23, create_if_block_53];
    const if_blocks = [];
    function select_block_type_1(ctx2, dirty) {
      if (
        /*internalValue*/
        ctx2[3]
      )
        return 0;
      if (
        /*astElements*/
        ctx2[4]
      )
        return 1;
      return -1;
    }
    if (~(current_block_type_index = select_block_type_1(ctx, -1))) {
      if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    }
    const block = {
      c: function create3() {
        if (if_block)
          if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        if (if_block)
          if_block.l(nodes);
        if_block_anchor = empty();
      },
      m: function mount(target, anchor) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].m(target, anchor);
        }
        insert_hydration_dev(target, if_block_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type_1(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if (~current_block_type_index) {
            if_blocks[current_block_type_index].p(ctx2, dirty);
          }
        } else {
          if (if_block) {
            group_outros();
            transition_out(if_blocks[previous_block_index], 1, 1, () => {
              if_blocks[previous_block_index] = null;
            });
            check_outros();
          }
          if (~current_block_type_index) {
            if_block = if_blocks[current_block_type_index];
            if (!if_block) {
              if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
              if_block.c();
            } else {
              if_block.p(ctx2, dirty);
            }
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          } else {
            if_block = null;
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(if_block_anchor);
        }
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].d(detaching);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: fallback_block_1.name,
      type: "fallback",
      source: "(100:23)        ",
      ctx
    });
    return block;
  }
  function fallback_block(ctx) {
    let input;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        input = element("input");
        this.h();
      },
      l: function claim(nodes) {
        input = claim_element(nodes, "INPUT", {
          type: true,
          class: true,
          placeholder: true
        });
        this.h();
      },
      h: function hydrate() {
        attr_dev(input, "type", "text");
        attr_dev(input, "class", "w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm");
        attr_dev(
          input,
          "placeholder",
          /*placeholder*/
          ctx[1]
        );
        input.value = /*internalValue*/
        ctx[3];
        add_location(input, file10, 91, 6, 2973);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, input, anchor);
        if (!mounted) {
          dispose = [
            listen_dev(
              input,
              "keydown",
              /*handleKeydown*/
              ctx[7],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              input,
              "change",
              /*handleTextChange*/
              ctx[8],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty & /*placeholder*/
        2) {
          attr_dev(
            input,
            "placeholder",
            /*placeholder*/
            ctx2[1]
          );
        }
        if (dirty & /*internalValue*/
        8 && input.value !== /*internalValue*/
        ctx2[3]) {
          prop_dev(
            input,
            "value",
            /*internalValue*/
            ctx2[3]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(input);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: fallback_block.name,
      type: "fallback",
      source: "(88:23)        ",
      ctx
    });
    return block;
  }
  function create_fragment10(ctx) {
    let section;
    let header;
    let button;
    let span0;
    let t0;
    let span1;
    let svg;
    let path;
    let span1_class_value;
    let t1;
    let current_block_type_index;
    let if_block;
    let current;
    let mounted;
    let dispose;
    const heading_slot_template = (
      /*#slots*/
      ctx[16].heading
    );
    const heading_slot = create_slot(
      heading_slot_template,
      ctx,
      /*$$scope*/
      ctx[15],
      get_heading_slot_context
    );
    const if_block_creators = [create_if_block6, create_if_block_14];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*$$slots*/
        ctx2[11]["value"]
      )
        return 0;
      if (
        /*expanded*/
        ctx2[0]
      )
        return 1;
      return -1;
    }
    if (~(current_block_type_index = select_block_type(ctx, -1))) {
      if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    }
    const block = {
      c: function create3() {
        section = element("section");
        header = element("header");
        button = element("button");
        span0 = element("span");
        if (heading_slot)
          heading_slot.c();
        t0 = space();
        span1 = element("span");
        svg = svg_element("svg");
        path = svg_element("path");
        t1 = space();
        if (if_block)
          if_block.c();
        this.h();
      },
      l: function claim(nodes) {
        section = claim_element(nodes, "SECTION", { class: true });
        var section_nodes = children(section);
        header = claim_element(section_nodes, "HEADER", { class: true });
        var header_nodes = children(header);
        button = claim_element(header_nodes, "BUTTON", {
          type: true,
          class: true,
          "aria-expanded": true
        });
        var button_nodes = children(button);
        span0 = claim_element(button_nodes, "SPAN", {});
        var span0_nodes = children(span0);
        if (heading_slot)
          heading_slot.l(span0_nodes);
        span0_nodes.forEach(detach_dev);
        t0 = claim_space(button_nodes);
        span1 = claim_element(button_nodes, "SPAN", { class: true });
        var span1_nodes = children(span1);
        svg = claim_svg_element(span1_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg_nodes = children(svg);
        path = claim_svg_element(svg_nodes, "path", {
          "fill-rule": true,
          d: true,
          "clip-rule": true
        });
        children(path).forEach(detach_dev);
        svg_nodes.forEach(detach_dev);
        span1_nodes.forEach(detach_dev);
        button_nodes.forEach(detach_dev);
        header_nodes.forEach(detach_dev);
        t1 = claim_space(section_nodes);
        if (if_block)
          if_block.l(section_nodes);
        section_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        add_location(span0, file10, 71, 6, 2261);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file10, 79, 10, 2629);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current");
        add_location(svg, file10, 73, 8, 2389);
        attr_dev(span1, "class", span1_class_value = /*expanded*/
        ctx[0] ? "" : " [&_path]:origin-center [&_path]:rotate-180");
        add_location(span1, file10, 72, 6, 2304);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "w-full flex items-center justify-between gap-x-1 p-1 font-semibold hover:text-blue-700 active:text-blue-900 group");
        attr_dev(
          button,
          "aria-expanded",
          /*expanded*/
          ctx[0]
        );
        add_location(button, file10, 65, 4, 2016);
        attr_dev(header, "class", "flex items-center text-sm mb-2 font-medium");
        add_location(header, file10, 64, 2, 1952);
        attr_dev(section, "class", "p-4 border-b border-b-gray-100 border-solid");
        add_location(section, file10, 63, 0, 1888);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, section, anchor);
        append_hydration_dev(section, header);
        append_hydration_dev(header, button);
        append_hydration_dev(button, span0);
        if (heading_slot) {
          heading_slot.m(span0, null);
        }
        append_hydration_dev(button, t0);
        append_hydration_dev(button, span1);
        append_hydration_dev(span1, svg);
        append_hydration_dev(svg, path);
        append_hydration_dev(section, t1);
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].m(section, null);
        }
        current = true;
        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/
            ctx[17],
            false,
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update2(ctx2, [dirty]) {
        if (heading_slot) {
          if (heading_slot.p && (!current || dirty & /*$$scope*/
          32768)) {
            update_slot_base(
              heading_slot,
              heading_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[15],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[15]
              ) : get_slot_changes(
                heading_slot_template,
                /*$$scope*/
                ctx2[15],
                dirty,
                get_heading_slot_changes
              ),
              get_heading_slot_context
            );
          }
        }
        if (!current || dirty & /*expanded*/
        1 && span1_class_value !== (span1_class_value = /*expanded*/
        ctx2[0] ? "" : " [&_path]:origin-center [&_path]:rotate-180")) {
          attr_dev(span1, "class", span1_class_value);
        }
        if (!current || dirty & /*expanded*/
        1) {
          attr_dev(
            button,
            "aria-expanded",
            /*expanded*/
            ctx2[0]
          );
        }
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if (~current_block_type_index) {
            if_blocks[current_block_type_index].p(ctx2, dirty);
          }
        } else {
          if (if_block) {
            group_outros();
            transition_out(if_blocks[previous_block_index], 1, 1, () => {
              if_blocks[previous_block_index] = null;
            });
            check_outros();
          }
          if (~current_block_type_index) {
            if_block = if_blocks[current_block_type_index];
            if (!if_block) {
              if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
              if_block.c();
            } else {
              if_block.p(ctx2, dirty);
            }
            transition_in(if_block, 1);
            if_block.m(section, null);
          } else {
            if_block = null;
          }
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(heading_slot, local);
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(heading_slot, local);
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(section);
        }
        if (heading_slot)
          heading_slot.d(detaching);
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].d();
        }
        mounted = false;
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment10.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance10($$self, $$props, $$invalidate) {
    let astElements;
    let $selectedAstElementId;
    let $highlightedAstElement;
    validate_store(selectedAstElementId, "selectedAstElementId");
    component_subscribe($$self, selectedAstElementId, ($$value) => $$invalidate(23, $selectedAstElementId = $$value));
    validate_store(highlightedAstElement, "highlightedAstElement");
    component_subscribe($$self, highlightedAstElement, ($$value) => $$invalidate(24, $highlightedAstElement = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SidebarSection", slots, ["heading", "input", "value"]);
    const $$slots = compute_slots(slots);
    const dispatch2 = createEventDispatcher();
    let { value = "" } = $$props;
    let { astNodes = null } = $$props;
    let { clearOnUpdate = false } = $$props;
    let { expanded = true } = $$props;
    let { placeholder = "" } = $$props;
    let { large = false } = $$props;
    function highlightAstElement(astElement) {
      set_store_value(highlightedAstElement, $highlightedAstElement = astElement, $highlightedAstElement);
    }
    function unhighlightAstElement() {
      set_store_value(highlightedAstElement, $highlightedAstElement = void 0, $highlightedAstElement);
    }
    let internalValue = astElements ? null : value;
    function handleKeydown(e) {
      if (!(e.target instanceof HTMLInputElement))
        return;
      let text2 = e.target.value;
      if (e.key === "Enter" && text2 && text2.length > 0 && text2 !== value) {
        dispatch2("update", text2);
        if (clearOnUpdate) {
          $$invalidate(3, internalValue = null);
          e.target.value = "";
        }
      }
    }
    function handleTextChange(e) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        dispatch2("textChange", e.target.value);
      }
    }
    function select(astElement) {
      let id = findAstElementId(astElement);
      set_store_value(selectedAstElementId, $selectedAstElementId = id, $selectedAstElementId);
    }
    function moveAstElement(movement, astElement) {
      if (!astNodes)
        return;
      let astNodesCopy = Array.from(astNodes);
      let index3 = astNodesCopy.indexOf(astElement);
      astNodesCopy.splice(index3, 1);
      astNodesCopy.splice(index3 + movement, 0, astElement);
      dispatch2("nodesChange", astNodesCopy);
    }
    const writable_props = ["value", "astNodes", "clearOnUpdate", "expanded", "placeholder", "large"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<SidebarSection> was created with unknown prop '${key}'`);
    });
    const click_handler = () => $$invalidate(0, expanded = !expanded);
    const click_handler_1 = (astElement) => select(astElement);
    const click_handler_2 = (astElement) => moveAstElement(-1, astElement);
    const click_handler_3 = (astElement) => moveAstElement(1, astElement);
    const mouseenter_handler = (astElement) => highlightAstElement(astElement);
    const mouseleave_handler = () => unhighlightAstElement();
    $$self.$$set = ($$props2) => {
      if ("value" in $$props2)
        $$invalidate(12, value = $$props2.value);
      if ("astNodes" in $$props2)
        $$invalidate(13, astNodes = $$props2.astNodes);
      if ("clearOnUpdate" in $$props2)
        $$invalidate(14, clearOnUpdate = $$props2.clearOnUpdate);
      if ("expanded" in $$props2)
        $$invalidate(0, expanded = $$props2.expanded);
      if ("placeholder" in $$props2)
        $$invalidate(1, placeholder = $$props2.placeholder);
      if ("large" in $$props2)
        $$invalidate(2, large = $$props2.large);
      if ("$$scope" in $$props2)
        $$invalidate(15, $$scope = $$props2.$$scope);
    };
    $$self.$capture_state = () => ({
      createEventDispatcher,
      highlightedAstElement,
      findAstElementId,
      selectedAstElementId,
      isAstElement,
      dispatch: dispatch2,
      value,
      astNodes,
      clearOnUpdate,
      expanded,
      placeholder,
      large,
      highlightAstElement,
      unhighlightAstElement,
      internalValue,
      handleKeydown,
      handleTextChange,
      select,
      moveAstElement,
      astElements,
      $selectedAstElementId,
      $highlightedAstElement
    });
    $$self.$inject_state = ($$props2) => {
      if ("value" in $$props2)
        $$invalidate(12, value = $$props2.value);
      if ("astNodes" in $$props2)
        $$invalidate(13, astNodes = $$props2.astNodes);
      if ("clearOnUpdate" in $$props2)
        $$invalidate(14, clearOnUpdate = $$props2.clearOnUpdate);
      if ("expanded" in $$props2)
        $$invalidate(0, expanded = $$props2.expanded);
      if ("placeholder" in $$props2)
        $$invalidate(1, placeholder = $$props2.placeholder);
      if ("large" in $$props2)
        $$invalidate(2, large = $$props2.large);
      if ("internalValue" in $$props2)
        $$invalidate(3, internalValue = $$props2.internalValue);
      if ("astElements" in $$props2)
        $$invalidate(4, astElements = $$props2.astElements);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*astNodes*/
      8192) {
        $:
          $$invalidate(4, astElements = (astNodes || []).filter(isAstElement));
      }
      if ($$self.$$.dirty & /*astNodes*/
      8192) {
        $: {
          if ((astNodes === null || astNodes === void 0 ? void 0 : astNodes.length) === 1) {
            let first = astNodes[0];
            if (!isAstElement(first)) {
              $$invalidate(3, internalValue = first);
            }
          } else if (astNodes) {
            $$invalidate(3, internalValue = null);
          }
        }
      }
    };
    return [
      expanded,
      placeholder,
      large,
      internalValue,
      astElements,
      highlightAstElement,
      unhighlightAstElement,
      handleKeydown,
      handleTextChange,
      select,
      moveAstElement,
      $$slots,
      value,
      astNodes,
      clearOnUpdate,
      $$scope,
      slots,
      click_handler,
      click_handler_1,
      click_handler_2,
      click_handler_3,
      mouseenter_handler,
      mouseleave_handler
    ];
  }
  var SidebarSection = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance10, create_fragment10, safe_not_equal, {
        value: 12,
        astNodes: 13,
        clearOnUpdate: 14,
        expanded: 0,
        placeholder: 1,
        large: 2
      });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SidebarSection",
        options,
        id: create_fragment10.name
      });
    }
    get value() {
      return this.$$.ctx[12];
    }
    set value(value) {
      this.$$set({ value });
      flush();
    }
    get astNodes() {
      return this.$$.ctx[13];
    }
    set astNodes(astNodes) {
      this.$$set({ astNodes });
      flush();
    }
    get clearOnUpdate() {
      return this.$$.ctx[14];
    }
    set clearOnUpdate(clearOnUpdate) {
      this.$$set({ clearOnUpdate });
      flush();
    }
    get expanded() {
      return this.$$.ctx[0];
    }
    set expanded(expanded) {
      this.$$set({ expanded });
      flush();
    }
    get placeholder() {
      return this.$$.ctx[1];
    }
    set placeholder(placeholder) {
      this.$$set({ placeholder });
      flush();
    }
    get large() {
      return this.$$.ctx[2];
    }
    set large(large) {
      this.$$set({ large });
      flush();
    }
  };
  create_custom_element(SidebarSection, { "value": {}, "astNodes": {}, "clearOnUpdate": { "type": "Boolean" }, "expanded": { "type": "Boolean" }, "placeholder": {}, "large": { "type": "Boolean" } }, ["heading", "input", "value"], [], true);
  var SidebarSection_default = SidebarSection;

  // svelte/components/PropertiesSidebar.svelte
  var { Object: Object_1 } = globals;
  var file11 = "svelte/components/PropertiesSidebar.svelte";
  function get_each_context6(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[30] = list[i];
    const constants_0 = (
      /*entry*/
      child_ctx[30]
    );
    child_ctx[31] = constants_0[0];
    child_ctx[32] = constants_0[1];
    return child_ctx;
  }
  function get_each_context_13(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[35] = list[i];
    return child_ctx;
  }
  function create_else_block4(ctx) {
    let div;
    let textContent = "Select a component to edit its properties";
    const block = {
      c: function create3() {
        div = element("div");
        div.textContent = textContent;
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(div) !== "svelte-y8jlza")
          div.textContent = textContent;
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "p-4 pt-8 font-medium text-lg text-center");
        add_location(div, file11, 240, 6, 10848);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
      },
      p: noop2,
      i: noop2,
      o: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_else_block4.name,
      type: "else",
      source: "(253:4) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block7(ctx) {
    let div0;
    let t0;
    let t1;
    let t2;
    let button;
    let span;
    let textContent = "Close";
    let t4;
    let svg;
    let path;
    let t5;
    let t6;
    let t7;
    let div1;
    let t8;
    let t9;
    let sidebarsection;
    let current;
    let mounted;
    let dispose;
    let if_block0 = !/*isRootNode*/
    ctx[5] && create_if_block_54(ctx);
    let if_block1 = (
      /*attributesEditable*/
      ctx[4] && create_if_block_44(ctx)
    );
    let if_block2 = (
      /*$selectedAstElement*/
      ctx[0].tag === "eex_block" && create_if_block_34(ctx)
    );
    let if_block3 = (
      /*$draggedObject*/
      ctx[8] && /*$draggedObject*/
      ctx[8].category === "basic" && create_if_block_24(ctx)
    );
    let if_block4 = (
      /*$selectedAstElement*/
      ctx[0].content?.length > 0 && create_if_block_15(ctx)
    );
    sidebarsection = new SidebarSection_default({
      props: {
        expanded: false,
        $$slots: {
          input: [create_input_slot],
          heading: [create_heading_slot]
        },
        $$scope: { ctx }
      },
      $$inline: true
    });
    const block = {
      c: function create3() {
        div0 = element("div");
        t0 = text(
          /*sidebarTitle*/
          ctx[6]
        );
        t1 = space();
        if (if_block0)
          if_block0.c();
        t2 = space();
        button = element("button");
        span = element("span");
        span.textContent = textContent;
        t4 = space();
        svg = svg_element("svg");
        path = svg_element("path");
        t5 = space();
        if (if_block1)
          if_block1.c();
        t6 = space();
        if (if_block2)
          if_block2.c();
        t7 = space();
        div1 = element("div");
        if (if_block3)
          if_block3.c();
        t8 = space();
        if (if_block4)
          if_block4.c();
        t9 = space();
        create_component(sidebarsection.$$.fragment);
        this.h();
      },
      l: function claim(nodes) {
        div0 = claim_element(nodes, "DIV", { class: true });
        var div0_nodes = children(div0);
        t0 = claim_text(
          div0_nodes,
          /*sidebarTitle*/
          ctx[6]
        );
        t1 = claim_space(div0_nodes);
        if (if_block0)
          if_block0.l(div0_nodes);
        t2 = claim_space(div0_nodes);
        button = claim_element(div0_nodes, "BUTTON", { type: true, class: true });
        var button_nodes = children(button);
        span = claim_element(button_nodes, "SPAN", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(span) !== "svelte-1pewzs3")
          span.textContent = textContent;
        t4 = claim_space(button_nodes);
        svg = claim_svg_element(button_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg_nodes = children(svg);
        path = claim_svg_element(svg_nodes, "path", {
          "fill-rule": true,
          d: true,
          "clip-rule": true
        });
        children(path).forEach(detach_dev);
        svg_nodes.forEach(detach_dev);
        button_nodes.forEach(detach_dev);
        div0_nodes.forEach(detach_dev);
        t5 = claim_space(nodes);
        if (if_block1)
          if_block1.l(nodes);
        t6 = claim_space(nodes);
        if (if_block2)
          if_block2.l(nodes);
        t7 = claim_space(nodes);
        div1 = claim_element(nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        if (if_block3)
          if_block3.l(div1_nodes);
        t8 = claim_space(div1_nodes);
        if (if_block4)
          if_block4.l(div1_nodes);
        div1_nodes.forEach(detach_dev);
        t9 = claim_space(nodes);
        claim_component(sidebarsection.$$.fragment, nodes);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span, "class", "sr-only");
        add_location(span, file11, 151, 10, 7147);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file11, 158, 12, 7401);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-6 h-6 hover:text-blue-700 active:text-blue-900");
        add_location(svg, file11, 152, 10, 7192);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "absolute p-2 top-2 right-1");
        add_location(button, file11, 150, 8, 7026);
        attr_dev(div0, "class", "border-b text-lg font-medium leading-5 p-4 relative");
        add_location(div0, file11, 127, 6, 5897);
        attr_dev(div1, "class", "relative");
        add_location(div1, file11, 200, 6, 9311);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div0, anchor);
        append_hydration_dev(div0, t0);
        append_hydration_dev(div0, t1);
        if (if_block0)
          if_block0.m(div0, null);
        append_hydration_dev(div0, t2);
        append_hydration_dev(div0, button);
        append_hydration_dev(button, span);
        append_hydration_dev(button, t4);
        append_hydration_dev(button, svg);
        append_hydration_dev(svg, path);
        insert_hydration_dev(target, t5, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert_hydration_dev(target, t6, anchor);
        if (if_block2)
          if_block2.m(target, anchor);
        insert_hydration_dev(target, t7, anchor);
        insert_hydration_dev(target, div1, anchor);
        if (if_block3)
          if_block3.m(div1, null);
        append_hydration_dev(div1, t8);
        if (if_block4)
          if_block4.m(div1, null);
        insert_hydration_dev(target, t9, anchor);
        mount_component(sidebarsection, target, anchor);
        current = true;
        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/
            ctx[21],
            false,
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (!current || dirty[0] & /*sidebarTitle*/
        64)
          set_data_dev(
            t0,
            /*sidebarTitle*/
            ctx2[6]
          );
        if (!/*isRootNode*/
        ctx2[5]) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_54(ctx2);
            if_block0.c();
            if_block0.m(div0, t2);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*attributesEditable*/
          ctx2[4]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty[0] & /*attributesEditable*/
            16) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_44(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(t6.parentNode, t6);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        if (
          /*$selectedAstElement*/
          ctx2[0].tag === "eex_block"
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
            if (dirty[0] & /*$selectedAstElement*/
            1) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block_34(ctx2);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(t7.parentNode, t7);
          }
        } else if (if_block2) {
          group_outros();
          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });
          check_outros();
        }
        if (
          /*$draggedObject*/
          ctx2[8] && /*$draggedObject*/
          ctx2[8].category === "basic"
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
          } else {
            if_block3 = create_if_block_24(ctx2);
            if_block3.c();
            if_block3.m(div1, t8);
          }
        } else if (if_block3) {
          if_block3.d(1);
          if_block3 = null;
        }
        if (
          /*$selectedAstElement*/
          ctx2[0].content?.length > 0
        ) {
          if (if_block4) {
            if_block4.p(ctx2, dirty);
            if (dirty[0] & /*$selectedAstElement*/
            1) {
              transition_in(if_block4, 1);
            }
          } else {
            if_block4 = create_if_block_15(ctx2);
            if_block4.c();
            transition_in(if_block4, 1);
            if_block4.m(div1, null);
          }
        } else if (if_block4) {
          group_outros();
          transition_out(if_block4, 1, 1, () => {
            if_block4 = null;
          });
          check_outros();
        }
        const sidebarsection_changes = {};
        if (dirty[0] & /*sidebarTitle*/
        64 | dirty[1] & /*$$scope*/
        128) {
          sidebarsection_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection.$set(sidebarsection_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block1);
        transition_in(if_block2);
        transition_in(if_block4);
        transition_in(sidebarsection.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block1);
        transition_out(if_block2);
        transition_out(if_block4);
        transition_out(sidebarsection.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div0);
          detach_dev(t5);
          detach_dev(t6);
          detach_dev(t7);
          detach_dev(div1);
          detach_dev(t9);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d(detaching);
        if (if_block2)
          if_block2.d(detaching);
        if (if_block3)
          if_block3.d();
        if (if_block4)
          if_block4.d();
        destroy_component(sidebarsection, detaching);
        mounted = false;
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block7.name,
      type: "if",
      source: "(140:4) {#if $selectedAstElement}",
      ctx
    });
    return block;
  }
  function create_if_block_54(ctx) {
    let button;
    let span0;
    let textContent = "Up one level";
    let t1;
    let span1;
    let textContent_1 = "Up one level";
    let t3;
    let svg;
    let path;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        button = element("button");
        span0 = element("span");
        span0.textContent = textContent;
        t1 = space();
        span1 = element("span");
        span1.textContent = textContent_1;
        t3 = space();
        svg = svg_element("svg");
        path = svg_element("path");
        this.h();
      },
      l: function claim(nodes) {
        button = claim_element(nodes, "BUTTON", { type: true, class: true });
        var button_nodes = children(button);
        span0 = claim_element(button_nodes, "SPAN", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(span0) !== "svelte-e67xyw")
          span0.textContent = textContent;
        t1 = claim_space(button_nodes);
        span1 = claim_element(button_nodes, "SPAN", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(span1) !== "svelte-uuliww")
          span1.textContent = textContent_1;
        t3 = claim_space(button_nodes);
        svg = claim_svg_element(button_nodes, "svg", {
          xmlns: true,
          viewBox: true,
          fill: true,
          class: true
        });
        var svg_nodes = children(svg);
        path = claim_svg_element(svg_nodes, "path", {
          "fill-rule": true,
          d: true,
          "clip-rule": true
        });
        children(path).forEach(detach_dev);
        svg_nodes.forEach(detach_dev);
        button_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span0, "class", "sr-only");
        add_location(span0, file11, 131, 12, 6126);
        attr_dev(span1, "class", "absolute opacity-0 invisible right-9 min-w-[100px] bg-amber-100 py-1 px-1.5 rounded text-xs text-medium transition group-hover:opacity-100 group-hover:visible");
        add_location(span1, file11, 132, 12, 6180);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file11, 142, 14, 6648);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-6 h-6 hover:text-blue-700 active:text-blue-900");
        add_location(svg, file11, 136, 12, 6427);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "absolute p-2 top-2 right-9 group");
        add_location(button, file11, 130, 10, 6022);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, button, anchor);
        append_hydration_dev(button, span0);
        append_hydration_dev(button, t1);
        append_hydration_dev(button, span1);
        append_hydration_dev(button, t3);
        append_hydration_dev(button, svg);
        append_hydration_dev(svg, path);
        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*selectParentNode*/
            ctx[10],
            false,
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(button);
        }
        mounted = false;
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_54.name,
      type: "if",
      source: "(143:8) {#if !isRootNode}",
      ctx
    });
    return block;
  }
  function create_if_block_44(ctx) {
    let sidebarsection;
    let t;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let each_1_anchor;
    let current;
    sidebarsection = new SidebarSection_default({
      props: {
        clearOnUpdate: true,
        placeholder: "Add new class",
        $$slots: {
          value: [create_value_slot],
          heading: [create_heading_slot_5]
        },
        $$scope: { ctx }
      },
      $$inline: true
    });
    sidebarsection.$on(
      "update",
      /*addClasses*/
      ctx[9]
    );
    let each_value = ensure_array_like_dev(
      /*editableAttrs*/
      ctx[7]
    );
    const get_key = (ctx2) => (
      /*entry*/
      ctx2[30]
    );
    validate_each_keys(ctx, each_value, get_each_context6, get_key);
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context6(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(key, each_blocks[i] = create_each_block6(key, child_ctx));
    }
    const block = {
      c: function create3() {
        create_component(sidebarsection.$$.fragment);
        t = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      l: function claim(nodes) {
        claim_component(sidebarsection.$$.fragment, nodes);
        t = claim_space(nodes);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        mount_component(sidebarsection, target, anchor);
        insert_hydration_dev(target, t, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const sidebarsection_changes = {};
        if (dirty[0] & /*classList*/
        4 | dirty[1] & /*$$scope*/
        128) {
          sidebarsection_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection.$set(sidebarsection_changes);
        if (dirty[0] & /*editableAttrs, updateAttribute*/
        16512) {
          each_value = ensure_array_like_dev(
            /*editableAttrs*/
            ctx2[7]
          );
          group_outros();
          validate_each_keys(ctx2, each_value, get_each_context6, get_key);
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block6, each_1_anchor, get_each_context6);
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(sidebarsection.$$.fragment, local);
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o: function outro(local) {
        transition_out(sidebarsection.$$.fragment, local);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
          detach_dev(each_1_anchor);
        }
        destroy_component(sidebarsection, detaching);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d(detaching);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_44.name,
      type: "if",
      source: "(180:6) {#if attributesEditable}",
      ctx
    });
    return block;
  }
  function create_heading_slot_5(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text("Classes");
      },
      l: function claim(nodes) {
        t = claim_text(nodes, "Classes");
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_heading_slot_5.name,
      type: "slot",
      source: '(182:10) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_default_slot3(ctx) {
    let t_value = (
      /*className*/
      ctx[35] + ""
    );
    let t;
    const block = {
      c: function create3() {
        t = text(t_value);
      },
      l: function claim(nodes) {
        t = claim_text(nodes, t_value);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty[0] & /*classList*/
        4 && t_value !== (t_value = /*className*/
        ctx2[35] + ""))
          set_data_dev(t, t_value);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot3.name,
      type: "slot",
      source: "(185:14) <Pill on:delete={() => deleteClass(className)}>",
      ctx
    });
    return block;
  }
  function create_each_block_13(ctx) {
    let pill;
    let current;
    function delete_handler() {
      return (
        /*delete_handler*/
        ctx[22](
          /*className*/
          ctx[35]
        )
      );
    }
    pill = new Pill_default({
      props: {
        $$slots: { default: [create_default_slot3] },
        $$scope: { ctx }
      },
      $$inline: true
    });
    pill.$on("delete", delete_handler);
    const block = {
      c: function create3() {
        create_component(pill.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(pill.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(pill, target, anchor);
        current = true;
      },
      p: function update2(new_ctx, dirty) {
        ctx = new_ctx;
        const pill_changes = {};
        if (dirty[0] & /*classList*/
        4 | dirty[1] & /*$$scope*/
        128) {
          pill_changes.$$scope = { dirty, ctx };
        }
        pill.$set(pill_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(pill.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(pill.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(pill, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block_13.name,
      type: "each",
      source: "(184:12) {#each classList as className}",
      ctx
    });
    return block;
  }
  function create_value_slot(ctx) {
    let each_1_anchor;
    let current;
    let each_value_1 = ensure_array_like_dev(
      /*classList*/
      ctx[2]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks[i] = create_each_block_13(get_each_context_13(ctx, each_value_1, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    const block = {
      c: function create3() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
      },
      l: function claim(nodes) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        if (dirty[0] & /*deleteClass, classList*/
        2052) {
          each_value_1 = ensure_array_like_dev(
            /*classList*/
            ctx2[2]
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_13(ctx2, each_value_1, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block_13(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }
          group_outros();
          for (i = each_value_1.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i: function intro(local) {
        if (current)
          return;
        for (let i = 0; i < each_value_1.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(each_1_anchor);
        }
        destroy_each(each_blocks, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_value_slot.name,
      type: "slot",
      source: '(183:10) <svelte:fragment slot=\\"value\\">',
      ctx
    });
    return block;
  }
  function create_heading_slot_4(ctx) {
    let t_value = (
      /*name*/
      ctx[31] + ""
    );
    let t;
    const block = {
      c: function create3() {
        t = text(t_value);
      },
      l: function claim(nodes) {
        t = claim_text(nodes, t_value);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      p: function update2(ctx2, dirty) {
        if (dirty[0] & /*editableAttrs*/
        128 && t_value !== (t_value = /*name*/
        ctx2[31] + ""))
          set_data_dev(t, t_value);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_heading_slot_4.name,
      type: "slot",
      source: '(197:12) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_each_block6(key_1, ctx) {
    let first;
    let sidebarsection;
    let current;
    function textChange_handler(...args) {
      return (
        /*textChange_handler*/
        ctx[23](
          /*name*/
          ctx[31],
          ...args
        )
      );
    }
    sidebarsection = new SidebarSection_default({
      props: {
        clearOnUpdate: true,
        value: (
          /*value*/
          ctx[32]
        ),
        placeholder: "Set " + /*name*/
        ctx[31],
        $$slots: { heading: [create_heading_slot_4] },
        $$scope: { ctx }
      },
      $$inline: true
    });
    sidebarsection.$on("textChange", textChange_handler);
    const block = {
      key: key_1,
      first: null,
      c: function create3() {
        first = empty();
        create_component(sidebarsection.$$.fragment);
        this.h();
      },
      l: function claim(nodes) {
        first = empty();
        claim_component(sidebarsection.$$.fragment, nodes);
        this.h();
      },
      h: function hydrate() {
        this.first = first;
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, first, anchor);
        mount_component(sidebarsection, target, anchor);
        current = true;
      },
      p: function update2(new_ctx, dirty) {
        ctx = new_ctx;
        const sidebarsection_changes = {};
        if (dirty[0] & /*editableAttrs*/
        128)
          sidebarsection_changes.value = /*value*/
          ctx[32];
        if (dirty[0] & /*editableAttrs*/
        128)
          sidebarsection_changes.placeholder = "Set " + /*name*/
          ctx[31];
        if (dirty[0] & /*editableAttrs*/
        128 | dirty[1] & /*$$scope*/
        128) {
          sidebarsection_changes.$$scope = { dirty, ctx };
        }
        sidebarsection.$set(sidebarsection_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(sidebarsection.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(sidebarsection.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(first);
        }
        destroy_component(sidebarsection, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block6.name,
      type: "each",
      source: "(189:8) {#each editableAttrs as entry (entry)}",
      ctx
    });
    return block;
  }
  function create_if_block_34(ctx) {
    let sidebarsection0;
    let t;
    let sidebarsection1;
    let current;
    sidebarsection0 = new SidebarSection_default({
      props: {
        value: (
          /*$selectedAstElement*/
          ctx[0].arg
        ),
        large: true,
        $$slots: { heading: [create_heading_slot_3] },
        $$scope: { ctx }
      },
      $$inline: true
    });
    sidebarsection0.$on(
      "update",
      /*updateArg*/
      ctx[13]
    );
    sidebarsection1 = new SidebarSection_default({
      props: {
        $$slots: {
          input: [create_input_slot_1],
          heading: [create_heading_slot_2]
        },
        $$scope: { ctx }
      },
      $$inline: true
    });
    const block = {
      c: function create3() {
        create_component(sidebarsection0.$$.fragment);
        t = space();
        create_component(sidebarsection1.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(sidebarsection0.$$.fragment, nodes);
        t = claim_space(nodes);
        claim_component(sidebarsection1.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(sidebarsection0, target, anchor);
        insert_hydration_dev(target, t, anchor);
        mount_component(sidebarsection1, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const sidebarsection0_changes = {};
        if (dirty[0] & /*$selectedAstElement*/
        1)
          sidebarsection0_changes.value = /*$selectedAstElement*/
          ctx2[0].arg;
        if (dirty[1] & /*$$scope*/
        128) {
          sidebarsection0_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection0.$set(sidebarsection0_changes);
        const sidebarsection1_changes = {};
        if (dirty[1] & /*$$scope*/
        128) {
          sidebarsection1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection1.$set(sidebarsection1_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(sidebarsection0.$$.fragment, local);
        transition_in(sidebarsection1.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(sidebarsection0.$$.fragment, local);
        transition_out(sidebarsection1.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
        destroy_component(sidebarsection0, detaching);
        destroy_component(sidebarsection1, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_34.name,
      type: "if",
      source: '(201:6) {#if $selectedAstElement.tag === \\"eex_block\\"}',
      ctx
    });
    return block;
  }
  function create_heading_slot_3(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text("Block argument");
      },
      l: function claim(nodes) {
        t = claim_text(nodes, "Block argument");
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_heading_slot_3.name,
      type: "slot",
      source: '(203:10) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_heading_slot_2(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text("Block content");
      },
      l: function claim(nodes) {
        t = claim_text(nodes, "Block content");
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_heading_slot_2.name,
      type: "slot",
      source: '(207:10) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_input_slot_1(ctx) {
    let p;
    let textContent = "The content of eex blocks can't be edited from the visual editor yet. Please use the code editor.";
    const block = {
      c: function create3() {
        p = element("p");
        p.textContent = textContent;
        this.h();
      },
      l: function claim(nodes) {
        p = claim_element(nodes, "P", { ["data-svelte-h"]: true });
        if (get_svelte_dataset(p) !== "svelte-lwo9ri")
          p.textContent = textContent;
        this.h();
      },
      h: function hydrate() {
        add_location(p, file11, 195, 12, 9132);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, p, anchor);
      },
      p: noop2,
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(p);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_input_slot_1.name,
      type: "slot",
      source: '(208:10) <svelte:fragment slot=\\"input\\">',
      ctx
    });
    return block;
  }
  function create_if_block_24(ctx) {
    let div1;
    let div0;
    let textContent = "Drop components here";
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        div1 = element("div");
        div0 = element("div");
        div0.textContent = textContent;
        this.h();
      },
      l: function claim(nodes) {
        div1 = claim_element(nodes, "DIV", { class: true, role: true });
        var div1_nodes = children(div1);
        div0 = claim_element(div1_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(div0) !== "svelte-1mbq8po")
          div0.textContent = textContent;
        div1_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div0, "class", "flex rounded-lg outline-dashed outline-2 h-full text-center justify-center items-center");
        add_location(div0, file11, 210, 12, 9719);
        attr_dev(div1, "class", "absolute bg-white opacity-70 w-full h-full p-4");
        attr_dev(div1, "role", "list");
        toggle_class(
          div1,
          "opacity-90",
          /*isDraggingOver*/
          ctx[3]
        );
        add_location(div1, file11, 202, 10, 9412);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div1, anchor);
        append_hydration_dev(div1, div0);
        if (!mounted) {
          dispose = [
            listen_dev(div1, "drop", prevent_default(
              /*dropInside*/
              ctx[16]
            ), false, true, false, false),
            listen_dev(
              div1,
              "dragover",
              /*dragOver*/
              ctx[17],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              div1,
              "dragleave",
              /*dragleave_handler*/
              ctx[24],
              false,
              false,
              false,
              false
            )
          ];
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty[0] & /*isDraggingOver*/
        8) {
          toggle_class(
            div1,
            "opacity-90",
            /*isDraggingOver*/
            ctx2[3]
          );
        }
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div1);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_24.name,
      type: "if",
      source: '(215:8) {#if $draggedObject && $draggedObject.category === \\"basic\\"}',
      ctx
    });
    return block;
  }
  function create_if_block_15(ctx) {
    let sidebarsection;
    let current;
    sidebarsection = new SidebarSection_default({
      props: {
        astNodes: (
          /*$selectedAstElement*/
          ctx[0].content
        ),
        large: (
          /*$selectedAstElement*/
          ctx[0].tag === "eex"
        ),
        $$slots: { heading: [create_heading_slot_1] },
        $$scope: { ctx }
      },
      $$inline: true
    });
    sidebarsection.$on(
      "textChange",
      /*textChange_handler_1*/
      ctx[25]
    );
    sidebarsection.$on(
      "nodesChange",
      /*changeNodes*/
      ctx[18]
    );
    const block = {
      c: function create3() {
        create_component(sidebarsection.$$.fragment);
      },
      l: function claim(nodes) {
        claim_component(sidebarsection.$$.fragment, nodes);
      },
      m: function mount(target, anchor) {
        mount_component(sidebarsection, target, anchor);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        const sidebarsection_changes = {};
        if (dirty[0] & /*$selectedAstElement*/
        1)
          sidebarsection_changes.astNodes = /*$selectedAstElement*/
          ctx2[0].content;
        if (dirty[0] & /*$selectedAstElement*/
        1)
          sidebarsection_changes.large = /*$selectedAstElement*/
          ctx2[0].tag === "eex";
        if (dirty[1] & /*$$scope*/
        128) {
          sidebarsection_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection.$set(sidebarsection_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(sidebarsection.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(sidebarsection.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(sidebarsection, detaching);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_15.name,
      type: "if",
      source: "(229:8) {#if $selectedAstElement.content?.length > 0}",
      ctx
    });
    return block;
  }
  function create_heading_slot_1(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text("Content");
      },
      l: function claim(nodes) {
        t = claim_text(nodes, "Content");
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_heading_slot_1.name,
      type: "slot",
      source: '(236:12) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_heading_slot(ctx) {
    let t;
    const block = {
      c: function create3() {
        t = text("Delete");
      },
      l: function claim(nodes) {
        t = claim_text(nodes, "Delete");
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, t, anchor);
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t);
        }
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_heading_slot.name,
      type: "slot",
      source: '(242:8) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_input_slot(ctx) {
    let button;
    let t0;
    let span;
    let t1;
    let t2;
    let t3;
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        button = element("button");
        t0 = text("Delete ");
        span = element("span");
        t1 = text("current ");
        t2 = text(
          /*sidebarTitle*/
          ctx[6]
        );
        t3 = text(" element");
        this.h();
      },
      l: function claim(nodes) {
        button = claim_element(nodes, "BUTTON", { type: true, class: true });
        var button_nodes = children(button);
        t0 = claim_text(button_nodes, "Delete ");
        span = claim_element(button_nodes, "SPAN", { class: true });
        var span_nodes = children(span);
        t1 = claim_text(span_nodes, "current ");
        t2 = claim_text(
          span_nodes,
          /*sidebarTitle*/
          ctx[6]
        );
        t3 = claim_text(span_nodes, " element");
        span_nodes.forEach(detach_dev);
        button_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span, "class", "sr-only");
        add_location(span, file11, 235, 19, 10699);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded outline-2 w-full");
        add_location(button, file11, 230, 10, 10473);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, button, anchor);
        append_hydration_dev(button, t0);
        append_hydration_dev(button, span);
        append_hydration_dev(span, t1);
        append_hydration_dev(span, t2);
        append_hydration_dev(span, t3);
        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*deleteComponent*/
            ctx[15],
            false,
            false,
            false,
            false
          );
          mounted = true;
        }
      },
      p: function update2(ctx2, dirty) {
        if (dirty[0] & /*sidebarTitle*/
        64)
          set_data_dev(
            t2,
            /*sidebarTitle*/
            ctx2[6]
          );
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(button);
        }
        mounted = false;
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_input_slot.name,
      type: "slot",
      source: '(243:8) <svelte:fragment slot=\\"input\\">',
      ctx
    });
    return block;
  }
  function create_fragment11(ctx) {
    let div1;
    let div0;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block7, create_else_block4];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*$selectedAstElement*/
        ctx2[0]
      )
        return 0;
      return 1;
    }
    current_block_type_index = select_block_type(ctx, [-1, -1]);
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const block = {
      c: function create3() {
        div1 = element("div");
        div0 = element("div");
        if_block.c();
        this.h();
      },
      l: function claim(nodes) {
        div1 = claim_element(nodes, "DIV", { class: true, "data-test-id": true });
        var div1_nodes = children(div1);
        div0 = claim_element(div1_nodes, "DIV", { class: true });
        var div0_nodes = children(div0);
        if_block.l(div0_nodes);
        div0_nodes.forEach(detach_dev);
        div1_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div0, "class", "sticky top-0 overflow-y-auto h-screen");
        add_location(div0, file11, 125, 2, 5809);
        attr_dev(div1, "class", "w-64 bg-white");
        attr_dev(div1, "data-test-id", "right-sidebar");
        add_location(div1, file11, 124, 0, 5750);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div1, anchor);
        append_hydration_dev(div1, div0);
        if_blocks[current_block_type_index].m(div0, null);
        current = true;
      },
      p: function update2(ctx2, dirty) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2, dirty);
        if (current_block_type_index === previous_block_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        } else {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div0, null);
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div1);
        }
        if_blocks[current_block_type_index].d();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment11.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance11($$self, $$props, $$invalidate) {
    let editableAttrs;
    let sidebarTitle;
    let isRootNode;
    let attributesEditable;
    let $page;
    let $selectedAstElement;
    let $selectedAstElementId;
    let $draggedObject;
    validate_store(page, "page");
    component_subscribe($$self, page, ($$value) => $$invalidate(26, $page = $$value));
    validate_store(selectedAstElement, "selectedAstElement");
    component_subscribe($$self, selectedAstElement, ($$value) => $$invalidate(0, $selectedAstElement = $$value));
    validate_store(selectedAstElementId, "selectedAstElementId");
    component_subscribe($$self, selectedAstElementId, ($$value) => $$invalidate(1, $selectedAstElementId = $$value));
    validate_store(draggedObject, "draggedObject");
    component_subscribe($$self, draggedObject, ($$value) => $$invalidate(8, $draggedObject = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("PropertiesSidebar", slots, []);
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var _a;
    let { live } = $$props;
    const dispatch2 = createEventDispatcher();
    let classList;
    function addClasses({ detail: newClasses }) {
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (node) {
          let classes = newClasses.split(" ").map((c) => c.trim());
          live.pushEvent("classes_added", { id: $page.id, classes });
          node.attrs.class = node.attrs.class ? `${node.attrs.class} ${classes.join(" ")}` : classes.join(" ");
          live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
        }
      });
    }
    function parentNodeId() {
      if ($selectedAstElementId) {
        let parts = $selectedAstElementId.split(".");
        if (parts.length === 1)
          return "root";
        return parts.slice(0, -1).join(".");
      }
    }
    function selectParentNode() {
      let parentId = parentNodeId();
      if (parentId) {
        set_store_value(selectedAstElementId, $selectedAstElementId = parentId, $selectedAstElementId);
      }
    }
    function deleteClass(className) {
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (node) {
          let newClass = node.attrs.class.split(" ").filter((c) => c !== className).join(" ");
          node.attrs.class = newClass;
          live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
        }
      });
    }
    function updateText(e) {
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (node && isAstElement(node)) {
          node.content = [e.detail];
          live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
        }
      });
    }
    function updateArg(e) {
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (node && isAstElement(node)) {
          node.arg = e.detail;
          live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
        }
      });
    }
    function updateAttribute(attrName, e) {
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (node && isAstElement(node)) {
          node.attrs[attrName] = e.detail;
          live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
        }
      });
    }
    function deleteComponent() {
      var _a2;
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (!node)
          return;
        if (confirm("Are you sure you want to delete this component?")) {
          let parentId = parentNodeId();
          let content = parentId && parentId !== "root" ? (_a2 = findAstElement($page.ast, parentId)) === null || _a2 === void 0 ? void 0 : _a2.content : $page.ast;
          if (content) {
            let targetIndex = content.indexOf(node);
            content.splice(targetIndex, 1);
            set_store_value(selectedAstElementId, $selectedAstElementId = void 0, $selectedAstElementId);
            live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
          }
        }
      });
    }
    function dropInside() {
      dispatch2("droppedIntoTarget", $selectedAstElement);
    }
    let isDraggingOver = false;
    function dragOver(e) {
      e.preventDefault();
      $$invalidate(3, isDraggingOver = true);
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
      }
    }
    function changeNodes({ detail: nodes }) {
      return __awaiter(this, void 0, void 0, function* () {
        if ($selectedAstElementId === "root") {
          let selectedElement = $page;
          selectedElement.ast = nodes;
        } else {
          let selectedElement = $selectedAstElement;
          if (!selectedElement)
            return;
          selectedElement.content = nodes;
        }
        live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
      });
    }
    $$self.$$.on_mount.push(function() {
      if (live === void 0 && !("live" in $$props || $$self.$$.bound[$$self.$$.props["live"]])) {
        console.warn("<PropertiesSidebar> was created without expected prop 'live'");
      }
    });
    const writable_props = ["live"];
    Object_1.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<PropertiesSidebar> was created with unknown prop '${key}'`);
    });
    const click_handler = () => set_store_value(selectedAstElementId, $selectedAstElementId = void 0, $selectedAstElementId);
    const delete_handler = (className) => deleteClass(className);
    const textChange_handler = (name, e) => updateAttribute(name, e);
    const dragleave_handler = () => $$invalidate(3, isDraggingOver = false);
    const textChange_handler_1 = (e) => updateText(e);
    $$self.$$set = ($$props2) => {
      if ("live" in $$props2)
        $$invalidate(19, live = $$props2.live);
    };
    $$self.$capture_state = () => ({
      __awaiter,
      _a,
      Pill: Pill_default,
      SidebarSection: SidebarSection_default,
      createEventDispatcher,
      draggedObject,
      page,
      selectedAstElement,
      selectedAstElementId,
      findAstElement,
      isAstElement,
      live,
      dispatch: dispatch2,
      classList,
      addClasses,
      parentNodeId,
      selectParentNode,
      deleteClass,
      updateText,
      updateArg,
      updateAttribute,
      deleteComponent,
      dropInside,
      isDraggingOver,
      dragOver,
      changeNodes,
      attributesEditable,
      isRootNode,
      sidebarTitle,
      editableAttrs,
      $page,
      $selectedAstElement,
      $selectedAstElementId,
      $draggedObject
    });
    $$self.$inject_state = ($$props2) => {
      if ("__awaiter" in $$props2)
        __awaiter = $$props2.__awaiter;
      if ("_a" in $$props2)
        $$invalidate(20, _a = $$props2._a);
      if ("live" in $$props2)
        $$invalidate(19, live = $$props2.live);
      if ("classList" in $$props2)
        $$invalidate(2, classList = $$props2.classList);
      if ("isDraggingOver" in $$props2)
        $$invalidate(3, isDraggingOver = $$props2.isDraggingOver);
      if ("attributesEditable" in $$props2)
        $$invalidate(4, attributesEditable = $$props2.attributesEditable);
      if ("isRootNode" in $$props2)
        $$invalidate(5, isRootNode = $$props2.isRootNode);
      if ("sidebarTitle" in $$props2)
        $$invalidate(6, sidebarTitle = $$props2.sidebarTitle);
      if ("editableAttrs" in $$props2)
        $$invalidate(7, editableAttrs = $$props2.editableAttrs);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*$selectedAstElement, _a*/
      1048577) {
        $: {
          let classAttr = $$invalidate(20, _a = $selectedAstElement === null || $selectedAstElement === void 0 ? void 0 : $selectedAstElement.attrs) === null || _a === void 0 ? void 0 : _a.class;
          $$invalidate(2, classList = classAttr ? classAttr.split(" ").filter((e) => e.trim().length > 0) : []);
        }
      }
      if ($$self.$$.dirty[0] & /*$selectedAstElement*/
      1) {
        $:
          $$invalidate(7, editableAttrs = Object.entries(($selectedAstElement === null || $selectedAstElement === void 0 ? void 0 : $selectedAstElement.attrs) || {}).filter(([k, _]) => k !== "class" && k !== "selfClose" && !/data-/.test(k)));
      }
      if ($$self.$$.dirty[0] & /*$selectedAstElement*/
      1) {
        $:
          $$invalidate(6, sidebarTitle = $selectedAstElement === null || $selectedAstElement === void 0 ? void 0 : $selectedAstElement.tag);
      }
      if ($$self.$$.dirty[0] & /*$selectedAstElementId*/
      2) {
        $:
          $$invalidate(5, isRootNode = !!$selectedAstElementId && $selectedAstElementId === "root");
      }
      if ($$self.$$.dirty[0] & /*$selectedAstElement*/
      1) {
        $:
          $$invalidate(4, attributesEditable = !["eex", "eex_block"].includes($selectedAstElement === null || $selectedAstElement === void 0 ? void 0 : $selectedAstElement.tag));
      }
    };
    return [
      $selectedAstElement,
      $selectedAstElementId,
      classList,
      isDraggingOver,
      attributesEditable,
      isRootNode,
      sidebarTitle,
      editableAttrs,
      $draggedObject,
      addClasses,
      selectParentNode,
      deleteClass,
      updateText,
      updateArg,
      updateAttribute,
      deleteComponent,
      dropInside,
      dragOver,
      changeNodes,
      live,
      _a,
      click_handler,
      delete_handler,
      textChange_handler,
      dragleave_handler,
      textChange_handler_1
    ];
  }
  var PropertiesSidebar = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance11, create_fragment11, safe_not_equal, { live: 19 }, null, [-1, -1]);
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PropertiesSidebar",
        options,
        id: create_fragment11.name
      });
    }
    get live() {
      return this.$$.ctx[19];
    }
    set live(live) {
      this.$$set({ live });
      flush();
    }
  };
  create_custom_element(PropertiesSidebar, { "live": {} }, [], [], true);
  var PropertiesSidebar_default = PropertiesSidebar;

  // svelte/components/UiBuilder.svelte
  var UiBuilder_exports = {};
  __export(UiBuilder_exports, {
    default: () => UiBuilder_default
  });

  // svelte/stores/pageBaselineCssPath.ts
  var pageBaselineCssPath = writable(null);

  // svelte/stores/pageChunksCssPath.ts
  var pageChunksCssPath = writable(null);

  // svelte/components/UiBuilder.svelte
  var file12 = "svelte/components/UiBuilder.svelte";
  function create_fragment12(ctx) {
    let backdrop;
    let t0;
    let div;
    let componentssidebar;
    let t1;
    let pagepreview;
    let t2;
    let propertiessidebar;
    let current;
    backdrop = new Backdrop_default({ $$inline: true });
    componentssidebar = new ComponentsSidebar_default({
      props: { components: (
        /*components*/
        ctx[0]
      ) },
      $$inline: true
    });
    pagepreview = new PagePreview_default({
      props: { live: (
        /*live*/
        ctx[1]
      ) },
      $$inline: true
    });
    propertiessidebar = new PropertiesSidebar_default({
      props: { live: (
        /*live*/
        ctx[1]
      ) },
      $$inline: true
    });
    propertiessidebar.$on(
      "droppedIntoTarget",
      /*droppedIntoTarget_handler*/
      ctx[5]
    );
    const block = {
      c: function create3() {
        create_component(backdrop.$$.fragment);
        t0 = space();
        div = element("div");
        create_component(componentssidebar.$$.fragment);
        t1 = space();
        create_component(pagepreview.$$.fragment);
        t2 = space();
        create_component(propertiessidebar.$$.fragment);
        this.h();
      },
      l: function claim(nodes) {
        claim_component(backdrop.$$.fragment, nodes);
        t0 = claim_space(nodes);
        div = claim_element(nodes, "DIV", { class: true, "data-test-id": true });
        var div_nodes = children(div);
        claim_component(componentssidebar.$$.fragment, div_nodes);
        t1 = claim_space(div_nodes);
        claim_component(pagepreview.$$.fragment, div_nodes);
        t2 = claim_space(div_nodes);
        claim_component(propertiessidebar.$$.fragment, div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "flex min-h-screen bg-gray-100");
        attr_dev(div, "data-test-id", "app-container");
        add_location(div, file12, 25, 0, 819);
      },
      m: function mount(target, anchor) {
        mount_component(backdrop, target, anchor);
        insert_hydration_dev(target, t0, anchor);
        insert_hydration_dev(target, div, anchor);
        mount_component(componentssidebar, div, null);
        append_hydration_dev(div, t1);
        mount_component(pagepreview, div, null);
        append_hydration_dev(div, t2);
        mount_component(propertiessidebar, div, null);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        const componentssidebar_changes = {};
        if (dirty & /*components*/
        1)
          componentssidebar_changes.components = /*components*/
          ctx2[0];
        componentssidebar.$set(componentssidebar_changes);
        const pagepreview_changes = {};
        if (dirty & /*live*/
        2)
          pagepreview_changes.live = /*live*/
          ctx2[1];
        pagepreview.$set(pagepreview_changes);
        const propertiessidebar_changes = {};
        if (dirty & /*live*/
        2)
          propertiessidebar_changes.live = /*live*/
          ctx2[1];
        propertiessidebar.$set(propertiessidebar_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(backdrop.$$.fragment, local);
        transition_in(componentssidebar.$$.fragment, local);
        transition_in(pagepreview.$$.fragment, local);
        transition_in(propertiessidebar.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(backdrop.$$.fragment, local);
        transition_out(componentssidebar.$$.fragment, local);
        transition_out(pagepreview.$$.fragment, local);
        transition_out(propertiessidebar.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(t0);
          detach_dev(div);
        }
        destroy_component(backdrop, detaching);
        destroy_component(componentssidebar);
        destroy_component(pagepreview);
        destroy_component(propertiessidebar);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment12.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function addBasicComponentToTarget(e) {
  }
  function instance12($$self, $$props, $$invalidate) {
    let $pageChunksCssPathStore;
    let $pageBaselineCssPathStore;
    let $pageStore;
    validate_store(pageChunksCssPath, "pageChunksCssPathStore");
    component_subscribe($$self, pageChunksCssPath, ($$value) => $$invalidate(6, $pageChunksCssPathStore = $$value));
    validate_store(pageBaselineCssPath, "pageBaselineCssPathStore");
    component_subscribe($$self, pageBaselineCssPath, ($$value) => $$invalidate(7, $pageBaselineCssPathStore = $$value));
    validate_store(page, "pageStore");
    component_subscribe($$self, page, ($$value) => $$invalidate(8, $pageStore = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("UiBuilder", slots, []);
    let { components } = $$props;
    let { page: page2 } = $$props;
    let { pageBaselineCssPath: pageBaselineCssPath2 } = $$props;
    let { pageChunksCssPath: pageChunksCssPath2 } = $$props;
    let { live } = $$props;
    $$self.$$.on_mount.push(function() {
      if (components === void 0 && !("components" in $$props || $$self.$$.bound[$$self.$$.props["components"]])) {
        console.warn("<UiBuilder> was created without expected prop 'components'");
      }
      if (page2 === void 0 && !("page" in $$props || $$self.$$.bound[$$self.$$.props["page"]])) {
        console.warn("<UiBuilder> was created without expected prop 'page'");
      }
      if (pageBaselineCssPath2 === void 0 && !("pageBaselineCssPath" in $$props || $$self.$$.bound[$$self.$$.props["pageBaselineCssPath"]])) {
        console.warn("<UiBuilder> was created without expected prop 'pageBaselineCssPath'");
      }
      if (pageChunksCssPath2 === void 0 && !("pageChunksCssPath" in $$props || $$self.$$.bound[$$self.$$.props["pageChunksCssPath"]])) {
        console.warn("<UiBuilder> was created without expected prop 'pageChunksCssPath'");
      }
      if (live === void 0 && !("live" in $$props || $$self.$$.bound[$$self.$$.props["live"]])) {
        console.warn("<UiBuilder> was created without expected prop 'live'");
      }
    });
    const writable_props = ["components", "page", "pageBaselineCssPath", "pageChunksCssPath", "live"];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<UiBuilder> was created with unknown prop '${key}'`);
    });
    const droppedIntoTarget_handler = (e) => addBasicComponentToTarget(e.detail);
    $$self.$$set = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(0, components = $$props2.components);
      if ("page" in $$props2)
        $$invalidate(2, page2 = $$props2.page);
      if ("pageBaselineCssPath" in $$props2)
        $$invalidate(3, pageBaselineCssPath2 = $$props2.pageBaselineCssPath);
      if ("pageChunksCssPath" in $$props2)
        $$invalidate(4, pageChunksCssPath2 = $$props2.pageChunksCssPath);
      if ("live" in $$props2)
        $$invalidate(1, live = $$props2.live);
    };
    $$self.$capture_state = () => ({
      ComponentsSidebar: ComponentsSidebar_default,
      Backdrop: Backdrop_default,
      PagePreview: PagePreview_default,
      PropertiesSidebar: PropertiesSidebar_default,
      pageStore: page,
      pageBaselineCssPathStore: pageBaselineCssPath,
      pageChunksCssPathStore: pageChunksCssPath,
      components,
      page: page2,
      pageBaselineCssPath: pageBaselineCssPath2,
      pageChunksCssPath: pageChunksCssPath2,
      live,
      addBasicComponentToTarget,
      $pageChunksCssPathStore,
      $pageBaselineCssPathStore,
      $pageStore
    });
    $$self.$inject_state = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(0, components = $$props2.components);
      if ("page" in $$props2)
        $$invalidate(2, page2 = $$props2.page);
      if ("pageBaselineCssPath" in $$props2)
        $$invalidate(3, pageBaselineCssPath2 = $$props2.pageBaselineCssPath);
      if ("pageChunksCssPath" in $$props2)
        $$invalidate(4, pageChunksCssPath2 = $$props2.pageChunksCssPath);
      if ("live" in $$props2)
        $$invalidate(1, live = $$props2.live);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*page*/
      4) {
        $:
          set_store_value(page, $pageStore = page2, $pageStore);
      }
      if ($$self.$$.dirty & /*pageBaselineCssPath*/
      8) {
        $:
          set_store_value(pageBaselineCssPath, $pageBaselineCssPathStore = pageBaselineCssPath2, $pageBaselineCssPathStore);
      }
      if ($$self.$$.dirty & /*pageChunksCssPath*/
      16) {
        $:
          set_store_value(pageChunksCssPath, $pageChunksCssPathStore = pageChunksCssPath2, $pageChunksCssPathStore);
      }
    };
    return [
      components,
      live,
      page2,
      pageBaselineCssPath2,
      pageChunksCssPath2,
      droppedIntoTarget_handler
    ];
  }
  var UiBuilder = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance12, create_fragment12, safe_not_equal, {
        components: 0,
        page: 2,
        pageBaselineCssPath: 3,
        pageChunksCssPath: 4,
        live: 1
      });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "UiBuilder",
        options,
        id: create_fragment12.name
      });
    }
    get components() {
      return this.$$.ctx[0];
    }
    set components(components) {
      this.$$set({ components });
      flush();
    }
    get page() {
      return this.$$.ctx[2];
    }
    set page(page2) {
      this.$$set({ page: page2 });
      flush();
    }
    get pageBaselineCssPath() {
      return this.$$.ctx[3];
    }
    set pageBaselineCssPath(pageBaselineCssPath2) {
      this.$$set({ pageBaselineCssPath: pageBaselineCssPath2 });
      flush();
    }
    get pageChunksCssPath() {
      return this.$$.ctx[4];
    }
    set pageChunksCssPath(pageChunksCssPath2) {
      this.$$set({ pageChunksCssPath: pageChunksCssPath2 });
      flush();
    }
    get live() {
      return this.$$.ctx[1];
    }
    set live(live) {
      this.$$set({ live });
      flush();
    }
  };
  create_custom_element(UiBuilder, { "components": {}, "page": {}, "pageBaselineCssPath": {}, "pageChunksCssPath": {}, "live": {} }, [], [], true);
  var UiBuilder_default = UiBuilder;

  // import-glob:../svelte/**/*.svelte
  var modules = [Backdrop_exports, BrowserFrame_exports, CodeEditor_exports, ComponentsSidebar_exports, LayoutAstNode_exports, PageAstNode_exports, PagePreview_exports, PageWrapper_exports, Pill_exports, PropertiesSidebar_exports, SidebarSection_exports, UiBuilder_exports];
  var __default = modules;
  var filenames = ["../svelte/components/Backdrop.svelte", "../svelte/components/BrowserFrame.svelte", "../svelte/components/CodeEditor.svelte", "../svelte/components/ComponentsSidebar.svelte", "../svelte/components/LayoutAstNode.svelte", "../svelte/components/PageAstNode.svelte", "../svelte/components/PagePreview.svelte", "../svelte/components/PageWrapper.svelte", "../svelte/components/Pill.svelte", "../svelte/components/PropertiesSidebar.svelte", "../svelte/components/SidebarSection.svelte", "../svelte/components/UiBuilder.svelte"];

  // js/beacon_live_admin.js
  var Hooks = {};
  Hooks.CodeEditorHook = CodeEditorHook;
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (_info) => import_topbar.default.show(300));
  window.addEventListener("phx:page-loading-stop", (_info) => import_topbar.default.hide());
  window.addEventListener("beacon_admin:clipcopy", (event) => {
    const result_id = `${event.target.id}-copy-to-clipboard-result`;
    const el = document.getElementById(result_id);
    if ("clipboard" in navigator) {
      if (event.target.tagName === "INPUT") {
        txt = event.target.value;
      } else {
        txt = event.target.textContent;
      }
      navigator.clipboard.writeText(txt).then(() => {
        el.innerText = "Copied to clipboard";
        el.classList.remove("invisible", "text-red-500", "opacity-0");
        el.classList.add("text-green-500", "opacity-100", "-translate-y-2");
        setTimeout(function() {
          el.classList.remove("text-green-500", "opacity-100", "-translate-y-2");
          el.classList.add("invisible", "text-red-500", "opacity-0");
        }, 2e3);
      }).catch(() => {
        el.innerText = "Could not copy";
        el.classList.remove("invisible", "text-green-500", "opacity-0");
        el.classList.add("text-red-500", "opacity-100", "-translate-y-2");
      });
    } else {
      alert("Sorry, your browser does not support clipboard copy.");
    }
  });
  var socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live";
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveView.LiveSocket(socketPath, Phoenix.Socket, {
    hooks: { ...getHooks(__exports), ...Hooks },
    params: { _csrf_token: csrfToken }
  });
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 2.0.0, 2023-02-04
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
