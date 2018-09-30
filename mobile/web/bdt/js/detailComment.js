
//=======评论模块=======detailComment.js 详情页面用的评论模块
//=======使用页面=======文章详情-article_detail、短文详情square_detail、问答详情qnada_detail、圈子问答详情circle_qanda_detail
//=======功能结构=======评论列表配置-评论操作-点赞操作-点踩操作-删除评论操作-对评论回复操作


var dianzanBool = 0;
var diancaiBool = 0;
var collectionBool = 0;
var userTest = "";
var id = "";
var typeStatus = "";

//============================================================================
//==============================评论列表=======================================
//============================================================================
//请求评论列表数据
function requestCommentList(targetId,targetType,urlType){
	//targetId:当前详情页面内容ID   targetId：当前详情页面内容类型  1：文章(长文||短文)  2：问答     urlType评论列表请求地址类型   1:文章  2：问答  3短文
    dataLoading("数据加载中...");
	var requestUrl = "";
	if( urlType == 1 ){
		requestUrl = getPageCommentList;//文章评论列表请求地址
	}else if( urlType == 2 ){
		requestUrl = getPageCommentList;//问答评论列表请求地址
	}else{
		requestUrl = getPageTopicAnswerCommentList;//短文评论列表请求地址
	}
    $.ajax({
        type:"post",
        url:requestUrl,
        dataType:"json",
        async: true,
        data:{"page":currentPage,"pernum":500,"id":targetId,"contentType":targetType},
        success:function(result){
			clearToastDialog();
			if(result.result=="success"){
				if (result.data.list.length>0) {
					configCommentLstUI(result.data.list,targetId,targetType,urlType);
				}else{
					// $('.comment-list-con').append('<a class="appui_loadmore fs32 fc-greyabc">暂无更多评论</a>');
				}
			}else{
				dataLoadedError(result.message);
			}
        }
    });
}

//配置评论列表
function configCommentLstUI(groups,targetId,targetType,urlType){
    var commentStr1 = "";
    var type = "";
    for (var i = 0; i <groups.length ; i++) {
		commentStr1 +=	'<div class="comment-item bc-grey" id="commentListID'+groups[i].id+'">'+
							'<div class="comment-item-author">'+
								'<a onclick="gotoUser_pageHtml('+groups[i].author.id+')">'+
									'<i><img src="'+insertImgType(groups[i].author.headPic,2)+'" /></i>'+
									'<span class="ml5">'+
										'<i class="fs30 fc-navy">'+groups[i].author.nickname+'</i>'+
										'<i class="fs20 fc-greyabc">'+getDateDiff(groups[i].addTime)+'</i>'+
									'</span>'+
								'</a>'+
							'</div>'+
							configTextComment(groups[i])+
						'</div>';
	};
	$('.comment-list-con').append(commentStr1); 
	//判断加载更多按钮是否出现
	if($('.appui_loadmore').length>0){
		$('.appui_loadmore').remove();
	}
		if (commentlocationID!="") {
			var location = $('#commentListID'+commentlocationID).offset().top-$(window).height()+$('#commentListID'+commentlocationID).height()+80;
			$('.page__bd').scrollTop(location);
		}
   
	$('#appiu_js_page-cancel').stop().click(function(e) {//弹出操作-取消按钮
		$('#js-bg').fadeOut();
		$('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300)
	});
	if(g_page_qz_joinStatus == 0){//非圈子用户，禁止评论
		$(".comment-item-content").removeAttr("onclick");
		$("#foot_comment_menu").hide();
	}
	// 定位评论位置
    setCommentScroll(1);
}

//生成评论列表中的每一条评论内容
function configTextComment(cRecord){
	var commentContentstr = "";
	var textContent = cRecord.content;
	if(cRecord.status==2){
		textContent = "<i class=\"deletestyle\">"+textContent + "</i>";
	}
	if (cRecord.toUser==null || cRecord.author.id == cRecord.toUser.id) {
		commentContentstr =	'<div onclick="commonJS('+cRecord.author.id+','+cRecord.id+')" id="comment'+cRecord.id+'" class="comment-item-content fs30 fc-black  face_tag">'+
					textContent+
				'</div>';
	}else{
		commentContentstr =	'<div onclick="commonJS('+cRecord.author.id+','+cRecord.id+')" id="comment'+cRecord.id+'" class="comment-item-content fs30 fc-black  face_tag">'+
					'<span class="fc-black">回复:</span>'+
					'<a class="fc-navy mr5 ml5" onclick="gotoUser_pageHtml('+cRecord.toUser.id+')">'+cRecord.toUser.nickname+'</a>'+
					textContent+
				'</div>';
	}
	return commentContentstr;
}

//加载更多评论列表
function downloadMoreData(targetId,targetType,urlType) {
    currentPage++;
    requestCommentList(targetId,targetType,urlType);
}




var selectCommentID = null;
// 初始化评论输入
function initCommentImport(){
    //定位div(contenteditable = "true") 光标
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

	// 获取焦点时
    function commentFocus(){
        $("#commentEdit .u-issue-comment").off("click");
        $("#commentEdit .u-issue-comment").on("click", submitReview);
        if($("#g_qrcodeLayoutDiv").length>0){
        	$("#g_qrcodeLayoutDiv").hide();
        }
        
        if($("#footer_tabbar").length>0){
            $("#footer_tabbar").hide();
        }
        $("#commentEdit").show();
        $("#foot_comment_menu").hide();
        po_Last_Div($("#commentEdit .m-comment-textarea").get(0));
        // $("#commentEdit .m-comment-textarea").focus();
        // $("#commentEdit .m-comment-textarea").attr('placeholder', '请输入评论内容');
        $("#commentEdit .u-issue-comment").text("评论");
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
            var val = $.trim($("#commentEdit .m-comment-textarea").text());
            if(val != ''){
                $(".appui-comment-btn").text(val.length > 6?val.substring(0,6)+'...':val);
			}else{
                $(".appui-comment-btn").text('写下你的评论...');
			}
            $("#foot_comment_menu").show();
            $(window).off("resize");
            $("#commentEdit").hide();
            $("#foot_comment_menu").show();
		},300);
    }

    // 提交评论
    function submitReview(){
        var commentText = $.trim($("#commentEdit .m-comment-textarea").text());  // 用jQuery的trim方法删除前后空格
        //此处应该增加一些判断评论内容的合法性。
        commentText = HTMLEncode(commentText);
        if (commentText == ''){
            dataLoadedError("评论内容不合法");
        }else{
            requestComment(commentText, 0, selectCommentID);
        }
    }

	// 输入时控制数字
    $("#commentEdit .m-comment-textarea").on('input', function(){
    	var str = $(this).text();
        if(str.length > 300){
            $(this).text(str.substring(0,300));
            po_Last_Div(this);
        }
	});


    var slide = {
        parameter:{
            curPositoin: '',
            endPosition: '',
			scroll: ''
        },

        start: function (event) {
            event ? event.stopPropagation() : event.cancelBubble = true;
            event.cancelBubble = true;
            var touch = event.originalEvent.changedTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            slide.parameter.curPositoin = touch.pageY;
            $(this).on('touchmove', slide.move);
            $(this).on('touchend', slide.end);
        },
        //移动
        move: function (event) {
            event ? event.stopPropagation() : event.cancelBubble = true;
            event.preventDefault(); // 阻止浏览器默认事件，重要
            event.cancelBubble = true;
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (event.originalEvent.length > 1) return;
            var touch = event.originalEvent.targetTouches[0];
            slide.parameter.scroll = Math.floor((slide.parameter.curPositoin - touch.pageY) / 4);
            var textareaScroll = $("#commentEdit .m-comment-textarea").scrollTop() +　slide.parameter.scroll;
            $("#commentEdit .m-comment-textarea").scrollTop(textareaScroll);
        },
        //滑动释放
        end: function (event) {
            //解绑事件
            $(this).off('touchmove', slide.move);
            $(this).off('touchend', slide.end);
        }
    };

    $("#commentEdit .m-comment-textarea").on('touchstart', slide.start);

    // 获取焦点
    $(".appui-comment-btn").on('click', function(){
    	var currUser = getSessionUserNoRedirectEx();
    	if(currUser == null){
    		getSessionUser();
  			return false;
    	}
        selectCommentID = null;
        commentFocus();
	});

    // 失去焦点
    $("#commentEdit .m-comment-textarea").on('blur', commentBlur);
}

//初始化点赞按钮====判断原来是否进行点踩过；
function judgeCaiOrZanOrCollection(currAttitude,favoriteStatus) {
	id = request("id");
    if (currAttitude == 1) {
        dianzanBool=1;
        addOrRemoveClassOn('dianzan',1);
    }else{
        addOrRemoveClassOn('dianzan',0);
    }
    if (favoriteStatus==1) {
        collectionBool=favoriteStatus;
        addOrRemoveClassOn("collection",1);
    };
}

//============================================================================
//==============================操作方法=======================================
//============================================================================
//分享操作
function shareBtn(){
    //webApp
    if (appType==isApp) {
      appShareFunction();
    }else{
		if (isActivity==0) {
			$('#shareView').show();
			$('.closePopShare_dd').unbind("click").click(function(){
				$('#shareView').hide();
			});
			createStatWithParamlog(window.location.href,"/adQaShare.html","3",window.location.search);
		}else{
			show_prompt();
			createStatWithParamlog(window.location.href,"/createQaStep1.html","1",window.location.search);
		}
	}
}

//点赞操作
var ddClick = false;
function dianzanBtn(){// "type":"0-取消操作，1-执行操作","status":"0-踩，1-点赞",
	if (ddClick==false) {
		ddClick=true;
		userTest = getSessionUser();
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

//点踩操作
function diancaiBtn(){
	userTest = getSessionUser();
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

//收藏操作
function collectionBtn(){
	if (ddClick==false) {
		ddClick=true;
		userTest = getSessionUser();
		if (collectionBool==0) {
			collectionRequest(1);
		}else{
			collectionRequest(0);
		}
	}
}





//评论==网络请求
var requestCommentFlag=false;//避免重复提交
function requestComment(commentText,checkedBool,commentID){
	var commentId = "";
	var targetType = 0;
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
			"targetType":targetType
		},
		success:function(result){
			clearToastDialog();
			requestCommentFlag=false;
			if(result.result=="success"){
				dataLoadedSuccess("评论成功");
                $("#commentEdit .m-comment-textarea").text("");
				setTimeout("tipsCancle()",1000);
				refreshCommentList(checkedBool,1,result.data.comment);
			}else{
				dataLoadedError(result.message);
			}
		}
	});
}

//弹出评论界面或者转发界面==给标签绑定一些方法
/*
function bindMethods(str,commentID){
	var checkedBool = 0;
	$("#checkbox").attr("checked",false);
	//$('#placeholder').show();
	$('#edit-mark').text('');
	//$('#titleID').text("评论");
	$('#labelTestID').text("同时转发");
	$("#sendID").unbind("click").click(function(){
		var commentText = $.trim($('#edit-mark').val());  // 用jQuery的trim方法删除前后空格
		//此处应该增加一些判断评论内容的合法性。
		commentText = HTMLEncode(commentText); 
		if (commentText == ''){
			dataLoadedError("评论内容不合法");
		}else{
			requestComment(commentText,checkedBool,commentID);
		}
	});
	$("#cancleID").unbind("click").click(function(){
		setTimeout(function(){friendTips("是否要放弃您当前编辑的内容？","放弃","继续编辑",1);},1000);
	});
}
*/

//公共函数添加样式on  addOrRemove:0移除样式 1：增加样式
function addOrRemoveClassOn(ID,addOrRemove){
	if(addOrRemove == 0){
		$('#'+ID+'').removeClass('on');
	}else{
		$('#'+ID+'').addClass('on');	
	}
}

//============================================================================
//==============================弹出评论界面内容================================
//============================================================================
//配置评论界面
function configCommentUI(fontLength){
	var commentUIStr = 	
	'<div id="container-comment" class="container comment-edit-container bg-grey" style="display:none;">'+
		'<div id="page-pop">'+
			'<!--页面导航栏-->'+
			'<div class="page__hd page__hd-edit fc-black bg-white b-b-grey">'+
				'<div class="statebar">'+
					'<a class="fc-black fs34" id="cancleID">取消</a>'+
					'<h2 class="fs36" id="titleID">评论</h2>'+
					'<a class="fc-black fs34" id="sendID">发送</a>'+
				'</div>'+
			'</div>'+
			'<!--页面主体-->'+
			'<div class="page__bd">'+
				'<!--占位空间-->'+
				'<div class="top-space1"></div>'+
				'<div class="edit-module bg-white bc-grey">'+
					'<div class="edit-content">'+
						'<div class="edit-content-container">'+
							'<div class="article-comment-edit-module fc-grey678 fs30" contenteditable="false">'+
								'<textarea class="fs34 fc-black" maxlength="'+fontLength+'" id="edit-mark" placeholder="请输入评论内容"></textarea>'+
								'<span class="fs28 fc-greyabc"><i id="currentLength" class="fc-grey666">0</i>/'+fontLength+'</span>'+
							'</div>'+
							'<div class="forward-link" style="display:none">'+
								'<a class="link-style bg-grey fs28">'+
									'<i><img src="" /></i>'+
									'<p></p>'+
								'</a>'+
							'</div>'+
							'<span id="placeholder" class="fc-greyabc fs30" style="display:none;"></span>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>';	
	return commentUIStr;
}

//评论成功后-刷新评论列表
function refreshCommentList(isForward,isComment,commentList){
	if($('.appui_loadmore').length>0){
		$('.appui_loadmore').remove();
	}
	if (isForward==1) {
		var forwardCount = parseInt($("#forward span").html())+1; 
		$('#forward span').text(forwardCount);
	};
	if (isComment==1) {
		var commentCount = parseInt($("#commentCount").html())+1; 
		$('#CommentModule').show();
		$('#commentCount').text(commentCount);
		var commentStr =	'<div class="comment-item bc-grey" id="commentListID'+commentList.id+'">'+
								'<div class="comment-item-author">'+
									'<a onclick="gotoUser_pageHtml('+commentList.author.id+')">'+
										'<i><img src="'+insertImgType(commentList.author.headPic,2)+'" /></i>'+
										'<span class="ml5">'+
											'<i class="fs30 fc-navy">'+commentList.author.nickname+'</i>'+
											'<i class="fs20 fc-greyabc">刚刚发表</i>'+
										'</span>'+
									'</a>'+
								'</div>'+
								configTextComment(commentList)+
							'</div>';
		$('.comment-list-con').prepend(commentStr); 
	};
}

//点击评论列表==弹出详情底部操作界面
function commonJS(authorID,commentID){
	var member_id = $('input[name="member"]').val();
	$('#commentObject').show();
	var str='<a id="replayID" class="bc-grey fc-black page-cancel">回复</a>'+
			'<a  id="deleatCommentId" style="display:none" class="fc-black page-cancel">删除</a>';
	$('#appiu_js_page-actID').html(str);

	$('.page-cancel').click(function(e) {
		$('#js-bg').fadeOut();
		$('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300);
	});

	var nicknameStr = $('#comment'+commentID+'').prev().find('span i:first').text();
	var commentStr = nicknameStr+":"+$('#comment'+commentID+'').text();
	$('#commentObject').text(commentStr);
	if ( member_id == authorID ) {
		$('#replayID').hide();//自己不能对自己进行回复
		$('#deleatCommentId').show();//自己对自己的评论可以进行删除操作
		$('#deleatCommentId').click(function(){
			deleteComment(commentID);
		});
	}
	$('#replayID').click(function(){//回复操作
        $(".appui-comment-btn").click();
		commentTitle = '回复'+nicknameStr;
        $("#commentEdit .u-issue-comment").text("回复");
        selectCommentID = commentID;
	});
	
	$('#js-bg').fadeIn();
	$('#js-page').animate({'bottom':'0' , 'opacity':'1'},300)
}

//删除评论
function deleteComment(commentID){
    var csrf = $('input[name="csrf"]').val();
		$.ajax({
			type:"post",
			url:'/comments/delcomment.html',
			dataType:"json",
			async: true,
			data:{"commentId":commentID, _csrf:csrf},
			success:function(result){
				if(result.status=="success"){
					$('#commentListID'+commentID+'').remove(); 
					dataLoadedSuccess("删除评论成功");
					setTimeout("tipsCancle()",2000)
				}else{
					dataLoadedError(result.message);
				}
			}
		});

}
