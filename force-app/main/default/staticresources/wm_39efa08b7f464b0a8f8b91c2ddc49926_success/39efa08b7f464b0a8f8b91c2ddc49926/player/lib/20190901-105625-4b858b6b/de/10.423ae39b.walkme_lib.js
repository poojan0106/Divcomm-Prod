window.walkMeGermany = true;(window._walkmeWebpackJP=window._walkmeWebpackJP||[]).push([[10],{644:function(n,t,e){(function(){var l=e(645),a={init:function s(){var t=l.get("CaliforniaBalloonStyleChecker"),n=l.get("CaliforniaBalloonStyleGetter"),e=l.get("CaliforniaBalloonStyleSetter"),o=l.get("CaliforniaSurveyStyleGetter"),r=l.get("CaliforniaSurveyStyleSetter"),i=l.get("CaliforniaBalloonEditorWrapper").getFunc;a.isCaliforniaBalloonStyle=function(){return i(t.isCaliforniaBalloonStyle).apply(null,arguments)},a.getMinPopupWidth=function(){return i(n.getMinPopupWidth).apply(null,arguments)},a.addClickAndHover=function(){return i(e.addClickAndHover).apply(null,arguments)},a.setTemplateData=function(){return i(e.setTemplateData).apply(null,arguments)},a.getAnswerCss=function(){return i(o.getAnswerCss).apply(null,arguments)},a.setErrorDiv=function(){return i(r.setErrorDiv).apply(null,arguments)},a.setSurveyTitleDivStyles=function(){return i(r.setSurveyTitleDivStyles).apply(null,arguments)},a.setSurveyQuestionTitleStyles=function(){return i(r.setSurveyQuestionTitleStyles).apply(null,arguments)},a.setSurveyQuestionSubTitleStyles=function(){return i(r.setSurveyQuestionSubTitleStyles).apply(null,arguments)},a.setQuestionCountStyles=function(){return i(r.setQuestionCountStyles).apply(null,arguments)},a.setAnswerTextStyles=function(){return i(r.setAnswerTextStyles).apply(null,arguments)},a.setAnswerTextAreaStyles=function(){return i(r.setAnswerTextAreaStyles).apply(null,arguments)},a.setAnswerTitleStyles=function(){return i(r.setAnswerTitleStyles).apply(null,arguments)},a.setSurveyContentStyles=function(){return i(r.setSurveyContentStyles).apply(null,arguments)},a.setSurveyWithNpsStyles=function(){return i(r.setSurveyWithNpsStyles).apply(null,arguments)}},services:[],types:[]};!function t(){e(646),e(647),e(648),e(649),e(650),e(651),e(652)}(),e(70).registerApi(a,l),n.exports=a}).call(window)},645:function(t,n,e){(function(){t.exports=e(70).create()}).call(window)},646:function(t,n,o){(function(){o(645).register("CaliforniaBalloonStyleChecker").asCtor(function e(t){this.isCaliforniaBalloonStyle=function n(){return"california"===t.get().BalloonSettings.BalloonStyle}}).dependencies("SiteConfigManager")}).call(window)},647:function(t,n,e){(function(){e(645).register("CaliforniaBalloonStyleGetter").asCtor(function n(){this.getMinPopupWidth=function t(){return 370}})}).call(window)},648:function(t,n,e){(function(){e(645).register("CaliforniaBalloonStyleSetter").asCtor(function n(i,e,l,t,a){var s="border-color",u="background-color",c="color",p="box-shadow",o=".walkme-custom-balloon-normal-button",r=".walkme-custom-balloon-weak-button";function d(t,n,e,o){var r={cssProperty:n,elemSelector:e,balloonDiv:o};switch(n){case s:f(t.ButtonBgColor,t.ButtonBgHoverColor,t.ButtonBgClickColor,r);break;case u:f(t.BalloonColor2,t.ButtonBgHoverColor,t.ButtonBgClickColor,r);break;case c:f(t.FooterTextColor,t.FooterTextColor,t.FooterTextColor,r);break;case p:f(l.calculate(a.SHADOW_TYPES.Button,a.SHADOW_LEVEL.Medium,i.get().BalloonSettings.ButtonBorderColor),"none","none",r)}return r}function f(t,n,e,o){o.regularColor=t,o.hoverColor=n,o.clickColor=e}this.addClickAndHover=function g(t,n){e.addClickAndHover(d(t,s,o,n)),e.addClickAndHover(d(t,s,r,n)),e.addClickAndHover(d(t,p,o,n)),e.addClickAndHover(d(t,p,r,n)),e.addClickAndHover(d(t,u,r,n)),e.addClickAndHover(d(t,c,".walkme-custom-powered-by",n))},this.setTemplateData=function w(t){var n=i.get().BalloonSettings;t.isCaliforniaStyle=!0,t.data.title||(t.noTitle=!0),t.data.content||(t.noContent=!0),t.data.stepIndexText&&(t.stepIndexText=!0),t.shadow=l.calculate(n.ShadowType,n.ShadowLevel,n.ShadowColor),t.colors.btnShadow=l.calculate(a.SHADOW_TYPES.Button,a.SHADOW_LEVEL.Medium,n.ButtonBorderColor)}}).dependencies("SiteConfigManager, ClickAndHoverAdder, CaliforniaShadowCalculator, CommonUtils, Consts")}).call(window)},649:function(t,n,o){(function(){o(645).register("CaliforniaShadowCalculator").asCtor(function e(o,t){var r,i;this.calculate=function l(t,n,e){if(t===r.Shadow)switch(n){case i.Light:return"0px 0px 24px 6px rgba(42, 89, 138, 0.15)";case i.Medium:return"0px 0px 24px 6px rgba(42, 89, 138, 0.25)";case i.Intense:return"0px 0px 24px 6px rgba(42, 89, 138, 0.50)"}else if(t===r.Glow)switch(n){case i.Light:return"0px 0px 24px 6px rgba"+o.hexToRgba(e,.15);case i.Medium:return"0px 0px 24px 6px rgba"+o.hexToRgba(e,.25);case i.Intense:return"0px 0px 24px 6px rgba"+o.hexToRgba(e,.5)}else if(t===r.Button)return"0px 2px 4px 0px rgba"+o.hexToRgba(e,.25)},function n(){r=t.SHADOW_TYPES,i=t.SHADOW_LEVEL}()}).dependencies("UiUtils, Consts")}).call(window)},650:function(t,n,e){(function(){e(645).register("CaliforniaSurveyStyleGetter").asCtor(function t(o,r,i){this.getAnswerCss=function l(){var t=o.get().BalloonSettings,n=r.calculate(i.SHADOW_TYPES.Button,i.SHADOW_LEVEL.Medium,t.ButtonBorderColor),e=".walkme-nps-survey-wrapper {width: 542px !important;; max-width: 542px !important;}";return e+=".walkme-nps-survey {width: 500px !important; margin-left: 0px !important;}",e+=".walkme-survey-question-nps-answers {display: table !important; margin: 10px 0 0 !important; width: 100% !important;}",e+=".walkme-survey-nps-answer {display: inline-block !important; margin: 0 2px !important;}",e+=".walkme-survey-nps-answer#walkme-survey-answer-0 {margin-left: 1px !important;}",e+=".walkme-survey-nps-answer#walkme-survey-answer-10 {margin-right: 0px !important;}",e+=".walkme-survey-answer-label-nps-radiobutton {display: inline-block !important; max-width: 545px !important; width: 39px !important; height: 39px !important; border-radius: 50% !important; border: 1px solid #A2ABBD !important; margin: 0 0 0 -17.5px !important; text-align: center !important; line-height: 40px !important; color: "+t.ContentColor+" !important; cursor: pointer !important; transition: all 150ms !important; box-shadow: "+n+" !important;}",e+=".walkme-survey-answer-label-nps-radiobutton:hover {background: "+t.ButtonBgHoverColor+" !important; border-color: "+t.ButtonBgHoverColor+"!important; color: "+t.ButtonTextColor+"!important; transition: all .1s !important; box-shadow: none !important;}",e+=".walkme-survey-nps-answer.selected .walkme-survey-answer-label-nps-radiobutton {background: "+t.ButtonBgClickColor+" !important; border-color: "+t.ButtonBgClickColor+" !important; color:  "+t.BalloonColor2+" !important; transition: all .1s !important; box-shadow: none !important;}",e+=".walkme-survey-question-nps-scores-wrapper {display: block !important; margin: 0 !important;}",e+=".walkme-survey-low-score-div, .walkme-survey-high-score-div {display: inline-block !important; font-size: 12px !important; color: #A2ABBD !important;}",e+=".walkme-survey-high-score-div {float: right !important;}",e+=".walkme-survey-low-score-div > span, .walkme-survey-high-score-div > span {display: inline-block; max-width: 196px;}",e+=".walkme-survey-high-score-div > span {float: right !important; text-align: right !important;}"}}).dependencies("SiteConfigManager, CaliforniaShadowCalculator, Consts")}).call(window)},651:function(t,n,e){(function(){e(645).register("CaliforniaSurveyStyleSetter").asCtor(function w(t,e,o){var n=this;function r(){return t.get().BalloonSettings}n.setSurveyTitleDivStyles=function i(t){t.css("font-size","18px"),t.css("padding","0"),t.css("line-height","31px"),t.css("margin","0 20px 0 0"),t.css("font-weight","normal")},n.setSurveyQuestionTitleStyles=function l(t){t.css("font-weight","normal"),t.css("margin","20px 0 20px 0"),t.css("line-height","26px")},n.setSurveyQuestionSubTitleStyles=function a(t){t.css("margin","20px 0 20px 0"),t.css("font-weight","normal"),t.css("padding","0"),t.css("font-size","14px"),t.css("line-height","23px")},n.setQuestionCountStyles=function s(t){t.css("font-size","10px"),t.css("color","#A2ABBD")},n.setAnswerTextStyles=function u(t){t.css("margin","4px 0 10px 5px"),t.css("padding","0"),t.css("font-size","12px"),t.css("font-weight","normal"),t.css("color",r().ContentColor),t.css("line-height","20px")},n.setAnswerTextAreaStyles=function c(t){var n=e.calculate(o.SHADOW_TYPES.Button,o.SHADOW_LEVEL.Medium,r().ButtonBorderColor);t.css("margin","10px 0 0px 0"),t.css("padding","5px "),t.css("box-sizing","content-box"),t.css("width","96%"),t.css("border","1px solid #C7CCD7"),t.css("border-radius","4px"),t.css("box-shadow","inset "+n)},n.setAnswerTitleStyles=function p(t){t.css("margin","4px 0 10px 5px"),t.css("padding","0"),t.css("font-size","12px"),t.css("font-weight","normal"),t.css("color",r().ContentColor),t.css("line-height","20px")},n.setSurveyContentStyles=function d(t){t.find(".walkme-custom-balloon-content").css("margin","20px 20px 0")},n.setSurveyWithNpsStyles=function f(t){t.css("left","calc(50% - 265px)"),t.css("width","532px")},n.setErrorDiv=function g(t){t.css("top","8px"),t.css("color","#FF6110")}}).dependencies("SiteConfigManager, CaliforniaShadowCalculator, Consts")}).call(window)},652:function(t,n,e){(function(){e(645).register("CaliforniaBalloonEditorWrapper").asCtor(function t(e){this.getFunc=function i(t){return function n(){return e.get().BalloonSettings.BalloonStyle===o}()?t:r};var o="california";function r(){}}).dependencies("SiteConfigManager")}).call(window)}}]);
