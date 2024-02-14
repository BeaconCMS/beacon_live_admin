var BeaconLiveAdmin = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
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
              var currTime = new Date().getTime();
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
          ctx.lineTo(
            Math.ceil(currentProgress * canvas.width),
            options.barThickness / 2
          );
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
                (function loop2() {
                  progressTimerId = window2.requestAnimationFrame(loop2);
                  topbar2.progress(
                    "+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2)
                  );
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
  var ResizeObserverSingleton = class {
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
          ResizeObserverSingleton.entries.set(entry.target, entry);
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
          if (!this.$$cn) {
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
  var VERSION = "4.2.9";
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
        add_location(span0, file2, 16, 6, 373);
        attr_dev(span1, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-amber-400");
        add_location(span1, file2, 17, 6, 451);
        attr_dev(span2, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-lime-600");
        add_location(span2, file2, 18, 6, 531);
        attr_dev(div0, "class", "py-2");
        add_location(div0, file2, 15, 4, 348);
        attr_dev(span3, "data-test-id", "url-box");
        add_location(span3, file2, 22, 8, 788);
        attr_dev(div1, "class", "rounded bg-gray-50 border-b border-gray-200 shadow max-w-xs mx-auto text-center py-0.5 relative");
        add_location(div1, file2, 21, 6, 670);
        attr_dev(div2, "class", "flex-1 py-2.5 overflow-visible");
        add_location(div2, file2, 20, 4, 619);
        attr_dev(div3, "class", "py-3");
        add_location(div3, file2, 25, 4, 872);
        attr_dev(div4, "class", "bg-gray-50 border-b border-gray-200 border-solid rounded-t-xl h-12 px-3.5 flex");
        attr_dev(div4, "data-test-id", "address-bar");
        add_location(div4, file2, 12, 2, 214);
        attr_dev(div5, "class", "flex-1 flex flex-col");
        attr_dev(div5, "data-test-id", "fake-browser");
        add_location(div5, file2, 9, 0, 143);
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
        add_location(div, file3, 40, 0, 1708);
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
    append_styles(target, "svelte-3tzlp1", "#left-sidebar.svelte-3tzlp1{z-index:1000}#backdrop.svelte-3tzlp1{z-index:999}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXFIQywyQkFBYyxDQUNiLE9BQU8sQ0FBRSxJQUNWLENBQ0EsdUJBQVUsQ0FDVCxPQUFPLENBQUUsR0FDViIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJDb21wb25lbnRzU2lkZWJhci5zdmVsdGUiXX0= */");
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
        add_location(div, file4, 77, 12, 2515);
        attr_dev(li, "class", "p-2 pl-6 hover:bg-slate-50 hover:cursor-pointer");
        attr_dev(li, "data-test-id", "nav-item");
        add_location(li, file4, 76, 10, 2334);
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
      source: "(68:8) {#each category.items as item}",
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
        add_location(h3, file4, 73, 10, 2210);
        attr_dev(li, "class", "mb-1 px-4");
        attr_dev(li, "data-test-id", "nav-item");
        add_location(li, file4, 72, 8, 2153);
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
      source: "(64:6) {#each menuCategories as category}",
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
      source: "(88:6) {#if currentDefinitions}",
      ctx
    });
    return block;
  }
  function create_each_block(ctx) {
    let div;
    let img;
    let img_src_value;
    let img_alt_value;
    let t;
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
        img = element("img");
        t = space();
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", {
          draggable: true,
          class: true,
          "data-test-id": true
        });
        var div_nodes = children(div);
        img = claim_element(div_nodes, "IMG", { class: true, src: true, alt: true });
        t = claim_space(div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(img, "class", "rounded ring-offset-2 ring-blue-500 transition hover:cursor-grab hover:ring-2");
        if (!src_url_equal(img.src, img_src_value = /*example*/
        ctx[17].thumbnail))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", img_alt_value = /*example*/
        ctx[17].name);
        add_location(img, file4, 104, 12, 3719);
        attr_dev(div, "draggable", "");
        attr_dev(div, "class", "pt-6");
        attr_dev(div, "data-test-id", "component-preview-card");
        add_location(div, file4, 98, 10, 3515);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        append_hydration_dev(div, img);
        append_hydration_dev(div, t);
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
        8 && !src_url_equal(img.src, img_src_value = /*example*/
        ctx[17].thumbnail)) {
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
      source: "(89:8) {#each currentDefinitions as example}",
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
        attr_dev(div, "class", "bg-black/50 absolute inset-0 z-50 svelte-3tzlp1");
        attr_dev(div, "id", "backdrop");
        attr_dev(div, "data-test-id", "backdrop");
        add_location(div, file4, 113, 2, 3950);
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
      source: "(105:0) {#if showExamples}",
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
    let textContent_1 = "Select a component \u{1F447}  and drag it to the canvas \u{1F449}";
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
        if (get_svelte_dataset(p) !== "svelte-1od28ai")
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
        add_location(h2, file4, 68, 6, 1956);
        attr_dev(div0, "class", "border-b border-slate-100 border-solid py-4 px-4");
        attr_dev(div0, "data-test-id", "logo");
        add_location(div0, file4, 67, 4, 1867);
        attr_dev(ul, "class", "py-4 h-[calc(100vh_-_61px)] overflow-y-auto");
        attr_dev(ul, "data-test-id", "component-tree");
        add_location(ul, file4, 70, 4, 2017);
        attr_dev(h4, "class", "mb-4 font-bold text-2xl");
        add_location(h4, file4, 93, 6, 3184);
        attr_dev(p, "class", "font-medium");
        add_location(p, file4, 94, 6, 3280);
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
        add_location(div1, file4, 83, 4, 2677);
        attr_dev(div2, "class", "sticky top-0");
        add_location(div2, file4, 66, 2, 1836);
        attr_dev(div3, "class", "w-64 bg-white border-slate-100 border-solid border-r svelte-3tzlp1");
        attr_dev(div3, "id", "left-sidebar");
        attr_dev(div3, "data-test-id", "left-sidebar");
        add_location(div3, file4, 65, 0, 1721);
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
  var selectedAstElement = derived([page, selectedAstElementId], ([$page, $selectedAstElementId]) => {
    if ($selectedAstElementId) {
      if ($selectedAstElementId === "root")
        return get_store_value(rootAstElement);
      return findAstElement($page.ast, $selectedAstElementId);
    }
  });
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
      source: "(6:2) {#if node.tag === 'html_comment'}",
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
        add_location(svelte_element, file5, 18, 4, 530);
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
        add_location(svelte_element, file5, 16, 4, 466);
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
      source: "(15:4) <svelte:element this={node.tag} {...node.attrs}/>",
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
      source: "(102:0) {:else}",
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
        ctx2[0].attrs.selfClose
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
      source: "(85:2) {:else}",
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
      source: "(73:33) ",
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
        add_location(div, file6, 70, 4, 2654);
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
      source: "(59:2) {#if node.tag === 'html_comment'}",
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
      source: "(97:6) {#each node.content as subnode, index}",
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
        add_location(svelte_element, file6, 90, 4, 3610);
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
      source: "(86:4) <svelte:element       this={node.tag}       {...node.attrs}       data-selected={$selectedAstElement === node}       data-highlighted={$highlightedAstElement === node}       data-slot-target={$slotTargetElement === node}       on:dragenter|stopPropagation={handleDragEnter}       on:dragleave|stopPropagation={handleDragLeave}       on:mouseover|stopPropagation={handleMouseOver}       on:mouseout|stopPropagation={handleMouseOut}       on:click|preventDefault|stopPropagation={() => $selectedAstElementId = nodeId}>",
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
        add_location(svelte_element, file6, 78, 4, 3063);
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
      source: "(74:4) <svelte:element       this={node.tag}       {...node.attrs}       data-selected={$selectedAstElement === node}       data-highlighted={$highlightedAstElement === node}       data-slot-target={$slotTargetElement === node && !$slotTargetElement.attrs.selfClose}       on:dragenter|stopPropagation={handleDragEnter}       on:dragleave|stopPropagation={handleDragLeave}       on:mouseover|stopPropagation={handleMouseOver}       on:mouseout|stopPropagation={handleMouseOut}       on:click|preventDefault|stopPropagation={handleClick} />",
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
    append_styles(target, "svelte-y00j5s", '.contents[data-nochildren="true"], .contents[data-nochildren="true"]{display:inline}[data-slot-target="true"]{outline-color:red;outline-width:2px;outline-style:dashed}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZVByZXZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXdFVSxvRUFBc0UsQ0FJNUUsT0FBTyxDQUFFLE1BQ1gsQ0FDUSx5QkFBMkIsQ0FDakMsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLE1BQ2pCIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlBhZ2VQcmV2aWV3LnN2ZWx0ZSJdfQ== */');
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
        add_location(page_wrapper, file7, 59, 10, 3379);
        attr_dev(div0, "id", "page-wrapper");
        attr_dev(div0, "class", "p-1 m-1");
        attr_dev(div0, "data-selected", div0_data_selected_value = /*$selectedAstElementId*/
        ctx[2] === "root");
        add_location(div0, file7, 58, 8, 3280);
        attr_dev(div1, "role", "document");
        set_style(div1, "--outlined-id", "title-1");
        attr_dev(div1, "id", "fake-browser-content");
        attr_dev(div1, "class", div1_class_value = "bg-white rounded-b-xl relative overflow-hidden flex-1 " + /*isDraggingOver*/
        (ctx[0] && "border-dashed border-blue-500 border-2"));
        attr_dev(div1, "data-test-id", "browser-content");
        add_location(div1, file7, 50, 6, 2903);
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
        add_location(div, file7, 47, 0, 2784);
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

  // svelte/stores/pageStylesheet.ts
  var pageStylesheet = writable(null);

  // svelte/stores/siteStylesheet.ts
  var siteStylesheet = writable(null);

  // svelte/components/PageWrapper.svelte
  var file8 = "svelte/components/PageWrapper.svelte";
  function add_css3(target) {
    append_styles(target, "svelte-10k9a27", '[data-selected="true"], [data-highlighted="true"]{outline-color:#06b6d4;outline-width:2px;outline-style:dashed}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZVdyYXBwZXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXdDWSxpREFBbUQsQ0FDekQsYUFBYSxDQUFFLE9BQU8sQ0FDdEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLE1BQ2pCIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlBhZ2VXcmFwcGVyLnN2ZWx0ZSJdfQ== */');
  }
  function get_each_context4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[7] = list[i];
    return child_ctx;
  }
  function get_each_context_12(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[10] = list[i];
    child_ctx[12] = i;
    return child_ctx;
  }
  function create_each_block_12(ctx) {
    let pageastnode;
    let current;
    pageastnode = new PageAstNode_default({
      props: {
        node: (
          /*astNode*/
          ctx[10]
        ),
        nodeId: String(
          /*index*/
          ctx[12]
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
        4)
          pageastnode_changes.node = /*astNode*/
          ctx2[10];
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
      source: "(31:4) {#each $page.ast as astNode, index}",
      ctx
    });
    return block;
  }
  function create_default_slot2(ctx) {
    let t;
    let current;
    let each_value_1 = ensure_array_like_dev(
      /*$page*/
      ctx[2].ast
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
        4) {
          each_value_1 = ensure_array_like_dev(
            /*$page*/
            ctx2[2].ast
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
      source: "(30:2) <LayoutAstNode node={layoutAstNode}>",
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
          ctx[7]
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
        4)
          layoutastnode_changes.node = /*layoutAstNode*/
          ctx2[7];
        if (dirty & /*$$scope, $page*/
        8196) {
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
      source: "(29:0) {#each $page.layout.ast as layoutAstNode}",
      ctx
    });
    return block;
  }
  function create_fragment8(ctx) {
    let span0;
    let t0;
    let span1;
    let t1;
    let each_1_anchor;
    let current;
    let each_value = ensure_array_like_dev(
      /*$page*/
      ctx[2].layout.ast
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
        span0 = element("span");
        t0 = space();
        span1 = element("span");
        t1 = space();
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        each_1_anchor = empty();
        this.h();
      },
      l: function claim(nodes) {
        span0 = claim_element(nodes, "SPAN", { id: true });
        children(span0).forEach(detach_dev);
        t0 = claim_space(nodes);
        span1 = claim_element(nodes, "SPAN", { id: true });
        children(span1).forEach(detach_dev);
        t1 = claim_space(nodes);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        attr_dev(span0, "id", "site-stylesheet-target");
        add_location(span0, file8, 28, 0, 946);
        attr_dev(span1, "id", "page-stylesheet-target");
        add_location(span1, file8, 29, 0, 1019);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, span0, anchor);
        ctx[5](span0);
        insert_hydration_dev(target, t0, anchor);
        insert_hydration_dev(target, span1, anchor);
        ctx[6](span1);
        insert_hydration_dev(target, t1, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }
        insert_hydration_dev(target, each_1_anchor, anchor);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        if (dirty & /*$page, String*/
        4) {
          each_value = ensure_array_like_dev(
            /*$page*/
            ctx2[2].layout.ast
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
          detach_dev(span0);
          detach_dev(t0);
          detach_dev(span1);
          detach_dev(t1);
          detach_dev(each_1_anchor);
        }
        ctx[5](null);
        ctx[6](null);
        destroy_each(each_blocks, detaching);
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
    let $pageStylesheetStore;
    let $siteStylesheetStore;
    let $page;
    validate_store(pageStylesheet, "pageStylesheetStore");
    component_subscribe($$self, pageStylesheet, ($$value) => $$invalidate(3, $pageStylesheetStore = $$value));
    validate_store(siteStylesheet, "siteStylesheetStore");
    component_subscribe($$self, siteStylesheet, ($$value) => $$invalidate(4, $siteStylesheetStore = $$value));
    validate_store(page, "page");
    component_subscribe($$self, page, ($$value) => $$invalidate(2, $page = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("page-wrapper", slots, []);
    let spanSiteStylesheet;
    let spanPageStylesheet;
    const writable_props = [];
    Object.keys($$props).forEach((key) => {
      if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
        console.warn(`<page-wrapper> was created with unknown prop '${key}'`);
    });
    function span0_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        spanSiteStylesheet = $$value;
        $$invalidate(0, spanSiteStylesheet), $$invalidate(4, $siteStylesheetStore), $$invalidate(1, spanPageStylesheet), $$invalidate(3, $pageStylesheetStore);
      });
    }
    function span1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        spanPageStylesheet = $$value;
        $$invalidate(1, spanPageStylesheet), $$invalidate(0, spanSiteStylesheet), $$invalidate(4, $siteStylesheetStore), $$invalidate(3, $pageStylesheetStore);
      });
    }
    $$self.$capture_state = () => ({
      LayoutAstNode: LayoutAstNode_default,
      PageAstNode: PageAstNode_default,
      page,
      pageStylesheetStore: pageStylesheet,
      siteStylesheetStore: siteStylesheet,
      spanSiteStylesheet,
      spanPageStylesheet,
      $pageStylesheetStore,
      $siteStylesheetStore,
      $page
    });
    $$self.$inject_state = ($$props2) => {
      if ("spanSiteStylesheet" in $$props2)
        $$invalidate(0, spanSiteStylesheet = $$props2.spanSiteStylesheet);
      if ("spanPageStylesheet" in $$props2)
        $$invalidate(1, spanPageStylesheet = $$props2.spanPageStylesheet);
    };
    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*spanSiteStylesheet, $siteStylesheetStore, spanPageStylesheet, $pageStylesheetStore*/
      27) {
        $: {
          if (spanSiteStylesheet) {
            $$invalidate(0, spanSiteStylesheet.innerHTML = "", spanSiteStylesheet);
            let styleEl = document.createElement("style");
            styleEl.innerHTML = $siteStylesheetStore;
            spanSiteStylesheet.append(styleEl);
          }
          if (spanPageStylesheet) {
            $$invalidate(1, spanPageStylesheet.innerHTML = "", spanPageStylesheet);
            let styleEl = document.createElement("style");
            styleEl.innerHTML = $pageStylesheetStore;
            spanPageStylesheet.append(styleEl);
          }
        }
      }
    };
    return [
      spanSiteStylesheet,
      spanPageStylesheet,
      $page,
      $pageStylesheetStore,
      $siteStylesheetStore,
      span0_binding,
      span1_binding
    ];
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
    let t;
    let button;
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
    const block = {
      c: function create3() {
        div = element("div");
        if (default_slot)
          default_slot.c();
        t = space();
        button = element("button");
        svg = svg_element("svg");
        path = svg_element("path");
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true });
        var div_nodes = children(div);
        if (default_slot)
          default_slot.l(div_nodes);
        t = claim_space(div_nodes);
        button = claim_element(div_nodes, "BUTTON", { class: true, type: true });
        var button_nodes = children(button);
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
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file9, 12, 8, 547);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-3 h-3");
        add_location(svg, file9, 11, 6, 442);
        attr_dev(button, "class", "p-2 rounded-full inline-block bg-slate-700 text-white hover:text-blue-400 active:text-blue-500");
        attr_dev(button, "type", "button");
        add_location(button, file9, 7, 2, 245);
        attr_dev(div, "class", "inline-flex items-center rounded-full bg-slate-700 text-white text-xs px-3 pr-0 m-1 leading-4");
        add_location(div, file9, 5, 0, 119);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        if (default_slot) {
          default_slot.m(div, null);
        }
        append_hydration_dev(div, t);
        append_hydration_dev(div, button);
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
          detach_dev(div);
        }
        if (default_slot)
          default_slot.d(detaching);
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
      source: "(85:4) {#if expanded}",
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
        add_location(div, file10, 85, 4, 3073);
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
      source: "(73:2) {#if $$slots['value']}",
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
      source: "(108:30) ",
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
      source: "(87:8) {#if internalValue}",
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
    let t4;
    let button0;
    let t5;
    let svg0;
    let path0;
    let path1;
    let t6;
    let div1;
    let button1;
    let span1;
    let textContent = "Move up";
    let t8;
    let svg1;
    let path2;
    let button1_disabled_value;
    let t9;
    let button2;
    let span2;
    let textContent_1 = "Move down";
    let t11;
    let svg2;
    let path3;
    let button2_disabled_value;
    let t12;
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
        t3 = text(" element");
        t4 = space();
        button0 = element("button");
        t5 = text("Edit\n                  ");
        svg0 = svg_element("svg");
        path0 = svg_element("path");
        path1 = svg_element("path");
        t6 = space();
        div1 = element("div");
        button1 = element("button");
        span1 = element("span");
        span1.textContent = textContent;
        t8 = space();
        svg1 = svg_element("svg");
        path2 = svg_element("path");
        t9 = space();
        button2 = element("button");
        span2 = element("span");
        span2.textContent = textContent_1;
        t11 = space();
        svg2 = svg_element("svg");
        path3 = svg_element("path");
        t12 = space();
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
        t3 = claim_text(span0_nodes, " element");
        span0_nodes.forEach(detach_dev);
        t4 = claim_space(div0_nodes);
        button0 = claim_element(div0_nodes, "BUTTON", { class: true });
        var button0_nodes = children(button0);
        t5 = claim_text(button0_nodes, "Edit\n                  ");
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
        t6 = claim_space(div2_nodes);
        div1 = claim_element(div2_nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        button1 = claim_element(div1_nodes, "BUTTON", { class: true });
        var button1_nodes = children(button1);
        span1 = claim_element(button1_nodes, "SPAN", { ["data-svelte-h"]: true });
        if (get_svelte_dataset(span1) !== "svelte-1g0eo44")
          span1.textContent = textContent;
        t8 = claim_space(button1_nodes);
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
        t9 = claim_space(div1_nodes);
        button2 = claim_element(div1_nodes, "BUTTON", { class: true });
        var button2_nodes = children(button2);
        span2 = claim_element(button2_nodes, "SPAN", { ["data-svelte-h"]: true });
        if (get_svelte_dataset(span2) !== "svelte-1vcc1il")
          span2.textContent = textContent_1;
        t11 = claim_space(button2_nodes);
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
        t12 = claim_space(div2_nodes);
        div2_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        add_location(code, file10, 115, 22, 4405);
        add_location(span0, file10, 115, 16, 4399);
        attr_dev(path0, "d", "M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z");
        add_location(path0, file10, 121, 20, 4909);
        attr_dev(path1, "d", "M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z");
        add_location(path1, file10, 122, 20, 5184);
        attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg0, "viewBox", "0 0 24 24");
        attr_dev(svg0, "fill", "currentColor");
        attr_dev(svg0, "class", "w-3 h-3");
        add_location(svg0, file10, 120, 18, 4792);
        attr_dev(button0, "class", "flex items-center justify-center gap-x-0.5 px-2 py-1 bg-cyan-300 font-bold text-xs uppercase tracking-wide rounded transition-colors hover:bg-cyan-900 active:bg-cyan-700 hover:text-white");
        add_location(button0, file10, 116, 16, 4474);
        attr_dev(div0, "class", "flex items-center justify-between");
        add_location(div0, file10, 114, 14, 4335);
        add_location(span1, file10, 131, 18, 5940);
        attr_dev(path2, "fill-rule", "evenodd");
        attr_dev(path2, "d", "M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z");
        attr_dev(path2, "clip-rule", "evenodd");
        add_location(path2, file10, 133, 20, 6096);
        attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg1, "viewBox", "0 0 24 24");
        attr_dev(svg1, "fill", "currentColor");
        attr_dev(svg1, "class", "w-3 h-3");
        add_location(svg1, file10, 132, 18, 5979);
        attr_dev(button1, "class", "flex items-center justify-center gap-x-0.5 px-1.5 py-1 bg-cyan-800 font-bold text-xs uppercase tracking-wide rounded hover:bg-cyan-900 active:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white");
        button1.disabled = button1_disabled_value = /*idx*/
        ctx[28] === 0;
        add_location(button1, file10, 127, 16, 5567);
        add_location(span2, file10, 140, 18, 6771);
        attr_dev(path3, "fill-rule", "evenodd");
        attr_dev(path3, "d", "M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z");
        attr_dev(path3, "clip-rule", "evenodd");
        add_location(path3, file10, 142, 20, 6930);
        attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg2, "viewBox", "0 0 24 24");
        attr_dev(svg2, "fill", "currentColor");
        attr_dev(svg2, "class", "w-3 h-3");
        add_location(svg2, file10, 141, 18, 6813);
        attr_dev(button2, "class", "flex items-center justify-center gap-x-0.5 px-1.5 py-1 bg-cyan-800 font-bold text-xs uppercase tracking-wide rounded hover:bg-cyan-900 active:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white");
        button2.disabled = button2_disabled_value = /*idx*/
        ctx[28] === /*astElements*/
        ctx[4].length - 1;
        add_location(button2, file10, 136, 16, 6378);
        attr_dev(div1, "class", "mt-2 grid grid-cols-2 gap-x-1");
        add_location(div1, file10, 126, 14, 5507);
        attr_dev(div2, "class", "mt-5");
        add_location(div2, file10, 113, 12, 4202);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div2, anchor);
        append_hydration_dev(div2, div0);
        append_hydration_dev(div0, span0);
        append_hydration_dev(span0, code);
        append_hydration_dev(code, t0);
        append_hydration_dev(code, t1);
        append_hydration_dev(code, t2);
        append_hydration_dev(span0, t3);
        append_hydration_dev(div0, t4);
        append_hydration_dev(div0, button0);
        append_hydration_dev(button0, t5);
        append_hydration_dev(button0, svg0);
        append_hydration_dev(svg0, path0);
        append_hydration_dev(svg0, path1);
        append_hydration_dev(div2, t6);
        append_hydration_dev(div2, div1);
        append_hydration_dev(div1, button1);
        append_hydration_dev(button1, span1);
        append_hydration_dev(button1, t8);
        append_hydration_dev(button1, svg1);
        append_hydration_dev(svg1, path2);
        append_hydration_dev(div1, t9);
        append_hydration_dev(div1, button2);
        append_hydration_dev(button2, span2);
        append_hydration_dev(button2, t11);
        append_hydration_dev(button2, svg2);
        append_hydration_dev(svg2, path3);
        append_hydration_dev(div2, t12);
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
      source: "(109:10) {#each astElements as astElement, idx}",
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
        add_location(input, file10, 99, 12, 3634);
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
      source: "(96:10) {:else}",
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
        add_location(textarea, file10, 92, 12, 3344);
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
      source: "(88:10) {#if large}",
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
        add_location(div, file10, 108, 12, 3978);
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
      source: "(105:10) {#if $$slots['value']}",
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
      source: "(86:25)          ",
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
        add_location(input, file10, 77, 6, 2812);
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
      source: "(74:23)        ",
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
        button = claim_element(header_nodes, "BUTTON", { type: true, class: true });
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
        add_location(span0, file10, 66, 6, 2193);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file10, 69, 10, 2514);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current");
        add_location(svg, file10, 68, 8, 2323);
        attr_dev(span1, "class", span1_class_value = /*expanded*/
        ctx[0] ? "" : " [&_path]:origin-center [&_path]:rotate-180");
        add_location(span1, file10, 67, 6, 2236);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "w-full flex items-center justify-between gap-x-1 p-1 hover:text-blue-700 active:text-blue-900 group");
        add_location(button, file10, 65, 4, 2018);
        attr_dev(header, "class", "flex items-center text-sm mb-2 font-medium");
        add_location(header, file10, 64, 2, 1954);
        attr_dev(section, "class", "p-4 border-b border-b-gray-100 border-solid");
        add_location(section, file10, 63, 0, 1890);
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
    child_ctx[29] = list[i];
    const constants_0 = (
      /*entry*/
      child_ctx[29]
    );
    child_ctx[30] = constants_0[0];
    child_ctx[31] = constants_0[1];
    return child_ctx;
  }
  function get_each_context_13(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[34] = list[i];
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
        if (get_svelte_dataset(div) !== "svelte-8fkme6")
          div.textContent = textContent;
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "p-4 pt-8 font-medium text-lg text-center");
        add_location(div, file11, 192, 6, 9330);
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
      source: "(206:4) {:else}",
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
    let div1;
    let t7;
    let t8;
    let sidebarsection;
    let current;
    let mounted;
    let dispose;
    let if_block0 = !/*isRootNode*/
    ctx[5] && create_if_block_44(ctx);
    let if_block1 = (
      /*attributesEditable*/
      ctx[4] && create_if_block_34(ctx)
    );
    let if_block2 = (
      /*$draggedObject*/
      ctx[8] && /*$draggedObject*/
      ctx[8].category === "basic" && create_if_block_24(ctx)
    );
    let if_block3 = (
      /*$selectedAstElement*/
      ctx[0].content.length > 0 && create_if_block_15(ctx)
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
        div1 = element("div");
        if (if_block2)
          if_block2.c();
        t7 = space();
        if (if_block3)
          if_block3.c();
        t8 = space();
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
        div1 = claim_element(nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        if (if_block2)
          if_block2.l(div1_nodes);
        t7 = claim_space(div1_nodes);
        if (if_block3)
          if_block3.l(div1_nodes);
        div1_nodes.forEach(detach_dev);
        t8 = claim_space(nodes);
        claim_component(sidebarsection.$$.fragment, nodes);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span, "class", "sr-only");
        add_location(span, file11, 131, 12, 6489);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file11, 133, 14, 6688);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-6 h-6 hover:text-blue-700 active:text-blue-900");
        add_location(svg, file11, 132, 12, 6536);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "absolute p-2 top-2 right-1");
        add_location(button, file11, 127, 8, 6336);
        attr_dev(div0, "class", "border-b text-lg font-medium leading-5 p-4 relative");
        add_location(div0, file11, 113, 6, 5342);
        attr_dev(div1, "class", "relative");
        add_location(div1, file11, 154, 6, 7866);
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
        insert_hydration_dev(target, div1, anchor);
        if (if_block2)
          if_block2.m(div1, null);
        append_hydration_dev(div1, t7);
        if (if_block3)
          if_block3.m(div1, null);
        insert_hydration_dev(target, t8, anchor);
        mount_component(sidebarsection, target, anchor);
        current = true;
        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/
            ctx[20],
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
            if_block0 = create_if_block_44(ctx2);
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
            if_block1 = create_if_block_34(ctx2);
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
          /*$draggedObject*/
          ctx2[8] && /*$draggedObject*/
          ctx2[8].category === "basic"
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
          } else {
            if_block2 = create_if_block_24(ctx2);
            if_block2.c();
            if_block2.m(div1, t7);
          }
        } else if (if_block2) {
          if_block2.d(1);
          if_block2 = null;
        }
        if (
          /*$selectedAstElement*/
          ctx2[0].content.length > 0
        ) {
          if (if_block3) {
            if_block3.p(ctx2, dirty);
            if (dirty[0] & /*$selectedAstElement*/
            1) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block_15(ctx2);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(div1, null);
          }
        } else if (if_block3) {
          group_outros();
          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });
          check_outros();
        }
        const sidebarsection_changes = {};
        if (dirty[1] & /*$$scope*/
        64) {
          sidebarsection_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection.$set(sidebarsection_changes);
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block1);
        transition_in(if_block3);
        transition_in(sidebarsection.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block1);
        transition_out(if_block3);
        transition_out(sidebarsection.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div0);
          detach_dev(t5);
          detach_dev(t6);
          detach_dev(div1);
          detach_dev(t8);
        }
        if (if_block0)
          if_block0.d();
        if (if_block1)
          if_block1.d(detaching);
        if (if_block2)
          if_block2.d();
        if (if_block3)
          if_block3.d();
        destroy_component(sidebarsection, detaching);
        mounted = false;
        dispose();
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block7.name,
      type: "if",
      source: "(127:4) {#if $selectedAstElement}",
      ctx
    });
    return block;
  }
  function create_if_block_44(ctx) {
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
        if (get_svelte_dataset(span1) !== "svelte-u4jcl2")
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
        add_location(span0, file11, 120, 12, 5603);
        attr_dev(span1, "class", "absolute opacity-0 invisible right-9 min-w-[100px] bg-amber-100 py-1 px-1.5 rounded text-xs text-medium transition group-hover:opacity-100 group-hover:visible");
        add_location(span1, file11, 121, 12, 5657);
        attr_dev(path, "fill-rule", "evenodd");
        attr_dev(path, "d", "M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z");
        attr_dev(path, "clip-rule", "evenodd");
        add_location(path, file11, 123, 14, 6014);
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "viewBox", "0 0 24 24");
        attr_dev(svg, "fill", "currentColor");
        attr_dev(svg, "class", "w-6 h-6 hover:text-blue-700 active:text-blue-900");
        add_location(svg, file11, 122, 12, 5862);
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "absolute p-2 top-2 right-9 group");
        add_location(button, file11, 116, 10, 5467);
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
      id: create_if_block_44.name,
      type: "if",
      source: "(130:8) {#if !isRootNode}",
      ctx
    });
    return block;
  }
  function create_if_block_34(ctx) {
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
          heading: [create_heading_slot_3]
        },
        $$scope: { ctx }
      },
      $$inline: true
    });
    sidebarsection.$on(
      "update",
      /*addClass*/
      ctx[9]
    );
    let each_value = ensure_array_like_dev(
      /*editableAttrs*/
      ctx[7]
    );
    const get_key = (ctx2) => (
      /*entry*/
      ctx2[29]
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
        64) {
          sidebarsection_changes.$$scope = { dirty, ctx: ctx2 };
        }
        sidebarsection.$set(sidebarsection_changes);
        if (dirty[0] & /*editableAttrs, updateAttribute*/
        8320) {
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
      id: create_if_block_34.name,
      type: "if",
      source: "(152:6) {#if attributesEditable}",
      ctx
    });
    return block;
  }
  function create_heading_slot_3(ctx) {
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
      id: create_heading_slot_3.name,
      type: "slot",
      source: '(154:10) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_default_slot3(ctx) {
    let t_value = (
      /*className*/
      ctx[34] + ""
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
        ctx2[34] + ""))
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
      source: "(157:14) <Pill on:delete={() => deleteClass(className)}>",
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
        ctx[21](
          /*className*/
          ctx[34]
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
        64) {
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
      source: "(156:12) {#each classList as className}",
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
      source: '(155:10) <svelte:fragment slot=\\"value\\">',
      ctx
    });
    return block;
  }
  function create_heading_slot_2(ctx) {
    let t_value = (
      /*name*/
      ctx[30] + ""
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
        ctx2[30] + ""))
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
      id: create_heading_slot_2.name,
      type: "slot",
      source: '(164:12) <svelte:fragment slot=\\"heading\\">',
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
        ctx[22](
          /*name*/
          ctx[30],
          ...args
        )
      );
    }
    sidebarsection = new SidebarSection_default({
      props: {
        clearOnUpdate: true,
        value: (
          /*value*/
          ctx[31]
        ),
        placeholder: "Set " + /*name*/
        ctx[30],
        $$slots: { heading: [create_heading_slot_2] },
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
          ctx[31];
        if (dirty[0] & /*editableAttrs*/
        128)
          sidebarsection_changes.placeholder = "Set " + /*name*/
          ctx[30];
        if (dirty[0] & /*editableAttrs*/
        128 | dirty[1] & /*$$scope*/
        64) {
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
      source: "(161:8) {#each editableAttrs as entry (entry)}",
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
        add_location(div0, file11, 164, 12, 8277);
        attr_dev(div1, "class", "absolute bg-white opacity-70 w-full h-full p-4");
        attr_dev(div1, "role", "list");
        toggle_class(
          div1,
          "opacity-90",
          /*isDraggingOver*/
          ctx[3]
        );
        add_location(div1, file11, 156, 10, 7967);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div1, anchor);
        append_hydration_dev(div1, div0);
        if (!mounted) {
          dispose = [
            listen_dev(div1, "drop", prevent_default(
              /*dropInside*/
              ctx[15]
            ), false, true, false, false),
            listen_dev(
              div1,
              "dragover",
              /*dragOver*/
              ctx[16],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              div1,
              "dragleave",
              /*dragleave_handler*/
              ctx[23],
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
      source: '(170:8) {#if $draggedObject && $draggedObject.category === \\"basic\\"}',
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
      ctx[24]
    );
    sidebarsection.$on(
      "nodesChange",
      /*changeNodes*/
      ctx[17]
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
        64) {
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
      source: "(184:8) {#if $selectedAstElement.content.length > 0}",
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
      source: '(190:12) <svelte:fragment slot=\\"heading\\">',
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
      source: '(196:8) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_input_slot(ctx) {
    let button;
    let textContent = "Delete";
    let mounted;
    let dispose;
    const block = {
      c: function create3() {
        button = element("button");
        button.textContent = textContent;
        this.h();
      },
      l: function claim(nodes) {
        button = claim_element(nodes, "BUTTON", {
          type: true,
          class: true,
          ["data-svelte-h"]: true
        });
        if (get_svelte_dataset(button) !== "svelte-ncmta1")
          button.textContent = textContent;
        this.h();
      },
      h: function hydrate() {
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded outline-dashed outline-2 w-full");
        add_location(button, file11, 183, 10, 9027);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, button, anchor);
        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*deleteComponent*/
            ctx[14],
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
      id: create_input_slot.name,
      type: "slot",
      source: '(197:8) <svelte:fragment slot=\\"input\\">',
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
        attr_dev(div0, "class", "sticky top-0");
        add_location(div0, file11, 111, 2, 5279);
        attr_dev(div1, "class", "w-64 bg-white");
        attr_dev(div1, "data-test-id", "right-sidebar");
        add_location(div1, file11, 110, 0, 5220);
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
    component_subscribe($$self, page, ($$value) => $$invalidate(25, $page = $$value));
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
    function addClass({ detail: newClass }) {
      return __awaiter(this, void 0, void 0, function* () {
        let node = $selectedAstElement;
        if (node) {
          node.attrs.class = node.attrs.class ? `${node.attrs.class} ${newClass}` : newClass;
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
        $$invalidate(18, live = $$props2.live);
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
      addClass,
      parentNodeId,
      selectParentNode,
      deleteClass,
      updateText,
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
        $$invalidate(19, _a = $$props2._a);
      if ("live" in $$props2)
        $$invalidate(18, live = $$props2.live);
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
      524289) {
        $: {
          let classAttr = $$invalidate(19, _a = $selectedAstElement === null || $selectedAstElement === void 0 ? void 0 : $selectedAstElement.attrs) === null || _a === void 0 ? void 0 : _a.class;
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
          $$invalidate(4, attributesEditable = ($selectedAstElement === null || $selectedAstElement === void 0 ? void 0 : $selectedAstElement.tag) !== "eex");
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
      addClass,
      selectParentNode,
      deleteClass,
      updateText,
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
      init2(this, options, instance11, create_fragment11, safe_not_equal, { live: 18 }, null, [-1, -1]);
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PropertiesSidebar",
        options,
        id: create_fragment11.name
      });
    }
    get live() {
      return this.$$.ctx[18];
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
        add_location(div, file12, 24, 0, 769);
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
    let $siteStylesheetStore;
    let $pageStylesheetStore;
    let $pageStore;
    validate_store(siteStylesheet, "siteStylesheetStore");
    component_subscribe($$self, siteStylesheet, ($$value) => $$invalidate(6, $siteStylesheetStore = $$value));
    validate_store(pageStylesheet, "pageStylesheetStore");
    component_subscribe($$self, pageStylesheet, ($$value) => $$invalidate(7, $pageStylesheetStore = $$value));
    validate_store(page, "pageStore");
    component_subscribe($$self, page, ($$value) => $$invalidate(8, $pageStore = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("UiBuilder", slots, []);
    let { components } = $$props;
    let { page: page2 } = $$props;
    let { pageStylesheet: pageStylesheet2 } = $$props;
    let { siteStylesheet: siteStylesheet2 } = $$props;
    let { live } = $$props;
    $$self.$$.on_mount.push(function() {
      if (components === void 0 && !("components" in $$props || $$self.$$.bound[$$self.$$.props["components"]])) {
        console.warn("<UiBuilder> was created without expected prop 'components'");
      }
      if (page2 === void 0 && !("page" in $$props || $$self.$$.bound[$$self.$$.props["page"]])) {
        console.warn("<UiBuilder> was created without expected prop 'page'");
      }
      if (pageStylesheet2 === void 0 && !("pageStylesheet" in $$props || $$self.$$.bound[$$self.$$.props["pageStylesheet"]])) {
        console.warn("<UiBuilder> was created without expected prop 'pageStylesheet'");
      }
      if (siteStylesheet2 === void 0 && !("siteStylesheet" in $$props || $$self.$$.bound[$$self.$$.props["siteStylesheet"]])) {
        console.warn("<UiBuilder> was created without expected prop 'siteStylesheet'");
      }
      if (live === void 0 && !("live" in $$props || $$self.$$.bound[$$self.$$.props["live"]])) {
        console.warn("<UiBuilder> was created without expected prop 'live'");
      }
    });
    const writable_props = ["components", "page", "pageStylesheet", "siteStylesheet", "live"];
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
      if ("pageStylesheet" in $$props2)
        $$invalidate(3, pageStylesheet2 = $$props2.pageStylesheet);
      if ("siteStylesheet" in $$props2)
        $$invalidate(4, siteStylesheet2 = $$props2.siteStylesheet);
      if ("live" in $$props2)
        $$invalidate(1, live = $$props2.live);
    };
    $$self.$capture_state = () => ({
      ComponentsSidebar: ComponentsSidebar_default,
      Backdrop: Backdrop_default,
      PagePreview: PagePreview_default,
      PropertiesSidebar: PropertiesSidebar_default,
      pageStore: page,
      pageStylesheetStore: pageStylesheet,
      siteStylesheetStore: siteStylesheet,
      components,
      page: page2,
      pageStylesheet: pageStylesheet2,
      siteStylesheet: siteStylesheet2,
      live,
      addBasicComponentToTarget,
      $siteStylesheetStore,
      $pageStylesheetStore,
      $pageStore
    });
    $$self.$inject_state = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(0, components = $$props2.components);
      if ("page" in $$props2)
        $$invalidate(2, page2 = $$props2.page);
      if ("pageStylesheet" in $$props2)
        $$invalidate(3, pageStylesheet2 = $$props2.pageStylesheet);
      if ("siteStylesheet" in $$props2)
        $$invalidate(4, siteStylesheet2 = $$props2.siteStylesheet);
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
      if ($$self.$$.dirty & /*pageStylesheet*/
      8) {
        $:
          set_store_value(pageStylesheet, $pageStylesheetStore = pageStylesheet2, $pageStylesheetStore);
      }
      if ($$self.$$.dirty & /*siteStylesheet*/
      16) {
        $:
          set_store_value(siteStylesheet, $siteStylesheetStore = siteStylesheet2, $siteStylesheetStore);
      }
    };
    return [
      components,
      live,
      page2,
      pageStylesheet2,
      siteStylesheet2,
      droppedIntoTarget_handler
    ];
  }
  var UiBuilder = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance12, create_fragment12, safe_not_equal, {
        components: 0,
        page: 2,
        pageStylesheet: 3,
        siteStylesheet: 4,
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
    get pageStylesheet() {
      return this.$$.ctx[3];
    }
    set pageStylesheet(pageStylesheet2) {
      this.$$set({ pageStylesheet: pageStylesheet2 });
      flush();
    }
    get siteStylesheet() {
      return this.$$.ctx[4];
    }
    set siteStylesheet(siteStylesheet2) {
      this.$$set({ siteStylesheet: siteStylesheet2 });
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
  create_custom_element(UiBuilder, { "components": {}, "page": {}, "pageStylesheet": {}, "siteStylesheet": {}, "live": {} }, [], [], true);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vYXNzZXRzL2pzL2JlYWNvbl9saXZlX2FkbWluLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy9fdmlydHVhbC9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3RhdGUtbG9jYWwvbGliL2VzL3N0YXRlLWxvY2FsLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy9jb25maWcvaW5kZXguanMiLCAiLi4vLi4vZGVwcy9saXZlX21vbmFjb19lZGl0b3IvYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3V0aWxzL2N1cnJ5LmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy91dGlscy9pc09iamVjdC5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdmFsaWRhdG9ycy9pbmRleC5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvY29tcG9zZS5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvZGVlcE1lcmdlLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy91dGlscy9tYWtlQ2FuY2VsYWJsZS5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvbG9hZGVyL2luZGV4LmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9qcy9saXZlX21vbmFjb19lZGl0b3IvZWRpdG9yL3RoZW1lcy5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvanMvbGl2ZV9tb25hY29fZWRpdG9yL2VkaXRvci9jb2RlX2VkaXRvci5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvanMvbGl2ZV9tb25hY29fZWRpdG9yL2hvb2tzL2NvZGVfZWRpdG9yLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9zdmVsdGUvYXNzZXRzL2pzL2xpdmVfc3ZlbHRlL3V0aWxzLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9zdmVsdGUvYXNzZXRzL2pzL2xpdmVfc3ZlbHRlL3JlbmRlci5qcyIsICIuLi8uLi9kZXBzL2xpdmVfc3ZlbHRlL2Fzc2V0cy9qcy9saXZlX3N2ZWx0ZS9ob29rcy5qcyIsICJpbXBvcnQtZ2xvYjouLi9zdmVsdGUvKiovKi5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvdXRpbHMuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvZW52aXJvbm1lbnQuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvbG9vcC5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9nbG9iYWxzLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL1Jlc2l6ZU9ic2VydmVyU2luZ2xldG9uLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2RvbS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zdHlsZV9tYW5hZ2VyLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2xpZmVjeWNsZS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zY2hlZHVsZXIuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvdHJhbnNpdGlvbnMuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvZWFjaC5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zcHJlYWQuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3NoYXJlZC9ib29sZWFuX2F0dHJpYnV0ZXMuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3NoYXJlZC91dGlscy9uYW1lcy5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9Db21wb25lbnQuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3NoYXJlZC92ZXJzaW9uLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2Rldi5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9kaXNjbG9zZS12ZXJzaW9uL2luZGV4LmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL3RyYW5zaXRpb24vaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvc3RvcmUvaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL0JhY2tkcm9wLnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvQnJvd3NlckZyYW1lLnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvX3ZpcnR1YWwvX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N0YXRlLWxvY2FsL2xpYi9lcy9zdGF0ZS1sb2NhbC5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvY29uZmlnL2luZGV4LmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy91dGlscy9jdXJyeS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvaXNPYmplY3QuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3ZhbGlkYXRvcnMvaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3V0aWxzL2NvbXBvc2UuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3V0aWxzL2RlZXBNZXJnZS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvbWFrZUNhbmNlbGFibGUuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL2xvYWRlci9pbmRleC5qcyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvQ29kZUVkaXRvci5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS91dGlscy9hbmltYXRpb25zLnRzIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvc3RvcmVzL2N1cnJlbnRDb21wb25lbnRDYXRlZ29yeS50cyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL3N0b3Jlcy9kcmFnQW5kRHJvcC50cyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvc3RvcmVzL3BhZ2UudHMiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL0xheW91dEFzdE5vZGUuc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvY29tcG9uZW50cy9QYWdlQXN0Tm9kZS5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VQcmV2aWV3LnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL3N0b3Jlcy9wYWdlU3R5bGVzaGVldC50cyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL3N0b3Jlcy9zaXRlU3R5bGVzaGVldC50cyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvUGFnZVdyYXBwZXIuc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvY29tcG9uZW50cy9QaWxsLnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvU2lkZWJhclNlY3Rpb24uc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvY29tcG9uZW50cy9Qcm9wZXJ0aWVzU2lkZWJhci5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL1VpQnVpbGRlci5zdmVsdGUiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiB0b3BiYXIgMi4wLjAsIDIwMjMtMDItMDRcbiAqIGh0dHBzOi8vYnV1bmd1eWVuLmdpdGh1Yi5pby90b3BiYXJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBCdXUgTmd1eWVuXG4gKi9cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MVxuICAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbXCJtc1wiLCBcIm1velwiLCBcIndlYmtpdFwiLCBcIm9cIl07XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiXSB8fFxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgIH1cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgfTtcbiAgfSkoKTtcblxuICB2YXIgY2FudmFzLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGwsXG4gICAgZmFkZVRpbWVySWQgPSBudWxsLFxuICAgIGRlbGF5VGltZXJJZCA9IG51bGwsXG4gICAgYWRkRXZlbnQgPSBmdW5jdGlvbiAoZWxlbSwgdHlwZSwgaGFuZGxlcikge1xuICAgICAgaWYgKGVsZW0uYWRkRXZlbnRMaXN0ZW5lcikgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgIGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIGVsZW0uYXR0YWNoRXZlbnQoXCJvblwiICsgdHlwZSwgaGFuZGxlcik7XG4gICAgICBlbHNlIGVsZW1bXCJvblwiICsgdHlwZV0gPSBoYW5kbGVyO1xuICAgIH0sXG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGF1dG9SdW46IHRydWUsXG4gICAgICBiYXJUaGlja25lc3M6IDMsXG4gICAgICBiYXJDb2xvcnM6IHtcbiAgICAgICAgMDogXCJyZ2JhKDI2LCAgMTg4LCAxNTYsIC45KVwiLFxuICAgICAgICBcIi4yNVwiOiBcInJnYmEoNTIsICAxNTIsIDIxOSwgLjkpXCIsXG4gICAgICAgIFwiLjUwXCI6IFwicmdiYSgyNDEsIDE5NiwgMTUsICAuOSlcIixcbiAgICAgICAgXCIuNzVcIjogXCJyZ2JhKDIzMCwgMTI2LCAzNCwgIC45KVwiLFxuICAgICAgICBcIjEuMFwiOiBcInJnYmEoMjExLCA4NCwgIDAsICAgLjkpXCIsXG4gICAgICB9LFxuICAgICAgc2hhZG93Qmx1cjogMTAsXG4gICAgICBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsICAgMCwgICAwLCAgIC42KVwiLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sXG4gICAgcmVwYWludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IG9wdGlvbnMuYmFyVGhpY2tuZXNzICogNTsgLy8gbmVlZCBzcGFjZSBmb3Igc2hhZG93XG5cbiAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY3R4LnNoYWRvd0JsdXIgPSBvcHRpb25zLnNoYWRvd0JsdXI7XG4gICAgICBjdHguc2hhZG93Q29sb3IgPSBvcHRpb25zLnNoYWRvd0NvbG9yO1xuXG4gICAgICB2YXIgbGluZUdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIGNhbnZhcy53aWR0aCwgMCk7XG4gICAgICBmb3IgKHZhciBzdG9wIGluIG9wdGlvbnMuYmFyQ29sb3JzKVxuICAgICAgICBsaW5lR3JhZGllbnQuYWRkQ29sb3JTdG9wKHN0b3AsIG9wdGlvbnMuYmFyQ29sb3JzW3N0b3BdKTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSBvcHRpb25zLmJhclRoaWNrbmVzcztcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oMCwgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyKTtcbiAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgIE1hdGguY2VpbChjdXJyZW50UHJvZ3Jlc3MgKiBjYW52YXMud2lkdGgpLFxuICAgICAgICBvcHRpb25zLmJhclRoaWNrbmVzcyAvIDJcbiAgICAgICk7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBsaW5lR3JhZGllbnQ7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfSxcbiAgICBjcmVhdGVDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgdmFyIHN0eWxlID0gY2FudmFzLnN0eWxlO1xuICAgICAgc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICBzdHlsZS50b3AgPSBzdHlsZS5sZWZ0ID0gc3R5bGUucmlnaHQgPSBzdHlsZS5tYXJnaW4gPSBzdHlsZS5wYWRkaW5nID0gMDtcbiAgICAgIHN0eWxlLnpJbmRleCA9IDEwMDAwMTtcbiAgICAgIHN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkgY2FudmFzLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5jbGFzc05hbWUpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgICAgYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCByZXBhaW50KTtcbiAgICB9LFxuICAgIHRvcGJhciA9IHtcbiAgICAgIGNvbmZpZzogZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9wdHMpXG4gICAgICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkgb3B0aW9uc1trZXldID0gb3B0c1trZXldO1xuICAgICAgfSxcbiAgICAgIHNob3c6IGZ1bmN0aW9uIChkZWxheSkge1xuICAgICAgICBpZiAoc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBpZiAoZGVsYXkpIHtcbiAgICAgICAgICBpZiAoZGVsYXlUaW1lcklkKSByZXR1cm47XG4gICAgICAgICAgZGVsYXlUaW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB0b3BiYXIuc2hvdygpLCBkZWxheSk7XG4gICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICAgIGlmIChmYWRlVGltZXJJZCAhPT0gbnVsbCkgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGZhZGVUaW1lcklkKTtcbiAgICAgICAgICBpZiAoIWNhbnZhcykgY3JlYXRlQ2FudmFzKCk7XG4gICAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgIHRvcGJhci5wcm9ncmVzcygwKTtcbiAgICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICAgICAgcHJvZ3Jlc3NUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICAgIFwiK1wiICsgMC4wNSAqIE1hdGgucG93KDEgLSBNYXRoLnNxcnQoY3VycmVudFByb2dyZXNzKSwgMilcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uICh0bykge1xuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gY3VycmVudFByb2dyZXNzO1xuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdG8gPVxuICAgICAgICAgICAgKHRvLmluZGV4T2YoXCIrXCIpID49IDAgfHwgdG8uaW5kZXhPZihcIi1cIikgPj0gMFxuICAgICAgICAgICAgICA/IGN1cnJlbnRQcm9ncmVzc1xuICAgICAgICAgICAgICA6IDApICsgcGFyc2VGbG9hdCh0byk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2dyZXNzID0gdG8gPiAxID8gMSA6IHRvO1xuICAgICAgICByZXBhaW50KCk7XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICB9LFxuICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVsYXlUaW1lcklkKTtcbiAgICAgICAgZGVsYXlUaW1lcklkID0gbnVsbDtcbiAgICAgICAgaWYgKCFzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHByb2dyZXNzVGltZXJJZCAhPSBudWxsKSB7XG4gICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHByb2dyZXNzVGltZXJJZCk7XG4gICAgICAgICAgcHJvZ3Jlc3NUaW1lcklkID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAoZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgICBpZiAodG9wYmFyLnByb2dyZXNzKFwiKy4xXCIpID49IDEpIHtcbiAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5vcGFjaXR5IC09IDAuMDU7XG4gICAgICAgICAgICBpZiAoY2FudmFzLnN0eWxlLm9wYWNpdHkgPD0gMC4wNSkge1xuICAgICAgICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICBmYWRlVGltZXJJZCA9IG51bGw7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZmFkZVRpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICB9KSgpO1xuICAgICAgfSxcbiAgICB9O1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gdG9wYmFyO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0b3BiYXI7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50b3BiYXIgPSB0b3BiYXI7XG4gIH1cbn0uY2FsbCh0aGlzLCB3aW5kb3csIGRvY3VtZW50KSk7XG4iLCAiaW1wb3J0IHRvcGJhciBmcm9tIFwiLi4vdmVuZG9yL3RvcGJhclwiXG5pbXBvcnQgeyBDb2RlRWRpdG9ySG9vayB9IGZyb20gXCIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9wcml2L3N0YXRpYy9saXZlX21vbmFjb19lZGl0b3IuZXNtXCJcbmltcG9ydCB7IGdldEhvb2tzIH0gZnJvbSBcImxpdmVfc3ZlbHRlXCJcbmltcG9ydCAqIGFzIENvbXBvbmVudHMgZnJvbSBcIi4uL3N2ZWx0ZS8qKi8qLnN2ZWx0ZVwiXG5sZXQgSG9va3MgPSB7fVxuSG9va3MuQ29kZUVkaXRvckhvb2sgPSBDb2RlRWRpdG9ySG9va1xudG9wYmFyLmNvbmZpZyh7IGJhckNvbG9yczogeyAwOiBcIiMyOWRcIiB9LCBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsIDAsIDAsIC4zKVwiIH0pXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwgKF9pbmZvKSA9PiB0b3BiYXIuc2hvdygzMDApKVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgKF9pbmZvKSA9PiB0b3BiYXIuaGlkZSgpKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJlYWNvbl9hZG1pbjpjbGlwY29weVwiLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgcmVzdWx0X2lkID0gYCR7ZXZlbnQudGFyZ2V0LmlkfS1jb3B5LXRvLWNsaXBib2FyZC1yZXN1bHRgXG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVzdWx0X2lkKVxuXG4gIGlmIChcImNsaXBib2FyZFwiIGluIG5hdmlnYXRvcikge1xuICAgIGlmIChldmVudC50YXJnZXQudGFnTmFtZSA9PT0gXCJJTlBVVFwiKSB7XG4gICAgICB0eHQgPSBldmVudC50YXJnZXQudmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgdHh0ID0gZXZlbnQudGFyZ2V0LnRleHRDb250ZW50XG4gICAgfVxuXG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZFxuICAgICAgLndyaXRlVGV4dCh0eHQpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiQ29waWVkIHRvIGNsaXBib2FyZFwiXG4gICAgICAgIC8vIE1ha2UgaXQgdmlzaWJsZVxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiaW52aXNpYmxlXCIsIFwidGV4dC1yZWQtNTAwXCIsIFwib3BhY2l0eS0wXCIpXG4gICAgICAgIC8vIEZhZGUgaW4gYW5kIHRyYW5zbGF0ZSB1cHdhcmRzXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWdyZWVuLTUwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwiLXRyYW5zbGF0ZS15LTJcIilcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1ncmVlbi01MDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIi10cmFuc2xhdGUteS0yXCIpXG4gICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImludmlzaWJsZVwiLCBcInRleHQtcmVkLTUwMFwiLCBcIm9wYWNpdHktMFwiKVxuICAgICAgICB9LCAyMDAwKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiQ291bGQgbm90IGNvcHlcIlxuICAgICAgICAvLyBNYWtlIGl0IHZpc2libGVcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShcImludmlzaWJsZVwiLCBcInRleHQtZ3JlZW4tNTAwXCIsIFwib3BhY2l0eS0wXCIpXG4gICAgICAgIC8vIEZhZGUgaW4gYW5kIHRyYW5zbGF0ZSB1cHdhcmRzXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LXJlZC01MDBcIiwgXCJvcGFjaXR5LTEwMFwiLCBcIi10cmFuc2xhdGUteS0yXCIpXG4gICAgICB9KVxuICB9IGVsc2Uge1xuICAgIGFsZXJ0KFwiU29ycnksIHlvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGNsaXBib2FyZCBjb3B5LlwiKVxuICB9XG59KVxuXG5sZXQgc29ja2V0UGF0aCA9XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLmdldEF0dHJpYnV0ZShcInBoeC1zb2NrZXRcIikgfHwgXCIvbGl2ZVwiXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnRcbiAgLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9J2NzcmYtdG9rZW4nXVwiKVxuICAuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxubGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVZpZXcuTGl2ZVNvY2tldChzb2NrZXRQYXRoLCBQaG9lbml4LlNvY2tldCwge1xuICBob29rczogeyAuLi5nZXRIb29rcyhDb21wb25lbnRzKSwgLi4uSG9va3MgfSxcbiAgcGFyYW1zOiB7IF9jc3JmX3Rva2VuOiBjc3JmVG9rZW4gfSxcbn0pXG5saXZlU29ja2V0LmNvbm5lY3QoKVxud2luZG93LmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4iLCAiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KTtcbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZDIodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307XG5cbiAgICBpZiAoaSAlIDIpIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307XG4gIHZhciB0YXJnZXQgPSB7fTtcbiAgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICB2YXIga2V5LCBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAga2V5ID0gc291cmNlS2V5c1tpXTtcbiAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlO1xuICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcblxuICB2YXIgdGFyZ2V0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCk7XG5cbiAgdmFyIGtleSwgaTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzb3VyY2VTeW1ib2xLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHNvdXJjZVN5bWJvbEtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IHNvdXJjZVN5bWJvbEtleXNbaV07XG4gICAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlO1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoc291cmNlLCBrZXkpKSBjb250aW51ZTtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7XG4gIHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7XG59XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkge1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkpIHJldHVybjtcbiAgdmFyIF9hcnIgPSBbXTtcbiAgdmFyIF9uID0gdHJ1ZTtcbiAgdmFyIF9kID0gZmFsc2U7XG4gIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIF9kID0gdHJ1ZTtcbiAgICBfZSA9IGVycjtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBfYXJyO1xufVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICByZXR1cm4gYXJyMjtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxuZXhwb3J0IHsgX2FycmF5TGlrZVRvQXJyYXkgYXMgYXJyYXlMaWtlVG9BcnJheSwgX2FycmF5V2l0aEhvbGVzIGFzIGFycmF5V2l0aEhvbGVzLCBfZGVmaW5lUHJvcGVydHkgYXMgZGVmaW5lUHJvcGVydHksIF9pdGVyYWJsZVRvQXJyYXlMaW1pdCBhcyBpdGVyYWJsZVRvQXJyYXlMaW1pdCwgX25vbkl0ZXJhYmxlUmVzdCBhcyBub25JdGVyYWJsZVJlc3QsIF9vYmplY3RTcHJlYWQyIGFzIG9iamVjdFNwcmVhZDIsIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyBhcyBvYmplY3RXaXRob3V0UHJvcGVydGllcywgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UgYXMgb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSwgX3NsaWNlZFRvQXJyYXkgYXMgc2xpY2VkVG9BcnJheSwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IGFzIHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IH07XG4iLCAiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICBpZiAoZW51bWVyYWJsZU9ubHkpIHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTtcbiAgICB9KTtcbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZDIodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307XG5cbiAgICBpZiAoaSAlIDIpIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZm5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGZucy5yZWR1Y2VSaWdodChmdW5jdGlvbiAoeSwgZikge1xuICAgICAgcmV0dXJuIGYoeSk7XG4gICAgfSwgeCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGN1cnJ5KGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjdXJyaWVkKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJncy5sZW5ndGggPj0gZm4ubGVuZ3RoID8gZm4uYXBwbHkodGhpcywgYXJncykgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIG5leHRBcmdzID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgIG5leHRBcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjdXJyaWVkLmFwcGx5KF90aGlzLCBbXS5jb25jYXQoYXJncywgbmV4dEFyZ3MpKTtcbiAgICB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkuaW5jbHVkZXMoJ09iamVjdCcpO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICByZXR1cm4gIU9iamVjdC5rZXlzKG9iaikubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iamVjdCwgcHJvcGVydHkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVDaGFuZ2VzKGluaXRpYWwsIGNoYW5nZXMpIHtcbiAgaWYgKCFpc09iamVjdChjaGFuZ2VzKSkgZXJyb3JIYW5kbGVyKCdjaGFuZ2VUeXBlJyk7XG4gIGlmIChPYmplY3Qua2V5cyhjaGFuZ2VzKS5zb21lKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHJldHVybiAhaGFzT3duUHJvcGVydHkoaW5pdGlhbCwgZmllbGQpO1xuICB9KSkgZXJyb3JIYW5kbGVyKCdjaGFuZ2VGaWVsZCcpO1xuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVTZWxlY3RvcihzZWxlY3Rvcikge1xuICBpZiAoIWlzRnVuY3Rpb24oc2VsZWN0b3IpKSBlcnJvckhhbmRsZXIoJ3NlbGVjdG9yVHlwZScpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUhhbmRsZXIoaGFuZGxlcikge1xuICBpZiAoIShpc0Z1bmN0aW9uKGhhbmRsZXIpIHx8IGlzT2JqZWN0KGhhbmRsZXIpKSkgZXJyb3JIYW5kbGVyKCdoYW5kbGVyVHlwZScpO1xuICBpZiAoaXNPYmplY3QoaGFuZGxlcikgJiYgT2JqZWN0LnZhbHVlcyhoYW5kbGVyKS5zb21lKGZ1bmN0aW9uIChfaGFuZGxlcikge1xuICAgIHJldHVybiAhaXNGdW5jdGlvbihfaGFuZGxlcik7XG4gIH0pKSBlcnJvckhhbmRsZXIoJ2hhbmRsZXJzVHlwZScpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUluaXRpYWwoaW5pdGlhbCkge1xuICBpZiAoIWluaXRpYWwpIGVycm9ySGFuZGxlcignaW5pdGlhbElzUmVxdWlyZWQnKTtcbiAgaWYgKCFpc09iamVjdChpbml0aWFsKSkgZXJyb3JIYW5kbGVyKCdpbml0aWFsVHlwZScpO1xuICBpZiAoaXNFbXB0eShpbml0aWFsKSkgZXJyb3JIYW5kbGVyKCdpbml0aWFsQ29udGVudCcpO1xufVxuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZXMsIHR5cGUpIHtcbiAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZXNbdHlwZV0gfHwgZXJyb3JNZXNzYWdlc1tcImRlZmF1bHRcIl0pO1xufVxuXG52YXIgZXJyb3JNZXNzYWdlcyA9IHtcbiAgaW5pdGlhbElzUmVxdWlyZWQ6ICdpbml0aWFsIHN0YXRlIGlzIHJlcXVpcmVkJyxcbiAgaW5pdGlhbFR5cGU6ICdpbml0aWFsIHN0YXRlIHNob3VsZCBiZSBhbiBvYmplY3QnLFxuICBpbml0aWFsQ29udGVudDogJ2luaXRpYWwgc3RhdGUgc2hvdWxkblxcJ3QgYmUgYW4gZW1wdHkgb2JqZWN0JyxcbiAgaGFuZGxlclR5cGU6ICdoYW5kbGVyIHNob3VsZCBiZSBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbicsXG4gIGhhbmRsZXJzVHlwZTogJ2FsbCBoYW5kbGVycyBzaG91bGQgYmUgYSBmdW5jdGlvbnMnLFxuICBzZWxlY3RvclR5cGU6ICdzZWxlY3RvciBzaG91bGQgYmUgYSBmdW5jdGlvbicsXG4gIGNoYW5nZVR5cGU6ICdwcm92aWRlZCB2YWx1ZSBvZiBjaGFuZ2VzIHNob3VsZCBiZSBhbiBvYmplY3QnLFxuICBjaGFuZ2VGaWVsZDogJ2l0IHNlYW1zIHlvdSB3YW50IHRvIGNoYW5nZSBhIGZpZWxkIGluIHRoZSBzdGF0ZSB3aGljaCBpcyBub3Qgc3BlY2lmaWVkIGluIHRoZSBcImluaXRpYWxcIiBzdGF0ZScsXG4gIFwiZGVmYXVsdFwiOiAnYW4gdW5rbm93biBlcnJvciBhY2N1cmVkIGluIGBzdGF0ZS1sb2NhbGAgcGFja2FnZSdcbn07XG52YXIgZXJyb3JIYW5kbGVyID0gY3VycnkodGhyb3dFcnJvcikoZXJyb3JNZXNzYWdlcyk7XG52YXIgdmFsaWRhdG9ycyA9IHtcbiAgY2hhbmdlczogdmFsaWRhdGVDaGFuZ2VzLFxuICBzZWxlY3RvcjogdmFsaWRhdGVTZWxlY3RvcixcbiAgaGFuZGxlcjogdmFsaWRhdGVIYW5kbGVyLFxuICBpbml0aWFsOiB2YWxpZGF0ZUluaXRpYWxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZShpbml0aWFsKSB7XG4gIHZhciBoYW5kbGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgdmFsaWRhdG9ycy5pbml0aWFsKGluaXRpYWwpO1xuICB2YWxpZGF0b3JzLmhhbmRsZXIoaGFuZGxlcik7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICBjdXJyZW50OiBpbml0aWFsXG4gIH07XG4gIHZhciBkaWRVcGRhdGUgPSBjdXJyeShkaWRTdGF0ZVVwZGF0ZSkoc3RhdGUsIGhhbmRsZXIpO1xuICB2YXIgdXBkYXRlID0gY3VycnkodXBkYXRlU3RhdGUpKHN0YXRlKTtcbiAgdmFyIHZhbGlkYXRlID0gY3VycnkodmFsaWRhdG9ycy5jaGFuZ2VzKShpbml0aWFsKTtcbiAgdmFyIGdldENoYW5nZXMgPSBjdXJyeShleHRyYWN0Q2hhbmdlcykoc3RhdGUpO1xuXG4gIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgIHZhciBzZWxlY3RvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfTtcbiAgICB2YWxpZGF0b3JzLnNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUuY3VycmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZShjYXVzZWRDaGFuZ2VzKSB7XG4gICAgY29tcG9zZShkaWRVcGRhdGUsIHVwZGF0ZSwgdmFsaWRhdGUsIGdldENoYW5nZXMpKGNhdXNlZENoYW5nZXMpO1xuICB9XG5cbiAgcmV0dXJuIFtnZXRTdGF0ZSwgc2V0U3RhdGVdO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0Q2hhbmdlcyhzdGF0ZSwgY2F1c2VkQ2hhbmdlcykge1xuICByZXR1cm4gaXNGdW5jdGlvbihjYXVzZWRDaGFuZ2VzKSA/IGNhdXNlZENoYW5nZXMoc3RhdGUuY3VycmVudCkgOiBjYXVzZWRDaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdGF0ZShzdGF0ZSwgY2hhbmdlcykge1xuICBzdGF0ZS5jdXJyZW50ID0gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIHN0YXRlLmN1cnJlbnQpLCBjaGFuZ2VzKTtcbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIGRpZFN0YXRlVXBkYXRlKHN0YXRlLCBoYW5kbGVyLCBjaGFuZ2VzKSB7XG4gIGlzRnVuY3Rpb24oaGFuZGxlcikgPyBoYW5kbGVyKHN0YXRlLmN1cnJlbnQpIDogT2JqZWN0LmtleXMoY2hhbmdlcykuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICB2YXIgX2hhbmRsZXIkZmllbGQ7XG5cbiAgICByZXR1cm4gKF9oYW5kbGVyJGZpZWxkID0gaGFuZGxlcltmaWVsZF0pID09PSBudWxsIHx8IF9oYW5kbGVyJGZpZWxkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfaGFuZGxlciRmaWVsZC5jYWxsKGhhbmRsZXIsIHN0YXRlLmN1cnJlbnRbZmllbGRdKTtcbiAgfSk7XG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG52YXIgaW5kZXggPSB7XG4gIGNyZWF0ZTogY3JlYXRlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbmRleDtcbiIsICJ2YXIgY29uZmlnID0ge1xuICBwYXRoczoge1xuICAgIHZzOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNDMuMC9taW4vdnMnXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiIsICJmdW5jdGlvbiBjdXJyeShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gY3VycmllZCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiBhcmdzLmxlbmd0aCA+PSBmbi5sZW5ndGggPyBmbi5hcHBseSh0aGlzLCBhcmdzKSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgbmV4dEFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgbmV4dEFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGN1cnJpZWQuYXBwbHkoX3RoaXMsIFtdLmNvbmNhdChhcmdzLCBuZXh0QXJncykpO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGN1cnJ5O1xuIiwgImZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKS5pbmNsdWRlcygnT2JqZWN0Jyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzT2JqZWN0O1xuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuLi91dGlscy9jdXJyeS5qcyc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnLi4vdXRpbHMvaXNPYmplY3QuanMnO1xuXG4vKipcbiAqIHZhbGlkYXRlcyB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgYW5kIGluZm9ybXMgYWJvdXQgZGVwcmVjYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSB0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgXG4gKiBAcmV0dXJuIHtPYmplY3R9IGNvbmZpZyAtIHRoZSB2YWxpZGF0ZWQgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbmZpZyhjb25maWcpIHtcbiAgaWYgKCFjb25maWcpIGVycm9ySGFuZGxlcignY29uZmlnSXNSZXF1aXJlZCcpO1xuICBpZiAoIWlzT2JqZWN0KGNvbmZpZykpIGVycm9ySGFuZGxlcignY29uZmlnVHlwZScpO1xuXG4gIGlmIChjb25maWcudXJscykge1xuICAgIGluZm9ybUFib3V0RGVwcmVjYXRpb24oKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGF0aHM6IHtcbiAgICAgICAgdnM6IGNvbmZpZy51cmxzLm1vbmFjb0Jhc2VcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbi8qKlxuICogbG9ncyBkZXByZWNhdGlvbiBtZXNzYWdlXG4gKi9cblxuXG5mdW5jdGlvbiBpbmZvcm1BYm91dERlcHJlY2F0aW9uKCkge1xuICBjb25zb2xlLndhcm4oZXJyb3JNZXNzYWdlcy5kZXByZWNhdGlvbik7XG59XG5cbmZ1bmN0aW9uIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlcywgdHlwZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlc1t0eXBlXSB8fCBlcnJvck1lc3NhZ2VzW1wiZGVmYXVsdFwiXSk7XG59XG5cbnZhciBlcnJvck1lc3NhZ2VzID0ge1xuICBjb25maWdJc1JlcXVpcmVkOiAndGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGlzIHJlcXVpcmVkJyxcbiAgY29uZmlnVHlwZTogJ3RoZSBjb25maWd1cmF0aW9uIG9iamVjdCBzaG91bGQgYmUgYW4gb2JqZWN0JyxcbiAgXCJkZWZhdWx0XCI6ICdhbiB1bmtub3duIGVycm9yIGFjY3VyZWQgaW4gYEBtb25hY28tZWRpdG9yL2xvYWRlcmAgcGFja2FnZScsXG4gIGRlcHJlY2F0aW9uOiBcIkRlcHJlY2F0aW9uIHdhcm5pbmchXFxuICAgIFlvdSBhcmUgdXNpbmcgZGVwcmVjYXRlZCB3YXkgb2YgY29uZmlndXJhdGlvbi5cXG5cXG4gICAgSW5zdGVhZCBvZiB1c2luZ1xcbiAgICAgIG1vbmFjby5jb25maWcoeyB1cmxzOiB7IG1vbmFjb0Jhc2U6ICcuLi4nIH0gfSlcXG4gICAgdXNlXFxuICAgICAgbW9uYWNvLmNvbmZpZyh7IHBhdGhzOiB7IHZzOiAnLi4uJyB9IH0pXFxuXFxuICAgIEZvciBtb3JlIHBsZWFzZSBjaGVjayB0aGUgbGluayBodHRwczovL2dpdGh1Yi5jb20vc3VyZW4tYXRveWFuL21vbmFjby1sb2FkZXIjY29uZmlnXFxuICBcIlxufTtcbnZhciBlcnJvckhhbmRsZXIgPSBjdXJyeSh0aHJvd0Vycm9yKShlcnJvck1lc3NhZ2VzKTtcbnZhciB2YWxpZGF0b3JzID0ge1xuICBjb25maWc6IHZhbGlkYXRlQ29uZmlnXG59O1xuXG5leHBvcnQgZGVmYXVsdCB2YWxpZGF0b3JzO1xuZXhwb3J0IHsgZXJyb3JIYW5kbGVyLCBlcnJvck1lc3NhZ2VzIH07XG4iLCAidmFyIGNvbXBvc2UgPSBmdW5jdGlvbiBjb21wb3NlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGZuc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBmbnMucmVkdWNlUmlnaHQoZnVuY3Rpb24gKHksIGYpIHtcbiAgICAgIHJldHVybiBmKHkpO1xuICAgIH0sIHgpO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcG9zZTtcbiIsICJpbXBvcnQgeyBvYmplY3RTcHJlYWQyIGFzIF9vYmplY3RTcHJlYWQyIH0gZnJvbSAnLi4vX3ZpcnR1YWwvX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy5qcyc7XG5cbmZ1bmN0aW9uIG1lcmdlKHRhcmdldCwgc291cmNlKSB7XG4gIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHNvdXJjZVtrZXldIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICBpZiAodGFyZ2V0W2tleV0pIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihzb3VyY2Vba2V5XSwgbWVyZ2UodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIF9vYmplY3RTcHJlYWQyKF9vYmplY3RTcHJlYWQyKHt9LCB0YXJnZXQpLCBzb3VyY2UpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZXJnZTtcbiIsICIvLyBUaGUgc291cmNlIChoYXMgYmVlbiBjaGFuZ2VkKSBpcyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzU0NjUjaXNzdWVjb21tZW50LTE1Nzg4ODMyNVxudmFyIENBTkNFTEFUSU9OX01FU1NBR0UgPSB7XG4gIHR5cGU6ICdjYW5jZWxhdGlvbicsXG4gIG1zZzogJ29wZXJhdGlvbiBpcyBtYW51YWxseSBjYW5jZWxlZCdcbn07XG5cbmZ1bmN0aW9uIG1ha2VDYW5jZWxhYmxlKHByb21pc2UpIHtcbiAgdmFyIGhhc0NhbmNlbGVkXyA9IGZhbHNlO1xuICB2YXIgd3JhcHBlZFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHJldHVybiBoYXNDYW5jZWxlZF8gPyByZWplY3QoQ0FOQ0VMQVRJT05fTUVTU0FHRSkgOiByZXNvbHZlKHZhbCk7XG4gICAgfSk7XG4gICAgcHJvbWlzZVtcImNhdGNoXCJdKHJlamVjdCk7XG4gIH0pO1xuICByZXR1cm4gd3JhcHBlZFByb21pc2UuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBoYXNDYW5jZWxlZF8gPSB0cnVlO1xuICB9LCB3cmFwcGVkUHJvbWlzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWFrZUNhbmNlbGFibGU7XG5leHBvcnQgeyBDQU5DRUxBVElPTl9NRVNTQUdFIH07XG4iLCAiaW1wb3J0IHsgc2xpY2VkVG9BcnJheSBhcyBfc2xpY2VkVG9BcnJheSwgb2JqZWN0V2l0aG91dFByb3BlcnRpZXMgYXMgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vX3ZpcnR1YWwvX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy5qcyc7XG5pbXBvcnQgc3RhdGUgZnJvbSAnc3RhdGUtbG9jYWwnO1xuaW1wb3J0IGNvbmZpZyQxIGZyb20gJy4uL2NvbmZpZy9pbmRleC5qcyc7XG5pbXBvcnQgdmFsaWRhdG9ycyBmcm9tICcuLi92YWxpZGF0b3JzL2luZGV4LmpzJztcbmltcG9ydCBjb21wb3NlIGZyb20gJy4uL3V0aWxzL2NvbXBvc2UuanMnO1xuaW1wb3J0IG1lcmdlIGZyb20gJy4uL3V0aWxzL2RlZXBNZXJnZS5qcyc7XG5pbXBvcnQgbWFrZUNhbmNlbGFibGUgZnJvbSAnLi4vdXRpbHMvbWFrZUNhbmNlbGFibGUuanMnO1xuXG4vKiogdGhlIGxvY2FsIHN0YXRlIG9mIHRoZSBtb2R1bGUgKi9cblxudmFyIF9zdGF0ZSRjcmVhdGUgPSBzdGF0ZS5jcmVhdGUoe1xuICBjb25maWc6IGNvbmZpZyQxLFxuICBpc0luaXRpYWxpemVkOiBmYWxzZSxcbiAgcmVzb2x2ZTogbnVsbCxcbiAgcmVqZWN0OiBudWxsLFxuICBtb25hY286IG51bGxcbn0pLFxuICAgIF9zdGF0ZSRjcmVhdGUyID0gX3NsaWNlZFRvQXJyYXkoX3N0YXRlJGNyZWF0ZSwgMiksXG4gICAgZ2V0U3RhdGUgPSBfc3RhdGUkY3JlYXRlMlswXSxcbiAgICBzZXRTdGF0ZSA9IF9zdGF0ZSRjcmVhdGUyWzFdO1xuLyoqXG4gKiBzZXQgdGhlIGxvYWRlciBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKi9cblxuXG5mdW5jdGlvbiBjb25maWcoZ2xvYmFsQ29uZmlnKSB7XG4gIHZhciBfdmFsaWRhdG9ycyRjb25maWcgPSB2YWxpZGF0b3JzLmNvbmZpZyhnbG9iYWxDb25maWcpLFxuICAgICAgbW9uYWNvID0gX3ZhbGlkYXRvcnMkY29uZmlnLm1vbmFjbyxcbiAgICAgIGNvbmZpZyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhfdmFsaWRhdG9ycyRjb25maWcsIFtcIm1vbmFjb1wiXSk7XG5cbiAgc2V0U3RhdGUoZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzogbWVyZ2Uoc3RhdGUuY29uZmlnLCBjb25maWcpLFxuICAgICAgbW9uYWNvOiBtb25hY29cbiAgICB9O1xuICB9KTtcbn1cbi8qKlxuICogaGFuZGxlcyB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIG1vbmFjby1lZGl0b3JcbiAqIEByZXR1cm4ge1Byb21pc2V9IC0gcmV0dXJucyBhbiBpbnN0YW5jZSBvZiBtb25hY28gKHdpdGggYSBjYW5jZWxhYmxlIHByb21pc2UpXG4gKi9cblxuXG5mdW5jdGlvbiBpbml0KCkge1xuICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBtb25hY28gPSBfcmVmLm1vbmFjbyxcbiAgICAgICAgaXNJbml0aWFsaXplZCA9IF9yZWYuaXNJbml0aWFsaXplZCxcbiAgICAgICAgcmVzb2x2ZSA9IF9yZWYucmVzb2x2ZTtcbiAgICByZXR1cm4ge1xuICAgICAgbW9uYWNvOiBtb25hY28sXG4gICAgICBpc0luaXRpYWxpemVkOiBpc0luaXRpYWxpemVkLFxuICAgICAgcmVzb2x2ZTogcmVzb2x2ZVxuICAgIH07XG4gIH0pO1xuXG4gIGlmICghc3RhdGUuaXNJbml0aWFsaXplZCkge1xuICAgIHNldFN0YXRlKHtcbiAgICAgIGlzSW5pdGlhbGl6ZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIGlmIChzdGF0ZS5tb25hY28pIHtcbiAgICAgIHN0YXRlLnJlc29sdmUoc3RhdGUubW9uYWNvKTtcbiAgICAgIHJldHVybiBtYWtlQ2FuY2VsYWJsZSh3cmFwcGVyUHJvbWlzZSk7XG4gICAgfVxuXG4gICAgaWYgKHdpbmRvdy5tb25hY28gJiYgd2luZG93Lm1vbmFjby5lZGl0b3IpIHtcbiAgICAgIHN0b3JlTW9uYWNvSW5zdGFuY2Uod2luZG93Lm1vbmFjbyk7XG4gICAgICBzdGF0ZS5yZXNvbHZlKHdpbmRvdy5tb25hY28pO1xuICAgICAgcmV0dXJuIG1ha2VDYW5jZWxhYmxlKHdyYXBwZXJQcm9taXNlKTtcbiAgICB9XG5cbiAgICBjb21wb3NlKGluamVjdFNjcmlwdHMsIGdldE1vbmFjb0xvYWRlclNjcmlwdCkoY29uZmlndXJlTG9hZGVyKTtcbiAgfVxuXG4gIHJldHVybiBtYWtlQ2FuY2VsYWJsZSh3cmFwcGVyUHJvbWlzZSk7XG59XG4vKipcbiAqIGluamVjdHMgcHJvdmlkZWQgc2NyaXB0cyBpbnRvIHRoZSBkb2N1bWVudC5ib2R5XG4gKiBAcGFyYW0ge09iamVjdH0gc2NyaXB0IC0gYW4gSFRNTCBzY3JpcHQgZWxlbWVudFxuICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBpbmplY3RlZCBIVE1MIHNjcmlwdCBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiBpbmplY3RTY3JpcHRzKHNjcmlwdCkge1xuICByZXR1cm4gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xufVxuLyoqXG4gKiBjcmVhdGVzIGFuIEhUTUwgc2NyaXB0IGVsZW1lbnQgd2l0aC93aXRob3V0IHByb3ZpZGVkIHNyY1xuICogQHBhcmFtIHtzdHJpbmd9IFtzcmNdIC0gdGhlIHNvdXJjZSBwYXRoIG9mIHRoZSBzY3JpcHRcbiAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgY3JlYXRlZCBIVE1MIHNjcmlwdCBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiBjcmVhdGVTY3JpcHQoc3JjKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgcmV0dXJuIHNyYyAmJiAoc2NyaXB0LnNyYyA9IHNyYyksIHNjcmlwdDtcbn1cbi8qKlxuICogY3JlYXRlcyBhbiBIVE1MIHNjcmlwdCBlbGVtZW50IHdpdGggdGhlIG1vbmFjbyBsb2FkZXIgc3JjXG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gdGhlIGNyZWF0ZWQgSFRNTCBzY3JpcHQgZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gZ2V0TW9uYWNvTG9hZGVyU2NyaXB0KGNvbmZpZ3VyZUxvYWRlcikge1xuICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICB2YXIgY29uZmlnID0gX3JlZjIuY29uZmlnLFxuICAgICAgICByZWplY3QgPSBfcmVmMi5yZWplY3Q7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgcmVqZWN0OiByZWplY3RcbiAgICB9O1xuICB9KTtcbiAgdmFyIGxvYWRlclNjcmlwdCA9IGNyZWF0ZVNjcmlwdChcIlwiLmNvbmNhdChzdGF0ZS5jb25maWcucGF0aHMudnMsIFwiL2xvYWRlci5qc1wiKSk7XG5cbiAgbG9hZGVyU2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29uZmlndXJlTG9hZGVyKCk7XG4gIH07XG5cbiAgbG9hZGVyU2NyaXB0Lm9uZXJyb3IgPSBzdGF0ZS5yZWplY3Q7XG4gIHJldHVybiBsb2FkZXJTY3JpcHQ7XG59XG4vKipcbiAqIGNvbmZpZ3VyZXMgdGhlIG1vbmFjbyBsb2FkZXJcbiAqL1xuXG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZUxvYWRlcigpIHtcbiAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZnVuY3Rpb24gKF9yZWYzKSB7XG4gICAgdmFyIGNvbmZpZyA9IF9yZWYzLmNvbmZpZyxcbiAgICAgICAgcmVzb2x2ZSA9IF9yZWYzLnJlc29sdmUsXG4gICAgICAgIHJlamVjdCA9IF9yZWYzLnJlamVjdDtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgcmVqZWN0OiByZWplY3RcbiAgICB9O1xuICB9KTtcbiAgdmFyIHJlcXVpcmUgPSB3aW5kb3cucmVxdWlyZTtcblxuICByZXF1aXJlLmNvbmZpZyhzdGF0ZS5jb25maWcpO1xuXG4gIHJlcXVpcmUoWyd2cy9lZGl0b3IvZWRpdG9yLm1haW4nXSwgZnVuY3Rpb24gKG1vbmFjbykge1xuICAgIHN0b3JlTW9uYWNvSW5zdGFuY2UobW9uYWNvKTtcbiAgICBzdGF0ZS5yZXNvbHZlKG1vbmFjbyk7XG4gIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIHN0YXRlLnJlamVjdChlcnJvcik7XG4gIH0pO1xufVxuLyoqXG4gKiBzdG9yZSBtb25hY28gaW5zdGFuY2UgaW4gbG9jYWwgc3RhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIHN0b3JlTW9uYWNvSW5zdGFuY2UobW9uYWNvKSB7XG4gIGlmICghZ2V0U3RhdGUoKS5tb25hY28pIHtcbiAgICBzZXRTdGF0ZSh7XG4gICAgICBtb25hY286IG1vbmFjb1xuICAgIH0pO1xuICB9XG59XG4vKipcbiAqIGludGVybmFsIGhlbHBlciBmdW5jdGlvblxuICogZXh0cmFjdHMgc3RvcmVkIG1vbmFjbyBpbnN0YW5jZVxuICogQHJldHVybiB7T2JqZWN0fG51bGx9IC0gdGhlIG1vbmFjbyBpbnN0YW5jZVxuICovXG5cblxuZnVuY3Rpb24gX19nZXRNb25hY29JbnN0YW5jZSgpIHtcbiAgcmV0dXJuIGdldFN0YXRlKGZ1bmN0aW9uIChfcmVmNCkge1xuICAgIHZhciBtb25hY28gPSBfcmVmNC5tb25hY287XG4gICAgcmV0dXJuIG1vbmFjbztcbiAgfSk7XG59XG5cbnZhciB3cmFwcGVyUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgcmV0dXJuIHNldFN0YXRlKHtcbiAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgIHJlamVjdDogcmVqZWN0XG4gIH0pO1xufSk7XG52YXIgbG9hZGVyID0ge1xuICBjb25maWc6IGNvbmZpZyxcbiAgaW5pdDogaW5pdCxcbiAgX19nZXRNb25hY29JbnN0YW5jZTogX19nZXRNb25hY29JbnN0YW5jZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZGVyO1xuIiwgIi8vIENvcGllZCBhbmQgbW9kaWZpZWQgZnJvbSB0aGUgb3JpZ2luYWwgd29yayBhdmFpbGFibGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2xpdmVib29rLWRldi9saXZlYm9vay9ibG9iLzIzZTU4YWM2MDRkZTkyY2U1NDQ3MmYzNmZlM2UyOGRjMjc1NzZkNmMvYXNzZXRzL2pzL2hvb2tzL2NlbGxfZWRpdG9yL2xpdmVfZWRpdG9yL3RoZW1lLmpzXG4vLyBDb3B5cmlnaHQgKEMpIDIwMjEgRGFzaGJpdFxuLy8gTGljZW5zZWQgdW5kZXIgQXBhY2hlIDIuMCBhdmFpbGFibGUgYXQgaHR0cHM6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG4vLyBUaGlzIGlzIGEgcG9ydCBvZiB0aGUgT25lIERhcmsgdGhlbWUgdG8gdGhlIE1vbmFjbyBlZGl0b3IuXG4vLyBXZSBjb2xvciBncmFkZWQgdGhlIGNvbW1lbnQgc28gaXQgaGFzIEFBIGFjY2Vzc2liaWxpdHkgYW5kXG4vLyB0aGVuIHNpbWlsYXJseSBzY2FsZWQgdGhlIGRlZmF1bHQgZm9udC5cbmNvbnN0IGNvbG9ycyA9IHtcbiAgYmFja2dyb3VuZDogXCIjMjgyYzM0XCIsXG4gIGRlZmF1bHQ6IFwiI2M0Y2FkNlwiLFxuICBsaWdodFJlZDogXCIjZTA2Yzc1XCIsXG4gIGJsdWU6IFwiIzYxYWZlZlwiLFxuICBncmF5OiBcIiM4YzkyYTNcIixcbiAgZ3JlZW46IFwiIzk4YzM3OVwiLFxuICBwdXJwbGU6IFwiI2M2NzhkZFwiLFxuICByZWQ6IFwiI2JlNTA0NlwiLFxuICB0ZWFsOiBcIiM1NmI2YzJcIixcbiAgcGVhY2g6IFwiI2QxOWE2NlwiLFxufVxuXG5jb25zdCBydWxlcyA9IChjb2xvcnMpID0+IFtcbiAgeyB0b2tlbjogXCJcIiwgZm9yZWdyb3VuZDogY29sb3JzLmRlZmF1bHQgfSxcbiAgeyB0b2tlbjogXCJ2YXJpYWJsZVwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMubGlnaHRSZWQgfSxcbiAgeyB0b2tlbjogXCJjb25zdGFudFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuYmx1ZSB9LFxuICB7IHRva2VuOiBcImNvbnN0YW50LmNoYXJhY3Rlci5lc2NhcGVcIiwgZm9yZWdyb3VuZDogY29sb3JzLmJsdWUgfSxcbiAgeyB0b2tlbjogXCJjb21tZW50XCIsIGZvcmVncm91bmQ6IGNvbG9ycy5ncmF5IH0sXG4gIHsgdG9rZW46IFwibnVtYmVyXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5ibHVlIH0sXG4gIHsgdG9rZW46IFwicmVnZXhwXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5saWdodFJlZCB9LFxuICB7IHRva2VuOiBcInR5cGVcIiwgZm9yZWdyb3VuZDogY29sb3JzLmxpZ2h0UmVkIH0sXG4gIHsgdG9rZW46IFwic3RyaW5nXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5ncmVlbiB9LFxuICB7IHRva2VuOiBcImtleXdvcmRcIiwgZm9yZWdyb3VuZDogY29sb3JzLnB1cnBsZSB9LFxuICB7IHRva2VuOiBcIm9wZXJhdG9yXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5wZWFjaCB9LFxuICB7IHRva2VuOiBcImRlbGltaXRlci5icmFja2V0LmVtYmVkXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5yZWQgfSxcbiAgeyB0b2tlbjogXCJzaWdpbFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMudGVhbCB9LFxuICB7IHRva2VuOiBcImZ1bmN0aW9uXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5ibHVlIH0sXG4gIHsgdG9rZW46IFwiZnVuY3Rpb24uY2FsbFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuZGVmYXVsdCB9LFxuXG4gIC8vIE1hcmtkb3duIHNwZWNpZmljXG4gIHsgdG9rZW46IFwiZW1waGFzaXNcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH0sXG4gIHsgdG9rZW46IFwic3Ryb25nXCIsIGZvbnRTdHlsZTogXCJib2xkXCIgfSxcbiAgeyB0b2tlbjogXCJrZXl3b3JkLm1kXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5saWdodFJlZCB9LFxuICB7IHRva2VuOiBcImtleXdvcmQudGFibGVcIiwgZm9yZWdyb3VuZDogY29sb3JzLmxpZ2h0UmVkIH0sXG4gIHsgdG9rZW46IFwic3RyaW5nLmxpbmsubWRcIiwgZm9yZWdyb3VuZDogY29sb3JzLmJsdWUgfSxcbiAgeyB0b2tlbjogXCJ2YXJpYWJsZS5tZFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMudGVhbCB9LFxuICB7IHRva2VuOiBcInN0cmluZy5tZFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuZGVmYXVsdCB9LFxuICB7IHRva2VuOiBcInZhcmlhYmxlLnNvdXJjZS5tZFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuZGVmYXVsdCB9LFxuXG4gIC8vIFhNTCBzcGVjaWZpY1xuICB7IHRva2VuOiBcInRhZ1wiLCBmb3JlZ3JvdW5kOiBjb2xvcnMubGlnaHRSZWQgfSxcbiAgeyB0b2tlbjogXCJtZXRhdGFnXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5saWdodFJlZCB9LFxuICB7IHRva2VuOiBcImF0dHJpYnV0ZS5uYW1lXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5wZWFjaCB9LFxuICB7IHRva2VuOiBcImF0dHJpYnV0ZS52YWx1ZVwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuZ3JlZW4gfSxcblxuICAvLyBKU09OIHNwZWNpZmljXG4gIHsgdG9rZW46IFwic3RyaW5nLmtleVwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMubGlnaHRSZWQgfSxcbiAgeyB0b2tlbjogXCJrZXl3b3JkLmpzb25cIiwgZm9yZWdyb3VuZDogY29sb3JzLmJsdWUgfSxcblxuICAvLyBTUUwgc3BlY2lmaWNcbiAgeyB0b2tlbjogXCJvcGVyYXRvci5zcWxcIiwgZm9yZWdyb3VuZDogY29sb3JzLnB1cnBsZSB9LFxuXVxuXG5jb25zdCB0aGVtZSA9IHtcbiAgYmFzZTogXCJ2cy1kYXJrXCIsXG4gIGluaGVyaXQ6IGZhbHNlLFxuICBydWxlczogcnVsZXMoY29sb3JzKSxcbiAgY29sb3JzOiB7XG4gICAgXCJlZGl0b3IuYmFja2dyb3VuZFwiOiBjb2xvcnMuYmFja2dyb3VuZCxcbiAgICBcImVkaXRvci5mb3JlZ3JvdW5kXCI6IGNvbG9ycy5kZWZhdWx0LFxuICAgIFwiZWRpdG9yTGluZU51bWJlci5mb3JlZ3JvdW5kXCI6IFwiIzYzNmQ4M1wiLFxuICAgIFwiZWRpdG9yQ3Vyc29yLmZvcmVncm91bmRcIjogXCIjNjM2ZDgzXCIsXG4gICAgXCJlZGl0b3Iuc2VsZWN0aW9uQmFja2dyb3VuZFwiOiBcIiMzZTQ0NTFcIixcbiAgICBcImVkaXRvci5maW5kTWF0Y2hIaWdobGlnaHRCYWNrZ3JvdW5kXCI6IFwiIzUyOGJmZjNkXCIsXG4gICAgXCJlZGl0b3JTdWdnZXN0V2lkZ2V0LmJhY2tncm91bmRcIjogXCIjMjEyNTJiXCIsXG4gICAgXCJlZGl0b3JTdWdnZXN0V2lkZ2V0LmJvcmRlclwiOiBcIiMxODFhMWZcIixcbiAgICBcImVkaXRvclN1Z2dlc3RXaWRnZXQuc2VsZWN0ZWRCYWNrZ3JvdW5kXCI6IFwiIzJjMzEzYVwiLFxuICAgIFwiaW5wdXQuYmFja2dyb3VuZFwiOiBcIiMxYjFkMjNcIixcbiAgICBcImlucHV0LmJvcmRlclwiOiBcIiMxODFhMWZcIixcbiAgICBcImVkaXRvckJyYWNrZXRNYXRjaC5ib3JkZXJcIjogXCIjMjgyYzM0XCIsXG4gICAgXCJlZGl0b3JCcmFja2V0TWF0Y2guYmFja2dyb3VuZFwiOiBcIiMzZTQ0NTFcIixcbiAgfSxcbn1cblxuZXhwb3J0IHsgdGhlbWUgfVxuIiwgIi8vIENvcGllZCBhbmQgbW9kaWZpZWQgZnJvbSB0aGUgb3JpZ2luYWwgd29yayBhdmFpbGFibGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2xpdmVib29rLWRldi9saXZlYm9vay9ibG9iLzg1MzJiYzMzNGJkY2YzYzU3ZmFiOWI2OTQ2NjZlNjA5ODc3ZDI3OWYvYXNzZXRzL2pzL2hvb2tzL2NlbGxfZWRpdG9yL2xpdmVfZWRpdG9yLmpzXG4vLyBDb3B5cmlnaHQgKEMpIDIwMjEgRGFzaGJpdFxuLy8gTGljZW5zZWQgdW5kZXIgQXBhY2hlIDIuMCBhdmFpbGFibGUgYXQgaHR0cHM6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5pbXBvcnQgbG9hZGVyIGZyb20gXCJAbW9uYWNvLWVkaXRvci9sb2FkZXJcIlxuaW1wb3J0IHsgdGhlbWUgfSBmcm9tIFwiLi90aGVtZXNcIlxuXG5jbGFzcyBDb2RlRWRpdG9yIHtcbiAgY29uc3RydWN0b3IoZWwsIHBhdGgsIHZhbHVlLCBvcHRzKSB7XG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5wYXRoID0gcGF0aFxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICAvLyBodHRwczovL21pY3Jvc29mdC5naXRodWIuaW8vbW9uYWNvLWVkaXRvci9kb2NzLmh0bWwjaW50ZXJmYWNlcy9lZGl0b3IuSVN0YW5kYWxvbmVDb2RlRWRpdG9yLmh0bWxcbiAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IgPSBudWxsXG4gICAgdGhpcy5fb25Nb3VudCA9IFtdXG4gIH1cblxuICBpc01vdW50ZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yXG4gIH1cblxuICBtb3VudCgpIHtcbiAgICBpZiAodGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG1vbmFjbyBlZGl0b3IgaXMgYWxyZWFkeSBtb3VudGVkXCIpXG4gICAgfVxuXG4gICAgdGhpcy5fbW91bnRFZGl0b3IoKVxuICB9XG5cbiAgb25Nb3VudChjYWxsYmFjaykge1xuICAgIHRoaXMuX29uTW91bnQucHVzaChjYWxsYmFjaylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuaXNNb3VudGVkKCkpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmdldE1vZGVsKClcblxuICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLmRpc3Bvc2UoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IuZGlzcG9zZSgpXG4gICAgfVxuICB9XG5cbiAgX21vdW50RWRpdG9yKCkge1xuICAgIHRoaXMub3B0cy52YWx1ZSA9IHRoaXMudmFsdWVcblxuICAgIGxvYWRlci5jb25maWcoe1xuICAgICAgcGF0aHM6IHsgdnM6IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNDUuMC9taW4vdnNcIiB9LFxuICAgIH0pXG5cbiAgICBsb2FkZXIuaW5pdCgpLnRoZW4oKG1vbmFjbykgPT4ge1xuICAgICAgbW9uYWNvLmVkaXRvci5kZWZpbmVUaGVtZShcImRlZmF1bHRcIiwgdGhlbWUpXG5cbiAgICAgIGxldCBtb2RlbFVyaSA9IG1vbmFjby5VcmkucGFyc2UodGhpcy5wYXRoKVxuICAgICAgbGV0IGxhbmd1YWdlID0gdGhpcy5vcHRzLmxhbmd1YWdlXG4gICAgICBsZXQgbW9kZWwgPSBtb25hY28uZWRpdG9yLmNyZWF0ZU1vZGVsKHRoaXMudmFsdWUsIGxhbmd1YWdlLCBtb2RlbFVyaSlcblxuICAgICAgdGhpcy5vcHRzLmxhbmd1YWdlID0gdW5kZWZpbmVkXG4gICAgICB0aGlzLm9wdHMubW9kZWwgPSBtb2RlbFxuICAgICAgdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yID0gbW9uYWNvLmVkaXRvci5jcmVhdGUodGhpcy5lbCwgdGhpcy5vcHRzKVxuXG4gICAgICB0aGlzLl9vbk1vdW50LmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhtb25hY28pKVxuXG4gICAgICB0aGlzLl9zZXRTY3JlZW5EZXBlbmRhbnRFZGl0b3JPcHRpb25zKClcblxuICAgICAgdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmFkZEFjdGlvbih7XG4gICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogXCJ3b3JkLXdyYXBwaW5nXCIsXG4gICAgICAgIGlkOiBcImVuYWJsZS13b3JkLXdyYXBwaW5nXCIsXG4gICAgICAgIGxhYmVsOiBcIkVuYWJsZSB3b3JkIHdyYXBwaW5nXCIsXG4gICAgICAgIHByZWNvbmRpdGlvbjogXCJjb25maWcuZWRpdG9yLndvcmRXcmFwID09IG9mZlwiLFxuICAgICAgICBrZXliaW5kaW5nczogW21vbmFjby5LZXlNb2QuQWx0IHwgbW9uYWNvLktleUNvZGUuS2V5Wl0sXG4gICAgICAgIHJ1bjogKGVkaXRvcikgPT4gZWRpdG9yLnVwZGF0ZU9wdGlvbnMoeyB3b3JkV3JhcDogXCJvblwiIH0pLFxuICAgICAgfSlcblxuICAgICAgdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmFkZEFjdGlvbih7XG4gICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogXCJ3b3JkLXdyYXBwaW5nXCIsXG4gICAgICAgIGlkOiBcImRpc2FibGUtd29yZC13cmFwcGluZ1wiLFxuICAgICAgICBsYWJlbDogXCJEaXNhYmxlIHdvcmQgd3JhcHBpbmdcIixcbiAgICAgICAgcHJlY29uZGl0aW9uOiBcImNvbmZpZy5lZGl0b3Iud29yZFdyYXAgPT0gb25cIixcbiAgICAgICAga2V5YmluZGluZ3M6IFttb25hY28uS2V5TW9kLkFsdCB8IG1vbmFjby5LZXlDb2RlLktleVpdLFxuICAgICAgICBydW46IChlZGl0b3IpID0+IGVkaXRvci51cGRhdGVPcHRpb25zKHsgd29yZFdyYXA6IFwib2ZmXCIgfSksXG4gICAgICB9KVxuXG4gICAgICBjb25zdCByZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmVsLm9mZnNldEhlaWdodCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFNjcmVlbkRlcGVuZGFudEVkaXRvck9wdGlvbnMoKVxuICAgICAgICAgICAgdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmxheW91dCgpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsKVxuXG4gICAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3Iub25EaWRDb250ZW50U2l6ZUNoYW5nZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IuZ2V0Q29udGVudEhlaWdodCgpXG4gICAgICAgIHRoaXMuZWwuc3R5bGUuaGVpZ2h0ID0gYCR7Y29udGVudEhlaWdodH1weGBcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIF9zZXRTY3JlZW5EZXBlbmRhbnRFZGl0b3JPcHRpb25zKCkge1xuICAgIGlmICh3aW5kb3cuc2NyZWVuLndpZHRoIDwgNzY4KSB7XG4gICAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IudXBkYXRlT3B0aW9ucyh7XG4gICAgICAgIGZvbGRpbmc6IGZhbHNlLFxuICAgICAgICBsaW5lRGVjb3JhdGlvbnNXaWR0aDogMTYsXG4gICAgICAgIGxpbmVOdW1iZXJzTWluQ2hhcnM6XG4gICAgICAgICAgTWF0aC5mbG9vcihcbiAgICAgICAgICAgIE1hdGgubG9nMTAodGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvdW50KCkpXG4gICAgICAgICAgKSArIDMsXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IudXBkYXRlT3B0aW9ucyh7XG4gICAgICAgIGZvbGRpbmc6IHRydWUsXG4gICAgICAgIGxpbmVEZWNvcmF0aW9uc1dpZHRoOiAxMCxcbiAgICAgICAgbGluZU51bWJlcnNNaW5DaGFyczogNSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvZGVFZGl0b3JcbiIsICJpbXBvcnQgQ29kZUVkaXRvciBmcm9tIFwiLi4vZWRpdG9yL2NvZGVfZWRpdG9yXCJcblxuY29uc3QgQ29kZUVkaXRvckhvb2sgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgLy8gVE9ETzogdmFsaWRhdGUgZGF0YXNldFxuICAgIGNvbnN0IG9wdHMgPSBKU09OLnBhcnNlKHRoaXMuZWwuZGF0YXNldC5vcHRzKVxuXG4gICAgdGhpcy5jb2RlRWRpdG9yID0gbmV3IENvZGVFZGl0b3IoXG4gICAgICB0aGlzLmVsLFxuICAgICAgdGhpcy5lbC5kYXRhc2V0LnBhdGgsXG4gICAgICB0aGlzLmVsLmRhdGFzZXQudmFsdWUsXG4gICAgICBvcHRzXG4gICAgKVxuXG4gICAgdGhpcy5jb2RlRWRpdG9yLm9uTW91bnQoKG1vbmFjbykgPT4ge1xuICAgICAgaWYgKHRoaXMuZWwuZGF0YXNldC5jaGFuZ2VFdmVudCAmJiB0aGlzLmVsLmRhdGFzZXQuY2hhbmdlRXZlbnQgIT09IFwiXCIpIHtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnN0YW5kYWxvbmVfY29kZV9lZGl0b3Iub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmVsLmRhdGFzZXQudGFyZ2V0ICYmIHRoaXMuZWwuZGF0YXNldC50YXJnZXQgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaEV2ZW50VG8oXG4gICAgICAgICAgICAgIHRoaXMuZWwuZGF0YXNldC50YXJnZXQsXG4gICAgICAgICAgICAgIHRoaXMuZWwuZGF0YXNldC5jaGFuZ2VFdmVudCxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLmNvZGVFZGl0b3Iuc3RhbmRhbG9uZV9jb2RlX2VkaXRvci5nZXRWYWx1ZSgpLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHVzaEV2ZW50KHRoaXMuZWwuZGF0YXNldC5jaGFuZ2VFdmVudCwge1xuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5jb2RlRWRpdG9yLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IuZ2V0VmFsdWUoKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZUV2ZW50KFxuICAgICAgICBcImxtZTpjaGFuZ2VfbGFuZ3VhZ2U6XCIgKyB0aGlzLmVsLmRhdGFzZXQucGF0aCxcbiAgICAgICAgKGRhdGEpID0+IHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMuY29kZUVkaXRvci5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmdldE1vZGVsKClcblxuICAgICAgICAgIGlmIChtb2RlbC5nZXRMYW5ndWFnZUlkKCkgIT09IGRhdGEubWltZVR5cGVPckxhbmd1YWdlSWQpIHtcbiAgICAgICAgICAgIG1vbmFjby5lZGl0b3Iuc2V0TW9kZWxMYW5ndWFnZShtb2RlbCwgZGF0YS5taW1lVHlwZU9yTGFuZ3VhZ2VJZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcblxuICAgICAgdGhpcy5oYW5kbGVFdmVudChcImxtZTpzZXRfdmFsdWU6XCIgKyB0aGlzLmVsLmRhdGFzZXQucGF0aCwgKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnN0YW5kYWxvbmVfY29kZV9lZGl0b3Iuc2V0VmFsdWUoZGF0YS52YWx1ZSlcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhXCIpLmZvckVhY2goKHRleHRhcmVhKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcIm5hbWVcIixcbiAgICAgICAgICBcImxpdmVfbW9uYWNvX2VkaXRvcltcIiArIHRoaXMuZWwuZGF0YXNldC5wYXRoICsgXCJdXCJcbiAgICAgICAgKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXZhbHVlXCIpXG4gICAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtb3B0c1wiKVxuXG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcImxtZTplZGl0b3JfbW91bnRlZFwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IGhvb2s6IHRoaXMsIGVkaXRvcjogdGhpcy5jb2RlRWRpdG9yIH0sXG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaWYgKCF0aGlzLmNvZGVFZGl0b3IuaXNNb3VudGVkKCkpIHtcbiAgICAgIHRoaXMuY29kZUVkaXRvci5tb3VudCgpXG4gICAgfVxuICB9LFxuXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5jb2RlRWRpdG9yKSB7XG4gICAgICB0aGlzLmNvZGVFZGl0b3IuZGlzcG9zZSgpXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgeyBDb2RlRWRpdG9ySG9vayB9XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUNvbXBvbmVudHMoY29tcG9uZW50cykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnRzLmRlZmF1bHQpIHx8ICFBcnJheS5pc0FycmF5KGNvbXBvbmVudHMuZmlsZW5hbWVzKSkgcmV0dXJuIGNvbXBvbmVudHNcblxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB7fVxuICAgIGZvciAoY29uc3QgW2luZGV4LCBtb2R1bGVdIG9mIGNvbXBvbmVudHMuZGVmYXVsdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50ID0gbW9kdWxlLmRlZmF1bHRcbiAgICAgICAgY29uc3QgbmFtZSA9IGNvbXBvbmVudHMuZmlsZW5hbWVzW2luZGV4XS5yZXBsYWNlKFwiLi4vc3ZlbHRlL1wiLCBcIlwiKS5yZXBsYWNlKFwiLnN2ZWx0ZVwiLCBcIlwiKVxuICAgICAgICBub3JtYWxpemVkW25hbWVdID0gQ29tcG9uZW50XG4gICAgfVxuICAgIHJldHVybiBub3JtYWxpemVkXG59XG4iLCAiaW1wb3J0IHtub3JtYWxpemVDb21wb25lbnRzfSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZW5kZXIoY29tcG9uZW50cykge1xuICAgIGNvbXBvbmVudHMgPSBub3JtYWxpemVDb21wb25lbnRzKGNvbXBvbmVudHMpXG5cbiAgICByZXR1cm4gZnVuY3Rpb24gcmVuZGVyKG5hbWUsIHByb3BzLCBzbG90cykge1xuICAgICAgICBjb25zdCBDb21wb25lbnQgPSBjb21wb25lbnRzW25hbWVdXG4gICAgICAgIGNvbnN0ICQkc2xvdHMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoc2xvdHMpLm1hcCgoW2ssIHZdKSA9PiBbaywgKCkgPT4gdl0pKVxuICAgICAgICByZXR1cm4gQ29tcG9uZW50LnJlbmRlcihwcm9wcywgeyQkc2xvdHN9KVxuICAgIH1cbn1cbiIsICJpbXBvcnQge25vcm1hbGl6ZUNvbXBvbmVudHN9IGZyb20gXCIuL3V0aWxzXCJcblxuZnVuY3Rpb24gZ2V0QXR0cmlidXRlSnNvbihyZWYsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgICBjb25zdCBkYXRhID0gcmVmLmVsLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKVxuICAgIHJldHVybiBkYXRhID8gSlNPTi5wYXJzZShkYXRhKSA6IHt9XG59XG5cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChub2RlKVxufVxuXG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKVxufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gZ2V0U2xvdHMocmVmKSB7XG4gICAgY29uc3Qgc2xvdHMgPSB7fVxuXG4gICAgZm9yIChjb25zdCBzbG90TmFtZSBpbiBnZXRBdHRyaWJ1dGVKc29uKHJlZiwgXCJkYXRhLXNsb3RzXCIpKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldEVsZW1lbnQoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGdldEF0dHJpYnV0ZUpzb24ocmVmLCBcImRhdGEtc2xvdHNcIilbc2xvdE5hbWVdXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gYXRvYihiYXNlNjQpLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICBkZXRhY2godGhpcy5zYXZlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50KClcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0KHRoaXMuc2F2ZWRUYXJnZXQsIHRoaXMuc2F2ZWRFbGVtZW50LCB0aGlzLnNhdmVkQW5jaG9yKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYzogbm9vcCxcbiAgICAgICAgICAgICAgICBtKHRhcmdldCwgYW5jaG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRUYXJnZXQgPSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlZEFuY2hvciA9IGFuY2hvclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVkRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudCgpXG4gICAgICAgICAgICAgICAgICAgIGluc2VydCh0aGlzLnNhdmVkVGFyZ2V0LCB0aGlzLnNhdmVkRWxlbWVudCwgdGhpcy5zYXZlZEFuY2hvcilcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGQoZGV0YWNoaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXRhY2hpbmcpIGRldGFjaCh0aGlzLnNhdmVkRWxlbWVudClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGw6IG5vb3AsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzbG90c1tzbG90TmFtZV0gPSBbc2xvdF1cbiAgICB9XG5cbiAgICByZXR1cm4gc2xvdHNcbn1cblxuZnVuY3Rpb24gZ2V0TGl2ZUpzb25Qcm9wcyhyZWYpIHtcbiAgICBjb25zdCBqc29uID0gZ2V0QXR0cmlidXRlSnNvbihyZWYsIFwiZGF0YS1saXZlLWpzb25cIilcblxuICAgIC8vIE9uIFNTUiwgZGF0YS1saXZlLWpzb24gaXMgdGhlIGZ1bGwgb2JqZWN0IHdlIHdhbnRcbiAgICAvLyBBZnRlciBTU1IsIGRhdGEtbGl2ZS1qc29uIGlzIGFuIGFycmF5IG9mIGtleXMsIGFuZCB3ZSdsbCBnZXQgdGhlIGRhdGEgZnJvbSB0aGUgd2luZG93XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGpzb24pKSByZXR1cm4ganNvblxuXG4gICAgY29uc3QgbGl2ZUpzb25EYXRhID0ge31cbiAgICBmb3IgKGNvbnN0IGxpdmVKc29uVmFyaWFibGUgb2YganNvbikge1xuICAgICAgICBjb25zdCBkYXRhID0gd2luZG93W2xpdmVKc29uVmFyaWFibGVdXG4gICAgICAgIGlmIChkYXRhKSBsaXZlSnNvbkRhdGFbbGl2ZUpzb25WYXJpYWJsZV0gPSBkYXRhXG4gICAgfVxuICAgIHJldHVybiBsaXZlSnNvbkRhdGFcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHMocmVmKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZ2V0QXR0cmlidXRlSnNvbihyZWYsIFwiZGF0YS1wcm9wc1wiKSxcbiAgICAgICAgLi4uZ2V0TGl2ZUpzb25Qcm9wcyhyZWYpLFxuICAgICAgICBsaXZlOiByZWYsXG4gICAgICAgICQkc2xvdHM6IGdldFNsb3RzKHJlZiksXG4gICAgICAgICQkc2NvcGU6IHt9LFxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmluZFNsb3RDdHgoY29tcG9uZW50KSB7XG4gICAgLy8gVGhlIGRlZmF1bHQgc2xvdCBhbHdheXMgZXhpc3RzIGlmIHRoZXJlJ3MgYSBzbG90IHNldFxuICAgIC8vIGV2ZW4gaWYgbm8gc2xvdCBpcyBzZXQgZm9yIHRoZSBleHBsaWNpdCBkZWZhdWx0IHNsb3RcbiAgICByZXR1cm4gY29tcG9uZW50LiQkLmN0eC5maW5kKGN0eEVsZW1lbnQgPT4gY3R4RWxlbWVudD8uZGVmYXVsdClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvb2tzKGNvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzID0gbm9ybWFsaXplQ29tcG9uZW50cyhjb21wb25lbnRzKVxuXG4gICAgY29uc3QgU3ZlbHRlSG9vayA9IHtcbiAgICAgICAgbW91bnRlZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtbmFtZVwiKVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IG5hbWUgbXVzdCBiZSBwcm92aWRlZFwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudE5hbWVdXG4gICAgICAgICAgICBpZiAoIUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgJHtjb21wb25lbnROYW1lfSBjb21wb25lbnQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChjb25zdCBsaXZlSnNvbkVsZW1lbnQgb2YgT2JqZWN0LmtleXMoZ2V0QXR0cmlidXRlSnNvbih0aGlzLCBcImRhdGEtbGl2ZS1qc29uXCIpKSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGAke2xpdmVKc29uRWxlbWVudH1faW5pdGlhbGl6ZWRgLCBldmVudCA9PiB0aGlzLl9pbnN0YW5jZS4kc2V0KGdldFByb3BzKHRoaXMpKSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYCR7bGl2ZUpzb25FbGVtZW50fV9wYXRjaGVkYCwgZXZlbnQgPT4gdGhpcy5faW5zdGFuY2UuJHNldChnZXRQcm9wcyh0aGlzKSksIGZhbHNlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBDb21wb25lbnQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5lbCxcbiAgICAgICAgICAgICAgICBwcm9wczogZ2V0UHJvcHModGhpcyksXG4gICAgICAgICAgICAgICAgaHlkcmF0ZTogdGhpcy5lbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNzclwiKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlZCgpIHtcbiAgICAgICAgICAgIC8vIFNldCB0aGUgcHJvcHNcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlLiRzZXQoZ2V0UHJvcHModGhpcykpXG5cbiAgICAgICAgICAgIC8vIFNldCB0aGUgc2xvdHNcbiAgICAgICAgICAgIGNvbnN0IHNsb3RDdHggPSBmaW5kU2xvdEN0eCh0aGlzLl9pbnN0YW5jZSlcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNsb3RDdHgpIHtcbiAgICAgICAgICAgICAgICBzbG90Q3R4W2tleV1bMF0oKS51cGRhdGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3llZCgpIHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gZGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAvLyBJZiB3ZSBkbyBhIHBhZ2UgbmF2aWdhdGlvbiwgdGhpcyB3b3VsZCByZW1vdmUgdGhlIGNvbXBvbmVudCBpbiB0aGUgRE9NLFxuICAgICAgICAgICAgLy8gYW5kIHRoZW4gaXQgd291bGQgdG8gdGhlIHRyYW5zaXRpb24sIGNhdXNpbmcgYSBmbGlja2VyIG9mIHVucmVuZGVyZWQgY29udGVudFxuICAgICAgICAgICAgLy8gU2luY2Ugd2UncmUgZG9pbmcgYSBwYWdlIHRyYW5zaXRpb24gYW55d2F5LCB0aGUgY29tcG9uZW50IHdpbGwgYmUgcmVtb3ZlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBTdmVsdGVIb29rLFxuICAgIH1cbn1cbiIsICJcbiAgICAgICAgaW1wb3J0ICogYXMgbW9kdWxlMCBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9CYWNrZHJvcC5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTEgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvQnJvd3NlckZyYW1lLnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlMiBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9Db2RlRWRpdG9yLnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlMyBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9Db21wb25lbnRzU2lkZWJhci5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTQgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvTGF5b3V0QXN0Tm9kZS5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTUgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvUGFnZUFzdE5vZGUuc3ZlbHRlJztpbXBvcnQgKiBhcyBtb2R1bGU2IGZyb20gJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VQcmV2aWV3LnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlNyBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9QYWdlV3JhcHBlci5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTggZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvUGlsbC5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTkgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvUHJvcGVydGllc1NpZGViYXIuc3ZlbHRlJztpbXBvcnQgKiBhcyBtb2R1bGUxMCBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9TaWRlYmFyU2VjdGlvbi5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTExIGZyb20gJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1VpQnVpbGRlci5zdmVsdGUnXG5cbiAgICAgICAgY29uc3QgbW9kdWxlcyA9IFttb2R1bGUwLG1vZHVsZTEsbW9kdWxlMixtb2R1bGUzLG1vZHVsZTQsbW9kdWxlNSxtb2R1bGU2LG1vZHVsZTcsbW9kdWxlOCxtb2R1bGU5LG1vZHVsZTEwLG1vZHVsZTExXTtcblxuICAgICAgICBleHBvcnQgZGVmYXVsdCBtb2R1bGVzO1xuICAgICAgICBleHBvcnQgY29uc3QgZmlsZW5hbWVzID0gWycuLi9zdmVsdGUvY29tcG9uZW50cy9CYWNrZHJvcC5zdmVsdGUnLCcuLi9zdmVsdGUvY29tcG9uZW50cy9Ccm93c2VyRnJhbWUuc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvQ29kZUVkaXRvci5zdmVsdGUnLCcuLi9zdmVsdGUvY29tcG9uZW50cy9Db21wb25lbnRzU2lkZWJhci5zdmVsdGUnLCcuLi9zdmVsdGUvY29tcG9uZW50cy9MYXlvdXRBc3ROb2RlLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VBc3ROb2RlLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VQcmV2aWV3LnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VXcmFwcGVyLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1BpbGwuc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvUHJvcGVydGllc1NpZGViYXIuc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvU2lkZWJhclNlY3Rpb24uc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvVWlCdWlsZGVyLnN2ZWx0ZSddXG4gICAgICAiLCAiLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSAoeCkgPT4geDtcblxuLyoqXG4gKiBAdGVtcGxhdGUgVFxuICogQHRlbXBsYXRlIFNcbiAqIEBwYXJhbSB7VH0gdGFyXG4gKiBAcGFyYW0ge1N9IHNyY1xuICogQHJldHVybnMge1QgJiBTfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzaWduKHRhciwgc3JjKSB7XG5cdC8vIEB0cy1pZ25vcmVcblx0Zm9yIChjb25zdCBrIGluIHNyYykgdGFyW2tdID0gc3JjW2tdO1xuXHRyZXR1cm4gLyoqIEB0eXBlIHtUICYgU30gKi8gKHRhcik7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdGhlbi9pcy1wcm9taXNlL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4vLyBEaXN0cmlidXRlZCB1bmRlciBNSVQgTGljZW5zZSBodHRwczovL2dpdGh1Yi5jb20vdGhlbi9pcy1wcm9taXNlL2Jsb2IvbWFzdGVyL0xJQ0VOU0Vcbi8qKlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJucyB7dmFsdWUgaXMgUHJvbWlzZUxpa2U8YW55Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcblx0cmV0dXJuIChcblx0XHQhIXZhbHVlICYmXG5cdFx0KHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSAmJlxuXHRcdHR5cGVvZiAoLyoqIEB0eXBlIHthbnl9ICovICh2YWx1ZSkudGhlbikgPT09ICdmdW5jdGlvbidcblx0KTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcblx0ZWxlbWVudC5fX3N2ZWx0ZV9tZXRhID0ge1xuXHRcdGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcnVuKGZuKSB7XG5cdHJldHVybiBmbigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYmxhbmtfb2JqZWN0KCkge1xuXHRyZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Z1bmN0aW9uW119IGZuc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5fYWxsKGZucykge1xuXHRmbnMuZm9yRWFjaChydW4pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7YW55fSB0aGluZ1xuICogQHJldHVybnMge3RoaW5nIGlzIEZ1bmN0aW9ufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNfZnVuY3Rpb24odGhpbmcpIHtcblx0cmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqIEByZXR1cm5zIHtib29sZWFufSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcblx0cmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGIgfHwgKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxubGV0IHNyY191cmxfZXF1YWxfYW5jaG9yO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50X3NyY1xuICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcmNfdXJsX2VxdWFsKGVsZW1lbnRfc3JjLCB1cmwpIHtcblx0aWYgKGVsZW1lbnRfc3JjID09PSB1cmwpIHJldHVybiB0cnVlO1xuXHRpZiAoIXNyY191cmxfZXF1YWxfYW5jaG9yKSB7XG5cdFx0c3JjX3VybF9lcXVhbF9hbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdH1cblx0Ly8gVGhpcyBpcyBhY3R1YWxseSBmYXN0ZXIgdGhhbiBkb2luZyBVUkwoLi4pLmhyZWZcblx0c3JjX3VybF9lcXVhbF9hbmNob3IuaHJlZiA9IHVybDtcblx0cmV0dXJuIGVsZW1lbnRfc3JjID09PSBzcmNfdXJsX2VxdWFsX2FuY2hvci5ocmVmO1xufVxuXG4vKiogQHBhcmFtIHtzdHJpbmd9IHNyY3NldCAqL1xuZnVuY3Rpb24gc3BsaXRfc3Jjc2V0KHNyY3NldCkge1xuXHRyZXR1cm4gc3Jjc2V0LnNwbGl0KCcsJykubWFwKChzcmMpID0+IHNyYy50cmltKCkuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbikpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTFNvdXJjZUVsZW1lbnQgfCBIVE1MSW1hZ2VFbGVtZW50fSBlbGVtZW50X3NyY3NldFxuICogQHBhcmFtIHtzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsfSBzcmNzZXRcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3Jjc2V0X3VybF9lcXVhbChlbGVtZW50X3NyY3NldCwgc3Jjc2V0KSB7XG5cdGNvbnN0IGVsZW1lbnRfdXJscyA9IHNwbGl0X3NyY3NldChlbGVtZW50X3NyY3NldC5zcmNzZXQpO1xuXHRjb25zdCB1cmxzID0gc3BsaXRfc3Jjc2V0KHNyY3NldCB8fCAnJyk7XG5cblx0cmV0dXJuIChcblx0XHR1cmxzLmxlbmd0aCA9PT0gZWxlbWVudF91cmxzLmxlbmd0aCAmJlxuXHRcdHVybHMuZXZlcnkoXG5cdFx0XHQoW3VybCwgd2lkdGhdLCBpKSA9PlxuXHRcdFx0XHR3aWR0aCA9PT0gZWxlbWVudF91cmxzW2ldWzFdICYmXG5cdFx0XHRcdC8vIFdlIG5lZWQgdG8gdGVzdCBib3RoIHdheXMgYmVjYXVzZSBWaXRlIHdpbGwgY3JlYXRlIGFuIGEgZnVsbCBVUkwgd2l0aFxuXHRcdFx0XHQvLyBgbmV3IFVSTChhc3NldCwgaW1wb3J0Lm1ldGEudXJsKS5ocmVmYCBmb3IgdGhlIGNsaWVudCB3aGVuIGBiYXNlOiAnLi8nYCwgYW5kIHRoZVxuXHRcdFx0XHQvLyByZWxhdGl2ZSBVUkxzIGluc2lkZSBzcmNzZXQgYXJlIG5vdCBhdXRvbWF0aWNhbGx5IHJlc29sdmVkIHRvIGFic29sdXRlIFVSTHMgYnlcblx0XHRcdFx0Ly8gYnJvd3NlcnMgKGluIGNvbnRyYXN0IHRvIGltZy5zcmMpLiBUaGlzIG1lYW5zIGJvdGggU1NSIGFuZCBET00gY29kZSBjb3VsZFxuXHRcdFx0XHQvLyBjb250YWluIHJlbGF0aXZlIG9yIGFic29sdXRlIFVSTHMuXG5cdFx0XHRcdChzcmNfdXJsX2VxdWFsKGVsZW1lbnRfdXJsc1tpXVswXSwgdXJsKSB8fCBzcmNfdXJsX2VxdWFsKHVybCwgZWxlbWVudF91cmxzW2ldWzBdKSlcblx0XHQpXG5cdCk7XG59XG5cbi8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3RfZXF1YWwoYSwgYikge1xuXHRyZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYjtcbn1cblxuLyoqIEByZXR1cm5zIHtib29sZWFufSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzX2VtcHR5KG9iaikge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZV9zdG9yZShzdG9yZSwgbmFtZSkge1xuXHRpZiAoc3RvcmUgIT0gbnVsbCAmJiB0eXBlb2Ygc3RvcmUuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGAnJHtuYW1lfScgaXMgbm90IGEgc3RvcmUgd2l0aCBhICdzdWJzY3JpYmUnIG1ldGhvZGApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmUoc3RvcmUsIC4uLmNhbGxiYWNrcykge1xuXHRpZiAoc3RvcmUgPT0gbnVsbCkge1xuXHRcdGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XG5cdFx0XHRjYWxsYmFjayh1bmRlZmluZWQpO1xuXHRcdH1cblx0XHRyZXR1cm4gbm9vcDtcblx0fVxuXHRjb25zdCB1bnN1YiA9IHN0b3JlLnN1YnNjcmliZSguLi5jYWxsYmFja3MpO1xuXHRyZXR1cm4gdW5zdWIudW5zdWJzY3JpYmUgPyAoKSA9PiB1bnN1Yi51bnN1YnNjcmliZSgpIDogdW5zdWI7XG59XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IHZhbHVlIGZyb20gYSBzdG9yZSBieSBzdWJzY3JpYmluZyBhbmQgaW1tZWRpYXRlbHkgdW5zdWJzY3JpYmluZy5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtc3RvcmUjZ2V0XG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtpbXBvcnQoJy4uL3N0b3JlL3B1YmxpYy5qcycpLlJlYWRhYmxlPFQ+fSBzdG9yZVxuICogQHJldHVybnMge1R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfc3RvcmVfdmFsdWUoc3RvcmUpIHtcblx0bGV0IHZhbHVlO1xuXHRzdWJzY3JpYmUoc3RvcmUsIChfKSA9PiAodmFsdWUgPSBfKSkoKTtcblx0cmV0dXJuIHZhbHVlO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gY29tcG9uZW50X3N1YnNjcmliZShjb21wb25lbnQsIHN0b3JlLCBjYWxsYmFjaykge1xuXHRjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9zbG90KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcblx0aWYgKGRlZmluaXRpb24pIHtcblx0XHRjb25zdCBzbG90X2N0eCA9IGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbik7XG5cdFx0cmV0dXJuIGRlZmluaXRpb25bMF0oc2xvdF9jdHgpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbikge1xuXHRyZXR1cm4gZGVmaW5pdGlvblsxXSAmJiBmbiA/IGFzc2lnbigkJHNjb3BlLmN0eC5zbGljZSgpLCBkZWZpbml0aW9uWzFdKGZuKGN0eCkpKSA6ICQkc2NvcGUuY3R4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3Nsb3RfY2hhbmdlcyhkZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZm4pIHtcblx0aWYgKGRlZmluaXRpb25bMl0gJiYgZm4pIHtcblx0XHRjb25zdCBsZXRzID0gZGVmaW5pdGlvblsyXShmbihkaXJ0eSkpO1xuXHRcdGlmICgkJHNjb3BlLmRpcnR5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBsZXRzO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGxldHMgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRjb25zdCBtZXJnZWQgPSBbXTtcblx0XHRcdGNvbnN0IGxlbiA9IE1hdGgubWF4KCQkc2NvcGUuZGlydHkubGVuZ3RoLCBsZXRzLmxlbmd0aCk7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG5cdFx0XHRcdG1lcmdlZFtpXSA9ICQkc2NvcGUuZGlydHlbaV0gfCBsZXRzW2ldO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lcmdlZDtcblx0XHR9XG5cdFx0cmV0dXJuICQkc2NvcGUuZGlydHkgfCBsZXRzO1xuXHR9XG5cdHJldHVybiAkJHNjb3BlLmRpcnR5O1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlX3Nsb3RfYmFzZShcblx0c2xvdCxcblx0c2xvdF9kZWZpbml0aW9uLFxuXHRjdHgsXG5cdCQkc2NvcGUsXG5cdHNsb3RfY2hhbmdlcyxcblx0Z2V0X3Nsb3RfY29udGV4dF9mblxuKSB7XG5cdGlmIChzbG90X2NoYW5nZXMpIHtcblx0XHRjb25zdCBzbG90X2NvbnRleHQgPSBnZXRfc2xvdF9jb250ZXh0KHNsb3RfZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcblx0XHRzbG90LnAoc2xvdF9jb250ZXh0LCBzbG90X2NoYW5nZXMpO1xuXHR9XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVfc2xvdChcblx0c2xvdCxcblx0c2xvdF9kZWZpbml0aW9uLFxuXHRjdHgsXG5cdCQkc2NvcGUsXG5cdGRpcnR5LFxuXHRnZXRfc2xvdF9jaGFuZ2VzX2ZuLFxuXHRnZXRfc2xvdF9jb250ZXh0X2ZuXG4pIHtcblx0Y29uc3Qgc2xvdF9jaGFuZ2VzID0gZ2V0X3Nsb3RfY2hhbmdlcyhzbG90X2RlZmluaXRpb24sICQkc2NvcGUsIGRpcnR5LCBnZXRfc2xvdF9jaGFuZ2VzX2ZuKTtcblx0dXBkYXRlX3Nsb3RfYmFzZShzbG90LCBzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgc2xvdF9jaGFuZ2VzLCBnZXRfc2xvdF9jb250ZXh0X2ZuKTtcbn1cblxuLyoqIEByZXR1cm5zIHthbnlbXSB8IC0xfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9hbGxfZGlydHlfZnJvbV9zY29wZSgkJHNjb3BlKSB7XG5cdGlmICgkJHNjb3BlLmN0eC5sZW5ndGggPiAzMikge1xuXHRcdGNvbnN0IGRpcnR5ID0gW107XG5cdFx0Y29uc3QgbGVuZ3RoID0gJCRzY29wZS5jdHgubGVuZ3RoIC8gMzI7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0ZGlydHlbaV0gPSAtMTtcblx0XHR9XG5cdFx0cmV0dXJuIGRpcnR5O1xuXHR9XG5cdHJldHVybiAtMTtcbn1cblxuLyoqIEByZXR1cm5zIHt7fX0gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGNsdWRlX2ludGVybmFsX3Byb3BzKHByb3BzKSB7XG5cdGNvbnN0IHJlc3VsdCA9IHt9O1xuXHRmb3IgKGNvbnN0IGsgaW4gcHJvcHMpIGlmIChrWzBdICE9PSAnJCcpIHJlc3VsdFtrXSA9IHByb3BzW2tdO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogQHJldHVybnMge3t9fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVfcmVzdF9wcm9wcyhwcm9wcywga2V5cykge1xuXHRjb25zdCByZXN0ID0ge307XG5cdGtleXMgPSBuZXcgU2V0KGtleXMpO1xuXHRmb3IgKGNvbnN0IGsgaW4gcHJvcHMpIGlmICgha2V5cy5oYXMoaykgJiYga1swXSAhPT0gJyQnKSByZXN0W2tdID0gcHJvcHNba107XG5cdHJldHVybiByZXN0O1xufVxuXG4vKiogQHJldHVybnMge3t9fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVfc2xvdHMoc2xvdHMpIHtcblx0Y29uc3QgcmVzdWx0ID0ge307XG5cdGZvciAoY29uc3Qga2V5IGluIHNsb3RzKSB7XG5cdFx0cmVzdWx0W2tleV0gPSB0cnVlO1xuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBAcmV0dXJucyB7KHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pID0+IHZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gb25jZShmbikge1xuXHRsZXQgcmFuID0gZmFsc2U7XG5cdHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuXHRcdGlmIChyYW4pIHJldHVybjtcblx0XHRyYW4gPSB0cnVlO1xuXHRcdGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBudWxsX3RvX2VtcHR5KHZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldF9zdG9yZV92YWx1ZShzdG9yZSwgcmV0LCB2YWx1ZSkge1xuXHRzdG9yZS5zZXQodmFsdWUpO1xuXHRyZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgY29uc3QgaGFzX3Byb3AgPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGlvbl9kZXN0cm95ZXIoYWN0aW9uX3Jlc3VsdCkge1xuXHRyZXR1cm4gYWN0aW9uX3Jlc3VsdCAmJiBpc19mdW5jdGlvbihhY3Rpb25fcmVzdWx0LmRlc3Ryb3kpID8gYWN0aW9uX3Jlc3VsdC5kZXN0cm95IDogbm9vcDtcbn1cblxuLyoqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge1tudW1iZXIsIHN0cmluZ119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdF9jc3NfdW5pdCh2YWx1ZSkge1xuXHRjb25zdCBzcGxpdCA9IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUubWF0Y2goL15cXHMqKC0/W1xcZC5dKykoW15cXHNdKilcXHMqJC8pO1xuXHRyZXR1cm4gc3BsaXQgPyBbcGFyc2VGbG9hdChzcGxpdFsxXSksIHNwbGl0WzJdIHx8ICdweCddIDogWy8qKiBAdHlwZSB7bnVtYmVyfSAqLyAodmFsdWUpLCAncHgnXTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzID0gWycnLCB0cnVlLCAxLCAndHJ1ZScsICdjb250ZW50ZWRpdGFibGUnXTtcbiIsICJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCBjb25zdCBpc19jbGllbnQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcblxuLyoqIEB0eXBlIHsoKSA9PiBudW1iZXJ9ICovXG5leHBvcnQgbGV0IG5vdyA9IGlzX2NsaWVudCA/ICgpID0+IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6ICgpID0+IERhdGUubm93KCk7XG5cbmV4cG9ydCBsZXQgcmFmID0gaXNfY2xpZW50ID8gKGNiKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpIDogbm9vcDtcblxuLy8gdXNlZCBpbnRlcm5hbGx5IGZvciB0ZXN0aW5nXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X25vdyhmbikge1xuXHRub3cgPSBmbjtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9yYWYoZm4pIHtcblx0cmFmID0gZm47XG59XG4iLCAiaW1wb3J0IHsgcmFmIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmNvbnN0IHRhc2tzID0gbmV3IFNldCgpO1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBub3dcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBydW5fdGFza3Mobm93KSB7XG5cdHRhc2tzLmZvckVhY2goKHRhc2spID0+IHtcblx0XHRpZiAoIXRhc2suYyhub3cpKSB7XG5cdFx0XHR0YXNrcy5kZWxldGUodGFzayk7XG5cdFx0XHR0YXNrLmYoKTtcblx0XHR9XG5cdH0pO1xuXHRpZiAodGFza3Muc2l6ZSAhPT0gMCkgcmFmKHJ1bl90YXNrcyk7XG59XG5cbi8qKlxuICogRm9yIHRlc3RpbmcgcHVycG9zZXMgb25seSFcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJfbG9vcHMoKSB7XG5cdHRhc2tzLmNsZWFyKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB0YXNrIHRoYXQgcnVucyBvbiBlYWNoIHJhZiBmcmFtZVxuICogdW50aWwgaXQgcmV0dXJucyBhIGZhbHN5IHZhbHVlIG9yIGlzIGFib3J0ZWRcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5UYXNrQ2FsbGJhY2t9IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5UYXNrfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9vcChjYWxsYmFjaykge1xuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuVGFza0VudHJ5fSAqL1xuXHRsZXQgdGFzaztcblx0aWYgKHRhc2tzLnNpemUgPT09IDApIHJhZihydW5fdGFza3MpO1xuXHRyZXR1cm4ge1xuXHRcdHByb21pc2U6IG5ldyBQcm9taXNlKChmdWxmaWxsKSA9PiB7XG5cdFx0XHR0YXNrcy5hZGQoKHRhc2sgPSB7IGM6IGNhbGxiYWNrLCBmOiBmdWxmaWxsIH0pKTtcblx0XHR9KSxcblx0XHRhYm9ydCgpIHtcblx0XHRcdHRhc2tzLmRlbGV0ZSh0YXNrKTtcblx0XHR9XG5cdH07XG59XG4iLCAiLyoqIEB0eXBlIHt0eXBlb2YgZ2xvYmFsVGhpc30gKi9cbmV4cG9ydCBjb25zdCBnbG9iYWxzID1cblx0dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcblx0XHQ/IHdpbmRvd1xuXHRcdDogdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnXG5cdFx0PyBnbG9iYWxUaGlzXG5cdFx0OiAvLyBAdHMtaWdub3JlIE5vZGUgdHlwaW5ncyBoYXZlIHRoaXNcblx0XHQgIGdsb2JhbDtcbiIsICJpbXBvcnQgeyBnbG9iYWxzIH0gZnJvbSAnLi9nbG9iYWxzLmpzJztcblxuLyoqXG4gKiBSZXNpemUgb2JzZXJ2ZXIgc2luZ2xldG9uLlxuICogT25lIGxpc3RlbmVyIHBlciBlbGVtZW50IG9ubHkhXG4gKiBodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2EvY2hyb21pdW0ub3JnL2cvYmxpbmstZGV2L2MvejZpZW5PTlViNUEvbS9GNS1WY1VadEJBQUpcbiAqL1xuZXhwb3J0IGNsYXNzIFJlc2l6ZU9ic2VydmVyU2luZ2xldG9uIHtcblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEByZWFkb25seVxuXHQgKiBAdHlwZSB7V2Vha01hcDxFbGVtZW50LCBpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLkxpc3RlbmVyPn1cblx0ICovXG5cdF9saXN0ZW5lcnMgPSAnV2Vha01hcCcgaW4gZ2xvYmFscyA/IG5ldyBXZWFrTWFwKCkgOiB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB0eXBlIHtSZXNpemVPYnNlcnZlcn1cblx0ICovXG5cdF9vYnNlcnZlciA9IHVuZGVmaW5lZDtcblxuXHQvKiogQHR5cGUge1Jlc2l6ZU9ic2VydmVyT3B0aW9uc30gKi9cblx0b3B0aW9ucztcblxuXHQvKiogQHBhcmFtIHtSZXNpemVPYnNlcnZlck9wdGlvbnN9IG9wdGlvbnMgKi9cblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG5cdCAqIEBwYXJhbSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5MaXN0ZW5lcn0gbGlzdGVuZXJcblx0ICogQHJldHVybnMgeygpID0+IHZvaWR9XG5cdCAqL1xuXHRvYnNlcnZlKGVsZW1lbnQsIGxpc3RlbmVyKSB7XG5cdFx0dGhpcy5fbGlzdGVuZXJzLnNldChlbGVtZW50LCBsaXN0ZW5lcik7XG5cdFx0dGhpcy5fZ2V0T2JzZXJ2ZXIoKS5vYnNlcnZlKGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHRoaXMuX2xpc3RlbmVycy5kZWxldGUoZWxlbWVudCk7XG5cdFx0XHR0aGlzLl9vYnNlcnZlci51bm9ic2VydmUoZWxlbWVudCk7IC8vIHRoaXMgbGluZSBjYW4gcHJvYmFibHkgYmUgcmVtb3ZlZFxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9nZXRPYnNlcnZlcigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0dGhpcy5fb2JzZXJ2ZXIgPz9cblx0XHRcdCh0aGlzLl9vYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuXHRcdFx0XHRmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcblx0XHRcdFx0XHRSZXNpemVPYnNlcnZlclNpbmdsZXRvbi5lbnRyaWVzLnNldChlbnRyeS50YXJnZXQsIGVudHJ5KTtcblx0XHRcdFx0XHR0aGlzLl9saXN0ZW5lcnMuZ2V0KGVudHJ5LnRhcmdldCk/LihlbnRyeSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pKVxuXHRcdCk7XG5cdH1cbn1cblxuLy8gTmVlZHMgdG8gYmUgd3JpdHRlbiBsaWtlIHRoaXMgdG8gcGFzcyB0aGUgdHJlZS1zaGFrZS10ZXN0XG5SZXNpemVPYnNlcnZlclNpbmdsZXRvbi5lbnRyaWVzID0gJ1dlYWtNYXAnIGluIGdsb2JhbHMgPyBuZXcgV2Vha01hcCgpIDogdW5kZWZpbmVkO1xuIiwgImltcG9ydCB7IGNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzLCBoYXNfcHJvcCB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQgeyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiB9IGZyb20gJy4vUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24uanMnO1xuXG4vLyBUcmFjayB3aGljaCBub2RlcyBhcmUgY2xhaW1lZCBkdXJpbmcgaHlkcmF0aW9uLiBVbmNsYWltZWQgbm9kZXMgY2FuIHRoZW4gYmUgcmVtb3ZlZCBmcm9tIHRoZSBET01cbi8vIGF0IHRoZSBlbmQgb2YgaHlkcmF0aW9uIHdpdGhvdXQgdG91Y2hpbmcgdGhlIHJlbWFpbmluZyBub2Rlcy5cbmxldCBpc19oeWRyYXRpbmcgPSBmYWxzZTtcblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0X2h5ZHJhdGluZygpIHtcblx0aXNfaHlkcmF0aW5nID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuZF9oeWRyYXRpbmcoKSB7XG5cdGlzX2h5ZHJhdGluZyA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb3dcbiAqIEBwYXJhbSB7bnVtYmVyfSBoaWdoXG4gKiBAcGFyYW0geyhpbmRleDogbnVtYmVyKSA9PiBudW1iZXJ9IGtleVxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiB1cHBlcl9ib3VuZChsb3csIGhpZ2gsIGtleSwgdmFsdWUpIHtcblx0Ly8gUmV0dXJuIGZpcnN0IGluZGV4IG9mIHZhbHVlIGxhcmdlciB0aGFuIGlucHV0IHZhbHVlIGluIHRoZSByYW5nZSBbbG93LCBoaWdoKVxuXHR3aGlsZSAobG93IDwgaGlnaCkge1xuXHRcdGNvbnN0IG1pZCA9IGxvdyArICgoaGlnaCAtIGxvdykgPj4gMSk7XG5cdFx0aWYgKGtleShtaWQpIDw9IHZhbHVlKSB7XG5cdFx0XHRsb3cgPSBtaWQgKyAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoaWdoID0gbWlkO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbG93O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZUV4fSB0YXJnZXRcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBpbml0X2h5ZHJhdGUodGFyZ2V0KSB7XG5cdGlmICh0YXJnZXQuaHlkcmF0ZV9pbml0KSByZXR1cm47XG5cdHRhcmdldC5oeWRyYXRlX2luaXQgPSB0cnVlO1xuXHQvLyBXZSBrbm93IHRoYXQgYWxsIGNoaWxkcmVuIGhhdmUgY2xhaW1fb3JkZXIgdmFsdWVzIHNpbmNlIHRoZSB1bmNsYWltZWQgaGF2ZSBiZWVuIGRldGFjaGVkIGlmIHRhcmdldCBpcyBub3QgPGhlYWQ+XG5cblx0bGV0IGNoaWxkcmVuID0gLyoqIEB0eXBlIHtBcnJheUxpa2U8Tm9kZUV4Mj59ICovICh0YXJnZXQuY2hpbGROb2Rlcyk7XG5cdC8vIElmIHRhcmdldCBpcyA8aGVhZD4sIHRoZXJlIG1heSBiZSBjaGlsZHJlbiB3aXRob3V0IGNsYWltX29yZGVyXG5cdGlmICh0YXJnZXQubm9kZU5hbWUgPT09ICdIRUFEJykge1xuXHRcdGNvbnN0IG15X2NoaWxkcmVuID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3Qgbm9kZSA9IGNoaWxkcmVuW2ldO1xuXHRcdFx0aWYgKG5vZGUuY2xhaW1fb3JkZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRteV9jaGlsZHJlbi5wdXNoKG5vZGUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjaGlsZHJlbiA9IG15X2NoaWxkcmVuO1xuXHR9XG5cdC8qXG5cdCAqIFJlb3JkZXIgY2xhaW1lZCBjaGlsZHJlbiBvcHRpbWFsbHkuXG5cdCAqIFdlIGNhbiByZW9yZGVyIGNsYWltZWQgY2hpbGRyZW4gb3B0aW1hbGx5IGJ5IGZpbmRpbmcgdGhlIGxvbmdlc3Qgc3Vic2VxdWVuY2Ugb2Zcblx0ICogbm9kZXMgdGhhdCBhcmUgYWxyZWFkeSBjbGFpbWVkIGluIG9yZGVyIGFuZCBvbmx5IG1vdmluZyB0aGUgcmVzdC4gVGhlIGxvbmdlc3Rcblx0ICogc3Vic2VxdWVuY2Ugb2Ygbm9kZXMgdGhhdCBhcmUgY2xhaW1lZCBpbiBvcmRlciBjYW4gYmUgZm91bmQgYnlcblx0ICogY29tcHV0aW5nIHRoZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2Ugb2YgLmNsYWltX29yZGVyIHZhbHVlcy5cblx0ICpcblx0ICogVGhpcyBhbGdvcml0aG0gaXMgb3B0aW1hbCBpbiBnZW5lcmF0aW5nIHRoZSBsZWFzdCBhbW91bnQgb2YgcmVvcmRlciBvcGVyYXRpb25zXG5cdCAqIHBvc3NpYmxlLlxuXHQgKlxuXHQgKiBQcm9vZjpcblx0ICogV2Uga25vdyB0aGF0LCBnaXZlbiBhIHNldCBvZiByZW9yZGVyaW5nIG9wZXJhdGlvbnMsIHRoZSBub2RlcyB0aGF0IGRvIG5vdCBtb3ZlXG5cdCAqIGFsd2F5cyBmb3JtIGFuIGluY3JlYXNpbmcgc3Vic2VxdWVuY2UsIHNpbmNlIHRoZXkgZG8gbm90IG1vdmUgYW1vbmcgZWFjaCBvdGhlclxuXHQgKiBtZWFuaW5nIHRoYXQgdGhleSBtdXN0IGJlIGFscmVhZHkgb3JkZXJlZCBhbW9uZyBlYWNoIG90aGVyLiBUaHVzLCB0aGUgbWF4aW1hbFxuXHQgKiBzZXQgb2Ygbm9kZXMgdGhhdCBkbyBub3QgbW92ZSBmb3JtIGEgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLlxuXHQgKi9cblx0Ly8gQ29tcHV0ZSBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2Vcblx0Ly8gbTogc3Vic2VxdWVuY2UgbGVuZ3RoIGogPT4gaW5kZXggayBvZiBzbWFsbGVzdCB2YWx1ZSB0aGF0IGVuZHMgYW4gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBsZW5ndGggalxuXHRjb25zdCBtID0gbmV3IEludDMyQXJyYXkoY2hpbGRyZW4ubGVuZ3RoICsgMSk7XG5cdC8vIFByZWRlY2Vzc29yIGluZGljZXMgKyAxXG5cdGNvbnN0IHAgPSBuZXcgSW50MzJBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXHRtWzBdID0gLTE7XG5cdGxldCBsb25nZXN0ID0gMDtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGN1cnJlbnQgPSBjaGlsZHJlbltpXS5jbGFpbV9vcmRlcjtcblx0XHQvLyBGaW5kIHRoZSBsYXJnZXN0IHN1YnNlcXVlbmNlIGxlbmd0aCBzdWNoIHRoYXQgaXQgZW5kcyBpbiBhIHZhbHVlIGxlc3MgdGhhbiBvdXIgY3VycmVudCB2YWx1ZVxuXHRcdC8vIHVwcGVyX2JvdW5kIHJldHVybnMgZmlyc3QgZ3JlYXRlciB2YWx1ZSwgc28gd2Ugc3VidHJhY3Qgb25lXG5cdFx0Ly8gd2l0aCBmYXN0IHBhdGggZm9yIHdoZW4gd2UgYXJlIG9uIHRoZSBjdXJyZW50IGxvbmdlc3Qgc3Vic2VxdWVuY2Vcblx0XHRjb25zdCBzZXFfbGVuID1cblx0XHRcdChsb25nZXN0ID4gMCAmJiBjaGlsZHJlblttW2xvbmdlc3RdXS5jbGFpbV9vcmRlciA8PSBjdXJyZW50XG5cdFx0XHRcdD8gbG9uZ2VzdCArIDFcblx0XHRcdFx0OiB1cHBlcl9ib3VuZCgxLCBsb25nZXN0LCAoaWR4KSA9PiBjaGlsZHJlblttW2lkeF1dLmNsYWltX29yZGVyLCBjdXJyZW50KSkgLSAxO1xuXHRcdHBbaV0gPSBtW3NlcV9sZW5dICsgMTtcblx0XHRjb25zdCBuZXdfbGVuID0gc2VxX2xlbiArIDE7XG5cdFx0Ly8gV2UgY2FuIGd1YXJhbnRlZSB0aGF0IGN1cnJlbnQgaXMgdGhlIHNtYWxsZXN0IHZhbHVlLiBPdGhlcndpc2UsIHdlIHdvdWxkIGhhdmUgZ2VuZXJhdGVkIGEgbG9uZ2VyIHNlcXVlbmNlLlxuXHRcdG1bbmV3X2xlbl0gPSBpO1xuXHRcdGxvbmdlc3QgPSBNYXRoLm1heChuZXdfbGVuLCBsb25nZXN0KTtcblx0fVxuXHQvLyBUaGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIG5vZGVzIChpbml0aWFsbHkgcmV2ZXJzZWQpXG5cblx0LyoqXG5cdCAqIEB0eXBlIHtOb2RlRXgyW119XG5cdCAqL1xuXHRjb25zdCBsaXMgPSBbXTtcblx0Ly8gVGhlIHJlc3Qgb2YgdGhlIG5vZGVzLCBub2RlcyB0aGF0IHdpbGwgYmUgbW92ZWRcblxuXHQvKipcblx0ICogQHR5cGUge05vZGVFeDJbXX1cblx0ICovXG5cdGNvbnN0IHRvX21vdmUgPSBbXTtcblx0bGV0IGxhc3QgPSBjaGlsZHJlbi5sZW5ndGggLSAxO1xuXHRmb3IgKGxldCBjdXIgPSBtW2xvbmdlc3RdICsgMTsgY3VyICE9IDA7IGN1ciA9IHBbY3VyIC0gMV0pIHtcblx0XHRsaXMucHVzaChjaGlsZHJlbltjdXIgLSAxXSk7XG5cdFx0Zm9yICg7IGxhc3QgPj0gY3VyOyBsYXN0LS0pIHtcblx0XHRcdHRvX21vdmUucHVzaChjaGlsZHJlbltsYXN0XSk7XG5cdFx0fVxuXHRcdGxhc3QtLTtcblx0fVxuXHRmb3IgKDsgbGFzdCA+PSAwOyBsYXN0LS0pIHtcblx0XHR0b19tb3ZlLnB1c2goY2hpbGRyZW5bbGFzdF0pO1xuXHR9XG5cdGxpcy5yZXZlcnNlKCk7XG5cdC8vIFdlIHNvcnQgdGhlIG5vZGVzIGJlaW5nIG1vdmVkIHRvIGd1YXJhbnRlZSB0aGF0IHRoZWlyIGluc2VydGlvbiBvcmRlciBtYXRjaGVzIHRoZSBjbGFpbSBvcmRlclxuXHR0b19tb3ZlLnNvcnQoKGEsIGIpID0+IGEuY2xhaW1fb3JkZXIgLSBiLmNsYWltX29yZGVyKTtcblx0Ly8gRmluYWxseSwgd2UgbW92ZSB0aGUgbm9kZXNcblx0Zm9yIChsZXQgaSA9IDAsIGogPSAwOyBpIDwgdG9fbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdHdoaWxlIChqIDwgbGlzLmxlbmd0aCAmJiB0b19tb3ZlW2ldLmNsYWltX29yZGVyID49IGxpc1tqXS5jbGFpbV9vcmRlcikge1xuXHRcdFx0aisrO1xuXHRcdH1cblx0XHRjb25zdCBhbmNob3IgPSBqIDwgbGlzLmxlbmd0aCA/IGxpc1tqXSA6IG51bGw7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZSh0b19tb3ZlW2ldLCBhbmNob3IpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmQodGFyZ2V0LCBub2RlKSB7XG5cdHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlX3NoZWV0X2lkXG4gKiBAcGFyYW0ge3N0cmluZ30gc3R5bGVzXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZF9zdHlsZXModGFyZ2V0LCBzdHlsZV9zaGVldF9pZCwgc3R5bGVzKSB7XG5cdGNvbnN0IGFwcGVuZF9zdHlsZXNfdG8gPSBnZXRfcm9vdF9mb3Jfc3R5bGUodGFyZ2V0KTtcblx0aWYgKCFhcHBlbmRfc3R5bGVzX3RvLmdldEVsZW1lbnRCeUlkKHN0eWxlX3NoZWV0X2lkKSkge1xuXHRcdGNvbnN0IHN0eWxlID0gZWxlbWVudCgnc3R5bGUnKTtcblx0XHRzdHlsZS5pZCA9IHN0eWxlX3NoZWV0X2lkO1xuXHRcdHN0eWxlLnRleHRDb250ZW50ID0gc3R5bGVzO1xuXHRcdGFwcGVuZF9zdHlsZXNoZWV0KGFwcGVuZF9zdHlsZXNfdG8sIHN0eWxlKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybnMge1NoYWRvd1Jvb3QgfCBEb2N1bWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9yb290X2Zvcl9zdHlsZShub2RlKSB7XG5cdGlmICghbm9kZSkgcmV0dXJuIGRvY3VtZW50O1xuXHRjb25zdCByb290ID0gbm9kZS5nZXRSb290Tm9kZSA/IG5vZGUuZ2V0Um9vdE5vZGUoKSA6IG5vZGUub3duZXJEb2N1bWVudDtcblx0aWYgKHJvb3QgJiYgLyoqIEB0eXBlIHtTaGFkb3dSb290fSAqLyAocm9vdCkuaG9zdCkge1xuXHRcdHJldHVybiAvKiogQHR5cGUge1NoYWRvd1Jvb3R9ICovIChyb290KTtcblx0fVxuXHRyZXR1cm4gbm9kZS5vd25lckRvY3VtZW50O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybnMge0NTU1N0eWxlU2hlZXR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldChub2RlKSB7XG5cdGNvbnN0IHN0eWxlX2VsZW1lbnQgPSBlbGVtZW50KCdzdHlsZScpO1xuXHQvLyBGb3IgdHJhbnNpdGlvbnMgdG8gd29yayB3aXRob3V0ICdzdHlsZS1zcmM6IHVuc2FmZS1pbmxpbmUnIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5LFxuXHQvLyB0aGVzZSBlbXB0eSB0YWdzIG5lZWQgdG8gYmUgYWxsb3dlZCB3aXRoIGEgaGFzaCBhcyBhIHdvcmthcm91bmQgdW50aWwgd2UgbW92ZSB0byB0aGUgV2ViIEFuaW1hdGlvbnMgQVBJLlxuXHQvLyBVc2luZyB0aGUgaGFzaCBmb3IgdGhlIGVtcHR5IHN0cmluZyAoZm9yIGFuIGVtcHR5IHRhZykgd29ya3MgaW4gYWxsIGJyb3dzZXJzIGV4Y2VwdCBTYWZhcmkuXG5cdC8vIFNvIGFzIGEgd29ya2Fyb3VuZCBmb3IgdGhlIHdvcmthcm91bmQsIHdoZW4gd2UgYXBwZW5kIGVtcHR5IHN0eWxlIHRhZ3Mgd2Ugc2V0IHRoZWlyIGNvbnRlbnQgdG8gLyogZW1wdHkgKi8uXG5cdC8vIFRoZSBoYXNoICdzaGEyNTYtOU9sTk8wRE5FZWFWekhMNFJad0NMc0JIQThXQlE4dG9CcC80RjVYVjJuYz0nIHdpbGwgdGhlbiB3b3JrIGV2ZW4gaW4gU2FmYXJpLlxuXHRzdHlsZV9lbGVtZW50LnRleHRDb250ZW50ID0gJy8qIGVtcHR5ICovJztcblx0YXBwZW5kX3N0eWxlc2hlZXQoZ2V0X3Jvb3RfZm9yX3N0eWxlKG5vZGUpLCBzdHlsZV9lbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlX2VsZW1lbnQuc2hlZXQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHtTaGFkb3dSb290IHwgRG9jdW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7SFRNTFN0eWxlRWxlbWVudH0gc3R5bGVcbiAqIEByZXR1cm5zIHtDU1NTdHlsZVNoZWV0fVxuICovXG5mdW5jdGlvbiBhcHBlbmRfc3R5bGVzaGVldChub2RlLCBzdHlsZSkge1xuXHRhcHBlbmQoLyoqIEB0eXBlIHtEb2N1bWVudH0gKi8gKG5vZGUpLmhlYWQgfHwgbm9kZSwgc3R5bGUpO1xuXHRyZXR1cm4gc3R5bGUuc2hlZXQ7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlRXh9IHRhcmdldFxuICogQHBhcmFtIHtOb2RlRXh9IG5vZGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpIHtcblx0aWYgKGlzX2h5ZHJhdGluZykge1xuXHRcdGluaXRfaHlkcmF0ZSh0YXJnZXQpO1xuXHRcdGlmIChcblx0XHRcdHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkID09PSB1bmRlZmluZWQgfHxcblx0XHRcdCh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCAhPT0gbnVsbCAmJiB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5wYXJlbnROb2RlICE9PSB0YXJnZXQpXG5cdFx0KSB7XG5cdFx0XHR0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IHRhcmdldC5maXJzdENoaWxkO1xuXHRcdH1cblx0XHQvLyBTa2lwIG5vZGVzIG9mIHVuZGVmaW5lZCBvcmRlcmluZ1xuXHRcdHdoaWxlICh0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCAhPT0gbnVsbCAmJiB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5jbGFpbV9vcmRlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkLm5leHRTaWJsaW5nO1xuXHRcdH1cblx0XHRpZiAobm9kZSAhPT0gdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQpIHtcblx0XHRcdC8vIFdlIG9ubHkgaW5zZXJ0IGlmIHRoZSBvcmRlcmluZyBvZiB0aGlzIG5vZGUgc2hvdWxkIGJlIG1vZGlmaWVkIG9yIHRoZSBwYXJlbnQgbm9kZSBpcyBub3QgdGFyZ2V0XG5cdFx0XHRpZiAobm9kZS5jbGFpbV9vcmRlciAhPT0gdW5kZWZpbmVkIHx8IG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0KSB7XG5cdFx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9IG5vZGUubmV4dFNpYmxpbmc7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0IHx8IG5vZGUubmV4dFNpYmxpbmcgIT09IG51bGwpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge05vZGV9IFthbmNob3JdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuXHR0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGVFeH0gdGFyZ2V0XG4gKiBAcGFyYW0ge05vZGVFeH0gbm9kZVxuICogQHBhcmFtIHtOb2RlRXh9IFthbmNob3JdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydF9oeWRyYXRpb24odGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcblx0aWYgKGlzX2h5ZHJhdGluZyAmJiAhYW5jaG9yKSB7XG5cdFx0YXBwZW5kX2h5ZHJhdGlvbih0YXJnZXQsIG5vZGUpO1xuXHR9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gdGFyZ2V0IHx8IG5vZGUubmV4dFNpYmxpbmcgIT0gYW5jaG9yKSB7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcblx0aWYgKG5vZGUucGFyZW50Tm9kZSkge1xuXHRcdG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcblx0fVxufVxuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lfZWFjaChpdGVyYXRpb25zLCBkZXRhY2hpbmcpIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0aWYgKGl0ZXJhdGlvbnNbaV0pIGl0ZXJhdGlvbnNbaV0uZChkZXRhY2hpbmcpO1xuXHR9XG59XG5cbi8qKlxuICogQHRlbXBsYXRlIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9IEtcbiAqIEBwYXJhbSB7S30gbmFtZVxuICogQHJldHVybnMge0hUTUxFbGVtZW50VGFnTmFtZU1hcFtLXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnQobmFtZSkge1xuXHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbn1cblxuLyoqXG4gKiBAdGVtcGxhdGUge2tleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcH0gS1xuICogQHBhcmFtIHtLfSBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gaXNcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFRhZ05hbWVNYXBbS119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50X2lzKG5hbWUsIGlzKSB7XG5cdHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUsIHsgaXMgfSk7XG59XG5cbi8qKlxuICogQHRlbXBsYXRlIFRcbiAqIEB0ZW1wbGF0ZSB7a2V5b2YgVH0gS1xuICogQHBhcmFtIHtUfSBvYmpcbiAqIEBwYXJhbSB7S1tdfSBleGNsdWRlXG4gKiBAcmV0dXJucyB7UGljazxULCBFeGNsdWRlPGtleW9mIFQsIEs+Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMob2JqLCBleGNsdWRlKSB7XG5cdGNvbnN0IHRhcmdldCA9IC8qKiBAdHlwZSB7UGljazxULCBFeGNsdWRlPGtleW9mIFQsIEs+Pn0gKi8gKHt9KTtcblx0Zm9yIChjb25zdCBrIGluIG9iaikge1xuXHRcdGlmIChcblx0XHRcdGhhc19wcm9wKG9iaiwgaykgJiZcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdGV4Y2x1ZGUuaW5kZXhPZihrKSA9PT0gLTFcblx0XHQpIHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHRhcmdldFtrXSA9IG9ialtrXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBAdGVtcGxhdGUge2tleW9mIFNWR0VsZW1lbnRUYWdOYW1lTWFwfSBLXG4gKiBAcGFyYW0ge0t9IG5hbWVcbiAqIEByZXR1cm5zIHtTVkdFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3ZnX2VsZW1lbnQobmFtZSkge1xuXHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsIG5hbWUpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhXG4gKiBAcmV0dXJucyB7VGV4dH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRleHQoZGF0YSkge1xuXHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSk7XG59XG5cbi8qKlxuICogQHJldHVybnMge1RleHR9ICovXG5leHBvcnQgZnVuY3Rpb24gc3BhY2UoKSB7XG5cdHJldHVybiB0ZXh0KCcgJyk7XG59XG5cbi8qKlxuICogQHJldHVybnMge1RleHR9ICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoKSB7XG5cdHJldHVybiB0ZXh0KCcnKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICogQHJldHVybnMge0NvbW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21tZW50KGNvbnRlbnQpIHtcblx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoY29udGVudCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3R9IGhhbmRsZXJcbiAqIEBwYXJhbSB7Ym9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgRXZlbnRMaXN0ZW5lck9wdGlvbnN9IFtvcHRpb25zXVxuICogQHJldHVybnMgeygpID0+IHZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW4obm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpIHtcblx0bm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcblx0cmV0dXJuICgpID0+IG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogQHJldHVybnMgeyhldmVudDogYW55KSA9PiBhbnl9ICovXG5leHBvcnQgZnVuY3Rpb24gcHJldmVudF9kZWZhdWx0KGZuKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG5cdH07XG59XG5cbi8qKlxuICogQHJldHVybnMgeyhldmVudDogYW55KSA9PiBhbnl9ICovXG5leHBvcnQgZnVuY3Rpb24gc3RvcF9wcm9wYWdhdGlvbihmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcblx0fTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7KGV2ZW50OiBhbnkpID0+IGFueX0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvbihmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0ZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcblx0fTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7KGV2ZW50OiBhbnkpID0+IHZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZihmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGlmIChldmVudC50YXJnZXQgPT09IHRoaXMpIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuXHR9O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHsoZXZlbnQ6IGFueSkgPT4gdm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cnVzdGVkKGZuKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0aWYgKGV2ZW50LmlzVHJ1c3RlZCkgZm4uY2FsbCh0aGlzLCBldmVudCk7XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gW3ZhbHVlXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcblx0aWYgKHZhbHVlID09IG51bGwpIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG5cdGVsc2UgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZSkgIT09IHZhbHVlKSBub2RlLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cbi8qKlxuICogTGlzdCBvZiBhdHRyaWJ1dGVzIHRoYXQgc2hvdWxkIGFsd2F5cyBiZSBzZXQgdGhyb3VnaCB0aGUgYXR0ciBtZXRob2QsXG4gKiBiZWNhdXNlIHVwZGF0aW5nIHRoZW0gdGhyb3VnaCB0aGUgcHJvcGVydHkgc2V0dGVyIGRvZXNuJ3Qgd29yayByZWxpYWJseS5cbiAqIEluIHRoZSBleGFtcGxlIG9mIGB3aWR0aGAvYGhlaWdodGAsIHRoZSBwcm9ibGVtIGlzIHRoYXQgdGhlIHNldHRlciBvbmx5XG4gKiBhY2NlcHRzIG51bWVyaWMgdmFsdWVzLCBidXQgdGhlIGF0dHJpYnV0ZSBjYW4gYWxzbyBiZSBzZXQgdG8gYSBzdHJpbmcgbGlrZSBgNTAlYC5cbiAqIElmIHRoaXMgbGlzdCBiZWNvbWVzIHRvbyBiaWcsIHJldGhpbmsgdGhpcyBhcHByb2FjaC5cbiAqL1xuY29uc3QgYWx3YXlzX3NldF90aHJvdWdoX3NldF9hdHRyaWJ1dGUgPSBbJ3dpZHRoJywgJ2hlaWdodCddO1xuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudCAmIEVsZW1lbnRDU1NJbmxpbmVTdHlsZX0gbm9kZVxuICogQHBhcmFtIHt7IFt4OiBzdHJpbmddOiBzdHJpbmcgfX0gYXR0cmlidXRlc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG5cdC8vIEB0cy1pZ25vcmVcblx0Y29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhub2RlLl9fcHJvdG9fXyk7XG5cdGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRpZiAoYXR0cmlidXRlc1trZXldID09IG51bGwpIHtcblx0XHRcdG5vZGUucmVtb3ZlQXR0cmlidXRlKGtleSk7XG5cdFx0fSBlbHNlIGlmIChrZXkgPT09ICdzdHlsZScpIHtcblx0XHRcdG5vZGUuc3R5bGUuY3NzVGV4dCA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHR9IGVsc2UgaWYgKGtleSA9PT0gJ19fdmFsdWUnKSB7XG5cdFx0XHQvKiogQHR5cGUge2FueX0gKi8gKG5vZGUpLnZhbHVlID0gbm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRkZXNjcmlwdG9yc1trZXldICYmXG5cdFx0XHRkZXNjcmlwdG9yc1trZXldLnNldCAmJlxuXHRcdFx0YWx3YXlzX3NldF90aHJvdWdoX3NldF9hdHRyaWJ1dGUuaW5kZXhPZihrZXkpID09PSAtMVxuXHRcdCkge1xuXHRcdFx0bm9kZVtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7eyBbeDogc3RyaW5nXTogc3RyaW5nIH19IGF0dHJpYnV0ZXNcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X3N2Z19hdHRyaWJ1dGVzKG5vZGUsIGF0dHJpYnV0ZXMpIHtcblx0Zm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdGF0dHIobm9kZSwga2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCB1bmtub3duPn0gZGF0YV9tYXBcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGFfbWFwKG5vZGUsIGRhdGFfbWFwKSB7XG5cdE9iamVjdC5rZXlzKGRhdGFfbWFwKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBrZXksIGRhdGFfbWFwW2tleV0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBwcm9wLCB2YWx1ZSkge1xuXHRjb25zdCBsb3dlciA9IHByb3AudG9Mb3dlckNhc2UoKTsgLy8gZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgYmVoYXZpb3Igd2UgZG8gbG93ZXJjYXNlIGZpcnN0XG5cdGlmIChsb3dlciBpbiBub2RlKSB7XG5cdFx0bm9kZVtsb3dlcl0gPSB0eXBlb2Ygbm9kZVtsb3dlcl0gPT09ICdib29sZWFuJyAmJiB2YWx1ZSA9PT0gJycgPyB0cnVlIDogdmFsdWU7XG5cdH0gZWxzZSBpZiAocHJvcCBpbiBub2RlKSB7XG5cdFx0bm9kZVtwcm9wXSA9IHR5cGVvZiBub2RlW3Byb3BdID09PSAnYm9vbGVhbicgJiYgdmFsdWUgPT09ICcnID8gdHJ1ZSA6IHZhbHVlO1xuXHR9IGVsc2Uge1xuXHRcdGF0dHIobm9kZSwgcHJvcCwgdmFsdWUpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2R5bmFtaWNfZWxlbWVudF9kYXRhKHRhZykge1xuXHRyZXR1cm4gLy0vLnRlc3QodGFnKSA/IHNldF9jdXN0b21fZWxlbWVudF9kYXRhX21hcCA6IHNldF9hdHRyaWJ1dGVzO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24geGxpbmtfYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG5cdG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBhdHRyaWJ1dGUsIHZhbHVlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3N2ZWx0ZV9kYXRhc2V0KG5vZGUpIHtcblx0cmV0dXJuIG5vZGUuZGF0YXNldC5zdmVsdGVIO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHt1bmtub3duW119ICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUoZ3JvdXAsIF9fdmFsdWUsIGNoZWNrZWQpIHtcblx0Y29uc3QgdmFsdWUgPSBuZXcgU2V0KCk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRpZiAoZ3JvdXBbaV0uY2hlY2tlZCkgdmFsdWUuYWRkKGdyb3VwW2ldLl9fdmFsdWUpO1xuXHR9XG5cdGlmICghY2hlY2tlZCkge1xuXHRcdHZhbHVlLmRlbGV0ZShfX3ZhbHVlKTtcblx0fVxuXHRyZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50W119IGdyb3VwXG4gKiBAcmV0dXJucyB7eyBwKC4uLmlucHV0czogSFRNTElucHV0RWxlbWVudFtdKTogdm9pZDsgcigpOiB2b2lkOyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdF9iaW5kaW5nX2dyb3VwKGdyb3VwKSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudFtdfSAqL1xuXHRsZXQgX2lucHV0cztcblx0cmV0dXJuIHtcblx0XHQvKiBwdXNoICovIHAoLi4uaW5wdXRzKSB7XG5cdFx0XHRfaW5wdXRzID0gaW5wdXRzO1xuXHRcdFx0X2lucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4gZ3JvdXAucHVzaChpbnB1dCkpO1xuXHRcdH0sXG5cdFx0LyogcmVtb3ZlICovIHIoKSB7XG5cdFx0XHRfaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiBncm91cC5zcGxpY2UoZ3JvdXAuaW5kZXhPZihpbnB1dCksIDEpKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJbXX0gaW5kZXhlc1xuICogQHJldHVybnMge3sgdShuZXdfaW5kZXhlczogbnVtYmVyW10pOiB2b2lkOyBwKC4uLmlucHV0czogSFRNTElucHV0RWxlbWVudFtdKTogdm9pZDsgcjogKCkgPT4gdm9pZDsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRfYmluZGluZ19ncm91cF9keW5hbWljKGdyb3VwLCBpbmRleGVzKSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudFtdfSAqL1xuXHRsZXQgX2dyb3VwID0gZ2V0X2JpbmRpbmdfZ3JvdXAoZ3JvdXApO1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudFtdfSAqL1xuXHRsZXQgX2lucHV0cztcblxuXHRmdW5jdGlvbiBnZXRfYmluZGluZ19ncm91cChncm91cCkge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXhlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Z3JvdXAgPSBncm91cFtpbmRleGVzW2ldXSA9IGdyb3VwW2luZGV4ZXNbaV1dIHx8IFtdO1xuXHRcdH1cblx0XHRyZXR1cm4gZ3JvdXA7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGZ1bmN0aW9uIHB1c2goKSB7XG5cdFx0X2lucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4gX2dyb3VwLnB1c2goaW5wdXQpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0ZnVuY3Rpb24gcmVtb3ZlKCkge1xuXHRcdF9pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IF9ncm91cC5zcGxpY2UoX2dyb3VwLmluZGV4T2YoaW5wdXQpLCAxKSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHQvKiB1cGRhdGUgKi8gdShuZXdfaW5kZXhlcykge1xuXHRcdFx0aW5kZXhlcyA9IG5ld19pbmRleGVzO1xuXHRcdFx0Y29uc3QgbmV3X2dyb3VwID0gZ2V0X2JpbmRpbmdfZ3JvdXAoZ3JvdXApO1xuXHRcdFx0aWYgKG5ld19ncm91cCAhPT0gX2dyb3VwKSB7XG5cdFx0XHRcdHJlbW92ZSgpO1xuXHRcdFx0XHRfZ3JvdXAgPSBuZXdfZ3JvdXA7XG5cdFx0XHRcdHB1c2goKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIHB1c2ggKi8gcCguLi5pbnB1dHMpIHtcblx0XHRcdF9pbnB1dHMgPSBpbnB1dHM7XG5cdFx0XHRwdXNoKCk7XG5cdFx0fSxcblx0XHQvKiByZW1vdmUgKi8gcjogcmVtb3ZlXG5cdH07XG59XG5cbi8qKiBAcmV0dXJucyB7bnVtYmVyfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvX251bWJlcih2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUgPT09ICcnID8gbnVsbCA6ICt2YWx1ZTtcbn1cblxuLyoqIEByZXR1cm5zIHthbnlbXX0gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lX3Jhbmdlc190b19hcnJheShyYW5nZXMpIHtcblx0Y29uc3QgYXJyYXkgPSBbXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRhcnJheS5wdXNoKHsgc3RhcnQ6IHJhbmdlcy5zdGFydChpKSwgZW5kOiByYW5nZXMuZW5kKGkpIH0pO1xuXHR9XG5cdHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtDaGlsZE5vZGVbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcblx0cmV0dXJuIEFycmF5LmZyb20oZWxlbWVudC5jaGlsZE5vZGVzKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NoaWxkTm9kZUFycmF5fSBub2Rlc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGluaXRfY2xhaW1faW5mbyhub2Rlcykge1xuXHRpZiAobm9kZXMuY2xhaW1faW5mbyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0bm9kZXMuY2xhaW1faW5mbyA9IHsgbGFzdF9pbmRleDogMCwgdG90YWxfY2xhaW1lZDogMCB9O1xuXHR9XG59XG5cbi8qKlxuICogQHRlbXBsYXRlIHtDaGlsZE5vZGVFeH0gUlxuICogQHBhcmFtIHtDaGlsZE5vZGVBcnJheX0gbm9kZXNcbiAqIEBwYXJhbSB7KG5vZGU6IENoaWxkTm9kZUV4KSA9PiBub2RlIGlzIFJ9IHByZWRpY2F0ZVxuICogQHBhcmFtIHsobm9kZTogQ2hpbGROb2RlRXgpID0+IENoaWxkTm9kZUV4IHwgdW5kZWZpbmVkfSBwcm9jZXNzX25vZGVcbiAqIEBwYXJhbSB7KCkgPT4gUn0gY3JlYXRlX25vZGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9udF91cGRhdGVfbGFzdF9pbmRleFxuICogQHJldHVybnMge1J9XG4gKi9cbmZ1bmN0aW9uIGNsYWltX25vZGUobm9kZXMsIHByZWRpY2F0ZSwgcHJvY2Vzc19ub2RlLCBjcmVhdGVfbm9kZSwgZG9udF91cGRhdGVfbGFzdF9pbmRleCA9IGZhbHNlKSB7XG5cdC8vIFRyeSB0byBmaW5kIG5vZGVzIGluIGFuIG9yZGVyIHN1Y2ggdGhhdCB3ZSBsZW5ndGhlbiB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG5cdGluaXRfY2xhaW1faW5mbyhub2Rlcyk7XG5cdGNvbnN0IHJlc3VsdF9ub2RlID0gKCgpID0+IHtcblx0XHQvLyBXZSBmaXJzdCB0cnkgdG8gZmluZCBhbiBlbGVtZW50IGFmdGVyIHRoZSBwcmV2aW91cyBvbmVcblx0XHRmb3IgKGxldCBpID0gbm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4OyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcblx0XHRcdGlmIChwcmVkaWNhdGUobm9kZSkpIHtcblx0XHRcdFx0Y29uc3QgcmVwbGFjZW1lbnQgPSBwcm9jZXNzX25vZGUobm9kZSk7XG5cdFx0XHRcdGlmIChyZXBsYWNlbWVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0bm9kZXMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5vZGVzW2ldID0gcmVwbGFjZW1lbnQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFkb250X3VwZGF0ZV9sYXN0X2luZGV4KSB7XG5cdFx0XHRcdFx0bm9kZXMuY2xhaW1faW5mby5sYXN0X2luZGV4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbm9kZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gT3RoZXJ3aXNlLCB3ZSB0cnkgdG8gZmluZCBvbmUgYmVmb3JlXG5cdFx0Ly8gV2UgaXRlcmF0ZSBpbiByZXZlcnNlIHNvIHRoYXQgd2UgZG9uJ3QgZ28gdG9vIGZhciBiYWNrXG5cdFx0Zm9yIChsZXQgaSA9IG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRjb25zdCBub2RlID0gbm9kZXNbaV07XG5cdFx0XHRpZiAocHJlZGljYXRlKG5vZGUpKSB7XG5cdFx0XHRcdGNvbnN0IHJlcGxhY2VtZW50ID0gcHJvY2Vzc19ub2RlKG5vZGUpO1xuXHRcdFx0XHRpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG5vZGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRub2Rlc1tpXSA9IHJlcGxhY2VtZW50O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghZG9udF91cGRhdGVfbGFzdF9pbmRleCkge1xuXHRcdFx0XHRcdG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCA9IGk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdC8vIFNpbmNlIHdlIHNwbGljZWQgYmVmb3JlIHRoZSBsYXN0X2luZGV4LCB3ZSBkZWNyZWFzZSBpdFxuXHRcdFx0XHRcdG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleC0tO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBub2RlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBJZiB3ZSBjYW4ndCBmaW5kIGFueSBtYXRjaGluZyBub2RlLCB3ZSBjcmVhdGUgYSBuZXcgb25lXG5cdFx0cmV0dXJuIGNyZWF0ZV9ub2RlKCk7XG5cdH0pKCk7XG5cdHJlc3VsdF9ub2RlLmNsYWltX29yZGVyID0gbm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkO1xuXHRub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcblx0cmV0dXJuIHJlc3VsdF9ub2RlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Q2hpbGROb2RlQXJyYXl9IG5vZGVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHt7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfX0gYXR0cmlidXRlc1xuICogQHBhcmFtIHsobmFtZTogc3RyaW5nKSA9PiBFbGVtZW50IHwgU1ZHRWxlbWVudH0gY3JlYXRlX2VsZW1lbnRcbiAqIEByZXR1cm5zIHtFbGVtZW50IHwgU1ZHRWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBjcmVhdGVfZWxlbWVudCkge1xuXHRyZXR1cm4gY2xhaW1fbm9kZShcblx0XHRub2Rlcyxcblx0XHQvKiogQHJldHVybnMge25vZGUgaXMgRWxlbWVudCB8IFNWR0VsZW1lbnR9ICovXG5cdFx0KG5vZGUpID0+IG5vZGUubm9kZU5hbWUgPT09IG5hbWUsXG5cdFx0LyoqIEBwYXJhbSB7RWxlbWVudH0gbm9kZSAqL1xuXHRcdChub2RlKSA9PiB7XG5cdFx0XHRjb25zdCByZW1vdmUgPSBbXTtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGNvbnN0IGF0dHJpYnV0ZSA9IG5vZGUuYXR0cmlidXRlc1tqXTtcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuXHRcdFx0XHRcdHJlbW92ZS5wdXNoKGF0dHJpYnV0ZS5uYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmVtb3ZlLmZvckVhY2goKHYpID0+IG5vZGUucmVtb3ZlQXR0cmlidXRlKHYpKTtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fSxcblx0XHQoKSA9PiBjcmVhdGVfZWxlbWVudChuYW1lKVxuXHQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Q2hpbGROb2RlQXJyYXl9IG5vZGVzXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHt7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfX0gYXR0cmlidXRlc1xuICogQHJldHVybnMge0VsZW1lbnQgfCBTVkdFbGVtZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhaW1fZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcykge1xuXHRyZXR1cm4gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBlbGVtZW50KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NoaWxkTm9kZUFycmF5fSBub2Rlc1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7eyBba2V5OiBzdHJpbmddOiBib29sZWFuIH19IGF0dHJpYnV0ZXNcbiAqIEByZXR1cm5zIHtFbGVtZW50IHwgU1ZHRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYWltX3N2Z19lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzKSB7XG5cdHJldHVybiBjbGFpbV9lbGVtZW50X2Jhc2Uobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMsIHN2Z19lbGVtZW50KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NoaWxkTm9kZUFycmF5fSBub2Rlc1xuICogQHJldHVybnMge1RleHR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFpbV90ZXh0KG5vZGVzLCBkYXRhKSB7XG5cdHJldHVybiBjbGFpbV9ub2RlKFxuXHRcdG5vZGVzLFxuXHRcdC8qKiBAcmV0dXJucyB7bm9kZSBpcyBUZXh0fSAqL1xuXHRcdChub2RlKSA9PiBub2RlLm5vZGVUeXBlID09PSAzLFxuXHRcdC8qKiBAcGFyYW0ge1RleHR9IG5vZGUgKi9cblx0XHQobm9kZSkgPT4ge1xuXHRcdFx0Y29uc3QgZGF0YV9zdHIgPSAnJyArIGRhdGE7XG5cdFx0XHRpZiAobm9kZS5kYXRhLnN0YXJ0c1dpdGgoZGF0YV9zdHIpKSB7XG5cdFx0XHRcdGlmIChub2RlLmRhdGEubGVuZ3RoICE9PSBkYXRhX3N0ci5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXR1cm4gbm9kZS5zcGxpdFRleHQoZGF0YV9zdHIubGVuZ3RoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bm9kZS5kYXRhID0gZGF0YV9zdHI7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQoKSA9PiB0ZXh0KGRhdGEpLFxuXHRcdHRydWUgLy8gVGV4dCBub2RlcyBzaG91bGQgbm90IHVwZGF0ZSBsYXN0IGluZGV4IHNpbmNlIGl0IGlzIGxpa2VseSBub3Qgd29ydGggaXQgdG8gZWxpbWluYXRlIGFuIGluY3JlYXNpbmcgc3Vic2VxdWVuY2Ugb2YgYWN0dWFsIGVsZW1lbnRzXG5cdCk7XG59XG5cbi8qKlxuICogQHJldHVybnMge1RleHR9ICovXG5leHBvcnQgZnVuY3Rpb24gY2xhaW1fc3BhY2Uobm9kZXMpIHtcblx0cmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtDaGlsZE5vZGVBcnJheX0gbm9kZXNcbiAqIEByZXR1cm5zIHtDb21tZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhaW1fY29tbWVudChub2RlcywgZGF0YSkge1xuXHRyZXR1cm4gY2xhaW1fbm9kZShcblx0XHRub2Rlcyxcblx0XHQvKiogQHJldHVybnMge25vZGUgaXMgQ29tbWVudH0gKi9cblx0XHQobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gOCxcblx0XHQvKiogQHBhcmFtIHtDb21tZW50fSBub2RlICovXG5cdFx0KG5vZGUpID0+IHtcblx0XHRcdG5vZGUuZGF0YSA9ICcnICsgZGF0YTtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fSxcblx0XHQoKSA9PiBjb21tZW50KGRhdGEpLFxuXHRcdHRydWVcblx0KTtcbn1cblxuZnVuY3Rpb24gZ2V0X2NvbW1lbnRfaWR4KG5vZGVzLCB0ZXh0LCBzdGFydCkge1xuXHRmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBub2Rlcy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcblx0XHRpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAvKiBjb21tZW50IG5vZGUgKi8gJiYgbm9kZS50ZXh0Q29udGVudC50cmltKCkgPT09IHRleHQpIHtcblx0XHRcdHJldHVybiBpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gLTE7XG59XG5cbi8qKlxuICogQHBhcmFtIHtib29sZWFufSBpc19zdmdcbiAqIEByZXR1cm5zIHtIdG1sVGFnSHlkcmF0aW9ufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhaW1faHRtbF90YWcobm9kZXMsIGlzX3N2Zykge1xuXHQvLyBmaW5kIGh0bWwgb3BlbmluZyB0YWdcblx0Y29uc3Qgc3RhcnRfaW5kZXggPSBnZXRfY29tbWVudF9pZHgobm9kZXMsICdIVE1MX1RBR19TVEFSVCcsIDApO1xuXHRjb25zdCBlbmRfaW5kZXggPSBnZXRfY29tbWVudF9pZHgobm9kZXMsICdIVE1MX1RBR19FTkQnLCBzdGFydF9pbmRleCArIDEpO1xuXHRpZiAoc3RhcnRfaW5kZXggPT09IC0xIHx8IGVuZF9pbmRleCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gbmV3IEh0bWxUYWdIeWRyYXRpb24oaXNfc3ZnKTtcblx0fVxuXG5cdGluaXRfY2xhaW1faW5mbyhub2Rlcyk7XG5cdGNvbnN0IGh0bWxfdGFnX25vZGVzID0gbm9kZXMuc3BsaWNlKHN0YXJ0X2luZGV4LCBlbmRfaW5kZXggLSBzdGFydF9pbmRleCArIDEpO1xuXHRkZXRhY2goaHRtbF90YWdfbm9kZXNbMF0pO1xuXHRkZXRhY2goaHRtbF90YWdfbm9kZXNbaHRtbF90YWdfbm9kZXMubGVuZ3RoIC0gMV0pO1xuXHRjb25zdCBjbGFpbWVkX25vZGVzID0gaHRtbF90YWdfbm9kZXMuc2xpY2UoMSwgaHRtbF90YWdfbm9kZXMubGVuZ3RoIC0gMSk7XG5cdGlmIChjbGFpbWVkX25vZGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBuZXcgSHRtbFRhZ0h5ZHJhdGlvbihpc19zdmcpO1xuXHR9XG5cdGZvciAoY29uc3QgbiBvZiBjbGFpbWVkX25vZGVzKSB7XG5cdFx0bi5jbGFpbV9vcmRlciA9IG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZDtcblx0XHRub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQgKz0gMTtcblx0fVxuXHRyZXR1cm4gbmV3IEh0bWxUYWdIeWRyYXRpb24oaXNfc3ZnLCBjbGFpbWVkX25vZGVzKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1RleHR9IHRleHRcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG5cdGRhdGEgPSAnJyArIGRhdGE7XG5cdGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpIHJldHVybjtcblx0dGV4dC5kYXRhID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChkYXRhKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1RleHR9IHRleHRcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfZGF0YV9jb250ZW50ZWRpdGFibGUodGV4dCwgZGF0YSkge1xuXHRkYXRhID0gJycgKyBkYXRhO1xuXHRpZiAodGV4dC53aG9sZVRleHQgPT09IGRhdGEpIHJldHVybjtcblx0dGV4dC5kYXRhID0gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChkYXRhKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1RleHR9IHRleHRcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJfdmFsdWVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2RhdGFfbWF5YmVfY29udGVudGVkaXRhYmxlKHRleHQsIGRhdGEsIGF0dHJfdmFsdWUpIHtcblx0aWYgKH5jb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcy5pbmRleE9mKGF0dHJfdmFsdWUpKSB7XG5cdFx0c2V0X2RhdGFfY29udGVudGVkaXRhYmxlKHRleHQsIGRhdGEpO1xuXHR9IGVsc2Uge1xuXHRcdHNldF9kYXRhKHRleHQsIGRhdGEpO1xuXHR9XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2lucHV0X3ZhbHVlKGlucHV0LCB2YWx1ZSkge1xuXHRpbnB1dC52YWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG5cdHRyeSB7XG5cdFx0aW5wdXQudHlwZSA9IHR5cGU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBkbyBub3RoaW5nXG5cdH1cbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG5cdGlmICh2YWx1ZSA9PSBudWxsKSB7XG5cdFx0bm9kZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShrZXkpO1xuXHR9IGVsc2Uge1xuXHRcdG5vZGUuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZSwgaW1wb3J0YW50ID8gJ2ltcG9ydGFudCcgOiAnJyk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3Rfb3B0aW9uKHNlbGVjdCwgdmFsdWUsIG1vdW50aW5nKSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcblx0XHRpZiAob3B0aW9uLl9fdmFsdWUgPT09IHZhbHVlKSB7XG5cdFx0XHRvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRpZiAoIW1vdW50aW5nIHx8IHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRzZWxlY3Quc2VsZWN0ZWRJbmRleCA9IC0xOyAvLyBubyBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkXG5cdH1cbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcblx0XHRvcHRpb24uc2VsZWN0ZWQgPSB+dmFsdWUuaW5kZXhPZihvcHRpb24uX192YWx1ZSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcblx0Y29uc3Qgc2VsZWN0ZWRfb3B0aW9uID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3IoJzpjaGVja2VkJyk7XG5cdHJldHVybiBzZWxlY3RlZF9vcHRpb24gJiYgc2VsZWN0ZWRfb3B0aW9uLl9fdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RfbXVsdGlwbGVfdmFsdWUoc2VsZWN0KSB7XG5cdHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgKG9wdGlvbikgPT4gb3B0aW9uLl9fdmFsdWUpO1xufVxuLy8gdW5mb3J0dW5hdGVseSB0aGlzIGNhbid0IGJlIGEgY29uc3RhbnQgYXMgdGhhdCB3b3VsZG4ndCBiZSB0cmVlLXNoYWtlYWJsZVxuLy8gc28gd2UgY2FjaGUgdGhlIHJlc3VsdCBpbnN0ZWFkXG5cbi8qKlxuICogQHR5cGUge2Jvb2xlYW59ICovXG5sZXQgY3Jvc3NvcmlnaW47XG5cbi8qKlxuICogQHJldHVybnMge2Jvb2xlYW59ICovXG5leHBvcnQgZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG5cdGlmIChjcm9zc29yaWdpbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Y3Jvc3NvcmlnaW4gPSBmYWxzZTtcblx0XHR0cnkge1xuXHRcdFx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wYXJlbnQpIHtcblx0XHRcdFx0dm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjcm9zc29yaWdpbiA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBjcm9zc29yaWdpbjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0geygpID0+IHZvaWR9IGZuXG4gKiBAcmV0dXJucyB7KCkgPT4gdm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZF9pZnJhbWVfcmVzaXplX2xpc3RlbmVyKG5vZGUsIGZuKSB7XG5cdGNvbnN0IGNvbXB1dGVkX3N0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0aWYgKGNvbXB1dGVkX3N0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuXHRcdG5vZGUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuXHR9XG5cdGNvbnN0IGlmcmFtZSA9IGVsZW1lbnQoJ2lmcmFtZScpO1xuXHRpZnJhbWUuc2V0QXR0cmlidXRlKFxuXHRcdCdzdHlsZScsXG5cdFx0J2Rpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgJyArXG5cdFx0XHQnb3ZlcmZsb3c6IGhpZGRlbjsgYm9yZGVyOiAwOyBvcGFjaXR5OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogLTE7J1xuXHQpO1xuXHRpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cdGlmcmFtZS50YWJJbmRleCA9IC0xO1xuXHRjb25zdCBjcm9zc29yaWdpbiA9IGlzX2Nyb3Nzb3JpZ2luKCk7XG5cblx0LyoqXG5cdCAqIEB0eXBlIHsoKSA9PiB2b2lkfVxuXHQgKi9cblx0bGV0IHVuc3Vic2NyaWJlO1xuXHRpZiAoY3Jvc3NvcmlnaW4pIHtcblx0XHRpZnJhbWUuc3JjID0gXCJkYXRhOnRleHQvaHRtbCw8c2NyaXB0Pm9ucmVzaXplPWZ1bmN0aW9uKCl7cGFyZW50LnBvc3RNZXNzYWdlKDAsJyonKX08L3NjcmlwdD5cIjtcblx0XHR1bnN1YnNjcmliZSA9IGxpc3Rlbihcblx0XHRcdHdpbmRvdyxcblx0XHRcdCdtZXNzYWdlJyxcblx0XHRcdC8qKiBAcGFyYW0ge01lc3NhZ2VFdmVudH0gZXZlbnQgKi8gKGV2ZW50KSA9PiB7XG5cdFx0XHRcdGlmIChldmVudC5zb3VyY2UgPT09IGlmcmFtZS5jb250ZW50V2luZG93KSBmbigpO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0gZWxzZSB7XG5cdFx0aWZyYW1lLnNyYyA9ICdhYm91dDpibGFuayc7XG5cdFx0aWZyYW1lLm9ubG9hZCA9ICgpID0+IHtcblx0XHRcdHVuc3Vic2NyaWJlID0gbGlzdGVuKGlmcmFtZS5jb250ZW50V2luZG93LCAncmVzaXplJywgZm4pO1xuXHRcdFx0Ly8gbWFrZSBzdXJlIGFuIGluaXRpYWwgcmVzaXplIGV2ZW50IGlzIGZpcmVkIF9hZnRlcl8gdGhlIGlmcmFtZSBpcyBsb2FkZWQgKHdoaWNoIGlzIGFzeW5jaHJvbm91cylcblx0XHRcdC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlL2lzc3Vlcy80MjMzXG5cdFx0XHRmbigpO1xuXHRcdH07XG5cdH1cblx0YXBwZW5kKG5vZGUsIGlmcmFtZSk7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0aWYgKGNyb3Nzb3JpZ2luKSB7XG5cdFx0XHR1bnN1YnNjcmliZSgpO1xuXHRcdH0gZWxzZSBpZiAodW5zdWJzY3JpYmUgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcblx0XHRcdHVuc3Vic2NyaWJlKCk7XG5cdFx0fVxuXHRcdGRldGFjaChpZnJhbWUpO1xuXHR9O1xufVxuZXhwb3J0IGNvbnN0IHJlc2l6ZV9vYnNlcnZlcl9jb250ZW50X2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oe1xuXHRib3g6ICdjb250ZW50LWJveCdcbn0pO1xuZXhwb3J0IGNvbnN0IHJlc2l6ZV9vYnNlcnZlcl9ib3JkZXJfYm94ID0gLyogQF9fUFVSRV9fICovIG5ldyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbih7XG5cdGJveDogJ2JvcmRlci1ib3gnXG59KTtcbmV4cG9ydCBjb25zdCByZXNpemVfb2JzZXJ2ZXJfZGV2aWNlX3BpeGVsX2NvbnRlbnRfYm94ID0gLyogQF9fUFVSRV9fICovIG5ldyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbihcblx0eyBib3g6ICdkZXZpY2UtcGl4ZWwtY29udGVudC1ib3gnIH1cbik7XG5leHBvcnQgeyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiB9O1xuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZV9jbGFzcyhlbGVtZW50LCBuYW1lLCB0b2dnbGUpIHtcblx0Ly8gVGhlIGAhIWAgaXMgcmVxdWlyZWQgYmVjYXVzZSBhbiBgdW5kZWZpbmVkYCBmbGFnIG1lYW5zIGZsaXBwaW5nIHRoZSBjdXJyZW50IHN0YXRlLlxuXHRlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUobmFtZSwgISF0b2dnbGUpO1xufVxuXG4vKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtUfSBbZGV0YWlsXVxuICogQHBhcmFtIHt7IGJ1YmJsZXM/OiBib29sZWFuLCBjYW5jZWxhYmxlPzogYm9vbGVhbiB9fSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHtDdXN0b21FdmVudDxUPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbV9ldmVudCh0eXBlLCBkZXRhaWwsIHsgYnViYmxlcyA9IGZhbHNlLCBjYW5jZWxhYmxlID0gZmFsc2UgfSA9IHt9KSB7XG5cdHJldHVybiBuZXcgQ3VzdG9tRXZlbnQodHlwZSwgeyBkZXRhaWwsIGJ1YmJsZXMsIGNhbmNlbGFibGUgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAqIEByZXR1cm5zIHtDaGlsZE5vZGVBcnJheX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5X3NlbGVjdG9yX2FsbChzZWxlY3RvciwgcGFyZW50ID0gZG9jdW1lbnQuYm9keSkge1xuXHRyZXR1cm4gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBub2RlSWRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGhlYWRcbiAqIEByZXR1cm5zIHthbnlbXX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhlYWRfc2VsZWN0b3Iobm9kZUlkLCBoZWFkKSB7XG5cdGNvbnN0IHJlc3VsdCA9IFtdO1xuXHRsZXQgc3RhcnRlZCA9IDA7XG5cdGZvciAoY29uc3Qgbm9kZSBvZiBoZWFkLmNoaWxkTm9kZXMpIHtcblx0XHRpZiAobm9kZS5ub2RlVHlwZSA9PT0gOCAvKiBjb21tZW50IG5vZGUgKi8pIHtcblx0XHRcdGNvbnN0IGNvbW1lbnQgPSBub2RlLnRleHRDb250ZW50LnRyaW0oKTtcblx0XHRcdGlmIChjb21tZW50ID09PSBgSEVBRF8ke25vZGVJZH1fRU5EYCkge1xuXHRcdFx0XHRzdGFydGVkIC09IDE7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKG5vZGUpO1xuXHRcdFx0fSBlbHNlIGlmIChjb21tZW50ID09PSBgSEVBRF8ke25vZGVJZH1fU1RBUlRgKSB7XG5cdFx0XHRcdHN0YXJ0ZWQgKz0gMTtcblx0XHRcdFx0cmVzdWx0LnB1c2gobm9kZSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzdGFydGVkID4gMCkge1xuXHRcdFx0cmVzdWx0LnB1c2gobm9kZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59XG4vKiogKi9cbmV4cG9ydCBjbGFzcyBIdG1sVGFnIHtcblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBkZWZhdWx0IGZhbHNlXG5cdCAqL1xuXHRpc19zdmcgPSBmYWxzZTtcblx0LyoqIHBhcmVudCBmb3IgY3JlYXRpbmcgbm9kZSAqL1xuXHRlID0gdW5kZWZpbmVkO1xuXHQvKiogaHRtbCB0YWcgbm9kZXMgKi9cblx0biA9IHVuZGVmaW5lZDtcblx0LyoqIHRhcmdldCAqL1xuXHR0ID0gdW5kZWZpbmVkO1xuXHQvKiogYW5jaG9yICovXG5cdGEgPSB1bmRlZmluZWQ7XG5cdGNvbnN0cnVjdG9yKGlzX3N2ZyA9IGZhbHNlKSB7XG5cdFx0dGhpcy5pc19zdmcgPSBpc19zdmc7XG5cdFx0dGhpcy5lID0gdGhpcy5uID0gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGMoaHRtbCkge1xuXHRcdHRoaXMuaChodG1sKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgU1ZHRWxlbWVudH0gdGFyZ2V0XG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnQgfCBTVkdFbGVtZW50fSBhbmNob3Jcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRtKGh0bWwsIHRhcmdldCwgYW5jaG9yID0gbnVsbCkge1xuXHRcdGlmICghdGhpcy5lKSB7XG5cdFx0XHRpZiAodGhpcy5pc19zdmcpXG5cdFx0XHRcdHRoaXMuZSA9IHN2Z19lbGVtZW50KC8qKiBAdHlwZSB7a2V5b2YgU1ZHRWxlbWVudFRhZ05hbWVNYXB9ICovICh0YXJnZXQubm9kZU5hbWUpKTtcblx0XHRcdC8qKiAjNzM2NCAgdGFyZ2V0IGZvciA8dGVtcGxhdGU+IG1heSBiZSBwcm92aWRlZCBhcyAjZG9jdW1lbnQtZnJhZ21lbnQoMTEpICovIGVsc2Vcblx0XHRcdFx0dGhpcy5lID0gZWxlbWVudChcblx0XHRcdFx0XHQvKiogQHR5cGUge2tleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcH0gKi8gKFxuXHRcdFx0XHRcdFx0dGFyZ2V0Lm5vZGVUeXBlID09PSAxMSA/ICdURU1QTEFURScgOiB0YXJnZXQubm9kZU5hbWVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHR0aGlzLnQgPVxuXHRcdFx0XHR0YXJnZXQudGFnTmFtZSAhPT0gJ1RFTVBMQVRFJ1xuXHRcdFx0XHRcdD8gdGFyZ2V0XG5cdFx0XHRcdFx0OiAvKiogQHR5cGUge0hUTUxUZW1wbGF0ZUVsZW1lbnR9ICovICh0YXJnZXQpLmNvbnRlbnQ7XG5cdFx0XHR0aGlzLmMoaHRtbCk7XG5cdFx0fVxuXHRcdHRoaXMuaShhbmNob3IpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0aChodG1sKSB7XG5cdFx0dGhpcy5lLmlubmVySFRNTCA9IGh0bWw7XG5cdFx0dGhpcy5uID0gQXJyYXkuZnJvbShcblx0XHRcdHRoaXMuZS5ub2RlTmFtZSA9PT0gJ1RFTVBMQVRFJyA/IHRoaXMuZS5jb250ZW50LmNoaWxkTm9kZXMgOiB0aGlzLmUuY2hpbGROb2Rlc1xuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGkoYW5jaG9yKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGluc2VydCh0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRwKGh0bWwpIHtcblx0XHR0aGlzLmQoKTtcblx0XHR0aGlzLmgoaHRtbCk7XG5cdFx0dGhpcy5pKHRoaXMuYSk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGQoKSB7XG5cdFx0dGhpcy5uLmZvckVhY2goZGV0YWNoKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgSHRtbFRhZ0h5ZHJhdGlvbiBleHRlbmRzIEh0bWxUYWcge1xuXHQvKiogQHR5cGUge0VsZW1lbnRbXX0gaHlkcmF0aW9uIGNsYWltZWQgbm9kZXMgKi9cblx0bCA9IHVuZGVmaW5lZDtcblxuXHRjb25zdHJ1Y3Rvcihpc19zdmcgPSBmYWxzZSwgY2xhaW1lZF9ub2Rlcykge1xuXHRcdHN1cGVyKGlzX3N2Zyk7XG5cdFx0dGhpcy5lID0gdGhpcy5uID0gbnVsbDtcblx0XHR0aGlzLmwgPSBjbGFpbWVkX25vZGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0YyhodG1sKSB7XG5cdFx0aWYgKHRoaXMubCkge1xuXHRcdFx0dGhpcy5uID0gdGhpcy5sO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdXBlci5jKGh0bWwpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0aShhbmNob3IpIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubi5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdFx0aW5zZXJ0X2h5ZHJhdGlvbih0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05hbWVkTm9kZU1hcH0gYXR0cmlidXRlc1xuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXR0cmlidXRlX3RvX29iamVjdChhdHRyaWJ1dGVzKSB7XG5cdGNvbnN0IHJlc3VsdCA9IHt9O1xuXHRmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiBhdHRyaWJ1dGVzKSB7XG5cdFx0cmVzdWx0W2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5jb25zdCBlc2NhcGVkID0ge1xuXHQnXCInOiAnJnF1b3Q7Jyxcblx0JyYnOiAnJmFtcDsnLFxuXHQnPCc6ICcmbHQ7J1xufTtcblxuY29uc3QgcmVnZXhfYXR0cmlidXRlX2NoYXJhY3RlcnNfdG9fZXNjYXBlID0gL1tcIiY8XS9nO1xuXG4vKipcbiAqIE5vdGUgdGhhdCB0aGUgYXR0cmlidXRlIGl0c2VsZiBzaG91bGQgYmUgc3Vycm91bmRlZCBpbiBkb3VibGUgcXVvdGVzXG4gKiBAcGFyYW0ge2FueX0gYXR0cmlidXRlXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZV9hdHRyaWJ1dGUoYXR0cmlidXRlKSB7XG5cdHJldHVybiBTdHJpbmcoYXR0cmlidXRlKS5yZXBsYWNlKHJlZ2V4X2F0dHJpYnV0ZV9jaGFyYWN0ZXJzX3RvX2VzY2FwZSwgKG1hdGNoKSA9PiBlc2NhcGVkW21hdGNoXSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fSBhdHRyaWJ1dGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlfc3ByZWFkKGF0dHJpYnV0ZXMpIHtcblx0bGV0IHN0ciA9ICcgJztcblx0Zm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdGlmIChhdHRyaWJ1dGVzW2tleV0gIT0gbnVsbCkge1xuXHRcdFx0c3RyICs9IGAke2tleX09XCIke2VzY2FwZV9hdHRyaWJ1dGUoYXR0cmlidXRlc1trZXldKX1cIiBgO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybnMge3t9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2N1c3RvbV9lbGVtZW50c19zbG90cyhlbGVtZW50KSB7XG5cdGNvbnN0IHJlc3VsdCA9IHt9O1xuXHRlbGVtZW50LmNoaWxkTm9kZXMuZm9yRWFjaChcblx0XHQvKiogQHBhcmFtIHtFbGVtZW50fSBub2RlICovIChub2RlKSA9PiB7XG5cdFx0XHRyZXN1bHRbbm9kZS5zbG90IHx8ICdkZWZhdWx0J10gPSB0cnVlO1xuXHRcdH1cblx0KTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0cnVjdF9zdmVsdGVfY29tcG9uZW50KGNvbXBvbmVudCwgcHJvcHMpIHtcblx0cmV0dXJuIG5ldyBjb21wb25lbnQocHJvcHMpO1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtOb2RlICYge1xuICogXHRjbGFpbV9vcmRlcj86IG51bWJlcjtcbiAqIFx0aHlkcmF0ZV9pbml0PzogdHJ1ZTtcbiAqIFx0YWN0dWFsX2VuZF9jaGlsZD86IE5vZGVFeDtcbiAqIFx0Y2hpbGROb2RlczogTm9kZUxpc3RPZjxOb2RlRXg+O1xuICogfX0gTm9kZUV4XG4gKi9cblxuLyoqIEB0eXBlZGVmIHtDaGlsZE5vZGUgJiBOb2RlRXh9IENoaWxkTm9kZUV4ICovXG5cbi8qKiBAdHlwZWRlZiB7Tm9kZUV4ICYgeyBjbGFpbV9vcmRlcjogbnVtYmVyIH19IE5vZGVFeDIgKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Q2hpbGROb2RlRXhbXSAmIHtcbiAqIFx0Y2xhaW1faW5mbz86IHtcbiAqIFx0XHRsYXN0X2luZGV4OiBudW1iZXI7XG4gKiBcdFx0dG90YWxfY2xhaW1lZDogbnVtYmVyO1xuICogXHR9O1xuICogfX0gQ2hpbGROb2RlQXJyYXlcbiAqL1xuIiwgImltcG9ydCB7IGFwcGVuZF9lbXB0eV9zdHlsZXNoZWV0LCBkZXRhY2gsIGdldF9yb290X2Zvcl9zdHlsZSB9IGZyb20gJy4vZG9tLmpzJztcbmltcG9ydCB7IHJhZiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG4vLyB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBpbmZvcm1hdGlvbiBmb3IgbXVsdGlwbGUgZG9jdW1lbnRzIGJlY2F1c2UgYSBTdmVsdGUgYXBwbGljYXRpb24gY291bGQgYWxzbyBjb250YWluIGlmcmFtZXNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvaXNzdWVzLzM2MjRcbi8qKiBAdHlwZSB7TWFwPERvY3VtZW50IHwgU2hhZG93Um9vdCwgaW1wb3J0KCcuL3ByaXZhdGUuZC50cycpLlN0eWxlSW5mb3JtYXRpb24+fSAqL1xuY29uc3QgbWFuYWdlZF9zdHlsZXMgPSBuZXcgTWFwKCk7XG5cbmxldCBhY3RpdmUgPSAwO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGFya3NreWFwcC9zdHJpbmctaGFzaC9ibG9iL21hc3Rlci9pbmRleC5qc1xuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBoYXNoKHN0cikge1xuXHRsZXQgaGFzaCA9IDUzODE7XG5cdGxldCBpID0gc3RyLmxlbmd0aDtcblx0d2hpbGUgKGktLSkgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpIF4gc3RyLmNoYXJDb2RlQXQoaSk7XG5cdHJldHVybiBoYXNoID4+PiAwO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RG9jdW1lbnQgfCBTaGFkb3dSb290fSBkb2NcbiAqIEBwYXJhbSB7RWxlbWVudCAmIEVsZW1lbnRDU1NJbmxpbmVTdHlsZX0gbm9kZVxuICogQHJldHVybnMge3sgc3R5bGVzaGVldDogYW55OyBydWxlczoge307IH19XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZV9zdHlsZV9pbmZvcm1hdGlvbihkb2MsIG5vZGUpIHtcblx0Y29uc3QgaW5mbyA9IHsgc3R5bGVzaGVldDogYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQobm9kZSksIHJ1bGVzOiB7fSB9O1xuXHRtYW5hZ2VkX3N0eWxlcy5zZXQoZG9jLCBpbmZvKTtcblx0cmV0dXJuIGluZm87XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50ICYgRWxlbWVudENTU0lubGluZVN0eWxlfSBub2RlXG4gKiBAcGFyYW0ge251bWJlcn0gYVxuICogQHBhcmFtIHtudW1iZXJ9IGJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5XG4gKiBAcGFyYW0geyh0OiBudW1iZXIpID0+IG51bWJlcn0gZWFzZVxuICogQHBhcmFtIHsodDogbnVtYmVyLCB1OiBudW1iZXIpID0+IHN0cmluZ30gZm5cbiAqIEBwYXJhbSB7bnVtYmVyfSB1aWRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfcnVsZShub2RlLCBhLCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2UsIGZuLCB1aWQgPSAwKSB7XG5cdGNvbnN0IHN0ZXAgPSAxNi42NjYgLyBkdXJhdGlvbjtcblx0bGV0IGtleWZyYW1lcyA9ICd7XFxuJztcblx0Zm9yIChsZXQgcCA9IDA7IHAgPD0gMTsgcCArPSBzdGVwKSB7XG5cdFx0Y29uc3QgdCA9IGEgKyAoYiAtIGEpICogZWFzZShwKTtcblx0XHRrZXlmcmFtZXMgKz0gcCAqIDEwMCArIGAleyR7Zm4odCwgMSAtIHQpfX1cXG5gO1xuXHR9XG5cdGNvbnN0IHJ1bGUgPSBrZXlmcmFtZXMgKyBgMTAwJSB7JHtmbihiLCAxIC0gYil9fVxcbn1gO1xuXHRjb25zdCBuYW1lID0gYF9fc3ZlbHRlXyR7aGFzaChydWxlKX1fJHt1aWR9YDtcblx0Y29uc3QgZG9jID0gZ2V0X3Jvb3RfZm9yX3N0eWxlKG5vZGUpO1xuXHRjb25zdCB7IHN0eWxlc2hlZXQsIHJ1bGVzIH0gPSBtYW5hZ2VkX3N0eWxlcy5nZXQoZG9jKSB8fCBjcmVhdGVfc3R5bGVfaW5mb3JtYXRpb24oZG9jLCBub2RlKTtcblx0aWYgKCFydWxlc1tuYW1lXSkge1xuXHRcdHJ1bGVzW25hbWVdID0gdHJ1ZTtcblx0XHRzdHlsZXNoZWV0Lmluc2VydFJ1bGUoYEBrZXlmcmFtZXMgJHtuYW1lfSAke3J1bGV9YCwgc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuXHR9XG5cdGNvbnN0IGFuaW1hdGlvbiA9IG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnO1xuXHRub2RlLnN0eWxlLmFuaW1hdGlvbiA9IGAke1xuXHRcdGFuaW1hdGlvbiA/IGAke2FuaW1hdGlvbn0sIGAgOiAnJ1xuXHR9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG5cdGFjdGl2ZSArPSAxO1xuXHRyZXR1cm4gbmFtZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZV1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlX3J1bGUobm9kZSwgbmFtZSkge1xuXHRjb25zdCBwcmV2aW91cyA9IChub2RlLnN0eWxlLmFuaW1hdGlvbiB8fCAnJykuc3BsaXQoJywgJyk7XG5cdGNvbnN0IG5leHQgPSBwcmV2aW91cy5maWx0ZXIoXG5cdFx0bmFtZVxuXHRcdFx0PyAoYW5pbSkgPT4gYW5pbS5pbmRleE9mKG5hbWUpIDwgMCAvLyByZW1vdmUgc3BlY2lmaWMgYW5pbWF0aW9uXG5cdFx0XHQ6IChhbmltKSA9PiBhbmltLmluZGV4T2YoJ19fc3ZlbHRlJykgPT09IC0xIC8vIHJlbW92ZSBhbGwgU3ZlbHRlIGFuaW1hdGlvbnNcblx0KTtcblx0Y29uc3QgZGVsZXRlZCA9IHByZXZpb3VzLmxlbmd0aCAtIG5leHQubGVuZ3RoO1xuXHRpZiAoZGVsZXRlZCkge1xuXHRcdG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gbmV4dC5qb2luKCcsICcpO1xuXHRcdGFjdGl2ZSAtPSBkZWxldGVkO1xuXHRcdGlmICghYWN0aXZlKSBjbGVhcl9ydWxlcygpO1xuXHR9XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcblx0cmFmKCgpID0+IHtcblx0XHRpZiAoYWN0aXZlKSByZXR1cm47XG5cdFx0bWFuYWdlZF9zdHlsZXMuZm9yRWFjaCgoaW5mbykgPT4ge1xuXHRcdFx0Y29uc3QgeyBvd25lck5vZGUgfSA9IGluZm8uc3R5bGVzaGVldDtcblx0XHRcdC8vIHRoZXJlIGlzIG5vIG93bmVyTm9kZSBpZiBpdCBydW5zIG9uIGpzZG9tLlxuXHRcdFx0aWYgKG93bmVyTm9kZSkgZGV0YWNoKG93bmVyTm9kZSk7XG5cdFx0fSk7XG5cdFx0bWFuYWdlZF9zdHlsZXMuY2xlYXIoKTtcblx0fSk7XG59XG4iLCAiaW1wb3J0IHsgY3VzdG9tX2V2ZW50IH0gZnJvbSAnLi9kb20uanMnO1xuXG5leHBvcnQgbGV0IGN1cnJlbnRfY29tcG9uZW50O1xuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCkge1xuXHRjdXJyZW50X2NvbXBvbmVudCA9IGNvbXBvbmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldF9jdXJyZW50X2NvbXBvbmVudCgpIHtcblx0aWYgKCFjdXJyZW50X2NvbXBvbmVudCkgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBjYWxsZWQgb3V0c2lkZSBjb21wb25lbnQgaW5pdGlhbGl6YXRpb24nKTtcblx0cmV0dXJuIGN1cnJlbnRfY29tcG9uZW50O1xufVxuXG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHJ1biBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyB1cGRhdGVkIGFmdGVyIGFueSBzdGF0ZSBjaGFuZ2UuXG4gKlxuICogVGhlIGZpcnN0IHRpbWUgdGhlIGNhbGxiYWNrIHJ1bnMgd2lsbCBiZSBiZWZvcmUgdGhlIGluaXRpYWwgYG9uTW91bnRgXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI2JlZm9yZXVwZGF0ZVxuICogQHBhcmFtIHsoKSA9PiBhbnl9IGZuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlZm9yZVVwZGF0ZShmbikge1xuXHRnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5iZWZvcmVfdXBkYXRlLnB1c2goZm4pO1xufVxuXG4vKipcbiAqIFRoZSBgb25Nb3VudGAgZnVuY3Rpb24gc2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gcnVuIGFzIHNvb24gYXMgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBtb3VudGVkIHRvIHRoZSBET00uXG4gKiBJdCBtdXN0IGJlIGNhbGxlZCBkdXJpbmcgdGhlIGNvbXBvbmVudCdzIGluaXRpYWxpc2F0aW9uIChidXQgZG9lc24ndCBuZWVkIHRvIGxpdmUgKmluc2lkZSogdGhlIGNvbXBvbmVudDtcbiAqIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBhbiBleHRlcm5hbCBtb2R1bGUpLlxuICpcbiAqIElmIGEgZnVuY3Rpb24gaXMgcmV0dXJuZWQgX3N5bmNocm9ub3VzbHlfIGZyb20gYG9uTW91bnRgLCBpdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgdW5tb3VudGVkLlxuICpcbiAqIGBvbk1vdW50YCBkb2VzIG5vdCBydW4gaW5zaWRlIGEgW3NlcnZlci1zaWRlIGNvbXBvbmVudF0oL2RvY3MjcnVuLXRpbWUtc2VydmVyLXNpZGUtY29tcG9uZW50LWFwaSkuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI29ubW91bnRcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0geygpID0+IGltcG9ydCgnLi9wcml2YXRlLmpzJykuTm90RnVuY3Rpb248VD4gfCBQcm9taXNlPGltcG9ydCgnLi9wcml2YXRlLmpzJykuTm90RnVuY3Rpb248VD4+IHwgKCgpID0+IGFueSl9IGZuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uTW91bnQoZm4pIHtcblx0Z2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQub25fbW91bnQucHVzaChmbik7XG59XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gcnVuIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gdXBkYXRlZC5cbiAqXG4gKiBUaGUgZmlyc3QgdGltZSB0aGUgY2FsbGJhY2sgcnVucyB3aWxsIGJlIGFmdGVyIHRoZSBpbml0aWFsIGBvbk1vdW50YFxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZSNhZnRlcnVwZGF0ZVxuICogQHBhcmFtIHsoKSA9PiBhbnl9IGZuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyVXBkYXRlKGZuKSB7XG5cdGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmFmdGVyX3VwZGF0ZS5wdXNoKGZuKTtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBjb21wb25lbnQgaXMgdW5tb3VudGVkLlxuICpcbiAqIE91dCBvZiBgb25Nb3VudGAsIGBiZWZvcmVVcGRhdGVgLCBgYWZ0ZXJVcGRhdGVgIGFuZCBgb25EZXN0cm95YCwgdGhpcyBpcyB0aGVcbiAqIG9ubHkgb25lIHRoYXQgcnVucyBpbnNpZGUgYSBzZXJ2ZXItc2lkZSBjb21wb25lbnQuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI29uZGVzdHJveVxuICogQHBhcmFtIHsoKSA9PiBhbnl9IGZuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uRGVzdHJveShmbikge1xuXHRnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9kZXN0cm95LnB1c2goZm4pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gZXZlbnQgZGlzcGF0Y2hlciB0aGF0IGNhbiBiZSB1c2VkIHRvIGRpc3BhdGNoIFtjb21wb25lbnQgZXZlbnRzXSgvZG9jcyN0ZW1wbGF0ZS1zeW50YXgtY29tcG9uZW50LWRpcmVjdGl2ZXMtb24tZXZlbnRuYW1lKS5cbiAqIEV2ZW50IGRpc3BhdGNoZXJzIGFyZSBmdW5jdGlvbnMgdGhhdCBjYW4gdGFrZSB0d28gYXJndW1lbnRzOiBgbmFtZWAgYW5kIGBkZXRhaWxgLlxuICpcbiAqIENvbXBvbmVudCBldmVudHMgY3JlYXRlZCB3aXRoIGBjcmVhdGVFdmVudERpc3BhdGNoZXJgIGNyZWF0ZSBhXG4gKiBbQ3VzdG9tRXZlbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DdXN0b21FdmVudCkuXG4gKiBUaGVzZSBldmVudHMgZG8gbm90IFtidWJibGVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvTGVhcm4vSmF2YVNjcmlwdC9CdWlsZGluZ19ibG9ja3MvRXZlbnRzI0V2ZW50X2J1YmJsaW5nX2FuZF9jYXB0dXJlKS5cbiAqIFRoZSBgZGV0YWlsYCBhcmd1bWVudCBjb3JyZXNwb25kcyB0byB0aGUgW0N1c3RvbUV2ZW50LmRldGFpbF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50L2RldGFpbClcbiAqIHByb3BlcnR5IGFuZCBjYW4gY29udGFpbiBhbnkgdHlwZSBvZiBkYXRhLlxuICpcbiAqIFRoZSBldmVudCBkaXNwYXRjaGVyIGNhbiBiZSB0eXBlZCB0byBuYXJyb3cgdGhlIGFsbG93ZWQgZXZlbnQgbmFtZXMgYW5kIHRoZSB0eXBlIG9mIHRoZSBgZGV0YWlsYCBhcmd1bWVudDpcbiAqIGBgYHRzXG4gKiBjb25zdCBkaXNwYXRjaCA9IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcjx7XG4gKiAgbG9hZGVkOiBuZXZlcjsgLy8gZG9lcyBub3QgdGFrZSBhIGRldGFpbCBhcmd1bWVudFxuICogIGNoYW5nZTogc3RyaW5nOyAvLyB0YWtlcyBhIGRldGFpbCBhcmd1bWVudCBvZiB0eXBlIHN0cmluZywgd2hpY2ggaXMgcmVxdWlyZWRcbiAqICBvcHRpb25hbDogbnVtYmVyIHwgbnVsbDsgLy8gdGFrZXMgYW4gb3B0aW9uYWwgZGV0YWlsIGFyZ3VtZW50IG9mIHR5cGUgbnVtYmVyXG4gKiB9PigpO1xuICogYGBgXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI2NyZWF0ZWV2ZW50ZGlzcGF0Y2hlclxuICogQHRlbXBsYXRlIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbRXZlbnRNYXA9YW55XVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5FdmVudERpc3BhdGNoZXI8RXZlbnRNYXA+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuXHRjb25zdCBjb21wb25lbnQgPSBnZXRfY3VycmVudF9jb21wb25lbnQoKTtcblx0cmV0dXJuICh0eXBlLCBkZXRhaWwsIHsgY2FuY2VsYWJsZSA9IGZhbHNlIH0gPSB7fSkgPT4ge1xuXHRcdGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbdHlwZV07XG5cdFx0aWYgKGNhbGxiYWNrcykge1xuXHRcdFx0Ly8gVE9ETyBhcmUgdGhlcmUgc2l0dWF0aW9ucyB3aGVyZSBldmVudHMgY291bGQgYmUgZGlzcGF0Y2hlZFxuXHRcdFx0Ly8gaW4gYSBzZXJ2ZXIgKG5vbi1ET00pIGVudmlyb25tZW50P1xuXHRcdFx0Y29uc3QgZXZlbnQgPSBjdXN0b21fZXZlbnQoLyoqIEB0eXBlIHtzdHJpbmd9ICovICh0eXBlKSwgZGV0YWlsLCB7IGNhbmNlbGFibGUgfSk7XG5cdFx0XHRjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKChmbikgPT4ge1xuXHRcdFx0XHRmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xufVxuXG4vKipcbiAqIEFzc29jaWF0ZXMgYW4gYXJiaXRyYXJ5IGBjb250ZXh0YCBvYmplY3Qgd2l0aCB0aGUgY3VycmVudCBjb21wb25lbnQgYW5kIHRoZSBzcGVjaWZpZWQgYGtleWBcbiAqIGFuZCByZXR1cm5zIHRoYXQgb2JqZWN0LiBUaGUgY29udGV4dCBpcyB0aGVuIGF2YWlsYWJsZSB0byBjaGlsZHJlbiBvZiB0aGUgY29tcG9uZW50XG4gKiAoaW5jbHVkaW5nIHNsb3R0ZWQgY29udGVudCkgd2l0aCBgZ2V0Q29udGV4dGAuXG4gKlxuICogTGlrZSBsaWZlY3ljbGUgZnVuY3Rpb25zLCB0aGlzIG11c3QgYmUgY2FsbGVkIGR1cmluZyBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI3NldGNvbnRleHRcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge2FueX0ga2V5XG4gKiBAcGFyYW0ge1R9IGNvbnRleHRcbiAqIEByZXR1cm5zIHtUfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcblx0Z2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5zZXQoa2V5LCBjb250ZXh0KTtcblx0cmV0dXJuIGNvbnRleHQ7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBjb250ZXh0IHRoYXQgYmVsb25ncyB0byB0aGUgY2xvc2VzdCBwYXJlbnQgY29tcG9uZW50IHdpdGggdGhlIHNwZWNpZmllZCBga2V5YC5cbiAqIE11c3QgYmUgY2FsbGVkIGR1cmluZyBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI2dldGNvbnRleHRcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge2FueX0ga2V5XG4gKiBAcmV0dXJucyB7VH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRleHQoa2V5KSB7XG5cdHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LmdldChrZXkpO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgd2hvbGUgY29udGV4dCBtYXAgdGhhdCBiZWxvbmdzIHRvIHRoZSBjbG9zZXN0IHBhcmVudCBjb21wb25lbnQuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLiBVc2VmdWwsIGZvciBleGFtcGxlLCBpZiB5b3VcbiAqIHByb2dyYW1tYXRpY2FsbHkgY3JlYXRlIGEgY29tcG9uZW50IGFuZCB3YW50IHRvIHBhc3MgdGhlIGV4aXN0aW5nIGNvbnRleHQgdG8gaXQuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI2dldGFsbGNvbnRleHRzXG4gKiBAdGVtcGxhdGUge01hcDxhbnksIGFueT59IFtUPU1hcDxhbnksIGFueT5dXG4gKiBAcmV0dXJucyB7VH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbENvbnRleHRzKCkge1xuXHRyZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dDtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIGBrZXlgIGhhcyBiZWVuIHNldCBpbiB0aGUgY29udGV4dCBvZiBhIHBhcmVudCBjb21wb25lbnQuXG4gKiBNdXN0IGJlIGNhbGxlZCBkdXJpbmcgY29tcG9uZW50IGluaXRpYWxpc2F0aW9uLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZSNoYXNjb250ZXh0XG4gKiBAcGFyYW0ge2FueX0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0NvbnRleHQoa2V5KSB7XG5cdHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LmhhcyhrZXkpO1xufVxuXG4vLyBUT0RPIGZpZ3VyZSBvdXQgaWYgd2Ugc3RpbGwgd2FudCB0byBzdXBwb3J0XG4vLyBzaG9ydGhhbmQgZXZlbnRzLCBvciBpZiB3ZSB3YW50IHRvIGltcGxlbWVudFxuLy8gYSByZWFsIGJ1YmJsaW5nIG1lY2hhbmlzbVxuLyoqXG4gKiBAcGFyYW0gY29tcG9uZW50XG4gKiBAcGFyYW0gZXZlbnRcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnViYmxlKGNvbXBvbmVudCwgZXZlbnQpIHtcblx0Y29uc3QgY2FsbGJhY2tzID0gY29tcG9uZW50LiQkLmNhbGxiYWNrc1tldmVudC50eXBlXTtcblx0aWYgKGNhbGxiYWNrcykge1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKChmbikgPT4gZm4uY2FsbCh0aGlzLCBldmVudCkpO1xuXHR9XG59XG4iLCAiaW1wb3J0IHsgcnVuX2FsbCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgY3VycmVudF9jb21wb25lbnQsIHNldF9jdXJyZW50X2NvbXBvbmVudCB9IGZyb20gJy4vbGlmZWN5Y2xlLmpzJztcblxuZXhwb3J0IGNvbnN0IGRpcnR5X2NvbXBvbmVudHMgPSBbXTtcbmV4cG9ydCBjb25zdCBpbnRyb3MgPSB7IGVuYWJsZWQ6IGZhbHNlIH07XG5leHBvcnQgY29uc3QgYmluZGluZ19jYWxsYmFja3MgPSBbXTtcblxubGV0IHJlbmRlcl9jYWxsYmFja3MgPSBbXTtcblxuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5cbmNvbnN0IHJlc29sdmVkX3Byb21pc2UgPSAvKiBAX19QVVJFX18gKi8gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbmxldCB1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZV91cGRhdGUoKSB7XG5cdGlmICghdXBkYXRlX3NjaGVkdWxlZCkge1xuXHRcdHVwZGF0ZV9zY2hlZHVsZWQgPSB0cnVlO1xuXHRcdHJlc29sdmVkX3Byb21pc2UudGhlbihmbHVzaCk7XG5cdH1cbn1cblxuLyoqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpY2soKSB7XG5cdHNjaGVkdWxlX3VwZGF0ZSgpO1xuXHRyZXR1cm4gcmVzb2x2ZWRfcHJvbWlzZTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZF9yZW5kZXJfY2FsbGJhY2soZm4pIHtcblx0cmVuZGVyX2NhbGxiYWNrcy5wdXNoKGZuKTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZF9mbHVzaF9jYWxsYmFjayhmbikge1xuXHRmbHVzaF9jYWxsYmFja3MucHVzaChmbik7XG59XG5cbi8vIGZsdXNoKCkgY2FsbHMgY2FsbGJhY2tzIGluIHRoaXMgb3JkZXI6XG4vLyAxLiBBbGwgYmVmb3JlVXBkYXRlIGNhbGxiYWNrcywgaW4gb3JkZXI6IHBhcmVudHMgYmVmb3JlIGNoaWxkcmVuXG4vLyAyLiBBbGwgYmluZDp0aGlzIGNhbGxiYWNrcywgaW4gcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyAzLiBBbGwgYWZ0ZXJVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW4uIEVYQ0VQVFxuLy8gICAgZm9yIGFmdGVyVXBkYXRlcyBjYWxsZWQgZHVyaW5nIHRoZSBpbml0aWFsIG9uTW91bnQsIHdoaWNoIGFyZSBjYWxsZWQgaW5cbi8vICAgIHJldmVyc2Ugb3JkZXI6IGNoaWxkcmVuIGJlZm9yZSBwYXJlbnRzLlxuLy8gU2luY2UgY2FsbGJhY2tzIG1pZ2h0IHVwZGF0ZSBjb21wb25lbnQgdmFsdWVzLCB3aGljaCBjb3VsZCB0cmlnZ2VyIGFub3RoZXJcbi8vIGNhbGwgdG8gZmx1c2goKSwgdGhlIGZvbGxvd2luZyBzdGVwcyBndWFyZCBhZ2FpbnN0IHRoaXM6XG4vLyAxLiBEdXJpbmcgYmVmb3JlVXBkYXRlLCBhbnkgdXBkYXRlZCBjb21wb25lbnRzIHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4vLyAgICBkaXJ0eV9jb21wb25lbnRzIGFycmF5IGFuZCB3aWxsIGNhdXNlIGEgcmVlbnRyYW50IGNhbGwgdG8gZmx1c2goKS4gQmVjYXVzZVxuLy8gICAgdGhlIGZsdXNoIGluZGV4IGlzIGtlcHQgb3V0c2lkZSB0aGUgZnVuY3Rpb24sIHRoZSByZWVudHJhbnQgY2FsbCB3aWxsIHBpY2tcbi8vICAgIHVwIHdoZXJlIHRoZSBlYXJsaWVyIGNhbGwgbGVmdCBvZmYgYW5kIGdvIHRocm91Z2ggYWxsIGRpcnR5IGNvbXBvbmVudHMuIFRoZVxuLy8gICAgY3VycmVudF9jb21wb25lbnQgdmFsdWUgaXMgc2F2ZWQgYW5kIHJlc3RvcmVkIHNvIHRoYXQgdGhlIHJlZW50cmFudCBjYWxsIHdpbGxcbi8vICAgIG5vdCBpbnRlcmZlcmUgd2l0aCB0aGUgXCJwYXJlbnRcIiBmbHVzaCgpIGNhbGwuXG4vLyAyLiBiaW5kOnRoaXMgY2FsbGJhY2tzIGNhbm5vdCB0cmlnZ2VyIG5ldyBmbHVzaCgpIGNhbGxzLlxuLy8gMy4gRHVyaW5nIGFmdGVyVXBkYXRlLCBhbnkgdXBkYXRlZCBjb21wb25lbnRzIHdpbGwgTk9UIGhhdmUgdGhlaXIgYWZ0ZXJVcGRhdGVcbi8vICAgIGNhbGxiYWNrIGNhbGxlZCBhIHNlY29uZCB0aW1lOyB0aGUgc2Vlbl9jYWxsYmFja3Mgc2V0LCBvdXRzaWRlIHRoZSBmbHVzaCgpXG4vLyAgICBmdW5jdGlvbiwgZ3VhcmFudGVlcyB0aGlzIGJlaGF2aW9yLlxuY29uc3Qgc2Vlbl9jYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5cbmxldCBmbHVzaGlkeCA9IDA7IC8vIERvICpub3QqIG1vdmUgdGhpcyBpbnNpZGUgdGhlIGZsdXNoKCkgZnVuY3Rpb25cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsdXNoKCkge1xuXHQvLyBEbyBub3QgcmVlbnRlciBmbHVzaCB3aGlsZSBkaXJ0eSBjb21wb25lbnRzIGFyZSB1cGRhdGVkLCBhcyB0aGlzIGNhblxuXHQvLyByZXN1bHQgaW4gYW4gaW5maW5pdGUgbG9vcC4gSW5zdGVhZCwgbGV0IHRoZSBpbm5lciBmbHVzaCBoYW5kbGUgaXQuXG5cdC8vIFJlZW50cmFuY3kgaXMgb2sgYWZ0ZXJ3YXJkcyBmb3IgYmluZGluZ3MgZXRjLlxuXHRpZiAoZmx1c2hpZHggIT09IDApIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Y29uc3Qgc2F2ZWRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG5cdGRvIHtcblx0XHQvLyBmaXJzdCwgY2FsbCBiZWZvcmVVcGRhdGUgZnVuY3Rpb25zXG5cdFx0Ly8gYW5kIHVwZGF0ZSBjb21wb25lbnRzXG5cdFx0dHJ5IHtcblx0XHRcdHdoaWxlIChmbHVzaGlkeCA8IGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnN0IGNvbXBvbmVudCA9IGRpcnR5X2NvbXBvbmVudHNbZmx1c2hpZHhdO1xuXHRcdFx0XHRmbHVzaGlkeCsrO1xuXHRcdFx0XHRzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcblx0XHRcdFx0dXBkYXRlKGNvbXBvbmVudC4kJCk7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Ly8gcmVzZXQgZGlydHkgc3RhdGUgdG8gbm90IGVuZCB1cCBpbiBhIGRlYWRsb2NrZWQgc3RhdGUgYW5kIHRoZW4gcmV0aHJvd1xuXHRcdFx0ZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuXHRcdFx0Zmx1c2hpZHggPSAwO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdFx0c2V0X2N1cnJlbnRfY29tcG9uZW50KG51bGwpO1xuXHRcdGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoID0gMDtcblx0XHRmbHVzaGlkeCA9IDA7XG5cdFx0d2hpbGUgKGJpbmRpbmdfY2FsbGJhY2tzLmxlbmd0aCkgYmluZGluZ19jYWxsYmFja3MucG9wKCkoKTtcblx0XHQvLyB0aGVuLCBvbmNlIGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGNhbGxcblx0XHQvLyBhZnRlclVwZGF0ZSBmdW5jdGlvbnMuIFRoaXMgbWF5IGNhdXNlXG5cdFx0Ly8gc3Vic2VxdWVudCB1cGRhdGVzLi4uXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJfY2FsbGJhY2tzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRjb25zdCBjYWxsYmFjayA9IHJlbmRlcl9jYWxsYmFja3NbaV07XG5cdFx0XHRpZiAoIXNlZW5fY2FsbGJhY2tzLmhhcyhjYWxsYmFjaykpIHtcblx0XHRcdFx0Ly8gLi4uc28gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBsb29wc1xuXHRcdFx0XHRzZWVuX2NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZW5kZXJfY2FsbGJhY2tzLmxlbmd0aCA9IDA7XG5cdH0gd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKTtcblx0d2hpbGUgKGZsdXNoX2NhbGxiYWNrcy5sZW5ndGgpIHtcblx0XHRmbHVzaF9jYWxsYmFja3MucG9wKCkoKTtcblx0fVxuXHR1cGRhdGVfc2NoZWR1bGVkID0gZmFsc2U7XG5cdHNlZW5fY2FsbGJhY2tzLmNsZWFyKCk7XG5cdHNldF9jdXJyZW50X2NvbXBvbmVudChzYXZlZF9jb21wb25lbnQpO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5mdW5jdGlvbiB1cGRhdGUoJCQpIHtcblx0aWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG5cdFx0JCQudXBkYXRlKCk7XG5cdFx0cnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcblx0XHRjb25zdCBkaXJ0eSA9ICQkLmRpcnR5O1xuXHRcdCQkLmRpcnR5ID0gWy0xXTtcblx0XHQkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5wKCQkLmN0eCwgZGlydHkpO1xuXHRcdCQkLmFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xuXHR9XG59XG5cbi8qKlxuICogVXNlZnVsIGZvciBleGFtcGxlIHRvIGV4ZWN1dGUgcmVtYWluaW5nIGBhZnRlclVwZGF0ZWAgY2FsbGJhY2tzIGJlZm9yZSBleGVjdXRpbmcgYGRlc3Ryb3lgLlxuICogQHBhcmFtIHtGdW5jdGlvbltdfSBmbnNcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmx1c2hfcmVuZGVyX2NhbGxiYWNrcyhmbnMpIHtcblx0Y29uc3QgZmlsdGVyZWQgPSBbXTtcblx0Y29uc3QgdGFyZ2V0cyA9IFtdO1xuXHRyZW5kZXJfY2FsbGJhY2tzLmZvckVhY2goKGMpID0+IChmbnMuaW5kZXhPZihjKSA9PT0gLTEgPyBmaWx0ZXJlZC5wdXNoKGMpIDogdGFyZ2V0cy5wdXNoKGMpKSk7XG5cdHRhcmdldHMuZm9yRWFjaCgoYykgPT4gYygpKTtcblx0cmVuZGVyX2NhbGxiYWNrcyA9IGZpbHRlcmVkO1xufVxuIiwgImltcG9ydCB7IGlkZW50aXR5IGFzIGxpbmVhciwgaXNfZnVuY3Rpb24sIG5vb3AsIHJ1bl9hbGwgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IG5vdyB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuaW1wb3J0IHsgbG9vcCB9IGZyb20gJy4vbG9vcC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVfcnVsZSwgZGVsZXRlX3J1bGUgfSBmcm9tICcuL3N0eWxlX21hbmFnZXIuanMnO1xuaW1wb3J0IHsgY3VzdG9tX2V2ZW50IH0gZnJvbSAnLi9kb20uanMnO1xuaW1wb3J0IHsgYWRkX3JlbmRlcl9jYWxsYmFjayB9IGZyb20gJy4vc2NoZWR1bGVyLmpzJztcblxuLyoqXG4gKiBAdHlwZSB7UHJvbWlzZTx2b2lkPiB8IG51bGx9XG4gKi9cbmxldCBwcm9taXNlO1xuXG4vKipcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICovXG5mdW5jdGlvbiB3YWl0KCkge1xuXHRpZiAoIXByb21pc2UpIHtcblx0XHRwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0cHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdHByb21pc2UgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtJTlRSTyB8IE9VVFJPIHwgYm9vbGVhbn0gZGlyZWN0aW9uXG4gKiBAcGFyYW0geydzdGFydCcgfCAnZW5kJ30ga2luZFxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGRpcmVjdGlvbiwga2luZCkge1xuXHRub2RlLmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KGAke2RpcmVjdGlvbiA/ICdpbnRybycgOiAnb3V0cm8nfSR7a2luZH1gKSk7XG59XG5cbmNvbnN0IG91dHJvaW5nID0gbmV3IFNldCgpO1xuXG4vKipcbiAqIEB0eXBlIHtPdXRyb31cbiAqL1xubGV0IG91dHJvcztcblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBncm91cF9vdXRyb3MoKSB7XG5cdG91dHJvcyA9IHtcblx0XHRyOiAwLFxuXHRcdGM6IFtdLFxuXHRcdHA6IG91dHJvcyAvLyBwYXJlbnQgZ3JvdXBcblx0fTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja19vdXRyb3MoKSB7XG5cdGlmICghb3V0cm9zLnIpIHtcblx0XHRydW5fYWxsKG91dHJvcy5jKTtcblx0fVxuXHRvdXRyb3MgPSBvdXRyb3MucDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuRnJhZ21lbnR9IGJsb2NrXG4gKiBAcGFyYW0gezAgfCAxfSBbbG9jYWxdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb25faW4oYmxvY2ssIGxvY2FsKSB7XG5cdGlmIChibG9jayAmJiBibG9jay5pKSB7XG5cdFx0b3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcblx0XHRibG9jay5pKGxvY2FsKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5GcmFnbWVudH0gYmxvY2tcbiAqIEBwYXJhbSB7MCB8IDF9IGxvY2FsXG4gKiBAcGFyYW0gezAgfCAxfSBbZGV0YWNoXVxuICogQHBhcmFtIHsoKSA9PiB2b2lkfSBbY2FsbGJhY2tdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zaXRpb25fb3V0KGJsb2NrLCBsb2NhbCwgZGV0YWNoLCBjYWxsYmFjaykge1xuXHRpZiAoYmxvY2sgJiYgYmxvY2subykge1xuXHRcdGlmIChvdXRyb2luZy5oYXMoYmxvY2spKSByZXR1cm47XG5cdFx0b3V0cm9pbmcuYWRkKGJsb2NrKTtcblx0XHRvdXRyb3MuYy5wdXNoKCgpID0+IHtcblx0XHRcdG91dHJvaW5nLmRlbGV0ZShibG9jayk7XG5cdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0aWYgKGRldGFjaCkgYmxvY2suZCgxKTtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRibG9jay5vKGxvY2FsKTtcblx0fSBlbHNlIGlmIChjYWxsYmFjaykge1xuXHRcdGNhbGxiYWNrKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBAdHlwZSB7aW1wb3J0KCcuLi90cmFuc2l0aW9uL3B1YmxpYy5qcycpLlRyYW5zaXRpb25Db25maWd9XG4gKi9cbmNvbnN0IG51bGxfdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IDAgfTtcblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7VHJhbnNpdGlvbkZufSBmblxuICogQHBhcmFtIHthbnl9IHBhcmFtc1xuICogQHJldHVybnMge3sgc3RhcnQoKTogdm9pZDsgaW52YWxpZGF0ZSgpOiB2b2lkOyBlbmQoKTogdm9pZDsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9pbl90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcblx0LyoqXG5cdCAqIEB0eXBlIHtUcmFuc2l0aW9uT3B0aW9uc30gKi9cblx0Y29uc3Qgb3B0aW9ucyA9IHsgZGlyZWN0aW9uOiAnaW4nIH07XG5cdGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMsIG9wdGlvbnMpO1xuXHRsZXQgcnVubmluZyA9IGZhbHNlO1xuXHRsZXQgYW5pbWF0aW9uX25hbWU7XG5cdGxldCB0YXNrO1xuXHRsZXQgdWlkID0gMDtcblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGZ1bmN0aW9uIGNsZWFudXAoKSB7XG5cdFx0aWYgKGFuaW1hdGlvbl9uYW1lKSBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGZ1bmN0aW9uIGdvKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGRlbGF5ID0gMCxcblx0XHRcdGR1cmF0aW9uID0gMzAwLFxuXHRcdFx0ZWFzaW5nID0gbGluZWFyLFxuXHRcdFx0dGljayA9IG5vb3AsXG5cdFx0XHRjc3Ncblx0XHR9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcblx0XHRpZiAoY3NzKSBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDAsIDEsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MsIHVpZCsrKTtcblx0XHR0aWNrKDAsIDEpO1xuXHRcdGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuXHRcdGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuXHRcdGlmICh0YXNrKSB0YXNrLmFib3J0KCk7XG5cdFx0cnVubmluZyA9IHRydWU7XG5cdFx0YWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCB0cnVlLCAnc3RhcnQnKSk7XG5cdFx0dGFzayA9IGxvb3AoKG5vdykgPT4ge1xuXHRcdFx0aWYgKHJ1bm5pbmcpIHtcblx0XHRcdFx0aWYgKG5vdyA+PSBlbmRfdGltZSkge1xuXHRcdFx0XHRcdHRpY2soMSwgMCk7XG5cdFx0XHRcdFx0ZGlzcGF0Y2gobm9kZSwgdHJ1ZSwgJ2VuZCcpO1xuXHRcdFx0XHRcdGNsZWFudXAoKTtcblx0XHRcdFx0XHRyZXR1cm4gKHJ1bm5pbmcgPSBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG5cdFx0XHRcdFx0Y29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG5cdFx0XHRcdFx0dGljayh0LCAxIC0gdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBydW5uaW5nO1xuXHRcdH0pO1xuXHR9XG5cdGxldCBzdGFydGVkID0gZmFsc2U7XG5cdHJldHVybiB7XG5cdFx0c3RhcnQoKSB7XG5cdFx0XHRpZiAoc3RhcnRlZCkgcmV0dXJuO1xuXHRcdFx0c3RhcnRlZCA9IHRydWU7XG5cdFx0XHRkZWxldGVfcnVsZShub2RlKTtcblx0XHRcdGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG5cdFx0XHRcdGNvbmZpZyA9IGNvbmZpZyhvcHRpb25zKTtcblx0XHRcdFx0d2FpdCgpLnRoZW4oZ28pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Z28oKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGludmFsaWRhdGUoKSB7XG5cdFx0XHRzdGFydGVkID0gZmFsc2U7XG5cdFx0fSxcblx0XHRlbmQoKSB7XG5cdFx0XHRpZiAocnVubmluZykge1xuXHRcdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHRcdHJ1bm5pbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50ICYgRWxlbWVudENTU0lubGluZVN0eWxlfSBub2RlXG4gKiBAcGFyYW0ge1RyYW5zaXRpb25Gbn0gZm5cbiAqIEBwYXJhbSB7YW55fSBwYXJhbXNcbiAqIEByZXR1cm5zIHt7IGVuZChyZXNldDogYW55KTogdm9pZDsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG5cdC8qKiBAdHlwZSB7VHJhbnNpdGlvbk9wdGlvbnN9ICovXG5cdGNvbnN0IG9wdGlvbnMgPSB7IGRpcmVjdGlvbjogJ291dCcgfTtcblx0bGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcywgb3B0aW9ucyk7XG5cdGxldCBydW5uaW5nID0gdHJ1ZTtcblx0bGV0IGFuaW1hdGlvbl9uYW1lO1xuXHRjb25zdCBncm91cCA9IG91dHJvcztcblx0Z3JvdXAuciArPSAxO1xuXHQvKiogQHR5cGUge2Jvb2xlYW59ICovXG5cdGxldCBvcmlnaW5hbF9pbmVydF92YWx1ZTtcblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGZ1bmN0aW9uIGdvKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGRlbGF5ID0gMCxcblx0XHRcdGR1cmF0aW9uID0gMzAwLFxuXHRcdFx0ZWFzaW5nID0gbGluZWFyLFxuXHRcdFx0dGljayA9IG5vb3AsXG5cdFx0XHRjc3Ncblx0XHR9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcblxuXHRcdGlmIChjc3MpIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMSwgMCwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG5cblx0XHRjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcblx0XHRjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcblx0XHRhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnc3RhcnQnKSk7XG5cblx0XHRpZiAoJ2luZXJ0JyBpbiBub2RlKSB7XG5cdFx0XHRvcmlnaW5hbF9pbmVydF92YWx1ZSA9IC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovIChub2RlKS5pbmVydDtcblx0XHRcdG5vZGUuaW5lcnQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGxvb3AoKG5vdykgPT4ge1xuXHRcdFx0aWYgKHJ1bm5pbmcpIHtcblx0XHRcdFx0aWYgKG5vdyA+PSBlbmRfdGltZSkge1xuXHRcdFx0XHRcdHRpY2soMCwgMSk7XG5cdFx0XHRcdFx0ZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdlbmQnKTtcblx0XHRcdFx0XHRpZiAoIS0tZ3JvdXAucikge1xuXHRcdFx0XHRcdFx0Ly8gdGhpcyB3aWxsIHJlc3VsdCBpbiBgZW5kKClgIGJlaW5nIGNhbGxlZCxcblx0XHRcdFx0XHRcdC8vIHNvIHdlIGRvbid0IG5lZWQgdG8gY2xlYW4gdXAgaGVyZVxuXHRcdFx0XHRcdFx0cnVuX2FsbChncm91cC5jKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChub3cgPj0gc3RhcnRfdGltZSkge1xuXHRcdFx0XHRcdGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuXHRcdFx0XHRcdHRpY2soMSAtIHQsIHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcnVubmluZztcblx0XHR9KTtcblx0fVxuXG5cdGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG5cdFx0d2FpdCgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0Y29uZmlnID0gY29uZmlnKG9wdGlvbnMpO1xuXHRcdFx0Z28oKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRnbygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRlbmQocmVzZXQpIHtcblx0XHRcdGlmIChyZXNldCAmJiAnaW5lcnQnIGluIG5vZGUpIHtcblx0XHRcdFx0bm9kZS5pbmVydCA9IG9yaWdpbmFsX2luZXJ0X3ZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJlc2V0ICYmIGNvbmZpZy50aWNrKSB7XG5cdFx0XHRcdGNvbmZpZy50aWNrKDEsIDApO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJ1bm5pbmcpIHtcblx0XHRcdFx0aWYgKGFuaW1hdGlvbl9uYW1lKSBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG5cdFx0XHRcdHJ1bm5pbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50ICYgRWxlbWVudENTU0lubGluZVN0eWxlfSBub2RlXG4gKiBAcGFyYW0ge1RyYW5zaXRpb25Gbn0gZm5cbiAqIEBwYXJhbSB7YW55fSBwYXJhbXNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW50cm9cbiAqIEByZXR1cm5zIHt7IHJ1bihiOiAwIHwgMSk6IHZvaWQ7IGVuZCgpOiB2b2lkOyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zLCBpbnRybykge1xuXHQvKipcblx0ICogQHR5cGUge1RyYW5zaXRpb25PcHRpb25zfSAqL1xuXHRjb25zdCBvcHRpb25zID0geyBkaXJlY3Rpb246ICdib3RoJyB9O1xuXHRsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zLCBvcHRpb25zKTtcblx0bGV0IHQgPSBpbnRybyA/IDAgOiAxO1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7UHJvZ3JhbSB8IG51bGx9ICovXG5cdGxldCBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7UGVuZGluZ1Byb2dyYW0gfCBudWxsfSAqL1xuXHRsZXQgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcblx0bGV0IGFuaW1hdGlvbl9uYW1lID0gbnVsbDtcblxuXHQvKiogQHR5cGUge2Jvb2xlYW59ICovXG5cdGxldCBvcmlnaW5hbF9pbmVydF92YWx1ZTtcblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGZ1bmN0aW9uIGNsZWFyX2FuaW1hdGlvbigpIHtcblx0XHRpZiAoYW5pbWF0aW9uX25hbWUpIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge1BlbmRpbmdQcm9ncmFtfSBwcm9ncmFtXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuXHQgKiBAcmV0dXJucyB7UHJvZ3JhbX1cblx0ICovXG5cdGZ1bmN0aW9uIGluaXQocHJvZ3JhbSwgZHVyYXRpb24pIHtcblx0XHRjb25zdCBkID0gLyoqIEB0eXBlIHtQcm9ncmFtWydkJ119ICovIChwcm9ncmFtLmIgLSB0KTtcblx0XHRkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0YTogdCxcblx0XHRcdGI6IHByb2dyYW0uYixcblx0XHRcdGQsXG5cdFx0XHRkdXJhdGlvbixcblx0XHRcdHN0YXJ0OiBwcm9ncmFtLnN0YXJ0LFxuXHRcdFx0ZW5kOiBwcm9ncmFtLnN0YXJ0ICsgZHVyYXRpb24sXG5cdFx0XHRncm91cDogcHJvZ3JhbS5ncm91cFxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtJTlRSTyB8IE9VVFJPfSBiXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ28oYikge1xuXHRcdGNvbnN0IHtcblx0XHRcdGRlbGF5ID0gMCxcblx0XHRcdGR1cmF0aW9uID0gMzAwLFxuXHRcdFx0ZWFzaW5nID0gbGluZWFyLFxuXHRcdFx0dGljayA9IG5vb3AsXG5cdFx0XHRjc3Ncblx0XHR9ID0gY29uZmlnIHx8IG51bGxfdHJhbnNpdGlvbjtcblxuXHRcdC8qKlxuXHRcdCAqIEB0eXBlIHtQZW5kaW5nUHJvZ3JhbX0gKi9cblx0XHRjb25zdCBwcm9ncmFtID0ge1xuXHRcdFx0c3RhcnQ6IG5vdygpICsgZGVsYXksXG5cdFx0XHRiXG5cdFx0fTtcblxuXHRcdGlmICghYikge1xuXHRcdFx0Ly8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3Ncblx0XHRcdHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG5cdFx0XHRvdXRyb3MuciArPSAxO1xuXHRcdH1cblxuXHRcdGlmICgnaW5lcnQnIGluIG5vZGUpIHtcblx0XHRcdGlmIChiKSB7XG5cdFx0XHRcdGlmIChvcmlnaW5hbF9pbmVydF92YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Ly8gYWJvcnRlZC9yZXZlcnNlZCBvdXRybyBcdTIwMTQgcmVzdG9yZSBwcmV2aW91cyBpbmVydCB2YWx1ZVxuXHRcdFx0XHRcdG5vZGUuaW5lcnQgPSBvcmlnaW5hbF9pbmVydF92YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3JpZ2luYWxfaW5lcnRfdmFsdWUgPSAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqLyAobm9kZSkuaW5lcnQ7XG5cdFx0XHRcdG5vZGUuaW5lcnQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKSB7XG5cdFx0XHRwZW5kaW5nX3Byb2dyYW0gPSBwcm9ncmFtO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBpZiB0aGlzIGlzIGFuIGludHJvLCBhbmQgdGhlcmUncyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGRvXG5cdFx0XHQvLyBhbiBpbml0aWFsIHRpY2sgYW5kL29yIGFwcGx5IENTUyBhbmltYXRpb24gaW1tZWRpYXRlbHlcblx0XHRcdGlmIChjc3MpIHtcblx0XHRcdFx0Y2xlYXJfYW5pbWF0aW9uKCk7XG5cdFx0XHRcdGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgdCwgYiwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYikgdGljaygwLCAxKTtcblx0XHRcdHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocHJvZ3JhbSwgZHVyYXRpb24pO1xuXHRcdFx0YWRkX3JlbmRlcl9jYWxsYmFjaygoKSA9PiBkaXNwYXRjaChub2RlLCBiLCAnc3RhcnQnKSk7XG5cdFx0XHRsb29wKChub3cpID0+IHtcblx0XHRcdFx0aWYgKHBlbmRpbmdfcHJvZ3JhbSAmJiBub3cgPiBwZW5kaW5nX3Byb2dyYW0uc3RhcnQpIHtcblx0XHRcdFx0XHRydW5uaW5nX3Byb2dyYW0gPSBpbml0KHBlbmRpbmdfcHJvZ3JhbSwgZHVyYXRpb24pO1xuXHRcdFx0XHRcdHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG5cdFx0XHRcdFx0ZGlzcGF0Y2gobm9kZSwgcnVubmluZ19wcm9ncmFtLmIsICdzdGFydCcpO1xuXHRcdFx0XHRcdGlmIChjc3MpIHtcblx0XHRcdFx0XHRcdGNsZWFyX2FuaW1hdGlvbigpO1xuXHRcdFx0XHRcdFx0YW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShcblx0XHRcdFx0XHRcdFx0bm9kZSxcblx0XHRcdFx0XHRcdFx0dCxcblx0XHRcdFx0XHRcdFx0cnVubmluZ19wcm9ncmFtLmIsXG5cdFx0XHRcdFx0XHRcdHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbixcblx0XHRcdFx0XHRcdFx0MCxcblx0XHRcdFx0XHRcdFx0ZWFzaW5nLFxuXHRcdFx0XHRcdFx0XHRjb25maWcuY3NzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocnVubmluZ19wcm9ncmFtKSB7XG5cdFx0XHRcdFx0aWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uZW5kKSB7XG5cdFx0XHRcdFx0XHR0aWNrKCh0ID0gcnVubmluZ19wcm9ncmFtLmIpLCAxIC0gdCk7XG5cdFx0XHRcdFx0XHRkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ2VuZCcpO1xuXHRcdFx0XHRcdFx0aWYgKCFwZW5kaW5nX3Byb2dyYW0pIHtcblx0XHRcdFx0XHRcdFx0Ly8gd2UncmUgZG9uZVxuXHRcdFx0XHRcdFx0XHRpZiAocnVubmluZ19wcm9ncmFtLmIpIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBpbnRybyBcdTIwMTQgd2UgY2FuIHRpZHkgdXAgaW1tZWRpYXRlbHlcblx0XHRcdFx0XHRcdFx0XHRjbGVhcl9hbmltYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHQvLyBvdXRybyBcdTIwMTQgbmVlZHMgdG8gYmUgY29vcmRpbmF0ZWRcblx0XHRcdFx0XHRcdFx0XHRpZiAoIS0tcnVubmluZ19wcm9ncmFtLmdyb3VwLnIpIHJ1bl9hbGwocnVubmluZ19wcm9ncmFtLmdyb3VwLmMpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5zdGFydCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcCA9IG5vdyAtIHJ1bm5pbmdfcHJvZ3JhbS5zdGFydDtcblx0XHRcdFx0XHRcdHQgPSBydW5uaW5nX3Byb2dyYW0uYSArIHJ1bm5pbmdfcHJvZ3JhbS5kICogZWFzaW5nKHAgLyBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24pO1xuXHRcdFx0XHRcdFx0dGljayh0LCAxIC0gdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAhIShydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4ge1xuXHRcdHJ1bihiKSB7XG5cdFx0XHRpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuXHRcdFx0XHR3YWl0KCkudGhlbigoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgb3B0cyA9IHsgZGlyZWN0aW9uOiBiID8gJ2luJyA6ICdvdXQnIH07XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdGNvbmZpZyA9IGNvbmZpZyhvcHRzKTtcblx0XHRcdFx0XHRnbyhiKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnbyhiKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGVuZCgpIHtcblx0XHRcdGNsZWFyX2FuaW1hdGlvbigpO1xuXHRcdFx0cnVubmluZ19wcm9ncmFtID0gcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcblx0XHR9XG5cdH07XG59XG5cbi8qKiBAdHlwZWRlZiB7MX0gSU5UUk8gKi9cbi8qKiBAdHlwZWRlZiB7MH0gT1VUUk8gKi9cbi8qKiBAdHlwZWRlZiB7eyBkaXJlY3Rpb246ICdpbicgfCAnb3V0JyB8ICdib3RoJyB9fSBUcmFuc2l0aW9uT3B0aW9ucyAqL1xuLyoqIEB0eXBlZGVmIHsobm9kZTogRWxlbWVudCwgcGFyYW1zOiBhbnksIG9wdGlvbnM6IFRyYW5zaXRpb25PcHRpb25zKSA9PiBpbXBvcnQoJy4uL3RyYW5zaXRpb24vcHVibGljLmpzJykuVHJhbnNpdGlvbkNvbmZpZ30gVHJhbnNpdGlvbkZuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gT3V0cm9cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9uW119IGNcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBwXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQZW5kaW5nUHJvZ3JhbVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHN0YXJ0XG4gKiBAcHJvcGVydHkge0lOVFJPfE9VVFJPfSBiXG4gKiBAcHJvcGVydHkge091dHJvfSBbZ3JvdXBdXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQcm9ncmFtXG4gKiBAcHJvcGVydHkge251bWJlcn0gYVxuICogQHByb3BlcnR5IHtJTlRST3xPVVRST30gYlxuICogQHByb3BlcnR5IHsxfC0xfSBkXG4gKiBAcHJvcGVydHkge251bWJlcn0gZHVyYXRpb25cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzdGFydFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVuZFxuICogQHByb3BlcnR5IHtPdXRyb30gW2dyb3VwXVxuICovXG4iLCAiaW1wb3J0IHsgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQgfSBmcm9tICcuL3RyYW5zaXRpb25zLmpzJztcbmltcG9ydCB7IHJ1bl9hbGwgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuLy8gZ2VuZXJhbCBlYWNoIGZ1bmN0aW9uczpcblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZV9hcnJheV9saWtlKGFycmF5X2xpa2Vfb3JfaXRlcmF0b3IpIHtcblx0cmV0dXJuIGFycmF5X2xpa2Vfb3JfaXRlcmF0b3I/Lmxlbmd0aCAhPT0gdW5kZWZpbmVkXG5cdFx0PyBhcnJheV9saWtlX29yX2l0ZXJhdG9yXG5cdFx0OiBBcnJheS5mcm9tKGFycmF5X2xpa2Vfb3JfaXRlcmF0b3IpO1xufVxuXG4vLyBrZXllZCBlYWNoIGZ1bmN0aW9uczpcblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuXHRibG9jay5kKDEpO1xuXHRsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBvdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG5cdHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG5cdFx0bG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xuXHR9KTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG5cdGJsb2NrLmYoKTtcblx0ZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpeF9hbmRfb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuXHRibG9jay5mKCk7XG5cdG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuXG4vKiogQHJldHVybnMge2FueVtdfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZV9rZXllZF9lYWNoKFxuXHRvbGRfYmxvY2tzLFxuXHRkaXJ0eSxcblx0Z2V0X2tleSxcblx0ZHluYW1pYyxcblx0Y3R4LFxuXHRsaXN0LFxuXHRsb29rdXAsXG5cdG5vZGUsXG5cdGRlc3Ryb3ksXG5cdGNyZWF0ZV9lYWNoX2Jsb2NrLFxuXHRuZXh0LFxuXHRnZXRfY29udGV4dFxuKSB7XG5cdGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG5cdGxldCBuID0gbGlzdC5sZW5ndGg7XG5cdGxldCBpID0gbztcblx0Y29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcblx0d2hpbGUgKGktLSkgb2xkX2luZGV4ZXNbb2xkX2Jsb2Nrc1tpXS5rZXldID0gaTtcblx0Y29uc3QgbmV3X2Jsb2NrcyA9IFtdO1xuXHRjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuXHRjb25zdCBkZWx0YXMgPSBuZXcgTWFwKCk7XG5cdGNvbnN0IHVwZGF0ZXMgPSBbXTtcblx0aSA9IG47XG5cdHdoaWxlIChpLS0pIHtcblx0XHRjb25zdCBjaGlsZF9jdHggPSBnZXRfY29udGV4dChjdHgsIGxpc3QsIGkpO1xuXHRcdGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcblx0XHRsZXQgYmxvY2sgPSBsb29rdXAuZ2V0KGtleSk7XG5cdFx0aWYgKCFibG9jaykge1xuXHRcdFx0YmxvY2sgPSBjcmVhdGVfZWFjaF9ibG9jayhrZXksIGNoaWxkX2N0eCk7XG5cdFx0XHRibG9jay5jKCk7XG5cdFx0fSBlbHNlIGlmIChkeW5hbWljKSB7XG5cdFx0XHQvLyBkZWZlciB1cGRhdGVzIHVudGlsIGFsbCB0aGUgRE9NIHNodWZmbGluZyBpcyBkb25lXG5cdFx0XHR1cGRhdGVzLnB1c2goKCkgPT4gYmxvY2sucChjaGlsZF9jdHgsIGRpcnR5KSk7XG5cdFx0fVxuXHRcdG5ld19sb29rdXAuc2V0KGtleSwgKG5ld19ibG9ja3NbaV0gPSBibG9jaykpO1xuXHRcdGlmIChrZXkgaW4gb2xkX2luZGV4ZXMpIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuXHR9XG5cdGNvbnN0IHdpbGxfbW92ZSA9IG5ldyBTZXQoKTtcblx0Y29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG5cdC8qKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0ZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG5cdFx0dHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG5cdFx0YmxvY2subShub2RlLCBuZXh0KTtcblx0XHRsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuXHRcdG5leHQgPSBibG9jay5maXJzdDtcblx0XHRuLS07XG5cdH1cblx0d2hpbGUgKG8gJiYgbikge1xuXHRcdGNvbnN0IG5ld19ibG9jayA9IG5ld19ibG9ja3NbbiAtIDFdO1xuXHRcdGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3NbbyAtIDFdO1xuXHRcdGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuXHRcdGNvbnN0IG9sZF9rZXkgPSBvbGRfYmxvY2sua2V5O1xuXHRcdGlmIChuZXdfYmxvY2sgPT09IG9sZF9ibG9jaykge1xuXHRcdFx0Ly8gZG8gbm90aGluZ1xuXHRcdFx0bmV4dCA9IG5ld19ibG9jay5maXJzdDtcblx0XHRcdG8tLTtcblx0XHRcdG4tLTtcblx0XHR9IGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuXHRcdFx0Ly8gcmVtb3ZlIG9sZCBibG9ja1xuXHRcdFx0ZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG5cdFx0XHRvLS07XG5cdFx0fSBlbHNlIGlmICghbG9va3VwLmhhcyhuZXdfa2V5KSB8fCB3aWxsX21vdmUuaGFzKG5ld19rZXkpKSB7XG5cdFx0XHRpbnNlcnQobmV3X2Jsb2NrKTtcblx0XHR9IGVsc2UgaWYgKGRpZF9tb3ZlLmhhcyhvbGRfa2V5KSkge1xuXHRcdFx0by0tO1xuXHRcdH0gZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcblx0XHRcdGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcblx0XHRcdGluc2VydChuZXdfYmxvY2spO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aWxsX21vdmUuYWRkKG9sZF9rZXkpO1xuXHRcdFx0by0tO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoby0tKSB7XG5cdFx0Y29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvXTtcblx0XHRpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9ibG9jay5rZXkpKSBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcblx0fVxuXHR3aGlsZSAobikgaW5zZXJ0KG5ld19ibG9ja3NbbiAtIDFdKTtcblx0cnVuX2FsbCh1cGRhdGVzKTtcblx0cmV0dXJuIG5ld19ibG9ja3M7XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuXHRjb25zdCBrZXlzID0gbmV3IE1hcCgpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBrZXkgPSBnZXRfa2V5KGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSkpO1xuXHRcdGlmIChrZXlzLmhhcyhrZXkpKSB7XG5cdFx0XHRsZXQgdmFsdWUgPSAnJztcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHZhbHVlID0gYHdpdGggdmFsdWUgJyR7U3RyaW5nKGtleSl9JyBgO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHQvLyBjYW4ndCBzdHJpbmdpZnlcblx0XHRcdH1cblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0YENhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaDogS2V5cyBhdCBpbmRleCAke2tleXMuZ2V0KFxuXHRcdFx0XHRcdGtleVxuXHRcdFx0XHQpfSBhbmQgJHtpfSAke3ZhbHVlfWFyZSBkdXBsaWNhdGVzYFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0a2V5cy5zZXQoa2V5LCBpKTtcblx0fVxufVxuIiwgIi8qKiBAcmV0dXJucyB7e319ICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3NwcmVhZF91cGRhdGUobGV2ZWxzLCB1cGRhdGVzKSB7XG5cdGNvbnN0IHVwZGF0ZSA9IHt9O1xuXHRjb25zdCB0b19udWxsX291dCA9IHt9O1xuXHRjb25zdCBhY2NvdW50ZWRfZm9yID0geyAkJHNjb3BlOiAxIH07XG5cdGxldCBpID0gbGV2ZWxzLmxlbmd0aDtcblx0d2hpbGUgKGktLSkge1xuXHRcdGNvbnN0IG8gPSBsZXZlbHNbaV07XG5cdFx0Y29uc3QgbiA9IHVwZGF0ZXNbaV07XG5cdFx0aWYgKG4pIHtcblx0XHRcdGZvciAoY29uc3Qga2V5IGluIG8pIHtcblx0XHRcdFx0aWYgKCEoa2V5IGluIG4pKSB0b19udWxsX291dFtrZXldID0gMTtcblx0XHRcdH1cblx0XHRcdGZvciAoY29uc3Qga2V5IGluIG4pIHtcblx0XHRcdFx0aWYgKCFhY2NvdW50ZWRfZm9yW2tleV0pIHtcblx0XHRcdFx0XHR1cGRhdGVba2V5XSA9IG5ba2V5XTtcblx0XHRcdFx0XHRhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsZXZlbHNbaV0gPSBuO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG5cdFx0XHRcdGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZvciAoY29uc3Qga2V5IGluIHRvX251bGxfb3V0KSB7XG5cdFx0aWYgKCEoa2V5IGluIHVwZGF0ZSkpIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuXHR9XG5cdHJldHVybiB1cGRhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRfc3ByZWFkX29iamVjdChzcHJlYWRfcHJvcHMpIHtcblx0cmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuIiwgImNvbnN0IF9ib29sZWFuX2F0dHJpYnV0ZXMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoW1xuXHQnYWxsb3dmdWxsc2NyZWVuJyxcblx0J2FsbG93cGF5bWVudHJlcXVlc3QnLFxuXHQnYXN5bmMnLFxuXHQnYXV0b2ZvY3VzJyxcblx0J2F1dG9wbGF5Jyxcblx0J2NoZWNrZWQnLFxuXHQnY29udHJvbHMnLFxuXHQnZGVmYXVsdCcsXG5cdCdkZWZlcicsXG5cdCdkaXNhYmxlZCcsXG5cdCdmb3Jtbm92YWxpZGF0ZScsXG5cdCdoaWRkZW4nLFxuXHQnaW5lcnQnLFxuXHQnaXNtYXAnLFxuXHQnbG9vcCcsXG5cdCdtdWx0aXBsZScsXG5cdCdtdXRlZCcsXG5cdCdub21vZHVsZScsXG5cdCdub3ZhbGlkYXRlJyxcblx0J29wZW4nLFxuXHQncGxheXNpbmxpbmUnLFxuXHQncmVhZG9ubHknLFxuXHQncmVxdWlyZWQnLFxuXHQncmV2ZXJzZWQnLFxuXHQnc2VsZWN0ZWQnXG5dKTtcblxuLyoqXG4gKiBMaXN0IG9mIEhUTUwgYm9vbGVhbiBhdHRyaWJ1dGVzIChlLmcuIGA8aW5wdXQgZGlzYWJsZWQ+YCkuXG4gKiBTb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuICpcbiAqIEB0eXBlIHtTZXQ8c3RyaW5nPn1cbiAqL1xuZXhwb3J0IGNvbnN0IGJvb2xlYW5fYXR0cmlidXRlcyA9IG5ldyBTZXQoWy4uLl9ib29sZWFuX2F0dHJpYnV0ZXNdKTtcblxuLyoqIEB0eXBlZGVmIHt0eXBlb2YgX2Jvb2xlYW5fYXR0cmlidXRlc1tudW1iZXJdfSBCb29sZWFuQXR0cmlidXRlcyAqL1xuIiwgIi8qKiByZWdleCBvZiBhbGwgaHRtbCB2b2lkIGVsZW1lbnQgbmFtZXMgKi9cbmNvbnN0IHZvaWRfZWxlbWVudF9uYW1lcyA9XG5cdC9eKD86YXJlYXxiYXNlfGJyfGNvbHxjb21tYW5kfGVtYmVkfGhyfGltZ3xpbnB1dHxrZXlnZW58bGlua3xtZXRhfHBhcmFtfHNvdXJjZXx0cmFja3x3YnIpJC87XG5cbi8qKiByZWdleCBvZiBhbGwgaHRtbCBlbGVtZW50IG5hbWVzLiBzdmcgYW5kIG1hdGggYXJlIG9taXR0ZWQgYmVjYXVzZSB0aGV5IGJlbG9uZyB0byB0aGUgc3ZnIGVsZW1lbnRzIG5hbWVzcGFjZSAqL1xuY29uc3QgaHRtbF9lbGVtZW50X25hbWVzID1cblx0L14oPzphfGFiYnJ8YWRkcmVzc3xhcmVhfGFydGljbGV8YXNpZGV8YXVkaW98YnxiYXNlfGJkaXxiZG98YmxvY2txdW90ZXxib2R5fGJyfGJ1dHRvbnxjYW52YXN8Y2FwdGlvbnxjaXRlfGNvZGV8Y29sfGNvbGdyb3VwfGRhdGF8ZGF0YWxpc3R8ZGR8ZGVsfGRldGFpbHN8ZGZufGRpYWxvZ3xkaXZ8ZGx8ZHR8ZW18ZW1iZWR8ZmllbGRzZXR8ZmlnY2FwdGlvbnxmaWd1cmV8Zm9vdGVyfGZvcm18aDF8aDJ8aDN8aDR8aDV8aDZ8aGVhZHxoZWFkZXJ8aHJ8aHRtbHxpfGlmcmFtZXxpbWd8aW5wdXR8aW5zfGtiZHxsYWJlbHxsZWdlbmR8bGl8bGlua3xtYWlufG1hcHxtYXJrfG1ldGF8bWV0ZXJ8bmF2fG5vc2NyaXB0fG9iamVjdHxvbHxvcHRncm91cHxvcHRpb258b3V0cHV0fHB8cGFyYW18cGljdHVyZXxwcmV8cHJvZ3Jlc3N8cXxycHxydHxydWJ5fHN8c2FtcHxzY3JpcHR8c2VjdGlvbnxzZWxlY3R8c21hbGx8c291cmNlfHNwYW58c3Ryb25nfHN0eWxlfHN1YnxzdW1tYXJ5fHN1cHx0YWJsZXx0Ym9keXx0ZHx0ZW1wbGF0ZXx0ZXh0YXJlYXx0Zm9vdHx0aHx0aGVhZHx0aW1lfHRpdGxlfHRyfHRyYWNrfHV8dWx8dmFyfHZpZGVvfHdicikkLztcblxuLyoqIHJlZ2V4IG9mIGFsbCBzdmcgZWxlbWVudCBuYW1lcyAqL1xuY29uc3Qgc3ZnID1cblx0L14oPzphbHRHbHlwaHxhbHRHbHlwaERlZnxhbHRHbHlwaEl0ZW18YW5pbWF0ZXxhbmltYXRlQ29sb3J8YW5pbWF0ZU1vdGlvbnxhbmltYXRlVHJhbnNmb3JtfGNpcmNsZXxjbGlwUGF0aHxjb2xvci1wcm9maWxlfGN1cnNvcnxkZWZzfGRlc2N8ZGlzY2FyZHxlbGxpcHNlfGZlQmxlbmR8ZmVDb2xvck1hdHJpeHxmZUNvbXBvbmVudFRyYW5zZmVyfGZlQ29tcG9zaXRlfGZlQ29udm9sdmVNYXRyaXh8ZmVEaWZmdXNlTGlnaHRpbmd8ZmVEaXNwbGFjZW1lbnRNYXB8ZmVEaXN0YW50TGlnaHR8ZmVEcm9wU2hhZG93fGZlRmxvb2R8ZmVGdW5jQXxmZUZ1bmNCfGZlRnVuY0d8ZmVGdW5jUnxmZUdhdXNzaWFuQmx1cnxmZUltYWdlfGZlTWVyZ2V8ZmVNZXJnZU5vZGV8ZmVNb3JwaG9sb2d5fGZlT2Zmc2V0fGZlUG9pbnRMaWdodHxmZVNwZWN1bGFyTGlnaHRpbmd8ZmVTcG90TGlnaHR8ZmVUaWxlfGZlVHVyYnVsZW5jZXxmaWx0ZXJ8Zm9udHxmb250LWZhY2V8Zm9udC1mYWNlLWZvcm1hdHxmb250LWZhY2UtbmFtZXxmb250LWZhY2Utc3JjfGZvbnQtZmFjZS11cml8Zm9yZWlnbk9iamVjdHxnfGdseXBofGdseXBoUmVmfGhhdGNofGhhdGNocGF0aHxoa2VybnxpbWFnZXxsaW5lfGxpbmVhckdyYWRpZW50fG1hcmtlcnxtYXNrfG1lc2h8bWVzaGdyYWRpZW50fG1lc2hwYXRjaHxtZXNocm93fG1ldGFkYXRhfG1pc3NpbmctZ2x5cGh8bXBhdGh8cGF0aHxwYXR0ZXJufHBvbHlnb258cG9seWxpbmV8cmFkaWFsR3JhZGllbnR8cmVjdHxzZXR8c29saWRjb2xvcnxzdG9wfHN2Z3xzd2l0Y2h8c3ltYm9sfHRleHR8dGV4dFBhdGh8dHJlZnx0c3Bhbnx1bmtub3dufHVzZXx2aWV3fHZrZXJuKSQvO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzX3ZvaWQobmFtZSkge1xuXHRyZXR1cm4gdm9pZF9lbGVtZW50X25hbWVzLnRlc3QobmFtZSkgfHwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnIWRvY3R5cGUnO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzX2h0bWwobmFtZSkge1xuXHRyZXR1cm4gaHRtbF9lbGVtZW50X25hbWVzLnRlc3QobmFtZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNfc3ZnKG5hbWUpIHtcblx0cmV0dXJuIHN2Zy50ZXN0KG5hbWUpO1xufVxuIiwgImltcG9ydCB7XG5cdGFkZF9yZW5kZXJfY2FsbGJhY2ssXG5cdGZsdXNoLFxuXHRmbHVzaF9yZW5kZXJfY2FsbGJhY2tzLFxuXHRzY2hlZHVsZV91cGRhdGUsXG5cdGRpcnR5X2NvbXBvbmVudHNcbn0gZnJvbSAnLi9zY2hlZHVsZXIuanMnO1xuaW1wb3J0IHsgY3VycmVudF9jb21wb25lbnQsIHNldF9jdXJyZW50X2NvbXBvbmVudCB9IGZyb20gJy4vbGlmZWN5Y2xlLmpzJztcbmltcG9ydCB7IGJsYW5rX29iamVjdCwgaXNfZW1wdHksIGlzX2Z1bmN0aW9uLCBydW4sIHJ1bl9hbGwsIG5vb3AgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7XG5cdGNoaWxkcmVuLFxuXHRkZXRhY2gsXG5cdHN0YXJ0X2h5ZHJhdGluZyxcblx0ZW5kX2h5ZHJhdGluZyxcblx0Z2V0X2N1c3RvbV9lbGVtZW50c19zbG90cyxcblx0aW5zZXJ0LFxuXHRlbGVtZW50LFxuXHRhdHRyXG59IGZyb20gJy4vZG9tLmpzJztcbmltcG9ydCB7IHRyYW5zaXRpb25faW4gfSBmcm9tICcuL3RyYW5zaXRpb25zLmpzJztcblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmQoY29tcG9uZW50LCBuYW1lLCBjYWxsYmFjaykge1xuXHRjb25zdCBpbmRleCA9IGNvbXBvbmVudC4kJC5wcm9wc1tuYW1lXTtcblx0aWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcblx0XHRjb21wb25lbnQuJCQuYm91bmRbaW5kZXhdID0gY2FsbGJhY2s7XG5cdFx0Y2FsbGJhY2soY29tcG9uZW50LiQkLmN0eFtpbmRleF0pO1xuXHR9XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfY29tcG9uZW50KGJsb2NrKSB7XG5cdGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG5cdGJsb2NrICYmIGJsb2NrLmwocGFyZW50X25vZGVzKTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIHRhcmdldCwgYW5jaG9yKSB7XG5cdGNvbnN0IHsgZnJhZ21lbnQsIGFmdGVyX3VwZGF0ZSB9ID0gY29tcG9uZW50LiQkO1xuXHRmcmFnbWVudCAmJiBmcmFnbWVudC5tKHRhcmdldCwgYW5jaG9yKTtcblx0Ly8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuXHRhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IHtcblx0XHRjb25zdCBuZXdfb25fZGVzdHJveSA9IGNvbXBvbmVudC4kJC5vbl9tb3VudC5tYXAocnVuKS5maWx0ZXIoaXNfZnVuY3Rpb24pO1xuXHRcdC8vIGlmIHRoZSBjb21wb25lbnQgd2FzIGRlc3Ryb3llZCBpbW1lZGlhdGVseVxuXHRcdC8vIGl0IHdpbGwgdXBkYXRlIHRoZSBgJCQub25fZGVzdHJveWAgcmVmZXJlbmNlIHRvIGBudWxsYC5cblx0XHQvLyB0aGUgZGVzdHJ1Y3R1cmVkIG9uX2Rlc3Ryb3kgbWF5IHN0aWxsIHJlZmVyZW5jZSB0byB0aGUgb2xkIGFycmF5XG5cdFx0aWYgKGNvbXBvbmVudC4kJC5vbl9kZXN0cm95KSB7XG5cdFx0XHRjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKC4uLm5ld19vbl9kZXN0cm95KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG5cdFx0XHQvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG5cdFx0XHRydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcblx0XHR9XG5cdFx0Y29tcG9uZW50LiQkLm9uX21vdW50ID0gW107XG5cdH0pO1xuXHRhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG5cdGNvbnN0ICQkID0gY29tcG9uZW50LiQkO1xuXHRpZiAoJCQuZnJhZ21lbnQgIT09IG51bGwpIHtcblx0XHRmbHVzaF9yZW5kZXJfY2FsbGJhY2tzKCQkLmFmdGVyX3VwZGF0ZSk7XG5cdFx0cnVuX2FsbCgkJC5vbl9kZXN0cm95KTtcblx0XHQkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5kKGRldGFjaGluZyk7XG5cdFx0Ly8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuXHRcdC8vIHByZXNlcnZlIGZpbmFsIHN0YXRlPylcblx0XHQkJC5vbl9kZXN0cm95ID0gJCQuZnJhZ21lbnQgPSBudWxsO1xuXHRcdCQkLmN0eCA9IFtdO1xuXHR9XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG5cdGlmIChjb21wb25lbnQuJCQuZGlydHlbMF0gPT09IC0xKSB7XG5cdFx0ZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG5cdFx0c2NoZWR1bGVfdXBkYXRlKCk7XG5cdFx0Y29tcG9uZW50LiQkLmRpcnR5LmZpbGwoMCk7XG5cdH1cblx0Y29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gMSA8PCBpICUgMzE7XG59XG5cbi8vIFRPRE86IERvY3VtZW50IHRoZSBvdGhlciBwYXJhbXNcbi8qKlxuICogQHBhcmFtIHtTdmVsdGVDb21wb25lbnR9IGNvbXBvbmVudFxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljLmpzJykuQ29tcG9uZW50Q29uc3RydWN0b3JPcHRpb25zfSBvcHRpb25zXG4gKlxuICogQHBhcmFtIHtpbXBvcnQoJy4vdXRpbHMuanMnKVsnbm90X2VxdWFsJ119IG5vdF9lcXVhbCBVc2VkIHRvIGNvbXBhcmUgcHJvcHMgYW5kIHN0YXRlIHZhbHVlcy5cbiAqIEBwYXJhbSB7KHRhcmdldDogRWxlbWVudCB8IFNoYWRvd1Jvb3QpID0+IHZvaWR9IFthcHBlbmRfc3R5bGVzXSBGdW5jdGlvbiB0aGF0IGFwcGVuZHMgc3R5bGVzIHRvIHRoZSBET00gd2hlbiB0aGUgY29tcG9uZW50IGlzIGZpcnN0IGluaXRpYWxpc2VkLlxuICogVGhpcyB3aWxsIGJlIHRoZSBgYWRkX2Nzc2AgZnVuY3Rpb24gZnJvbSB0aGUgY29tcGlsZWQgY29tcG9uZW50LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdChcblx0Y29tcG9uZW50LFxuXHRvcHRpb25zLFxuXHRpbnN0YW5jZSxcblx0Y3JlYXRlX2ZyYWdtZW50LFxuXHRub3RfZXF1YWwsXG5cdHByb3BzLFxuXHRhcHBlbmRfc3R5bGVzID0gbnVsbCxcblx0ZGlydHkgPSBbLTFdXG4pIHtcblx0Y29uc3QgcGFyZW50X2NvbXBvbmVudCA9IGN1cnJlbnRfY29tcG9uZW50O1xuXHRzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcblx0LyoqIEB0eXBlIHtpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLlQkJH0gKi9cblx0Y29uc3QgJCQgPSAoY29tcG9uZW50LiQkID0ge1xuXHRcdGZyYWdtZW50OiBudWxsLFxuXHRcdGN0eDogW10sXG5cdFx0Ly8gc3RhdGVcblx0XHRwcm9wcyxcblx0XHR1cGRhdGU6IG5vb3AsXG5cdFx0bm90X2VxdWFsLFxuXHRcdGJvdW5kOiBibGFua19vYmplY3QoKSxcblx0XHQvLyBsaWZlY3ljbGVcblx0XHRvbl9tb3VudDogW10sXG5cdFx0b25fZGVzdHJveTogW10sXG5cdFx0b25fZGlzY29ubmVjdDogW10sXG5cdFx0YmVmb3JlX3VwZGF0ZTogW10sXG5cdFx0YWZ0ZXJfdXBkYXRlOiBbXSxcblx0XHRjb250ZXh0OiBuZXcgTWFwKG9wdGlvbnMuY29udGV4dCB8fCAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSksXG5cdFx0Ly8gZXZlcnl0aGluZyBlbHNlXG5cdFx0Y2FsbGJhY2tzOiBibGFua19vYmplY3QoKSxcblx0XHRkaXJ0eSxcblx0XHRza2lwX2JvdW5kOiBmYWxzZSxcblx0XHRyb290OiBvcHRpb25zLnRhcmdldCB8fCBwYXJlbnRfY29tcG9uZW50LiQkLnJvb3Rcblx0fSk7XG5cdGFwcGVuZF9zdHlsZXMgJiYgYXBwZW5kX3N0eWxlcygkJC5yb290KTtcblx0bGV0IHJlYWR5ID0gZmFsc2U7XG5cdCQkLmN0eCA9IGluc3RhbmNlXG5cdFx0PyBpbnN0YW5jZShjb21wb25lbnQsIG9wdGlvbnMucHJvcHMgfHwge30sIChpLCByZXQsIC4uLnJlc3QpID0+IHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSByZXN0Lmxlbmd0aCA/IHJlc3RbMF0gOiByZXQ7XG5cdFx0XHRcdGlmICgkJC5jdHggJiYgbm90X2VxdWFsKCQkLmN0eFtpXSwgKCQkLmN0eFtpXSA9IHZhbHVlKSkpIHtcblx0XHRcdFx0XHRpZiAoISQkLnNraXBfYm91bmQgJiYgJCQuYm91bmRbaV0pICQkLmJvdW5kW2ldKHZhbHVlKTtcblx0XHRcdFx0XHRpZiAocmVhZHkpIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdCAgfSlcblx0XHQ6IFtdO1xuXHQkJC51cGRhdGUoKTtcblx0cmVhZHkgPSB0cnVlO1xuXHRydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuXHQvLyBgZmFsc2VgIGFzIGEgc3BlY2lhbCBjYXNlIG9mIG5vIERPTSBjb21wb25lbnRcblx0JCQuZnJhZ21lbnQgPSBjcmVhdGVfZnJhZ21lbnQgPyBjcmVhdGVfZnJhZ21lbnQoJCQuY3R4KSA6IGZhbHNlO1xuXHRpZiAob3B0aW9ucy50YXJnZXQpIHtcblx0XHRpZiAob3B0aW9ucy5oeWRyYXRlKSB7XG5cdFx0XHRzdGFydF9oeWRyYXRpbmcoKTtcblx0XHRcdC8vIFRPRE86IHdoYXQgaXMgdGhlIGNvcnJlY3QgdHlwZSBoZXJlP1xuXHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvclxuXHRcdFx0Y29uc3Qgbm9kZXMgPSBjaGlsZHJlbihvcHRpb25zLnRhcmdldCk7XG5cdFx0XHQkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5sKG5vZGVzKTtcblx0XHRcdG5vZGVzLmZvckVhY2goZGV0YWNoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cblx0XHRcdCQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmMoKTtcblx0XHR9XG5cdFx0aWYgKG9wdGlvbnMuaW50cm8pIHRyYW5zaXRpb25faW4oY29tcG9uZW50LiQkLmZyYWdtZW50KTtcblx0XHRtb3VudF9jb21wb25lbnQoY29tcG9uZW50LCBvcHRpb25zLnRhcmdldCwgb3B0aW9ucy5hbmNob3IpO1xuXHRcdGVuZF9oeWRyYXRpbmcoKTtcblx0XHRmbHVzaCgpO1xuXHR9XG5cdHNldF9jdXJyZW50X2NvbXBvbmVudChwYXJlbnRfY29tcG9uZW50KTtcbn1cblxuZXhwb3J0IGxldCBTdmVsdGVFbGVtZW50O1xuXG5pZiAodHlwZW9mIEhUTUxFbGVtZW50ID09PSAnZnVuY3Rpb24nKSB7XG5cdFN2ZWx0ZUVsZW1lbnQgPSBjbGFzcyBleHRlbmRzIEhUTUxFbGVtZW50IHtcblx0XHQvKiogVGhlIFN2ZWx0ZSBjb21wb25lbnQgY29uc3RydWN0b3IgKi9cblx0XHQkJGN0b3I7XG5cdFx0LyoqIFNsb3RzICovXG5cdFx0JCRzO1xuXHRcdC8qKiBUaGUgU3ZlbHRlIGNvbXBvbmVudCBpbnN0YW5jZSAqL1xuXHRcdCQkYztcblx0XHQvKiogV2hldGhlciBvciBub3QgdGhlIGN1c3RvbSBlbGVtZW50IGlzIGNvbm5lY3RlZCAqL1xuXHRcdCQkY24gPSBmYWxzZTtcblx0XHQvKiogQ29tcG9uZW50IHByb3BzIGRhdGEgKi9cblx0XHQkJGQgPSB7fTtcblx0XHQvKiogYHRydWVgIGlmIGN1cnJlbnRseSBpbiB0aGUgcHJvY2VzcyBvZiByZWZsZWN0aW5nIGNvbXBvbmVudCBwcm9wcyBiYWNrIHRvIGF0dHJpYnV0ZXMgKi9cblx0XHQkJHIgPSBmYWxzZTtcblx0XHQvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnRQcm9wRGVmaW5pdGlvbj59IFByb3BzIGRlZmluaXRpb24gKG5hbWUsIHJlZmxlY3RlZCwgdHlwZSBldGMpICovXG5cdFx0JCRwX2QgPSB7fTtcblx0XHQvKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIEZ1bmN0aW9uW10+fSBFdmVudCBsaXN0ZW5lcnMgKi9cblx0XHQkJGwgPSB7fTtcblx0XHQvKiogQHR5cGUge01hcDxGdW5jdGlvbiwgRnVuY3Rpb24+fSBFdmVudCBsaXN0ZW5lciB1bnN1YnNjcmliZSBmdW5jdGlvbnMgKi9cblx0XHQkJGxfdSA9IG5ldyBNYXAoKTtcblxuXHRcdGNvbnN0cnVjdG9yKCQkY29tcG9uZW50Q3RvciwgJCRzbG90cywgdXNlX3NoYWRvd19kb20pIHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0XHR0aGlzLiQkY3RvciA9ICQkY29tcG9uZW50Q3Rvcjtcblx0XHRcdHRoaXMuJCRzID0gJCRzbG90cztcblx0XHRcdGlmICh1c2Vfc2hhZG93X2RvbSkge1xuXHRcdFx0XHR0aGlzLmF0dGFjaFNoYWRvdyh7IG1vZGU6ICdvcGVuJyB9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKSB7XG5cdFx0XHQvLyBXZSBjYW4ndCBkZXRlcm1pbmUgdXBmcm9udCBpZiB0aGUgZXZlbnQgaXMgYSBjdXN0b20gZXZlbnQgb3Igbm90LCBzbyB3ZSBoYXZlIHRvXG5cdFx0XHQvLyBsaXN0ZW4gdG8gYm90aC4gSWYgc29tZW9uZSB1c2VzIGEgY3VzdG9tIGV2ZW50IHdpdGggdGhlIHNhbWUgbmFtZSBhcyBhIHJlZ3VsYXJcblx0XHRcdC8vIGJyb3dzZXIgZXZlbnQsIHRoaXMgZmlyZXMgdHdpY2UgLSB3ZSBjYW4ndCBhdm9pZCB0aGF0LlxuXHRcdFx0dGhpcy4kJGxbdHlwZV0gPSB0aGlzLiQkbFt0eXBlXSB8fCBbXTtcblx0XHRcdHRoaXMuJCRsW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuXHRcdFx0aWYgKHRoaXMuJCRjKSB7XG5cdFx0XHRcdGNvbnN0IHVuc3ViID0gdGhpcy4kJGMuJG9uKHR5cGUsIGxpc3RlbmVyKTtcblx0XHRcdFx0dGhpcy4kJGxfdS5zZXQobGlzdGVuZXIsIHVuc3ViKTtcblx0XHRcdH1cblx0XHRcdHN1cGVyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpIHtcblx0XHRcdHN1cGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuXHRcdFx0aWYgKHRoaXMuJCRjKSB7XG5cdFx0XHRcdGNvbnN0IHVuc3ViID0gdGhpcy4kJGxfdS5nZXQobGlzdGVuZXIpO1xuXHRcdFx0XHRpZiAodW5zdWIpIHtcblx0XHRcdFx0XHR1bnN1YigpO1xuXHRcdFx0XHRcdHRoaXMuJCRsX3UuZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGFzeW5jIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuXHRcdFx0dGhpcy4kJGNuID0gdHJ1ZTtcblx0XHRcdGlmICghdGhpcy4kJGMpIHtcblx0XHRcdFx0Ly8gV2Ugd2FpdCBvbmUgdGljayB0byBsZXQgcG9zc2libGUgY2hpbGQgc2xvdCBlbGVtZW50cyBiZSBjcmVhdGVkL21vdW50ZWRcblx0XHRcdFx0YXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHRcdGlmICghdGhpcy4kJGNuKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZ1bmN0aW9uIGNyZWF0ZV9zbG90KG5hbWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IG5vZGU7XG5cdFx0XHRcdFx0XHRjb25zdCBvYmogPSB7XG5cdFx0XHRcdFx0XHRcdGM6IGZ1bmN0aW9uIGNyZWF0ZSgpIHtcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbWVudCgnc2xvdCcpO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGF0dHIobm9kZSwgJ25hbWUnLCBuYW1lKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdFx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcblx0XHRcdFx0XHRcdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2FuY2hvcl1cblx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdG06IGZ1bmN0aW9uIG1vdW50KHRhcmdldCwgYW5jaG9yKSB7XG5cdFx0XHRcdFx0XHRcdFx0aW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKTtcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0ZDogZnVuY3Rpb24gZGVzdHJveShkZXRhY2hpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV0YWNoaW5nKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRkZXRhY2gobm9kZSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0cmV0dXJuIG9iajtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0ICQkc2xvdHMgPSB7fTtcblx0XHRcdFx0Y29uc3QgZXhpc3Rpbmdfc2xvdHMgPSBnZXRfY3VzdG9tX2VsZW1lbnRzX3Nsb3RzKHRoaXMpO1xuXHRcdFx0XHRmb3IgKGNvbnN0IG5hbWUgb2YgdGhpcy4kJHMpIHtcblx0XHRcdFx0XHRpZiAobmFtZSBpbiBleGlzdGluZ19zbG90cykge1xuXHRcdFx0XHRcdFx0JCRzbG90c1tuYW1lXSA9IFtjcmVhdGVfc2xvdChuYW1lKV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAoY29uc3QgYXR0cmlidXRlIG9mIHRoaXMuYXR0cmlidXRlcykge1xuXHRcdFx0XHRcdC8vIHRoaXMuJCRkYXRhIHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGlzLmF0dHJpYnV0ZXNcblx0XHRcdFx0XHRjb25zdCBuYW1lID0gdGhpcy4kJGdfcChhdHRyaWJ1dGUubmFtZSk7XG5cdFx0XHRcdFx0aWYgKCEobmFtZSBpbiB0aGlzLiQkZCkpIHtcblx0XHRcdFx0XHRcdHRoaXMuJCRkW25hbWVdID0gZ2V0X2N1c3RvbV9lbGVtZW50X3ZhbHVlKG5hbWUsIGF0dHJpYnV0ZS52YWx1ZSwgdGhpcy4kJHBfZCwgJ3RvUHJvcCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBQb3J0IG92ZXIgcHJvcHMgdGhhdCB3ZXJlIHNldCBwcm9ncmFtbWF0aWNhbGx5IGJlZm9yZSBjZSB3YXMgaW5pdGlhbGl6ZWRcblx0XHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJHBfZCkge1xuXHRcdFx0XHRcdGlmICghKGtleSBpbiB0aGlzLiQkZCkgJiYgdGhpc1trZXldICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHRoaXMuJCRkW2tleV0gPSB0aGlzW2tleV07IC8vIGRvbid0IHRyYW5zZm9ybSwgdGhlc2Ugd2VyZSBzZXQgdGhyb3VnaCBKYXZhU2NyaXB0XG5cdFx0XHRcdFx0XHRkZWxldGUgdGhpc1trZXldOyAvLyByZW1vdmUgdGhlIHByb3BlcnR5IHRoYXQgc2hhZG93cyB0aGUgZ2V0dGVyL3NldHRlclxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLiQkYyA9IG5ldyB0aGlzLiQkY3Rvcih7XG5cdFx0XHRcdFx0dGFyZ2V0OiB0aGlzLnNoYWRvd1Jvb3QgfHwgdGhpcyxcblx0XHRcdFx0XHRwcm9wczoge1xuXHRcdFx0XHRcdFx0Li4udGhpcy4kJGQsXG5cdFx0XHRcdFx0XHQkJHNsb3RzLFxuXHRcdFx0XHRcdFx0JCRzY29wZToge1xuXHRcdFx0XHRcdFx0XHRjdHg6IFtdXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBSZWZsZWN0IGNvbXBvbmVudCBwcm9wcyBhcyBhdHRyaWJ1dGVzXG5cdFx0XHRcdGNvbnN0IHJlZmxlY3RfYXR0cmlidXRlcyA9ICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLiQkciA9IHRydWU7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gdGhpcy4kJHBfZCkge1xuXHRcdFx0XHRcdFx0dGhpcy4kJGRba2V5XSA9IHRoaXMuJCRjLiQkLmN0eFt0aGlzLiQkYy4kJC5wcm9wc1trZXldXTtcblx0XHRcdFx0XHRcdGlmICh0aGlzLiQkcF9kW2tleV0ucmVmbGVjdCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBhdHRyaWJ1dGVfdmFsdWUgPSBnZXRfY3VzdG9tX2VsZW1lbnRfdmFsdWUoXG5cdFx0XHRcdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuJCRkW2tleV0sXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy4kJHBfZCxcblx0XHRcdFx0XHRcdFx0XHQndG9BdHRyaWJ1dGUnXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVfdmFsdWUgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMucmVtb3ZlQXR0cmlidXRlKHRoaXMuJCRwX2Rba2V5XS5hdHRyaWJ1dGUgfHwga2V5KTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSh0aGlzLiQkcF9kW2tleV0uYXR0cmlidXRlIHx8IGtleSwgYXR0cmlidXRlX3ZhbHVlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLiQkciA9IGZhbHNlO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR0aGlzLiQkYy4kJC5hZnRlcl91cGRhdGUucHVzaChyZWZsZWN0X2F0dHJpYnV0ZXMpO1xuXHRcdFx0XHRyZWZsZWN0X2F0dHJpYnV0ZXMoKTsgLy8gb25jZSBpbml0aWFsbHkgYmVjYXVzZSBhZnRlcl91cGRhdGUgaXMgYWRkZWQgdG9vIGxhdGUgZm9yIGZpcnN0IHJlbmRlclxuXG5cdFx0XHRcdGZvciAoY29uc3QgdHlwZSBpbiB0aGlzLiQkbCkge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy4kJGxbdHlwZV0pIHtcblx0XHRcdFx0XHRcdGNvbnN0IHVuc3ViID0gdGhpcy4kJGMuJG9uKHR5cGUsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHRcdHRoaXMuJCRsX3Uuc2V0KGxpc3RlbmVyLCB1bnN1Yik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuJCRsID0ge307XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gV2UgZG9uJ3QgbmVlZCB0aGlzIHdoZW4gd29ya2luZyB3aXRoaW4gU3ZlbHRlIGNvZGUsIGJ1dCBmb3IgY29tcGF0aWJpbGl0eSBvZiBwZW9wbGUgdXNpbmcgdGhpcyBvdXRzaWRlIG9mIFN2ZWx0ZVxuXHRcdC8vIGFuZCBzZXR0aW5nIGF0dHJpYnV0ZXMgdGhyb3VnaCBzZXRBdHRyaWJ1dGUgZXRjLCB0aGlzIGlzIGhlbHBmdWxcblx0XHRhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ciwgX29sZFZhbHVlLCBuZXdWYWx1ZSkge1xuXHRcdFx0aWYgKHRoaXMuJCRyKSByZXR1cm47XG5cdFx0XHRhdHRyID0gdGhpcy4kJGdfcChhdHRyKTtcblx0XHRcdHRoaXMuJCRkW2F0dHJdID0gZ2V0X2N1c3RvbV9lbGVtZW50X3ZhbHVlKGF0dHIsIG5ld1ZhbHVlLCB0aGlzLiQkcF9kLCAndG9Qcm9wJyk7XG5cdFx0XHR0aGlzLiQkYz8uJHNldCh7IFthdHRyXTogdGhpcy4kJGRbYXR0cl0gfSk7XG5cdFx0fVxuXG5cdFx0ZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHR0aGlzLiQkY24gPSBmYWxzZTtcblx0XHRcdC8vIEluIGEgbWljcm90YXNrLCBiZWNhdXNlIHRoaXMgY291bGQgYmUgYSBtb3ZlIHdpdGhpbiB0aGUgRE9NXG5cdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0aWYgKCF0aGlzLiQkY24pIHtcblx0XHRcdFx0XHR0aGlzLiQkYy4kZGVzdHJveSgpO1xuXHRcdFx0XHRcdHRoaXMuJCRjID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQkJGdfcChhdHRyaWJ1dGVfbmFtZSkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0T2JqZWN0LmtleXModGhpcy4kJHBfZCkuZmluZChcblx0XHRcdFx0XHQoa2V5KSA9PlxuXHRcdFx0XHRcdFx0dGhpcy4kJHBfZFtrZXldLmF0dHJpYnV0ZSA9PT0gYXR0cmlidXRlX25hbWUgfHxcblx0XHRcdFx0XHRcdCghdGhpcy4kJHBfZFtrZXldLmF0dHJpYnV0ZSAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gYXR0cmlidXRlX25hbWUpXG5cdFx0XHRcdCkgfHwgYXR0cmlidXRlX25hbWVcblx0XHRcdCk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudFByb3BEZWZpbml0aW9uPn0gcHJvcHNfZGVmaW5pdGlvblxuICogQHBhcmFtIHsndG9BdHRyaWJ1dGUnIHwgJ3RvUHJvcCd9IFt0cmFuc2Zvcm1dXG4gKi9cbmZ1bmN0aW9uIGdldF9jdXN0b21fZWxlbWVudF92YWx1ZShwcm9wLCB2YWx1ZSwgcHJvcHNfZGVmaW5pdGlvbiwgdHJhbnNmb3JtKSB7XG5cdGNvbnN0IHR5cGUgPSBwcm9wc19kZWZpbml0aW9uW3Byb3BdPy50eXBlO1xuXHR2YWx1ZSA9IHR5cGUgPT09ICdCb29sZWFuJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJyA/IHZhbHVlICE9IG51bGwgOiB2YWx1ZTtcblx0aWYgKCF0cmFuc2Zvcm0gfHwgIXByb3BzX2RlZmluaXRpb25bcHJvcF0pIHtcblx0XHRyZXR1cm4gdmFsdWU7XG5cdH0gZWxzZSBpZiAodHJhbnNmb3JtID09PSAndG9BdHRyaWJ1dGUnKSB7XG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlICdPYmplY3QnOlxuXHRcdFx0Y2FzZSAnQXJyYXknOlxuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRjYXNlICdCb29sZWFuJzpcblx0XHRcdFx0cmV0dXJuIHZhbHVlID8gJycgOiBudWxsO1xuXHRcdFx0Y2FzZSAnTnVtYmVyJzpcblx0XHRcdFx0cmV0dXJuIHZhbHVlID09IG51bGwgPyBudWxsIDogdmFsdWU7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0Y2FzZSAnT2JqZWN0Jzpcblx0XHRcdGNhc2UgJ0FycmF5Jzpcblx0XHRcdFx0cmV0dXJuIHZhbHVlICYmIEpTT04ucGFyc2UodmFsdWUpO1xuXHRcdFx0Y2FzZSAnQm9vbGVhbic6XG5cdFx0XHRcdHJldHVybiB2YWx1ZTsgLy8gY29udmVyc2lvbiBhbHJlYWR5IGhhbmRsZWQgYWJvdmVcblx0XHRcdGNhc2UgJ051bWJlcic6XG5cdFx0XHRcdHJldHVybiB2YWx1ZSAhPSBudWxsID8gK3ZhbHVlIDogdmFsdWU7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQGludGVybmFsXG4gKlxuICogVHVybiBhIFN2ZWx0ZSBjb21wb25lbnQgaW50byBhIGN1c3RvbSBlbGVtZW50LlxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljLmpzJykuQ29tcG9uZW50VHlwZX0gQ29tcG9uZW50ICBBIFN2ZWx0ZSBjb21wb25lbnQgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudFByb3BEZWZpbml0aW9uPn0gcHJvcHNfZGVmaW5pdGlvbiAgVGhlIHByb3BzIHRvIG9ic2VydmVcbiAqIEBwYXJhbSB7c3RyaW5nW119IHNsb3RzICBUaGUgc2xvdHMgdG8gY3JlYXRlXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhY2Nlc3NvcnMgIE90aGVyIGFjY2Vzc29ycyBiZXNpZGVzIHRoZSBvbmVzIGZvciBwcm9wcyB0aGUgY29tcG9uZW50IGhhc1xuICogQHBhcmFtIHtib29sZWFufSB1c2Vfc2hhZG93X2RvbSAgV2hldGhlciB0byB1c2Ugc2hhZG93IERPTVxuICogQHBhcmFtIHsoY2U6IG5ldyAoKSA9PiBIVE1MRWxlbWVudCkgPT4gbmV3ICgpID0+IEhUTUxFbGVtZW50fSBbZXh0ZW5kXVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlX2N1c3RvbV9lbGVtZW50KFxuXHRDb21wb25lbnQsXG5cdHByb3BzX2RlZmluaXRpb24sXG5cdHNsb3RzLFxuXHRhY2Nlc3NvcnMsXG5cdHVzZV9zaGFkb3dfZG9tLFxuXHRleHRlbmRcbikge1xuXHRsZXQgQ2xhc3MgPSBjbGFzcyBleHRlbmRzIFN2ZWx0ZUVsZW1lbnQge1xuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0c3VwZXIoQ29tcG9uZW50LCBzbG90cywgdXNlX3NoYWRvd19kb20pO1xuXHRcdFx0dGhpcy4kJHBfZCA9IHByb3BzX2RlZmluaXRpb247XG5cdFx0fVxuXHRcdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKHByb3BzX2RlZmluaXRpb24pLm1hcCgoa2V5KSA9PlxuXHRcdFx0XHQocHJvcHNfZGVmaW5pdGlvbltrZXldLmF0dHJpYnV0ZSB8fCBrZXkpLnRvTG93ZXJDYXNlKClcblx0XHRcdCk7XG5cdFx0fVxuXHR9O1xuXHRPYmplY3Qua2V5cyhwcm9wc19kZWZpbml0aW9uKS5mb3JFYWNoKChwcm9wKSA9PiB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4kJGMgJiYgcHJvcCBpbiB0aGlzLiQkYyA/IHRoaXMuJCRjW3Byb3BdIDogdGhpcy4kJGRbcHJvcF07XG5cdFx0XHR9LFxuXHRcdFx0c2V0KHZhbHVlKSB7XG5cdFx0XHRcdHZhbHVlID0gZ2V0X2N1c3RvbV9lbGVtZW50X3ZhbHVlKHByb3AsIHZhbHVlLCBwcm9wc19kZWZpbml0aW9uKTtcblx0XHRcdFx0dGhpcy4kJGRbcHJvcF0gPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy4kJGM/LiRzZXQoeyBbcHJvcF06IHZhbHVlIH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0YWNjZXNzb3JzLmZvckVhY2goKGFjY2Vzc29yKSA9PiB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLnByb3RvdHlwZSwgYWNjZXNzb3IsIHtcblx0XHRcdGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuJCRjPy5bYWNjZXNzb3JdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0aWYgKGV4dGVuZCkge1xuXHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgLSBhc3NpZ25pbmcgaGVyZSBpcyBmaW5lXG5cdFx0Q2xhc3MgPSBleHRlbmQoQ2xhc3MpO1xuXHR9XG5cdENvbXBvbmVudC5lbGVtZW50ID0gLyoqIEB0eXBlIHthbnl9ICovIChDbGFzcyk7XG5cdHJldHVybiBDbGFzcztcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBTdmVsdGUgY29tcG9uZW50cy4gVXNlZCB3aGVuIGRldj1mYWxzZS5cbiAqXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIGFueT59IFtQcm9wcz1hbnldXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIGFueT59IFtFdmVudHM9YW55XVxuICovXG5leHBvcnQgY2xhc3MgU3ZlbHRlQ29tcG9uZW50IHtcblx0LyoqXG5cdCAqICMjIyBQUklWQVRFIEFQSVxuXHQgKlxuXHQgKiBEbyBub3QgdXNlLCBtYXkgY2hhbmdlIGF0IGFueSB0aW1lXG5cdCAqXG5cdCAqIEB0eXBlIHthbnl9XG5cdCAqL1xuXHQkJCA9IHVuZGVmaW5lZDtcblx0LyoqXG5cdCAqICMjIyBQUklWQVRFIEFQSVxuXHQgKlxuXHQgKiBEbyBub3QgdXNlLCBtYXkgY2hhbmdlIGF0IGFueSB0aW1lXG5cdCAqXG5cdCAqIEB0eXBlIHthbnl9XG5cdCAqL1xuXHQkJHNldCA9IHVuZGVmaW5lZDtcblxuXHQvKiogQHJldHVybnMge3ZvaWR9ICovXG5cdCRkZXN0cm95KCkge1xuXHRcdGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuXHRcdHRoaXMuJGRlc3Ryb3kgPSBub29wO1xuXHR9XG5cblx0LyoqXG5cdCAqIEB0ZW1wbGF0ZSB7RXh0cmFjdDxrZXlvZiBFdmVudHMsIHN0cmluZz59IEtcblx0ICogQHBhcmFtIHtLfSB0eXBlXG5cdCAqIEBwYXJhbSB7KChlOiBFdmVudHNbS10pID0+IHZvaWQpIHwgbnVsbCB8IHVuZGVmaW5lZH0gY2FsbGJhY2tcblx0ICogQHJldHVybnMgeygpID0+IHZvaWR9XG5cdCAqL1xuXHQkb24odHlwZSwgY2FsbGJhY2spIHtcblx0XHRpZiAoIWlzX2Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuXHRcdFx0cmV0dXJuIG5vb3A7XG5cdFx0fVxuXHRcdGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdIHx8ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSA9IFtdKTtcblx0XHRjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGNvbnN0IGluZGV4ID0gY2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spO1xuXHRcdFx0aWYgKGluZGV4ICE9PSAtMSkgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge1BhcnRpYWw8UHJvcHM+fSBwcm9wc1xuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdCRzZXQocHJvcHMpIHtcblx0XHRpZiAodGhpcy4kJHNldCAmJiAhaXNfZW1wdHkocHJvcHMpKSB7XG5cdFx0XHR0aGlzLiQkLnNraXBfYm91bmQgPSB0cnVlO1xuXHRcdFx0dGhpcy4kJHNldChwcm9wcyk7XG5cdFx0XHR0aGlzLiQkLnNraXBfYm91bmQgPSBmYWxzZTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDdXN0b21FbGVtZW50UHJvcERlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYXR0cmlidXRlXVxuICogQHByb3BlcnR5IHtib29sZWFufSBbcmVmbGVjdF1cbiAqIEBwcm9wZXJ0eSB7J1N0cmluZyd8J0Jvb2xlYW4nfCdOdW1iZXInfCdBcnJheSd8J09iamVjdCd9IFt0eXBlXVxuICovXG4iLCAiLy8gZ2VuZXJhdGVkIGR1cmluZyByZWxlYXNlLCBkbyBub3QgbW9kaWZ5XG5cbi8qKlxuICogVGhlIGN1cnJlbnQgdmVyc2lvbiwgYXMgc2V0IGluIHBhY2thZ2UuanNvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtY29tcGlsZXIjc3ZlbHRlLXZlcnNpb25cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gJzQuMi45JztcbmV4cG9ydCBjb25zdCBQVUJMSUNfVkVSU0lPTiA9ICc0JztcbiIsICJpbXBvcnQge1xuXHRjdXN0b21fZXZlbnQsXG5cdGFwcGVuZCxcblx0YXBwZW5kX2h5ZHJhdGlvbixcblx0aW5zZXJ0LFxuXHRpbnNlcnRfaHlkcmF0aW9uLFxuXHRkZXRhY2gsXG5cdGxpc3Rlbixcblx0YXR0clxufSBmcm9tICcuL2RvbS5qcyc7XG5pbXBvcnQgeyBTdmVsdGVDb21wb25lbnQgfSBmcm9tICcuL0NvbXBvbmVudC5qcyc7XG5pbXBvcnQgeyBpc192b2lkIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3V0aWxzL25hbWVzLmpzJztcbmltcG9ydCB7IFZFUlNJT04gfSBmcm9tICcuLi8uLi9zaGFyZWQvdmVyc2lvbi5qcyc7XG5pbXBvcnQgeyBjb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcyB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgZW5zdXJlX2FycmF5X2xpa2UgfSBmcm9tICcuL2VhY2guanMnO1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtUfSBbZGV0YWlsXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaF9kZXYodHlwZSwgZGV0YWlsKSB7XG5cdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoY3VzdG9tX2V2ZW50KHR5cGUsIHsgdmVyc2lvbjogVkVSU0lPTiwgLi4uZGV0YWlsIH0sIHsgYnViYmxlczogdHJ1ZSB9KSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRfZGV2KHRhcmdldCwgbm9kZSkge1xuXHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlIH0pO1xuXHRhcHBlbmQodGFyZ2V0LCBub2RlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZF9oeWRyYXRpb25fZGV2KHRhcmdldCwgbm9kZSkge1xuXHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlIH0pO1xuXHRhcHBlbmRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtOb2RlfSBbYW5jaG9yXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfZGV2KHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG5cdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcblx0aW5zZXJ0KHRhcmdldCwgbm9kZSwgYW5jaG9yKTtcbn1cblxuLyoqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7Tm9kZX0gW2FuY2hvcl1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0X2h5ZHJhdGlvbl9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSwgYW5jaG9yIH0pO1xuXHRpbnNlcnRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSwgYW5jaG9yKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG5cdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NUmVtb3ZlJywgeyBub2RlIH0pO1xuXHRkZXRhY2gobm9kZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBiZWZvcmVcbiAqIEBwYXJhbSB7Tm9kZX0gYWZ0ZXJcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0YWNoX2JldHdlZW5fZGV2KGJlZm9yZSwgYWZ0ZXIpIHtcblx0d2hpbGUgKGJlZm9yZS5uZXh0U2libGluZyAmJiBiZWZvcmUubmV4dFNpYmxpbmcgIT09IGFmdGVyKSB7XG5cdFx0ZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBhZnRlclxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRhY2hfYmVmb3JlX2RldihhZnRlcikge1xuXHR3aGlsZSAoYWZ0ZXIucHJldmlvdXNTaWJsaW5nKSB7XG5cdFx0ZGV0YWNoX2RldihhZnRlci5wcmV2aW91c1NpYmxpbmcpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBiZWZvcmVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGV0YWNoX2FmdGVyX2RldihiZWZvcmUpIHtcblx0d2hpbGUgKGJlZm9yZS5uZXh0U2libGluZykge1xuXHRcdGRldGFjaF9kZXYoYmVmb3JlLm5leHRTaWJsaW5nKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3R9IGhhbmRsZXJcbiAqIEBwYXJhbSB7Ym9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zIHwgRXZlbnRMaXN0ZW5lck9wdGlvbnN9IFtvcHRpb25zXVxuICogQHBhcmFtIHtib29sZWFufSBbaGFzX3ByZXZlbnRfZGVmYXVsdF1cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2hhc19zdG9wX3Byb3BhZ2F0aW9uXVxuICogQHBhcmFtIHtib29sZWFufSBbaGFzX3N0b3BfaW1tZWRpYXRlX3Byb3BhZ2F0aW9uXVxuICogQHJldHVybnMgeygpID0+IHZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5fZGV2KFxuXHRub2RlLFxuXHRldmVudCxcblx0aGFuZGxlcixcblx0b3B0aW9ucyxcblx0aGFzX3ByZXZlbnRfZGVmYXVsdCxcblx0aGFzX3N0b3BfcHJvcGFnYXRpb24sXG5cdGhhc19zdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvblxuKSB7XG5cdGNvbnN0IG1vZGlmaWVycyA9XG5cdFx0b3B0aW9ucyA9PT0gdHJ1ZSA/IFsnY2FwdHVyZSddIDogb3B0aW9ucyA/IEFycmF5LmZyb20oT2JqZWN0LmtleXMob3B0aW9ucykpIDogW107XG5cdGlmIChoYXNfcHJldmVudF9kZWZhdWx0KSBtb2RpZmllcnMucHVzaCgncHJldmVudERlZmF1bHQnKTtcblx0aWYgKGhhc19zdG9wX3Byb3BhZ2F0aW9uKSBtb2RpZmllcnMucHVzaCgnc3RvcFByb3BhZ2F0aW9uJyk7XG5cdGlmIChoYXNfc3RvcF9pbW1lZGlhdGVfcHJvcGFnYXRpb24pIG1vZGlmaWVycy5wdXNoKCdzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24nKTtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01BZGRFdmVudExpc3RlbmVyJywgeyBub2RlLCBldmVudCwgaGFuZGxlciwgbW9kaWZpZXJzIH0pO1xuXHRjb25zdCBkaXNwb3NlID0gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcblx0cmV0dXJuICgpID0+IHtcblx0XHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG5cdFx0ZGlzcG9zZSgpO1xuXHR9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXR0cl9kZXYobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuXHRhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpO1xuXHRpZiAodmFsdWUgPT0gbnVsbCkgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmVBdHRyaWJ1dGUnLCB7IG5vZGUsIGF0dHJpYnV0ZSB9KTtcblx0ZWxzZSBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldEF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlLCB2YWx1ZSB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICogQHBhcmFtIHthbnl9IFt2YWx1ZV1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvcF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG5cdG5vZGVbcHJvcGVydHldID0gdmFsdWU7XG5cdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0UHJvcGVydHknLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHlcbiAqIEBwYXJhbSB7YW55fSBbdmFsdWVdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGFzZXRfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuXHRub2RlLmRhdGFzZXRbcHJvcGVydHldID0gdmFsdWU7XG5cdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0RGF0YXNldCcsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7VGV4dH0gdGV4dFxuICogQHBhcmFtIHt1bmtub3dufSBkYXRhXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKSB7XG5cdGRhdGEgPSAnJyArIGRhdGE7XG5cdGlmICh0ZXh0LmRhdGEgPT09IGRhdGEpIHJldHVybjtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXREYXRhJywgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuXHR0ZXh0LmRhdGEgPSAvKiogQHR5cGUge3N0cmluZ30gKi8gKGRhdGEpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7VGV4dH0gdGV4dFxuICogQHBhcmFtIHt1bmtub3dufSBkYXRhXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9kYXRhX2NvbnRlbnRlZGl0YWJsZV9kZXYodGV4dCwgZGF0YSkge1xuXHRkYXRhID0gJycgKyBkYXRhO1xuXHRpZiAodGV4dC53aG9sZVRleHQgPT09IGRhdGEpIHJldHVybjtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXREYXRhJywgeyBub2RlOiB0ZXh0LCBkYXRhIH0pO1xuXHR0ZXh0LmRhdGEgPSAvKiogQHR5cGUge3N0cmluZ30gKi8gKGRhdGEpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7VGV4dH0gdGV4dFxuICogQHBhcmFtIHt1bmtub3dufSBkYXRhXG4gKiBAcGFyYW0ge3N0cmluZ30gYXR0cl92YWx1ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfZGF0YV9tYXliZV9jb250ZW50ZWRpdGFibGVfZGV2KHRleHQsIGRhdGEsIGF0dHJfdmFsdWUpIHtcblx0aWYgKH5jb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcy5pbmRleE9mKGF0dHJfdmFsdWUpKSB7XG5cdFx0c2V0X2RhdGFfY29udGVudGVkaXRhYmxlX2Rldih0ZXh0LCBkYXRhKTtcblx0fSBlbHNlIHtcblx0XHRzZXRfZGF0YV9kZXYodGV4dCwgZGF0YSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZV9hcnJheV9saWtlX2RldihhcmcpIHtcblx0aWYgKFxuXHRcdHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmXG5cdFx0IShhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gYXJnKSAmJlxuXHRcdCEodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBhcmcgJiYgU3ltYm9sLml0ZXJhdG9yIGluIGFyZylcblx0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCd7I2VhY2h9IG9ubHkgd29ya3Mgd2l0aCBpdGVyYWJsZSB2YWx1ZXMuJyk7XG5cdH1cblx0cmV0dXJuIGVuc3VyZV9hcnJheV9saWtlKGFyZyk7XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuXHRmb3IgKGNvbnN0IHNsb3Rfa2V5IG9mIE9iamVjdC5rZXlzKHNsb3QpKSB7XG5cdFx0aWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3Vua25vd259IHRhZ1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZV9keW5hbWljX2VsZW1lbnQodGFnKSB7XG5cdGNvbnN0IGlzX3N0cmluZyA9IHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnO1xuXHRpZiAodGFnICYmICFpc19zdHJpbmcpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJzxzdmVsdGU6ZWxlbWVudD4gZXhwZWN0cyBcInRoaXNcIiBhdHRyaWJ1dGUgdG8gYmUgYSBzdHJpbmcuJyk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3VuZGVmaW5lZCB8IHN0cmluZ30gdGFnXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlX3ZvaWRfZHluYW1pY19lbGVtZW50KHRhZykge1xuXHRpZiAodGFnICYmIGlzX3ZvaWQodGFnKSkge1xuXHRcdGNvbnNvbGUud2FybihgPHN2ZWx0ZTplbGVtZW50IHRoaXM9XCIke3RhZ31cIj4gaXMgc2VsZi1jbG9zaW5nIGFuZCBjYW5ub3QgaGF2ZSBjb250ZW50LmApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdHJ1Y3Rfc3ZlbHRlX2NvbXBvbmVudF9kZXYoY29tcG9uZW50LCBwcm9wcykge1xuXHRjb25zdCBlcnJvcl9tZXNzYWdlID0gJ3RoaXM9ey4uLn0gb2YgPHN2ZWx0ZTpjb21wb25lbnQ+IHNob3VsZCBzcGVjaWZ5IGEgU3ZlbHRlIGNvbXBvbmVudC4nO1xuXHR0cnkge1xuXHRcdGNvbnN0IGluc3RhbmNlID0gbmV3IGNvbXBvbmVudChwcm9wcyk7XG5cdFx0aWYgKCFpbnN0YW5jZS4kJCB8fCAhaW5zdGFuY2UuJHNldCB8fCAhaW5zdGFuY2UuJG9uIHx8ICFpbnN0YW5jZS4kZGVzdHJveSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yX21lc3NhZ2UpO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5zdGFuY2U7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGNvbnN0IHsgbWVzc2FnZSB9ID0gZXJyO1xuXHRcdGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgJiYgbWVzc2FnZS5pbmRleE9mKCdpcyBub3QgYSBjb25zdHJ1Y3RvcicpICE9PSAtMSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yX21lc3NhZ2UpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBlcnI7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgU3ZlbHRlIGNvbXBvbmVudHMgd2l0aCBzb21lIG1pbm9yIGRldi1lbmhhbmNlbWVudHMuIFVzZWQgd2hlbiBkZXY9dHJ1ZS5cbiAqXG4gKiBDYW4gYmUgdXNlZCB0byBjcmVhdGUgc3Ryb25nbHkgdHlwZWQgU3ZlbHRlIGNvbXBvbmVudHMuXG4gKlxuICogIyMjIyBFeGFtcGxlOlxuICpcbiAqIFlvdSBoYXZlIGNvbXBvbmVudCBsaWJyYXJ5IG9uIG5wbSBjYWxsZWQgYGNvbXBvbmVudC1saWJyYXJ5YCwgZnJvbSB3aGljaFxuICogeW91IGV4cG9ydCBhIGNvbXBvbmVudCBjYWxsZWQgYE15Q29tcG9uZW50YC4gRm9yIFN2ZWx0ZStUeXBlU2NyaXB0IHVzZXJzLFxuICogeW91IHdhbnQgdG8gcHJvdmlkZSB0eXBpbmdzLiBUaGVyZWZvcmUgeW91IGNyZWF0ZSBhIGBpbmRleC5kLnRzYDpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBTdmVsdGVDb21wb25lbnQgfSBmcm9tIFwic3ZlbHRlXCI7XG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQ8e2Zvbzogc3RyaW5nfT4ge31cbiAqIGBgYFxuICogVHlwaW5nIHRoaXMgbWFrZXMgaXQgcG9zc2libGUgZm9yIElERXMgbGlrZSBWUyBDb2RlIHdpdGggdGhlIFN2ZWx0ZSBleHRlbnNpb25cbiAqIHRvIHByb3ZpZGUgaW50ZWxsaXNlbnNlIGFuZCB0byB1c2UgdGhlIGNvbXBvbmVudCBsaWtlIHRoaXMgaW4gYSBTdmVsdGUgZmlsZVxuICogd2l0aCBUeXBlU2NyaXB0OlxuICogYGBgc3ZlbHRlXG4gKiA8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICogXHRpbXBvcnQgeyBNeUNvbXBvbmVudCB9IGZyb20gXCJjb21wb25lbnQtbGlicmFyeVwiO1xuICogPC9zY3JpcHQ+XG4gKiA8TXlDb21wb25lbnQgZm9vPXsnYmFyJ30gLz5cbiAqIGBgYFxuICogQHRlbXBsYXRlIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbUHJvcHM9YW55XVxuICogQHRlbXBsYXRlIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbRXZlbnRzPWFueV1cbiAqIEB0ZW1wbGF0ZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gW1Nsb3RzPWFueV1cbiAqIEBleHRlbmRzIHtTdmVsdGVDb21wb25lbnQ8UHJvcHMsIEV2ZW50cz59XG4gKi9cbmV4cG9ydCBjbGFzcyBTdmVsdGVDb21wb25lbnREZXYgZXh0ZW5kcyBTdmVsdGVDb21wb25lbnQge1xuXHQvKipcblx0ICogRm9yIHR5cGUgY2hlY2tpbmcgY2FwYWJpbGl0aWVzIG9ubHkuXG5cdCAqIERvZXMgbm90IGV4aXN0IGF0IHJ1bnRpbWUuXG5cdCAqICMjIyBETyBOT1QgVVNFIVxuXHQgKlxuXHQgKiBAdHlwZSB7UHJvcHN9XG5cdCAqL1xuXHQkJHByb3BfZGVmO1xuXHQvKipcblx0ICogRm9yIHR5cGUgY2hlY2tpbmcgY2FwYWJpbGl0aWVzIG9ubHkuXG5cdCAqIERvZXMgbm90IGV4aXN0IGF0IHJ1bnRpbWUuXG5cdCAqICMjIyBETyBOT1QgVVNFIVxuXHQgKlxuXHQgKiBAdHlwZSB7RXZlbnRzfVxuXHQgKi9cblx0JCRldmVudHNfZGVmO1xuXHQvKipcblx0ICogRm9yIHR5cGUgY2hlY2tpbmcgY2FwYWJpbGl0aWVzIG9ubHkuXG5cdCAqIERvZXMgbm90IGV4aXN0IGF0IHJ1bnRpbWUuXG5cdCAqICMjIyBETyBOT1QgVVNFIVxuXHQgKlxuXHQgKiBAdHlwZSB7U2xvdHN9XG5cdCAqL1xuXHQkJHNsb3RfZGVmO1xuXG5cdC8qKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5Db21wb25lbnRDb25zdHJ1Y3Rvck9wdGlvbnM8UHJvcHM+fSBvcHRpb25zICovXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIid0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uXCIpO1xuXHRcdH1cblx0XHRzdXBlcigpO1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHQkZGVzdHJveSgpIHtcblx0XHRzdXBlci4kZGVzdHJveSgpO1xuXHRcdHRoaXMuJGRlc3Ryb3kgPSAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLndhcm4oJ0NvbXBvbmVudCB3YXMgYWxyZWFkeSBkZXN0cm95ZWQnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG5cdFx0fTtcblx0fVxuXG5cdC8qKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0JGNhcHR1cmVfc3RhdGUoKSB7fVxuXG5cdC8qKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0JGluamVjdF9zdGF0ZSgpIHt9XG59XG4vKipcbiAqIEB0ZW1wbGF0ZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gW1Byb3BzPWFueV1cbiAqIEB0ZW1wbGF0ZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gW0V2ZW50cz1hbnldXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIGFueT59IFtTbG90cz1hbnldXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFN2ZWx0ZUNvbXBvbmVudGAgaW5zdGVhZC4gU2VlIFBSIGZvciBtb3JlIGluZm9ybWF0aW9uOiBodHRwczovL2dpdGh1Yi5jb20vc3ZlbHRlanMvc3ZlbHRlL3B1bGwvODUxMlxuICogQGV4dGVuZHMge1N2ZWx0ZUNvbXBvbmVudERldjxQcm9wcywgRXZlbnRzLCBTbG90cz59XG4gKi9cbmV4cG9ydCBjbGFzcyBTdmVsdGVDb21wb25lbnRUeXBlZCBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudERldiB7fVxuXG4vKiogQHJldHVybnMgeygpID0+IHZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gbG9vcF9ndWFyZCh0aW1lb3V0KSB7XG5cdGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcblx0cmV0dXJuICgpID0+IHtcblx0XHRpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0ID4gdGltZW91dCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIGRldGVjdGVkJyk7XG5cdFx0fVxuXHR9O1xufVxuIiwgImltcG9ydCB7IFBVQkxJQ19WRVJTSU9OIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3ZlcnNpb24uanMnO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpXG5cdC8vIEB0cy1pZ25vcmVcblx0KHdpbmRvdy5fX3N2ZWx0ZSB8fCAod2luZG93Ll9fc3ZlbHRlID0geyB2OiBuZXcgU2V0KCkgfSkpLnYuYWRkKFBVQkxJQ19WRVJTSU9OKTtcbiIsICJpbXBvcnQgeyBjdWJpY091dCwgY3ViaWNJbk91dCwgbGluZWFyIH0gZnJvbSAnLi4vZWFzaW5nL2luZGV4LmpzJztcbmltcG9ydCB7IGFzc2lnbiwgc3BsaXRfY3NzX3VuaXQsIGlzX2Z1bmN0aW9uIH0gZnJvbSAnLi4vaW50ZXJuYWwvaW5kZXguanMnO1xuXG4vKipcbiAqIEFuaW1hdGVzIGEgYGJsdXJgIGZpbHRlciBhbG9uZ3NpZGUgYW4gZWxlbWVudCdzIG9wYWNpdHkuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXRyYW5zaXRpb24jYmx1clxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMnKS5CbHVyUGFyYW1zfSBbcGFyYW1zXVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmx1cihcblx0bm9kZSxcblx0eyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY0luT3V0LCBhbW91bnQgPSA1LCBvcGFjaXR5ID0gMCB9ID0ge31cbikge1xuXHRjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cdGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG5cdGNvbnN0IGYgPSBzdHlsZS5maWx0ZXIgPT09ICdub25lJyA/ICcnIDogc3R5bGUuZmlsdGVyO1xuXHRjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcblx0Y29uc3QgW3ZhbHVlLCB1bml0XSA9IHNwbGl0X2Nzc191bml0KGFtb3VudCk7XG5cdHJldHVybiB7XG5cdFx0ZGVsYXksXG5cdFx0ZHVyYXRpb24sXG5cdFx0ZWFzaW5nLFxuXHRcdGNzczogKF90LCB1KSA9PiBgb3BhY2l0eTogJHt0YXJnZXRfb3BhY2l0eSAtIG9kICogdX07IGZpbHRlcjogJHtmfSBibHVyKCR7dSAqIHZhbHVlfSR7dW5pdH0pO2Bcblx0fTtcbn1cblxuLyoqXG4gKiBBbmltYXRlcyB0aGUgb3BhY2l0eSBvZiBhbiBlbGVtZW50IGZyb20gMCB0byB0aGUgY3VycmVudCBvcGFjaXR5IGZvciBgaW5gIHRyYW5zaXRpb25zIGFuZCBmcm9tIHRoZSBjdXJyZW50IG9wYWNpdHkgdG8gMCBmb3IgYG91dGAgdHJhbnNpdGlvbnMuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXRyYW5zaXRpb24jZmFkZVxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMnKS5GYWRlUGFyYW1zfSBbcGFyYW1zXVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmFkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGxpbmVhciB9ID0ge30pIHtcblx0Y29uc3QgbyA9ICtnZXRDb21wdXRlZFN0eWxlKG5vZGUpLm9wYWNpdHk7XG5cdHJldHVybiB7XG5cdFx0ZGVsYXksXG5cdFx0ZHVyYXRpb24sXG5cdFx0ZWFzaW5nLFxuXHRcdGNzczogKHQpID0+IGBvcGFjaXR5OiAke3QgKiBvfWBcblx0fTtcbn1cblxuLyoqXG4gKiBBbmltYXRlcyB0aGUgeCBhbmQgeSBwb3NpdGlvbnMgYW5kIHRoZSBvcGFjaXR5IG9mIGFuIGVsZW1lbnQuIGBpbmAgdHJhbnNpdGlvbnMgYW5pbWF0ZSBmcm9tIHRoZSBwcm92aWRlZCB2YWx1ZXMsIHBhc3NlZCBhcyBwYXJhbWV0ZXJzIHRvIHRoZSBlbGVtZW50J3MgZGVmYXVsdCB2YWx1ZXMuIGBvdXRgIHRyYW5zaXRpb25zIGFuaW1hdGUgZnJvbSB0aGUgZWxlbWVudCdzIGRlZmF1bHQgdmFsdWVzIHRvIHRoZSBwcm92aWRlZCB2YWx1ZXMuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXRyYW5zaXRpb24jZmx5XG4gKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYycpLkZseVBhcmFtc30gW3BhcmFtc11cbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljJykuVHJhbnNpdGlvbkNvbmZpZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZseShcblx0bm9kZSxcblx0eyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCwgeCA9IDAsIHkgPSAwLCBvcGFjaXR5ID0gMCB9ID0ge31cbikge1xuXHRjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cdGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG5cdGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG5cdGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuXHRjb25zdCBbeFZhbHVlLCB4VW5pdF0gPSBzcGxpdF9jc3NfdW5pdCh4KTtcblx0Y29uc3QgW3lWYWx1ZSwgeVVuaXRdID0gc3BsaXRfY3NzX3VuaXQoeSk7XG5cdHJldHVybiB7XG5cdFx0ZGVsYXksXG5cdFx0ZHVyYXRpb24sXG5cdFx0ZWFzaW5nLFxuXHRcdGNzczogKHQsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgkeygxIC0gdCkgKiB4VmFsdWV9JHt4VW5pdH0sICR7KDEgLSB0KSAqIHlWYWx1ZX0ke3lVbml0fSk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gb2QgKiB1fWBcblx0fTtcbn1cblxuLyoqXG4gKiBTbGlkZXMgYW4gZWxlbWVudCBpbiBhbmQgb3V0LlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZS10cmFuc2l0aW9uI3NsaWRlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYycpLlNsaWRlUGFyYW1zfSBbcGFyYW1zXVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2xpZGUobm9kZSwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCwgYXhpcyA9ICd5JyB9ID0ge30pIHtcblx0Y29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuXHRjb25zdCBvcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG5cdGNvbnN0IHByaW1hcnlfcHJvcGVydHkgPSBheGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cdGNvbnN0IHByaW1hcnlfcHJvcGVydHlfdmFsdWUgPSBwYXJzZUZsb2F0KHN0eWxlW3ByaW1hcnlfcHJvcGVydHldKTtcblx0Y29uc3Qgc2Vjb25kYXJ5X3Byb3BlcnRpZXMgPSBheGlzID09PSAneScgPyBbJ3RvcCcsICdib3R0b20nXSA6IFsnbGVmdCcsICdyaWdodCddO1xuXHRjb25zdCBjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllcyA9IHNlY29uZGFyeV9wcm9wZXJ0aWVzLm1hcChcblx0XHQoZSkgPT4gYCR7ZVswXS50b1VwcGVyQ2FzZSgpfSR7ZS5zbGljZSgxKX1gXG5cdCk7XG5cdGNvbnN0IHBhZGRpbmdfc3RhcnRfdmFsdWUgPSBwYXJzZUZsb2F0KHN0eWxlW2BwYWRkaW5nJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1swXX1gXSk7XG5cdGNvbnN0IHBhZGRpbmdfZW5kX3ZhbHVlID0gcGFyc2VGbG9hdChzdHlsZVtgcGFkZGluZyR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19YF0pO1xuXHRjb25zdCBtYXJnaW5fc3RhcnRfdmFsdWUgPSBwYXJzZUZsb2F0KHN0eWxlW2BtYXJnaW4ke2NhcGl0YWxpemVkX3NlY29uZGFyeV9wcm9wZXJ0aWVzWzBdfWBdKTtcblx0Y29uc3QgbWFyZ2luX2VuZF92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbYG1hcmdpbiR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19YF0pO1xuXHRjb25zdCBib3JkZXJfd2lkdGhfc3RhcnRfdmFsdWUgPSBwYXJzZUZsb2F0KFxuXHRcdHN0eWxlW2Bib3JkZXIke2NhcGl0YWxpemVkX3NlY29uZGFyeV9wcm9wZXJ0aWVzWzBdfVdpZHRoYF1cblx0KTtcblx0Y29uc3QgYm9yZGVyX3dpZHRoX2VuZF92YWx1ZSA9IHBhcnNlRmxvYXQoXG5cdFx0c3R5bGVbYGJvcmRlciR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19V2lkdGhgXVxuXHQpO1xuXHRyZXR1cm4ge1xuXHRcdGRlbGF5LFxuXHRcdGR1cmF0aW9uLFxuXHRcdGVhc2luZyxcblx0XHRjc3M6ICh0KSA9PlxuXHRcdFx0J292ZXJmbG93OiBoaWRkZW47JyArXG5cdFx0XHRgb3BhY2l0eTogJHtNYXRoLm1pbih0ICogMjAsIDEpICogb3BhY2l0eX07YCArXG5cdFx0XHRgJHtwcmltYXJ5X3Byb3BlcnR5fTogJHt0ICogcHJpbWFyeV9wcm9wZXJ0eV92YWx1ZX1weDtgICtcblx0XHRcdGBwYWRkaW5nLSR7c2Vjb25kYXJ5X3Byb3BlcnRpZXNbMF19OiAke3QgKiBwYWRkaW5nX3N0YXJ0X3ZhbHVlfXB4O2AgK1xuXHRcdFx0YHBhZGRpbmctJHtzZWNvbmRhcnlfcHJvcGVydGllc1sxXX06ICR7dCAqIHBhZGRpbmdfZW5kX3ZhbHVlfXB4O2AgK1xuXHRcdFx0YG1hcmdpbi0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzBdfTogJHt0ICogbWFyZ2luX3N0YXJ0X3ZhbHVlfXB4O2AgK1xuXHRcdFx0YG1hcmdpbi0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzFdfTogJHt0ICogbWFyZ2luX2VuZF92YWx1ZX1weDtgICtcblx0XHRcdGBib3JkZXItJHtzZWNvbmRhcnlfcHJvcGVydGllc1swXX0td2lkdGg6ICR7dCAqIGJvcmRlcl93aWR0aF9zdGFydF92YWx1ZX1weDtgICtcblx0XHRcdGBib3JkZXItJHtzZWNvbmRhcnlfcHJvcGVydGllc1sxXX0td2lkdGg6ICR7dCAqIGJvcmRlcl93aWR0aF9lbmRfdmFsdWV9cHg7YFxuXHR9O1xufVxuXG4vKipcbiAqIEFuaW1hdGVzIHRoZSBvcGFjaXR5IGFuZCBzY2FsZSBvZiBhbiBlbGVtZW50LiBgaW5gIHRyYW5zaXRpb25zIGFuaW1hdGUgZnJvbSBhbiBlbGVtZW50J3MgY3VycmVudCAoZGVmYXVsdCkgdmFsdWVzIHRvIHRoZSBwcm92aWRlZCB2YWx1ZXMsIHBhc3NlZCBhcyBwYXJhbWV0ZXJzLiBgb3V0YCB0cmFuc2l0aW9ucyBhbmltYXRlIGZyb20gdGhlIHByb3ZpZGVkIHZhbHVlcyB0byBhbiBlbGVtZW50J3MgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXRyYW5zaXRpb24jc2NhbGVcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljJykuU2NhbGVQYXJhbXN9IFtwYXJhbXNdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZShcblx0bm9kZSxcblx0eyBkZWxheSA9IDAsIGR1cmF0aW9uID0gNDAwLCBlYXNpbmcgPSBjdWJpY091dCwgc3RhcnQgPSAwLCBvcGFjaXR5ID0gMCB9ID0ge31cbikge1xuXHRjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cdGNvbnN0IHRhcmdldF9vcGFjaXR5ID0gK3N0eWxlLm9wYWNpdHk7XG5cdGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG5cdGNvbnN0IHNkID0gMSAtIHN0YXJ0O1xuXHRjb25zdCBvZCA9IHRhcmdldF9vcGFjaXR5ICogKDEgLSBvcGFjaXR5KTtcblx0cmV0dXJuIHtcblx0XHRkZWxheSxcblx0XHRkdXJhdGlvbixcblx0XHRlYXNpbmcsXG5cdFx0Y3NzOiAoX3QsIHUpID0+IGBcblx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHNjYWxlKCR7MSAtIHNkICogdX0pO1xuXHRcdFx0b3BhY2l0eTogJHt0YXJnZXRfb3BhY2l0eSAtIG9kICogdX1cblx0XHRgXG5cdH07XG59XG5cbi8qKlxuICogQW5pbWF0ZXMgdGhlIHN0cm9rZSBvZiBhbiBTVkcgZWxlbWVudCwgbGlrZSBhIHNuYWtlIGluIGEgdHViZS4gYGluYCB0cmFuc2l0aW9ucyBiZWdpbiB3aXRoIHRoZSBwYXRoIGludmlzaWJsZSBhbmQgZHJhdyB0aGUgcGF0aCB0byB0aGUgc2NyZWVuIG92ZXIgdGltZS4gYG91dGAgdHJhbnNpdGlvbnMgc3RhcnQgaW4gYSB2aXNpYmxlIHN0YXRlIGFuZCBncmFkdWFsbHkgZXJhc2UgdGhlIHBhdGguIGBkcmF3YCBvbmx5IHdvcmtzIHdpdGggZWxlbWVudHMgdGhhdCBoYXZlIGEgYGdldFRvdGFsTGVuZ3RoYCBtZXRob2QsIGxpa2UgYDxwYXRoPmAgYW5kIGA8cG9seWxpbmU+YC5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtdHJhbnNpdGlvbiNkcmF3XG4gKiBAcGFyYW0ge1NWR0VsZW1lbnQgJiB7IGdldFRvdGFsTGVuZ3RoKCk6IG51bWJlciB9fSBub2RlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMnKS5EcmF3UGFyYW1zfSBbcGFyYW1zXVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZHJhdyhub2RlLCB7IGRlbGF5ID0gMCwgc3BlZWQsIGR1cmF0aW9uLCBlYXNpbmcgPSBjdWJpY0luT3V0IH0gPSB7fSkge1xuXHRsZXQgbGVuID0gbm9kZS5nZXRUb3RhbExlbmd0aCgpO1xuXHRjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cdGlmIChzdHlsZS5zdHJva2VMaW5lY2FwICE9PSAnYnV0dCcpIHtcblx0XHRsZW4gKz0gcGFyc2VJbnQoc3R5bGUuc3Ryb2tlV2lkdGgpO1xuXHR9XG5cdGlmIChkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKHNwZWVkID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGR1cmF0aW9uID0gODAwO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkdXJhdGlvbiA9IGxlbiAvIHNwZWVkO1xuXHRcdH1cblx0fSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdmdW5jdGlvbicpIHtcblx0XHRkdXJhdGlvbiA9IGR1cmF0aW9uKGxlbik7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRkZWxheSxcblx0XHRkdXJhdGlvbixcblx0XHRlYXNpbmcsXG5cdFx0Y3NzOiAoXywgdSkgPT4gYFxuXHRcdFx0c3Ryb2tlLWRhc2hhcnJheTogJHtsZW59O1xuXHRcdFx0c3Ryb2tlLWRhc2hvZmZzZXQ6ICR7dSAqIGxlbn07XG5cdFx0YFxuXHR9O1xufVxuXG4vKipcbiAqIFRoZSBgY3Jvc3NmYWRlYCBmdW5jdGlvbiBjcmVhdGVzIGEgcGFpciBvZiBbdHJhbnNpdGlvbnNdKC9kb2NzI3RlbXBsYXRlLXN5bnRheC1lbGVtZW50LWRpcmVjdGl2ZXMtdHJhbnNpdGlvbi1mbikgY2FsbGVkIGBzZW5kYCBhbmQgYHJlY2VpdmVgLiBXaGVuIGFuIGVsZW1lbnQgaXMgJ3NlbnQnLCBpdCBsb29rcyBmb3IgYSBjb3JyZXNwb25kaW5nIGVsZW1lbnQgYmVpbmcgJ3JlY2VpdmVkJywgYW5kIGdlbmVyYXRlcyBhIHRyYW5zaXRpb24gdGhhdCB0cmFuc2Zvcm1zIHRoZSBlbGVtZW50IHRvIGl0cyBjb3VudGVycGFydCdzIHBvc2l0aW9uIGFuZCBmYWRlcyBpdCBvdXQuIFdoZW4gYW4gZWxlbWVudCBpcyAncmVjZWl2ZWQnLCB0aGUgcmV2ZXJzZSBoYXBwZW5zLiBJZiB0aGVyZSBpcyBubyBjb3VudGVycGFydCwgdGhlIGBmYWxsYmFja2AgdHJhbnNpdGlvbiBpcyB1c2VkLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZS10cmFuc2l0aW9uI2Nyb3NzZmFkZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljJykuQ3Jvc3NmYWRlUGFyYW1zICYge1xuICogXHRmYWxsYmFjaz86IChub2RlOiBFbGVtZW50LCBwYXJhbXM6IGltcG9ydCgnLi9wdWJsaWMnKS5Dcm9zc2ZhZGVQYXJhbXMsIGludHJvOiBib29sZWFuKSA9PiBpbXBvcnQoJy4vcHVibGljJykuVHJhbnNpdGlvbkNvbmZpZztcbiAqIH19IHBhcmFtc1xuICogQHJldHVybnMge1sobm9kZTogYW55LCBwYXJhbXM6IGltcG9ydCgnLi9wdWJsaWMnKS5Dcm9zc2ZhZGVQYXJhbXMgJiB7IGtleTogYW55OyB9KSA9PiAoKSA9PiBpbXBvcnQoJy4vcHVibGljJykuVHJhbnNpdGlvbkNvbmZpZywgKG5vZGU6IGFueSwgcGFyYW1zOiBpbXBvcnQoJy4vcHVibGljJykuQ3Jvc3NmYWRlUGFyYW1zICYgeyBrZXk6IGFueTsgfSkgPT4gKCkgPT4gaW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWddfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3Jvc3NmYWRlKHsgZmFsbGJhY2ssIC4uLmRlZmF1bHRzIH0pIHtcblx0LyoqIEB0eXBlIHtNYXA8YW55LCBFbGVtZW50Pn0gKi9cblx0Y29uc3QgdG9fcmVjZWl2ZSA9IG5ldyBNYXAoKTtcblx0LyoqIEB0eXBlIHtNYXA8YW55LCBFbGVtZW50Pn0gKi9cblx0Y29uc3QgdG9fc2VuZCA9IG5ldyBNYXAoKTtcblx0LyoqXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZnJvbV9ub2RlXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuXHQgKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMnKS5Dcm9zc2ZhZGVQYXJhbXN9IHBhcmFtc1xuXHQgKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG5cdCAqL1xuXHRmdW5jdGlvbiBjcm9zc2ZhZGUoZnJvbV9ub2RlLCBub2RlLCBwYXJhbXMpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRkZWxheSA9IDAsXG5cdFx0XHRkdXJhdGlvbiA9IChkKSA9PiBNYXRoLnNxcnQoZCkgKiAzMCxcblx0XHRcdGVhc2luZyA9IGN1YmljT3V0XG5cdFx0fSA9IGFzc2lnbihhc3NpZ24oe30sIGRlZmF1bHRzKSwgcGFyYW1zKTtcblx0XHRjb25zdCBmcm9tID0gZnJvbV9ub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGNvbnN0IHRvID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRjb25zdCBkeCA9IGZyb20ubGVmdCAtIHRvLmxlZnQ7XG5cdFx0Y29uc3QgZHkgPSBmcm9tLnRvcCAtIHRvLnRvcDtcblx0XHRjb25zdCBkdyA9IGZyb20ud2lkdGggLyB0by53aWR0aDtcblx0XHRjb25zdCBkaCA9IGZyb20uaGVpZ2h0IC8gdG8uaGVpZ2h0O1xuXHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXHRcdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0XHRjb25zdCB0cmFuc2Zvcm0gPSBzdHlsZS50cmFuc2Zvcm0gPT09ICdub25lJyA/ICcnIDogc3R5bGUudHJhbnNmb3JtO1xuXHRcdGNvbnN0IG9wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZGVsYXksXG5cdFx0XHRkdXJhdGlvbjogaXNfZnVuY3Rpb24oZHVyYXRpb24pID8gZHVyYXRpb24oZCkgOiBkdXJhdGlvbixcblx0XHRcdGVhc2luZyxcblx0XHRcdGNzczogKHQsIHUpID0+IGBcblx0XHRcdFx0b3BhY2l0eTogJHt0ICogb3BhY2l0eX07XG5cdFx0XHRcdHRyYW5zZm9ybS1vcmlnaW46IHRvcCBsZWZ0O1xuXHRcdFx0XHR0cmFuc2Zvcm06ICR7dHJhbnNmb3JtfSB0cmFuc2xhdGUoJHt1ICogZHh9cHgsJHt1ICogZHl9cHgpIHNjYWxlKCR7dCArICgxIC0gdCkgKiBkd30sICR7XG5cdFx0XHRcdHQgKyAoMSAtIHQpICogZGhcblx0XHRcdH0pO1xuXHRcdFx0YFxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtNYXA8YW55LCBFbGVtZW50Pn0gaXRlbXNcblx0ICogQHBhcmFtIHtNYXA8YW55LCBFbGVtZW50Pn0gY291bnRlcnBhcnRzXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gaW50cm9cblx0ICogQHJldHVybnMgeyhub2RlOiBhbnksIHBhcmFtczogaW1wb3J0KCcuL3B1YmxpYycpLkNyb3NzZmFkZVBhcmFtcyAmIHsga2V5OiBhbnk7IH0pID0+ICgpID0+IGltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnfVxuXHQgKi9cblx0ZnVuY3Rpb24gdHJhbnNpdGlvbihpdGVtcywgY291bnRlcnBhcnRzLCBpbnRybykge1xuXHRcdHJldHVybiAobm9kZSwgcGFyYW1zKSA9PiB7XG5cdFx0XHRpdGVtcy5zZXQocGFyYW1zLmtleSwgbm9kZSk7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRpZiAoY291bnRlcnBhcnRzLmhhcyhwYXJhbXMua2V5KSkge1xuXHRcdFx0XHRcdGNvbnN0IG90aGVyX25vZGUgPSBjb3VudGVycGFydHMuZ2V0KHBhcmFtcy5rZXkpO1xuXHRcdFx0XHRcdGNvdW50ZXJwYXJ0cy5kZWxldGUocGFyYW1zLmtleSk7XG5cdFx0XHRcdFx0cmV0dXJuIGNyb3NzZmFkZShvdGhlcl9ub2RlLCBub2RlLCBwYXJhbXMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGlmIHRoZSBub2RlIGlzIGRpc2FwcGVhcmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRcdC8vIChpLmUuIHdhc24ndCBjbGFpbWVkIGJ5IHRoZSBvdGhlciBsaXN0KVxuXHRcdFx0XHQvLyB0aGVuIHdlIG5lZWQgdG8gc3VwcGx5IGFuIG91dHJvXG5cdFx0XHRcdGl0ZW1zLmRlbGV0ZShwYXJhbXMua2V5KTtcblx0XHRcdFx0cmV0dXJuIGZhbGxiYWNrICYmIGZhbGxiYWNrKG5vZGUsIHBhcmFtcywgaW50cm8pO1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG5cdHJldHVybiBbdHJhbnNpdGlvbih0b19zZW5kLCB0b19yZWNlaXZlLCBmYWxzZSksIHRyYW5zaXRpb24odG9fcmVjZWl2ZSwgdG9fc2VuZCwgdHJ1ZSldO1xufVxuIiwgImltcG9ydCB7XG5cdHJ1bl9hbGwsXG5cdHN1YnNjcmliZSxcblx0bm9vcCxcblx0c2FmZV9ub3RfZXF1YWwsXG5cdGlzX2Z1bmN0aW9uLFxuXHRnZXRfc3RvcmVfdmFsdWVcbn0gZnJvbSAnLi4vaW50ZXJuYWwvaW5kZXguanMnO1xuXG5jb25zdCBzdWJzY3JpYmVyX3F1ZXVlID0gW107XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBSZWFkYWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXN0b3JlI3JlYWRhYmxlXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtUfSBbdmFsdWVdIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlN0YXJ0U3RvcE5vdGlmaWVyPFQ+fSBbc3RhcnRdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlJlYWRhYmxlPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZGFibGUodmFsdWUsIHN0YXJ0KSB7XG5cdHJldHVybiB7XG5cdFx0c3Vic2NyaWJlOiB3cml0YWJsZSh2YWx1ZSwgc3RhcnQpLnN1YnNjcmliZVxuXHR9O1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGBXcml0YWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgYm90aCB1cGRhdGluZyBhbmQgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXN0b3JlI3dyaXRhYmxlXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtUfSBbdmFsdWVdIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlN0YXJ0U3RvcE5vdGlmaWVyPFQ+fSBbc3RhcnRdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLldyaXRhYmxlPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JpdGFibGUodmFsdWUsIHN0YXJ0ID0gbm9vcCkge1xuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5VbnN1YnNjcmliZXJ9ICovXG5cdGxldCBzdG9wO1xuXHQvKiogQHR5cGUge1NldDxpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLlN1YnNjcmliZUludmFsaWRhdGVUdXBsZTxUPj59ICovXG5cdGNvbnN0IHN1YnNjcmliZXJzID0gbmV3IFNldCgpO1xuXHQvKiogQHBhcmFtIHtUfSBuZXdfdmFsdWVcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXQobmV3X3ZhbHVlKSB7XG5cdFx0aWYgKHNhZmVfbm90X2VxdWFsKHZhbHVlLCBuZXdfdmFsdWUpKSB7XG5cdFx0XHR2YWx1ZSA9IG5ld192YWx1ZTtcblx0XHRcdGlmIChzdG9wKSB7XG5cdFx0XHRcdC8vIHN0b3JlIGlzIHJlYWR5XG5cdFx0XHRcdGNvbnN0IHJ1bl9xdWV1ZSA9ICFzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDtcblx0XHRcdFx0Zm9yIChjb25zdCBzdWJzY3JpYmVyIG9mIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdFx0c3Vic2NyaWJlclsxXSgpO1xuXHRcdFx0XHRcdHN1YnNjcmliZXJfcXVldWUucHVzaChzdWJzY3JpYmVyLCB2YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHJ1bl9xdWV1ZSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGg7IGkgKz0gMikge1xuXHRcdFx0XHRcdFx0c3Vic2NyaWJlcl9xdWV1ZVtpXVswXShzdWJzY3JpYmVyX3F1ZXVlW2kgKyAxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN1YnNjcmliZXJfcXVldWUubGVuZ3RoID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5VcGRhdGVyPFQ+fSBmblxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZShmbikge1xuXHRcdHNldChmbih2YWx1ZSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlN1YnNjcmliZXI8VD59IHJ1blxuXHQgKiBAcGFyYW0ge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuSW52YWxpZGF0b3I8VD59IFtpbnZhbGlkYXRlXVxuXHQgKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlVuc3Vic2NyaWJlcn1cblx0ICovXG5cdGZ1bmN0aW9uIHN1YnNjcmliZShydW4sIGludmFsaWRhdGUgPSBub29wKSB7XG5cdFx0LyoqIEB0eXBlIHtpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLlN1YnNjcmliZUludmFsaWRhdGVUdXBsZTxUPn0gKi9cblx0XHRjb25zdCBzdWJzY3JpYmVyID0gW3J1biwgaW52YWxpZGF0ZV07XG5cdFx0c3Vic2NyaWJlcnMuYWRkKHN1YnNjcmliZXIpO1xuXHRcdGlmIChzdWJzY3JpYmVycy5zaXplID09PSAxKSB7XG5cdFx0XHRzdG9wID0gc3RhcnQoc2V0LCB1cGRhdGUpIHx8IG5vb3A7XG5cdFx0fVxuXHRcdHJ1bih2YWx1ZSk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdHN1YnNjcmliZXJzLmRlbGV0ZShzdWJzY3JpYmVyKTtcblx0XHRcdGlmIChzdWJzY3JpYmVycy5zaXplID09PSAwICYmIHN0b3ApIHtcblx0XHRcdFx0c3RvcCgpO1xuXHRcdFx0XHRzdG9wID0gbnVsbDtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cdHJldHVybiB7IHNldCwgdXBkYXRlLCBzdWJzY3JpYmUgfTtcbn1cblxuLyoqXG4gKiBEZXJpdmVkIHZhbHVlIHN0b3JlIGJ5IHN5bmNocm9uaXppbmcgb25lIG9yIG1vcmUgcmVhZGFibGUgc3RvcmVzIGFuZFxuICogYXBwbHlpbmcgYW4gYWdncmVnYXRpb24gZnVuY3Rpb24gb3ZlciBpdHMgaW5wdXQgdmFsdWVzLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZS1zdG9yZSNkZXJpdmVkXG4gKiBAdGVtcGxhdGUge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuU3RvcmVzfSBTXG4gKiBAdGVtcGxhdGUgVFxuICogQG92ZXJsb2FkXG4gKiBAcGFyYW0ge1N9IHN0b3JlcyAtIGlucHV0IHN0b3Jlc1xuICogQHBhcmFtIHsodmFsdWVzOiBpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLlN0b3Jlc1ZhbHVlczxTPiwgc2V0OiAodmFsdWU6IFQpID0+IHZvaWQsIHVwZGF0ZTogKGZuOiBpbXBvcnQoJy4vcHVibGljLmpzJykuVXBkYXRlcjxUPikgPT4gdm9pZCkgPT4gaW1wb3J0KCcuL3B1YmxpYy5qcycpLlVuc3Vic2NyaWJlciB8IHZvaWR9IGZuIC0gZnVuY3Rpb24gY2FsbGJhY2sgdGhhdCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXNcbiAqIEBwYXJhbSB7VH0gW2luaXRpYWxfdmFsdWVdIC0gaW5pdGlhbCB2YWx1ZVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5SZWFkYWJsZTxUPn1cbiAqL1xuXG4vKipcbiAqIERlcml2ZWQgdmFsdWUgc3RvcmUgYnkgc3luY2hyb25pemluZyBvbmUgb3IgbW9yZSByZWFkYWJsZSBzdG9yZXMgYW5kXG4gKiBhcHBseWluZyBhbiBhZ2dyZWdhdGlvbiBmdW5jdGlvbiBvdmVyIGl0cyBpbnB1dCB2YWx1ZXMuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXN0b3JlI2Rlcml2ZWRcbiAqIEB0ZW1wbGF0ZSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5TdG9yZXN9IFNcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7U30gc3RvcmVzIC0gaW5wdXQgc3RvcmVzXG4gKiBAcGFyYW0geyh2YWx1ZXM6IGltcG9ydCgnLi9wcml2YXRlLmpzJykuU3RvcmVzVmFsdWVzPFM+KSA9PiBUfSBmbiAtIGZ1bmN0aW9uIGNhbGxiYWNrIHRoYXQgYWdncmVnYXRlcyB0aGUgdmFsdWVzXG4gKiBAcGFyYW0ge1R9IFtpbml0aWFsX3ZhbHVlXSAtIGluaXRpYWwgdmFsdWVcbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljLmpzJykuUmVhZGFibGU8VD59XG4gKi9cblxuLyoqXG4gKiBAdGVtcGxhdGUge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuU3RvcmVzfSBTXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtTfSBzdG9yZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge1R9IFtpbml0aWFsX3ZhbHVlXVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5SZWFkYWJsZTxUPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZWQoc3RvcmVzLCBmbiwgaW5pdGlhbF92YWx1ZSkge1xuXHRjb25zdCBzaW5nbGUgPSAhQXJyYXkuaXNBcnJheShzdG9yZXMpO1xuXHQvKiogQHR5cGUge0FycmF5PGltcG9ydCgnLi9wdWJsaWMuanMnKS5SZWFkYWJsZTxhbnk+Pn0gKi9cblx0Y29uc3Qgc3RvcmVzX2FycmF5ID0gc2luZ2xlID8gW3N0b3Jlc10gOiBzdG9yZXM7XG5cdGlmICghc3RvcmVzX2FycmF5LmV2ZXJ5KEJvb2xlYW4pKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdkZXJpdmVkKCkgZXhwZWN0cyBzdG9yZXMgYXMgaW5wdXQsIGdvdCBhIGZhbHN5IHZhbHVlJyk7XG5cdH1cblx0Y29uc3QgYXV0byA9IGZuLmxlbmd0aCA8IDI7XG5cdHJldHVybiByZWFkYWJsZShpbml0aWFsX3ZhbHVlLCAoc2V0LCB1cGRhdGUpID0+IHtcblx0XHRsZXQgc3RhcnRlZCA9IGZhbHNlO1xuXHRcdGNvbnN0IHZhbHVlcyA9IFtdO1xuXHRcdGxldCBwZW5kaW5nID0gMDtcblx0XHRsZXQgY2xlYW51cCA9IG5vb3A7XG5cdFx0Y29uc3Qgc3luYyA9ICgpID0+IHtcblx0XHRcdGlmIChwZW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNsZWFudXAoKTtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGZuKHNpbmdsZSA/IHZhbHVlc1swXSA6IHZhbHVlcywgc2V0LCB1cGRhdGUpO1xuXHRcdFx0aWYgKGF1dG8pIHtcblx0XHRcdFx0c2V0KHJlc3VsdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVhbnVwID0gaXNfZnVuY3Rpb24ocmVzdWx0KSA/IHJlc3VsdCA6IG5vb3A7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCB1bnN1YnNjcmliZXJzID0gc3RvcmVzX2FycmF5Lm1hcCgoc3RvcmUsIGkpID0+XG5cdFx0XHRzdWJzY3JpYmUoXG5cdFx0XHRcdHN0b3JlLFxuXHRcdFx0XHQodmFsdWUpID0+IHtcblx0XHRcdFx0XHR2YWx1ZXNbaV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRwZW5kaW5nICY9IH4oMSA8PCBpKTtcblx0XHRcdFx0XHRpZiAoc3RhcnRlZCkge1xuXHRcdFx0XHRcdFx0c3luYygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0KCkgPT4ge1xuXHRcdFx0XHRcdHBlbmRpbmcgfD0gMSA8PCBpO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0KTtcblx0XHRzdGFydGVkID0gdHJ1ZTtcblx0XHRzeW5jKCk7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIHN0b3AoKSB7XG5cdFx0XHRydW5fYWxsKHVuc3Vic2NyaWJlcnMpO1xuXHRcdFx0Y2xlYW51cCgpO1xuXHRcdFx0Ly8gV2UgbmVlZCB0byBzZXQgdGhpcyB0byBmYWxzZSBiZWNhdXNlIGNhbGxiYWNrcyBjYW4gc3RpbGwgaGFwcGVuIGRlc3BpdGUgaGF2aW5nIHVuc3Vic2NyaWJlZDpcblx0XHRcdC8vIENhbGxiYWNrcyBtaWdodCBhbHJlYWR5IGJlIHBsYWNlZCBpbiB0aGUgcXVldWUgd2hpY2ggZG9lc24ndCBrbm93IGl0IHNob3VsZCBubyBsb25nZXJcblx0XHRcdC8vIGludm9rZSB0aGlzIGRlcml2ZWQgc3RvcmUuXG5cdFx0XHRzdGFydGVkID0gZmFsc2U7XG5cdFx0fTtcblx0fSk7XG59XG5cbi8qKlxuICogVGFrZXMgYSBzdG9yZSBhbmQgcmV0dXJucyBhIG5ldyBvbmUgZGVyaXZlZCBmcm9tIHRoZSBvbGQgb25lIHRoYXQgaXMgcmVhZGFibGUuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXN0b3JlI3JlYWRvbmx5XG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljLmpzJykuUmVhZGFibGU8VD59IHN0b3JlICAtIHN0b3JlIHRvIG1ha2UgcmVhZG9ubHlcbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljLmpzJykuUmVhZGFibGU8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkb25seShzdG9yZSkge1xuXHRyZXR1cm4ge1xuXHRcdHN1YnNjcmliZTogc3RvcmUuc3Vic2NyaWJlLmJpbmQoc3RvcmUpXG5cdH07XG59XG5cbmV4cG9ydCB7IGdldF9zdG9yZV92YWx1ZSBhcyBnZXQgfTtcbiIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiIGNvbnRleHQ9XCJtb2R1bGVcIj5cbiAgaW1wb3J0IHsgd3JpdGFibGUsIHR5cGUgV3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuICBpbXBvcnQgeyBmYWRlIH0gZnJvbSAnc3ZlbHRlL3RyYW5zaXRpb24nO1xuXG4gIGV4cG9ydCBjb25zdCBiYWNrZHJvcFZpc2libGU6IFdyaXRhYmxlPGJvb2xlYW4+ID0gd3JpdGFibGUoZmFsc2UpO1xuPC9zY3JpcHQ+XG5cbnsjaWYgJGJhY2tkcm9wVmlzaWJsZX1cbiAgPGRpdiBjbGFzcz1cImJnLWJsYWNrLzUwIGFic29sdXRlIGluc2V0LTAgei0zMFwiIHRyYW5zaXRpb246ZmFkZSBkYXRhLXRlc3QtaWQ9XCJiYWNrZHJvcFwiPjwvZGl2Plxuey9pZn1cbiIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgdHlwZSB7IFBhZ2UgfSBmcm9tIFwiJGxpYi90eXBlc1wiO1xuICBcbiAgZXhwb3J0IGxldCBwYWdlOiBQYWdlO1xuXG4gIGZ1bmN0aW9uIGdldFBhZ2VOYW1lKHBhZ2U6IFBhZ2UpOiBzdHJpbmcge1xuICAgIHJldHVybiAoIXBhZ2UucGF0aCB8fCBwYWdlLnBhdGggPT09ICcnKSA/ICdpbmRleCcgOiBwYWdlLnBhdGg7XG4gIH1cbjwvc2NyaXB0PlxuPGRpdiBcbiAgY2xhc3M9XCJmbGV4LTEgZmxleCBmbGV4LWNvbFwiIFxuICBkYXRhLXRlc3QtaWQ9XCJmYWtlLWJyb3dzZXJcIj5cbiAgPGRpdiBcbiAgICBjbGFzcz1cImJnLWdyYXktNTAgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjAwIGJvcmRlci1zb2xpZCByb3VuZGVkLXQteGwgaC0xMiBweC0zLjUgZmxleFwiIFxuICAgIGRhdGEtdGVzdC1pZD1cImFkZHJlc3MtYmFyXCI+XG4gICAgPGRpdiBjbGFzcz1cInB5LTJcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5saW5lLWJsb2NrIGgtMiB3LTIgbWwtMiByb3VuZGVkLWZ1bGwgYmctcmVkLTgwMFwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5saW5lLWJsb2NrIGgtMiB3LTIgbWwtMiByb3VuZGVkLWZ1bGwgYmctYW1iZXItNDAwXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpbmxpbmUtYmxvY2sgaC0yIHctMiBtbC0yIHJvdW5kZWQtZnVsbCBiZy1saW1lLTYwMFwiPjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZmxleC0xIHB5LTIuNSBvdmVyZmxvdy12aXNpYmxlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicm91bmRlZCBiZy1ncmF5LTUwIGJvcmRlci1iIGJvcmRlci1ncmF5LTIwMCBzaGFkb3cgbWF4LXcteHMgbXgtYXV0byB0ZXh0LWNlbnRlciBweS0wLjUgcmVsYXRpdmVcIj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0LWlkPVwidXJsLWJveFwiPntnZXRQYWdlTmFtZShwYWdlKX08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicHktM1wiPlxuICAgICAgPCEtLSBEIHwgVCB8IFAgb3Igc29tZSBzZWxlY3RvciB0byBjaG9vc2UgZGVza3RvcCwgdGFibGV0IG9yIHBob25lIHZpZXdwb3J0IHNpemUtLT5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxzbG90Lz5cbjwvZGl2PiIsICJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pO1xuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkMih0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuXG4gIHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTtcblxuICB2YXIga2V5LCBpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHNvdXJjZVN5bWJvbEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gc291cmNlU3ltYm9sS2V5c1tpXTtcbiAgICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gIHJldHVybiBhcnIyO1xufVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufVxuXG5leHBvcnQgeyBfYXJyYXlMaWtlVG9BcnJheSBhcyBhcnJheUxpa2VUb0FycmF5LCBfYXJyYXlXaXRoSG9sZXMgYXMgYXJyYXlXaXRoSG9sZXMsIF9kZWZpbmVQcm9wZXJ0eSBhcyBkZWZpbmVQcm9wZXJ0eSwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0IGFzIGl0ZXJhYmxlVG9BcnJheUxpbWl0LCBfbm9uSXRlcmFibGVSZXN0IGFzIG5vbkl0ZXJhYmxlUmVzdCwgX29iamVjdFNwcmVhZDIgYXMgb2JqZWN0U3ByZWFkMiwgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzIGFzIG9iamVjdFdpdGhvdXRQcm9wZXJ0aWVzLCBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSBhcyBvYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlLCBfc2xpY2VkVG9BcnJheSBhcyBzbGljZWRUb0FycmF5LCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgYXMgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgfTtcbiIsICJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pO1xuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkMih0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gZm5zLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uICh5LCBmKSB7XG4gICAgICByZXR1cm4gZih5KTtcbiAgICB9LCB4KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3VycnkoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGN1cnJpZWQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiBhcmdzLmxlbmd0aCA+PSBmbi5sZW5ndGggPyBmbi5hcHBseSh0aGlzLCBhcmdzKSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgbmV4dEFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgbmV4dEFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGN1cnJpZWQuYXBwbHkoX3RoaXMsIFtdLmNvbmNhdChhcmdzLCBuZXh0QXJncykpO1xuICAgIH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKS5pbmNsdWRlcygnT2JqZWN0Jyk7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XG4gIHJldHVybiAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNoYW5nZXMoaW5pdGlhbCwgY2hhbmdlcykge1xuICBpZiAoIWlzT2JqZWN0KGNoYW5nZXMpKSBlcnJvckhhbmRsZXIoJ2NoYW5nZVR5cGUnKTtcbiAgaWYgKE9iamVjdC5rZXlzKGNoYW5nZXMpLnNvbWUoZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgcmV0dXJuICFoYXNPd25Qcm9wZXJ0eShpbml0aWFsLCBmaWVsZCk7XG4gIH0pKSBlcnJvckhhbmRsZXIoJ2NoYW5nZUZpZWxkJyk7XG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIGlmICghaXNGdW5jdGlvbihzZWxlY3RvcikpIGVycm9ySGFuZGxlcignc2VsZWN0b3JUeXBlJyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlSGFuZGxlcihoYW5kbGVyKSB7XG4gIGlmICghKGlzRnVuY3Rpb24oaGFuZGxlcikgfHwgaXNPYmplY3QoaGFuZGxlcikpKSBlcnJvckhhbmRsZXIoJ2hhbmRsZXJUeXBlJyk7XG4gIGlmIChpc09iamVjdChoYW5kbGVyKSAmJiBPYmplY3QudmFsdWVzKGhhbmRsZXIpLnNvbWUoZnVuY3Rpb24gKF9oYW5kbGVyKSB7XG4gICAgcmV0dXJuICFpc0Z1bmN0aW9uKF9oYW5kbGVyKTtcbiAgfSkpIGVycm9ySGFuZGxlcignaGFuZGxlcnNUeXBlJyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlSW5pdGlhbChpbml0aWFsKSB7XG4gIGlmICghaW5pdGlhbCkgZXJyb3JIYW5kbGVyKCdpbml0aWFsSXNSZXF1aXJlZCcpO1xuICBpZiAoIWlzT2JqZWN0KGluaXRpYWwpKSBlcnJvckhhbmRsZXIoJ2luaXRpYWxUeXBlJyk7XG4gIGlmIChpc0VtcHR5KGluaXRpYWwpKSBlcnJvckhhbmRsZXIoJ2luaXRpYWxDb250ZW50Jyk7XG59XG5cbmZ1bmN0aW9uIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlcywgdHlwZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlc1t0eXBlXSB8fCBlcnJvck1lc3NhZ2VzW1wiZGVmYXVsdFwiXSk7XG59XG5cbnZhciBlcnJvck1lc3NhZ2VzID0ge1xuICBpbml0aWFsSXNSZXF1aXJlZDogJ2luaXRpYWwgc3RhdGUgaXMgcmVxdWlyZWQnLFxuICBpbml0aWFsVHlwZTogJ2luaXRpYWwgc3RhdGUgc2hvdWxkIGJlIGFuIG9iamVjdCcsXG4gIGluaXRpYWxDb250ZW50OiAnaW5pdGlhbCBzdGF0ZSBzaG91bGRuXFwndCBiZSBhbiBlbXB0eSBvYmplY3QnLFxuICBoYW5kbGVyVHlwZTogJ2hhbmRsZXIgc2hvdWxkIGJlIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uJyxcbiAgaGFuZGxlcnNUeXBlOiAnYWxsIGhhbmRsZXJzIHNob3VsZCBiZSBhIGZ1bmN0aW9ucycsXG4gIHNlbGVjdG9yVHlwZTogJ3NlbGVjdG9yIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyxcbiAgY2hhbmdlVHlwZTogJ3Byb3ZpZGVkIHZhbHVlIG9mIGNoYW5nZXMgc2hvdWxkIGJlIGFuIG9iamVjdCcsXG4gIGNoYW5nZUZpZWxkOiAnaXQgc2VhbXMgeW91IHdhbnQgdG8gY2hhbmdlIGEgZmllbGQgaW4gdGhlIHN0YXRlIHdoaWNoIGlzIG5vdCBzcGVjaWZpZWQgaW4gdGhlIFwiaW5pdGlhbFwiIHN0YXRlJyxcbiAgXCJkZWZhdWx0XCI6ICdhbiB1bmtub3duIGVycm9yIGFjY3VyZWQgaW4gYHN0YXRlLWxvY2FsYCBwYWNrYWdlJ1xufTtcbnZhciBlcnJvckhhbmRsZXIgPSBjdXJyeSh0aHJvd0Vycm9yKShlcnJvck1lc3NhZ2VzKTtcbnZhciB2YWxpZGF0b3JzID0ge1xuICBjaGFuZ2VzOiB2YWxpZGF0ZUNoYW5nZXMsXG4gIHNlbGVjdG9yOiB2YWxpZGF0ZVNlbGVjdG9yLFxuICBoYW5kbGVyOiB2YWxpZGF0ZUhhbmRsZXIsXG4gIGluaXRpYWw6IHZhbGlkYXRlSW5pdGlhbFxufTtcblxuZnVuY3Rpb24gY3JlYXRlKGluaXRpYWwpIHtcbiAgdmFyIGhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICB2YWxpZGF0b3JzLmluaXRpYWwoaW5pdGlhbCk7XG4gIHZhbGlkYXRvcnMuaGFuZGxlcihoYW5kbGVyKTtcbiAgdmFyIHN0YXRlID0ge1xuICAgIGN1cnJlbnQ6IGluaXRpYWxcbiAgfTtcbiAgdmFyIGRpZFVwZGF0ZSA9IGN1cnJ5KGRpZFN0YXRlVXBkYXRlKShzdGF0ZSwgaGFuZGxlcik7XG4gIHZhciB1cGRhdGUgPSBjdXJyeSh1cGRhdGVTdGF0ZSkoc3RhdGUpO1xuICB2YXIgdmFsaWRhdGUgPSBjdXJyeSh2YWxpZGF0b3JzLmNoYW5nZXMpKGluaXRpYWwpO1xuICB2YXIgZ2V0Q2hhbmdlcyA9IGN1cnJ5KGV4dHJhY3RDaGFuZ2VzKShzdGF0ZSk7XG5cbiAgZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICAgIHZhbGlkYXRvcnMuc2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIHJldHVybiBzZWxlY3RvcihzdGF0ZS5jdXJyZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKGNhdXNlZENoYW5nZXMpIHtcbiAgICBjb21wb3NlKGRpZFVwZGF0ZSwgdXBkYXRlLCB2YWxpZGF0ZSwgZ2V0Q2hhbmdlcykoY2F1c2VkQ2hhbmdlcyk7XG4gIH1cblxuICByZXR1cm4gW2dldFN0YXRlLCBzZXRTdGF0ZV07XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RDaGFuZ2VzKHN0YXRlLCBjYXVzZWRDaGFuZ2VzKSB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKGNhdXNlZENoYW5nZXMpID8gY2F1c2VkQ2hhbmdlcyhzdGF0ZS5jdXJyZW50KSA6IGNhdXNlZENoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlKHN0YXRlLCBjaGFuZ2VzKSB7XG4gIHN0YXRlLmN1cnJlbnQgPSBfb2JqZWN0U3ByZWFkMihfb2JqZWN0U3ByZWFkMih7fSwgc3RhdGUuY3VycmVudCksIGNoYW5nZXMpO1xuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gZGlkU3RhdGVVcGRhdGUoc3RhdGUsIGhhbmRsZXIsIGNoYW5nZXMpIHtcbiAgaXNGdW5jdGlvbihoYW5kbGVyKSA/IGhhbmRsZXIoc3RhdGUuY3VycmVudCkgOiBPYmplY3Qua2V5cyhjaGFuZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHZhciBfaGFuZGxlciRmaWVsZDtcblxuICAgIHJldHVybiAoX2hhbmRsZXIkZmllbGQgPSBoYW5kbGVyW2ZpZWxkXSkgPT09IG51bGwgfHwgX2hhbmRsZXIkZmllbGQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oYW5kbGVyJGZpZWxkLmNhbGwoaGFuZGxlciwgc3RhdGUuY3VycmVudFtmaWVsZF0pO1xuICB9KTtcbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbnZhciBpbmRleCA9IHtcbiAgY3JlYXRlOiBjcmVhdGVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluZGV4O1xuIiwgInZhciBjb25maWcgPSB7XG4gIHBhdGhzOiB7XG4gICAgdnM6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL21vbmFjby1lZGl0b3JAMC40My4wL21pbi92cydcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIiwgImZ1bmN0aW9uIGN1cnJ5KGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjdXJyaWVkKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3MubGVuZ3RoID49IGZuLmxlbmd0aCA/IGZuLmFwcGx5KHRoaXMsIGFyZ3MpIDogZnVuY3Rpb24gKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBuZXh0QXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBuZXh0QXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmllZC5hcHBseShfdGhpcywgW10uY29uY2F0KGFyZ3MsIG5leHRBcmdzKSk7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3Vycnk7XG4iLCAiZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpLmluY2x1ZGVzKCdPYmplY3QnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4uL3V0aWxzL2N1cnJ5LmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuLi91dGlscy9pc09iamVjdC5qcyc7XG5cbi8qKlxuICogdmFsaWRhdGVzIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBhbmQgaW5mb3JtcyBhYm91dCBkZXByZWNhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBcbiAqIEByZXR1cm4ge09iamVjdH0gY29uZmlnIC0gdGhlIHZhbGlkYXRlZCBjb25maWd1cmF0aW9uIG9iamVjdFxuICovXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ29uZmlnKGNvbmZpZykge1xuICBpZiAoIWNvbmZpZykgZXJyb3JIYW5kbGVyKCdjb25maWdJc1JlcXVpcmVkJyk7XG4gIGlmICghaXNPYmplY3QoY29uZmlnKSkgZXJyb3JIYW5kbGVyKCdjb25maWdUeXBlJyk7XG5cbiAgaWYgKGNvbmZpZy51cmxzKSB7XG4gICAgaW5mb3JtQWJvdXREZXByZWNhdGlvbigpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXRoczoge1xuICAgICAgICB2czogY29uZmlnLnVybHMubW9uYWNvQmFzZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufVxuLyoqXG4gKiBsb2dzIGRlcHJlY2F0aW9uIG1lc3NhZ2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGluZm9ybUFib3V0RGVwcmVjYXRpb24oKSB7XG4gIGNvbnNvbGUud2FybihlcnJvck1lc3NhZ2VzLmRlcHJlY2F0aW9uKTtcbn1cblxuZnVuY3Rpb24gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2VzLCB0eXBlKSB7XG4gIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2VzW3R5cGVdIHx8IGVycm9yTWVzc2FnZXNbXCJkZWZhdWx0XCJdKTtcbn1cblxudmFyIGVycm9yTWVzc2FnZXMgPSB7XG4gIGNvbmZpZ0lzUmVxdWlyZWQ6ICd0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgaXMgcmVxdWlyZWQnLFxuICBjb25maWdUeXBlOiAndGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHNob3VsZCBiZSBhbiBvYmplY3QnLFxuICBcImRlZmF1bHRcIjogJ2FuIHVua25vd24gZXJyb3IgYWNjdXJlZCBpbiBgQG1vbmFjby1lZGl0b3IvbG9hZGVyYCBwYWNrYWdlJyxcbiAgZGVwcmVjYXRpb246IFwiRGVwcmVjYXRpb24gd2FybmluZyFcXG4gICAgWW91IGFyZSB1c2luZyBkZXByZWNhdGVkIHdheSBvZiBjb25maWd1cmF0aW9uLlxcblxcbiAgICBJbnN0ZWFkIG9mIHVzaW5nXFxuICAgICAgbW9uYWNvLmNvbmZpZyh7IHVybHM6IHsgbW9uYWNvQmFzZTogJy4uLicgfSB9KVxcbiAgICB1c2VcXG4gICAgICBtb25hY28uY29uZmlnKHsgcGF0aHM6IHsgdnM6ICcuLi4nIH0gfSlcXG5cXG4gICAgRm9yIG1vcmUgcGxlYXNlIGNoZWNrIHRoZSBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9zdXJlbi1hdG95YW4vbW9uYWNvLWxvYWRlciNjb25maWdcXG4gIFwiXG59O1xudmFyIGVycm9ySGFuZGxlciA9IGN1cnJ5KHRocm93RXJyb3IpKGVycm9yTWVzc2FnZXMpO1xudmFyIHZhbGlkYXRvcnMgPSB7XG4gIGNvbmZpZzogdmFsaWRhdGVDb25maWdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRvcnM7XG5leHBvcnQgeyBlcnJvckhhbmRsZXIsIGVycm9yTWVzc2FnZXMgfTtcbiIsICJ2YXIgY29tcG9zZSA9IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZm5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGZucy5yZWR1Y2VSaWdodChmdW5jdGlvbiAoeSwgZikge1xuICAgICAgcmV0dXJuIGYoeSk7XG4gICAgfSwgeCk7XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21wb3NlO1xuIiwgImltcG9ydCB7IG9iamVjdFNwcmVhZDIgYXMgX29iamVjdFNwcmVhZDIgfSBmcm9tICcuLi9fdmlydHVhbC9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLmpzJztcblxuZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoc291cmNlW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIGlmICh0YXJnZXRba2V5XSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKHNvdXJjZVtrZXldLCBtZXJnZSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIHRhcmdldCksIHNvdXJjZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlO1xuIiwgIi8vIFRoZSBzb3VyY2UgKGhhcyBiZWVuIGNoYW5nZWQpIGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvNTQ2NSNpc3N1ZWNvbW1lbnQtMTU3ODg4MzI1XG52YXIgQ0FOQ0VMQVRJT05fTUVTU0FHRSA9IHtcbiAgdHlwZTogJ2NhbmNlbGF0aW9uJyxcbiAgbXNnOiAnb3BlcmF0aW9uIGlzIG1hbnVhbGx5IGNhbmNlbGVkJ1xufTtcblxuZnVuY3Rpb24gbWFrZUNhbmNlbGFibGUocHJvbWlzZSkge1xuICB2YXIgaGFzQ2FuY2VsZWRfID0gZmFsc2U7XG4gIHZhciB3cmFwcGVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIGhhc0NhbmNlbGVkXyA/IHJlamVjdChDQU5DRUxBVElPTl9NRVNTQUdFKSA6IHJlc29sdmUodmFsKTtcbiAgICB9KTtcbiAgICBwcm9taXNlW1wiY2F0Y2hcIl0ocmVqZWN0KTtcbiAgfSk7XG4gIHJldHVybiB3cmFwcGVkUHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGhhc0NhbmNlbGVkXyA9IHRydWU7XG4gIH0sIHdyYXBwZWRQcm9taXNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYWtlQ2FuY2VsYWJsZTtcbmV4cG9ydCB7IENBTkNFTEFUSU9OX01FU1NBR0UgfTtcbiIsICJpbXBvcnQgeyBzbGljZWRUb0FycmF5IGFzIF9zbGljZWRUb0FycmF5LCBvYmplY3RXaXRob3V0UHJvcGVydGllcyBhcyBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMgfSBmcm9tICcuLi9fdmlydHVhbC9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLmpzJztcbmltcG9ydCBzdGF0ZSBmcm9tICdzdGF0ZS1sb2NhbCc7XG5pbXBvcnQgY29uZmlnJDEgZnJvbSAnLi4vY29uZmlnL2luZGV4LmpzJztcbmltcG9ydCB2YWxpZGF0b3JzIGZyb20gJy4uL3ZhbGlkYXRvcnMvaW5kZXguanMnO1xuaW1wb3J0IGNvbXBvc2UgZnJvbSAnLi4vdXRpbHMvY29tcG9zZS5qcyc7XG5pbXBvcnQgbWVyZ2UgZnJvbSAnLi4vdXRpbHMvZGVlcE1lcmdlLmpzJztcbmltcG9ydCBtYWtlQ2FuY2VsYWJsZSBmcm9tICcuLi91dGlscy9tYWtlQ2FuY2VsYWJsZS5qcyc7XG5cbi8qKiB0aGUgbG9jYWwgc3RhdGUgb2YgdGhlIG1vZHVsZSAqL1xuXG52YXIgX3N0YXRlJGNyZWF0ZSA9IHN0YXRlLmNyZWF0ZSh7XG4gIGNvbmZpZzogY29uZmlnJDEsXG4gIGlzSW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICByZXNvbHZlOiBudWxsLFxuICByZWplY3Q6IG51bGwsXG4gIG1vbmFjbzogbnVsbFxufSksXG4gICAgX3N0YXRlJGNyZWF0ZTIgPSBfc2xpY2VkVG9BcnJheShfc3RhdGUkY3JlYXRlLCAyKSxcbiAgICBnZXRTdGF0ZSA9IF9zdGF0ZSRjcmVhdGUyWzBdLFxuICAgIHNldFN0YXRlID0gX3N0YXRlJGNyZWF0ZTJbMV07XG4vKipcbiAqIHNldCB0aGUgbG9hZGVyIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSB0aGUgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuXG5cbmZ1bmN0aW9uIGNvbmZpZyhnbG9iYWxDb25maWcpIHtcbiAgdmFyIF92YWxpZGF0b3JzJGNvbmZpZyA9IHZhbGlkYXRvcnMuY29uZmlnKGdsb2JhbENvbmZpZyksXG4gICAgICBtb25hY28gPSBfdmFsaWRhdG9ycyRjb25maWcubW9uYWNvLFxuICAgICAgY29uZmlnID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF92YWxpZGF0b3JzJGNvbmZpZywgW1wibW9uYWNvXCJdKTtcblxuICBzZXRTdGF0ZShmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiBtZXJnZShzdGF0ZS5jb25maWcsIGNvbmZpZyksXG4gICAgICBtb25hY286IG1vbmFjb1xuICAgIH07XG4gIH0pO1xufVxuLyoqXG4gKiBoYW5kbGVzIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9uYWNvLWVkaXRvclxuICogQHJldHVybiB7UHJvbWlzZX0gLSByZXR1cm5zIGFuIGluc3RhbmNlIG9mIG1vbmFjbyAod2l0aCBhIGNhbmNlbGFibGUgcHJvbWlzZSlcbiAqL1xuXG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBzdGF0ZSA9IGdldFN0YXRlKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIG1vbmFjbyA9IF9yZWYubW9uYWNvLFxuICAgICAgICBpc0luaXRpYWxpemVkID0gX3JlZi5pc0luaXRpYWxpemVkLFxuICAgICAgICByZXNvbHZlID0gX3JlZi5yZXNvbHZlO1xuICAgIHJldHVybiB7XG4gICAgICBtb25hY286IG1vbmFjbyxcbiAgICAgIGlzSW5pdGlhbGl6ZWQ6IGlzSW5pdGlhbGl6ZWQsXG4gICAgICByZXNvbHZlOiByZXNvbHZlXG4gICAgfTtcbiAgfSk7XG5cbiAgaWYgKCFzdGF0ZS5pc0luaXRpYWxpemVkKSB7XG4gICAgc2V0U3RhdGUoe1xuICAgICAgaXNJbml0aWFsaXplZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKHN0YXRlLm1vbmFjbykge1xuICAgICAgc3RhdGUucmVzb2x2ZShzdGF0ZS5tb25hY28pO1xuICAgICAgcmV0dXJuIG1ha2VDYW5jZWxhYmxlKHdyYXBwZXJQcm9taXNlKTtcbiAgICB9XG5cbiAgICBpZiAod2luZG93Lm1vbmFjbyAmJiB3aW5kb3cubW9uYWNvLmVkaXRvcikge1xuICAgICAgc3RvcmVNb25hY29JbnN0YW5jZSh3aW5kb3cubW9uYWNvKTtcbiAgICAgIHN0YXRlLnJlc29sdmUod2luZG93Lm1vbmFjbyk7XG4gICAgICByZXR1cm4gbWFrZUNhbmNlbGFibGUod3JhcHBlclByb21pc2UpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoaW5qZWN0U2NyaXB0cywgZ2V0TW9uYWNvTG9hZGVyU2NyaXB0KShjb25maWd1cmVMb2FkZXIpO1xuICB9XG5cbiAgcmV0dXJuIG1ha2VDYW5jZWxhYmxlKHdyYXBwZXJQcm9taXNlKTtcbn1cbi8qKlxuICogaW5qZWN0cyBwcm92aWRlZCBzY3JpcHRzIGludG8gdGhlIGRvY3VtZW50LmJvZHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY3JpcHQgLSBhbiBIVE1MIHNjcmlwdCBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gdGhlIGluamVjdGVkIEhUTUwgc2NyaXB0IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGluamVjdFNjcmlwdHMoc2NyaXB0KSB7XG4gIHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG4vKipcbiAqIGNyZWF0ZXMgYW4gSFRNTCBzY3JpcHQgZWxlbWVudCB3aXRoL3dpdGhvdXQgcHJvdmlkZWQgc3JjXG4gKiBAcGFyYW0ge3N0cmluZ30gW3NyY10gLSB0aGUgc291cmNlIHBhdGggb2YgdGhlIHNjcmlwdFxuICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBjcmVhdGVkIEhUTUwgc2NyaXB0IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVNjcmlwdChzcmMpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICByZXR1cm4gc3JjICYmIChzY3JpcHQuc3JjID0gc3JjKSwgc2NyaXB0O1xufVxuLyoqXG4gKiBjcmVhdGVzIGFuIEhUTUwgc2NyaXB0IGVsZW1lbnQgd2l0aCB0aGUgbW9uYWNvIGxvYWRlciBzcmNcbiAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgY3JlYXRlZCBIVE1MIHNjcmlwdCBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiBnZXRNb25hY29Mb2FkZXJTY3JpcHQoY29uZmlndXJlTG9hZGVyKSB7XG4gIHZhciBzdGF0ZSA9IGdldFN0YXRlKGZ1bmN0aW9uIChfcmVmMikge1xuICAgIHZhciBjb25maWcgPSBfcmVmMi5jb25maWcsXG4gICAgICAgIHJlamVjdCA9IF9yZWYyLnJlamVjdDtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICByZWplY3Q6IHJlamVjdFxuICAgIH07XG4gIH0pO1xuICB2YXIgbG9hZGVyU2NyaXB0ID0gY3JlYXRlU2NyaXB0KFwiXCIuY29uY2F0KHN0YXRlLmNvbmZpZy5wYXRocy52cywgXCIvbG9hZGVyLmpzXCIpKTtcblxuICBsb2FkZXJTY3JpcHQub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb25maWd1cmVMb2FkZXIoKTtcbiAgfTtcblxuICBsb2FkZXJTY3JpcHQub25lcnJvciA9IHN0YXRlLnJlamVjdDtcbiAgcmV0dXJuIGxvYWRlclNjcmlwdDtcbn1cbi8qKlxuICogY29uZmlndXJlcyB0aGUgbW9uYWNvIGxvYWRlclxuICovXG5cblxuZnVuY3Rpb24gY29uZmlndXJlTG9hZGVyKCkge1xuICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICB2YXIgY29uZmlnID0gX3JlZjMuY29uZmlnLFxuICAgICAgICByZXNvbHZlID0gX3JlZjMucmVzb2x2ZSxcbiAgICAgICAgcmVqZWN0ID0gX3JlZjMucmVqZWN0O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICByZWplY3Q6IHJlamVjdFxuICAgIH07XG4gIH0pO1xuICB2YXIgcmVxdWlyZSA9IHdpbmRvdy5yZXF1aXJlO1xuXG4gIHJlcXVpcmUuY29uZmlnKHN0YXRlLmNvbmZpZyk7XG5cbiAgcmVxdWlyZShbJ3ZzL2VkaXRvci9lZGl0b3IubWFpbiddLCBmdW5jdGlvbiAobW9uYWNvKSB7XG4gICAgc3RvcmVNb25hY29JbnN0YW5jZShtb25hY28pO1xuICAgIHN0YXRlLnJlc29sdmUobW9uYWNvKTtcbiAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgc3RhdGUucmVqZWN0KGVycm9yKTtcbiAgfSk7XG59XG4vKipcbiAqIHN0b3JlIG1vbmFjbyBpbnN0YW5jZSBpbiBsb2NhbCBzdGF0ZVxuICovXG5cblxuZnVuY3Rpb24gc3RvcmVNb25hY29JbnN0YW5jZShtb25hY28pIHtcbiAgaWYgKCFnZXRTdGF0ZSgpLm1vbmFjbykge1xuICAgIHNldFN0YXRlKHtcbiAgICAgIG1vbmFjbzogbW9uYWNvXG4gICAgfSk7XG4gIH1cbn1cbi8qKlxuICogaW50ZXJuYWwgaGVscGVyIGZ1bmN0aW9uXG4gKiBleHRyYWN0cyBzdG9yZWQgbW9uYWNvIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gLSB0aGUgbW9uYWNvIGluc3RhbmNlXG4gKi9cblxuXG5mdW5jdGlvbiBfX2dldE1vbmFjb0luc3RhbmNlKCkge1xuICByZXR1cm4gZ2V0U3RhdGUoZnVuY3Rpb24gKF9yZWY0KSB7XG4gICAgdmFyIG1vbmFjbyA9IF9yZWY0Lm1vbmFjbztcbiAgICByZXR1cm4gbW9uYWNvO1xuICB9KTtcbn1cblxudmFyIHdyYXBwZXJQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICByZXR1cm4gc2V0U3RhdGUoe1xuICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgcmVqZWN0OiByZWplY3RcbiAgfSk7XG59KTtcbnZhciBsb2FkZXIgPSB7XG4gIGNvbmZpZzogY29uZmlnLFxuICBpbml0OiBpbml0LFxuICBfX2dldE1vbmFjb0luc3RhbmNlOiBfX2dldE1vbmFjb0luc3RhbmNlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkZXI7XG4iLCAiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgaW1wb3J0IGxvYWRlciBmcm9tICdAbW9uYWNvLWVkaXRvci9sb2FkZXInO1xuICBpbXBvcnQgeyBvbkRlc3Ryb3ksIG9uTW91bnQgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgdHlwZSAqIGFzIE1vbmFjbyBmcm9tICdtb25hY28tZWRpdG9yL2VzbS92cy9lZGl0b3IvZWRpdG9yLmFwaSc7XG4gIGV4cG9ydCBsZXQgdmFsdWU6IHN0cmluZztcbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJztcbiAgbGV0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG4gIFxuICBsZXQgZWRpdG9yOiBNb25hY28uZWRpdG9yLklTdGFuZGFsb25lQ29kZUVkaXRvcjtcbiAgbGV0IG1vbmFjbzogdHlwZW9mIE1vbmFjbztcbiAgbGV0IGVkaXRvckNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gICQ6IHtcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29kZSBlZGl0b3IgdmFsdWUnLCB2YWx1ZSk7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfVxuICBvbk1vdW50KGFzeW5jICgpID0+IHtcbiAgICAgIGxvYWRlci5jb25maWcoeyBwYXRoczogeyB2czogJy9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9taW4vdnMnIH0gfSk7XG5cbiAgICAgIG1vbmFjbyA9IGF3YWl0IGxvYWRlci5pbml0KCk7XG5cbiAgICAgIGNvbnN0IGVkaXRvciA9IG1vbmFjby5lZGl0b3IuY3JlYXRlKGVkaXRvckNvbnRhaW5lciwge1xuICAgICAgICB2YWx1ZSxcblx0ICAgICAgbGFuZ3VhZ2U6ICdlbGl4aXInLFxuICAgICAgICBtaW5pbWFwOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgIGxpbmVOdW1iZXJzOiBcIm9mZlwiLFxuICAgICAgICBhdXRvbWF0aWNMYXlvdXQ6IHRydWVcbiAgICAgIH0pO1xuICAgICAgZWRpdG9yLm9uRGlkQmx1ckVkaXRvcldpZGdldChlID0+IHtcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgZGlzcGF0Y2goJ2NoYW5nZScsIGNvbnRlbnQpO1xuICAgICAgfSk7XG4gIH0pO1xuXG4gIG9uRGVzdHJveSgoKSA9PiB7XG4gICAgICBtb25hY28/LmVkaXRvci5nZXRNb2RlbHMoKS5mb3JFYWNoKChtb2RlbCkgPT4gbW9kZWwuZGlzcG9zZSgpKTtcbiAgfSk7XG48L3NjcmlwdD5cblxuPGRpdiBiaW5kOnRoaXM9e2VkaXRvckNvbnRhaW5lcn0gY2xhc3M9XCJ3LTUyIGgtMjQgcHktMC41IHB4LTAuNSBiZy1ncmF5LTEwMFwiPjwvZGl2PiIsICJleHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKF9ub2RlOiBIVE1MRWxlbWVudCwgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCB4ID0gMCwgeSA9IDAgfSkge1xuICByZXR1cm4ge1xuICAgIGRlbGF5LFxuICAgIGR1cmF0aW9uLFxuICAgIGNzczogKHQ6IG51bWJlcikgPT4gYHRyYW5zZm9ybTogdHJhbnNsYXRlKCR7eCAqIHR9cHgsICR7eSAqIHR9cHgpYFxuICB9O1xufSIsICJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IFdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgQ29tcG9uZW50Q2F0ZWdvcnkgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBjdXJyZW50Q29tcG9uZW50Q2F0ZWdvcnk6IFdyaXRhYmxlPENvbXBvbmVudENhdGVnb3J5IHwgbnVsbD4gPSB3cml0YWJsZShudWxsKVxuIiwgImltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgV3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuaW1wb3J0IHR5cGUgeyBDb21wb25lbnREZWZpbml0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5cbmV4cG9ydCBjb25zdCBkcmFnZ2VkT2JqZWN0OiBXcml0YWJsZTxDb21wb25lbnREZWZpbml0aW9uIHwgbnVsbD4gPSB3cml0YWJsZShudWxsKVxuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdGltcG9ydCB7IGZhZGUgfSBmcm9tICdzdmVsdGUvdHJhbnNpdGlvbic7XG4gIGltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gJyRsaWIvdXRpbHMvYW5pbWF0aW9ucyc7XG4gIGltcG9ydCB7IGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSB9IGZyb20gJyRsaWIvc3RvcmVzL2N1cnJlbnRDb21wb25lbnRDYXRlZ29yeSc7XG4gIGltcG9ydCB7IGRyYWdnZWRPYmplY3QgfSBmcm9tICckbGliL3N0b3Jlcy9kcmFnQW5kRHJvcCc7XG4gIGltcG9ydCB0eXBlIHsgQ29tcG9uZW50Q2F0ZWdvcnksIENvbXBvbmVudERlZmluaXRpb24sIE1lbnVDYXRlZ29yeSB9IGZyb20gJyRsaWIvdHlwZXMnO1xuICBleHBvcnQgbGV0IGNvbXBvbmVudHM6IENvbXBvbmVudERlZmluaXRpb25bXTtcblxuICBsZXQgbWVudUNhdGVnb3JpZXM6IE1lbnVDYXRlZ29yeVtdID0gW107XG4gICQ6IG1lbnVDYXRlZ29yaWVzID0gW3tcbiAgICBuYW1lOiAnQmFzZScsXG4gICAgaXRlbXM6IEFycmF5LmZyb20obmV3IFNldChjb21wb25lbnREZWZpbml0aW9ucy5tYXAoZCA9PiBkLmNhdGVnb3J5KSkpLm1hcChpZCA9PiAoeyBpZCwgbmFtZTogaWQgfSkpXG4gIH1dO1xuXG4gICQ6IGNvbXBvbmVudERlZmluaXRpb25zID0gY29tcG9uZW50cztcblx0JDogY29tcG9uZW50RGVmaW5pdGlvbnNCeUNhdGVnb3J5ID0gKGNvbXBvbmVudERlZmluaXRpb25zIHx8IFtdKS5yZWR1Y2UoKGFjYzogeyBba2V5OiBzdHJpbmddOiBDb21wb25lbnREZWZpbml0aW9uW10gfSwgY29tcDogQ29tcG9uZW50RGVmaW5pdGlvbikgPT4ge1xuICAgICAgYWNjW2NvbXAuY2F0ZWdvcnldIHx8PSBbXTtcbiAgICAgIGFjY1tjb21wLmNhdGVnb3J5XS5wdXNoKGNvbXApO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICQ6IGN1cnJlbnREZWZpbml0aW9ucyA9ICRjdXJyZW50Q29tcG9uZW50Q2F0ZWdvcnkgPyBjb21wb25lbnREZWZpbml0aW9uc0J5Q2F0ZWdvcnlbJGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeS5pZF0gOiBbXTtcblxuXHRjb25zdCBzZWN0aW9uVGl0bGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuXHRcdG5hdjogJ05hdnMnLFxuXHRcdGhlYWRlcjogJ0hlYWRlcnMnLFxuXHRcdHNpZ25faW46ICdTaWduIGlucycsXG5cdFx0c2lnbl91cDogJ1NpZ24gdXBzJyxcblx0XHRzdGF0czogJ1N0YXRzJyxcblx0XHRmb290ZXI6ICdGb290ZXJzJyxcblx0XHRiYXNpYzogJ0Jhc2ljcycsXG5cdFx0b3RoZXI6ICdPdGhlcidcblx0fVxuXG4gIGxldCBzaG93RXhhbXBsZXMgPSBmYWxzZTtcbiAgbGV0IGhpZGVDb21wb25lbnRUaW1lcjtcblxuXHRmdW5jdGlvbiBjb2xsYXBzZUNhdGVnb3J5TWVudSgpIHtcblx0XHRoaWRlQ29tcG9uZW50VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHNob3dFeGFtcGxlcyA9IGZhbHNlO1xuICAgIH0sIDQwMCk7XG5cdH1cblx0ZnVuY3Rpb24gYWJvcnRDb2xsYXBzZUNhdGVnb3J5TWVudSgpIHtcblx0XHRjbGVhclRpbWVvdXQoaGlkZUNvbXBvbmVudFRpbWVyKTtcblx0fVx0ICBcblxuXHRmdW5jdGlvbiBleHBhbmRDYXRlZ29yeU1lbnUoY29tcG9uZW50Q2F0ZWdvcnk6IENvbXBvbmVudENhdGVnb3J5KSB7XG5cdFx0aWYgKCRkcmFnZ2VkT2JqZWN0KSByZXR1cm47XG5cdFx0Y2xlYXJUaW1lb3V0KGhpZGVDb21wb25lbnRUaW1lcik7XG5cdFx0JGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSA9IGNvbXBvbmVudENhdGVnb3J5O1xuXHRcdHNob3dFeGFtcGxlcyA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBkcmFnU3RhcnQoY29tcG9uZW50RGVmaW5pdGlvbjogQ29tcG9uZW50RGVmaW5pdGlvbiwgZTogRHJhZ0V2ZW50KSB7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHQkZHJhZ2dlZE9iamVjdCA9IGNvbXBvbmVudERlZmluaXRpb25cblx0XHRcdHNob3dFeGFtcGxlcyA9IGZhbHNlO1xuXHRcdH0sIDEwMClcblx0fVxuXG5cdGZ1bmN0aW9uIGRyYWdFbmQoKSB7XG5cdFx0JGRyYWdnZWRPYmplY3QgPSBudWxsO1xuXHR9XG48L3NjcmlwdD5cblxuPCEtLSBMZWZ0IHNpZGViYXIgLS0+XG48ZGl2IGNsYXNzPVwidy02NCBiZy13aGl0ZSBib3JkZXItc2xhdGUtMTAwIGJvcmRlci1zb2xpZCBib3JkZXItclwiIGlkPVwibGVmdC1zaWRlYmFyXCIgZGF0YS10ZXN0LWlkPVwibGVmdC1zaWRlYmFyXCI+XG4gIDxkaXYgY2xhc3M9XCJzdGlja3kgdG9wLTBcIj5cbiAgICA8ZGl2IGNsYXNzPVwiYm9yZGVyLWIgYm9yZGVyLXNsYXRlLTEwMCBib3JkZXItc29saWQgcHktNCBweC00XCIgZGF0YS10ZXN0LWlkPVwibG9nb1wiPlxuICAgICAgPGgyIGNsYXNzPVwidGV4dC1sZyBmb250LWJvbGRcIj5Db21wb25lbnRzPC9oMj5cbiAgICA8L2Rpdj5cbiAgICA8dWwgY2xhc3M9XCJweS00IGgtW2NhbGMoMTAwdmhfLV82MXB4KV0gb3ZlcmZsb3cteS1hdXRvXCIgZGF0YS10ZXN0LWlkPVwiY29tcG9uZW50LXRyZWVcIj5cbiAgICAgIHsjZWFjaCBtZW51Q2F0ZWdvcmllcyBhcyBjYXRlZ29yeX1cbiAgICAgICAgPGxpIGNsYXNzPVwibWItMSBweC00XCIgZGF0YS10ZXN0LWlkPVwibmF2LWl0ZW1cIj5cbiAgICAgICAgICA8aDMgY2xhc3M9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB1cHBlcmNhc2VcIj57Y2F0ZWdvcnkubmFtZX08L2gzPlxuICAgICAgICA8L2xpPlxuICAgICAgICB7I2VhY2ggY2F0ZWdvcnkuaXRlbXMgYXMgaXRlbX1cbiAgICAgICAgICA8bGkgY2xhc3M9XCJwLTIgcGwtNiBob3ZlcjpiZy1zbGF0ZS01MCBob3ZlcjpjdXJzb3ItcG9pbnRlclwiIGRhdGEtdGVzdC1pZD1cIm5hdi1pdGVtXCIgb246bW91c2VlbnRlcj17KCkgPT4gZXhwYW5kQ2F0ZWdvcnlNZW51KGl0ZW0pfSBvbjptb3VzZWxlYXZlPXtjb2xsYXBzZUNhdGVnb3J5TWVudX0+XG4gICAgICAgICAgICA8ZGl2PntzZWN0aW9uVGl0bGVzW2l0ZW0ubmFtZV19PC9kaXY+XHRcbiAgICAgICAgICA8L2xpPlxuICAgICAgICB7L2VhY2h9XG4gICAgICB7L2VhY2h9XG4gICAgPC91bD5cbiAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1uby1zdGF0aWMtZWxlbWVudC1pbnRlcmFjdGlvbnMgLS0+XG4gICAgPGRpdiBcbiAgICAgIGNsYXNzPVwiYWJzb2x1dGUgdy05NiBsZWZ0LTAgYmctc2xhdGUtNTAgaW5zZXQteS0wIHNoYWRvdy1zbSB6LTUwIHB0LTMgcGItNCBweC01IHRyYW5zaXRpb24tdHJhbnNmb3JtIGR1cmF0aW9uLTUwMCBvcGFjaXR5LTAgaW52aXNpYmxlIG92ZXJmbG93LXktYXV0byBtaW4taC1zY3JlZW5cIiBcbiAgICAgIGNsYXNzOnRyYW5zbGF0ZS14LVsyNTVweF09e3Nob3dFeGFtcGxlc31cbiAgICAgIGNsYXNzOiFvcGFjaXR5LTEwMD17c2hvd0V4YW1wbGVzfVxuICAgICAgY2xhc3M6IXZpc2libGU9e3Nob3dFeGFtcGxlc31cbiAgICAgIGlkPVwiY29tcG9uZW50LXByZXZpZXdzXCJcbiAgICAgIGRhdGEtdGVzdC1pZD1cImNvbXBvbmVudC1wcmV2aWV3c1wiIFxuICAgICAgdHJhbnNpdGlvbjp0cmFuc2xhdGU9e3t4OiAzODR9fVxuICAgICAgb246bW91c2VlbnRlcj17YWJvcnRDb2xsYXBzZUNhdGVnb3J5TWVudX1cbiAgICAgIG9uOm1vdXNlbGVhdmU9e2NvbGxhcHNlQ2F0ZWdvcnlNZW51fT5cbiAgICAgIDxoNCBjbGFzcz1cIm1iLTQgZm9udC1ib2xkIHRleHQtMnhsXCI+e3NlY3Rpb25UaXRsZXNbJGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeT8ubmFtZV19PC9oND5cbiAgICAgIDxwIGNsYXNzPVwiZm9udC1tZWRpdW1cIj5TZWxlY3QgYSBjb21wb25lbnQg8J+RhyAgYW5kIGRyYWcgaXQgdG8gdGhlIGNhbnZhcyDwn5GJPC9wPlxuICAgICAgeyNpZiBjdXJyZW50RGVmaW5pdGlvbnN9XG4gICAgICAgIHsjZWFjaCBjdXJyZW50RGVmaW5pdGlvbnMgYXMgZXhhbXBsZX1cbiAgICAgICAgICA8IS0tIHN2ZWx0ZS1pZ25vcmUgYTExeS1uby1zdGF0aWMtZWxlbWVudC1pbnRlcmFjdGlvbnMgLS0+XG4gICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgIGRyYWdnYWJsZVxuICAgICAgICAgICAgb246ZHJhZ3N0YXJ0PXtlID0+IGRyYWdTdGFydChleGFtcGxlLCBlKX1cbiAgICAgICAgICAgIG9uOmRyYWdlbmQ9e2RyYWdFbmR9XG4gICAgICAgICAgICBjbGFzcz1cInB0LTZcIiBcbiAgICAgICAgICAgIGRhdGEtdGVzdC1pZD1cImNvbXBvbmVudC1wcmV2aWV3LWNhcmRcIj5cbiAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJyb3VuZGVkIHJpbmctb2Zmc2V0LTIgcmluZy1ibHVlLTUwMCB0cmFuc2l0aW9uIGhvdmVyOmN1cnNvci1ncmFiIGhvdmVyOnJpbmctMlwiIHNyYz17ZXhhbXBsZS50aHVtYm5haWx9IGFsdD17ZXhhbXBsZS5uYW1lfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB7L2VhY2h9XG4gICAgICB7L2lmfVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuXG57I2lmIHNob3dFeGFtcGxlc31cbiAgPGRpdiBjbGFzcz1cImJnLWJsYWNrLzUwIGFic29sdXRlIGluc2V0LTAgei01MFwiIHRyYW5zaXRpb246ZmFkZT17e2R1cmF0aW9uOiAzMDB9fSBpZD1cImJhY2tkcm9wXCIgZGF0YS10ZXN0LWlkPVwiYmFja2Ryb3BcIj48L2Rpdj5cbnsvaWZ9XHRcblxuPHN0eWxlPlxuXHQjbGVmdC1zaWRlYmFyIHtcblx0XHR6LWluZGV4OiAxMDAwO1xuXHR9XG5cdCNiYWNrZHJvcCB7XG5cdFx0ei1pbmRleDogOTk5O1xuXHR9XG48L3N0eWxlPiIsICJpbXBvcnQgeyB3cml0YWJsZSwgZGVyaXZlZCwgZ2V0IH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgV3JpdGFibGUsIFJlYWRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgQXN0RWxlbWVudCwgQXN0Tm9kZSwgUGFnZSB9IGZyb20gJyRsaWIvdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgcGFnZTogV3JpdGFibGU8UGFnZT4gPSB3cml0YWJsZSgpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdGVkQXN0RWxlbWVudElkOiBXcml0YWJsZTxzdHJpbmcgfCB1bmRlZmluZWQ+ID0gd3JpdGFibGUoKTtcbi8vIGV4cG9ydCBjb25zdCBoaWdobGlnaHRlZEFzdEVsZW1lbnRJZDogV3JpdGFibGU8c3RyaW5nIHwgdW5kZWZpbmVkPiA9IHdyaXRhYmxlKCk7XG5leHBvcnQgY29uc3QgaGlnaGxpZ2h0ZWRBc3RFbGVtZW50OiBXcml0YWJsZTxBc3RFbGVtZW50IHwgdW5kZWZpbmVkPiA9IHdyaXRhYmxlKCk7XG5leHBvcnQgY29uc3Qgc2xvdFRhcmdldEVsZW1lbnQ6IFdyaXRhYmxlPEFzdEVsZW1lbnQgfCB1bmRlZmluZWQ+ID0gd3JpdGFibGUoKTtcblxuZXhwb3J0IGNvbnN0IHJvb3RBc3RFbGVtZW50OiBSZWFkYWJsZTxBc3RFbGVtZW50IHwgdW5kZWZpbmVkPiA9IGRlcml2ZWQoW3BhZ2VdLCAoWyRwYWdlXSkgPT4ge1xuICAvLyBUaGlzIGlzIGEgdmlydHVhbCBBc3RFbGVtZW50IGludGVuZGVkIHRvIHNpbXVsYXRlIHRoZSBwYWdlIGl0c2VsZiB0byByZW9yZGVyIHRoZSBjb21wb25lbnRzIGF0IHRoZSBmaXJzdCBsZXZlbC5cbiAgcmV0dXJuIHsgdGFnOiAncm9vdCcsIGF0dHJzOiB7fSwgY29udGVudDogJHBhZ2UuYXN0IH07XG59KTtcbmV4cG9ydCBjb25zdCBzZWxlY3RlZEFzdEVsZW1lbnQ6IFJlYWRhYmxlPEFzdEVsZW1lbnQgfCB1bmRlZmluZWQ+ID0gZGVyaXZlZChbcGFnZSwgc2VsZWN0ZWRBc3RFbGVtZW50SWRdLCAoWyRwYWdlLCAkc2VsZWN0ZWRBc3RFbGVtZW50SWRdKSA9PiB7XG4gIGlmICgkc2VsZWN0ZWRBc3RFbGVtZW50SWQpIHtcbiAgICBpZiAoJHNlbGVjdGVkQXN0RWxlbWVudElkID09PSAncm9vdCcpIHJldHVybiBnZXQocm9vdEFzdEVsZW1lbnQpO1xuICAgIHJldHVybiBmaW5kQXN0RWxlbWVudCgkcGFnZS5hc3QsICRzZWxlY3RlZEFzdEVsZW1lbnRJZCk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNBc3RFbGVtZW50KG1heWJlTm9kZTogQXN0Tm9kZSk6IG1heWJlTm9kZSBpcyBBc3RFbGVtZW50IHtcbiAgcmV0dXJuIHR5cGVvZiBtYXliZU5vZGUgIT09ICdzdHJpbmcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEFzdEVsZW1lbnQoYXN0OiBBc3ROb2RlW10sIGlkOiBzdHJpbmcpOiBBc3RFbGVtZW50IHtcbiAgbGV0IGluZGV4ZXMgPSBpZC5zcGxpdChcIi5cIikubWFwKHMgPT4gcGFyc2VJbnQocywgMTApKTtcbiAgbGV0IG5vZGU6IEFzdE5vZGUgPSBhc3RbaW5kZXhlc1swXV0gYXMgQXN0RWxlbWVudFxuICBhc3QgPSBub2RlLmNvbnRlbnQ7XG4gIGZvcihsZXQgaSA9IDE7IGkgPCBpbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbm9kZSA9IGFzdFtpbmRleGVzW2ldXSBhcyBBc3RFbGVtZW50OyBcbiAgICBhc3QgPSBub2RlLmNvbnRlbnQ7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZEFzdEVsZW1lbnRJZChhc3ROb2RlOiBBc3ROb2RlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgbGV0ICRwYWdlID0gZ2V0KHBhZ2UpO1xuICByZXR1cm4gX2ZpbmRBc3RFbGVtZW50SWQoJHBhZ2UuYXN0LCBhc3ROb2RlLCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kQXN0RWxlbWVudElkKGFzdDogQXN0Tm9kZVtdLCBhc3ROb2RlOiBBc3ROb2RlLCBpZDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGFzdC5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdFtpXTtcbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGFzdE5vZGUpIHtcbiAgICAgIHJldHVybiBpZCArIGk7XG4gICAgfSBlbHNlIGlmIChpc0FzdEVsZW1lbnQoY3VycmVudE5vZGUpKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gX2ZpbmRBc3RFbGVtZW50SWQoY3VycmVudE5vZGUuY29udGVudCwgYXN0Tm9kZSwgaWQgKyBpICsgXCIuXCIpO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IGlzQXN0RWxlbWVudCB9IGZyb20gJyRsaWIvc3RvcmVzL3BhZ2UnO1xuICBpbXBvcnQgdHlwZSB7IEFzdE5vZGUgfSBmcm9tICckbGliL3R5cGVzJztcbiAgZXhwb3J0IGxldCBub2RlOiBBc3ROb2RlO1xuPC9zY3JpcHQ+XG5cbnsjaWYgaXNBc3RFbGVtZW50KG5vZGUpfVxuICB7I2lmIG5vZGUudGFnID09PSAnaHRtbF9jb21tZW50J31cbiAgICB7QGh0bWwgXCI8IS0tXCIgKyBub2RlLmNvbnRlbnQgKyBcIi0tPlwifVxuICB7OmVsc2UgaWYgbm9kZS50YWcgPT09ICdlZXhfY29tbWVudCd9XG4gICAge0BodG1sIFwiPCEtLVwiICsgbm9kZS5jb250ZW50ICsgXCItLT5cIn1cbiAgezplbHNlIGlmIG5vZGUudGFnID09PSAnZWV4JyAmJiBub2RlLmNvbnRlbnRbMF0gPT09ICdAaW5uZXJfY29udGVudCd9XG4gICAgPHNsb3QvPlxuICB7OmVsc2UgaWYgbm9kZS5yZW5kZXJlZF9odG1sfVxuICAgIHtAaHRtbCBub2RlLnJlbmRlcmVkX2h0bWx9XG4gIHs6ZWxzZSBpZiBub2RlLmF0dHJzPy5zZWxmQ2xvc2V9XG4gICAgPHN2ZWx0ZTplbGVtZW50IHRoaXM9e25vZGUudGFnfSB7Li4ubm9kZS5hdHRyc30vPlxuICB7OmVsc2V9XG4gICAgPHN2ZWx0ZTplbGVtZW50IHRoaXM9e25vZGUudGFnfSB7Li4ubm9kZS5hdHRyc30+XG4gICAgICB7I2lmIG5vZGUuY29udGVudH1cbiAgICAgICAgeyNlYWNoIG5vZGUuY29udGVudCBhcyBzdWJub2RlLCBpbmRleH1cbiAgICAgICAgICA8c3ZlbHRlOnNlbGYgbm9kZT17c3Vibm9kZX0vPlxuICAgICAgICB7L2VhY2h9XG4gICAgICB7L2lmfVxuICAgIDwvc3ZlbHRlOmVsZW1lbnQ+XG4gIHsvaWZ9XG57OmVsc2V9XG4gIHtub2RlfVxuey9pZn1cbiIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBzZWxlY3RlZEFzdEVsZW1lbnQsIHNsb3RUYXJnZXRFbGVtZW50LCBzZWxlY3RlZEFzdEVsZW1lbnRJZCwgaGlnaGxpZ2h0ZWRBc3RFbGVtZW50LCBpc0FzdEVsZW1lbnQgfSBmcm9tICckbGliL3N0b3Jlcy9wYWdlJztcbiAgaW1wb3J0IHR5cGUgeyBBc3ROb2RlIH0gZnJvbSAnJGxpYi90eXBlcyc7XG4gIGV4cG9ydCBsZXQgbm9kZTogQXN0Tm9kZTtcbiAgZXhwb3J0IGxldCBub2RlSWQ6IHN0cmluZztcbiAgaW1wb3J0IHsgZHJhZ2dlZE9iamVjdCB9IGZyb20gJyRsaWIvc3RvcmVzL2RyYWdBbmREcm9wJztcblxuICBmdW5jdGlvbiBoYW5kbGVEcmFnRW50ZXIoKSB7XG4gICAgaWYgKGlzQXN0RWxlbWVudChub2RlKSAmJiAkZHJhZ2dlZE9iamVjdD8uY2F0ZWdvcnkgPT09ICdiYXNpYycpIHtcbiAgICAgICRzbG90VGFyZ2V0RWxlbWVudCA9IG5vZGU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ0xlYXZlKCkge1xuICAgIGlmIChpc0FzdEVsZW1lbnQobm9kZSkgJiYgJGRyYWdnZWRPYmplY3Q/LmNhdGVnb3J5ID09PSAnYmFzaWMnICYmICRzbG90VGFyZ2V0RWxlbWVudCA9PT0gbm9kZSkge1xuICAgICAgJHNsb3RUYXJnZXRFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU1vdXNlT3ZlcigpIHtcbiAgICBpc0FzdEVsZW1lbnQobm9kZSkgJiYgKCRoaWdobGlnaHRlZEFzdEVsZW1lbnQgPSBub2RlKTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZU91dCgpIHtcbiAgICAkaGlnaGxpZ2h0ZWRBc3RFbGVtZW50ID0gdW5kZWZpbmVkXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAkc2VsZWN0ZWRBc3RFbGVtZW50SWQgPSBub2RlSWRcbiAgfVxuXG4gIC8vIFdoZW4gcmVuZGVyaW5nIHJhdyBodG1sLCB3ZSBjYW4ndCBhZGQgdGhlIHVzdWFsIGNsYXNzZXMgdG8gdGhlIHdyYXBwZXIuXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodENvbnRlbnQod3JhcHBlckRpdjogSFRNTEVsZW1lbnQsIHsgc2VsZWN0ZWQsIGhpZ2hsaWdodGVkIH06IHsgc2VsZWN0ZWQ6IGJvb2xlYW4sIGhpZ2hsaWdodGVkOiBib29sZWFuIH0pIHtcbiAgICBsZXQgc3RhcnRzV2l0aE9uZUNoaWxkcmVuID0gd3JhcHBlckRpdi5jaGlsZHJlbi5sZW5ndGggPT09IDE7XG4gICAgaWYgKHN0YXJ0c1dpdGhPbmVDaGlsZHJlbikge1xuICAgICAgbGV0IGNoaWxkID0gd3JhcHBlckRpdi5jaGlsZHJlblswXTtcbiAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsIFN0cmluZyhzZWxlY3RlZCkpO1xuICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWhpZ2hsaWdodGVkJywgU3RyaW5nKGhpZ2hsaWdodGVkKSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGUoeyBzZWxlY3RlZCwgaGlnaGxpZ2h0ZWQgfTogeyBzZWxlY3RlZDogYm9vbGVhbiwgaGlnaGxpZ2h0ZWQ6IGJvb2xlYW4gfSkge1xuICAgICAgICBpZiAod3JhcHBlckRpdi5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBsZXQgY2hpbGQgPSB3cmFwcGVyRGl2LmNoaWxkcmVuWzBdO1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsIFN0cmluZyhzZWxlY3RlZCkpO1xuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnZGF0YS1oaWdobGlnaHRlZCcsIFN0cmluZyhoaWdobGlnaHRlZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHdyYXBwZXJEaXYuY2hpbGRyZW4ubGVuZ3RoID09PSAwICYmIHdyYXBwZXJEaXYuY2hpbGROb2Rlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB3cmFwcGVyRGl2LnNldEF0dHJpYnV0ZSgnZGF0YS1ub2NoaWxkcmVuJywgXCJ0cnVlXCIpO1xuICAgICAgICAgIHdyYXBwZXJEaXYuc2V0QXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgU3RyaW5nKHNlbGVjdGVkKSk7XG4gICAgICAgICAgd3JhcHBlckRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtaGlnaGxpZ2h0ZWQnLCBTdHJpbmcoaGlnaGxpZ2h0ZWQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydHNXaXRoT25lQ2hpbGRyZW4pIHtcbiAgICAgICAgICBBcnJheS5mcm9tKHdyYXBwZXJEaXYuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgY2hpbGQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaGlnaGxpZ2h0ZWQnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH1cbiAgICB9XG4gIH1cbjwvc2NyaXB0PlxuXG57I2lmIGlzQXN0RWxlbWVudChub2RlKX1cbiAgeyNpZiBub2RlLnRhZyA9PT0gJ2h0bWxfY29tbWVudCd9XG4gICAge0BodG1sIFwiPCEtLVwiICsgbm9kZS5jb250ZW50ICsgXCItLT5cIn1cbiAgezplbHNlIGlmIG5vZGUudGFnID09PSAnZWV4X2NvbW1lbnQnfVxuICAgIHtAaHRtbCBcIjwhLS1cIiArIG5vZGUuY29udGVudCArIFwiLS0+XCJ9XG4gIHs6ZWxzZSBpZiBub2RlLnRhZyA9PT0gJ2VleCcgJiYgbm9kZS5jb250ZW50WzBdID09PSAnQGlubmVyX2NvbnRlbnQnfVxuICAgIDxzbG90Lz5cbiAgezplbHNlIGlmIG5vZGUucmVuZGVyZWRfaHRtbH1cbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImNvbnRlbnRzXCJcbiAgICAgIG9uOm1vdXNlb3ZlcnxzdG9wUHJvcGFnYXRpb249e2hhbmRsZU1vdXNlT3Zlcn1cbiAgICAgIG9uOm1vdXNlb3V0fHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlTW91c2VPdXR9XG4gICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdHxzdG9wUHJvcGFnYXRpb249eygpID0+ICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9IG5vZGVJZH1cbiAgICAgIHVzZTpoaWdobGlnaHRDb250ZW50PXt7c2VsZWN0ZWQ6ICRzZWxlY3RlZEFzdEVsZW1lbnQgPT09IG5vZGUsIGhpZ2hsaWdodGVkOiAkaGlnaGxpZ2h0ZWRBc3RFbGVtZW50ID09PSBub2RlfX1cbiAgICA+e0BodG1sIG5vZGUucmVuZGVyZWRfaHRtbH08L2Rpdj5cbiAgezplbHNlIGlmIG5vZGUuYXR0cnMuc2VsZkNsb3NlfVxuICAgIDxzdmVsdGU6ZWxlbWVudFxuICAgICAgdGhpcz17bm9kZS50YWd9XG4gICAgICB7Li4ubm9kZS5hdHRyc31cbiAgICAgIGRhdGEtc2VsZWN0ZWQ9eyRzZWxlY3RlZEFzdEVsZW1lbnQgPT09IG5vZGV9XG4gICAgICBkYXRhLWhpZ2hsaWdodGVkPXskaGlnaGxpZ2h0ZWRBc3RFbGVtZW50ID09PSBub2RlfVxuICAgICAgZGF0YS1zbG90LXRhcmdldD17JHNsb3RUYXJnZXRFbGVtZW50ID09PSBub2RlICYmICEkc2xvdFRhcmdldEVsZW1lbnQuYXR0cnMuc2VsZkNsb3NlfVxuICAgICAgb246ZHJhZ2VudGVyfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlRHJhZ0VudGVyfVxuICAgICAgb246ZHJhZ2xlYXZlfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlRHJhZ0xlYXZlfVxuICAgICAgb246bW91c2VvdmVyfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlTW91c2VPdmVyfVxuICAgICAgb246bW91c2VvdXR8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVNb3VzZU91dH1cbiAgICAgIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0fHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlQ2xpY2t9IC8+XG4gIHs6ZWxzZX1cbiAgICA8c3ZlbHRlOmVsZW1lbnRcbiAgICAgIHRoaXM9e25vZGUudGFnfVxuICAgICAgey4uLm5vZGUuYXR0cnN9XG4gICAgICBkYXRhLXNlbGVjdGVkPXskc2VsZWN0ZWRBc3RFbGVtZW50ID09PSBub2RlfVxuICAgICAgZGF0YS1oaWdobGlnaHRlZD17JGhpZ2hsaWdodGVkQXN0RWxlbWVudCA9PT0gbm9kZX1cbiAgICAgIGRhdGEtc2xvdC10YXJnZXQ9eyRzbG90VGFyZ2V0RWxlbWVudCA9PT0gbm9kZX1cbiAgICAgIG9uOmRyYWdlbnRlcnxzdG9wUHJvcGFnYXRpb249e2hhbmRsZURyYWdFbnRlcn1cbiAgICAgIG9uOmRyYWdsZWF2ZXxzdG9wUHJvcGFnYXRpb249e2hhbmRsZURyYWdMZWF2ZX1cbiAgICAgIG9uOm1vdXNlb3ZlcnxzdG9wUHJvcGFnYXRpb249e2hhbmRsZU1vdXNlT3Zlcn1cbiAgICAgIG9uOm1vdXNlb3V0fHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlTW91c2VPdXR9XG4gICAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdHxzdG9wUHJvcGFnYXRpb249eygpID0+ICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9IG5vZGVJZH0+XG4gICAgICB7I2VhY2ggbm9kZS5jb250ZW50IGFzIHN1Ym5vZGUsIGluZGV4fVxuICAgICAgICA8c3ZlbHRlOnNlbGYgbm9kZT17c3Vibm9kZX0gbm9kZUlkPVwie25vZGVJZH0ue2luZGV4fVwiLz5cbiAgICAgIHsvZWFjaH1cbiAgICA8L3N2ZWx0ZTplbGVtZW50PlxuICB7L2lmfVxuezplbHNlfVxuICB7bm9kZX1cbnsvaWZ9XG4iLCAiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgaW1wb3J0IHsgQXN0RWxlbWVudCwgQXN0Tm9kZSB9IGZyb20gXCIkbGliL3R5cGVzXCJcbiAgaW1wb3J0IEJyb3dzZXJGcmFtZSBmcm9tICcuL0Jyb3dzZXJGcmFtZS5zdmVsdGUnO1xuICBpbXBvcnQgeyBzZWxlY3RlZEFzdEVsZW1lbnRJZCB9IGZyb20gXCIkbGliL3N0b3Jlcy9wYWdlXCI7XG4gIGltcG9ydCB7IGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSB9IGZyb20gXCIkbGliL3N0b3Jlcy9jdXJyZW50Q29tcG9uZW50Q2F0ZWdvcnlcIjtcbiAgaW1wb3J0IHsgcGFnZSwgc2xvdFRhcmdldEVsZW1lbnQgfSBmcm9tIFwiJGxpYi9zdG9yZXMvcGFnZVwiO1xuICBpbXBvcnQgeyBkcmFnZ2VkT2JqZWN0IH0gZnJvbSBcIiRsaWIvc3RvcmVzL2RyYWdBbmREcm9wXCI7XG5cbiAgZXhwb3J0IGxldCBsaXZlO1xuICBsZXQgaXNEcmFnZ2luZ092ZXIgPSBmYWxzZTtcblxuICBhc3luYyBmdW5jdGlvbiBoYW5kbGVEcmFnRHJvcChlOiBEcmFnRXZlbnQpIHtcbiAgICBsZXQgeyB0YXJnZXQgfSA9IGU7XG4gICAgJGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSA9IG51bGw7XG4gICAgaWYgKCEkZHJhZ2dlZE9iamVjdCkgcmV0dXJuO1xuICAgIGlmICgkZHJhZ2dlZE9iamVjdC5jYXRlZ29yeSA9PT0gJ2Jhc2ljJykge1xuICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSByZXR1cm47XG4gICAgICBpZiAodGFyZ2V0LmlkID09PSAnZmFrZS1icm93c2VyLWNvbnRlbnQnKSByZXR1cm47XG4gICAgICBpZiAoISRzbG90VGFyZ2V0RWxlbWVudCkgcmV0dXJuO1xuICAgICAgaWYgKCRzbG90VGFyZ2V0RWxlbWVudC5hdHRycy5zZWxmQ2xvc2UpIHJldHVybjtcbiAgICAgIGFkZEJhc2ljQ29tcG9uZW50VG9UYXJnZXQoJHNsb3RUYXJnZXRFbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJyZW5kZXJfY29tcG9uZW50X2luX3BhZ2VcIiwgeyBjb21wb25lbnRfaWQ6ICRkcmFnZ2VkT2JqZWN0LmlkLCBwYWdlX2lkOiAkcGFnZS5pZCB9LCAoe2FzdH06IHsgYXN0OiBBc3ROb2RlW10gfSkgPT4ge1xuICAgICAgICAvLyBUaGlzIGFwcGVuZHMgYXQgdGhlIGVuZC4gV2UgbWlnaHQgd2FudCBhdCB0aGUgYmVnaW5uaW5nLCBvciBpbiBhIHNwZWNpZmljIHBvc2l0aW9uXG4gICAgICAgIGxpdmUucHVzaEV2ZW50KFwidXBkYXRlX3BhZ2VfYXN0XCIsIHsgaWQ6ICRwYWdlLmlkLCBhc3Q6IFsuLi4kcGFnZS5hc3QsIC4uLmFzdF0gfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaXNEcmFnZ2luZ092ZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGFkZEJhc2ljQ29tcG9uZW50VG9UYXJnZXQoYXN0RWxlbWVudDogQXN0RWxlbWVudCkge1xuICAgIGlmICghJGRyYWdnZWRPYmplY3QpIHJldHVybjtcbiAgICBsZXQgY29tcG9uZW50RGVmaW5pdGlvbiA9ICRkcmFnZ2VkT2JqZWN0O1xuICAgICRkcmFnZ2VkT2JqZWN0ID0gbnVsbDtcbiAgICBsZXQgdGFyZ2V0Tm9kZSA9IGFzdEVsZW1lbnQ7XG4gICAgbGl2ZS5wdXNoRXZlbnQoXCJyZW5kZXJfY29tcG9uZW50X2luX3BhZ2VcIiwgeyBjb21wb25lbnRfaWQ6IGNvbXBvbmVudERlZmluaXRpb24uaWQsIHBhZ2VfaWQ6ICRwYWdlLmlkIH0sICh7YXN0fTogeyBhc3Q6IEFzdE5vZGVbXSB9KSA9PiB7XG4gICAgICB0YXJnZXROb2RlPy5jb250ZW50LnB1c2goLi4uYXN0KTtcbiAgICAgICRzbG90VGFyZ2V0RWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgIGxpdmUucHVzaEV2ZW50KFwidXBkYXRlX3BhZ2VfYXN0XCIsIHsgaWQ6ICRwYWdlLmlkLCBhc3Q6ICRwYWdlLmFzdCB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYWdPdmVyKCkge1xuICAgIGlzRHJhZ2dpbmdPdmVyID0gdHJ1ZTtcbiAgfVxuPC9zY3JpcHQ+XG5cbjxkaXYgY2xhc3M9XCJmbGV4LTEgcHgtOCBwYi00IGZsZXggbWF4LWgtZnVsbFwiIGRhdGEtdGVzdC1pZD1cIm1haW5cIj5cbiAgeyNpZiAkcGFnZX1cbiAgICA8QnJvd3NlckZyYW1lIHBhZ2U9eyRwYWdlfT5cbiAgICAgIDxkaXYgXG4gICAgICAgIG9uOmRyb3B8cHJldmVudERlZmF1bHQ9e2hhbmRsZURyYWdEcm9wfVxuICAgICAgICBvbjpkcmFnb3ZlcnxwcmV2ZW50RGVmYXVsdD17ZHJhZ092ZXJ9XG4gICAgICAgIHJvbGU9XCJkb2N1bWVudFwiXG4gICAgICAgIHN0eWxlPVwiLS1vdXRsaW5lZC1pZDogdGl0bGUtMVwiXG4gICAgICAgIGlkPVwiZmFrZS1icm93c2VyLWNvbnRlbnRcIlxuICAgICAgICBjbGFzcz1cImJnLXdoaXRlIHJvdW5kZWQtYi14bCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW4gZmxleC0xIHtpc0RyYWdnaW5nT3ZlciAmJiAnYm9yZGVyLWRhc2hlZCBib3JkZXItYmx1ZS01MDAgYm9yZGVyLTInfVwiIFxuICAgICAgICBkYXRhLXRlc3QtaWQ9XCJicm93c2VyLWNvbnRlbnRcIj5cbiAgICAgICAgPGRpdiBpZD1cInBhZ2Utd3JhcHBlclwiIGNsYXNzPVwicC0xIG0tMVwiIGRhdGEtc2VsZWN0ZWQ9eyRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9PT0gJ3Jvb3QnfT5cbiAgICAgICAgICA8cGFnZS13cmFwcGVyPjwvcGFnZS13cmFwcGVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvQnJvd3NlckZyYW1lPlxuICB7L2lmfVxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgLyogOmdsb2JhbChbZGF0YS1zZWxlY3RlZD1cInRydWVcIl0sIFtkYXRhLWhpZ2hsaWdodGVkPVwidHJ1ZVwiXSkge1xuICAgIG91dGxpbmUtY29sb3I6ICMwNmI2ZDQ7IFxuICAgIG91dGxpbmUtd2lkdGg6IDJweDtcbiAgICBvdXRsaW5lLXN0eWxlOiBkYXNoZWQ7ICAgIFxuICB9ICovXG4gIDpnbG9iYWwoLmNvbnRlbnRzW2RhdGEtbm9jaGlsZHJlbj1cInRydWVcIl0sIC5jb250ZW50c1tkYXRhLW5vY2hpbGRyZW49XCJ0cnVlXCJdKSB7XG4gICAgLyogSW4gdGhlIHNwZWNpZmljIGNhc2Ugb2YgYW4gZWxlbWVudCBjb250YWluaW5nIG9ubHkgYW4gRUVYIGV4cHJlc3Npb24gdGhhdCBnZW5lcmF0ZXMgbm8gY2hpbGRyZW4gKG9ubHkgYSB0ZXh0IG5vZGUpLFxuICAgIHRoZXJlIGlzIG5vIGNoaWxkIG5vZGUgdG8gd2hpY2ggYXBwbHkgdGhlIHN0eWxlcywgc28gd2UgaGF2ZSB0byBhcHBseSB0aGVtIHRvIHRoZSB3cmFwcGVyLCBzbyB3ZSBoYXZlIHRvIG92ZXJ3cml0ZSB0aGVcbiAgICBkaXNwbGF5OiBjb250ZW50cyBmb3IgdGhlIHN0eWxlcyB0byBhcHBseSAqL1xuICAgIGRpc3BsYXk6IGlubGluZTsgXG4gIH0gIFxuICA6Z2xvYmFsKFtkYXRhLXNsb3QtdGFyZ2V0PVwidHJ1ZVwiXSkge1xuICAgIG91dGxpbmUtY29sb3I6IHJlZDsgXG4gICAgb3V0bGluZS13aWR0aDogMnB4O1xuICAgIG91dGxpbmUtc3R5bGU6IGRhc2hlZDsgICAgXG4gIH0gIFxuPC9zdHlsZT5cbiIsICJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IFdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcblxuZXhwb3J0IGNvbnN0IHBhZ2VTdHlsZXNoZWV0OiBXcml0YWJsZTxzdHJpbmc+ID0gd3JpdGFibGUobnVsbClcbiIsICJpbXBvcnQgeyB3cml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IFdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcblxuZXhwb3J0IGNvbnN0IHNpdGVTdHlsZXNoZWV0OiBXcml0YWJsZTxzdHJpbmc+ID0gd3JpdGFibGUobnVsbClcbiIsICI8c3ZlbHRlOm9wdGlvbnMgY3VzdG9tRWxlbWVudD17eyB0YWc6ICdwYWdlLXdyYXBwZXInLCBzaGFkb3c6ICdvcGVuJywgY3VzdG9tRWxlbWVudDogdHJ1ZSB9fSAvPlxuXG48c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgTGF5b3V0QXN0Tm9kZSBmcm9tICcuL0xheW91dEFzdE5vZGUuc3ZlbHRlJztcbiAgaW1wb3J0IFBhZ2VBc3ROb2RlIGZyb20gJy4vUGFnZUFzdE5vZGUuc3ZlbHRlJztcbiAgaW1wb3J0IHsgc2VsZWN0ZWRBc3RFbGVtZW50SWQgfSBmcm9tIFwiJGxpYi9zdG9yZXMvcGFnZVwiO1xuICBpbXBvcnQgeyBwYWdlIH0gZnJvbSBcIiRsaWIvc3RvcmVzL3BhZ2VcIjtcbiAgaW1wb3J0IHsgcGFnZVN0eWxlc2hlZXQgYXMgcGFnZVN0eWxlc2hlZXRTdG9yZSB9IGZyb20gXCIkbGliL3N0b3Jlcy9wYWdlU3R5bGVzaGVldFwiO1xuICBpbXBvcnQgeyBzaXRlU3R5bGVzaGVldCBhcyBzaXRlU3R5bGVzaGVldFN0b3JlIH0gZnJvbSBcIiRsaWIvc3RvcmVzL3NpdGVTdHlsZXNoZWV0XCI7XG4gIGxldCBzcGFuU2l0ZVN0eWxlc2hlZXQ6IEhUTUxTcGFuRWxlbWVudDtcbiAgbGV0IHNwYW5QYWdlU3R5bGVzaGVldDogSFRNTFNwYW5FbGVtZW50O1xuICAkOiB7XG4gICAgaWYgKHNwYW5TaXRlU3R5bGVzaGVldCkge1xuICAgICAgc3BhblNpdGVTdHlsZXNoZWV0LmlubmVySFRNTCA9ICcnO1xuICAgICAgbGV0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGVFbC5pbm5lckhUTUwgPSAkc2l0ZVN0eWxlc2hlZXRTdG9yZTtcbiAgICAgIHNwYW5TaXRlU3R5bGVzaGVldC5hcHBlbmQoc3R5bGVFbCk7XG4gICAgfVxuXG4gICAgaWYgKHNwYW5QYWdlU3R5bGVzaGVldCkge1xuICAgICAgc3BhblBhZ2VTdHlsZXNoZWV0LmlubmVySFRNTCA9ICcnO1xuICAgICAgbGV0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgc3R5bGVFbC5pbm5lckhUTUwgPSAkcGFnZVN0eWxlc2hlZXRTdG9yZTtcbiAgICAgIHNwYW5QYWdlU3R5bGVzaGVldC5hcHBlbmQoc3R5bGVFbCk7XG4gICAgfVxuICB9XG48L3NjcmlwdD5cblxuPHNwYW4gaWQ9XCJzaXRlLXN0eWxlc2hlZXQtdGFyZ2V0XCIgYmluZDp0aGlzPXtzcGFuU2l0ZVN0eWxlc2hlZXR9Pjwvc3Bhbj5cbjxzcGFuIGlkPVwicGFnZS1zdHlsZXNoZWV0LXRhcmdldFwiIGJpbmQ6dGhpcz17c3BhblBhZ2VTdHlsZXNoZWV0fT48L3NwYW4+XG5cbnsjZWFjaCAkcGFnZS5sYXlvdXQuYXN0IGFzIGxheW91dEFzdE5vZGV9XG4gIDxMYXlvdXRBc3ROb2RlIG5vZGU9e2xheW91dEFzdE5vZGV9PlxuICAgIHsjZWFjaCAkcGFnZS5hc3QgYXMgYXN0Tm9kZSwgaW5kZXh9XG4gICAgICA8UGFnZUFzdE5vZGUgbm9kZT17YXN0Tm9kZX0gbm9kZUlkPXtTdHJpbmcoaW5kZXgpfS8+XG4gICAgey9lYWNofVxuICA8L0xheW91dEFzdE5vZGU+XG57L2VhY2h9XG5cbjxzdHlsZT5cbiAgICA6Z2xvYmFsKFtkYXRhLXNlbGVjdGVkPVwidHJ1ZVwiXSwgW2RhdGEtaGlnaGxpZ2h0ZWQ9XCJ0cnVlXCJdKSB7XG4gICAgICBvdXRsaW5lLWNvbG9yOiAjMDZiNmQ0O1xuICAgICAgb3V0bGluZS13aWR0aDogMnB4O1xuICAgICAgb3V0bGluZS1zdHlsZTogZGFzaGVkO1xuICAgIH1cbjwvc3R5bGU+XG4iLCAiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJztcbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbjwvc2NyaXB0PlxuXG48ZGl2IGNsYXNzPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIHJvdW5kZWQtZnVsbCBiZy1zbGF0ZS03MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIHB4LTMgcHItMCBtLTEgbGVhZGluZy00XCI+XG4gIDxzbG90Pjwvc2xvdD5cbiAgPGJ1dHRvbiBcbiAgICBjbGFzcz1cInAtMiByb3VuZGVkLWZ1bGwgaW5saW5lLWJsb2NrIGJnLXNsYXRlLTcwMCB0ZXh0LXdoaXRlIGhvdmVyOnRleHQtYmx1ZS00MDAgYWN0aXZlOnRleHQtYmx1ZS01MDBcIiBcbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBvbjpjbGlja3xwcmV2ZW50RGVmYXVsdD17KCkgPT4gZGlzcGF0Y2goJ2RlbGV0ZScpfT5cbiAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJ3LTMgaC0zXCI+XG4gICAgICAgIDxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTUuNDcgNS40N2EuNzUuNzUgMCAwIDEgMS4wNiAwTDEyIDEwLjk0bDUuNDctNS40N2EuNzUuNzUgMCAxIDEgMS4wNiAxLjA2TDEzLjA2IDEybDUuNDcgNS40N2EuNzUuNzUgMCAxIDEtMS4wNiAxLjA2TDEyIDEzLjA2bC01LjQ3IDUuNDdhLjc1Ljc1IDAgMCAxLTEuMDYtMS4wNkwxMC45NCAxMiA1LjQ3IDYuNTNhLjc1Ljc1IDAgMCAxIDAtMS4wNlpcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuPC9kaXY+IiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCB0eXBlIHsgQXN0RWxlbWVudCwgQXN0Tm9kZSB9IGZyb20gJyRsaWIvdHlwZXMnO1xuICBpbXBvcnQgeyBoaWdobGlnaHRlZEFzdEVsZW1lbnQsIGZpbmRBc3RFbGVtZW50SWQsIHNlbGVjdGVkQXN0RWxlbWVudElkLCBpc0FzdEVsZW1lbnQgfSBmcm9tICckbGliL3N0b3Jlcy9wYWdlJztcbiAgaW1wb3J0IENvZGVFZGl0b3IgZnJvbSAnLi9Db2RlRWRpdG9yLnN2ZWx0ZSc7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbiAgZXhwb3J0IGxldCB2YWx1ZTogc3RyaW5nIHwgbnVsbCA9ICcnO1xuICBleHBvcnQgbGV0IGFzdE5vZGVzOiBBc3ROb2RlW10gfCBudWxsID0gbnVsbDtcbiAgZXhwb3J0IGxldCBjbGVhck9uVXBkYXRlID0gZmFsc2U7XG4gIGV4cG9ydCBsZXQgZXhwYW5kZWQgPSB0cnVlO1xuICBleHBvcnQgbGV0IHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnJztcbiAgZXhwb3J0IGxldCBsYXJnZTogYm9vbGVhbiA9IGZhbHNlO1xuICAkOiBhc3RFbGVtZW50cyA9IChhc3ROb2RlcyB8fCBbXSkuZmlsdGVyKGlzQXN0RWxlbWVudClcblxuICBmdW5jdGlvbiBoaWdobGlnaHRBc3RFbGVtZW50KGFzdEVsZW1lbnQ6IEFzdEVsZW1lbnQpIHtcbiAgICAkaGlnaGxpZ2h0ZWRBc3RFbGVtZW50ID0gYXN0RWxlbWVudDtcbiAgfVxuICBmdW5jdGlvbiB1bmhpZ2hsaWdodEFzdEVsZW1lbnQoKSB7XG4gICAgJGhpZ2hsaWdodGVkQXN0RWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgfVxuICBsZXQgaW50ZXJuYWxWYWx1ZTogc3RyaW5nIHwgbnVsbCA9IGFzdEVsZW1lbnRzID8gbnVsbCA6IHZhbHVlO1xuICAkOiB7XG4gICAgaWYgKGFzdE5vZGVzPy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxldCBmaXJzdCA9IGFzdE5vZGVzWzBdO1xuICAgICAgaWYgKCFpc0FzdEVsZW1lbnQoZmlyc3QpKSB7XG4gICAgICAgIGludGVybmFsVmFsdWUgPSBmaXJzdDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFzdE5vZGVzKSB7XG4gICAgICBpbnRlcm5hbFZhbHVlID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVLZXlkb3duKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZighKGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkpIHJldHVybjtcbiAgICBsZXQgdGV4dCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiB0ZXh0ICYmIHRleHQubGVuZ3RoID4gMCAmJiB0ZXh0ICE9PSB2YWx1ZSkge1xuICAgICAgZGlzcGF0Y2goJ3VwZGF0ZScsIHRleHQpO1xuICAgICAgaWYgKGNsZWFyT25VcGRhdGUpIHtcbiAgICAgICAgaW50ZXJuYWxWYWx1ZSA9IG51bGw7XG4gICAgICAgIGUudGFyZ2V0LnZhbHVlID0gJyc7XG4gICAgICB9ICAgICAgIFxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVUZXh0Q2hhbmdlKGU6IEV2ZW50KSB7XG4gICAgaWYgKChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgfHwgZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSkge1xuICAgICAgZGlzcGF0Y2goJ3RleHRDaGFuZ2UnLCBlLnRhcmdldC52YWx1ZSk7ICAgIFxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZWxlY3QoYXN0RWxlbWVudDogQXN0RWxlbWVudCkge1xuICAgIGxldCBpZCA9IGZpbmRBc3RFbGVtZW50SWQoYXN0RWxlbWVudCk7XG4gICAgJHNlbGVjdGVkQXN0RWxlbWVudElkID0gaWQ7XG4gIH1cbiAgZnVuY3Rpb24gbW92ZUFzdEVsZW1lbnQobW92ZW1lbnQ6IG51bWJlciwgYXN0RWxlbWVudDogQXN0RWxlbWVudCkge1xuICAgIGlmICghYXN0Tm9kZXMpIHJldHVybjtcbiAgICBsZXQgYXN0Tm9kZXNDb3B5ID0gQXJyYXkuZnJvbShhc3ROb2Rlcyk7XG4gICAgbGV0IGluZGV4ID0gYXN0Tm9kZXNDb3B5LmluZGV4T2YoYXN0RWxlbWVudCk7XG4gICAgYXN0Tm9kZXNDb3B5LnNwbGljZShpbmRleCwgMSk7XG4gICAgYXN0Tm9kZXNDb3B5LnNwbGljZShpbmRleCArIG1vdmVtZW50LCAwLCBhc3RFbGVtZW50KTtcbiAgICBkaXNwYXRjaCgnbm9kZXNDaGFuZ2UnLCBhc3ROb2Rlc0NvcHkpO1xuICB9XG48L3NjcmlwdD5cblxuPHNlY3Rpb24gY2xhc3M9XCJwLTQgYm9yZGVyLWIgYm9yZGVyLWItZ3JheS0xMDAgYm9yZGVyLXNvbGlkXCI+XG4gIDxoZWFkZXIgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciB0ZXh0LXNtIG1iLTIgZm9udC1tZWRpdW1cIj5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInctZnVsbCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLXgtMSBwLTEgaG92ZXI6dGV4dC1ibHVlLTcwMCBhY3RpdmU6dGV4dC1ibHVlLTkwMCBncm91cFwiIG9uOmNsaWNrPXsoKSA9PiBleHBhbmRlZCA9ICFleHBhbmRlZH0+XG4gICAgICA8c3Bhbj48c2xvdCBuYW1lPVwiaGVhZGluZ1wiIC8+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ7ZXhwYW5kZWQgPyAnJyA6ICcgWyZfcGF0aF06b3JpZ2luLWNlbnRlciBbJl9wYXRoXTpyb3RhdGUtMTgwJ31cIj5cbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cInctNSBoLTUgc3Ryb2tlLXNsYXRlLTUwMCBmaWxsLXNsYXRlLTUwMCBncm91cC1ob3ZlcjpzdHJva2UtY3VycmVudCBncm91cC1ob3ZlcjpmaWxsLWN1cnJlbnRcIj5cbiAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0xMS40NyA3LjcyYS43NS43NSAwIDAgMSAxLjA2IDBsNy41IDcuNWEuNzUuNzUgMCAxIDEtMS4wNiAxLjA2TDEyIDkuMzFsLTYuOTcgNi45N2EuNzUuNzUgMCAwIDEtMS4wNi0xLjA2bDcuNS03LjVaXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICAgIDwhLS0gQ2xhc3NlcyAtLT5cbiAgPC9oZWFkZXI+XG4gIHsjaWYgJCRzbG90c1sndmFsdWUnXX1cbiAgICA8c2xvdCBuYW1lPVwiaW5wdXRcIj5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHktMSBweC0yIGJnLWdyYXktMTAwIGJvcmRlci1ncmF5LTEwMCByb3VuZGVkLW1kIGxlYWRpbmctNiB0ZXh0LXNtXCJcbiAgICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgICB2YWx1ZT17aW50ZXJuYWxWYWx1ZX0gXG4gICAgICAgIG9uOmtleWRvd249e2hhbmRsZUtleWRvd259XG4gICAgICAgIG9uOmNoYW5nZT17aGFuZGxlVGV4dENoYW5nZX0+XG4gICAgPC9zbG90PlxuICAgIDxkaXYgY2xhc3M9XCJwdC0zXCI+PHNsb3QgbmFtZT1cInZhbHVlXCIvPjwvZGl2PlxuICB7OmVsc2V9XG4gICAgeyNpZiBleHBhbmRlZH1cbiAgICAgIDxzbG90IG5hbWU9XCJpbnB1dFwiPlxuICAgICAgICB7I2lmIGludGVybmFsVmFsdWV9XG4gICAgICAgICAgeyNpZiBsYXJnZX1cbiAgICAgICAgICAgIDwhLS0gPENvZGVFZGl0b3IgdmFsdWU9e2ludGVybmFsVmFsdWV9IG9uOmNoYW5nZT17KGUpID0+IGRpc3BhdGNoKCd0ZXh0Q2hhbmdlJywgZS5kZXRhaWwpfS8+IC0tPlxuICAgICAgICAgICAgPHRleHRhcmVhIFxuICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHktMSBweC0yIGJnLXNsYXRlLTEwMCBib3JkZXItc2xhdGUtMTAwIHJvdW5kZWQtbWQgbGVhZGluZy02IHRleHQtc21cIlxuICAgICAgICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgICAgICAgdmFsdWU9e2ludGVybmFsVmFsdWV9IFxuICAgICAgICAgICAgb246a2V5ZG93bj17aGFuZGxlS2V5ZG93bn1cbiAgICAgICAgICAgIG9uOmNoYW5nZT17aGFuZGxlVGV4dENoYW5nZX0+PC90ZXh0YXJlYT5cbiAgICAgICAgICB7OmVsc2V9XG4gICAgICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB5LTEgcHgtMiBiZy1zbGF0ZS0xMDAgYm9yZGVyLXNsYXRlLTEwMCByb3VuZGVkLW1kIGxlYWRpbmctNiB0ZXh0LXNtXCJcbiAgICAgICAgICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICB2YWx1ZT17aW50ZXJuYWxWYWx1ZX0gXG4gICAgICAgICAgICAgIG9uOmtleWRvd249e2hhbmRsZUtleWRvd259XG4gICAgICAgICAgICAgIG9uOmNoYW5nZT17aGFuZGxlVGV4dENoYW5nZX0+XG4gICAgICAgICAgey9pZn1cbiAgICAgICAgICB7I2lmICQkc2xvdHNbJ3ZhbHVlJ119XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHQtM1wiPjxzbG90IG5hbWU9XCJ2YWx1ZVwiLz48L2Rpdj5cbiAgICAgICAgICB7L2lmfVxuICAgICAgICB7OmVsc2UgaWYgYXN0RWxlbWVudHN9XG4gICAgICAgICAgeyNlYWNoIGFzdEVsZW1lbnRzIGFzIGFzdEVsZW1lbnQsIGlkeH1cbiAgICAgICAgICAgIDwhLS0gc3ZlbHRlLWlnbm9yZSBhMTF5LW5vLXN0YXRpYy1lbGVtZW50LWludGVyYWN0aW9ucyAtLT5cbiAgICAgICAgICAgIDxkaXYgb246bW91c2VlbnRlcj17KCkgPT4gaGlnaGxpZ2h0QXN0RWxlbWVudChhc3RFbGVtZW50KX0gb246bW91c2VsZWF2ZT17KCkgPT4gdW5oaWdobGlnaHRBc3RFbGVtZW50KCl9IGNsYXNzPVwibXQtNVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+PGNvZGU+Jmx0O3thc3RFbGVtZW50LnRhZ30mZ3Q7PC9jb2RlPiBlbGVtZW50PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC14LTAuNSBweC0yIHB5LTEgYmctY3lhbi0zMDAgZm9udC1ib2xkIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGUgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyBob3ZlcjpiZy1jeWFuLTkwMCBhY3RpdmU6YmctY3lhbi03MDAgaG92ZXI6dGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICBvbjpjbGljaz17KCkgPT4gc2VsZWN0KGFzdEVsZW1lbnQpfT5cbiAgICAgICAgICAgICAgICAgIEVkaXRcbiAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJ3LTMgaC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjEuNzMxIDIuMjY5YTIuNjI1IDIuNjI1IDAgMCAwLTMuNzEyIDBsLTEuMTU3IDEuMTU3IDMuNzEyIDMuNzEyIDEuMTU3LTEuMTU3YTIuNjI1IDIuNjI1IDAgMCAwIDAtMy43MTJaTTE5LjUxMyA4LjE5OWwtMy43MTItMy43MTItOC40IDguNGE1LjI1IDUuMjUgMCAwIDAtMS4zMiAyLjIxNGwtLjggMi42ODVhLjc1Ljc1IDAgMCAwIC45MzMuOTMzbDIuNjg1LS44YTUuMjUgNS4yNSAwIDAgMCAyLjIxNC0xLjMybDguNC04LjRaXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk01LjI1IDUuMjVhMyAzIDAgMCAwLTMgM3YxMC41YTMgMyAwIDAgMCAzIDNoMTAuNWEzIDMgMCAwIDAgMy0zVjEzLjVhLjc1Ljc1IDAgMCAwLTEuNSAwdjUuMjVhMS41IDEuNSAwIDAgMS0xLjUgMS41SDUuMjVhMS41IDEuNSAwIDAgMS0xLjUtMS41VjguMjVhMS41IDEuNSAwIDAgMSAxLjUtMS41aDUuMjVhLjc1Ljc1IDAgMCAwIDAtMS41SDUuMjVaXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXQtMiBncmlkIGdyaWQtY29scy0yIGdhcC14LTFcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAteC0wLjUgcHgtMS41IHB5LTEgYmctY3lhbi04MDAgZm9udC1ib2xkIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGUgcm91bmRlZCBob3ZlcjpiZy1jeWFuLTkwMCBhY3RpdmU6YmctY3lhbi03MDAgZGlzYWJsZWQ6YmctZ3JheS0zMDAgZGlzYWJsZWQ6Y3Vyc29yLW5vdC1hbGxvd2VkIHRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lkeCA9PT0gMH1cbiAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXsoKSA9PiBtb3ZlQXN0RWxlbWVudCgtMSwgYXN0RWxlbWVudCl9PlxuICAgICAgICAgICAgICAgICAgPHNwYW4+TW92ZSB1cDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJ3LTMgaC0zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBkPVwiTTExLjQ3IDIuNDdhLjc1Ljc1IDAgMCAxIDEuMDYgMGw3LjUgNy41YS43NS43NSAwIDEgMS0xLjA2IDEuMDZsLTYuMjItNi4yMlYyMWEuNzUuNzUgMCAwIDEtMS41IDBWNC44MWwtNi4yMiA2LjIyYS43NS43NSAwIDEgMS0xLjA2LTEuMDZsNy41LTcuNVpcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC14LTAuNSBweC0xLjUgcHktMSBiZy1jeWFuLTgwMCBmb250LWJvbGQgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZSByb3VuZGVkIGhvdmVyOmJnLWN5YW4tOTAwIGFjdGl2ZTpiZy1jeWFuLTcwMCBkaXNhYmxlZDpiZy1ncmF5LTMwMCBkaXNhYmxlZDpjdXJzb3Itbm90LWFsbG93ZWQgdGV4dC13aGl0ZVwiXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aWR4ID09PSBhc3RFbGVtZW50cy5sZW5ndGggLSAxfVxuICAgICAgICAgICAgICAgICAgb246Y2xpY2s9eygpID0+IG1vdmVBc3RFbGVtZW50KDEsIGFzdEVsZW1lbnQpfT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuID5Nb3ZlIGRvd248L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIGNsYXNzPVwidy0zIGgtM1wiPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0xMiAyLjI1YS43NS43NSAwIDAgMSAuNzUuNzV2MTYuMTlsNi4yMi02LjIyYS43NS43NSAwIDEgMSAxLjA2IDEuMDZsLTcuNSA3LjVhLjc1Ljc1IDAgMCAxLTEuMDYgMGwtNy41LTcuNWEuNzUuNzUgMCAxIDEgMS4wNi0xLjA2bDYuMjIgNi4yMlYzYS43NS43NSAwIDAgMSAuNzUtLjc1WlwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+ICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgey9lYWNofVxuICAgICAgICB7L2lmfVxuICAgICAgPC9zbG90PlxuICAgIHsvaWZ9XG4gIHsvaWZ9XG48L3NlY3Rpb24+IiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdGltcG9ydCBQaWxsIGZyb20gJyRsaWIvY29tcG9uZW50cy9QaWxsLnN2ZWx0ZSc7XG5cdGltcG9ydCBTaWRlYmFyU2VjdGlvbiBmcm9tICckbGliL2NvbXBvbmVudHMvU2lkZWJhclNlY3Rpb24uc3ZlbHRlJztcbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IHsgZHJhZ2dlZE9iamVjdCB9IGZyb20gJyRsaWIvc3RvcmVzL2RyYWdBbmREcm9wJztcbiAgaW1wb3J0IHsgcGFnZSwgc2VsZWN0ZWRBc3RFbGVtZW50LCBzZWxlY3RlZEFzdEVsZW1lbnRJZCwgZmluZEFzdEVsZW1lbnQsIGlzQXN0RWxlbWVudCB9IGZyb20gJyRsaWIvc3RvcmVzL3BhZ2UnO1xuICBpbXBvcnQgdHlwZSB7IEFzdE5vZGUgfSBmcm9tICckbGliL3R5cGVzJztcbiAgZXhwb3J0IGxldCBsaXZlO1xuXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgbGV0IGNsYXNzTGlzdDogc3RyaW5nW107XG4gICQ6IHtcbiAgICBsZXQgY2xhc3NBdHRyID0gJHNlbGVjdGVkQXN0RWxlbWVudD8uYXR0cnM/LmNsYXNzO1xuICAgIGNsYXNzTGlzdCA9IGNsYXNzQXR0ciA/IGNsYXNzQXR0ci5zcGxpdChcIiBcIikuZmlsdGVyKGUgPT4gZS50cmltKCkubGVuZ3RoID4gMCkgOiBbXVxuICB9XG4gICQ6IGVkaXRhYmxlQXR0cnMgPSBPYmplY3QuZW50cmllcygkc2VsZWN0ZWRBc3RFbGVtZW50Py5hdHRycyB8fCB7fSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoW2ssIF9dKSA9PiBrICE9PSAnY2xhc3MnICYmIGsgIT09ICdzZWxmQ2xvc2UnICYmICEvZGF0YS0vLnRlc3QoaykpXG4gICQ6IHNpZGViYXJUaXRsZSA9ICRzZWxlY3RlZEFzdEVsZW1lbnQ/LnRhZztcbiAgJDogaXNSb290Tm9kZSA9ICEhJHNlbGVjdGVkQXN0RWxlbWVudElkICYmICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9PT0gJ3Jvb3QnO1xuICAkOiBhdHRyaWJ1dGVzRWRpdGFibGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50Py50YWcgIT09ICdlZXgnO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFkZENsYXNzKHsgZGV0YWlsOiBuZXdDbGFzcyB9OiBDdXN0b21FdmVudDxzdHJpbmc+KSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlKSB7XG4gICAgICBub2RlLmF0dHJzLmNsYXNzID0gbm9kZS5hdHRycy5jbGFzcyA/IGAke25vZGUuYXR0cnMuY2xhc3N9ICR7bmV3Q2xhc3N9YCA6IG5ld0NsYXNzO1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcmVudE5vZGVJZCgpIHtcbiAgICBpZiAoJHNlbGVjdGVkQXN0RWxlbWVudElkKSB7XG4gICAgICBsZXQgcGFydHMgPSAkc2VsZWN0ZWRBc3RFbGVtZW50SWQuc3BsaXQoXCIuXCIpO1xuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuICdyb290JztcbiAgICAgIHJldHVybiBwYXJ0cy5zbGljZSgwLCAtMSkuam9pbihcIi5cIilcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0UGFyZW50Tm9kZSgpIHtcbiAgICBsZXQgcGFyZW50SWQgPSBwYXJlbnROb2RlSWQoKTtcbiAgICBpZiAocGFyZW50SWQpIHtcbiAgICAgICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9IHBhcmVudElkO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlKSB7XG4gICAgICBsZXQgbmV3Q2xhc3MgPSBub2RlLmF0dHJzLmNsYXNzLnNwbGl0KFwiIFwiKS5maWx0ZXIoYyA9PiBjICE9PSBjbGFzc05hbWUpLmpvaW4oXCIgXCIpO1xuICAgICAgbm9kZS5hdHRycy5jbGFzcyA9IG5ld0NsYXNzO1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH1cbiAgfSAgXG5cbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGV4dChlOiBDdXN0b21FdmVudDxzdHJpbmc+KSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlICYmIGlzQXN0RWxlbWVudChub2RlKSkge1xuICAgICAgbm9kZS5jb250ZW50ID0gW2UuZGV0YWlsXVxuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShhdHRyTmFtZTogc3RyaW5nLCBlOiBDdXN0b21FdmVudDxzdHJpbmc+KSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlICYmIGlzQXN0RWxlbWVudChub2RlKSkge1xuICAgICAgbm9kZS5hdHRyc1thdHRyTmFtZV0gPSBlLmRldGFpbDtcbiAgICAgIGxpdmUucHVzaEV2ZW50KFwidXBkYXRlX3BhZ2VfYXN0XCIsIHsgaWQ6ICRwYWdlLmlkLCBhc3Q6ICRwYWdlLmFzdCB9KTsgICAgIFxuICAgIH0gICAgXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWxldGVDb21wb25lbnQoKSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmICghbm9kZSkgcmV0dXJuO1xuICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgY29tcG9uZW50PycpKSB7XG4gICAgICBsZXQgcGFyZW50SWQgPSBwYXJlbnROb2RlSWQoKTtcbiAgICAgIGxldCBjb250ZW50ID0gKHBhcmVudElkICYmIHBhcmVudElkICE9PSAncm9vdCcpID8gZmluZEFzdEVsZW1lbnQoJHBhZ2UuYXN0LCBwYXJlbnRJZCk/LmNvbnRlbnQgOiAkcGFnZS5hc3Q7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICBsZXQgdGFyZ2V0SW5kZXggPSAoY29udGVudCBhcyB1bmtub3duW10pLmluZGV4T2Yobm9kZSk7XG4gICAgICAgIGNvbnRlbnQuc3BsaWNlKHRhcmdldEluZGV4LCAxKTtcbiAgICAgICAgJHNlbGVjdGVkQXN0RWxlbWVudElkID0gdW5kZWZpbmVkO1xuICAgICAgICBsaXZlLnB1c2hFdmVudChcInVwZGF0ZV9wYWdlX2FzdFwiLCB7IGlkOiAkcGFnZS5pZCwgYXN0OiAkcGFnZS5hc3QgfSk7XG4gICAgICB9IFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRyb3BJbnNpZGUoKSB7XG4gICAgZGlzcGF0Y2goJ2Ryb3BwZWRJbnRvVGFyZ2V0JywgJHNlbGVjdGVkQXN0RWxlbWVudCk7XG4gIH1cblxuICBsZXQgaXNEcmFnZ2luZ092ZXIgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZHJhZ092ZXIoZTogRHJhZ0V2ZW50KXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaXNEcmFnZ2luZ092ZXIgPSB0cnVlO1xuICAgIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNoYW5nZU5vZGVzKHsgZGV0YWlsOiBub2RlcyB9OiBDdXN0b21FdmVudDxBc3ROb2RlW10+KSB7XG4gICAgaWYgKCRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9PT0gJ3Jvb3QnKSB7XG4gICAgICBsZXQgc2VsZWN0ZWRFbGVtZW50ID0gJHBhZ2U7XG4gICAgICBzZWxlY3RlZEVsZW1lbnQuYXN0ID0gbm9kZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZWxlY3RlZEVsZW1lbnQgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgICAgaWYgKCFzZWxlY3RlZEVsZW1lbnQpIHJldHVybjtcbiAgICAgIHNlbGVjdGVkRWxlbWVudC5jb250ZW50ID0gbm9kZXM7XG4gICAgfVxuICAgIGxpdmUucHVzaEV2ZW50KFwidXBkYXRlX3BhZ2VfYXN0XCIsIHsgaWQ6ICRwYWdlLmlkLCBhc3Q6ICRwYWdlLmFzdCB9KTtcbiAgfSAgXG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cInctNjQgYmctd2hpdGVcIiBkYXRhLXRlc3QtaWQ9XCJyaWdodC1zaWRlYmFyXCI+XG4gIDxkaXYgY2xhc3M9XCJzdGlja3kgdG9wLTBcIj5cbiAgICB7I2lmICRzZWxlY3RlZEFzdEVsZW1lbnR9XG4gICAgICA8ZGl2IGNsYXNzPVwiYm9yZGVyLWIgdGV4dC1sZyBmb250LW1lZGl1bSBsZWFkaW5nLTUgcC00IHJlbGF0aXZlXCI+XG4gICAgICAgIHtzaWRlYmFyVGl0bGV9XG4gICAgICAgIHsjaWYgIWlzUm9vdE5vZGV9XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIiBcbiAgICAgICAgICBjbGFzcz1cImFic29sdXRlIHAtMiB0b3AtMiByaWdodC05IGdyb3VwXCIgXG4gICAgICAgICAgb246Y2xpY2s9e3NlbGVjdFBhcmVudE5vZGV9PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+VXAgb25lIGxldmVsPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhYnNvbHV0ZSBvcGFjaXR5LTAgaW52aXNpYmxlIHJpZ2h0LTkgbWluLXctWzEwMHB4XSBiZy1hbWJlci0xMDAgcHktMSBweC0xLjUgcm91bmRlZCB0ZXh0LXhzIHRleHQtbWVkaXVtIHRyYW5zaXRpb24gZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgZ3JvdXAtaG92ZXI6dmlzaWJsZVwiPlVwIG9uZSBsZXZlbDwvc3Bhbj5cbiAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJ3LTYgaC02IGhvdmVyOnRleHQtYmx1ZS03MDAgYWN0aXZlOnRleHQtYmx1ZS05MDBcIj5cbiAgICAgICAgICAgICAgPHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNOS41MyAyLjQ3YS43NS43NSAwIDAgMSAwIDEuMDZMNC44MSA4LjI1SDE1YTYuNzUgNi43NSAwIDAgMSAwIDEzLjVoLTNhLjc1Ljc1IDAgMCAxIDAtMS41aDNhNS4yNSA1LjI1IDAgMSAwIDAtMTAuNUg0LjgxbDQuNzIgNC43MmEuNzUuNzUgMCAxIDEtMS4wNiAxLjA2bC02LTZhLjc1Ljc1IDAgMCAxIDAtMS4wNmw2LTZhLjc1Ljc1IDAgMCAxIDEuMDYgMFpcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPiAgICAgIFxuICAgICAgICB7L2lmfVxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiIFxuICAgICAgICAgIGNsYXNzPVwiYWJzb2x1dGUgcC0yIHRvcC0yIHJpZ2h0LTFcIiBcbiAgICAgICAgICBvbjpjbGljaz17KCkgPT4gJHNlbGVjdGVkQXN0RWxlbWVudElkID0gdW5kZWZpbmVkfT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkNsb3NlPC9zcGFuPlxuICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cInctNiBoLTYgaG92ZXI6dGV4dC1ibHVlLTcwMCBhY3RpdmU6dGV4dC1ibHVlLTkwMFwiPlxuICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0xMiAyLjI1Yy01LjM4NSAwLTkuNzUgNC4zNjUtOS43NSA5Ljc1czQuMzY1IDkuNzUgOS43NSA5Ljc1IDkuNzUtNC4zNjUgOS43NS05Ljc1UzE3LjM4NSAyLjI1IDEyIDIuMjVabS0xLjcyIDYuOTdhLjc1Ljc1IDAgMSAwLTEuMDYgMS4wNkwxMC45NCAxMmwtMS43MiAxLjcyYS43NS43NSAwIDEgMCAxLjA2IDEuMDZMMTIgMTMuMDZsMS43MiAxLjcyYS43NS43NSAwIDEgMCAxLjA2LTEuMDZMMTMuMDYgMTJsMS43Mi0xLjcyYS43NS43NSAwIDEgMC0xLjA2LTEuMDZMMTIgMTAuOTRsLTEuNzItMS43MlpcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICB7I2lmIGF0dHJpYnV0ZXNFZGl0YWJsZX1cbiAgICAgICAgPFNpZGViYXJTZWN0aW9uIGNsZWFyT25VcGRhdGU9e3RydWV9IG9uOnVwZGF0ZT17YWRkQ2xhc3N9IHBsYWNlaG9sZGVyPVwiQWRkIG5ldyBjbGFzc1wiID5cbiAgICAgICAgICA8c3ZlbHRlOmZyYWdtZW50IHNsb3Q9XCJoZWFkaW5nXCI+Q2xhc3Nlczwvc3ZlbHRlOmZyYWdtZW50PlxuICAgICAgICAgIDxzdmVsdGU6ZnJhZ21lbnQgc2xvdD1cInZhbHVlXCI+XG4gICAgICAgICAgICB7I2VhY2ggY2xhc3NMaXN0IGFzIGNsYXNzTmFtZX1cbiAgICAgICAgICAgICAgPFBpbGwgb246ZGVsZXRlPXsoKSA9PiBkZWxldGVDbGFzcyhjbGFzc05hbWUpfT57Y2xhc3NOYW1lfTwvUGlsbD5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICA8L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgICAgPC9TaWRlYmFyU2VjdGlvbj5cbiAgICAgICAgeyNlYWNoIGVkaXRhYmxlQXR0cnMgYXMgZW50cnkgKGVudHJ5KX1cbiAgICAgICAgICB7QGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSBlbnRyeX1cbiAgICAgICAgICA8U2lkZWJhclNlY3Rpb24gY2xlYXJPblVwZGF0ZT17dHJ1ZX0gdmFsdWU9e3ZhbHVlfSBvbjp0ZXh0Q2hhbmdlPXsoZSkgPT4gdXBkYXRlQXR0cmlidXRlKG5hbWUsIGUpfSBwbGFjZWhvbGRlcj1cIlNldCB7bmFtZX1cIj5cbiAgICAgICAgICAgIDxzdmVsdGU6ZnJhZ21lbnQgc2xvdD1cImhlYWRpbmdcIj57bmFtZX08L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgICAgICA8L1NpZGViYXJTZWN0aW9uPlxuICAgICAgICB7L2VhY2h9XG4gICAgICB7L2lmfVxuXG4gICAgICA8ZGl2IGNsYXNzPVwicmVsYXRpdmVcIj5cbiAgICAgICAgeyNpZiAkZHJhZ2dlZE9iamVjdCAmJiAkZHJhZ2dlZE9iamVjdC5jYXRlZ29yeSA9PT0gXCJiYXNpY1wifVxuICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICBjbGFzcz1cImFic29sdXRlIGJnLXdoaXRlIG9wYWNpdHktNzAgdy1mdWxsIGgtZnVsbCBwLTRcIiBcbiAgICAgICAgICAgIGNsYXNzOm9wYWNpdHktOTA9e2lzRHJhZ2dpbmdPdmVyfVxuICAgICAgICAgICAgcm9sZT1cImxpc3RcIlxuICAgICAgICAgICAgb246ZHJvcHxwcmV2ZW50RGVmYXVsdD17ZHJvcEluc2lkZX0gXG4gICAgICAgICAgICBvbjpkcmFnb3Zlcj17ZHJhZ092ZXJ9XG4gICAgICAgICAgICBvbjpkcmFnbGVhdmU9eygpID0+IGlzRHJhZ2dpbmdPdmVyID0gZmFsc2V9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCByb3VuZGVkLWxnIG91dGxpbmUtZGFzaGVkIG91dGxpbmUtMiBoLWZ1bGwgdGV4dC1jZW50ZXIganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgIERyb3AgY29tcG9uZW50cyBoZXJlXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgey9pZn1cbiAgICAgICAgeyNpZiAkc2VsZWN0ZWRBc3RFbGVtZW50LmNvbnRlbnQubGVuZ3RoID4gMH1cbiAgICAgICAgICA8U2lkZWJhclNlY3Rpb24gXG4gICAgICAgICAgICBhc3ROb2Rlcz17JHNlbGVjdGVkQXN0RWxlbWVudC5jb250ZW50fVxuICAgICAgICAgICAgbGFyZ2U9eyRzZWxlY3RlZEFzdEVsZW1lbnQudGFnID09PSAnZWV4J31cbiAgICAgICAgICAgIG9uOnRleHRDaGFuZ2U9eyhlKSA9PiB1cGRhdGVUZXh0KGUpfSBcbiAgICAgICAgICAgIG9uOm5vZGVzQ2hhbmdlPXtjaGFuZ2VOb2Rlc30+XG4gICAgICAgICAgICA8c3ZlbHRlOmZyYWdtZW50IHNsb3Q9XCJoZWFkaW5nXCI+Q29udGVudDwvc3ZlbHRlOmZyYWdtZW50PlxuICAgICAgICAgIDwvU2lkZWJhclNlY3Rpb24+XG4gICAgICAgIHsvaWZ9XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgPFNpZGViYXJTZWN0aW9uIGV4cGFuZGVkPXtmYWxzZX0+XG4gICAgICAgIDxzdmVsdGU6ZnJhZ21lbnQgc2xvdD1cImhlYWRpbmdcIj5EZWxldGU8L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgICAgPHN2ZWx0ZTpmcmFnbWVudCBzbG90PVwiaW5wdXRcIj5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgb246Y2xpY2s9e2RlbGV0ZUNvbXBvbmVudH1cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIiBcbiAgICAgICAgICAgIGNsYXNzPVwiYmctcmVkLTUwMCBob3ZlcjpiZy1yZWQtNzAwIHRleHQtd2hpdGUgZm9udC1ib2xkIHB5LTIgcHgtNCByb3VuZGVkIG91dGxpbmUtZGFzaGVkIG91dGxpbmUtMiB3LWZ1bGxcIj5cbiAgICAgICAgICAgIERlbGV0ZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgIDwvU2lkZWJhclNlY3Rpb24+XG4gICAgezplbHNlfVxuICAgICAgPGRpdiBjbGFzcz1cInAtNCBwdC04IGZvbnQtbWVkaXVtIHRleHQtbGcgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgU2VsZWN0IGEgY29tcG9uZW50IHRvIGVkaXQgaXRzIHByb3BlcnRpZXNcbiAgICAgIDwvZGl2PlxuICAgIHsvaWZ9XG4gIDwvZGl2PlxuPC9kaXY+ICAgICIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuXHRpbXBvcnQgQ29tcG9uZW50c1NpZGViYXIgZnJvbSBcIi4vQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlXCI7XG5cdGltcG9ydCBCYWNrZHJvcCBmcm9tIFwiLi9CYWNrZHJvcC5zdmVsdGVcIjtcblx0aW1wb3J0IFBhZ2VQcmV2aWV3IGZyb20gXCIuL1BhZ2VQcmV2aWV3LnN2ZWx0ZVwiO1xuXHRpbXBvcnQgUHJvcGVydGllc1NpZGViYXIgZnJvbSBcIi4vUHJvcGVydGllc1NpZGViYXIuc3ZlbHRlXCI7XG5cdGltcG9ydCB7IHBhZ2UgYXMgcGFnZVN0b3JlIH0gZnJvbSBcIiRsaWIvc3RvcmVzL3BhZ2VcIjtcblx0aW1wb3J0IHsgcGFnZVN0eWxlc2hlZXQgYXMgcGFnZVN0eWxlc2hlZXRTdG9yZSB9IGZyb20gXCIkbGliL3N0b3Jlcy9wYWdlU3R5bGVzaGVldFwiO1xuXHRpbXBvcnQgeyBzaXRlU3R5bGVzaGVldCBhcyBzaXRlU3R5bGVzaGVldFN0b3JlIH0gZnJvbSBcIiRsaWIvc3RvcmVzL3NpdGVTdHlsZXNoZWV0XCI7XG5cdGltcG9ydCB0eXBlIHsgQ29tcG9uZW50RGVmaW5pdGlvbiwgUGFnZSB9IGZyb20gXCIkbGliL3R5cGVzXCI7XG5cblx0ZXhwb3J0IGxldCBjb21wb25lbnRzOiBDb21wb25lbnREZWZpbml0aW9uW107XG5cdGV4cG9ydCBsZXQgcGFnZTogUGFnZTtcblx0ZXhwb3J0IGxldCBwYWdlU3R5bGVzaGVldDogc3RyaW5nO1xuXHRleHBvcnQgbGV0IHNpdGVTdHlsZXNoZWV0OiBzdHJpbmc7XG5cdGV4cG9ydCBsZXQgbGl2ZTtcblx0JDogJHBhZ2VTdG9yZSA9IHBhZ2U7XG5cdCQ6ICRwYWdlU3R5bGVzaGVldFN0b3JlID0gcGFnZVN0eWxlc2hlZXQ7XG5cdCQ6ICRzaXRlU3R5bGVzaGVldFN0b3JlID0gc2l0ZVN0eWxlc2hlZXQ7XG5cblx0ZnVuY3Rpb24gYWRkQmFzaWNDb21wb25lbnRUb1RhcmdldChlOiBDdXN0b21FdmVudCkge1xuXHRcdC8vIFRoaXMgbWV0aG9kIGlzIGluIFBhZ2VQcmV2aWV3LlxuXHR9XG48L3NjcmlwdD5cbjxCYWNrZHJvcC8+XG48ZGl2IGNsYXNzPVwiZmxleCBtaW4taC1zY3JlZW4gYmctZ3JheS0xMDBcIiBkYXRhLXRlc3QtaWQ9XCJhcHAtY29udGFpbmVyXCI+XG5cdDwhLS0gTGVmdCBzaWRlYmFyIC0tPlxuXHQ8Q29tcG9uZW50c1NpZGViYXIge2NvbXBvbmVudHN9Lz5cblxuXHQ8IS0tIE1haW4gLS0+XG5cdDxQYWdlUHJldmlldyB7bGl2ZX0gLz5cblxuXHQ8IS0tIFJpZ2h0IHNpZGViYXIgLS0+XG5cdDxQcm9wZXJ0aWVzU2lkZWJhclxuXHRcdHtsaXZlfVxuXHRcdG9uOmRyb3BwZWRJbnRvVGFyZ2V0PXtlID0+IGFkZEJhc2ljQ29tcG9uZW50VG9UYXJnZXQoZS5kZXRhaWwpfS8+XG48L2Rpdj5cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBTUEsT0FBQyxTQUFVQSxTQUFRQyxXQUFVO0FBQzNCO0FBR0EsU0FBQyxXQUFZO0FBQ1gsY0FBSSxXQUFXO0FBQ2YsY0FBSSxVQUFVLENBQUMsTUFBTSxPQUFPLFVBQVUsR0FBRztBQUN6QyxtQkFBUyxJQUFJLEdBQUcsSUFBSSxRQUFR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RCxHQUFHLEdBQUk7QUFBQSxNQUNULENBQUMsRUFDQSxNQUFNLE1BQU07QUFDWCxXQUFHLFlBQVk7QUFFZixXQUFHLFVBQVUsT0FBTyxhQUFhLGtCQUFrQixXQUFXO0FBRTlELFdBQUcsVUFBVSxJQUFJLGdCQUFnQixlQUFlLGdCQUFnQjtBQUFBLE1BQ2xFLENBQUM7QUFBQSxJQUNMLE9BQU87QUFDTCxZQUFNLHNEQUFzRDtBQUFBLElBQzlEO0FBQUEsRUFDRixDQUFDO0FBRUQsTUFBSSxhQUNGLFNBQVMsY0FBYyxNQUFNLEVBQUUsYUFBYSxZQUFZLEtBQUs7QUFDL0QsTUFBSSxZQUFZLFNBQ2IsY0FBYyx5QkFBeUIsRUFDdkMsYUFBYSxTQUFTO0FBQ3pCLE1BQUksYUFBYSxJQUFJLFNBQVMsV0FBVyxZQUFZLFFBQVEsUUFBUTtBQUFBLElBQ25FLE9BQU8sRUFBRSxHQUFHLFNBQVMsU0FBVSxHQUFHLEdBQUcsTUFBTTtBQUFBLElBQzNDLFFBQVEsRUFBRSxhQUFhLFVBQVU7QUFBQSxFQUNuQyxDQUFDO0FBQ0QsYUFBVyxRQUFRO0FBQ25CLFNBQU8sYUFBYTsiLAogICJuYW1lcyI6IFsid2luZG93IiwgImRvY3VtZW50IiwgImVsZW1lbnQiLCAidG9wYmFyIiwgImxvb3AiLCAiX2RlZmluZVByb3BlcnR5IiwgIm93bktleXMiLCAiX29iamVjdFNwcmVhZDIiLCAiZXJyb3JNZXNzYWdlcyIsICJ1cGRhdGUiLCAiZ2V0U3RhdGUiLCAic3RhdGUiLCAic2V0U3RhdGUiLCAiY3VycnkiLCAiaXNPYmplY3QiLCAiY29uZmlnIiwgImVycm9ySGFuZGxlciIsICJ0aHJvd0Vycm9yIiwgInZhbGlkYXRvcnMiLCAiY29tcG9zZSIsICJwcm9taXNlIiwgImNvbmZpZ3VyZUxvYWRlciIsICJyZXF1aXJlIiwgImNvbG9ycyIsICJpbmRleCIsICJlbGVtZW50IiwgIm5vb3AiLCAiZWxlbWVudCIsICJmaWxlIiwgIm5vb3AiLCAibm9vcCIsICJub29wIiwgIm5vdyIsICJlbGVtZW50IiwgImNoaWxkcmVuIiwgImluc2VydCIsICJkZXRhY2giLCAiZWxlbWVudCIsICJ0ZXh0IiwgImRldGFjaCIsICJlbGVtZW50IiwgImluc2VydCIsICJkZXRhY2giLCAiZWxlbWVudCIsICJoYXNoIiwgInJ1bGVzIiwgImRldGFjaCIsICJkZXRhY2giLCAiY29uZmlnIiwgImluaXQiLCAidGljayIsICJub29wIiwgIm5vdyIsICJjcmVhdGVfZWFjaF9ibG9jayIsICJpbnNlcnQiLCAidXBkYXRlIiwgImluaXQiLCAiaW5zdGFuY2UiLCAiY3JlYXRlX2ZyYWdtZW50IiwgImFwcGVuZF9zdHlsZXMiLCAibm9vcCIsICJkZXRhY2giLCAiY3JlYXRlX3Nsb3QiLCAiY3JlYXRlIiwgImluc2VydCIsICJhdHRyIiwgImluZGV4IiwgImRldGFjaCIsICJ0ZXh0IiwgIm5vb3AiLCAidXBkYXRlIiwgInN1YnNjcmliZSIsICJydW4iLCAiY3R4IiwgImN0eCIsICJwYWdlIiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJvd25LZXlzIiwgIl9vYmplY3RTcHJlYWQyIiwgIl9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIiwgIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsICJfc2xpY2VkVG9BcnJheSIsICJfYXJyYXlXaXRoSG9sZXMiLCAiX2l0ZXJhYmxlVG9BcnJheUxpbWl0IiwgIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsICJfbm9uSXRlcmFibGVSZXN0IiwgIl9hcnJheUxpa2VUb0FycmF5IiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJvd25LZXlzIiwgIl9vYmplY3RTcHJlYWQyIiwgImNvbXBvc2UiLCAiY3VycnkiLCAiaXNPYmplY3QiLCAiaXNFbXB0eSIsICJpc0Z1bmN0aW9uIiwgImhhc093blByb3BlcnR5IiwgInZhbGlkYXRlQ2hhbmdlcyIsICJlcnJvckhhbmRsZXIiLCAidmFsaWRhdGVTZWxlY3RvciIsICJ2YWxpZGF0ZUhhbmRsZXIiLCAidmFsaWRhdGVJbml0aWFsIiwgInRocm93RXJyb3IiLCAiZXJyb3JNZXNzYWdlcyIsICJ2YWxpZGF0b3JzIiwgImNyZWF0ZSIsICJkaWRTdGF0ZVVwZGF0ZSIsICJ1cGRhdGUiLCAidXBkYXRlU3RhdGUiLCAiZXh0cmFjdENoYW5nZXMiLCAiZ2V0U3RhdGUiLCAic3RhdGUiLCAic2V0U3RhdGUiLCAiaW5kZXgiLCAic3RhdGVfbG9jYWxfZGVmYXVsdCIsICJjb25maWciLCAiY29uZmlnX2RlZmF1bHQiLCAiY3VycnkiLCAiY3VycnlfZGVmYXVsdCIsICJpc09iamVjdCIsICJpc09iamVjdF9kZWZhdWx0IiwgInZhbGlkYXRlQ29uZmlnIiwgImNvbmZpZyIsICJlcnJvckhhbmRsZXIiLCAiaXNPYmplY3RfZGVmYXVsdCIsICJpbmZvcm1BYm91dERlcHJlY2F0aW9uIiwgImVycm9yTWVzc2FnZXMiLCAidGhyb3dFcnJvciIsICJjdXJyeV9kZWZhdWx0IiwgInZhbGlkYXRvcnMiLCAidmFsaWRhdG9yc19kZWZhdWx0IiwgImNvbXBvc2UiLCAiY29tcG9zZV9kZWZhdWx0IiwgIm1lcmdlIiwgIl9vYmplY3RTcHJlYWQyIiwgImRlZXBNZXJnZV9kZWZhdWx0IiwgIkNBTkNFTEFUSU9OX01FU1NBR0UiLCAibWFrZUNhbmNlbGFibGUiLCAicHJvbWlzZSIsICJtYWtlQ2FuY2VsYWJsZV9kZWZhdWx0IiwgIl9zdGF0ZSRjcmVhdGUiLCAic3RhdGVfbG9jYWxfZGVmYXVsdCIsICJjb25maWdfZGVmYXVsdCIsICJfc3RhdGUkY3JlYXRlMiIsICJfc2xpY2VkVG9BcnJheSIsICJnZXRTdGF0ZSIsICJzZXRTdGF0ZSIsICJjb25maWciLCAidmFsaWRhdG9yc19kZWZhdWx0IiwgIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsICJkZWVwTWVyZ2VfZGVmYXVsdCIsICJpbml0IiwgIm1ha2VDYW5jZWxhYmxlX2RlZmF1bHQiLCAid3JhcHBlclByb21pc2UiLCAic3RvcmVNb25hY29JbnN0YW5jZSIsICJjb21wb3NlX2RlZmF1bHQiLCAiaW5qZWN0U2NyaXB0cyIsICJnZXRNb25hY29Mb2FkZXJTY3JpcHQiLCAiY29uZmlndXJlTG9hZGVyIiwgImNyZWF0ZVNjcmlwdCIsICJyZXF1aXJlIiwgIl9fZ2V0TW9uYWNvSW5zdGFuY2UiLCAibG9hZGVyIiwgImxvYWRlcl9kZWZhdWx0IiwgImN0eCIsICJjcmVhdGVfaWZfYmxvY2siLCAiY3R4IiwgImN0eCIsICJjcmVhdGVfZHluYW1pY19lbGVtZW50XzEiLCAiY3JlYXRlX2R5bmFtaWNfZWxlbWVudCIsICJjdHgiLCAiY3JlYXRlX2lmX2Jsb2NrIiwgImN0eCIsICJkaXNwYXRjaCIsICJjdHgiLCAiY3JlYXRlX2lmX2Jsb2NrXzQiLCAiY3JlYXRlX2lmX2Jsb2NrXzMiLCAiY3JlYXRlX2lmX2Jsb2NrXzQiLCAiY3JlYXRlX2lmX2Jsb2NrXzMiLCAiY3JlYXRlX2lmX2Jsb2NrXzIiLCAiY3JlYXRlX2lmX2Jsb2NrXzEiLCAiY3R4IiwgInRvcGJhciJdCn0K
