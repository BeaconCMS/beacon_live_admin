var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// vendor/topbar.js
var require_topbar = __commonJS({
  "vendor/topbar.js"(exports, module2) {
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
          window2.requestAnimationFrame = function(callback, element) {
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
              (function loop() {
                progressTimerId = window2.requestAnimationFrame(loop);
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
          (function loop() {
            if (topbar2.progress("+.1") >= 1) {
              canvas.style.opacity -= 0.05;
              if (canvas.style.opacity <= 0.05) {
                canvas.style.display = "none";
                fadeTimerId = null;
                return;
              }
            }
            fadeTimerId = window2.requestAnimationFrame(loop);
          })();
        }
      };
      if (typeof module2 === "object" && typeof module2.exports === "object") {
        module2.exports = topbar2;
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

// js/app.js
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
function throwError(errorMessages3, type) {
  throw new Error(errorMessages3[type] || errorMessages3["default"]);
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
  var update = curry(updateState)(state);
  var validate = curry(validators.changes)(initial);
  var getChanges = curry(extractChanges)(state);
  function getState2() {
    var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
      return state2;
    };
    validators.selector(selector);
    return selector(state.current);
  }
  function setState2(causedChanges) {
    compose(didUpdate, update, validate, getChanges)(causedChanges);
  }
  return [getState2, setState2];
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
function validateConfig(config3) {
  if (!config3)
    errorHandler2("configIsRequired");
  if (!isObject_default(config3))
    errorHandler2("configType");
  if (config3.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config3.urls.monacoBase
      }
    };
  }
  return config3;
}
function informAboutDeprecation() {
  console.warn(errorMessages2.deprecation);
}
function throwError2(errorMessages3, type) {
  throw new Error(errorMessages3[type] || errorMessages3["default"]);
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
function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function(resolve, reject) {
    promise.then(function(val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
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
  var _validators$config = validators_default.config(globalConfig), monaco = _validators$config.monaco, config3 = _objectWithoutProperties(_validators$config, ["monaco"]);
  setState(function(state) {
    return {
      config: deepMerge_default(state.config, config3),
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
function getMonacoLoaderScript(configureLoader2) {
  var state = getState(function(_ref2) {
    var config3 = _ref2.config, reject = _ref2.reject;
    return {
      config: config3,
      reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
  loaderScript.onload = function() {
    return configureLoader2();
  };
  loaderScript.onerror = state.reject;
  return loaderScript;
}
function configureLoader() {
  var state = getState(function(_ref3) {
    var config3 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
    return {
      config: config3,
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
    loader_default.init().then((monaco) => {
      let modelUri = monaco.Uri.parse(this.path);
      let language = this.opts.language;
      let model = monaco.editor.createModel(this.value, language, modelUri);
      this.opts.language = void 0;
      this.opts.model = model;
      this.standalone_code_editor = monaco.editor.create(this.el, this.opts);
      this._onMount.forEach((callback) => callback(monaco));
    });
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

// js/app.js
var Hooks = {};
Hooks.CodeEditorHook = CodeEditorHook;
import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => import_topbar.default.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => import_topbar.default.hide());
window.addEventListener("lme:editor_mounted", (ev) => {
  const hook = ev.detail.hook;
  const editor = ev.detail.editor.standalone_code_editor;
  const eventName = ev.detail.editor.path + "_editor_lost_focus";
  editor.onDidBlurEditorWidget(() => {
    hook.pushEvent(eventName, { value: editor.getValue() });
  });
});
var socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live";
var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
var liveSocket = new LiveView.LiveSocket(socketPath, Phoenix.Socket, {
  hooks: Hooks,
  params: { _csrf_token: csrfToken }
});
liveSocket.connect();
window.liveSocket = liveSocket;
/**
 * @license MIT
 * topbar 2.0.0, 2023-02-04
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=beacon_live_admin.cjs.js.map
