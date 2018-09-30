
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

var phoneNumber = "";
var codeNumber = "";
var nicknameStr = "";
var passwordStr = "";

var appVersions = "";
$(document).ready(function() {
        appVersions = readClientSession("appVersions");
    if (readClientSession("appVersions")==null){
        appVersions = "";
    }
    var appTypeOfSession = readClientSession("appType");
    if (appTypeOfSession==isApp) {
        $(".third-access").hide();
    }
    checkOpenId("regist");
	bindSendCode();
	bindRegistButton();
	bindCheckNickname();
});
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
function bindCheckNickname() {
	$('#login-name').blur(function (){ 
		nicknameStr = $("#login-name").val();
		if(nicknameStr.indexOf(" ")!=-1||nicknameStr.length==0){
			$('#nicknameError').text("昵称不能为空");
			$('#nicknameError').show(300).delay(2000).hide(300); 
			return;
		}
		// requestCheckNicknameURL();
    }); 
}
function bindRegistButton() {
	$("#registButtonID").click(function(){
    	phoneNumber = $("#login-phone").val();
		codeNumber = $("#login-code").val();
		nicknameStr = $("#login-name").val();
		passwordStr = $("#login-pass").val();

		if(nicknameStr.indexOf(" ")!=-1||nicknameStr.length==0){
			$('#nicknameError').text("昵称不能为空");
			$('#nicknameError').show(300).delay(2000).hide(300); 
			return;
		}
		if(passwordStr.indexOf(" ")!=-1){
			$('#passwardError').text("密码中不能含有空格");
			$('#passwardError').show(300).delay(2000).hide(300); 
			return;
		}
		if(passwordStr.length<6){
			$('#passwardError').text("密码不能低于六位数字");
			$('#passwardError').show(300).delay(2000).hide(300); 
			return;
		}
		if(phoneNumber.length<=0){
			$('#phoneError').text("手机号不能为空");
			$('#phoneError').show(300).delay(2000).hide(300); 
			return;
		}
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
        if(codeNumber.length<=0){
            $('#codeError').text("动态验证码不能为空");
            $('#codeError').show(300).delay(2000).hide(300); 
            return;
        }
        var aggreStatus = $('#aggre').prop("checked");
        if (aggreStatus==false) {
            dataLoadedError("您需要同意本软件的用户使用协议");
            return;
        };
		requestRegistURL();
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

function requestRegistURL() {
	  $.ajax({
        type: "post",
        url: doRegister,
        dataType: "json",
        async: true,
        data:{"phone":phoneNumber,"code":codeNumber,"password":passwordStr,"nickname":nicknameStr,"appid":appVersions},
        success: function(result) {
        	if (result.result == "success") {
        	 	dataLoadedSuccess("注册成功"); 
                writeClientSession("user",result.data.user);
                location.href = result.data.gotoUrl;
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}
function requestCheckNicknameURL() {
	  $.ajax({
        type: "post",
        url: "/members/checkNickname.html",
        dataType: "json",
        async: true,
        data:{"nickName":nicknameStr},
        success: function(result) {
        	 if (result.result == "success") {
            } else {
                $('#nicknameError').show(300).delay(2000).hide(300); 
                $('#nicknameError').text(result.message);
            }
        }
    });
}
