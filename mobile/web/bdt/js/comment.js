// comment.js

var dianzanBool = 0;
var diancaiBool = 0;
var collectionBool = 0;
var userTest = "";
var id = "";
var typeStatus = "";
var checkedBool = 0;
var commentID = request('id');
$(window).load(function() {
    $("#sendID").click(function () {
        var commentText = $.trim($('#edit-mark').val()); 
        //此处应该增加一些判断评论内容的合法性。
        commentText = HTMLEncode(commentText);
        if (commentText == '') {
            dataLoadedError("评论内容不合法");
        } else {
            requestComment(commentText, checkedBool, commentID);
        }
    });
    $("#cancleID").click(function () {
        setTimeout(function () {
            friendTips("是否要放弃您当前编辑的内容？", "放弃", "继续编辑", 1);
        }, 1000);
    });
});

function share(){
      $('#shareView').show();
      $('#closeShare').unbind("click").click(function(){
          $('#shareView').hide();
      });
}

var ddClick = false;//yanli
function dianzanBtn(mid){
    if(!mid){
        dataLoadedSuccess("请先登录");
        window.location.href="/members/login.html";
        return false;
    }
  if (ddClick==false) {
    ddClick=true;
  var caiCount = $('#diancai span').html();
  if (diancaiBool==1) {
    $('#diancai span').text(parseInt(caiCount)-1);
  }
  if (dianzanBool==0) {
	zanOrCaiRequest(1, 1);
  }else{
	zanOrCaiRequest(0, 1);
  }
}
}
function diancaiBtn(){
  var zanCount = $('#dianzan span').html();
  if (dianzanBool==1) {
    $('#dianzan span').text(parseInt(zanCount)-1);
  };
	if (diancaiBool==0) {
      zanOrCaiRequest(1, 0);
   }else{
      zanOrCaiRequest(0, 0);
   }
}
function collectionBtn(){
  if (ddClick==false) {
      ddClick=true;
	if (collectionBool==0) {
        collectionRequest(1);
     }else{
        collectionRequest(0);
     }
}

}
function commentBtn(str,commentID){
    $('#container-pop').fadeIn();
    $("#edit-mark").focus();
}
function commentReplayBtn(authorID,commentID){
    $('input[name="replyId"]').val(authorID);
    $('#container-pop').fadeIn();
    $("#edit-mark").focus();

}
//关注按钮yanli
function facus(mid,to_mid){
    if(!mid){
        dataLoadedSuccess("请先登录");
        window.location.href="/members/login.html";
        return false;
    }
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/dianzan/concerns.html',
        dataType: "json",
        async: true,
        data: {
            "to_mid": to_mid,
            "_csrf":csrf,
        },
        success: function(result) {
            if (result.result == "success") {
                if(result.data.currStatus == 1){
                    dataLoadedSuccess("关注成功");
                    $('#focus').html();
                    $('#focus').html('已关注');
                    $(".focus_"+mid).html('已关注');
                    var nums = $('#fansCountNums').html();
                    $('#fansCountNums').html(parseInt(nums)+1);
                }else if(result.data.currStatus == 0){
                    dataLoadedSuccess("取消关注");
                    $('#focus').html();
                    $('#focus').html('+关注');
                    $(".focus_"+mid).html('+关注');
                    var nums = $('#fansCountNums').html();
                    $('#fansCountNums').html(parseInt(nums)-1);
                }

            }
        },
    });
}
//进行点踩时候需要发送网络请求yanli
function zanOrCaiRequest(type, status) {
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/dianzan/dianzan.html',
        dataType: "json",
        async: true,
        data: {
            "article_id": request('id'),
            "_csrf":csrf,
        },
        success: function(result) {
            ddClick=false;
            if (result.result == "success") {
                //"data":{"currStatus":"当前态度：0-踩，1-点赞，2-无表情","totLikes":"总点赞人数","totOppose":"总点踩人数"}
                var zanCount = $('#dianzan span').html();
                removeBlueClass('diancai');
                removeBlueClass('dianzan');
                if (result.data.currStatus==0) {
                  addBlueClass('diancai');
                  dataLoadedSuccess("点踩成功");
                  $('#dianzan span').text(parseInt(zanCount)-1);
                  diancaiBool=1;
                  dianzanBool=0;
                }else if (result.data.currStatus==1) {
                    addBlueClass('dianzan');
                    dataLoadedSuccess("点赞成功");
                    if (parseInt(zanCount)==0) {
                        $('#dianzan span').show();
                    };
                    $('#dianzan span').text(parseInt(zanCount)+1);
                    diancaiBool=0;
                    dianzanBool=1;
                    if (typeStatus==2) {
                      $('#agree_times_id_1').text("赞" + (parseInt(zanCount)+1));
                    }
                }else if (result.data.currStatus==2) {
                    dataLoadedSuccess("取消成功");
                    if (parseInt(zanCount)==1) {
                        $('#dianzan span').hide();
                    };
                    //"status":"0-踩，1-点赞"
                    if (status==0) {
                      $('#diancai span').text(parseInt(caiCount)-1);
                    }else{
                      $('#dianzan span').text(parseInt(zanCount)-1);
                    }
                    diancaiBool=0;
                    dianzanBool=0;
                    if (typeStatus==2) {
                      $('#agree_times_id_1').text("赞" + (parseInt(zanCount)-1));
                    }
                }
               }
           }
    });
}
//进行文章收藏时候需要发送网络请求 meizuo
function collectionRequest(bool) {
    $.ajax({
        type: "post",
        url: setFavorite,
        dataType: "json",
        async: true,
        data:{
            "id":id,
            "contentType":typeStatus,
            "status":bool,
            "userId":userTest.id,
        },
        success: function(result) {
            ddClick=false;
            if (result.result == "success") {
              var collectionCount = $('#collection span').html();
              if (bool==1) {
                collectionBool=1;
                addBlueClass("collection");
                if (parseInt(collectionCount)==0) {
                    $('#collection span').show();
                };
                $('#collection span').text(parseInt(collectionCount)+1);
                dataLoadedSuccess("收藏成功");
              }else{
                collectionBool=0;
                removeBlueClass("collection");
                dataLoadedSuccess("取消收藏成功");
                if (parseInt(collectionCount)==1) {
                    $('#collection span').hide();
                };
                $('#collection span').text(parseInt(collectionCount)-1);
              }
             }else{
              dataLoadedError(result.message)
             }
         }
    });
}

//弹出评论界面或者转发界面；给标签绑定一些方法；
function bindMethods(str,commentID){
	var checkedBool = 0;
	$("#checkbox").attr("checked",false);
	//$('#placeholder').show();
	$('#edit-mark').text('');
	$('#titleID').text("评论");
	$('#labelTestID').text("同时转发");

}
//避免重复提交
var requestCommentFlag=false;
function requestComment(commentText,checkedBool,commentID){
  var commentId = "";
  var targetType = 0;
  var csrf = $('input[name="csrf"]').val();

  //第一次评论toMid为0,回复别人则为被回复者的id
    var replyId = $('input[name="replyId"]').val();
    if(replyId){
        var toMid = $('input[name="toMid"]').val();
    }else{
        var toMid = 0;
    }


  if (commentID!=null) {
    commentId = commentID;
  }else{
    commentId = id;
    targetType = 1;
  }
  
  if(requestCommentFlag){
	  return;
  }else{
	  requestCommentFlag=true;
  }
    dataLoading("评论发表中...");
    $.ajax({
      type:"post",
      url:'/comments/comment.html',
      dataType:"json",
      async: true,
      data:{
        "id":commentId,
        "contentType":typeStatus,
        "textContent":commentText,
        "forwardStatus":checkedBool,
        "targetType":targetType,
        "to_mid":toMid,
        "_csrf":csrf,
      },
      success:function(result){
        clearToastDialog();
        requestCommentFlag=false;
        if(result.result=="success"){
          dataLoadedSuccess("评论成功");
          $("#edit-mark").val("");
          setTimeout("fadeOutComment()",1000);
          refreshCommentList(checkedBool,1,result);
        }else{
          dataLoadedError(result.message);
        }
      }
    });
}

function refreshCommentList(isForward,isComment,commentList){
   if($('.appui_loadmore').length>0){
        $('.appui_loadmore').remove();
   }
  if (isForward==1) {
     var paddleft = $("#forward span").html();  
     var forwardCou = parseInt(paddleft)+1; 
     $('#forward span').text(forwardCou);
  };
  if (isComment==1) {
     var paddleft = $("#commentCount").html(); 
     var commentCou = parseInt(paddleft)+1; 
	 $('#article-comment-module').show();
     $('#commentCount').text(commentCou);
     var commentStr = '<div class="comment-item bc-grey" id="commentListID'+commentList.data.id+'">'+
                                '<div class="comment-item-author">'+
                                    '<a onclick="gotoUser_pageHtml('+commentList.data.id+')"><i><img src="'+commentList.user.photo+'" /></i>'+
                                        '<span class="ml5">'+
                                            '<i class="fs30 fc-navy">'+commentList.user.nickname+'</i>'+
                                            '<i class="fs20 fc-greyabc">刚刚发表</i></span></a></div>'+typeComment(commentList)+'</div>';
  $('.comment-list-con').prepend(commentStr); 
  };
}

function typeComment(cRecord){
    var str = "";
    var textContent = cRecord.data.content;
    if(cRecord.status==2){
      textContent = "<i class=\"deletestyle\">"+cRecord.data.content + "</i>";
    }
    // if (cRecord.toUser==null) {
    if (cRecord.toUser==null) {
        str = '<div onclick="commonJS('+cRecord.data.mid+','+cRecord.data.id+')" id="comment'+cRecord.data.id+'" class="comment-item-content fs30 fc-black  face_tag">'+textContent+'</div>';
    }else{
        str = '<div onclick="commonJS('+cRecord.data.mid+','+cRecord.data.id+')" id="comment'+cRecord.data.id+'" class="comment-item-content fs30 fc-black  face_tag">'+
                    '<span class="fc-black">回复:</span><a class="fc-navy mr5 ml5" onclick="gotoUser_pageHtml('+cRecord.data.id+')">'+cRecord.data.id+'</a>'+textContent+'</div>';
    }
    return str;
}


//公共函数添加颜色
function addBlueClass(ID){
  $('#'+ID+'').addClass('on');
}
function removeBlueClass(ID){
  $('#'+ID+'').removeClass('on');
}



// postRequestURl(getZjPageDataUrl,{"page":1},reque);
// function reque(data){
//     alert(data.list);
// }

