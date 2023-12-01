var BeaconLiveAdmin=(()=>{var fe=Object.create;var G=Object.defineProperty;var de=Object.getOwnPropertyDescriptor;var pe=Object.getOwnPropertyNames;var he=Object.getPrototypeOf,me=Object.prototype.hasOwnProperty;var _e=(t,e,n)=>e in t?G(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var ge=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),xt=(t,e)=>{for(var n in e)G(t,n,{get:e[n],enumerable:!0})},be=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of pe(e))!me.call(t,o)&&o!==n&&G(t,o,{get:()=>e[o],enumerable:!(r=de(e,o))||r.enumerable});return t};var ye=(t,e,n)=>(n=t!=null?fe(he(t)):{},be(e||!t||!t.__esModule?G(n,"default",{value:t,enumerable:!0}):n,t));var b=(t,e,n)=>(_e(t,typeof e!="symbol"?e+"":e,n),n);var wt=ge(($t,U)=>{(function(t,e){"use strict";(function(){for(var l=0,p=["ms","moz","webkit","o"],g=0;g<p.length&&!t.requestAnimationFrame;++g)t.requestAnimationFrame=t[p[g]+"RequestAnimationFrame"],t.cancelAnimationFrame=t[p[g]+"CancelAnimationFrame"]||t[p[g]+"CancelRequestAnimationFrame"];t.requestAnimationFrame||(t.requestAnimationFrame=function(F,it){var j=new Date().getTime(),st=Math.max(0,16-(j-l)),ue=t.setTimeout(function(){F(j+st)},st);return l=j+st,ue}),t.cancelAnimationFrame||(t.cancelAnimationFrame=function(F){clearTimeout(F)})})();var n,r,o,i=null,a=null,f=null,c=function(l,p,g){l.addEventListener?l.addEventListener(p,g,!1):l.attachEvent?l.attachEvent("on"+p,g):l["on"+p]=g},s={autoRun:!0,barThickness:3,barColors:{0:"rgba(26,  188, 156, .9)",".25":"rgba(52,  152, 219, .9)",".50":"rgba(241, 196, 15,  .9)",".75":"rgba(230, 126, 34,  .9)","1.0":"rgba(211, 84,  0,   .9)"},shadowBlur:10,shadowColor:"rgba(0,   0,   0,   .6)",className:null},d=function(){n.width=t.innerWidth,n.height=s.barThickness*5;var l=n.getContext("2d");l.shadowBlur=s.shadowBlur,l.shadowColor=s.shadowColor;var p=l.createLinearGradient(0,0,n.width,0);for(var g in s.barColors)p.addColorStop(g,s.barColors[g]);l.lineWidth=s.barThickness,l.beginPath(),l.moveTo(0,s.barThickness/2),l.lineTo(Math.ceil(r*n.width),s.barThickness/2),l.strokeStyle=p,l.stroke()},u=function(){n=e.createElement("canvas");var l=n.style;l.position="fixed",l.top=l.left=l.right=l.margin=l.padding=0,l.zIndex=100001,l.display="none",s.className&&n.classList.add(s.className),e.body.appendChild(n),c(t,"resize",d)},h={config:function(l){for(var p in l)s.hasOwnProperty(p)&&(s[p]=l[p])},show:function(l){if(!o)if(l){if(f)return;f=setTimeout(()=>h.show(),l)}else o=!0,a!==null&&t.cancelAnimationFrame(a),n||u(),n.style.opacity=1,n.style.display="block",h.progress(0),s.autoRun&&function p(){i=t.requestAnimationFrame(p),h.progress("+"+.05*Math.pow(1-Math.sqrt(r),2))}()},progress:function(l){return typeof l>"u"||(typeof l=="string"&&(l=(l.indexOf("+")>=0||l.indexOf("-")>=0?r:0)+parseFloat(l)),r=l>1?1:l,d()),r},hide:function(){clearTimeout(f),f=null,o&&(o=!1,i!=null&&(t.cancelAnimationFrame(i),i=null),function l(){if(h.progress("+.1")>=1&&(n.style.opacity-=.05,n.style.opacity<=.05)){n.style.display="none",a=null;return}a=t.requestAnimationFrame(l)}())}};typeof U=="object"&&typeof U.exports=="object"?U.exports=h:typeof define=="function"&&define.amd?define(function(){return h}):this.topbar=h}).call($t,window,document)});var ot=ye(wt());function ve(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Et(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),n.push.apply(n,r)}return n}function kt(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Et(Object(n),!0).forEach(function(r){ve(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Et(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function xe(t,e){if(t==null)return{};var n={},r=Object.keys(t),o,i;for(i=0;i<r.length;i++)o=r[i],!(e.indexOf(o)>=0)&&(n[o]=t[o]);return n}function $e(t,e){if(t==null)return{};var n=xe(t,e),r,o;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(o=0;o<i.length;o++)r=i[o],!(e.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}function we(t,e){return Ee(t)||ke(t,e)||Fe(t,e)||Oe()}function Ee(t){if(Array.isArray(t))return t}function ke(t,e){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(t)))){var n=[],r=!0,o=!1,i=void 0;try{for(var a=t[Symbol.iterator](),f;!(r=(f=a.next()).done)&&(n.push(f.value),!(e&&n.length===e));r=!0);}catch(c){o=!0,i=c}finally{try{!r&&a.return!=null&&a.return()}finally{if(o)throw i}}return n}}function Fe(t,e){if(t){if(typeof t=="string")return Ft(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Ft(t,e)}}function Ft(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Oe(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Se(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Ot(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable})),n.push.apply(n,r)}return n}function St(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Ot(Object(n),!0).forEach(function(r){Se(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Ot(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function je(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(r){return e.reduceRight(function(o,i){return i(o)},r)}}function I(t){return function e(){for(var n=this,r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return o.length>=t.length?t.apply(this,o):function(){for(var a=arguments.length,f=new Array(a),c=0;c<a;c++)f[c]=arguments[c];return e.apply(n,[].concat(o,f))}}}function J(t){return{}.toString.call(t).includes("Object")}function Ce(t){return!Object.keys(t).length}function N(t){return typeof t=="function"}function Ae(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Te(t,e){return J(e)||O("changeType"),Object.keys(e).some(function(n){return!Ae(t,n)})&&O("changeField"),e}function Me(t){N(t)||O("selectorType")}function De(t){N(t)||J(t)||O("handlerType"),J(t)&&Object.values(t).some(function(e){return!N(e)})&&O("handlersType")}function Pe(t){t||O("initialIsRequired"),J(t)||O("initialType"),Ce(t)&&O("initialContent")}function Le(t,e){throw new Error(t[e]||t.default)}var Ie={initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"},O=I(Le)(Ie),V={changes:Te,selector:Me,handler:De,initial:Pe};function Ne(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};V.initial(t),V.handler(e);var n={current:t},r=I(Be)(n,e),o=I(qe)(n),i=I(V.changes)(t),a=I(Re)(n);function f(){var s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:function(d){return d};return V.selector(s),s(n.current)}function c(s){je(r,o,i,a)(s)}return[f,c]}function Re(t,e){return N(e)?e(t.current):e}function qe(t,e){return t.current=St(St({},t.current),e),e}function Be(t,e,n){return N(e)?e(t.current):Object.keys(n).forEach(function(r){var o;return(o=e[r])===null||o===void 0?void 0:o.call(e,t.current[r])}),n}var ze={create:Ne},He=ze,We={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1/min/vs"}},Ge=We;function Ue(t){return function e(){for(var n=this,r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return o.length>=t.length?t.apply(this,o):function(){for(var a=arguments.length,f=new Array(a),c=0;c<a;c++)f[c]=arguments[c];return e.apply(n,[].concat(o,f))}}}var Ve=Ue;function Je(t){return{}.toString.call(t).includes("Object")}var Ke=Je;function Xe(t){return t||jt("configIsRequired"),Ke(t)||jt("configType"),t.urls?(Ye(),{paths:{vs:t.urls.monacoBase}}):t}function Ye(){console.warn(At.deprecation)}function Qe(t,e){throw new Error(t[e]||t.default)}var At={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:`Deprecation warning!
    You are using deprecated way of configuration.

    Instead of using
      monaco.config({ urls: { monacoBase: '...' } })
    use
      monaco.config({ paths: { vs: '...' } })

    For more please check the link https://github.com/suren-atoyan/monaco-loader#config
  `},jt=Ve(Qe)(At),Ze={config:Xe},tn=Ze,en=function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return function(o){return n.reduceRight(function(i,a){return a(i)},o)}},nn=en;function Tt(t,e){return Object.keys(e).forEach(function(n){e[n]instanceof Object&&t[n]&&Object.assign(e[n],Tt(t[n],e[n]))}),kt(kt({},t),e)}var rn=Tt,on={type:"cancelation",msg:"operation is manually canceled"};function sn(t){var e=!1,n=new Promise(function(r,o){t.then(function(i){return e?o(on):r(i)}),t.catch(o)});return n.cancel=function(){return e=!0},n}var at=sn,an=He.create({config:Ge,isInitialized:!1,resolve:null,reject:null,monaco:null}),Mt=we(an,2),R=Mt[0],K=Mt[1];function cn(t){var e=tn.config(t),n=e.monaco,r=$e(e,["monaco"]);K(function(o){return{config:rn(o.config,r),monaco:n}})}function ln(){var t=R(function(e){var n=e.monaco,r=e.isInitialized,o=e.resolve;return{monaco:n,isInitialized:r,resolve:o}});if(!t.isInitialized){if(K({isInitialized:!0}),t.monaco)return t.resolve(t.monaco),at(ct);if(window.monaco&&window.monaco.editor)return Dt(window.monaco),t.resolve(window.monaco),at(ct);nn(un,dn)(pn)}return at(ct)}function un(t){return document.body.appendChild(t)}function fn(t){var e=document.createElement("script");return t&&(e.src=t),e}function dn(t){var e=R(function(r){var o=r.config,i=r.reject;return{config:o,reject:i}}),n=fn("".concat(e.config.paths.vs,"/loader.js"));return n.onload=function(){return t()},n.onerror=e.reject,n}function pn(){var t=R(function(n){var r=n.config,o=n.resolve,i=n.reject;return{config:r,resolve:o,reject:i}}),e=window.require;e.config(t.config),e(["vs/editor/editor.main"],function(n){Dt(n),t.resolve(n)},function(n){t.reject(n)})}function Dt(t){R().monaco||K({monaco:t})}function hn(){return R(function(t){var e=t.monaco;return e})}var ct=new Promise(function(t,e){return K({resolve:t,reject:e})}),mn={config:cn,init:ln,__getMonacoInstance:hn},Ct=mn,lt={background:"#282c34",default:"#c4cad6",lightRed:"#e06c75",blue:"#61afef",gray:"#8c92a3",green:"#98c379",purple:"#c678dd",red:"#be5046",teal:"#56b6c2",peach:"#d19a66"},_n=t=>[{token:"",foreground:t.default},{token:"variable",foreground:t.lightRed},{token:"constant",foreground:t.blue},{token:"constant.character.escape",foreground:t.blue},{token:"comment",foreground:t.gray},{token:"number",foreground:t.blue},{token:"regexp",foreground:t.lightRed},{token:"type",foreground:t.lightRed},{token:"string",foreground:t.green},{token:"keyword",foreground:t.purple},{token:"operator",foreground:t.peach},{token:"delimiter.bracket.embed",foreground:t.red},{token:"sigil",foreground:t.teal},{token:"function",foreground:t.blue},{token:"function.call",foreground:t.default},{token:"emphasis",fontStyle:"italic"},{token:"strong",fontStyle:"bold"},{token:"keyword.md",foreground:t.lightRed},{token:"keyword.table",foreground:t.lightRed},{token:"string.link.md",foreground:t.blue},{token:"variable.md",foreground:t.teal},{token:"string.md",foreground:t.default},{token:"variable.source.md",foreground:t.default},{token:"tag",foreground:t.lightRed},{token:"metatag",foreground:t.lightRed},{token:"attribute.name",foreground:t.peach},{token:"attribute.value",foreground:t.green},{token:"string.key",foreground:t.lightRed},{token:"keyword.json",foreground:t.blue},{token:"operator.sql",foreground:t.purple}],gn={base:"vs-dark",inherit:!1,rules:_n(lt),colors:{"editor.background":lt.background,"editor.foreground":lt.default,"editorLineNumber.foreground":"#636d83","editorCursor.foreground":"#636d83","editor.selectionBackground":"#3e4451","editor.findMatchHighlightBackground":"#528bff3d","editorSuggestWidget.background":"#21252b","editorSuggestWidget.border":"#181a1f","editorSuggestWidget.selectedBackground":"#2c313a","input.background":"#1b1d23","input.border":"#181a1f","editorBracketMatch.border":"#282c34","editorBracketMatch.background":"#3e4451"}},bn=class{constructor(t,e,n,r){this.el=t,this.path=e,this.value=n,this.opts=r,this.standalone_code_editor=null,this._onMount=[]}isMounted(){return!!this.standalone_code_editor}mount(){if(this.isMounted())throw new Error("The monaco editor is already mounted");this._mountEditor()}onMount(t){this._onMount.push(t)}dispose(){if(this.isMounted()){let t=this.standalone_code_editor.getModel();t&&t.dispose(),this.standalone_code_editor.dispose()}}_mountEditor(){this.opts.value=this.value,Ct.config({paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs"}}),Ct.init().then(t=>{t.editor.defineTheme("default",gn);let e=t.Uri.parse(this.path),n=this.opts.language,r=t.editor.createModel(this.value,n,e);this.opts.language=void 0,this.opts.model=r,this.standalone_code_editor=t.editor.create(this.el,this.opts),this._onMount.forEach(i=>i(t)),this._setScreenDependantEditorOptions(),new ResizeObserver(i=>{console.log("resizeObserver"),i.forEach(()=>{this.el.offsetHeight>0&&(this._setScreenDependantEditorOptions(),this.standalone_code_editor.layout())})}).observe(this.el),this.standalone_code_editor.onDidContentSizeChange(()=>{console.log("onDidContentSizeChanges");let i=this.standalone_code_editor.getContentHeight();this.el.style.height=`${i}px`})})}_setScreenDependantEditorOptions(){window.screen.width<768?this.standalone_code_editor.updateOptions({folding:!1,lineDecorationsWidth:16,lineNumbersMinChars:Math.floor(Math.log10(this.standalone_code_editor.getModel().getLineCount()))+3}):this.standalone_code_editor.updateOptions({folding:!0,lineDecorationsWidth:10,lineNumbersMinChars:5})}},yn=bn,Pt={mounted(){let t=JSON.parse(this.el.dataset.opts);this.codeEditor=new yn(this.el,this.el.dataset.path,this.el.dataset.value,t),this.codeEditor.onMount(e=>{this.el.dispatchEvent(new CustomEvent("lme:editor_mounted",{detail:{hook:this,editor:this.codeEditor},bubbles:!0})),this.handleEvent("lme:change_language:"+this.el.dataset.path,n=>{let r=this.codeEditor.standalone_code_editor.getModel();r.getLanguageId()!==n.mimeTypeOrLanguageId&&e.editor.setModelLanguage(r,n.mimeTypeOrLanguageId)}),this.handleEvent("lme:set_value:"+this.el.dataset.path,n=>{this.codeEditor.standalone_code_editor.setValue(n.value)}),this.el.querySelectorAll("textarea").forEach(n=>{n.setAttribute("name","live_monaco_editor["+this.el.dataset.path+"]")}),this.el.removeAttribute("data-value"),this.el.removeAttribute("data-opts")}),this.codeEditor.isMounted()||this.codeEditor.mount()},destroyed(){this.codeEditor&&this.codeEditor.dispose()}};function vn(t){if(!Array.isArray(t.default)||!Array.isArray(t.filenames))return t;let e={};for(let[n,r]of t.default.entries()){let o=r.default,i=t.filenames[n].replace("../svelte/","").replace(".svelte","");e[i]=o}return e}function q(t,e){let n=t.el.getAttribute(e);return n?JSON.parse(n):{}}function Lt(t){t.parentNode?.removeChild(t)}function It(t,e,n){t.insertBefore(e,n||null)}function Nt(){}function xn(t){let e={};for(let n in q(t,"data-slots")){let r=()=>({getElement(){let o=q(t,"data-slots")[n],i=document.createElement("div");return i.innerHTML=atob(o).trim(),i},update(){Lt(this.savedElement),this.savedElement=this.getElement(),It(this.savedTarget,this.savedElement,this.savedAnchor)},c:Nt,m(o,i){this.savedTarget=o,this.savedAnchor=i,this.savedElement=this.getElement(),It(this.savedTarget,this.savedElement,this.savedAnchor)},d(o){o&&Lt(this.savedElement)},l:Nt});e[n]=[r]}return e}function $n(t){let e=q(t,"data-live-json");if(!Array.isArray(e))return e;let n={};for(let r of e){let o=window[r];o&&(n[r]=o)}return n}function X(t){return{...q(t,"data-props"),...$n(t),live:t,$$slots:xn(t),$$scope:{}}}function wn(t){return t.$$.ctx.find(e=>e?.default)}function Rt(t){return t=vn(t),{SvelteHook:{mounted(){let n=this.el.getAttribute("data-name");if(!n)throw new Error("Component name must be provided");let r=t[n];if(!r)throw new Error(`Unable to find ${n} component.`);for(let o of Object.keys(q(this,"data-live-json")))window.addEventListener(`${o}_initialized`,i=>this._instance.$set(X(this)),!1),window.addEventListener(`${o}_patched`,i=>this._instance.$set(X(this)),!1);this._instance=new r({target:this.el,props:X(this),hydrate:this.el.hasAttribute("data-ssr")})},updated(){this._instance.$set(X(this));let n=wn(this._instance);for(let r in n)n[r][0]().update()},destroyed(){}}}}var vt={};xt(vt,{default:()=>Qn,filenames:()=>Zn});var yt={};xt(yt,{default:()=>Xn});function E(){}function ut(t){return t()}function Y(){return Object.create(null)}function x(t){t.forEach(ut)}function Q(t){return typeof t=="function"}function qt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Bt(t){return Object.keys(t).length===0}var ft=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;var T=class{constructor(e){b(this,"_listeners","WeakMap"in ft?new WeakMap:void 0);b(this,"_observer");b(this,"options");this.options=e}observe(e,n){return this._listeners.set(e,n),this._getObserver().observe(e,this.options),()=>{this._listeners.delete(e),this._observer.unobserve(e)}}_getObserver(){return this._observer??(this._observer=new ResizeObserver(e=>{for(let n of e)T.entries.set(n.target,n),this._listeners.get(n.target)?.(n)}))}};T.entries="WeakMap"in ft?new WeakMap:void 0;var Z=!1;function zt(){Z=!0}function Ht(){Z=!1}function Fn(t,e,n,r){for(;t<e;){let o=t+(e-t>>1);n(o)<=r?t=o+1:e=o}return t}function On(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){let c=[];for(let s=0;s<e.length;s++){let d=e[s];d.claim_order!==void 0&&c.push(d)}e=c}let n=new Int32Array(e.length+1),r=new Int32Array(e.length);n[0]=-1;let o=0;for(let c=0;c<e.length;c++){let s=e[c].claim_order,d=(o>0&&e[n[o]].claim_order<=s?o+1:Fn(1,o,h=>e[n[h]].claim_order,s))-1;r[c]=n[d]+1;let u=d+1;n[u]=c,o=Math.max(u,o)}let i=[],a=[],f=e.length-1;for(let c=n[o]+1;c!=0;c=r[c-1]){for(i.push(e[c-1]);f>=c;f--)a.push(e[f]);f--}for(;f>=0;f--)a.push(e[f]);i.reverse(),a.sort((c,s)=>c.claim_order-s.claim_order);for(let c=0,s=0;c<a.length;c++){for(;s<i.length&&a[c].claim_order>=i[s].claim_order;)s++;let d=s<i.length?i[s]:null;t.insertBefore(a[c],d)}}function Wt(t,e){t.appendChild(e)}function Gt(t,e,n){let r=Ut(t);if(!r.getElementById(e)){let o=y("style");o.id=e,o.textContent=n,Sn(r,o)}}function Ut(t){if(!t)return document;let e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Sn(t,e){return Wt(t.head||t,e),e.sheet}function v(t,e){if(Z){for(On(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function dt(t,e,n){t.insertBefore(e,n||null)}function S(t,e,n){Z&&!n?v(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function m(t){t.parentNode&&t.parentNode.removeChild(t)}function pt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function y(t){return document.createElement(t)}function M(t){return document.createTextNode(t)}function B(){return M(" ")}function ht(){return M("")}function tt(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function _(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Vt(t){return t.dataset.svelteH}function $(t){return Array.from(t.childNodes)}function jn(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function Jt(t,e,n,r,o=!1){jn(t);let i=(()=>{for(let a=t.claim_info.last_index;a<t.length;a++){let f=t[a];if(e(f)){let c=n(f);return c===void 0?t.splice(a,1):t[a]=c,o||(t.claim_info.last_index=a),f}}for(let a=t.claim_info.last_index-1;a>=0;a--){let f=t[a];if(e(f)){let c=n(f);return c===void 0?t.splice(a,1):t[a]=c,o?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=a,f}}return r()})();return i.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,i}function Cn(t,e,n,r){return Jt(t,o=>o.nodeName===e,o=>{let i=[];for(let a=0;a<o.attributes.length;a++){let f=o.attributes[a];n[f.name]||i.push(f.name)}i.forEach(a=>o.removeAttribute(a))},()=>r(e))}function w(t,e,n){return Cn(t,e,n,y)}function et(t,e){return Jt(t,n=>n.nodeType===3,n=>{let r=""+e;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>M(e),!0)}function z(t){return et(t," ")}function Kt(t,e){let n=[],r=0;for(let o of e.childNodes)if(o.nodeType===8){let i=o.textContent.trim();i===`HEAD_${t}_END`?(r-=1,n.push(o)):i===`HEAD_${t}_START`&&(r+=1,n.push(o))}else r>0&&n.push(o);return n}function Xt(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var D;function k(t){D=t}var C=[];var Qt=[],L=[],Zt=[],Ln=Promise.resolve(),_t=!1;function te(){_t||(_t=!0,Ln.then(nt))}function H(t){L.push(t)}var mt=new Set,P=0;function nt(){if(P!==0)return;let t=D;do{try{for(;P<C.length;){let e=C[P];P++,k(e),In(e.$$)}}catch(e){throw C.length=0,P=0,e}for(k(null),C.length=0,P=0;Qt.length;)Qt.pop()();for(let e=0;e<L.length;e+=1){let n=L[e];mt.has(n)||(mt.add(n),n())}L.length=0}while(C.length);for(;Zt.length;)Zt.pop()();_t=!1,mt.clear(),k(t)}function In(t){if(t.fragment!==null){t.update(),x(t.before_update);let e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(H)}}function ee(t){let e=[],n=[];L.forEach(r=>t.indexOf(r)===-1?e.push(r):n.push(r)),n.forEach(r=>r()),L=e}var Nn=new Set;function rt(t,e){t&&t.i&&(Nn.delete(t),t.i(e))}function A(t){return t?.length!==void 0?t:Array.from(t)}var qn=["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"],Bn=new Set([...qn]);function Hn(t,e,n){let{fragment:r,after_update:o}=t.$$;r&&r.m(e,n),H(()=>{let i=t.$$.on_mount.map(ut).filter(Q);t.$$.on_destroy?t.$$.on_destroy.push(...i):x(i),t.$$.on_mount=[]}),o.forEach(H)}function Wn(t,e){let n=t.$$;n.fragment!==null&&(ee(n.after_update),x(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Gn(t,e){t.$$.dirty[0]===-1&&(C.push(t),te(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ne(t,e,n,r,o,i,a=null,f=[-1]){let c=D;k(t);let s=t.$$={fragment:null,ctx:[],props:i,update:E,not_equal:o,bound:Y(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:Y(),dirty:f,skip_bound:!1,root:e.target||c.$$.root};a&&a(s.root);let d=!1;if(s.ctx=n?n(t,e.props||{},(u,h,...l)=>{let p=l.length?l[0]:h;return s.ctx&&o(s.ctx[u],s.ctx[u]=p)&&(!s.skip_bound&&s.bound[u]&&s.bound[u](p),d&&Gn(t,u)),h}):[],s.update(),d=!0,x(s.before_update),s.fragment=r?r(s.ctx):!1,e.target){if(e.hydrate){zt();let u=$(e.target);s.fragment&&s.fragment.l(u),u.forEach(m)}else s.fragment&&s.fragment.c();e.intro&&rt(t.$$.fragment),Hn(t,e.target,e.anchor),Ht(),nt()}k(c)}var Un;typeof HTMLElement=="function"&&(Un=class extends HTMLElement{constructor(e,n,r){super();b(this,"$$ctor");b(this,"$$s");b(this,"$$c");b(this,"$$cn",!1);b(this,"$$d",{});b(this,"$$r",!1);b(this,"$$p_d",{});b(this,"$$l",{});b(this,"$$l_u",new Map);this.$$ctor=e,this.$$s=n,r&&this.attachShadow({mode:"open"})}addEventListener(e,n,r){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(n),this.$$c){let o=this.$$c.$on(e,n);this.$$l_u.set(n,o)}super.addEventListener(e,n,r)}removeEventListener(e,n,r){if(super.removeEventListener(e,n,r),this.$$c){let o=this.$$l_u.get(n);o&&(o(),this.$$l_u.delete(n))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(i){return()=>{let a;return{c:function(){a=y("slot"),i!=="default"&&_(a,"name",i)},m:function(s,d){dt(s,a,d)},d:function(s){s&&m(a)}}}};if(await Promise.resolve(),!this.$$cn)return;let n={},r=Xt(this);for(let i of this.$$s)i in r&&(n[i]=[e(i)]);for(let i of this.attributes){let a=this.$$g_p(i.name);a in this.$$d||(this.$$d[a]=gt(a,i.value,this.$$p_d,"toProp"))}this.$$c=new this.$$ctor({target:this.shadowRoot||this,props:{...this.$$d,$$slots:n,$$scope:{ctx:[]}}});let o=()=>{this.$$r=!0;for(let i in this.$$p_d)if(this.$$d[i]=this.$$c.$$.ctx[this.$$c.$$.props[i]],this.$$p_d[i].reflect){let a=gt(i,this.$$d[i],this.$$p_d,"toAttribute");a==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,a)}this.$$r=!1};this.$$c.$$.after_update.push(o),o();for(let i in this.$$l)for(let a of this.$$l[i]){let f=this.$$c.$on(i,a);this.$$l_u.set(a,f)}this.$$l={}}}attributeChangedCallback(e,n,r){this.$$r||(e=this.$$g_p(e),this.$$d[e]=gt(e,r,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{this.$$cn||(this.$$c.$destroy(),this.$$c=void 0)})}$$g_p(e){return Object.keys(this.$$p_d).find(n=>this.$$p_d[n].attribute===e||!this.$$p_d[n].attribute&&n.toLowerCase()===e)||e}});function gt(t,e,n,r){let o=n[t]?.type;if(e=o==="Boolean"&&typeof e!="boolean"?e!=null:e,!r||!n[t])return e;if(r==="toAttribute")switch(o){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(o){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}var W=class{constructor(){b(this,"$$");b(this,"$$set")}$destroy(){Wn(this,1),this.$destroy=E}$on(e,n){if(!Q(n))return E;let r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{let o=r.indexOf(n);o!==-1&&r.splice(o,1)}}$set(e){this.$$set&&!Bt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}};var re="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(re);function Vn(t){Gt(t,"svelte-1q6nykn","#left-sidebar.svelte-1q6nykn{z-index:1000}")}function oe(t,e,n){let r=t.slice();return r[2]=e[n],r}function ie(t,e,n){let r=t.slice();return r[5]=e[n],r}function se(t){let e,n,r=sectionTitles[t[5].name]+"",o,i,a,f;function c(){return t[1](t[5])}return{c(){e=y("li"),n=y("div"),o=M(r),i=B(),this.h()},l(s){e=w(s,"LI",{class:!0,"data-test-id":!0});var d=$(e);n=w(d,"DIV",{class:!0});var u=$(n);o=et(u,r),u.forEach(m),i=z(d),d.forEach(m),this.h()},h(){_(n,"class","pl-2"),_(e,"class","pb-1"),_(e,"data-test-id","nav-item")},m(s,d){S(s,e,d),v(e,n),v(n,o),v(e,i),a||(f=[tt(e,"mouseenter",c),tt(e,"mouseleave",collapseCategoryMenu)],a=!0)},p(s,d){t=s},d(s){s&&m(e),a=!1,x(f)}}}function ae(t){let e,n,r=t[2].name+"",o,i,a,f=A(t[2].items),c=[];for(let s=0;s<f.length;s+=1)c[s]=se(ie(t,f,s));return{c(){e=y("li"),n=y("h5"),o=M(r),i=B();for(let s=0;s<c.length;s+=1)c[s].c();a=ht(),this.h()},l(s){e=w(s,"LI",{class:!0,"data-test-id":!0});var d=$(e);n=w(d,"H5",{class:!0});var u=$(n);o=et(u,r),u.forEach(m),d.forEach(m),i=z(s);for(let h=0;h<c.length;h+=1)c[h].l(s);a=ht(),this.h()},h(){_(n,"class","uppercase"),_(e,"class","pb-1"),_(e,"data-test-id","nav-item")},m(s,d){S(s,e,d),v(e,n),v(n,o),S(s,i,d);for(let u=0;u<c.length;u+=1)c[u]&&c[u].m(s,d);S(s,a,d)},p(s,d){if(d&1){f=A(s[2].items);let u;for(u=0;u<f.length;u+=1){let h=ie(s,f,u);c[u]?c[u].p(h,d):(c[u]=se(h),c[u].c(),c[u].m(a.parentNode,a))}for(;u<c.length;u+=1)c[u].d(1);c.length=f.length}},d(s){s&&(m(e),m(i),m(a)),pt(c,s)}}}function Jn(t){let e,n,r,o,i,a,f='<span class="text-lg">Beacon CMS</span>',c,s,d=A(t[0].menuCategories),u=[];for(let h=0;h<d.length;h+=1)u[h]=ae(oe(t,d,h));return{c(){e=y("meta"),n=B(),r=y("div"),o=y("div"),i=y("div"),a=y("div"),a.innerHTML=f,c=B(),s=y("ul");for(let h=0;h<u.length;h+=1)u[h].c();this.h()},l(h){let l=Kt("svelte-brtbho",document.head);e=w(l,"META",{name:!0,content:!0}),l.forEach(m),n=z(h),r=w(h,"DIV",{class:!0,"data-test-id":!0});var p=$(r);o=w(p,"DIV",{class:!0,id:!0,"data-test-id":!0});var g=$(o);i=w(g,"DIV",{class:!0});var F=$(i);a=w(F,"DIV",{class:!0,"data-test-id":!0,["data-svelte-h"]:!0}),Vt(a)!=="svelte-kosv7d"&&(a.innerHTML=f),c=z(F),s=w(F,"UL",{class:!0,"data-test-id":!0});var it=$(s);for(let j=0;j<u.length;j+=1)u[j].l(it);it.forEach(m),F.forEach(m),g.forEach(m),p.forEach(m),this.h()},h(){document.title="Beacon UI Builder",_(e,"name","description"),_(e,"content","UI builder to compose beacon pages"),_(a,"class","border-b border-gray-100 border-solid py-4 px-4"),_(a,"data-test-id","logo"),_(s,"class","px-4"),_(s,"data-test-id","component-tree"),_(i,"class","sticky top-0"),_(o,"class","w-64 bg-white border-gray-100 border-solid border-r svelte-1q6nykn"),_(o,"id","left-sidebar"),_(o,"data-test-id","left-sidebar"),_(r,"class","flex min-h-screen bg-gray-100"),_(r,"data-test-id","app-container")},m(h,l){v(document.head,e),S(h,n,l),S(h,r,l),v(r,o),v(o,i),v(i,a),v(i,c),v(i,s);for(let p=0;p<u.length;p+=1)u[p]&&u[p].m(s,null)},p(h,[l]){if(l&1){d=A(h[0].menuCategories);let p;for(p=0;p<d.length;p+=1){let g=oe(h,d,p);u[p]?u[p].p(g,l):(u[p]=ae(g),u[p].c(),u[p].m(s,null))}for(;p<u.length;p+=1)u[p].d(1);u.length=d.length}},i:E,o:E,d(h){h&&(m(n),m(r)),m(e),pt(u,h)}}}function Kn(t){return[{menuCategories:[]},r=>void 0]}var bt=class extends W{constructor(e){super(),ne(this,e,Kn,Jn,qt,{},Vn)}},Xn=bt;var Yn=[yt],Qn=Yn,Zn=["../svelte/UiBuilder.svelte"];var ce={};ce.CodeEditorHook=Pt;ot.default.config({barColors:{0:"#29d"},shadowColor:"rgba(0, 0, 0, .3)"});window.addEventListener("phx:page-loading-start",t=>ot.default.show(300));window.addEventListener("phx:page-loading-stop",t=>ot.default.hide());window.addEventListener("lme:editor_mounted",t=>{let e=t.detail.hook,n=t.detail.editor.standalone_code_editor,r=t.detail.editor.path+"_editor_lost_focus";n.onDidBlurEditorWidget(()=>{e.pushEvent(r,{value:n.getValue()})})});window.addEventListener("beacon_admin:clipcopy",t=>{let e=`${t.target.id}-copy-to-clipboard-result`,n=document.getElementById(e);"clipboard"in navigator?(t.target.tagName==="INPUT"?txt=t.target.value:txt=t.target.textContent,navigator.clipboard.writeText(txt).then(()=>{n.innerText="Copied to clipboard",n.classList.remove("invisible","text-red-500","opacity-0"),n.classList.add("text-green-500","opacity-100","-translate-y-2"),setTimeout(function(){n.classList.remove("text-green-500","opacity-100","-translate-y-2"),n.classList.add("invisible","text-red-500","opacity-0")},2e3)}).catch(()=>{n.innerText="Could not copy",n.classList.remove("invisible","text-green-500","opacity-0"),n.classList.add("text-red-500","opacity-100","-translate-y-2")})):alert("Sorry, your browser does not support clipboard copy.")});var tr=document.querySelector("html").getAttribute("phx-socket")||"/live",er=document.querySelector("meta[name='csrf-token']").getAttribute("content"),le=new LiveView.LiveSocket(tr,Phoenix.Socket,{hooks:{...Rt(vt),...ce},params:{_csrf_token:er}});le.connect();window.liveSocket=le;})();
/**
 * @license MIT
 * topbar 2.0.0, 2023-02-04
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */