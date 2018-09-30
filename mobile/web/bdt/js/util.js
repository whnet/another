// 百度统计js
// test.mailizc.com
var _hmt = _hmt || [];
var g_erweimaShow = 0;
$(function(){
	//如果是back回来，恢复html
	if(pageCacheAndBackUtils.hasCurrPageCache()){
		$("body").html(readClientSession("cachePageBodyHtml"));
	}
});

$(document).ready(function() {
	if (self.frameElement && self.frameElement.tagName == "IFRAME") {
	}else{
	 	customHistoryUtilsAdd();
	 	if($("#back").length>0  && window.location.pathname !="/article_edit.html" && window.location.pathname !="/message_edit.html" && window.location.pathname !="/message_voice.html"){
	 		$("#back").click(function(){
	 			customHistoryUtilsBack();
	 		});
	 	}
 	}
 });


var pageCacheAndBackUtils = {
	//跳转到列表页时保存当前数据，用在未来back回来时使用
    cachePageDataBeforeJump : function (pageUrl,pageGlobalData,pageBodyHtml){
		//cachePageUrl:缓存页面的url
		writeClientSession("cachePageUrl",pageUrl);
		//cachePageGlobalData:缓存页面的全局变量
		writeClientSession("cachePageGlobalData",pageGlobalData);
		//cachePageBodyHtml：缓存页面的body Html
		writeClientSession("cachePageBodyHtml",pageBodyHtml);
	},
	//back回来时恢复数据
	restoreHtmlFromCache : function restoreHtmlFromCache(){
		writeClientSession("backBool",0);

		var cachePageGlobalData = readClientSession("cachePageGlobalData");
		for(key in cachePageGlobalData){
			window[key] = cachePageGlobalData[key];
		}

		//滚动位置
		if(!isUndefined(cachePageGlobalData['position']) && cachePageGlobalData['position']!= null){
			//$('.page__bd').scrollTop(cachePageGlobalData['position']);
			writeClientSession("scrollPosition",cachePageGlobalData['position']);
		}
		
		if(!isUndefined(cachePageGlobalData['page__bd0_position0']) && cachePageGlobalData['page__bd0_position0']!= null && $('#page__bd0').length>0){
			//$('#page__bd0').scrollTop(cachePageGlobalData['page__bd0_position0']);
			writeClientSession("page__bd0_position0",cachePageGlobalData['page__bd0_position0']);
		}
		if(!isUndefined(cachePageGlobalData['page__bd1_position1']) && cachePageGlobalData['page__bd1_position1']!= null && $('#page__bd1').length>0){
			//$('#page__bd1').scrollTop(cachePageGlobalData['page__bd1_position1']);
			writeClientSession("page__bd1_position1",cachePageGlobalData['page__bd1_position1']);
		}
		//清除缓存
		removeClientSession("cachePageUrl");
		removeClientSession("cachePageGlobalData");
		removeClientSession("cachePageBodyHtml");
	},
	//检查当前页是否有缓存
	hasCurrPageCache : function(){
		var backBool = readClientSession("backBool");
		var cachePageUrl = readClientSession("cachePageUrl");
		if(backBool != null && cachePageUrl != null && backBool == 1 && cachePageUrl == window.location.href){
			return true;
		}
		return false;
	}
}


function targrtIsInAppMode(){
	return false;
}

function getDateStringDate(datetime){
	 var year = datetime.getFullYear();
     var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
     var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	 return year + "-" + month + "-" + date ;
}

function getDateStringDateWithSeconds(datetime){
	 var nowDatetime = new Date(datetime);
	 var year = nowDatetime.getFullYear();
     var month = nowDatetime.getMonth() + 1 < 10 ? "0" + (nowDatetime.getMonth() + 1) : nowDatetime.getMonth() + 1;
     var date = nowDatetime.getDate() < 10 ? "0" + nowDatetime.getDate() : nowDatetime.getDate();
	 var hh=nowDatetime.getHours()< 10 ? "0" + nowDatetime.getHours() : nowDatetime.getHours();
	 var mm=nowDatetime.getMinutes()< 10 ? "0" + nowDatetime.getMinutes() : nowDatetime.getMinutes();
	 var ss=nowDatetime.getSeconds()< 10 ? "0" + nowDatetime.getSeconds() : nowDatetime.getSeconds();
	 return year + "-" + month + "-" + date +" " + hh + ":" + mm + ":" + ss;
}

var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;

function getDateDiffDay(dateTimeStamp){
	var today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);
	today = today.getTime();
	yesterday = today - day;
	//alert(today);
	var dayTime = '今天';
	if(dateTimeStamp>=today){
		dayTime = '今天';
	}else if(dateTimeStamp>=yesterday){
		dayTime = '昨天';
	}else{
		dateTimeStamp = new Date(dateTimeStamp)
		dayTime = getDateStringDate(dateTimeStamp);
	}
	return dayTime;
}



function getDateDiff(dateTimeStamp){
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){
	 //若日期不符则弹出窗口告之
	 // alert("结束日期不能小于开始日期！");
		result="刚刚";
	 }
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
	if (dayC<=3&&weekC<1&&monthC<1) {
		if(dayC<=3&&dayC>=1){
		 	result=parseInt(dayC) +"天前";
		 }
		 else if(hourC>=1){
			result=parseInt(hourC) +"个小时前";
		 }
		 else if(minC>=1){
		 	result=parseInt(minC)+"分钟前";
		 }else
			result="刚刚";
		// return result;
	}else{
		// datetime.setTime(groups.addTime);
		var datetime = new Date();
		datetime.setTime(dateTimeStamp);
		result = getDateStringDate(datetime);
	}
	return result;
}

function qaTransformDate(now){
	var time = new Date(now);
    // var   year=time.getYear();
    var   month = time.getMonth()+1 > 9?time.getMonth()+1:'0' +　(time.getMonth()+1);
    var   date = time.getDate() > 9?time.getDate():'0' + time.getDate();
    var   hour = time.getHours() > 9?time.getHours():'0' + time.getHours();
    var   minute = time.getMinutes() > 9?time.getMinutes():'0' +　time.getMinutes();
    // var   second=now.getSeconds();
    // return   year+"-"+month+"-"+date+"   "+hour+"-"+minute+"-"+second;
    return month+"-"+date+" "+hour+":"+minute;
}

function getDateDiffWeek(dateTimeStamp){
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){
	 //若日期不符则弹出窗口告之
	 // alert("结束日期不能小于开始日期！");
	 	result = 0;
	}
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	if (dayC<=1) {
		result = 0;
	}else if (weekC<=1) {
		result = 1;
	}else{
		result = 2;
	}
	return result;
}

/**
function getDateDiffTime(dateTimeStamp){
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0){
	 //若日期不符则弹出窗口告之
	 // alert("结束日期不能小于开始日期！");
		result="刚刚";
	 }
	var monthC =diffValue/month;
	var weekC =diffValue/(7*day);
	var dayC =diffValue/day;
	var hourC =diffValue/hour;
	var minC =diffValue/minute;
	if (dayC<=3&&weekC<1&&monthC<1) {
		if(dayC<=3&&dayC>=1){
		 	result=parseInt(dayC) +"天前";
		 }
		 else if(hourC>=1){
			result=parseInt(hourC) +"个小时前";
		 }
		 else if(minC>=1){
		 	result=parseInt(minC);
		 }else
			result="刚刚";
		// return result;
	}else{
		// datetime.setTime(groups.addTime);
		var datetime = new Date();
		datetime.setTime(dateTimeStamp);
		result = getDateStringDateWithSeconds(datetime);
	}
	return result;
}
*/

function getDateDiffMinute(dateTimeStamp){
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;

	return parseInt(diffValue/minute);
}

function getDateDiffMinute2(dateTimeStamp1,dateTimeStamp2){
	var diffValue = (dateTimeStamp1 - dateTimeStamp2);

	return parseInt(diffValue/minute);
}


function isNumberStr(str){
	var n = Number(str);
	return !isNaN(n);
}
function isNumber(n) {
    return typeof n === 'number';
}

function isUndefined(n) {
    return typeof n === 'undefined';
}

function isPhone(phone) {
	var reg = /^13\d{9}|14[57]\d{8}|15[012356789]\d{8}|17[012356789]\d{8}|18[012356789]\d{8}|170\d{8}$/;
	if(phone == ""){
		return "手机号为空";
	}
	if(!reg.test(phone)){
		return "手机号码格式不正确";
	}else{
		return true;
	}
}
function isEmail(email) {
	var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if(email == ""){
		return "邮箱号为空";
	}
	if(!reg.test(email)){
		return "邮箱格式不正确";
	}else{
		return true;
	}
}
function isDate(mystring) {  
	var reg = /^(\d{4})-(\d{2})-(\d{2})$/;  
	var str = mystring;  
	var arr = reg.exec(str);  
	if (str=="") return true;  
	if (!reg.test(str)&&RegExp.$2<=12&&RegExp.$3<=31){  
		return false;  
	}  
	return true;  
}  

function getBrowserRealWidth() {
	var winWidth = 0;
	if (window.innerWidth)
	{
		winWidth = window.innerWidth;
	}
    else if ((document.body) && (document.body.clientWidth))
	{
       winWidth = document.body.clientWidth;
	}
	// 通过深入 Document 内部对 body 进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientWidth)
	{
	   winWidth = document.documentElement.clientWidth;
	}
	return winWidth;
}

function getBrowserRealHeight() {
    var winHeight = 0;
	// 获取窗口高度
	if (window.innerHeight)
	{
		winHeight = window.innerHeight;
	}
	else if ((document.body) && (document.body.clientHeight))
	{
		winHeight = document.body.clientHeight;
	}
	// 通过深入 Document 内部对 body 进行检测，获取窗口大小
	if (document.documentElement && document.documentElement.clientHeight)
	{
	   winHeight = document.documentElement.clientHeight;
	}
	return winHeight;
}

function getSysSelectOptions(optionType){
	return g_selectOptions[optionType];
} 

function getSysSelectOptionsValueByName(optionType,name){
		var value = -1;
		if(name!=null && optionType!=null&&g_selectOptions!=null){

			for(var key1 in g_selectOptions){
				//console.log("key:"+key);
				if(optionType==key1){
					var selectOption = g_selectOptions[key1];
					for(var i=0;i<selectOption.length;i++){
						if(selectOption[i].name==name){
							value = selectOption[i].value;
						}
					}
				}
            }
		}
		//console.log("value:"+value);
		return value;
} 
function getSysSelectOptionsNameByValue(optionType,value){
		var name = "";
		if(value!=null && optionType!=null&&g_selectOptions!=null){

			for(var key1 in g_selectOptions){
				//console.log("key:"+key);
				if(optionType==key1){
					var selectOption = g_selectOptions[key1];
					for(var i=0;i<selectOption.length;i++){
						if(selectOption[i].value==value){
							name = selectOption[i].name;
						}
					}
				}
            }
		}
		//console.log("name:"+name);
		return name;
} 

function doGetClientConst(){	
       $.post(
			getClientConstUrl,
			{
		       async : false,
		    },
			function(result){
				if(result.result=="success"){
					 writeClientSession("clientInfo",result.clientInfo);
					 getGClientInfo(true);
				}
				else if(result.errorMessage!=null){
					
				}
			}
		);
}

/*本次浏览有效*/ 
function writeClientSession(key,val){
   sessionStorage.setItem(key, JSON.stringify(val));
}
function readClientSession(key){
	//当sessionStorage.getItem(key)为undefind时程序会出错 by wangzhen
	var readValue = sessionStorage.getItem(key);
	if(readValue=='undefined' || readValue == null){
		return null;
	}else{
		return JSON.parse(readValue);
	}
}
function removeClientSession(key){
	sessionStorage.removeItem(key);
}
//移除所有sessionStorage的key
function clearClientSession(){
	sessionStorage.clear(); 
}

function isWeiXinBorrower(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

function isMobileWeiXinBorrower(){
    var ua = window.navigator.userAgent.toLowerCase();
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    if(ua.match(/MicroMessenger/i) == 'micromessenger' && !IsPC()){
        return true;
    }else{
        return false;
    }
}

function checkOpenId(actionName){
	var reUrl=window.location.href;
	if(reUrl.indexOf("rd=1")<0 && isWeiXinBorrower()){
		console.log("begin checkOpenId");
		$.ajax({
		    type: "post",
		    url: checkOpenidUrl,
		    dataType: "json",
		    async: false,
		    data:{},
		    success: function(result) {
		        if (result.result == "success") {
		            //已获得openid
		        } else {
		            //重定向到获取openId的页面
		            var prot = window.location.protocol;
					var newReUrl=prot+"//"+window.location.host+"/wxOpenId.html"+"?actionName="+actionName;
					newReUrl = encodeURIComponent(newReUrl);
					window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+result.data.appid+"&redirect_uri="+newReUrl+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
		        }
		    }
		});
	}
}

function getSystemParams(){
    // var params = readClientSession("params")
    // if (params==null) {
		// $.ajax({
	 //        type: "post",
	 //        url: '',
	 //        dataType: "json",
	 //        async: false,
	 //        data:{},
	 //        success: function(result) {
	 //            if (result.result == "success") {
	 //               params = result.data.params;
	 //               writeClientSession("params",params);
	 //            } else {
	 //                dataLoadedError(result.message);
	 //            }
	 //            // console.log((new Date()) + "getSessionUser end")
	 //        }
	 //    });
    // };
    // return params;
}
function tryAutoLogin(){
		var reUrl= weixinAuthUrl;
		reUrl = encodeURIComponent(reUrl);

		var scope=request("scope");
		var isWeixinUser = readClientStorage("isWeixinUser");
		if (scope != "user" && isWeixinUser=="1"){
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+wenxinAppid+"&redirect_uri="+reUrl+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
		}else{
			window.location.href="redirectTo.html?from=tryAutoLogin";
		}
}

function forceWeixinLogin(){
	if (isWeiXinBorrower()) {
		//直接微信登录
        weixinUserAuth();
	}else{
		window.location.href="redirectTo.html?from=tryAutoLogin";
	}
}


function weixinUserAuth(){
		var reUrl= weixinAuthUrl;
		reUrl = encodeURIComponent(reUrl);

		var scope=request("scope");
		var isWeixinUser = readClientStorage("isWeixinUser");
		if (scope != "user" && isWeixinUser=="1"){
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+wenxinAppid+"&redirect_uri="+reUrl+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
		}else{
			window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+wenxinAppid+"&redirect_uri="+reUrl+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
		}
}

var g_noRedirect_user = null;
/*这个接口可以直接获取，不用考虑联网*/
function getSessionUserNoRedirectEx(){
   if(g_noRedirect_user==null){
	   getSessionUserNoRedirect();
   }
   return g_noRedirect_user;
}

function checkIsInRun(){
	if (hostConf.indexOf("wenfangba")>=0 || hostConf.indexOf("wenfang")>=0 ){
		return true;
	}

	return false;
}
/*
 *isSubscription是否关注当前公众号
 *只有调用getUserLoginStatus接口获取的BriefAuthor里面的isSubscription才有效
 */
function getSessionUser(){
	var user = null;

	//if( checkIsInRun() && !isWeiXinBorrower()){
	//	showQrCodeScan();
	//	return;
	//}
	// console.log((new Date()) + "getSessionUser begin")
	//var user = readClientSession("user");
	//if (user == null || user.length<=0) {
		//"data":{"loginStatus":"0-未登录，1-已登录","user":"user"}
	// $.ajax({
     //    type: "post",
	//     url: '',
     //    dataType: "json",
     //    async: false,
     //    data:{},
     //    success: function(result) {
     //        if (result.result == "success") {
     //            if (result.data.loginStatus==0) {
     //            	//未登录状态;
	// 				//lhj mod
	// 				if (isWeiXinBorrower()) {
	// 					//直接微信登录
     //                    weixinUserAuth();
	// 				}
	// 				else{
	// 					var appType = readClientSession("appType");
	// 					if (appType!=isApp) {
     //            	location.href = "login.html";
	// 					}else{
	// 						location.href = "login.html?appType="+isApp;
	// 					}
	// 				}
     //            }else{
     //            	writeClientSession("user",result.data.user);
	//                 user = result.data.user;
	//                 g_noRedirect_user = result.data.user;
	//                 //向app发送推送需要的标签
	//                 sendAppParma(result.data.user);
	//                 sendAppDeviceInfoFunction();
     //            }
     //        } else {
     //            dataLoadedError(result.message);
     //        }
	//             // console.log((new Date()) + "getSessionUser end")
     //    }
    // });
	// //}
    //
	// return user;
}

function getSessionUserNoRedirect(){
	//if(checkIsInRun() && !isWeiXinBorrower()){
	//	showQrCodeScan();
	//	return;
	//}
	//var user = null;
	//注意这里会获取当前用户是否是微信用户，如果是会在登录的地方有特别处理

	//var user = readClientSession("user");
	//if (user == null || user.length<=0) {
		//"data":{"loginStatus":"0-未登录，1-已登录","user":"user"}
		// $.ajax({
	     //    type: "post",
	     //    url: '',
	     //    dataType: "json",
	     //    async: false,
	     //    data:{},
	     //    success: function(result) {
	     //        if (result.result == "success") {
	     //            if (result.data.loginStatus==0) {
	     //            	//未登录状态;
	     //            	//location.href = "login.html";
	     //            }else{
	     //            	writeClientSession("user",result.data.user);
	     //            	g_noRedirect_user = result.data.user;
	     //            	writeClientStorage("isWeixinUser",result.data.isWeixinUser);
		//                 //向app发送推送需要的标签
		//                 sendAppParma(result.data.user);
		//                 sendAppDeviceInfoFunction();
	     //            }
	     //        } else {
	     //            dataLoadedError(result.message);
	     //        }
	     //    }
        // });
	//}
	return g_noRedirect_user;
}

function getUserIsSubscription(){
   var tempUser = getSessionUserNoRedirectEx();
   if(tempUser!=null && tempUser.isSubscription==1){
	   return 1;
   }
   return 0;
}

/*存储在本地*/
function writeClientStorage(key,val){
   localStorage.setItem(key, JSON.stringify(val));
}

function readClientStorage(key){
	var readValue = localStorage.getItem(key);
	if(readValue=='undefined' || readValue == null){
		return null;
	}else{
		return JSON.parse(readValue);
	}
	//return JSON.parse(localStorage.getItem(key));
}
function removeClientStorage(key){
	localStorage.removeItem(key);
}

function getClientDateStr(){
	var myDate = new Date();
	var yyyy = myDate.getFullYear()
	var mm = myDate.getMonth()>9?myDate.getMonth().toString():'0' + myDate.getMonth();
	var dd = myDate.getDate()>9?myDate.getDate().toString():'0' + myDate.getDate();

	return yyyy+"-"+mm+"-"+dd;
}

var urls = null;
function gotoUrl(url){
	urls = readClientSession("allowedUrls");
	if(urls == null){
       $.post(
			getMyRightsUrl,
			{
		       async : false,
		    },
			function(result){
				if(result.result=="success"){
					urls = result.urls;
					writeClientSession("allowedUrls",result.urls);
				}
			}
		);		
	}

	if(checkRights(url)){
					 window.location.href = hostConf + "/" + url +".html";
	}else{
		layer(2,"您没有访问权限。");
				}
}

function checkRights(url){
	for(var i=0;i<urls.length;i++){
		if(urls[i] === (url+".html")  || urls[i] === (url+".htm")){
			return true;
				}
			}

	return false;
}
function removeMinStr(StringFirst){
	if (StringFirst!=null) {
		var splitFirst = StringFirst.split('_min');
		var ResultString = splitFirst.join('');
	}
    return ResultString;
}
//参数说明：1表示_48，2表示—80，3表示—100
function insertImgType(str,type){
	if (str.indexOf("http://wx.qlogo.cn/")>=0) {
		return str;
	}
	if (str==null) {
		return;
	}
    var newstr="";
    var spiltIndex = str.lastIndexOf(".");
    var tmp=str.substring(0, spiltIndex);
    var suffixTmp=str.substring(spiltIndex);
    switch(type){
          case 1:
           newstr = tmp+"_48"+suffixTmp;
           break;
          case 2:
           newstr = tmp+"_80"+suffixTmp;
           break;
          case 3:
           newstr = tmp+"_100"+suffixTmp;   
           break;
          default:
           newstr = tmp+"_100"+suffixTmp;
           break;
        }
    return newstr;
}

//提示框，数据加载提示
function dataLoading(tipsText){
	var toastStr =		'<div class="toastDialog" id="loadingToast">' ;
		toastStr +=			'<div class="appui-mask_transparent"></div>' ;
		toastStr +=			'<div class="appui-toast">' ;
		toastStr +=				'<i class="appui-loading appui-icon_toast"></i>' ;
		toastStr +=				'<p class="appui-toast__content fs30">' + tipsText + '</p>' ;
		toastStr +=			'</div>' ;
		toastStr +=		'</div>' ;
	$("body").after(toastStr);
	//setTimeout(networkAbortFunction(), 5000);
}
function dataLoadedSuccess(tipsText){
	$(".toastDialog").remove();
	var toastStr =		'<div class="toastDialog" id="toast">' ;
		toastStr +=			'<div class="appui-mask_transparent"></div>' ;
		toastStr +=			'<div class="appui-toast">' ;
		toastStr +=				'<i class="appui-success appui-icon_toast"></i>' ;
		toastStr +=				'<p class="appui-toast__content fs30">' + tipsText + '</p>' ;
		toastStr +=			'</div>' ;
		toastStr +=		'</div>' ;
	
	$("body").after(toastStr);
	$(".toastDialog").fadeOut(2000,callBackFunction());
}
function dataLoadedError(tipsText){
	var toastStr =		'<div class="toastDialog" id="toast">' ;
		toastStr +=			'<div class="appui-mask_transparent"></div>' ;
		toastStr +=			'<div class="appui-toast">' ;
		toastStr +=				'<i class="appui-fail appui-icon_toast"></i>' ;
		toastStr +=				'<p class="appui-toast__content fs30">' + tipsText + '</p>' ;
		toastStr +=			'</div>' ;
		toastStr +=		'</div>' ;
	$("body").after(toastStr);
	$(".toastDialog").fadeOut(2000,callBackFunction());
}
function friendTips(dialogContent,operateAssistText,operateMainText,index,appuiOpenPublish){
	var OpenPublish = '';
	if(appuiOpenPublish != undefined){
		OpenPublish = appuiOpenPublish;
	}
	var dialogStr =		'<div class="js_dialog toastDialogSure" id="iosDialog1" >' ;
		dialogStr +=		'<div class="appui-mask"></div>' ;
		dialogStr +=		'<div class="appui-dialog">' ;
		dialogStr +=			'<div class="appui-dialog__hd fs34 fc-blue"><strong class="appui-dialog__title">温馨提示</strong></div>' ;
		dialogStr +=			'<div class="appui-dialog__bd fs30 fc-black456">' + dialogContent + '</div>' ;
		dialogStr +=			OpenPublish;
		dialogStr +=			'<div class="appui-dialog__ft fs30">' ;
		dialogStr +=				'<a href="javascript:;" id="tipsCancleID" class="appui-dialog__btn appui-dialog__btn_default fc-greyabc" onclick="clearToastDialog1('+index+')">' + operateAssistText + '</a>' ;
		dialogStr +=				'<a href="javascript:;" id="tipsSaveID" onclick="saveFunction('+index+')"  class="appui-dialog__btn appui-dialog__btn_primary fc-blue" onclick="saveToastDialog('+index+')">' + operateMainText + '</a>' ;
		dialogStr +=			'</div>' ;
		dialogStr +=		'</div>' ;
		dialogStr +=	'</div>' ;
	// $("#page-pop").after(dialogStr);
	$("body").append(dialogStr);
}
function friendTips1(dialogContent,operateAssistText,operateMainText,index){
	var dialogStr =		'<div class="js_dialog toastDialogSure" id="iosDialog1" >' ;
		dialogStr +=		'<div class="appui-mask"></div>' ;
		dialogStr +=		'<div class="appui-dialog">' ;
		dialogStr +=			'<div class="appui-dialog__hd fs34 fc-blue"><strong class="appui-dialog__title">温馨提示</strong></div>' ;
		dialogStr +=			'<div class="appui-dialog__bd fs30 fc-black456">' + dialogContent + '</div>' ;
		dialogStr +=			'<div class="appui-dialog__ft fs30">' ;
		dialogStr +=				'<a id="tipsCancleID" class="appui-dialog__btn appui-dialog__btn_default fc-greyabc" onclick="backFunction()">' + operateAssistText + '</a>' ;
		dialogStr +=				'<a href="javascript:;" id="tipsSaveID" onclick="saveFunction()"  class="appui-dialog__btn appui-dialog__btn_primary fc-blue" onclick="saveToastDialog('+index+')">' + operateMainText + '</a>' ;
		dialogStr +=			'</div>' ;
		dialogStr +=		'</div>' ;
		dialogStr +=	'</div>' ;
	// $("#page-pop").after(dialogStr);
	$("body").append(dialogStr);
}
function friendTips2(dialogContent,operateAssistText,operateMainText,index){
	var dialogStr =		'<div class="js_dialog toastDialogSure" id="iosDialog1" >' ;
		dialogStr +=		'<div class="appui-mask"></div>' ;
		dialogStr +=		'<div class="appui-dialog">' ;
		dialogStr +=			'<div class="appui-dialog__hd fs34 fc-blue"><strong class="appui-dialog__title">温馨提示</strong></div>' ;
		dialogStr +=			'<div class="appui-dialog__bd fs30 fc-black456">' + dialogContent + '</div>' ;
		dialogStr +=			'<div class="appui-dialog__ft fs30">' ;
		dialogStr +=				'<a href="javascript:;"  onclick="clearToastDialog2('+index+')" class="appui-dialog__btn appui-dialog__btn_default fc-greyabc" onclick="saveToastDialog('+index+')">' + operateMainText + '</a>' ;
		dialogStr +=				'<a href="javascript:;" class="appui-dialog__btn appui-dialog__btn_primary fc-blue" onclick="ansWithText('+index+')">' + operateAssistText + '</a>' ;
		dialogStr +=			'</div>' ;
		dialogStr +=		'</div>' ;
		dialogStr +=	'</div>' ;
	// $("#page-pop").after(dialogStr);
	$("body").append(dialogStr);
}

//带有输入框的提示框
function requestFriends(dialogTitle,dialogContent,operateAssistText,operateMainText,inputTipsText){
	var dialogStr =		'<div class="js_dialog toastDialog" id="iosDialog1" >' ;
		dialogStr +=		'<div class="appui-mask"></div>' ;
		dialogStr +=		'<div class="appui-dialog">' ;
		dialogStr +=			'<div class="appui-dialog__hd fs34 fc-blue"><strong class="appui-dialog__title">' + dialogTitle + '</strong></div>' ;
		dialogStr +=			'<div class="appui-dialog__bd fs30 fc-black456">' + dialogContent + '</div>' ;
		dialogStr +=			'<div class="appui-dialog__bd appui-dialog__bd-input bc-grey mt5">' ;
		dialogStr +=				'<textarea id="dialogContentID"class="bg-white fc-black456 fs28" autofocus rows="3" maxlength="30" placeholder="'+inputTipsText+'"></textarea>';
		dialogStr +=			'</div>';
		dialogStr +=			'<div class="appui-dialog__ft fs30">' ;
		dialogStr +=				'<a href="javascript:;" class="appui-dialog__btn appui-dialog__btn_default fc-greyabc" onclick="clearToastDialog1()">' + operateAssistText + '</a>' ;
		dialogStr +=				'<a href="javascript:;" class="appui-dialog__btn appui-dialog__btn_primary fc-blue" onclick="confirmButtonMethods()" id="saveID">' + operateMainText + '</a>' ;
		dialogStr +=			'</div>' ;
		dialogStr +=		'</div>' ;
		dialogStr +=	'</div>' ;
	$("body").append(dialogStr);
}
//带输入框的错误提示
function dataFriendsLoadedError(tipsText){
	var toastStr =		'<div class="toastDialog" id="toast">' ;
		toastStr +=			'<div class="appui-mask_transparent"></div>' ;
		toastStr +=			'<div class="appui-toast">' ;
		toastStr +=				'<i class="appui-fail appui-icon_toast"></i>' ;
		toastStr +=				'<p class="appui-toast__content fs30">' + tipsText + '</p>' ;
		toastStr +=			'</div>' ;
		toastStr +=		'</div>' ;
	$("body").after(toastStr);
	$("#toast").fadeOut(2000,callBackFunction(1));
	// var toastStr =		'<div class="toastDialog" id="toastFriends">' ;
	// 	toastStr +=			'<div class="appui-mask_transparent"></div>' ;
	// 	toastStr +=			'<div class="appui-toast">' ;
	// 	toastStr +=				'<i class="appui-fail appui-icon_toast"></i>' ;
	// 	toastStr +=				'<p class="appui-toast__content fs30">' + tipsText + '</p>' ;
	// 	toastStr +=			'</div>' ;
	// 	toastStr +=		'</div>' ;
	// $("body").after(toastStr);
	// $("#toastFriends").fadeOut(2000,callBackFunction());
}
// 支付确认成功弹窗
function popupPayAffirm(arg, fn1, fn2){
    var dialogStr =		'<div class="js_dialog" id="popup-pay-affirm" >' ;
    dialogStr +=			'<div class="appui-mask"></div>' ;
    dialogStr +=			'<div class="appui-dialog payAffirm">' ;
    dialogStr +=				'<p class="fs32 b-b-greyf5" style="line-height: 4em;">' + arg.title + '</p>' ;
    dialogStr +=				'<p id="payBtn1" class="fs30 b-b-greyf5 fc-red" style="line-height: 2.8em;">' + arg.str1 + '</p>' ;
    dialogStr +=				'<p id="payBtn2" class="fs30 fc-grey999" style="line-height: 2.8em;">' + arg.str2 + '</p>' ;
    dialogStr +=			'</div>' ;
    dialogStr +=		'</div>' ;
    $("body").append(dialogStr);

    // 删除弹窗
    function removePayAffirm(){
        $("#popup-pay-affirm").fadeOut(100,$("#popup-pay-affirm").remove());
    }

    $("#payBtn1").unbind().click(function(){
        removePayAffirm();
        fn1();
    });
    $("#payBtn2").unbind().click(function(){
        removePayAffirm();
        fn2();
    });
}

function clearToastDialog1(index){
	$(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
	//0取消操作,1继续编辑操
	if (index==1) {
		tipsCancle();
	};
}
function clearToastDialog(index){
	// $("#loadingToast").fadeOut(500,callBackFunction());
	$(".toastDialog").fadeOut(500,callBackFunction());
}
function saveToastDialog(index){
	$(".toastDialog").fadeOut(100,$(".toastDialog").remove());
}
function callBackFunction(index){
	if (index==1) {
		setTimeout('$("#toast").remove()', 1500);
	}else{
		setTimeout('$(".toastDialog").remove()', 1500);
	}
}
function networkAbortFunction(){
	if ($(".toastDialog").length>0) {
		$(".toastDialog").fadeOut(2000,callBackFunction());
		dataLoadedError("网络异常");
	}
}
function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g,"");
}

function actionSheet(type){
//	<!--有弹出内容时的背景-->
	var actionSheetStr =  '<div id="js-bg" class="bg-black" style="display:none"></div>'+
//							<!--针对评论的操作-->
						    '<div id="js-page" class="bg-greyfa">'+
						        '<div class="appui_js_page">'+
							        '<div style="display:none" class="appui_js_page-hd bg-white fs28 fc-grey678 b-t-grey" id="commentObject">评论对象：评论内容</div>'+
						            '<div id="appiu_js_page-actID" class="appiu_js_page-act bg-white fs30 b-t-grey">'+
						                // '<a id="replayID" class="bc-grey fc-black">回复</a>'+
						                // '<a class="bc-grey fc-black">转载</a>'+
						                // '<a class="bc-grey fc-black">举报</a>'+
						                // '<a  id="deleatID" style="display:none" class="fc-black">删除</a>'+
						            '</div>'+
						            '<div class="appiu_js_page-act bg-white fs30 fc-greyabc b-t-grey mt5">'+
						               '<a class="fc-black" id="appiu_js_page-cancel">取消</a>'+
						            '</div>'+   
						        '</div>'+ 
						    '</div>';
	$("body").append(actionSheetStr);		
	
	$('#js-bg,#appiu_js_page-cancel').click(function(e) {
		//$('body').css({'height':'auto','overflow':'auto'});
		$('#js-bg').fadeOut();
		$('#js-comment-input').animate({'bottom':'-2rem','opacity':'0'},300)
		$('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300)
		$('#js-forward').fadeOut();
    });			    
}

//提取网址后面的字符串对应的数字
function request(paras){
	 var url = location.href;
	 var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
	 var paraObj = {};
	 for (var i=0; j=paraString[i]; i++){
	  paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
	 }
	 var returnValue = paraObj[paras.toLowerCase()];
	 if(typeof(returnValue)=="undefined"){
	 	 return "";
	 }else{
	  	return returnValue;
	 }
}
//顶部的四个标签，颜色已经下方的滚动条；
function tabTextColor() {
    $('.page__tab a').each(function(index, element) {
        $(this).click(function(e) {
            var wTab = $('.page__tab a').width();
            $('.movebg').animate({
                'left': wTab * index
            },
			300);
        });
    });
    $('.page__tab a').click(function(e) {
        $('.page__tab a').each(function(index, element) {
            $(this).removeClass('fc-blue').addClass('fc-grey678');
        });
        $(this).removeClass('fc-grey678').addClass('fc-blue');
    });
}

function gotoActicleDetailHtml(acticleID){
  (typeof saveStatusBeforeJump!='undefined')&&saveStatusBeforeJump();
  window.location = "article_detail.html?id="+acticleID;
}

function gotoUser_pageHtml(userID,e){
    window.location.href = "/expert/user_page.html?id="+userID;
}
/**
function gotoUserPageOrLoupanHtml(loupanArr,userID){
    var isLoupan = isLoupanID(loupanArr,userID);
	if (isLoupan==1) {
		window.location.href = "loupan_page.html?id="+userID;
	 		}else{
		window.location.href = "user_page.html?id="+userID;
	}
}*/

function isLoupanID(loupanArr,userID){
	for (var i = 0; i < loupanArr.length; i++) {
		if(loupanArr[i]==userID){
			return 1;
	 		}
	 	}
}
function gotoQuestionsHtml(id,e){
	window.location = "qanda_questions.html?id="+id;
	e ? e.stopPropagation() : event.cancelBubble = true;
	event.cancelBubble = true;
}
function gotoQADetailHtml(id){
    window.location.href = "qanda_detail.html?id="+id;
}
function friendsTips(){
    alert("新功能即将开启，敬请期待...");
}

//判断是楼盘号还是行家号20170325-汪飞
function userLevelStr(level,loupan){
	var levelStr = "";
	if(loupan>0){
		levelStr = '<i><img src="../themes/img/v_loupan.png?v=20170325001939"></i>';
	}
	else{
		if (level==1||level==2) {
			levelStr = '<i><img src="../themes/img/v'+level+'.png"></i>';
		};
	}
	
	return levelStr;
}
function userLevelStrOfQA(level,loupan){
	var levelStr = "";
	if(loupan>0){
		levelStr = '<i class="appui-userlevel bc-white"><img src="../themes/img/v_loupan.png?v=20170325001939" /></i>';
	}
	else{
	if (level==1||level==2) {
			levelStr = '<i class="appui-userlevel bc-white"><img src="../themes/img/v'+level+'.png" /></i>';
	};
	}
    return levelStr;
}


function toCodePoint(unicodeSurrogates) {
     var  r = [],
        c = 0,
       p = 0,
       i = 0;
       while (i < unicodeSurrogates.length) {
        c = unicodeSurrogates.charCodeAt(i++);//返回位置的字符的 Unicode 编码
       
       if (p) {
         r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16)); //计算4字节的unicode
         p = 0;
       } else if (0xD800 <= c && c <= 0xDBFF) { 
         p = c; //如果unicode编码在oxD800-0xDBff之间，则需要与后一个字符放在一起
       } else {
         r.push(c.toString(16)); //如果是2字节，直接将码点转为对应的十六进制形式
       }
     }
     //return r;
    for(var i =0;i<r.length;i++){
       alert(r[i]);
   }
}

function getDocumentReferrer(){
	var referrer = document.referrer;
	if (!referrer) {
		try {
			if (window.opener) {
				// IE下如果跨域则抛出权限异常
				// Safari和Chrome下window.opener.location没有任何属性
				referrer = window.opener.location.href;
			}
		}catch (e) {}
	}

	return referrer;
}

//底部通用js掉用
var sessionNewMessageStatus = null;
function tabbar(index){
	var nowDatetime = new Date();
    nowDatetime.getTime();
	if(sessionNewMessageStatus==null){
		sessionNewMessageStatus = readClientSession("newMessageStatus");
	}
	// if(sessionNewMessageStatus == null || sessionNewMessageStatus.menuNewStatus==0){
	// 	var oldTime = readClientSession("newTime");
	// 	if (oldTime==null||getDateDiffMinute(oldTime)>=1) {
	// 		getServerNewMessageStatus(index);
	// 	};
	// }else 
	if(index==4&&sessionNewMessageStatus!=null){
		sessionNewMessageStatus.menuNewStatus = 0;
		writeClientSession("newMessageStatus",sessionNewMessageStatus);
		// sessionNewMessageStatus = writeClientSession("newMessageStatus");
	}else if(index==1&&sessionNewMessageStatus!=null){
		sessionNewMessageStatus.newQzMsgCnt=0;
		writeClientSession("newMessageStatus",sessionNewMessageStatus);
	}else if(sessionNewMessageStatus == null || sessionNewMessageStatus.menuNewStatus==0){
		var oldTime = readClientSession("newTime");
		if (oldTime==null||getDateDiffMinute(oldTime)>=1) {
			getServerNewMessageStatus(index);
		};
	}
	tabbar_deal(index);

	//首次登录优惠券展示
	if((sessionNewMessageStatus != null && sessionNewMessageStatus.newCouponsStatus==1) || isPresentCoupon(130000)){
		isHavaCoupon();
	}
}

function getServerNewMessageStatus(index){
	// $.ajax({
	//     type: "post",
	//     url: getNewMessageStatusUrl,
	//     dataType: "json",
	//     async: true,
	//     data:{},
	//     success: function(result) {
	//         if (result.result == "success") {
	//         	//存入时间戳
	//         	var nowDatetime = new Date();
	// 		    writeClientSession("newTime",nowDatetime.getTime());
	//             var newMessageStatus = result.data.newMessageStatus;
	//             if(sessionNewMessageStatus==null){
	//             	sessionNewMessageStatus = result.data.newMessageStatus;
	//             	writeClientSession("newMessageStatus",result.data.newMessageStatus);
	//             	tabbar_deal(index);
	//             	 isHavaCoupon();
	// 			}else if(sessionNewMessageStatus.noticeMsgCnt != newMessageStatus.noticeMsgCnt ||sessionNewMessageStatus.contentNoticeCnt != newMessageStatus.contentNoticeCnt|| sessionNewMessageStatus.newChatMsgCnt != newMessageStatus.newChatMsgCnt||sessionNewMessageStatus.newFocusArticleCount != newMessageStatus.newFocusArticleCount||sessionNewMessageStatus.newFocusQaCount != newMessageStatus.newFocusQaCount || sessionNewMessageStatus.qaNoticeMsgCnt!=newMessageStatus.qaNoticeMsgCnt || sessionNewMessageStatus.sysNoticeMsgCnt!=newMessageStatus.sysNoticeMsgCnt){
	//             	sessionNewMessageStatus.noticeMsgCnt = newMessageStatus.noticeMsgCnt;
	//             	sessionNewMessageStatus.newChatMsgCnt = newMessageStatus.newChatMsgCnt;
	//             	sessionNewMessageStatus.contentNoticeCnt = newMessageStatus.contentNoticeCnt;
	//             	sessionNewMessageStatus.newFocusArticleCount = newMessageStatus.newFocusArticleCount;
	//             	sessionNewMessageStatus.newFocusQaCount = newMessageStatus.newFocusQaCount;
	// 				sessionNewMessageStatus.qaNoticeMsgCnt = newMessageStatus.qaNoticeMsgCnt;
	// 				sessionNewMessageStatus.sysNoticeMsgCnt = newMessageStatus.sysNoticeMsgCnt;
	//             	sessionNewMessageStatus.menuNewStatus = 1;
	//             	writeClientSession("newMessageStatus",sessionNewMessageStatus);
	//             	tabbar_deal(index);
	//             	 isHavaCoupon();
	//             }
	//
	// 			//判断圈子里面的消息是否有更新
	// 			if(sessionNewMessageStatus!=null && sessionNewMessageStatus.newQzMsgCnt != newMessageStatus.newQzMsgCnt){
	// 				sessionNewMessageStatus.newQzMsgCnt=newMessageStatus.newQzMsgCnt;
	// 				writeClientSession("newMessageStatus",sessionNewMessageStatus);
	// 			}
	//             /** 处理弹出优惠券，增加*/
	//             if(typeof(sessionNewMessageStatus.newCouponsStatus)=="undefined" || sessionNewMessageStatus.newCouponsStatus == null
	//             	|| newMessageStatus.newCouponsStatus == 1){
	//             	sessionNewMessageStatus.newCouponsStatus = newMessageStatus.newCouponsStatus;
	//             	writeClientSession("newMessageStatus",sessionNewMessageStatus);
	//             }
    //
	//         }
	//     }
	// });
}

function tabbar_deal(index){
	// <!--页面标签栏-->
	removePageAndPosition();
	var newMsgStr = "";
	var defaultClassStr = qaClassStr = circleClassStr = dynamicClassStr = mineClassStr = "fc-greyabc";
	var a_defaultClassStr = a_qaClassStr = a_circleClassStr = a_dynamicClassStr = a_mineClassStr ="" ;
	switch (index){
		case 0:{
			defaultClassStr = "fc-blue";
			a_defaultClassStr = "tabbtn-on";
		}
		break;
		case 1:{
			circleClassStr = "fc-blue";
			a_circleClassStr = "tabbtn-on";
		}
		break;
		case 2:{
			qaClassStr = "fc-blue";
			a_qaClassStr = "tabbtn-on";
		}
		break;
		case 3:{
			dynamicClassStr = "fc-blue";
			a_dynamicClassStr = "tabbtn-on";
		}
		break;
		case 4:{
			mineClassStr = "fc-blue";
			a_mineClassStr = "tabbtn-on";
		}
		break;
		default:{
		}
	}
	
	if (sessionNewMessageStatus!=null) {
		var totolNoticeCnt =sessionNewMessageStatus.qaNoticeMsgCnt+sessionNewMessageStatus.sysNoticeMsgCnt;
		if(totolNoticeCnt>0 && $('#indexNoticeMsg').length>0){
		$('#indexNoticeMsg span').addClass("bg-red");
		if(totolNoticeCnt>9){
			$('#indexNoticeMsg span').html('<img src="../themes/img/more1.png?v=20170221161736" />');
		}else{
			$('#indexNoticeMsg span').html(totolNoticeCnt);
		}
	}
	
		if(sessionNewMessageStatus.menuNewStatus >= 1){
		var fromIndex = readClientSession("fromIndex");
		if (fromIndex!=0) {
			newMsgStr = '<em class="bg-red"></em>';
		};
	}
	};
	//长按；
	refreshUserSubscriptionStatus();
	var circlemsg="";
	if(sessionNewMessageStatus != null && sessionNewMessageStatus.newQzMsgCnt>0){
		circlemsg = '<em class="bg-red"></em>';
	}

	var tabbarStr =		'<div class="page__fd bg-white fs22 bc-grey scrollfdt" id="footer_tabbar">'+
						    '<div class="tab-con">'+
							'<a href="index.html" class="'+a_defaultClassStr+'"><i class="default"></i><span class="'+defaultClassStr+'">首页</span></a>'+
							'<a href="circle_my.html" class="'+a_circleClassStr+'"><i class="circle"></i><span class="'+circleClassStr+'">密友圈</span>'+circlemsg+'</a>'+
							'<a href="qanda.html" class="'+a_qaClassStr+'"><i class="qanda"></i><span class="'+qaClassStr+'">问答</span></a>'+
							//'<a href="found_expert.html" class="'+a_expertClassStr+'"><i class="expert"></i><span class="'+expertClassStr+'">行家</span></a>'+
							//'<a href="start_ask.html" class="tab_ask_btn"><i><img src="../../themes/img/ask.png?v=20170304100452" /></i><span class="'+expertClassStr+'">提问</span></a>'+
							//'<a href="topic.html" class="'+a_topicClassStr+'"><i class="wire"></i><span class="'+topicClassStr+'">话题</span></a>'+
							'<a href="square.html" class="'+a_dynamicClassStr+'"><i class="dynamic"></i><span class="'+dynamicClassStr+'">发现</span></a>'+
						        '<a href="user_center.html" class="'+a_mineClassStr+'"><i class="mine"></i><span class="'+mineClassStr+'">我的</span>'+newMsgStr+'</a>'+
						    '</div>'+
						'</div>';
	if($("#footer_tabbar").length>0){
		$("#footer_tabbar").remove();
	}
	$('#page').append(tabbarStr);

	$('#footer_tabbar a').click(function(e) {
		writeClientSession("backBool",0);
	});

	//app tabbar点击效果
	var appType = readClientSession("appType");
	if (appType==isApp) {
		$('#footer_tabbar>div a').each(function (index, element) {
			$(this).click(function(e) {
				$(this).css("opacity","0.5");
			});
		});
	};
}

function removePageAndPosition(){
	var preUrl = document.referrer;
	var targetUrlPathname = window.location.pathname;
	if (preUrl.indexOf(targetUrlPathname)==-1) {
		if (preUrl.indexOf("/index.html")>-1) {
			removeClientSession('index-position');
			removeClientSession('index-page');
	    }else if (preUrl.indexOf("/found_expert.html")>-1){
	      	removeClientSession('expertList-position');
			removeClientSession('expertList-page');
			removeClientSession("line");
			removeClientSession("expertLable");
			removeClientSession("labelName");
			removeClientSession("labeIndex");
		}
		// else if (preUrl.indexOf("/topic.html")>-1){
		// 	removeClientSession('newTopic0-position');
	 //        removeClientSession('newTopic0-page');
		// 	removeClientSession('newTopic1-position');
	 //        removeClientSession('newTopic1-page');
	 //        removeClientSession('typeArticle');
		// }
		else if (preUrl.indexOf("/square.html")>-1){
		    removeClientSession('square-page-searchtype');
 		    removeClientSession('square-page0-position');
        	removeClientSession('square-page0-page');
		}else if (preUrl.indexOf("/qanda.html")>-1){
			// readClientSession('qanda-page'+indexID+'-page');
			removeClientSession('qanda-page1-page');
			removeClientSession('qanda-page1-position');
			removeClientSession("qaline");
			removeClientSession("qaexpertLable");
			removeClientSession("qalabelName");
			removeClientSession("qalabeIndex");
			removeClientSession("qaLable");
        	removeClientSession('recommend-position');
        	removeClientSession('recommend-page');
	    }
	}
}
function commonNoMoreContent(str){
	var resultString = '<div class="appui-nocontent">'+
							'<span><img src="../bdt/images/nocontent.png"></span>'+
							'<p class="mt10 fs28 fc-greyabc">'+str+'</p>'+
						'</div>';
	return resultString;
}

function isHavaCoupon(){
    if(!isPresentCoupon(130000) && (sessionNewMessageStatus == null || sessionNewMessageStatus.newCouponsStatus==0)){
		return;
	}
	writeClientStorage("isAppFirstLogin",0);
	var boolean = false;
	var oLis = "";
	var pageNum = 1;
	var useStart,useEnd;
	$.ajax({
		url: getMyCouponsList,
		type: 'post',
		dataType: 'json',
		data: {"page":pageNum,"pernum":100,"isActive":1},
		success: function (result){
			if (result.result == "success") {
				var lists = result.data.list;
				if (lists.length>0) {
					boolean = true;
					sessionNewMessageStatus = readClientSession("newMessageStatus");
					sessionNewMessageStatus.newCouponsStatus = 0;
	            	writeClientSession("newMessageStatus",sessionNewMessageStatus);
				}else if(lists.length == 1){
					$("#couponTips").css("height","14rem");
				}
				for (var i = 0; i < lists.length; i++) {
					function LocaleDateString(timestamp){
						var newDate = new Date(timestamp);
						return newDate.toLocaleDateString();
					}
					useStart = LocaleDateString(lists[i].coupons.useStartTime);
					useEnd = LocaleDateString(lists[i].coupons.useEndTime);
					if (oLis.indexOf(lists[i].coupons.type)>0) {
							// oLis = oLis.replace('couponsType="'+lists[i].coupons.type+'"','class="more" couponsType="'+lists[i].coupons.type+'"');
							oLis = oLis.replace('couponsType="'+lists[i].coupons.type+'"','couponsType="'+lists[i].coupons.type+'"');
					}else{
					oLis += '<li couponsType="'+lists[i].coupons.type+'">'+
								'<img src="../themes/img/coupon_more.png?v=20170210151844" alt="">'+
								'<h2 class="fs54 fc-red">'+lists[i].coupons.type+'</h2>'+
								'<div>'+
									'<h3 class="fs30">'+lists[i].coupons.couponsName+'</h3>'+
									'<p class="fs20 fc-grey678">'+useStart+' 至 '+useEnd+' 有效</p>'+
								'</div>'+
							'</li>';
					}
		}
				var couponCon = '<div class="js_dialog toastDialogSure" id="couponDalog">'+
									'<div class="appui-mask"></div>'+
									'<div id="couponTips">'+
		'<img class="tips_bg" src="../themes/img/couponBg.png?v=20170209160748" alt="">'+
		'<div class="tips_content">'+
			'<div class="tips_top">'+
				'<img src="../themes/img/coupon_gou.png?v=20170209160748" alt="">'+
				'<h2 class="fc-white">您拥有'+lists.length+'张优惠券</h2>'+
			'</div>'+
			'<p class="tips_intro fs20 fc-white">~ 优惠券已放入账户中，请在【我的-收入】中查看 ~</p>'+
											'<ul>'+oLis+'</ul>'+
			'<a id="coupon_btn">去看看&gt;&gt;</a>';
		if(getUserIsSubscription()==0){
			couponCon = couponCon + '<p class="explain fs28 fc-white">关注“律乎”服务号，可领优惠券</p>';
		}
		if(g_noRedirect_user!=null && isPhone(g_noRedirect_user.phone)==true){
            couponCon = couponCon + '<p class="explain fs28 fc-white">绑定手机号，也可领优惠券哦！</p>' ;
		}
		    couponCon = couponCon + '</div>'+
		'<img class="tips_close" src="../themes/img/nav_icon_close.png?v=20170508215106" alt="">'+
									'</div>'+
								'</div>';
			}else{
				// alert(result.message);
					dataLoadedError(result.message);
			}
			if (boolean == true) {
				$(document.body).append(couponCon);
					$('#couponTips').css('margin-top',-$('#couponTips').height()/2);
				$("#couponDalog .tips_close").on('click',function(event) {
			        event.preventDefault();
			        $("#couponDalog").hide();
			    });
			    $("#couponDalog .tips_content").on('click',function(event) {
			        event.preventDefault();
			        location.href = "/mycoupon.html";
			    });
					
					$("#couponDalog").show();
			}
			}
	});
}


var g_NextShowQrTime = 24*60*60*1000;
function getNeedNextSHowQr(){
	var needSHow= false;
	if(getUserIsSubscription()==0){
		var nextShowQr = readClientStorage("nextShowQr");
		if(nextShowQr){
			  if((new Date()).getTime()>(nextShowQr+g_NextShowQrTime)){
				  needSHow = true;
			  }
		}else{
			needSHow = true;
		}
	}
	return needSHow;
}

function getNeedNextSHowQrForAllScreen(){
	var needSHow= false;
	if(getUserIsSubscription()==0){
		var nextShowQrFroAs = readClientStorage("nextShowQrFroAs");
		if(nextShowQrFroAs){
			  if((new Date()).getTime()>(nextShowQrFroAs+g_NextShowQrTime)){
				  needSHow = true;
			  }
		}else{
			needSHow = true;
		}
	}
	return needSHow;
}


function HTMLEncode(html) {
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
}
function HTMLDecode(text) { 
    var temp = document.createElement("div"); 
    temp.innerHTML = text; 
    var output = temp.innerText || temp.textContent; 
    temp = null; 
    return output; 
} 

//强制刷新
function refreshUserSubscriptionStatus(){
  var longPressBool = readClientSession("longPressBool");
  if (longPressBool != null && longPressBool==1) {
    getUserSubscriptionStatus(1);
    writeClientSession("longPressBool",0);
  }
}

//进入页面弹优惠券
function showQrCodeForUser(){
	var curruser = getSessionUserNoRedirectEx();
	var currPathName = window.location.pathname;
	if(curruser != null && currPathName != "/article_detail.html" && getNeedNextSHowQr()){
		//正常进入问答详情界面，未关注律乎 refreshBool 0，公众号送券 hasCouponsTo 1 用户优惠券个数couponCount，
		var refreshBool = readClientSession("refreshBool");
		var hasCouponsTo = readClientSession("hasCouponsTo");
    	if (refreshBool!=null&&Number(refreshBool)==0) {
			if (hasCouponsTo==1) {
			    qrcodeDialog('../themes/img/qrcodebg3.png?v=20170307164127' , '送优惠券啦' , '关注律乎可领取免费围观券<br />免费偷听收费问题！' , 'listen-detail' );
			}else{
				qrcodeDialog('../themes/img/qrcodebg3.png?v=20170307164127' , '快来关注吧' , '关注律乎获得最新消息推送！' , 'listen-detail' );
			}
		}else if(refreshBool==null) {
			getUserSubscriptionStatus(0,showQrCodeForUser);
		}
	}
}
//获取状态
function getUserSubscriptionStatus(refreshStatus,callbackFunc){
  	var refreshBool = readClientSession("refreshBool");
	var hasCouponsTo = readClientSession("hasCouponsTo");
	//如果已经展示过3次二维码了，强制刷新一下公众号关注状态
	var showQaCount = readClientStorage("showQaCount");
	if(isUndefined(showQaCount) || showQaCount == null){
		showQaCount = 0;
	}
	if (refreshBool==null||hasCouponsTo==null|| showQaCount>=2 ||refreshStatus == 1) {
      $.ajax({
          type: "post",
          url: checkUserSubscriptionStatus,
          dataType: "json",
          async: true,
          data:{"refresh":refreshStatus},
          success: function(result) {
              if (result.result == "success") {  
              	// "subscriptionStatus":"","1-已关注，0-未关注"
                var subscriptionStatus = result.data.subscriptionStatus;
                if(result.data.hasCouponsTo != null){
                	writeClientSession("hasCouponsTo",result.data.hasCouponsTo);
                }else{
                	writeClientSession("hasCouponsTo",0);
                }
                writeClientSession("refreshBool",subscriptionStatus);
                writeClientSession("showQaCount",0);

              	if(isUndefined(callbackFunc)==false && callbackFunc!=null){
		      		//防止一直死循环
		      		//writeClientSession("hasCouponsTo",0);
					callbackFunc();
				}

              } else {
                  dataLoadedError(result.message);
              }
          }
      });
  }
  
}

//数据统计从stat.js中转移过来
function createStatWithParamlog(url,path,hashstr,querystr) {
　　//向后台发送处理数据
    $.ajax({
        type: "post",
        url: createStatlogUrl,
        dataType: "json",
        async: true,
        data:{"url":url,"path":path,"hashstr":hashstr,"querystr":querystr},
        success: function(result) {
            if(result.result == "success"){        
            }
        }
    });
}

// function isInUnableBackList(pageToBack){
// 	if(pageToBack.indexOf("/qanda_questions.html")>=0 || pageToBack.indexOf("/start_ask.html" || pageToBack.indexOf("/qanda_record.html")
// 			|| pageToBack.indexOf("/article_edit.html")>=0 || pageToBack.indexOf("/message_edit.html")
// 			|| pageToBack.indexOf("/message_edit_file.html")>=0 || pageToBack.indexOf("/message_voice.html")
// 			|| pageToBack.indexOf("/login.html")>=0 || pageToBack.indexOf("/auto_login.html")>=0 || pageToBack.indexOf("/regist.html")
// 			|| pageToBack.indexOf("/try_auto_login.html")>=0 || pageToBack.indexOf("/weixin_auth.html")
// 			|| pageToBack.indexOf("/login_nickname_modify.html")>=0 || pageToBack.indexOf("/password_edit.html")
// 			|| pageToBack.indexOf("/password_reset.html")>=0 || pageToBack.indexOf("/password_retrieve.html")
// 			|| pageToBack.indexOf("/invitateback.html")>=0 || pageToBack.indexOf("/user_home_bgpic_edit.html")
// 			|| pageToBack.indexOf("/user_photo_edit.html")>=0 || pageToBack.indexOf("/topicqanda_record.html")
// 			|| pageToBack.indexOf("/personal_data_area_edit.html")>=0 || pageToBack.indexOf("/personal_data_industry_edit.html")
// 			|| pageToBack.indexOf("/personal_data_label_edit.html")>=0 || pageToBack.indexOf("/red_packets_fightluck.html")){
// 		return true;
// 	}else{
// 		return false;
// 	}
// }

/*网上代码copy*/
var historyUtils = {
    add : function (url) {
        var historyArray = historyUtils.getLocal();
        if (!historyArray) {
            historyArray = [];
        }
        var currentPage = historyArray.pop();
        if (currentPage && currentPage == url) {
            //do nothing
        } else if (currentPage){
        	//多判断一层是否触发了浏览器back
            historyArray.push(currentPage); //历史里面没有现在传入的url，在加回去
        }
        historyArray.push(url);
        historyUtils.saveLocal(historyArray);
    },
    back : function() {
        var historyArray = historyUtils.getLocal();
        var currentPage = historyArray.pop();//去掉当前页面，pop取最后，类似stack
        var history = historyArray.pop();
        if (isUndefined(history) ||  history==null) {//没有历史页面
        	history = "index.html";
        }
        //else{
        //	historyUtils.add(currentPage);//将当前页面加入回数组中
        //   return;
        //}
        while (historyUtils.isInUnableBackList(history)){
        	history = historyArray.pop();
        	if (isUndefined(history) ||  history==null) {//没有历史页面
        		history = "index.html";
        	}
		}

        historyUtils.saveLocal(historyArray);
        window.location.href = history;
    },
    getProTwoPage : function() {
    	var resultPage = "";
    	//浏览器back回来的，需要pop一个
        var historyArray = historyUtils.getLocal();
        if(!historyArray){
        	return;
        }
        var proOnePage = historyArray.pop();
        if (proOnePage) {//没有历史页面
        	var proTwoPage = historyArray.pop();
        	if(proTwoPage){
        		resultPage = proTwoPage;
        	}
        }

        return resultPage;
    },
    popThis : function() {
    	//不允许回来的页面特殊情况不允许回来的，要在跳走之前pop一下
        var historyArray = historyUtils.getLocal();
        var history = historyArray.pop();
        if (!history) {//没有历史页面
        }else{
        	historyUtils.saveLocal(historyArray);
        }
    },
    popPro : function() {
    	//浏览器back回来的，需要pop一个
        var historyArray = historyUtils.getLocal();
        var history = historyArray.pop();
        if (!history) {//没有历史页面
            //historyUtils.add(currentPage);//将当前页面加入回数组中
            return;
        }
        historyUtils.saveLocal(historyArray);
    },
    isInUnableBackList : function(pageToBack) {
    	if(!pageToBack){
    		return false;
    	}else if(//pageToBack.indexOf("/qanda_questions.html")>=0 || 
    			pageToBack.indexOf("/start_ask.html")>=0 || pageToBack.indexOf("/qanda_record.html")>=0
				|| pageToBack.indexOf("/article_edit.html")>=0 || pageToBack.indexOf("/message_edit.html")>=0
				|| pageToBack.indexOf("/message_edit_file.html")>=0 || pageToBack.indexOf("/message_voice.html")>=0
				|| pageToBack.indexOf("/login.html")>=0 || pageToBack.indexOf("/logout.html")>=0 || pageToBack.indexOf("/weixinAuth")>=0 
				|| pageToBack.indexOf("/auto_login.html")>=0 || pageToBack.indexOf("/regist.html")>=0
				|| pageToBack.indexOf("/try_auto_login.html")>=0 || pageToBack.indexOf("/weixin_auth.html")>=0
				|| pageToBack.indexOf("/login_nickname_modify.html")>=0 || pageToBack.indexOf("/password_edit.html")>=0
				|| pageToBack.indexOf("/password_reset.html")>=0 || pageToBack.indexOf("/password_retrieve.html")>=0
				|| pageToBack.indexOf("/invitateback.html")>=0 || pageToBack.indexOf("/user_home_bgpic_edit.html")>=0
				|| pageToBack.indexOf("/user_photo_edit.html")>=0 || pageToBack.indexOf("/topicqanda_record.html")>=0
				|| pageToBack.indexOf("/personal_data_area_edit.html")>=0 || pageToBack.indexOf("/personal_data_industry_edit.html")>=0
				|| pageToBack.indexOf("/personal_data_label_edit.html")>=0 || pageToBack.indexOf("/red_packets_fightluck.html")>=0
				|| pageToBack.indexOf("/circle_creat.html")>=0 || pageToBack.indexOf("/circle_photo_edit.html")>=0
				|| pageToBack.indexOf("/circle_qanda_questions.html")>=0 || pageToBack.indexOf("/circle_qanda_record.html")>=0
				|| pageToBack.indexOf("/circle_creat_free.html")>=0 || pageToBack.indexOf("/circle_data_name_edit.html")>=0
				|| pageToBack.indexOf("/circle_creat_charge.html")>=0 || pageToBack.indexOf("/circle_data_adding_method.html")>=0 || pageToBack.indexOf("/file_release.html")>=0){
			return true;
		}else{
			return false;
		}
    },
    getLocal : function() {
        var result = window.sessionStorage.getItem(historyUtils.key);
        if (!result) {
            return null;
        }
        return JSON.parse(result);
    },
    saveLocal : function(data) {
        window.sessionStorage.setItem(historyUtils.key, JSON.stringify(data));
    },
    init : function() {
        historyUtils.saveLocal([]);
    },
    key : "_history_"
};

function customHistoryUtilsPop(){
	historyUtils.popThis();  
}

function customHistoryUtilsAdd(){
	var targetUrlPathname = window.location.pathname;
	//var needToAdd = true;
	var proPageLoadingTime = readClientSession("_proPageLoadingTime_");
	var nowTime = (new Date()).getTime();
	var proTwoPage = historyUtils.getProTwoPage();
	if(proTwoPage != null && proTwoPage == targetUrlPathname){
		//判断是利用浏览器back回来的,不仅不加，还要pop一个
		historyUtils.popPro();
	}
	/** 效果不好，先屏蔽掉
	else if((nowTime - Number(proPageLoadingTime))<1000){
		//上一页面停留时间非常短(小于1秒），判断是自动跳转的，要把上一页面过滤掉
		historyUtils.popPro();
	}*/
	//historyUtils.add(window.location.href);
	/**
	if (targetUrlPathname!="/qanda_questions.html" && targetUrlPathname!="/start_ask.html" && targetUrlPathname!="/qanda_record.html"
		&& targetUrlPathname!="/article_edit.html" && targetUrlPathname!="/message_edit.html" 
		&& targetUrlPathname!="/message_edit_file.html" && targetUrlPathname!="/message_voice.html" 
		&& targetUrlPathname!="/login.html" && targetUrlPathname!="/auto_login.html" && targetUrlPathname!="/regist.html"
		&& targetUrlPathname!="/try_auto_login.html" && targetUrlPathname!="/weixin_auth.html"
		&& targetUrlPathname!="/login_nickname_modify.html" && targetUrlPathname!="/password_edit.html"
		&& targetUrlPathname!="/password_reset.html" && targetUrlPathname!="/password_retrieve.html"
		&& targetUrlPathname!="/invitateback.html" && targetUrlPathname!="/user_home_bgpic_edit.html"
		&& targetUrlPathname!="/user_photo_edit.html" && targetUrlPathname!="/topicqanda_record.html"
		&& targetUrlPathname!="/personal_data_area_edit.html" && targetUrlPathname!="/personal_data_industry_edit.html"
		&& targetUrlPathname!="/personal_data_label_edit.html" && targetUrlPathname!="/red_packets_fightluck.html"
		){
	}else{
		needToAdd = false;
	}*/

	//if(needToAdd){
		historyUtils.add(window.location.href);

		//保存当前页面进入时间
		writeClientSession("_proPageLoadingTime_",(new Date()).getTime());
	//}
}


function customHistoryUtilsBack(){
    history.back(-1);
}

//测试昵称合法性
// public static boolean isLetterDigitOrChinese(String str) {  
//   String regex = "^[a-z0-9_A-Z\u4e00-\u9fa5]+$";  
//   return str.matches(regex);  
//  }
	//动态监听输入框的内容
	// $("#login-name").bind('input propertychange', function() {
	// 	nicknameStr = $("#login-name").val();
	// 	alert(nicknameStr);
		
 //    });  
    //获取焦点;
 //    $("#login-name").focus(function(){//#input换成你的input的ID
	// 	//这里写获得焦点之后运行的代码。
	// 	alert("正在输入");
	// });
	//失去焦点
	// $('#login-name').blur(function (){ 
	// 	nicknameStr = $("#login-name").val();
	// 	requestCheckNicknameURL();
 //    }); 


//二维码弹出提示框UI-20170307-汪飞
function qrcodeDialogOfPhone(imgsrc , titleText , infoText , btnClass ){
	var qrcodeDialogStr =	'<div class="qrcode_dialog" id="qrcodeDialog">'+
								'<div class="appui-mask"></div>'+
								'<div class="qrcode-dialog-con">'+
									'<img id="imgDiv" src="' + imgsrc + '" />'+
									'<div class="qrcode-info-act bg-white">'+
										'<h2 class="mt30 fc-black fs40">' + titleText + '</h2>'+
										'<h4 class="mt10 fc-black fs30">' + infoText + '</h4>'+
										'<a class="mt10 fc-white fs30 closeCode ' + btnClass + '" onclick="gotoUser_center_html()">收到&nbsp;谢谢</a>'+
									'</div>'+
									'<a class="qrcode-close closeCode " onclick="gotoUser_center_html()"><img src="../../themes/img/qrcode_close.png?v=20170307164127" /></a>'+
								'</div>	'+
							'</div>';
	$("body").after(qrcodeDialogStr);

	// var time = 0;//初始化起始时间  
	$("#imgDiv").on('touchstart', function(e){  
	    e.stopPropagation();  
	    time = setTimeout(function(){  
	        longPressFuntion();  
	    }, 1000);//这里设置长按响应时间  
	});  
	 
	$("#imgDiv").on('touchend', function(e){  
	    e.stopPropagation();  
	    clearTimeout(time);    
	});  
}


//二维码弹出提示框UI-20170307-汪飞
function qrcodeDialog(imgsrc , titleText , infoText , btnClass ,callbackFunc){
	/**
	createStatWithParamlog(window.location.href,"/qrcodeDialog.html",titleText,infoText);
	// if(getNeedNextSHowQr()){
		var qrcodeDialogStr =	'<div class="qrcode_dialog" id="qrcodeDialog">'+
									'<div class="appui-mask"></div>'+
									'<div class="qrcode-dialog-con">'+
										'<img id="imgDiv" src="' + imgsrc + '" />'+
										'<div class="qrcode-info-act bg-white">'+
											'<h2 class="mt30 fc-black fs40">' + titleText + '</h2>'+
											'<h4 class="mt10 fc-black fs30">' + infoText + '</h4>'+
										'<a class="closeView mt10 fc-white fs30 closeCode ' + btnClass + '">收到&nbsp;谢谢</a>'+
										'</div>'+
										'<a class="closeView qrcode-close closeCode " id="qrcode-close_id" ><img src="../../themes/img/qrcode_close.png?v=20170307164127" /></a>'+
									'</div>	'+
								'</div>';
		$("body").after(qrcodeDialogStr);

		$(".closeView").click(function(){
			if(isUndefined(callbackFunc)==false && callbackFunc!=null){
				callbackFunc();
			}
			$("#qrcodeDialog").remove();
		});
		// var time = 0;//初始化起始时间  
		$("#imgDiv").on('touchstart', function(e){  
		    e.stopPropagation();  
		    time = setTimeout(function(){  
		        longPressFuntion();  
		    }, 1000);//这里设置长按响应时间  
		});  

		$("#imgDiv").on('touchend', function(e){  
		    e.stopPropagation();  
		    clearTimeout(time);    
		});  
		var showQaCount = readClientStorage("showQaCount");
		if(isUndefined(showQaCount) || showQaCount == null){
			showQaCount = 0;
		}else{
			showQaCount = Number(showQaCount)+1;
		}

		writeClientStorage("nextShowQr",(new Date()).getTime());
		writeClientStorage("showQaCount",showQaCount);
	// }*/
}

function longPressFuntion(){  
	var longPressBool = 1;
	writeClientSession("longPressBool",1);
// 3.1.1 上行
// url:checkUserSubscriptionStatus
// data:{"refresh":"0-不需要，1-需要强制刷新"}
// 3.1.2 下行
// var result = { 
// 	"result":"success",//success/failure
// 	"message":"错误原因，只有result=failure时才需要处理",
// 	"data":{"subscriptionStatus":"","1-已关注，0-未关注":"","subscriptionCoupons":"","1-本次发放了优惠券，0-本次无":""}
// }
}  

function showSearch(){
	if (scroolBool==true) {
    $('.side-search-hide').stop().animate({'right':-$('.side-search-hide').width()},'500',function(){
	        $('.side-search-show').stop().animate({'right':'0'},'500');    
    });
	    scroolBool = false;
	};
}  
function hideSearch(){
	if (scroolBool==false) {
    $('.side-search-show').stop().animate({'right':-$('.side-search-show').width()},'500',function(){
	        $('.side-search-hide').stop().animate({'right':'0.1rem'},'500');
    });
	    scroolBool = true;
	};
}

var scroolBool = true;
function scroolView(){
	//app滑动时候，固定底部tab栏不动
	var appType = readClientSession("appType");
	//滑动处理
	var startX, startY;
	document.addEventListener('touchstart', function (ev) {
		startX = ev.touches[0].pageX;
		startY = ev.touches[0].pageY;   
	}, false);
	document.addEventListener('touchend', function (ev) {
		var endX, endY;
		endX = ev.changedTouches[0].pageX;
		endY = ev.changedTouches[0].pageY;
		var direction = GetSlideDirection(startX, startY, endX, endY);
		switch (direction) {
			case 0:
				// alert("没滑动");
				break;
			case 1:
				// console.log("向上滑动");
				if (appType!=isApp) {
					//$('#footer_tabbar').animate({'bottom':-$('#footer_tabbar').eq(0).get(0).offsetHeight},"fast");
					$('#footer_tabbar').animate({'bottom':'-2.55rem'},"fast");
					if($('#footer_tabbar').length>0 && $("#g_qrcodeLayoutDiv").length>0){
						$('#g_qrcodeLayoutDiv').animate({'bottom':'0rem'},"fast");
					}

                    if($('#sendMessage').length > 0 && $('#sendMessage').hasClass("publish-btn")){
                        $('#sendMessage').removeClass("publish-btn-square");
                    }else{
                        $('#sendMessage').removeClass("publish-btn-square2");
                    }
				};
				var targetUrlPathname = window.location.pathname;
				if (targetUrlPathname=="/index.html" ||targetUrlPathname=="/"  || targetUrlPathname=="/index.htm") {
					//$('#topBigDiv').animate({'top':-$('#topBigDiv').eq(0).get(0).offsetHeight},"fast");
					$('#topBigDiv').animate({'top':'-2.55rem'},"fast");
					//$('#page__bd').css('padding-top','0rem');
				}else if (targetUrlPathname=="/found_expert.html") {
					//hideSearch();
					$('#topBigDiv').animate({'top':'-2.25rem'},"fast");
					if($('.page__hd-tips').css('display') != 'none'){
						$('.page__bd').css('padding-top','3.7rem');
					}else{
						$('.page__bd').css('padding-top','2.2rem');	
					}
				}else if (targetUrlPathname=="/qanda.html") {
					//hideSearch();
					$('#topBigDiv').animate({'top':'-2.25rem'},"fast");
					if($('.page__hd-tips').css('display') != 'none'){
						$('.page__bd').css('padding-top','3.7rem');
					}else{
						$('.page__bd').css('padding-top','2.2rem');	
					}
				}else if (targetUrlPathname=="/loupan_list.html") {
					//hideSearch();
					$('#topBigDiv').animate({'top':'-2.25rem'},"fast");
				}else if(targetUrlPathname=="/circle_my.html"){
					$('#showCreateCircle').animate({'bottom':'-2.5rem'},"fast");
				}
				break;
			case 2:
				// console.log("向下滑动");
				if (appType!=isApp) {
					$('#footer_tabbar').animate({'bottom':'0'},"fast");
					if($('#footer_tabbar').length>0 && $("#g_qrcodeLayoutDiv").length>0){
						$('#g_qrcodeLayoutDiv').animate({'bottom':'2.55rem'},"fast");
					}

                    if($('#sendMessage').length > 0  && $('#sendMessage').hasClass("publish-btn")){
                        $('#sendMessage').addClass("publish-btn-square");
                    }else{
                        $('#sendMessage').addClass("publish-btn-square2");
                    }
				};
				var targetUrlPathname = window.location.pathname;
				if (targetUrlPathname=="/index.html" ||targetUrlPathname=="/" || targetUrlPathname=="/index.htm") {
					$('#topBigDiv').animate({'top':'0'},"fast");
					//$('#page__bd').css('padding-top','2.55rem');
				}else if (targetUrlPathname=="/found_expert.html") {
					//showSearch();
					$('#topBigDiv').animate({'top':'0'},"fast");
					if($('.page__hd-tips').css('display') != 'none'){
						$('.page__bd').css('padding-top','5.95rem');
					}else{
						$('.page__bd').css('padding-top','4.5rem');	
					}
				}else if (targetUrlPathname=="/qanda.html") {
					//showSearch();
					$('#topBigDiv').animate({'top':'0'},"fast");
					if($('.page__hd-tips').css('display') != 'none'){
						$('.page__bd').css('padding-top','5.95rem');
					}else{
						$('.page__bd').css('padding-top','4.5rem');	
					}
				}else if (targetUrlPathname=="/loupan_list.html") {
					//hideSearch();
					$('#topBigDiv').animate({'top':'0rem'},"fast");
				}else if(targetUrlPathname=="/circle_my.html"){
					$('#showCreateCircle').animate({'bottom':'0rem'},"fast");
				}
				break;
			case 3:
				// alert("向左");
				break;
			case 4:
				// alert("向右");
				break;
			default:            
		}   
	}, false);
}
//返回角度
function GetSlideAngle(dx, dy) {
	return Math.atan2(dy, dx) * 180 / Math.PI;
}
 
//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
	var dy = startY - endY;
	var dx = endX - startX;
	var result = 0;
 
	//如果滑动距离太短
	if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
		return result;
	}
 
	var angle = GetSlideAngle(dx, dy);
	if (angle >= -45 && angle < 45) {
		result = 4;
	} else if (angle >= 45 && angle < 135) {
		result = 1;
	} else if (angle >= -135 && angle < -45) {
		result = 2;
	}
	else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		result = 3;
	}
 
	return result;
}


function qrcodeLayout(){
	if($("#g_qrcodeLayoutDiv").length > 0){
	}else{
		var addStyle="";
		if($("#footer_tabbar").length == 0 && $("#foot_comment_menu").length == 0){
			addStyle='style="bottom:0px;"';
		}
		var qrcodeStr = '<div class="qrcode-module fs30 fc-white" id="g_qrcodeLayoutDiv" '+addStyle+'>'+
							'<img class="mr5" src="../../themes/img/wenfanglogo.jpg?v=20170526154826" />'+
							'关注律乎，回复“福利”，有惊喜喲'+
							//'<span><img src="../../themes/img/close.png?v=20161201134425" /></span>'+
							'<a class="bg-red fs28">关注</a>'+
						'</div>';
		$('body').append(qrcodeStr);
		
        if($("#shareSwitchBtn").length>0 && $("#shareSwitchBtn").is(":visible")){
            $("#shareSwitchBtn").css("bottom", "5rem");
        }

        // 如果出现关注则判断是否有发布显示发布类型按钮 如果有则处理位置
        if($("#sendMessage").length > 0 && $("#sendMessage").hasClass("publish-btn")){
            $("#sendMessage").removeClass("publish-btn");
            $("#sendMessage").removeClass("publish-btn-square");
            $("#sendMessage").addClass("publish-btn2");
            $("#sendMessage").addClass("publish-btn-square2");
		}

		$("#g_qrcodeLayoutDiv").click(function(){
			createStatWithParamlog(window.location.href,"/qrcodeLayoutDiv.html","click","");
			//g_clickToSubscription：保存到本地点击状态
			writeClientSession("g_clickToSubscription",1);
			if(wenxinAppid == "wx89111e6b811c069e"){
				window.location.href="https://mp.weixin.qq.com/s/dfEIdxQ8mrnCjAvYJ_yEqQ";
			}else{
				window.location.href="http://mp.weixin.qq.com/s/sA01UUYkvY03Zym9M2Lj1Q";
			}
		});
	}
}

function removeQrcodeLayout(){
	if($("#g_qrcodeLayoutDiv").length > 0){
		$("#g_qrcodeLayoutDiv").remove();
	}
}

function showQrCodeLayout(){
	var currPathName = window.location.pathname;
	if(!isWeiXinBorrower()){
		return;
	}else if(currPathName == "/article_detail.html" || currPathName == "/qa_detail.html" || currPathName == "/index.html" 
		|| currPathName == "/qanda.html" || currPathName == "/found_expert.html" || currPathName == "/topic.html" 
		|| currPathName == "/topicqanda.html"){
		//g_clickToSubscription：保存到本地点击状态
		var g_clickToSubscription = readClientSession("g_clickToSubscription");
		//正常进入问答详情界面，未关注律乎 refreshBool 0，公众号送券 hasCouponsTo 1 用户优惠券个数couponCount，
		var refreshBool = readClientSession("refreshBool");

		//alert("g_clickToSubscription="+g_clickToSubscription);
		//alert("refreshBool="+refreshBool);

		//var hasCouponsTo = readClientSession("hasCouponsTo");
		if(refreshBool!=null&&Number(refreshBool)==1 ){
			writeClientStorage("showQrCodeLayoutFlag","0");
			removeQrcodeLayout();
		}else{
			var curruser = getSessionUserNoRedirectEx();
			var showQrCodeLayoutFlag = readClientStorage("showQrCodeLayoutFlag");
			if(curruser==null && showQrCodeLayoutFlag != null && showQrCodeLayoutFlag=="0"){
				removeQrcodeLayout();
			}else if(curruser==null){
				writeClientStorage("showQrCodeLayoutFlag","1");
				qrcodeLayout();
			}else if (g_clickToSubscription!=null&&Number(g_clickToSubscription)==1) {
				//已点击过，需要重新刷新关注状态
				writeClientSession("g_clickToSubscription",0);
				getUserSubscriptionStatus(1,showQrCodeLayout);
			}else{
			    if (refreshBool!=null&&Number(refreshBool)==0) {
			    	writeClientStorage("showQrCodeLayoutFlag","1");
					qrcodeLayout();
				}else if(refreshBool==null) {
					getUserSubscriptionStatus(1,showQrCodeLayout);
				}
			}
		}
	}
}

//弹出二维码扫描界面
function showQrCodeScan(){
	if(g_erweimaShow==0){
		g_erweimaShow = 1;
		var targetUrl = encodeURIComponent(window.location.href);
		var	qrCodeScanStr = '<div class="qrcode_scan_dialog" id="qrcodeScanDialog" style="display:;">'+
								'<div class="appui-mask black"></div>'+
								'<div class="qrcode_scan_dialog_con bg-white">'+
									'<i><img src="login_qr_code.html?userQrUrl='+targetUrl+'" /></i>'+
								'<p class="fs28 fc-black">微信扫一扫，或者截图后发入微信长按二维码识别。</p>'+
									'<a class="close_qrcode_scan bc-white" id="closeQrcodeScan"><img src="../../themes/img/close.png?v=20161201134425" /></a>'+
								'</div>'+
							'</div>';
		$('body').append(qrCodeScanStr);
	
	if($('body').width()>375){
		$('.qrcode_scan_dialog_con').css({
			'width':'16rem',
			'margin-left':'-8rem',
			'margin-top':'-9.75rem'
		});
	}else{
		$('.qrcode_scan_dialog_con').css('margin-top',-($('body').width()*0.4+70));
	}
	
		$('#closeQrcodeScan').click(function(e) {
			$('#qrcodeScanDialog').remove();
		});
	}
}


//禁止上下滑动出现微信浏览器黑底
$(document).ready(function(e) {
	if (!HTMLElement.currentStyle) {
		function _getStyle(prop) {
			var _s = window.getComputedStyle(this, null);
			return prop ? _s[prop] : _s;
		}
		HTMLElement.prototype.currentStyle = _getStyle;
		HTMLElement.prototype.getStyle = _getStyle;
	}
	
	PreventScroll('.scrollhd', '.scrollhd1', '.scrollhd2', '.scrollbd', '.scrollbd1', '.scrollbd2', '.scrollbd3', '.scrollfd', '.scrollfd1', '.scrollfd2', '.scrollfdc', '.scrollfdt');
});
// 阻止微信下拉出黑底插件
function PreventScroll() {
    // // 非微信浏览器直接跳出 -- 后来发现好些浏览器都有这个坑，所以去掉
    // var ua = navigator.userAgent.toLowerCase();
    // if (!ua.match(/MicroMessenger/i)) return;
 
    var elem = arguments || []; // 传入绑定的元素
    var $elem = [];     // 存储所有需要监听的元素
 
    // 获取需要监听的元素
    for (var i=0,len=elem.length; i<len; i++) {
        var $e = document.querySelectorAll(elem[i]);
        if (!$e) {console.error('您输入的元素不对，请检查'); return;}
        for(var j=0; j<$e.length; j++) {
            if ($e[j].currentStyle('overflow').match(/auto|scroll/i)) {
                $elem.push($e[j]);
            }
        }
    }
 
    window.addEventListener('touchstart', function(e){
        window.scroll_start = e.touches[0].clientY;
    });
    window.addEventListener('touchmove', prevent);
 
    function prevent(e) {
        var status = '11'; // 1容许 0禁止，十位表示向上滑动，个位表示向下滑动
        var startY = window.scroll_start;
        var currentY = e.touches[0].clientY;
        var direction = currentY - startY > 0 ? '10' : '01';  // 当前的滚动方向，10 表示向上滑动
 
        $elem.forEach(function(ele){
            var scrollTop = ele.scrollTop,
                offsetHeight = ele.offsetHeight,
                scrollHeight = ele.scrollHeight;
 
            if (scrollTop === 0) {
                // 到顶，禁止向下滑动，或高度不够，禁止滑动
                status = offsetHeight >= scrollHeight ? '00' : '01';
            } else if (scrollTop + offsetHeight >= scrollHeight) {
                // 到底，则禁止向上滑动
                status = '10';
            }
        });
 
        // output.innerHTML = status + ' ' + ++count;
        // 如果有滑动障碍，如到顶到底等
        if (status != '11') {
            if (!(parseInt(status, 2) & parseInt(direction, 2))) {
                e.preventDefault();
                return;
            }
        }
    }
}

//发文类型选择
function publishTypeLayout(userTest,publishLocationId,publishLocationType,hostId){
	//定义几种发布类型

	//提问
	var fastAskBtn = '<a href="start_ask.html"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>';//快速提问
	var loupanAskBtn = '<a id="loupanAskInPub"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>';//楼盘提问
	var circleAskBtn = '<a href="circle_qanda_questions.html?id='+hostId+'&publishLocationId='+publishLocationId+'&publishLocationType='+publishLocationType+'" id="askId"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>';//圈子提问

	//发帖
    var curUser = readClientSession('user');
    if(curUser.masterLvl < 1){
        var pictextBtn = '<a href="message_edit.html?type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>';//发帖
        var loactePicText = '<a href="message_edit.html?publishLocationId='+publishLocationId+'&publishLocationType='+publishLocationType+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>';//圈子或楼盘发帖
	}else{
	var pictextBtn = '<a href="file_release.html?type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>';//发帖
	var loactePicText = '<a href="file_release.html?publishLocationId='+publishLocationId+'&publishLocationType='+publishLocationType+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>';//圈子或楼盘发帖
    }

	//长文
	var articleBtn = '<a href="article_edit.html"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">文章</span></a>';//长文
	var locateArticleBtn = '<a href="article_edit.html?publishLocationId='+publishLocationId+'&publishLocationType='+publishLocationType+'"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">文章</span></a>';//圈子或楼盘长文
	
	//红包
	var redPacketBtn = '<a href="red_packets.html"><i><img src="../../themes/img/message_packet.jpg?v=20170417111459" /></i><span class="fc-black">红包</span></a>';//红包
	var locateRedPacketBtn = '<a href="red_packets.html?publishLocationId='+publishLocationId+'&publishLocationType='+publishLocationType+'"><i><img src="../../themes/img/message_packet.jpg?v=20170417111459" /></i><span class="fc-black">红包</span></a>';//圈子或楼盘红包

	var btnListStr = '';//发表按钮串
	var layoutType = 'type4';//type4:两个一排布局  type6:是三个一排布局
	
	var targetUrlPathname = window.location.pathname;//发表位置
	
	if(initOs.getOs() == 'ios'){// iosAPP屏蔽创建发布红包
		if(targetUrlPathname=="/" || targetUrlPathname=="/index.html" || targetUrlPathname=="/index.htm" || targetUrlPathname=="/square.html"){//首页或广场
			if(userTest.masterLvl>0){//行家
				btnListStr	 = pictextBtn + articleBtn + fastAskBtn;//iosAPP-首页或广场-行家-发帖+文章+提问
				layoutType = 'type6';
			}else{//普通用户
				btnListStr	 = fastAskBtn + pictextBtn;//iosAPP-首页或广场-普通用户-提问+发帖
        }
		}else if(targetUrlPathname=="/circle_page.html"){//圈子主页
			if(userTest.masterLvl>0){//行家
				if(userTest.id == hostId){//自己的圈子
					btnListStr	 = loactePicText + locateArticleBtn;//iosAPP-自己的圈子-行家-发帖+文章
				}else{//他人的圈子
					btnListStr	 = circleAskBtn + loactePicText + locateArticleBtn;//iosAPP-他人的圈子-行家-提问+发帖+文章
					layoutType = 'type6';
		}
			}else{//普通用户（非圈主）
				btnListStr	 = circleAskBtn + loactePicText;//iosAPP-圈子主页-普通用户-提问+发帖
		}
		}else if(targetUrlPathname=="/loupan_page.html"){//楼盘主页
			btnListStr	 = loupanAskBtn + loactePicText + locateArticleBtn;//iosAPP-楼盘主页-行家和普通用户-发帖+文章+提问
			layoutType = 'type6';
		}
	}else{//h5
		if(targetUrlPathname=="/" || targetUrlPathname=="/index.html" || targetUrlPathname=="/index.htm" || targetUrlPathname=="/square.html"){//首页或广场
			if(userTest.masterLvl>0){//行家
				btnListStr	 = pictextBtn + articleBtn + redPacketBtn + fastAskBtn;//iosAPP-首页或广场-行家-发帖+文章+红包+提问
			}else{//普通用户
				btnListStr	 = fastAskBtn + pictextBtn;//iosAPP-首页或广场-普通用户-提问+发帖
			}
		}else if(targetUrlPathname=="/circle_page.html"){//圈子主页
			if(userTest.masterLvl>0){//行家
				if(userTest.id == hostId){//自己的圈子
					btnListStr	 = loactePicText + locateArticleBtn + locateRedPacketBtn;//iosAPP-自己的圈子-行家-发帖+文章+红包
					layoutType = 'type6';
				}else{//他人的圈子
					btnListStr	 = circleAskBtn + loactePicText + locateArticleBtn + locateRedPacketBtn;//iosAPP-他人的圈子-行家-提问+发帖+文章+红包
		}
			}else{//普通用户（非圈主）
				btnListStr	 = circleAskBtn + loactePicText;//iosAPP-圈子主页-普通用户-提问+发帖
	}
		}else if(targetUrlPathname=="/loupan_page.html"){//楼盘主页
			btnListStr	 = loupanAskBtn + loactePicText + locateArticleBtn + locateRedPacketBtn;//iosAPP-楼盘主页-行家和普通用户-发帖+文章+提问+红包
	}
	}
	
	var publishTypeStr ='<div class="publish-type">'+
							'<div class="publish-type-list fs32 fc-black '+layoutType+'">'+ 
								btnListStr+
			'</div>'+
			'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
		'</div>';
	$('body').append(publishTypeStr);	
}

//==========================================================================20170703汪飞注释====start
//发文类型选择 type=1首页普通用户 type=2首页行家
//function publishTypeLayout(fromePage,pageType,id,type,hostId,curUserID){
//	var publishTypeStr = '' ;
//	if(initOs.getOs() == 'ios'){
//		// iosAPP屏蔽创建发布红包 start
//		//首页-普通用户5种发文选择：提问、图文、红包、长文、语言
//		if(pageType == 1){
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black type4">'+
//					'<a href="start_ask.html?from='+fromePage+'"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>'+
//					'<a href="file_release.html?from='+fromePage+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//
//		//首页-行家5种发文选择：图文、语音、长文、红包、提问
//		else if(pageType == 2){
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black type4">'+
//					'<a href="file_release.html?from='+fromePage+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//					'<a href="start_ask.html?from='+fromePage+'"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//
//		//楼盘-5种发文选择：图文、语音、长文、红包、提问
//		else if(pageType == 3){
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black type4">'+
//					'<a id="loupanAskInPub"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>'+
//					'<a href="file_release.html?publishLocationId='+id+'&publishLocationType='+type+'&from='+fromePage+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html?publishLocationId='+id+'&publishLocationType='+type+'&from='+fromePage+'"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//
//		//圈子-5种发文选择：图文、语音、长文、红包、提问
//		else if(pageType == 4){
//			var publistTypeNum = 'type4';
//			var askBtn='<a href="circle_qanda_questions.html?id='+hostId+'&publishLocationId='+id+'&publishLocationType='+type+'&from=circle" id="askId"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>';
//			if( curUserID == hostId ){
//				askBtn = '' ;
//				publistTypeNum = 'type6';
//			}
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black '+publistTypeNum+'">'+
//					askBtn+
//					'<a href="file_release.html?publishLocationId='+id+'&publishLocationType='+type+'&from=circle&type=1" id="picsId"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html?publishLocationId='+id+'&publishLocationType='+type+'&from=circle" id="articleId"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//		// iosAPP屏蔽创建发布红包 end
//	}else{
//		//首页-普通用户5种发文选择：提问、图文、红包、长文、语言
//		if(pageType == 1){
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black type4">'+
//					'<a href="start_ask.html?from='+fromePage+'"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>'+
//					'<a href="file_release.html?from='+fromePage+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="red_packets.html"><i><img src="../../themes/img/message_packet.jpg?v=20170417111459" /></i><span class="fc-black">红包</span></a>'+
//					'<a href="article_edit.html"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//		
//		//首页-行家5种发文选择：图文、语音、长文、红包、提问
//		else if(pageType == 2){
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black type4">'+
//					'<a href="file_release.html?from='+fromePage+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//					'<a href="red_packets.html"><i><img src="../../themes/img/message_packet.jpg?v=20170417111459" /></i><span class="fc-black">红包</span></a>'+
//					'<a href="start_ask.html?from='+fromePage+'"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//		
//		//楼盘-5种发文选择：图文、语音、长文、红包、提问
//		else if(pageType == 3){
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black type4">'+
//					'<a id="loupanAskInPub"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>'+
//					'<a href="file_release.html?publishLocationId='+id+'&publishLocationType='+type+'&from='+fromePage+'&type=1"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html?publishLocationId='+id+'&publishLocationType='+type+'&from='+fromePage+'"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//					'<a href="red_packets.html?publishLocationId='+id+'&publishLocationType='+type+'&from='+fromePage+'"><i><img src="../../themes/img/message_packet.jpg?v=20170417111459" /></i><span class="fc-black">红包</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//		
//		//圈子-5种发文选择：图文、语音、长文、红包、提问
//		else if(pageType == 4){
//			var publistTypeNum = 'type4';
//			var askBtn='<a href="circle_qanda_questions.html?id='+hostId+'&publishLocationId='+id+'&publishLocationType='+type+'&from=circle" id="askId"><i><img src="../../themes/img/message_qanda.jpg?v=20170426170123"></i><span class="fc-black">提问</span></a>';
//			if( curUserID == hostId ){
//				askBtn = '' ;
//				publistTypeNum = 'type6';
//			}
//			publishTypeStr =
//			'<div class="publish-type">'+
//				'<div class="publish-type-list fs32 fc-black '+publistTypeNum+'">'+
//					askBtn+
//					'<a href="file_release.html?publishLocationId='+id+'&publishLocationType='+type+'&from=circle&type=1" id="picsId"><i><img src="../../themes/img/message_pic.jpg?v=20170407142446" /></i><span class="fc-black">发帖</span></a>'+
//					'<a href="article_edit.html?publishLocationId='+id+'&publishLocationType='+type+'&from=circle" id="articleId"><i><img src="../../themes/img/message_article.jpg?v=20170417111459" /></i><span class="fc-black">长文</span></a>'+
//					'<a href="red_packets.html?publishLocationId='+id+'&publishLocationType='+type+'&from=circle" id="redId"><i><img src="../../themes/img/message_packet.jpg?v=20170417111459" /></i><span class="fc-black">红包</span></a>'+
//				'</div>'+
//				'<a class="close-publish-btn bg-white" id="closePubBtn" onclick="$(\'.publish-type\').remove();"><img src="../../themes/img/publish_red.png?v=20170418203734" /></a>'+
//			'</div>';
//		}
//    }
//	$('body').append(publishTypeStr);	
//}	
//==========================================================================20170703汪飞注释====end


//webApp 回调
// function getAppType(message){
// 	// alert(message);
// 	writeClientSession("appType",message);
// }

//webApp 回调
function getAppType(message,os){
   //message: isApp  os:android or ios
	writeClientSession("appType",message);
   writeClientSession("os",os);
}

//向app发送token
function sendAppParma(appUser){
//返回给服务器一个id tag
	var appType = readClientSession("appType");
	if (appType==isApp) {
        var oHead = document.getElementsByTagName("head")[0];
        var oScript = document.createElement("script");
        var appVersions = readClientSession("appVersions");
		if (appVersions.indexOf("ios")>-1) {
            oScript.src = "../../themes/js/webApp/ios/cordova.js";
        }else{
            oScript.src = "../../themes/js/webApp/cordova.js";
        }
        oHead.appendChild(oScript);
    }
	var appId = readClientSession("saveIdApp");
	if (appType==isApp&&appId!=0) {
		getTokenKeyRequest();
	}
}
//向app发送token网络请求
function getTokenKeyRequest(){
     $.ajax({
        type: "post",
        url: getTokenKey,
        dataType: "json",
        async: true,
        data:{},
        success: function(result) {
		setTimeout(function(){
        		writeClientSession("saveIdApp",0);
        		cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SaveParaPlugin", "saveToken", [result.data.tokenKey]);
				cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "saveId", [result.data.tokenKey]);
			},1500);
		}
    });
	}

//上传服务器返回的device_token
function sendAppDeviceInfoFunction(){
	//获取token
	var appidStr = readClientSession("appVersions");
	var sendDeviceTokenBool = readClientSession("sendDeviceTokenBool");
	// alert(appidStr);
	// alert(sendDeviceTokenBool);
	if (appidStr!=null&&sendDeviceTokenBool!=0) {
		// alert(appidStr);
		setTimeout(function(){
	        cordova.exec(getTokenSuccess,callAppsFailFunction, "SpeechOFFSynthesize", "getToken", [""]);
	        cordova.exec(getTokenSuccess,callAppsFailFunction, "SaveParaPlugin", "getDeviceToken", [""]);
	    },1500);
	};
}
// 获取getTokenSuccess 用于推送
function getTokenSuccess(token){
	var appidStr = readClientSession("appVersions");
	// alert('掉用token'+token);
	$.ajax({
        type: "post",
        url: sendAppDeviceInfo,
        dataType: "json",
        async: true,
        data:{"appid":appidStr,"deviceNo":token},
        success: function(result) {
            if (result.result == "success") {
                // alert(token+"55555");
                writeClientSession("sendDeviceTokenBool",0);
            } else {
                dataLoadedError(result.message); 
            }
        }
    });
}

//用于app交互回调
function callAppsSuccessFunction(){
}
function callAppsFailFunction(){
}
function callAppsPayFunction(){
	clearToastDialog();
}
//导航和评论切换按钮初始化
//分享进入时导航和点评栏切换参数
var shareSwitch = 0;//0当前为评论栏可切换至导航栏,1当前为导航栏可切换至点评栏
function detailPageShareInit(){
    if(shareSwitch == 1){
		$('#shareSwitchBtn').addClass('guide');
		$('#shareSwitchBtn').removeClass('comment');
		$('#footer_tabbar').hide();//隐藏导航栏
		$('#foot_comment_menu').show();//显示评论栏
		shareSwitch = 0;
	}
	else{
		$('#shareSwitchBtn').addClass('comment');
		$('#shareSwitchBtn').removeClass('guide');
		$('#footer_tabbar').show();//显示导航栏
		$('#foot_comment_menu').hide();//隐藏评论栏
		shareSwitch = 1;
	}
}

function getTextFromHtml(fromHtml){
  	$('body').append('<p id="getTextFromHtml_p" style="display:none;"></p>');
  	$("#getTextFromHtml_p").html(fromHtml);
  	$("#getTextFromHtml_p *").each(function(){
  		if($(this).length>0 && $(this).css("display")=="none"){
  			$(this).remove();
  		}
  	});

  	var destText = $("#getTextFromHtml_p").text();
  	$("#getTextFromHtml_p").remove();

  	return destText;
}

/**
 * 设置元素点击效果
 * @param obj  设置的元素
 * @param type 效果类, 不传默认为1 ,可扩展对应样式
 */
function setElementClickStyle(){

}

/**
 * 评论跳转定位到当前评论
 * setCommentScroll
 */
function setCommentScroll(type){
    //判断来源，如果来自于评论通知，则需要定位
    if(request("typeId")=="notice1"){
        var curtargetId=request("targetId");
        if($("#commentListID"+curtargetId).length != 0){
        	if(type == 1){
                $(".page__bd").scrollTop(0);
                $(".page__bd").scrollTop($("#commentListID"+curtargetId).offset().top - 44);
			}else{
                $(".scrollbd").scrollTop(0);
                $(".scrollbd").scrollTop($("#commentListID"+curtargetId).offset().top - 44);
    }
    }
}
}

/**
 * 输入框当前光标位置插入内容
 * 输入框.insertContent(插入内容);
 */
(function ($) {
    $.fn.extend({
        insertContent: function (myValue, t) {
            var $t = $(this)[0];
            if (document.selection) { // ie
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
                sel.moveStart('character', -l);
                var wee = sel.text.length;
                if (arguments.length == 2) {
                    var l = $t.value.length;
                    sel.moveEnd("character", wee + t);
                    t <= 0 ? sel.moveStart("character", wee - 2 * t
                        - myValue.length) : sel.moveStart(
                        "character", wee - t - myValue.length);
                    sel.select();
                }
            } else if ($t.selectionStart
                || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos)
                    + myValue
                    + $t.value.substring(endPos,
                        $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
                if (arguments.length == 2) {
                    $t.setSelectionRange(startPos - t,
                        $t.selectionEnd + t);
                    this.focus();
                }
            } else {
                this.value += myValue;
                this.focus();
            }
        }
    })
})(jQuery);


// 分离app与h5代码
(function(){
    var _options = {
        os: '',
        app: '',
        h5: ''
    };

    // 依赖执行
    var loadOver = function(url, fn){
        var oHead = document.getElementsByTagName("head")[0];
        var oScript = document.createElement("script");
        oScript.onload = function(){
            fn && fn();
        };
        oScript.src = url;
        oHead.appendChild(oScript);
    };

    // 设置当前环境
    var setOx = function(){
        var appType = request("appType");
        var appTypeOfSession = readClientSession("appType");
        var appVersions = request("appVersions");
        if (appVersions != "") {
            writeClientSession("appVersions",appVersions);
        }else if (readClientSession("appVersions") != null){
            appVersions = readClientSession("appVersions");
        }
        if (appType == 'isApp' || appTypeOfSession=='isApp') {
            var url = '';
            if (appVersions.indexOf("ios") != -1) {
                _options.os = 'ios';
                url = "../../themes/js/webApp/ios/cordova.js";
            }else{
                _options.os = 'android';
                url = "../../themes/js/webApp/cordova.js";
            }

            var fn = _options.app;
            _options.app = '';
            loadOver(url, function(){
                fn && fn();
            });
        }else{
            _options.os = 'h5';
            _options.h5 && _options.h5();
            _options.h5 = '';
        }
    };

    var moduleApi = {
        getOs: function(){
            _options.os && setOx();
            return _options.os;
        },
        setCallBack: function(opts){
            if(!!opts){
                for(var key in opts){
                    _options[key] = opts[key];
                }
			}
            setOx();
        },
        loadOverFn: function(url, fn){
            loadOver(url, function(){
                fn && fn();
            });
        }
    };
    this.initOs = moduleApi;
})();


// 下拉刷新
(function($){
    $.fn.extend({
        topRefresh: function(callback,scrollBox){
            var parameter = {
                top: 40,
				loadHtml: '<p id="loadBox" class="down_refresh fs30 fc-greyabc"><i class="loadmore"></i> <span>下拉刷新</span></p>',
				loadstate: true,
                startPos: '',
                execute: true,
                endPos: '',
                elemen: this.selector,
                scrollBox: scrollBox?scrollBox:$(this.selector).parent()
            };

            var removeload = function(){
                $(parameter.elemen).stop().animate({'top': 0},function(){
                    parameter.loadstate = true;
                    parameter.execute = true;
                    $("#loadBox").remove();
                });
			};

            var slide = {
                start: function (event) {
                	if($(parameter.elemen).is(":hidden")) return;
                    var touch = event.originalEvent.changedTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
                    parameter.startPos = {x: touch.pageX, y: touch.pageY};    //取第一个touch的坐标值
					$(window).on('touchmove', slide.move);
					$(window).on('touchend', slide.end);
                },
                //移动
                move: function (event) {
                    //当屏幕有多个touch或者页面被缩放过，就不执行move操作
                    if (event.originalEvent.length > 1) return;
                    var touch = event.originalEvent.targetTouches[0];
					parameter.endPos = {x: touch.pageX - parameter.startPos.x, y: touch.pageY - parameter.startPos.y};
					if(parameter.scrollBox.scrollTop() <= 0 && parameter.endPos.y > 0 && parameter.execute){
						$(parameter.elemen).css('top',parameter.endPos.y/3);
                        if(parameter.loadstate){
                            $(parameter.elemen).prepend(parameter.loadHtml);
                            parameter.loadstate = false;
                        }else{
                            var elm = $("#loadBox span");
                            if(parameter.endPos.y > (parameter.top * 3)){
								if(elm.text() != '松开刷新'){
                                    elm.text('松开刷新');
								}
                            }else{
                                if(elm.text() != '下拉刷新'){
                                    elm.text('下拉刷新');
                                }
                            }
						}
                    }else{
                        parameter.execute = false;
                        $(window).off('touchmove', slide.move);
                        $(window).off('touchend', slide.end);
                        removeload();
                    }
                },
                //滑动释放
                end: function (event) {
                    if(parameter.endPos.y > (parameter.top * 3) && !parameter.loadstate){
                        $(parameter.elemen).stop().animate({'top': parameter.top});
                        callback(removeload);
                    }else{
                        $(parameter.elemen).stop().animate({'top': 0},function(){
                            removeload();
						});
                    }
                    //解绑事件
                    $(window).off('touchmove', slide.move);
                    $(window).off('touchend', slide.end);
                }
            };

            $(window).on('touchstart', slide.start);
        }
    });
})(jQuery);

// andoridApp返回按钮执行
function androidAPPBack(){
    customHistoryUtilsBack();
}

// 弹出选项
function popupSelect(){
	var arr = ['广告','违法犯罪','标题夸张','与事实不符']
	var popupBox = '<div class="report-popup-select popup-select">' +
		'<div class="report-select-list select-list">$electList' +
        '<p class="report-select-btn select-btn fs34"><input class="report-content-text fs28" placeholder="其他原因" maxlength="50"></p>' +
		'<p class="popup-select-affirm select-btn mt10 fs30">完成</p>' +
        '</div>' +
		'</div>';

	var electList = '';

    function popupSelectHide(){
        $(".popup-select").removeClass("popup-select-show");
        setTimeout(function(){$(".popup-select").hide();}, 500);
    }

	$(".report-popup-select").remove();

	for(var i = 0; i < arr.length; i++){
        electList += '<p class="report-select report-select-btn select-btn fs28">' + arr[i] + '</p>';
	}

    popupBox = popupBox.replace(/\$electList/, electList);

    $("body").append(popupBox);

    $(".report-popup-select .report-select").unbind().on('click', function(){
        $(this).siblings().removeClass("active");
        $(this).siblings().children("span").remove();
        $(".report-popup-select .report-select-list .report-content-text").val('');
    	if(!$(this).hasClass("active")){
            $(this).addClass("active");
            $(this).append("<span class='fs26 fc-greyabc' style='float: right;padding:0 0.5rem'><img style='margin-top: 0.25rem; opacity: 0.3;' src='themes/img/success_0b7.png?v=20170208234731' alt=''><span>");
		}else{
            $(this).removeClass("active");
            $(this).children().remove();
		}
    	return false;
	});

    $(".report-popup-select .report-select-list .report-content-text").unbind().on('focus', function(){
        $(".report-popup-select .report-select").removeClass("active");
        $(".report-popup-select .report-select").children("span").remove();
	});

    $(".popup-select").show(function(){
        $(this).addClass("popup-select-show");
    });

    $(".report-popup-select .popup-select-affirm").unbind().on("click", function(){
        var activelist = $(".report-popup-select .report-select-list .active");
        var contentText = $(".report-popup-select .report-select-list .report-content-text").val();
        popupSelectHide();
        if(activelist.length > 0 || $.trim(contentText) != ''){
        	var contentStr = contentText || activelist.text();
			dataLoading("提交中...");
			$.ajax({
				type: "post",
				url: submitFeedbackUrl,
				dataType: "json",
				async: true,
				data: {
					"title":'',
					"pics": '',
					"textContent": contentStr,
					"weixinPic":''
				},
				success: function(result) {
					clearToastDialog();
					if (result.result == "success") {
						dataLoadedSuccess("提交成功");
					} else {
						dataLoadedError(result.message);
					}
				}
			});
		}
	});
	$(".report-popup-select .report-select-list").unbind().click(function(){return false});
    $(".report-popup-select").unbind().click(popupSelectHide);
}



// 是否弹出优惠劵
function isPresentCoupon(phone){
    var isAppFirstLogin = readClientStorage("isAppFirstLogin");
    var phoneNumber = readClientStorage("recordPhoneNumber");
	if( !!phone && isAppFirstLogin == null && initOs.getOs() == 'android' && phoneNumber != null && phoneNumber.indexOf(phone) != -1){
    	return true;
	}else{
		return false;
	}
}

window.onload = function(){
	if(window.location.host == "www.wenfangba.com"){
        var _mtac = {};
        (function() {
            var mta = document.createElement("script");
            mta.src = "https://pingjs.qq.com/h5/stats.js?v2.0.2";
            mta.setAttribute("name", "MTAH5");
            if(initOs.getOs() == 'android'){
                mta.setAttribute("sid", "500480328");
			}else if(initOs.getOs() == 'ios'){
                mta.setAttribute("sid", "500480331");
			}else{
                mta.setAttribute("sid", "500480326");
			}
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(mta, s);
        })();
	}
};

// app文件点击事件
function openAppfile(obj){
    event ? event.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
    var name = $(obj).attr("data-name");
    var url = $(obj).attr("data-url");
    var arr = [];
    arr.push(name);
    arr.push(url);
    cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SelectAppFilePlugin", "AppOpenFile", arr);
}
