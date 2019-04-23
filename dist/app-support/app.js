/*
录音
https://github.com/xiangyuecn/Recorder
src: app-support/app.js,app-support/app-ios-weixin-support.js,app-support/app-native-support.js
*/
!function(){"use strict";var n=/MicroMessenger/i.test(navigator.userAgent),u=window.RecordAppBaseFolder||"/Recorder/dist/",e=window.OnRecordAppInstalled,f=[{Key:"Native",Support:function(e){e(!1)},Config:{}},{Key:"IOS-Weixin",Support:function(e){p.AlwaysUseWeixinJS||!Recorder.Support()?e(n):e(!1)},Config:{WxReady:function(e){e(null,"未实现IOS-Weixin.Config.WxReady")},DownWxMedia:function(e,n,t){t("下载素材接口DownWxMedia未实现")},AMREngine:[{url:u+"engine/beta-amr.js",check:function(){return!Recorder.prototype.amr}}]},ExtendDefault:!0},{Key:"Default",Support:function(e){e(!0)},Config:{paths:[{url:u+"recorder-core.js",check:function(){return!window.Recorder}},{url:u+"engine/mp3.js",check:function(){return!Recorder.prototype.mp3}}]}}],t=f[0],o=f[1],l=f[2];l.RequestPermission=function(e,n){var t=Recorder();t.open(function(){t.close(),e()},n)},l.Start=function(e,n,t){var o=p.__Rec;null!=o&&o.close(),p.__Rec=o=Recorder({type:e.type,sampleRate:e.sampleRate,bitRate:e.bitRate,onProcess:function(e,n,t,o){p.ReceivePCM(e[e.length-1],n,t,o)}}),o.appSet=e,o.open(function(){o.start(),n()},function(e){t(e)})},l.Stop=function(t,n){var o=p.__Rec;if(o){var i=function(){for(var e in o.close(),o.set)o.appSet[e]=o.set[e];p.__Rec=null};o.stop(function(e,n){i(),p.BlobRead(e,n,t)},function(e){i(),n(e)})}else n("未开始录音")};var p={LM:"2019-4-23 14:51:14",Current:0,IsWx:n,BaseFolder:u,AlwaysUseWeixinJS:!1,Platforms:{Native:t,Weixin:o,Default:l},Js:function(i,r,c,e){var s=(e=e||window).document,a=function(e){if(e>=i.length)r();else{var n=i[e],t=n.url;if(!1!==n.check()){var o=s.createElement("script");o.setAttribute("type","text/javascript"),o.setAttribute("src",t),o.onload=function(){a(e+1)},o.onerror=function(e){c("请求失败:"+(e.message||"-")+"，"+t)},s.body.appendChild(o)}else a(e+1)}};a(0)},BlobRead:function(e,n,t){var o=new FileReader;o.onloadend=function(){t({mime:e.type,duration:n,data:(/.+;\s*base64\s*,\s*(.+)$/i.exec(o.result)||[])[1]})},o.readAsDataURL(e)},ReceivePCM:function(e,n,t,o){p.OnProcess&&p.OnProcess([e],n,t,o)},Install:function(t,o){var i=p.__reqs||(p.__reqs=[]);i.push({s:t,f:o}),t=function(){r("s",arguments)},o=function(e,n){r("f",arguments)};var r=function(e,n){for(var t=0;t<i.length;t++)i[t][e].apply(null,n);i.length=0};if(!(1<i.length)){var c=0,s=function(n,e){if(n.IsInit)e();else{var t=n.Config.paths||[u+"app-support/app-"+n.Key.toLowerCase()+"-support.js"];p.Js(t,function(){n.IsInit=!0,e()},function(e){e="初始化js库失败："+e,console.log(e,n),o(e)})}},a=function(n){if(n)p.Current=n,t();else{var e=function(){n.Support(function(e){e?s(n,function(){a(n)}):(c++,a())})};(n=f[c]).ExtendDefault?s(l,e):e()}};a(p.Current)}},RequestPermission:function(n,t){p.Install(function(){var e=p.Current;console.log("开始请求"+e.Key+"录音权限"),e.RequestPermission(function(){console.log("录音权限请求成功"),n()},function(e,n){console.log("录音权限请求失败："+e+",isUserNotAllow:"+n),t(e,n)})},function(e){console.log("Install失败",e),t(e)})},Start:function(e,n,t){var o=p.Current;if(o){e||(e={});var i={type:"mp3",sampleRate:16e3,bitRate:16};for(var r in i)e[r]||(e[r]=i[r]);o.Start(e,function(){console.log("开始录音",e),n()},function(e){console.log("开始录音失败："+e),t(e)})}else t("需先调用RequestPermission")},Stop:function(r,n){var e=p.Current;e?e.Stop(function(e){for(var n=atob(e.data),t=n.length,o=new Uint8Array(t);t--;)o[t]=n.charCodeAt(t);var i=new Blob([o],{type:e.mime});console.log("结束录音"+i.size+"b "+e.duration+"ms",i),r(i,e.duration)},function(e){console.log("结束录音失败："+e),n(e)}):n("需先调用RequestPermission")}};window.RecordApp=p,e&&e()}(),function(){"use strict";var s=RecordApp,e=s.Platforms.Weixin,i=e.Config;e.IsInit=!0;var a={};e.RequestPermission=function(t,o){i.WxReady(function(e,n){a.wx=e,n?o("微信JsSDK准备失败："+n):t()})},e.Start=function(e,n,t){a.start=e,a.wx.startRecord({success:function(){n()},fail:function(e){t("无法录音："+e.errMsg)}})},e.Stop=function(r,c){c=function(e){c("录音失败："+(e.errMsg||e))};a.wx.stopRecord({fail:c,success:function(e){var n=e.localId;console.log("微信录音 wx.playVoice({localId:'"+n+"'})"),wx.uploadVoice({localId:n,isShowProgressTips:0,fail:c,success:function(e){var n=e.serverId;console.log("微信录音serverId:"+n),i.DownWxMedia(n,function(e){var o,n;/amr/i.test(e.mime)?(o=e.data,n=function(){for(var e=atob(o),n=e.length,t=new Uint8Array(n);n--;)t[n]=e.charCodeAt(n);Recorder.AMR.decode(t,function(e){var o=a.start,i=Recorder(o).mock(e,8e3);i.stop(function(e,n){for(var t in i.set)o[t]=i.set[t];s.BlobRead(e,n,r)},c)},function(e){c("AMR音频无法解码:"+e)})},Recorder.AMR?n():s.Js(i.AMREngine,n,function(){c("加载AMR转换引擎失败")})):c("微信服务器返回了未知音频类型："+e.mime)},function(e){c("下载音频失败："+e)})}})}})}}(),function(){"use strict";var s=RecordApp,e=s.Platforms.Native;e.Config;e.IsInit=!0,window.top.NativeRecordReceivePCM=function(e,n,t){for(var o,i=e.length,r=0,c=0;c<i;c++)r+=Math.abs(e[c]);o=(r/=i)<1251?Math.round(r/1250*10):Math.round(Math.min(100,Math.max(0,100*(1+Math.log10(r/1e4))))),s.ReceivePCM(e,o,n,t)},e.RequestPermission=function(e,n){n("未实现RequestPermission调用App原生接口")},e.Start=function(e,n,t){t("未实现Start调用App原生接口")},e.Stop=function(e,n){n("未实现Stop调用App原生接口")}}();