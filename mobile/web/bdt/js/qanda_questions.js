var indexID = 0;
var targetId = "";
var currentPage = 1;
var totalPage = "";

var userTest = null;
var from = "";

//上传图片
var picNextIndex = 0;
var picLen = 0;
var pics = new Array();
var maxInputLength=140;
var currSelectUserId = 0;
var currContent="";

var page = 1;
var flag = 0;

var appType = "";
var targertQuestionId = "";
var publishLocationType = "";
var publishLocationId = "";
var questionid = "";

$(document).ready(function() {
    $("#back").click(function() {
        window.location.href = "javascript:history.back(-1)";
    });
    $("#askBtn").click(function(){
        var askQuestionStr = $('#textarea').val();
        if (askQuestionStr.length==0||askQuestionStr==null) {
            dataLoadedError("提问内容不能为空");
        }else{
            if ($('.qnada-q-data-limit span').attr("class").indexOf("appui_cell__switch-on")>0) {
                askQuestionRequest(askQuestionStr,1);
            }else{
                askQuestionRequest(askQuestionStr,0);
            }
        }
    });
    $('#textarea').bind('propertychange input', function () {
        var counter = $('#textarea').val().length;
        $('#length').text(counter);   //每次减去字符长度
        if (counter>maxInputLength) {
            $('#length').text(maxInputLength);
            this.value = this.value.substring(0, 30);
            if ($('.toastDialog').length<=0) {
                dataLoadedError("您已经超过最大输入个数");
            }
            return false;
        };
    });
    $('.page__bd').scroll(function(){
        if (flag==0) {
            var a = "";
            if ($('#downloadMoreData').length>0) {
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                // alert("div在可视范围");
                    flag = -1;
                    downloadMoreData();
                } 
            }
        };
    });
    //判断是否向自己提问
    isMyself();

});
function isMyself(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/questions/myself.html',
        dataType: "json",
        async: true,
        data:{
            "mid":request('id'),
            '_csrf':csrf,
        },
        success: function(data) {
            if(data.result == 'success'){
                // $(".qnada-q-data-askbtn").removeAttr("id");
                $(".qnada-q-data-askbtn").remove();
                $(".qnada-q-data-price").after('<a class="qnada-q-data-askbtn bg-greyabc fc-white fs30">向Ta提问</a>');
                $(".qnada-q-data-askbtn").text("禁止提问");
            }
        }
    });
}
function monitorCount(index){
	$('#textarea').bind('propertychange input', function () {  
          var counter = $('#textarea').val().length;
          $('#length').text(counter);   //每次减去字符长度
          if (counter>maxInputLength) {
             $('#length').text(maxInputLength);
			 this.value = this.value.substring(0, 30);
             if ($('.toastDialog').length<=0) {
                 dataLoadedError("您已经超过最大输入个数");
             }
             return false;
          };
  	});
}




/*
提交问题问题
 */
function askQuestionRequest(content,openStatus) {
    var price = $('#askPrice').attr('price');
    if(price != 0){
      //发起微信支付，
        $.ajax({
            type: "post",
            url: '/circle/wxpay.html',
            dataType: "json",
            async: true,
            data:{
                "title":'ask',
                "pay_id":request('id'),
                "price":price,
                '_csrf':$('input[name="csrf"]').val(),
            },
            success: function(data) {
                if(data.result == 'success'){
                  getWxConfig(data.config.timestamp, data.config.nonceStr, data.config.package, data.config.signType, data.config.paySign,content,openStatus,data.trade);
                }
            }
        });
    }else{
        askExpert(content,openStatus,0);

    }


}

//向专家提问
function askExpert(content,openStatus,trade){
    var price = $('#askPrice').attr('price');
    if(pics == ''){
        pics = 0;
    }
    $.ajax({
        type: "post",
        url: '/questions/ask.html',
        dataType: "json",
        async: true,
        data:{
            'expert_id':request('id'),
            'content':content,
            'openstatus':openStatus,
            'price':price,
            'pics':pics,
            'trade':trade,
            'from':request('from'),
            'publishtype':request('publishtype'),
            '_csrf':$('input[name="csrf"]').val(),
        },
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
                 questionid = result.data.id;
                //跳转
                $('.j_log').show();
                // window.location.replace("/members/myhomepage.html?read=1");
            }else{
                dataLoadedError(result.message);
            }
        }
    });
}

function getWxConfig(timestamp, nonceStr, package, signType, paySign,content,openStatus,trade){
    // 支付成功回调后，向专家提问
    wx.chooseWXPay({
        timestamp: timestamp,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        paySign: paySign,
        success: function (res) {
            dataLoading("向专家提问中...");
            askExpert(content,openStatus,trade);
        }
    });
}

function gotoDetail(id){
      customHistoryUtilsPop();
      window.location.replace("qanda_detail.html?id="+id+"&typeId=3");
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




//
// // 上传图片
// $(function() {
// $("#filehidden").change(function(){
// 	//隐藏input，禁止重复点击
// 	$("#filehidden").hide();
//     var file = $(this).get(0).files[0];
//     var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
//     if (!rFilter.test(file.type)) {
//             dataLoadedError("请选择jpeg、png格式的图片文件。");
//             $("#filehidden").val("");
//             return false;
//         }else if(file.size>=5242880){
//              dataLoadedError("图片尺寸太大，请选择小于5M的图片文件。");
//             $("#filehidden").val("");
//             return false;
//         }else{
//           EXIF.getData(file,function(){
//           jiaodu=EXIF.getTag(this,'Orientation');
//       });
//
//
//       if (typeof FileReader === 'undefined') {
//         alert('Your browser does not support FileReader...');
//         return false;
//       }
//
//       //图片处理
//       var reader = new FileReader();
//       reader.onload = function(e) {
//               //调用方法，纠正角度等问题
//               getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
//                   var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
//                       html +=   "<img id=\"img_"+picNextIndex+"\" onClick=\"showPic("+picNextIndex+")\";  src=\""+data+"\" style=\"width: 3.5rem; height: auto; margin-left: -1.75rem; margin-top: -2.33333rem;\"/>";
//                       html +=   "<a class=\"loading_progress\" style=\"display:none;\"></a>";
//                       html +=   "<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+");\"><img src=\"../bdt/images/img_delete.png\" /></span>";
//                       html += "</figure>";
//
//                   $(".add-qanda-pic").before(html);
//                  $(".loading_progress").fadeOut(1000);
//                  //重新显示
//                  $("#filehidden").show();
//
//               var img=document.getElementById("img_"+picNextIndex);
//                   var tt = srcWidth/srcHight;
//                   //var naturalWidth = img.naturalWidth;
//                   //var naturalHeight = img.naturalHeight;
//                   if(srcWidth>srcHight){
//                     var ww = -3.5*tt/2 + "rem";
//                     $("#img_"+picNextIndex).css({"height":"3.5rem","width":"auto","margin-left":ww,"margin-top":"-1.75rem"});
//                   }else{
//                     var hh = -3.5/tt/2 + "rem";
//                     $("#img_"+picNextIndex).css({"width":"3.5rem","height":"auto","margin-left":"-1.75rem","margin-top":hh});
//                   }
//
//               pics[picNextIndex]=data;
//                   //设置允许上传的个数
//               var oldIndex = picNextIndex;
//                   picLen++;
//                   picNextIndex++;
//                   if(picLen>=5){
//                     $(".add-qanda-pic").hide();
//                   }
//               });
//               //调用方法，纠正角度等问题END
//       }
//      reader.readAsDataURL(file);
//
//         }
//     });
// })
// // 上传图片END
//
// function getImgData(img,dir,next){
//   var image=new Image();
//   image.onload=function(){
//     var degree=0,drawWidth,drawHeight,width,height;
//     drawWidth=this.naturalWidth;
//     drawHeight=this.naturalHeight;
//       //以下改变一下图片大小
//       var maxSide = Math.max(drawWidth, drawHeight);
//       /**if (maxSide > 1024) {
//         var minSide = Math.min(drawWidth, drawHeight);
//         minSide = minSide / maxSide * 1024;
//         maxSide = 1024;
//         if (drawWidth > drawHeight) {
//           drawWidth = maxSide;
//           drawHeight = minSide;
//         } else {
//           drawWidth = minSide;
//           drawHeight = maxSide;
//         }
//       }*/
//       var canvas=document.createElement('canvas');
//       canvas.width=width=drawWidth;
//       canvas.height=height=drawHeight;
//       var context=canvas.getContext('2d');
//       //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
//       switch(dir){
//          //iphone横屏拍摄，此时home键在左侧
//          case 3:
//          degree=180;
//          drawWidth=-width;
//          drawHeight=-height;
//          break;
//           //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
//           case 6:
//           canvas.width=height;
//           canvas.height=width;
//           degree=90;
//           drawWidth=width;
//           drawHeight=-height;
//           break;
//           //iphone竖屏拍摄，此时home键在上方
//           case 8:
//           canvas.width=height;
//           canvas.height=width;
//           degree=270;
//           drawWidth=-width;
//           drawHeight=height;
//           break;
//       }
//       //使用canvas旋转校正
//       context.rotate(degree*Math.PI/180);
//       context.drawImage(this,0,0,drawWidth,drawHeight);
//       //返回校正图片
//       next(canvas.toDataURL("image/jpeg",0.8),Math.abs(canvas.width),Math.abs(canvas.height));
//   }
//   image.src=img;
// }
//
// function showPic(index){
//     $('#gallery').fadeIn();
//     $('.page__hd').css("z-index",0);
//     $('#gallery').click(function(){
//       $('.page__hd').css("z-index",2);
//       $('#gallery').fadeOut();
//     });
//     $('.appui-gallery__img img').attr('src',pics[index]);
//     if($('.appui-gallery__img img').height() > $('.appui-gallery__img').height()){
//       $('.appui-gallery__img img').css({'top':'0','margin-top':'0'});
//     }
//     else{
//       $('.appui-gallery__img img').css({'top':'50%','margin-top':-$('.appui-gallery__img img').height()/2});
//     }
// }
//
//
// function deletePic(index){
//   //alert('ok');
//   $("#figure_"+index).remove();
//   pics[index] = null;
//   picLen--;
//     if(picLen<9){
//        $(".add-qanda-pic").show();
//     }
// }



