!function(e,t){"undefined"!=typeof module?module.exports=t():"function"==typeof define&&"object"==typeof define.amd?define("domReady",t):this[e]=t()}("domready",function(){var e,t=[],n=document,r=n.documentElement.doScroll,o="DOMContentLoaded",i=(r?/^loaded|^c/:/^loaded|^i|^c/).test(n.readyState);return i||n.addEventListener(o,e=function(){for(n.removeEventListener(o,e),i=1;e=t.shift();)e()}),function(e){i?setTimeout(e,0):t.push(e)}}),function(e,t){"use strict";function n(){return"undefined"==typeof document?"":document.location.href}function r(e,t){var n,r;if(D){t=t||{},e="raven"+e.substr(0,1).toUpperCase()+e.substr(1),document.createEvent?(n=document.createEvent("HTMLEvents"),n.initEvent(e,!0,!0)):(n=document.createEventObject(),n.eventType=e);for(r in t)d(t,r)&&(n[r]=t[r]);if(document.createEvent)document.dispatchEvent(n);else try{document.fireEvent("on"+n.eventType.toLowerCase(),n)}catch(o){}}}function o(e){this.name="RavenConfigError",this.message=e}function i(e){var t=te.exec(e),n={},r=7;try{for(;r--;)n[ee[r]]=t[r]||""}catch(i){throw new o("Invalid DSN: "+e)}if(n.pass)throw new o("Do not specify your private key in the DSN!");return n}function a(e){return void 0===e}function u(e){return"function"==typeof e}function c(e){return"[object String]"===V.toString.call(e)}function l(e){return"object"==typeof e&&null!==e}function s(e){for(var t in e)return!1;return!0}function f(e){return l(e)&&"[object Error]"===V.toString.call(e)||e instanceof Error}function d(e,t){return V.hasOwnProperty.call(e,t)}function p(e,t){var n,r;if(a(e.length))for(n in e)d(e,n)&&t.call(null,n,e[n]);else if(r=e.length)for(n=0;r>n;n++)t.call(null,n,e[n])}function m(e,t){var n=[];e.stack&&e.stack.length&&p(e.stack,function(e,t){var r=g(t);r&&n.push(r)}),r("handle",{stackInfo:e,options:t}),v(e.name,e.message,e.url,e.lineno,n,t)}function g(e){if(e.url){var t,n={filename:e.url,lineno:e.line,colno:e.column,"function":e.func||"?"},r=h(e);if(r){var o=["pre_context","context_line","post_context"];for(t=3;t--;)n[o[t]]=r[t]}return n.in_app=!(H.includePaths.test&&!H.includePaths.test(n.filename)||/(Raven|TraceKit)\./.test(n["function"])||/raven\.(min\.)?js$/.test(n.filename)),n}}function h(e){if(e.context&&H.fetchContext){for(var t=e.context,n=~~(t.length/2),r=t.length,o=!1;r--;)if(t[r].length>300){o=!0;break}if(o){if(a(e.column))return;return[[],t[n].substr(e.column,50),[]]}return[t.slice(0,n),t[n],t.slice(n+1)]}}function v(e,t,n,r,o,i){var a,u;H.ignoreErrors.test&&H.ignoreErrors.test(t)||(t+="",u=e+": "+t,o&&o.length?(n=o[0].filename||n,o.reverse(),a={frames:o}):n&&(a={frames:[{filename:n,lineno:r,in_app:!0}]}),H.ignoreUrls.test&&H.ignoreUrls.test(n)||(!H.whitelistUrls.test||H.whitelistUrls.test(n))&&S(x({exception:{values:[{type:e,value:t,stacktrace:a}]},culprit:n,message:u},i)))}function x(e,t){return t?(p(t,function(t,n){e[t]=n}),e):e}function y(e,t){return e.length<=t?e:e.substr(0,t)+"…"}function b(e){var t=H.maxMessageLength;if(e.message=y(e.message,t),e.exception){var n=e.exception.values[0];n.value=y(n.value,t)}return e}function w(){return+new Date}function E(){if(D&&document.location&&document.location.href){var e={headers:{"User-Agent":navigator.userAgent}};return e.url=document.location.href,document.referrer&&(e.headers.Referer=document.referrer),e}}function S(e){var t={project:F,logger:H.logger,platform:"javascript"},n=E();n&&(t.request=n),e=x(t,e),e.tags=x(x({},B.tags),e.tags),e.extra=x(x({},B.extra),e.extra),e.extra["session:duration"]=w()-K,s(e.tags)&&delete e.tags,B.user&&(e.user=B.user),H.release&&(e.release=H.release),H.serverName&&(e.server_name=H.serverName),u(H.dataCallback)&&(e=H.dataCallback(e)||e),e&&!s(e)&&(!u(H.shouldSendCallback)||H.shouldSendCallback(e))&&(j=e.event_id||(e.event_id=U()),e=b(e),N("debug","Raven about to send:",e),_()&&(H.transport||C)({url:A,auth:{sentry_version:"7",sentry_client:"raven-js/"+Q.VERSION,sentry_key:I},data:e,options:H,onSuccess:function(){r("success",{data:e,src:A})},onError:function(){r("failure",{data:e,src:A})}}))}function C(e){e.auth.sentry_data=JSON.stringify(e.data);var t=k(),n=e.url+"?"+L(e.auth),r=e.options.crossOrigin;(r||""===r)&&(t.crossOrigin=r),t.onload=e.onSuccess,t.onerror=t.onabort=e.onError,t.src=n}function k(){return document.createElement("img")}function _(){return q?A?!0:(ne||N("error","Error: Raven has not been configured."),ne=!0,!1):!1}function T(e){for(var t,n=[],r=0,o=e.length;o>r;r++)t=e[r],c(t)?n.push(t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1")):t&&t.source&&n.push(t.source);return new RegExp(n.join("|"),"i")}function U(){var t=e.crypto||e.msCrypto;if(!a(t)&&t.getRandomValues){var n=new Uint16Array(8);t.getRandomValues(n),n[3]=4095&n[3]|16384,n[4]=16383&n[4]|32768;var r=function(e){for(var t=e.toString(16);t.length<4;)t="0"+t;return t};return r(n[0])+r(n[1])+r(n[2])+r(n[3])+r(n[4])+r(n[5])+r(n[6])+r(n[7])}return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"==e?t:3&t|8;return n.toString(16)})}function N(e){z[e]&&Q.debug&&z[e].apply(X,P.call(arguments,1))}function R(){var t=e.RavenConfig;t&&Q.config(t.dsn,t.config).install()}function L(e){var t=[];return p(e,function(e,n){t.push(encodeURIComponent(e)+"="+encodeURIComponent(n))}),t.join("&")}function O(e,t){a(t)?delete B[e]:B[e]=x(B[e]||{},t)}var M={remoteFetching:!1,collectWindowErrors:!0,linesOfContext:7,debug:!1},P=[].slice,G="?";M.report=function(){function r(e){c(),g.push(e)}function o(e){for(var t=g.length-1;t>=0;--t)g[t]===e&&g.splice(t,1)}function i(){l(),g=[]}function a(e,t){var n=null;if(!t||M.collectWindowErrors){for(var r in g)if(d(g,r))try{g[r].apply(null,[e].concat(P.call(arguments,2)))}catch(o){n=o}if(n)throw n}}function u(e,t,r,o,i){var u=null;if(x)M.computeStackTrace.augmentStackTraceWithInitialElement(x,t,r,e),s();else if(i)u=M.computeStackTrace(i),a(u,!0);else{var c={url:t,line:r,column:o};c.func=M.computeStackTrace.guessFunctionName(c.url,c.line),c.context=M.computeStackTrace.gatherContext(c.url,c.line),u={message:e,url:n(),stack:[c]},a(u,!0)}return p?p.apply(this,arguments):!1}function c(){m||(p=e.onerror,e.onerror=u,m=!0)}function l(){m&&(e.onerror=p,m=!1,p=t)}function s(){var e=x,t=h;h=null,x=null,v=null,a.apply(null,[e,!1].concat(t))}function f(t,n){var r=P.call(arguments,1);if(x){if(v===t)return;s()}var o=M.computeStackTrace(t);if(x=o,v=t,h=r,e.setTimeout(function(){v===t&&s()},o.incomplete?2e3:0),n!==!1)throw t}var p,m,g=[],h=null,v=null,x=null;return f.subscribe=r,f.unsubscribe=o,f.uninstall=i,f}(),M.computeStackTrace=function(){function t(t){if(!M.remoteFetching)return"";try{var n=function(){try{return new e.XMLHttpRequest}catch(t){return new e.ActiveXObject("Microsoft.XMLHTTP")}},r=n();return r.open("GET",t,!1),r.send(""),r.responseText}catch(o){return""}}function r(e){if(!c(e))return[];if(!d(b,e)){var n="",r="";try{r=document.domain}catch(o){}-1!==e.indexOf(r)&&(n=t(e)),b[e]=n?n.split("\n"):[]}return b[e]}function o(e,t){var n,o=/function ([^(]*)\(([^)]*)\)/,i=/['"]?([0-9A-Za-z$_]+)['"]?\s*[:=]\s*(function|eval|new Function)/,u="",c=10,l=r(e);if(!l.length)return G;for(var s=0;c>s;++s)if(u=l[t-s]+u,!a(u)){if(n=i.exec(u))return n[1];if(n=o.exec(u))return n[1]}return G}function i(e,t){var n=r(e);if(!n.length)return null;var o=[],i=Math.floor(M.linesOfContext/2),u=i+M.linesOfContext%2,c=Math.max(0,t-i-1),l=Math.min(n.length,t+u-1);t-=1;for(var s=c;l>s;++s)a(n[s])||o.push(n[s]);return o.length>0?o:null}function u(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g,"\\$&")}function l(e){return u(e).replace("<","(?:<|&lt;)").replace(">","(?:>|&gt;)").replace("&","(?:&|&amp;)").replace('"','(?:"|&quot;)').replace(/\s+/g,"\\s+")}function s(e,t){for(var n,o,i=0,a=t.length;a>i;++i)if((n=r(t[i])).length&&(n=n.join("\n"),o=e.exec(n)))return{url:t[i],line:n.substring(0,o.index).split("\n").length,column:o.index-n.lastIndexOf("\n",o.index)-1};return null}function f(e,t,n){var o,i=r(t),a=new RegExp("\\b"+u(e)+"\\b");return n-=1,i&&i.length>n&&(o=a.exec(i[n]))?o.index:null}function p(t){if("undefined"!=typeof document){for(var n,r,o,i,a=[e.location.href],c=document.getElementsByTagName("script"),f=""+t,d=/^function(?:\s+([\w$]+))?\s*\(([\w\s,]*)\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,p=/^function on([\w$]+)\s*\(event\)\s*\{\s*(\S[\s\S]*\S)\s*\}\s*$/,m=0;m<c.length;++m){var g=c[m];g.src&&a.push(g.src)}if(o=d.exec(f)){var h=o[1]?"\\s+"+o[1]:"",v=o[2].split(",").join("\\s*,\\s*");n=u(o[3]).replace(/;$/,";?"),r=new RegExp("function"+h+"\\s*\\(\\s*"+v+"\\s*\\)\\s*{\\s*"+n+"\\s*}")}else r=new RegExp(u(f).replace(/\s+/g,"\\s+"));if(i=s(r,a))return i;if(o=p.exec(f)){var x=o[1];if(n=l(o[2]),r=new RegExp("on"+x+"=[\\'\"]\\s*"+n+"\\s*[\\'\"]","i"),i=s(r,a[0]))return i;if(r=new RegExp(n),i=s(r,a))return i}return null}}function m(e){if(!a(e.stack)&&e.stack){for(var t,r,u=/^\s*at (.*?) ?\(?((?:(?:file|https?|chrome-extension):.*?)|<anonymous>):(\d+)(?::(\d+))?\)?\s*$/i,c=/^\s*(.*?)(?:\((.*?)\))?@((?:file|https?|chrome).*?):(\d+)(?::(\d+))?\s*$/i,l=/^\s*at (?:((?:\[object object\])?.+) )?\(?((?:ms-appx|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,s=e.stack.split("\n"),d=[],p=/^(.*) is undefined$/.exec(e.message),m=0,g=s.length;g>m;++m){if(t=c.exec(s[m]))r={url:t[3],func:t[1]||G,args:t[2]?t[2].split(","):"",line:+t[4],column:t[5]?+t[5]:null};else if(t=u.exec(s[m]))r={url:t[2],func:t[1]||G,line:+t[3],column:t[4]?+t[4]:null};else{if(!(t=l.exec(s[m])))continue;r={url:t[2],func:t[1]||G,line:+t[3],column:t[4]?+t[4]:null}}!r.func&&r.line&&(r.func=o(r.url,r.line)),r.line&&(r.context=i(r.url,r.line)),d.push(r)}return d.length?(d[0].line&&!d[0].column&&p?d[0].column=f(p[1],d[0].url,d[0].line):d[0].column||a(e.columnNumber)||(d[0].column=e.columnNumber+1),{name:e.name,message:e.message,url:n(),stack:d}):null}}function g(e){var t=e.stacktrace;if(!a(e.stacktrace)&&e.stacktrace){for(var r,u=/ line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i,c=t.split("\n"),l=[],s=0,f=c.length;f>s;s+=2)if(r=u.exec(c[s])){var d={line:+r[1],column:+r[2],func:r[3]||r[4],args:r[5]?r[5].split(","):[],url:r[6]};if(!d.func&&d.line&&(d.func=o(d.url,d.line)),d.line)try{d.context=i(d.url,d.line)}catch(p){}d.context||(d.context=[c[s+1]]),l.push(d)}return l.length?{name:e.name,message:e.message,url:n(),stack:l}:null}}function h(t){var a=t.message.split("\n");if(a.length<4)return null;var u,c,f,p,m=/^\s*Line (\d+) of linked script ((?:file|https?)\S+)(?:: in function (\S+))?\s*$/i,g=/^\s*Line (\d+) of inline#(\d+) script in ((?:file|https?)\S+)(?:: in function (\S+))?\s*$/i,h=/^\s*Line (\d+) of function script\s*$/i,v=[],x=document.getElementsByTagName("script"),y=[];for(c in x)d(x,c)&&!x[c].src&&y.push(x[c]);for(c=2,f=a.length;f>c;c+=2){var b=null;if(u=m.exec(a[c]))b={url:u[2],func:u[3],line:+u[1]};else if(u=g.exec(a[c])){b={url:u[3],func:u[4]};var w=+u[1],E=y[u[2]-1];if(E&&(p=r(b.url))){p=p.join("\n");var S=p.indexOf(E.innerText);S>=0&&(b.line=w+p.substring(0,S).split("\n").length)}}else if(u=h.exec(a[c])){var C=e.location.href.replace(/#.*$/,""),k=u[1],_=new RegExp(l(a[c+1]));p=s(_,[C]),b={url:C,line:p?p.line:k,func:""}}if(b){b.func||(b.func=o(b.url,b.line));var T=i(b.url,b.line),U=T?T[Math.floor(T.length/2)]:null;T&&U.replace(/^\s*/,"")===a[c+1].replace(/^\s*/,"")?b.context=T:b.context=[a[c+1]],v.push(b)}}return v.length?{name:t.name,message:a[0],url:n(),stack:v}:null}function v(e,t,n,r){var a={url:t,line:n};if(a.url&&a.line){e.incomplete=!1,a.func||(a.func=o(a.url,a.line)),a.context||(a.context=i(a.url,a.line));var u=/ '([^']+)' /.exec(r);if(u&&(a.column=f(u[1],a.url,a.line)),e.stack.length>0&&e.stack[0].url===a.url){if(e.stack[0].line===a.line)return!1;if(!e.stack[0].line&&e.stack[0].func===a.func)return e.stack[0].line=a.line,e.stack[0].context=a.context,!1}return e.stack.unshift(a),e.partial=!0,!0}return e.incomplete=!0,!1}function x(e,t){for(var r,i,a,u=/function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,c=[],l={},s=!1,d=x.caller;d&&!s;d=d.caller)if(d!==y&&d!==M.report){if(i={url:null,func:G,line:null,column:null},d.name?i.func=d.name:(r=u.exec(d.toString()))&&(i.func=r[1]),"undefined"==typeof i.func)try{i.func=r.input.substring(0,r.input.indexOf("{"))}catch(m){}if(a=p(d)){i.url=a.url,i.line=a.line,i.func===G&&(i.func=o(i.url,i.line));var g=/ '([^']+)' /.exec(e.message||e.description);g&&(i.column=f(g[1],a.url,a.line))}l[""+d]?s=!0:l[""+d]=!0,c.push(i)}t&&c.splice(0,t);var h={name:e.name,message:e.message,url:n(),stack:c};return v(h,e.sourceURL||e.fileName,e.line||e.lineNumber,e.message||e.description),h}function y(e,t){var r=null;t=null==t?0:+t;try{if(r=g(e))return r}catch(o){if(M.debug)throw o}try{if(r=m(e))return r}catch(o){if(M.debug)throw o}try{if(r=h(e))return r}catch(o){if(M.debug)throw o}try{if(r=x(e,t+1))return r}catch(o){if(M.debug)throw o}return{name:e.name,message:e.message,url:n()}}var b={};return y.augmentStackTraceWithInitialElement=v,y.computeStackTraceFromStackProp=m,y.guessFunctionName=o,y.gatherContext=i,y}();var $,j,A,I,F,W=e.Raven,q=!("object"!=typeof JSON||!JSON.stringify),D="undefined"!=typeof document,B={},H={logger:"javascript",ignoreErrors:[],ignoreUrls:[],whitelistUrls:[],includePaths:[],crossOrigin:"anonymous",collectWindowErrors:!0,maxMessageLength:100},J=!1,V=Object.prototype,X=e.console||{},z={},Z=[],K=w();for(var Y in X)z[Y]=X[Y];var Q={VERSION:"1.3.0",debug:!1,noConflict:function(){return e.Raven=W,Q},config:function(e,t){if(A)return N("error","Error: Raven has already been configured"),Q;if(!e)return Q;var n=i(e),r=n.path.lastIndexOf("/"),o=n.path.substr(1,r);return t&&p(t,function(e,t){"tags"==e||"extra"==e?B[e]=t:H[e]=t}),H.ignoreErrors.push(/^Script error\.?$/),H.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/),H.ignoreErrors=T(H.ignoreErrors),H.ignoreUrls=H.ignoreUrls.length?T(H.ignoreUrls):!1,H.whitelistUrls=H.whitelistUrls.length?T(H.whitelistUrls):!1,H.includePaths=T(H.includePaths),I=n.user,F=n.path.substr(r+1),A="//"+n.host+(n.port?":"+n.port:"")+"/"+o+"api/"+F+"/store/",n.protocol&&(A=n.protocol+":"+A),H.fetchContext&&(M.remoteFetching=!0),H.linesOfContext&&(M.linesOfContext=H.linesOfContext),M.collectWindowErrors=!!H.collectWindowErrors,Q},install:function(){return _()&&!J&&(M.report.subscribe(m),p(Z,function(e,t){t()}),J=!0),Q},context:function(e,n,r){return u(e)&&(r=n||[],n=e,e=t),Q.wrap(e,n).apply(this,r)},wrap:function(e,n){function r(){for(var t=[],r=arguments.length,o=!e||e&&e.deep!==!1;r--;)t[r]=o?Q.wrap(e,arguments[r]):arguments[r];try{return n.apply(this,t)}catch(i){throw Q.captureException(i,e),i}}if(a(n)&&!u(e))return e;if(u(e)&&(n=e,e=t),!u(n))return n;if(n.__raven__)return n;for(var o in n)d(n,o)&&(r[o]=n[o]);return r.prototype=n.prototype,r.__raven__=!0,r.__inner__=n,r},uninstall:function(){return M.report.uninstall(),J=!1,Q},captureException:function(e,t){if(!f(e))return Q.captureMessage(e,t);$=e;try{var n=M.computeStackTrace(e);m(n,t)}catch(r){if(e!==r)throw r}return Q},captureMessage:function(e,t){return H.ignoreErrors.test&&H.ignoreErrors.test(e)?void 0:(S(x({message:e+""},t)),Q)},addPlugin:function(e){return Z.push(e),J&&e(),Q},setUserContext:function(e){return B.user=e,Q},setExtraContext:function(e){return O("extra",e),Q},setTagsContext:function(e){return O("tags",e),Q},clearContext:function(){return B={},Q},getContext:function(){return JSON.parse(JSON.stringify(B))},setRelease:function(e){return H.release=e,Q},setDataCallback:function(e){return H.dataCallback=e,Q},setShouldSendCallback:function(e){return H.shouldSendCallback=e,Q},setTransport:function(e){return H.transport=e,Q},lastException:function(){return $},lastEventId:function(){return j},isSetup:function(){return _()}};Q.setUser=Q.setUserContext,Q.setReleaseContext=Q.setRelease;var ee="source protocol user pass host port path".split(" "),te=/^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;o.prototype=new Error,o.prototype.constructor=o;var ne;R(),e.Raven=Q,"function"==typeof define&&define.amd?define("raven",[],function(){return Q}):"object"==typeof module?module.exports=Q:"object"==typeof exports&&(exports=Q)}("undefined"!=typeof window?window:this),define("modules/monitor",["raven"],function(e){var t={dsn:null,git_commit:"not available"};try{t={dsn:null,git_commit:"4741c4f17b04542e2dd8f1dcea9ae28a1797a587"}}catch(n){}var r={extractTags:function(){var e=document.body.getAttribute("class"),t=e.match(/tone--([^\s]+)/);return{itemTone:t?t[1]:null,itemId:document.body.getAttribute("data-page-id"),deviceKind:document.body.getAttribute("data-ads-config"),ads:"true"===document.body.getAttribute("data-ads-enabled")}},ignoreErrors:function(){var e=["fake"];return e.push=function(){},e},setContext:function(n,r){return t.dsn?e.context({tags:{context:n}},r):r()}},o=function(){var n=r.extractTags();!e.isSetup()&&t.dsn&&e.config(t.dsn,{tags:n,release:t.git_commit,ignoreErrors:r.ignoreErrors(),shouldSendCallback:function(e){e.stacktrace&&e.stacktrace.frames&&(e.stacktrace.frames=e.stacktrace.frames.reverse().slice(0,3).reverse());var t=35;return 100*Math.random()<=t}}).install()};return{init:o,setContext:r.setContext,modules:r,config:t,raven:e}}),define("modules/ads",[],function(){"use strict";function e(e){var t=n(E),r=(parseInt(e,10)||6)-1,o=document.createElement("div"),i=document.querySelector(".article__body > div.prose > :first-child"),a=document.querySelector(".article__body > div.prose > p:nth-of-type("+r+") ~ p + p");a&&a.parentNode&&(a.parentNode.insertBefore(t,a),o.classList.add("advert-slot"),o.classList.add("advert-slot--placeholder"),i&&i.parentNode&&i.parentNode.insertBefore(o,i),b=!0)}function t(e){var t,r,o,i,a=document.querySelectorAll(".article__body > .block");if(e){for(r=document.getElementsByClassName("advert-slot--mpu"),t=r.length;t>0;t--)r[t-1].parentNode.removeChild(r[t-1]);E=0}for(t=0;t<a.length;t++)i=a[t],(1===t||6===t)&&(E++,o=n(E),i.nextSibling?i.parentNode.insertBefore(o,i.nextSibling):i.parentNode.appendChild(o));e&&("android"===GU.opts.platform?c():GU.util.signalDevice("ad_moved"))}function n(e){var t=document.createElement("div");return t.classList.add("advert-slot"),t.classList.add("advert-slot--mpu"),t.innerHTML='<div class="advert-slot__label">Advertisement<a class="advert-slot__action" href="x-gu://subscribe">Hide<span data-icon="&#xe04F;"></span></a></div><div class="advert-slot__wrapper" id="advert-slot__wrapper"><div class="advert-slot__wrapper__content" id="'+e+'"></div></div>',t}function r(e){var t,n,r=document.getElementsByClassName("advert-slot__wrapper"),o=document.body.scrollLeft,i=document.body.scrollTop,a={x1:-1,y1:-1,w1:-1,h1:-1,x2:-1,y2:-1,w2:-1,h2:-1};if(r.length){for(n=0;n<r.length;n++)t=r[n].getBoundingClientRect(),0!==t.width&&0!==t.height&&(a["x"+(n+1)]=t.left+o,a["y"+(n+1)]=t.top+i,a["w"+(n+1)]=t.width,a["h"+(n+1)]=t.height);return e(a)}return null}function o(){return r(i)}function i(e){return E>1?e.x1+","+e.y1+","+e.x2+","+e.y2:e.x1+","+e.y1}function a(){return r(u)}function u(e){return E>1?e.x1+"-"+e.y1+":"+e.x2+"-"+e.y2:e.x1+"-"+e.y1}function c(){r("liveblog"===y?l:s)}function l(e){var t=e.x1,n=e.y1,r=e.w1,o=e.h1,i=e.x2,a=e.y2,u=e.w2,c=e.h2;window.GuardianJSInterface.mpuLiveblogAdsPosition(t,n,r,o,i,a,u,c)}function s(e){var t=e.x1,n=e.y1,r=e.w1,o=e.h1;window.GuardianJSInterface.mpuAdsPosition(t,n,r,o)}function f(){d(1e3,a(),!0)}function d(e,t,n){var r=a();n&&"android"===GU.opts.platform&&c(),r!==t&&("android"===GU.opts.platform?c():GU.util.signalDevice("ad_moved")),x=setTimeout(d.bind(null,e+50,r),e)}function p(){window.clearTimeout(x),x=null}function m(){document.body.classList.contains("no-ready")||"true"!==GU.opts.useAdsReady||GU.util.signalDevice("ads-ready")}function g(e){var t,n=document.getElementsByClassName("advert-slot__wrapper")[0];return n&&(t=GU.util.getElementOffset(n).top,t!==e&&("android"===GU.opts.platform?c():GU.util.signalDevice("ad_moved"))),t}function h(){window.initMpuPoller=f,window.killMpuPoller=p,window.getMpuPosCommaSeparated=o,window.updateLiveblogAdPlaceholders=t,window.applyNativeFunctionCall("initMpuPoller")}function v(n){!w&&n.adsEnabled&&(w=!0,y=n.adsType,h(),"liveblog"===y?(b=!0,t()):(E=1,e(n.mpuAfterParagraphs)),b&&("android"!==GU.opts.platform&&f(),m()))}var x,y,b=!1,w=!1,E=0;return{init:v,updateMPUPosition:g}}),define("modules/util",[],function(){"use strict";function e(){GU.util={isElementInViewport:function(e){var t=e.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&t.right<=(window.innerWidth||document.documentElement.clientWidth)},isElementPartiallyInViewport:function(e){var t=e.getBoundingClientRect(),n=window.innerHeight||document.documentElement.clientHeight,r=window.innerWidth||document.documentElement.clientWidth,o=t.top<=n&&t.top+t.height>=0,i=t.left<=r&&t.left+t.width>=0;return o&&i},getElementOffset:function(e){var t=e.ownerDocument.documentElement,n=e.getBoundingClientRect(),r={x:window.pageXOffset||document.documentElement.scrollLeft,y:window.pageYOffset||document.documentElement.scrollTop},o=e.offsetWidth,i=e.offsetHeight,a=n.top+r.y-Math.max(0,t&&t.clientTop,document.body.clientTop),u=n.left+r.x-Math.max(0,t&&t.clientLeft,document.body.clientLeft);return{top:a,left:u,height:i,width:o}},signalDevice:function(e){var t="x-gu://",n=t+e,r=document.createElement("iframe");r.style.display="none",r.src=n,GU.util.doIframeMessage(r)},doIframeMessage:function(e){document.documentElement.appendChild(e),document.documentElement.removeChild(e)},isOnline:function(){return!document.body.classList.contains("offline")&&navigator.onLine},getClosestParentWithClass:function(e,t){for(;e&&(!e.classList||!e.classList.contains(t));)e=e.parentNode;return e},getClosestParentWithTag:function(e,t){for(;e&&e.tagName!==t.toUpperCase();)e=e.parentNode;return e},getClosestParentWithData:function(e,t,n){for("string"==typeof n&&(n=[n]);e&&(!e.dataset||-1===n.indexOf(e.dataset[t]));)e=e.parentNode;return e},getStringFromUnicodeVal:function(e){return String.fromCharCode(e)},getLocalStorage:function(e){return localStorage.getItem(e)},setLocalStorage:function(e,t){localStorage.setItem(e,t)},debounce:function(e,t,n){var r,o,i,a,u;return function(){i=this,r=arguments,a=function(){u=null,n||e.apply(i,r)},o=n&&!u,clearTimeout(u),u=setTimeout(a,t),o&&e.apply(i,r)}},getElemsFromHTML:function(e){var t,n=[],r=document.createElement("div");for(r.innerHTML=e,t=0;t<r.childNodes.length;t++)1===r.childNodes[t].nodeType&&n.push(r.childNodes[t]);return n}}}var t={init:e};return t}),define("app",["domReady","modules/monitor","modules/ads","modules/util"],function(e,t,n,r){"use strict";function o(){r.init(),e(a)}function i(e,n){t.setContext(e,n.init)}function a(){var e=GU.opts.contentType;t.init(),n.init({adsEnabled:GU.opts.adsEnabled&&"true"===GU.opts.adsEnabled||GU.opts.adsEnabled&&-1!==GU.opts.adsEnabled.indexOf("mpu"),adsConfig:GU.opts.adsConfig,adsType:"liveblog"!==GU.opts.contentType||document.body.classList.contains("the-minute")?"default":"liveblog",mpuAfterParagraphs:GU.opts.mpuAfterParagraphs}),"article"===e?require(["article"],i.bind(null,"article")):"liveblog"===e?require(["liveblog"],i.bind(null,"liveblog")):"audio"===e?require(["audio"],i.bind(null,"audio")):"gallery"===e?require(["gallery"],i.bind(null,"gallery")):"football"===e?require(["football"],i.bind(null,"football")):"cricket"===e?require(["cricket"],i.bind(null,"cricket")):require(["bootstraps/common"],i.bind(null,"common"))}return{init:o}});