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
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs"
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
        paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs" }
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
        const resizeObserver = new ResizeObserver((entries) => {
          console.log("resizeObserver");
          entries.forEach(() => {
            if (this.el.offsetHeight > 0) {
              this._setScreenDependantEditorOptions();
              this.standalone_code_editor.layout();
            }
          });
        });
        resizeObserver.observe(this.el);
        this.standalone_code_editor.onDidContentSizeChange(() => {
          console.log("onDidContentSizeChanges");
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
        this.el.dispatchEvent(
          new CustomEvent("lme:editor_mounted", {
            detail: { hook: this, editor: this.codeEditor },
            bubbles: true
          })
        );
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
  function add_location(element2, file12, line, column, char) {
    element2.__svelte_meta = {
      loc: { file: file12, line, column, char }
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
    if (prop in node) {
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
  function init2(component, options, instance12, create_fragment12, not_equal, props, append_styles2 = null, dirty = [-1]) {
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
    $$.ctx = instance12 ? instance12(component, options.props || {}, (i, ret, ...rest) => {
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
    $$.fragment = create_fragment12 ? create_fragment12($$.ctx) : false;
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
  var VERSION = "4.2.1";
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
    let textContent = "D | T | P";
    let t6;
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
        div3.textContent = textContent;
        t6 = space();
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
        if (get_svelte_dataset(div3) !== "svelte-v12u6m")
          div3.textContent = textContent;
        div4_nodes.forEach(detach_dev);
        t6 = claim_space(div5_nodes);
        if (default_slot)
          default_slot.l(div5_nodes);
        div5_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span0, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-red-900");
        add_location(span0, file2, 16, 6, 378);
        attr_dev(span1, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-amber-400");
        add_location(span1, file2, 17, 6, 456);
        attr_dev(span2, "class", "inline-block h-2 w-2 ml-2 rounded-full bg-lime-700");
        add_location(span2, file2, 18, 6, 536);
        attr_dev(div0, "class", "ml-4 py-2");
        add_location(div0, file2, 15, 4, 348);
        attr_dev(span3, "data-test-id", "url-box");
        add_location(span3, file2, 22, 8, 802);
        attr_dev(div1, "class", "rounded bg-white bg-gray-50 border-b border-gray-200 shadow max-w-xs mx-auto text-center py-0.5 relative");
        add_location(div1, file2, 21, 6, 675);
        attr_dev(div2, "class", "flex-1 py-2.5 overflow-visible");
        add_location(div2, file2, 20, 4, 624);
        attr_dev(div3, "class", "py-3");
        add_location(div3, file2, 25, 4, 886);
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
        append_hydration_dev(div5, t6);
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
      throw new Error("<BrowserFrame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set page(value) {
      throw new Error("<BrowserFrame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
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
      throw new Error("<CodeEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set value(value) {
      throw new Error("<CodeEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
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
    append_styles(target, "svelte-1q6nykn", "#left-sidebar.svelte-1q6nykn{z-index:1000}#component-previews.svelte-1q6nykn,#backdrop.svelte-1q6nykn{z-index:999}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQWlIQyw0QkFBYyxDQUNiLE9BQU8sQ0FBRSxJQUNWLENBQ0Esa0NBQW1CLENBQUUsd0JBQVUsQ0FDOUIsT0FBTyxDQUFFLEdBQ1YiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlIl19 */");
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
        div = claim_element(li_nodes, "DIV", { class: true });
        var div_nodes = children(div);
        t0 = claim_text(div_nodes, t0_value);
        div_nodes.forEach(detach_dev);
        t1 = claim_space(li_nodes);
        li_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "pl-2");
        add_location(div, file4, 77, 12, 2402);
        attr_dev(li, "class", "pb-1");
        attr_dev(li, "data-test-id", "nav-item");
        add_location(li, file4, 76, 10, 2264);
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
    let h5;
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
        h5 = element("h5");
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
        h5 = claim_element(li_nodes, "H5", { class: true });
        var h5_nodes = children(h5);
        t0 = claim_text(h5_nodes, t0_value);
        h5_nodes.forEach(detach_dev);
        li_nodes.forEach(detach_dev);
        t1 = claim_space(nodes);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(nodes);
        }
        each_1_anchor = empty();
        this.h();
      },
      h: function hydrate() {
        attr_dev(h5, "class", "uppercase");
        add_location(h5, file4, 73, 10, 2158);
        attr_dev(li, "class", "pb-1");
        attr_dev(li, "data-test-id", "nav-item");
        add_location(li, file4, 72, 8, 2106);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, li, anchor);
        append_hydration_dev(li, h5);
        append_hydration_dev(h5, t0);
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
        attr_dev(div, "class", "bg-black/50 absolute inset-0 z-50 svelte-1q6nykn");
        attr_dev(div, "id", "backdrop");
        attr_dev(div, "data-test-id", "backdrop");
        add_location(div, file4, 86, 2, 2548);
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
      id: create_if_block_1.name,
      type: "if",
      source: "(78:0) {#if showExamples}",
      ctx
    });
    return block;
  }
  function create_if_block2(ctx) {
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
      id: create_if_block2.name,
      type: "if",
      source: "(91:2) {#if currentDefinitions}",
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
        attr_dev(img, "class", "rounded outline-offset-2 outline-blue-500 hover:outline hover:outline-2");
        if (!src_url_equal(img.src, img_src_value = /*example*/
        ctx[17].thumbnail))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", img_alt_value = /*example*/
        ctx[17].name);
        add_location(img, file4, 106, 8, 3416);
        attr_dev(div, "draggable", "");
        attr_dev(div, "class", "pt-6");
        attr_dev(div, "data-test-id", "component-preview-card");
        add_location(div, file4, 100, 6, 3236);
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
      source: "(92:4) {#each currentDefinitions as example}",
      ctx
    });
    return block;
  }
  function create_fragment4(ctx) {
    let div2;
    let div1;
    let div0;
    let span;
    let textContent = "Beacon CMS";
    let t1;
    let ul;
    let t2;
    let t3;
    let div3;
    let h4;
    let t4_value = (
      /*sectionTitles*/
      ctx[4][
        /*$currentComponentCategory*/
        ctx[0]?.name
      ] + ""
    );
    let t4;
    let t5;
    let p;
    let textContent_1 = "Select a component \u{1F447}  and drag it to the canvas \u{1F449}";
    let t7;
    let div3_transition;
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
      /*showExamples*/
      ctx[2] && create_if_block_1(ctx)
    );
    let if_block1 = (
      /*currentDefinitions*/
      ctx[3] && create_if_block2(ctx)
    );
    const block = {
      c: function create3() {
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        span = element("span");
        span.textContent = textContent;
        t1 = space();
        ul = element("ul");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t2 = space();
        if (if_block0)
          if_block0.c();
        t3 = space();
        div3 = element("div");
        h4 = element("h4");
        t4 = text(t4_value);
        t5 = space();
        p = element("p");
        p.textContent = textContent_1;
        t7 = space();
        if (if_block1)
          if_block1.c();
        this.h();
      },
      l: function claim(nodes) {
        div2 = claim_element(nodes, "DIV", {
          class: true,
          id: true,
          "data-test-id": true
        });
        var div2_nodes = children(div2);
        div1 = claim_element(div2_nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        div0 = claim_element(div1_nodes, "DIV", { class: true, "data-test-id": true });
        var div0_nodes = children(div0);
        span = claim_element(div0_nodes, "SPAN", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(span) !== "svelte-1cdjyeb")
          span.textContent = textContent;
        div0_nodes.forEach(detach_dev);
        t1 = claim_space(div1_nodes);
        ul = claim_element(div1_nodes, "UL", { class: true, "data-test-id": true });
        var ul_nodes = children(ul);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(ul_nodes);
        }
        ul_nodes.forEach(detach_dev);
        div1_nodes.forEach(detach_dev);
        div2_nodes.forEach(detach_dev);
        t2 = claim_space(nodes);
        if (if_block0)
          if_block0.l(nodes);
        t3 = claim_space(nodes);
        div3 = claim_element(nodes, "DIV", {
          class: true,
          id: true,
          "data-test-id": true
        });
        var div3_nodes = children(div3);
        h4 = claim_element(div3_nodes, "H4", { class: true });
        var h4_nodes = children(h4);
        t4 = claim_text(h4_nodes, t4_value);
        h4_nodes.forEach(detach_dev);
        t5 = claim_space(div3_nodes);
        p = claim_element(div3_nodes, "P", { ["data-svelte-h"]: true });
        if (get_svelte_dataset(p) !== "svelte-lynpka")
          p.textContent = textContent_1;
        t7 = claim_space(div3_nodes);
        if (if_block1)
          if_block1.l(div3_nodes);
        div3_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(span, "class", "text-lg");
        add_location(span, file4, 68, 6, 1954);
        attr_dev(div0, "class", "border-b border-gray-100 border-solid py-4 px-4");
        attr_dev(div0, "data-test-id", "logo");
        add_location(div0, file4, 67, 4, 1866);
        attr_dev(ul, "class", "px-4");
        attr_dev(ul, "data-test-id", "component-tree");
        add_location(ul, file4, 70, 4, 2009);
        attr_dev(div1, "class", "sticky top-0");
        add_location(div1, file4, 66, 2, 1835);
        attr_dev(div2, "class", "w-64 bg-white border-gray-100 border-solid border-r svelte-1q6nykn");
        attr_dev(div2, "id", "left-sidebar");
        attr_dev(div2, "data-test-id", "left-sidebar");
        add_location(div2, file4, 65, 0, 1721);
        attr_dev(h4, "class", "text-2xl");
        add_location(h4, file4, 96, 2, 3025);
        add_location(p, file4, 97, 2, 3102);
        attr_dev(div3, "class", "absolute w-96 -left-32 bg-white inset-y-0 shadow-sm z-50 pt-3 pb-4 px-5 transition-transform duration-300 svelte-1q6nykn");
        attr_dev(div3, "id", "component-previews");
        attr_dev(div3, "data-test-id", "component-previews");
        toggle_class(
          div3,
          "translate-x-96",
          /*showExamples*/
          ctx[2]
        );
        add_location(div3, file4, 88, 0, 2681);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div2, anchor);
        append_hydration_dev(div2, div1);
        append_hydration_dev(div1, div0);
        append_hydration_dev(div0, span);
        append_hydration_dev(div1, t1);
        append_hydration_dev(div1, ul);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(ul, null);
          }
        }
        insert_hydration_dev(target, t2, anchor);
        if (if_block0)
          if_block0.m(target, anchor);
        insert_hydration_dev(target, t3, anchor);
        insert_hydration_dev(target, div3, anchor);
        append_hydration_dev(div3, h4);
        append_hydration_dev(h4, t4);
        append_hydration_dev(div3, t5);
        append_hydration_dev(div3, p);
        append_hydration_dev(div3, t7);
        if (if_block1)
          if_block1.m(div3, null);
        current = true;
        if (!mounted) {
          dispose = [
            listen_dev(
              div3,
              "mouseenter",
              /*abortCollapseCategoryMenu*/
              ctx[6],
              false,
              false,
              false,
              false
            ),
            listen_dev(
              div3,
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
        if (
          /*showExamples*/
          ctx2[2]
        ) {
          if (if_block0) {
            if (dirty & /*showExamples*/
            4) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_1(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(t3.parentNode, t3);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if ((!current || dirty & /*$currentComponentCategory*/
        1) && t4_value !== (t4_value = /*sectionTitles*/
        ctx2[4][
          /*$currentComponentCategory*/
          ctx2[0]?.name
        ] + ""))
          set_data_dev(t4, t4_value);
        if (
          /*currentDefinitions*/
          ctx2[3]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block2(ctx2);
            if_block1.c();
            if_block1.m(div3, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (!current || dirty & /*showExamples*/
        4) {
          toggle_class(
            div3,
            "translate-x-96",
            /*showExamples*/
            ctx2[2]
          );
        }
      },
      i: function intro(local) {
        if (current)
          return;
        transition_in(if_block0);
        if (local) {
          add_render_callback(() => {
            if (!current)
              return;
            if (!div3_transition)
              div3_transition = create_bidirectional_transition(div3, translate, { x: 384 }, true);
            div3_transition.run(1);
          });
        }
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block0);
        if (local) {
          if (!div3_transition)
            div3_transition = create_bidirectional_transition(div3, translate, { x: 384 }, false);
          div3_transition.run(0);
        }
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) {
          detach_dev(div2);
          detach_dev(t2);
          detach_dev(t3);
          detach_dev(div3);
        }
        destroy_each(each_blocks, detaching);
        if (if_block0)
          if_block0.d(detaching);
        if (if_block1)
          if_block1.d();
        if (detaching && div3_transition)
          div3_transition.end();
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
      throw new Error("<ComponentsSidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set components(value) {
      throw new Error("<ComponentsSidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
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
      source: "(23:0) {:else}",
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
      source: "(14:33) ",
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
      source: "(18:6) {#each node.content as subnode, index}",
      ctx
    });
    return block;
  }
  function create_dynamic_element_1(ctx) {
    let svelte_element;
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
          {}
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
        add_location(svelte_element, file5, 18, 4, 529);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, svelte_element, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(svelte_element, null);
          }
        }
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
        )(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*node*/
        1 && /*node*/
        ctx2[0].attrs]));
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
        add_location(svelte_element, file5, 16, 4, 465);
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
      throw new Error("<LayoutAstNode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set node(value) {
      throw new Error("<LayoutAstNode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
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
      throw new Error("<PageAstNode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set node(value) {
      throw new Error("<PageAstNode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get nodeId() {
      throw new Error("<PageAstNode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set nodeId(value) {
      throw new Error("<PageAstNode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
  var PageAstNode_default = PageAstNode;

  // svelte/components/PagePreview.svelte
  var PagePreview_exports = {};
  __export(PagePreview_exports, {
    default: () => PagePreview_default
  });
  var file7 = "svelte/components/PagePreview.svelte";
  function add_css2(target) {
    append_styles(target, "svelte-xdxbam", '[data-selected="true"], [data-highlighted="true"]{outline-color:#06b6d4;outline-width:2px;outline-style:dashed}.contents[data-nochildren="true"], .contents[data-nochildren="true"]{display:inline}[data-slot-target="true"]{outline-color:red;outline-width:2px;outline-style:dashed}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZVByZXZpZXcuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXlFVSxpREFBbUQsQ0FDekQsYUFBYSxDQUFFLE9BQU8sQ0FDdEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsYUFBYSxDQUFFLE1BQ2pCLENBQ1Esb0VBQXNFLENBSTVFLE9BQU8sQ0FBRSxNQUNYLENBQ1EseUJBQTJCLENBQ2pDLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLGFBQWEsQ0FBRSxHQUFHLENBQ2xCLGFBQWEsQ0FBRSxNQUNqQiIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJQYWdlUHJldmlldy5zdmVsdGUiXX0= */');
  }
  function get_each_context4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[11] = list[i];
    return child_ctx;
  }
  function get_each_context_12(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[14] = list[i];
    child_ctx[16] = i;
    return child_ctx;
  }
  function create_each_block_12(ctx) {
    let pageastnode;
    let current;
    pageastnode = new PageAstNode_default({
      props: {
        node: (
          /*astNode*/
          ctx[14]
        ),
        nodeId: (
          /*index*/
          ctx[16]
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
          ctx2[14];
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
      source: "(77:12) {#each $page.ast as astNode, index}",
      ctx
    });
    return block;
  }
  function create_default_slot_1(ctx) {
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
        if (dirty & /*$page*/
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
      id: create_default_slot_1.name,
      type: "slot",
      source: "(76:10) <LayoutAstNode node={layoutAstNode}>",
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
          ctx[11]
        ),
        $$slots: { default: [create_default_slot_1] },
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
          ctx2[11];
        if (dirty & /*$$scope, $page*/
        131074) {
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
      source: "(75:8) {#each $page.layout.ast as layoutAstNode}",
      ctx
    });
    return block;
  }
  function create_default_slot(ctx) {
    let div1;
    let div0;
    let div0_data_selected_value;
    let div1_class_value;
    let current;
    let mounted;
    let dispose;
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
        div1 = element("div");
        div0 = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        this.h();
      },
      l: function claim(nodes) {
        div1 = claim_element(nodes, "DIV", {
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
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].l(div0_nodes);
        }
        div0_nodes.forEach(detach_dev);
        div1_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div0, "id", "page-wrapper");
        attr_dev(div0, "class", "p-1 m-1");
        attr_dev(div0, "data-selected", div0_data_selected_value = /*$selectedAstElementId*/
        ctx[2] === "root");
        add_location(div0, file7, 59, 6, 3346);
        set_style(div1, "--outlined-id", "title-1");
        attr_dev(div1, "id", "fake-browser-content");
        attr_dev(div1, "class", div1_class_value = "bg-white rounded-b-xl relative overflow-hidden flex-1 " + /*isDraggingOver*/
        (ctx[0] && "border-dashed border-blue-500 border-2"));
        attr_dev(div1, "data-test-id", "browser-content");
        add_location(div1, file7, 52, 4, 3007);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div1, anchor);
        append_hydration_dev(div1, div0);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div0, null);
          }
        }
        current = true;
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
        if (dirty & /*$page*/
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
              each_blocks[i].m(div0, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        if (!current || dirty & /*$selectedAstElementId*/
        4 && div0_data_selected_value !== (div0_data_selected_value = /*$selectedAstElementId*/
        ctx2[2] === "root")) {
          attr_dev(div0, "data-selected", div0_data_selected_value);
        }
        if (!current || dirty & /*isDraggingOver*/
        1 && div1_class_value !== (div1_class_value = "bg-white rounded-b-xl relative overflow-hidden flex-1 " + /*isDraggingOver*/
        (ctx2[0] && "border-dashed border-blue-500 border-2"))) {
          attr_dev(div1, "class", div1_class_value);
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
          detach_dev(div1);
        }
        destroy_each(each_blocks, detaching);
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot.name,
      type: "slot",
      source: "(66:2) <BrowserFrame page={$page}>",
      ctx
    });
    return block;
  }
  function create_fragment7(ctx) {
    let div;
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
        div = element("div");
        create_component(browserframe.$$.fragment);
        this.h();
      },
      l: function claim(nodes) {
        div = claim_element(nodes, "DIV", { class: true, "data-test-id": true });
        var div_nodes = children(div);
        claim_component(browserframe.$$.fragment, div_nodes);
        div_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "flex-1 px-8 py-4 flex max-h-full");
        attr_dev(div, "data-test-id", "main");
        add_location(div, file7, 50, 0, 2906);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div, anchor);
        mount_component(browserframe, div, null);
        current = true;
      },
      p: function update2(ctx2, [dirty]) {
        const browserframe_changes = {};
        if (dirty & /*$page*/
        2)
          browserframe_changes.page = /*$page*/
          ctx2[1];
        if (dirty & /*$$scope, isDraggingOver, $selectedAstElementId, $page*/
        131079) {
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
        if (detaching) {
          detach_dev(div);
        }
        destroy_component(browserframe);
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
      LayoutAstNode: LayoutAstNode_default,
      PageAstNode: PageAstNode_default,
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
      throw new Error("<PagePreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set live(value) {
      throw new Error("<PagePreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
  var PagePreview_default = PagePreview;

  // svelte/components/Pill.svelte
  var Pill_exports = {};
  __export(Pill_exports, {
    default: () => Pill_default
  });
  var file8 = "svelte/components/Pill.svelte";
  function create_fragment8(ctx) {
    let span;
    let t0;
    let button;
    let textContent = "\u2715";
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
        span = element("span");
        if (default_slot)
          default_slot.c();
        t0 = space();
        button = element("button");
        button.textContent = textContent;
        this.h();
      },
      l: function claim(nodes) {
        span = claim_element(nodes, "SPAN", { class: true });
        var span_nodes = children(span);
        if (default_slot)
          default_slot.l(span_nodes);
        t0 = claim_space(span_nodes);
        button = claim_element(span_nodes, "BUTTON", {
          class: true,
          type: true,
          ["data-svelte-h"]: true
        });
        if (get_svelte_dataset(button) !== "svelte-qcf9q0")
          button.textContent = textContent;
        span_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(button, "class", "rounded-full inline-block bg-gray-700 text-white ml-2");
        attr_dev(button, "type", "button");
        add_location(button, file8, 7, 2, 233);
        attr_dev(span, "class", "rounded-full bg-gray-700 text-white text-xs inline-block px-3 py-2 m-1 leading-4");
        add_location(span, file8, 5, 0, 119);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, span, anchor);
        if (default_slot) {
          default_slot.m(span, null);
        }
        append_hydration_dev(span, t0);
        append_hydration_dev(span, button);
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
          detach_dev(span);
        }
        if (default_slot)
          default_slot.d(detaching);
        mounted = false;
        dispose();
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
      init2(this, options, instance8, create_fragment8, safe_not_equal, {});
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Pill",
        options,
        id: create_fragment8.name
      });
    }
  };
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
  var file9 = "svelte/components/SidebarSection.svelte";
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
      source: "(79:4) {#if expanded}",
      ctx
    });
    return block;
  }
  function create_if_block5(ctx) {
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
        add_location(div, file9, 79, 4, 2488);
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
      id: create_if_block5.name,
      type: "if",
      source: "(67:2) {#if $$slots['value']}",
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
      source: "(102:30) ",
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
      source: "(81:8) {#if internalValue}",
      ctx
    });
    return block;
  }
  function create_each_block5(ctx) {
    let p;
    let t0;
    let t1_value = (
      /*astElement*/
      ctx[26].tag + ""
    );
    let t1;
    let t2;
    let button0;
    let svg;
    let path;
    let t3;
    let button1;
    let textContent = "\u2191";
    let button1_disabled_value;
    let t5;
    let button2;
    let t6;
    let button2_disabled_value;
    let t7;
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
        p = element("p");
        t0 = text("<");
        t1 = text(t1_value);
        t2 = text("> Element \n              ");
        button0 = element("button");
        svg = svg_element("svg");
        path = svg_element("path");
        t3 = space();
        button1 = element("button");
        button1.textContent = textContent;
        t5 = space();
        button2 = element("button");
        t6 = text("\u2193");
        t7 = space();
        this.h();
      },
      l: function claim(nodes) {
        p = claim_element(nodes, "P", {});
        var p_nodes = children(p);
        t0 = claim_text(p_nodes, "<");
        t1 = claim_text(p_nodes, t1_value);
        t2 = claim_text(p_nodes, "> Element \n              ");
        button0 = claim_element(p_nodes, "BUTTON", { class: true });
        var button0_nodes = children(button0);
        svg = claim_svg_element(button0_nodes, "svg", { viewBox: true });
        var svg_nodes = children(svg);
        path = claim_svg_element(svg_nodes, "path", { fill: true, d: true });
        children(path).forEach(detach_dev);
        svg_nodes.forEach(detach_dev);
        button0_nodes.forEach(detach_dev);
        t3 = claim_space(p_nodes);
        button1 = claim_element(p_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(button1) !== "svelte-4yzw0i")
          button1.textContent = textContent;
        t5 = claim_space(p_nodes);
        button2 = claim_element(p_nodes, "BUTTON", { class: true });
        var button2_nodes = children(button2);
        t6 = claim_text(button2_nodes, "\u2193");
        button2_nodes.forEach(detach_dev);
        t7 = claim_space(p_nodes);
        p_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(path, "fill", "currentColor");
        attr_dev(path, "d", "M4,3H5V5H3V4A1,1 0 0,1 4,3M20,3A1,1 0 0,1 21,4V5H19V3H20M15,5V3H17V5H15M11,5V3H13V5H11M7,5V3H9V5H7M21,20A1,1 0 0,1 20,21H19V19H21V20M15,21V19H17V21H15M11,21V19H13V21H11M7,21V19H9V21H7M4,21A1,1 0 0,1 3,20V19H5V21H4M3,15H5V17H3V15M21,15V17H19V15H21M3,11H5V13H3V11M21,11V13H19V11H21M3,7H5V9H3V7M21,7V9H19V7H21Z");
        add_location(path, file9, 112, 18, 3923);
        attr_dev(svg, "viewBox", "0 0 24 24");
        add_location(svg, file9, 111, 16, 3879);
        attr_dev(button0, "class", "bg-blue-500 hover:bg-blue-700 text-white inline h-5 w-5 align-middle");
        add_location(button0, file9, 108, 14, 3708);
        attr_dev(button1, "class", "bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white inline h-5 w-5 align-middle");
        button1.disabled = button1_disabled_value = /*idx*/
        ctx[28] === 0;
        add_location(button1, file9, 115, 14, 4330);
        attr_dev(button2, "class", "bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white inline h-5 w-5 align-middle");
        button2.disabled = button2_disabled_value = /*idx*/
        ctx[28] === /*astElements*/
        ctx[4].length - 1;
        add_location(button2, file9, 121, 14, 4611);
        add_location(p, file9, 106, 12, 3542);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, p, anchor);
        append_hydration_dev(p, t0);
        append_hydration_dev(p, t1);
        append_hydration_dev(p, t2);
        append_hydration_dev(p, button0);
        append_hydration_dev(button0, svg);
        append_hydration_dev(svg, path);
        append_hydration_dev(p, t3);
        append_hydration_dev(p, button1);
        append_hydration_dev(p, t5);
        append_hydration_dev(p, button2);
        append_hydration_dev(button2, t6);
        append_hydration_dev(p, t7);
        if (!mounted) {
          dispose = [
            listen_dev(button0, "click", click_handler_1, false, false, false, false),
            listen_dev(button1, "click", click_handler_2, false, false, false, false),
            listen_dev(button2, "click", click_handler_3, false, false, false, false),
            listen_dev(p, "mouseenter", mouseenter_handler, false, false, false, false),
            listen_dev(
              p,
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
          detach_dev(p);
        }
        mounted = false;
        run_all(dispose);
      }
    };
    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block5.name,
      type: "each",
      source: "(103:10) {#each astElements as astElement, idx}",
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
        attr_dev(input, "class", "w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm");
        attr_dev(
          input,
          "placeholder",
          /*placeholder*/
          ctx[1]
        );
        input.value = /*internalValue*/
        ctx[3];
        add_location(input, file9, 93, 12, 3047);
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
      source: "(90:10) {:else}",
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
        attr_dev(textarea, "class", "w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm");
        attr_dev(
          textarea,
          "placeholder",
          /*placeholder*/
          ctx[1]
        );
        textarea.value = /*internalValue*/
        ctx[3];
        add_location(textarea, file9, 86, 12, 2759);
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
      source: "(82:10) {#if large}",
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
        add_location(div, file9, 102, 12, 3389);
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
      source: "(99:10) {#if $$slots['value']}",
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
      source: "(80:25)          ",
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
        add_location(input, file9, 71, 6, 2227);
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
      source: "(68:23)        ",
      ctx
    });
    return block;
  }
  function create_fragment9(ctx) {
    let section;
    let header;
    let button;
    let t0_value = (
      /*expanded*/
      ctx[0] ? "\u25B2" : "\u25BC"
    );
    let t0;
    let t1;
    let t2;
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
    const if_block_creators = [create_if_block5, create_if_block_14];
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
        t0 = text(t0_value);
        t1 = space();
        if (heading_slot)
          heading_slot.c();
        t2 = space();
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
        t0 = claim_text(button_nodes, t0_value);
        button_nodes.forEach(detach_dev);
        t1 = claim_space(header_nodes);
        if (heading_slot)
          heading_slot.l(header_nodes);
        header_nodes.forEach(detach_dev);
        t2 = claim_space(section_nodes);
        if (if_block)
          if_block.l(section_nodes);
        section_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "align-middle text-base");
        add_location(button, file9, 65, 4, 1988);
        attr_dev(header, "class", "text-sm mb-2");
        add_location(header, file9, 64, 2, 1954);
        attr_dev(section, "class", "p-4 border-b border-b-gray-100 border-solid");
        add_location(section, file9, 63, 0, 1890);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, section, anchor);
        append_hydration_dev(section, header);
        append_hydration_dev(header, button);
        append_hydration_dev(button, t0);
        append_hydration_dev(header, t1);
        if (heading_slot) {
          heading_slot.m(header, null);
        }
        append_hydration_dev(section, t2);
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
        if ((!current || dirty & /*expanded*/
        1) && t0_value !== (t0_value = /*expanded*/
        ctx2[0] ? "\u25B2" : "\u25BC"))
          set_data_dev(t0, t0_value);
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
      id: create_fragment9.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance9($$self, $$props, $$invalidate) {
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
      init2(this, options, instance9, create_fragment9, safe_not_equal, {
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
        id: create_fragment9.name
      });
    }
    get value() {
      throw new Error("<SidebarSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set value(value) {
      throw new Error("<SidebarSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get astNodes() {
      throw new Error("<SidebarSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set astNodes(value) {
      throw new Error("<SidebarSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get clearOnUpdate() {
      throw new Error("<SidebarSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set clearOnUpdate(value) {
      throw new Error("<SidebarSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get expanded() {
      throw new Error("<SidebarSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set expanded(value) {
      throw new Error("<SidebarSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get placeholder() {
      throw new Error("<SidebarSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set placeholder(value) {
      throw new Error("<SidebarSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get large() {
      throw new Error("<SidebarSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set large(value) {
      throw new Error("<SidebarSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
  var SidebarSection_default = SidebarSection;

  // svelte/components/PropertiesSidebar.svelte
  var { Object: Object_1 } = globals;
  var file10 = "svelte/components/PropertiesSidebar.svelte";
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
        if (get_svelte_dataset(div) !== "svelte-wl19d2")
          div.textContent = textContent;
        this.h();
      },
      h: function hydrate() {
        attr_dev(div, "class", "pt-8");
        add_location(div, file10, 180, 6, 8038);
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
      source: "(194:4) {:else}",
      ctx
    });
    return block;
  }
  function create_if_block6(ctx) {
    let div0;
    let t0;
    let t1;
    let t2;
    let button;
    let textContent = "\xD7";
    let t4;
    let t5;
    let div1;
    let t6;
    let t7;
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
        button.textContent = textContent;
        t4 = space();
        if (if_block1)
          if_block1.c();
        t5 = space();
        div1 = element("div");
        if (if_block2)
          if_block2.c();
        t6 = space();
        if (if_block3)
          if_block3.c();
        t7 = space();
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
        button = claim_element(div0_nodes, "BUTTON", {
          type: true,
          class: true,
          ["data-svelte-h"]: true
        });
        if (get_svelte_dataset(button) !== "svelte-mxviez")
          button.textContent = textContent;
        div0_nodes.forEach(detach_dev);
        t4 = claim_space(nodes);
        if (if_block1)
          if_block1.l(nodes);
        t5 = claim_space(nodes);
        div1 = claim_element(nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        if (if_block2)
          if_block2.l(div1_nodes);
        t6 = claim_space(div1_nodes);
        if (if_block3)
          if_block3.l(div1_nodes);
        div1_nodes.forEach(detach_dev);
        t7 = claim_space(nodes);
        claim_component(sidebarsection.$$.fragment, nodes);
        this.h();
      },
      h: function hydrate() {
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "absolute py-3 top-3 right-1");
        add_location(button, file10, 121, 8, 5640);
        attr_dev(div0, "class", "border-b text-lg font-medium leading-5 pt-7 pr-7 pb-5 pl-4 relative");
        add_location(div0, file10, 113, 6, 5342);
        attr_dev(div1, "class", "relative");
        add_location(div1, file10, 143, 6, 6594);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, div0, anchor);
        append_hydration_dev(div0, t0);
        append_hydration_dev(div0, t1);
        if (if_block0)
          if_block0.m(div0, null);
        append_hydration_dev(div0, t2);
        append_hydration_dev(div0, button);
        insert_hydration_dev(target, t4, anchor);
        if (if_block1)
          if_block1.m(target, anchor);
        insert_hydration_dev(target, t5, anchor);
        insert_hydration_dev(target, div1, anchor);
        if (if_block2)
          if_block2.m(div1, null);
        append_hydration_dev(div1, t6);
        if (if_block3)
          if_block3.m(div1, null);
        insert_hydration_dev(target, t7, anchor);
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
            if_block1.m(t5.parentNode, t5);
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
            if_block2.m(div1, t6);
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
          detach_dev(t4);
          detach_dev(t5);
          detach_dev(div1);
          detach_dev(t7);
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
      id: create_if_block6.name,
      type: "if",
      source: "(127:4) {#if $selectedAstElement}",
      ctx
    });
    return block;
  }
  function create_if_block_44(ctx) {
    let button;
    let textContent = "\u21B0";
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
        if (get_svelte_dataset(button) !== "svelte-gvqlvr")
          button.textContent = textContent;
        this.h();
      },
      h: function hydrate() {
        attr_dev(button, "type", "button");
        attr_dev(button, "class", "absolute py-3 top-3 right-5");
        add_location(button, file10, 116, 10, 5483);
      },
      m: function mount(target, anchor) {
        insert_hydration_dev(target, button, anchor);
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
      source: "(141:6) {#if attributesEditable}",
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
      source: '(143:10) <svelte:fragment slot=\\"heading\\">',
      ctx
    });
    return block;
  }
  function create_default_slot2(ctx) {
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
      id: create_default_slot2.name,
      type: "slot",
      source: "(146:14) <Pill on:delete={() => deleteClass(className)}>",
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
        $$slots: { default: [create_default_slot2] },
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
      source: "(145:12) {#each classList as className}",
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
      source: '(144:10) <svelte:fragment slot=\\"value\\">',
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
      source: '(153:12) <svelte:fragment slot=\\"heading\\">',
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
      source: "(150:8) {#each editableAttrs as entry (entry)}",
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
        div1 = claim_element(nodes, "DIV", { class: true });
        var div1_nodes = children(div1);
        div0 = claim_element(div1_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
        if (get_svelte_dataset(div0) !== "svelte-1mbq8po")
          div0.textContent = textContent;
        div1_nodes.forEach(detach_dev);
        this.h();
      },
      h: function hydrate() {
        attr_dev(div0, "class", "flex rounded-lg outline-dashed outline-2 h-full text-center justify-center items-center");
        add_location(div0, file10, 152, 12, 6985);
        attr_dev(div1, "class", "absolute h-8 bg-white opacity-70 w-full h-full p-4");
        toggle_class(
          div1,
          "opacity-90",
          /*isDraggingOver*/
          ctx[3]
        );
        add_location(div1, file10, 145, 10, 6695);
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
      source: '(159:8) {#if $draggedObject && $draggedObject.category === \\"basic\\"}',
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
      source: "(172:8) {#if $selectedAstElement.content.length > 0}",
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
      source: '(178:12) <svelte:fragment slot=\\"heading\\">',
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
      source: '(184:8) <svelte:fragment slot=\\"heading\\">',
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
        add_location(button, file10, 171, 10, 7735);
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
      source: '(185:8) <svelte:fragment slot=\\"input\\">',
      ctx
    });
    return block;
  }
  function create_fragment10(ctx) {
    let div1;
    let div0;
    let current_block_type_index;
    let if_block;
    let current;
    const if_block_creators = [create_if_block6, create_else_block4];
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
        add_location(div0, file10, 111, 2, 5279);
        attr_dev(div1, "class", "w-64 bg-white");
        attr_dev(div1, "data-test-id", "right-sidebar");
        add_location(div1, file10, 110, 0, 5220);
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
      id: create_fragment10.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function instance10($$self, $$props, $$invalidate) {
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
      init2(this, options, instance10, create_fragment10, safe_not_equal, { live: 18 }, null, [-1, -1]);
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PropertiesSidebar",
        options,
        id: create_fragment10.name
      });
    }
    get live() {
      throw new Error("<PropertiesSidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set live(value) {
      throw new Error("<PropertiesSidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
  var PropertiesSidebar_default = PropertiesSidebar;

  // svelte/components/UiBuilder.svelte
  var UiBuilder_exports = {};
  __export(UiBuilder_exports, {
    default: () => UiBuilder_default
  });
  var file11 = "svelte/components/UiBuilder.svelte";
  function create_fragment11(ctx) {
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
      ctx[3]
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
        add_location(div, file11, 18, 0, 464);
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
      id: create_fragment11.name,
      type: "component",
      source: "",
      ctx
    });
    return block;
  }
  function addBasicComponentToTarget(e) {
  }
  function instance11($$self, $$props, $$invalidate) {
    let $pageStore;
    validate_store(page, "pageStore");
    component_subscribe($$self, page, ($$value) => $$invalidate(4, $pageStore = $$value));
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("UiBuilder", slots, []);
    let { components } = $$props;
    let { page: page2 } = $$props;
    let { live } = $$props;
    $$self.$$.on_mount.push(function() {
      if (components === void 0 && !("components" in $$props || $$self.$$.bound[$$self.$$.props["components"]])) {
        console.warn("<UiBuilder> was created without expected prop 'components'");
      }
      if (page2 === void 0 && !("page" in $$props || $$self.$$.bound[$$self.$$.props["page"]])) {
        console.warn("<UiBuilder> was created without expected prop 'page'");
      }
      if (live === void 0 && !("live" in $$props || $$self.$$.bound[$$self.$$.props["live"]])) {
        console.warn("<UiBuilder> was created without expected prop 'live'");
      }
    });
    const writable_props = ["components", "page", "live"];
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
      if ("live" in $$props2)
        $$invalidate(1, live = $$props2.live);
    };
    $$self.$capture_state = () => ({
      ComponentsSidebar: ComponentsSidebar_default,
      Backdrop: Backdrop_default,
      PagePreview: PagePreview_default,
      PropertiesSidebar: PropertiesSidebar_default,
      pageStore: page,
      components,
      page: page2,
      live,
      addBasicComponentToTarget,
      $pageStore
    });
    $$self.$inject_state = ($$props2) => {
      if ("components" in $$props2)
        $$invalidate(0, components = $$props2.components);
      if ("page" in $$props2)
        $$invalidate(2, page2 = $$props2.page);
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
    };
    return [components, live, page2, droppedIntoTarget_handler];
  }
  var UiBuilder = class extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init2(this, options, instance11, create_fragment11, safe_not_equal, { components: 0, page: 2, live: 1 });
      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "UiBuilder",
        options,
        id: create_fragment11.name
      });
    }
    get components() {
      throw new Error("<UiBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set components(value) {
      throw new Error("<UiBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get page() {
      throw new Error("<UiBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set page(value) {
      throw new Error("<UiBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    get live() {
      throw new Error("<UiBuilder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
    set live(value) {
      throw new Error("<UiBuilder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  };
  var UiBuilder_default = UiBuilder;

  // import-glob:../svelte/**/*.svelte
  var modules = [Backdrop_exports, BrowserFrame_exports, CodeEditor_exports, ComponentsSidebar_exports, LayoutAstNode_exports, PageAstNode_exports, PagePreview_exports, Pill_exports, PropertiesSidebar_exports, SidebarSection_exports, UiBuilder_exports];
  var __default = modules;
  var filenames = ["../svelte/components/Backdrop.svelte", "../svelte/components/BrowserFrame.svelte", "../svelte/components/CodeEditor.svelte", "../svelte/components/ComponentsSidebar.svelte", "../svelte/components/LayoutAstNode.svelte", "../svelte/components/PageAstNode.svelte", "../svelte/components/PagePreview.svelte", "../svelte/components/Pill.svelte", "../svelte/components/PropertiesSidebar.svelte", "../svelte/components/SidebarSection.svelte", "../svelte/components/UiBuilder.svelte"];

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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vYXNzZXRzL2pzL2JlYWNvbl9saXZlX2FkbWluLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy9fdmlydHVhbC9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3RhdGUtbG9jYWwvbGliL2VzL3N0YXRlLWxvY2FsLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy9jb25maWcvaW5kZXguanMiLCAiLi4vLi4vZGVwcy9saXZlX21vbmFjb19lZGl0b3IvYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3V0aWxzL2N1cnJ5LmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy91dGlscy9pc09iamVjdC5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdmFsaWRhdG9ycy9pbmRleC5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvY29tcG9zZS5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvZGVlcE1lcmdlLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy91dGlscy9tYWtlQ2FuY2VsYWJsZS5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvbG9hZGVyL2luZGV4LmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9tb25hY29fZWRpdG9yL2Fzc2V0cy9qcy9saXZlX21vbmFjb19lZGl0b3IvZWRpdG9yL3RoZW1lcy5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvanMvbGl2ZV9tb25hY29fZWRpdG9yL2VkaXRvci9jb2RlX2VkaXRvci5qcyIsICIuLi8uLi9kZXBzL2xpdmVfbW9uYWNvX2VkaXRvci9hc3NldHMvanMvbGl2ZV9tb25hY29fZWRpdG9yL2hvb2tzL2NvZGVfZWRpdG9yLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9zdmVsdGUvYXNzZXRzL2pzL2xpdmVfc3ZlbHRlL3V0aWxzLmpzIiwgIi4uLy4uL2RlcHMvbGl2ZV9zdmVsdGUvYXNzZXRzL2pzL2xpdmVfc3ZlbHRlL3JlbmRlci5qcyIsICIuLi8uLi9kZXBzL2xpdmVfc3ZlbHRlL2Fzc2V0cy9qcy9saXZlX3N2ZWx0ZS9ob29rcy5qcyIsICJpbXBvcnQtZ2xvYjouLi9zdmVsdGUvKiovKi5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvdXRpbHMuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvZW52aXJvbm1lbnQuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvbG9vcC5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9nbG9iYWxzLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL1Jlc2l6ZU9ic2VydmVyU2luZ2xldG9uLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2RvbS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zdHlsZV9tYW5hZ2VyLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2xpZmVjeWNsZS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zY2hlZHVsZXIuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvdHJhbnNpdGlvbnMuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvaW50ZXJuYWwvZWFjaC5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9zcHJlYWQuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3NoYXJlZC9ib29sZWFuX2F0dHJpYnV0ZXMuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3NoYXJlZC91dGlscy9uYW1lcy5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9Db21wb25lbnQuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3NoYXJlZC92ZXJzaW9uLmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL2ludGVybmFsL2Rldi5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N2ZWx0ZS9zcmMvcnVudGltZS9pbnRlcm5hbC9kaXNjbG9zZS12ZXJzaW9uL2luZGV4LmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvc3ZlbHRlL3NyYy9ydW50aW1lL3RyYW5zaXRpb24vaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9zdmVsdGUvc3JjL3J1bnRpbWUvc3RvcmUvaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL0JhY2tkcm9wLnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvQnJvd3NlckZyYW1lLnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvX3ZpcnR1YWwvX3JvbGx1cFBsdWdpbkJhYmVsSGVscGVycy5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL3N0YXRlLWxvY2FsL2xpYi9lcy9zdGF0ZS1sb2NhbC5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvY29uZmlnL2luZGV4LmpzIiwgIi4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvQG1vbmFjby1lZGl0b3IvbG9hZGVyL2xpYi9lcy91dGlscy9jdXJyeS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvaXNPYmplY3QuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3ZhbGlkYXRvcnMvaW5kZXguanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3V0aWxzL2NvbXBvc2UuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL3V0aWxzL2RlZXBNZXJnZS5qcyIsICIuLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL0Btb25hY28tZWRpdG9yL2xvYWRlci9saWIvZXMvdXRpbHMvbWFrZUNhbmNlbGFibGUuanMiLCAiLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9AbW9uYWNvLWVkaXRvci9sb2FkZXIvbGliL2VzL2xvYWRlci9pbmRleC5qcyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvQ29kZUVkaXRvci5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS91dGlscy9hbmltYXRpb25zLnRzIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvc3RvcmVzL2N1cnJlbnRDb21wb25lbnRDYXRlZ29yeS50cyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL3N0b3Jlcy9kcmFnQW5kRHJvcC50cyIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvc3RvcmVzL3BhZ2UudHMiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL0xheW91dEFzdE5vZGUuc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvY29tcG9uZW50cy9QYWdlQXN0Tm9kZS5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VQcmV2aWV3LnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvUGlsbC5zdmVsdGUiLCAiLi4vLi4vYXNzZXRzL3N2ZWx0ZS9jb21wb25lbnRzL1NpZGViYXJTZWN0aW9uLnN2ZWx0ZSIsICIuLi8uLi9hc3NldHMvc3ZlbHRlL2NvbXBvbmVudHMvUHJvcGVydGllc1NpZGViYXIuc3ZlbHRlIiwgIi4uLy4uL2Fzc2V0cy9zdmVsdGUvY29tcG9uZW50cy9VaUJ1aWxkZXIuc3ZlbHRlIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIEBsaWNlbnNlIE1JVFxuICogdG9wYmFyIDIuMC4wLCAyMDIzLTAyLTA0XG4gKiBodHRwczovL2J1dW5ndXllbi5naXRodWIuaW8vdG9wYmFyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjEgQnV1IE5ndXllblxuICovXG4oZnVuY3Rpb24gKHdpbmRvdywgZG9jdW1lbnQpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzFcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHZhciB2ZW5kb3JzID0gW1wibXNcIiwgXCJtb3pcIiwgXCJ3ZWJraXRcIiwgXCJvXCJdO1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHxcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICB9XG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xuICAgICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpO1xuICAgICAgICB9LCB0aW1lVG9DYWxsKTtcbiAgICAgICAgbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH07XG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH07XG4gIH0pKCk7XG5cbiAgdmFyIGNhbnZhcyxcbiAgICBjdXJyZW50UHJvZ3Jlc3MsXG4gICAgc2hvd2luZyxcbiAgICBwcm9ncmVzc1RpbWVySWQgPSBudWxsLFxuICAgIGZhZGVUaW1lcklkID0gbnVsbCxcbiAgICBkZWxheVRpbWVySWQgPSBudWxsLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoZGVsYXkpIHtcbiAgICAgICAgaWYgKHNob3dpbmcpIHJldHVybjtcbiAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgaWYgKGRlbGF5VGltZXJJZCkgcmV0dXJuO1xuICAgICAgICAgIGRlbGF5VGltZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4gdG9wYmFyLnNob3coKSwgZGVsYXkpO1xuICAgICAgICB9IGVsc2UgIHtcbiAgICAgICAgICBzaG93aW5nID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgICAgaWYgKCFjYW52YXMpIGNyZWF0ZUNhbnZhcygpO1xuICAgICAgICAgIGNhbnZhcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICB0b3BiYXIucHJvZ3Jlc3MoMCk7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuYXV0b1J1bikge1xuICAgICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgICAgICAgIHRvcGJhci5wcm9ncmVzcyhcbiAgICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHByb2dyZXNzOiBmdW5jdGlvbiAodG8pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgICAgaWYgKHR5cGVvZiB0byA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIHRvID1cbiAgICAgICAgICAgICh0by5pbmRleE9mKFwiK1wiKSA+PSAwIHx8IHRvLmluZGV4T2YoXCItXCIpID49IDBcbiAgICAgICAgICAgICAgPyBjdXJyZW50UHJvZ3Jlc3NcbiAgICAgICAgICAgICAgOiAwKSArIHBhcnNlRmxvYXQodG8pO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRQcm9ncmVzcyA9IHRvID4gMSA/IDEgOiB0bztcbiAgICAgICAgcmVwYWludCgpO1xuICAgICAgICByZXR1cm4gY3VycmVudFByb2dyZXNzO1xuICAgICAgfSxcbiAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGRlbGF5VGltZXJJZCk7XG4gICAgICAgIGRlbGF5VGltZXJJZCA9IG51bGw7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgImltcG9ydCB0b3BiYXIgZnJvbSBcIi4uL3ZlbmRvci90b3BiYXJcIlxuaW1wb3J0IHsgQ29kZUVkaXRvckhvb2sgfSBmcm9tIFwiLi4vLi4vZGVwcy9saXZlX21vbmFjb19lZGl0b3IvcHJpdi9zdGF0aWMvbGl2ZV9tb25hY29fZWRpdG9yLmVzbVwiXG5pbXBvcnQgeyBnZXRIb29rcyB9IGZyb20gXCJsaXZlX3N2ZWx0ZVwiXG5pbXBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gXCIuLi9zdmVsdGUvKiovKi5zdmVsdGVcIlxubGV0IEhvb2tzID0ge31cbkhvb2tzLkNvZGVFZGl0b3JIb29rID0gQ29kZUVkaXRvckhvb2tcbnRvcGJhci5jb25maWcoeyBiYXJDb2xvcnM6IHsgMDogXCIjMjlkXCIgfSwgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAwLCAwLCAuMylcIiB9KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIChfaW5mbykgPT4gdG9wYmFyLnNob3coMzAwKSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIChfaW5mbykgPT4gdG9wYmFyLmhpZGUoKSlcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsbWU6ZWRpdG9yX21vdW50ZWRcIiwgKGV2KSA9PiB7XG4gIGNvbnN0IGhvb2sgPSBldi5kZXRhaWwuaG9va1xuICBjb25zdCBlZGl0b3IgPSBldi5kZXRhaWwuZWRpdG9yLnN0YW5kYWxvbmVfY29kZV9lZGl0b3JcbiAgY29uc3QgZXZlbnROYW1lID0gZXYuZGV0YWlsLmVkaXRvci5wYXRoICsgXCJfZWRpdG9yX2xvc3RfZm9jdXNcIlxuXG4gIGVkaXRvci5vbkRpZEJsdXJFZGl0b3JXaWRnZXQoKCkgPT4ge1xuICAgIGhvb2sucHVzaEV2ZW50KGV2ZW50TmFtZSwgeyB2YWx1ZTogZWRpdG9yLmdldFZhbHVlKCkgfSlcbiAgfSlcbn0pXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVhY29uX2FkbWluOmNsaXBjb3B5XCIsIChldmVudCkgPT4ge1xuICBjb25zdCByZXN1bHRfaWQgPSBgJHtldmVudC50YXJnZXQuaWR9LWNvcHktdG8tY2xpcGJvYXJkLXJlc3VsdGBcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyZXN1bHRfaWQpXG5cbiAgaWYgKFwiY2xpcGJvYXJkXCIgaW4gbmF2aWdhdG9yKSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSBcIklOUFVUXCIpIHtcbiAgICAgIHR4dCA9IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0eHQgPSBldmVudC50YXJnZXQudGV4dENvbnRlbnRcbiAgICB9XG5cbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkXG4gICAgICAud3JpdGVUZXh0KHR4dClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJDb3BpZWQgdG8gY2xpcGJvYXJkXCJcbiAgICAgICAgLy8gTWFrZSBpdCB2aXNpYmxlXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJpbnZpc2libGVcIiwgXCJ0ZXh0LXJlZC01MDBcIiwgXCJvcGFjaXR5LTBcIilcbiAgICAgICAgLy8gRmFkZSBpbiBhbmQgdHJhbnNsYXRlIHVwd2FyZHNcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInRleHQtZ3JlZW4tNTAwXCIsIFwib3BhY2l0eS0xMDBcIiwgXCItdHJhbnNsYXRlLXktMlwiKVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJ0ZXh0LWdyZWVuLTUwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwiLXRyYW5zbGF0ZS15LTJcIilcbiAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiaW52aXNpYmxlXCIsIFwidGV4dC1yZWQtNTAwXCIsIFwib3BhY2l0eS0wXCIpXG4gICAgICAgIH0sIDIwMDApXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJDb3VsZCBub3QgY29weVwiXG4gICAgICAgIC8vIE1ha2UgaXQgdmlzaWJsZVxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiaW52aXNpYmxlXCIsIFwidGV4dC1ncmVlbi01MDBcIiwgXCJvcGFjaXR5LTBcIilcbiAgICAgICAgLy8gRmFkZSBpbiBhbmQgdHJhbnNsYXRlIHVwd2FyZHNcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInRleHQtcmVkLTUwMFwiLCBcIm9wYWNpdHktMTAwXCIsIFwiLXRyYW5zbGF0ZS15LTJcIilcbiAgICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYWxlcnQoXCJTb3JyeSwgeW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgY2xpcGJvYXJkIGNvcHkuXCIpXG4gIH1cbn0pXG5cbmxldCBzb2NrZXRQYXRoID1cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuZ2V0QXR0cmlidXRlKFwicGh4LXNvY2tldFwiKSB8fCBcIi9saXZlXCJcbmxldCBjc3JmVG9rZW4gPSBkb2N1bWVudFxuICAucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpXG4gIC5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXG5sZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlVmlldy5MaXZlU29ja2V0KHNvY2tldFBhdGgsIFBob2VuaXguU29ja2V0LCB7XG4gIGhvb2tzOiB7IC4uLmdldEhvb2tzKENvbXBvbmVudHMpLCAuLi5Ib29rcyB9LFxuICBwYXJhbXM6IHsgX2NzcmZfdG9rZW46IGNzcmZUb2tlbiB9LFxufSlcbmxpdmVTb2NrZXQuY29ubmVjdCgpXG53aW5kb3cubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiIsICJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pO1xuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkMih0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCkge1xuICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7fTtcbiAgdmFyIHRhcmdldCA9IHt9O1xuICB2YXIgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSk7XG4gIHZhciBrZXksIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuXG4gIHZhciB0YXJnZXQgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKTtcblxuICB2YXIga2V5LCBpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHNvdXJjZVN5bWJvbEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZSk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gc291cmNlU3ltYm9sS2V5c1tpXTtcbiAgICAgIGlmIChleGNsdWRlZC5pbmRleE9mKGtleSkgPj0gMCkgY29udGludWU7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gIHJldHVybiBhcnIyO1xufVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufVxuXG5leHBvcnQgeyBfYXJyYXlMaWtlVG9BcnJheSBhcyBhcnJheUxpa2VUb0FycmF5LCBfYXJyYXlXaXRoSG9sZXMgYXMgYXJyYXlXaXRoSG9sZXMsIF9kZWZpbmVQcm9wZXJ0eSBhcyBkZWZpbmVQcm9wZXJ0eSwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0IGFzIGl0ZXJhYmxlVG9BcnJheUxpbWl0LCBfbm9uSXRlcmFibGVSZXN0IGFzIG5vbkl0ZXJhYmxlUmVzdCwgX29iamVjdFNwcmVhZDIgYXMgb2JqZWN0U3ByZWFkMiwgX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzIGFzIG9iamVjdFdpdGhvdXRQcm9wZXJ0aWVzLCBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZSBhcyBvYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlLCBfc2xpY2VkVG9BcnJheSBhcyBzbGljZWRUb0FycmF5LCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgYXMgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgfTtcbiIsICJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpO1xuICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlO1xuICAgIH0pO1xuICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkMih0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgIGlmIChpICUgMikge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gZm5zLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uICh5LCBmKSB7XG4gICAgICByZXR1cm4gZih5KTtcbiAgICB9LCB4KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3VycnkoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGN1cnJpZWQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiBhcmdzLmxlbmd0aCA+PSBmbi5sZW5ndGggPyBmbi5hcHBseSh0aGlzLCBhcmdzKSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgbmV4dEFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgbmV4dEFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGN1cnJpZWQuYXBwbHkoX3RoaXMsIFtdLmNvbmNhdChhcmdzLCBuZXh0QXJncykpO1xuICAgIH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKS5pbmNsdWRlcygnT2JqZWN0Jyk7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XG4gIHJldHVybiAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNoYW5nZXMoaW5pdGlhbCwgY2hhbmdlcykge1xuICBpZiAoIWlzT2JqZWN0KGNoYW5nZXMpKSBlcnJvckhhbmRsZXIoJ2NoYW5nZVR5cGUnKTtcbiAgaWYgKE9iamVjdC5rZXlzKGNoYW5nZXMpLnNvbWUoZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgcmV0dXJuICFoYXNPd25Qcm9wZXJ0eShpbml0aWFsLCBmaWVsZCk7XG4gIH0pKSBlcnJvckhhbmRsZXIoJ2NoYW5nZUZpZWxkJyk7XG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gIGlmICghaXNGdW5jdGlvbihzZWxlY3RvcikpIGVycm9ySGFuZGxlcignc2VsZWN0b3JUeXBlJyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlSGFuZGxlcihoYW5kbGVyKSB7XG4gIGlmICghKGlzRnVuY3Rpb24oaGFuZGxlcikgfHwgaXNPYmplY3QoaGFuZGxlcikpKSBlcnJvckhhbmRsZXIoJ2hhbmRsZXJUeXBlJyk7XG4gIGlmIChpc09iamVjdChoYW5kbGVyKSAmJiBPYmplY3QudmFsdWVzKGhhbmRsZXIpLnNvbWUoZnVuY3Rpb24gKF9oYW5kbGVyKSB7XG4gICAgcmV0dXJuICFpc0Z1bmN0aW9uKF9oYW5kbGVyKTtcbiAgfSkpIGVycm9ySGFuZGxlcignaGFuZGxlcnNUeXBlJyk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlSW5pdGlhbChpbml0aWFsKSB7XG4gIGlmICghaW5pdGlhbCkgZXJyb3JIYW5kbGVyKCdpbml0aWFsSXNSZXF1aXJlZCcpO1xuICBpZiAoIWlzT2JqZWN0KGluaXRpYWwpKSBlcnJvckhhbmRsZXIoJ2luaXRpYWxUeXBlJyk7XG4gIGlmIChpc0VtcHR5KGluaXRpYWwpKSBlcnJvckhhbmRsZXIoJ2luaXRpYWxDb250ZW50Jyk7XG59XG5cbmZ1bmN0aW9uIHRocm93RXJyb3IoZXJyb3JNZXNzYWdlcywgdHlwZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlc1t0eXBlXSB8fCBlcnJvck1lc3NhZ2VzW1wiZGVmYXVsdFwiXSk7XG59XG5cbnZhciBlcnJvck1lc3NhZ2VzID0ge1xuICBpbml0aWFsSXNSZXF1aXJlZDogJ2luaXRpYWwgc3RhdGUgaXMgcmVxdWlyZWQnLFxuICBpbml0aWFsVHlwZTogJ2luaXRpYWwgc3RhdGUgc2hvdWxkIGJlIGFuIG9iamVjdCcsXG4gIGluaXRpYWxDb250ZW50OiAnaW5pdGlhbCBzdGF0ZSBzaG91bGRuXFwndCBiZSBhbiBlbXB0eSBvYmplY3QnLFxuICBoYW5kbGVyVHlwZTogJ2hhbmRsZXIgc2hvdWxkIGJlIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uJyxcbiAgaGFuZGxlcnNUeXBlOiAnYWxsIGhhbmRsZXJzIHNob3VsZCBiZSBhIGZ1bmN0aW9ucycsXG4gIHNlbGVjdG9yVHlwZTogJ3NlbGVjdG9yIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyxcbiAgY2hhbmdlVHlwZTogJ3Byb3ZpZGVkIHZhbHVlIG9mIGNoYW5nZXMgc2hvdWxkIGJlIGFuIG9iamVjdCcsXG4gIGNoYW5nZUZpZWxkOiAnaXQgc2VhbXMgeW91IHdhbnQgdG8gY2hhbmdlIGEgZmllbGQgaW4gdGhlIHN0YXRlIHdoaWNoIGlzIG5vdCBzcGVjaWZpZWQgaW4gdGhlIFwiaW5pdGlhbFwiIHN0YXRlJyxcbiAgXCJkZWZhdWx0XCI6ICdhbiB1bmtub3duIGVycm9yIGFjY3VyZWQgaW4gYHN0YXRlLWxvY2FsYCBwYWNrYWdlJ1xufTtcbnZhciBlcnJvckhhbmRsZXIgPSBjdXJyeSh0aHJvd0Vycm9yKShlcnJvck1lc3NhZ2VzKTtcbnZhciB2YWxpZGF0b3JzID0ge1xuICBjaGFuZ2VzOiB2YWxpZGF0ZUNoYW5nZXMsXG4gIHNlbGVjdG9yOiB2YWxpZGF0ZVNlbGVjdG9yLFxuICBoYW5kbGVyOiB2YWxpZGF0ZUhhbmRsZXIsXG4gIGluaXRpYWw6IHZhbGlkYXRlSW5pdGlhbFxufTtcblxuZnVuY3Rpb24gY3JlYXRlKGluaXRpYWwpIHtcbiAgdmFyIGhhbmRsZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICB2YWxpZGF0b3JzLmluaXRpYWwoaW5pdGlhbCk7XG4gIHZhbGlkYXRvcnMuaGFuZGxlcihoYW5kbGVyKTtcbiAgdmFyIHN0YXRlID0ge1xuICAgIGN1cnJlbnQ6IGluaXRpYWxcbiAgfTtcbiAgdmFyIGRpZFVwZGF0ZSA9IGN1cnJ5KGRpZFN0YXRlVXBkYXRlKShzdGF0ZSwgaGFuZGxlcik7XG4gIHZhciB1cGRhdGUgPSBjdXJyeSh1cGRhdGVTdGF0ZSkoc3RhdGUpO1xuICB2YXIgdmFsaWRhdGUgPSBjdXJyeSh2YWxpZGF0b3JzLmNoYW5nZXMpKGluaXRpYWwpO1xuICB2YXIgZ2V0Q2hhbmdlcyA9IGN1cnJ5KGV4dHJhY3RDaGFuZ2VzKShzdGF0ZSk7XG5cbiAgZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICAgIHZhbGlkYXRvcnMuc2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIHJldHVybiBzZWxlY3RvcihzdGF0ZS5jdXJyZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN0YXRlKGNhdXNlZENoYW5nZXMpIHtcbiAgICBjb21wb3NlKGRpZFVwZGF0ZSwgdXBkYXRlLCB2YWxpZGF0ZSwgZ2V0Q2hhbmdlcykoY2F1c2VkQ2hhbmdlcyk7XG4gIH1cblxuICByZXR1cm4gW2dldFN0YXRlLCBzZXRTdGF0ZV07XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RDaGFuZ2VzKHN0YXRlLCBjYXVzZWRDaGFuZ2VzKSB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKGNhdXNlZENoYW5nZXMpID8gY2F1c2VkQ2hhbmdlcyhzdGF0ZS5jdXJyZW50KSA6IGNhdXNlZENoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRlKHN0YXRlLCBjaGFuZ2VzKSB7XG4gIHN0YXRlLmN1cnJlbnQgPSBfb2JqZWN0U3ByZWFkMihfb2JqZWN0U3ByZWFkMih7fSwgc3RhdGUuY3VycmVudCksIGNoYW5nZXMpO1xuICByZXR1cm4gY2hhbmdlcztcbn1cblxuZnVuY3Rpb24gZGlkU3RhdGVVcGRhdGUoc3RhdGUsIGhhbmRsZXIsIGNoYW5nZXMpIHtcbiAgaXNGdW5jdGlvbihoYW5kbGVyKSA/IGhhbmRsZXIoc3RhdGUuY3VycmVudCkgOiBPYmplY3Qua2V5cyhjaGFuZ2VzKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHZhciBfaGFuZGxlciRmaWVsZDtcblxuICAgIHJldHVybiAoX2hhbmRsZXIkZmllbGQgPSBoYW5kbGVyW2ZpZWxkXSkgPT09IG51bGwgfHwgX2hhbmRsZXIkZmllbGQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oYW5kbGVyJGZpZWxkLmNhbGwoaGFuZGxlciwgc3RhdGUuY3VycmVudFtmaWVsZF0pO1xuICB9KTtcbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbnZhciBpbmRleCA9IHtcbiAgY3JlYXRlOiBjcmVhdGVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluZGV4O1xuIiwgInZhciBjb25maWcgPSB7XG4gIHBhdGhzOiB7XG4gICAgdnM6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL21vbmFjby1lZGl0b3JAMC4zNi4xL21pbi92cydcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIiwgImZ1bmN0aW9uIGN1cnJ5KGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjdXJyaWVkKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3MubGVuZ3RoID49IGZuLmxlbmd0aCA/IGZuLmFwcGx5KHRoaXMsIGFyZ3MpIDogZnVuY3Rpb24gKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBuZXh0QXJncyA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICBuZXh0QXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmllZC5hcHBseShfdGhpcywgW10uY29uY2F0KGFyZ3MsIG5leHRBcmdzKSk7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3Vycnk7XG4iLCAiZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpLmluY2x1ZGVzKCdPYmplY3QnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNPYmplY3Q7XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4uL3V0aWxzL2N1cnJ5LmpzJztcbmltcG9ydCBpc09iamVjdCBmcm9tICcuLi91dGlscy9pc09iamVjdC5qcyc7XG5cbi8qKlxuICogdmFsaWRhdGVzIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBhbmQgaW5mb3JtcyBhYm91dCBkZXByZWNhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdCBcbiAqIEByZXR1cm4ge09iamVjdH0gY29uZmlnIC0gdGhlIHZhbGlkYXRlZCBjb25maWd1cmF0aW9uIG9iamVjdFxuICovXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ29uZmlnKGNvbmZpZykge1xuICBpZiAoIWNvbmZpZykgZXJyb3JIYW5kbGVyKCdjb25maWdJc1JlcXVpcmVkJyk7XG4gIGlmICghaXNPYmplY3QoY29uZmlnKSkgZXJyb3JIYW5kbGVyKCdjb25maWdUeXBlJyk7XG5cbiAgaWYgKGNvbmZpZy51cmxzKSB7XG4gICAgaW5mb3JtQWJvdXREZXByZWNhdGlvbigpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXRoczoge1xuICAgICAgICB2czogY29uZmlnLnVybHMubW9uYWNvQmFzZVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufVxuLyoqXG4gKiBsb2dzIGRlcHJlY2F0aW9uIG1lc3NhZ2VcbiAqL1xuXG5cbmZ1bmN0aW9uIGluZm9ybUFib3V0RGVwcmVjYXRpb24oKSB7XG4gIGNvbnNvbGUud2FybihlcnJvck1lc3NhZ2VzLmRlcHJlY2F0aW9uKTtcbn1cblxuZnVuY3Rpb24gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2VzLCB0eXBlKSB7XG4gIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2VzW3R5cGVdIHx8IGVycm9yTWVzc2FnZXNbXCJkZWZhdWx0XCJdKTtcbn1cblxudmFyIGVycm9yTWVzc2FnZXMgPSB7XG4gIGNvbmZpZ0lzUmVxdWlyZWQ6ICd0aGUgY29uZmlndXJhdGlvbiBvYmplY3QgaXMgcmVxdWlyZWQnLFxuICBjb25maWdUeXBlOiAndGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHNob3VsZCBiZSBhbiBvYmplY3QnLFxuICBcImRlZmF1bHRcIjogJ2FuIHVua25vd24gZXJyb3IgYWNjdXJlZCBpbiBgQG1vbmFjby1lZGl0b3IvbG9hZGVyYCBwYWNrYWdlJyxcbiAgZGVwcmVjYXRpb246IFwiRGVwcmVjYXRpb24gd2FybmluZyFcXG4gICAgWW91IGFyZSB1c2luZyBkZXByZWNhdGVkIHdheSBvZiBjb25maWd1cmF0aW9uLlxcblxcbiAgICBJbnN0ZWFkIG9mIHVzaW5nXFxuICAgICAgbW9uYWNvLmNvbmZpZyh7IHVybHM6IHsgbW9uYWNvQmFzZTogJy4uLicgfSB9KVxcbiAgICB1c2VcXG4gICAgICBtb25hY28uY29uZmlnKHsgcGF0aHM6IHsgdnM6ICcuLi4nIH0gfSlcXG5cXG4gICAgRm9yIG1vcmUgcGxlYXNlIGNoZWNrIHRoZSBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9zdXJlbi1hdG95YW4vbW9uYWNvLWxvYWRlciNjb25maWdcXG4gIFwiXG59O1xudmFyIGVycm9ySGFuZGxlciA9IGN1cnJ5KHRocm93RXJyb3IpKGVycm9yTWVzc2FnZXMpO1xudmFyIHZhbGlkYXRvcnMgPSB7XG4gIGNvbmZpZzogdmFsaWRhdGVDb25maWdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZhbGlkYXRvcnM7XG5leHBvcnQgeyBlcnJvckhhbmRsZXIsIGVycm9yTWVzc2FnZXMgfTtcbiIsICJ2YXIgY29tcG9zZSA9IGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZm5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGZucy5yZWR1Y2VSaWdodChmdW5jdGlvbiAoeSwgZikge1xuICAgICAgcmV0dXJuIGYoeSk7XG4gICAgfSwgeCk7XG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb21wb3NlO1xuIiwgImltcG9ydCB7IG9iamVjdFNwcmVhZDIgYXMgX29iamVjdFNwcmVhZDIgfSBmcm9tICcuLi9fdmlydHVhbC9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLmpzJztcblxuZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoc291cmNlW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgIGlmICh0YXJnZXRba2V5XSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKHNvdXJjZVtrZXldLCBtZXJnZSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIHRhcmdldCksIHNvdXJjZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlO1xuIiwgIi8vIFRoZSBzb3VyY2UgKGhhcyBiZWVuIGNoYW5nZWQpIGlzIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvNTQ2NSNpc3N1ZWNvbW1lbnQtMTU3ODg4MzI1XG52YXIgQ0FOQ0VMQVRJT05fTUVTU0FHRSA9IHtcbiAgdHlwZTogJ2NhbmNlbGF0aW9uJyxcbiAgbXNnOiAnb3BlcmF0aW9uIGlzIG1hbnVhbGx5IGNhbmNlbGVkJ1xufTtcblxuZnVuY3Rpb24gbWFrZUNhbmNlbGFibGUocHJvbWlzZSkge1xuICB2YXIgaGFzQ2FuY2VsZWRfID0gZmFsc2U7XG4gIHZhciB3cmFwcGVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuIGhhc0NhbmNlbGVkXyA/IHJlamVjdChDQU5DRUxBVElPTl9NRVNTQUdFKSA6IHJlc29sdmUodmFsKTtcbiAgICB9KTtcbiAgICBwcm9taXNlW1wiY2F0Y2hcIl0ocmVqZWN0KTtcbiAgfSk7XG4gIHJldHVybiB3cmFwcGVkUHJvbWlzZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGhhc0NhbmNlbGVkXyA9IHRydWU7XG4gIH0sIHdyYXBwZWRQcm9taXNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtYWtlQ2FuY2VsYWJsZTtcbmV4cG9ydCB7IENBTkNFTEFUSU9OX01FU1NBR0UgfTtcbiIsICJpbXBvcnQgeyBzbGljZWRUb0FycmF5IGFzIF9zbGljZWRUb0FycmF5LCBvYmplY3RXaXRob3V0UHJvcGVydGllcyBhcyBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMgfSBmcm9tICcuLi9fdmlydHVhbC9fcm9sbHVwUGx1Z2luQmFiZWxIZWxwZXJzLmpzJztcbmltcG9ydCBzdGF0ZSBmcm9tICdzdGF0ZS1sb2NhbCc7XG5pbXBvcnQgY29uZmlnJDEgZnJvbSAnLi4vY29uZmlnL2luZGV4LmpzJztcbmltcG9ydCB2YWxpZGF0b3JzIGZyb20gJy4uL3ZhbGlkYXRvcnMvaW5kZXguanMnO1xuaW1wb3J0IGNvbXBvc2UgZnJvbSAnLi4vdXRpbHMvY29tcG9zZS5qcyc7XG5pbXBvcnQgbWVyZ2UgZnJvbSAnLi4vdXRpbHMvZGVlcE1lcmdlLmpzJztcbmltcG9ydCBtYWtlQ2FuY2VsYWJsZSBmcm9tICcuLi91dGlscy9tYWtlQ2FuY2VsYWJsZS5qcyc7XG5cbi8qKiB0aGUgbG9jYWwgc3RhdGUgb2YgdGhlIG1vZHVsZSAqL1xuXG52YXIgX3N0YXRlJGNyZWF0ZSA9IHN0YXRlLmNyZWF0ZSh7XG4gIGNvbmZpZzogY29uZmlnJDEsXG4gIGlzSW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICByZXNvbHZlOiBudWxsLFxuICByZWplY3Q6IG51bGwsXG4gIG1vbmFjbzogbnVsbFxufSksXG4gICAgX3N0YXRlJGNyZWF0ZTIgPSBfc2xpY2VkVG9BcnJheShfc3RhdGUkY3JlYXRlLCAyKSxcbiAgICBnZXRTdGF0ZSA9IF9zdGF0ZSRjcmVhdGUyWzBdLFxuICAgIHNldFN0YXRlID0gX3N0YXRlJGNyZWF0ZTJbMV07XG4vKipcbiAqIHNldCB0aGUgbG9hZGVyIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSB0aGUgY29uZmlndXJhdGlvbiBvYmplY3RcbiAqL1xuXG5cbmZ1bmN0aW9uIGNvbmZpZyhnbG9iYWxDb25maWcpIHtcbiAgdmFyIF92YWxpZGF0b3JzJGNvbmZpZyA9IHZhbGlkYXRvcnMuY29uZmlnKGdsb2JhbENvbmZpZyksXG4gICAgICBtb25hY28gPSBfdmFsaWRhdG9ycyRjb25maWcubW9uYWNvLFxuICAgICAgY29uZmlnID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF92YWxpZGF0b3JzJGNvbmZpZywgW1wibW9uYWNvXCJdKTtcblxuICBzZXRTdGF0ZShmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiBtZXJnZShzdGF0ZS5jb25maWcsIGNvbmZpZyksXG4gICAgICBtb25hY286IG1vbmFjb1xuICAgIH07XG4gIH0pO1xufVxuLyoqXG4gKiBoYW5kbGVzIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgbW9uYWNvLWVkaXRvclxuICogQHJldHVybiB7UHJvbWlzZX0gLSByZXR1cm5zIGFuIGluc3RhbmNlIG9mIG1vbmFjbyAod2l0aCBhIGNhbmNlbGFibGUgcHJvbWlzZSlcbiAqL1xuXG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBzdGF0ZSA9IGdldFN0YXRlKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIG1vbmFjbyA9IF9yZWYubW9uYWNvLFxuICAgICAgICBpc0luaXRpYWxpemVkID0gX3JlZi5pc0luaXRpYWxpemVkLFxuICAgICAgICByZXNvbHZlID0gX3JlZi5yZXNvbHZlO1xuICAgIHJldHVybiB7XG4gICAgICBtb25hY286IG1vbmFjbyxcbiAgICAgIGlzSW5pdGlhbGl6ZWQ6IGlzSW5pdGlhbGl6ZWQsXG4gICAgICByZXNvbHZlOiByZXNvbHZlXG4gICAgfTtcbiAgfSk7XG5cbiAgaWYgKCFzdGF0ZS5pc0luaXRpYWxpemVkKSB7XG4gICAgc2V0U3RhdGUoe1xuICAgICAgaXNJbml0aWFsaXplZDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKHN0YXRlLm1vbmFjbykge1xuICAgICAgc3RhdGUucmVzb2x2ZShzdGF0ZS5tb25hY28pO1xuICAgICAgcmV0dXJuIG1ha2VDYW5jZWxhYmxlKHdyYXBwZXJQcm9taXNlKTtcbiAgICB9XG5cbiAgICBpZiAod2luZG93Lm1vbmFjbyAmJiB3aW5kb3cubW9uYWNvLmVkaXRvcikge1xuICAgICAgc3RvcmVNb25hY29JbnN0YW5jZSh3aW5kb3cubW9uYWNvKTtcbiAgICAgIHN0YXRlLnJlc29sdmUod2luZG93Lm1vbmFjbyk7XG4gICAgICByZXR1cm4gbWFrZUNhbmNlbGFibGUod3JhcHBlclByb21pc2UpO1xuICAgIH1cblxuICAgIGNvbXBvc2UoaW5qZWN0U2NyaXB0cywgZ2V0TW9uYWNvTG9hZGVyU2NyaXB0KShjb25maWd1cmVMb2FkZXIpO1xuICB9XG5cbiAgcmV0dXJuIG1ha2VDYW5jZWxhYmxlKHdyYXBwZXJQcm9taXNlKTtcbn1cbi8qKlxuICogaW5qZWN0cyBwcm92aWRlZCBzY3JpcHRzIGludG8gdGhlIGRvY3VtZW50LmJvZHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY3JpcHQgLSBhbiBIVE1MIHNjcmlwdCBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gdGhlIGluamVjdGVkIEhUTUwgc2NyaXB0IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGluamVjdFNjcmlwdHMoc2NyaXB0KSB7XG4gIHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG4vKipcbiAqIGNyZWF0ZXMgYW4gSFRNTCBzY3JpcHQgZWxlbWVudCB3aXRoL3dpdGhvdXQgcHJvdmlkZWQgc3JjXG4gKiBAcGFyYW0ge3N0cmluZ30gW3NyY10gLSB0aGUgc291cmNlIHBhdGggb2YgdGhlIHNjcmlwdFxuICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBjcmVhdGVkIEhUTUwgc2NyaXB0IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVNjcmlwdChzcmMpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICByZXR1cm4gc3JjICYmIChzY3JpcHQuc3JjID0gc3JjKSwgc2NyaXB0O1xufVxuLyoqXG4gKiBjcmVhdGVzIGFuIEhUTUwgc2NyaXB0IGVsZW1lbnQgd2l0aCB0aGUgbW9uYWNvIGxvYWRlciBzcmNcbiAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgY3JlYXRlZCBIVE1MIHNjcmlwdCBlbGVtZW50XG4gKi9cblxuXG5mdW5jdGlvbiBnZXRNb25hY29Mb2FkZXJTY3JpcHQoY29uZmlndXJlTG9hZGVyKSB7XG4gIHZhciBzdGF0ZSA9IGdldFN0YXRlKGZ1bmN0aW9uIChfcmVmMikge1xuICAgIHZhciBjb25maWcgPSBfcmVmMi5jb25maWcsXG4gICAgICAgIHJlamVjdCA9IF9yZWYyLnJlamVjdDtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICByZWplY3Q6IHJlamVjdFxuICAgIH07XG4gIH0pO1xuICB2YXIgbG9hZGVyU2NyaXB0ID0gY3JlYXRlU2NyaXB0KFwiXCIuY29uY2F0KHN0YXRlLmNvbmZpZy5wYXRocy52cywgXCIvbG9hZGVyLmpzXCIpKTtcblxuICBsb2FkZXJTY3JpcHQub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb25maWd1cmVMb2FkZXIoKTtcbiAgfTtcblxuICBsb2FkZXJTY3JpcHQub25lcnJvciA9IHN0YXRlLnJlamVjdDtcbiAgcmV0dXJuIGxvYWRlclNjcmlwdDtcbn1cbi8qKlxuICogY29uZmlndXJlcyB0aGUgbW9uYWNvIGxvYWRlclxuICovXG5cblxuZnVuY3Rpb24gY29uZmlndXJlTG9hZGVyKCkge1xuICB2YXIgc3RhdGUgPSBnZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICB2YXIgY29uZmlnID0gX3JlZjMuY29uZmlnLFxuICAgICAgICByZXNvbHZlID0gX3JlZjMucmVzb2x2ZSxcbiAgICAgICAgcmVqZWN0ID0gX3JlZjMucmVqZWN0O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICByZWplY3Q6IHJlamVjdFxuICAgIH07XG4gIH0pO1xuICB2YXIgcmVxdWlyZSA9IHdpbmRvdy5yZXF1aXJlO1xuXG4gIHJlcXVpcmUuY29uZmlnKHN0YXRlLmNvbmZpZyk7XG5cbiAgcmVxdWlyZShbJ3ZzL2VkaXRvci9lZGl0b3IubWFpbiddLCBmdW5jdGlvbiAobW9uYWNvKSB7XG4gICAgc3RvcmVNb25hY29JbnN0YW5jZShtb25hY28pO1xuICAgIHN0YXRlLnJlc29sdmUobW9uYWNvKTtcbiAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgc3RhdGUucmVqZWN0KGVycm9yKTtcbiAgfSk7XG59XG4vKipcbiAqIHN0b3JlIG1vbmFjbyBpbnN0YW5jZSBpbiBsb2NhbCBzdGF0ZVxuICovXG5cblxuZnVuY3Rpb24gc3RvcmVNb25hY29JbnN0YW5jZShtb25hY28pIHtcbiAgaWYgKCFnZXRTdGF0ZSgpLm1vbmFjbykge1xuICAgIHNldFN0YXRlKHtcbiAgICAgIG1vbmFjbzogbW9uYWNvXG4gICAgfSk7XG4gIH1cbn1cbi8qKlxuICogaW50ZXJuYWwgaGVscGVyIGZ1bmN0aW9uXG4gKiBleHRyYWN0cyBzdG9yZWQgbW9uYWNvIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gLSB0aGUgbW9uYWNvIGluc3RhbmNlXG4gKi9cblxuXG5mdW5jdGlvbiBfX2dldE1vbmFjb0luc3RhbmNlKCkge1xuICByZXR1cm4gZ2V0U3RhdGUoZnVuY3Rpb24gKF9yZWY0KSB7XG4gICAgdmFyIG1vbmFjbyA9IF9yZWY0Lm1vbmFjbztcbiAgICByZXR1cm4gbW9uYWNvO1xuICB9KTtcbn1cblxudmFyIHdyYXBwZXJQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICByZXR1cm4gc2V0U3RhdGUoe1xuICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgcmVqZWN0OiByZWplY3RcbiAgfSk7XG59KTtcbnZhciBsb2FkZXIgPSB7XG4gIGNvbmZpZzogY29uZmlnLFxuICBpbml0OiBpbml0LFxuICBfX2dldE1vbmFjb0luc3RhbmNlOiBfX2dldE1vbmFjb0luc3RhbmNlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkZXI7XG4iLCAiLy8gQ29waWVkIGFuZCBtb2RpZmllZCBmcm9tIHRoZSBvcmlnaW5hbCB3b3JrIGF2YWlsYWJsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vbGl2ZWJvb2stZGV2L2xpdmVib29rL2Jsb2IvMjNlNThhYzYwNGRlOTJjZTU0NDcyZjM2ZmUzZTI4ZGMyNzU3NmQ2Yy9hc3NldHMvanMvaG9va3MvY2VsbF9lZGl0b3IvbGl2ZV9lZGl0b3IvdGhlbWUuanNcbi8vIENvcHlyaWdodCAoQykgMjAyMSBEYXNoYml0XG4vLyBMaWNlbnNlZCB1bmRlciBBcGFjaGUgMi4wIGF2YWlsYWJsZSBhdCBodHRwczovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbi8vIFRoaXMgaXMgYSBwb3J0IG9mIHRoZSBPbmUgRGFyayB0aGVtZSB0byB0aGUgTW9uYWNvIGVkaXRvci5cbi8vIFdlIGNvbG9yIGdyYWRlZCB0aGUgY29tbWVudCBzbyBpdCBoYXMgQUEgYWNjZXNzaWJpbGl0eSBhbmRcbi8vIHRoZW4gc2ltaWxhcmx5IHNjYWxlZCB0aGUgZGVmYXVsdCBmb250LlxuY29uc3QgY29sb3JzID0ge1xuICBiYWNrZ3JvdW5kOiBcIiMyODJjMzRcIixcbiAgZGVmYXVsdDogXCIjYzRjYWQ2XCIsXG4gIGxpZ2h0UmVkOiBcIiNlMDZjNzVcIixcbiAgYmx1ZTogXCIjNjFhZmVmXCIsXG4gIGdyYXk6IFwiIzhjOTJhM1wiLFxuICBncmVlbjogXCIjOThjMzc5XCIsXG4gIHB1cnBsZTogXCIjYzY3OGRkXCIsXG4gIHJlZDogXCIjYmU1MDQ2XCIsXG4gIHRlYWw6IFwiIzU2YjZjMlwiLFxuICBwZWFjaDogXCIjZDE5YTY2XCIsXG59XG5cbmNvbnN0IHJ1bGVzID0gKGNvbG9ycykgPT4gW1xuICB7IHRva2VuOiBcIlwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuZGVmYXVsdCB9LFxuICB7IHRva2VuOiBcInZhcmlhYmxlXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5saWdodFJlZCB9LFxuICB7IHRva2VuOiBcImNvbnN0YW50XCIsIGZvcmVncm91bmQ6IGNvbG9ycy5ibHVlIH0sXG4gIHsgdG9rZW46IFwiY29uc3RhbnQuY2hhcmFjdGVyLmVzY2FwZVwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuYmx1ZSB9LFxuICB7IHRva2VuOiBcImNvbW1lbnRcIiwgZm9yZWdyb3VuZDogY29sb3JzLmdyYXkgfSxcbiAgeyB0b2tlbjogXCJudW1iZXJcIiwgZm9yZWdyb3VuZDogY29sb3JzLmJsdWUgfSxcbiAgeyB0b2tlbjogXCJyZWdleHBcIiwgZm9yZWdyb3VuZDogY29sb3JzLmxpZ2h0UmVkIH0sXG4gIHsgdG9rZW46IFwidHlwZVwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMubGlnaHRSZWQgfSxcbiAgeyB0b2tlbjogXCJzdHJpbmdcIiwgZm9yZWdyb3VuZDogY29sb3JzLmdyZWVuIH0sXG4gIHsgdG9rZW46IFwia2V5d29yZFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMucHVycGxlIH0sXG4gIHsgdG9rZW46IFwib3BlcmF0b3JcIiwgZm9yZWdyb3VuZDogY29sb3JzLnBlYWNoIH0sXG4gIHsgdG9rZW46IFwiZGVsaW1pdGVyLmJyYWNrZXQuZW1iZWRcIiwgZm9yZWdyb3VuZDogY29sb3JzLnJlZCB9LFxuICB7IHRva2VuOiBcInNpZ2lsXCIsIGZvcmVncm91bmQ6IGNvbG9ycy50ZWFsIH0sXG4gIHsgdG9rZW46IFwiZnVuY3Rpb25cIiwgZm9yZWdyb3VuZDogY29sb3JzLmJsdWUgfSxcbiAgeyB0b2tlbjogXCJmdW5jdGlvbi5jYWxsXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5kZWZhdWx0IH0sXG5cbiAgLy8gTWFya2Rvd24gc3BlY2lmaWNcbiAgeyB0b2tlbjogXCJlbXBoYXNpc1wiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfSxcbiAgeyB0b2tlbjogXCJzdHJvbmdcIiwgZm9udFN0eWxlOiBcImJvbGRcIiB9LFxuICB7IHRva2VuOiBcImtleXdvcmQubWRcIiwgZm9yZWdyb3VuZDogY29sb3JzLmxpZ2h0UmVkIH0sXG4gIHsgdG9rZW46IFwia2V5d29yZC50YWJsZVwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMubGlnaHRSZWQgfSxcbiAgeyB0b2tlbjogXCJzdHJpbmcubGluay5tZFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuYmx1ZSB9LFxuICB7IHRva2VuOiBcInZhcmlhYmxlLm1kXCIsIGZvcmVncm91bmQ6IGNvbG9ycy50ZWFsIH0sXG4gIHsgdG9rZW46IFwic3RyaW5nLm1kXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5kZWZhdWx0IH0sXG4gIHsgdG9rZW46IFwidmFyaWFibGUuc291cmNlLm1kXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5kZWZhdWx0IH0sXG5cbiAgLy8gWE1MIHNwZWNpZmljXG4gIHsgdG9rZW46IFwidGFnXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5saWdodFJlZCB9LFxuICB7IHRva2VuOiBcIm1ldGF0YWdcIiwgZm9yZWdyb3VuZDogY29sb3JzLmxpZ2h0UmVkIH0sXG4gIHsgdG9rZW46IFwiYXR0cmlidXRlLm5hbWVcIiwgZm9yZWdyb3VuZDogY29sb3JzLnBlYWNoIH0sXG4gIHsgdG9rZW46IFwiYXR0cmlidXRlLnZhbHVlXCIsIGZvcmVncm91bmQ6IGNvbG9ycy5ncmVlbiB9LFxuXG4gIC8vIEpTT04gc3BlY2lmaWNcbiAgeyB0b2tlbjogXCJzdHJpbmcua2V5XCIsIGZvcmVncm91bmQ6IGNvbG9ycy5saWdodFJlZCB9LFxuICB7IHRva2VuOiBcImtleXdvcmQuanNvblwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMuYmx1ZSB9LFxuXG4gIC8vIFNRTCBzcGVjaWZpY1xuICB7IHRva2VuOiBcIm9wZXJhdG9yLnNxbFwiLCBmb3JlZ3JvdW5kOiBjb2xvcnMucHVycGxlIH0sXG5dXG5cbmNvbnN0IHRoZW1lID0ge1xuICBiYXNlOiBcInZzLWRhcmtcIixcbiAgaW5oZXJpdDogZmFsc2UsXG4gIHJ1bGVzOiBydWxlcyhjb2xvcnMpLFxuICBjb2xvcnM6IHtcbiAgICBcImVkaXRvci5iYWNrZ3JvdW5kXCI6IGNvbG9ycy5iYWNrZ3JvdW5kLFxuICAgIFwiZWRpdG9yLmZvcmVncm91bmRcIjogY29sb3JzLmRlZmF1bHQsXG4gICAgXCJlZGl0b3JMaW5lTnVtYmVyLmZvcmVncm91bmRcIjogXCIjNjM2ZDgzXCIsXG4gICAgXCJlZGl0b3JDdXJzb3IuZm9yZWdyb3VuZFwiOiBcIiM2MzZkODNcIixcbiAgICBcImVkaXRvci5zZWxlY3Rpb25CYWNrZ3JvdW5kXCI6IFwiIzNlNDQ1MVwiLFxuICAgIFwiZWRpdG9yLmZpbmRNYXRjaEhpZ2hsaWdodEJhY2tncm91bmRcIjogXCIjNTI4YmZmM2RcIixcbiAgICBcImVkaXRvclN1Z2dlc3RXaWRnZXQuYmFja2dyb3VuZFwiOiBcIiMyMTI1MmJcIixcbiAgICBcImVkaXRvclN1Z2dlc3RXaWRnZXQuYm9yZGVyXCI6IFwiIzE4MWExZlwiLFxuICAgIFwiZWRpdG9yU3VnZ2VzdFdpZGdldC5zZWxlY3RlZEJhY2tncm91bmRcIjogXCIjMmMzMTNhXCIsXG4gICAgXCJpbnB1dC5iYWNrZ3JvdW5kXCI6IFwiIzFiMWQyM1wiLFxuICAgIFwiaW5wdXQuYm9yZGVyXCI6IFwiIzE4MWExZlwiLFxuICAgIFwiZWRpdG9yQnJhY2tldE1hdGNoLmJvcmRlclwiOiBcIiMyODJjMzRcIixcbiAgICBcImVkaXRvckJyYWNrZXRNYXRjaC5iYWNrZ3JvdW5kXCI6IFwiIzNlNDQ1MVwiLFxuICB9LFxufVxuXG5leHBvcnQgeyB0aGVtZSB9XG4iLCAiLy8gQ29waWVkIGFuZCBtb2RpZmllZCBmcm9tIHRoZSBvcmlnaW5hbCB3b3JrIGF2YWlsYWJsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vbGl2ZWJvb2stZGV2L2xpdmVib29rL2Jsb2IvODUzMmJjMzM0YmRjZjNjNTdmYWI5YjY5NDY2NmU2MDk4NzdkMjc5Zi9hc3NldHMvanMvaG9va3MvY2VsbF9lZGl0b3IvbGl2ZV9lZGl0b3IuanNcbi8vIENvcHlyaWdodCAoQykgMjAyMSBEYXNoYml0XG4vLyBMaWNlbnNlZCB1bmRlciBBcGFjaGUgMi4wIGF2YWlsYWJsZSBhdCBodHRwczovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cbmltcG9ydCBsb2FkZXIgZnJvbSBcIkBtb25hY28tZWRpdG9yL2xvYWRlclwiXG5pbXBvcnQgeyB0aGVtZSB9IGZyb20gXCIuL3RoZW1lc1wiXG5cbmNsYXNzIENvZGVFZGl0b3Ige1xuICBjb25zdHJ1Y3RvcihlbCwgcGF0aCwgdmFsdWUsIG9wdHMpIHtcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIC8vIGh0dHBzOi8vbWljcm9zb2Z0LmdpdGh1Yi5pby9tb25hY28tZWRpdG9yL2RvY3MuaHRtbCNpbnRlcmZhY2VzL2VkaXRvci5JU3RhbmRhbG9uZUNvZGVFZGl0b3IuaHRtbFxuICAgIHRoaXMuc3RhbmRhbG9uZV9jb2RlX2VkaXRvciA9IG51bGxcbiAgICB0aGlzLl9vbk1vdW50ID0gW11cbiAgfVxuXG4gIGlzTW91bnRlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3JcbiAgfVxuXG4gIG1vdW50KCkge1xuICAgIGlmICh0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgbW9uYWNvIGVkaXRvciBpcyBhbHJlYWR5IG1vdW50ZWRcIilcbiAgICB9XG5cbiAgICB0aGlzLl9tb3VudEVkaXRvcigpXG4gIH1cblxuICBvbk1vdW50KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fb25Nb3VudC5wdXNoKGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgY29uc3QgbW9kZWwgPSB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IuZ2V0TW9kZWwoKVxuXG4gICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgbW9kZWwuZGlzcG9zZSgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhbmRhbG9uZV9jb2RlX2VkaXRvci5kaXNwb3NlKClcbiAgICB9XG4gIH1cblxuICBfbW91bnRFZGl0b3IoKSB7XG4gICAgdGhpcy5vcHRzLnZhbHVlID0gdGhpcy52YWx1ZVxuXG4gICAgbG9hZGVyLmNvbmZpZyh7XG4gICAgICBwYXRoczogeyB2czogXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL21vbmFjby1lZGl0b3JAbGF0ZXN0L21pbi92c1wiIH0sXG4gICAgfSlcblxuICAgIGxvYWRlci5pbml0KCkudGhlbigobW9uYWNvKSA9PiB7XG4gICAgICBtb25hY28uZWRpdG9yLmRlZmluZVRoZW1lKFwiZGVmYXVsdFwiLCB0aGVtZSlcblxuICAgICAgbGV0IG1vZGVsVXJpID0gbW9uYWNvLlVyaS5wYXJzZSh0aGlzLnBhdGgpXG4gICAgICBsZXQgbGFuZ3VhZ2UgPSB0aGlzLm9wdHMubGFuZ3VhZ2VcbiAgICAgIGxldCBtb2RlbCA9IG1vbmFjby5lZGl0b3IuY3JlYXRlTW9kZWwodGhpcy52YWx1ZSwgbGFuZ3VhZ2UsIG1vZGVsVXJpKVxuXG4gICAgICB0aGlzLm9wdHMubGFuZ3VhZ2UgPSB1bmRlZmluZWRcbiAgICAgIHRoaXMub3B0cy5tb2RlbCA9IG1vZGVsXG4gICAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IgPSBtb25hY28uZWRpdG9yLmNyZWF0ZSh0aGlzLmVsLCB0aGlzLm9wdHMpXG5cbiAgICAgIHRoaXMuX29uTW91bnQuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKG1vbmFjbykpXG5cbiAgICAgIHRoaXMuX3NldFNjcmVlbkRlcGVuZGFudEVkaXRvck9wdGlvbnMoKVxuXG4gICAgICBjb25zdCByZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc2l6ZU9ic2VydmVyXCIpXG4gICAgICAgIGVudHJpZXMuZm9yRWFjaCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuZWwub2Zmc2V0SGVpZ2h0ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0U2NyZWVuRGVwZW5kYW50RWRpdG9yT3B0aW9ucygpXG4gICAgICAgICAgICB0aGlzLnN0YW5kYWxvbmVfY29kZV9lZGl0b3IubGF5b3V0KClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWwpXG5cbiAgICAgIHRoaXMuc3RhbmRhbG9uZV9jb2RlX2VkaXRvci5vbkRpZENvbnRlbnRTaXplQ2hhbmdlKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJvbkRpZENvbnRlbnRTaXplQ2hhbmdlc1wiKVxuICAgICAgICBjb25zdCBjb250ZW50SGVpZ2h0ID0gdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLmdldENvbnRlbnRIZWlnaHQoKVxuICAgICAgICB0aGlzLmVsLnN0eWxlLmhlaWdodCA9IGAke2NvbnRlbnRIZWlnaHR9cHhgXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBfc2V0U2NyZWVuRGVwZW5kYW50RWRpdG9yT3B0aW9ucygpIHtcbiAgICBpZiAod2luZG93LnNjcmVlbi53aWR0aCA8IDc2OCkge1xuICAgICAgdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICBmb2xkaW5nOiBmYWxzZSxcbiAgICAgICAgbGluZURlY29yYXRpb25zV2lkdGg6IDE2LFxuICAgICAgICBsaW5lTnVtYmVyc01pbkNoYXJzOlxuICAgICAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgICAgICBNYXRoLmxvZzEwKHRoaXMuc3RhbmRhbG9uZV9jb2RlX2VkaXRvci5nZXRNb2RlbCgpLmdldExpbmVDb3VudCgpKVxuICAgICAgICAgICkgKyAzLFxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLnVwZGF0ZU9wdGlvbnMoe1xuICAgICAgICBmb2xkaW5nOiB0cnVlLFxuICAgICAgICBsaW5lRGVjb3JhdGlvbnNXaWR0aDogMTAsXG4gICAgICAgIGxpbmVOdW1iZXJzTWluQ2hhcnM6IDUsXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb2RlRWRpdG9yXG4iLCAiaW1wb3J0IENvZGVFZGl0b3IgZnJvbSBcIi4uL2VkaXRvci9jb2RlX2VkaXRvclwiXG5cbmNvbnN0IENvZGVFZGl0b3JIb29rID0ge1xuICBtb3VudGVkKCkge1xuICAgIC8vIFRPRE86IHZhbGlkYXRlIGRhdGFzZXRcbiAgICBjb25zdCBvcHRzID0gSlNPTi5wYXJzZSh0aGlzLmVsLmRhdGFzZXQub3B0cylcbiAgICB0aGlzLmNvZGVFZGl0b3IgPSBuZXcgQ29kZUVkaXRvcihcbiAgICAgIHRoaXMuZWwsXG4gICAgICB0aGlzLmVsLmRhdGFzZXQucGF0aCxcbiAgICAgIHRoaXMuZWwuZGF0YXNldC52YWx1ZSxcbiAgICAgIG9wdHNcbiAgICApXG5cbiAgICB0aGlzLmNvZGVFZGl0b3Iub25Nb3VudCgobW9uYWNvKSA9PiB7XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcImxtZTplZGl0b3JfbW91bnRlZFwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7IGhvb2s6IHRoaXMsIGVkaXRvcjogdGhpcy5jb2RlRWRpdG9yIH0sXG4gICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgICAgdGhpcy5oYW5kbGVFdmVudChcbiAgICAgICAgXCJsbWU6Y2hhbmdlX2xhbmd1YWdlOlwiICsgdGhpcy5lbC5kYXRhc2V0LnBhdGgsXG4gICAgICAgIChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgbW9kZWwgPSB0aGlzLmNvZGVFZGl0b3Iuc3RhbmRhbG9uZV9jb2RlX2VkaXRvci5nZXRNb2RlbCgpXG5cbiAgICAgICAgICBpZiAobW9kZWwuZ2V0TGFuZ3VhZ2VJZCgpICE9PSBkYXRhLm1pbWVUeXBlT3JMYW5ndWFnZUlkKSB7XG4gICAgICAgICAgICBtb25hY28uZWRpdG9yLnNldE1vZGVsTGFuZ3VhZ2UobW9kZWwsIGRhdGEubWltZVR5cGVPckxhbmd1YWdlSWQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG5cbiAgICAgIHRoaXMuaGFuZGxlRXZlbnQoXCJsbWU6c2V0X3ZhbHVlOlwiICsgdGhpcy5lbC5kYXRhc2V0LnBhdGgsIChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuY29kZUVkaXRvci5zdGFuZGFsb25lX2NvZGVfZWRpdG9yLnNldFZhbHVlKGRhdGEudmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKS5mb3JFYWNoKCh0ZXh0YXJlYSkgPT4ge1xuICAgICAgICB0ZXh0YXJlYS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJuYW1lXCIsXG4gICAgICAgICAgXCJsaXZlX21vbmFjb19lZGl0b3JbXCIgKyB0aGlzLmVsLmRhdGFzZXQucGF0aCArIFwiXVwiXG4gICAgICAgIClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS12YWx1ZVwiKVxuICAgICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW9wdHNcIilcbiAgICB9KVxuXG4gICAgaWYgKCF0aGlzLmNvZGVFZGl0b3IuaXNNb3VudGVkKCkpIHtcbiAgICAgIHRoaXMuY29kZUVkaXRvci5tb3VudCgpXG4gICAgfVxuICB9LFxuXG4gIGRlc3Ryb3llZCgpIHtcbiAgICBpZiAodGhpcy5jb2RlRWRpdG9yKSB7XG4gICAgICB0aGlzLmNvZGVFZGl0b3IuZGlzcG9zZSgpXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgeyBDb2RlRWRpdG9ySG9vayB9XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUNvbXBvbmVudHMoY29tcG9uZW50cykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnRzLmRlZmF1bHQpIHx8ICFBcnJheS5pc0FycmF5KGNvbXBvbmVudHMuZmlsZW5hbWVzKSkgcmV0dXJuIGNvbXBvbmVudHNcblxuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSB7fVxuICAgIGZvciAoY29uc3QgW2luZGV4LCBtb2R1bGVdIG9mIGNvbXBvbmVudHMuZGVmYXVsdC5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50ID0gbW9kdWxlLmRlZmF1bHRcbiAgICAgICAgY29uc3QgbmFtZSA9IGNvbXBvbmVudHMuZmlsZW5hbWVzW2luZGV4XS5yZXBsYWNlKFwiLi4vc3ZlbHRlL1wiLCBcIlwiKS5yZXBsYWNlKFwiLnN2ZWx0ZVwiLCBcIlwiKVxuICAgICAgICBub3JtYWxpemVkW25hbWVdID0gQ29tcG9uZW50XG4gICAgfVxuICAgIHJldHVybiBub3JtYWxpemVkXG59XG4iLCAiaW1wb3J0IHtub3JtYWxpemVDb21wb25lbnRzfSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZW5kZXIoY29tcG9uZW50cykge1xuICAgIGNvbXBvbmVudHMgPSBub3JtYWxpemVDb21wb25lbnRzKGNvbXBvbmVudHMpXG5cbiAgICByZXR1cm4gZnVuY3Rpb24gcmVuZGVyKG5hbWUsIHByb3BzLCBzbG90cykge1xuICAgICAgICBjb25zdCBDb21wb25lbnQgPSBjb21wb25lbnRzW25hbWVdXG4gICAgICAgIGNvbnN0ICQkc2xvdHMgPSBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoc2xvdHMpLm1hcCgoW2ssIHZdKSA9PiBbaywgKCkgPT4gdl0pKVxuICAgICAgICByZXR1cm4gQ29tcG9uZW50LnJlbmRlcihwcm9wcywgeyQkc2xvdHN9KVxuICAgIH1cbn1cbiIsICJpbXBvcnQge25vcm1hbGl6ZUNvbXBvbmVudHN9IGZyb20gXCIuL3V0aWxzXCJcblxuZnVuY3Rpb24gZ2V0QXR0cmlidXRlSnNvbihyZWYsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgICBjb25zdCBkYXRhID0gcmVmLmVsLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKVxuICAgIHJldHVybiBkYXRhID8gSlNPTi5wYXJzZShkYXRhKSA6IHt9XG59XG5cbmZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG4gICAgbm9kZS5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZChub2RlKVxufVxuXG5mdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIGFuY2hvciB8fCBudWxsKVxufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuZnVuY3Rpb24gZ2V0U2xvdHMocmVmKSB7XG4gICAgY29uc3Qgc2xvdHMgPSB7fVxuXG4gICAgZm9yIChjb25zdCBzbG90TmFtZSBpbiBnZXRBdHRyaWJ1dGVKc29uKHJlZiwgXCJkYXRhLXNsb3RzXCIpKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldEVsZW1lbnQoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGdldEF0dHJpYnV0ZUpzb24ocmVmLCBcImRhdGEtc2xvdHNcIilbc2xvdE5hbWVdXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gYXRvYihiYXNlNjQpLnRyaW0oKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICBkZXRhY2godGhpcy5zYXZlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50KClcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0KHRoaXMuc2F2ZWRUYXJnZXQsIHRoaXMuc2F2ZWRFbGVtZW50LCB0aGlzLnNhdmVkQW5jaG9yKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYzogbm9vcCxcbiAgICAgICAgICAgICAgICBtKHRhcmdldCwgYW5jaG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZWRUYXJnZXQgPSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlZEFuY2hvciA9IGFuY2hvclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVkRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudCgpXG4gICAgICAgICAgICAgICAgICAgIGluc2VydCh0aGlzLnNhdmVkVGFyZ2V0LCB0aGlzLnNhdmVkRWxlbWVudCwgdGhpcy5zYXZlZEFuY2hvcilcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGQoZGV0YWNoaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXRhY2hpbmcpIGRldGFjaCh0aGlzLnNhdmVkRWxlbWVudClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGw6IG5vb3AsXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzbG90c1tzbG90TmFtZV0gPSBbc2xvdF1cbiAgICB9XG5cbiAgICByZXR1cm4gc2xvdHNcbn1cblxuZnVuY3Rpb24gZ2V0TGl2ZUpzb25Qcm9wcyhyZWYpIHtcbiAgICBjb25zdCBqc29uID0gZ2V0QXR0cmlidXRlSnNvbihyZWYsIFwiZGF0YS1saXZlLWpzb25cIilcblxuICAgIC8vIE9uIFNTUiwgZGF0YS1saXZlLWpzb24gaXMgdGhlIGZ1bGwgb2JqZWN0IHdlIHdhbnRcbiAgICAvLyBBZnRlciBTU1IsIGRhdGEtbGl2ZS1qc29uIGlzIGFuIGFycmF5IG9mIGtleXMsIGFuZCB3ZSdsbCBnZXQgdGhlIGRhdGEgZnJvbSB0aGUgd2luZG93XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGpzb24pKSByZXR1cm4ganNvblxuXG4gICAgY29uc3QgbGl2ZUpzb25EYXRhID0ge31cbiAgICBmb3IgKGNvbnN0IGxpdmVKc29uVmFyaWFibGUgb2YganNvbikge1xuICAgICAgICBjb25zdCBkYXRhID0gd2luZG93W2xpdmVKc29uVmFyaWFibGVdXG4gICAgICAgIGlmIChkYXRhKSBsaXZlSnNvbkRhdGFbbGl2ZUpzb25WYXJpYWJsZV0gPSBkYXRhXG4gICAgfVxuICAgIHJldHVybiBsaXZlSnNvbkRhdGFcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcHMocmVmKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZ2V0QXR0cmlidXRlSnNvbihyZWYsIFwiZGF0YS1wcm9wc1wiKSxcbiAgICAgICAgLi4uZ2V0TGl2ZUpzb25Qcm9wcyhyZWYpLFxuICAgICAgICBsaXZlOiByZWYsXG4gICAgICAgICQkc2xvdHM6IGdldFNsb3RzKHJlZiksXG4gICAgICAgICQkc2NvcGU6IHt9LFxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmluZFNsb3RDdHgoY29tcG9uZW50KSB7XG4gICAgLy8gVGhlIGRlZmF1bHQgc2xvdCBhbHdheXMgZXhpc3RzIGlmIHRoZXJlJ3MgYSBzbG90IHNldFxuICAgIC8vIGV2ZW4gaWYgbm8gc2xvdCBpcyBzZXQgZm9yIHRoZSBleHBsaWNpdCBkZWZhdWx0IHNsb3RcbiAgICByZXR1cm4gY29tcG9uZW50LiQkLmN0eC5maW5kKGN0eEVsZW1lbnQgPT4gY3R4RWxlbWVudD8uZGVmYXVsdClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEhvb2tzKGNvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzID0gbm9ybWFsaXplQ29tcG9uZW50cyhjb21wb25lbnRzKVxuXG4gICAgY29uc3QgU3ZlbHRlSG9vayA9IHtcbiAgICAgICAgbW91bnRlZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtbmFtZVwiKVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IG5hbWUgbXVzdCBiZSBwcm92aWRlZFwiKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudE5hbWVdXG4gICAgICAgICAgICBpZiAoIUNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgJHtjb21wb25lbnROYW1lfSBjb21wb25lbnQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChjb25zdCBsaXZlSnNvbkVsZW1lbnQgb2YgT2JqZWN0LmtleXMoZ2V0QXR0cmlidXRlSnNvbih0aGlzLCBcImRhdGEtbGl2ZS1qc29uXCIpKSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGAke2xpdmVKc29uRWxlbWVudH1faW5pdGlhbGl6ZWRgLCBldmVudCA9PiB0aGlzLl9pbnN0YW5jZS4kc2V0KGdldFByb3BzKHRoaXMpKSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYCR7bGl2ZUpzb25FbGVtZW50fV9wYXRjaGVkYCwgZXZlbnQgPT4gdGhpcy5faW5zdGFuY2UuJHNldChnZXRQcm9wcyh0aGlzKSksIGZhbHNlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBDb21wb25lbnQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcy5lbCxcbiAgICAgICAgICAgICAgICBwcm9wczogZ2V0UHJvcHModGhpcyksXG4gICAgICAgICAgICAgICAgaHlkcmF0ZTogdGhpcy5lbC5oYXNBdHRyaWJ1dGUoXCJkYXRhLXNzclwiKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlZCgpIHtcbiAgICAgICAgICAgIC8vIFNldCB0aGUgcHJvcHNcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlLiRzZXQoZ2V0UHJvcHModGhpcykpXG5cbiAgICAgICAgICAgIC8vIFNldCB0aGUgc2xvdHNcbiAgICAgICAgICAgIGNvbnN0IHNsb3RDdHggPSBmaW5kU2xvdEN0eCh0aGlzLl9pbnN0YW5jZSlcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNsb3RDdHgpIHtcbiAgICAgICAgICAgICAgICBzbG90Q3R4W2tleV1bMF0oKS51cGRhdGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3llZCgpIHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gZGVzdHJveSB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICAvLyBJZiB3ZSBkbyBhIHBhZ2UgbmF2aWdhdGlvbiwgdGhpcyB3b3VsZCByZW1vdmUgdGhlIGNvbXBvbmVudCBpbiB0aGUgRE9NLFxuICAgICAgICAgICAgLy8gYW5kIHRoZW4gaXQgd291bGQgdG8gdGhlIHRyYW5zaXRpb24sIGNhdXNpbmcgYSBmbGlja2VyIG9mIHVucmVuZGVyZWQgY29udGVudFxuICAgICAgICAgICAgLy8gU2luY2Ugd2UncmUgZG9pbmcgYSBwYWdlIHRyYW5zaXRpb24gYW55d2F5LCB0aGUgY29tcG9uZW50IHdpbGwgYmUgcmVtb3ZlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBTdmVsdGVIb29rLFxuICAgIH1cbn1cbiIsICJcbiAgICAgICAgaW1wb3J0ICogYXMgbW9kdWxlMCBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9CYWNrZHJvcC5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTEgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvQnJvd3NlckZyYW1lLnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlMiBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9Db2RlRWRpdG9yLnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlMyBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9Db21wb25lbnRzU2lkZWJhci5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTQgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvTGF5b3V0QXN0Tm9kZS5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTUgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvUGFnZUFzdE5vZGUuc3ZlbHRlJztpbXBvcnQgKiBhcyBtb2R1bGU2IGZyb20gJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1BhZ2VQcmV2aWV3LnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlNyBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9QaWxsLnN2ZWx0ZSc7aW1wb3J0ICogYXMgbW9kdWxlOCBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9Qcm9wZXJ0aWVzU2lkZWJhci5zdmVsdGUnO2ltcG9ydCAqIGFzIG1vZHVsZTkgZnJvbSAnLi4vc3ZlbHRlL2NvbXBvbmVudHMvU2lkZWJhclNlY3Rpb24uc3ZlbHRlJztpbXBvcnQgKiBhcyBtb2R1bGUxMCBmcm9tICcuLi9zdmVsdGUvY29tcG9uZW50cy9VaUJ1aWxkZXIuc3ZlbHRlJ1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZXMgPSBbbW9kdWxlMCxtb2R1bGUxLG1vZHVsZTIsbW9kdWxlMyxtb2R1bGU0LG1vZHVsZTUsbW9kdWxlNixtb2R1bGU3LG1vZHVsZTgsbW9kdWxlOSxtb2R1bGUxMF07XG5cbiAgICAgICAgZXhwb3J0IGRlZmF1bHQgbW9kdWxlcztcbiAgICAgICAgZXhwb3J0IGNvbnN0IGZpbGVuYW1lcyA9IFsnLi4vc3ZlbHRlL2NvbXBvbmVudHMvQmFja2Ryb3Auc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvQnJvd3NlckZyYW1lLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL0NvZGVFZGl0b3Iuc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvQ29tcG9uZW50c1NpZGViYXIuc3ZlbHRlJywnLi4vc3ZlbHRlL2NvbXBvbmVudHMvTGF5b3V0QXN0Tm9kZS5zdmVsdGUnLCcuLi9zdmVsdGUvY29tcG9uZW50cy9QYWdlQXN0Tm9kZS5zdmVsdGUnLCcuLi9zdmVsdGUvY29tcG9uZW50cy9QYWdlUHJldmlldy5zdmVsdGUnLCcuLi9zdmVsdGUvY29tcG9uZW50cy9QaWxsLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1Byb3BlcnRpZXNTaWRlYmFyLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1NpZGViYXJTZWN0aW9uLnN2ZWx0ZScsJy4uL3N2ZWx0ZS9jb21wb25lbnRzL1VpQnVpbGRlci5zdmVsdGUnXVxuICAgICAgIiwgIi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkge31cblxuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gKHgpID0+IHg7XG5cbi8qKlxuICogQHRlbXBsYXRlIFRcbiAqIEB0ZW1wbGF0ZSBTXG4gKiBAcGFyYW0ge1R9IHRhclxuICogQHBhcmFtIHtTfSBzcmNcbiAqIEByZXR1cm5zIHtUICYgU31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuXHQvLyBAdHMtaWdub3JlXG5cdGZvciAoY29uc3QgayBpbiBzcmMpIHRhcltrXSA9IHNyY1trXTtcblx0cmV0dXJuIC8qKiBAdHlwZSB7VCAmIFN9ICovICh0YXIpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3RoZW4vaXMtcHJvbWlzZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgTUlUIExpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL3RoZW4vaXMtcHJvbWlzZS9ibG9iL21hc3Rlci9MSUNFTlNFXG4vKipcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybnMge3ZhbHVlIGlzIFByb21pc2VMaWtlPGFueT59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc19wcm9taXNlKHZhbHVlKSB7XG5cdHJldHVybiAoXG5cdFx0ISF2YWx1ZSAmJlxuXHRcdCh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgJiZcblx0XHR0eXBlb2YgKC8qKiBAdHlwZSB7YW55fSAqLyAodmFsdWUpLnRoZW4pID09PSAnZnVuY3Rpb24nXG5cdCk7XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRfbG9jYXRpb24oZWxlbWVudCwgZmlsZSwgbGluZSwgY29sdW1uLCBjaGFyKSB7XG5cdGVsZW1lbnQuX19zdmVsdGVfbWV0YSA9IHtcblx0XHRsb2M6IHsgZmlsZSwgbGluZSwgY29sdW1uLCBjaGFyIH1cblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bihmbikge1xuXHRyZXR1cm4gZm4oKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcblx0cmV0dXJuIE9iamVjdC5jcmVhdGUobnVsbCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtGdW5jdGlvbltdfSBmbnNcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcnVuX2FsbChmbnMpIHtcblx0Zm5zLmZvckVhY2gocnVuKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2FueX0gdGhpbmdcbiAqIEByZXR1cm5zIHt0aGluZyBpcyBGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG5cdHJldHVybiB0eXBlb2YgdGhpbmcgPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYWZlX25vdF9lcXVhbChhLCBiKSB7XG5cdHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiIHx8IChhICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JykgfHwgdHlwZW9mIGEgPT09ICdmdW5jdGlvbic7XG59XG5cbmxldCBzcmNfdXJsX2VxdWFsX2FuY2hvcjtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZWxlbWVudF9zcmNcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3JjX3VybF9lcXVhbChlbGVtZW50X3NyYywgdXJsKSB7XG5cdGlmIChlbGVtZW50X3NyYyA9PT0gdXJsKSByZXR1cm4gdHJ1ZTtcblx0aWYgKCFzcmNfdXJsX2VxdWFsX2FuY2hvcikge1xuXHRcdHNyY191cmxfZXF1YWxfYW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXHR9XG5cdC8vIFRoaXMgaXMgYWN0dWFsbHkgZmFzdGVyIHRoYW4gZG9pbmcgVVJMKC4uKS5ocmVmXG5cdHNyY191cmxfZXF1YWxfYW5jaG9yLmhyZWYgPSB1cmw7XG5cdHJldHVybiBlbGVtZW50X3NyYyA9PT0gc3JjX3VybF9lcXVhbF9hbmNob3IuaHJlZjtcbn1cblxuLyoqIEBwYXJhbSB7c3RyaW5nfSBzcmNzZXQgKi9cbmZ1bmN0aW9uIHNwbGl0X3NyY3NldChzcmNzZXQpIHtcblx0cmV0dXJuIHNyY3NldC5zcGxpdCgnLCcpLm1hcCgoc3JjKSA9PiBzcmMudHJpbSgpLnNwbGl0KCcgJykuZmlsdGVyKEJvb2xlYW4pKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxTb3VyY2VFbGVtZW50IHwgSFRNTEltYWdlRWxlbWVudH0gZWxlbWVudF9zcmNzZXRcbiAqIEBwYXJhbSB7c3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbH0gc3Jjc2V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNyY3NldF91cmxfZXF1YWwoZWxlbWVudF9zcmNzZXQsIHNyY3NldCkge1xuXHRjb25zdCBlbGVtZW50X3VybHMgPSBzcGxpdF9zcmNzZXQoZWxlbWVudF9zcmNzZXQuc3Jjc2V0KTtcblx0Y29uc3QgdXJscyA9IHNwbGl0X3NyY3NldChzcmNzZXQgfHwgJycpO1xuXG5cdHJldHVybiAoXG5cdFx0dXJscy5sZW5ndGggPT09IGVsZW1lbnRfdXJscy5sZW5ndGggJiZcblx0XHR1cmxzLmV2ZXJ5KFxuXHRcdFx0KFt1cmwsIHdpZHRoXSwgaSkgPT5cblx0XHRcdFx0d2lkdGggPT09IGVsZW1lbnRfdXJsc1tpXVsxXSAmJlxuXHRcdFx0XHQvLyBXZSBuZWVkIHRvIHRlc3QgYm90aCB3YXlzIGJlY2F1c2UgVml0ZSB3aWxsIGNyZWF0ZSBhbiBhIGZ1bGwgVVJMIHdpdGhcblx0XHRcdFx0Ly8gYG5ldyBVUkwoYXNzZXQsIGltcG9ydC5tZXRhLnVybCkuaHJlZmAgZm9yIHRoZSBjbGllbnQgd2hlbiBgYmFzZTogJy4vJ2AsIGFuZCB0aGVcblx0XHRcdFx0Ly8gcmVsYXRpdmUgVVJMcyBpbnNpZGUgc3Jjc2V0IGFyZSBub3QgYXV0b21hdGljYWxseSByZXNvbHZlZCB0byBhYnNvbHV0ZSBVUkxzIGJ5XG5cdFx0XHRcdC8vIGJyb3dzZXJzIChpbiBjb250cmFzdCB0byBpbWcuc3JjKS4gVGhpcyBtZWFucyBib3RoIFNTUiBhbmQgRE9NIGNvZGUgY291bGRcblx0XHRcdFx0Ly8gY29udGFpbiByZWxhdGl2ZSBvciBhYnNvbHV0ZSBVUkxzLlxuXHRcdFx0XHQoc3JjX3VybF9lcXVhbChlbGVtZW50X3VybHNbaV1bMF0sIHVybCkgfHwgc3JjX3VybF9lcXVhbCh1cmwsIGVsZW1lbnRfdXJsc1tpXVswXSkpXG5cdFx0KVxuXHQpO1xufVxuXG4vKiogQHJldHVybnMge2Jvb2xlYW59ICovXG5leHBvcnQgZnVuY3Rpb24gbm90X2VxdWFsKGEsIGIpIHtcblx0cmV0dXJuIGEgIT0gYSA/IGIgPT0gYiA6IGEgIT09IGI7XG59XG5cbi8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc19lbXB0eShvYmopIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVfc3RvcmUoc3RvcmUsIG5hbWUpIHtcblx0aWYgKHN0b3JlICE9IG51bGwgJiYgdHlwZW9mIHN0b3JlLnN1YnNjcmliZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nIGlzIG5vdCBhIHN0b3JlIHdpdGggYSAnc3Vic2NyaWJlJyBtZXRob2RgKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3Vic2NyaWJlKHN0b3JlLCAuLi5jYWxsYmFja3MpIHtcblx0aWYgKHN0b3JlID09IG51bGwpIHtcblx0XHRmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xuXHRcdFx0Y2FsbGJhY2sodW5kZWZpbmVkKTtcblx0XHR9XG5cdFx0cmV0dXJuIG5vb3A7XG5cdH1cblx0Y29uc3QgdW5zdWIgPSBzdG9yZS5zdWJzY3JpYmUoLi4uY2FsbGJhY2tzKTtcblx0cmV0dXJuIHVuc3ViLnVuc3Vic2NyaWJlID8gKCkgPT4gdW5zdWIudW5zdWJzY3JpYmUoKSA6IHVuc3ViO1xufVxuXG4vKipcbiAqIEdldCB0aGUgY3VycmVudCB2YWx1ZSBmcm9tIGEgc3RvcmUgYnkgc3Vic2NyaWJpbmcgYW5kIGltbWVkaWF0ZWx5IHVuc3Vic2NyaWJpbmcuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXN0b3JlI2dldFxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9zdG9yZS9wdWJsaWMuanMnKS5SZWFkYWJsZTxUPn0gc3RvcmVcbiAqIEByZXR1cm5zIHtUfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0X3N0b3JlX3ZhbHVlKHN0b3JlKSB7XG5cdGxldCB2YWx1ZTtcblx0c3Vic2NyaWJlKHN0b3JlLCAoXykgPT4gKHZhbHVlID0gXykpKCk7XG5cdHJldHVybiB2YWx1ZTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudF9zdWJzY3JpYmUoY29tcG9uZW50LCBzdG9yZSwgY2FsbGJhY2spIHtcblx0Y29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kucHVzaChzdWJzY3JpYmUoc3RvcmUsIGNhbGxiYWNrKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfc2xvdChkZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIGZuKSB7XG5cdGlmIChkZWZpbml0aW9uKSB7XG5cdFx0Y29uc3Qgc2xvdF9jdHggPSBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pO1xuXHRcdHJldHVybiBkZWZpbml0aW9uWzBdKHNsb3RfY3R4KTtcblx0fVxufVxuXG5mdW5jdGlvbiBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcblx0cmV0dXJuIGRlZmluaXRpb25bMV0gJiYgZm4gPyBhc3NpZ24oJCRzY29wZS5jdHguc2xpY2UoKSwgZGVmaW5pdGlvblsxXShmbihjdHgpKSkgOiAkJHNjb3BlLmN0eDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldF9zbG90X2NoYW5nZXMoZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGZuKSB7XG5cdGlmIChkZWZpbml0aW9uWzJdICYmIGZuKSB7XG5cdFx0Y29uc3QgbGV0cyA9IGRlZmluaXRpb25bMl0oZm4oZGlydHkpKTtcblx0XHRpZiAoJCRzY29wZS5kaXJ0eSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gbGV0cztcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBsZXRzID09PSAnb2JqZWN0Jykge1xuXHRcdFx0Y29uc3QgbWVyZ2VkID0gW107XG5cdFx0XHRjb25zdCBsZW4gPSBNYXRoLm1heCgkJHNjb3BlLmRpcnR5Lmxlbmd0aCwgbGV0cy5sZW5ndGgpO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuXHRcdFx0XHRtZXJnZWRbaV0gPSAkJHNjb3BlLmRpcnR5W2ldIHwgbGV0c1tpXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZXJnZWQ7XG5cdFx0fVxuXHRcdHJldHVybiAkJHNjb3BlLmRpcnR5IHwgbGV0cztcblx0fVxuXHRyZXR1cm4gJCRzY29wZS5kaXJ0eTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZV9zbG90X2Jhc2UoXG5cdHNsb3QsXG5cdHNsb3RfZGVmaW5pdGlvbixcblx0Y3R4LFxuXHQkJHNjb3BlLFxuXHRzbG90X2NoYW5nZXMsXG5cdGdldF9zbG90X2NvbnRleHRfZm5cbikge1xuXHRpZiAoc2xvdF9jaGFuZ2VzKSB7XG5cdFx0Y29uc3Qgc2xvdF9jb250ZXh0ID0gZ2V0X3Nsb3RfY29udGV4dChzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG5cdFx0c2xvdC5wKHNsb3RfY29udGV4dCwgc2xvdF9jaGFuZ2VzKTtcblx0fVxufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlX3Nsb3QoXG5cdHNsb3QsXG5cdHNsb3RfZGVmaW5pdGlvbixcblx0Y3R4LFxuXHQkJHNjb3BlLFxuXHRkaXJ0eSxcblx0Z2V0X3Nsb3RfY2hhbmdlc19mbixcblx0Z2V0X3Nsb3RfY29udGV4dF9mblxuKSB7XG5cdGNvbnN0IHNsb3RfY2hhbmdlcyA9IGdldF9zbG90X2NoYW5nZXMoc2xvdF9kZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZ2V0X3Nsb3RfY2hhbmdlc19mbik7XG5cdHVwZGF0ZV9zbG90X2Jhc2Uoc2xvdCwgc2xvdF9kZWZpbml0aW9uLCBjdHgsICQkc2NvcGUsIHNsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG59XG5cbi8qKiBAcmV0dXJucyB7YW55W10gfCAtMX0gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfYWxsX2RpcnR5X2Zyb21fc2NvcGUoJCRzY29wZSkge1xuXHRpZiAoJCRzY29wZS5jdHgubGVuZ3RoID4gMzIpIHtcblx0XHRjb25zdCBkaXJ0eSA9IFtdO1xuXHRcdGNvbnN0IGxlbmd0aCA9ICQkc2NvcGUuY3R4Lmxlbmd0aCAvIDMyO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdGRpcnR5W2ldID0gLTE7XG5cdFx0fVxuXHRcdHJldHVybiBkaXJ0eTtcblx0fVxuXHRyZXR1cm4gLTE7XG59XG5cbi8qKiBAcmV0dXJucyB7e319ICovXG5leHBvcnQgZnVuY3Rpb24gZXhjbHVkZV9pbnRlcm5hbF9wcm9wcyhwcm9wcykge1xuXHRjb25zdCByZXN1bHQgPSB7fTtcblx0Zm9yIChjb25zdCBrIGluIHByb3BzKSBpZiAoa1swXSAhPT0gJyQnKSByZXN1bHRba10gPSBwcm9wc1trXTtcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIEByZXR1cm5zIHt7fX0gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlX3Jlc3RfcHJvcHMocHJvcHMsIGtleXMpIHtcblx0Y29uc3QgcmVzdCA9IHt9O1xuXHRrZXlzID0gbmV3IFNldChrZXlzKTtcblx0Zm9yIChjb25zdCBrIGluIHByb3BzKSBpZiAoIWtleXMuaGFzKGspICYmIGtbMF0gIT09ICckJykgcmVzdFtrXSA9IHByb3BzW2tdO1xuXHRyZXR1cm4gcmVzdDtcbn1cblxuLyoqIEByZXR1cm5zIHt7fX0gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlX3Nsb3RzKHNsb3RzKSB7XG5cdGNvbnN0IHJlc3VsdCA9IHt9O1xuXHRmb3IgKGNvbnN0IGtleSBpbiBzbG90cykge1xuXHRcdHJlc3VsdFtrZXldID0gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogQHJldHVybnMgeyh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uY2UoZm4pIHtcblx0bGV0IHJhbiA9IGZhbHNlO1xuXHRyZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0XHRpZiAocmFuKSByZXR1cm47XG5cdFx0cmFuID0gdHJ1ZTtcblx0XHRmbi5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVsbF90b19lbXB0eSh2YWx1ZSkge1xuXHRyZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRfc3RvcmVfdmFsdWUoc3RvcmUsIHJldCwgdmFsdWUpIHtcblx0c3RvcmUuc2V0KHZhbHVlKTtcblx0cmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGNvbnN0IGhhc19wcm9wID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3Rpb25fZGVzdHJveWVyKGFjdGlvbl9yZXN1bHQpIHtcblx0cmV0dXJuIGFjdGlvbl9yZXN1bHQgJiYgaXNfZnVuY3Rpb24oYWN0aW9uX3Jlc3VsdC5kZXN0cm95KSA/IGFjdGlvbl9yZXN1bHQuZGVzdHJveSA6IG5vb3A7XG59XG5cbi8qKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtbbnVtYmVyLCBzdHJpbmddfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRfY3NzX3VuaXQodmFsdWUpIHtcblx0Y29uc3Qgc3BsaXQgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLm1hdGNoKC9eXFxzKigtP1tcXGQuXSspKFteXFxzXSopXFxzKiQvKTtcblx0cmV0dXJuIHNwbGl0ID8gW3BhcnNlRmxvYXQoc3BsaXRbMV0pLCBzcGxpdFsyXSB8fCAncHgnXSA6IFsvKiogQHR5cGUge251bWJlcn0gKi8gKHZhbHVlKSwgJ3B4J107XG59XG5cbmV4cG9ydCBjb25zdCBjb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcyA9IFsnJywgdHJ1ZSwgMSwgJ3RydWUnLCAnY29udGVudGVkaXRhYmxlJ107XG4iLCAiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgY29uc3QgaXNfY2xpZW50ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8qKiBAdHlwZSB7KCkgPT4gbnVtYmVyfSAqL1xuZXhwb3J0IGxldCBub3cgPSBpc19jbGllbnQgPyAoKSA9PiB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiAoKSA9PiBEYXRlLm5vdygpO1xuXG5leHBvcnQgbGV0IHJhZiA9IGlzX2NsaWVudCA/IChjYikgPT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKSA6IG5vb3A7XG5cbi8vIHVzZWQgaW50ZXJuYWxseSBmb3IgdGVzdGluZ1xuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9ub3coZm4pIHtcblx0bm93ID0gZm47XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfcmFmKGZuKSB7XG5cdHJhZiA9IGZuO1xufVxuIiwgImltcG9ydCB7IHJhZiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG5jb25zdCB0YXNrcyA9IG5ldyBTZXQoKTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gbm93XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gcnVuX3Rhc2tzKG5vdykge1xuXHR0YXNrcy5mb3JFYWNoKCh0YXNrKSA9PiB7XG5cdFx0aWYgKCF0YXNrLmMobm93KSkge1xuXHRcdFx0dGFza3MuZGVsZXRlKHRhc2spO1xuXHRcdFx0dGFzay5mKCk7XG5cdFx0fVxuXHR9KTtcblx0aWYgKHRhc2tzLnNpemUgIT09IDApIHJhZihydW5fdGFza3MpO1xufVxuXG4vKipcbiAqIEZvciB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkhXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyX2xvb3BzKCkge1xuXHR0YXNrcy5jbGVhcigpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdGFzayB0aGF0IHJ1bnMgb24gZWFjaCByYWYgZnJhbWVcbiAqIHVudGlsIGl0IHJldHVybnMgYSBmYWxzeSB2YWx1ZSBvciBpcyBhYm9ydGVkXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuVGFza0NhbGxiYWNrfSBjYWxsYmFja1xuICogQHJldHVybnMge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuVGFza31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvb3AoY2FsbGJhY2spIHtcblx0LyoqIEB0eXBlIHtpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLlRhc2tFbnRyeX0gKi9cblx0bGV0IHRhc2s7XG5cdGlmICh0YXNrcy5zaXplID09PSAwKSByYWYocnVuX3Rhc2tzKTtcblx0cmV0dXJuIHtcblx0XHRwcm9taXNlOiBuZXcgUHJvbWlzZSgoZnVsZmlsbCkgPT4ge1xuXHRcdFx0dGFza3MuYWRkKCh0YXNrID0geyBjOiBjYWxsYmFjaywgZjogZnVsZmlsbCB9KSk7XG5cdFx0fSksXG5cdFx0YWJvcnQoKSB7XG5cdFx0XHR0YXNrcy5kZWxldGUodGFzayk7XG5cdFx0fVxuXHR9O1xufVxuIiwgIi8qKiBAdHlwZSB7dHlwZW9mIGdsb2JhbFRoaXN9ICovXG5leHBvcnQgY29uc3QgZ2xvYmFscyA9XG5cdHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5cdFx0PyB3aW5kb3dcblx0XHQ6IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xuXHRcdD8gZ2xvYmFsVGhpc1xuXHRcdDogLy8gQHRzLWlnbm9yZSBOb2RlIHR5cGluZ3MgaGF2ZSB0aGlzXG5cdFx0ICBnbG9iYWw7XG4iLCAiaW1wb3J0IHsgZ2xvYmFscyB9IGZyb20gJy4vZ2xvYmFscy5qcyc7XG5cbi8qKlxuICogUmVzaXplIG9ic2VydmVyIHNpbmdsZXRvbi5cbiAqIE9uZSBsaXN0ZW5lciBwZXIgZWxlbWVudCBvbmx5IVxuICogaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9hL2Nocm9taXVtLm9yZy9nL2JsaW5rLWRldi9jL3o2aWVuT05VYjVBL20vRjUtVmNVWnRCQUFKXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXNpemVPYnNlcnZlclNpbmdsZXRvbiB7XG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcmVhZG9ubHlcblx0ICogQHR5cGUge1dlYWtNYXA8RWxlbWVudCwgaW1wb3J0KCcuL3ByaXZhdGUuanMnKS5MaXN0ZW5lcj59XG5cdCAqL1xuXHRfbGlzdGVuZXJzID0gJ1dlYWtNYXAnIGluIGdsb2JhbHMgPyBuZXcgV2Vha01hcCgpIDogdW5kZWZpbmVkO1xuXG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdHlwZSB7UmVzaXplT2JzZXJ2ZXJ9XG5cdCAqL1xuXHRfb2JzZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cblx0LyoqIEB0eXBlIHtSZXNpemVPYnNlcnZlck9wdGlvbnN9ICovXG5cdG9wdGlvbnM7XG5cblx0LyoqIEBwYXJhbSB7UmVzaXplT2JzZXJ2ZXJPcHRpb25zfSBvcHRpb25zICovXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuXHQgKiBAcGFyYW0ge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuTGlzdGVuZXJ9IGxpc3RlbmVyXG5cdCAqIEByZXR1cm5zIHsoKSA9PiB2b2lkfVxuXHQgKi9cblx0b2JzZXJ2ZShlbGVtZW50LCBsaXN0ZW5lcikge1xuXHRcdHRoaXMuX2xpc3RlbmVycy5zZXQoZWxlbWVudCwgbGlzdGVuZXIpO1xuXHRcdHRoaXMuX2dldE9ic2VydmVyKCkub2JzZXJ2ZShlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHR0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGVsZW1lbnQpO1xuXHRcdFx0dGhpcy5fb2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpOyAvLyB0aGlzIGxpbmUgY2FuIHByb2JhYmx5IGJlIHJlbW92ZWRcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfZ2V0T2JzZXJ2ZXIoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHRoaXMuX29ic2VydmVyID8/XG5cdFx0XHQodGhpcy5fb2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcblx0XHRcdFx0Zm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG5cdFx0XHRcdFx0UmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24uZW50cmllcy5zZXQoZW50cnkudGFyZ2V0LCBlbnRyeSk7XG5cdFx0XHRcdFx0dGhpcy5fbGlzdGVuZXJzLmdldChlbnRyeS50YXJnZXQpPy4oZW50cnkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSlcblx0XHQpO1xuXHR9XG59XG5cbi8vIE5lZWRzIHRvIGJlIHdyaXR0ZW4gbGlrZSB0aGlzIHRvIHBhc3MgdGhlIHRyZWUtc2hha2UtdGVzdFxuUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24uZW50cmllcyA9ICdXZWFrTWFwJyBpbiBnbG9iYWxzID8gbmV3IFdlYWtNYXAoKSA6IHVuZGVmaW5lZDtcbiIsICJpbXBvcnQgeyBjb250ZW50ZWRpdGFibGVfdHJ1dGh5X3ZhbHVlcywgaGFzX3Byb3AgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuaW1wb3J0IHsgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24gfSBmcm9tICcuL1Jlc2l6ZU9ic2VydmVyU2luZ2xldG9uLmpzJztcblxuLy8gVHJhY2sgd2hpY2ggbm9kZXMgYXJlIGNsYWltZWQgZHVyaW5nIGh5ZHJhdGlvbi4gVW5jbGFpbWVkIG5vZGVzIGNhbiB0aGVuIGJlIHJlbW92ZWQgZnJvbSB0aGUgRE9NXG4vLyBhdCB0aGUgZW5kIG9mIGh5ZHJhdGlvbiB3aXRob3V0IHRvdWNoaW5nIHRoZSByZW1haW5pbmcgbm9kZXMuXG5sZXQgaXNfaHlkcmF0aW5nID0gZmFsc2U7XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydF9oeWRyYXRpbmcoKSB7XG5cdGlzX2h5ZHJhdGluZyA9IHRydWU7XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmRfaHlkcmF0aW5nKCkge1xuXHRpc19oeWRyYXRpbmcgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gbG93XG4gKiBAcGFyYW0ge251bWJlcn0gaGlnaFxuICogQHBhcmFtIHsoaW5kZXg6IG51bWJlcikgPT4gbnVtYmVyfSBrZXlcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gdXBwZXJfYm91bmQobG93LCBoaWdoLCBrZXksIHZhbHVlKSB7XG5cdC8vIFJldHVybiBmaXJzdCBpbmRleCBvZiB2YWx1ZSBsYXJnZXIgdGhhbiBpbnB1dCB2YWx1ZSBpbiB0aGUgcmFuZ2UgW2xvdywgaGlnaClcblx0d2hpbGUgKGxvdyA8IGhpZ2gpIHtcblx0XHRjb25zdCBtaWQgPSBsb3cgKyAoKGhpZ2ggLSBsb3cpID4+IDEpO1xuXHRcdGlmIChrZXkobWlkKSA8PSB2YWx1ZSkge1xuXHRcdFx0bG93ID0gbWlkICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGlnaCA9IG1pZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGxvdztcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGVFeH0gdGFyZ2V0XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gaW5pdF9oeWRyYXRlKHRhcmdldCkge1xuXHRpZiAodGFyZ2V0Lmh5ZHJhdGVfaW5pdCkgcmV0dXJuO1xuXHR0YXJnZXQuaHlkcmF0ZV9pbml0ID0gdHJ1ZTtcblx0Ly8gV2Uga25vdyB0aGF0IGFsbCBjaGlsZHJlbiBoYXZlIGNsYWltX29yZGVyIHZhbHVlcyBzaW5jZSB0aGUgdW5jbGFpbWVkIGhhdmUgYmVlbiBkZXRhY2hlZCBpZiB0YXJnZXQgaXMgbm90IDxoZWFkPlxuXG5cdGxldCBjaGlsZHJlbiA9IC8qKiBAdHlwZSB7QXJyYXlMaWtlPE5vZGVFeDI+fSAqLyAodGFyZ2V0LmNoaWxkTm9kZXMpO1xuXHQvLyBJZiB0YXJnZXQgaXMgPGhlYWQ+LCB0aGVyZSBtYXkgYmUgY2hpbGRyZW4gd2l0aG91dCBjbGFpbV9vcmRlclxuXHRpZiAodGFyZ2V0Lm5vZGVOYW1lID09PSAnSEVBRCcpIHtcblx0XHRjb25zdCBteV9jaGlsZHJlbiA9IFtdO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IG5vZGUgPSBjaGlsZHJlbltpXTtcblx0XHRcdGlmIChub2RlLmNsYWltX29yZGVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bXlfY2hpbGRyZW4ucHVzaChub2RlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Y2hpbGRyZW4gPSBteV9jaGlsZHJlbjtcblx0fVxuXHQvKlxuXHQgKiBSZW9yZGVyIGNsYWltZWQgY2hpbGRyZW4gb3B0aW1hbGx5LlxuXHQgKiBXZSBjYW4gcmVvcmRlciBjbGFpbWVkIGNoaWxkcmVuIG9wdGltYWxseSBieSBmaW5kaW5nIHRoZSBsb25nZXN0IHN1YnNlcXVlbmNlIG9mXG5cdCAqIG5vZGVzIHRoYXQgYXJlIGFscmVhZHkgY2xhaW1lZCBpbiBvcmRlciBhbmQgb25seSBtb3ZpbmcgdGhlIHJlc3QuIFRoZSBsb25nZXN0XG5cdCAqIHN1YnNlcXVlbmNlIG9mIG5vZGVzIHRoYXQgYXJlIGNsYWltZWQgaW4gb3JkZXIgY2FuIGJlIGZvdW5kIGJ5XG5cdCAqIGNvbXB1dGluZyB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIC5jbGFpbV9vcmRlciB2YWx1ZXMuXG5cdCAqXG5cdCAqIFRoaXMgYWxnb3JpdGhtIGlzIG9wdGltYWwgaW4gZ2VuZXJhdGluZyB0aGUgbGVhc3QgYW1vdW50IG9mIHJlb3JkZXIgb3BlcmF0aW9uc1xuXHQgKiBwb3NzaWJsZS5cblx0ICpcblx0ICogUHJvb2Y6XG5cdCAqIFdlIGtub3cgdGhhdCwgZ2l2ZW4gYSBzZXQgb2YgcmVvcmRlcmluZyBvcGVyYXRpb25zLCB0aGUgbm9kZXMgdGhhdCBkbyBub3QgbW92ZVxuXHQgKiBhbHdheXMgZm9ybSBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlLCBzaW5jZSB0aGV5IGRvIG5vdCBtb3ZlIGFtb25nIGVhY2ggb3RoZXJcblx0ICogbWVhbmluZyB0aGF0IHRoZXkgbXVzdCBiZSBhbHJlYWR5IG9yZGVyZWQgYW1vbmcgZWFjaCBvdGhlci4gVGh1cywgdGhlIG1heGltYWxcblx0ICogc2V0IG9mIG5vZGVzIHRoYXQgZG8gbm90IG1vdmUgZm9ybSBhIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZS5cblx0ICovXG5cdC8vIENvbXB1dGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlXG5cdC8vIG06IHN1YnNlcXVlbmNlIGxlbmd0aCBqID0+IGluZGV4IGsgb2Ygc21hbGxlc3QgdmFsdWUgdGhhdCBlbmRzIGFuIGluY3JlYXNpbmcgc3Vic2VxdWVuY2Ugb2YgbGVuZ3RoIGpcblx0Y29uc3QgbSA9IG5ldyBJbnQzMkFycmF5KGNoaWxkcmVuLmxlbmd0aCArIDEpO1xuXHQvLyBQcmVkZWNlc3NvciBpbmRpY2VzICsgMVxuXHRjb25zdCBwID0gbmV3IEludDMyQXJyYXkoY2hpbGRyZW4ubGVuZ3RoKTtcblx0bVswXSA9IC0xO1xuXHRsZXQgbG9uZ2VzdCA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBjdXJyZW50ID0gY2hpbGRyZW5baV0uY2xhaW1fb3JkZXI7XG5cdFx0Ly8gRmluZCB0aGUgbGFyZ2VzdCBzdWJzZXF1ZW5jZSBsZW5ndGggc3VjaCB0aGF0IGl0IGVuZHMgaW4gYSB2YWx1ZSBsZXNzIHRoYW4gb3VyIGN1cnJlbnQgdmFsdWVcblx0XHQvLyB1cHBlcl9ib3VuZCByZXR1cm5zIGZpcnN0IGdyZWF0ZXIgdmFsdWUsIHNvIHdlIHN1YnRyYWN0IG9uZVxuXHRcdC8vIHdpdGggZmFzdCBwYXRoIGZvciB3aGVuIHdlIGFyZSBvbiB0aGUgY3VycmVudCBsb25nZXN0IHN1YnNlcXVlbmNlXG5cdFx0Y29uc3Qgc2VxX2xlbiA9XG5cdFx0XHQobG9uZ2VzdCA+IDAgJiYgY2hpbGRyZW5bbVtsb25nZXN0XV0uY2xhaW1fb3JkZXIgPD0gY3VycmVudFxuXHRcdFx0XHQ/IGxvbmdlc3QgKyAxXG5cdFx0XHRcdDogdXBwZXJfYm91bmQoMSwgbG9uZ2VzdCwgKGlkeCkgPT4gY2hpbGRyZW5bbVtpZHhdXS5jbGFpbV9vcmRlciwgY3VycmVudCkpIC0gMTtcblx0XHRwW2ldID0gbVtzZXFfbGVuXSArIDE7XG5cdFx0Y29uc3QgbmV3X2xlbiA9IHNlcV9sZW4gKyAxO1xuXHRcdC8vIFdlIGNhbiBndWFyYW50ZWUgdGhhdCBjdXJyZW50IGlzIHRoZSBzbWFsbGVzdCB2YWx1ZS4gT3RoZXJ3aXNlLCB3ZSB3b3VsZCBoYXZlIGdlbmVyYXRlZCBhIGxvbmdlciBzZXF1ZW5jZS5cblx0XHRtW25ld19sZW5dID0gaTtcblx0XHRsb25nZXN0ID0gTWF0aC5tYXgobmV3X2xlbiwgbG9uZ2VzdCk7XG5cdH1cblx0Ly8gVGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBvZiBub2RlcyAoaW5pdGlhbGx5IHJldmVyc2VkKVxuXG5cdC8qKlxuXHQgKiBAdHlwZSB7Tm9kZUV4MltdfVxuXHQgKi9cblx0Y29uc3QgbGlzID0gW107XG5cdC8vIFRoZSByZXN0IG9mIHRoZSBub2Rlcywgbm9kZXMgdGhhdCB3aWxsIGJlIG1vdmVkXG5cblx0LyoqXG5cdCAqIEB0eXBlIHtOb2RlRXgyW119XG5cdCAqL1xuXHRjb25zdCB0b19tb3ZlID0gW107XG5cdGxldCBsYXN0ID0gY2hpbGRyZW4ubGVuZ3RoIC0gMTtcblx0Zm9yIChsZXQgY3VyID0gbVtsb25nZXN0XSArIDE7IGN1ciAhPSAwOyBjdXIgPSBwW2N1ciAtIDFdKSB7XG5cdFx0bGlzLnB1c2goY2hpbGRyZW5bY3VyIC0gMV0pO1xuXHRcdGZvciAoOyBsYXN0ID49IGN1cjsgbGFzdC0tKSB7XG5cdFx0XHR0b19tb3ZlLnB1c2goY2hpbGRyZW5bbGFzdF0pO1xuXHRcdH1cblx0XHRsYXN0LS07XG5cdH1cblx0Zm9yICg7IGxhc3QgPj0gMDsgbGFzdC0tKSB7XG5cdFx0dG9fbW92ZS5wdXNoKGNoaWxkcmVuW2xhc3RdKTtcblx0fVxuXHRsaXMucmV2ZXJzZSgpO1xuXHQvLyBXZSBzb3J0IHRoZSBub2RlcyBiZWluZyBtb3ZlZCB0byBndWFyYW50ZWUgdGhhdCB0aGVpciBpbnNlcnRpb24gb3JkZXIgbWF0Y2hlcyB0aGUgY2xhaW0gb3JkZXJcblx0dG9fbW92ZS5zb3J0KChhLCBiKSA9PiBhLmNsYWltX29yZGVyIC0gYi5jbGFpbV9vcmRlcik7XG5cdC8vIEZpbmFsbHksIHdlIG1vdmUgdGhlIG5vZGVzXG5cdGZvciAobGV0IGkgPSAwLCBqID0gMDsgaSA8IHRvX21vdmUubGVuZ3RoOyBpKyspIHtcblx0XHR3aGlsZSAoaiA8IGxpcy5sZW5ndGggJiYgdG9fbW92ZVtpXS5jbGFpbV9vcmRlciA+PSBsaXNbal0uY2xhaW1fb3JkZXIpIHtcblx0XHRcdGorKztcblx0XHR9XG5cdFx0Y29uc3QgYW5jaG9yID0gaiA8IGxpcy5sZW5ndGggPyBsaXNbal0gOiBudWxsO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUodG9fbW92ZVtpXSwgYW5jaG9yKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgbm9kZSkge1xuXHR0YXJnZXQuYXBwZW5kQ2hpbGQobm9kZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZV9zaGVldF9pZFxuICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRfc3R5bGVzKHRhcmdldCwgc3R5bGVfc2hlZXRfaWQsIHN0eWxlcykge1xuXHRjb25zdCBhcHBlbmRfc3R5bGVzX3RvID0gZ2V0X3Jvb3RfZm9yX3N0eWxlKHRhcmdldCk7XG5cdGlmICghYXBwZW5kX3N0eWxlc190by5nZXRFbGVtZW50QnlJZChzdHlsZV9zaGVldF9pZCkpIHtcblx0XHRjb25zdCBzdHlsZSA9IGVsZW1lbnQoJ3N0eWxlJyk7XG5cdFx0c3R5bGUuaWQgPSBzdHlsZV9zaGVldF9pZDtcblx0XHRzdHlsZS50ZXh0Q29udGVudCA9IHN0eWxlcztcblx0XHRhcHBlbmRfc3R5bGVzaGVldChhcHBlbmRfc3R5bGVzX3RvLCBzdHlsZSk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm5zIHtTaGFkb3dSb290IHwgRG9jdW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSkge1xuXHRpZiAoIW5vZGUpIHJldHVybiBkb2N1bWVudDtcblx0Y29uc3Qgcm9vdCA9IG5vZGUuZ2V0Um9vdE5vZGUgPyBub2RlLmdldFJvb3ROb2RlKCkgOiBub2RlLm93bmVyRG9jdW1lbnQ7XG5cdGlmIChyb290ICYmIC8qKiBAdHlwZSB7U2hhZG93Um9vdH0gKi8gKHJvb3QpLmhvc3QpIHtcblx0XHRyZXR1cm4gLyoqIEB0eXBlIHtTaGFkb3dSb290fSAqLyAocm9vdCk7XG5cdH1cblx0cmV0dXJuIG5vZGUub3duZXJEb2N1bWVudDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm5zIHtDU1NTdHlsZVNoZWV0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQobm9kZSkge1xuXHRjb25zdCBzdHlsZV9lbGVtZW50ID0gZWxlbWVudCgnc3R5bGUnKTtcblx0Ly8gRm9yIHRyYW5zaXRpb25zIHRvIHdvcmsgd2l0aG91dCAnc3R5bGUtc3JjOiB1bnNhZmUtaW5saW5lJyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSxcblx0Ly8gdGhlc2UgZW1wdHkgdGFncyBuZWVkIHRvIGJlIGFsbG93ZWQgd2l0aCBhIGhhc2ggYXMgYSB3b3JrYXJvdW5kIHVudGlsIHdlIG1vdmUgdG8gdGhlIFdlYiBBbmltYXRpb25zIEFQSS5cblx0Ly8gVXNpbmcgdGhlIGhhc2ggZm9yIHRoZSBlbXB0eSBzdHJpbmcgKGZvciBhbiBlbXB0eSB0YWcpIHdvcmtzIGluIGFsbCBicm93c2VycyBleGNlcHQgU2FmYXJpLlxuXHQvLyBTbyBhcyBhIHdvcmthcm91bmQgZm9yIHRoZSB3b3JrYXJvdW5kLCB3aGVuIHdlIGFwcGVuZCBlbXB0eSBzdHlsZSB0YWdzIHdlIHNldCB0aGVpciBjb250ZW50IHRvIC8qIGVtcHR5ICovLlxuXHQvLyBUaGUgaGFzaCAnc2hhMjU2LTlPbE5PMERORWVhVnpITDRSWndDTHNCSEE4V0JROHRvQnAvNEY1WFYybmM9JyB3aWxsIHRoZW4gd29yayBldmVuIGluIFNhZmFyaS5cblx0c3R5bGVfZWxlbWVudC50ZXh0Q29udGVudCA9ICcvKiBlbXB0eSAqLyc7XG5cdGFwcGVuZF9zdHlsZXNoZWV0KGdldF9yb290X2Zvcl9zdHlsZShub2RlKSwgc3R5bGVfZWxlbWVudCk7XG5cdHJldHVybiBzdHlsZV9lbGVtZW50LnNoZWV0O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7U2hhZG93Um9vdCB8IERvY3VtZW50fSBub2RlXG4gKiBAcGFyYW0ge0hUTUxTdHlsZUVsZW1lbnR9IHN0eWxlXG4gKiBAcmV0dXJucyB7Q1NTU3R5bGVTaGVldH1cbiAqL1xuZnVuY3Rpb24gYXBwZW5kX3N0eWxlc2hlZXQobm9kZSwgc3R5bGUpIHtcblx0YXBwZW5kKC8qKiBAdHlwZSB7RG9jdW1lbnR9ICovIChub2RlKS5oZWFkIHx8IG5vZGUsIHN0eWxlKTtcblx0cmV0dXJuIHN0eWxlLnNoZWV0O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZUV4fSB0YXJnZXRcbiAqIEBwYXJhbSB7Tm9kZUV4fSBub2RlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKSB7XG5cdGlmIChpc19oeWRyYXRpbmcpIHtcblx0XHRpbml0X2h5ZHJhdGUodGFyZ2V0KTtcblx0XHRpZiAoXG5cdFx0XHR0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZCA9PT0gdW5kZWZpbmVkIHx8XG5cdFx0XHQodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgIT09IG51bGwgJiYgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQucGFyZW50Tm9kZSAhPT0gdGFyZ2V0KVxuXHRcdCkge1xuXHRcdFx0dGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSB0YXJnZXQuZmlyc3RDaGlsZDtcblx0XHR9XG5cdFx0Ly8gU2tpcCBub2RlcyBvZiB1bmRlZmluZWQgb3JkZXJpbmdcblx0XHR3aGlsZSAodGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgIT09IG51bGwgJiYgdGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQuY2xhaW1fb3JkZXIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSB0YXJnZXQuYWN0dWFsX2VuZF9jaGlsZC5uZXh0U2libGluZztcblx0XHR9XG5cdFx0aWYgKG5vZGUgIT09IHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkKSB7XG5cdFx0XHQvLyBXZSBvbmx5IGluc2VydCBpZiB0aGUgb3JkZXJpbmcgb2YgdGhpcyBub2RlIHNob3VsZCBiZSBtb2RpZmllZCBvciB0aGUgcGFyZW50IG5vZGUgaXMgbm90IHRhcmdldFxuXHRcdFx0aWYgKG5vZGUuY2xhaW1fb3JkZXIgIT09IHVuZGVmaW5lZCB8fCBub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCkge1xuXHRcdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKG5vZGUsIHRhcmdldC5hY3R1YWxfZW5kX2NoaWxkKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFjdHVhbF9lbmRfY2hpbGQgPSBub2RlLm5leHRTaWJsaW5nO1xuXHRcdH1cblx0fSBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCB8fCBub2RlLm5leHRTaWJsaW5nICE9PSBudWxsKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKG5vZGUpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtOb2RlfSBbYW5jaG9yXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcblx0dGFyZ2V0Lmluc2VydEJlZm9yZShub2RlLCBhbmNob3IgfHwgbnVsbCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlRXh9IHRhcmdldFxuICogQHBhcmFtIHtOb2RlRXh9IG5vZGVcbiAqIEBwYXJhbSB7Tm9kZUV4fSBbYW5jaG9yXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfaHlkcmF0aW9uKHRhcmdldCwgbm9kZSwgYW5jaG9yKSB7XG5cdGlmIChpc19oeWRyYXRpbmcgJiYgIWFuY2hvcikge1xuXHRcdGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKTtcblx0fSBlbHNlIGlmIChub2RlLnBhcmVudE5vZGUgIT09IHRhcmdldCB8fCBub2RlLm5leHRTaWJsaW5nICE9IGFuY2hvcikge1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGFjaChub2RlKSB7XG5cdGlmIChub2RlLnBhcmVudE5vZGUpIHtcblx0XHRub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95X2VhY2goaXRlcmF0aW9ucywgZGV0YWNoaW5nKSB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdGlmIChpdGVyYXRpb25zW2ldKSBpdGVyYXRpb25zW2ldLmQoZGV0YWNoaW5nKTtcblx0fVxufVxuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7a2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwfSBLXG4gKiBAcGFyYW0ge0t9IG5hbWVcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFRhZ05hbWVNYXBbS119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50KG5hbWUpIHtcblx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG59XG5cbi8qKlxuICogQHRlbXBsYXRlIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9IEtcbiAqIEBwYXJhbSB7S30gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IGlzXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudF9pcyhuYW1lLCBpcykge1xuXHRyZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lLCB7IGlzIH0pO1xufVxuXG4vKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdGVtcGxhdGUge2tleW9mIFR9IEtcbiAqIEBwYXJhbSB7VH0gb2JqXG4gKiBAcGFyYW0ge0tbXX0gZXhjbHVkZVxuICogQHJldHVybnMge1BpY2s8VCwgRXhjbHVkZTxrZXlvZiBULCBLPj59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYmplY3Rfd2l0aG91dF9wcm9wZXJ0aWVzKG9iaiwgZXhjbHVkZSkge1xuXHRjb25zdCB0YXJnZXQgPSAvKiogQHR5cGUge1BpY2s8VCwgRXhjbHVkZTxrZXlvZiBULCBLPj59ICovICh7fSk7XG5cdGZvciAoY29uc3QgayBpbiBvYmopIHtcblx0XHRpZiAoXG5cdFx0XHRoYXNfcHJvcChvYmosIGspICYmXG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRleGNsdWRlLmluZGV4T2YoaykgPT09IC0xXG5cdFx0KSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHR0YXJnZXRba10gPSBvYmpba107XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogQHRlbXBsYXRlIHtrZXlvZiBTVkdFbGVtZW50VGFnTmFtZU1hcH0gS1xuICogQHBhcmFtIHtLfSBuYW1lXG4gKiBAcmV0dXJucyB7U1ZHRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN2Z19lbGVtZW50KG5hbWUpIHtcblx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YVxuICogQHJldHVybnMge1RleHR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZXh0KGRhdGEpIHtcblx0cmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtUZXh0fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNwYWNlKCkge1xuXHRyZXR1cm4gdGV4dCgnICcpO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtUZXh0fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5KCkge1xuXHRyZXR1cm4gdGV4dCgnJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAqIEByZXR1cm5zIHtDb21tZW50fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tbWVudChjb250ZW50KSB7XG5cdHJldHVybiBkb2N1bWVudC5jcmVhdGVDb21tZW50KGNvbnRlbnQpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0fSBoYW5kbGVyXG4gKiBAcGFyYW0ge2Jvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyB8IEV2ZW50TGlzdGVuZXJPcHRpb25zfSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHsoKSA9PiB2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuKG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKSB7XG5cdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG5cdHJldHVybiAoKSA9PiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHsoZXZlbnQ6IGFueSkgPT4gYW55fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByZXZlbnRfZGVmYXVsdChmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0cmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuXHR9O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHsoZXZlbnQ6IGFueSkgPT4gYW55fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3BfcHJvcGFnYXRpb24oZm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG5cdH07XG59XG5cbi8qKlxuICogQHJldHVybnMgeyhldmVudDogYW55KSA9PiBhbnl9ICovXG5leHBvcnQgZnVuY3Rpb24gc3RvcF9pbW1lZGlhdGVfcHJvcGFnYXRpb24oZm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRyZXR1cm4gZm4uY2FsbCh0aGlzLCBldmVudCk7XG5cdH07XG59XG5cbi8qKlxuICogQHJldHVybnMgeyhldmVudDogYW55KSA9PiB2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGYoZm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKSBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcblx0fTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7KGV2ZW50OiBhbnkpID0+IHZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gdHJ1c3RlZChmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGlmIChldmVudC5pc1RydXN0ZWQpIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuXHR9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICogQHBhcmFtIHtzdHJpbmd9IFt2YWx1ZV1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG5cdGlmICh2YWx1ZSA9PSBudWxsKSBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGUpO1xuXHRlbHNlIGlmIChub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpICE9PSB2YWx1ZSkgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG59XG4vKipcbiAqIExpc3Qgb2YgYXR0cmlidXRlcyB0aGF0IHNob3VsZCBhbHdheXMgYmUgc2V0IHRocm91Z2ggdGhlIGF0dHIgbWV0aG9kLFxuICogYmVjYXVzZSB1cGRhdGluZyB0aGVtIHRocm91Z2ggdGhlIHByb3BlcnR5IHNldHRlciBkb2Vzbid0IHdvcmsgcmVsaWFibHkuXG4gKiBJbiB0aGUgZXhhbXBsZSBvZiBgd2lkdGhgL2BoZWlnaHRgLCB0aGUgcHJvYmxlbSBpcyB0aGF0IHRoZSBzZXR0ZXIgb25seVxuICogYWNjZXB0cyBudW1lcmljIHZhbHVlcywgYnV0IHRoZSBhdHRyaWJ1dGUgY2FuIGFsc28gYmUgc2V0IHRvIGEgc3RyaW5nIGxpa2UgYDUwJWAuXG4gKiBJZiB0aGlzIGxpc3QgYmVjb21lcyB0b28gYmlnLCByZXRoaW5rIHRoaXMgYXBwcm9hY2guXG4gKi9cbmNvbnN0IGFsd2F5c19zZXRfdGhyb3VnaF9zZXRfYXR0cmlidXRlID0gWyd3aWR0aCcsICdoZWlnaHQnXTtcblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7eyBbeDogc3RyaW5nXTogc3RyaW5nIH19IGF0dHJpYnV0ZXNcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuXHQvLyBAdHMtaWdub3JlXG5cdGNvbnN0IGRlc2NyaXB0b3JzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobm9kZS5fX3Byb3RvX18pO1xuXHRmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0aWYgKGF0dHJpYnV0ZXNba2V5XSA9PSBudWxsKSB7XG5cdFx0XHRub2RlLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuXHRcdH0gZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG5cdFx0XHRub2RlLnN0eWxlLmNzc1RleHQgPSBhdHRyaWJ1dGVzW2tleV07XG5cdFx0fSBlbHNlIGlmIChrZXkgPT09ICdfX3ZhbHVlJykge1xuXHRcdFx0LyoqIEB0eXBlIHthbnl9ICovIChub2RlKS52YWx1ZSA9IG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0ZGVzY3JpcHRvcnNba2V5XSAmJlxuXHRcdFx0ZGVzY3JpcHRvcnNba2V5XS5zZXQgJiZcblx0XHRcdGFsd2F5c19zZXRfdGhyb3VnaF9zZXRfYXR0cmlidXRlLmluZGV4T2Yoa2V5KSA9PT0gLTFcblx0XHQpIHtcblx0XHRcdG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXR0cihub2RlLCBrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50ICYgRWxlbWVudENTU0lubGluZVN0eWxlfSBub2RlXG4gKiBAcGFyYW0ge3sgW3g6IHN0cmluZ106IHN0cmluZyB9fSBhdHRyaWJ1dGVzXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9zdmdfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG5cdGZvciAoY29uc3Qga2V5IGluIGF0dHJpYnV0ZXMpIHtcblx0XHRhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgdW5rbm93bj59IGRhdGFfbWFwXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9jdXN0b21fZWxlbWVudF9kYXRhX21hcChub2RlLCBkYXRhX21hcCkge1xuXHRPYmplY3Qua2V5cyhkYXRhX21hcCkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0c2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwga2V5LCBkYXRhX21hcFtrZXldKTtcblx0fSk7XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEobm9kZSwgcHJvcCwgdmFsdWUpIHtcblx0aWYgKHByb3AgaW4gbm9kZSkge1xuXHRcdG5vZGVbcHJvcF0gPSB0eXBlb2Ygbm9kZVtwcm9wXSA9PT0gJ2Jvb2xlYW4nICYmIHZhbHVlID09PSAnJyA/IHRydWUgOiB2YWx1ZTtcblx0fSBlbHNlIHtcblx0XHRhdHRyKG5vZGUsIHByb3AsIHZhbHVlKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9keW5hbWljX2VsZW1lbnRfZGF0YSh0YWcpIHtcblx0cmV0dXJuIC8tLy50ZXN0KHRhZykgPyBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YV9tYXAgOiBzZXRfYXR0cmlidXRlcztcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHhsaW5rX2F0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSkge1xuXHRub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgYXR0cmlidXRlLCB2YWx1ZSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9zdmVsdGVfZGF0YXNldChub2RlKSB7XG5cdHJldHVybiBub2RlLmRhdGFzZXQuc3ZlbHRlSDtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dW5rbm93bltdfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldF9iaW5kaW5nX2dyb3VwX3ZhbHVlKGdyb3VwLCBfX3ZhbHVlLCBjaGVja2VkKSB7XG5cdGNvbnN0IHZhbHVlID0gbmV3IFNldCgpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGdyb3VwLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0aWYgKGdyb3VwW2ldLmNoZWNrZWQpIHZhbHVlLmFkZChncm91cFtpXS5fX3ZhbHVlKTtcblx0fVxuXHRpZiAoIWNoZWNrZWQpIHtcblx0XHR2YWx1ZS5kZWxldGUoX192YWx1ZSk7XG5cdH1cblx0cmV0dXJuIEFycmF5LmZyb20odmFsdWUpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudFtdfSBncm91cFxuICogQHJldHVybnMge3sgcCguLi5pbnB1dHM6IEhUTUxJbnB1dEVsZW1lbnRbXSk6IHZvaWQ7IHIoKTogdm9pZDsgfX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRfYmluZGluZ19ncm91cChncm91cCkge1xuXHQvKipcblx0ICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnRbXX0gKi9cblx0bGV0IF9pbnB1dHM7XG5cdHJldHVybiB7XG5cdFx0LyogcHVzaCAqLyBwKC4uLmlucHV0cykge1xuXHRcdFx0X2lucHV0cyA9IGlucHV0cztcblx0XHRcdF9pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IGdyb3VwLnB1c2goaW5wdXQpKTtcblx0XHR9LFxuXHRcdC8qIHJlbW92ZSAqLyByKCkge1xuXHRcdFx0X2lucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4gZ3JvdXAuc3BsaWNlKGdyb3VwLmluZGV4T2YoaW5wdXQpLCAxKSk7XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyW119IGluZGV4ZXNcbiAqIEByZXR1cm5zIHt7IHUobmV3X2luZGV4ZXM6IG51bWJlcltdKTogdm9pZDsgcCguLi5pbnB1dHM6IEhUTUxJbnB1dEVsZW1lbnRbXSk6IHZvaWQ7IHI6ICgpID0+IHZvaWQ7IH19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0X2JpbmRpbmdfZ3JvdXBfZHluYW1pYyhncm91cCwgaW5kZXhlcykge1xuXHQvKipcblx0ICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnRbXX0gKi9cblx0bGV0IF9ncm91cCA9IGdldF9iaW5kaW5nX2dyb3VwKGdyb3VwKTtcblxuXHQvKipcblx0ICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnRbXX0gKi9cblx0bGV0IF9pbnB1dHM7XG5cblx0ZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXAoZ3JvdXApIHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGdyb3VwID0gZ3JvdXBbaW5kZXhlc1tpXV0gPSBncm91cFtpbmRleGVzW2ldXSB8fCBbXTtcblx0XHR9XG5cdFx0cmV0dXJuIGdyb3VwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHRmdW5jdGlvbiBwdXNoKCkge1xuXHRcdF9pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IF9ncm91cC5wdXNoKGlucHV0KSk7XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0XHRfaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiBfZ3JvdXAuc3BsaWNlKF9ncm91cC5pbmRleE9mKGlucHV0KSwgMSkpO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0LyogdXBkYXRlICovIHUobmV3X2luZGV4ZXMpIHtcblx0XHRcdGluZGV4ZXMgPSBuZXdfaW5kZXhlcztcblx0XHRcdGNvbnN0IG5ld19ncm91cCA9IGdldF9iaW5kaW5nX2dyb3VwKGdyb3VwKTtcblx0XHRcdGlmIChuZXdfZ3JvdXAgIT09IF9ncm91cCkge1xuXHRcdFx0XHRyZW1vdmUoKTtcblx0XHRcdFx0X2dyb3VwID0gbmV3X2dyb3VwO1xuXHRcdFx0XHRwdXNoKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiBwdXNoICovIHAoLi4uaW5wdXRzKSB7XG5cdFx0XHRfaW5wdXRzID0gaW5wdXRzO1xuXHRcdFx0cHVzaCgpO1xuXHRcdH0sXG5cdFx0LyogcmVtb3ZlICovIHI6IHJlbW92ZVxuXHR9O1xufVxuXG4vKiogQHJldHVybnMge251bWJlcn0gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b19udW1iZXIodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlID09PSAnJyA/IG51bGwgOiArdmFsdWU7XG59XG5cbi8qKiBAcmV0dXJucyB7YW55W119ICovXG5leHBvcnQgZnVuY3Rpb24gdGltZV9yYW5nZXNfdG9fYXJyYXkocmFuZ2VzKSB7XG5cdGNvbnN0IGFycmF5ID0gW107XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0YXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcblx0fVxuXHRyZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7Q2hpbGROb2RlW119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZHJlbihlbGVtZW50KSB7XG5cdHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtDaGlsZE5vZGVBcnJheX0gbm9kZXNcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBpbml0X2NsYWltX2luZm8obm9kZXMpIHtcblx0aWYgKG5vZGVzLmNsYWltX2luZm8gPT09IHVuZGVmaW5lZCkge1xuXHRcdG5vZGVzLmNsYWltX2luZm8gPSB7IGxhc3RfaW5kZXg6IDAsIHRvdGFsX2NsYWltZWQ6IDAgfTtcblx0fVxufVxuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7Q2hpbGROb2RlRXh9IFJcbiAqIEBwYXJhbSB7Q2hpbGROb2RlQXJyYXl9IG5vZGVzXG4gKiBAcGFyYW0geyhub2RlOiBDaGlsZE5vZGVFeCkgPT4gbm9kZSBpcyBSfSBwcmVkaWNhdGVcbiAqIEBwYXJhbSB7KG5vZGU6IENoaWxkTm9kZUV4KSA9PiBDaGlsZE5vZGVFeCB8IHVuZGVmaW5lZH0gcHJvY2Vzc19ub2RlXG4gKiBAcGFyYW0geygpID0+IFJ9IGNyZWF0ZV9ub2RlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRvbnRfdXBkYXRlX2xhc3RfaW5kZXhcbiAqIEByZXR1cm5zIHtSfVxuICovXG5mdW5jdGlvbiBjbGFpbV9ub2RlKG5vZGVzLCBwcmVkaWNhdGUsIHByb2Nlc3Nfbm9kZSwgY3JlYXRlX25vZGUsIGRvbnRfdXBkYXRlX2xhc3RfaW5kZXggPSBmYWxzZSkge1xuXHQvLyBUcnkgdG8gZmluZCBub2RlcyBpbiBhbiBvcmRlciBzdWNoIHRoYXQgd2UgbGVuZ3RoZW4gdGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZVxuXHRpbml0X2NsYWltX2luZm8obm9kZXMpO1xuXHRjb25zdCByZXN1bHRfbm9kZSA9ICgoKSA9PiB7XG5cdFx0Ly8gV2UgZmlyc3QgdHJ5IHRvIGZpbmQgYW4gZWxlbWVudCBhZnRlciB0aGUgcHJldmlvdXMgb25lXG5cdFx0Zm9yIChsZXQgaSA9IG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBub2RlID0gbm9kZXNbaV07XG5cdFx0XHRpZiAocHJlZGljYXRlKG5vZGUpKSB7XG5cdFx0XHRcdGNvbnN0IHJlcGxhY2VtZW50ID0gcHJvY2Vzc19ub2RlKG5vZGUpO1xuXHRcdFx0XHRpZiAocmVwbGFjZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdG5vZGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRub2Rlc1tpXSA9IHJlcGxhY2VtZW50O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghZG9udF91cGRhdGVfbGFzdF9pbmRleCkge1xuXHRcdFx0XHRcdG5vZGVzLmNsYWltX2luZm8ubGFzdF9pbmRleCA9IGk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIE90aGVyd2lzZSwgd2UgdHJ5IHRvIGZpbmQgb25lIGJlZm9yZVxuXHRcdC8vIFdlIGl0ZXJhdGUgaW4gcmV2ZXJzZSBzbyB0aGF0IHdlIGRvbid0IGdvIHRvbyBmYXIgYmFja1xuXHRcdGZvciAobGV0IGkgPSBub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Y29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuXHRcdFx0aWYgKHByZWRpY2F0ZShub2RlKSkge1xuXHRcdFx0XHRjb25zdCByZXBsYWNlbWVudCA9IHByb2Nlc3Nfbm9kZShub2RlKTtcblx0XHRcdFx0aWYgKHJlcGxhY2VtZW50ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRub2Rlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bm9kZXNbaV0gPSByZXBsYWNlbWVudDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIWRvbnRfdXBkYXRlX2xhc3RfaW5kZXgpIHtcblx0XHRcdFx0XHRub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXggPSBpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHJlcGxhY2VtZW50ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHQvLyBTaW5jZSB3ZSBzcGxpY2VkIGJlZm9yZSB0aGUgbGFzdF9pbmRleCwgd2UgZGVjcmVhc2UgaXRcblx0XHRcdFx0XHRub2Rlcy5jbGFpbV9pbmZvLmxhc3RfaW5kZXgtLTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbm9kZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gSWYgd2UgY2FuJ3QgZmluZCBhbnkgbWF0Y2hpbmcgbm9kZSwgd2UgY3JlYXRlIGEgbmV3IG9uZVxuXHRcdHJldHVybiBjcmVhdGVfbm9kZSgpO1xuXHR9KSgpO1xuXHRyZXN1bHRfbm9kZS5jbGFpbV9vcmRlciA9IG5vZGVzLmNsYWltX2luZm8udG90YWxfY2xhaW1lZDtcblx0bm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkICs9IDE7XG5cdHJldHVybiByZXN1bHRfbm9kZTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NoaWxkTm9kZUFycmF5fSBub2Rlc1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7eyBba2V5OiBzdHJpbmddOiBib29sZWFuIH19IGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7KG5hbWU6IHN0cmluZykgPT4gRWxlbWVudCB8IFNWR0VsZW1lbnR9IGNyZWF0ZV9lbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudCB8IFNWR0VsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgY3JlYXRlX2VsZW1lbnQpIHtcblx0cmV0dXJuIGNsYWltX25vZGUoXG5cdFx0bm9kZXMsXG5cdFx0LyoqIEByZXR1cm5zIHtub2RlIGlzIEVsZW1lbnQgfCBTVkdFbGVtZW50fSAqL1xuXHRcdChub2RlKSA9PiBub2RlLm5vZGVOYW1lID09PSBuYW1lLFxuXHRcdC8qKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGUgKi9cblx0XHQobm9kZSkgPT4ge1xuXHRcdFx0Y29uc3QgcmVtb3ZlID0gW107XG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRjb25zdCBhdHRyaWJ1dGUgPSBub2RlLmF0dHJpYnV0ZXNbal07XG5cdFx0XHRcdGlmICghYXR0cmlidXRlc1thdHRyaWJ1dGUubmFtZV0pIHtcblx0XHRcdFx0XHRyZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJlbW92ZS5mb3JFYWNoKCh2KSA9PiBub2RlLnJlbW92ZUF0dHJpYnV0ZSh2KSk7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH0sXG5cdFx0KCkgPT4gY3JlYXRlX2VsZW1lbnQobmFtZSlcblx0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0NoaWxkTm9kZUFycmF5fSBub2Rlc1xuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7eyBba2V5OiBzdHJpbmddOiBib29sZWFuIH19IGF0dHJpYnV0ZXNcbiAqIEByZXR1cm5zIHtFbGVtZW50IHwgU1ZHRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYWltX2VsZW1lbnQobm9kZXMsIG5hbWUsIGF0dHJpYnV0ZXMpIHtcblx0cmV0dXJuIGNsYWltX2VsZW1lbnRfYmFzZShub2RlcywgbmFtZSwgYXR0cmlidXRlcywgZWxlbWVudCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtDaGlsZE5vZGVBcnJheX0gbm9kZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge3sgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9fSBhdHRyaWJ1dGVzXG4gKiBAcmV0dXJucyB7RWxlbWVudCB8IFNWR0VsZW1lbnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFpbV9zdmdfZWxlbWVudChub2RlcywgbmFtZSwgYXR0cmlidXRlcykge1xuXHRyZXR1cm4gY2xhaW1fZWxlbWVudF9iYXNlKG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmdfZWxlbWVudCk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtDaGlsZE5vZGVBcnJheX0gbm9kZXNcbiAqIEByZXR1cm5zIHtUZXh0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuXHRyZXR1cm4gY2xhaW1fbm9kZShcblx0XHRub2Rlcyxcblx0XHQvKiogQHJldHVybnMge25vZGUgaXMgVGV4dH0gKi9cblx0XHQobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gMyxcblx0XHQvKiogQHBhcmFtIHtUZXh0fSBub2RlICovXG5cdFx0KG5vZGUpID0+IHtcblx0XHRcdGNvbnN0IGRhdGFfc3RyID0gJycgKyBkYXRhO1xuXHRcdFx0aWYgKG5vZGUuZGF0YS5zdGFydHNXaXRoKGRhdGFfc3RyKSkge1xuXHRcdFx0XHRpZiAobm9kZS5kYXRhLmxlbmd0aCAhPT0gZGF0YV9zdHIubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5vZGUuc3BsaXRUZXh0KGRhdGFfc3RyLmxlbmd0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5vZGUuZGF0YSA9IGRhdGFfc3RyO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0KCkgPT4gdGV4dChkYXRhKSxcblx0XHR0cnVlIC8vIFRleHQgbm9kZXMgc2hvdWxkIG5vdCB1cGRhdGUgbGFzdCBpbmRleCBzaW5jZSBpdCBpcyBsaWtlbHkgbm90IHdvcnRoIGl0IHRvIGVsaW1pbmF0ZSBhbiBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIG9mIGFjdHVhbCBlbGVtZW50c1xuXHQpO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtUZXh0fSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG5cdHJldHVybiBjbGFpbV90ZXh0KG5vZGVzLCAnICcpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Q2hpbGROb2RlQXJyYXl9IG5vZGVzXG4gKiBAcmV0dXJucyB7Q29tbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYWltX2NvbW1lbnQobm9kZXMsIGRhdGEpIHtcblx0cmV0dXJuIGNsYWltX25vZGUoXG5cdFx0bm9kZXMsXG5cdFx0LyoqIEByZXR1cm5zIHtub2RlIGlzIENvbW1lbnR9ICovXG5cdFx0KG5vZGUpID0+IG5vZGUubm9kZVR5cGUgPT09IDgsXG5cdFx0LyoqIEBwYXJhbSB7Q29tbWVudH0gbm9kZSAqL1xuXHRcdChub2RlKSA9PiB7XG5cdFx0XHRub2RlLmRhdGEgPSAnJyArIGRhdGE7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH0sXG5cdFx0KCkgPT4gY29tbWVudChkYXRhKSxcblx0XHR0cnVlXG5cdCk7XG59XG5cbmZ1bmN0aW9uIGdldF9jb21tZW50X2lkeChub2RlcywgdGV4dCwgc3RhcnQpIHtcblx0Zm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRjb25zdCBub2RlID0gbm9kZXNbaV07XG5cdFx0aWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCBub2RlICovICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpID09PSB0ZXh0KSB7XG5cdFx0XHRyZXR1cm4gaTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNfc3ZnXG4gKiBAcmV0dXJucyB7SHRtbFRhZ0h5ZHJhdGlvbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYWltX2h0bWxfdGFnKG5vZGVzLCBpc19zdmcpIHtcblx0Ly8gZmluZCBodG1sIG9wZW5pbmcgdGFnXG5cdGNvbnN0IHN0YXJ0X2luZGV4ID0gZ2V0X2NvbW1lbnRfaWR4KG5vZGVzLCAnSFRNTF9UQUdfU1RBUlQnLCAwKTtcblx0Y29uc3QgZW5kX2luZGV4ID0gZ2V0X2NvbW1lbnRfaWR4KG5vZGVzLCAnSFRNTF9UQUdfRU5EJywgc3RhcnRfaW5kZXggKyAxKTtcblx0aWYgKHN0YXJ0X2luZGV4ID09PSAtMSB8fCBlbmRfaW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKGlzX3N2Zyk7XG5cdH1cblxuXHRpbml0X2NsYWltX2luZm8obm9kZXMpO1xuXHRjb25zdCBodG1sX3RhZ19ub2RlcyA9IG5vZGVzLnNwbGljZShzdGFydF9pbmRleCwgZW5kX2luZGV4IC0gc3RhcnRfaW5kZXggKyAxKTtcblx0ZGV0YWNoKGh0bWxfdGFnX25vZGVzWzBdKTtcblx0ZGV0YWNoKGh0bWxfdGFnX25vZGVzW2h0bWxfdGFnX25vZGVzLmxlbmd0aCAtIDFdKTtcblx0Y29uc3QgY2xhaW1lZF9ub2RlcyA9IGh0bWxfdGFnX25vZGVzLnNsaWNlKDEsIGh0bWxfdGFnX25vZGVzLmxlbmd0aCAtIDEpO1xuXHRmb3IgKGNvbnN0IG4gb2YgY2xhaW1lZF9ub2Rlcykge1xuXHRcdG4uY2xhaW1fb3JkZXIgPSBub2Rlcy5jbGFpbV9pbmZvLnRvdGFsX2NsYWltZWQ7XG5cdFx0bm9kZXMuY2xhaW1faW5mby50b3RhbF9jbGFpbWVkICs9IDE7XG5cdH1cblx0cmV0dXJuIG5ldyBIdG1sVGFnSHlkcmF0aW9uKGlzX3N2ZywgY2xhaW1lZF9ub2Rlcyk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGFcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2RhdGEodGV4dCwgZGF0YSkge1xuXHRkYXRhID0gJycgKyBkYXRhO1xuXHRpZiAodGV4dC5kYXRhID09PSBkYXRhKSByZXR1cm47XG5cdHRleHQuZGF0YSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAoZGF0YSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGFcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2RhdGFfY29udGVudGVkaXRhYmxlKHRleHQsIGRhdGEpIHtcblx0ZGF0YSA9ICcnICsgZGF0YTtcblx0aWYgKHRleHQud2hvbGVUZXh0ID09PSBkYXRhKSByZXR1cm47XG5cdHRleHQuZGF0YSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAoZGF0YSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyX3ZhbHVlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9kYXRhX21heWJlX2NvbnRlbnRlZGl0YWJsZSh0ZXh0LCBkYXRhLCBhdHRyX3ZhbHVlKSB7XG5cdGlmICh+Y29udGVudGVkaXRhYmxlX3RydXRoeV92YWx1ZXMuaW5kZXhPZihhdHRyX3ZhbHVlKSkge1xuXHRcdHNldF9kYXRhX2NvbnRlbnRlZGl0YWJsZSh0ZXh0LCBkYXRhKTtcblx0fSBlbHNlIHtcblx0XHRzZXRfZGF0YSh0ZXh0LCBkYXRhKTtcblx0fVxufVxuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9pbnB1dF92YWx1ZShpbnB1dCwgdmFsdWUpIHtcblx0aW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfaW5wdXRfdHlwZShpbnB1dCwgdHlwZSkge1xuXHR0cnkge1xuXHRcdGlucHV0LnR5cGUgPSB0eXBlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gZG8gbm90aGluZ1xuXHR9XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X3N0eWxlKG5vZGUsIGtleSwgdmFsdWUsIGltcG9ydGFudCkge1xuXHRpZiAodmFsdWUgPT0gbnVsbCkge1xuXHRcdG5vZGUuc3R5bGUucmVtb3ZlUHJvcGVydHkoa2V5KTtcblx0fSBlbHNlIHtcblx0XHRub2RlLnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUsIGltcG9ydGFudCA/ICdpbXBvcnRhbnQnIDogJycpO1xuXHR9XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0X29wdGlvbihzZWxlY3QsIHZhbHVlLCBtb3VudGluZykge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Y29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG5cdFx0aWYgKG9wdGlvbi5fX3ZhbHVlID09PSB2YWx1ZSkge1xuXHRcdFx0b3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblx0aWYgKCFtb3VudGluZyB8fCB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0c2VsZWN0LnNlbGVjdGVkSW5kZXggPSAtMTsgLy8gbm8gb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZFxuXHR9XG59XG5cbi8qKlxuICogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0X29wdGlvbnMoc2VsZWN0LCB2YWx1ZSkge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdC5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0Y29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG5cdFx0b3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RfdmFsdWUoc2VsZWN0KSB7XG5cdGNvbnN0IHNlbGVjdGVkX29wdGlvbiA9IHNlbGVjdC5xdWVyeVNlbGVjdG9yKCc6Y2hlY2tlZCcpO1xuXHRyZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuXHRyZXR1cm4gW10ubWFwLmNhbGwoc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJzpjaGVja2VkJyksIChvcHRpb24pID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxuXG4vKipcbiAqIEB0eXBlIHtib29sZWFufSAqL1xubGV0IGNyb3Nzb3JpZ2luO1xuXG4vKipcbiAqIEByZXR1cm5zIHtib29sZWFufSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzX2Nyb3Nzb3JpZ2luKCkge1xuXHRpZiAoY3Jvc3NvcmlnaW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdGNyb3Nzb3JpZ2luID0gZmFsc2U7XG5cdFx0dHJ5IHtcblx0XHRcdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG5cdFx0XHRcdHZvaWQgd2luZG93LnBhcmVudC5kb2N1bWVudDtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y3Jvc3NvcmlnaW4gPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY3Jvc3NvcmlnaW47XG59XG5cbi8qKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHsoKSA9PiB2b2lkfSBmblxuICogQHJldHVybnMgeygpID0+IHZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRfaWZyYW1lX3Jlc2l6ZV9saXN0ZW5lcihub2RlLCBmbikge1xuXHRjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cdGlmIChjb21wdXRlZF9zdHlsZS5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcblx0XHRub2RlLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcblx0fVxuXHRjb25zdCBpZnJhbWUgPSBlbGVtZW50KCdpZnJhbWUnKTtcblx0aWZyYW1lLnNldEF0dHJpYnV0ZShcblx0XHQnc3R5bGUnLFxuXHRcdCdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7ICcgK1xuXHRcdFx0J292ZXJmbG93OiBoaWRkZW47IGJvcmRlcjogMDsgb3BhY2l0eTogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IHotaW5kZXg6IC0xOydcblx0KTtcblx0aWZyYW1lLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRpZnJhbWUudGFiSW5kZXggPSAtMTtcblx0Y29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuXG5cdC8qKlxuXHQgKiBAdHlwZSB7KCkgPT4gdm9pZH1cblx0ICovXG5cdGxldCB1bnN1YnNjcmliZTtcblx0aWYgKGNyb3Nzb3JpZ2luKSB7XG5cdFx0aWZyYW1lLnNyYyA9IFwiZGF0YTp0ZXh0L2h0bWwsPHNjcmlwdD5vbnJlc2l6ZT1mdW5jdGlvbigpe3BhcmVudC5wb3N0TWVzc2FnZSgwLCcqJyl9PC9zY3JpcHQ+XCI7XG5cdFx0dW5zdWJzY3JpYmUgPSBsaXN0ZW4oXG5cdFx0XHR3aW5kb3csXG5cdFx0XHQnbWVzc2FnZScsXG5cdFx0XHQvKiogQHBhcmFtIHtNZXNzYWdlRXZlbnR9IGV2ZW50ICovIChldmVudCkgPT4ge1xuXHRcdFx0XHRpZiAoZXZlbnQuc291cmNlID09PSBpZnJhbWUuY29udGVudFdpbmRvdykgZm4oKTtcblx0XHRcdH1cblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdGlmcmFtZS5zcmMgPSAnYWJvdXQ6YmxhbmsnO1xuXHRcdGlmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHR1bnN1YnNjcmliZSA9IGxpc3RlbihpZnJhbWUuY29udGVudFdpbmRvdywgJ3Jlc2l6ZScsIGZuKTtcblx0XHRcdC8vIG1ha2Ugc3VyZSBhbiBpbml0aWFsIHJlc2l6ZSBldmVudCBpcyBmaXJlZCBfYWZ0ZXJfIHRoZSBpZnJhbWUgaXMgbG9hZGVkICh3aGljaCBpcyBhc3luY2hyb25vdXMpXG5cdFx0XHQvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9pc3N1ZXMvNDIzM1xuXHRcdFx0Zm4oKTtcblx0XHR9O1xuXHR9XG5cdGFwcGVuZChub2RlLCBpZnJhbWUpO1xuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGlmIChjcm9zc29yaWdpbikge1xuXHRcdFx0dW5zdWJzY3JpYmUoKTtcblx0XHR9IGVsc2UgaWYgKHVuc3Vic2NyaWJlICYmIGlmcmFtZS5jb250ZW50V2luZG93KSB7XG5cdFx0XHR1bnN1YnNjcmliZSgpO1xuXHRcdH1cblx0XHRkZXRhY2goaWZyYW1lKTtcblx0fTtcbn1cbmV4cG9ydCBjb25zdCByZXNpemVfb2JzZXJ2ZXJfY29udGVudF9ib3ggPSAvKiBAX19QVVJFX18gKi8gbmV3IFJlc2l6ZU9ic2VydmVyU2luZ2xldG9uKHtcblx0Ym94OiAnY29udGVudC1ib3gnXG59KTtcbmV4cG9ydCBjb25zdCByZXNpemVfb2JzZXJ2ZXJfYm9yZGVyX2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oe1xuXHRib3g6ICdib3JkZXItYm94J1xufSk7XG5leHBvcnQgY29uc3QgcmVzaXplX29ic2VydmVyX2RldmljZV9waXhlbF9jb250ZW50X2JveCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24oXG5cdHsgYm94OiAnZGV2aWNlLXBpeGVsLWNvbnRlbnQtYm94JyB9XG4pO1xuZXhwb3J0IHsgUmVzaXplT2JzZXJ2ZXJTaW5nbGV0b24gfTtcblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVfY2xhc3MoZWxlbWVudCwgbmFtZSwgdG9nZ2xlKSB7XG5cdC8vIFRoZSBgISFgIGlzIHJlcXVpcmVkIGJlY2F1c2UgYW4gYHVuZGVmaW5lZGAgZmxhZyBtZWFucyBmbGlwcGluZyB0aGUgY3VycmVudCBzdGF0ZS5cblx0ZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKG5hbWUsICEhdG9nZ2xlKTtcbn1cblxuLyoqXG4gKiBAdGVtcGxhdGUgVFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7VH0gW2RldGFpbF1cbiAqIEBwYXJhbSB7eyBidWJibGVzPzogYm9vbGVhbiwgY2FuY2VsYWJsZT86IGJvb2xlYW4gfX0gW29wdGlvbnNdXG4gKiBAcmV0dXJucyB7Q3VzdG9tRXZlbnQ8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsLCB7IGJ1YmJsZXMgPSBmYWxzZSwgY2FuY2VsYWJsZSA9IGZhbHNlIH0gPSB7fSkge1xuXHRyZXR1cm4gbmV3IEN1c3RvbUV2ZW50KHR5cGUsIHsgZGV0YWlsLCBidWJibGVzLCBjYW5jZWxhYmxlIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcGFyZW50XG4gKiBAcmV0dXJucyB7Q2hpbGROb2RlQXJyYXl9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeV9zZWxlY3Rvcl9hbGwoc2VsZWN0b3IsIHBhcmVudCA9IGRvY3VtZW50LmJvZHkpIHtcblx0cmV0dXJuIEFycmF5LmZyb20ocGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbm9kZUlkXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBoZWFkXG4gKiBAcmV0dXJucyB7YW55W119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZWFkX3NlbGVjdG9yKG5vZGVJZCwgaGVhZCkge1xuXHRjb25zdCByZXN1bHQgPSBbXTtcblx0bGV0IHN0YXJ0ZWQgPSAwO1xuXHRmb3IgKGNvbnN0IG5vZGUgb2YgaGVhZC5jaGlsZE5vZGVzKSB7XG5cdFx0aWYgKG5vZGUubm9kZVR5cGUgPT09IDggLyogY29tbWVudCBub2RlICovKSB7XG5cdFx0XHRjb25zdCBjb21tZW50ID0gbm9kZS50ZXh0Q29udGVudC50cmltKCk7XG5cdFx0XHRpZiAoY29tbWVudCA9PT0gYEhFQURfJHtub2RlSWR9X0VORGApIHtcblx0XHRcdFx0c3RhcnRlZCAtPSAxO1xuXHRcdFx0XHRyZXN1bHQucHVzaChub2RlKTtcblx0XHRcdH0gZWxzZSBpZiAoY29tbWVudCA9PT0gYEhFQURfJHtub2RlSWR9X1NUQVJUYCkge1xuXHRcdFx0XHRzdGFydGVkICs9IDE7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKG5vZGUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoc3RhcnRlZCA+IDApIHtcblx0XHRcdHJlc3VsdC5wdXNoKG5vZGUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuLyoqICovXG5leHBvcnQgY2xhc3MgSHRtbFRhZyB7XG5cdC8qKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAZGVmYXVsdCBmYWxzZVxuXHQgKi9cblx0aXNfc3ZnID0gZmFsc2U7XG5cdC8qKiBwYXJlbnQgZm9yIGNyZWF0aW5nIG5vZGUgKi9cblx0ZSA9IHVuZGVmaW5lZDtcblx0LyoqIGh0bWwgdGFnIG5vZGVzICovXG5cdG4gPSB1bmRlZmluZWQ7XG5cdC8qKiB0YXJnZXQgKi9cblx0dCA9IHVuZGVmaW5lZDtcblx0LyoqIGFuY2hvciAqL1xuXHRhID0gdW5kZWZpbmVkO1xuXHRjb25zdHJ1Y3Rvcihpc19zdmcgPSBmYWxzZSkge1xuXHRcdHRoaXMuaXNfc3ZnID0gaXNfc3ZnO1xuXHRcdHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRjKGh0bWwpIHtcblx0XHR0aGlzLmgoaHRtbCk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IGh0bWxcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IFNWR0VsZW1lbnR9IHRhcmdldFxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgU1ZHRWxlbWVudH0gYW5jaG9yXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0bShodG1sLCB0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcblx0XHRpZiAoIXRoaXMuZSkge1xuXHRcdFx0aWYgKHRoaXMuaXNfc3ZnKVxuXHRcdFx0XHR0aGlzLmUgPSBzdmdfZWxlbWVudCgvKiogQHR5cGUge2tleW9mIFNWR0VsZW1lbnRUYWdOYW1lTWFwfSAqLyAodGFyZ2V0Lm5vZGVOYW1lKSk7XG5cdFx0XHQvKiogIzczNjQgIHRhcmdldCBmb3IgPHRlbXBsYXRlPiBtYXkgYmUgcHJvdmlkZWQgYXMgI2RvY3VtZW50LWZyYWdtZW50KDExKSAqLyBlbHNlXG5cdFx0XHRcdHRoaXMuZSA9IGVsZW1lbnQoXG5cdFx0XHRcdFx0LyoqIEB0eXBlIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9ICovIChcblx0XHRcdFx0XHRcdHRhcmdldC5ub2RlVHlwZSA9PT0gMTEgPyAnVEVNUExBVEUnIDogdGFyZ2V0Lm5vZGVOYW1lXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHQpO1xuXHRcdFx0dGhpcy50ID1cblx0XHRcdFx0dGFyZ2V0LnRhZ05hbWUgIT09ICdURU1QTEFURSdcblx0XHRcdFx0XHQ/IHRhcmdldFxuXHRcdFx0XHRcdDogLyoqIEB0eXBlIHtIVE1MVGVtcGxhdGVFbGVtZW50fSAqLyAodGFyZ2V0KS5jb250ZW50O1xuXHRcdFx0dGhpcy5jKGh0bWwpO1xuXHRcdH1cblx0XHR0aGlzLmkoYW5jaG9yKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGgoaHRtbCkge1xuXHRcdHRoaXMuZS5pbm5lckhUTUwgPSBodG1sO1xuXHRcdHRoaXMubiA9IEFycmF5LmZyb20oXG5cdFx0XHR0aGlzLmUubm9kZU5hbWUgPT09ICdURU1QTEFURScgPyB0aGlzLmUuY29udGVudC5jaGlsZE5vZGVzIDogdGhpcy5lLmNoaWxkTm9kZXNcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHRpKGFuY2hvcikge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5uLmxlbmd0aDsgaSArPSAxKSB7XG5cdFx0XHRpbnNlcnQodGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBodG1sXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0cChodG1sKSB7XG5cdFx0dGhpcy5kKCk7XG5cdFx0dGhpcy5oKGh0bWwpO1xuXHRcdHRoaXMuaSh0aGlzLmEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHRkKCkge1xuXHRcdHRoaXMubi5mb3JFYWNoKGRldGFjaCk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxUYWdIeWRyYXRpb24gZXh0ZW5kcyBIdG1sVGFnIHtcblx0LyoqIEB0eXBlIHtFbGVtZW50W119IGh5ZHJhdGlvbiBjbGFpbWVkIG5vZGVzICovXG5cdGwgPSB1bmRlZmluZWQ7XG5cblx0Y29uc3RydWN0b3IoaXNfc3ZnID0gZmFsc2UsIGNsYWltZWRfbm9kZXMpIHtcblx0XHRzdXBlcihpc19zdmcpO1xuXHRcdHRoaXMuZSA9IHRoaXMubiA9IG51bGw7XG5cdFx0dGhpcy5sID0gY2xhaW1lZF9ub2Rlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaHRtbFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGMoaHRtbCkge1xuXHRcdGlmICh0aGlzLmwpIHtcblx0XHRcdHRoaXMubiA9IHRoaXMubDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3VwZXIuYyhodG1sKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHJldHVybnMge3ZvaWR9ICovXG5cdGkoYW5jaG9yKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGluc2VydF9oeWRyYXRpb24odGhpcy50LCB0aGlzLm5baV0sIGFuY2hvcik7XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOYW1lZE5vZGVNYXB9IGF0dHJpYnV0ZXNcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF0dHJpYnV0ZV90b19vYmplY3QoYXR0cmlidXRlcykge1xuXHRjb25zdCByZXN1bHQgPSB7fTtcblx0Zm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlcykge1xuXHRcdHJlc3VsdFthdHRyaWJ1dGUubmFtZV0gPSBhdHRyaWJ1dGUudmFsdWU7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7e319XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfY3VzdG9tX2VsZW1lbnRzX3Nsb3RzKGVsZW1lbnQpIHtcblx0Y29uc3QgcmVzdWx0ID0ge307XG5cdGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKFxuXHRcdC8qKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGUgKi8gKG5vZGUpID0+IHtcblx0XHRcdHJlc3VsdFtub2RlLnNsb3QgfHwgJ2RlZmF1bHQnXSA9IHRydWU7XG5cdFx0fVxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uc3RydWN0X3N2ZWx0ZV9jb21wb25lbnQoY29tcG9uZW50LCBwcm9wcykge1xuXHRyZXR1cm4gbmV3IGNvbXBvbmVudChwcm9wcyk7XG59XG5cbi8qKlxuICogQHR5cGVkZWYge05vZGUgJiB7XG4gKiBcdGNsYWltX29yZGVyPzogbnVtYmVyO1xuICogXHRoeWRyYXRlX2luaXQ/OiB0cnVlO1xuICogXHRhY3R1YWxfZW5kX2NoaWxkPzogTm9kZUV4O1xuICogXHRjaGlsZE5vZGVzOiBOb2RlTGlzdE9mPE5vZGVFeD47XG4gKiB9fSBOb2RlRXhcbiAqL1xuXG4vKiogQHR5cGVkZWYge0NoaWxkTm9kZSAmIE5vZGVFeH0gQ2hpbGROb2RlRXggKi9cblxuLyoqIEB0eXBlZGVmIHtOb2RlRXggJiB7IGNsYWltX29yZGVyOiBudW1iZXIgfX0gTm9kZUV4MiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtDaGlsZE5vZGVFeFtdICYge1xuICogXHRjbGFpbV9pbmZvPzoge1xuICogXHRcdGxhc3RfaW5kZXg6IG51bWJlcjtcbiAqIFx0XHR0b3RhbF9jbGFpbWVkOiBudW1iZXI7XG4gKiBcdH07XG4gKiB9fSBDaGlsZE5vZGVBcnJheVxuICovXG4iLCAiaW1wb3J0IHsgYXBwZW5kX2VtcHR5X3N0eWxlc2hlZXQsIGRldGFjaCwgZ2V0X3Jvb3RfZm9yX3N0eWxlIH0gZnJvbSAnLi9kb20uanMnO1xuaW1wb3J0IHsgcmFmIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbi8vIHdlIG5lZWQgdG8gc3RvcmUgdGhlIGluZm9ybWF0aW9uIGZvciBtdWx0aXBsZSBkb2N1bWVudHMgYmVjYXVzZSBhIFN2ZWx0ZSBhcHBsaWNhdGlvbiBjb3VsZCBhbHNvIGNvbnRhaW4gaWZyYW1lc1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3N2ZWx0ZWpzL3N2ZWx0ZS9pc3N1ZXMvMzYyNFxuLyoqIEB0eXBlIHtNYXA8RG9jdW1lbnQgfCBTaGFkb3dSb290LCBpbXBvcnQoJy4vcHJpdmF0ZS5kLnRzJykuU3R5bGVJbmZvcm1hdGlvbj59ICovXG5jb25zdCBtYW5hZ2VkX3N0eWxlcyA9IG5ldyBNYXAoKTtcblxubGV0IGFjdGl2ZSA9IDA7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXJrc2t5YXBwL3N0cmluZy1oYXNoL2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG5cdGxldCBoYXNoID0gNTM4MTtcblx0bGV0IGkgPSBzdHIubGVuZ3RoO1xuXHR3aGlsZSAoaS0tKSBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgXiBzdHIuY2hhckNvZGVBdChpKTtcblx0cmV0dXJuIGhhc2ggPj4+IDA7XG59XG5cbi8qKlxuICogQHBhcmFtIHtEb2N1bWVudCB8IFNoYWRvd1Jvb3R9IGRvY1xuICogQHBhcmFtIHtFbGVtZW50ICYgRWxlbWVudENTU0lubGluZVN0eWxlfSBub2RlXG4gKiBAcmV0dXJucyB7eyBzdHlsZXNoZWV0OiBhbnk7IHJ1bGVzOiB7fTsgfX1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlX3N0eWxlX2luZm9ybWF0aW9uKGRvYywgbm9kZSkge1xuXHRjb25zdCBpbmZvID0geyBzdHlsZXNoZWV0OiBhcHBlbmRfZW1wdHlfc3R5bGVzaGVldChub2RlKSwgcnVsZXM6IHt9IH07XG5cdG1hbmFnZWRfc3R5bGVzLnNldChkb2MsIGluZm8pO1xuXHRyZXR1cm4gaW5mbztcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBhXG4gKiBAcGFyYW0ge251bWJlcn0gYlxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqIEBwYXJhbSB7KHQ6IG51bWJlcikgPT4gbnVtYmVyfSBlYXNlXG4gKiBAcGFyYW0geyh0OiBudW1iZXIsIHU6IG51bWJlcikgPT4gc3RyaW5nfSBmblxuICogQHBhcmFtIHtudW1iZXJ9IHVpZFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9ydWxlKG5vZGUsIGEsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzZSwgZm4sIHVpZCA9IDApIHtcblx0Y29uc3Qgc3RlcCA9IDE2LjY2NiAvIGR1cmF0aW9uO1xuXHRsZXQga2V5ZnJhbWVzID0gJ3tcXG4nO1xuXHRmb3IgKGxldCBwID0gMDsgcCA8PSAxOyBwICs9IHN0ZXApIHtcblx0XHRjb25zdCB0ID0gYSArIChiIC0gYSkgKiBlYXNlKHApO1xuXHRcdGtleWZyYW1lcyArPSBwICogMTAwICsgYCV7JHtmbih0LCAxIC0gdCl9fVxcbmA7XG5cdH1cblx0Y29uc3QgcnVsZSA9IGtleWZyYW1lcyArIGAxMDAlIHske2ZuKGIsIDEgLSBiKX19XFxufWA7XG5cdGNvbnN0IG5hbWUgPSBgX19zdmVsdGVfJHtoYXNoKHJ1bGUpfV8ke3VpZH1gO1xuXHRjb25zdCBkb2MgPSBnZXRfcm9vdF9mb3Jfc3R5bGUobm9kZSk7XG5cdGNvbnN0IHsgc3R5bGVzaGVldCwgcnVsZXMgfSA9IG1hbmFnZWRfc3R5bGVzLmdldChkb2MpIHx8IGNyZWF0ZV9zdHlsZV9pbmZvcm1hdGlvbihkb2MsIG5vZGUpO1xuXHRpZiAoIXJ1bGVzW25hbWVdKSB7XG5cdFx0cnVsZXNbbmFtZV0gPSB0cnVlO1xuXHRcdHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke25hbWV9ICR7cnVsZX1gLCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG5cdH1cblx0Y29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG5cdG5vZGUuc3R5bGUuYW5pbWF0aW9uID0gYCR7XG5cdFx0YW5pbWF0aW9uID8gYCR7YW5pbWF0aW9ufSwgYCA6ICcnXG5cdH0ke25hbWV9ICR7ZHVyYXRpb259bXMgbGluZWFyICR7ZGVsYXl9bXMgMSBib3RoYDtcblx0YWN0aXZlICs9IDE7XG5cdHJldHVybiBuYW1lO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudCAmIEVsZW1lbnRDU1NJbmxpbmVTdHlsZX0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG5cdGNvbnN0IHByZXZpb3VzID0gKG5vZGUuc3R5bGUuYW5pbWF0aW9uIHx8ICcnKS5zcGxpdCgnLCAnKTtcblx0Y29uc3QgbmV4dCA9IHByZXZpb3VzLmZpbHRlcihcblx0XHRuYW1lXG5cdFx0XHQ/IChhbmltKSA9PiBhbmltLmluZGV4T2YobmFtZSkgPCAwIC8vIHJlbW92ZSBzcGVjaWZpYyBhbmltYXRpb25cblx0XHRcdDogKGFuaW0pID0+IGFuaW0uaW5kZXhPZignX19zdmVsdGUnKSA9PT0gLTEgLy8gcmVtb3ZlIGFsbCBTdmVsdGUgYW5pbWF0aW9uc1xuXHQpO1xuXHRjb25zdCBkZWxldGVkID0gcHJldmlvdXMubGVuZ3RoIC0gbmV4dC5sZW5ndGg7XG5cdGlmIChkZWxldGVkKSB7XG5cdFx0bm9kZS5zdHlsZS5hbmltYXRpb24gPSBuZXh0LmpvaW4oJywgJyk7XG5cdFx0YWN0aXZlIC09IGRlbGV0ZWQ7XG5cdFx0aWYgKCFhY3RpdmUpIGNsZWFyX3J1bGVzKCk7XG5cdH1cbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyX3J1bGVzKCkge1xuXHRyYWYoKCkgPT4ge1xuXHRcdGlmIChhY3RpdmUpIHJldHVybjtcblx0XHRtYW5hZ2VkX3N0eWxlcy5mb3JFYWNoKChpbmZvKSA9PiB7XG5cdFx0XHRjb25zdCB7IG93bmVyTm9kZSB9ID0gaW5mby5zdHlsZXNoZWV0O1xuXHRcdFx0Ly8gdGhlcmUgaXMgbm8gb3duZXJOb2RlIGlmIGl0IHJ1bnMgb24ganNkb20uXG5cdFx0XHRpZiAob3duZXJOb2RlKSBkZXRhY2gob3duZXJOb2RlKTtcblx0XHR9KTtcblx0XHRtYW5hZ2VkX3N0eWxlcy5jbGVhcigpO1xuXHR9KTtcbn1cbiIsICJpbXBvcnQgeyBjdXN0b21fZXZlbnQgfSBmcm9tICcuL2RvbS5qcyc7XG5cbmV4cG9ydCBsZXQgY3VycmVudF9jb21wb25lbnQ7XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KSB7XG5cdGN1cnJlbnRfY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkge1xuXHRpZiAoIWN1cnJlbnRfY29tcG9uZW50KSB0aHJvdyBuZXcgRXJyb3IoJ0Z1bmN0aW9uIGNhbGxlZCBvdXRzaWRlIGNvbXBvbmVudCBpbml0aWFsaXphdGlvbicpO1xuXHRyZXR1cm4gY3VycmVudF9jb21wb25lbnQ7XG59XG5cbi8qKlxuICogU2NoZWR1bGVzIGEgY2FsbGJhY2sgdG8gcnVuIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIHVwZGF0ZWQgYWZ0ZXIgYW55IHN0YXRlIGNoYW5nZS5cbiAqXG4gKiBUaGUgZmlyc3QgdGltZSB0aGUgY2FsbGJhY2sgcnVucyB3aWxsIGJlIGJlZm9yZSB0aGUgaW5pdGlhbCBgb25Nb3VudGBcbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjYmVmb3JldXBkYXRlXG4gKiBAcGFyYW0geygpID0+IGFueX0gZm5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYmVmb3JlVXBkYXRlKGZuKSB7XG5cdGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmJlZm9yZV91cGRhdGUucHVzaChmbik7XG59XG5cbi8qKlxuICogVGhlIGBvbk1vdW50YCBmdW5jdGlvbiBzY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gYXMgc29vbiBhcyB0aGUgY29tcG9uZW50IGhhcyBiZWVuIG1vdW50ZWQgdG8gdGhlIERPTS5cbiAqIEl0IG11c3QgYmUgY2FsbGVkIGR1cmluZyB0aGUgY29tcG9uZW50J3MgaW5pdGlhbGlzYXRpb24gKGJ1dCBkb2Vzbid0IG5lZWQgdG8gbGl2ZSAqaW5zaWRlKiB0aGUgY29tcG9uZW50O1xuICogaXQgY2FuIGJlIGNhbGxlZCBmcm9tIGFuIGV4dGVybmFsIG1vZHVsZSkuXG4gKlxuICogSWYgYSBmdW5jdGlvbiBpcyByZXR1cm5lZCBfc3luY2hyb25vdXNseV8gZnJvbSBgb25Nb3VudGAsIGl0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyB1bm1vdW50ZWQuXG4gKlxuICogYG9uTW91bnRgIGRvZXMgbm90IHJ1biBpbnNpZGUgYSBbc2VydmVyLXNpZGUgY29tcG9uZW50XSgvZG9jcyNydW4tdGltZS1zZXJ2ZXItc2lkZS1jb21wb25lbnQtYXBpKS5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjb25tb3VudFxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB7KCkgPT4gaW1wb3J0KCcuL3ByaXZhdGUuanMnKS5Ob3RGdW5jdGlvbjxUPiB8IFByb21pc2U8aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5Ob3RGdW5jdGlvbjxUPj4gfCAoKCkgPT4gYW55KX0gZm5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb25Nb3VudChmbikge1xuXHRnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9tb3VudC5wdXNoKGZuKTtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgYSBjYWxsYmFjayB0byBydW4gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGNvbXBvbmVudCBoYXMgYmVlbiB1cGRhdGVkLlxuICpcbiAqIFRoZSBmaXJzdCB0aW1lIHRoZSBjYWxsYmFjayBydW5zIHdpbGwgYmUgYWZ0ZXIgdGhlIGluaXRpYWwgYG9uTW91bnRgXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI2FmdGVydXBkYXRlXG4gKiBAcGFyYW0geygpID0+IGFueX0gZm5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcblx0Z2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuYWZ0ZXJfdXBkYXRlLnB1c2goZm4pO1xufVxuXG4vKipcbiAqIFNjaGVkdWxlcyBhIGNhbGxiYWNrIHRvIHJ1biBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyB1bm1vdW50ZWQuXG4gKlxuICogT3V0IG9mIGBvbk1vdW50YCwgYGJlZm9yZVVwZGF0ZWAsIGBhZnRlclVwZGF0ZWAgYW5kIGBvbkRlc3Ryb3lgLCB0aGlzIGlzIHRoZVxuICogb25seSBvbmUgdGhhdCBydW5zIGluc2lkZSBhIHNlcnZlci1zaWRlIGNvbXBvbmVudC5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjb25kZXN0cm95XG4gKiBAcGFyYW0geygpID0+IGFueX0gZm5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb25EZXN0cm95KGZuKSB7XG5cdGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX2Rlc3Ryb3kucHVzaChmbik7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBldmVudCBkaXNwYXRjaGVyIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGF0Y2ggW2NvbXBvbmVudCBldmVudHNdKC9kb2NzI3RlbXBsYXRlLXN5bnRheC1jb21wb25lbnQtZGlyZWN0aXZlcy1vbi1ldmVudG5hbWUpLlxuICogRXZlbnQgZGlzcGF0Y2hlcnMgYXJlIGZ1bmN0aW9ucyB0aGF0IGNhbiB0YWtlIHR3byBhcmd1bWVudHM6IGBuYW1lYCBhbmQgYGRldGFpbGAuXG4gKlxuICogQ29tcG9uZW50IGV2ZW50cyBjcmVhdGVkIHdpdGggYGNyZWF0ZUV2ZW50RGlzcGF0Y2hlcmAgY3JlYXRlIGFcbiAqIFtDdXN0b21FdmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0N1c3RvbUV2ZW50KS5cbiAqIFRoZXNlIGV2ZW50cyBkbyBub3QgW2J1YmJsZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9MZWFybi9KYXZhU2NyaXB0L0J1aWxkaW5nX2Jsb2Nrcy9FdmVudHMjRXZlbnRfYnViYmxpbmdfYW5kX2NhcHR1cmUpLlxuICogVGhlIGBkZXRhaWxgIGFyZ3VtZW50IGNvcnJlc3BvbmRzIHRvIHRoZSBbQ3VzdG9tRXZlbnQuZGV0YWlsXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3VzdG9tRXZlbnQvZGV0YWlsKVxuICogcHJvcGVydHkgYW5kIGNhbiBjb250YWluIGFueSB0eXBlIG9mIGRhdGEuXG4gKlxuICogVGhlIGV2ZW50IGRpc3BhdGNoZXIgY2FuIGJlIHR5cGVkIHRvIG5hcnJvdyB0aGUgYWxsb3dlZCBldmVudCBuYW1lcyBhbmQgdGhlIHR5cGUgb2YgdGhlIGBkZXRhaWxgIGFyZ3VtZW50OlxuICogYGBgdHNcbiAqIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyPHtcbiAqICBsb2FkZWQ6IG5ldmVyOyAvLyBkb2VzIG5vdCB0YWtlIGEgZGV0YWlsIGFyZ3VtZW50XG4gKiAgY2hhbmdlOiBzdHJpbmc7IC8vIHRha2VzIGEgZGV0YWlsIGFyZ3VtZW50IG9mIHR5cGUgc3RyaW5nLCB3aGljaCBpcyByZXF1aXJlZFxuICogIG9wdGlvbmFsOiBudW1iZXIgfCBudWxsOyAvLyB0YWtlcyBhbiBvcHRpb25hbCBkZXRhaWwgYXJndW1lbnQgb2YgdHlwZSBudW1iZXJcbiAqIH0+KCk7XG4gKiBgYGBcbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjY3JlYXRlZXZlbnRkaXNwYXRjaGVyXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIGFueT59IFtFdmVudE1hcD1hbnldXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLkV2ZW50RGlzcGF0Y2hlcjxFdmVudE1hcD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFdmVudERpc3BhdGNoZXIoKSB7XG5cdGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuXHRyZXR1cm4gKHR5cGUsIGRldGFpbCwgeyBjYW5jZWxhYmxlID0gZmFsc2UgfSA9IHt9KSA9PiB7XG5cdFx0Y29uc3QgY2FsbGJhY2tzID0gY29tcG9uZW50LiQkLmNhbGxiYWNrc1t0eXBlXTtcblx0XHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0XHQvLyBUT0RPIGFyZSB0aGVyZSBzaXR1YXRpb25zIHdoZXJlIGV2ZW50cyBjb3VsZCBiZSBkaXNwYXRjaGVkXG5cdFx0XHQvLyBpbiBhIHNlcnZlciAobm9uLURPTSkgZW52aXJvbm1lbnQ/XG5cdFx0XHRjb25zdCBldmVudCA9IGN1c3RvbV9ldmVudCgvKiogQHR5cGUge3N0cmluZ30gKi8gKHR5cGUpLCBkZXRhaWwsIHsgY2FuY2VsYWJsZSB9KTtcblx0XHRcdGNhbGxiYWNrcy5zbGljZSgpLmZvckVhY2goKGZuKSA9PiB7XG5cdFx0XHRcdGZuLmNhbGwoY29tcG9uZW50LCBldmVudCk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiAhZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG59XG5cbi8qKlxuICogQXNzb2NpYXRlcyBhbiBhcmJpdHJhcnkgYGNvbnRleHRgIG9iamVjdCB3aXRoIHRoZSBjdXJyZW50IGNvbXBvbmVudCBhbmQgdGhlIHNwZWNpZmllZCBga2V5YFxuICogYW5kIHJldHVybnMgdGhhdCBvYmplY3QuIFRoZSBjb250ZXh0IGlzIHRoZW4gYXZhaWxhYmxlIHRvIGNoaWxkcmVuIG9mIHRoZSBjb21wb25lbnRcbiAqIChpbmNsdWRpbmcgc2xvdHRlZCBjb250ZW50KSB3aXRoIGBnZXRDb250ZXh0YC5cbiAqXG4gKiBMaWtlIGxpZmVjeWNsZSBmdW5jdGlvbnMsIHRoaXMgbXVzdCBiZSBjYWxsZWQgZHVyaW5nIGNvbXBvbmVudCBpbml0aWFsaXNhdGlvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjc2V0Y29udGV4dFxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB7YW55fSBrZXlcbiAqIEBwYXJhbSB7VH0gY29udGV4dFxuICogQHJldHVybnMge1R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb250ZXh0KGtleSwgY29udGV4dCkge1xuXHRnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xuXHRyZXR1cm4gY29udGV4dDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGNvbnRleHQgdGhhdCBiZWxvbmdzIHRvIHRoZSBjbG9zZXN0IHBhcmVudCBjb21wb25lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIGBrZXlgLlxuICogTXVzdCBiZSBjYWxsZWQgZHVyaW5nIGNvbXBvbmVudCBpbml0aWFsaXNhdGlvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjZ2V0Y29udGV4dFxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB7YW55fSBrZXlcbiAqIEByZXR1cm5zIHtUfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcblx0cmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB3aG9sZSBjb250ZXh0IG1hcCB0aGF0IGJlbG9uZ3MgdG8gdGhlIGNsb3Nlc3QgcGFyZW50IGNvbXBvbmVudC5cbiAqIE11c3QgYmUgY2FsbGVkIGR1cmluZyBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uIFVzZWZ1bCwgZm9yIGV4YW1wbGUsIGlmIHlvdVxuICogcHJvZ3JhbW1hdGljYWxseSBjcmVhdGUgYSBjb21wb25lbnQgYW5kIHdhbnQgdG8gcGFzcyB0aGUgZXhpc3RpbmcgY29udGV4dCB0byBpdC5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUjZ2V0YWxsY29udGV4dHNcbiAqIEB0ZW1wbGF0ZSB7TWFwPGFueSwgYW55Pn0gW1Q9TWFwPGFueSwgYW55Pl1cbiAqIEByZXR1cm5zIHtUfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsQ29udGV4dHMoKSB7XG5cdHJldHVybiBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0O1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZ2l2ZW4gYGtleWAgaGFzIGJlZW4gc2V0IGluIHRoZSBjb250ZXh0IG9mIGEgcGFyZW50IGNvbXBvbmVudC5cbiAqIE11c3QgYmUgY2FsbGVkIGR1cmluZyBjb21wb25lbnQgaW5pdGlhbGlzYXRpb24uXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlI2hhc2NvbnRleHRcbiAqIEBwYXJhbSB7YW55fSBrZXlcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzQ29udGV4dChrZXkpIHtcblx0cmV0dXJuIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLmNvbnRleHQuaGFzKGtleSk7XG59XG5cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG4vKipcbiAqIEBwYXJhbSBjb21wb25lbnRcbiAqIEBwYXJhbSBldmVudFxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuXHRjb25zdCBjYWxsYmFja3MgPSBjb21wb25lbnQuJCQuY2FsbGJhY2tzW2V2ZW50LnR5cGVdO1xuXHRpZiAoY2FsbGJhY2tzKSB7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGNhbGxiYWNrcy5zbGljZSgpLmZvckVhY2goKGZuKSA9PiBmbi5jYWxsKHRoaXMsIGV2ZW50KSk7XG5cdH1cbn1cbiIsICJpbXBvcnQgeyBydW5fYWxsIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBjdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1cnJlbnRfY29tcG9uZW50IH0gZnJvbSAnLi9saWZlY3ljbGUuanMnO1xuXG5leHBvcnQgY29uc3QgZGlydHlfY29tcG9uZW50cyA9IFtdO1xuZXhwb3J0IGNvbnN0IGludHJvcyA9IHsgZW5hYmxlZDogZmFsc2UgfTtcbmV4cG9ydCBjb25zdCBiaW5kaW5nX2NhbGxiYWNrcyA9IFtdO1xuXG5sZXQgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuXG5jb25zdCBmbHVzaF9jYWxsYmFja3MgPSBbXTtcblxuY29uc3QgcmVzb2x2ZWRfcHJvbWlzZSA9IC8qIEBfX1BVUkVfXyAqLyBQcm9taXNlLnJlc29sdmUoKTtcblxubGV0IHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlX3VwZGF0ZSgpIHtcblx0aWYgKCF1cGRhdGVfc2NoZWR1bGVkKSB7XG5cdFx0dXBkYXRlX3NjaGVkdWxlZCA9IHRydWU7XG5cdFx0cmVzb2x2ZWRfcHJvbWlzZS50aGVuKGZsdXNoKTtcblx0fVxufVxuXG4vKiogQHJldHVybnMge1Byb21pc2U8dm9pZD59ICovXG5leHBvcnQgZnVuY3Rpb24gdGljaygpIHtcblx0c2NoZWR1bGVfdXBkYXRlKCk7XG5cdHJldHVybiByZXNvbHZlZF9wcm9taXNlO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gYWRkX3JlbmRlcl9jYWxsYmFjayhmbikge1xuXHRyZW5kZXJfY2FsbGJhY2tzLnB1c2goZm4pO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gYWRkX2ZsdXNoX2NhbGxiYWNrKGZuKSB7XG5cdGZsdXNoX2NhbGxiYWNrcy5wdXNoKGZuKTtcbn1cblxuLy8gZmx1c2goKSBjYWxscyBjYWxsYmFja3MgaW4gdGhpcyBvcmRlcjpcbi8vIDEuIEFsbCBiZWZvcmVVcGRhdGUgY2FsbGJhY2tzLCBpbiBvcmRlcjogcGFyZW50cyBiZWZvcmUgY2hpbGRyZW5cbi8vIDIuIEFsbCBiaW5kOnRoaXMgY2FsbGJhY2tzLCBpbiByZXZlcnNlIG9yZGVyOiBjaGlsZHJlbiBiZWZvcmUgcGFyZW50cy5cbi8vIDMuIEFsbCBhZnRlclVwZGF0ZSBjYWxsYmFja3MsIGluIG9yZGVyOiBwYXJlbnRzIGJlZm9yZSBjaGlsZHJlbi4gRVhDRVBUXG4vLyAgICBmb3IgYWZ0ZXJVcGRhdGVzIGNhbGxlZCBkdXJpbmcgdGhlIGluaXRpYWwgb25Nb3VudCwgd2hpY2ggYXJlIGNhbGxlZCBpblxuLy8gICAgcmV2ZXJzZSBvcmRlcjogY2hpbGRyZW4gYmVmb3JlIHBhcmVudHMuXG4vLyBTaW5jZSBjYWxsYmFja3MgbWlnaHQgdXBkYXRlIGNvbXBvbmVudCB2YWx1ZXMsIHdoaWNoIGNvdWxkIHRyaWdnZXIgYW5vdGhlclxuLy8gY2FsbCB0byBmbHVzaCgpLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGd1YXJkIGFnYWluc3QgdGhpczpcbi8vIDEuIER1cmluZyBiZWZvcmVVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGVcbi8vICAgIGRpcnR5X2NvbXBvbmVudHMgYXJyYXkgYW5kIHdpbGwgY2F1c2UgYSByZWVudHJhbnQgY2FsbCB0byBmbHVzaCgpLiBCZWNhdXNlXG4vLyAgICB0aGUgZmx1c2ggaW5kZXggaXMga2VwdCBvdXRzaWRlIHRoZSBmdW5jdGlvbiwgdGhlIHJlZW50cmFudCBjYWxsIHdpbGwgcGlja1xuLy8gICAgdXAgd2hlcmUgdGhlIGVhcmxpZXIgY2FsbCBsZWZ0IG9mZiBhbmQgZ28gdGhyb3VnaCBhbGwgZGlydHkgY29tcG9uZW50cy4gVGhlXG4vLyAgICBjdXJyZW50X2NvbXBvbmVudCB2YWx1ZSBpcyBzYXZlZCBhbmQgcmVzdG9yZWQgc28gdGhhdCB0aGUgcmVlbnRyYW50IGNhbGwgd2lsbFxuLy8gICAgbm90IGludGVyZmVyZSB3aXRoIHRoZSBcInBhcmVudFwiIGZsdXNoKCkgY2FsbC5cbi8vIDIuIGJpbmQ6dGhpcyBjYWxsYmFja3MgY2Fubm90IHRyaWdnZXIgbmV3IGZsdXNoKCkgY2FsbHMuXG4vLyAzLiBEdXJpbmcgYWZ0ZXJVcGRhdGUsIGFueSB1cGRhdGVkIGNvbXBvbmVudHMgd2lsbCBOT1QgaGF2ZSB0aGVpciBhZnRlclVwZGF0ZVxuLy8gICAgY2FsbGJhY2sgY2FsbGVkIGEgc2Vjb25kIHRpbWU7IHRoZSBzZWVuX2NhbGxiYWNrcyBzZXQsIG91dHNpZGUgdGhlIGZsdXNoKClcbi8vICAgIGZ1bmN0aW9uLCBndWFyYW50ZWVzIHRoaXMgYmVoYXZpb3IuXG5jb25zdCBzZWVuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcblxubGV0IGZsdXNoaWR4ID0gMDsgLy8gRG8gKm5vdCogbW92ZSB0aGlzIGluc2lkZSB0aGUgZmx1c2goKSBmdW5jdGlvblxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gZmx1c2goKSB7XG5cdC8vIERvIG5vdCByZWVudGVyIGZsdXNoIHdoaWxlIGRpcnR5IGNvbXBvbmVudHMgYXJlIHVwZGF0ZWQsIGFzIHRoaXMgY2FuXG5cdC8vIHJlc3VsdCBpbiBhbiBpbmZpbml0ZSBsb29wLiBJbnN0ZWFkLCBsZXQgdGhlIGlubmVyIGZsdXNoIGhhbmRsZSBpdC5cblx0Ly8gUmVlbnRyYW5jeSBpcyBvayBhZnRlcndhcmRzIGZvciBiaW5kaW5ncyBldGMuXG5cdGlmIChmbHVzaGlkeCAhPT0gMCkge1xuXHRcdHJldHVybjtcblx0fVxuXHRjb25zdCBzYXZlZF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcblx0ZG8ge1xuXHRcdC8vIGZpcnN0LCBjYWxsIGJlZm9yZVVwZGF0ZSBmdW5jdGlvbnNcblx0XHQvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcblx0XHR0cnkge1xuXHRcdFx0d2hpbGUgKGZsdXNoaWR4IDwgZGlydHlfY29tcG9uZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50ID0gZGlydHlfY29tcG9uZW50c1tmbHVzaGlkeF07XG5cdFx0XHRcdGZsdXNoaWR4Kys7XG5cdFx0XHRcdHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuXHRcdFx0XHR1cGRhdGUoY29tcG9uZW50LiQkKTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHQvLyByZXNldCBkaXJ0eSBzdGF0ZSB0byBub3QgZW5kIHVwIGluIGEgZGVhZGxvY2tlZCBzdGF0ZSBhbmQgdGhlbiByZXRocm93XG5cdFx0XHRkaXJ0eV9jb21wb25lbnRzLmxlbmd0aCA9IDA7XG5cdFx0XHRmbHVzaGlkeCA9IDA7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0XHRzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG5cdFx0ZGlydHlfY29tcG9uZW50cy5sZW5ndGggPSAwO1xuXHRcdGZsdXNoaWR4ID0gMDtcblx0XHR3aGlsZSAoYmluZGluZ19jYWxsYmFja3MubGVuZ3RoKSBiaW5kaW5nX2NhbGxiYWNrcy5wb3AoKSgpO1xuXHRcdC8vIHRoZW4sIG9uY2UgY29tcG9uZW50cyBhcmUgdXBkYXRlZCwgY2FsbFxuXHRcdC8vIGFmdGVyVXBkYXRlIGZ1bmN0aW9ucy4gVGhpcyBtYXkgY2F1c2Vcblx0XHQvLyBzdWJzZXF1ZW50IHVwZGF0ZXMuLi5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoOyBpICs9IDEpIHtcblx0XHRcdGNvbnN0IGNhbGxiYWNrID0gcmVuZGVyX2NhbGxiYWNrc1tpXTtcblx0XHRcdGlmICghc2Vlbl9jYWxsYmFja3MuaGFzKGNhbGxiYWNrKSkge1xuXHRcdFx0XHQvLyAuLi5zbyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGxvb3BzXG5cdFx0XHRcdHNlZW5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG5cdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoID0gMDtcblx0fSB3aGlsZSAoZGlydHlfY29tcG9uZW50cy5sZW5ndGgpO1xuXHR3aGlsZSAoZmx1c2hfY2FsbGJhY2tzLmxlbmd0aCkge1xuXHRcdGZsdXNoX2NhbGxiYWNrcy5wb3AoKSgpO1xuXHR9XG5cdHVwZGF0ZV9zY2hlZHVsZWQgPSBmYWxzZTtcblx0c2Vlbl9jYWxsYmFja3MuY2xlYXIoKTtcblx0c2V0X2N1cnJlbnRfY29tcG9uZW50KHNhdmVkX2NvbXBvbmVudCk7XG59XG5cbi8qKiBAcmV0dXJucyB7dm9pZH0gKi9cbmZ1bmN0aW9uIHVwZGF0ZSgkJCkge1xuXHRpZiAoJCQuZnJhZ21lbnQgIT09IG51bGwpIHtcblx0XHQkJC51cGRhdGUoKTtcblx0XHRydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuXHRcdGNvbnN0IGRpcnR5ID0gJCQuZGlydHk7XG5cdFx0JCQuZGlydHkgPSBbLTFdO1xuXHRcdCQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LnAoJCQuY3R4LCBkaXJ0eSk7XG5cdFx0JCQuYWZ0ZXJfdXBkYXRlLmZvckVhY2goYWRkX3JlbmRlcl9jYWxsYmFjayk7XG5cdH1cbn1cblxuLyoqXG4gKiBVc2VmdWwgZm9yIGV4YW1wbGUgdG8gZXhlY3V0ZSByZW1haW5pbmcgYGFmdGVyVXBkYXRlYCBjYWxsYmFja3MgYmVmb3JlIGV4ZWN1dGluZyBgZGVzdHJveWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9uW119IGZuc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbHVzaF9yZW5kZXJfY2FsbGJhY2tzKGZucykge1xuXHRjb25zdCBmaWx0ZXJlZCA9IFtdO1xuXHRjb25zdCB0YXJnZXRzID0gW107XG5cdHJlbmRlcl9jYWxsYmFja3MuZm9yRWFjaCgoYykgPT4gKGZucy5pbmRleE9mKGMpID09PSAtMSA/IGZpbHRlcmVkLnB1c2goYykgOiB0YXJnZXRzLnB1c2goYykpKTtcblx0dGFyZ2V0cy5mb3JFYWNoKChjKSA9PiBjKCkpO1xuXHRyZW5kZXJfY2FsbGJhY2tzID0gZmlsdGVyZWQ7XG59XG4iLCAiaW1wb3J0IHsgaWRlbnRpdHkgYXMgbGluZWFyLCBpc19mdW5jdGlvbiwgbm9vcCwgcnVuX2FsbCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgbm93IH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5pbXBvcnQgeyBsb29wIH0gZnJvbSAnLi9sb29wLmpzJztcbmltcG9ydCB7IGNyZWF0ZV9ydWxlLCBkZWxldGVfcnVsZSB9IGZyb20gJy4vc3R5bGVfbWFuYWdlci5qcyc7XG5pbXBvcnQgeyBjdXN0b21fZXZlbnQgfSBmcm9tICcuL2RvbS5qcyc7XG5pbXBvcnQgeyBhZGRfcmVuZGVyX2NhbGxiYWNrIH0gZnJvbSAnLi9zY2hlZHVsZXIuanMnO1xuXG4vKipcbiAqIEB0eXBlIHtQcm9taXNlPHZvaWQ+IHwgbnVsbH1cbiAqL1xubGV0IHByb21pc2U7XG5cbi8qKlxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gKi9cbmZ1bmN0aW9uIHdhaXQoKSB7XG5cdGlmICghcHJvbWlzZSkge1xuXHRcdHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRwcm9taXNlLnRoZW4oKCkgPT4ge1xuXHRcdFx0cHJvbWlzZSA9IG51bGw7XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHByb21pc2U7XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge0lOVFJPIHwgT1VUUk8gfCBib29sZWFufSBkaXJlY3Rpb25cbiAqIEBwYXJhbSB7J3N0YXJ0JyB8ICdlbmQnfSBraW5kXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gZGlzcGF0Y2gobm9kZSwgZGlyZWN0aW9uLCBraW5kKSB7XG5cdG5vZGUuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQoYCR7ZGlyZWN0aW9uID8gJ2ludHJvJyA6ICdvdXRybyd9JHtraW5kfWApKTtcbn1cblxuY29uc3Qgb3V0cm9pbmcgPSBuZXcgU2V0KCk7XG5cbi8qKlxuICogQHR5cGUge091dHJvfVxuICovXG5sZXQgb3V0cm9zO1xuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwX291dHJvcygpIHtcblx0b3V0cm9zID0ge1xuXHRcdHI6IDAsXG5cdFx0YzogW10sXG5cdFx0cDogb3V0cm9zIC8vIHBhcmVudCBncm91cFxuXHR9O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrX291dHJvcygpIHtcblx0aWYgKCFvdXRyb3Mucikge1xuXHRcdHJ1bl9hbGwob3V0cm9zLmMpO1xuXHR9XG5cdG91dHJvcyA9IG91dHJvcy5wO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5GcmFnbWVudH0gYmxvY2tcbiAqIEBwYXJhbSB7MCB8IDF9IFtsb2NhbF1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNpdGlvbl9pbihibG9jaywgbG9jYWwpIHtcblx0aWYgKGJsb2NrICYmIGJsb2NrLmkpIHtcblx0XHRvdXRyb2luZy5kZWxldGUoYmxvY2spO1xuXHRcdGJsb2NrLmkobG9jYWwpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLkZyYWdtZW50fSBibG9ja1xuICogQHBhcmFtIHswIHwgMX0gbG9jYWxcbiAqIEBwYXJhbSB7MCB8IDF9IFtkZXRhY2hdXG4gKiBAcGFyYW0geygpID0+IHZvaWR9IFtjYWxsYmFja11cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNpdGlvbl9vdXQoYmxvY2ssIGxvY2FsLCBkZXRhY2gsIGNhbGxiYWNrKSB7XG5cdGlmIChibG9jayAmJiBibG9jay5vKSB7XG5cdFx0aWYgKG91dHJvaW5nLmhhcyhibG9jaykpIHJldHVybjtcblx0XHRvdXRyb2luZy5hZGQoYmxvY2spO1xuXHRcdG91dHJvcy5jLnB1c2goKCkgPT4ge1xuXHRcdFx0b3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcblx0XHRcdGlmIChjYWxsYmFjaykge1xuXHRcdFx0XHRpZiAoZGV0YWNoKSBibG9jay5kKDEpO1xuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGJsb2NrLm8obG9jYWwpO1xuXHR9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG5cdFx0Y2FsbGJhY2soKTtcblx0fVxufVxuXG4vKipcbiAqIEB0eXBlIHtpbXBvcnQoJy4uL3RyYW5zaXRpb24vcHVibGljLmpzJykuVHJhbnNpdGlvbkNvbmZpZ31cbiAqL1xuY29uc3QgbnVsbF90cmFuc2l0aW9uID0geyBkdXJhdGlvbjogMCB9O1xuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudCAmIEVsZW1lbnRDU1NJbmxpbmVTdHlsZX0gbm9kZVxuICogQHBhcmFtIHtUcmFuc2l0aW9uRm59IGZuXG4gKiBAcGFyYW0ge2FueX0gcGFyYW1zXG4gKiBAcmV0dXJucyB7eyBzdGFydCgpOiB2b2lkOyBpbnZhbGlkYXRlKCk6IHZvaWQ7IGVuZCgpOiB2b2lkOyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlX2luX3RyYW5zaXRpb24obm9kZSwgZm4sIHBhcmFtcykge1xuXHQvKipcblx0ICogQHR5cGUge1RyYW5zaXRpb25PcHRpb25zfSAqL1xuXHRjb25zdCBvcHRpb25zID0geyBkaXJlY3Rpb246ICdpbicgfTtcblx0bGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcywgb3B0aW9ucyk7XG5cdGxldCBydW5uaW5nID0gZmFsc2U7XG5cdGxldCBhbmltYXRpb25fbmFtZTtcblx0bGV0IHRhc2s7XG5cdGxldCB1aWQgPSAwO1xuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0ZnVuY3Rpb24gY2xlYW51cCgpIHtcblx0XHRpZiAoYW5pbWF0aW9uX25hbWUpIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0ZnVuY3Rpb24gZ28oKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGVsYXkgPSAwLFxuXHRcdFx0ZHVyYXRpb24gPSAzMDAsXG5cdFx0XHRlYXNpbmcgPSBsaW5lYXIsXG5cdFx0XHR0aWNrID0gbm9vcCxcblx0XHRcdGNzc1xuXHRcdH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuXHRcdGlmIChjc3MpIGFuaW1hdGlvbl9uYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcywgdWlkKyspO1xuXHRcdHRpY2soMCwgMSk7XG5cdFx0Y29uc3Qgc3RhcnRfdGltZSA9IG5vdygpICsgZGVsYXk7XG5cdFx0Y29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG5cdFx0aWYgKHRhc2spIHRhc2suYWJvcnQoKTtcblx0XHRydW5uaW5nID0gdHJ1ZTtcblx0XHRhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIHRydWUsICdzdGFydCcpKTtcblx0XHR0YXNrID0gbG9vcCgobm93KSA9PiB7XG5cdFx0XHRpZiAocnVubmluZykge1xuXHRcdFx0XHRpZiAobm93ID49IGVuZF90aW1lKSB7XG5cdFx0XHRcdFx0dGljaygxLCAwKTtcblx0XHRcdFx0XHRkaXNwYXRjaChub2RlLCB0cnVlLCAnZW5kJyk7XG5cdFx0XHRcdFx0Y2xlYW51cCgpO1xuXHRcdFx0XHRcdHJldHVybiAocnVubmluZyA9IGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobm93ID49IHN0YXJ0X3RpbWUpIHtcblx0XHRcdFx0XHRjb25zdCB0ID0gZWFzaW5nKChub3cgLSBzdGFydF90aW1lKSAvIGR1cmF0aW9uKTtcblx0XHRcdFx0XHR0aWNrKHQsIDEgLSB0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJ1bm5pbmc7XG5cdFx0fSk7XG5cdH1cblx0bGV0IHN0YXJ0ZWQgPSBmYWxzZTtcblx0cmV0dXJuIHtcblx0XHRzdGFydCgpIHtcblx0XHRcdGlmIChzdGFydGVkKSByZXR1cm47XG5cdFx0XHRzdGFydGVkID0gdHJ1ZTtcblx0XHRcdGRlbGV0ZV9ydWxlKG5vZGUpO1xuXHRcdFx0aWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcblx0XHRcdFx0Y29uZmlnID0gY29uZmlnKG9wdGlvbnMpO1xuXHRcdFx0XHR3YWl0KCkudGhlbihnbyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRnbygpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aW52YWxpZGF0ZSgpIHtcblx0XHRcdHN0YXJ0ZWQgPSBmYWxzZTtcblx0XHR9LFxuXHRcdGVuZCgpIHtcblx0XHRcdGlmIChydW5uaW5nKSB7XG5cdFx0XHRcdGNsZWFudXAoKTtcblx0XHRcdFx0cnVubmluZyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7VHJhbnNpdGlvbkZufSBmblxuICogQHBhcmFtIHthbnl9IHBhcmFtc1xuICogQHJldHVybnMge3sgZW5kKHJlc2V0OiBhbnkpOiB2b2lkOyB9fVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlX291dF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcblx0LyoqIEB0eXBlIHtUcmFuc2l0aW9uT3B0aW9uc30gKi9cblx0Y29uc3Qgb3B0aW9ucyA9IHsgZGlyZWN0aW9uOiAnb3V0JyB9O1xuXHRsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zLCBvcHRpb25zKTtcblx0bGV0IHJ1bm5pbmcgPSB0cnVlO1xuXHRsZXQgYW5pbWF0aW9uX25hbWU7XG5cdGNvbnN0IGdyb3VwID0gb3V0cm9zO1xuXHRncm91cC5yICs9IDE7XG5cdC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cblx0bGV0IG9yaWdpbmFsX2luZXJ0X3ZhbHVlO1xuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0ZnVuY3Rpb24gZ28oKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGVsYXkgPSAwLFxuXHRcdFx0ZHVyYXRpb24gPSAzMDAsXG5cdFx0XHRlYXNpbmcgPSBsaW5lYXIsXG5cdFx0XHR0aWNrID0gbm9vcCxcblx0XHRcdGNzc1xuXHRcdH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuXG5cdFx0aWYgKGNzcykgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAxLCAwLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcblxuXHRcdGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuXHRcdGNvbnN0IGVuZF90aW1lID0gc3RhcnRfdGltZSArIGR1cmF0aW9uO1xuXHRcdGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdzdGFydCcpKTtcblxuXHRcdGlmICgnaW5lcnQnIGluIG5vZGUpIHtcblx0XHRcdG9yaWdpbmFsX2luZXJ0X3ZhbHVlID0gLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi8gKG5vZGUpLmluZXJ0O1xuXHRcdFx0bm9kZS5pbmVydCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0bG9vcCgobm93KSA9PiB7XG5cdFx0XHRpZiAocnVubmluZykge1xuXHRcdFx0XHRpZiAobm93ID49IGVuZF90aW1lKSB7XG5cdFx0XHRcdFx0dGljaygwLCAxKTtcblx0XHRcdFx0XHRkaXNwYXRjaChub2RlLCBmYWxzZSwgJ2VuZCcpO1xuXHRcdFx0XHRcdGlmICghLS1ncm91cC5yKSB7XG5cdFx0XHRcdFx0XHQvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGBlbmQoKWAgYmVpbmcgY2FsbGVkLFxuXHRcdFx0XHRcdFx0Ly8gc28gd2UgZG9uJ3QgbmVlZCB0byBjbGVhbiB1cCBoZXJlXG5cdFx0XHRcdFx0XHRydW5fYWxsKGdyb3VwLmMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG5cdFx0XHRcdFx0Y29uc3QgdCA9IGVhc2luZygobm93IC0gc3RhcnRfdGltZSkgLyBkdXJhdGlvbik7XG5cdFx0XHRcdFx0dGljaygxIC0gdCwgdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBydW5uaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKGlzX2Z1bmN0aW9uKGNvbmZpZykpIHtcblx0XHR3YWl0KCkudGhlbigoKSA9PiB7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRjb25maWcgPSBjb25maWcob3B0aW9ucyk7XG5cdFx0XHRnbygpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGdvKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGVuZChyZXNldCkge1xuXHRcdFx0aWYgKHJlc2V0ICYmICdpbmVydCcgaW4gbm9kZSkge1xuXHRcdFx0XHRub2RlLmluZXJ0ID0gb3JpZ2luYWxfaW5lcnRfdmFsdWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVzZXQgJiYgY29uZmlnLnRpY2spIHtcblx0XHRcdFx0Y29uZmlnLnRpY2soMSwgMCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAocnVubmluZykge1xuXHRcdFx0XHRpZiAoYW5pbWF0aW9uX25hbWUpIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcblx0XHRcdFx0cnVubmluZyA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQgJiBFbGVtZW50Q1NTSW5saW5lU3R5bGV9IG5vZGVcbiAqIEBwYXJhbSB7VHJhbnNpdGlvbkZufSBmblxuICogQHBhcmFtIHthbnl9IHBhcmFtc1xuICogQHBhcmFtIHtib29sZWFufSBpbnRyb1xuICogQHJldHVybnMge3sgcnVuKGI6IDAgfCAxKTogdm9pZDsgZW5kKCk6IHZvaWQ7IH19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMsIGludHJvKSB7XG5cdC8qKlxuXHQgKiBAdHlwZSB7VHJhbnNpdGlvbk9wdGlvbnN9ICovXG5cdGNvbnN0IG9wdGlvbnMgPSB7IGRpcmVjdGlvbjogJ2JvdGgnIH07XG5cdGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMsIG9wdGlvbnMpO1xuXHRsZXQgdCA9IGludHJvID8gMCA6IDE7XG5cblx0LyoqXG5cdCAqIEB0eXBlIHtQcm9ncmFtIHwgbnVsbH0gKi9cblx0bGV0IHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG5cblx0LyoqXG5cdCAqIEB0eXBlIHtQZW5kaW5nUHJvZ3JhbSB8IG51bGx9ICovXG5cdGxldCBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuXHRsZXQgYW5pbWF0aW9uX25hbWUgPSBudWxsO1xuXG5cdC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cblx0bGV0IG9yaWdpbmFsX2luZXJ0X3ZhbHVlO1xuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0ZnVuY3Rpb24gY2xlYXJfYW5pbWF0aW9uKCkge1xuXHRcdGlmIChhbmltYXRpb25fbmFtZSkgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7UGVuZGluZ1Byb2dyYW19IHByb2dyYW1cblx0ICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG5cdCAqIEByZXR1cm5zIHtQcm9ncmFtfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdChwcm9ncmFtLCBkdXJhdGlvbikge1xuXHRcdGNvbnN0IGQgPSAvKiogQHR5cGUge1Byb2dyYW1bJ2QnXX0gKi8gKHByb2dyYW0uYiAtIHQpO1xuXHRcdGR1cmF0aW9uICo9IE1hdGguYWJzKGQpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRhOiB0LFxuXHRcdFx0YjogcHJvZ3JhbS5iLFxuXHRcdFx0ZCxcblx0XHRcdGR1cmF0aW9uLFxuXHRcdFx0c3RhcnQ6IHByb2dyYW0uc3RhcnQsXG5cdFx0XHRlbmQ6IHByb2dyYW0uc3RhcnQgKyBkdXJhdGlvbixcblx0XHRcdGdyb3VwOiBwcm9ncmFtLmdyb3VwXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge0lOVFJPIHwgT1VUUk99IGJcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBnbyhiKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGVsYXkgPSAwLFxuXHRcdFx0ZHVyYXRpb24gPSAzMDAsXG5cdFx0XHRlYXNpbmcgPSBsaW5lYXIsXG5cdFx0XHR0aWNrID0gbm9vcCxcblx0XHRcdGNzc1xuXHRcdH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuXG5cdFx0LyoqXG5cdFx0ICogQHR5cGUge1BlbmRpbmdQcm9ncmFtfSAqL1xuXHRcdGNvbnN0IHByb2dyYW0gPSB7XG5cdFx0XHRzdGFydDogbm93KCkgKyBkZWxheSxcblx0XHRcdGJcblx0XHR9O1xuXG5cdFx0aWYgKCFiKSB7XG5cdFx0XHQvLyBAdHMtaWdub3JlIHRvZG86IGltcHJvdmUgdHlwaW5nc1xuXHRcdFx0cHJvZ3JhbS5ncm91cCA9IG91dHJvcztcblx0XHRcdG91dHJvcy5yICs9IDE7XG5cdFx0fVxuXG5cdFx0aWYgKCdpbmVydCcgaW4gbm9kZSkge1xuXHRcdFx0aWYgKGIpIHtcblx0XHRcdFx0aWYgKG9yaWdpbmFsX2luZXJ0X3ZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHQvLyBhYm9ydGVkL3JldmVyc2VkIG91dHJvIFx1MjAxNCByZXN0b3JlIHByZXZpb3VzIGluZXJ0IHZhbHVlXG5cdFx0XHRcdFx0bm9kZS5pbmVydCA9IG9yaWdpbmFsX2luZXJ0X3ZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvcmlnaW5hbF9pbmVydF92YWx1ZSA9IC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovIChub2RlKS5pbmVydDtcblx0XHRcdFx0bm9kZS5pbmVydCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pIHtcblx0XHRcdHBlbmRpbmdfcHJvZ3JhbSA9IHByb2dyYW07XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIGlmIHRoaXMgaXMgYW4gaW50cm8sIGFuZCB0aGVyZSdzIGEgZGVsYXksIHdlIG5lZWQgdG8gZG9cblx0XHRcdC8vIGFuIGluaXRpYWwgdGljayBhbmQvb3IgYXBwbHkgQ1NTIGFuaW1hdGlvbiBpbW1lZGlhdGVseVxuXHRcdFx0aWYgKGNzcykge1xuXHRcdFx0XHRjbGVhcl9hbmltYXRpb24oKTtcblx0XHRcdFx0YW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcblx0XHRcdH1cblx0XHRcdGlmIChiKSB0aWNrKDAsIDEpO1xuXHRcdFx0cnVubmluZ19wcm9ncmFtID0gaW5pdChwcm9ncmFtLCBkdXJhdGlvbik7XG5cdFx0XHRhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIGIsICdzdGFydCcpKTtcblx0XHRcdGxvb3AoKG5vdykgPT4ge1xuXHRcdFx0XHRpZiAocGVuZGluZ19wcm9ncmFtICYmIG5vdyA+IHBlbmRpbmdfcHJvZ3JhbS5zdGFydCkge1xuXHRcdFx0XHRcdHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocGVuZGluZ19wcm9ncmFtLCBkdXJhdGlvbik7XG5cdFx0XHRcdFx0cGVuZGluZ19wcm9ncmFtID0gbnVsbDtcblx0XHRcdFx0XHRkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ3N0YXJ0Jyk7XG5cdFx0XHRcdFx0aWYgKGNzcykge1xuXHRcdFx0XHRcdFx0Y2xlYXJfYW5pbWF0aW9uKCk7XG5cdFx0XHRcdFx0XHRhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKFxuXHRcdFx0XHRcdFx0XHRub2RlLFxuXHRcdFx0XHRcdFx0XHR0LFxuXHRcdFx0XHRcdFx0XHRydW5uaW5nX3Byb2dyYW0uYixcblx0XHRcdFx0XHRcdFx0cnVubmluZ19wcm9ncmFtLmR1cmF0aW9uLFxuXHRcdFx0XHRcdFx0XHQwLFxuXHRcdFx0XHRcdFx0XHRlYXNpbmcsXG5cdFx0XHRcdFx0XHRcdGNvbmZpZy5jc3Ncblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChydW5uaW5nX3Byb2dyYW0pIHtcblx0XHRcdFx0XHRpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5lbmQpIHtcblx0XHRcdFx0XHRcdHRpY2soKHQgPSBydW5uaW5nX3Byb2dyYW0uYiksIDEgLSB0KTtcblx0XHRcdFx0XHRcdGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnZW5kJyk7XG5cdFx0XHRcdFx0XHRpZiAoIXBlbmRpbmdfcHJvZ3JhbSkge1xuXHRcdFx0XHRcdFx0XHQvLyB3ZSdyZSBkb25lXG5cdFx0XHRcdFx0XHRcdGlmIChydW5uaW5nX3Byb2dyYW0uYikge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGludHJvIFx1MjAxNCB3ZSBjYW4gdGlkeSB1cCBpbW1lZGlhdGVseVxuXHRcdFx0XHRcdFx0XHRcdGNsZWFyX2FuaW1hdGlvbigpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vIG91dHJvIFx1MjAxNCBuZWVkcyB0byBiZSBjb29yZGluYXRlZFxuXHRcdFx0XHRcdFx0XHRcdGlmICghLS1ydW5uaW5nX3Byb2dyYW0uZ3JvdXAucikgcnVuX2FsbChydW5uaW5nX3Byb2dyYW0uZ3JvdXAuYyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJ1bm5pbmdfcHJvZ3JhbSA9IG51bGw7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChub3cgPj0gcnVubmluZ19wcm9ncmFtLnN0YXJ0KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBwID0gbm93IC0gcnVubmluZ19wcm9ncmFtLnN0YXJ0O1xuXHRcdFx0XHRcdFx0dCA9IHJ1bm5pbmdfcHJvZ3JhbS5hICsgcnVubmluZ19wcm9ncmFtLmQgKiBlYXNpbmcocCAvIHJ1bm5pbmdfcHJvZ3JhbS5kdXJhdGlvbik7XG5cdFx0XHRcdFx0XHR0aWNrKHQsIDEgLSB0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICEhKHJ1bm5pbmdfcHJvZ3JhbSB8fCBwZW5kaW5nX3Byb2dyYW0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB7XG5cdFx0cnVuKGIpIHtcblx0XHRcdGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG5cdFx0XHRcdHdhaXQoKS50aGVuKCgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBvcHRzID0geyBkaXJlY3Rpb246IGIgPyAnaW4nIDogJ291dCcgfTtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0Y29uZmlnID0gY29uZmlnKG9wdHMpO1xuXHRcdFx0XHRcdGdvKGIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGdvKGIpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZW5kKCkge1xuXHRcdFx0Y2xlYXJfYW5pbWF0aW9uKCk7XG5cdFx0XHRydW5uaW5nX3Byb2dyYW0gPSBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqIEB0eXBlZGVmIHsxfSBJTlRSTyAqL1xuLyoqIEB0eXBlZGVmIHswfSBPVVRSTyAqL1xuLyoqIEB0eXBlZGVmIHt7IGRpcmVjdGlvbjogJ2luJyB8ICdvdXQnIHwgJ2JvdGgnIH19IFRyYW5zaXRpb25PcHRpb25zICovXG4vKiogQHR5cGVkZWYgeyhub2RlOiBFbGVtZW50LCBwYXJhbXM6IGFueSwgb3B0aW9uczogVHJhbnNpdGlvbk9wdGlvbnMpID0+IGltcG9ydCgnLi4vdHJhbnNpdGlvbi9wdWJsaWMuanMnKS5UcmFuc2l0aW9uQ29uZmlnfSBUcmFuc2l0aW9uRm4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBPdXRyb1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb25bXX0gY1xuICogQHByb3BlcnR5IHtPYmplY3R9IHBcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFBlbmRpbmdQcm9ncmFtXG4gKiBAcHJvcGVydHkge251bWJlcn0gc3RhcnRcbiAqIEBwcm9wZXJ0eSB7SU5UUk98T1VUUk99IGJcbiAqIEBwcm9wZXJ0eSB7T3V0cm99IFtncm91cF1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFByb2dyYW1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhXG4gKiBAcHJvcGVydHkge0lOVFJPfE9VVFJPfSBiXG4gKiBAcHJvcGVydHkgezF8LTF9IGRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkdXJhdGlvblxuICogQHByb3BlcnR5IHtudW1iZXJ9IHN0YXJ0XG4gKiBAcHJvcGVydHkge251bWJlcn0gZW5kXG4gKiBAcHJvcGVydHkge091dHJvfSBbZ3JvdXBdXG4gKi9cbiIsICJpbXBvcnQgeyB0cmFuc2l0aW9uX2luLCB0cmFuc2l0aW9uX291dCB9IGZyb20gJy4vdHJhbnNpdGlvbnMuanMnO1xuaW1wb3J0IHsgcnVuX2FsbCB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vLyBnZW5lcmFsIGVhY2ggZnVuY3Rpb25zOlxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlX2FycmF5X2xpa2UoYXJyYXlfbGlrZV9vcl9pdGVyYXRvcikge1xuXHRyZXR1cm4gYXJyYXlfbGlrZV9vcl9pdGVyYXRvcj8ubGVuZ3RoICE9PSB1bmRlZmluZWRcblx0XHQ/IGFycmF5X2xpa2Vfb3JfaXRlcmF0b3Jcblx0XHQ6IEFycmF5LmZyb20oYXJyYXlfbGlrZV9vcl9pdGVyYXRvcik7XG59XG5cbi8vIGtleWVkIGVhY2ggZnVuY3Rpb25zOlxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG5cdGJsb2NrLmQoMSk7XG5cdGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIG91dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcblx0dHJhbnNpdGlvbl9vdXQoYmxvY2ssIDEsIDEsICgpID0+IHtcblx0XHRsb29rdXAuZGVsZXRlKGJsb2NrLmtleSk7XG5cdH0pO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gZml4X2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcblx0YmxvY2suZigpO1xuXHRkZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG5cdGJsb2NrLmYoKTtcblx0b3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5cbi8qKiBAcmV0dXJucyB7YW55W119ICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlX2tleWVkX2VhY2goXG5cdG9sZF9ibG9ja3MsXG5cdGRpcnR5LFxuXHRnZXRfa2V5LFxuXHRkeW5hbWljLFxuXHRjdHgsXG5cdGxpc3QsXG5cdGxvb2t1cCxcblx0bm9kZSxcblx0ZGVzdHJveSxcblx0Y3JlYXRlX2VhY2hfYmxvY2ssXG5cdG5leHQsXG5cdGdldF9jb250ZXh0XG4pIHtcblx0bGV0IG8gPSBvbGRfYmxvY2tzLmxlbmd0aDtcblx0bGV0IG4gPSBsaXN0Lmxlbmd0aDtcblx0bGV0IGkgPSBvO1xuXHRjb25zdCBvbGRfaW5kZXhlcyA9IHt9O1xuXHR3aGlsZSAoaS0tKSBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuXHRjb25zdCBuZXdfYmxvY2tzID0gW107XG5cdGNvbnN0IG5ld19sb29rdXAgPSBuZXcgTWFwKCk7XG5cdGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcblx0Y29uc3QgdXBkYXRlcyA9IFtdO1xuXHRpID0gbjtcblx0d2hpbGUgKGktLSkge1xuXHRcdGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG5cdFx0Y29uc3Qga2V5ID0gZ2V0X2tleShjaGlsZF9jdHgpO1xuXHRcdGxldCBibG9jayA9IGxvb2t1cC5nZXQoa2V5KTtcblx0XHRpZiAoIWJsb2NrKSB7XG5cdFx0XHRibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcblx0XHRcdGJsb2NrLmMoKTtcblx0XHR9IGVsc2UgaWYgKGR5bmFtaWMpIHtcblx0XHRcdC8vIGRlZmVyIHVwZGF0ZXMgdW50aWwgYWxsIHRoZSBET00gc2h1ZmZsaW5nIGlzIGRvbmVcblx0XHRcdHVwZGF0ZXMucHVzaCgoKSA9PiBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpKTtcblx0XHR9XG5cdFx0bmV3X2xvb2t1cC5zZXQoa2V5LCAobmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKSk7XG5cdFx0aWYgKGtleSBpbiBvbGRfaW5kZXhlcykgZGVsdGFzLnNldChrZXksIE1hdGguYWJzKGkgLSBvbGRfaW5kZXhlc1trZXldKSk7XG5cdH1cblx0Y29uc3Qgd2lsbF9tb3ZlID0gbmV3IFNldCgpO1xuXHRjb25zdCBkaWRfbW92ZSA9IG5ldyBTZXQoKTtcblx0LyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHRmdW5jdGlvbiBpbnNlcnQoYmxvY2spIHtcblx0XHR0cmFuc2l0aW9uX2luKGJsb2NrLCAxKTtcblx0XHRibG9jay5tKG5vZGUsIG5leHQpO1xuXHRcdGxvb2t1cC5zZXQoYmxvY2sua2V5LCBibG9jayk7XG5cdFx0bmV4dCA9IGJsb2NrLmZpcnN0O1xuXHRcdG4tLTtcblx0fVxuXHR3aGlsZSAobyAmJiBuKSB7XG5cdFx0Y29uc3QgbmV3X2Jsb2NrID0gbmV3X2Jsb2Nrc1tuIC0gMV07XG5cdFx0Y29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG5cdFx0Y29uc3QgbmV3X2tleSA9IG5ld19ibG9jay5rZXk7XG5cdFx0Y29uc3Qgb2xkX2tleSA9IG9sZF9ibG9jay5rZXk7XG5cdFx0aWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG5cdFx0XHQvLyBkbyBub3RoaW5nXG5cdFx0XHRuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuXHRcdFx0by0tO1xuXHRcdFx0bi0tO1xuXHRcdH0gZWxzZSBpZiAoIW5ld19sb29rdXAuaGFzKG9sZF9rZXkpKSB7XG5cdFx0XHQvLyByZW1vdmUgb2xkIGJsb2NrXG5cdFx0XHRkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcblx0XHRcdG8tLTtcblx0XHR9IGVsc2UgaWYgKCFsb29rdXAuaGFzKG5ld19rZXkpIHx8IHdpbGxfbW92ZS5oYXMobmV3X2tleSkpIHtcblx0XHRcdGluc2VydChuZXdfYmxvY2spO1xuXHRcdH0gZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG5cdFx0XHRvLS07XG5cdFx0fSBlbHNlIGlmIChkZWx0YXMuZ2V0KG5ld19rZXkpID4gZGVsdGFzLmdldChvbGRfa2V5KSkge1xuXHRcdFx0ZGlkX21vdmUuYWRkKG5ld19rZXkpO1xuXHRcdFx0aW5zZXJ0KG5ld19ibG9jayk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpbGxfbW92ZS5hZGQob2xkX2tleSk7XG5cdFx0XHRvLS07XG5cdFx0fVxuXHR9XG5cdHdoaWxlIChvLS0pIHtcblx0XHRjb25zdCBvbGRfYmxvY2sgPSBvbGRfYmxvY2tzW29dO1xuXHRcdGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpIGRlc3Ryb3kob2xkX2Jsb2NrLCBsb29rdXApO1xuXHR9XG5cdHdoaWxlIChuKSBpbnNlcnQobmV3X2Jsb2Nrc1tuIC0gMV0pO1xuXHRydW5fYWxsKHVwZGF0ZXMpO1xuXHRyZXR1cm4gbmV3X2Jsb2Nrcztcbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfa2V5cyhjdHgsIGxpc3QsIGdldF9jb250ZXh0LCBnZXRfa2V5KSB7XG5cdGNvbnN0IGtleXMgPSBuZXcgTWFwKCk7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG5cdFx0aWYgKGtleXMuaGFzKGtleSkpIHtcblx0XHRcdGxldCB2YWx1ZSA9ICcnO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFsdWUgPSBgd2l0aCB2YWx1ZSAnJHtTdHJpbmcoa2V5KX0nIGA7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdC8vIGNhbid0IHN0cmluZ2lmeVxuXHRcdFx0fVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRgQ2Fubm90IGhhdmUgZHVwbGljYXRlIGtleXMgaW4gYSBrZXllZCBlYWNoOiBLZXlzIGF0IGluZGV4ICR7a2V5cy5nZXQoXG5cdFx0XHRcdFx0a2V5XG5cdFx0XHRcdCl9IGFuZCAke2l9ICR7dmFsdWV9YXJlIGR1cGxpY2F0ZXNgXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRrZXlzLnNldChrZXksIGkpO1xuXHR9XG59XG4iLCAiLyoqIEByZXR1cm5zIHt7fX0gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcblx0Y29uc3QgdXBkYXRlID0ge307XG5cdGNvbnN0IHRvX251bGxfb3V0ID0ge307XG5cdGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcblx0bGV0IGkgPSBsZXZlbHMubGVuZ3RoO1xuXHR3aGlsZSAoaS0tKSB7XG5cdFx0Y29uc3QgbyA9IGxldmVsc1tpXTtcblx0XHRjb25zdCBuID0gdXBkYXRlc1tpXTtcblx0XHRpZiAobikge1xuXHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gbykge1xuXHRcdFx0XHRpZiAoIShrZXkgaW4gbikpIHRvX251bGxfb3V0W2tleV0gPSAxO1xuXHRcdFx0fVxuXHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gbikge1xuXHRcdFx0XHRpZiAoIWFjY291bnRlZF9mb3Jba2V5XSkge1xuXHRcdFx0XHRcdHVwZGF0ZVtrZXldID0gbltrZXldO1xuXHRcdFx0XHRcdGFjY291bnRlZF9mb3Jba2V5XSA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxldmVsc1tpXSA9IG47XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoY29uc3Qga2V5IGluIG8pIHtcblx0XHRcdFx0YWNjb3VudGVkX2ZvcltrZXldID0gMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0Zm9yIChjb25zdCBrZXkgaW4gdG9fbnVsbF9vdXQpIHtcblx0XHRpZiAoIShrZXkgaW4gdXBkYXRlKSkgdXBkYXRlW2tleV0gPSB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIHVwZGF0ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldF9zcHJlYWRfb2JqZWN0KHNwcmVhZF9wcm9wcykge1xuXHRyZXR1cm4gdHlwZW9mIHNwcmVhZF9wcm9wcyA9PT0gJ29iamVjdCcgJiYgc3ByZWFkX3Byb3BzICE9PSBudWxsID8gc3ByZWFkX3Byb3BzIDoge307XG59XG4iLCAiY29uc3QgX2Jvb2xlYW5fYXR0cmlidXRlcyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovIChbXG5cdCdhbGxvd2Z1bGxzY3JlZW4nLFxuXHQnYWxsb3dwYXltZW50cmVxdWVzdCcsXG5cdCdhc3luYycsXG5cdCdhdXRvZm9jdXMnLFxuXHQnYXV0b3BsYXknLFxuXHQnY2hlY2tlZCcsXG5cdCdjb250cm9scycsXG5cdCdkZWZhdWx0Jyxcblx0J2RlZmVyJyxcblx0J2Rpc2FibGVkJyxcblx0J2Zvcm1ub3ZhbGlkYXRlJyxcblx0J2hpZGRlbicsXG5cdCdpbmVydCcsXG5cdCdpc21hcCcsXG5cdCdsb29wJyxcblx0J211bHRpcGxlJyxcblx0J211dGVkJyxcblx0J25vbW9kdWxlJyxcblx0J25vdmFsaWRhdGUnLFxuXHQnb3BlbicsXG5cdCdwbGF5c2lubGluZScsXG5cdCdyZWFkb25seScsXG5cdCdyZXF1aXJlZCcsXG5cdCdyZXZlcnNlZCcsXG5cdCdzZWxlY3RlZCdcbl0pO1xuXG4vKipcbiAqIExpc3Qgb2YgSFRNTCBib29sZWFuIGF0dHJpYnV0ZXMgKGUuZy4gYDxpbnB1dCBkaXNhYmxlZD5gKS5cbiAqIFNvdXJjZTogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvaW5kaWNlcy5odG1sXG4gKlxuICogQHR5cGUge1NldDxzdHJpbmc+fVxuICovXG5leHBvcnQgY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbLi4uX2Jvb2xlYW5fYXR0cmlidXRlc10pO1xuXG4vKiogQHR5cGVkZWYge3R5cGVvZiBfYm9vbGVhbl9hdHRyaWJ1dGVzW251bWJlcl19IEJvb2xlYW5BdHRyaWJ1dGVzICovXG4iLCAiLyoqIHJlZ2V4IG9mIGFsbCBodG1sIHZvaWQgZWxlbWVudCBuYW1lcyAqL1xuY29uc3Qgdm9pZF9lbGVtZW50X25hbWVzID1cblx0L14oPzphcmVhfGJhc2V8YnJ8Y29sfGNvbW1hbmR8ZW1iZWR8aHJ8aW1nfGlucHV0fGtleWdlbnxsaW5rfG1ldGF8cGFyYW18c291cmNlfHRyYWNrfHdicikkLztcblxuLyoqIHJlZ2V4IG9mIGFsbCBodG1sIGVsZW1lbnQgbmFtZXMuIHN2ZyBhbmQgbWF0aCBhcmUgb21pdHRlZCBiZWNhdXNlIHRoZXkgYmVsb25nIHRvIHRoZSBzdmcgZWxlbWVudHMgbmFtZXNwYWNlICovXG5jb25zdCBodG1sX2VsZW1lbnRfbmFtZXMgPVxuXHQvXig/OmF8YWJicnxhZGRyZXNzfGFyZWF8YXJ0aWNsZXxhc2lkZXxhdWRpb3xifGJhc2V8YmRpfGJkb3xibG9ja3F1b3RlfGJvZHl8YnJ8YnV0dG9ufGNhbnZhc3xjYXB0aW9ufGNpdGV8Y29kZXxjb2x8Y29sZ3JvdXB8ZGF0YXxkYXRhbGlzdHxkZHxkZWx8ZGV0YWlsc3xkZm58ZGlhbG9nfGRpdnxkbHxkdHxlbXxlbWJlZHxmaWVsZHNldHxmaWdjYXB0aW9ufGZpZ3VyZXxmb290ZXJ8Zm9ybXxoMXxoMnxoM3xoNHxoNXxoNnxoZWFkfGhlYWRlcnxocnxodG1sfGl8aWZyYW1lfGltZ3xpbnB1dHxpbnN8a2JkfGxhYmVsfGxlZ2VuZHxsaXxsaW5rfG1haW58bWFwfG1hcmt8bWV0YXxtZXRlcnxuYXZ8bm9zY3JpcHR8b2JqZWN0fG9sfG9wdGdyb3VwfG9wdGlvbnxvdXRwdXR8cHxwYXJhbXxwaWN0dXJlfHByZXxwcm9ncmVzc3xxfHJwfHJ0fHJ1Ynl8c3xzYW1wfHNjcmlwdHxzZWN0aW9ufHNlbGVjdHxzbWFsbHxzb3VyY2V8c3BhbnxzdHJvbmd8c3R5bGV8c3VifHN1bW1hcnl8c3VwfHRhYmxlfHRib2R5fHRkfHRlbXBsYXRlfHRleHRhcmVhfHRmb290fHRofHRoZWFkfHRpbWV8dGl0bGV8dHJ8dHJhY2t8dXx1bHx2YXJ8dmlkZW98d2JyKSQvO1xuXG4vKiogcmVnZXggb2YgYWxsIHN2ZyBlbGVtZW50IG5hbWVzICovXG5jb25zdCBzdmcgPVxuXHQvXig/OmFsdEdseXBofGFsdEdseXBoRGVmfGFsdEdseXBoSXRlbXxhbmltYXRlfGFuaW1hdGVDb2xvcnxhbmltYXRlTW90aW9ufGFuaW1hdGVUcmFuc2Zvcm18Y2lyY2xlfGNsaXBQYXRofGNvbG9yLXByb2ZpbGV8Y3Vyc29yfGRlZnN8ZGVzY3xkaXNjYXJkfGVsbGlwc2V8ZmVCbGVuZHxmZUNvbG9yTWF0cml4fGZlQ29tcG9uZW50VHJhbnNmZXJ8ZmVDb21wb3NpdGV8ZmVDb252b2x2ZU1hdHJpeHxmZURpZmZ1c2VMaWdodGluZ3xmZURpc3BsYWNlbWVudE1hcHxmZURpc3RhbnRMaWdodHxmZURyb3BTaGFkb3d8ZmVGbG9vZHxmZUZ1bmNBfGZlRnVuY0J8ZmVGdW5jR3xmZUZ1bmNSfGZlR2F1c3NpYW5CbHVyfGZlSW1hZ2V8ZmVNZXJnZXxmZU1lcmdlTm9kZXxmZU1vcnBob2xvZ3l8ZmVPZmZzZXR8ZmVQb2ludExpZ2h0fGZlU3BlY3VsYXJMaWdodGluZ3xmZVNwb3RMaWdodHxmZVRpbGV8ZmVUdXJidWxlbmNlfGZpbHRlcnxmb250fGZvbnQtZmFjZXxmb250LWZhY2UtZm9ybWF0fGZvbnQtZmFjZS1uYW1lfGZvbnQtZmFjZS1zcmN8Zm9udC1mYWNlLXVyaXxmb3JlaWduT2JqZWN0fGd8Z2x5cGh8Z2x5cGhSZWZ8aGF0Y2h8aGF0Y2hwYXRofGhrZXJufGltYWdlfGxpbmV8bGluZWFyR3JhZGllbnR8bWFya2VyfG1hc2t8bWVzaHxtZXNoZ3JhZGllbnR8bWVzaHBhdGNofG1lc2hyb3d8bWV0YWRhdGF8bWlzc2luZy1nbHlwaHxtcGF0aHxwYXRofHBhdHRlcm58cG9seWdvbnxwb2x5bGluZXxyYWRpYWxHcmFkaWVudHxyZWN0fHNldHxzb2xpZGNvbG9yfHN0b3B8c3ZnfHN3aXRjaHxzeW1ib2x8dGV4dHx0ZXh0UGF0aHx0cmVmfHRzcGFufHVua25vd258dXNlfHZpZXd8dmtlcm4pJC87XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNfdm9pZChuYW1lKSB7XG5cdHJldHVybiB2b2lkX2VsZW1lbnRfbmFtZXMudGVzdChuYW1lKSB8fCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09ICchZG9jdHlwZSc7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNfaHRtbChuYW1lKSB7XG5cdHJldHVybiBodG1sX2VsZW1lbnRfbmFtZXMudGVzdChuYW1lKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc19zdmcobmFtZSkge1xuXHRyZXR1cm4gc3ZnLnRlc3QobmFtZSk7XG59XG4iLCAiaW1wb3J0IHtcblx0YWRkX3JlbmRlcl9jYWxsYmFjayxcblx0Zmx1c2gsXG5cdGZsdXNoX3JlbmRlcl9jYWxsYmFja3MsXG5cdHNjaGVkdWxlX3VwZGF0ZSxcblx0ZGlydHlfY29tcG9uZW50c1xufSBmcm9tICcuL3NjaGVkdWxlci5qcyc7XG5pbXBvcnQgeyBjdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1cnJlbnRfY29tcG9uZW50IH0gZnJvbSAnLi9saWZlY3ljbGUuanMnO1xuaW1wb3J0IHsgYmxhbmtfb2JqZWN0LCBpc19lbXB0eSwgaXNfZnVuY3Rpb24sIHJ1biwgcnVuX2FsbCwgbm9vcCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtcblx0Y2hpbGRyZW4sXG5cdGRldGFjaCxcblx0c3RhcnRfaHlkcmF0aW5nLFxuXHRlbmRfaHlkcmF0aW5nLFxuXHRnZXRfY3VzdG9tX2VsZW1lbnRzX3Nsb3RzLFxuXHRpbnNlcnQsXG5cdGVsZW1lbnQsXG5cdGF0dHJcbn0gZnJvbSAnLi9kb20uanMnO1xuaW1wb3J0IHsgdHJhbnNpdGlvbl9pbiB9IGZyb20gJy4vdHJhbnNpdGlvbnMuanMnO1xuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG5cdGNvbnN0IGluZGV4ID0gY29tcG9uZW50LiQkLnByb3BzW25hbWVdO1xuXHRpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuXHRcdGNvbXBvbmVudC4kJC5ib3VuZFtpbmRleF0gPSBjYWxsYmFjaztcblx0XHRjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG5cdH1cbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZV9jb21wb25lbnQoYmxvY2spIHtcblx0YmxvY2sgJiYgYmxvY2suYygpO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gY2xhaW1fY29tcG9uZW50KGJsb2NrLCBwYXJlbnRfbm9kZXMpIHtcblx0YmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcblx0Y29uc3QgeyBmcmFnbWVudCwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG5cdGZyYWdtZW50ICYmIGZyYWdtZW50Lm0odGFyZ2V0LCBhbmNob3IpO1xuXHQvLyBvbk1vdW50IGhhcHBlbnMgYmVmb3JlIHRoZSBpbml0aWFsIGFmdGVyVXBkYXRlXG5cdGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuXHRcdGNvbnN0IG5ld19vbl9kZXN0cm95ID0gY29tcG9uZW50LiQkLm9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG5cdFx0Ly8gaWYgdGhlIGNvbXBvbmVudCB3YXMgZGVzdHJveWVkIGltbWVkaWF0ZWx5XG5cdFx0Ly8gaXQgd2lsbCB1cGRhdGUgdGhlIGAkJC5vbl9kZXN0cm95YCByZWZlcmVuY2UgdG8gYG51bGxgLlxuXHRcdC8vIHRoZSBkZXN0cnVjdHVyZWQgb25fZGVzdHJveSBtYXkgc3RpbGwgcmVmZXJlbmNlIHRvIHRoZSBvbGQgYXJyYXlcblx0XHRpZiAoY29tcG9uZW50LiQkLm9uX2Rlc3Ryb3kpIHtcblx0XHRcdGNvbXBvbmVudC4kJC5vbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBFZGdlIGNhc2UgLSBjb21wb25lbnQgd2FzIGRlc3Ryb3llZCBpbW1lZGlhdGVseSxcblx0XHRcdC8vIG1vc3QgbGlrZWx5IGFzIGEgcmVzdWx0IG9mIGEgYmluZGluZyBpbml0aWFsaXNpbmdcblx0XHRcdHJ1bl9hbGwobmV3X29uX2Rlc3Ryb3kpO1xuXHRcdH1cblx0XHRjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcblx0fSk7XG5cdGFmdGVyX3VwZGF0ZS5mb3JFYWNoKGFkZF9yZW5kZXJfY2FsbGJhY2spO1xufVxuXG4vKiogQHJldHVybnMge3ZvaWR9ICovXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveV9jb21wb25lbnQoY29tcG9uZW50LCBkZXRhY2hpbmcpIHtcblx0Y29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG5cdGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuXHRcdGZsdXNoX3JlbmRlcl9jYWxsYmFja3MoJCQuYWZ0ZXJfdXBkYXRlKTtcblx0XHRydW5fYWxsKCQkLm9uX2Rlc3Ryb3kpO1xuXHRcdCQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcblx0XHQvLyBUT0RPIG51bGwgb3V0IG90aGVyIHJlZnMsIGluY2x1ZGluZyBjb21wb25lbnQuJCQgKGJ1dCBuZWVkIHRvXG5cdFx0Ly8gcHJlc2VydmUgZmluYWwgc3RhdGU/KVxuXHRcdCQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG5cdFx0JCQuY3R4ID0gW107XG5cdH1cbn1cblxuLyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuZnVuY3Rpb24gbWFrZV9kaXJ0eShjb21wb25lbnQsIGkpIHtcblx0aWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcblx0XHRkaXJ0eV9jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcblx0XHRzY2hlZHVsZV91cGRhdGUoKTtcblx0XHRjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcblx0fVxuXHRjb21wb25lbnQuJCQuZGlydHlbKGkgLyAzMSkgfCAwXSB8PSAxIDw8IGkgJSAzMTtcbn1cblxuLy8gVE9ETzogRG9jdW1lbnQgdGhlIG90aGVyIHBhcmFtc1xuLyoqXG4gKiBAcGFyYW0ge1N2ZWx0ZUNvbXBvbmVudH0gY29tcG9uZW50XG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5Db21wb25lbnRDb25zdHJ1Y3Rvck9wdGlvbnN9IG9wdGlvbnNcbiAqXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi91dGlscy5qcycpWydub3RfZXF1YWwnXX0gbm90X2VxdWFsIFVzZWQgdG8gY29tcGFyZSBwcm9wcyBhbmQgc3RhdGUgdmFsdWVzLlxuICogQHBhcmFtIHsodGFyZ2V0OiBFbGVtZW50IHwgU2hhZG93Um9vdCkgPT4gdm9pZH0gW2FwcGVuZF9zdHlsZXNdIEZ1bmN0aW9uIHRoYXQgYXBwZW5kcyBzdHlsZXMgdG8gdGhlIERPTSB3aGVuIHRoZSBjb21wb25lbnQgaXMgZmlyc3QgaW5pdGlhbGlzZWQuXG4gKiBUaGlzIHdpbGwgYmUgdGhlIGBhZGRfY3NzYCBmdW5jdGlvbiBmcm9tIHRoZSBjb21waWxlZCBjb21wb25lbnQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KFxuXHRjb21wb25lbnQsXG5cdG9wdGlvbnMsXG5cdGluc3RhbmNlLFxuXHRjcmVhdGVfZnJhZ21lbnQsXG5cdG5vdF9lcXVhbCxcblx0cHJvcHMsXG5cdGFwcGVuZF9zdHlsZXMgPSBudWxsLFxuXHRkaXJ0eSA9IFstMV1cbikge1xuXHRjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG5cdHNldF9jdXJyZW50X2NvbXBvbmVudChjb21wb25lbnQpO1xuXHQvKiogQHR5cGUge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuVCQkfSAqL1xuXHRjb25zdCAkJCA9IChjb21wb25lbnQuJCQgPSB7XG5cdFx0ZnJhZ21lbnQ6IG51bGwsXG5cdFx0Y3R4OiBbXSxcblx0XHQvLyBzdGF0ZVxuXHRcdHByb3BzLFxuXHRcdHVwZGF0ZTogbm9vcCxcblx0XHRub3RfZXF1YWwsXG5cdFx0Ym91bmQ6IGJsYW5rX29iamVjdCgpLFxuXHRcdC8vIGxpZmVjeWNsZVxuXHRcdG9uX21vdW50OiBbXSxcblx0XHRvbl9kZXN0cm95OiBbXSxcblx0XHRvbl9kaXNjb25uZWN0OiBbXSxcblx0XHRiZWZvcmVfdXBkYXRlOiBbXSxcblx0XHRhZnRlcl91cGRhdGU6IFtdLFxuXHRcdGNvbnRleHQ6IG5ldyBNYXAob3B0aW9ucy5jb250ZXh0IHx8IChwYXJlbnRfY29tcG9uZW50ID8gcGFyZW50X2NvbXBvbmVudC4kJC5jb250ZXh0IDogW10pKSxcblx0XHQvLyBldmVyeXRoaW5nIGVsc2Vcblx0XHRjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpLFxuXHRcdGRpcnR5LFxuXHRcdHNraXBfYm91bmQ6IGZhbHNlLFxuXHRcdHJvb3Q6IG9wdGlvbnMudGFyZ2V0IHx8IHBhcmVudF9jb21wb25lbnQuJCQucm9vdFxuXHR9KTtcblx0YXBwZW5kX3N0eWxlcyAmJiBhcHBlbmRfc3R5bGVzKCQkLnJvb3QpO1xuXHRsZXQgcmVhZHkgPSBmYWxzZTtcblx0JCQuY3R4ID0gaW5zdGFuY2Vcblx0XHQ/IGluc3RhbmNlKGNvbXBvbmVudCwgb3B0aW9ucy5wcm9wcyB8fCB7fSwgKGksIHJldCwgLi4ucmVzdCkgPT4ge1xuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHJlc3QubGVuZ3RoID8gcmVzdFswXSA6IHJldDtcblx0XHRcdFx0aWYgKCQkLmN0eCAmJiBub3RfZXF1YWwoJCQuY3R4W2ldLCAoJCQuY3R4W2ldID0gdmFsdWUpKSkge1xuXHRcdFx0XHRcdGlmICghJCQuc2tpcF9ib3VuZCAmJiAkJC5ib3VuZFtpXSkgJCQuYm91bmRbaV0odmFsdWUpO1xuXHRcdFx0XHRcdGlmIChyZWFkeSkgbWFrZV9kaXJ0eShjb21wb25lbnQsIGkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0ICB9KVxuXHRcdDogW107XG5cdCQkLnVwZGF0ZSgpO1xuXHRyZWFkeSA9IHRydWU7XG5cdHJ1bl9hbGwoJCQuYmVmb3JlX3VwZGF0ZSk7XG5cdC8vIGBmYWxzZWAgYXMgYSBzcGVjaWFsIGNhc2Ugb2Ygbm8gRE9NIGNvbXBvbmVudFxuXHQkJC5mcmFnbWVudCA9IGNyZWF0ZV9mcmFnbWVudCA/IGNyZWF0ZV9mcmFnbWVudCgkJC5jdHgpIDogZmFsc2U7XG5cdGlmIChvcHRpb25zLnRhcmdldCkge1xuXHRcdGlmIChvcHRpb25zLmh5ZHJhdGUpIHtcblx0XHRcdHN0YXJ0X2h5ZHJhdGluZygpO1xuXHRcdFx0Ly8gVE9ETzogd2hhdCBpcyB0aGUgY29ycmVjdCB0eXBlIGhlcmU/XG5cdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yXG5cdFx0XHRjb25zdCBub2RlcyA9IGNoaWxkcmVuKG9wdGlvbnMudGFyZ2V0KTtcblx0XHRcdCQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50Lmwobm9kZXMpO1xuXHRcdFx0bm9kZXMuZm9yRWFjaChkZXRhY2gpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuXHRcdFx0JCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQuYygpO1xuXHRcdH1cblx0XHRpZiAob3B0aW9ucy5pbnRybykgdHJhbnNpdGlvbl9pbihjb21wb25lbnQuJCQuZnJhZ21lbnQpO1xuXHRcdG1vdW50X2NvbXBvbmVudChjb21wb25lbnQsIG9wdGlvbnMudGFyZ2V0LCBvcHRpb25zLmFuY2hvcik7XG5cdFx0ZW5kX2h5ZHJhdGluZygpO1xuXHRcdGZsdXNoKCk7XG5cdH1cblx0c2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xufVxuXG5leHBvcnQgbGV0IFN2ZWx0ZUVsZW1lbnQ7XG5cbmlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdmdW5jdGlvbicpIHtcblx0U3ZlbHRlRWxlbWVudCA9IGNsYXNzIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRcdC8qKiBUaGUgU3ZlbHRlIGNvbXBvbmVudCBjb25zdHJ1Y3RvciAqL1xuXHRcdCQkY3Rvcjtcblx0XHQvKiogU2xvdHMgKi9cblx0XHQkJHM7XG5cdFx0LyoqIFRoZSBTdmVsdGUgY29tcG9uZW50IGluc3RhbmNlICovXG5cdFx0JCRjO1xuXHRcdC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgY3VzdG9tIGVsZW1lbnQgaXMgY29ubmVjdGVkICovXG5cdFx0JCRjbiA9IGZhbHNlO1xuXHRcdC8qKiBDb21wb25lbnQgcHJvcHMgZGF0YSAqL1xuXHRcdCQkZCA9IHt9O1xuXHRcdC8qKiBgdHJ1ZWAgaWYgY3VycmVudGx5IGluIHRoZSBwcm9jZXNzIG9mIHJlZmxlY3RpbmcgY29tcG9uZW50IHByb3BzIGJhY2sgdG8gYXR0cmlidXRlcyAqL1xuXHRcdCQkciA9IGZhbHNlO1xuXHRcdC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgQ3VzdG9tRWxlbWVudFByb3BEZWZpbml0aW9uPn0gUHJvcHMgZGVmaW5pdGlvbiAobmFtZSwgcmVmbGVjdGVkLCB0eXBlIGV0YykgKi9cblx0XHQkJHBfZCA9IHt9O1xuXHRcdC8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgRnVuY3Rpb25bXT59IEV2ZW50IGxpc3RlbmVycyAqL1xuXHRcdCQkbCA9IHt9O1xuXHRcdC8qKiBAdHlwZSB7TWFwPEZ1bmN0aW9uLCBGdW5jdGlvbj59IEV2ZW50IGxpc3RlbmVyIHVuc3Vic2NyaWJlIGZ1bmN0aW9ucyAqL1xuXHRcdCQkbF91ID0gbmV3IE1hcCgpO1xuXG5cdFx0Y29uc3RydWN0b3IoJCRjb21wb25lbnRDdG9yLCAkJHNsb3RzLCB1c2Vfc2hhZG93X2RvbSkge1xuXHRcdFx0c3VwZXIoKTtcblx0XHRcdHRoaXMuJCRjdG9yID0gJCRjb21wb25lbnRDdG9yO1xuXHRcdFx0dGhpcy4kJHMgPSAkJHNsb3RzO1xuXHRcdFx0aWYgKHVzZV9zaGFkb3dfZG9tKSB7XG5cdFx0XHRcdHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpIHtcblx0XHRcdC8vIFdlIGNhbid0IGRldGVybWluZSB1cGZyb250IGlmIHRoZSBldmVudCBpcyBhIGN1c3RvbSBldmVudCBvciBub3QsIHNvIHdlIGhhdmUgdG9cblx0XHRcdC8vIGxpc3RlbiB0byBib3RoLiBJZiBzb21lb25lIHVzZXMgYSBjdXN0b20gZXZlbnQgd2l0aCB0aGUgc2FtZSBuYW1lIGFzIGEgcmVndWxhclxuXHRcdFx0Ly8gYnJvd3NlciBldmVudCwgdGhpcyBmaXJlcyB0d2ljZSAtIHdlIGNhbid0IGF2b2lkIHRoYXQuXG5cdFx0XHR0aGlzLiQkbFt0eXBlXSA9IHRoaXMuJCRsW3R5cGVdIHx8IFtdO1xuXHRcdFx0dGhpcy4kJGxbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG5cdFx0XHRpZiAodGhpcy4kJGMpIHtcblx0XHRcdFx0Y29uc3QgdW5zdWIgPSB0aGlzLiQkYy4kb24odHlwZSwgbGlzdGVuZXIpO1xuXHRcdFx0XHR0aGlzLiQkbF91LnNldChsaXN0ZW5lciwgdW5zdWIpO1xuXHRcdFx0fVxuXHRcdFx0c3VwZXIuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucykge1xuXHRcdFx0c3VwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cdFx0XHRpZiAodGhpcy4kJGMpIHtcblx0XHRcdFx0Y29uc3QgdW5zdWIgPSB0aGlzLiQkbF91LmdldChsaXN0ZW5lcik7XG5cdFx0XHRcdGlmICh1bnN1Yikge1xuXHRcdFx0XHRcdHVuc3ViKCk7XG5cdFx0XHRcdFx0dGhpcy4kJGxfdS5kZWxldGUobGlzdGVuZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0YXN5bmMgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0XHR0aGlzLiQkY24gPSB0cnVlO1xuXHRcdFx0aWYgKCF0aGlzLiQkYykge1xuXHRcdFx0XHQvLyBXZSB3YWl0IG9uZSB0aWNrIHRvIGxldCBwb3NzaWJsZSBjaGlsZCBzbG90IGVsZW1lbnRzIGJlIGNyZWF0ZWQvbW91bnRlZFxuXHRcdFx0XHRhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdFx0aWYgKCF0aGlzLiQkY24pIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuY3Rpb24gY3JlYXRlX3Nsb3QobmFtZSkge1xuXHRcdFx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRsZXQgbm9kZTtcblx0XHRcdFx0XHRcdGNvbnN0IG9iaiA9IHtcblx0XHRcdFx0XHRcdFx0YzogZnVuY3Rpb24gY3JlYXRlKCkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtZW50KCdzbG90Jyk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuXHRcdFx0XHRcdFx0XHRcdFx0YXR0cihub2RlLCAnbmFtZScsIG5hbWUpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0LyoqXG5cdFx0XHRcdFx0XHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuXHRcdFx0XHRcdFx0XHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbYW5jaG9yXVxuXHRcdFx0XHRcdFx0XHQgKi9cblx0XHRcdFx0XHRcdFx0bTogZnVuY3Rpb24gbW91bnQodGFyZ2V0LCBhbmNob3IpIHtcblx0XHRcdFx0XHRcdFx0XHRpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRkOiBmdW5jdGlvbiBkZXN0cm95KGRldGFjaGluZykge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXRhY2hpbmcpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRldGFjaChub2RlKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgJCRzbG90cyA9IHt9O1xuXHRcdFx0XHRjb25zdCBleGlzdGluZ19zbG90cyA9IGdldF9jdXN0b21fZWxlbWVudHNfc2xvdHModGhpcyk7XG5cdFx0XHRcdGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLiQkcykge1xuXHRcdFx0XHRcdGlmIChuYW1lIGluIGV4aXN0aW5nX3Nsb3RzKSB7XG5cdFx0XHRcdFx0XHQkJHNsb3RzW25hbWVdID0gW2NyZWF0ZV9zbG90KG5hbWUpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgdGhpcy5hdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0Ly8gdGhpcy4kJGRhdGEgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRoaXMuYXR0cmlidXRlc1xuXHRcdFx0XHRcdGNvbnN0IG5hbWUgPSB0aGlzLiQkZ19wKGF0dHJpYnV0ZS5uYW1lKTtcblx0XHRcdFx0XHRpZiAoIShuYW1lIGluIHRoaXMuJCRkKSkge1xuXHRcdFx0XHRcdFx0dGhpcy4kJGRbbmFtZV0gPSBnZXRfY3VzdG9tX2VsZW1lbnRfdmFsdWUobmFtZSwgYXR0cmlidXRlLnZhbHVlLCB0aGlzLiQkcF9kLCAndG9Qcm9wJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuJCRjID0gbmV3IHRoaXMuJCRjdG9yKHtcblx0XHRcdFx0XHR0YXJnZXQ6IHRoaXMuc2hhZG93Um9vdCB8fCB0aGlzLFxuXHRcdFx0XHRcdHByb3BzOiB7XG5cdFx0XHRcdFx0XHQuLi50aGlzLiQkZCxcblx0XHRcdFx0XHRcdCQkc2xvdHMsXG5cdFx0XHRcdFx0XHQkJHNjb3BlOiB7XG5cdFx0XHRcdFx0XHRcdGN0eDogW11cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIFJlZmxlY3QgY29tcG9uZW50IHByb3BzIGFzIGF0dHJpYnV0ZXNcblx0XHRcdFx0Y29uc3QgcmVmbGVjdF9hdHRyaWJ1dGVzID0gKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuJCRyID0gdHJ1ZTtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IGtleSBpbiB0aGlzLiQkcF9kKSB7XG5cdFx0XHRcdFx0XHR0aGlzLiQkZFtrZXldID0gdGhpcy4kJGMuJCQuY3R4W3RoaXMuJCRjLiQkLnByb3BzW2tleV1dO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuJCRwX2Rba2V5XS5yZWZsZWN0KSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGF0dHJpYnV0ZV92YWx1ZSA9IGdldF9jdXN0b21fZWxlbWVudF92YWx1ZShcblx0XHRcdFx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy4kJGRba2V5XSxcblx0XHRcdFx0XHRcdFx0XHR0aGlzLiQkcF9kLFxuXHRcdFx0XHRcdFx0XHRcdCd0b0F0dHJpYnV0ZSdcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZV92YWx1ZSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyaWJ1dGUodGhpcy4kJHBfZFtrZXldLmF0dHJpYnV0ZSB8fCBrZXkpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc2V0QXR0cmlidXRlKHRoaXMuJCRwX2Rba2V5XS5hdHRyaWJ1dGUgfHwga2V5LCBhdHRyaWJ1dGVfdmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuJCRyID0gZmFsc2U7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHRoaXMuJCRjLiQkLmFmdGVyX3VwZGF0ZS5wdXNoKHJlZmxlY3RfYXR0cmlidXRlcyk7XG5cdFx0XHRcdHJlZmxlY3RfYXR0cmlidXRlcygpOyAvLyBvbmNlIGluaXRpYWxseSBiZWNhdXNlIGFmdGVyX3VwZGF0ZSBpcyBhZGRlZCB0b28gbGF0ZSBmb3IgZmlyc3QgcmVuZGVyXG5cblx0XHRcdFx0Zm9yIChjb25zdCB0eXBlIGluIHRoaXMuJCRsKSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLiQkbFt0eXBlXSkge1xuXHRcdFx0XHRcdFx0Y29uc3QgdW5zdWIgPSB0aGlzLiQkYy4kb24odHlwZSwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdFx0dGhpcy4kJGxfdS5zZXQobGlzdGVuZXIsIHVuc3ViKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy4kJGwgPSB7fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBXZSBkb24ndCBuZWVkIHRoaXMgd2hlbiB3b3JraW5nIHdpdGhpbiBTdmVsdGUgY29kZSwgYnV0IGZvciBjb21wYXRpYmlsaXR5IG9mIHBlb3BsZSB1c2luZyB0aGlzIG91dHNpZGUgb2YgU3ZlbHRlXG5cdFx0Ly8gYW5kIHNldHRpbmcgYXR0cmlidXRlcyB0aHJvdWdoIHNldEF0dHJpYnV0ZSBldGMsIHRoaXMgaXMgaGVscGZ1bFxuXHRcdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyLCBfb2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG5cdFx0XHRpZiAodGhpcy4kJHIpIHJldHVybjtcblx0XHRcdGF0dHIgPSB0aGlzLiQkZ19wKGF0dHIpO1xuXHRcdFx0dGhpcy4kJGRbYXR0cl0gPSBnZXRfY3VzdG9tX2VsZW1lbnRfdmFsdWUoYXR0ciwgbmV3VmFsdWUsIHRoaXMuJCRwX2QsICd0b1Byb3AnKTtcblx0XHRcdHRoaXMuJCRjPy4kc2V0KHsgW2F0dHJdOiB0aGlzLiQkZFthdHRyXSB9KTtcblx0XHR9XG5cblx0XHRkaXNjb25uZWN0ZWRDYWxsYmFjaygpIHtcblx0XHRcdHRoaXMuJCRjbiA9IGZhbHNlO1xuXHRcdFx0Ly8gSW4gYSBtaWNyb3Rhc2ssIGJlY2F1c2UgdGhpcyBjb3VsZCBiZSBhIG1vdmUgd2l0aGluIHRoZSBET01cblx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0XHRpZiAoIXRoaXMuJCRjbikge1xuXHRcdFx0XHRcdHRoaXMuJCRjLiRkZXN0cm95KCk7XG5cdFx0XHRcdFx0dGhpcy4kJGMgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdCQkZ19wKGF0dHJpYnV0ZV9uYW1lKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRPYmplY3Qua2V5cyh0aGlzLiQkcF9kKS5maW5kKFxuXHRcdFx0XHRcdChrZXkpID0+XG5cdFx0XHRcdFx0XHR0aGlzLiQkcF9kW2tleV0uYXR0cmlidXRlID09PSBhdHRyaWJ1dGVfbmFtZSB8fFxuXHRcdFx0XHRcdFx0KCF0aGlzLiQkcF9kW2tleV0uYXR0cmlidXRlICYmIGtleS50b0xvd2VyQ2FzZSgpID09PSBhdHRyaWJ1dGVfbmFtZSlcblx0XHRcdFx0KSB8fCBhdHRyaWJ1dGVfbmFtZVxuXHRcdFx0KTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50UHJvcERlZmluaXRpb24+fSBwcm9wc19kZWZpbml0aW9uXG4gKiBAcGFyYW0geyd0b0F0dHJpYnV0ZScgfCAndG9Qcm9wJ30gW3RyYW5zZm9ybV1cbiAqL1xuZnVuY3Rpb24gZ2V0X2N1c3RvbV9lbGVtZW50X3ZhbHVlKHByb3AsIHZhbHVlLCBwcm9wc19kZWZpbml0aW9uLCB0cmFuc2Zvcm0pIHtcblx0Y29uc3QgdHlwZSA9IHByb3BzX2RlZmluaXRpb25bcHJvcF0/LnR5cGU7XG5cdHZhbHVlID0gdHlwZSA9PT0gJ0Jvb2xlYW4nICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nID8gdmFsdWUgIT0gbnVsbCA6IHZhbHVlO1xuXHRpZiAoIXRyYW5zZm9ybSB8fCAhcHJvcHNfZGVmaW5pdGlvbltwcm9wXSkge1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fSBlbHNlIGlmICh0cmFuc2Zvcm0gPT09ICd0b0F0dHJpYnV0ZScpIHtcblx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdGNhc2UgJ09iamVjdCc6XG5cdFx0XHRjYXNlICdBcnJheSc6XG5cdFx0XHRcdHJldHVybiB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdGNhc2UgJ0Jvb2xlYW4nOlxuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPyAnJyA6IG51bGw7XG5cdFx0XHRjYXNlICdOdW1iZXInOlxuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB2YWx1ZTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRjYXNlICdPYmplY3QnOlxuXHRcdFx0Y2FzZSAnQXJyYXknOlxuXHRcdFx0XHRyZXR1cm4gdmFsdWUgJiYgSlNPTi5wYXJzZSh2YWx1ZSk7XG5cdFx0XHRjYXNlICdCb29sZWFuJzpcblx0XHRcdFx0cmV0dXJuIHZhbHVlOyAvLyBjb252ZXJzaW9uIGFscmVhZHkgaGFuZGxlZCBhYm92ZVxuXHRcdFx0Y2FzZSAnTnVtYmVyJzpcblx0XHRcdFx0cmV0dXJuIHZhbHVlICE9IG51bGwgPyArdmFsdWUgOiB2YWx1ZTtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqXG4gKiBUdXJuIGEgU3ZlbHRlIGNvbXBvbmVudCBpbnRvIGEgY3VzdG9tIGVsZW1lbnQuXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5Db21wb25lbnRUeXBlfSBDb21wb25lbnQgIEEgU3ZlbHRlIGNvbXBvbmVudCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50UHJvcERlZmluaXRpb24+fSBwcm9wc19kZWZpbml0aW9uICBUaGUgcHJvcHMgdG8gb2JzZXJ2ZVxuICogQHBhcmFtIHtzdHJpbmdbXX0gc2xvdHMgIFRoZSBzbG90cyB0byBjcmVhdGVcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFjY2Vzc29ycyAgT3RoZXIgYWNjZXNzb3JzIGJlc2lkZXMgdGhlIG9uZXMgZm9yIHByb3BzIHRoZSBjb21wb25lbnQgaGFzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVzZV9zaGFkb3dfZG9tICBXaGV0aGVyIHRvIHVzZSBzaGFkb3cgRE9NXG4gKiBAcGFyYW0geyhjZTogbmV3ICgpID0+IEhUTUxFbGVtZW50KSA9PiBuZXcgKCkgPT4gSFRNTEVsZW1lbnR9IFtleHRlbmRdXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVfY3VzdG9tX2VsZW1lbnQoXG5cdENvbXBvbmVudCxcblx0cHJvcHNfZGVmaW5pdGlvbixcblx0c2xvdHMsXG5cdGFjY2Vzc29ycyxcblx0dXNlX3NoYWRvd19kb20sXG5cdGV4dGVuZFxuKSB7XG5cdGxldCBDbGFzcyA9IGNsYXNzIGV4dGVuZHMgU3ZlbHRlRWxlbWVudCB7XG5cdFx0Y29uc3RydWN0b3IoKSB7XG5cdFx0XHRzdXBlcihDb21wb25lbnQsIHNsb3RzLCB1c2Vfc2hhZG93X2RvbSk7XG5cdFx0XHR0aGlzLiQkcF9kID0gcHJvcHNfZGVmaW5pdGlvbjtcblx0XHR9XG5cdFx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXMocHJvcHNfZGVmaW5pdGlvbikubWFwKChrZXkpID0+XG5cdFx0XHRcdChwcm9wc19kZWZpbml0aW9uW2tleV0uYXR0cmlidXRlIHx8IGtleSkudG9Mb3dlckNhc2UoKVxuXHRcdFx0KTtcblx0XHR9XG5cdH07XG5cdE9iamVjdC5rZXlzKHByb3BzX2RlZmluaXRpb24pLmZvckVhY2goKHByb3ApID0+IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhc3MucHJvdG90eXBlLCBwcm9wLCB7XG5cdFx0XHRnZXQoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLiQkYyAmJiBwcm9wIGluIHRoaXMuJCRjID8gdGhpcy4kJGNbcHJvcF0gOiB0aGlzLiQkZFtwcm9wXTtcblx0XHRcdH0sXG5cdFx0XHRzZXQodmFsdWUpIHtcblx0XHRcdFx0dmFsdWUgPSBnZXRfY3VzdG9tX2VsZW1lbnRfdmFsdWUocHJvcCwgdmFsdWUsIHByb3BzX2RlZmluaXRpb24pO1xuXHRcdFx0XHR0aGlzLiQkZFtwcm9wXSA9IHZhbHVlO1xuXHRcdFx0XHR0aGlzLiQkYz8uJHNldCh7IFtwcm9wXTogdmFsdWUgfSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHRhY2Nlc3NvcnMuZm9yRWFjaCgoYWNjZXNzb3IpID0+IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhc3MucHJvdG90eXBlLCBhY2Nlc3Nvciwge1xuXHRcdFx0Z2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy4kJGM/LlthY2Nlc3Nvcl07XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pO1xuXHRpZiAoZXh0ZW5kKSB7XG5cdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciAtIGFzc2lnbmluZyBoZXJlIGlzIGZpbmVcblx0XHRDbGFzcyA9IGV4dGVuZChDbGFzcyk7XG5cdH1cblx0Q29tcG9uZW50LmVsZW1lbnQgPSAvKiogQHR5cGUge2FueX0gKi8gKENsYXNzKTtcblx0cmV0dXJuIENsYXNzO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIFN2ZWx0ZSBjb21wb25lbnRzLiBVc2VkIHdoZW4gZGV2PWZhbHNlLlxuICpcbiAqIEB0ZW1wbGF0ZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gW1Byb3BzPWFueV1cbiAqIEB0ZW1wbGF0ZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gW0V2ZW50cz1hbnldXG4gKi9cbmV4cG9ydCBjbGFzcyBTdmVsdGVDb21wb25lbnQge1xuXHQvKipcblx0ICogIyMjIFBSSVZBVEUgQVBJXG5cdCAqXG5cdCAqIERvIG5vdCB1c2UsIG1heSBjaGFuZ2UgYXQgYW55IHRpbWVcblx0ICpcblx0ICogQHR5cGUge2FueX1cblx0ICovXG5cdCQkID0gdW5kZWZpbmVkO1xuXHQvKipcblx0ICogIyMjIFBSSVZBVEUgQVBJXG5cdCAqXG5cdCAqIERvIG5vdCB1c2UsIG1heSBjaGFuZ2UgYXQgYW55IHRpbWVcblx0ICpcblx0ICogQHR5cGUge2FueX1cblx0ICovXG5cdCQkc2V0ID0gdW5kZWZpbmVkO1xuXG5cdC8qKiBAcmV0dXJucyB7dm9pZH0gKi9cblx0JGRlc3Ryb3koKSB7XG5cdFx0ZGVzdHJveV9jb21wb25lbnQodGhpcywgMSk7XG5cdFx0dGhpcy4kZGVzdHJveSA9IG5vb3A7XG5cdH1cblxuXHQvKipcblx0ICogQHRlbXBsYXRlIHtFeHRyYWN0PGtleW9mIEV2ZW50cywgc3RyaW5nPn0gS1xuXHQgKiBAcGFyYW0ge0t9IHR5cGVcblx0ICogQHBhcmFtIHsoKGU6IEV2ZW50c1tLXSkgPT4gdm9pZCkgfCBudWxsIHwgdW5kZWZpbmVkfSBjYWxsYmFja1xuXHQgKiBAcmV0dXJucyB7KCkgPT4gdm9pZH1cblx0ICovXG5cdCRvbih0eXBlLCBjYWxsYmFjaykge1xuXHRcdGlmICghaXNfZnVuY3Rpb24oY2FsbGJhY2spKSB7XG5cdFx0XHRyZXR1cm4gbm9vcDtcblx0XHR9XG5cdFx0Y29uc3QgY2FsbGJhY2tzID0gdGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pO1xuXHRcdGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0XHRpZiAoaW5kZXggIT09IC0xKSBjYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7UGFydGlhbDxQcm9wcz59IHByb3BzXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0JHNldChwcm9wcykge1xuXHRcdGlmICh0aGlzLiQkc2V0ICYmICFpc19lbXB0eShwcm9wcykpIHtcblx0XHRcdHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG5cdFx0XHR0aGlzLiQkc2V0KHByb3BzKTtcblx0XHRcdHRoaXMuJCQuc2tpcF9ib3VuZCA9IGZhbHNlO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEN1c3RvbUVsZW1lbnRQcm9wRGVmaW5pdGlvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IFthdHRyaWJ1dGVdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtyZWZsZWN0XVxuICogQHByb3BlcnR5IHsnU3RyaW5nJ3wnQm9vbGVhbid8J051bWJlcid8J0FycmF5J3wnT2JqZWN0J30gW3R5cGVdXG4gKi9cbiIsICIvLyBnZW5lcmF0ZWQgZHVyaW5nIHJlbGVhc2UsIGRvIG5vdCBtb2RpZnlcblxuLyoqXG4gKiBUaGUgY3VycmVudCB2ZXJzaW9uLCBhcyBzZXQgaW4gcGFja2FnZS5qc29uLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZS1jb21waWxlciNzdmVsdGUtdmVyc2lvblxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnNC4yLjEnO1xuZXhwb3J0IGNvbnN0IFBVQkxJQ19WRVJTSU9OID0gJzQnO1xuIiwgImltcG9ydCB7XG5cdGN1c3RvbV9ldmVudCxcblx0YXBwZW5kLFxuXHRhcHBlbmRfaHlkcmF0aW9uLFxuXHRpbnNlcnQsXG5cdGluc2VydF9oeWRyYXRpb24sXG5cdGRldGFjaCxcblx0bGlzdGVuLFxuXHRhdHRyXG59IGZyb20gJy4vZG9tLmpzJztcbmltcG9ydCB7IFN2ZWx0ZUNvbXBvbmVudCB9IGZyb20gJy4vQ29tcG9uZW50LmpzJztcbmltcG9ydCB7IGlzX3ZvaWQgfSBmcm9tICcuLi8uLi9zaGFyZWQvdXRpbHMvbmFtZXMuanMnO1xuaW1wb3J0IHsgVkVSU0lPTiB9IGZyb20gJy4uLy4uL3NoYXJlZC92ZXJzaW9uLmpzJztcbmltcG9ydCB7IGNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBlbnN1cmVfYXJyYXlfbGlrZSB9IGZyb20gJy4vZWFjaC5qcyc7XG5cbi8qKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge1R9IFtkZXRhaWxdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoX2Rldih0eXBlLCBkZXRhaWwpIHtcblx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQodHlwZSwgeyB2ZXJzaW9uOiBWRVJTSU9OLCAuLi5kZXRhaWwgfSwgeyBidWJibGVzOiB0cnVlIH0pKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZF9kZXYodGFyZ2V0LCBub2RlKSB7XG5cdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG5cdGFwcGVuZCh0YXJnZXQsIG5vZGUpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kX2h5ZHJhdGlvbl9kZXYodGFyZ2V0LCBub2RlKSB7XG5cdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUgfSk7XG5cdGFwcGVuZF9oeWRyYXRpb24odGFyZ2V0LCBub2RlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge05vZGV9IFthbmNob3JdXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc2VydF9kZXYodGFyZ2V0LCBub2RlLCBhbmNob3IpIHtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01JbnNlcnQnLCB7IHRhcmdldCwgbm9kZSwgYW5jaG9yIH0pO1xuXHRpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuXG4vKiogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtOb2RlfSBbYW5jaG9yXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRfaHlkcmF0aW9uX2Rldih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuXHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlLCBhbmNob3IgfSk7XG5cdGluc2VydF9oeWRyYXRpb24odGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRhY2hfZGV2KG5vZGUpIHtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmUnLCB7IG5vZGUgfSk7XG5cdGRldGFjaChub2RlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IGJlZm9yZVxuICogQHBhcmFtIHtOb2RlfSBhZnRlclxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRhY2hfYmV0d2Vlbl9kZXYoYmVmb3JlLCBhZnRlcikge1xuXHR3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nICYmIGJlZm9yZS5uZXh0U2libGluZyAhPT0gYWZ0ZXIpIHtcblx0XHRkZXRhY2hfZGV2KGJlZm9yZS5uZXh0U2libGluZyk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IGFmdGVyXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldGFjaF9iZWZvcmVfZGV2KGFmdGVyKSB7XG5cdHdoaWxlIChhZnRlci5wcmV2aW91c1NpYmxpbmcpIHtcblx0XHRkZXRhY2hfZGV2KGFmdGVyLnByZXZpb3VzU2libGluZyk7XG5cdH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IGJlZm9yZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXRhY2hfYWZ0ZXJfZGV2KGJlZm9yZSkge1xuXHR3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nKSB7XG5cdFx0ZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuXHR9XG59XG5cbi8qKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdH0gaGFuZGxlclxuICogQHBhcmFtIHtib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBFdmVudExpc3RlbmVyT3B0aW9uc30gW29wdGlvbnNdXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtoYXNfcHJldmVudF9kZWZhdWx0XVxuICogQHBhcmFtIHtib29sZWFufSBbaGFzX3N0b3BfcHJvcGFnYXRpb25dXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtoYXNfc3RvcF9pbW1lZGlhdGVfcHJvcGFnYXRpb25dXG4gKiBAcmV0dXJucyB7KCkgPT4gdm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3Rlbl9kZXYoXG5cdG5vZGUsXG5cdGV2ZW50LFxuXHRoYW5kbGVyLFxuXHRvcHRpb25zLFxuXHRoYXNfcHJldmVudF9kZWZhdWx0LFxuXHRoYXNfc3RvcF9wcm9wYWdhdGlvbixcblx0aGFzX3N0b3BfaW1tZWRpYXRlX3Byb3BhZ2F0aW9uXG4pIHtcblx0Y29uc3QgbW9kaWZpZXJzID1cblx0XHRvcHRpb25zID09PSB0cnVlID8gWydjYXB0dXJlJ10gOiBvcHRpb25zID8gQXJyYXkuZnJvbShPYmplY3Qua2V5cyhvcHRpb25zKSkgOiBbXTtcblx0aWYgKGhhc19wcmV2ZW50X2RlZmF1bHQpIG1vZGlmaWVycy5wdXNoKCdwcmV2ZW50RGVmYXVsdCcpO1xuXHRpZiAoaGFzX3N0b3BfcHJvcGFnYXRpb24pIG1vZGlmaWVycy5wdXNoKCdzdG9wUHJvcGFnYXRpb24nKTtcblx0aWYgKGhhc19zdG9wX2ltbWVkaWF0ZV9wcm9wYWdhdGlvbikgbW9kaWZpZXJzLnB1c2goJ3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbicpO1xuXHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUFkZEV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG5cdGNvbnN0IGRpc3Bvc2UgPSBsaXN0ZW4obm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGRpc3BhdGNoX2RldignU3ZlbHRlRE9NUmVtb3ZlRXZlbnRMaXN0ZW5lcicsIHsgbm9kZSwgZXZlbnQsIGhhbmRsZXIsIG1vZGlmaWVycyB9KTtcblx0XHRkaXNwb3NlKCk7XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gW3ZhbHVlXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdHRyX2Rldihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG5cdGF0dHIobm9kZSwgYXR0cmlidXRlLCB2YWx1ZSk7XG5cdGlmICh2YWx1ZSA9PSBudWxsKSBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlIH0pO1xuXHRlbHNlIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0QXR0cmlidXRlJywgeyBub2RlLCBhdHRyaWJ1dGUsIHZhbHVlIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5XG4gKiBAcGFyYW0ge2FueX0gW3ZhbHVlXVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcblx0bm9kZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRQcm9wZXJ0eScsIHsgbm9kZSwgcHJvcGVydHksIHZhbHVlIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICogQHBhcmFtIHthbnl9IFt2YWx1ZV1cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGF0YXNldF9kZXYobm9kZSwgcHJvcGVydHksIHZhbHVlKSB7XG5cdG5vZGUuZGF0YXNldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcblx0ZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXREYXRhc2V0JywgeyBub2RlLCBwcm9wZXJ0eSwgdmFsdWUgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGFcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2RhdGFfZGV2KHRleHQsIGRhdGEpIHtcblx0ZGF0YSA9ICcnICsgZGF0YTtcblx0aWYgKHRleHQuZGF0YSA9PT0gZGF0YSkgcmV0dXJuO1xuXHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG5cdHRleHQuZGF0YSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAoZGF0YSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGFcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0X2RhdGFfY29udGVudGVkaXRhYmxlX2Rldih0ZXh0LCBkYXRhKSB7XG5cdGRhdGEgPSAnJyArIGRhdGE7XG5cdGlmICh0ZXh0Lndob2xlVGV4dCA9PT0gZGF0YSkgcmV0dXJuO1xuXHRkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG5cdHRleHQuZGF0YSA9IC8qKiBAdHlwZSB7c3RyaW5nfSAqLyAoZGF0YSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHtUZXh0fSB0ZXh0XG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGFcbiAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyX3ZhbHVlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldF9kYXRhX21heWJlX2NvbnRlbnRlZGl0YWJsZV9kZXYodGV4dCwgZGF0YSwgYXR0cl92YWx1ZSkge1xuXHRpZiAofmNvbnRlbnRlZGl0YWJsZV90cnV0aHlfdmFsdWVzLmluZGV4T2YoYXR0cl92YWx1ZSkpIHtcblx0XHRzZXRfZGF0YV9jb250ZW50ZWRpdGFibGVfZGV2KHRleHQsIGRhdGEpO1xuXHR9IGVsc2Uge1xuXHRcdHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlX2FycmF5X2xpa2VfZGV2KGFyZykge1xuXHRpZiAoXG5cdFx0dHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgJiZcblx0XHQhKGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBhcmcpICYmXG5cdFx0ISh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIGFyZyAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gYXJnKVxuXHQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ3sjZWFjaH0gb25seSB3b3JrcyB3aXRoIGl0ZXJhYmxlIHZhbHVlcy4nKTtcblx0fVxuXHRyZXR1cm4gZW5zdXJlX2FycmF5X2xpa2UoYXJnKTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7dm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZV9zbG90cyhuYW1lLCBzbG90LCBrZXlzKSB7XG5cdGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcblx0XHRpZiAoIX5rZXlzLmluZGV4T2Yoc2xvdF9rZXkpKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYDwke25hbWV9PiByZWNlaXZlZCBhbiB1bmV4cGVjdGVkIHNsb3QgXCIke3Nsb3Rfa2V5fVwiLmApO1xuXHRcdH1cblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5rbm93bn0gdGFnXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlX2R5bmFtaWNfZWxlbWVudCh0YWcpIHtcblx0Y29uc3QgaXNfc3RyaW5nID0gdHlwZW9mIHRhZyA9PT0gJ3N0cmluZyc7XG5cdGlmICh0YWcgJiYgIWlzX3N0cmluZykge1xuXHRcdHRocm93IG5ldyBFcnJvcignPHN2ZWx0ZTplbGVtZW50PiBleHBlY3RzIFwidGhpc1wiIGF0dHJpYnV0ZSB0byBiZSBhIHN0cmluZy4nKTtcblx0fVxufVxuXG4vKipcbiAqIEBwYXJhbSB7dW5kZWZpbmVkIHwgc3RyaW5nfSB0YWdcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVfdm9pZF9keW5hbWljX2VsZW1lbnQodGFnKSB7XG5cdGlmICh0YWcgJiYgaXNfdm9pZCh0YWcpKSB7XG5cdFx0Y29uc29sZS53YXJuKGA8c3ZlbHRlOmVsZW1lbnQgdGhpcz1cIiR7dGFnfVwiPiBpcyBzZWxmLWNsb3NpbmcgYW5kIGNhbm5vdCBoYXZlIGNvbnRlbnQuYCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0cnVjdF9zdmVsdGVfY29tcG9uZW50X2Rldihjb21wb25lbnQsIHByb3BzKSB7XG5cdGNvbnN0IGVycm9yX21lc3NhZ2UgPSAndGhpcz17Li4ufSBvZiA8c3ZlbHRlOmNvbXBvbmVudD4gc2hvdWxkIHNwZWNpZnkgYSBTdmVsdGUgY29tcG9uZW50Lic7XG5cdHRyeSB7XG5cdFx0Y29uc3QgaW5zdGFuY2UgPSBuZXcgY29tcG9uZW50KHByb3BzKTtcblx0XHRpZiAoIWluc3RhbmNlLiQkIHx8ICFpbnN0YW5jZS4kc2V0IHx8ICFpbnN0YW5jZS4kb24gfHwgIWluc3RhbmNlLiRkZXN0cm95KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JfbWVzc2FnZSk7XG5cdFx0fVxuXHRcdHJldHVybiBpbnN0YW5jZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Y29uc3QgeyBtZXNzYWdlIH0gPSBlcnI7XG5cdFx0aWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyAmJiBtZXNzYWdlLmluZGV4T2YoJ2lzIG5vdCBhIGNvbnN0cnVjdG9yJykgIT09IC0xKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3JfbWVzc2FnZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IGVycjtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBTdmVsdGUgY29tcG9uZW50cyB3aXRoIHNvbWUgbWlub3IgZGV2LWVuaGFuY2VtZW50cy4gVXNlZCB3aGVuIGRldj10cnVlLlxuICpcbiAqIENhbiBiZSB1c2VkIHRvIGNyZWF0ZSBzdHJvbmdseSB0eXBlZCBTdmVsdGUgY29tcG9uZW50cy5cbiAqXG4gKiAjIyMjIEV4YW1wbGU6XG4gKlxuICogWW91IGhhdmUgY29tcG9uZW50IGxpYnJhcnkgb24gbnBtIGNhbGxlZCBgY29tcG9uZW50LWxpYnJhcnlgLCBmcm9tIHdoaWNoXG4gKiB5b3UgZXhwb3J0IGEgY29tcG9uZW50IGNhbGxlZCBgTXlDb21wb25lbnRgLiBGb3IgU3ZlbHRlK1R5cGVTY3JpcHQgdXNlcnMsXG4gKiB5b3Ugd2FudCB0byBwcm92aWRlIHR5cGluZ3MuIFRoZXJlZm9yZSB5b3UgY3JlYXRlIGEgYGluZGV4LmQudHNgOlxuICogYGBgdHNcbiAqIGltcG9ydCB7IFN2ZWx0ZUNvbXBvbmVudCB9IGZyb20gXCJzdmVsdGVcIjtcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudDx7Zm9vOiBzdHJpbmd9PiB7fVxuICogYGBgXG4gKiBUeXBpbmcgdGhpcyBtYWtlcyBpdCBwb3NzaWJsZSBmb3IgSURFcyBsaWtlIFZTIENvZGUgd2l0aCB0aGUgU3ZlbHRlIGV4dGVuc2lvblxuICogdG8gcHJvdmlkZSBpbnRlbGxpc2Vuc2UgYW5kIHRvIHVzZSB0aGUgY29tcG9uZW50IGxpa2UgdGhpcyBpbiBhIFN2ZWx0ZSBmaWxlXG4gKiB3aXRoIFR5cGVTY3JpcHQ6XG4gKiBgYGBzdmVsdGVcbiAqIDxzY3JpcHQgbGFuZz1cInRzXCI+XG4gKiBcdGltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcImNvbXBvbmVudC1saWJyYXJ5XCI7XG4gKiA8L3NjcmlwdD5cbiAqIDxNeUNvbXBvbmVudCBmb289eydiYXInfSAvPlxuICogYGBgXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIGFueT59IFtQcm9wcz1hbnldXG4gKiBAdGVtcGxhdGUge1JlY29yZDxzdHJpbmcsIGFueT59IFtFdmVudHM9YW55XVxuICogQHRlbXBsYXRlIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbU2xvdHM9YW55XVxuICogQGV4dGVuZHMge1N2ZWx0ZUNvbXBvbmVudDxQcm9wcywgRXZlbnRzPn1cbiAqL1xuZXhwb3J0IGNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG5cdC8qKlxuXHQgKiBGb3IgdHlwZSBjaGVja2luZyBjYXBhYmlsaXRpZXMgb25seS5cblx0ICogRG9lcyBub3QgZXhpc3QgYXQgcnVudGltZS5cblx0ICogIyMjIERPIE5PVCBVU0UhXG5cdCAqXG5cdCAqIEB0eXBlIHtQcm9wc31cblx0ICovXG5cdCQkcHJvcF9kZWY7XG5cdC8qKlxuXHQgKiBGb3IgdHlwZSBjaGVja2luZyBjYXBhYmlsaXRpZXMgb25seS5cblx0ICogRG9lcyBub3QgZXhpc3QgYXQgcnVudGltZS5cblx0ICogIyMjIERPIE5PVCBVU0UhXG5cdCAqXG5cdCAqIEB0eXBlIHtFdmVudHN9XG5cdCAqL1xuXHQkJGV2ZW50c19kZWY7XG5cdC8qKlxuXHQgKiBGb3IgdHlwZSBjaGVja2luZyBjYXBhYmlsaXRpZXMgb25seS5cblx0ICogRG9lcyBub3QgZXhpc3QgYXQgcnVudGltZS5cblx0ICogIyMjIERPIE5PVCBVU0UhXG5cdCAqXG5cdCAqIEB0eXBlIHtTbG90c31cblx0ICovXG5cdCQkc2xvdF9kZWY7XG5cblx0LyoqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLkNvbXBvbmVudENvbnN0cnVjdG9yT3B0aW9uczxQcm9wcz59IG9wdGlvbnMgKi9cblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdGlmICghb3B0aW9ucyB8fCAoIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLiQkaW5saW5lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiJ3RhcmdldCcgaXMgYSByZXF1aXJlZCBvcHRpb25cIik7XG5cdFx0fVxuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHQvKiogQHJldHVybnMge3ZvaWR9ICovXG5cdCRkZXN0cm95KCkge1xuXHRcdHN1cGVyLiRkZXN0cm95KCk7XG5cdFx0dGhpcy4kZGVzdHJveSA9ICgpID0+IHtcblx0XHRcdGNvbnNvbGUud2FybignQ29tcG9uZW50IHdhcyBhbHJlYWR5IGRlc3Ryb3llZCcpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcblx0XHR9O1xuXHR9XG5cblx0LyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHQkY2FwdHVyZV9zdGF0ZSgpIHt9XG5cblx0LyoqIEByZXR1cm5zIHt2b2lkfSAqL1xuXHQkaW5qZWN0X3N0YXRlKCkge31cbn1cbi8qKlxuICogQHRlbXBsYXRlIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbUHJvcHM9YW55XVxuICogQHRlbXBsYXRlIHtSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbRXZlbnRzPWFueV1cbiAqIEB0ZW1wbGF0ZSB7UmVjb3JkPHN0cmluZywgYW55Pn0gW1Nsb3RzPWFueV1cbiAqIEBkZXByZWNhdGVkIFVzZSBgU3ZlbHRlQ29tcG9uZW50YCBpbnN0ZWFkLiBTZWUgUFIgZm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9zdmVsdGVqcy9zdmVsdGUvcHVsbC84NTEyXG4gKiBAZXh0ZW5kcyB7U3ZlbHRlQ29tcG9uZW50RGV2PFByb3BzLCBFdmVudHMsIFNsb3RzPn1cbiAqL1xuZXhwb3J0IGNsYXNzIFN2ZWx0ZUNvbXBvbmVudFR5cGVkIGV4dGVuZHMgU3ZlbHRlQ29tcG9uZW50RGV2IHt9XG5cbi8qKiBAcmV0dXJucyB7KCkgPT4gdm9pZH0gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb29wX2d1YXJkKHRpbWVvdXQpIHtcblx0Y29uc3Qgc3RhcnQgPSBEYXRlLm5vdygpO1xuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGlmIChEYXRlLm5vdygpIC0gc3RhcnQgPiB0aW1lb3V0KSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3AgZGV0ZWN0ZWQnKTtcblx0XHR9XG5cdH07XG59XG4iLCAiaW1wb3J0IHsgUFVCTElDX1ZFUlNJT04gfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvdmVyc2lvbi5qcyc7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJylcblx0Ly8gQHRzLWlnbm9yZVxuXHQod2luZG93Ll9fc3ZlbHRlIHx8ICh3aW5kb3cuX19zdmVsdGUgPSB7IHY6IG5ldyBTZXQoKSB9KSkudi5hZGQoUFVCTElDX1ZFUlNJT04pO1xuIiwgImltcG9ydCB7IGN1YmljT3V0LCBjdWJpY0luT3V0LCBsaW5lYXIgfSBmcm9tICcuLi9lYXNpbmcvaW5kZXguanMnO1xuaW1wb3J0IHsgYXNzaWduLCBzcGxpdF9jc3NfdW5pdCwgaXNfZnVuY3Rpb24gfSBmcm9tICcuLi9pbnRlcm5hbC9pbmRleC5qcyc7XG5cbi8qKlxuICogQW5pbWF0ZXMgYSBgYmx1cmAgZmlsdGVyIGFsb25nc2lkZSBhbiBlbGVtZW50J3Mgb3BhY2l0eS5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtdHJhbnNpdGlvbiNibHVyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYycpLkJsdXJQYXJhbXN9IFtwYXJhbXNdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBibHVyKFxuXHRub2RlLFxuXHR7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljSW5PdXQsIGFtb3VudCA9IDUsIG9wYWNpdHkgPSAwIH0gPSB7fVxuKSB7XG5cdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0Y29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcblx0Y29uc3QgZiA9IHN0eWxlLmZpbHRlciA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS5maWx0ZXI7XG5cdGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuXHRjb25zdCBbdmFsdWUsIHVuaXRdID0gc3BsaXRfY3NzX3VuaXQoYW1vdW50KTtcblx0cmV0dXJuIHtcblx0XHRkZWxheSxcblx0XHRkdXJhdGlvbixcblx0XHRlYXNpbmcsXG5cdFx0Y3NzOiAoX3QsIHUpID0+IGBvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gb2QgKiB1fTsgZmlsdGVyOiAke2Z9IGJsdXIoJHt1ICogdmFsdWV9JHt1bml0fSk7YFxuXHR9O1xufVxuXG4vKipcbiAqIEFuaW1hdGVzIHRoZSBvcGFjaXR5IG9mIGFuIGVsZW1lbnQgZnJvbSAwIHRvIHRoZSBjdXJyZW50IG9wYWNpdHkgZm9yIGBpbmAgdHJhbnNpdGlvbnMgYW5kIGZyb20gdGhlIGN1cnJlbnQgb3BhY2l0eSB0byAwIGZvciBgb3V0YCB0cmFuc2l0aW9ucy5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtdHJhbnNpdGlvbiNmYWRlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYycpLkZhZGVQYXJhbXN9IFtwYXJhbXNdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmYWRlKG5vZGUsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDQwMCwgZWFzaW5nID0gbGluZWFyIH0gPSB7fSkge1xuXHRjb25zdCBvID0gK2dldENvbXB1dGVkU3R5bGUobm9kZSkub3BhY2l0eTtcblx0cmV0dXJuIHtcblx0XHRkZWxheSxcblx0XHRkdXJhdGlvbixcblx0XHRlYXNpbmcsXG5cdFx0Y3NzOiAodCkgPT4gYG9wYWNpdHk6ICR7dCAqIG99YFxuXHR9O1xufVxuXG4vKipcbiAqIEFuaW1hdGVzIHRoZSB4IGFuZCB5IHBvc2l0aW9ucyBhbmQgdGhlIG9wYWNpdHkgb2YgYW4gZWxlbWVudC4gYGluYCB0cmFuc2l0aW9ucyBhbmltYXRlIGZyb20gdGhlIHByb3ZpZGVkIHZhbHVlcywgcGFzc2VkIGFzIHBhcmFtZXRlcnMgdG8gdGhlIGVsZW1lbnQncyBkZWZhdWx0IHZhbHVlcy4gYG91dGAgdHJhbnNpdGlvbnMgYW5pbWF0ZSBmcm9tIHRoZSBlbGVtZW50J3MgZGVmYXVsdCB2YWx1ZXMgdG8gdGhlIHByb3ZpZGVkIHZhbHVlcy5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtdHJhbnNpdGlvbiNmbHlcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljJykuRmx5UGFyYW1zfSBbcGFyYW1zXVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmx5KFxuXHRub2RlLFxuXHR7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCB4ID0gMCwgeSA9IDAsIG9wYWNpdHkgPSAwIH0gPSB7fVxuKSB7XG5cdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0Y29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcblx0Y29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcblx0Y29uc3Qgb2QgPSB0YXJnZXRfb3BhY2l0eSAqICgxIC0gb3BhY2l0eSk7XG5cdGNvbnN0IFt4VmFsdWUsIHhVbml0XSA9IHNwbGl0X2Nzc191bml0KHgpO1xuXHRjb25zdCBbeVZhbHVlLCB5VW5pdF0gPSBzcGxpdF9jc3NfdW5pdCh5KTtcblx0cmV0dXJuIHtcblx0XHRkZWxheSxcblx0XHRkdXJhdGlvbixcblx0XHRlYXNpbmcsXG5cdFx0Y3NzOiAodCwgdSkgPT4gYFxuXHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gdHJhbnNsYXRlKCR7KDEgLSB0KSAqIHhWYWx1ZX0ke3hVbml0fSwgJHsoMSAtIHQpICogeVZhbHVlfSR7eVVuaXR9KTtcblx0XHRcdG9wYWNpdHk6ICR7dGFyZ2V0X29wYWNpdHkgLSBvZCAqIHV9YFxuXHR9O1xufVxuXG4vKipcbiAqIFNsaWRlcyBhbiBlbGVtZW50IGluIGFuZCBvdXQuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXRyYW5zaXRpb24jc2xpZGVcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljJykuU2xpZGVQYXJhbXN9IFtwYXJhbXNdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzbGlkZShub2RlLCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCBheGlzID0gJ3knIH0gPSB7fSkge1xuXHRjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG5cdGNvbnN0IG9wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcblx0Y29uc3QgcHJpbWFyeV9wcm9wZXJ0eSA9IGF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblx0Y29uc3QgcHJpbWFyeV9wcm9wZXJ0eV92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbcHJpbWFyeV9wcm9wZXJ0eV0pO1xuXHRjb25zdCBzZWNvbmRhcnlfcHJvcGVydGllcyA9IGF4aXMgPT09ICd5JyA/IFsndG9wJywgJ2JvdHRvbSddIDogWydsZWZ0JywgJ3JpZ2h0J107XG5cdGNvbnN0IGNhcGl0YWxpemVkX3NlY29uZGFyeV9wcm9wZXJ0aWVzID0gc2Vjb25kYXJ5X3Byb3BlcnRpZXMubWFwKFxuXHRcdChlKSA9PiBgJHtlWzBdLnRvVXBwZXJDYXNlKCl9JHtlLnNsaWNlKDEpfWBcblx0KTtcblx0Y29uc3QgcGFkZGluZ19zdGFydF92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbYHBhZGRpbmcke2NhcGl0YWxpemVkX3NlY29uZGFyeV9wcm9wZXJ0aWVzWzBdfWBdKTtcblx0Y29uc3QgcGFkZGluZ19lbmRfdmFsdWUgPSBwYXJzZUZsb2F0KHN0eWxlW2BwYWRkaW5nJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1sxXX1gXSk7XG5cdGNvbnN0IG1hcmdpbl9zdGFydF92YWx1ZSA9IHBhcnNlRmxvYXQoc3R5bGVbYG1hcmdpbiR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMF19YF0pO1xuXHRjb25zdCBtYXJnaW5fZW5kX3ZhbHVlID0gcGFyc2VGbG9hdChzdHlsZVtgbWFyZ2luJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1sxXX1gXSk7XG5cdGNvbnN0IGJvcmRlcl93aWR0aF9zdGFydF92YWx1ZSA9IHBhcnNlRmxvYXQoXG5cdFx0c3R5bGVbYGJvcmRlciR7Y2FwaXRhbGl6ZWRfc2Vjb25kYXJ5X3Byb3BlcnRpZXNbMF19V2lkdGhgXVxuXHQpO1xuXHRjb25zdCBib3JkZXJfd2lkdGhfZW5kX3ZhbHVlID0gcGFyc2VGbG9hdChcblx0XHRzdHlsZVtgYm9yZGVyJHtjYXBpdGFsaXplZF9zZWNvbmRhcnlfcHJvcGVydGllc1sxXX1XaWR0aGBdXG5cdCk7XG5cdHJldHVybiB7XG5cdFx0ZGVsYXksXG5cdFx0ZHVyYXRpb24sXG5cdFx0ZWFzaW5nLFxuXHRcdGNzczogKHQpID0+XG5cdFx0XHQnb3ZlcmZsb3c6IGhpZGRlbjsnICtcblx0XHRcdGBvcGFjaXR5OiAke01hdGgubWluKHQgKiAyMCwgMSkgKiBvcGFjaXR5fTtgICtcblx0XHRcdGAke3ByaW1hcnlfcHJvcGVydHl9OiAke3QgKiBwcmltYXJ5X3Byb3BlcnR5X3ZhbHVlfXB4O2AgK1xuXHRcdFx0YHBhZGRpbmctJHtzZWNvbmRhcnlfcHJvcGVydGllc1swXX06ICR7dCAqIHBhZGRpbmdfc3RhcnRfdmFsdWV9cHg7YCArXG5cdFx0XHRgcGFkZGluZy0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzFdfTogJHt0ICogcGFkZGluZ19lbmRfdmFsdWV9cHg7YCArXG5cdFx0XHRgbWFyZ2luLSR7c2Vjb25kYXJ5X3Byb3BlcnRpZXNbMF19OiAke3QgKiBtYXJnaW5fc3RhcnRfdmFsdWV9cHg7YCArXG5cdFx0XHRgbWFyZ2luLSR7c2Vjb25kYXJ5X3Byb3BlcnRpZXNbMV19OiAke3QgKiBtYXJnaW5fZW5kX3ZhbHVlfXB4O2AgK1xuXHRcdFx0YGJvcmRlci0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzBdfS13aWR0aDogJHt0ICogYm9yZGVyX3dpZHRoX3N0YXJ0X3ZhbHVlfXB4O2AgK1xuXHRcdFx0YGJvcmRlci0ke3NlY29uZGFyeV9wcm9wZXJ0aWVzWzFdfS13aWR0aDogJHt0ICogYm9yZGVyX3dpZHRoX2VuZF92YWx1ZX1weDtgXG5cdH07XG59XG5cbi8qKlxuICogQW5pbWF0ZXMgdGhlIG9wYWNpdHkgYW5kIHNjYWxlIG9mIGFuIGVsZW1lbnQuIGBpbmAgdHJhbnNpdGlvbnMgYW5pbWF0ZSBmcm9tIGFuIGVsZW1lbnQncyBjdXJyZW50IChkZWZhdWx0KSB2YWx1ZXMgdG8gdGhlIHByb3ZpZGVkIHZhbHVlcywgcGFzc2VkIGFzIHBhcmFtZXRlcnMuIGBvdXRgIHRyYW5zaXRpb25zIGFuaW1hdGUgZnJvbSB0aGUgcHJvdmlkZWQgdmFsdWVzIHRvIGFuIGVsZW1lbnQncyBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtdHJhbnNpdGlvbiNzY2FsZVxuICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMnKS5TY2FsZVBhcmFtc30gW3BhcmFtc11cbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljJykuVHJhbnNpdGlvbkNvbmZpZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKFxuXHRub2RlLFxuXHR7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSA0MDAsIGVhc2luZyA9IGN1YmljT3V0LCBzdGFydCA9IDAsIG9wYWNpdHkgPSAwIH0gPSB7fVxuKSB7XG5cdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0Y29uc3QgdGFyZ2V0X29wYWNpdHkgPSArc3R5bGUub3BhY2l0eTtcblx0Y29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcblx0Y29uc3Qgc2QgPSAxIC0gc3RhcnQ7XG5cdGNvbnN0IG9kID0gdGFyZ2V0X29wYWNpdHkgKiAoMSAtIG9wYWNpdHkpO1xuXHRyZXR1cm4ge1xuXHRcdGRlbGF5LFxuXHRcdGR1cmF0aW9uLFxuXHRcdGVhc2luZyxcblx0XHRjc3M6IChfdCwgdSkgPT4gYFxuXHRcdFx0dHJhbnNmb3JtOiAke3RyYW5zZm9ybX0gc2NhbGUoJHsxIC0gc2QgKiB1fSk7XG5cdFx0XHRvcGFjaXR5OiAke3RhcmdldF9vcGFjaXR5IC0gb2QgKiB1fVxuXHRcdGBcblx0fTtcbn1cblxuLyoqXG4gKiBBbmltYXRlcyB0aGUgc3Ryb2tlIG9mIGFuIFNWRyBlbGVtZW50LCBsaWtlIGEgc25ha2UgaW4gYSB0dWJlLiBgaW5gIHRyYW5zaXRpb25zIGJlZ2luIHdpdGggdGhlIHBhdGggaW52aXNpYmxlIGFuZCBkcmF3IHRoZSBwYXRoIHRvIHRoZSBzY3JlZW4gb3ZlciB0aW1lLiBgb3V0YCB0cmFuc2l0aW9ucyBzdGFydCBpbiBhIHZpc2libGUgc3RhdGUgYW5kIGdyYWR1YWxseSBlcmFzZSB0aGUgcGF0aC4gYGRyYXdgIG9ubHkgd29ya3Mgd2l0aCBlbGVtZW50cyB0aGF0IGhhdmUgYSBgZ2V0VG90YWxMZW5ndGhgIG1ldGhvZCwgbGlrZSBgPHBhdGg+YCBhbmQgYDxwb2x5bGluZT5gLlxuICpcbiAqIGh0dHBzOi8vc3ZlbHRlLmRldi9kb2NzL3N2ZWx0ZS10cmFuc2l0aW9uI2RyYXdcbiAqIEBwYXJhbSB7U1ZHRWxlbWVudCAmIHsgZ2V0VG90YWxMZW5ndGgoKTogbnVtYmVyIH19IG5vZGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYycpLkRyYXdQYXJhbXN9IFtwYXJhbXNdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KG5vZGUsIHsgZGVsYXkgPSAwLCBzcGVlZCwgZHVyYXRpb24sIGVhc2luZyA9IGN1YmljSW5PdXQgfSA9IHt9KSB7XG5cdGxldCBsZW4gPSBub2RlLmdldFRvdGFsTGVuZ3RoKCk7XG5cdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcblx0aWYgKHN0eWxlLnN0cm9rZUxpbmVjYXAgIT09ICdidXR0Jykge1xuXHRcdGxlbiArPSBwYXJzZUludChzdHlsZS5zdHJva2VXaWR0aCk7XG5cdH1cblx0aWYgKGR1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoc3BlZWQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0ZHVyYXRpb24gPSA4MDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGR1cmF0aW9uID0gbGVuIC8gc3BlZWQ7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGR1cmF0aW9uID0gZHVyYXRpb24obGVuKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGRlbGF5LFxuXHRcdGR1cmF0aW9uLFxuXHRcdGVhc2luZyxcblx0XHRjc3M6IChfLCB1KSA9PiBgXG5cdFx0XHRzdHJva2UtZGFzaGFycmF5OiAke2xlbn07XG5cdFx0XHRzdHJva2UtZGFzaG9mZnNldDogJHt1ICogbGVufTtcblx0XHRgXG5cdH07XG59XG5cbi8qKlxuICogVGhlIGBjcm9zc2ZhZGVgIGZ1bmN0aW9uIGNyZWF0ZXMgYSBwYWlyIG9mIFt0cmFuc2l0aW9uc10oL2RvY3MjdGVtcGxhdGUtc3ludGF4LWVsZW1lbnQtZGlyZWN0aXZlcy10cmFuc2l0aW9uLWZuKSBjYWxsZWQgYHNlbmRgIGFuZCBgcmVjZWl2ZWAuIFdoZW4gYW4gZWxlbWVudCBpcyAnc2VudCcsIGl0IGxvb2tzIGZvciBhIGNvcnJlc3BvbmRpbmcgZWxlbWVudCBiZWluZyAncmVjZWl2ZWQnLCBhbmQgZ2VuZXJhdGVzIGEgdHJhbnNpdGlvbiB0aGF0IHRyYW5zZm9ybXMgdGhlIGVsZW1lbnQgdG8gaXRzIGNvdW50ZXJwYXJ0J3MgcG9zaXRpb24gYW5kIGZhZGVzIGl0IG91dC4gV2hlbiBhbiBlbGVtZW50IGlzICdyZWNlaXZlZCcsIHRoZSByZXZlcnNlIGhhcHBlbnMuIElmIHRoZXJlIGlzIG5vIGNvdW50ZXJwYXJ0LCB0aGUgYGZhbGxiYWNrYCB0cmFuc2l0aW9uIGlzIHVzZWQuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXRyYW5zaXRpb24jY3Jvc3NmYWRlXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMnKS5Dcm9zc2ZhZGVQYXJhbXMgJiB7XG4gKiBcdGZhbGxiYWNrPzogKG5vZGU6IEVsZW1lbnQsIHBhcmFtczogaW1wb3J0KCcuL3B1YmxpYycpLkNyb3NzZmFkZVBhcmFtcywgaW50cm86IGJvb2xlYW4pID0+IGltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnO1xuICogfX0gcGFyYW1zXG4gKiBAcmV0dXJucyB7Wyhub2RlOiBhbnksIHBhcmFtczogaW1wb3J0KCcuL3B1YmxpYycpLkNyb3NzZmFkZVBhcmFtcyAmIHsga2V5OiBhbnk7IH0pID0+ICgpID0+IGltcG9ydCgnLi9wdWJsaWMnKS5UcmFuc2l0aW9uQ29uZmlnLCAobm9kZTogYW55LCBwYXJhbXM6IGltcG9ydCgnLi9wdWJsaWMnKS5Dcm9zc2ZhZGVQYXJhbXMgJiB7IGtleTogYW55OyB9KSA9PiAoKSA9PiBpbXBvcnQoJy4vcHVibGljJykuVHJhbnNpdGlvbkNvbmZpZ119XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc2ZhZGUoeyBmYWxsYmFjaywgLi4uZGVmYXVsdHMgfSkge1xuXHQvKiogQHR5cGUge01hcDxhbnksIEVsZW1lbnQ+fSAqL1xuXHRjb25zdCB0b19yZWNlaXZlID0gbmV3IE1hcCgpO1xuXHQvKiogQHR5cGUge01hcDxhbnksIEVsZW1lbnQ+fSAqL1xuXHRjb25zdCB0b19zZW5kID0gbmV3IE1hcCgpO1xuXHQvKipcblx0ICogQHBhcmFtIHtFbGVtZW50fSBmcm9tX25vZGVcblx0ICogQHBhcmFtIHtFbGVtZW50fSBub2RlXG5cdCAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYycpLkNyb3NzZmFkZVBhcmFtc30gcGFyYW1zXG5cdCAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljJykuVHJhbnNpdGlvbkNvbmZpZ31cblx0ICovXG5cdGZ1bmN0aW9uIGNyb3NzZmFkZShmcm9tX25vZGUsIG5vZGUsIHBhcmFtcykge1xuXHRcdGNvbnN0IHtcblx0XHRcdGRlbGF5ID0gMCxcblx0XHRcdGR1cmF0aW9uID0gKGQpID0+IE1hdGguc3FydChkKSAqIDMwLFxuXHRcdFx0ZWFzaW5nID0gY3ViaWNPdXRcblx0XHR9ID0gYXNzaWduKGFzc2lnbih7fSwgZGVmYXVsdHMpLCBwYXJhbXMpO1xuXHRcdGNvbnN0IGZyb20gPSBmcm9tX25vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0Y29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGNvbnN0IGR4ID0gZnJvbS5sZWZ0IC0gdG8ubGVmdDtcblx0XHRjb25zdCBkeSA9IGZyb20udG9wIC0gdG8udG9wO1xuXHRcdGNvbnN0IGR3ID0gZnJvbS53aWR0aCAvIHRvLndpZHRoO1xuXHRcdGNvbnN0IGRoID0gZnJvbS5oZWlnaHQgLyB0by5oZWlnaHQ7XG5cdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cdFx0Y29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuXHRcdGNvbnN0IHRyYW5zZm9ybSA9IHN0eWxlLnRyYW5zZm9ybSA9PT0gJ25vbmUnID8gJycgOiBzdHlsZS50cmFuc2Zvcm07XG5cdFx0Y29uc3Qgb3BhY2l0eSA9ICtzdHlsZS5vcGFjaXR5O1xuXHRcdHJldHVybiB7XG5cdFx0XHRkZWxheSxcblx0XHRcdGR1cmF0aW9uOiBpc19mdW5jdGlvbihkdXJhdGlvbikgPyBkdXJhdGlvbihkKSA6IGR1cmF0aW9uLFxuXHRcdFx0ZWFzaW5nLFxuXHRcdFx0Y3NzOiAodCwgdSkgPT4gYFxuXHRcdFx0XHRvcGFjaXR5OiAke3QgKiBvcGFjaXR5fTtcblx0XHRcdFx0dHJhbnNmb3JtLW9yaWdpbjogdG9wIGxlZnQ7XG5cdFx0XHRcdHRyYW5zZm9ybTogJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke3UgKiBkeH1weCwke3UgKiBkeX1weCkgc2NhbGUoJHt0ICsgKDEgLSB0KSAqIGR3fSwgJHtcblx0XHRcdFx0dCArICgxIC0gdCkgKiBkaFxuXHRcdFx0fSk7XG5cdFx0XHRgXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge01hcDxhbnksIEVsZW1lbnQ+fSBpdGVtc1xuXHQgKiBAcGFyYW0ge01hcDxhbnksIEVsZW1lbnQ+fSBjb3VudGVycGFydHNcblx0ICogQHBhcmFtIHtib29sZWFufSBpbnRyb1xuXHQgKiBAcmV0dXJucyB7KG5vZGU6IGFueSwgcGFyYW1zOiBpbXBvcnQoJy4vcHVibGljJykuQ3Jvc3NmYWRlUGFyYW1zICYgeyBrZXk6IGFueTsgfSkgPT4gKCkgPT4gaW1wb3J0KCcuL3B1YmxpYycpLlRyYW5zaXRpb25Db25maWd9XG5cdCAqL1xuXHRmdW5jdGlvbiB0cmFuc2l0aW9uKGl0ZW1zLCBjb3VudGVycGFydHMsIGludHJvKSB7XG5cdFx0cmV0dXJuIChub2RlLCBwYXJhbXMpID0+IHtcblx0XHRcdGl0ZW1zLnNldChwYXJhbXMua2V5LCBub2RlKTtcblx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdGlmIChjb3VudGVycGFydHMuaGFzKHBhcmFtcy5rZXkpKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb3RoZXJfbm9kZSA9IGNvdW50ZXJwYXJ0cy5nZXQocGFyYW1zLmtleSk7XG5cdFx0XHRcdFx0Y291bnRlcnBhcnRzLmRlbGV0ZShwYXJhbXMua2V5KTtcblx0XHRcdFx0XHRyZXR1cm4gY3Jvc3NmYWRlKG90aGVyX25vZGUsIG5vZGUsIHBhcmFtcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gaWYgdGhlIG5vZGUgaXMgZGlzYXBwZWFyaW5nIGFsdG9nZXRoZXJcblx0XHRcdFx0Ly8gKGkuZS4gd2Fzbid0IGNsYWltZWQgYnkgdGhlIG90aGVyIGxpc3QpXG5cdFx0XHRcdC8vIHRoZW4gd2UgbmVlZCB0byBzdXBwbHkgYW4gb3V0cm9cblx0XHRcdFx0aXRlbXMuZGVsZXRlKHBhcmFtcy5rZXkpO1xuXHRcdFx0XHRyZXR1cm4gZmFsbGJhY2sgJiYgZmFsbGJhY2sobm9kZSwgcGFyYW1zLCBpbnRybyk7XG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cblx0cmV0dXJuIFt0cmFuc2l0aW9uKHRvX3NlbmQsIHRvX3JlY2VpdmUsIGZhbHNlKSwgdHJhbnNpdGlvbih0b19yZWNlaXZlLCB0b19zZW5kLCB0cnVlKV07XG59XG4iLCAiaW1wb3J0IHtcblx0cnVuX2FsbCxcblx0c3Vic2NyaWJlLFxuXHRub29wLFxuXHRzYWZlX25vdF9lcXVhbCxcblx0aXNfZnVuY3Rpb24sXG5cdGdldF9zdG9yZV92YWx1ZVxufSBmcm9tICcuLi9pbnRlcm5hbC9pbmRleC5qcyc7XG5cbmNvbnN0IHN1YnNjcmliZXJfcXVldWUgPSBbXTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYFJlYWRhYmxlYCBzdG9yZSB0aGF0IGFsbG93cyByZWFkaW5nIGJ5IHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtc3RvcmUjcmVhZGFibGVcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge1R9IFt2YWx1ZV0gaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljLmpzJykuU3RhcnRTdG9wTm90aWZpZXI8VD59IFtzdGFydF1cbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljLmpzJykuUmVhZGFibGU8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkYWJsZSh2YWx1ZSwgc3RhcnQpIHtcblx0cmV0dXJuIHtcblx0XHRzdWJzY3JpYmU6IHdyaXRhYmxlKHZhbHVlLCBzdGFydCkuc3Vic2NyaWJlXG5cdH07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYFdyaXRhYmxlYCBzdG9yZSB0aGF0IGFsbG93cyBib3RoIHVwZGF0aW5nIGFuZCByZWFkaW5nIGJ5IHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtc3RvcmUjd3JpdGFibGVcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge1R9IFt2YWx1ZV0gaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljLmpzJykuU3RhcnRTdG9wTm90aWZpZXI8VD59IFtzdGFydF1cbiAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljLmpzJykuV3JpdGFibGU8VD59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3cml0YWJsZSh2YWx1ZSwgc3RhcnQgPSBub29wKSB7XG5cdC8qKiBAdHlwZSB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlVuc3Vic2NyaWJlcn0gKi9cblx0bGV0IHN0b3A7XG5cdC8qKiBAdHlwZSB7U2V0PGltcG9ydCgnLi9wcml2YXRlLmpzJykuU3Vic2NyaWJlSW52YWxpZGF0ZVR1cGxlPFQ+Pn0gKi9cblx0Y29uc3Qgc3Vic2NyaWJlcnMgPSBuZXcgU2V0KCk7XG5cdC8qKiBAcGFyYW0ge1R9IG5ld192YWx1ZVxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldChuZXdfdmFsdWUpIHtcblx0XHRpZiAoc2FmZV9ub3RfZXF1YWwodmFsdWUsIG5ld192YWx1ZSkpIHtcblx0XHRcdHZhbHVlID0gbmV3X3ZhbHVlO1xuXHRcdFx0aWYgKHN0b3ApIHtcblx0XHRcdFx0Ly8gc3RvcmUgaXMgcmVhZHlcblx0XHRcdFx0Y29uc3QgcnVuX3F1ZXVlID0gIXN1YnNjcmliZXJfcXVldWUubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHN1YnNjcmliZXIgb2Ygc3Vic2NyaWJlcnMpIHtcblx0XHRcdFx0XHRzdWJzY3JpYmVyWzFdKCk7XG5cdFx0XHRcdFx0c3Vic2NyaWJlcl9xdWV1ZS5wdXNoKHN1YnNjcmliZXIsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocnVuX3F1ZXVlKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDsgaSArPSAyKSB7XG5cdFx0XHRcdFx0XHRzdWJzY3JpYmVyX3F1ZXVlW2ldWzBdKHN1YnNjcmliZXJfcXVldWVbaSArIDFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3Vic2NyaWJlcl9xdWV1ZS5sZW5ndGggPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlVwZGF0ZXI8VD59IGZuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG5cdFx0c2V0KGZuKHZhbHVlKSk7XG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtpbXBvcnQoJy4vcHVibGljLmpzJykuU3Vic2NyaWJlcjxUPn0gcnVuXG5cdCAqIEBwYXJhbSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5JbnZhbGlkYXRvcjxUPn0gW2ludmFsaWRhdGVdXG5cdCAqIEByZXR1cm5zIHtpbXBvcnQoJy4vcHVibGljLmpzJykuVW5zdWJzY3JpYmVyfVxuXHQgKi9cblx0ZnVuY3Rpb24gc3Vic2NyaWJlKHJ1biwgaW52YWxpZGF0ZSA9IG5vb3ApIHtcblx0XHQvKiogQHR5cGUge2ltcG9ydCgnLi9wcml2YXRlLmpzJykuU3Vic2NyaWJlSW52YWxpZGF0ZVR1cGxlPFQ+fSAqL1xuXHRcdGNvbnN0IHN1YnNjcmliZXIgPSBbcnVuLCBpbnZhbGlkYXRlXTtcblx0XHRzdWJzY3JpYmVycy5hZGQoc3Vic2NyaWJlcik7XG5cdFx0aWYgKHN1YnNjcmliZXJzLnNpemUgPT09IDEpIHtcblx0XHRcdHN0b3AgPSBzdGFydChzZXQsIHVwZGF0ZSkgfHwgbm9vcDtcblx0XHR9XG5cdFx0cnVuKHZhbHVlKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0c3Vic2NyaWJlcnMuZGVsZXRlKHN1YnNjcmliZXIpO1xuXHRcdFx0aWYgKHN1YnNjcmliZXJzLnNpemUgPT09IDAgJiYgc3RvcCkge1xuXHRcdFx0XHRzdG9wKCk7XG5cdFx0XHRcdHN0b3AgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHsgc2V0LCB1cGRhdGUsIHN1YnNjcmliZSB9O1xufVxuXG4vKipcbiAqIERlcml2ZWQgdmFsdWUgc3RvcmUgYnkgc3luY2hyb25pemluZyBvbmUgb3IgbW9yZSByZWFkYWJsZSBzdG9yZXMgYW5kXG4gKiBhcHBseWluZyBhbiBhZ2dyZWdhdGlvbiBmdW5jdGlvbiBvdmVyIGl0cyBpbnB1dCB2YWx1ZXMuXG4gKlxuICogaHR0cHM6Ly9zdmVsdGUuZGV2L2RvY3Mvc3ZlbHRlLXN0b3JlI2Rlcml2ZWRcbiAqIEB0ZW1wbGF0ZSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5TdG9yZXN9IFNcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAb3ZlcmxvYWRcbiAqIEBwYXJhbSB7U30gc3RvcmVzIC0gaW5wdXQgc3RvcmVzXG4gKiBAcGFyYW0geyh2YWx1ZXM6IGltcG9ydCgnLi9wcml2YXRlLmpzJykuU3RvcmVzVmFsdWVzPFM+LCBzZXQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgdXBkYXRlOiAoZm46IGltcG9ydCgnLi9wdWJsaWMuanMnKS5VcGRhdGVyPFQ+KSA9PiB2b2lkKSA9PiBpbXBvcnQoJy4vcHVibGljLmpzJykuVW5zdWJzY3JpYmVyIHwgdm9pZH0gZm4gLSBmdW5jdGlvbiBjYWxsYmFjayB0aGF0IGFnZ3JlZ2F0ZXMgdGhlIHZhbHVlc1xuICogQHBhcmFtIHtUfSBbaW5pdGlhbF92YWx1ZV0gLSBpbml0aWFsIHZhbHVlXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlJlYWRhYmxlPFQ+fVxuICovXG5cbi8qKlxuICogRGVyaXZlZCB2YWx1ZSBzdG9yZSBieSBzeW5jaHJvbml6aW5nIG9uZSBvciBtb3JlIHJlYWRhYmxlIHN0b3JlcyBhbmRcbiAqIGFwcGx5aW5nIGFuIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIG92ZXIgaXRzIGlucHV0IHZhbHVlcy5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtc3RvcmUjZGVyaXZlZFxuICogQHRlbXBsYXRlIHtpbXBvcnQoJy4vcHJpdmF0ZS5qcycpLlN0b3Jlc30gU1xuICogQHRlbXBsYXRlIFRcbiAqIEBvdmVybG9hZFxuICogQHBhcmFtIHtTfSBzdG9yZXMgLSBpbnB1dCBzdG9yZXNcbiAqIEBwYXJhbSB7KHZhbHVlczogaW1wb3J0KCcuL3ByaXZhdGUuanMnKS5TdG9yZXNWYWx1ZXM8Uz4pID0+IFR9IGZuIC0gZnVuY3Rpb24gY2FsbGJhY2sgdGhhdCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXNcbiAqIEBwYXJhbSB7VH0gW2luaXRpYWxfdmFsdWVdIC0gaW5pdGlhbCB2YWx1ZVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5SZWFkYWJsZTxUPn1cbiAqL1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7aW1wb3J0KCcuL3ByaXZhdGUuanMnKS5TdG9yZXN9IFNcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge1N9IHN0b3Jlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7VH0gW2luaXRpYWxfdmFsdWVdXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuL3B1YmxpYy5qcycpLlJlYWRhYmxlPFQ+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVyaXZlZChzdG9yZXMsIGZuLCBpbml0aWFsX3ZhbHVlKSB7XG5cdGNvbnN0IHNpbmdsZSA9ICFBcnJheS5pc0FycmF5KHN0b3Jlcyk7XG5cdC8qKiBAdHlwZSB7QXJyYXk8aW1wb3J0KCcuL3B1YmxpYy5qcycpLlJlYWRhYmxlPGFueT4+fSAqL1xuXHRjb25zdCBzdG9yZXNfYXJyYXkgPSBzaW5nbGUgPyBbc3RvcmVzXSA6IHN0b3Jlcztcblx0aWYgKCFzdG9yZXNfYXJyYXkuZXZlcnkoQm9vbGVhbikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2Rlcml2ZWQoKSBleHBlY3RzIHN0b3JlcyBhcyBpbnB1dCwgZ290IGEgZmFsc3kgdmFsdWUnKTtcblx0fVxuXHRjb25zdCBhdXRvID0gZm4ubGVuZ3RoIDwgMjtcblx0cmV0dXJuIHJlYWRhYmxlKGluaXRpYWxfdmFsdWUsIChzZXQsIHVwZGF0ZSkgPT4ge1xuXHRcdGxldCBzdGFydGVkID0gZmFsc2U7XG5cdFx0Y29uc3QgdmFsdWVzID0gW107XG5cdFx0bGV0IHBlbmRpbmcgPSAwO1xuXHRcdGxldCBjbGVhbnVwID0gbm9vcDtcblx0XHRjb25zdCBzeW5jID0gKCkgPT4ge1xuXHRcdFx0aWYgKHBlbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y2xlYW51cCgpO1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gZm4oc2luZ2xlID8gdmFsdWVzWzBdIDogdmFsdWVzLCBzZXQsIHVwZGF0ZSk7XG5cdFx0XHRpZiAoYXV0bykge1xuXHRcdFx0XHRzZXQocmVzdWx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZWFudXAgPSBpc19mdW5jdGlvbihyZXN1bHQpID8gcmVzdWx0IDogbm9vcDtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGNvbnN0IHVuc3Vic2NyaWJlcnMgPSBzdG9yZXNfYXJyYXkubWFwKChzdG9yZSwgaSkgPT5cblx0XHRcdHN1YnNjcmliZShcblx0XHRcdFx0c3RvcmUsXG5cdFx0XHRcdCh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdHZhbHVlc1tpXSA9IHZhbHVlO1xuXHRcdFx0XHRcdHBlbmRpbmcgJj0gfigxIDw8IGkpO1xuXHRcdFx0XHRcdGlmIChzdGFydGVkKSB7XG5cdFx0XHRcdFx0XHRzeW5jKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHQoKSA9PiB7XG5cdFx0XHRcdFx0cGVuZGluZyB8PSAxIDw8IGk7XG5cdFx0XHRcdH1cblx0XHRcdClcblx0XHQpO1xuXHRcdHN0YXJ0ZWQgPSB0cnVlO1xuXHRcdHN5bmMoKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24gc3RvcCgpIHtcblx0XHRcdHJ1bl9hbGwodW5zdWJzY3JpYmVycyk7XG5cdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHQvLyBXZSBuZWVkIHRvIHNldCB0aGlzIHRvIGZhbHNlIGJlY2F1c2UgY2FsbGJhY2tzIGNhbiBzdGlsbCBoYXBwZW4gZGVzcGl0ZSBoYXZpbmcgdW5zdWJzY3JpYmVkOlxuXHRcdFx0Ly8gQ2FsbGJhY2tzIG1pZ2h0IGFscmVhZHkgYmUgcGxhY2VkIGluIHRoZSBxdWV1ZSB3aGljaCBkb2Vzbid0IGtub3cgaXQgc2hvdWxkIG5vIGxvbmdlclxuXHRcdFx0Ly8gaW52b2tlIHRoaXMgZGVyaXZlZCBzdG9yZS5cblx0XHRcdHN0YXJ0ZWQgPSBmYWxzZTtcblx0XHR9O1xuXHR9KTtcbn1cblxuLyoqXG4gKiBUYWtlcyBhIHN0b3JlIGFuZCByZXR1cm5zIGEgbmV3IG9uZSBkZXJpdmVkIGZyb20gdGhlIG9sZCBvbmUgdGhhdCBpcyByZWFkYWJsZS5cbiAqXG4gKiBodHRwczovL3N2ZWx0ZS5kZXYvZG9jcy9zdmVsdGUtc3RvcmUjcmVhZG9ubHlcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5SZWFkYWJsZTxUPn0gc3RvcmUgIC0gc3RvcmUgdG8gbWFrZSByZWFkb25seVxuICogQHJldHVybnMge2ltcG9ydCgnLi9wdWJsaWMuanMnKS5SZWFkYWJsZTxUPn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWRvbmx5KHN0b3JlKSB7XG5cdHJldHVybiB7XG5cdFx0c3Vic2NyaWJlOiBzdG9yZS5zdWJzY3JpYmUuYmluZChzdG9yZSlcblx0fTtcbn1cblxuZXhwb3J0IHsgZ2V0X3N0b3JlX3ZhbHVlIGFzIGdldCB9O1xuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCIgY29udGV4dD1cIm1vZHVsZVwiPlxuICBpbXBvcnQgeyB3cml0YWJsZSwgdHlwZSBXcml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG4gIGltcG9ydCB7IGZhZGUgfSBmcm9tICdzdmVsdGUvdHJhbnNpdGlvbic7XG5cbiAgZXhwb3J0IGNvbnN0IGJhY2tkcm9wVmlzaWJsZTogV3JpdGFibGU8Ym9vbGVhbj4gPSB3cml0YWJsZShmYWxzZSk7XG48L3NjcmlwdD5cblxueyNpZiAkYmFja2Ryb3BWaXNpYmxlfVxuICA8ZGl2IGNsYXNzPVwiYmctYmxhY2svNTAgYWJzb2x1dGUgaW5zZXQtMCB6LTMwXCIgdHJhbnNpdGlvbjpmYWRlIGRhdGEtdGVzdC1pZD1cImJhY2tkcm9wXCI+PC9kaXY+XG57L2lmfVxuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB0eXBlIHsgUGFnZSB9IGZyb20gXCIkbGliL3R5cGVzXCI7XG4gIFxuICBleHBvcnQgbGV0IHBhZ2U6IFBhZ2U7XG5cbiAgZnVuY3Rpb24gZ2V0UGFnZU5hbWUocGFnZTogUGFnZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuICghcGFnZS5wYXRoIHx8IHBhZ2UucGF0aCA9PT0gJycpID8gJ2luZGV4JyA6IHBhZ2UucGF0aDtcbiAgfVxuPC9zY3JpcHQ+XG48ZGl2IFxuICBjbGFzcz1cImZsZXgtMSBmbGV4IGZsZXgtY29sXCIgXG4gIGRhdGEtdGVzdC1pZD1cImZha2UtYnJvd3NlclwiPlxuICA8ZGl2IFxuICAgIGNsYXNzPVwiYmctZ3JheS01MCBib3JkZXItYiBib3JkZXItZ3JheS0yMDAgYm9yZGVyLXNvbGlkIHJvdW5kZWQtdC14bCBoLTEyIHB4LTMuNSBmbGV4XCIgXG4gICAgZGF0YS10ZXN0LWlkPVwiYWRkcmVzcy1iYXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWwtNCBweS0yXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImlubGluZS1ibG9jayBoLTIgdy0yIG1sLTIgcm91bmRlZC1mdWxsIGJnLXJlZC05MDBcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImlubGluZS1ibG9jayBoLTIgdy0yIG1sLTIgcm91bmRlZC1mdWxsIGJnLWFtYmVyLTQwMFwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiaW5saW5lLWJsb2NrIGgtMiB3LTIgbWwtMiByb3VuZGVkLWZ1bGwgYmctbGltZS03MDBcIj48L3NwYW4+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImZsZXgtMSBweS0yLjUgb3ZlcmZsb3ctdmlzaWJsZVwiPlxuICAgICAgPGRpdiBjbGFzcz1cInJvdW5kZWQgYmctd2hpdGUgYmctZ3JheS01MCBib3JkZXItYiBib3JkZXItZ3JheS0yMDAgc2hhZG93IG1heC13LXhzIG14LWF1dG8gdGV4dC1jZW50ZXIgcHktMC41IHJlbGF0aXZlXCI+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdC1pZD1cInVybC1ib3hcIj57Z2V0UGFnZU5hbWUocGFnZSl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInB5LTNcIj5cbiAgICAgIEQgfCBUIHwgUFxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPHNsb3QvPlxuPC9kaXY+IiwgImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG4gICAgaWYgKGVudW1lcmFibGVPbmx5KSBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgfSk7XG4gICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQyKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuXG4gICAgaWYgKGkgJSAyKSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICB2YXIgdGFyZ2V0ID0ge307XG4gIHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgdmFyIGtleSwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307XG5cbiAgdmFyIHRhcmdldCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpO1xuXG4gIHZhciBrZXksIGk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc291cmNlU3ltYm9sS2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VTeW1ib2xLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBzb3VyY2VTeW1ib2xLZXlzW2ldO1xuICAgICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkge1xuICByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwidW5kZWZpbmVkXCIgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpKSByZXR1cm47XG4gIHZhciBfYXJyID0gW107XG4gIHZhciBfbiA9IHRydWU7XG4gIHZhciBfZCA9IGZhbHNlO1xuICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfZCA9IHRydWU7XG4gICAgX2UgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2Fycjtcbn1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbmV4cG9ydCB7IF9hcnJheUxpa2VUb0FycmF5IGFzIGFycmF5TGlrZVRvQXJyYXksIF9hcnJheVdpdGhIb2xlcyBhcyBhcnJheVdpdGhIb2xlcywgX2RlZmluZVByb3BlcnR5IGFzIGRlZmluZVByb3BlcnR5LCBfaXRlcmFibGVUb0FycmF5TGltaXQgYXMgaXRlcmFibGVUb0FycmF5TGltaXQsIF9ub25JdGVyYWJsZVJlc3QgYXMgbm9uSXRlcmFibGVSZXN0LCBfb2JqZWN0U3ByZWFkMiBhcyBvYmplY3RTcHJlYWQyLCBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMgYXMgb2JqZWN0V2l0aG91dFByb3BlcnRpZXMsIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIGFzIG9iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UsIF9zbGljZWRUb0FycmF5IGFzIHNsaWNlZFRvQXJyYXksIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSBhcyB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSB9O1xuIiwgImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuXG4gIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7XG4gICAgaWYgKGVudW1lcmFibGVPbmx5KSBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgfSk7XG4gICAga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpO1xuICB9XG5cbiAgcmV0dXJuIGtleXM7XG59XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQyKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9O1xuXG4gICAgaWYgKGkgJSAyKSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpLCB0cnVlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiBjb21wb3NlKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZm5zID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGZuc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBmbnMucmVkdWNlUmlnaHQoZnVuY3Rpb24gKHksIGYpIHtcbiAgICAgIHJldHVybiBmKHkpO1xuICAgIH0sIHgpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjdXJyeShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gY3VycmllZCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3MubGVuZ3RoID49IGZuLmxlbmd0aCA/IGZuLmFwcGx5KHRoaXMsIGFyZ3MpIDogZnVuY3Rpb24gKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBuZXh0QXJncyA9IG5ldyBBcnJheShfbGVuMyksIF9rZXkzID0gMDsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgICBuZXh0QXJnc1tfa2V5M10gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmllZC5hcHBseShfdGhpcywgW10uY29uY2F0KGFyZ3MsIG5leHRBcmdzKSk7XG4gICAgfTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpLmluY2x1ZGVzKCdPYmplY3QnKTtcbn1cblxuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgcmV0dXJuICFPYmplY3Qua2V5cyhvYmopLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hhbmdlcyhpbml0aWFsLCBjaGFuZ2VzKSB7XG4gIGlmICghaXNPYmplY3QoY2hhbmdlcykpIGVycm9ySGFuZGxlcignY2hhbmdlVHlwZScpO1xuICBpZiAoT2JqZWN0LmtleXMoY2hhbmdlcykuc29tZShmdW5jdGlvbiAoZmllbGQpIHtcbiAgICByZXR1cm4gIWhhc093blByb3BlcnR5KGluaXRpYWwsIGZpZWxkKTtcbiAgfSkpIGVycm9ySGFuZGxlcignY2hhbmdlRmllbGQnKTtcbiAgcmV0dXJuIGNoYW5nZXM7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKHNlbGVjdG9yKSkgZXJyb3JIYW5kbGVyKCdzZWxlY3RvclR5cGUnKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVIYW5kbGVyKGhhbmRsZXIpIHtcbiAgaWYgKCEoaXNGdW5jdGlvbihoYW5kbGVyKSB8fCBpc09iamVjdChoYW5kbGVyKSkpIGVycm9ySGFuZGxlcignaGFuZGxlclR5cGUnKTtcbiAgaWYgKGlzT2JqZWN0KGhhbmRsZXIpICYmIE9iamVjdC52YWx1ZXMoaGFuZGxlcikuc29tZShmdW5jdGlvbiAoX2hhbmRsZXIpIHtcbiAgICByZXR1cm4gIWlzRnVuY3Rpb24oX2hhbmRsZXIpO1xuICB9KSkgZXJyb3JIYW5kbGVyKCdoYW5kbGVyc1R5cGUnKTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVJbml0aWFsKGluaXRpYWwpIHtcbiAgaWYgKCFpbml0aWFsKSBlcnJvckhhbmRsZXIoJ2luaXRpYWxJc1JlcXVpcmVkJyk7XG4gIGlmICghaXNPYmplY3QoaW5pdGlhbCkpIGVycm9ySGFuZGxlcignaW5pdGlhbFR5cGUnKTtcbiAgaWYgKGlzRW1wdHkoaW5pdGlhbCkpIGVycm9ySGFuZGxlcignaW5pdGlhbENvbnRlbnQnKTtcbn1cblxuZnVuY3Rpb24gdGhyb3dFcnJvcihlcnJvck1lc3NhZ2VzLCB0eXBlKSB7XG4gIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2VzW3R5cGVdIHx8IGVycm9yTWVzc2FnZXNbXCJkZWZhdWx0XCJdKTtcbn1cblxudmFyIGVycm9yTWVzc2FnZXMgPSB7XG4gIGluaXRpYWxJc1JlcXVpcmVkOiAnaW5pdGlhbCBzdGF0ZSBpcyByZXF1aXJlZCcsXG4gIGluaXRpYWxUeXBlOiAnaW5pdGlhbCBzdGF0ZSBzaG91bGQgYmUgYW4gb2JqZWN0JyxcbiAgaW5pdGlhbENvbnRlbnQ6ICdpbml0aWFsIHN0YXRlIHNob3VsZG5cXCd0IGJlIGFuIGVtcHR5IG9iamVjdCcsXG4gIGhhbmRsZXJUeXBlOiAnaGFuZGxlciBzaG91bGQgYmUgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24nLFxuICBoYW5kbGVyc1R5cGU6ICdhbGwgaGFuZGxlcnMgc2hvdWxkIGJlIGEgZnVuY3Rpb25zJyxcbiAgc2VsZWN0b3JUeXBlOiAnc2VsZWN0b3Igc2hvdWxkIGJlIGEgZnVuY3Rpb24nLFxuICBjaGFuZ2VUeXBlOiAncHJvdmlkZWQgdmFsdWUgb2YgY2hhbmdlcyBzaG91bGQgYmUgYW4gb2JqZWN0JyxcbiAgY2hhbmdlRmllbGQ6ICdpdCBzZWFtcyB5b3Ugd2FudCB0byBjaGFuZ2UgYSBmaWVsZCBpbiB0aGUgc3RhdGUgd2hpY2ggaXMgbm90IHNwZWNpZmllZCBpbiB0aGUgXCJpbml0aWFsXCIgc3RhdGUnLFxuICBcImRlZmF1bHRcIjogJ2FuIHVua25vd24gZXJyb3IgYWNjdXJlZCBpbiBgc3RhdGUtbG9jYWxgIHBhY2thZ2UnXG59O1xudmFyIGVycm9ySGFuZGxlciA9IGN1cnJ5KHRocm93RXJyb3IpKGVycm9yTWVzc2FnZXMpO1xudmFyIHZhbGlkYXRvcnMgPSB7XG4gIGNoYW5nZXM6IHZhbGlkYXRlQ2hhbmdlcyxcbiAgc2VsZWN0b3I6IHZhbGlkYXRlU2VsZWN0b3IsXG4gIGhhbmRsZXI6IHZhbGlkYXRlSGFuZGxlcixcbiAgaW5pdGlhbDogdmFsaWRhdGVJbml0aWFsXG59O1xuXG5mdW5jdGlvbiBjcmVhdGUoaW5pdGlhbCkge1xuICB2YXIgaGFuZGxlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIHZhbGlkYXRvcnMuaW5pdGlhbChpbml0aWFsKTtcbiAgdmFsaWRhdG9ycy5oYW5kbGVyKGhhbmRsZXIpO1xuICB2YXIgc3RhdGUgPSB7XG4gICAgY3VycmVudDogaW5pdGlhbFxuICB9O1xuICB2YXIgZGlkVXBkYXRlID0gY3VycnkoZGlkU3RhdGVVcGRhdGUpKHN0YXRlLCBoYW5kbGVyKTtcbiAgdmFyIHVwZGF0ZSA9IGN1cnJ5KHVwZGF0ZVN0YXRlKShzdGF0ZSk7XG4gIHZhciB2YWxpZGF0ZSA9IGN1cnJ5KHZhbGlkYXRvcnMuY2hhbmdlcykoaW5pdGlhbCk7XG4gIHZhciBnZXRDaGFuZ2VzID0gY3VycnkoZXh0cmFjdENoYW5nZXMpKHN0YXRlKTtcblxuICBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG4gICAgdmFsaWRhdG9ycy5zZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHNlbGVjdG9yKHN0YXRlLmN1cnJlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3RhdGUoY2F1c2VkQ2hhbmdlcykge1xuICAgIGNvbXBvc2UoZGlkVXBkYXRlLCB1cGRhdGUsIHZhbGlkYXRlLCBnZXRDaGFuZ2VzKShjYXVzZWRDaGFuZ2VzKTtcbiAgfVxuXG4gIHJldHVybiBbZ2V0U3RhdGUsIHNldFN0YXRlXTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdENoYW5nZXMoc3RhdGUsIGNhdXNlZENoYW5nZXMpIHtcbiAgcmV0dXJuIGlzRnVuY3Rpb24oY2F1c2VkQ2hhbmdlcykgPyBjYXVzZWRDaGFuZ2VzKHN0YXRlLmN1cnJlbnQpIDogY2F1c2VkQ2hhbmdlcztcbn1cblxuZnVuY3Rpb24gdXBkYXRlU3RhdGUoc3RhdGUsIGNoYW5nZXMpIHtcbiAgc3RhdGUuY3VycmVudCA9IF9vYmplY3RTcHJlYWQyKF9vYmplY3RTcHJlYWQyKHt9LCBzdGF0ZS5jdXJyZW50KSwgY2hhbmdlcyk7XG4gIHJldHVybiBjaGFuZ2VzO1xufVxuXG5mdW5jdGlvbiBkaWRTdGF0ZVVwZGF0ZShzdGF0ZSwgaGFuZGxlciwgY2hhbmdlcykge1xuICBpc0Z1bmN0aW9uKGhhbmRsZXIpID8gaGFuZGxlcihzdGF0ZS5jdXJyZW50KSA6IE9iamVjdC5rZXlzKGNoYW5nZXMpLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgdmFyIF9oYW5kbGVyJGZpZWxkO1xuXG4gICAgcmV0dXJuIChfaGFuZGxlciRmaWVsZCA9IGhhbmRsZXJbZmllbGRdKSA9PT0gbnVsbCB8fCBfaGFuZGxlciRmaWVsZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2hhbmRsZXIkZmllbGQuY2FsbChoYW5kbGVyLCBzdGF0ZS5jdXJyZW50W2ZpZWxkXSk7XG4gIH0pO1xuICByZXR1cm4gY2hhbmdlcztcbn1cblxudmFyIGluZGV4ID0ge1xuICBjcmVhdGU6IGNyZWF0ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5kZXg7XG4iLCAidmFyIGNvbmZpZyA9IHtcbiAgcGF0aHM6IHtcbiAgICB2czogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjQzLjAvbWluL3ZzJ1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iLCAiZnVuY3Rpb24gY3VycnkoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGN1cnJpZWQoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJncy5sZW5ndGggPj0gZm4ubGVuZ3RoID8gZm4uYXBwbHkodGhpcywgYXJncykgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIG5leHRBcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIG5leHRBcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjdXJyaWVkLmFwcGx5KF90aGlzLCBbXS5jb25jYXQoYXJncywgbmV4dEFyZ3MpKTtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjdXJyeTtcbiIsICJmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkuaW5jbHVkZXMoJ09iamVjdCcpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc09iamVjdDtcbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi4vdXRpbHMvY3VycnkuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4uL3V0aWxzL2lzT2JqZWN0LmpzJztcblxuLyoqXG4gKiB2YWxpZGF0ZXMgdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGFuZCBpbmZvcm1zIGFib3V0IGRlcHJlY2F0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gdGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IFxuICogQHJldHVybiB7T2JqZWN0fSBjb25maWcgLSB0aGUgdmFsaWRhdGVkIGNvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKi9cblxuZnVuY3Rpb24gdmFsaWRhdGVDb25maWcoY29uZmlnKSB7XG4gIGlmICghY29uZmlnKSBlcnJvckhhbmRsZXIoJ2NvbmZpZ0lzUmVxdWlyZWQnKTtcbiAgaWYgKCFpc09iamVjdChjb25maWcpKSBlcnJvckhhbmRsZXIoJ2NvbmZpZ1R5cGUnKTtcblxuICBpZiAoY29uZmlnLnVybHMpIHtcbiAgICBpbmZvcm1BYm91dERlcHJlY2F0aW9uKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhzOiB7XG4gICAgICAgIHZzOiBjb25maWcudXJscy5tb25hY29CYXNlXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG4vKipcbiAqIGxvZ3MgZGVwcmVjYXRpb24gbWVzc2FnZVxuICovXG5cblxuZnVuY3Rpb24gaW5mb3JtQWJvdXREZXByZWNhdGlvbigpIHtcbiAgY29uc29sZS53YXJuKGVycm9yTWVzc2FnZXMuZGVwcmVjYXRpb24pO1xufVxuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKGVycm9yTWVzc2FnZXMsIHR5cGUpIHtcbiAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZXNbdHlwZV0gfHwgZXJyb3JNZXNzYWdlc1tcImRlZmF1bHRcIl0pO1xufVxuXG52YXIgZXJyb3JNZXNzYWdlcyA9IHtcbiAgY29uZmlnSXNSZXF1aXJlZDogJ3RoZSBjb25maWd1cmF0aW9uIG9iamVjdCBpcyByZXF1aXJlZCcsXG4gIGNvbmZpZ1R5cGU6ICd0aGUgY29uZmlndXJhdGlvbiBvYmplY3Qgc2hvdWxkIGJlIGFuIG9iamVjdCcsXG4gIFwiZGVmYXVsdFwiOiAnYW4gdW5rbm93biBlcnJvciBhY2N1cmVkIGluIGBAbW9uYWNvLWVkaXRvci9sb2FkZXJgIHBhY2thZ2UnLFxuICBkZXByZWNhdGlvbjogXCJEZXByZWNhdGlvbiB3YXJuaW5nIVxcbiAgICBZb3UgYXJlIHVzaW5nIGRlcHJlY2F0ZWQgd2F5IG9mIGNvbmZpZ3VyYXRpb24uXFxuXFxuICAgIEluc3RlYWQgb2YgdXNpbmdcXG4gICAgICBtb25hY28uY29uZmlnKHsgdXJsczogeyBtb25hY29CYXNlOiAnLi4uJyB9IH0pXFxuICAgIHVzZVxcbiAgICAgIG1vbmFjby5jb25maWcoeyBwYXRoczogeyB2czogJy4uLicgfSB9KVxcblxcbiAgICBGb3IgbW9yZSBwbGVhc2UgY2hlY2sgdGhlIGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3N1cmVuLWF0b3lhbi9tb25hY28tbG9hZGVyI2NvbmZpZ1xcbiAgXCJcbn07XG52YXIgZXJyb3JIYW5kbGVyID0gY3VycnkodGhyb3dFcnJvcikoZXJyb3JNZXNzYWdlcyk7XG52YXIgdmFsaWRhdG9ycyA9IHtcbiAgY29uZmlnOiB2YWxpZGF0ZUNvbmZpZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdG9ycztcbmV4cG9ydCB7IGVycm9ySGFuZGxlciwgZXJyb3JNZXNzYWdlcyB9O1xuIiwgInZhciBjb21wb3NlID0gZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGZucyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gZm5zLnJlZHVjZVJpZ2h0KGZ1bmN0aW9uICh5LCBmKSB7XG4gICAgICByZXR1cm4gZih5KTtcbiAgICB9LCB4KTtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2U7XG4iLCAiaW1wb3J0IHsgb2JqZWN0U3ByZWFkMiBhcyBfb2JqZWN0U3ByZWFkMiB9IGZyb20gJy4uL192aXJ0dWFsL19yb2xsdXBQbHVnaW5CYWJlbEhlbHBlcnMuanMnO1xuXG5mdW5jdGlvbiBtZXJnZSh0YXJnZXQsIHNvdXJjZSkge1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChzb3VyY2Vba2V5XSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgaWYgKHRhcmdldFtrZXldKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oc291cmNlW2tleV0sIG1lcmdlKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSkpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBfb2JqZWN0U3ByZWFkMihfb2JqZWN0U3ByZWFkMih7fSwgdGFyZ2V0KSwgc291cmNlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVyZ2U7XG4iLCAiLy8gVGhlIHNvdXJjZSAoaGFzIGJlZW4gY2hhbmdlZCkgaXMgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy81NDY1I2lzc3VlY29tbWVudC0xNTc4ODgzMjVcbnZhciBDQU5DRUxBVElPTl9NRVNTQUdFID0ge1xuICB0eXBlOiAnY2FuY2VsYXRpb24nLFxuICBtc2c6ICdvcGVyYXRpb24gaXMgbWFudWFsbHkgY2FuY2VsZWQnXG59O1xuXG5mdW5jdGlvbiBtYWtlQ2FuY2VsYWJsZShwcm9taXNlKSB7XG4gIHZhciBoYXNDYW5jZWxlZF8gPSBmYWxzZTtcbiAgdmFyIHdyYXBwZWRQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gaGFzQ2FuY2VsZWRfID8gcmVqZWN0KENBTkNFTEFUSU9OX01FU1NBR0UpIDogcmVzb2x2ZSh2YWwpO1xuICAgIH0pO1xuICAgIHByb21pc2VbXCJjYXRjaFwiXShyZWplY3QpO1xuICB9KTtcbiAgcmV0dXJuIHdyYXBwZWRQcm9taXNlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaGFzQ2FuY2VsZWRfID0gdHJ1ZTtcbiAgfSwgd3JhcHBlZFByb21pc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG1ha2VDYW5jZWxhYmxlO1xuZXhwb3J0IHsgQ0FOQ0VMQVRJT05fTUVTU0FHRSB9O1xuIiwgImltcG9ydCB7IHNsaWNlZFRvQXJyYXkgYXMgX3NsaWNlZFRvQXJyYXksIG9iamVjdFdpdGhvdXRQcm9wZXJ0aWVzIGFzIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyB9IGZyb20gJy4uL192aXJ0dWFsL19yb2xsdXBQbHVnaW5CYWJlbEhlbHBlcnMuanMnO1xuaW1wb3J0IHN0YXRlIGZyb20gJ3N0YXRlLWxvY2FsJztcbmltcG9ydCBjb25maWckMSBmcm9tICcuLi9jb25maWcvaW5kZXguanMnO1xuaW1wb3J0IHZhbGlkYXRvcnMgZnJvbSAnLi4vdmFsaWRhdG9ycy9pbmRleC5qcyc7XG5pbXBvcnQgY29tcG9zZSBmcm9tICcuLi91dGlscy9jb21wb3NlLmpzJztcbmltcG9ydCBtZXJnZSBmcm9tICcuLi91dGlscy9kZWVwTWVyZ2UuanMnO1xuaW1wb3J0IG1ha2VDYW5jZWxhYmxlIGZyb20gJy4uL3V0aWxzL21ha2VDYW5jZWxhYmxlLmpzJztcblxuLyoqIHRoZSBsb2NhbCBzdGF0ZSBvZiB0aGUgbW9kdWxlICovXG5cbnZhciBfc3RhdGUkY3JlYXRlID0gc3RhdGUuY3JlYXRlKHtcbiAgY29uZmlnOiBjb25maWckMSxcbiAgaXNJbml0aWFsaXplZDogZmFsc2UsXG4gIHJlc29sdmU6IG51bGwsXG4gIHJlamVjdDogbnVsbCxcbiAgbW9uYWNvOiBudWxsXG59KSxcbiAgICBfc3RhdGUkY3JlYXRlMiA9IF9zbGljZWRUb0FycmF5KF9zdGF0ZSRjcmVhdGUsIDIpLFxuICAgIGdldFN0YXRlID0gX3N0YXRlJGNyZWF0ZTJbMF0sXG4gICAgc2V0U3RhdGUgPSBfc3RhdGUkY3JlYXRlMlsxXTtcbi8qKlxuICogc2V0IHRoZSBsb2FkZXIgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIHRoZSBjb25maWd1cmF0aW9uIG9iamVjdFxuICovXG5cblxuZnVuY3Rpb24gY29uZmlnKGdsb2JhbENvbmZpZykge1xuICB2YXIgX3ZhbGlkYXRvcnMkY29uZmlnID0gdmFsaWRhdG9ycy5jb25maWcoZ2xvYmFsQ29uZmlnKSxcbiAgICAgIG1vbmFjbyA9IF92YWxpZGF0b3JzJGNvbmZpZy5tb25hY28sXG4gICAgICBjb25maWcgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3ZhbGlkYXRvcnMkY29uZmlnLCBbXCJtb25hY29cIl0pO1xuXG4gIHNldFN0YXRlKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IG1lcmdlKHN0YXRlLmNvbmZpZywgY29uZmlnKSxcbiAgICAgIG1vbmFjbzogbW9uYWNvXG4gICAgfTtcbiAgfSk7XG59XG4vKipcbiAqIGhhbmRsZXMgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoZSBtb25hY28tZWRpdG9yXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAtIHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgbW9uYWNvICh3aXRoIGEgY2FuY2VsYWJsZSBwcm9taXNlKVxuICovXG5cblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgbW9uYWNvID0gX3JlZi5tb25hY28sXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQgPSBfcmVmLmlzSW5pdGlhbGl6ZWQsXG4gICAgICAgIHJlc29sdmUgPSBfcmVmLnJlc29sdmU7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vbmFjbzogbW9uYWNvLFxuICAgICAgaXNJbml0aWFsaXplZDogaXNJbml0aWFsaXplZCxcbiAgICAgIHJlc29sdmU6IHJlc29sdmVcbiAgICB9O1xuICB9KTtcblxuICBpZiAoIXN0YXRlLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICBzZXRTdGF0ZSh7XG4gICAgICBpc0luaXRpYWxpemVkOiB0cnVlXG4gICAgfSk7XG5cbiAgICBpZiAoc3RhdGUubW9uYWNvKSB7XG4gICAgICBzdGF0ZS5yZXNvbHZlKHN0YXRlLm1vbmFjbyk7XG4gICAgICByZXR1cm4gbWFrZUNhbmNlbGFibGUod3JhcHBlclByb21pc2UpO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cubW9uYWNvICYmIHdpbmRvdy5tb25hY28uZWRpdG9yKSB7XG4gICAgICBzdG9yZU1vbmFjb0luc3RhbmNlKHdpbmRvdy5tb25hY28pO1xuICAgICAgc3RhdGUucmVzb2x2ZSh3aW5kb3cubW9uYWNvKTtcbiAgICAgIHJldHVybiBtYWtlQ2FuY2VsYWJsZSh3cmFwcGVyUHJvbWlzZSk7XG4gICAgfVxuXG4gICAgY29tcG9zZShpbmplY3RTY3JpcHRzLCBnZXRNb25hY29Mb2FkZXJTY3JpcHQpKGNvbmZpZ3VyZUxvYWRlcik7XG4gIH1cblxuICByZXR1cm4gbWFrZUNhbmNlbGFibGUod3JhcHBlclByb21pc2UpO1xufVxuLyoqXG4gKiBpbmplY3RzIHByb3ZpZGVkIHNjcmlwdHMgaW50byB0aGUgZG9jdW1lbnQuYm9keVxuICogQHBhcmFtIHtPYmplY3R9IHNjcmlwdCAtIGFuIEhUTUwgc2NyaXB0IGVsZW1lbnRcbiAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgaW5qZWN0ZWQgSFRNTCBzY3JpcHQgZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gaW5qZWN0U2NyaXB0cyhzY3JpcHQpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cbi8qKlxuICogY3JlYXRlcyBhbiBIVE1MIHNjcmlwdCBlbGVtZW50IHdpdGgvd2l0aG91dCBwcm92aWRlZCBzcmNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3JjXSAtIHRoZSBzb3VyY2UgcGF0aCBvZiB0aGUgc2NyaXB0XG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gdGhlIGNyZWF0ZWQgSFRNTCBzY3JpcHQgZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gY3JlYXRlU2NyaXB0KHNyYykge1xuICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHJldHVybiBzcmMgJiYgKHNjcmlwdC5zcmMgPSBzcmMpLCBzY3JpcHQ7XG59XG4vKipcbiAqIGNyZWF0ZXMgYW4gSFRNTCBzY3JpcHQgZWxlbWVudCB3aXRoIHRoZSBtb25hY28gbG9hZGVyIHNyY1xuICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBjcmVhdGVkIEhUTUwgc2NyaXB0IGVsZW1lbnRcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldE1vbmFjb0xvYWRlclNjcmlwdChjb25maWd1cmVMb2FkZXIpIHtcbiAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgdmFyIGNvbmZpZyA9IF9yZWYyLmNvbmZpZyxcbiAgICAgICAgcmVqZWN0ID0gX3JlZjIucmVqZWN0O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgIHJlamVjdDogcmVqZWN0XG4gICAgfTtcbiAgfSk7XG4gIHZhciBsb2FkZXJTY3JpcHQgPSBjcmVhdGVTY3JpcHQoXCJcIi5jb25jYXQoc3RhdGUuY29uZmlnLnBhdGhzLnZzLCBcIi9sb2FkZXIuanNcIikpO1xuXG4gIGxvYWRlclNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvbmZpZ3VyZUxvYWRlcigpO1xuICB9O1xuXG4gIGxvYWRlclNjcmlwdC5vbmVycm9yID0gc3RhdGUucmVqZWN0O1xuICByZXR1cm4gbG9hZGVyU2NyaXB0O1xufVxuLyoqXG4gKiBjb25maWd1cmVzIHRoZSBtb25hY28gbG9hZGVyXG4gKi9cblxuXG5mdW5jdGlvbiBjb25maWd1cmVMb2FkZXIoKSB7XG4gIHZhciBzdGF0ZSA9IGdldFN0YXRlKGZ1bmN0aW9uIChfcmVmMykge1xuICAgIHZhciBjb25maWcgPSBfcmVmMy5jb25maWcsXG4gICAgICAgIHJlc29sdmUgPSBfcmVmMy5yZXNvbHZlLFxuICAgICAgICByZWplY3QgPSBfcmVmMy5yZWplY3Q7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgIHJlamVjdDogcmVqZWN0XG4gICAgfTtcbiAgfSk7XG4gIHZhciByZXF1aXJlID0gd2luZG93LnJlcXVpcmU7XG5cbiAgcmVxdWlyZS5jb25maWcoc3RhdGUuY29uZmlnKTtcblxuICByZXF1aXJlKFsndnMvZWRpdG9yL2VkaXRvci5tYWluJ10sIGZ1bmN0aW9uIChtb25hY28pIHtcbiAgICBzdG9yZU1vbmFjb0luc3RhbmNlKG1vbmFjbyk7XG4gICAgc3RhdGUucmVzb2x2ZShtb25hY28pO1xuICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICBzdGF0ZS5yZWplY3QoZXJyb3IpO1xuICB9KTtcbn1cbi8qKlxuICogc3RvcmUgbW9uYWNvIGluc3RhbmNlIGluIGxvY2FsIHN0YXRlXG4gKi9cblxuXG5mdW5jdGlvbiBzdG9yZU1vbmFjb0luc3RhbmNlKG1vbmFjbykge1xuICBpZiAoIWdldFN0YXRlKCkubW9uYWNvKSB7XG4gICAgc2V0U3RhdGUoe1xuICAgICAgbW9uYWNvOiBtb25hY29cbiAgICB9KTtcbiAgfVxufVxuLyoqXG4gKiBpbnRlcm5hbCBoZWxwZXIgZnVuY3Rpb25cbiAqIGV4dHJhY3RzIHN0b3JlZCBtb25hY28gaW5zdGFuY2VcbiAqIEByZXR1cm4ge09iamVjdHxudWxsfSAtIHRoZSBtb25hY28gaW5zdGFuY2VcbiAqL1xuXG5cbmZ1bmN0aW9uIF9fZ2V0TW9uYWNvSW5zdGFuY2UoKSB7XG4gIHJldHVybiBnZXRTdGF0ZShmdW5jdGlvbiAoX3JlZjQpIHtcbiAgICB2YXIgbW9uYWNvID0gX3JlZjQubW9uYWNvO1xuICAgIHJldHVybiBtb25hY287XG4gIH0pO1xufVxuXG52YXIgd3JhcHBlclByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gIHJldHVybiBzZXRTdGF0ZSh7XG4gICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICByZWplY3Q6IHJlamVjdFxuICB9KTtcbn0pO1xudmFyIGxvYWRlciA9IHtcbiAgY29uZmlnOiBjb25maWcsXG4gIGluaXQ6IGluaXQsXG4gIF9fZ2V0TW9uYWNvSW5zdGFuY2U6IF9fZ2V0TW9uYWNvSW5zdGFuY2Vcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvYWRlcjtcbiIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgbG9hZGVyIGZyb20gJ0Btb25hY28tZWRpdG9yL2xvYWRlcic7XG4gIGltcG9ydCB7IG9uRGVzdHJveSwgb25Nb3VudCB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGltcG9ydCB0eXBlICogYXMgTW9uYWNvIGZyb20gJ21vbmFjby1lZGl0b3IvZXNtL3ZzL2VkaXRvci9lZGl0b3IuYXBpJztcbiAgZXhwb3J0IGxldCB2YWx1ZTogc3RyaW5nO1xuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xuICBsZXQgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcbiAgXG4gIGxldCBlZGl0b3I6IE1vbmFjby5lZGl0b3IuSVN0YW5kYWxvbmVDb2RlRWRpdG9yO1xuICBsZXQgbW9uYWNvOiB0eXBlb2YgTW9uYWNvO1xuICBsZXQgZWRpdG9yQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgJDoge1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjb2RlIGVkaXRvciB2YWx1ZScsIHZhbHVlKTtcbiAgICAgIGVkaXRvci5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIG9uTW91bnQoYXN5bmMgKCkgPT4ge1xuICAgICAgbG9hZGVyLmNvbmZpZyh7IHBhdGhzOiB7IHZzOiAnL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL21pbi92cycgfSB9KTtcblxuICAgICAgbW9uYWNvID0gYXdhaXQgbG9hZGVyLmluaXQoKTtcblxuICAgICAgY29uc3QgZWRpdG9yID0gbW9uYWNvLmVkaXRvci5jcmVhdGUoZWRpdG9yQ29udGFpbmVyLCB7XG4gICAgICAgIHZhbHVlLFxuXHQgICAgICBsYW5ndWFnZTogJ2VsaXhpcicsXG4gICAgICAgIG1pbmltYXA6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgICAgbGluZU51bWJlcnM6IFwib2ZmXCIsXG4gICAgICAgIGF1dG9tYXRpY0xheW91dDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICBlZGl0b3Iub25EaWRCbHVyRWRpdG9yV2lkZ2V0KGUgPT4ge1xuICAgICAgICBsZXQgY29udGVudCA9IGVkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICBkaXNwYXRjaCgnY2hhbmdlJywgY29udGVudCk7XG4gICAgICB9KTtcbiAgfSk7XG5cbiAgb25EZXN0cm95KCgpID0+IHtcbiAgICAgIG1vbmFjbz8uZWRpdG9yLmdldE1vZGVscygpLmZvckVhY2goKG1vZGVsKSA9PiBtb2RlbC5kaXNwb3NlKCkpO1xuICB9KTtcbjwvc2NyaXB0PlxuXG48ZGl2IGJpbmQ6dGhpcz17ZWRpdG9yQ29udGFpbmVyfSBjbGFzcz1cInctNTIgaC0yNCBweS0wLjUgcHgtMC41IGJnLWdyYXktMTAwXCI+PC9kaXY+IiwgImV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUoX25vZGU6IEhUTUxFbGVtZW50LCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIHggPSAwLCB5ID0gMCB9KSB7XG4gIHJldHVybiB7XG4gICAgZGVsYXksXG4gICAgZHVyYXRpb24sXG4gICAgY3NzOiAodDogbnVtYmVyKSA9PiBgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHt4ICogdH1weCwgJHt5ICogdH1weClgXG4gIH07XG59IiwgImltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgV3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuaW1wb3J0IHR5cGUgeyBDb21wb25lbnRDYXRlZ29yeSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeTogV3JpdGFibGU8Q29tcG9uZW50Q2F0ZWdvcnkgfCBudWxsPiA9IHdyaXRhYmxlKG51bGwpXG4iLCAiaW1wb3J0IHsgd3JpdGFibGUgfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuaW1wb3J0IHR5cGUgeyBXcml0YWJsZSB9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudERlZmluaXRpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cblxuZXhwb3J0IGNvbnN0IGRyYWdnZWRPYmplY3Q6IFdyaXRhYmxlPENvbXBvbmVudERlZmluaXRpb24gfCBudWxsPiA9IHdyaXRhYmxlKG51bGwpXG4iLCAiPHNjcmlwdCBsYW5nPVwidHNcIj5cblx0aW1wb3J0IHsgZmFkZSB9IGZyb20gJ3N2ZWx0ZS90cmFuc2l0aW9uJztcbiAgaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSAnJGxpYi91dGlscy9hbmltYXRpb25zJztcbiAgaW1wb3J0IHsgY3VycmVudENvbXBvbmVudENhdGVnb3J5IH0gZnJvbSAnJGxpYi9zdG9yZXMvY3VycmVudENvbXBvbmVudENhdGVnb3J5JztcbiAgaW1wb3J0IHsgZHJhZ2dlZE9iamVjdCB9IGZyb20gJyRsaWIvc3RvcmVzL2RyYWdBbmREcm9wJztcbiAgaW1wb3J0IHR5cGUgeyBDb21wb25lbnRDYXRlZ29yeSwgQ29tcG9uZW50RGVmaW5pdGlvbiwgTWVudUNhdGVnb3J5IH0gZnJvbSAnJGxpYi90eXBlcyc7XG4gIGV4cG9ydCBsZXQgY29tcG9uZW50czogQ29tcG9uZW50RGVmaW5pdGlvbltdO1xuXG4gIGxldCBtZW51Q2F0ZWdvcmllczogTWVudUNhdGVnb3J5W10gPSBbXTtcbiAgJDogbWVudUNhdGVnb3JpZXMgPSBbe1xuICAgIG5hbWU6ICdCYXNlJyxcbiAgICBpdGVtczogQXJyYXkuZnJvbShuZXcgU2V0KGNvbXBvbmVudERlZmluaXRpb25zLm1hcChkID0+IGQuY2F0ZWdvcnkpKSkubWFwKGlkID0+ICh7IGlkLCBuYW1lOiBpZCB9KSlcbiAgfV07XG5cbiAgJDogY29tcG9uZW50RGVmaW5pdGlvbnMgPSBjb21wb25lbnRzO1xuXHQkOiBjb21wb25lbnREZWZpbml0aW9uc0J5Q2F0ZWdvcnkgPSAoY29tcG9uZW50RGVmaW5pdGlvbnMgfHwgW10pLnJlZHVjZSgoYWNjOiB7IFtrZXk6IHN0cmluZ106IENvbXBvbmVudERlZmluaXRpb25bXSB9LCBjb21wOiBDb21wb25lbnREZWZpbml0aW9uKSA9PiB7XG4gICAgICBhY2NbY29tcC5jYXRlZ29yeV0gfHw9IFtdO1xuICAgICAgYWNjW2NvbXAuY2F0ZWdvcnldLnB1c2goY29tcCk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgJDogY3VycmVudERlZmluaXRpb25zID0gJGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSA/IGNvbXBvbmVudERlZmluaXRpb25zQnlDYXRlZ29yeVskY3VycmVudENvbXBvbmVudENhdGVnb3J5LmlkXSA6IFtdO1xuXG5cdGNvbnN0IHNlY3Rpb25UaXRsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFx0bmF2OiAnTmF2cycsXG5cdFx0aGVhZGVyOiAnSGVhZGVycycsXG5cdFx0c2lnbl9pbjogJ1NpZ24gaW5zJyxcblx0XHRzaWduX3VwOiAnU2lnbiB1cHMnLFxuXHRcdHN0YXRzOiAnU3RhdHMnLFxuXHRcdGZvb3RlcjogJ0Zvb3RlcnMnLFxuXHRcdGJhc2ljOiAnQmFzaWNzJyxcblx0XHRvdGhlcjogJ090aGVyJ1xuXHR9XG5cbiAgbGV0IHNob3dFeGFtcGxlcyA9IGZhbHNlO1xuICBsZXQgaGlkZUNvbXBvbmVudFRpbWVyO1xuXG5cdGZ1bmN0aW9uIGNvbGxhcHNlQ2F0ZWdvcnlNZW51KCkge1xuXHRcdGhpZGVDb21wb25lbnRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0c2hvd0V4YW1wbGVzID0gZmFsc2U7XG4gICAgfSwgNDAwKTtcblx0fVxuXHRmdW5jdGlvbiBhYm9ydENvbGxhcHNlQ2F0ZWdvcnlNZW51KCkge1xuXHRcdGNsZWFyVGltZW91dChoaWRlQ29tcG9uZW50VGltZXIpO1xuXHR9XHQgIFxuXG5cdGZ1bmN0aW9uIGV4cGFuZENhdGVnb3J5TWVudShjb21wb25lbnRDYXRlZ29yeTogQ29tcG9uZW50Q2F0ZWdvcnkpIHtcblx0XHRpZiAoJGRyYWdnZWRPYmplY3QpIHJldHVybjtcblx0XHRjbGVhclRpbWVvdXQoaGlkZUNvbXBvbmVudFRpbWVyKTtcblx0XHQkY3VycmVudENvbXBvbmVudENhdGVnb3J5ID0gY29tcG9uZW50Q2F0ZWdvcnk7XG5cdFx0c2hvd0V4YW1wbGVzID0gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRyYWdTdGFydChjb21wb25lbnREZWZpbml0aW9uOiBDb21wb25lbnREZWZpbml0aW9uLCBlOiBEcmFnRXZlbnQpIHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdCRkcmFnZ2VkT2JqZWN0ID0gY29tcG9uZW50RGVmaW5pdGlvblxuXHRcdFx0c2hvd0V4YW1wbGVzID0gZmFsc2U7XG5cdFx0fSwgMTAwKVxuXHR9XG5cblx0ZnVuY3Rpb24gZHJhZ0VuZCgpIHtcblx0XHQkZHJhZ2dlZE9iamVjdCA9IG51bGw7XG5cdH1cbjwvc2NyaXB0PlxuXG48IS0tIExlZnQgc2lkZWJhciAtLT5cbjxkaXYgY2xhc3M9XCJ3LTY0IGJnLXdoaXRlIGJvcmRlci1ncmF5LTEwMCBib3JkZXItc29saWQgYm9yZGVyLXJcIiBpZD1cImxlZnQtc2lkZWJhclwiIGRhdGEtdGVzdC1pZD1cImxlZnQtc2lkZWJhclwiPlxuICA8ZGl2IGNsYXNzPVwic3RpY2t5IHRvcC0wXCI+XG4gICAgPGRpdiBjbGFzcz1cImJvcmRlci1iIGJvcmRlci1ncmF5LTEwMCBib3JkZXItc29saWQgcHktNCBweC00XCIgZGF0YS10ZXN0LWlkPVwibG9nb1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWxnXCI+QmVhY29uIENNUzwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8dWwgY2xhc3M9XCJweC00XCIgZGF0YS10ZXN0LWlkPVwiY29tcG9uZW50LXRyZWVcIj5cbiAgICAgIHsjZWFjaCBtZW51Q2F0ZWdvcmllcyBhcyBjYXRlZ29yeX1cbiAgICAgICAgPGxpIGNsYXNzPVwicGItMVwiIGRhdGEtdGVzdC1pZD1cIm5hdi1pdGVtXCI+XG4gICAgICAgICAgPGg1IGNsYXNzPVwidXBwZXJjYXNlXCI+e2NhdGVnb3J5Lm5hbWV9PC9oNT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgeyNlYWNoIGNhdGVnb3J5Lml0ZW1zIGFzIGl0ZW19XG4gICAgICAgICAgPGxpIGNsYXNzPVwicGItMVwiIGRhdGEtdGVzdC1pZD1cIm5hdi1pdGVtXCIgb246bW91c2VlbnRlcj17KCkgPT4gZXhwYW5kQ2F0ZWdvcnlNZW51KGl0ZW0pfSBvbjptb3VzZWxlYXZlPXtjb2xsYXBzZUNhdGVnb3J5TWVudX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGwtMlwiPntzZWN0aW9uVGl0bGVzW2l0ZW0ubmFtZV19PC9kaXY+XHRcbiAgICAgICAgICA8L2xpPlxuICAgICAgICB7L2VhY2h9XG4gICAgICB7L2VhY2h9XG4gICAgPC91bD5cbiAgPC9kaXY+XG48L2Rpdj5cblxueyNpZiBzaG93RXhhbXBsZXN9XG4gIDxkaXYgY2xhc3M9XCJiZy1ibGFjay81MCBhYnNvbHV0ZSBpbnNldC0wIHotNTBcIiB0cmFuc2l0aW9uOmZhZGU9e3tkdXJhdGlvbjogMzAwfX0gaWQ9XCJiYWNrZHJvcFwiIGRhdGEtdGVzdC1pZD1cImJhY2tkcm9wXCI+PC9kaXY+XG57L2lmfVx0XG48ZGl2IFxuICBjbGFzcz1cImFic29sdXRlIHctOTYgLWxlZnQtMzIgYmctd2hpdGUgaW5zZXQteS0wIHNoYWRvdy1zbSB6LTUwIHB0LTMgcGItNCBweC01IHRyYW5zaXRpb24tdHJhbnNmb3JtIGR1cmF0aW9uLTMwMFwiIFxuICBjbGFzczp0cmFuc2xhdGUteC05Nj17c2hvd0V4YW1wbGVzfVxuICBpZD1cImNvbXBvbmVudC1wcmV2aWV3c1wiXG4gIGRhdGEtdGVzdC1pZD1cImNvbXBvbmVudC1wcmV2aWV3c1wiIFxuICB0cmFuc2l0aW9uOnRyYW5zbGF0ZT17e3g6IDM4NH19XG4gIG9uOm1vdXNlZW50ZXI9e2Fib3J0Q29sbGFwc2VDYXRlZ29yeU1lbnV9XG4gIG9uOm1vdXNlbGVhdmU9e2NvbGxhcHNlQ2F0ZWdvcnlNZW51fT5cbiAgPGg0IGNsYXNzPVwidGV4dC0yeGxcIj57c2VjdGlvblRpdGxlc1skY3VycmVudENvbXBvbmVudENhdGVnb3J5Py5uYW1lXX08L2g0PlxuICA8cD5TZWxlY3QgYSBjb21wb25lbnQg8J+RhyAgYW5kIGRyYWcgaXQgdG8gdGhlIGNhbnZhcyDwn5GJPC9wPlxuICB7I2lmIGN1cnJlbnREZWZpbml0aW9uc31cbiAgICB7I2VhY2ggY3VycmVudERlZmluaXRpb25zIGFzIGV4YW1wbGV9XG4gICAgICA8ZGl2IFxuICAgICAgICBkcmFnZ2FibGVcbiAgICAgICAgb246ZHJhZ3N0YXJ0PXtlID0+IGRyYWdTdGFydChleGFtcGxlLCBlKX1cbiAgICAgICAgb246ZHJhZ2VuZD17ZHJhZ0VuZH1cbiAgICAgICAgY2xhc3M9XCJwdC02XCIgXG4gICAgICAgIGRhdGEtdGVzdC1pZD1cImNvbXBvbmVudC1wcmV2aWV3LWNhcmRcIj5cbiAgICAgICAgPGltZyBjbGFzcz1cInJvdW5kZWQgb3V0bGluZS1vZmZzZXQtMiBvdXRsaW5lLWJsdWUtNTAwIGhvdmVyOm91dGxpbmUgaG92ZXI6b3V0bGluZS0yXCIgc3JjPXtleGFtcGxlLnRodW1ibmFpbH0gYWx0PXtleGFtcGxlLm5hbWV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICB7L2VhY2h9XG4gIHsvaWZ9XG48L2Rpdj5cblxuPHN0eWxlPlxuXHQjbGVmdC1zaWRlYmFyIHtcblx0XHR6LWluZGV4OiAxMDAwO1xuXHR9XG5cdCNjb21wb25lbnQtcHJldmlld3MsICNiYWNrZHJvcCB7XG5cdFx0ei1pbmRleDogOTk5O1xuXHR9XG48L3N0eWxlPiIsICJpbXBvcnQgeyB3cml0YWJsZSwgZGVyaXZlZCwgZ2V0IH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgV3JpdGFibGUsIFJlYWRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB0eXBlIHsgQXN0RWxlbWVudCwgQXN0Tm9kZSwgUGFnZSB9IGZyb20gJyRsaWIvdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgcGFnZTogV3JpdGFibGU8UGFnZT4gPSB3cml0YWJsZSgpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdGVkQXN0RWxlbWVudElkOiBXcml0YWJsZTxzdHJpbmcgfCB1bmRlZmluZWQ+ID0gd3JpdGFibGUoKTtcbi8vIGV4cG9ydCBjb25zdCBoaWdobGlnaHRlZEFzdEVsZW1lbnRJZDogV3JpdGFibGU8c3RyaW5nIHwgdW5kZWZpbmVkPiA9IHdyaXRhYmxlKCk7XG5leHBvcnQgY29uc3QgaGlnaGxpZ2h0ZWRBc3RFbGVtZW50OiBXcml0YWJsZTxBc3RFbGVtZW50IHwgdW5kZWZpbmVkPiA9IHdyaXRhYmxlKCk7XG5leHBvcnQgY29uc3Qgc2xvdFRhcmdldEVsZW1lbnQ6IFdyaXRhYmxlPEFzdEVsZW1lbnQgfCB1bmRlZmluZWQ+ID0gd3JpdGFibGUoKTtcblxuZXhwb3J0IGNvbnN0IHJvb3RBc3RFbGVtZW50OiBSZWFkYWJsZTxBc3RFbGVtZW50IHwgdW5kZWZpbmVkPiA9IGRlcml2ZWQoW3BhZ2VdLCAoWyRwYWdlXSkgPT4ge1xuICAvLyBUaGlzIGlzIGEgdmlydHVhbCBBc3RFbGVtZW50IGludGVuZGVkIHRvIHNpbXVsYXRlIHRoZSBwYWdlIGl0c2VsZiB0byByZW9yZGVyIHRoZSBjb21wb25lbnRzIGF0IHRoZSBmaXJzdCBsZXZlbC5cbiAgcmV0dXJuIHsgdGFnOiAncm9vdCcsIGF0dHJzOiB7fSwgY29udGVudDogJHBhZ2UuYXN0IH07XG59KTtcbmV4cG9ydCBjb25zdCBzZWxlY3RlZEFzdEVsZW1lbnQ6IFJlYWRhYmxlPEFzdEVsZW1lbnQgfCB1bmRlZmluZWQ+ID0gZGVyaXZlZChbcGFnZSwgc2VsZWN0ZWRBc3RFbGVtZW50SWRdLCAoWyRwYWdlLCAkc2VsZWN0ZWRBc3RFbGVtZW50SWRdKSA9PiB7XG4gIGlmICgkc2VsZWN0ZWRBc3RFbGVtZW50SWQpIHtcbiAgICBpZiAoJHNlbGVjdGVkQXN0RWxlbWVudElkID09PSAncm9vdCcpIHJldHVybiBnZXQocm9vdEFzdEVsZW1lbnQpO1xuICAgIHJldHVybiBmaW5kQXN0RWxlbWVudCgkcGFnZS5hc3QsICRzZWxlY3RlZEFzdEVsZW1lbnRJZCk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNBc3RFbGVtZW50KG1heWJlTm9kZTogQXN0Tm9kZSk6IG1heWJlTm9kZSBpcyBBc3RFbGVtZW50IHtcbiAgcmV0dXJuIHR5cGVvZiBtYXliZU5vZGUgIT09ICdzdHJpbmcnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEFzdEVsZW1lbnQoYXN0OiBBc3ROb2RlW10sIGlkOiBzdHJpbmcpOiBBc3RFbGVtZW50IHtcbiAgbGV0IGluZGV4ZXMgPSBpZC5zcGxpdChcIi5cIikubWFwKHMgPT4gcGFyc2VJbnQocywgMTApKTtcbiAgbGV0IG5vZGU6IEFzdE5vZGUgPSBhc3RbaW5kZXhlc1swXV0gYXMgQXN0RWxlbWVudFxuICBhc3QgPSBub2RlLmNvbnRlbnQ7XG4gIGZvcihsZXQgaSA9IDE7IGkgPCBpbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbm9kZSA9IGFzdFtpbmRleGVzW2ldXSBhcyBBc3RFbGVtZW50OyBcbiAgICBhc3QgPSBub2RlLmNvbnRlbnQ7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5leHBvcnQgZnVuY3Rpb24gZmluZEFzdEVsZW1lbnRJZChhc3ROb2RlOiBBc3ROb2RlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgbGV0ICRwYWdlID0gZ2V0KHBhZ2UpO1xuICByZXR1cm4gX2ZpbmRBc3RFbGVtZW50SWQoJHBhZ2UuYXN0LCBhc3ROb2RlLCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9maW5kQXN0RWxlbWVudElkKGFzdDogQXN0Tm9kZVtdLCBhc3ROb2RlOiBBc3ROb2RlLCBpZDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGFzdC5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjdXJyZW50Tm9kZSA9IGFzdFtpXTtcbiAgICBpZiAoY3VycmVudE5vZGUgPT09IGFzdE5vZGUpIHtcbiAgICAgIHJldHVybiBpZCArIGk7XG4gICAgfSBlbHNlIGlmIChpc0FzdEVsZW1lbnQoY3VycmVudE5vZGUpKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gX2ZpbmRBc3RFbGVtZW50SWQoY3VycmVudE5vZGUuY29udGVudCwgYXN0Tm9kZSwgaWQgKyBpICsgXCIuXCIpO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IGlzQXN0RWxlbWVudCB9IGZyb20gJyRsaWIvc3RvcmVzL3BhZ2UnO1xuICBpbXBvcnQgdHlwZSB7IEFzdE5vZGUgfSBmcm9tICckbGliL3R5cGVzJztcbiAgZXhwb3J0IGxldCBub2RlOiBBc3ROb2RlO1xuPC9zY3JpcHQ+XG5cbnsjaWYgaXNBc3RFbGVtZW50KG5vZGUpfVxuICB7I2lmIG5vZGUudGFnID09PSAnaHRtbF9jb21tZW50J31cbiAgICB7QGh0bWwgXCI8IS0tXCIgKyBub2RlLmNvbnRlbnQgKyBcIi0tPlwifVxuICB7OmVsc2UgaWYgbm9kZS50YWcgPT09ICdlZXhfY29tbWVudCd9XG4gICAge0BodG1sIFwiPCEtLVwiICsgbm9kZS5jb250ZW50ICsgXCItLT5cIn1cbiAgezplbHNlIGlmIG5vZGUudGFnID09PSAnZWV4JyAmJiBub2RlLmNvbnRlbnRbMF0gPT09ICdAaW5uZXJfY29udGVudCd9XG4gICAgPHNsb3QvPlxuICB7OmVsc2UgaWYgbm9kZS5yZW5kZXJlZF9odG1sfVxuICAgIHtAaHRtbCBub2RlLnJlbmRlcmVkX2h0bWx9XG4gIHs6ZWxzZSBpZiBub2RlLmF0dHJzLnNlbGZDbG9zZX1cbiAgICA8c3ZlbHRlOmVsZW1lbnQgdGhpcz17bm9kZS50YWd9IHsuLi5ub2RlLmF0dHJzfS8+XG4gIHs6ZWxzZX1cbiAgICA8c3ZlbHRlOmVsZW1lbnQgdGhpcz17bm9kZS50YWd9IHsuLi5ub2RlLmF0dHJzfT5cbiAgICAgIHsjZWFjaCBub2RlLmNvbnRlbnQgYXMgc3Vibm9kZSwgaW5kZXh9XG4gICAgICAgIDxzdmVsdGU6c2VsZiBub2RlPXtzdWJub2RlfS8+XG4gICAgICB7L2VhY2h9XG4gICAgPC9zdmVsdGU6ZWxlbWVudD5cbiAgey9pZn1cbns6ZWxzZX1cbiAge25vZGV9XG57L2lmfVxuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IHNlbGVjdGVkQXN0RWxlbWVudCwgc2xvdFRhcmdldEVsZW1lbnQsIHNlbGVjdGVkQXN0RWxlbWVudElkLCBoaWdobGlnaHRlZEFzdEVsZW1lbnQsIGlzQXN0RWxlbWVudCB9IGZyb20gJyRsaWIvc3RvcmVzL3BhZ2UnO1xuICBpbXBvcnQgdHlwZSB7IEFzdE5vZGUgfSBmcm9tICckbGliL3R5cGVzJztcbiAgZXhwb3J0IGxldCBub2RlOiBBc3ROb2RlO1xuICBleHBvcnQgbGV0IG5vZGVJZDogc3RyaW5nO1xuICBpbXBvcnQgeyBkcmFnZ2VkT2JqZWN0IH0gZnJvbSAnJGxpYi9zdG9yZXMvZHJhZ0FuZERyb3AnO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZURyYWdFbnRlcigpIHtcbiAgICBpZiAoaXNBc3RFbGVtZW50KG5vZGUpICYmICRkcmFnZ2VkT2JqZWN0Py5jYXRlZ29yeSA9PT0gJ2Jhc2ljJykge1xuICAgICAgJHNsb3RUYXJnZXRFbGVtZW50ID0gbm9kZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVEcmFnTGVhdmUoKSB7XG4gICAgaWYgKGlzQXN0RWxlbWVudChub2RlKSAmJiAkZHJhZ2dlZE9iamVjdD8uY2F0ZWdvcnkgPT09ICdiYXNpYycgJiYgJHNsb3RUYXJnZXRFbGVtZW50ID09PSBub2RlKSB7XG4gICAgICAkc2xvdFRhcmdldEVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTW91c2VPdmVyKCkge1xuICAgIGlzQXN0RWxlbWVudChub2RlKSAmJiAoJGhpZ2hsaWdodGVkQXN0RWxlbWVudCA9IG5vZGUpO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZU1vdXNlT3V0KCkge1xuICAgICRoaWdobGlnaHRlZEFzdEVsZW1lbnQgPSB1bmRlZmluZWRcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9IG5vZGVJZFxuICB9XG5cbiAgLy8gV2hlbiByZW5kZXJpbmcgcmF3IGh0bWwsIHdlIGNhbid0IGFkZCB0aGUgdXN1YWwgY2xhc3NlcyB0byB0aGUgd3JhcHBlci5cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0Q29udGVudCh3cmFwcGVyRGl2OiBIVE1MRWxlbWVudCwgeyBzZWxlY3RlZCwgaGlnaGxpZ2h0ZWQgfTogeyBzZWxlY3RlZDogYm9vbGVhbiwgaGlnaGxpZ2h0ZWQ6IGJvb2xlYW4gfSkge1xuICAgIGxldCBzdGFydHNXaXRoT25lQ2hpbGRyZW4gPSB3cmFwcGVyRGl2LmNoaWxkcmVuLmxlbmd0aCA9PT0gMTtcbiAgICBpZiAoc3RhcnRzV2l0aE9uZUNoaWxkcmVuKSB7XG4gICAgICBsZXQgY2hpbGQgPSB3cmFwcGVyRGl2LmNoaWxkcmVuWzBdO1xuICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgU3RyaW5nKHNlbGVjdGVkKSk7XG4gICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaGlnaGxpZ2h0ZWQnLCBTdHJpbmcoaGlnaGxpZ2h0ZWQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZSh7IHNlbGVjdGVkLCBoaWdobGlnaHRlZCB9OiB7IHNlbGVjdGVkOiBib29sZWFuLCBoaWdobGlnaHRlZDogYm9vbGVhbiB9KSB7XG4gICAgICAgIGlmICh3cmFwcGVyRGl2LmNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGxldCBjaGlsZCA9IHdyYXBwZXJEaXYuY2hpbGRyZW5bMF07XG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgU3RyaW5nKHNlbGVjdGVkKSk7XG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWhpZ2hsaWdodGVkJywgU3RyaW5nKGhpZ2hsaWdodGVkKSk7XG4gICAgICAgIH0gZWxzZSBpZiAod3JhcHBlckRpdi5jaGlsZHJlbi5sZW5ndGggPT09IDAgJiYgd3JhcHBlckRpdi5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHdyYXBwZXJEaXYuc2V0QXR0cmlidXRlKCdkYXRhLW5vY2hpbGRyZW4nLCBcInRydWVcIik7XG4gICAgICAgICAgd3JhcHBlckRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0ZWQnLCBTdHJpbmcoc2VsZWN0ZWQpKTtcbiAgICAgICAgICB3cmFwcGVyRGl2LnNldEF0dHJpYnV0ZSgnZGF0YS1oaWdobGlnaHRlZCcsIFN0cmluZyhoaWdobGlnaHRlZCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0c1dpdGhPbmVDaGlsZHJlbikge1xuICAgICAgICAgIEFycmF5LmZyb20od3JhcHBlckRpdi5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBjaGlsZC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIGNoaWxkLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1oaWdobGlnaHRlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gbm9vcFxuICAgICAgfVxuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbnsjaWYgaXNBc3RFbGVtZW50KG5vZGUpfVxuICB7I2lmIG5vZGUudGFnID09PSAnaHRtbF9jb21tZW50J31cbiAgICB7QGh0bWwgXCI8IS0tXCIgKyBub2RlLmNvbnRlbnQgKyBcIi0tPlwifVxuICB7OmVsc2UgaWYgbm9kZS50YWcgPT09ICdlZXhfY29tbWVudCd9XG4gICAge0BodG1sIFwiPCEtLVwiICsgbm9kZS5jb250ZW50ICsgXCItLT5cIn1cbiAgezplbHNlIGlmIG5vZGUudGFnID09PSAnZWV4JyAmJiBub2RlLmNvbnRlbnRbMF0gPT09ICdAaW5uZXJfY29udGVudCd9XG4gICAgPHNsb3QvPlxuICB7OmVsc2UgaWYgbm9kZS5yZW5kZXJlZF9odG1sfVxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiY29udGVudHNcIlxuICAgICAgb246bW91c2VvdmVyfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlTW91c2VPdmVyfVxuICAgICAgb246bW91c2VvdXR8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVNb3VzZU91dH1cbiAgICAgIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0fHN0b3BQcm9wYWdhdGlvbj17KCkgPT4gJHNlbGVjdGVkQXN0RWxlbWVudElkID0gbm9kZUlkfVxuICAgICAgdXNlOmhpZ2hsaWdodENvbnRlbnQ9e3tzZWxlY3RlZDogJHNlbGVjdGVkQXN0RWxlbWVudCA9PT0gbm9kZSwgaGlnaGxpZ2h0ZWQ6ICRoaWdobGlnaHRlZEFzdEVsZW1lbnQgPT09IG5vZGV9fVxuICAgID57QGh0bWwgbm9kZS5yZW5kZXJlZF9odG1sfTwvZGl2PlxuICB7OmVsc2UgaWYgbm9kZS5hdHRycy5zZWxmQ2xvc2V9XG4gICAgPHN2ZWx0ZTplbGVtZW50XG4gICAgICB0aGlzPXtub2RlLnRhZ31cbiAgICAgIHsuLi5ub2RlLmF0dHJzfVxuICAgICAgZGF0YS1zZWxlY3RlZD17JHNlbGVjdGVkQXN0RWxlbWVudCA9PT0gbm9kZX1cbiAgICAgIGRhdGEtaGlnaGxpZ2h0ZWQ9eyRoaWdobGlnaHRlZEFzdEVsZW1lbnQgPT09IG5vZGV9XG4gICAgICBkYXRhLXNsb3QtdGFyZ2V0PXskc2xvdFRhcmdldEVsZW1lbnQgPT09IG5vZGUgJiYgISRzbG90VGFyZ2V0RWxlbWVudC5hdHRycy5zZWxmQ2xvc2V9XG4gICAgICBvbjpkcmFnZW50ZXJ8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVEcmFnRW50ZXJ9XG4gICAgICBvbjpkcmFnbGVhdmV8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVEcmFnTGVhdmV9XG4gICAgICBvbjptb3VzZW92ZXJ8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVNb3VzZU92ZXJ9XG4gICAgICBvbjptb3VzZW91dHxzdG9wUHJvcGFnYXRpb249e2hhbmRsZU1vdXNlT3V0fVxuICAgICAgb246Y2xpY2t8cHJldmVudERlZmF1bHR8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVDbGlja30gLz5cbiAgezplbHNlfVxuICAgIDxzdmVsdGU6ZWxlbWVudFxuICAgICAgdGhpcz17bm9kZS50YWd9XG4gICAgICB7Li4ubm9kZS5hdHRyc31cbiAgICAgIGRhdGEtc2VsZWN0ZWQ9eyRzZWxlY3RlZEFzdEVsZW1lbnQgPT09IG5vZGV9XG4gICAgICBkYXRhLWhpZ2hsaWdodGVkPXskaGlnaGxpZ2h0ZWRBc3RFbGVtZW50ID09PSBub2RlfVxuICAgICAgZGF0YS1zbG90LXRhcmdldD17JHNsb3RUYXJnZXRFbGVtZW50ID09PSBub2RlfVxuICAgICAgb246ZHJhZ2VudGVyfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlRHJhZ0VudGVyfVxuICAgICAgb246ZHJhZ2xlYXZlfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlRHJhZ0xlYXZlfVxuICAgICAgb246bW91c2VvdmVyfHN0b3BQcm9wYWdhdGlvbj17aGFuZGxlTW91c2VPdmVyfVxuICAgICAgb246bW91c2VvdXR8c3RvcFByb3BhZ2F0aW9uPXtoYW5kbGVNb3VzZU91dH1cbiAgICAgIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0fHN0b3BQcm9wYWdhdGlvbj17KCkgPT4gJHNlbGVjdGVkQXN0RWxlbWVudElkID0gbm9kZUlkfT5cbiAgICAgIHsjZWFjaCBub2RlLmNvbnRlbnQgYXMgc3Vibm9kZSwgaW5kZXh9XG4gICAgICAgIDxzdmVsdGU6c2VsZiBub2RlPXtzdWJub2RlfSBub2RlSWQ9XCJ7bm9kZUlkfS57aW5kZXh9XCIvPlxuICAgICAgey9lYWNofVxuICAgIDwvc3ZlbHRlOmVsZW1lbnQ+XG4gIHsvaWZ9XG57OmVsc2V9XG4gIHtub2RlfVxuey9pZn1cbiIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBQYWdlLCBBc3RFbGVtZW50LCBBc3ROb2RlIH0gZnJvbSBcIiRsaWIvdHlwZXNcIlxuICBpbXBvcnQgTGF5b3V0QXN0Tm9kZSBmcm9tICcuL0xheW91dEFzdE5vZGUuc3ZlbHRlJztcbiAgaW1wb3J0IFBhZ2VBc3ROb2RlIGZyb20gJy4vUGFnZUFzdE5vZGUuc3ZlbHRlJztcbiAgaW1wb3J0IEJyb3dzZXJGcmFtZSBmcm9tICcuL0Jyb3dzZXJGcmFtZS5zdmVsdGUnO1xuICBpbXBvcnQgeyBzZWxlY3RlZEFzdEVsZW1lbnRJZCB9IGZyb20gXCIkbGliL3N0b3Jlcy9wYWdlXCI7XG4gIGltcG9ydCB7IGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSB9IGZyb20gXCIkbGliL3N0b3Jlcy9jdXJyZW50Q29tcG9uZW50Q2F0ZWdvcnlcIjtcbiAgaW1wb3J0IHsgcGFnZSwgc2xvdFRhcmdldEVsZW1lbnQgfSBmcm9tIFwiJGxpYi9zdG9yZXMvcGFnZVwiO1xuICBpbXBvcnQgeyBkcmFnZ2VkT2JqZWN0IH0gZnJvbSBcIiRsaWIvc3RvcmVzL2RyYWdBbmREcm9wXCI7XG5cbiAgZXhwb3J0IGxldCBsaXZlO1xuICBsZXQgaXNEcmFnZ2luZ092ZXIgPSBmYWxzZTtcblxuICBhc3luYyBmdW5jdGlvbiBoYW5kbGVEcmFnRHJvcChlOiBEcmFnRXZlbnQpIHtcbiAgICBsZXQgeyB0YXJnZXQgfSA9IGU7XG4gICAgJGN1cnJlbnRDb21wb25lbnRDYXRlZ29yeSA9IG51bGw7XG4gICAgaWYgKCEkZHJhZ2dlZE9iamVjdCkgcmV0dXJuO1xuICAgIGlmICgkZHJhZ2dlZE9iamVjdC5jYXRlZ29yeSA9PT0gJ2Jhc2ljJykge1xuICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSByZXR1cm47XG4gICAgICBpZiAodGFyZ2V0LmlkID09PSAnZmFrZS1icm93c2VyLWNvbnRlbnQnKSByZXR1cm47XG4gICAgICBpZiAoISRzbG90VGFyZ2V0RWxlbWVudCkgcmV0dXJuO1xuICAgICAgaWYgKCRzbG90VGFyZ2V0RWxlbWVudC5hdHRycy5zZWxmQ2xvc2UpIHJldHVybjtcbiAgICAgIGFkZEJhc2ljQ29tcG9uZW50VG9UYXJnZXQoJHNsb3RUYXJnZXRFbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBsaXZlLnB1c2hFdmVudChcInJlbmRlcl9jb21wb25lbnRfaW5fcGFnZVwiLCB7IGNvbXBvbmVudF9pZDogJGRyYWdnZWRPYmplY3QuaWQsIHBhZ2VfaWQ6ICRwYWdlLmlkIH0sICh7YXN0fTogeyBhc3Q6IEFzdE5vZGVbXSB9KSA9PiB7XG4gICAgICAgIC8vIFRoaXMgYXBwZW5kcyBhdCB0aGUgZW5kLiBXZSBtaWdodCB3YW50IGF0IHRoZSBiZWdpbm5pbmcsIG9yIGluIGEgc3BlY2lmaWMgcG9zaXRpb25cbiAgICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogWy4uLiRwYWdlLmFzdCwgLi4uYXN0XSB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpc0RyYWdnaW5nT3ZlciA9IGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gYWRkQmFzaWNDb21wb25lbnRUb1RhcmdldChhc3RFbGVtZW50OiBBc3RFbGVtZW50KSB7XG4gICAgaWYgKCEkZHJhZ2dlZE9iamVjdCkgcmV0dXJuO1xuICAgIGxldCBjb21wb25lbnREZWZpbml0aW9uID0gJGRyYWdnZWRPYmplY3Q7XG4gICAgJGRyYWdnZWRPYmplY3QgPSBudWxsO1xuICAgIGxldCB0YXJnZXROb2RlID0gYXN0RWxlbWVudDtcbiAgICBsaXZlLnB1c2hFdmVudChcInJlbmRlcl9jb21wb25lbnRfaW5fcGFnZVwiLCB7IGNvbXBvbmVudF9pZDogY29tcG9uZW50RGVmaW5pdGlvbi5pZCwgcGFnZV9pZDogJHBhZ2UuaWQgfSwgKHthc3R9OiB7IGFzdDogQXN0Tm9kZVtdIH0pID0+IHtcbiAgICAgIHRhcmdldE5vZGU/LmNvbnRlbnQucHVzaCguLi5hc3QpO1xuICAgICAgJHNsb3RUYXJnZXRFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhZ092ZXIoKSB7XG4gICAgaXNEcmFnZ2luZ092ZXIgPSB0cnVlO1xuICB9XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImZsZXgtMSBweC04IHB5LTQgZmxleCBtYXgtaC1mdWxsXCIgZGF0YS10ZXN0LWlkPVwibWFpblwiPlxuICA8QnJvd3NlckZyYW1lIHBhZ2U9eyRwYWdlfT5cbiAgICA8ZGl2IFxuICAgICAgb246ZHJvcHxwcmV2ZW50RGVmYXVsdD17aGFuZGxlRHJhZ0Ryb3B9XG4gICAgICBvbjpkcmFnb3ZlcnxwcmV2ZW50RGVmYXVsdD17ZHJhZ092ZXJ9XG4gICAgICBzdHlsZT1cIi0tb3V0bGluZWQtaWQ6IHRpdGxlLTFcIlxuICAgICAgaWQ9XCJmYWtlLWJyb3dzZXItY29udGVudFwiXG4gICAgICBjbGFzcz1cImJnLXdoaXRlIHJvdW5kZWQtYi14bCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW4gZmxleC0xIHtpc0RyYWdnaW5nT3ZlciAmJiAnYm9yZGVyLWRhc2hlZCBib3JkZXItYmx1ZS01MDAgYm9yZGVyLTInfVwiIFxuICAgICAgZGF0YS10ZXN0LWlkPVwiYnJvd3Nlci1jb250ZW50XCI+XG4gICAgICA8ZGl2IGlkPVwicGFnZS13cmFwcGVyXCIgY2xhc3M9XCJwLTEgbS0xXCIgZGF0YS1zZWxlY3RlZD17JHNlbGVjdGVkQXN0RWxlbWVudElkID09PSAncm9vdCd9PlxuICAgICAgICB7I2VhY2ggJHBhZ2UubGF5b3V0LmFzdCBhcyBsYXlvdXRBc3ROb2RlfVxuICAgICAgICAgIDxMYXlvdXRBc3ROb2RlIG5vZGU9e2xheW91dEFzdE5vZGV9PlxuICAgICAgICAgICAgeyNlYWNoICRwYWdlLmFzdCBhcyBhc3ROb2RlLCBpbmRleH1cbiAgICAgICAgICAgICAgPFBhZ2VBc3ROb2RlIG5vZGU9e2FzdE5vZGV9IG5vZGVJZD1cIntpbmRleH1cIi8+XG4gICAgICAgICAgICB7L2VhY2h9XG4gICAgICAgICAgPC9MYXlvdXRBc3ROb2RlPlxuICAgICAgICB7L2VhY2h9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9Ccm93c2VyRnJhbWU+XG48L2Rpdj5cblxuPHN0eWxlPlxuICA6Z2xvYmFsKFtkYXRhLXNlbGVjdGVkPVwidHJ1ZVwiXSwgW2RhdGEtaGlnaGxpZ2h0ZWQ9XCJ0cnVlXCJdKSB7XG4gICAgb3V0bGluZS1jb2xvcjogIzA2YjZkNDsgXG4gICAgb3V0bGluZS13aWR0aDogMnB4O1xuICAgIG91dGxpbmUtc3R5bGU6IGRhc2hlZDsgICAgXG4gIH1cbiAgOmdsb2JhbCguY29udGVudHNbZGF0YS1ub2NoaWxkcmVuPVwidHJ1ZVwiXSwgLmNvbnRlbnRzW2RhdGEtbm9jaGlsZHJlbj1cInRydWVcIl0pIHtcbiAgICAvKiBJbiB0aGUgc3BlY2lmaWMgY2FzZSBvZiBhbiBlbGVtZW50IGNvbnRhaW5pbmcgb25seSBhbiBFRVggZXhwcmVzc2lvbiB0aGF0IGdlbmVyYXRlcyBubyBjaGlsZHJlbiAob25seSBhIHRleHQgbm9kZSksXG4gICAgdGhlcmUgaXMgbm8gY2hpbGQgbm9kZSB0byB3aGljaCBhcHBseSB0aGUgc3R5bGVzLCBzbyB3ZSBoYXZlIHRvIGFwcGx5IHRoZW0gdG8gdGhlIHdyYXBwZXIsIHNvIHdlIGhhdmUgdG8gb3ZlcndyaXRlIHRoZVxuICAgIGRpc3BsYXk6IGNvbnRlbnRzIGZvciB0aGUgc3R5bGVzIHRvIGFwcGx5ICovXG4gICAgZGlzcGxheTogaW5saW5lOyBcbiAgfSAgXG4gIDpnbG9iYWwoW2RhdGEtc2xvdC10YXJnZXQ9XCJ0cnVlXCJdKSB7XG4gICAgb3V0bGluZS1jb2xvcjogcmVkOyBcbiAgICBvdXRsaW5lLXdpZHRoOiAycHg7XG4gICAgb3V0bGluZS1zdHlsZTogZGFzaGVkOyAgICBcbiAgfSAgXG48L3N0eWxlPlxuIiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gJ3N2ZWx0ZSc7XG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG48L3NjcmlwdD5cblxuPHNwYW4gY2xhc3M9XCJyb3VuZGVkLWZ1bGwgYmctZ3JheS03MDAgdGV4dC13aGl0ZSB0ZXh0LXhzIGlubGluZS1ibG9jayBweC0zIHB5LTIgbS0xIGxlYWRpbmctNFwiPlxuICA8c2xvdD48L3Nsb3Q+XG4gIDxidXR0b24gXG4gICAgY2xhc3M9XCJyb3VuZGVkLWZ1bGwgaW5saW5lLWJsb2NrIGJnLWdyYXktNzAwIHRleHQtd2hpdGUgbWwtMlwiIFxuICAgIHR5cGU9XCJidXR0b25cIlxuICAgIG9uOmNsaWNrfHByZXZlbnREZWZhdWx0PXsoKSA9PiBkaXNwYXRjaCgnZGVsZXRlJyl9PuKclTwvYnV0dG9uPlxuPC9zcGFuPiIsICI8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICBpbXBvcnQgeyBjcmVhdGVFdmVudERpc3BhdGNoZXIgfSBmcm9tICdzdmVsdGUnO1xuICBpbXBvcnQgdHlwZSB7IEFzdEVsZW1lbnQsIEFzdE5vZGUgfSBmcm9tICckbGliL3R5cGVzJztcbiAgaW1wb3J0IHsgaGlnaGxpZ2h0ZWRBc3RFbGVtZW50LCBmaW5kQXN0RWxlbWVudElkLCBzZWxlY3RlZEFzdEVsZW1lbnRJZCwgaXNBc3RFbGVtZW50IH0gZnJvbSAnJGxpYi9zdG9yZXMvcGFnZSc7XG4gIGltcG9ydCBDb2RlRWRpdG9yIGZyb20gJy4vQ29kZUVkaXRvci5zdmVsdGUnO1xuXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG4gIGV4cG9ydCBsZXQgdmFsdWU6IHN0cmluZyB8IG51bGwgPSAnJztcbiAgZXhwb3J0IGxldCBhc3ROb2RlczogQXN0Tm9kZVtdIHwgbnVsbCA9IG51bGw7XG4gIGV4cG9ydCBsZXQgY2xlYXJPblVwZGF0ZSA9IGZhbHNlO1xuICBleHBvcnQgbGV0IGV4cGFuZGVkID0gdHJ1ZTtcbiAgZXhwb3J0IGxldCBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyc7XG4gIGV4cG9ydCBsZXQgbGFyZ2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgJDogYXN0RWxlbWVudHMgPSAoYXN0Tm9kZXMgfHwgW10pLmZpbHRlcihpc0FzdEVsZW1lbnQpXG5cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QXN0RWxlbWVudChhc3RFbGVtZW50OiBBc3RFbGVtZW50KSB7XG4gICAgJGhpZ2hsaWdodGVkQXN0RWxlbWVudCA9IGFzdEVsZW1lbnQ7XG4gIH1cbiAgZnVuY3Rpb24gdW5oaWdobGlnaHRBc3RFbGVtZW50KCkge1xuICAgICRoaWdobGlnaHRlZEFzdEVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gIH1cbiAgbGV0IGludGVybmFsVmFsdWU6IHN0cmluZyB8IG51bGwgPSBhc3RFbGVtZW50cyA/IG51bGwgOiB2YWx1ZTtcbiAgJDoge1xuICAgIGlmIChhc3ROb2Rlcz8ubGVuZ3RoID09PSAxKSB7XG4gICAgICBsZXQgZmlyc3QgPSBhc3ROb2Rlc1swXTtcbiAgICAgIGlmICghaXNBc3RFbGVtZW50KGZpcnN0KSkge1xuICAgICAgICBpbnRlcm5hbFZhbHVlID0gZmlyc3Q7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhc3ROb2Rlcykge1xuICAgICAgaW50ZXJuYWxWYWx1ZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlS2V5ZG93bihlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYoIShlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpKSByZXR1cm47XG4gICAgbGV0IHRleHQgPSBlLnRhcmdldC52YWx1ZTtcbiAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgdGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDAgJiYgdGV4dCAhPT0gdmFsdWUpIHtcbiAgICAgIGRpc3BhdGNoKCd1cGRhdGUnLCB0ZXh0KTtcbiAgICAgIGlmIChjbGVhck9uVXBkYXRlKSB7XG4gICAgICAgIGludGVybmFsVmFsdWUgPSBudWxsO1xuICAgICAgICBlLnRhcmdldC52YWx1ZSA9ICcnO1xuICAgICAgfSAgICAgICBcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlVGV4dENoYW5nZShlOiBFdmVudCkge1xuICAgIGlmICgoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50IHx8IGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkpIHtcbiAgICAgIGRpc3BhdGNoKCd0ZXh0Q2hhbmdlJywgZS50YXJnZXQudmFsdWUpOyAgICBcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0KGFzdEVsZW1lbnQ6IEFzdEVsZW1lbnQpIHtcbiAgICBsZXQgaWQgPSBmaW5kQXN0RWxlbWVudElkKGFzdEVsZW1lbnQpO1xuICAgICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9IGlkO1xuICB9XG4gIGZ1bmN0aW9uIG1vdmVBc3RFbGVtZW50KG1vdmVtZW50OiBudW1iZXIsIGFzdEVsZW1lbnQ6IEFzdEVsZW1lbnQpIHtcbiAgICBpZiAoIWFzdE5vZGVzKSByZXR1cm47XG4gICAgbGV0IGFzdE5vZGVzQ29weSA9IEFycmF5LmZyb20oYXN0Tm9kZXMpO1xuICAgIGxldCBpbmRleCA9IGFzdE5vZGVzQ29weS5pbmRleE9mKGFzdEVsZW1lbnQpO1xuICAgIGFzdE5vZGVzQ29weS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGFzdE5vZGVzQ29weS5zcGxpY2UoaW5kZXggKyBtb3ZlbWVudCwgMCwgYXN0RWxlbWVudCk7XG4gICAgZGlzcGF0Y2goJ25vZGVzQ2hhbmdlJywgYXN0Tm9kZXNDb3B5KTtcbiAgfVxuPC9zY3JpcHQ+XG5cbjxzZWN0aW9uIGNsYXNzPVwicC00IGJvcmRlci1iIGJvcmRlci1iLWdyYXktMTAwIGJvcmRlci1zb2xpZFwiPlxuICA8aGVhZGVyIGNsYXNzPVwidGV4dC1zbSBtYi0yXCI+XG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJhbGlnbi1taWRkbGUgdGV4dC1iYXNlXCIgb246Y2xpY2s9eygpID0+IGV4cGFuZGVkID0gIWV4cGFuZGVkfT57ZXhwYW5kZWQgPyAn4payJyA6ICfilrwnfTwvYnV0dG9uPlxuICAgIDxzbG90IG5hbWU9XCJoZWFkaW5nXCIgLz5cbiAgICA8IS0tIENsYXNzZXMgLS0+XG4gIDwvaGVhZGVyPlxuICB7I2lmICQkc2xvdHNbJ3ZhbHVlJ119XG4gICAgPHNsb3QgbmFtZT1cImlucHV0XCI+XG4gICAgICA8aW5wdXQgXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgIGNsYXNzPVwidy1mdWxsIHB5LTEgcHgtMiBiZy1ncmF5LTEwMCBib3JkZXItZ3JheS0xMDAgcm91bmRlZC1tZCBsZWFkaW5nLTYgdGV4dC1zbVwiXG4gICAgICAgIHtwbGFjZWhvbGRlcn1cbiAgICAgICAgdmFsdWU9e2ludGVybmFsVmFsdWV9IFxuICAgICAgICBvbjprZXlkb3duPXtoYW5kbGVLZXlkb3dufVxuICAgICAgICBvbjpjaGFuZ2U9e2hhbmRsZVRleHRDaGFuZ2V9PlxuICAgIDwvc2xvdD5cbiAgICA8ZGl2IGNsYXNzPVwicHQtM1wiPjxzbG90IG5hbWU9XCJ2YWx1ZVwiLz48L2Rpdj5cbiAgezplbHNlfVxuICAgIHsjaWYgZXhwYW5kZWR9XG4gICAgICA8c2xvdCBuYW1lPVwiaW5wdXRcIj5cbiAgICAgICAgeyNpZiBpbnRlcm5hbFZhbHVlfVxuICAgICAgICAgIHsjaWYgbGFyZ2V9XG4gICAgICAgICAgICA8IS0tIDxDb2RlRWRpdG9yIHZhbHVlPXtpbnRlcm5hbFZhbHVlfSBvbjpjaGFuZ2U9eyhlKSA9PiBkaXNwYXRjaCgndGV4dENoYW5nZScsIGUuZGV0YWlsKX0vPiAtLT5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSBcbiAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIHB5LTEgcHgtMiBiZy1ncmF5LTEwMCBib3JkZXItZ3JheS0xMDAgcm91bmRlZC1tZCBsZWFkaW5nLTYgdGV4dC1zbVwiXG4gICAgICAgICAgICB7cGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICB2YWx1ZT17aW50ZXJuYWxWYWx1ZX0gXG4gICAgICAgICAgICBvbjprZXlkb3duPXtoYW5kbGVLZXlkb3dufVxuICAgICAgICAgICAgb246Y2hhbmdlPXtoYW5kbGVUZXh0Q2hhbmdlfT48L3RleHRhcmVhPlxuICAgICAgICAgIHs6ZWxzZX1cbiAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIiBcbiAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgcHktMSBweC0yIGJnLWdyYXktMTAwIGJvcmRlci1ncmF5LTEwMCByb3VuZGVkLW1kIGxlYWRpbmctNiB0ZXh0LXNtXCJcbiAgICAgICAgICAgICAge3BsYWNlaG9sZGVyfVxuICAgICAgICAgICAgICB2YWx1ZT17aW50ZXJuYWxWYWx1ZX0gXG4gICAgICAgICAgICAgIG9uOmtleWRvd249e2hhbmRsZUtleWRvd259XG4gICAgICAgICAgICAgIG9uOmNoYW5nZT17aGFuZGxlVGV4dENoYW5nZX0+XG4gICAgICAgICAgey9pZn1cbiAgICAgICAgICB7I2lmICQkc2xvdHNbJ3ZhbHVlJ119XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHQtM1wiPjxzbG90IG5hbWU9XCJ2YWx1ZVwiLz48L2Rpdj5cbiAgICAgICAgICB7L2lmfVxuICAgICAgICB7OmVsc2UgaWYgYXN0RWxlbWVudHN9XG4gICAgICAgICAgeyNlYWNoIGFzdEVsZW1lbnRzIGFzIGFzdEVsZW1lbnQsIGlkeH1cbiAgICAgICAgICAgIDxwIG9uOm1vdXNlZW50ZXI9eygpID0+IGhpZ2hsaWdodEFzdEVsZW1lbnQoYXN0RWxlbWVudCl9IG9uOm1vdXNlbGVhdmU9eygpID0+IHVuaGlnaGxpZ2h0QXN0RWxlbWVudCgpfT5cbiAgICAgICAgICAgICAgJmx0O3thc3RFbGVtZW50LnRhZ30mZ3Q7IEVsZW1lbnQgXG4gICAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJiZy1ibHVlLTUwMCBob3ZlcjpiZy1ibHVlLTcwMCB0ZXh0LXdoaXRlIGlubGluZSBoLTUgdy01IGFsaWduLW1pZGRsZVwiXG4gICAgICAgICAgICAgICAgb246Y2xpY2s9eygpID0+IHNlbGVjdChhc3RFbGVtZW50KX0+XG4gICAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG4gICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPVwiY3VycmVudENvbG9yXCIgZD1cIk00LDNINVY1SDNWNEExLDEgMCAwLDEgNCwzTTIwLDNBMSwxIDAgMCwxIDIxLDRWNUgxOVYzSDIwTTE1LDVWM0gxN1Y1SDE1TTExLDVWM0gxM1Y1SDExTTcsNVYzSDlWNUg3TTIxLDIwQTEsMSAwIDAsMSAyMCwyMUgxOVYxOUgyMVYyME0xNSwyMVYxOUgxN1YyMUgxNU0xMSwyMVYxOUgxM1YyMUgxMU03LDIxVjE5SDlWMjFIN000LDIxQTEsMSAwIDAsMSAzLDIwVjE5SDVWMjFINE0zLDE1SDVWMTdIM1YxNU0yMSwxNVYxN0gxOVYxNUgyMU0zLDExSDVWMTNIM1YxMU0yMSwxMVYxM0gxOVYxMUgyMU0zLDdINVY5SDNWN00yMSw3VjlIMTlWN0gyMVpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYmctZ3JheS01MDAgaG92ZXI6YmctZ3JheS03MDAgZGlzYWJsZWQ6YmctZ3JheS0zMDAgdGV4dC13aGl0ZSBpbmxpbmUgaC01IHctNSBhbGlnbi1taWRkbGVcIlxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpZHggPT09IDB9XG4gICAgICAgICAgICAgICAgb246Y2xpY2s9eygpID0+IG1vdmVBc3RFbGVtZW50KC0xLCBhc3RFbGVtZW50KX0+XG4gICAgICAgICAgICAgICAg4oaRXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYmctZ3JheS01MDAgaG92ZXI6YmctZ3JheS03MDAgZGlzYWJsZWQ6YmctZ3JheS0zMDAgdGV4dC13aGl0ZSBpbmxpbmUgaC01IHctNSBhbGlnbi1taWRkbGVcIlxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtpZHggPT09IGFzdEVsZW1lbnRzLmxlbmd0aCAtIDF9XG4gICAgICAgICAgICAgICAgb246Y2xpY2s9eygpID0+IG1vdmVBc3RFbGVtZW50KDEsIGFzdEVsZW1lbnQpfT5cbiAgICAgICAgICAgICAgICDihpNcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgey9lYWNofVxuICAgICAgICB7L2lmfVxuICAgICAgPC9zbG90PlxuICAgIHsvaWZ9XG4gIHsvaWZ9XG48L3NlY3Rpb24+IiwgIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdGltcG9ydCBQaWxsIGZyb20gJyRsaWIvY29tcG9uZW50cy9QaWxsLnN2ZWx0ZSc7XG5cdGltcG9ydCBTaWRlYmFyU2VjdGlvbiBmcm9tICckbGliL2NvbXBvbmVudHMvU2lkZWJhclNlY3Rpb24uc3ZlbHRlJztcbiAgaW1wb3J0IHsgY3JlYXRlRXZlbnREaXNwYXRjaGVyIH0gZnJvbSAnc3ZlbHRlJztcblx0aW1wb3J0IHsgZHJhZ2dlZE9iamVjdCB9IGZyb20gJyRsaWIvc3RvcmVzL2RyYWdBbmREcm9wJztcbiAgaW1wb3J0IHsgcGFnZSwgc2VsZWN0ZWRBc3RFbGVtZW50LCBzZWxlY3RlZEFzdEVsZW1lbnRJZCwgZmluZEFzdEVsZW1lbnQsIGlzQXN0RWxlbWVudCB9IGZyb20gJyRsaWIvc3RvcmVzL3BhZ2UnO1xuICBpbXBvcnQgdHlwZSB7IEFzdE5vZGUgfSBmcm9tICckbGliL3R5cGVzJztcbiAgZXhwb3J0IGxldCBsaXZlO1xuXG4gIGNvbnN0IGRpc3BhdGNoID0gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgbGV0IGNsYXNzTGlzdDogc3RyaW5nW107XG4gICQ6IHtcbiAgICBsZXQgY2xhc3NBdHRyID0gJHNlbGVjdGVkQXN0RWxlbWVudD8uYXR0cnM/LmNsYXNzO1xuICAgIGNsYXNzTGlzdCA9IGNsYXNzQXR0ciA/IGNsYXNzQXR0ci5zcGxpdChcIiBcIikuZmlsdGVyKGUgPT4gZS50cmltKCkubGVuZ3RoID4gMCkgOiBbXVxuICB9XG4gICQ6IGVkaXRhYmxlQXR0cnMgPSBPYmplY3QuZW50cmllcygkc2VsZWN0ZWRBc3RFbGVtZW50Py5hdHRycyB8fCB7fSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoW2ssIF9dKSA9PiBrICE9PSAnY2xhc3MnICYmIGsgIT09ICdzZWxmQ2xvc2UnICYmICEvZGF0YS0vLnRlc3QoaykpXG4gICQ6IHNpZGViYXJUaXRsZSA9ICRzZWxlY3RlZEFzdEVsZW1lbnQ/LnRhZztcbiAgJDogaXNSb290Tm9kZSA9ICEhJHNlbGVjdGVkQXN0RWxlbWVudElkICYmICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9PT0gJ3Jvb3QnO1xuICAkOiBhdHRyaWJ1dGVzRWRpdGFibGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50Py50YWcgIT09ICdlZXgnO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGFkZENsYXNzKHsgZGV0YWlsOiBuZXdDbGFzcyB9OiBDdXN0b21FdmVudDxzdHJpbmc+KSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlKSB7XG4gICAgICBub2RlLmF0dHJzLmNsYXNzID0gbm9kZS5hdHRycy5jbGFzcyA/IGAke25vZGUuYXR0cnMuY2xhc3N9ICR7bmV3Q2xhc3N9YCA6IG5ld0NsYXNzO1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcmVudE5vZGVJZCgpIHtcbiAgICBpZiAoJHNlbGVjdGVkQXN0RWxlbWVudElkKSB7XG4gICAgICBsZXQgcGFydHMgPSAkc2VsZWN0ZWRBc3RFbGVtZW50SWQuc3BsaXQoXCIuXCIpO1xuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuICdyb290JztcbiAgICAgIHJldHVybiBwYXJ0cy5zbGljZSgwLCAtMSkuam9pbihcIi5cIilcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2VsZWN0UGFyZW50Tm9kZSgpIHtcbiAgICBsZXQgcGFyZW50SWQgPSBwYXJlbnROb2RlSWQoKTtcbiAgICBpZiAocGFyZW50SWQpIHtcbiAgICAgICRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9IHBhcmVudElkO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlKSB7XG4gICAgICBsZXQgbmV3Q2xhc3MgPSBub2RlLmF0dHJzLmNsYXNzLnNwbGl0KFwiIFwiKS5maWx0ZXIoYyA9PiBjICE9PSBjbGFzc05hbWUpLmpvaW4oXCIgXCIpO1xuICAgICAgbm9kZS5hdHRycy5jbGFzcyA9IG5ld0NsYXNzO1xuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH1cbiAgfSAgXG5cbiAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGV4dChlOiBDdXN0b21FdmVudDxzdHJpbmc+KSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlICYmIGlzQXN0RWxlbWVudChub2RlKSkge1xuICAgICAgbm9kZS5jb250ZW50ID0gW2UuZGV0YWlsXVxuICAgICAgbGl2ZS5wdXNoRXZlbnQoXCJ1cGRhdGVfcGFnZV9hc3RcIiwgeyBpZDogJHBhZ2UuaWQsIGFzdDogJHBhZ2UuYXN0IH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZShhdHRyTmFtZTogc3RyaW5nLCBlOiBDdXN0b21FdmVudDxzdHJpbmc+KSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmIChub2RlICYmIGlzQXN0RWxlbWVudChub2RlKSkge1xuICAgICAgbm9kZS5hdHRyc1thdHRyTmFtZV0gPSBlLmRldGFpbDtcbiAgICAgIGxpdmUucHVzaEV2ZW50KFwidXBkYXRlX3BhZ2VfYXN0XCIsIHsgaWQ6ICRwYWdlLmlkLCBhc3Q6ICRwYWdlLmFzdCB9KTsgICAgIFxuICAgIH0gICAgXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWxldGVDb21wb25lbnQoKSB7XG4gICAgbGV0IG5vZGUgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgIGlmICghbm9kZSkgcmV0dXJuO1xuICAgIGlmIChjb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgY29tcG9uZW50PycpKSB7XG4gICAgICBsZXQgcGFyZW50SWQgPSBwYXJlbnROb2RlSWQoKTtcbiAgICAgIGxldCBjb250ZW50ID0gKHBhcmVudElkICYmIHBhcmVudElkICE9PSAncm9vdCcpID8gZmluZEFzdEVsZW1lbnQoJHBhZ2UuYXN0LCBwYXJlbnRJZCk/LmNvbnRlbnQgOiAkcGFnZS5hc3Q7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICBsZXQgdGFyZ2V0SW5kZXggPSAoY29udGVudCBhcyB1bmtub3duW10pLmluZGV4T2Yobm9kZSk7XG4gICAgICAgIGNvbnRlbnQuc3BsaWNlKHRhcmdldEluZGV4LCAxKTtcbiAgICAgICAgJHNlbGVjdGVkQXN0RWxlbWVudElkID0gdW5kZWZpbmVkO1xuICAgICAgICBsaXZlLnB1c2hFdmVudChcInVwZGF0ZV9wYWdlX2FzdFwiLCB7IGlkOiAkcGFnZS5pZCwgYXN0OiAkcGFnZS5hc3QgfSk7XG4gICAgICB9IFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRyb3BJbnNpZGUoKSB7XG4gICAgZGlzcGF0Y2goJ2Ryb3BwZWRJbnRvVGFyZ2V0JywgJHNlbGVjdGVkQXN0RWxlbWVudCk7XG4gIH1cblxuICBsZXQgaXNEcmFnZ2luZ092ZXIgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZHJhZ092ZXIoZTogRHJhZ0V2ZW50KXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaXNEcmFnZ2luZ092ZXIgPSB0cnVlO1xuICAgIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNoYW5nZU5vZGVzKHsgZGV0YWlsOiBub2RlcyB9OiBDdXN0b21FdmVudDxBc3ROb2RlW10+KSB7XG4gICAgaWYgKCRzZWxlY3RlZEFzdEVsZW1lbnRJZCA9PT0gJ3Jvb3QnKSB7XG4gICAgICBsZXQgc2VsZWN0ZWRFbGVtZW50ID0gJHBhZ2U7XG4gICAgICBzZWxlY3RlZEVsZW1lbnQuYXN0ID0gbm9kZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZWxlY3RlZEVsZW1lbnQgPSAkc2VsZWN0ZWRBc3RFbGVtZW50O1xuICAgICAgaWYgKCFzZWxlY3RlZEVsZW1lbnQpIHJldHVybjtcbiAgICAgIHNlbGVjdGVkRWxlbWVudC5jb250ZW50ID0gbm9kZXM7XG4gICAgfVxuICAgIGxpdmUucHVzaEV2ZW50KFwidXBkYXRlX3BhZ2VfYXN0XCIsIHsgaWQ6ICRwYWdlLmlkLCBhc3Q6ICRwYWdlLmFzdCB9KTtcbiAgfSAgXG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cInctNjQgYmctd2hpdGVcIiBkYXRhLXRlc3QtaWQ9XCJyaWdodC1zaWRlYmFyXCI+XG4gIDxkaXYgY2xhc3M9XCJzdGlja3kgdG9wLTBcIj5cbiAgICB7I2lmICRzZWxlY3RlZEFzdEVsZW1lbnR9XG4gICAgICA8ZGl2IGNsYXNzPVwiYm9yZGVyLWIgdGV4dC1sZyBmb250LW1lZGl1bSBsZWFkaW5nLTUgcHQtNyBwci03IHBiLTUgcGwtNCByZWxhdGl2ZVwiPlxuICAgICAgICB7c2lkZWJhclRpdGxlfVxuICAgICAgICB7I2lmICFpc1Jvb3ROb2RlfVxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgXG4gICAgICAgICAgY2xhc3M9XCJhYnNvbHV0ZSBweS0zIHRvcC0zIHJpZ2h0LTVcIiBcbiAgICAgICAgICBvbjpjbGljaz17c2VsZWN0UGFyZW50Tm9kZX0+4oawPC9idXR0b24+ICAgICAgXG4gICAgICAgIHsvaWZ9XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgXG4gICAgICAgICAgY2xhc3M9XCJhYnNvbHV0ZSBweS0zIHRvcC0zIHJpZ2h0LTFcIiBcbiAgICAgICAgICBvbjpjbGljaz17KCkgPT4gJHNlbGVjdGVkQXN0RWxlbWVudElkID0gdW5kZWZpbmVkfT7DlzwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICB7I2lmIGF0dHJpYnV0ZXNFZGl0YWJsZX1cbiAgICAgICAgPFNpZGViYXJTZWN0aW9uIGNsZWFyT25VcGRhdGU9e3RydWV9IG9uOnVwZGF0ZT17YWRkQ2xhc3N9IHBsYWNlaG9sZGVyPVwiQWRkIG5ldyBjbGFzc1wiID5cbiAgICAgICAgICA8c3ZlbHRlOmZyYWdtZW50IHNsb3Q9XCJoZWFkaW5nXCI+Q2xhc3Nlczwvc3ZlbHRlOmZyYWdtZW50PlxuICAgICAgICAgIDxzdmVsdGU6ZnJhZ21lbnQgc2xvdD1cInZhbHVlXCI+XG4gICAgICAgICAgICB7I2VhY2ggY2xhc3NMaXN0IGFzIGNsYXNzTmFtZX1cbiAgICAgICAgICAgICAgPFBpbGwgb246ZGVsZXRlPXsoKSA9PiBkZWxldGVDbGFzcyhjbGFzc05hbWUpfT57Y2xhc3NOYW1lfTwvUGlsbD5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICA8L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgICAgPC9TaWRlYmFyU2VjdGlvbj5cbiAgICAgICAgeyNlYWNoIGVkaXRhYmxlQXR0cnMgYXMgZW50cnkgKGVudHJ5KX1cbiAgICAgICAgICB7QGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSBlbnRyeX1cbiAgICAgICAgICA8U2lkZWJhclNlY3Rpb24gY2xlYXJPblVwZGF0ZT17dHJ1ZX0gdmFsdWU9e3ZhbHVlfSBvbjp0ZXh0Q2hhbmdlPXsoZSkgPT4gdXBkYXRlQXR0cmlidXRlKG5hbWUsIGUpfSBwbGFjZWhvbGRlcj1cIlNldCB7bmFtZX1cIj5cbiAgICAgICAgICAgIDxzdmVsdGU6ZnJhZ21lbnQgc2xvdD1cImhlYWRpbmdcIj57bmFtZX08L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgICAgICA8L1NpZGViYXJTZWN0aW9uPlxuICAgICAgICB7L2VhY2h9XG4gICAgICB7L2lmfVxuXG4gICAgICA8ZGl2IGNsYXNzPVwicmVsYXRpdmVcIj5cbiAgICAgICAgeyNpZiAkZHJhZ2dlZE9iamVjdCAmJiAkZHJhZ2dlZE9iamVjdC5jYXRlZ29yeSA9PT0gXCJiYXNpY1wifVxuICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICBjbGFzcz1cImFic29sdXRlIGgtOCBiZy13aGl0ZSBvcGFjaXR5LTcwIHctZnVsbCBoLWZ1bGwgcC00XCIgXG4gICAgICAgICAgICBjbGFzczpvcGFjaXR5LTkwPXtpc0RyYWdnaW5nT3Zlcn1cbiAgICAgICAgICAgIG9uOmRyb3B8cHJldmVudERlZmF1bHQ9e2Ryb3BJbnNpZGV9IFxuICAgICAgICAgICAgb246ZHJhZ292ZXI9e2RyYWdPdmVyfVxuICAgICAgICAgICAgb246ZHJhZ2xlYXZlPXsoKSA9PiBpc0RyYWdnaW5nT3ZlciA9IGZhbHNlfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggcm91bmRlZC1sZyBvdXRsaW5lLWRhc2hlZCBvdXRsaW5lLTIgaC1mdWxsIHRleHQtY2VudGVyIGp1c3RpZnktY2VudGVyIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICBEcm9wIGNvbXBvbmVudHMgaGVyZVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvaWZ9XG4gICAgICAgIHsjaWYgJHNlbGVjdGVkQXN0RWxlbWVudC5jb250ZW50Lmxlbmd0aCA+IDB9XG4gICAgICAgICAgPFNpZGViYXJTZWN0aW9uIFxuICAgICAgICAgICAgYXN0Tm9kZXM9eyRzZWxlY3RlZEFzdEVsZW1lbnQuY29udGVudH1cbiAgICAgICAgICAgIGxhcmdlPXskc2VsZWN0ZWRBc3RFbGVtZW50LnRhZyA9PT0gJ2VleCd9XG4gICAgICAgICAgICBvbjp0ZXh0Q2hhbmdlPXsoZSkgPT4gdXBkYXRlVGV4dChlKX0gXG4gICAgICAgICAgICBvbjpub2Rlc0NoYW5nZT17Y2hhbmdlTm9kZXN9PlxuICAgICAgICAgICAgPHN2ZWx0ZTpmcmFnbWVudCBzbG90PVwiaGVhZGluZ1wiPkNvbnRlbnQ8L3N2ZWx0ZTpmcmFnbWVudD5cbiAgICAgICAgICA8L1NpZGViYXJTZWN0aW9uPlxuICAgICAgICB7L2lmfVxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgIDxTaWRlYmFyU2VjdGlvbiBleHBhbmRlZD17ZmFsc2V9PlxuICAgICAgICA8c3ZlbHRlOmZyYWdtZW50IHNsb3Q9XCJoZWFkaW5nXCI+RGVsZXRlPC9zdmVsdGU6ZnJhZ21lbnQ+XG4gICAgICAgIDxzdmVsdGU6ZnJhZ21lbnQgc2xvdD1cImlucHV0XCI+XG4gICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgIG9uOmNsaWNrPXtkZWxldGVDb21wb25lbnR9XG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgXG4gICAgICAgICAgICBjbGFzcz1cImJnLXJlZC01MDAgaG92ZXI6YmctcmVkLTcwMCB0ZXh0LXdoaXRlIGZvbnQtYm9sZCBweS0yIHB4LTQgcm91bmRlZCBvdXRsaW5lLWRhc2hlZCBvdXRsaW5lLTIgdy1mdWxsXCI+XG4gICAgICAgICAgICBEZWxldGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9zdmVsdGU6ZnJhZ21lbnQ+XG4gICAgICA8L1NpZGViYXJTZWN0aW9uPlxuICAgIHs6ZWxzZX1cbiAgICAgIDxkaXYgY2xhc3M9XCJwdC04XCI+XG4gICAgICAgIFNlbGVjdCBhIGNvbXBvbmVudCB0byBlZGl0IGl0cyBwcm9wZXJ0aWVzXG4gICAgICA8L2Rpdj5cbiAgICB7L2lmfVxuICA8L2Rpdj5cbjwvZGl2PiAgICAiLCAiPHNjcmlwdCBsYW5nPVwidHNcIj5cblx0aW1wb3J0IENvbXBvbmVudHNTaWRlYmFyIGZyb20gXCIuL0NvbXBvbmVudHNTaWRlYmFyLnN2ZWx0ZVwiO1xuXHRpbXBvcnQgQmFja2Ryb3AgZnJvbSBcIi4vQmFja2Ryb3Auc3ZlbHRlXCI7XG5cdGltcG9ydCBQYWdlUHJldmlldyBmcm9tIFwiLi9QYWdlUHJldmlldy5zdmVsdGVcIjtcblx0aW1wb3J0IFByb3BlcnRpZXNTaWRlYmFyIGZyb20gXCIuL1Byb3BlcnRpZXNTaWRlYmFyLnN2ZWx0ZVwiO1xuXHRpbXBvcnQgeyBwYWdlIGFzIHBhZ2VTdG9yZSB9IGZyb20gXCIkbGliL3N0b3Jlcy9wYWdlXCI7XG5cdGltcG9ydCB0eXBlIHsgQ29tcG9uZW50RGVmaW5pdGlvbiwgUGFnZSB9IGZyb20gXCIkbGliL3R5cGVzXCI7XG5cblx0ZXhwb3J0IGxldCBjb21wb25lbnRzOiBDb21wb25lbnREZWZpbml0aW9uW107XG5cdGV4cG9ydCBsZXQgcGFnZTogUGFnZTtcblx0ZXhwb3J0IGxldCBsaXZlO1xuXHQkOiAkcGFnZVN0b3JlID0gcGFnZTtcblxuXHRmdW5jdGlvbiBhZGRCYXNpY0NvbXBvbmVudFRvVGFyZ2V0KGU6IEN1c3RvbUV2ZW50KSB7XG5cdFx0Ly8gVGhpcyBtZXRob2QgaXMgaW4gUGFnZVByZXZpZXcuIFxuXHR9XG48L3NjcmlwdD5cbjxCYWNrZHJvcC8+XG48ZGl2IGNsYXNzPVwiZmxleCBtaW4taC1zY3JlZW4gYmctZ3JheS0xMDBcIiBkYXRhLXRlc3QtaWQ9XCJhcHAtY29udGFpbmVyXCI+XG5cdDwhLS0gTGVmdCBzaWRlYmFyIC0tPlxuXHQ8Q29tcG9uZW50c1NpZGViYXIge2NvbXBvbmVudHN9Lz5cblxuXHQ8IS0tIE1haW4gLS0+XG5cdDxQYWdlUHJldmlldyB7bGl2ZX0gLz5cblxuXHQ8IS0tIFJpZ2h0IHNpZGViYXIgLS0+XG5cdDxQcm9wZXJ0aWVzU2lkZWJhciBcblx0XHR7bGl2ZX1cblx0XHRvbjpkcm9wcGVkSW50b1RhcmdldD17ZSA9PiBhZGRCYXNpY0NvbXBvbmVudFRvVGFyZ2V0KGUuZGV0YWlsKX0vPlxuPC9kaXY+Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFNQSxPQUFDLFNBQVVBLFNBQVFDLFdBQVU7QUFDM0I7QUFHQSxTQUFDLFdBQVk7QUFDWCxjQUFJLFdBQVc7QUFDZixjQUFJLFVBQVUsQ0FBQyxNQUFNLE9BQU8sVUFBVSxHQUFHO0FBQ3pDLG1CQUFTLElBQUksR0FBRyxJQUFJLFFBQVEsVUFBVSxDQUFDRCxRQUFPLHVCQUF1QixFQUFFLEdBQUc7QUFDeEUsWUFBQUEsUUFBTyx3QkFDTEEsUUFBTyxRQUFRLENBQUMsSUFBSSx1QkFBdUI7QUFDN0MsWUFBQUEsUUFBTyx1QkFDTEEsUUFBTyxRQUFRLENBQUMsSUFBSSxzQkFBc0IsS0FDMUNBLFFBQU8sUUFBUSxDQUFDLElBQUksNkJBQTZCO0FBQUEsVUFDckQ7QUFDQSxjQUFJLENBQUNBLFFBQU87QUFDVixZQUFBQSxRQUFPLHdCQUF3QixTQUFVLFVBQVVFLFVBQVM7QUFDMUQsa0JBQUksV0FBVyxJQUFJLEtBQUssRUFBRSxRQUFRO0FBQ2xDLGtCQUFJLGFBQWEsS0FBSyxJQUFJLEdBQUcsTUFBTSxXQUFXLFNBQVM7QUFDdkQsa0JBQUksS0FBS0YsUUFBTyxXQUFXLFdBQVk7QUFDckMseUJBQVMsV0FBVyxVQUFVO0FBQUEsY0FDaEMsR0FBRyxVQUFVO0FBQ2IseUJBQVcsV0FBVztBQUN0QixxQkFBTztBQUFBLFlBQ1Q7QUFDRixjQUFJLENBQUNBLFFBQU87QUFDVixZQUFBQSxRQUFPLHVCQUF1QixTQUFVLElBQUk7QUFDMUMsMkJBQWEsRUFBRTtBQUFBLFlBQ2pCO0FB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SUFDTCxPQUFPO0FBQ0wsWUFBTSxzREFBc0Q7QUFBQSxJQUM5RDtBQUFBLEVBQ0YsQ0FBQztBQUVELE1BQUksYUFDRixTQUFTLGNBQWMsTUFBTSxFQUFFLGFBQWEsWUFBWSxLQUFLO0FBQy9ELE1BQUksWUFBWSxTQUNiLGNBQWMseUJBQXlCLEVBQ3ZDLGFBQWEsU0FBUztBQUN6QixNQUFJLGFBQWEsSUFBSSxTQUFTLFdBQVcsWUFBWSxRQUFRLFFBQVE7QUFBQSxJQUNuRSxPQUFPLEVBQUUsR0FBRyxTQUFTLFNBQVUsR0FBRyxHQUFHLE1BQU07QUFBQSxJQUMzQyxRQUFRLEVBQUUsYUFBYSxVQUFVO0FBQUEsRUFDbkMsQ0FBQztBQUNELGFBQVcsUUFBUTtBQUNuQixTQUFPLGFBQWE7IiwKICAibmFtZXMiOiBbIndpbmRvdyIsICJkb2N1bWVudCIsICJlbGVtZW50IiwgInRvcGJhciIsICJsb29wIiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJvd25LZXlzIiwgIl9vYmplY3RTcHJlYWQyIiwgImVycm9yTWVzc2FnZXMiLCAidXBkYXRlIiwgImdldFN0YXRlIiwgInN0YXRlIiwgInNldFN0YXRlIiwgImN1cnJ5IiwgImlzT2JqZWN0IiwgImNvbmZpZyIsICJlcnJvckhhbmRsZXIiLCAidGhyb3dFcnJvciIsICJ2YWxpZGF0b3JzIiwgImNvbXBvc2UiLCAicHJvbWlzZSIsICJjb25maWd1cmVMb2FkZXIiLCAicmVxdWlyZSIsICJjb2xvcnMiLCAiaW5kZXgiLCAiZWxlbWVudCIsICJub29wIiwgImVsZW1lbnQiLCAiZmlsZSIsICJub29wIiwgIm5vb3AiLCAibm9vcCIsICJub3ciLCAiZWxlbWVudCIsICJjaGlsZHJlbiIsICJpbnNlcnQiLCAiZGV0YWNoIiwgImVsZW1lbnQiLCAidGV4dCIsICJkZXRhY2giLCAiZWxlbWVudCIsICJpbnNlcnQiLCAiZGV0YWNoIiwgImVsZW1lbnQiLCAiaGFzaCIsICJydWxlcyIsICJkZXRhY2giLCAiZGV0YWNoIiwgImNvbmZpZyIsICJpbml0IiwgInRpY2siLCAibm9vcCIsICJub3ciLCAiY3JlYXRlX2VhY2hfYmxvY2siLCAiaW5zZXJ0IiwgInVwZGF0ZSIsICJpbml0IiwgImluc3RhbmNlIiwgImNyZWF0ZV9mcmFnbWVudCIsICJhcHBlbmRfc3R5bGVzIiwgIm5vb3AiLCAiZGV0YWNoIiwgImNyZWF0ZV9zbG90IiwgImNyZWF0ZSIsICJpbnNlcnQiLCAiYXR0ciIsICJub29wIiwgImluZGV4IiwgImRldGFjaCIsICJ0ZXh0IiwgIm5vb3AiLCAidXBkYXRlIiwgInN1YnNjcmliZSIsICJydW4iLCAiY3R4IiwgImN0eCIsICJwYWdlIiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJvd25LZXlzIiwgIl9vYmplY3RTcHJlYWQyIiwgIl9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIiwgIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsICJfc2xpY2VkVG9BcnJheSIsICJfYXJyYXlXaXRoSG9sZXMiLCAiX2l0ZXJhYmxlVG9BcnJheUxpbWl0IiwgIl91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSIsICJfbm9uSXRlcmFibGVSZXN0IiwgIl9hcnJheUxpa2VUb0FycmF5IiwgIl9kZWZpbmVQcm9wZXJ0eSIsICJvd25LZXlzIiwgIl9vYmplY3RTcHJlYWQyIiwgImNvbXBvc2UiLCAiY3VycnkiLCAiaXNPYmplY3QiLCAiaXNFbXB0eSIsICJpc0Z1bmN0aW9uIiwgImhhc093blByb3BlcnR5IiwgInZhbGlkYXRlQ2hhbmdlcyIsICJlcnJvckhhbmRsZXIiLCAidmFsaWRhdGVTZWxlY3RvciIsICJ2YWxpZGF0ZUhhbmRsZXIiLCAidmFsaWRhdGVJbml0aWFsIiwgInRocm93RXJyb3IiLCAiZXJyb3JNZXNzYWdlcyIsICJ2YWxpZGF0b3JzIiwgImNyZWF0ZSIsICJkaWRTdGF0ZVVwZGF0ZSIsICJ1cGRhdGUiLCAidXBkYXRlU3RhdGUiLCAiZXh0cmFjdENoYW5nZXMiLCAiZ2V0U3RhdGUiLCAic3RhdGUiLCAic2V0U3RhdGUiLCAiaW5kZXgiLCAic3RhdGVfbG9jYWxfZGVmYXVsdCIsICJjb25maWciLCAiY29uZmlnX2RlZmF1bHQiLCAiY3VycnkiLCAiY3VycnlfZGVmYXVsdCIsICJpc09iamVjdCIsICJpc09iamVjdF9kZWZhdWx0IiwgInZhbGlkYXRlQ29uZmlnIiwgImNvbmZpZyIsICJlcnJvckhhbmRsZXIiLCAiaXNPYmplY3RfZGVmYXVsdCIsICJpbmZvcm1BYm91dERlcHJlY2F0aW9uIiwgImVycm9yTWVzc2FnZXMiLCAidGhyb3dFcnJvciIsICJjdXJyeV9kZWZhdWx0IiwgInZhbGlkYXRvcnMiLCAidmFsaWRhdG9yc19kZWZhdWx0IiwgImNvbXBvc2UiLCAiY29tcG9zZV9kZWZhdWx0IiwgIm1lcmdlIiwgIl9vYmplY3RTcHJlYWQyIiwgImRlZXBNZXJnZV9kZWZhdWx0IiwgIkNBTkNFTEFUSU9OX01FU1NBR0UiLCAibWFrZUNhbmNlbGFibGUiLCAicHJvbWlzZSIsICJtYWtlQ2FuY2VsYWJsZV9kZWZhdWx0IiwgIl9zdGF0ZSRjcmVhdGUiLCAic3RhdGVfbG9jYWxfZGVmYXVsdCIsICJjb25maWdfZGVmYXVsdCIsICJfc3RhdGUkY3JlYXRlMiIsICJfc2xpY2VkVG9BcnJheSIsICJnZXRTdGF0ZSIsICJzZXRTdGF0ZSIsICJjb25maWciLCAidmFsaWRhdG9yc19kZWZhdWx0IiwgIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsICJkZWVwTWVyZ2VfZGVmYXVsdCIsICJpbml0IiwgIm1ha2VDYW5jZWxhYmxlX2RlZmF1bHQiLCAid3JhcHBlclByb21pc2UiLCAic3RvcmVNb25hY29JbnN0YW5jZSIsICJjb21wb3NlX2RlZmF1bHQiLCAiaW5qZWN0U2NyaXB0cyIsICJnZXRNb25hY29Mb2FkZXJTY3JpcHQiLCAiY29uZmlndXJlTG9hZGVyIiwgImNyZWF0ZVNjcmlwdCIsICJyZXF1aXJlIiwgIl9fZ2V0TW9uYWNvSW5zdGFuY2UiLCAibG9hZGVyIiwgImxvYWRlcl9kZWZhdWx0IiwgImN0eCIsICJjcmVhdGVfaWZfYmxvY2siLCAiY3R4IiwgImN0eCIsICJjcmVhdGVfZHluYW1pY19lbGVtZW50XzEiLCAiY3JlYXRlX2R5bmFtaWNfZWxlbWVudCIsICJjdHgiLCAiZGlzcGF0Y2giLCAiY3R4IiwgImNyZWF0ZV9pZl9ibG9ja180IiwgImNyZWF0ZV9pZl9ibG9ja18zIiwgImNyZWF0ZV9pZl9ibG9ja180IiwgImNyZWF0ZV9pZl9ibG9ja18zIiwgImNyZWF0ZV9pZl9ibG9ja18yIiwgImNyZWF0ZV9pZl9ibG9ja18xIiwgImN0eCIsICJ0b3BiYXIiXQp9Cg==
