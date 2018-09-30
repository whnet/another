var Comment = {
	init: function () {
		var comDom = '<div id="commentField">'+
							'<div style="width: 100%;height:100vh;background: #f1f1f1;position:absolute;left:0;top:0;z-index: -1;"></div>'+
							'<div class="comment_title fc-black bg-white b-b-grey">'+
								'<a class="fc-black fs34" id="cancel">取消</a>'+
								'<h2 class="fs36">评论</h2>'+
								'<a class="fc-black fs34" id="send_com">发送</a>'+
							'</div>'+
							'<div class="bg-white" id="commentArea">'+
								'<textarea class="fs34 fc-black" id="comment_component" placeholder="请输入评论内容"></textarea>'+
							'</div>'+
						'</div>';
		$(document.body).append(comDom);
	},
	cancel: function(){
		setTimeout(function() {
			friendTips("是否要放弃您当前编辑的内容？", "放弃", "继续编辑", 1);
		}, 300);
	},
	send: function(fontLength,currentId,contentType,forwardStatus,targetType,call,traceId,currentIndex){
		var commentText = $.trim($('#comment_component').val()); // 用jQuery的trim方法删除前后空格
		commentText = HTMLEncode(commentText);
		if (commentText == '') {
			dataLoadedError("评论内容不合法");
		} else {
			if (commentText.length<=fontLength) {
				submitCommentRequest(currentId,contentType,commentText,forwardStatus,targetType,call,traceId,currentIndex);
			}else{
				dataLoadedError("您的字数太多了，要不少写一点")
			}
		}
	}
}
function tipsCancle(){
  $('#commentField').remove();
}
function saveFunction(index){
	if (index==1) {
        $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
    };
}
function submitCommentRequest(currentId,contentType,commentText,forwardStatus,targetType,callback,traceId,currentIndex){
	$.ajax({
        url: submitComment,
        type: "post",
        dataType: "json",
        data:{"id":currentId,"contentType":contentType,"textContent":commentText,"forwardStatus":forwardStatus,"targetType":targetType},
        success: function(result) {
            if (result.result == "success") {
            	$('#commentField').fadeOut();
            	$('#comment_component').val("");
            	callback(result.data,currentId,contentType,traceId,currentIndex);
            }else{
                 dataLoadedError(result.message);
            }
        }
    });
}
// 以上为封装
// call 为你的回调函数
// var call = function (data){
// 	// Do Something;
// }
// function commentClick(fontLength,topicId,contentType,forwardStatus,targetType,call){
// 	Comment.init();
// 	$("#commentField #cancel").on('click',function(event) {
// 		Comment.cancel();
// 	});
// 	$("#commentField #send_com").on('click',function(event) {
// 		Comment.send(fontLength,topicId,contentType,forwardStatus,targetType,call);
// 	});
// }