var userTest = "";

var appType = "";
$(document).ready(function() {
    ifBindMobile();

    //未绑定手机号
        $('#bind_phone').click(function(){
            window.location.href = "myset_bind_phone.html";
        });
});

function logout() {
    removeClientSession("user");
    if (appType==isApp) {
    removeClientSession("saveIdApp");
    removeClientSession("sendDeviceTokenBool");
        cordova.exec("", "", "SpeechOFFSynthesize", "delId", [""]);
    }
	window.location.href='logout.html?fromUnlogin=1';
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
                    $('#bindPhone').css('display','block');
                    $('#unbindPhone').css('display','none');
                }else{
                    $('#bindPhone').css('display','none');
                    $('#unbindPhone').css('display','block');
                }
            }
        }
    })
}
