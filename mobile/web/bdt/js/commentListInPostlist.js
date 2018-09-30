//===============================================================
//展开每一个帖子的评论列表

var curUserId = null;

function showCommentList(id,type,curIndex,pubLocateType){//alert(id);
	var pinglunCount = $('#pinglun_'+id).text();
	if (pinglunCount==0) {
		return;
	}
	var path = $('#showComment_'+id+' img')[0].src;
	if (path==hostConf+"/themes/img/up_more.png") {
		$('#commentDiv_'+id).fadeIn();
		$('#commentlist'+id).fadeIn();
		//if (totalCommentPageArr[index][curIndex]==0) {
			requestCommentList(id,type,curIndex,id,pubLocateType);
		//}
		$('#showComment_'+id+' img').attr('src',hostConf+"/themes/img/down_more.png");
	}else{
		$('#commentDiv_'+id).fadeOut();
		$('#commentlist'+id).fadeOut();
		$('#showComment_'+id+' img').attr('src',hostConf+"/themes/img/up_more.png");
	}
}

//评论列表的网络请求
function requestCommentList(postId,type,curIndex,rootId,pubLocateType){
	$.ajax({
		type:"post",
		url:getPageTopicAnswerCommentList,
		dataType:"json",
		async: true,
		// data:{"page":"获取页","pernum","每页行数","contentType":"内容类型，3-话题","id":"主内容的id，对于话题就是话题的id"},
		//data:{"page":1,"pernum":4,"id":rootId,"contentType":type},//20170612注释
		data:{"page":1,"pernum":400,"id":rootId,"contentType":type},//20170612新增
		success:function(result){
			if(result.result=="success"){
				$('#commentlist'+postId).html("");
				configCommentUI(result.data.list,type,curIndex,postId,rootId,pubLocateType);
				if(pubLocateType == 2){//圈子执行
					addLine(postId);
				}
			}else{
				dataLoadedError(result.message);
			}
		}
	});
}

//评论请求列表
function configCommentUI(groups,type,curIndex,postId,rootId,pubLocateType){
	var commentListStr = "";
	//var commentLength=groups.length>3?3:groups.length;//20170612注释
	//for (var i = 0; i <commentLength ; i++) {//20170612注释
	for (var i = 0; i <groups.length ; i++) {
		var id=groups[i].id;
		var content=groups[i].content;
		var status=groups[i].status;
		var user=groups[i].author;
		var toUser=groups[i].toUser;
		commentListStr += CreateCommentHTML(id,type,content,status,user,toUser,rootId,curIndex,pubLocateType);
	}
    $('#commentlist'+postId).append(commentListStr);

	//判断加载更多按钮是否出现
    //if($('#downloadMoreComment_'+postId).length>0){
		//$('#downloadMoreComment_'+postId).remove();
    //}
    //if (groups.length==0) {
		//$('#commentDiv_'+postId).html('<a class="appui_loadmore fs24 fc-greyabc" id="noComment_'+postId+'">暂无更多评论</a>');
    //}
	//查看更多-20170612注释
	//if(groups.length>3){
		//if($('#commentlist'+postId).find('.appui_loadmore').length==0){
			//$('#commentlist'+postId).append('<a id="downloadMoreComment_'+postId+'" class="appui_loadmore fs24 fc-greyabc">查看更多</a>');
		//}
		//$('#downloadMoreComment_'+postId).click(function(){
			//$('#contentDiv'+postId).trigger("click");
		//});
	//}
    //取消按钮
    $('#appiu_js_page-cancel').stop().click(function(e) {
		$('#js-bg').fadeOut();
		$('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300);
    });
}

//生成评论列表  curIndex是为了避免同一个问题在同一个页面出现多次，比如提问会带了的情况下  traceId
function CreateCommentHTML(id,type,content,status,user,toUser,traceId,curIndex,pubLocateType){
	var commentStr =
	'<div class="comment-item" id="commentListID_'+type+'_'+traceId+'_'+id+'+'+curIndex+'">'+
		CreateCommentInPostlist(id,type,content,status,user,toUser,traceId,curIndex,pubLocateType)+
	'</div>';
	return commentStr;
}

//生成每一条评论内容
function CreateCommentInPostlist(id,type,content,status,user,toUser,traceId,curIndex,pubLocateType){
	var str = "";
	var textContent = status==2?"<i class=\"deletestyle\">"+content + "</i>":content;
	if (toUser==null || user.id == toUser.id) {
		str = 	'<div onclick="commentClick(\'300\','+id+','+type+',0,0,'+traceId+',\''+user.nickname+'\','+pubLocateType+')" id="comment_'+type+'_'+traceId+'_'+id+'" class="comment-item-content paddingtopleft0 fs28 fc-black  face_tag">'+
					'<span class="fc-blue">'+user.nickname+'</span>:'+
					textContent+
				'</div>';
	}else{
		str = 	'<div onclick="commentClick(\'300\','+id+','+type+',0,1,'+traceId+',\''+user.nickname+'\','+pubLocateType+')" id="comment_'+type+'_'+traceId+'_'+id+'" class="comment-item-content paddingtopleft0 fs28 fc-black  face_tag">'+
					'<span class="fc-blue">'+user.nickname+'</span>'+
					'<span class="fc-black mr5 ml5">回复</span>'+
					'<a class="fc-blue" onclick="gotoUser_pageHtml('+toUser.id+')">'+toUser.nickname+'</a>:'+
					textContent+
				'</div>';
	}
	return str;
}

//点击评论内容执行评论回复操作
function commentClick(fontLength,topicId,contentType,forwardStatus,targetType,rootId,commentObject,pubLocateType){
	pubcommentClick(fontLength,topicId,rootId,contentType,commentObject,pubLocateType);
}

//页面弹出评论界面
function pubcommentClick(fontLength,id,rootId,type,commentObject,pubLocateType){

    // 阻止事件冒泡
    event ? event.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;

    var _this = event.target;

    var currUser = getSessionUserNoRedirectEx();

    if(currUser == null){
        getSessionUser();
        return false;
    }

    function po_Last_Div(obj) {
        if (window.getSelection) {//ie11 10 9 ff safari
            obj.focus(); //解决ff不获取焦点无法定位问题
            var range = window.getSelection(); //创建range
            range.selectAllChildren(obj); //range 选择obj下所有子内容
            range.collapseToEnd();//光标移至最后
			}
        else if (document.selection) {//ie10 9 8 7 6 5
            var range = document.selection.createRange();//创建选择对象
            range.moveToElementText(obj);//range定位到obj
            range.collapse(false);//光标移至最后
            range.select();
        }
    }
    alert("1")
    // 获取焦点时
    function commentFocus(){
        if($("#g_qrcodeLayoutDiv").length>0){
            $("#g_qrcodeLayoutDiv").hide();
        }
        if($("#footer_tabbar").length > 0){
        	$("#footer_tabbar").hide();
		}
		if($("#sendMessage").length > 0){
        	$("#sendMessage").hide();
		}
        setTimeout(function(){
            // 解决安卓无法失去焦点
            if(navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1){
                $(window).on("resize", function(){
                    $("#commentEdit .m-comment-textarea").blur();
                });
		}else{
                // ios无法固定底部输入法时
                document.body.scrollTop = document.body.scrollHeight;
		}
        }, 400);
}

    // 失去焦点时
    function commentBlur(){
        setTimeout(function(){
            $(window).off("resize");
            if($("#footer_tabbar").length > 0){
                $("#footer_tabbar").show();
		}
            if($("#sendMessage").length > 0){
                $("#sendMessage").show();
	}
        },300);
}

    // 提交评论
    function submitReview(){
        pubCommentSubmit(id, rootId, type, pubLocateType, _this);
    }


    commentFocus();

    return false;
}



//发送评论
function pubCommentSubmit(id,rootId,type,pubLocateType, targetElement){
    var commentText = $.trim($("#commentEdit .m-comment-textarea").text());  // 用jQuery的trim方法删除前后空格

	if(commentText == ''){
        dataLoadedError("评论内容不能为空");
        return false;
    }
	//此处应该增加一些判断评论内容的合法性。
	commentText = HTMLEncode(commentText);
	if (commentText == ''){
		dataLoadedError("评论内容不合法");
	}else{
		var targetType =0;
		if (id==rootId) {
			targetType = 1 ;
		}
		submitpubCommentRequest(id,rootId,type,commentText,0,targetType,pubLocateType, targetElement);
	}
}

//提交评论内容
var requestCommentFlag=false;
function submitpubCommentRequest(currentId,rootId,contentType,commentText,forwardStatus,targetType,pubLocateType, targetElement){
	if(requestCommentFlag){
		return;
	}else{
		requestCommentFlag=true;
	}
	dataLoading("评论发表中...");
	$.ajax({
		type: "post",
		url: submitComment,
		dataType: "json",
		async: true,
		//data:{"id":"id","contentType":"1-文章，2-问答, 3-topic","textContent":"文字内容","forwardStatus":"0-不转发，1-同时转发"}
		data:{"id":currentId,"contentType":contentType,"textContent":commentText,"forwardStatus":forwardStatus,"targetType":targetType},
		success: function(result) {
			clearToastDialog();
			if (result.result == "success") {
				requestCommentFlag=false;
				//成功后需要给定直接添加到当前，不重新刷新页面
				$('#commentEdit .m-comment-textarea').text("");


				$('#commentDiv_'+rootId).show();
				$('#commentlist'+rootId).show();


                // 首页评价不执行下面代码
                var targetUrlPathname = window.location.pathname;
                if (targetUrlPathname == "/index.html" || targetUrlPathname == "/index.htm" || targetUrlPathname == "/"){
                	$(targetElement).text(parseInt($(targetElement).text())+1);
                    dataLoadedError("评论成功");
                    return false
				};


				var path = $('#showComment_'+rootId+' img')[0].src;
				if (path==hostConf+"/themes/img/up_more.png") {
					$('#showComment_'+rootId).css("opacity","1");
					$('#showComment_'+rootId+' img').attr('src',hostConf+"/themes/img/down_more.png");
				}
				var curId=result.data.comment.id;
				var curUser=result.data.comment.author;
				var curToUser=result.data.comment.toUser;
				//CreateCommentHTML(id,type,content,status,user,toUser,traceId,curIndex)
				$('#commentlist'+rootId).prepend(CreateCommentHTML(curId,contentType,commentText,1,curUser,curToUser,rootId,1,pubLocateType));
				if(pubLocateType == 2){//圈子才执行
					addLine(rootId);
				}

				//如果当前评论条数大于3则隐藏后面的//20170612注释
				var pinglunCount = $('#pinglun_'+rootId).text();
				pinglunCount = parseInt(pinglunCount)+1;
				$('#pinglun_'+rootId).text(pinglunCount);
				//if(pinglunCount>3){
					//$('#commentlist'+rootId+" .comment-item").each(function(index,e){
						//if(index>2){
							//$(this).remove();
						//}
					//});
					////如果条数大于3，则显示查看更多按钮
					//if($('#commentlist'+rootId).find('.appui_loadmore').length==0){
						//$('#commentlist'+rootId).append('<a id="downloadMoreComment_'+rootId+'" class="appui_loadmore fs24 fc-greyabc">查看更多</a>');
					//}
					//$('#downloadMoreComment_'+rootId).click(function(){
						//$('#contentDiv'+rootId).trigger("click");
					//});
				//}
			}else{
				dataLoadedError(result.message);
			}
		}
	});
}

//关闭评论页面
function closepubComment(){
	var commentText = $.trim($('#edit-mark').val());
	commentText = HTMLEncode(commentText);
	if (commentText == ''){
		$("#container-pop").remove();
	}else{
  	setTimeout(function(){
		friendTips("是否要放弃您当前编辑的内容？","放弃","继续编辑",1);
			$("#tipsCancleID").removeAttr("onclick");
			$("#tipsCancleID").click(function() {
				$("#iosDialog1").remove();
				$("#container-pop").remove();
			});
		},1000);
	}
}

//弹框选择继续编辑
/*function saveFunction(index){
	if (index==1) {
		$(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
	};
}*/





