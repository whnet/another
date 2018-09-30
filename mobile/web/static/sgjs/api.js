var xkStat = {
	host : "",
    Config: function(fid,way,userinfo){ 
		xkStat.project = xkStat.getQueryString('pro');
		xkStat.fid = fid;
		xkStat.way = way;
		xkStat.num = parseInt(Math.random()*10000);
		if(userinfo.openid==undefined){
			if(typeof userinfo!=='object') userinfo = [];
			var randOpenid = xkStat.getCookie('openid');
			if(randOpenid==null){
				randOpenid = xkStat.randomString(28);
				xkStat.setCookie('openid',randOpenid);
			}
			userinfo.openid = randOpenid;
		}
		xkStat.userinfo = userinfo;
		xkStat.openid = userinfo.openid;
		xkStat.phoneInfo();
		// xkStat.newuser();
		//setInterval("xkStat.timeLog()",4000);
    },
	getQueryString: function(name){
		url=$('#statistic').attr('src');
		var str=url; 
		var num=str.indexOf("?");
		str=str.substr(num+1);
		var value;
		var arr=str.split("&");
		for(var i=0;i < arr.length;i++){
			num=arr[i].indexOf("=");
			if(num>0){
				key=arr[i].substring(0,num);
				value=arr[i].substr(num+1);
				this[key]=value;
			}
			
		}
		return this[name];
	},

	// share: function(type,sharetext){
	// 	$.ajax({
	// 		dataType: "jsonp",
	// 		data:{project:xkStat.project,way:xkStat.way,openid:xkStat.openid,fid:xkStat.fid,type:type,shareText:sharetext},
	// 		jsonp : "callback", 
	// 		jsonpCallback : "callback", 
	// 		url: xkStat.host+'/share.php',
	// 		success:function(msg){
			
	// 		}
	// 	});
	// },
	// timeLog: function(num){
	// 	$.ajax({
	// 		dataType: "jsonp",
	// 		data:{project:xkStat.project,way:xkStat.way,openid:xkStat.openid,num:xkStat.num},
	// 		jsonp : "callback", 
	// 		jsonpCallback : "callback", 
	// 		url: xkStat.host+'/timelog.php',
	// 		success:function(msg){

	// 		}
	// 	});
	// },
	button: function(step,name){

	},
	// setCookie:function(name,value){
	// 	var Days = 30;
	// 	var exp = new Date();
	// 	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	// 	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	// },
	// getCookie:function(name){
	// 	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	// 	if(arr=document.cookie.match(reg))
	// 	return unescape(arr[2]);
	// 	else
	// 	return null;
	// },
	// randomString:function(len) {
	// 	len = len || 28;
	// 	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	// 	var maxPos = chars.length;
	// 	var pwd = '';
	// 	for (i = 0; i < len; i++) {
	// 		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	// 	}
	// 	return pwd;
	// },
	phoneInfo:function(){
		var phoneAgent = navigator.userAgent.toLowerCase();
		if(phoneAgent.indexOf('iphone')>=0){
			xkStat.phoneModel = '苹果';
		}else if(phoneAgent.indexOf('meizu')>=0||phoneAgent.indexOf('mx')>=0||phoneAgent.indexOf('m578c')>=0||phoneAgent.indexOf('m571c')>=0){
			xkStat.phoneModel = '魅族';
		}else if(phoneAgent.indexOf('nokia')>=0){
			xkStat.phoneModel = '诺基亚';
		}else if(phoneAgent.indexOf('huawei')>=0||phoneAgent.indexOf('honor')>=0){
			xkStat.phoneModel = '华为';
		}else if(phoneAgent.indexOf('hm note')>=0||phoneAgent.indexOf('mi-one')>=0||phoneAgent.indexOf('redmi')>=0||phoneAgent.indexOf('2014501')>=0||phoneAgent.indexOf('2014011')>=0||phoneAgent.indexOf('2013022')>=0||phoneAgent.indexOf('m1 build')>=0){
			xkStat.phoneModel = '小米';
		}else if(phoneAgent.indexOf('gt-')>=0||phoneAgent.indexOf('sm-')>=0||phoneAgent.indexOf('sch')>=0){
			xkStat.phoneModel = '三星';
		}else if(phoneAgent.indexOf('vivo')>=0){
			xkStat.phoneModel = 'Vivo';
		}else if(phoneAgent.indexOf('coolpad')>=0){
			xkStat.phoneModel = '酷派';
		}else if(phoneAgent.indexOf('htc')>=0){
			xkStat.phoneModel = 'HTC';
		}else if(phoneAgent.indexOf('zte')>=0){
			xkStat.phoneModel = '中兴';
		}else if(phoneAgent.indexOf('sony')>=0){
			xkStat.phoneModel = '索尼';
		}else{
			xkStat.phoneModel = '其他';
		}
		var pattern_phone = new RegExp("iPhone","i");
		var pattern_android = new RegExp("android","i");
		var userAgent = navigator.userAgent.toLowerCase();
		var isAndroid = pattern_android.test(userAgent);
		var isIphone = pattern_phone.test(userAgent);
		var phoneModel="phoneType";
		if(isAndroid){ 
			var spaceIndex = userAgent.indexOf("build");
			var Index = userAgent.lastIndexOf("; ");
			if(spaceIndex==-1||Index==-1){
				phoneModel = "未知";
			}else{
				phoneModel = navigator.userAgent.substring(Index+2,spaceIndex);
			}
				xkStat.phoneType = 'Android';
		}else if(isIphone){ 
			//6   w=375    6plus w=414   5s w=320     5 w=320
			var height = window.screen.height;
			if(height>=736){ 
				phoneModel = "iPhone6s";
			}else if(height>=667){ 
				phoneModel = "iphone6/7";
			}else if(height>=568){ 
				phoneModel = "iphone5";
			}else{ 
				phoneModel = "iphone 4s";
			}
			xkStat.phoneType = 'iphone';
		}else{ 
			phoneModel = "未知";
			xkStat.phoneType = '未知';
		}
		
		xkStat.ModelDetail=phoneModel;
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/iPhone/i)=="iphone") {
			var versionInfo = ua.match(/iPhone OS ([[\d_]+)/i);
		}else if(ua.match(/Android/i)=="android"){
			var versionInfo = ua.match(/android ([\d.]+)/i);
		}else{
			versionInfo = ['','其他'];
		}
		xkStat.versionInfo = versionInfo[1];
		var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
		if( !wechatInfo ) {
		  xkStat.wechatInfo='未知';
		} else  {
		  xkStat.wechatInfo=wechatInfo[1];
		}
	},
	callback: function(msg){
		
	},

};