// qanda_questions.js
var indexID = 0;
var targetId = "";

var userTest = null;
var from = "";

//上传图片
var picNextIndex = 0;
var picLen = 0;
var pics = new Array();
var maxInputLength=140;
var currSelectUserId = 0;
var currContent="";

//圈子的id
var publishLocationId = "";
//app需要用到的参数
var appType = "";
var targertQuestionId = "";
var appVersions = "";
$(document).ready(function() {
    $("#back").click(function() {
        window.location.href = "javascript:history.back(-1)";
    });
    monitorCount();

    $("#askBtn").click(function(){
        var askQuestionStr = $('#textarea').val();
        if (askQuestionStr.length==0||askQuestionStr==null) {
            dataLoadedError("提问内容不能为空");
        }else{
            askQuestionRequest(askQuestionStr,1);
        }
    });
});
function monitorCount(index){
	$('#textarea').bind('propertychange input', function () {  
          var counter = $('#textarea').val().length;
          $('#length').text(counter);   //每次减去字符长度
          if (counter>maxInputLength) {
             $('#length').text(maxInputLength);
			 this.value = this.value.substring(0, 30);
             if ($('.toastDialog').length<=0) {
                 layui.use(['layer', 'form'], function(){
                     layer.msg('超过最大字符', {
                         time: 1000
                     });
                 });
             }
             return false;
          };
  	});
}

function autoLogin(){

}

function getMasterInfoRequest() {
    dataLoading("数据加载中...");
     //dataLoadedError("数据错误");
    $.ajax({
        type: "post",
        url: getMasterInfo,
        dataType: "json",
        async: true,
        data:{"targetId":targetId},
        success: function(result) {
             clearToastDialog();
            if (result.result == "success") {  
               configUserDataUI(result.data.master);
            } else {
                alert(result.message);
            }
        }
    });
}
//
function askQuestionRequest(content,openStatus) {
    dataLoading("数据加载中...");
    var csrf = $('input[name="csrf"]').val();
    if(pics[0] == null){
        pics = '';
    }
    $.ajax({
        type: "post",
        url: '/questions/ask.html',
        dataType: "json",
        async: true,
        //data:{"targetId":"id","content":"","type":"1-直接问答，2-众筹问答","openStatus":"0-不参加，1-参加"}
        data:{
            "targetId":targetId,
            "content":content,
            "type":1,
            "openStatus":1,
            "pics": pics,
            "expert_id": request('mid'),
            "openstatus": 1,
            "price": 0,
            "trade": 0,
            'from':request('from'),
            'circle_id':request('circle_id'),
            'publishtype':request('publishtype'),
            "publishLocationId":publishLocationId,
            "publishLocationType":2,
            '_csrf':csrf,
        },
        success: function(result) {
             clearToastDialog();
            if (result.result == "success") {
			         var id = result.data.id;
						   window.location.replace("/questions/qanda_detail.html?id="+id+"&from=circle");
            }else{
                dataLoadedError(result.message);
            }     
        }
    });
}

function onBridgeReady1(id){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
         {
            "appId":payParam.appid,
            "timeStamp":payParam.timeStamp,
            "nonceStr":payParam.nonceStr,
            "package":payParam.packageValue,
            "signType":payParam.signType,
            "paySign":payParam.paySign
        },
        function(res){  
            // alert(res.err_msg);
            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                // window.location.href=okUrl;
               dataLoadedSuccess("问题提问成功");
               // var id = result.data.qa.id;
               setTimeout(gotoDetail(id), 1500);
            }
            else{
                //window.location.href=errUrl;
                if (res.err_msg=="get_brand_wcpay_request:cancel") {
                  dataLoadedError("取消支付");
                }else if (res.err_msg=="get_brand_wcpay_request:fail") {
                  dataLoadedError("支付失败");
                };
                
            }
        }
    ); 
}

function gotoDetail(id){
      // window.location.href = "qanda_detail.html?id="+id+"&typeId=3";
      window.location.replace("/circle_qanda_detail.html?id="+id);
}

function configQuestionList(groups) {
	$('.qnada-q-list').show();
	for (var i = 0; i < groups.length; i++) {
    $('.qnada-q-list').append(commonQaListFunction(groups[i],0));
	};
  // 判断拼命加载中...按钮是否出现
    if($('#downloadMoreData').length>0){
          $('#downloadMoreData').remove();
    }
   if (groups.length==0) {
         $('.qanda-questions').append('<a class="appui_loadmore bc-grey fs32 fc-greyabc">暂无更多动态</a>');
   }else if (totalPage != currentPage&&groups.length!=0) {
        if (flag=-1) {
            flag = 0;
        };
        $('.qnada-q-list').append('<a onclick="downloadMoreData();" id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
   }
}


function configUserDataUI(user){ 
  // var levelStr = "";
  // var wxShareSummary = "";
  // var wxFriendShareStr = "";
  // var wxSharePicUrl = insertImgType(user.headPic,3);
  // // var userTest = getSessionUserNoRedirect();
  // if (userTest!=null) {
  //     if (userTest!=null&&targetId==userTest.id) {
  //       wxShareSummary = user.nickname+"是律乎的知名行家，专注"+user.lable+"，已经回答了"+user.totAnswers+"个问题，获得"+user.totFans+"个人关注，有房产相关问题来向我提问吧！";
  //       wxFriendShareStr = user.nickname+"是律乎的知名行家，大家快来向他提问吧！";
  //       wxShare("",wxShareSummary,wxFriendShareStr,"",wxSharePicUrl,defaultWeixinSharePicUrl);
  //     }else{
  //       // 李华军向您强烈推荐律乎知名行家“胡士洲”，他专注投资、政策，已经回答了13个问题，获得20个人关注，有房产相关问题赶紧向他提问吧！
  //       wxShareSummary = userTest.nickname+"向您强烈推荐律乎知名行家"+user.nickname+"，他专注"+user.lable+"，已经回答了"+user.totAnswers+"个问题，获得"+user.totFans+"个人关注，有房产相关问题赶紧向他提问吧！"
  //       wxFriendShareStr = userTest.nickname+"向您强烈推荐律乎知名行家"+user.nickname+"，赶紧向他提房产相关问题吧！";
  //       wxShare("",wxShareSummary,wxFriendShareStr,"",wxSharePicUrl,wxSharePicUrl);
  //     }
  // }else{
  //     wxShareSummary = "向您强烈推荐律乎知名行家"+user.nickname+"，他专注"+user.lable+"，已经回答了"+user.totAnswers+"个问题，获得"+user.totFans+"个人关注，有房产相关问题赶紧向他提问吧！"
  //     wxFriendShareStr = "向您强烈推荐律乎知名行家"+user.nickname+"，赶紧向他提房产相关问题吧！";
  //     wxShare("",wxShareSummary,wxFriendShareStr,"",defaultWeixinSharePicUrl,defaultWeixinSharePicUrl);
  // }
	// $('#nickname').text(user.nickname);
	// if (user.masterLvl>1) {
	// 	levelStr = userLevelStr(user.masterLvl,user.loupanId);
	// };
  // var focusStausStr = "";
  // if (userTest.id!=user.id) {
  //     focusStausStr = '<a id="facusStaus" class="bc-grey fc-orange fs24 ml10">+关注</a>';
  // };
	// var userStr = '<div class="qnada-q-author">'+
	//                             '<div class="qnada-q-author-photo" onclick="gotoUser_pageHtml('+user.id+')">'+
	//                                 '<i><img src="'+insertImgType(user.headPic,3)+'" /></i>'+
	//                                 levelStr+
	//                             '</div>'+
	//                             '<div class="qnada-q-author-info">'+
	//                                 '<span class="fs32 fc-navy" onclick="gotoUser_pageHtml('+user.id+')">'+user.nickname+'</span>'+
	//                                 '<span class="fs24 fc-black"><i class="mr5 fs28">'+user.totFans+'</i>关注</span>'+
	//                                 //'<a id="facusStaus" class="bc-orange bc-grey fs24">+关注</a>'+
	//                                 focusStausStr+
	//                             '</div>'+
	//                     '</div>';
  //
	//
	// if (user.masterInfo.length>0&&user.masterInfo!=null) {
	// 	var masterInfoStr ='<div class="qnada-q-author-sign">'+
	// 	                            '<p class="fs28">'+user.masterInfo+'</p>'+
	// 	                   '</div>';
	// 	userStr += masterInfoStr;
	// };
	// if (user.lable.length>0&&user.lable!=null) {
	// 	var lableStr = "";
  //       var lableArr = user.lable.split(',');
  //       for (var i = 0; i < lableArr.length; i++) {
  //           // id="labelSelect'+id+'"
  //           lableStr +=  '<span class="bc-grey mr5">'+lableArr[i]+'</span>';
  //       };
	//     lableStr =  '<div class="qnada-q-author-label mt10 fs24 fc-greyabc">'+lableStr+'</div>';
	//     userStr += lableStr;
	// };
	// var userStr = '<div class="qnada-q-author-data bg-white">'+userStr+'</div>';
  //   $('.qanda-questions').before(userStr);
  //   $('#questions').show();
  //   var earningsPrice =  "公开提问，非免费期间，答案每被收听1次，你从中分成￥"+(user.touListenFeeShareRate*user.touListenPrice).toFixed(2);
  //   $('.qnada-q-data-limit p').text(earningsPrice);
  //   var askPrice = '￥'+user.askPrice;
  //   $('#askPrice').text(askPrice);
  //   //0未关注,1已关注,2好友
  //   if (user.relationStatus!=0) {
  //       $('#facusStaus').text("已关注");
  //       $('#facusStaus').removeClass("fc-orange").addClass("fc-greyabc");
  //   }else{
	//     $("#facusStaus").click(function(){
	//       requestDoFocus(targetId);
	//     });
  //   }
  //
  //
  // if (userTest==null) {
  //   $('#askBtn').text("登录提问");
  //   $('#askPrice').hide();
  //   $("#textarea").attr("disabled","disabled");
  //   $('.qnada-q-data-input').click(function(){
  //       autoLogin();
  //   });
  // };
}

//加关注
function requestDoFocus(userID) {
  userTest = getSessionUser();
  //dataLoading("加关注网络请求中...");
    $.ajax({
        type: "post",
        url: doFocus,
        dataType: "json",
        async: true,
        data:{"targetId":targetId}, 
        success: function(result) {
            if (result.result == "success") {
              dataLoadedSuccess("关注成功");
              $('#facusStaus').text("已关注");
              $('#facusStaus').removeClass("fc-orange").addClass("fc-greyabc");
              $('#facusStaus').unbind();
            } else {
              dataLoadedError(result.message);
            }
        }
    });
}

// $(function() {
//   // 上传图片
// $("#filehidden").change(function(){
//     var file = $(this).get(0).files[0];
//     var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
//     if (!rFilter.test(file.type)) {
//             dataLoadedError("请选择jpeg、png格式的图片文件。");
//             $("#filehidden").val("");
//             return false;
//         }else if(file.size>=5242880){
//       dataLoadedError("图片尺寸太大，请选择小于5M的图片文件。");
//             $("#filehidden").val("");
//             return false;
//         }else{
//
//           EXIF.getData(file,function(){
//         jiaodu=EXIF.getTag(this,'Orientation');
//         //alert("onchange orientation="+jiaodu);
//       });
//
//
//       if (typeof FileReader === 'undefined') {
//         alert('Your browser does not support FileReader...');
//         return false;
//       }
//       var reader = new FileReader();
//       reader.onload = function(e) {
//           getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
//               var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
//                   html +=   "<img id=\"img_"+picNextIndex+"\" onClick=\"showPic("+picNextIndex+")\";  src=\""+data+"\" style=\"width: 3.5rem; height: auto; margin-left: -1.75rem; margin-top: -2.33333rem;\"/>";
//                   html +=   "<a class=\"loading_progress\" style=\"display:none;\"></a>";
//                   html +=   "<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+");\"><img src=\"images/img_delete.png\" /></span>";
//                   html += "</figure>";
//
//               $(".add-qanda-pic").before(html);
//               //移除菊花；
//              $(".loading_progress").fadeOut(1000);
//
//           var img=document.getElementById("img_"+picNextIndex);
//               var tt = srcWidth/srcHight;
//               if(srcWidth>srcHight){
//                 //alert("I'm 1.1--1");
//                 var ww = -3.5*tt/2 + "rem";
//                 $("#img_"+picNextIndex).css({"height":"3.5rem","width":"auto","margin-left":ww,"margin-top":"-1.75rem"});
//               }else{
//                 var hh = -3.5/tt/2 + "rem";
//                 $("#img_"+picNextIndex).css({"width":"3.5rem","height":"auto","margin-left":"-1.75rem","margin-top":hh});
//               }
//
//           pics[picNextIndex]=data;
//           var oldIndex = picNextIndex;
//               picLen++;
//               picNextIndex++;
//               if(picLen>=3){
//                 $(".add-qanda-pic").hide();
//               }
//           });
//       }
//       reader.readAsDataURL(file);
//
//
//         }
//     });
// })
function getImgData(img,dir,next){
  var image=new Image();
  image.onload=function(){
    var degree=0,drawWidth,drawHeight,width,height;
    drawWidth=this.naturalWidth;
    drawHeight=this.naturalHeight;
      //以下改变一下图片大小
      var maxSide = Math.max(drawWidth, drawHeight);
      /**if (maxSide > 1024) {
        var minSide = Math.min(drawWidth, drawHeight);
        minSide = minSide / maxSide * 1024;
        maxSide = 1024;
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


function deletePic(index){
  //alert('ok');
  $("#figure_"+index).remove();
  pics[index] = null;
  picLen--;
    if(picLen<9){
       $(".add-qanda-pic").show();
    } 
}
function myClose(){
    if (from=="circle") {
        writeClientSession("circleRefresh",1);
    };
}
//app支付后回调函数
function payCallBackFunction(status){
    // 0成功 -1失败 -2取消
    if (status==0) {
         dataLoadedSuccess("问题提问成功");
         // var id = result.data.qa.id;
         setTimeout(gotoDetail(targertQuestionId), 1500);
    }else if (status==-1) {

    }else if (status==-2) {
    }
}

