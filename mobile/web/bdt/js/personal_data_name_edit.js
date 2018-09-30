// personal_data_name_edit.js
var indexID = "";
var value = "";
$(document).ready(function() {
    //获取参数；
   indexID = request("index");
   // decodeURI
   value   = decodeURI(request("value"));
   $('#textValue').val(value);
    //0表示修改昵称，1表示修改个性签名
    if (indexID==0) {
    	$('#title').text("编辑昵称");
    	$('#textValue').attr('placeholder',"请输入您的昵称");
        // $('#textValue').attr('maxlength',6);
    	$('.text-edit-tips').text("真实名字可以让你的朋友更加容易找到你。");
        $('#textValue').bind('onpropertychange input', function () { 
            // var inputNum = document.getElementById("txtTitle").value.replace(/[^\x00-\xff]/g, "**").length; //得到输入的字节数
            var counter = $('#textValue').val().replace(/[^\x00-\xff]/g, "**").length;
            if (counter>12) {
                this.value = this.value.substring(0, 12);
                dataLoadedError("您已经超过最大输入个数");
                return false;
            };
        });
    }else{
    	$('#title').text("编辑个性签名");
    	$('#textValue').attr('placeholder',"请输入您的签名");
        $('#textValue').attr('maxlength',30);
    	$('.text-edit-tips').text("有签名显得您很有品味(不得超过30个字)");
        $('#textValue').bind('onpropertychange input', function () {  
            var counter = $('#textValue').val().length;
            if (counter>30) {
                dataLoadedError("您已经超过最大输入个数");
                return false;
            };
        });
    }
    $('#saveModify').click(function(){
    	var arrValue = new Array();
	    if ($('#textValue').val()==null||$('#textValue').val().length==0) {
	    	dataLoadedError("修改内容不能为空");
	    }else{
    	if (indexID==0) {
	    	     arrValue.push("nickname="+$('#textValue').val());
                 updateUserInfoFunction(arrValue);
	    }else{
                if ($('#textValue').val().length>30) {
                    dataLoadedError("个性签名不能超过30个字符");
	    }else{
                   arrValue.push("motto="+$('#textValue').val()); 
	              updateUserInfoFunction(arrValue);
	    }
            }
	    }
    });
});
//修改资料
function updateUserInfoFunction(arrValue) {
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: 'personal_data_name_edit.html',
        dataType: "json",
        async: true,
        data:{"modifyInfo":arrValue,'index':indexID,"nickname":$('#textValue').val(), "_csrf":csrf},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
            	if (indexID==0) {
            		dataLoadedSuccess("修改昵称成功");
            	}else{
            		dataLoadedSuccess("修改签名成功");
            	}
            	location.href = "personal_data.html";
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}
