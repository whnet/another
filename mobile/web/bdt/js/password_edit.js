// password_edit.js
var oldPassword = "";
var newPassword = "";
var confirmPassword = "";

$(document).ready(function() {
	/** by wangzhen 20170513 调整back程序
    $("#back").click(function() {
        if (isNormalBackBool==1) {
        //document.referrer是获取上一页的url
        var url = document.referrer;
        if (url!=null&&url.length!=0) {
           window.location.href = "javascript:history.back(-1)";
        }else{
           window.location.href = "index.html";
        }
        }else{
            historyUtils.back();  
        }
    });
	*/
 //普通登录方法
    $(".but_save").click(function(){
    	oldPassword = $("#oldPasswordID").val();
    	newPassword = $("#newPasswordID").val();
        confirmPassword = $("#confirmPasswordID").val();
        if (newPassword.length<=0||newPassword==null) {
        	dataLoadedError("新密码不能为空");
        	return;
        };
        if (newPassword.length<6) {
        	dataLoadedError("新密码不能少于六位");
        	return;
        };
        if (confirmPassword.length<=0||confirmPassword==null) {
        	dataLoadedError("确认密码与新密码不一致");
        	return;
        };
       if (newPassword!=confirmPassword) {
       	dataLoadedError("确认密码与新密码不一致");
       }else{
       	 requestSetPassword();
       }
    });

});

function requestSetPassword(){
	dataLoading('数据加载中...');
    var csrf = $('input[name="csrf"]').val();
	$.ajax({
        type: "post",
        url: 'password_edit.html',
        dataType: "json",
        async: true,
        data:{"oldPassword":oldPassword,"newPassword1":newPassword,"newPassword2":confirmPassword, _csrf:csrf},
        success: function(result) {
        	clearToastDialog();
        	if (result.result == "success") {  
        		dataLoadedSuccess("密码修改成功");
        		window.location.href = "javascript:history.back(-1)";
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}
