
$(function() {
	$('#messagePicsId').show();

    $("#cancelInput").click(function() {
		friendTips("是否要放弃您当前编辑的内容?","取消","确定");
    });
    
    $("#fileOfVideo").change(function(){
    	fileSelected();
	});

	if (appType!=isApp) {
		if(!isWeiXinBorrower()){
			$('.add-message-pic').append('<input id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;" type="file" accept="image/*;capture=camera" multiple="true" name="filehidden" />');
			$("#filehidden").change(function(){
				// dataLoading("图片加载中");
				var fileLength = $(this).get(0).files.length;
				fileLength = fileLength + $('#messagePicsId').children('figure').length;
				if (fileLength>9) {
					dataLoadedError("很抱歉，最多能上传9张图片");
					return;
				};
				for (var i = 0; i < fileLength; i++) {
					uploadImgFuntion($(this).get(0).files[i]);
				};
			});
		}else{
		wxShareImg();
			$('.add-message-pic').append('<p id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;"></p>');
			$("#filehidden").click(function(){
				wxSelectImgFunction();
			});
		}
	}else{
		$('.add-message-pic').append('<p id="filehidden" style="width: 100%;height: 100%;diplay:block;opacity: 0;"></p>');
		$("#filehidden").click(function(){
			cordova.exec("", "", "SpeechOFFSynthesize", "selecterImg",[appImgLength]);
		});
	}

	//避免重复提交
	var requestCommentFlag=false;
	$("#submitContent").click(function(){
		if(requestCommentFlag){
		  return;
		}else{
		  requestCommentFlag=true;
		}
		
		var commentText = $.trim($('#edit-mark').val()); // 用jQuery的trim方法删除前后空格
		commentText = HTMLEncode(commentText);

		if (!isWeiXinBorrower()) {
			if (commentText == ''&&pics.length==0) {
				dataLoadedError("反馈内容不能为空");
			}else{
				submitContentRequest(commentText,"");
			}
		}else{
			resetWeixinCurrImg(0);
			if (commentText == ''&& wximgStr.length==0) {
				dataLoadedError("反馈内容不能为空");
			}else if(wximgCurrStr.length>0){
				wxuploadImgFunction(0);
			}else{
				var commentText = $.trim($('#edit-mark').val()); // 用jQuery的trim方法删除前后空格
				commentText = HTMLEncode(commentText);
				submitContentRequest(commentText,wxImg);
			}
		}
	});
	
});

function uploadImgFuntion(file){
	// if (file==null||typeof(file) == 'undefined'||typeof(file)=="") {
	// 	dataLoadedError("请重新选择jpeg、png格式的图片文件。");
	// 	return;
	// };
	// var file = $(this).get(0).files[i];
		var imageNameStr = $(this).get(0).value;
	// console.log(file.size);
		var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
		if (!rFilter.test(file.type) && imageNameStr.indexOf("image")<0) {  
            dataLoadedError("请选择jpeg、png格式的图片文件。");
            $("#filehidden").val("");
            return false;  
        }else{
        	
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
			// console.log("2-:"+this.result.length);
			    getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
		    	// console.log("data:"+data.length);
			    	// alert("data---"+data);
			        var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
			            html += 	"<img id=\"img_"+picNextIndex+"\" onClick=\"showPic("+picNextIndex+")\";  src=\""+data+"\" />";
			            html += 	"<a class=\"loading_progress\"></a>";
			            html += 	"<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+");\"><img src=\"../themes/img/img_delete.png\" /></span>";
			            html += "</figure>";
			            
			        $(".add-message-pic").before(html);
		        	clearToastDialog();
			        //移除菊花；
			       $(".loading_progress").fadeOut(1000);

					var img=document.getElementById("img_"+picNextIndex);
			        var tt = srcWidth/srcHight;

			        //var naturalWidth = img.naturalWidth;
			        //var naturalHeight = img.naturalHeight;
			        if(srcWidth>srcHight){
			        	//alert("I'm 1.1--1");
			        	var ww = -3.5*tt/2 + "rem";
			        	$("#img_"+picNextIndex).css({"height":"3.5rem","width":"auto","margin-left":ww,"margin-top":"-1.75rem"});
			        }else{
			        	var hh = -3.5/tt/2 + "rem";
			        	$("#img_"+picNextIndex).css({"width":"3.5rem","height":"auto","margin-left":"-1.75rem","margin-top":hh});
			        	//alert("I'm 1.1--2");
			        }

					pics[picNextIndex]=data;
					var oldIndex = picNextIndex;
			        picLen++;
			        picNextIndex++;
			        if(picLen>=9){
			        	$(".add-message-pic").hide();
			        } 
			    }); 
			}
			reader.readAsDataURL(file);
        }
}

function checkPhoto(filenameStr){
    var type=filenameStr.match(/^(.*)(\.)(.{1,8})$/)[3];
    type=type.toUpperCase();

    if(type!="JPEG"   &&   type!="PNG"   &&   type!="JPG"   &&   type!="GIF"){
        alert("上传图片类型错误");  
        return false;
    } 
    return true;
} 

function saveFunction(){
	// isCancle 0 取消 1发布
	$(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
	/**
    var url = document.referrer;
    if (url!=null&&url.length!=0) {
    	if (url.indexOf("/square.html")>=0) {
    		window.location.href = "/square.html";
    	}else{
       window.location.href = "javascript:history.back(-1)";
    	}
    }else{
       window.location.href = "index.html";
    }*/
    customHistoryUtilsBack();
}

function submitContentRequest(contentStr,wxImg){
	// alert("contentStr="+contentStr);
	// alert("wxImg="+wxImg);
	dataLoading("正在发布中...");
	$.ajax({
		type: "post",
        url: submitFeedbackUrl,
        dataType: "json",
        async: true,
        data: {
        	"title":$("#message_title").val(),
            "pics": pics,
            "textContent": contentStr,
            "weixinPic":wxImg
        },
        success: function(result) {
        	clearToastDialog();
        	requestCommentFlag=false;
            if (result.result == "success") {
            	dataLoadedSuccess("提交成功,即将跳转");
                // window.location.href="found_friends.html";
                setTimeout("window.location.replace('/user_center.html')",2000);
            } else {
            	dataLoadedError(result.message);
            }
        }
    });
}

function deletePic(index){
	if (!isWeiXinBorrower()) {
		// alert('ok');
		$("#figure_"+index).remove();
		pics[index] = null;
		picLen--;
	    if(picLen<9){
	       $(".add-message-pic").show();
	    }
	    if (appType==isApp) {
	    	appImgLength++;
	    };
	}else{
		$("#figure_"+index).remove();
		wximgStr[index] = null;
		picLen--;
	    if(picLen<9){
	       $(".add-message-pic").show();
	    }	
	}
	

}

// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img,dir,next){
	var image=new Image();
	image.onload=function(){
		var degree=0,drawWidth,drawHeight,width,height;
		drawWidth=this.naturalWidth;
		drawHeight=this.naturalHeight;
	    //以下改变一下图片大小
	    var newWidth = 0;
	    var newHeight = 0;

	    if(drawWidth>828){
	    	newWidth = 828;
	    	newHeight = drawHeight/drawWidth * newWidth;
	    }
	    if(newHeight>1472){
	    	newHeight = 1472;
	    	newWidth = drawWidth/drawHeight * newHeight;
	    }

	    if(newWidth<414){
	    	if(drawWidth>414){
	    		newWidth = 414;
	    	}else{
	    		newWidth = drawWidth;
	    	}
	    	newHeight = drawHeight/drawWidth * newWidth;
	    }

	    if(newHeight<500){
	    	if(drawHeight>500){
	    		newHeight = 500;
	    	}else{
	    		newHeight = drawHeight;
	    	}

	    	newWidth = drawWidth/drawHeight * newHeight;
	    }

	    drawWidth = newWidth;
	    drawHeight = newHeight;

/*
	    var maxSide = Math.max(drawWidth, drawHeight);
	    if (maxSide > 750) {
	    	var minSide = Math.min(drawWidth, drawHeight);
	    	minSide = minSide / maxSide * 750;
	    	maxSide = 750;
	    	if (drawWidth > drawHeight) {
	    		drawWidth = maxSide;
	    		drawHeight = minSide;
	    	} else {
	    		drawWidth = minSide;
	    		drawHeight = maxSide;
	    	}
	    }*/
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
		}

function showPic(index){
		$('#gallery').fadeIn();
		$('.page__hd').css("z-index",0);
		$('#gallery').click(function(){ 
			$('.page__hd').css("z-index",2);
			$('#gallery').fadeOut();
		});
		$('.appui-gallery__img img').attr('src',pics[index]);
		if($('.appui-gallery__img img').height() > $('.appui-gallery__img').height()){
			$('.appui-gallery__img img').css({'top':'0','margin-top':'0'});
		}
		else{
			$('.appui-gallery__img img').css({'top':'50%','margin-top':-$('.appui-gallery__img img').height()/2});
		}
}

//发送视频
function fileSelected() {
	var file = $('#fileOfVideo').get(0).files[0];
	var url = URL.createObjectURL(file);
	
	if (file) {
	  var fileSize = 0;
	  if (file.size > 1024 * 1024)
	    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	  else
	    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
	  // document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
	  // document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
	  // document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
	}
	var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
	if (rFilter.test(file.type) && file.type.indexOf("image")>-1) {  
        dataLoadedError("请选择视频文件。");
        $("#filehidden").val("");
        return false;  
    }else{
    	$('.message-video-con').show();
		$("#video").attr("src",url);//更新url
		$('.add-message-video').hide();
		
        //视频截取第一帧
		var video, output;
		var scale = 0.8;
		var initialize = function() {
		    // output = document.getElementById("output");
		    video = document.getElementById("video");
		    // loadeddata 
		    video.addEventListener('loadedmetadata', captureImage);
		};
		captureImage = function() {
			videoLength = parseInt(video.duration);
		    var canvas = document.createElement("canvas");
		    canvas.width = video.videoWidth * scale;
		    canvas.height = video.videoHeight * scale;
		    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		    var img = document.createElement("img");
		    img.src = canvas.toDataURL("image/jpeg");
		    img.width = 400;
		    img.height = 300;
		    
		    posterImg = img.src;
		    // output.appendChild(img);
		    $('.message-video-con>img').attr("src",img.src);
		    // alert(img.src);
		};
		initialize();

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
			videoDataStr = this.result;
		}
		reader.readAsDataURL(file);
    }
}

function playVideo(){

	$('#js-gallery-swiper').fadeOut(1000);
    $('.video_dialog').show();
    // $('#myVideo').attr("src",);
    $('#myVideo').show();
	// var videoWidth = $("#video").get(0).clientWidth;
	// var videoHeight = $("#video").get(0).clientHeight;
	// var scaleVideo = videoWidth/videoHeight;
	// var windowWidth = $(window).width();
	// var windowHeight = $(window).height()*0.6;
	// //判断横竖屏幕
	// if (videoHeight>videoWidth) {
	// 	$('#myVideo').height(windowHeight);
	// 	$('#myVideo').width(scaleVideo*windowHeight);
	// 	$('#myVideo').css({
	// 		"margin-top":-windowHeight/2,
	// 		"margin-left":-scaleVideo*windowHeight/2
	// 	})
	// }else{
	// 	$('#myVideo').width(windowWidth);
	// 	$('#myVideo').height(windowWidth/scaleVideo);
	// 	$('#myVideo').css({
	// 		"margin-top":-windowWidth/scaleVideo/2,
	// 		"margin-left":-windowWidth/2
	// 	})
	// }

    $(".appui-mask").click(function(){
        $("#myVideo").get(0).pause();
        $(".video_dialog").hide();
    })
}

function deleteVideo(){
	$("#myVideo").attr("src","");//更新url
	$('.add-message-video').show();
	$('.message-video-con').hide();
}
function submitVideoMessageFunction(contentStr){
	dataLoading("正在发布中...");
	$.ajax({
		type: "post",
        url: submitVideoMessage,
        dataType: "json",
        async: true,
        data: {
        	"title":$("#message_title").val(),
            "video": videoDataStr,
            "textContent": contentStr,
            "publishLocationId":publishLocationId,
            "publishLocationType":publishLocationType,
            "poster":posterImg,
		    "videoLen":videoLength,
        },
        success: function(result) {
        	clearToastDialog();
        	requestCommentFlag=false;
            if (result.result == "success") {
            	dataLoadedSuccess("发布成功,即将跳转");
                // window.location.href="found_friends.html";
                if (from=="square") {
		    		window.location.href = "/square.html";
		    	// }
		    	// else if (from=="circle") {
		    		// window.location.href = "/circle_page.html?id="+publishLocationId;
		    		// window.location.href = "javascript:history.back(-1)";
		    	}else{
		    		writeClientSession("sendMessageStatus",1);
					window.location.href = "javascript:history.back(-1)";
}

            } else {
            	dataLoadedError(result.message);
}
}
    });

}

function myClose(){
	if (from=="circle") {
		// alert(1);
		writeClientSession("circleRefresh",1);
	};
}

//微信选取图片接口
function wxShareImg() {
	dataLoading("正加载中...");
    $.ajax({
        type: "post",
        url: getWxShareDataUrl,
        dataType: "json",
        async: true,
        data: {
            "url": wxShareUrl
        },
        success: function(result) {
            if (result.result == "success") {
                wx.config({
                    debug: false,
                    appId: result.data.appId,
                    timestamp: result.data.timestamp,
                    nonceStr: result.data.nonceStr,
                    signature: result.data.signature,
                    jsApiList: ['checkJsApi','chooseImage','previewImage','uploadImage','downloadImage','getLocalImgData'],
                });
                wx.ready(function() {
                	clearToastDialog();
                    wx.checkJsApi({
                        jsApiList: ['chooseImage','previewImage','uploadImage','downloadImage'],
                        // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success: function(res) {
                        	//alert("weixinApi ready");
                        }
                    });

                });
            } else {
            }
        }
    });
}

//微信选取图片问题
function wxSelectImgFunction(){
    wx.chooseImage({
	    count: 9-picLen, // 默认9
	    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	    success: function (res) {
	        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	        for (var i = 0; i < localIds.length; i++) {
	        	wximgStr[wximgCount]= localIds[i];
	        	getImgDataFunction(localIds[i]);
	        	wximgCount++;
	        };
	    },  
        fail: function(res) {
          dataLoadedError(res.errMsg);
	    }
	});
}

//微信预览图片问题
function wxPreviewImgFunction(i){
	wx.previewImage({
	    current: wximgCurrStr[i], // 当前显示图片的http链接
	    urls: wximgCurrStr, // 需要预览的图片http链接列表
    });
}

//微信上传图片问题
function wxuploadImgFunction(index){
	//解决IOS无法上传的坑
	//alert("1.wximgCurrStr["+index+"]="+wximgCurrStr[index]);
	if (isAndroid==false && wximgCurrStr[index].indexOf("wxlocalresource") != -1){
        wximgCurrStr[index] = wximgCurrStr[index].replace("wxlocalresource", "wxLocalResource");
        //alert("2.wximgCurrStr["+index+"]="+wximgCurrStr[index]);
    }
	wx.uploadImage({
	    localId: wximgCurrStr[index], // 需要上传的图片的本地ID，由chooseImage接口获得
	    isShowProgressTips: 1, // 默认为1，显示进度提示
	    success: function (res) {
	        var serverId = res.serverId; // 返回图片的服务器端ID
	        if(wxImg == ""){
	        	wxImg = serverId;
	        }else{
	        	wxImg = wxImg + "," + serverId;
	        }
			index++;
			if (index<picLen) {
				wxuploadImgFunction(index);
			}else{
				var commentText = $.trim($('#edit-mark').val()); // 用jQuery的trim方法删除前后空格
				commentText = HTMLEncode(commentText);
				submitContentRequest(commentText,wxImg);
			}
        },  
        fail: function(res) {
          dataLoadedError(res.errMsg);
        }
    });
}

// 获取本地图片接口
function getImgDataFunction(imgId){
	if (isAndroid==true) {
		configImgUI(imgId);
	}else{
	wx.getLocalImgData({
	    localId: imgId, // 图片的localID
	    success: function (res) {
	        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
	        configImgUI(localData);
		    },  
	        fail: function(res) {
	          dataLoadedError(res.errMsg);
	    }
	});
}
}

//配置微信图片的div
function configImgUI(localData){
    var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
        html += 	"<img id=\"img_"+picNextIndex+"\" onClick=\"pic_show("+picNextIndex+")\";  src=\""+localData+"\" />";
        html += 	"<a class=\"loading_progress\"></a>";
        html += 	"<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+");\"><img src=\"../themes/img/img_delete.png\" /></span>";
        html += "</figure>";

    $(".add-message-pic").before(html);
    // clearToastDialog();
    //移除菊花；
    $(".loading_progress").fadeOut(1000);

 //    var img=document.getElementById("img_"+picNextIndex);
	// var tt = srcWidth/srcHight;

	// //var naturalWidth = img.naturalWidth;
	// //var naturalHeight = img.naturalHeight;
	// if(srcWidth>srcHight){
	// 	//alert("I'm 1.1--1");
	// 	var ww = -3.5*tt/2 + "rem";
	// 	$("#img_"+picNextIndex).css({"height":"3.5rem","width":"auto","margin-left":ww,"margin-top":"-1.75rem"});
	// }else{
 //    	var hh = -3.5/tt/2 + "rem";
 //    	$("#img_"+picNextIndex).css({"width":"3.5rem","height":"auto","margin-left":"-1.75rem","margin-top":hh});
 //    	//alert("I'm 1.1--2");
 //    }
    
	// pics[picNextIndex]=data;
	var oldIndex = picNextIndex;
    picLen++;
    picNextIndex++;
    if(picLen>=9){
    	$(".add-message-pic").hide();
    } 
}

//微信浏览图片
function pic_show(picIndex){
	var picShowIndex = resetWeixinCurrImg(picIndex);
	wxPreviewImgFunction(picShowIndex);
}

function resetWeixinCurrImg(picIndex){
	var currIndex =0;
	var picShowIndex = 0;
	wximgCurrStr = new Array();

	// wximgCurrStr = ;
	for(var i=0;i<picNextIndex;i++){
		if(wximgStr[i]==null){
		}else{
			wximgCurrStr[currIndex] = wximgStr[i];
			if(i==picIndex){
				picShowIndex = currIndex;
			}
			currIndex++;
		}
	}
	return picShowIndex;
}


//app选完图回调
function selectImgSuccess(imgStr){
	// dataLoading("图片加载中");
    // var imgArr= new Array(); //定义一数组 
    // imgArr = imgStr.split("###");
    // // alert(imgArr.length);
    // for (var i = 0; i < imgArr.length; i++) {
    //      // alert("success"+i+"= "+imgArr[i]);
    //      uploadAppImgFuntion(imgArr[i]);
    // };
    uploadAppImgFuntion(imgStr);
};
function uploadAppImgFuntion(fileData){
	// alert(fileData);
	// fileData = 'data:image/jpeg;base64,'+fileData;
    var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
        html += 	"<img id=\"img_"+picNextIndex+"\" onClick=\"showPic("+picNextIndex+")\";  src=\""+fileData+"\" />";
        html += 	"<a class=\"loading_progress\"></a>";
        html += 	"<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+");\"><img src=\"../themes/img/img_delete.png\" /></span>";
        html += "</figure>";
        
    $(".add-message-pic").before(html);
	// clearToastDialog();
    //移除菊花；
   $(".loading_progress").fadeOut(1000);

	pics[picNextIndex]=fileData;
	var oldIndex = picNextIndex;
	picLen++;
	picNextIndex++;
	appImgLength--;
	if(picLen>=9){
		$(".add-message-pic").hide();
	} 

}
