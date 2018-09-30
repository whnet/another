// qanda_certify.js
var indexID = 0;
var targetId = "";
var currentPage = 1;
var totalPage = "";
var isMaster = 0;
var jiaodu=0;
var fromIndex = null;
var imgConverData = '';
var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数

var isBackBool = 0;
$(document).ready(function() {
    //判断是否认证了手机号
    ifBindMobile();
	$('body').height($(window).height());
    var csrf = $('input[name="csrf"]').val();
	targetId = request("id");
    $('.cardUpload').click(function(e) {
        chooseImage();
    })
});
//微信上传接口

function chooseImage(){
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            if(localIds.length==0){
                return false;
            }else if(localIds.length>1){
                alert('只允许选择一张图片！')
            }else{
                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        WxDownload(res.serverId);
                    }
                });
            }

        }
    });
}
//下载图片
function WxDownload(serverId){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "POST",
        dataType: "JSON",
        data:{
            serverId:serverId,
            _csrf:csrf
        },
        async : false,
        url: '/members/downlodimg.html', // 这个是指向了哪里，一脸懵逼
        success:function(msg){
            $("#certifiedPicTips").html("当前名片<span class='fs28 fc-orange'>（点击可重新上传名片）</span>");
            $("#certifiedPic").css('display','block');
            $("#certifiedPic img").attr("src",msg.url+msg.filename);
            $('input[name="uploadCertifiedPic"]').val(msg.filename);
            $("#uploadCertifiedPic").hide();
            $("#certifiedPic").show();
        }
    })
}

//不从服务器上下载，直接在本地显示的方法。下载localId,这个图片存放在手机上但是看不到，需要从微信服务器下载
function MlocalId(serverId) {
    wx.downloadImage({
        serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
            var localId = res.localId; // 返回图片下载后的本地ID
            getLocalImgData(localId);
        }
    });
}
//获取本地的图片数据
function getLocalImgData(localId) {
    wx.getLocalImgData({
        localId: localId,
        success: function (res) {
            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            alert(localData);
            $('.upload_img img').attr('src',"");
        }
    });

}

//微信上传接口END

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
                if(!data.info.phone){
                    dataLoading("请绑定手机");
                    setTimeout("goBindPhone()",3000);
                }
            }
        }
    })
}
function goBindPhone(){
    window.location.href="/members/myset_bind_phone.html?type=expert";
}

//绑定手机号
function getPhoneCode(phoneNumber) {
    curCount = count;
	//设置button效果，开始计时
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").val("重新发送(" + curCount + ")");
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
				//向后台发送处理数据
    // data:{"phone":"手机号","type":"1-注册，2-登录，3-找回密码，4-绑定手机，5-解绑手机"}
    $.ajax({
        type: "post",
        url: sendPhoneCode,
        dataType: "json",
        async: true,
        data:{"phone":phoneNumber,"type":4},
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

function num(obj){
    obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}

var reg = /^[0-9]+.?[0-9]*$/;//用来验证数字，包括小数的正则
function applyMasterMethods(){
    var type = '';
    var length = $(".publishcolor").length;
    $(".publishcolor").each(function(i){
        if(i != (length - 1)){
            type += $(this).data('type')+',';
        }else{
            type += $(this).data('type');
        }
    });
    var realName   = $('#masterRealName').val();
    var askPrice   = $('#askPrice').val();
    var masterInfo = getFormatCode($('#masterInfo').val());
    var masterTitle = $('#masterTitle').val();
    var aggreStatus = $('#aggre').prop("checked");
    if(realName==null||realName.length==0 || realName.trim()==""){
        dataLoadedError("请输入您的真实姓名！");
    }else if (masterTitle==null||masterTitle.length==0 || masterTitle.trim()=="") {
        dataLoadedError("名片头衔不能为空");
    }else if (masterInfo==null||masterInfo.length==0 || masterInfo.trim()=="") {
        dataLoadedError("专家简介不能为空");
    }else if(askPrice==null||askPrice.length==0 || askPrice.trim()==""){
        dataLoadedError("请输入您的回答定价");
    }else if (!reg.test(askPrice)) {
        dataLoadedError("请输入正确的金额数字格式！");
    }else if (parseFloat(askPrice)<0||parseFloat(askPrice)>1000) {
        dataLoadedError("您输入的金额应该在0-1000之间");
    }else if (isMaster==0 && aggreStatus==false) {
        dataLoadedError("您需要同意本平台的使用协议");
    }else if (askPrice > 2000){
        dataLoadedError("您的金额应0-2000");
    }else if(type==''){
        dataLoadedError("请选择类别");
        return;
    }else{
        //提交资料
        sendInfosForExpert(realName, askPrice, masterInfo, masterTitle, type);
    }
}
//提交资料审核
function sendInfosForExpert(realName, askPrice, masterInfo, masterTitle, type){
    var mid = $('input[name="mid"]').val();
    if(mid){
        url = "/members/changeapply.html"
    }else{
        url = "/members/apply.html"
    }
    var csrf = $('input[name="csrf"]').val();
    var certifiedPic = $('input[name="uploadCertifiedPic"]').val();
    dataLoading("正在提交...");
    $.ajax({
        type: "POST",
        url: url,
        data: {
            mid:mid,
            realname:realName,
            honor:masterTitle,
            des:masterInfo,
            price:askPrice,
            type:type,
            card:certifiedPic,
            _csrf:csrf
        },
        dataType: "json",
        success: function(data){
           if(data.result == 'success'){
               dataLoadedSuccess("提交成功,请等待审核");
               window.location.href = "/members/index.html";
           }
        }
    });

}
function hasSwitchOnClass(cell){
    var hasSwitchOn = "";
     if ($('#'+cell+' span').attr("class").indexOf("appui_cell__switch-on")>0) {
        hasSwitchOn = 1;
    }else{
        hasSwitchOn = 0;
    }
    return hasSwitchOn;
}
function monitorCount(){
    $('#masterInfo').bind('onpropertychange textarea', function () {
        var counter = $('#masterInfo').val().length;
        $('#masterInfoCount').text(counter);   //每次减去字符长度
        if (counter>300) {
            $('#masterInfoCount').text(300);
            this.value = this.value.substring(0, 300);
            if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
            }
            return false;
        };
    });
    $('#masterTitle').bind('onpropertychange textarea', function () {
        var counter = $('#masterTitle').val().length;
        $('#masterTitleCount').text(counter);   //每次减去字符长度
        if (counter>18) {
            $('#masterTitleCount').text(18);
            this.value = this.value.substring(0, 18);
            if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
            }
            return false;
        };
    });
}


 function doInitCropper(ids){
  $image = $(ids);
  //image.crossOrigin = "anonymous";

  var options = {
           cropBoxMovable: false,
           // Enable to resize the crop box
           cropBoxResizable: false,
           dragMode: 'move',
           aspectRatio: 43/ 27,
           background: false,
        crop: function (e) {
          
        }
      };

  // Cropper
  $image.cropper(options);
}


function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

function cardChange(inputFileId){
        var file=$("#"+inputFileId).get(0).files[0];
         if (file.type.indexOf("image") == 0) {
                if (file.size >= 5120000) {
                    alert('您这张"'+ file.name +'"图片大小过大，应小于5000k');
                } else {
                  //$('.waitLoad').show();
                  var URL = window.URL || window.webkitURL;
                  var blobURL;
                  blobURL = URL.createObjectURL(file);
                  $image.one('built.cropper', function () {
                           URL.revokeObjectURL(blobURL);
                            $('.upload-container').css({'visibility':'visible','z-index':'1'},500);
                            $('.upload-container .row').css({'height':$('.upload-container .row').width(),'margin-top':-$('.upload-container .row').width()/2});
                            $("#sure-btn").show();
                            $("#certifyHome").hide();
                            $("#modifyPicPage").show();
                  }).cropper('reset', true).cropper('replace', blobURL);
                }                  
          } else {
                alert('文件"' + file.name + '"不是图片。');
          }

}

function myClose(){
	if (isBackBool==1) {
	 	removeClientSession("sessionUser");
	};
}
// 真实名字数限制
function masterRealName(){
    $('#masterRealName').bind('propertychange input', function () {
        var counter = $('#masterRealName').val().length;
        var maxInputLength = $('#masterRealName_maxInputLength').text();
        $('#masterRealNameCount').text(counter);   //每次减去字符长度
        if (counter>maxInputLength) {
            $('#masterTitleCount').text(maxInputLength);
            this.value = this.value.substring(0, maxInputLength);
            if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
            }
            return false;
        };
    });
}
//头衔
function masterTitle(){
    $('#masterTitle').bind('propertychange input', function () {
        var counter = $('#masterTitle').val().length;
        var maxInputLength = $('#masterTitle_maxInputLength').text();
        $('#masterTitleCount').text(counter);
        if (counter>maxInputLength) {
            $('#masterTitleCount').text(maxInputLength);
            this.value = this.value.substring(0, maxInputLength);
            if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
            }
            return false;
        };
    });
}
//简介
function masterInfo(){
    $('#masterInfo').bind('propertychange input', function () {
        var counter = $('#masterInfo').val().length;
        var maxInputLength = $('#masterInfo_maxInputLength').text();
        $('#masterInfoCount').text(counter);
        if (counter>maxInputLength) {
            $('#masterInfoCount').text(maxInputLength);
            this.value = this.value.substring(0, maxInputLength);
            if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
            }
            return false;
        };
    });
}
// 保留textarea 中的空格 换行
function getFormatCode(strValue){
    return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
}

