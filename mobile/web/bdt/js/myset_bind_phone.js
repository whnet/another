// myset_bind_phone.js
// password_edit.js

var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

var phoneNumber = "";
var codeNumber = "";

var userTest = "";

var nextStepCheckToken = "";

$(document).ready(function() {
    bindSendCode();
    ifBindMobile();

});
// 解绑原手机号码操作
function changePhone(){
    if (userTest.phone!=null&&userTest.phone.length>0) {
        $('#bind-state-icon').attr('src','../bdt/images/phone-bk.png');
        $('#bindPhoneView').show();
        $('#unbindPhoneView').show();
        $("#bind-phone-btn1").hide();
        $("#bind-phone").val(userTest.phone);
        $("#bind-phone").attr("readonly","readonly");
        $("#bind-phone-btn2").html("下一步");
        $("#bind-phone-btn2").show();
        $(".statebar h2").html("解绑验证");
        $("#bindPhoneView p").html("解绑手机号需要验证您的手机号");
    }else{
        $("#bindPhoneView p").html("手机号绑定后，下次可直接用手机号登录。")
        $("#bindPhoneView").show();
        $("#bind-phone-btn1").hide();
        $("#bind-phone-btn2").show();
    }
    
}
//查看是否绑定了手机
function ifBindMobile(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        url: '/members/ifbindmobile.html',
        type: 'post',
        dataType: 'json',
        data: {"_csrf":csrf},
        success: function (data){
            if(data.result == 'success'){
                if(data.info.phone){
                    $('#bindPhoneView').show();
                    $('#bindPhoneView span').html(data.info.phone);
                    $('#unbindPhoneView').hide();
                    $('#bind-phone-btn2').hide();
                }else{
                    $('#bind-state-icon').attr('src','../bdt/images/phone-bk.png');
                    $("#bindPhoneView h2").html("您当前未绑定手机号");
                    $("#bindPhoneView p").html("手机号绑定后，下次可直接用手机号登录。")
                    $("#bindPhoneView").show();
                    $("#bind-phone-btn1").hide();
                    $("#bind-phone-btn2").show();
                }
            }
        }
    })
}


function bindCurrent(){
    var csrf = $('input[name="csrf"]').val();
    if($.trim($("#bind-code").val()) == ""){
        dataLoadedError("请填写验证码");
    }else{
            // 当前未绑定手机号码
            $.ajax({
                url: '/members/bindphone.html',
                type: 'post',
                dataType: 'json',
                data: {"phone": phoneNumber,"code":$("#bind-code").val(),"_csrf":csrf},
                success: function (result){
                    if (result.result != "success") {
                        dataLoadedError(result.message);
                    }else{
                        type = request('type');
                        if(type == 'expert'){
                            window.location.href = "/members/qanda_certify.html";
                        }else{
                            window.location.href = "/members/myset.html";
                        }

                    }
                }
            })

    }
}
function bindSendCode() {
     $("#btnSendCode").click(function(){
        phoneNumber = $("#bind-phone").val();
        if (isPhone(phoneNumber)==true) {
            getPhoneCode();
        }else{
            dataLoadedError(isPhone(phoneNumber));
        }
    });
}
function isPhone(phone) {
    var reg = /^13\d{9}|14[57]\d{8}|15[0123456789]\d{8}|17[0123456789]\d{8}|18[0123456789]\d{8}|170\d{8}$/
    if(phone == ""){
        return "手机号为空";
    }
    if(!reg.test(phone)){
        return "手机号码格式不正确";
    }if(nextStepCheckToken != '' && $("#bind-phone").val() == userTest.phone){
        return "新绑定的手机号码不能与解绑的手机号重复";
    }else{
        return true;
    }
}
function getPhoneCode() {
  　curCount = count;
    var codeType = 4;
　　//设置button效果，开始计时
     $("#btnSendCode").attr("disabled", "true");
     $("#btnSendCode").val("重新发送(" + curCount + ")");
     $("#btnSendCode").attr("class","fs32 fc-greyaaa bc-greye5");
     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
　　  //向后台发送处理数据
    var csrf = $('input[name="csrf"]').val();
      $.ajax({
        type: "post",
        url: '/members/code.html',
        dataType: "json",
        async: true,
        data:{"phone":phoneNumber,"_csrf":csrf},
        success: function(data) {
            if (data.result != "success") {
                dataLoadedError(data.result);
            }
        }
    });
}

//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {                
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").attr("class","fs32 fc-blue bc-blue");
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").val("发送验证码");
    }
    else {
        curCount--;
        $("#btnSendCode").val("重新发送(" + curCount + ")");
    }
}
