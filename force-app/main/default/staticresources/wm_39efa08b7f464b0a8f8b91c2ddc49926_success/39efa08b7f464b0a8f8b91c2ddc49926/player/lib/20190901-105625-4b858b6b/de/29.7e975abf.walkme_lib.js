window.walkMeGermany = true;(window._walkmeWebpackJP=window._walkmeWebpackJP||[]).push([[29],{879:function(e,a,o){"use strict";e.exports=function(o){var m=[];return m.toString=function(){return function r(e,a){for(var o=[],l=0,t=e.length;l<t;l++)o.push(a(e[l]));return o}(this,function(e){var a=function i(e,a){var o=e[1]||"",l=e[3];if(!l)return o;if(a&&"function"==typeof btoa){var t=function m(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(l),r=l.sources.map(function(e){return"/*# sourceURL="+l.sourceRoot+e+" */"});return[o].concat(r).concat([t]).join("\n")}return[o].join("\n")}(e,o);return e[2]?"@media "+e[2]+"{"+a+"}":a}).join("")},m.i=function(e,a){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},l=0;l<this.length;l++){var t=this[l][0];null!=t&&(o[t]=!0)}for(l=0;l<e.length;l++){var r=e[l];null!=r[0]&&o[r[0]]||(a&&!r[2]?r[2]=a:a&&(r[2]="("+r[2]+") and ("+a+")"),m.push(r))}},m}},916:function(e,a,l){(function(){var a=l(760);a.register("ColoradoPlayerCssLoader").asFunction(function(e){var a=l(917).toString(),o=e.get().TriangleTheme;return a+l(919)("./widget.player.colorado."+o+".css").toString()}).dependencies("SiteConfigManager"),a.register("ColoradoPlayer").asInstance(function h(){var w,o,n,l,r,t,m,i=a.create("WalkmeOOP",this),k=a.get("BasePlayer"),p=57,c=40,d=7;i.Override("buildHtml",function(){return w.mustache().to_html('<div id="{{id}}" class="walkme-player walkme-colorado walkme-theme-{{theme}} walkme-direction-{{direction}} walkme-{{isIe}} walkme-position-major-{{positionMajor}} walkme-position-minor-{{positionMinor}} {{accessibleClass}} walkme-dynamic-size"><div class="walkme-in-wrapper"><div class="walkme-question-mark"></div><div class="walkme-title">{{{title}}}</div></div></div>',{id:w.id(),theme:o().TriangleTheme,direction:o().Direction,isIe:w.isIeClass(),positionMajor:w.positionMajor(),positionMinor:w.positionMinor(),title:o().ClosedMenuTitle,accessibleClass:w.accessibleClass()})});var s=i.Override("customSizeHandler",function s(){var e=w.player(),a=e.find(".walkme-title"),o=e.find(".walkme-in-wrapper"),l=w.positionMajor(),t=w.positionMinor(),r="none"!=e.css("display");e.show(),"top"==l||"bottom"==l?function m(e,a,o){var l=a.width()+p;e.width(l),f(o,l)}(o,a,t):function i(e,a,o,l){var t=n().getHostData().isIE(8,"lte"),r=t?a.height():a.width();a.width(r),t||(a.css(o,(r-c)/2*-1),a.css("bottom",(r-d)/2));var m=r+p;e.height(m),f(l,m)}(o,a,l,t),r||e.hide()});function f(e,a){var o=r(window);switch(e){case"center":var l=(o.width()-a)/2/o.width()*100;w.player().css("left",l+"%");break;case"middle":var t=(o.height()-a)/2/o.height()*100;w.player().css("top",t+"%")}}i.Override("addResources",function(e,a){n().ResourceManager.fonts([{id:"widgetFont",name:"widget-font",url:"/player/resources/fonts/widget-font_v3",dummeyText:"&#xe60c;"},{id:"opensans",name:"opensans",url:"/player/resources/fonts/opensans"}],r("head"),e,a)}),i.Override("show",function(){w.show(undefined,e)});function e(){l.on("resize.walkme-player",function(){var e=r(window),a=e.width(),o=e.height();o==m&&a==t||(t=a,m=o,s())})}i.Override("destroy",function(){w.destroy(),l.off("resize.walkme-player")}),i.Override("hide",function(){w.hide(),l.off("resize.walkme-player")}),i.Override("languageChanged",function(e){w.languageChanged(e),s()});(function g(e){i.Extends(k,e),function a(e){r=e}(e.jQuery),i._base.name("Colorado"),w=i._base,o=w.config,n=w.utils,l=r(w.windowTopContainer())}).apply(null,arguments)})}).call(window)},917:function(a,e,o){(function(){var e=o(918);a.exports="string"==typeof e?e:e.toString()}).call(window)},918:function(e,a,o){(e.exports=o(879)(!1)).push([e.i,"@media print{.walkme-player{display:none !important}}@media print{.walkme-menu{display:none !important}}@media print{#walkme-attengrab{display:none !important}}.walkme-direction-ltr{direction:ltr !important;text-align:left !important}.walkme-direction-rtl{direction:rtl !important;text-align:right !important}.walkme-css-reset{padding:0 !important;margin:0 !important;vertical-align:middle !important;border-collapse:inherit !important;background:none !important;border-spacing:1px 1px !important;line-height:normal !important;border-top:none !important;border-right:none !important;border-bottom:none !important;border-left:none !important;text-shadow:none !important;overflow:visible !important;table-layout:auto !important;position:static !important;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box;color:#eb15e2 !important;width:auto;height:auto;float:none !important;transition:none !important}.walkme-player{position:fixed !important;z-index:2147483647 !important;cursor:pointer !important}.walkme-player .walkme-out-wrapper{direction:ltr !important}.walkme-player .walkme-arrow{position:absolute !important;width:10px !important;height:7px !important;z-index:2147483647 !important}.walkme-player .walkme-icon{position:absolute !important;height:27px !important;width:34px !important;background-image:url(images/player/questionmark.png) !important;z-index:2147483641 !important}.walkme-player.walkme-position-major-top{top:0px}.walkme-player.walkme-position-major-top .walkme-out-wrapper{border-radius:0px 0px 12px 12px}.walkme-player.walkme-position-major-top .walkme-in-wrapper{border-radius:0px 0px 12px 12px}.walkme-player.walkme-position-major-top .walkme-arrow{top:14px !important;right:6px !important;-moz-transform:rotate(-180deg) !important;-ms-transform:rotate(-180deg) !important;-webkit-transform:rotate(-180deg) !important;transform:rotate(-180deg) !important}.walkme-player.walkme-position-major-right{right:0px}.walkme-player.walkme-position-major-right .walkme-out-wrapper{border-radius:12px 0px 0px 12px}.walkme-player.walkme-position-major-right .walkme-in-wrapper{border-radius:12px 0px 0px 12px}.walkme-player.walkme-position-major-right .walkme-arrow{top:145px !important;right:11px !important;-moz-transform:rotate(-90deg) !important;-ms-transform:rotate(-90deg) !important;-webkit-transform:rotate(-90deg) !important;transform:rotate(-90deg) !important;filter:progid:DXImageTransform.Microsoft.gradient( startColorstr='#e2f5ff', endColorstr='#c6e3f3',GradientType=1 )}.walkme-player.walkme-position-major-bottom{bottom:0px}.walkme-player.walkme-position-major-bottom .walkme-out-wrapper{border-radius:12px 12px 0px 0px}.walkme-player.walkme-position-major-bottom .walkme-in-wrapper{border-radius:12px 12px 0px 0px}.walkme-player.walkme-position-major-bottom .walkme-arrow{bottom:11px !important;right:4px !important}.walkme-player.walkme-position-major-left{left:0px}.walkme-player.walkme-position-major-left .walkme-out-wrapper{border-radius:0px 12px 12px 0px}.walkme-player.walkme-position-major-left .walkme-in-wrapper{border-radius:0px 12px 12px 0px}.walkme-player.walkme-position-major-left .walkme-arrow{top:145px !important;left:11px !important;-moz-transform:rotate(-270deg) !important;-ms-transform:rotate(-270deg) !important;-webkit-transform:rotate(-270deg) !important;transform:rotate(-270deg) !important;filter:progid:DXImageTransform.Microsoft.gradient( startColorstr='#e2f5ff', endColorstr='#c6e3f3',GradientType=1 )}.walkme-player.walkme-ie.walkme-ie-7.walkme-position-major-top .walkme-arrow,.walkme-player.walkme-ie.walkme-ie-8.walkme-position-major-top .walkme-arrow,.walkme-player.walkme-ie.walkme-ie-9.walkme-position-major-top .walkme-arrow{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2) !important;-moz-transform:rotate(0) !important;-ms-transform:rotate(0) !important;-webkit-transform:rotate(0) !important;transform:rotate(0) !important}.walkme-player.walkme-ie.walkme-ie-7.walkme-position-major-right .walkme-arrow,.walkme-player.walkme-ie.walkme-ie-8.walkme-position-major-right .walkme-arrow,.walkme-player.walkme-ie.walkme-ie-9.walkme-position-major-right .walkme-arrow{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3) !important;-moz-transform:rotate(0) !important;-ms-transform:rotate(0) !important;-webkit-transform:rotate(0) !important;transform:rotate(0) !important}.walkme-player.walkme-ie.walkme-ie-7.walkme-position-major-left .walkme-arrow,.walkme-player.walkme-ie.walkme-ie-8.walkme-position-major-left .walkme-arrow,.walkme-player.walkme-ie.walkme-ie-9.walkme-position-major-left .walkme-arrow{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1) !important;-moz-transform:rotate(0) !important;-ms-transform:rotate(0) !important;-webkit-transform:rotate(0) !important;transform:rotate(0) !important}.walkme-player.walkme-colorado,.walkme-player.walkme-colorado *{font-family:'walkme-opensans', Arial !important}.walkme-player.walkme-colorado.walkme-position-minor-top,.walkme-player.walkme-colorado *.walkme-position-minor-top{top:100px}.walkme-player.walkme-colorado.walkme-position-minor-bottom,.walkme-player.walkme-colorado *.walkme-position-minor-bottom{bottom:100px}.walkme-player.walkme-colorado.walkme-position-minor-left,.walkme-player.walkme-colorado *.walkme-position-minor-left{left:100px}.walkme-player.walkme-colorado.walkme-position-minor-right,.walkme-player.walkme-colorado *.walkme-position-minor-right{right:100px}.walkme-player.walkme-colorado.walkme-position-minor-center,.walkme-player.walkme-colorado *.walkme-position-minor-center{left:50%}.walkme-player.walkme-colorado.walkme-position-minor-middle,.walkme-player.walkme-colorado *.walkme-position-minor-middle{top:50%}.walkme-player.walkme-colorado.walkme-position-minor-left_corner,.walkme-player.walkme-colorado *.walkme-position-minor-left_corner{left:0px}.walkme-player.walkme-colorado.walkme-position-minor-right_corner,.walkme-player.walkme-colorado *.walkme-position-minor-right_corner{right:0px}.walkme-player.walkme-colorado .walkme-in-wrapper,.walkme-player.walkme-colorado * .walkme-in-wrapper{position:relative !important;border-width:1px !important;border-style:solid !important;border-radius:0 !important}.walkme-player.walkme-colorado .walkme-title,.walkme-player.walkme-colorado * .walkme-title{position:absolute !important;font-size:18px !important;font-weight:normal !important;z-index:2147483640 !important;white-space:nowrap !important;display:inline-block !important}.walkme-player.walkme-colorado .walkme-question-mark,.walkme-player.walkme-colorado * .walkme-question-mark{*zoom:expression(this.runtimeStyle[ 'zoom' ] = '1', this.innerHTML = '&#xe606;');display:inline-block !important;font-family:'walkme-widget-font' !important;font-style:normal !important;font-weight:normal !important;line-height:1 !important;-webkit-font-smoothing:antialiased !important;-moz-osx-font-smoothing:grayscale !important;width:30px !important;padding-top:10px !important;height:30px !important;color:#ffffff !important;font-size:20px}.walkme-player.walkme-colorado .walkme-question-mark:before,.walkme-player.walkme-colorado * .walkme-question-mark:before{content:\"\\e606\"}.walkme-player.walkme-colorado.walkme-direction-ltr .walkme-question-mark,.walkme-player.walkme-colorado *.walkme-direction-ltr .walkme-question-mark{padding-left:10px !important}.walkme-player.walkme-colorado.walkme-direction-rtl .walkme-question-mark,.walkme-player.walkme-colorado *.walkme-direction-rtl .walkme-question-mark{padding-right:10px !important}.walkme-player.walkme-colorado.walkme-position-major-top .walkme-in-wrapper,.walkme-player.walkme-colorado *.walkme-position-major-top .walkme-in-wrapper{height:40px !important;border-top:none !important}.walkme-player.walkme-colorado.walkme-position-major-top.walkme-direction-ltr .walkme-title,.walkme-player.walkme-colorado *.walkme-position-major-top.walkme-direction-ltr .walkme-title{top:8px !important;left:50px !important}.walkme-player.walkme-colorado.walkme-position-major-top.walkme-direction-rtl .walkme-title,.walkme-player.walkme-colorado *.walkme-position-major-top.walkme-direction-rtl .walkme-title{top:8px !important;right:50px !important}.walkme-player.walkme-colorado.walkme-position-major-right .walkme-in-wrapper,.walkme-player.walkme-colorado *.walkme-position-major-right .walkme-in-wrapper{width:40px !important;border-right:none !important}.walkme-player.walkme-colorado.walkme-position-major-right .walkme-title,.walkme-player.walkme-colorado *.walkme-position-major-right .walkme-title{-moz-transform:rotate(90deg);-ms-transform:rotate(90deg);-webkit-transform:rotate(90deg);transform:rotate(90deg)}.walkme-player.walkme-colorado.walkme-position-major-bottom .walkme-in-wrapper,.walkme-player.walkme-colorado *.walkme-position-major-bottom .walkme-in-wrapper{height:40px !important;border-bottom:none !important}.walkme-player.walkme-colorado.walkme-position-major-bottom.walkme-direction-ltr .walkme-title,.walkme-player.walkme-colorado *.walkme-position-major-bottom.walkme-direction-ltr .walkme-title{top:9px !important;left:49px !important}.walkme-player.walkme-colorado.walkme-position-major-bottom.walkme-direction-rtl .walkme-title,.walkme-player.walkme-colorado *.walkme-position-major-bottom.walkme-direction-rtl .walkme-title{top:8px !important;right:49px !important}.walkme-player.walkme-colorado.walkme-position-major-left .walkme-in-wrapper,.walkme-player.walkme-colorado *.walkme-position-major-left .walkme-in-wrapper{width:40px !important;border-left:none !important}.walkme-player.walkme-colorado.walkme-position-major-left .walkme-title,.walkme-player.walkme-colorado *.walkme-position-major-left .walkme-title{-moz-transform:rotate(90deg);-ms-transform:rotate(90deg);-webkit-transform:rotate(90deg);transform:rotate(90deg)}.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-right.walkme-ie-7 .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-right.walkme-ie-8 .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-left.walkme-ie-7 .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-left.walkme-ie-8 .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-right.walkme-ie-7 .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-right.walkme-ie-8 .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-left.walkme-ie-7 .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-left.walkme-ie-8 .walkme-title{margin:10px 10px 0 !important}.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-right.walkme-ie-8 .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-left.walkme-ie-8 .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-right.walkme-ie-8 .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-left.walkme-ie-8 .walkme-title{top:37px !important}.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-right.walkme-ie-8.walkme-direction-rtl .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-left.walkme-ie-8.walkme-direction-rtl .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-right.walkme-ie-8.walkme-direction-rtl .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-left.walkme-ie-8.walkme-direction-rtl .walkme-title{right:0 !important}.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-right.walkme-ie-8.walkme-direction-ltr .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-left.walkme-ie-8.walkme-direction-ltr .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-right.walkme-ie-8.walkme-direction-ltr .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-left.walkme-ie-8.walkme-direction-ltr .walkme-title{left:0 !important}.walkme-player.walkme-colorado.walkme-ie.walkme-ie-7.walkme-position-major-right .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-ie-8.walkme-position-major-right .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-ie-7.walkme-position-major-right .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-ie-8.walkme-position-major-right .walkme-title{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1)}.walkme-player.walkme-colorado.walkme-ie.walkme-ie-7.walkme-position-major-left .walkme-title,.walkme-player.walkme-colorado.walkme-ie.walkme-ie-8.walkme-position-major-left .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-ie-7.walkme-position-major-left .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-ie-8.walkme-position-major-left .walkme-title{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1)}.walkme-player.walkme-colorado.walkme-ie.walkme-position-major-bottom .walkme-title,.walkme-player.walkme-colorado *.walkme-ie.walkme-position-major-bottom .walkme-title{top:10px !important}.walkme-player.walkme-colorado.walkme-direction-ltr .walkme-title,.walkme-player.walkme-colorado *.walkme-direction-ltr .walkme-title{direction:ltr !important}.walkme-player.walkme-colorado.walkme-direction-rtl .walkme-title,.walkme-player.walkme-colorado *.walkme-direction-rtl .walkme-title{direction:rtl !important}\n",""])},919:function(e,a,o){var l={"./widget.player.colorado.black-blue.css":920,"./widget.player.colorado.mixin.css":922,"./widget.player.colorado.white-blue.css":924,"./widget.player.colorado.white-green.css":926,"./widget.player.colorado.white-orange.css":928};function t(e){var a=r(e);return o(a)}function r(e){var a=l[e];if(a+1)return a;var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}t.keys=function(){return Object.keys(l)},t.resolve=r,(e.exports=t).id=919},920:function(a,e,o){(function(){var e=o(921);a.exports="string"==typeof e?e:e.toString()}).call(window)},921:function(e,a,o){(e.exports=o(879)(!1)).push([e.i,".walkme-player.walkme-colorado.walkme-theme-black-blue,.walkme-player.walkme-colorado.walkme-theme-black-blue *{background-color:#363636 !important}.walkme-player.walkme-colorado.walkme-theme-black-blue .walkme-in-wrapper,.walkme-player.walkme-colorado.walkme-theme-black-blue * .walkme-in-wrapper{border-color:#7a7a7a !important;-moz-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;-webkit-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important}.walkme-player.walkme-colorado.walkme-theme-black-blue .walkme-question-mark,.walkme-player.walkme-colorado.walkme-theme-black-blue * .walkme-question-mark{background-color:#369cd9 !important}.walkme-player.walkme-colorado.walkme-theme-black-blue.walkme-ie .walkme-arrow{background-color:#363636 !important}.walkme-player.walkme-colorado.walkme-theme-black-blue.walkme-ie .walkme-title{background-color:#363636 !important}.walkme-player.walkme-colorado.walkme-theme-black-blue.walkme-ie-10 .walkme-arrow{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-black-blue.walkme-ie-10 .walkme-title{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-black-blue .walkme-title{color:#fff !important}\n",""])},922:function(a,e,o){(function(){var e=o(923);a.exports="string"==typeof e?e:e.toString()}).call(window)},923:function(e,a,o){(e.exports=o(879)(!1)).push([e.i,"",""])},924:function(a,e,o){(function(){var e=o(925);a.exports="string"==typeof e?e:e.toString()}).call(window)},925:function(e,a,o){(e.exports=o(879)(!1)).push([e.i,".walkme-player.walkme-colorado.walkme-theme-white-blue,.walkme-player.walkme-colorado.walkme-theme-white-blue *{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-blue .walkme-in-wrapper,.walkme-player.walkme-colorado.walkme-theme-white-blue * .walkme-in-wrapper{border-color:#c6c6c6 !important;-moz-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;-webkit-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important}.walkme-player.walkme-colorado.walkme-theme-white-blue .walkme-question-mark,.walkme-player.walkme-colorado.walkme-theme-white-blue * .walkme-question-mark{background-color:#369cd9 !important}.walkme-player.walkme-colorado.walkme-theme-white-blue.walkme-ie .walkme-arrow{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-blue.walkme-ie .walkme-title{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-blue.walkme-ie-10 .walkme-arrow{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-white-blue.walkme-ie-10 .walkme-title{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-white-blue .walkme-title{color:#474747 !important}\n",""])},926:function(a,e,o){(function(){var e=o(927);a.exports="string"==typeof e?e:e.toString()}).call(window)},927:function(e,a,o){(e.exports=o(879)(!1)).push([e.i,".walkme-player.walkme-colorado.walkme-theme-white-green,.walkme-player.walkme-colorado.walkme-theme-white-green *{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-green .walkme-in-wrapper,.walkme-player.walkme-colorado.walkme-theme-white-green * .walkme-in-wrapper{border-color:#c6c6c6 !important;-moz-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;-webkit-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important}.walkme-player.walkme-colorado.walkme-theme-white-green .walkme-question-mark,.walkme-player.walkme-colorado.walkme-theme-white-green * .walkme-question-mark{background-color:#76d331 !important}.walkme-player.walkme-colorado.walkme-theme-white-green.walkme-ie .walkme-arrow{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-green.walkme-ie .walkme-title{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-green.walkme-ie-10 .walkme-arrow{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-white-green.walkme-ie-10 .walkme-title{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-white-green .walkme-title{color:#474747 !important}\n",""])},928:function(a,e,o){(function(){var e=o(929);a.exports="string"==typeof e?e:e.toString()}).call(window)},929:function(e,a,o){(e.exports=o(879)(!1)).push([e.i,".walkme-player.walkme-colorado.walkme-theme-white-orange,.walkme-player.walkme-colorado.walkme-theme-white-orange *{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-orange .walkme-in-wrapper,.walkme-player.walkme-colorado.walkme-theme-white-orange * .walkme-in-wrapper{border-color:#c6c6c6 !important;-moz-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;-webkit-box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important;box-shadow:0 0px 7px -2px rgba(50,50,50,0.4) !important}.walkme-player.walkme-colorado.walkme-theme-white-orange .walkme-question-mark,.walkme-player.walkme-colorado.walkme-theme-white-orange * .walkme-question-mark{background-color:#f77c2b !important}.walkme-player.walkme-colorado.walkme-theme-white-orange.walkme-ie .walkme-arrow{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-orange.walkme-ie .walkme-title{background-color:#fff !important}.walkme-player.walkme-colorado.walkme-theme-white-orange.walkme-ie-10 .walkme-arrow{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-white-orange.walkme-ie-10 .walkme-title{background-color:transparent !important}.walkme-player.walkme-colorado.walkme-theme-white-orange .walkme-title{color:#474747 !important}\n",""])}}]);
