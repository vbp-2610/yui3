YUI.add("dom-base",function(D){var I="nodeType",O="ownerDocument",S="documentElement",C="defaultView",H="parentWindow",M="tagName",E="parentNode",B="firstChild",R="lastChild",N="previousSibling",T="nextSibling",F="contains",J="compareDocumentPosition",P="innerText",Q="textContent",L="length",U=undefined,K=Array.slice,G=/<([a-z]+)/i;D.DOM={byId:function(W,V){V=V||D.config.doc;return V.getElementById(W);},getText:function(V){var W=V?V[Q]:"";if(W===U&&P in V){W=V[P];}return W||"";},firstChild:function(V,W){return D.DOM._childBy(V,null,W);},firstChildByTag:function(W,V,X){return D.DOM._childBy(W,V,X);},lastChild:function(V,W){return D.DOM._childBy(V,null,W,true);},lastChildByTag:function(W,V,X){return D.DOM._childBy(W,V,X,true);},_childrenByTag:function(){if(document[S].children){return function(Y,W,Z,X){W=(W&&W!=="*")?W.toUpperCase():null;var a=[],V=Z;if(Y){if(W&&!D.UA.webkit){a=Y.children.tags(W);}else{a=Y.children;if(W){V=function(b){return b[M].toUpperCase()===W&&(!Z||Z(b));};}}a=D.DOM.filterElementsBy(a,V);}return a;};}else{return function(X,W,Y){W=(W&&W!=="*")?W.toUpperCase():null;var Z=[],V=Y;if(X){Z=X.childNodes;if(W){V=function(a){return a[M].toUpperCase()===W&&(!Y||Y(a));};}Z=D.DOM.filterElementsBy(Z,V);}return Z;};}}(),children:function(V,W){return D.DOM._childrenByTag(V,null,W);},previous:function(V,X,W){return D.DOM.elementByAxis(V,N,X,W);},next:function(V,X,W){return D.DOM.elementByAxis(V,T,X,W);},ancestor:function(V,X,W){return D.DOM.elementByAxis(V,E,X,W);},elementByAxis:function(V,Y,X,W){while(V&&(V=V[Y])){if((W||V[M])&&(!X||X(V))){return V;}}return null;},byTag:function(W,X,a){X=X||D.config.doc;var b=X.getElementsByTagName(W),Z=[];for(var Y=0,V=b[L];Y<V;++Y){if(!a||a(b[Y])){Z[Z[L]]=b[Y];}}return Z;},firstByTag:function(W,X,a){X=X||D.config.doc;var b=X.getElementsByTagName(W),Y=null;for(var Z=0,V=b[L];Z<V;++Z){if(!a||a(b[Z])){Y=b[Z];break;}}return Y;},filterElementsBy:function(a,Z,Y){var W=(Y)?null:[];for(var X=0,V=a[L];X<V;++X){if(a[X][M]&&(!Z||Z(a[X]))){if(Y){W=a[X];break;}else{W[W[L]]=a[X];}}}return W;},contains:function(W,X){var V=false;if(!X||!W||!X[I]||!W[I]){V=false;}else{if(W[F]){if(D.UA.opera||X[I]===1){V=W[F](X);}else{V=D.DOM._bruteContains(W,X);}}else{if(W[J]){if(W===X||!!(W[J](X)&16)){V=true;}}}}return V;},inDoc:function(V,W){W=W||V[O];var X=V.id;if(!X){X=V.id=D.guid();}return !!(W.getElementById(X));},insertBefore:function(X,V){var W=null,Y;if(X&&V&&(Y=V.parentNode)){if(typeof X==="string"){X=D.DOM.create(X);}W=Y.insertBefore(X,V);}else{}return W;},insertAfter:function(W,V){if(!W||!V||!V[E]){return null;}if(typeof W==="string"){W=D.DOM.create(W);}if(V[T]){return V[E].insertBefore(W,V[T]);}else{return V[E].appendChild(W);}},create:function(a,c){c=c||D.config.doc;var W=G.exec(a),Z=D.DOM._create,b=D.DOM.creators,Y=null,V,X;if(W&&b[W[1]]){if(typeof b[W[1]]==="function"){Z=b[W[1]];}else{V=b[W[1]];}}X=Z(a,c,V).childNodes;if(X.length===1){Y=X[0].parentNode.removeChild(X[0]);}else{Y=c.createDocumentFragment();while(X.length){Y.appendChild(X[X.length-1]);}}return Y;},CUSTOM_ATTRIBUTES:(!document.documentElement.hasAttribute)?{"for":"htmlFor","class":"className"}:{"htmlFor":"for","className":"class"},setAttribute:function(W,V,X){if(W&&W.setAttribute){V=D.DOM.CUSTOM_ATTRIBUTES[V]||V;W.setAttribute(V,X);}},getAttribute:function(X,V){var W="";if(X&&X.getAttribute){V=D.DOM.CUSTOM_ATTRIBUTES[V]||V;W=X.getAttribute(V,2);if(W===null){W="";}}return W;},srcIndex:(document.documentElement.sourceIndex)?function(V){return(V&&V.sourceIndex)?V.sourceIndex:null;}:function(V){return(V&&V[O])?[].indexOf.call(V[O].getElementsByTagName("*"),V):null;},isWindow:function(V){return V.alert&&V.document;},_fragClones:{div:document.createElement("div")},_create:function(W,X,V){V=V||"div";var Y=D.DOM._fragClones[V];if(Y){Y=Y.cloneNode(false);}else{Y=D.DOM._fragClones[V]=X.createElement(V);}Y.innerHTML=W;return Y;},_removeChildNodes:function(W){var X=W.childNodes,V;while(W.firstChild){W.removeChild(W.firstChild);}},addHTML:function(Z,Y,W,a){var V,X=(Y.nodeType)?Y:D.DOM.create(Y);if(W&&W.nodeType){Z.insertBefore(X,W);}else{switch(W){case"replace":while(Z.firstChild){Z.removeChild(Z.firstChild);}Z.appendChild(X);break;case"before":Z.parentNode.insertBefore(X,Z);break;case"after":if(Z.nextSibling){Z.parentNode.insertBefore(X,Z.nextSibling);}else{Z.parentNode.appendChild(X);}break;default:Z.appendChild(X);}}if(a){if(X.tagName.toUpperCase()==="SCRIPT"&&!D.UA.gecko){V=[X];}else{V=X.getElementsByTagName("script");}D.DOM._execScripts(V);}else{if(Y.nodeType||Y.indexOf("script")>-1){D.DOM._stripScripts(X);}}return X;},VALUE_SETTERS:{},VALUE_GETTERS:{},getValue:function(X){var W="",V;if(X&&X[M]){V=D.DOM.VALUE_GETTERS[X[M].toLowerCase()];if(V){W=V(X);}else{W=X.value;}}return(typeof W==="string")?W:"";},setValue:function(V,W){var X;if(V&&V[M]){X=D.DOM.VALUE_SETTERS[V[M].toLowerCase()];if(X){X(V,W);}else{V.value=W;}}},_stripScripts:function(Y){var V=Y.getElementsByTagName("script");for(var X=0,W;W=V[X++];){W.parentNode.removeChild(W);}},_execScripts:function(V,Z){var X;Z=Z||0;for(var Y=Z,W;W=V[Y++];){X=W.ownerDocument.createElement("script");W.parentNode.replaceChild(X,W);if(W.text){X.text=W.text;}else{if(W.src){X.src=W.src;if(typeof X.onreadystatechange!=="undefined"){X.onreadystatechange=function(){if(/loaded|complete/.test(W.readyState)){event.srcElement.onreadystatechange=null;setTimeout(function(){D.DOM._execScripts(V,Y++);},0);}};}else{X.onload=function(a){a.target.onload=null;D.DOM._execScripts(V,Y++);};}return;}}}},_bruteContains:function(V,W){while(W){if(V===W){return true;}W=W.parentNode;}return false;},_getRegExp:function(W,V){V=V||"";D.DOM._regexCache=D.DOM._regexCache||{};if(!D.DOM._regexCache[W+V]){D.DOM._regexCache[W+V]=new RegExp(W,V);}return D.DOM._regexCache[W+V];},_getDoc:function(V){V=V||{};return(V[I]===9)?V:V[O]||V.document||D.config.doc;},_getWin:function(V){var W=D.DOM._getDoc(V);return W[C]||W[H]||D.config.win;},_childBy:function(Z,V,b,X){var Y=null,W,a;if(Z){if(X){W=Z[R];a=N;}else{W=Z[B];
a=T;}if(D.DOM._testElement(W,V,b)){Y=W;}else{Y=D.DOM.elementByAxis(W,a,b);}}return Y;},_batch:function(V,c,Z,Y,X,W){c=(typeof name==="string")?D.DOM[c]:c;var b=arguments,d,a=[];if(c&&V){D.each(V,function(e){if((d=c.call(D.DOM,e,Z,Y,X,W))!==undefined){a[a.length]=d;}});}return a.length?a:V;},_testElement:function(W,V,X){V=(V&&V!=="*")?V.toUpperCase():null;return(W&&W[M]&&(!V||W[M].toUpperCase()===V)&&(!X||X(W)));},creators:{},_IESimpleCreate:function(V,W){W=W||D.config.doc;return W.createElement(V);}};(function(){var Z=D.DOM.creators,V=D.DOM.create,Y=/(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,X="<table>",W="</table>";if(D.UA.gecko||D.UA.ie){D.mix(Z,{option:function(a,b){return V("<select>"+a+"</select>",b);},tr:function(a,b){return V("<tbody>"+a+"</tbody>",b);},td:function(a,b){return V("<tr>"+a+"</tr>",b);},tbody:function(a,b){return V(X+a+W,b);},legend:"fieldset"});Z.col=Z.tbody;}if(D.UA.ie){D.mix(Z,{tbody:function(b,c){var d=V(X+b+W,c),a=d.children.tags("tbody")[0];if(d.children[L]>1&&a&&!Y.test(b)){a[E].removeChild(a);}return d;},script:function(a,b){var c=b.createElement("div");c.innerHTML="-"+a;c.removeChild(c[B]);return c;}},true);D.mix(D.DOM.VALUE_GETTERS,{button:function(a){return(a.attributes&&a.attributes.value)?a.attributes.value.value:"";}});D.mix(D.DOM.VALUE_SETTERS,{button:function(b,c){var a=b.attributes["value"];if(!a){a=b[O].createAttribute("value");b.setAttributeNode(a);}a.value=c;}});}if(D.UA.gecko||D.UA.ie){D.mix(Z,{th:Z.td,thead:Z.tbody,tfoot:Z.tbody,caption:Z.tbody,colgroup:Z.tbody,col:Z.tbody,optgroup:Z.option});}D.mix(D.DOM.VALUE_GETTERS,{option:function(b){var a=b.attributes;return(a.value&&a.value.specified)?b.value:b.text;},select:function(d){var e=d.value,a=d.options,c,b;if(a&&e===""){if(d.multiple){}else{e=D.DOM.getValue(a[d.selectedIndex],"value");}}return e;}});})();var A="className";D.mix(D.DOM,{hasClass:function(X,W){var V=D.DOM._getRegExp("(?:^|\\s+)"+W+"(?:\\s+|$)");return V.test(X[A]);},addClass:function(W,V){if(!D.DOM.hasClass(W,V)){W[A]=D.Lang.trim([W[A],V].join(" "));}},removeClass:function(W,V){if(V&&D.DOM.hasClass(W,V)){W[A]=D.Lang.trim(W[A].replace(D.DOM._getRegExp("(?:^|\\s+)"+V+"(?:\\s+|$)")," "));if(D.DOM.hasClass(W,V)){D.DOM.removeClass(W,V);}}},replaceClass:function(W,V,X){D.DOM.addClass(W,X);D.DOM.removeClass(W,V);},toggleClass:function(W,V){if(D.DOM.hasClass(W,V)){D.DOM.removeClass(W,V);}else{D.DOM.addClass(W,V);}}});},"@VERSION@",{requires:["event"],skinnable:false});YUI.add("dom-style",function(B){var k="documentElement",Z="defaultView",N="ownerDocument",l="style",g="float",C="cssFloat",S="styleFloat",T="transparent",n="visible",G="width",a="height",J="borderTopWidth",f="borderRightWidth",D="borderBottomWidth",d="borderLeftWidth",m="getComputedStyle",F=B.config.doc,b=undefined,c=/color$/i;B.mix(B.DOM,{CUSTOM_STYLES:{},setStyle:function(r,Y,s){var q=r[l],e=B.DOM.CUSTOM_STYLES;if(q){if(s===null){s="";}if(Y in e){if(e[Y].set){e[Y].set(r,s,q);return;}else{if(typeof e[Y]==="string"){Y=e[Y];}}}q[Y]=s;}},getStyle:function(r,Y){var q=r[l],e=B.DOM.CUSTOM_STYLES,s="";if(q){if(Y in e){if(e[Y].get){return e[Y].get(r,Y,q);}else{if(typeof e[Y]==="string"){Y=e[Y];}}}s=q[Y];if(s===""){s=B.DOM[m](r,Y);}}return s;},setStyles:function(Y,e){B.each(e,function(q,r){B.DOM.setStyle(Y,r,q);},B.DOM);},getComputedStyle:function(e,Y){var r="",q=e[N];if(e[l]){r=q[Z][m](e,"")[Y];}return r;}});if(F[k][l][C]!==b){B.DOM.CUSTOM_STYLES[g]=C;}else{if(F[k][l][S]!==b){B.DOM.CUSTOM_STYLES[g]=S;}}if(B.UA.opera){B.DOM[m]=function(q,e){var Y=q[N][Z],r=Y[m](q,"")[e];if(c.test(e)){r=B.Color.toRGB(r);}return r;};}if(B.UA.webkit){B.DOM[m]=function(q,e){var Y=q[N][Z],r=Y[m](q,"")[e];if(r==="rgba(0, 0, 0, 0)"){r=T;}return r;};}var A="toString",R=parseInt,Q=RegExp;B.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(Y){if(!B.Color.re_RGB.test(Y)){Y=B.Color.toHex(Y);}if(B.Color.re_hex.exec(Y)){Y="rgb("+[R(Q.$1,16),R(Q.$2,16),R(Q.$3,16)].join(", ")+")";}return Y;},toHex:function(s){s=B.Color.KEYWORDS[s]||s;if(B.Color.re_RGB.exec(s)){var q=(Q.$1.length===1)?"0"+Q.$1:Number(Q.$1),e=(Q.$2.length===1)?"0"+Q.$2:Number(Q.$2),Y=(Q.$3.length===1)?"0"+Q.$3:Number(Q.$3);s=[q[A](16),e[A](16),Y[A](16)].join("");}if(s.length<6){s=s.replace(B.Color.re_hex3,"$1$1");}if(s!=="transparent"&&s.indexOf("#")<0){s="#"+s;}return s.toLowerCase();}};var E="clientTop",U="clientLeft",L="parentNode",i="right",V="hasLayout",o="px",I="filter",h="filters",O="opacity",X="auto",M="currentStyle",P=function(Y){return Y[M]||Y[l];};if(document[k][l][O]===b&&document[k][h]){B.DOM.CUSTOM_STYLES[O]={get:function(q){var s=100;try{s=q[h]["DXImageTransform.Microsoft.Alpha"][O];}catch(r){try{s=q[h]("alpha")[O];}catch(Y){}}return s/100;},set:function(e,s,Y){var r,q;if(s===""){q=P(e);r=(O in q)?q[O]:1;s=r;}if(typeof Y[I]=="string"){Y[I]="alpha("+O+"="+s*100+")";if(!e[M]||!e[M][V]){Y.zoom=1;}}}};}try{document.createElement("div").style.height="-1px";}catch(j){B.DOM.CUSTOM_STYLES.height={set:function(e,q,Y){if(parseInt(q,10)>=0){Y["height"]=q;}else{}}};B.DOM.CUSTOM_STYLES.width={set:function(e,q,Y){if(parseInt(q,10)>=0){Y["width"]=q;}else{}}};}var W=/^width|height$/,H=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,p={CUSTOM_STYLES:{},get:function(Y,q){var e="",r;if(Y){r=P(Y)[q];if(q===O){e=B.DOM.CUSTOM_STYLES[O].get(Y);}else{if(!r||(r.indexOf&&r.indexOf(o)>-1)){e=r;}else{if(B.DOM.IE.COMPUTED[q]){e=B.DOM.IE.COMPUTED[q](Y,q);}else{if(H.test(r)){e=p.getPixel(Y,q)+o;}else{e=r;}}}}}return e;},getOffset:function(q,v){var s=P(q)[v],Y=v.charAt(0).toUpperCase()+v.substr(1),t="offset"+Y,e="pixel"+Y,u,r="";if(s===X){u=q[t];if(u===b){r=0;}r=u;if(W.test(v)){q[l][v]=u;
if(q[t]>u){r=u-(q[t]-u);}q[l][v]=X;}}else{if(s.indexOf("%")>-1){s=q.clientWidth-p.getPixel(q,"paddingRight")-p.getPixel(q,"paddingLeft");}if(!q[l][e]&&!q[l][v]){q[l][v]=s;}r=q[l][e];}return r+o;},getBorderWidth:function(Y,q){var e=null;if(!Y[M]||!Y[M][V]){Y[l].zoom=1;}switch(q){case J:e=Y[E];break;case D:e=Y.offsetHeight-Y.clientHeight-Y[E];break;case d:e=Y[U];break;case f:e=Y.offsetWidth-Y.clientWidth-Y[U];break;}return e+o;},getPixel:function(q,Y){var s=null,e=P(q),t=e[i],r=e[Y];q[l][i]=r;s=q[l].pixelRight;q[l][i]=t;return s;},getMargin:function(q,Y){var r,e=P(q);if(e[Y]==X){r=0;}else{r=p.getPixel(q,Y);}return r+o;},getVisibility:function(e,Y){var q;while((q=e[M])&&q[Y]=="inherit"){e=e[L];}return(q)?q[Y]:n;},getColor:function(e,Y){var q=P(e)[Y];if(!q||q===T){B.DOM.elementByAxis(e,L,null,function(r){q=P(r)[Y];if(q&&q!==T){e=r;return true;}});}return B.Color.toRGB(q);},getBorderColor:function(e,Y){var q=P(e),r=q[Y]||q.color;return B.Color.toRGB(B.Color.toHex(r));}},K={};K[G]=K[a]=p.getOffset;K.color=K.backgroundColor=p.getColor;K[J]=K[f]=K[D]=K[d]=p.getBorderWidth;K.marginTop=K.marginRight=K.marginBottom=K.marginLeft=p.getMargin;K.visibility=p.getVisibility;K.borderColor=K.borderTopColor=K.borderRightColor=K.borderBottomColor=K.borderLeftColor=p.getBorderColor;if(!B.config.win[m]){B.DOM[m]=p.get;}B.namespace("DOM.IE");B.DOM.IE.COMPUTED=K;B.DOM.IE.ComputedStyle=p;},"@VERSION@",{skinnable:false,requires:["dom-base"]});YUI.add("dom-screen",function(E){var N="offsetTop",W="documentElement",M="compatMode",D="offsetLeft",a="offsetParent",P="position",U="fixed",c="relative",O="left",S="top",b="scrollLeft",X="scrollTop",Z="BackCompat",R="medium",Q="height",H="width",F="borderLeftWidth",G="borderTopWidth",C="getBoundingClientRect",B="getComputedStyle",d=/^t(?:able|d|h)$/i;E.mix(E.DOM,{winHeight:function(e){var Y=E.DOM._getWinSize(e)[Q];return Y;},winWidth:function(e){var Y=E.DOM._getWinSize(e)[H];return Y;},docHeight:function(e){var Y=E.DOM._getDocSize(e)[Q];return Math.max(Y,E.DOM._getWinSize(e)[Q]);},docWidth:function(e){var Y=E.DOM._getDocSize(e)[H];return Math.max(Y,E.DOM._getWinSize(e)[H]);},docScrollX:function(Y){var e=E.DOM._getDoc(Y);return Math.max(e[W][b],e.body[b]);},docScrollY:function(Y){var e=E.DOM._getDoc(Y);return Math.max(e[W][X],e.body[X]);},getXY:function(){if(document[W][C]){return function(g){var o=null,h,e,m,i,n;if(g){if(E.DOM.inDoc(g)){h=E.DOM.docScrollX(g);e=E.DOM.docScrollY(g);i=g[C]();n=E.DOM._getDoc(g);o=[i[O],i[S]];if(E.UA.ie){var l=2,k=2,j=n[M],Y=E.DOM[B](n[W],F),f=E.DOM[B](n[W],G);if(E.UA.ie===6){if(j!==Z){l=0;k=0;}}if((j==Z)){if(Y!==R){l=parseInt(Y,10);}if(f!==R){k=parseInt(f,10);}}o[0]-=l;o[1]-=k;}if((e||h)){o[0]+=h;o[1]+=e;}}else{o=E.DOM._getOffset(g);}}return o;};}else{return function(f){var h=null,Y,i,g,e;if(f){if(E.DOM.inDoc(f)){h=[f[D],f[N]];Y=f;i=((E.UA.gecko||E.UA.webkit>519)?true:false);while((Y=Y[a])){h[0]+=Y[D];h[1]+=Y[N];if(i){h=E.DOM._calcBorders(Y,h);}}if(E.DOM.getStyle(f,P)!=U){Y=f;while((Y=Y.parentNode)){g=Y[X];scrollLeft=Y[b];if(E.UA.gecko&&(E.DOM.getStyle(Y,"overflow")!=="visible")){h=E.DOM._calcBorders(Y,h);}if(g||scrollLeft){h[0]-=scrollLeft;h[1]-=g;}}h[0]+=E.DOM.docScrollX(f);h[1]+=E.DOM.docScrollY(f);}else{h[0]+=E.DOM.docScrollX(f);h[1]+=E.DOM.docScrollY(f);}}else{h=E.DOM._getOffset(f);}}return h;};}}(),_getOffset:function(Y){var f,e=null;if(Y){f=E.DOM.getStyle(Y,P);e=[parseInt(E.DOM[B](Y,O),10),parseInt(E.DOM[B](Y,S),10)];if(isNaN(e[0])){e[0]=parseInt(E.DOM.getStyle(Y,O),10);if(isNaN(e[0])){e[0]=(f===c)?0:Y[D]||0;}}if(isNaN(e[1])){e[1]=parseInt(E.DOM.getStyle(Y,S),10);if(isNaN(e[1])){e[1]=(f===c)?0:Y[N]||0;}}}return e;},getX:function(Y){return E.DOM.getXY(Y)[0];},getY:function(Y){return E.DOM.getXY(Y)[1];},setXY:function(e,h,k){var f=E.DOM.setStyle,j,i,Y,g;if(e&&h){j=E.DOM.getStyle(e,P);i=E.DOM._getOffset(e);if(j=="static"){j=c;f(e,P,j);}g=E.DOM.getXY(e);if(h[0]!==null){f(e,O,h[0]-g[0]+i[0]+"px");}if(h[1]!==null){f(e,S,h[1]-g[1]+i[1]+"px");}if(!k){Y=E.DOM.getXY(e);if(Y[0]!==h[0]||Y[1]!==h[1]){E.DOM.setXY(e,h,true);}}}else{}},setX:function(e,Y){return E.DOM.setXY(e,[Y,null]);},setY:function(Y,e){return E.DOM.setXY(Y,[null,e]);},_calcBorders:function(f,g){var e=parseInt(E.DOM[B](f,G),10)||0,Y=parseInt(E.DOM[B](f,F),10)||0;if(E.UA.gecko){if(d.test(f.tagName)){e=0;Y=0;}}g[0]+=Y;g[1]+=e;return g;},_getWinSize:function(g){var j=E.DOM._getDoc(),i=j.defaultView||j.parentWindow,k=j[M],f=i.innerHeight,e=i.innerWidth,Y=j[W];if(k&&!E.UA.opera){if(k!="CSS1Compat"){Y=j.body;}f=Y.clientHeight;e=Y.clientWidth;}return{height:f,width:e};},_getDocSize:function(e){var f=E.DOM._getDoc(),Y=f[W];if(f[M]!="CSS1Compat"){Y=f.body;}return{height:Y.scrollHeight,width:Y.scrollWidth};}});var J="offsetWidth",A="offsetHeight",S="top",K="right",I="bottom",O="left",T="tagName";var L=function(g,f){var i=Math.max(g[S],f[S]),j=Math.min(g[K],f[K]),Y=Math.min(g[I],f[I]),e=Math.max(g[O],f[O]),h={};h[S]=i;h[K]=j;h[I]=Y;h[O]=e;return h;};var V=V||E.DOM;E.mix(V,{region:function(e){var f=V.getXY(e),Y=false;if(e&&f){Y=V._getRegion(f[1],f[0]+e[J],f[1]+e[A],f[0]);}return Y;},intersect:function(f,Y,h){var e=h||V.region(f),g={};var j=Y;if(j[T]){g=V.region(j);}else{if(E.Lang.isObject(Y)){g=Y;}else{return false;}}var i=L(g,e);return{top:i[S],right:i[K],bottom:i[I],left:i[O],area:((i[I]-i[S])*(i[K]-i[O])),yoff:((i[I]-i[S])),xoff:(i[K]-i[O]),inRegion:V.inRegion(f,Y,false,h)};},inRegion:function(g,Y,e,i){var h={},f=i||V.region(g);var k=Y;if(k[T]){h=V.region(k);}else{if(E.Lang.isObject(Y)){h=Y;}else{return false;}}if(e){return(f[O]>=h[O]&&f[K]<=h[K]&&f[S]>=h[S]&&f[I]<=h[I]);}else{var j=L(h,f);if(j[I]>=j[S]&&j[K]>=j[O]){return true;}else{return false;}}},inViewportRegion:function(e,Y,f){return V.inRegion(e,V.viewportRegion(e),Y,f);},_getRegion:function(f,g,Y,e){var h={};h[S]=h[1]=f;h[O]=h[0]=e;h[I]=Y;h[K]=g;h.width=h[K]-h[O];h.height=h[I]-h[S];return h;},viewportRegion:function(e){e=e||E.config.doc.documentElement;var Y=false,g,f;if(e){g=V.docScrollX(e);f=V.docScrollY(e);Y=V._getRegion(f,V.winWidth(e)+g,f+V.winHeight(e),g);
}return Y;}});},"@VERSION@",{requires:["dom-base","dom-style"],skinnable:false});YUI.add("selector",function(C){C.namespace("Selector");var L="parentNode",D="length",I={_reLead:/^\s*([>+~]|:self)/,_reUnSupported:/!./,_foundCache:[],_supportsNative:function(){return((C.UA.ie>=8||C.UA.webkit>525)&&document.querySelectorAll);},_toArray:function(O){var P=O;if(!O.slice){try{P=Array.prototype.slice.call(O);}catch(R){P=[];for(var Q=0,N=O[D];Q<N;++Q){P[Q]=O[Q];}}}return P;},_clearFoundCache:function(){var Q=I._foundCache;for(var O=0,N=Q[D];O<N;++O){try{delete Q[O]._found;}catch(P){Q[O].removeAttribute("_found");}}Q=[];},_sort:function(N){if(N){N=I._toArray(N);if(N.sort){N.sort(function(P,O){return C.DOM.srcIndex(P)-C.DOM.srcIndex(O);});}}return N;},_deDupe:function(O){var P=[],N=I._foundCache;for(var Q=0,R;R=O[Q++];){if(!R._found){P[P[D]]=N[N[D]]=R;R._found=true;}}I._clearFoundCache();return P;},_prepQuery:function(Q,P){var O=P.split(","),R=[],T=(Q&&Q.nodeType===9);if(Q){if(!T){Q.id=Q.id||C.guid();for(var S=0,N=O[D];S<N;++S){P="#"+Q.id+" "+O[S];R.push({root:Q.ownerDocument,selector:P});}}else{R.push({root:Q,selector:P});}}return R;},_query:function(N,U,V){if(I._reUnSupported.test(N)){return C.Selector._brute.query(N,U,V);}var R=V?null:[],S=V?"querySelector":"querySelectorAll",W,P;U=U||C.config.doc;if(N){P=I._prepQuery(U,N);R=[];for(var O=0,T;T=P[O++];){try{W=T.root[S](T.selector);if(S==="querySelectorAll"){W=I._toArray(W);}R=R.concat(W);}catch(Q){}}if(P[D]>1){R=I._sort(I._deDupe(R));}R=(!V)?R:R[0]||null;}return R;},_filter:function(O,N){var P=[];if(O&&N){for(var Q=0,R;(R=O[Q++]);){if(C.Selector._test(R,N)){P[P[D]]=R;}}}else{}return P;},_test:function(S,O){var P=false,N=O.split(","),R;if(S&&S[L]){S.id=S.id||C.guid();S[L].id=S[L].id||C.guid();for(var Q=0,T;T=N[Q++];){T+="#"+S.id;R=C.Selector.query(T,null,true);P=(R===S);if(P){break;}}}return P;}};if(C.UA.ie&&C.UA.ie<=8){I._reUnSupported=/:(?:nth|not|root|only|checked|first|last|empty)/;}C.mix(C.Selector,I,true);if(I._supportsNative()){C.Selector.query=I._query;}C.Selector.test=I._test;C.Selector.filter=I._filter;var L="parentNode",K="tagName",F="attributes",G="combinator",E="pseudos",H="previous",J="previousSibling",D="length",B=[],A=C.Selector,M={SORT_RESULTS:true,_children:function(P){var N=P.children;if(!N&&P[K]){N=[];for(var O=0,Q;Q=P.childNodes[O++];){if(Q.tagName){N[N.length]=Q;}}B[B.length]=P;P.children=N;}return N||[];},_regexCache:{},_re:{attr:/(\[.*\])/g,urls:/^(?:href|src)/},shorthand:{"\\#(-?[_a-z]+[-\\w]*)":"[id=$1]","\\.(-?[_a-z]+[-\\w]*)":"[className~=$1]"},operators:{"":function(O,N){return C.DOM.getAttribute(O,N[0])!=="";},"=":"^{val}$","~=":"(?:^|\\s+){val}(?:\\s+|$)","|=":"^{val}-?"},pseudos:{"first-child":function(N){return C.Selector._children(N[L])[0]===N;}},_brute:{query:function(N,O,Q){var P=[];if(N){P=A._query(N,O,Q);}A._cleanup();return(Q)?(P[0]||null):P;}},_cleanup:function(){for(var N=0,O;O=B[N++];){delete O.children;}B=[];},_query:function(R,W,X,P){var U=[],O=R.split(","),N=[],V,Q;if(O[D]>1){for(var S=0,T=O[D];S<T;++S){U=U.concat(arguments.callee(O[S],W,X,true));}U=A.SORT_RESULTS?A._sort(U):U;A._clearFoundCache();}else{W=W||C.config.doc;if(W.nodeType!==9){if(!W.id){W.id=C.guid();}if(W.ownerDocument.getElementById(W.id)){R="#"+W.id+" "+R;W=W.ownerDocument;}}V=A._tokenize(R,W);Q=V.pop();if(Q){if(P){Q.deDupe=true;}if(V[0]&&V[0].id&&W.nodeType===9&&W.getElementById(V[0].id)){W=W.getElementById(V[0].id);}if(W&&!N[D]&&Q.prefilter){N=Q.prefilter(W,Q);}if(N[D]){if(X){C.Array.some(N,A._testToken,Q);}else{C.Array.each(N,A._testToken,Q);}}U=Q.result;}}return U;},_testToken:function(O,S,N,P){var P=P||this,V=P.tag,R=P[H],W=P.result,Q=0,U=R&&R[G]?A.combinators[R[G]]:null,T;if((V==="*"||V===O[K])&&!(P.last&&O._found)){while((T=P.tests[Q])){Q++;test=T.test;if(test.test){if(!test.test(C.DOM.getAttribute(O,T.name))){return false;}}else{if(!test(O,T.match)){return false;}}}if(U&&!U(O,P)){return false;}if(P.root&&P.root.nodeType!==9&&!C.DOM.contains(P.root,O)){return false;}W[W.length]=O;if(P.deDupe&&P.last){O._found=true;A._foundCache.push(O);}return true;}return false;},_getRegExp:function(P,N){var O=A._regexCache;N=N||"";if(!O[P+N]){O[P+N]=new RegExp(P,N);}return O[P+N];},combinators:{" ":function(P,N){var Q=A._testToken,O=N[H];while((P=P[L])){if(Q(P,null,null,O)){return true;}}return false;},">":function(O,N){return A._testToken(O[L],null,null,N[H]);},"+":function(P,O){var N=P[J];while(N&&N.nodeType!==1){N=N[J];}if(N&&C.Selector._testToken(N,null,null,O[H])){return true;}return false;}},_parsers:[{name:K,re:/^((?:-?[_a-z]+[\w-]*)|\*)/i,fn:function(O,N){O.tag=N[1].toUpperCase();O.prefilter=function(P){return P.getElementsByTagName(O.tag);};return true;}},{name:F,re:/^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,fn:function(P,O){var Q=O[3],N=!(O[2]&&Q)?"":O[2],R=A.operators[N];if(typeof R==="string"){R=A._getRegExp(R.replace("{val}",Q));}if(O[1]==="id"&&Q){P.id=Q;P.prefilter=function(S){var U=S.nodeType===9?S:S.ownerDocument,T=U.getElementById(Q);return T?[T]:[];};}else{if(document.documentElement.getElementsByClassName&&O[1].indexOf("class")===0){if(!P.prefilter){P.prefilter=function(S){return S.getElementsByClassName(Q);};R=true;}}}return R;}},{name:G,re:/^\s*([>+~]|\s)\s*/,fn:function(O,N){O[G]=N[1];return !!A.combinators[O[G]];}},{name:E,re:/^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,fn:function(O,N){return A[E][N[1]];}}],_getToken:function(N){return{previous:N,combinator:" ",tag:"*",prefilter:function(O){return O.getElementsByTagName("*");},tests:[],result:[]};},_tokenize:function(P,V){P=P||"";P=A._replaceShorthand(C.Lang.trim(P));var O=A._getToken(),U=P,T=[],W=false,S,R;outer:do{W=false;for(var Q=0,N;N=A._parsers[Q++];){if((R=N.re.exec(P))){S=N.fn(O,R);if(S){if(S!==true){O.tests.push({name:R[1],test:S,match:R.slice(1)});}W=true;P=P.replace(R[0],"");if(!P[D]||N.name===G){O.root=V;T.push(O);O=A._getToken(O);}}else{W=false;break outer;}}}}while(W&&P.length);if(!W||P.length){T=[];}else{if(T[D]){T[T[D]-1].last=true;}}return T;},_replaceShorthand:function(O){var P=A.shorthand,Q=O.match(A._re.attr);
if(Q){O=O.replace(A._re.attr,"REPLACED_ATTRIBUTE");}for(var S in P){if(P.hasOwnProperty(S)){O=O.replace(A._getRegExp(S,"gi"),P[S]);}}if(Q){for(var R=0,N=Q[D];R<N;++R){O=O.replace("REPLACED_ATTRIBUTE",Q[R]);}}return O;}};C.mix(C.Selector,M,true);if(!C.Selector._supportsNative()){C.Selector.query=A._brute.query;}},"@VERSION@",{requires:["dom-base"],skinnable:false});YUI.add("dom",function(A){},"@VERSION@",{skinnable:false,use:["dom-base","dom-style","dom-screen","selector"]});