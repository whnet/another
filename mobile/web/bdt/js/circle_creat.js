
//付费类型 0免费,1年付,2永久
var feeType = 0;
//加入圈子支付的费用
var joinPrice=0;
//图片
var pics = $('input[name="pics"]').val();

var maxInputLength = 150;

var from = "";

var user = null;
var $image;
$(document).ready(function() {
    loadEvent();

});
function loadEvent(){


	$('.circle-photo-edit').click(function(e) {
        chooseImage();
	});

	$('#payType>a').each(function(index, element) {
		$(this).click(function(e) {
			$('#payType>a').removeClass('on');
			$(this).addClass('on');
			$('#amountInput>li').hide();
			$('#amountInput'+index).show();
		});
	});

	$('.amount').each(function(index, element) {
		$(this).bind('input propertychange', function() {
	    	if($(this).val() != '' || $(this).val().length != 0){
				$(this).addClass('on');
			}
			else{
				$(this).removeClass('on');
			}

		});
	});
	//免费按钮
	$('#freeId').click(function(e) {
        $('#circleContainer2').hide();
		$('#circleContainer1').show().animate({'left':'0'},'300');
		feeType = 0;
	});
	//收费按钮
	$('#payId').click(function(e) {
        $('#circleContainer1').hide();
        $('#circleContainer2').show().animate({'left':'0'},'300');
		feeType = 1;
	});

	//按年付
	$('#yearId').click(function(e){
		feeType = 1;

	});
	//永久有效
	$("#everId").click(function(e){
		feeType = 2;
	});


	$('#closeFreebtn').click(function(e){
		//如果是收费则显示收费界面
		$('#circleContainer1').animate({'left':'120%'},'300');

	});

	$('#chargeNext').click(function(e){

		var reg = /^[1-9]\d*$/;//正整数
		var amount = 0;
		if(feeType==1){
			amount = $('#amount0').val();
		}else if(feeType==2){
			amount = $('#amount1').val();
		}

		if (!reg.test(amount)||amount<10||amount>2000) {
			dataLoadedError("请输入一个10-2000的正整数！");
    	}else{
    		$('#circleContainer1').show().animate({'left':'0'},'300');
    	}
	});
	//后退收费按钮
	$('#closeChargebtn').click(function(e){
		$('#circleContainer2').animate({'left':'120%'},'300');
	});

	$('#creatFinish').click(function(e){
		createQzRequestFuntion();
	});

	$("#circleLogo").change(function(){
		uploadImgFuntion($(this).get(0).files[0]);
	});

	$("#upload-back").click(function(){
        $("#circleContainer1").css('display','block');
        $("#circleContainer2").css('display','block');
        $(".toview").css('display','block');

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
                    dataLoading("图像加载中...");
                    wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 0, // 默认为1，显示进度提示
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
            type: "POST", //用POST方式传输
            dataType: "JSON", //数据格式:JSON
            data:{
                serverId:serverId,
                _csrf:csrf
            },
            async : false,
            url: '/members/downlodimg.html', //目标地址 Download
            success:function(msg){
                clearToastDialog();
                $("#circleContainer1").css('display','block');
                $("#circleContainer2").css('display','block');
                $(".toview").css('display','none');
                $('.upload-container').css({'visibility':'hidden','z-index':'9'},500);
                $('#circleLogoImg').attr("src",msg.url+msg.filename);
                $('input[name="pics"]').val(msg.filename);

            }
        })
    }
    //微信上传接口

    $('.sure-btn').click(function(e) {
        var result = $image.cropper("getCroppedCanvas",{width: 640, height: 640});
        var imgData = result.toDataURL('image/png');
        var csrf = $('input[name="csrf"]').val();
        //压缩图片

        convertImgToBase64(imgData, function(base64Img){
		   //ajax start
			$.ajax({
				url:'/circle/upload.html',
				data:{file:base64Img,  _csrf:csrf},
				type:"post",
				dataType:'json',
				success:function(data,status){
					clearToastDialog();
					if(data.result == "success"){

						$("#circleContainer1").css('display','block');
						$("#circleContainer2").css('display','block');
						$(".toview").css('display','none');
						$('.upload-container').css({'visibility':'hidden','z-index':'9'},500);
						$('#circleLogoImg').attr("src",publicImg+data.img);
						$('input[name="pics"]').val(data.img);

					}else{
						dataLoadedError(result.message);
					}
				},

			});
			//ajax end
        });

    });

	monitorCount();

    initOs.setCallBack({
        app: function(){
            $("#picSelectBtn").remove();
            $("#changeImg").click(function(){
                cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SelectPhotoPlugin", "selectPhoto",[1]);
                cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "selecterImg",[1]);
            });

            $('#closeBtn').click(function(e) {
                $('.upload-container').css({'visibility':'hidden','z-index':'-1'},500);
                $('#changeImg').hide().next('a').hide();
                $('#changeImg').show();
                $('#upload-back').show();
                $('#closeBtn').hide();
                $('#identity_card1').val();
                $('#picSelectBtn').remove();
            });
        },
		h5: function(){
            $('#closeBtn').click(function(e) {
                $('.upload-container').css({'visibility':'hidden','z-index':'-1'},500);
                $('#changeImg').hide().next('a').hide();
                $('#changeImg').show();
                $('#upload-back').show();
                $('#closeBtn').hide();
                $('#identity_card1').val();
                $('#picSelectBtn').remove();
                $('#changeImg').append('<input id="picSelectBtn" class="filehidden" accept="image/*" type="file" name="picSelectBtn" onchange="cardChange(\'picSelectBtn\');">');
            });
        }
    });
}

function selectImgSuccess(urlStr){
    $image.one('built.cropper', function () {
        $('.upload-container').css({'visibility':'visible','z-index':'9'},500);
        $('.toview').css('z-index','999');
        $('#sure-btn').show();
        $('#changeImg').hide();
        $('#upload-back').hide();
        $('#closeBtn').show();
        clearToastDialog();
    }).cropper('reset', true).cropper('replace', urlStr);
    $('#upload-back').hide();
}

function monitorCount(){
    $('#textarea').bind('propertychange input', function () {
        var counter = $('#textarea').val().length;
        $('#length').text(counter);   //每次减去字符长度
        if (counter>maxInputLength) {
             $('#length').text(maxInputLength);
             this.value = this.value.substring(0, 150);
             if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
             }
             return false;
        };
    });
}

function createQzRequestFuntion(){
    var pics = $('input[name="pics"]').val();
	if(feeType==0){
		joinPrice = 0;
	}else if(feeType==1){
		joinPrice = $("#amount0").val();
	}else if(feeType==2){
		joinPrice = $("#amount1").val();
	}
	var name = $('#circleName').val();
	var summary = $('#textarea').val();
    if(pics == ''){
        dataLoadedError("圈子头像不能为空");
        return;
    }else if(name==""){
		dataLoadedError("圈子名称不能为空");
		$('#circleName').focus();
		return;
	}else if (name.length>15) {
		dataLoadedError("圈子名称应该在十五字以内");
		return;
	}else if(summary == ""){
        dataLoadedError("圈子简介必填");
        return;
	}
    var csrf = $('input[name="csrf"]').val();
	// dataLoading("数据加载中...");
	$.ajax({
		url: '/circle/circle_creat.html',
		type: 'post',
		dataType: 'json',
		data:{
			"name":name,
			"summary":summary,
			"logo":$('input[name="pics"]').val(),
			"feeType":feeType,
			"joinPrice":joinPrice,
			"status":0,
			"notes":"",
			"_csrf":csrf
		},
		success: function(result){
			clearToastDialog();
			if (result.result == "success") {
                alert("圈子需要1个工作日审核...");
                setTimeout(function(){ window.location.replace("circle_my.html"); }, 1000);
			}else{
				dataLoadedError(result.message);
			}
		}
	});

}





function myClose(){

}
function cardChange(inputFileId){
    var file=$("#"+inputFileId).get(0).files[0];
	var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
	if (file.type.indexOf("image") == 0) {
		dataLoading("图像加载中...");
		var URL = window.URL || window.webkitURL;
		var blobURL;
		blobURL = URL.createObjectURL(file);

		$image.one('built.cropper', function () {
			URL.revokeObjectURL(blobURL); // Revoke when load complete
			$('.upload-container').css({'visibility':'visible','z-index':'9'},500);
            $('.toview').css('z-index','999');
			$('#sure-btn').show();
			$('#changeImg').hide();
			clearToastDialog();
		}).cropper('reset', true).cropper('replace', blobURL);
		$('#upload-back').hide();
		$('#closeBtn').show();
	}else{
		alert('文件"' + file.name + '"不是图片。');
	}
}

function doInitCropper(ids){
    $image = $(ids);
    var options = {
        restore : false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        dragMode: 'move',
        aspectRatio: 43/ 43,
        background: false,
        crop: function (e) {
        }
    };
    $image.cropper(options);
}