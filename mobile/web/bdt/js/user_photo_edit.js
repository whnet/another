// personal_data_photo_edit
var user = null;
var jiaodu=0;

 var $image;
$(document).ready(function() {



	  doInitCropper("#image");
    initOs.setCallBack({
        app: function(){
            $("#picSelectBtn").hide();
            $("#changeImg").unbind().click(function(){
                cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SelectPhotoPlugin", "selectPhoto",[1]);
                cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "selecterImg",[1]);
            });
        }
    });


	$('#changeImg').click(function(e) {
		$('#back').hide();
        $(".cancel-btn").hide();
		$('#closeBtn').show();
	});

	$('#closeBtn').click(function(e) {
		$('.upload-container').css({'visibility':'hidden','z-index':'-1'},500);
		$('#changeImg').hide().next('a').hide();
		$('#changeImg').show();
		$('#back').show();
        $(".cancel-btn").show();
		$('#closeBtn').hide();
		$('#identity_card1').val();
	});

  $('.sure-btn').click(function(e) {
    dataLoading("图像上传中...");
    var result = $image.cropper("getCroppedCanvas",{width: 640, height: 640});
    var imgData =result.toDataURL('image/png');
    var csrf =$('input[name="csrf"]').val();
    var csrf =$('input[name="csrf"]').val();

    // imgData = imgData.replace(/^data:image\/(png|jpeg);base64,/, "");
     //压缩图片
      convertImgToBase64(imgData, function(base64Img){
              $.ajax({
                url:'/members/uploadheader.html',
                data:{
                    content:base64Img,
                    _csrf:csrf
                },
                type:"post",
                dataType:'json',
                success:function(data,status){
                  clearToastDialog();
                if(data.result == "success"){
                    $.ajax({
                        url: '/members/uploader.html',
                        data: {
                            photo:data.img,
                            _csrf: csrf
                        },
                        dataType: 'json',
                        type: "post",
                        success: function (data, status) {
                            if (data.result == 'success') {
                                window.location.href = "/members/personal_data.html";
                            }

                        }
                    });

                }else{
                    dataLoadedError(result.message);
                  }
                },

              });
          //  ajax End
      });

    //$("#a_content").val(imgData);
    //$("#a_fileType").val(fileType);
    //$("#uploadForm").submit();
  });

  $("#closeBtn").click(function(){
    $('.upload-container').css({'visibility':'hidden','z-index':'-1'},500);
		$('#changeImg').next('a').hide();
		$('#changeImg').show();
		$('#back').show();
    $('#closeBtn').hide();
    $('#identity_card1').val();

    var obj = document.getElementById("picSelectBtn");
    obj.outerHTML=obj.outerHTML;
  })

});

// app图片选择调用
function selectImgSuccess(urlStr){
    $image.one('built.cropper', function () {
        $('.upload-container').css({'visibility':'visible','z-index':'1'},500);
        $('#sure-btn').show();
        $('#changeImg').hide();
        clearToastDialog();
    }).cropper('reset', true).cropper('replace', urlStr);
}

function initUserImg(){
    var editPicObj = document.getElementById("editPic");
    editPicObj.src = user.headPic;
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
        //var files = e.target.files || e.dataTransfer.files;
        var file=$("#"+inputFileId).get(0).files[0];
         if (file.type.indexOf("image") == 0) {
                //if (file.size >= 5120000) {
                 //   alert('您这张"'+ file.name +'"图片大小过大，应小于5000k');
                //} else {
                  dataLoading("图像加载中...");
                  //$('.waitLoad').show();
                  var URL = window.URL || window.webkitURL;
                  var blobURL;
                  blobURL = URL.createObjectURL(file);

                    $image.one('built.cropper', function () {
                          URL.revokeObjectURL(blobURL); // Revoke when load complete
                          //$('.waitLoad').hide();
                          //$('.photo-show').fadeIn(500);
                          $('.upload-container').css({'visibility':'visible','z-index':'1'},500);
              						$('#sure-btn').show();
              						$('#changeImg').hide();
                        imgbase();
                          clearToastDialog();
                        }).cropper('reset', true).cropper('replace', blobURL);


                  //$('.photo-show').fadeIn(300);
                  //$('.container').fadeIn(300);
                  //$('.container').css("z-index",100);
               // }
          } else {
                alert('文件"' + file.name + '"不是图片。');
          }

  }
/**

function cardChange(inputFileId){
        //var files = e.target.files || e.dataTransfer.files;
        var file=$("#"+inputFileId).get(0).files[0];
         if (file.type.indexOf("image") == 0) {
                if (file.size >= 5120000) {
                    alert('您这张"'+ file.name +'"图片大小过大，应小于5000k');
                } else {
                    EXIF.getData(file,function(){
                        jiaodu=EXIF.getTag(this,'Orientation');
                        //alert("onchange orientation="+jiaodu);
                    });

                    if (typeof FileReader === 'undefined') {
                        alert('Your browser does not support FileReader...');
                        return false;
                    }
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        console.log("2-:"+this.result.length);
                        getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
                            var blobFile = dataURLtoBlob(data);

                            $('.waitLoad').show();
                            var URL = window.URL || window.webkitURL;
                            var blobURL;
                            blobURL = URL.createObjectURL(blobFile);
                            $image.one('built.cropper', function () {
                                   URL.revokeObjectURL(blobURL); // Revoke when load complete
                                   $('.waitLoad').hide();
                                   //$('.photo-show').fadeIn(500);
                                   $('.upload-container').css({'visibility':'visible','z-index':'1'},500);

                            }).cropper('reset', true).cropper('replace', blobURL);
                        });
                    }
                    reader.readAsDataURL(file);
               }

          } else {
                alert('文件"' + file.name + '"不是图片。');
          }

  }

function getImgData(img,dir,next){
    var image=new Image();
    image.onload=function(){
        var degree=0,drawWidth,drawHeight,width,height;
        drawWidth=this.naturalWidth;
        drawHeight=this.naturalHeight;
        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight);

        var canvas=document.createElement('canvas');
        canvas.width=width=drawWidth;
        canvas.height=height=drawHeight;
        var context=canvas.getContext('2d');
        //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        switch(dir){
           //iphone横屏拍摄，此时home键在左侧
           case 3:
           degree=180;
           drawWidth=-width;
           drawHeight=-height;
           break;
            //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
            canvas.width=height;
            canvas.height=width;
            degree=90;
            drawWidth=width;
            drawHeight=-height;
            break;
            //iphone竖屏拍摄，此时home键在上方
            case 8:
            canvas.width=height;
            canvas.height=width;
            degree=270;
            drawWidth=-width;
            drawHeight=height;
            break;
        }
        //使用canvas旋转校正
        context.rotate(degree*Math.PI/180);
        context.drawImage(this,0,0,drawWidth,drawHeight);
        //返回校正图片
        next(canvas.toDataURL("image/jpeg",0.8),Math.abs(canvas.width),Math.abs(canvas.height));
    }
    image.src=img;
}*/

 function doInitCropper(ids){
  $image = $(ids);
  //image.crossOrigin = "anonymous";

  var options = {
      cropBoxMovable: false,
       // Enable to resize the crop box
       cropBoxResizable: false,
       dragMode: 'move',
       aspectRatio: 43/ 43,
       background: false,
       /**
       movable: false,
       resizable: false,
       dragCrop: false,
       aspectRatio: 1,
       background: false,
       minCropBoxWidth: 215,
       minCropBoxHeight: 215,
       strict: false,
	   autoCropArea: 0.7,*/
        crop: function (e) {

        }
      };

  // Cropper
  $image.cropper(options);
}

// 修改剪裁的图片尺寸大小
function  imgbase(){

    var ImgWidth=$(".cropper-canvas").width();
    var ImgHeight=$(".cropper-canvas").height();
    $(".cropper-crop-box").css({"width":ImgWidth,"height":ImgHeight,"top":"50%","left":"50%","transform":"translate(-50%,-50%)"})
    $(".cropper-view-box>img").css({"margin-top":0,"margin-left":0})

}
