// personal_data_name_edit.js
$(document).ready(function() {
    //获取参数；
	var qzId = request("id");
   var value   = decodeURI(request("value"));
   $('#textValue').val(value);
    //0表示修改昵称，1表示修改个性签名
    if (qzId==0) {
    	$('#title').text("编辑昵称");
    	$('#textValue').attr('placeholder',"请输入您的昵称");
    	$('.text-edit-tips').text("真实名字可以让你的朋友更加容易找到你。");
        $('#textValue').bind('onpropertychange input', function () {
            var counter = $('#textValue').val().replace(/[^\x00-\xff]/g, "**").length;
            if (counter>12) {
                this.value = this.value.substring(0, 12);
                dataLoadedError("您已经超过最大输入个数");
                return false;
            };
        });
    }else{
    	$('#title').text("编辑圈子昵称");
    	$('#textValue').attr('placeholder',"请输入您的圈子昵称");
        $('#textValue').attr('maxlength',10);
    	$('.text-edit-tips').text("有昵称显得您很有品味(不得超过10个字)");
        $('#textValue').bind('onpropertychange input', function () {
            var counter = $('#textValue').val().length;
            if (counter>20) {
                dataLoadedError("您已经超过最大输入个数");
                return false;
            };
        });
    }
    $('#saveModify').click(function(){
	    if ($('#textValue').val()==null||$('#textValue').val().length==0) {
	    	dataLoadedError("修改内容不能为空");
	    }else{
    	if (qzId==0) {;
                 updateUserInfoFunction(qzId);
	    }else{
                if ($('#textValue').val().length>10) {
                    dataLoadedError("圈子昵称不能超过10个字符");
	    }else{
	    updateUserInfoFunction(qzId);
	    }
            }
	    }
    });
	/** by wangzhen 20170513 调整back程序
    $("#back").click(function() {
//        if (isNormalBackBool==1) {
//        var url = document.referrer;
//        if (url!=null&&url.length!=0) {
//           window.location.href = "javascript:history.back(-1)";
//        }else{
           window.location.href = "circle_data_expert.html?id="+qzId;
//        }
//        }else{
//            historyUtils.back();
//        }
    });
    */
});
//修改资料
function updateUserInfoFunction(qzid) {
    $.ajax({
        type: "post",
        url: updateQzUserInfoUrl,
        dataType: "json",
        async: true,
        data:{"qzId":qzid,"nickname":$('#textValue').val()},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
            		dataLoadedSuccess("修改昵称成功");
            	window.location.replace("circle_data_expert.html?id="+qzid);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}