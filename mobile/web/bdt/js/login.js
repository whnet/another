
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
// data:{"phone":"手机号","type":"1-注册，2-登录，3-找回密码"}
// data:{"phone":"手机号","code":"验证码","type":"1-快速登录，2-找回密码"}
var phoneType = "";
var loginType = "";
var phoneNumber = "";
var codeNumber = "";
var passwordStr = "";
var userTest = "";
var fromUnlogin = "0";

//openid
var appVersions =  $('input[name="openid"]').val();
$(document).ready(function() {

    //普通登录方法
    bindNormalButton() ;
     //快速登录方法
	bindSendCode();
	bindLoginButton();

    $("#quickLogin").click(function(){
       $('#login-module1').css('display','none');$('#login-module2').css('display','block');$(this).hide().next('a').show();
    });

    $("#normalLogin").click(function(){
       $('#login-module2').css('display','none');$('#login-module1').css('display','block');$(this).hide().prev('a').show();
    });

    $("#forgetPassword").click(function(){
       $('#login-module1').css('display','none');$('#login-module2').css('display','block');$('#quickLogin').hide().next('a').show();
    });

    
});

function bindNormalButton() {
    $("#normalLoginBtn").click(function(){
        phoneNumber = $("#login-phone-email").val();
        passwordStr = $("#login-pass").val();
        // $('#phone-emailError').hide();
        // $('#passwordError').hide();
        if (isEmail(phoneNumber)!=true&&isPhone(phoneNumber)!=true) {
            $('#phone-emailError').show(300).delay(2000).hide(300); 
            $('#phone-emailError').text("手机号或邮箱格式错误");
            return;
        }
        if(passwordStr.length<=0){
            $('#passwordError').text("密码不能为空");
            $('#passwordError').show(300).delay(2000).hide(300); 
            return;
        }
        requestNormalLoginURL();
    });
}

function bindSendCode() {
	 $("#btnSendCode").click(function(){
    	phoneNumber = $("#login-phone").val();
    	if (isPhone(phoneNumber)==true) {
    		getPhoneCode();
    	}else{
    		$('#phoneError').show(300).delay(2000).hide(300); 
    		$('#phoneError').text(isPhone(phoneNumber));
    	}
	});
}
function bindLoginButton() {
	$("#loginBtn").click(function(){
    	phoneNumber = $("#login-phone").val();
		codeNumber = $("#login-code").val();
		if (isPhone(phoneNumber)!=true) {
    		$('#phoneError').show(300).delay(2000).hide(300); 
    		$('#phoneError').text(isPhone(phoneNumber));
    		return;
    	}
		if(codeNumber.length<=0){
			$('#codeError').text("动态验证码不能为空");
			$('#codeError').show(300).delay(2000).hide(300); 
			return;
		}
		requestLoginURL();
	});
}
function getPhoneCode() {
  　curCount = count;
    var csrf = $('input[name="csrf"]').val();
　　//设置button效果，开始计时
     $("#btnSendCode").attr("disabled", "true");
     $("#btnSendCode").val("重新发送(" + curCount + ")");
     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
　　  //向后台发送处理数据
     // data:{"phone":"手机号","type":"1-注册，2-登录，3-找回密码"}
      $.ajax({
        type: "post",
        url: '/members/code.html',
        dataType: "json",
        async: true,
        data:{
            "phone":phoneNumber,
            "_csrf":csrf,
        },
        success: function(result) {
        }
    });
}


//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {                
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").val("重新发送验证码");
    }
    else {
        curCount--;
        $("#btnSendCode").val("重新发送(" + curCount + ")");
    }
}

function requestLoginURL() {
    var csrf = $('input[name="csrf"]').val();
	  $.ajax({
        type: "post",
        url: '/members/checkcode.html',
        dataType: "json",
        async: true,
        data:{
            "phone":phoneNumber,
            "code":codeNumber,
            "appid":appVersions,
            "_csrf":csrf,
        },
        // data:{"phone":"手机号","code":"验证码","type":"1-快速登录，2-找回密码"}
        success: function(result) {
        	if (result.result == "success") {
        	 	dataLoadedSuccess("登录成功");
            } else {
                dataLoadedError(result.message); 
            }
        }
    });
}
function requestNormalLoginURL() {
    //   $.ajax({
    //     type: "post",
    //     url: doLogin,
    //     dataType: "json",
    //     async: true,
    //     data:{"loginStr":phoneNumber,"password":passwordStr,"appid":appVersions},
    //     success: function(result) {
    //         if (result.result == "success") {
    //             dataLoadedSuccess("登录成功");
    //             writeClientSession("user",result.data.user);
    //             window.location.replace(result.data.gotoUrl);
    //         } else {
    //             dataLoadedError(result.message);
    //         }
    //     }
    // });
}

function requestCheckNicknameURL() {
	  $.ajax({
        type: "post",
        url: checkNickname,
        dataType: "json",
        async: true,
        data:{"nickname":nicknameStr},
        success: function(result) {
        	 if (result.result == "success") {
            } else {
                // dataLoadedError(result.message); 
                $('#nicknameError').show(300).delay(2000).hide(300); 
                $('#nicknameError').text("昵称已经存在");
            }
        }
    });
}

// //cordova 微信登录按钮
function webAppLogin(){
    $("#wxLoginDiv").show();
    $('#webWXLogin').click(function(){
        androidLogin();
    })
    $('#otherLogin').click(function(){
        document.addEventListener("backbutton", eventBackButton, false); //返回键
        $("#wxLoginDiv").fadeOut();
        $('#container').fadeIn();
        $(".third-access").hide();
    })
}
function androidLogin() {
    // 微信登录
    // dataLoading("微信登录请求中..");
    // cordova.exec("", "", "MyPlugin", "wxLogin", ["00"]);
    // alert(1);
    cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "MyPlugin", "wxLogin", ["00"]);
    // alert(2);
}

//授权成功回调webapp
function androidLoginSucc(code,errorStatus){
    clearToastDialog();
    // errCode: 0成功  -2用户取消  -4发送拒绝  -5 不支持错误
    var reUrl= weixinAuthUrl;
    reUrl = encodeURIComponent(reUrl);
    if (errorStatus==0) {
        appVersions = readClientSession("appVersions");
        window.location.href = 'access_token.html?code='+code+'&appid='+appVersions;
    };
}
//获取getTokenSuccess 用于推送
function getTokenSuccess(token){
    // $.ajax({
    //     url: sendAppDeviceInfo,
    //     dataType: "json",
    //     async: true,
    //     data:{"appid":appVersions,"deviceNo":token},
    //     success: function(result) {
    //         if (result.result == "success") {
    //             alert(token+"55555");
    //         } else {
    //             dataLoadedError(result.message); 
    //         }
    //     }
    // });
    // alert(token);
    // device_Token = token;
    writeClientSession("device_Token",token);
}

// var exitTime = 0;
// function onLoad() {
//     document.addEventListener("deviceready", onDeviceReady, false);
// }
// function onDeviceReady() {
//     document.addEventListener("backbutton", onBackKeyDown, false);
// }
function eventBackButton() {
 // alert('oh! you press the back button');
    if ($('#container').is(":visible")) {
        $("#wxLoginDiv").fadeIn();
        $('#container').fadeOut();
    }
    document.removeEventListener("backbutton", eventBackButton, false); //注销返回键 
}