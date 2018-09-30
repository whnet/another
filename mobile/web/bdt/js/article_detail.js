var g_page_circleType = 2;
var g_page_qz_joinStatus = 1;

var hotActicleStr = "";
var datetime = new Date();
var articleId = "";
var dianzanBool = 0;
var diancaiBool = 0;
var collectionBool = 0;
var boolArr = "";
var currentPage = 1;
var totalPage = "";
var LinkString = "";
var LinkImage = "";
var flag = 0;
var isFrom = "";
var userTest = null;
var readTimes = 0;
//var shareStr = "";
var anchorNode,focusNode,anchorNodeParent,focusNodeParent;

var commentlocationID = "";
var answerID = "";
//var appType = readClientSession("appType");
var shareResult = null;

var fromReq = "";


//文档完全加载完成
$(window).load(function(){
	if (shareResult!=null) {
		configwxShare(shareResult);
		removeClientSession("articleResult");
	}
	//查看全文
    if ( $('#div_heights').height() >= 300 ) {
        $('.show-all').show();
        $('.show-all').click(function(){
            $('.article-detail').css('max-height','none');
            $('.show-all').remove();
        });
    }else{
        $('.show-all').remove();
    }
    //END
	//内容详情
    detail();
	//评论列表
    comments();

});

//请求评论内容数据
function comments(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "POST",
        url: "/articles/comments.html",
        data: {
            id:request('id'),
            _csrf:csrf,
        },
        dataType: "json",
        success: function(data){
          if(data.result == "success"){
          	$('#commentCount').text(data.count);
              commentList(data);

		  }
        }
    });
}
//显示列表
function commentList(data){
	var list = "";
 for(var i=0;i<data.list.length;i++){
	  if(data.list[i].to_member_id != 0){
          var content='<span class="fc-black">回复<strong class="fc-black">'+data.list[i].user.nickname+'</strong>:</span>'+data.list[i].content+'</div>';
	  }else{
          var content='<span class="fc-black"></span>'+data.list[i].content+'</div>';
	  }


	list +='<div class="comment-item bc-grey" id="commentList'+data.list[i].id+'"><div class="comment-item-author">' +
		'<a>' +
		'<i><img src="'+data.list[i].user.photo+'"></i><span class="ml5"><i class="fs30 fc-navy">'+data.list[i].user.realname+'</i>' +
		'<i class="fs20 fc-greyabc">'+getDateDiff(data.list[i].created)+'</i></span></a></div>' +
		'<div onclick="commonJS('+data.list[i].user.id+','+data.list[i].id+')" id="comment'+data.list[i].id+'" ' +
		'class="comment-item-content fs30 fc-black  face_tag">'+content+'</div>';
 }
    $('.comment-list-con').html(list);

}

//文章内容
function detail(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "POST",
        url: "/articles/detail.html",
        data: {
        	id:request('id'),
			_csrf:csrf
        },
        dataType: "json",
        success: function(data){
            if(data.result == 'success'){
               $('#div_heights').html(data.info.content);
               if(data.info.pics){
					   var img = "";
					   var arrayimgs = JSON.parse(data.info.pics);
					   var arrayvideos = JSON.parse(data.info.videos);
					   if(arrayimgs.length !=0){
						   for (var a = 0; a < arrayimgs.length; a++) {
							   $('#wfimg_'+a).attr('src',data.file+arrayimgs[a]);
						   }
					   }

					   if(arrayvideos.length !=0){
                           $('#wfvideo_0').attr('src',data.file+arrayvideos);
					   }
			   }
               //
            }

        }
    });
}


//配置文章详情-文章内容部分
function configArticleDetailPart(groups){
	answerID = groups.author.id;
	//标题
	if (groups.title==null||groups.title.length==0) {//标题为空
		$('#articleTitle').hide();
    }else{
		$('#articleTitle').html(groups.title);
	}
	//作者信息-关注-发文时间-文章阅读数
	var levelStr = userLevelStr(groups.author.masterLvl,groups.author.loupanId);
	var copyrightText = '';//版权类型  0-转载   1-授权转载   2-原创
	var copyRightBgColor = 'bg-white';
	var showOrHideCopyright = 'none';
	if(groups.copyrightType == 0 || groups.copyrightType == 3){
		//copyrightText = '';//转载
		//copyRightBgColor = 'bg-white';
		showOrHideCopyright = 'none';
		$('#copyright').show();
	}else if(groups.copyrightType == 1){
		copyrightText = '授权转载';
		copyRightBgColor = 'bg-greyd';
		showOrHideCopyright = 'block';
	}else if(groups.copyrightType == 2){
		copyrightText = '原创';
		copyRightBgColor = 'bg-green';
		showOrHideCopyright = 'block';
	}
	var authorFocusTimeReadStr =	'<div class="author-focus fs24">'+
										'<a class="mr5">'+
											'<img src="'+insertImgType(groups.author.headPic,1)+'">'+
											levelStr+
										'</a>'+
										'<div>'+
											'<a class="fc-navy">'+groups.author.realname+'</a>'+
											'<p>'+
												'<i class="fs22 fc-greyabc">'+getDateDiff(groups.addTime)+'</i>'+
												'<i class="fs20 fc-white ml10 '+copyRightBgColor+'" style="display:'+showOrHideCopyright+'">'+copyrightText+'</i>'+
											'</p>'+
										'</div>'+
									'</div>'+
									'<span id="facusStaus" class="bc-grey fc-orange fs24 ml10">+关注</span>';    
	$('.author-focus-time-read').html(authorFocusTimeReadStr);
	readTimes = groups.clickTimes;
	$('#readCount').text(groups.clickTimes);
	if (groups.type==0) {
		$('.author-focus-time-read').addClass('ortherstyle').removeClass('bg-greyfa');
    };
	if (userTest!=null&&userTest.id==groups.author.id) {
		$('#facusStaus').hide();
      };
	if (groups.authorFocusStatus==1) {
		$('#facusStaus').removeClass("fc-orange").addClass("fc-greyabc").text("已关注");
  }else{
		$("#facusStaus").click(function(){
			requestDoFocus(groups.author.id);
			$('#facusStaus').removeClass("fc-orange").addClass("fc-greyabc").text("已关注");
   });
   }

   	var loupanNameHtml = "";
    if(groups.publishLocationType == 1 && groups.publishLocationId>0 
        && !isUndefined(groups.publishLocationNickname) && groups.publishLocationNickname != null && groups.publishLocationNickname !=""){
        loupanNameHtml = '<a class="fc-blue" href="loupan_page.html?id='+groups.publishLocationId+'">#'+groups.publishLocationNickname+'#</a>';
    }
	
	//详情
	$('.article-detail-con').show();//详情容器
	$('.article-detail').show().html(groups.longContent);//详情
	var textEle = $('.article-detail').find('*');//强制改变文章（主要是抓取的文章）内容字体的大小
	for(var i=0; i<=textEle.length;i++){
		if($(textEle[i]).css('font-size')>'17px'){//抓取到的文字自提大于17的全部强制为18px
			$(textEle[i]).css('font-size','16px');
		}
		else{//小于等于17的全部墙纸16px
			$(textEle[i]).css('font-size','14px');
		}
	}
	$('.article-detail').find('*').each(function(index, element) {
		if($(this).css('width')>$('.article-detail').css('width')){
		  $(this).css({'width':'auto','max-width':'100%'});
        }
	});

	$('.article-detail').find('img').css({'width':'auto','height':'auto'}).removeAttr('width').removeAttr('height');
	
	//动态插入楼盘相关标签
	var specialTag = groups.tagLabel;
	var specialTagShow = 'block';
	var loupanlTag = groups.publishLocationNickname;
	var loupanTagShow = 'block';
	if( groups.tagLabel == '' || groups.tagLabel == undefined ){
		var specialTag = '';
		var specialTagShow = 'none';
	}
	if(groups.publishLocationNickname == '' || groups.publishLocationNickname == undefined ){
		var loupanlTag = '';
		var loupanTagShow = 'none';
	}
	if(specialTag != '' || loupanlTag != ''){
		var loupanTagStr=	'<div class="special-loupan-tag fs24">'+
								'<p class="special-tag fc-blue" style="display:'+specialTagShow+';" id="specialTagId">'+specialTag+'</p>'+
								'<p class="loupan-tag fc-greyabc mt5" style="display:'+loupanTagShow+';" id="loupanlTagId" onclick="window.location.href=\'loupan_page.html?id='+groups.publishLocationId+'\';">'+loupanlTag+'</p>'+
							'</div>';
		$('.article-detail').append(loupanTagStr);
	}



	var contentText = getTextFromHtml(groups.longContent).replace(/ /g,"");

	//转载申明
	if(groups.copyrightType == 3 && contentText != ""){
		$('#copyright').click(function(e) {//转载申明点击提示
			setTimeout(function() {
				$('.js_dialog_disclaimer').show();
				$('#disclaimerHelptext').show();
				$('#disclaimerHelptext').css('margin-top', -$('#disclaimerHelptext').height() / 2);
				if ($('#disclaimerHelptext').height() >= Math.floor($('body').height() * 0.70)) {
					$('#disclaimerHelptext').find('.appui-helptext-bd').height($('#disclaimerHelptext').height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
				}
			}, 500);
		});
		$('.appui-helptext-fd').click(function(e) {//转载申明关闭动作
			$('.js_dialog_disclaimer').hide();
			$('#disclaimerHelptext').hide();
			$('#disclaimerHelptext').css({
				'margin-top': '0',
				'height': 'auto'
			});
		});
	}
	
	requestQandaRecommandList(answerID,1,groups.id);//请求问答推荐数据
	setCommentScroll(1);// 定位评论位置
	
	}
	
//配置文章详情-对文章的操作部分


//得到圈子信息，有则显示，没有则隐藏  不通的文章来源圈子信息不同
function getQzInfo(id,type,hostOrAuthor){
	if(type==2){//来自圈子
		$.ajax({
			type:"post",
			url:getQz,
			dataType:"json",
			async: true,
			data:{"id":id},
			success:function(result){
				if(result.result=="success"){
					if(result.data.qzShow!=null){
						configIntoCircleUI(result.data.qzShow,type);
   }
      }
   }
    });
	}else if(type==1){//来自圈子外面
		$.ajax({
			type:"post",
			url:getMyQzByUserId,
			dataType:"json",
			async: true,
			data:{"userId":id},
			success:function(result){
				if(result.result=="success"){
					if(result.data.qzShow!=null){
						configIntoCircleUI(result.data.qzShow,type,hostOrAuthor);
}
    }
    }
	    });
}
}

//配置圈子入口广告
function configIntoCircleUI(groups,fromType,hostOrAuthor){
	//判断是否加入了
	var openurl="circle_share_detail.html?id="+groups.id+"&from=article_detail";
	if(groups.joinStatus==1){
		openurl="circle_page.html?id="+groups.id+"&from=article_detail";
	}
	var contentSourceStr = "";
	if( fromType == 1 ){//来自圈子外面
		contentSourceStr = 	'<h3 class="fc-black fs24">本文'+hostOrAuthor+'创建了'+
								'<span class="fwb ml5 mr5" id="qzname">'+groups.name+'</span>圈子'+
							'</h3>';
	}else if( fromType == 2 ){//来自圈子
		contentSourceStr = 	'<h3 class="fc-black fs24">本文来源于'+
								'<span class="fwb ml5 mr5" id="qzusernickname">'+groups.host.nickname+'</span>的圈子'+
								'<span class="fwb ml5 mr5" id="qzname">'+groups.name+'</span>'+
							'</h3>';
	}
	var intoCircleHtml=	'<div onclick="window.location.href = \''+openurl+'\'" class="add-circle-indetail bg-white">'+
							contentSourceStr+
							'<div class="circle-and-expert mt20">'+
								'<i><img src="'+groups.bgPic+'" id="qzbgpic"/></i>'+
								'<div class="cae-middle">'+
									'<h3 class="fs30 fwb fc-black" id="qzname1">'+groups.name+'</h3>'+
									'<p class="fs20 fc-grey999">'+
										'<span class="expert-name" id="qzusernickname1">'+groups.host.nickname+'</span>'+
										'<span class="circle-members" id="qzmembers">'+groups.totMembers+'</span>'+
									'</p>'+
								'</div>'+
								'<a class="add-circle-btn bc-grey fc-red fs24" href="'+openurl+'" id="artaddCircleBtn">去逛逛</a>'+
							'</div>'+
							'<p class="circle-discript fs24 fc-grey999 mt10" id="qzmemo">'+groups.summary+'</p>'+
						'</div>';
	$("#articleqzinfo").html(intoCircleHtml);
	$("#articleqzinfo").show();


    // iosAPP屏蔽加入圈子 start
    if(initOs.getOs() == 'ios'){
        $("#articleqzinfo").hide();
    }
    // iosAPP屏蔽加入圈子 end

	// 定位评论位置
	setCommentScroll(1);
}

//请求问答推荐数据
function requestQandaRecommandList(inAnswerId,inContentType,inContentId){
    $.ajax({
		type: "post",
		url: getAdQa,
		dataType: "json",
      async: true,
		// data:{"page":"获取页","userId":id,"contentType":"1-文章，2-问答","subType":"0-全部，1-我问，20-我答（包含21+22）,21-我已答，22-未答"}
		// data:{"page":1,"userId":answerID,"contentType":2,"pernum":3,"subType":21},
		data:{"userId":inAnswerId,"contentType":inContentType,"contentId":inContentId},
		success: function(result){
			if (result.result == "success"){
				if(result.data.list.length>0){
					$('#answerQaList').show();
					configQaListUI(result.data.list);
				}
				else{
					$('#answerQaList').hide();
				}
        }else{
          dataLoadedError(result.message);
        }
      }
    });
}

//配置问答推荐列表
function configQaListUI(groups){
//	var count = groups.length>3?3:groups.length;
    var preId = "";//过滤重复判断用
    var count = 0;
	var qaListStr = "";
    for (var i = 0; i <groups.length; i++) {
        if (preId!=groups[i].id&&count<3) {
            preId=groups[i].id;
			var listenDispalyStatus = groups[i].listenDispalyStatus;
			var picsStr = "";//判断此条问答是否有图片
			if (groups[i].pics!=null&&groups[i].pics.length>0) {
				picsStr = '<i class="appui-qanda-question-imgtag"><img src="../images/img-tag.png" /></i>';
			};
			var listenOrRead = "";
			if (groups[i].answerType==1){//语音回答-收听
				listenOrRead = "收听";
			}else if (groups[i].answerType==2) {//文字回答-阅读
				listenOrRead = "阅读";
			}
			qaListStr += '<div class="recommend-qanda-item bg-white" onclick="gotoQADetail('+groups[i].id+')">'+
							'<h3 class="fs30 fc-black">'+ picsStr + groups[i].content +'</h3>'+
							'<p class="fs24 fc-grey999 mt5">'+
								'<span>'+ groups[i].answerUser.nickname +'</span>'+
								'<span>'+ groups[i].listenUserTimes +'人'+listenOrRead+'</span>'+
							'</p>'+
							'<span><img src="../images/icon06.png" /></span>'+
						'</div>';
            count++;
        };
    }
	$('#answerQaList').append(qaListStr);
    setCommentScroll(1);// 定位评论位置
}

//跳转到问答详情链接
function gotoQADetail(id, e){
	window.location.href = "/questions/qanda_detail.html?id="+id;
}




//判断是否显示文章删除操作按钮
function collectionAndReport(){
   friendTips("您是否要删除本篇文章？","取消","确定",0);
}
//是否继续评论或删除文章  -- 1：继续评论   0：删除文章
function saveFunction(index){
    if (index==1) {
        $('#edit-mark').focus();
    }else if (index==0) {
    	var articleId = $('.del').attr('data-del');
        deleteArticle(articleId);
    };
    $("#iosDialog1").fadeOut(100,$("#iosDialog1").remove());
}

//删除文章
function deleteArticle(articleId){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
      type:"post",
      url:'/articles/delete.html',
      dataType:"json",
      async: true,
      data:{"id":articleId, _csrf:csrf},
      success:function(result){
        if(result.status=="success"){
          dataLoadedSuccess("删除文章成功");
          window.location.href = "/members/myarticle.html";
        }else{
          dataLoadedError(result.message);
        }
      }
    });
}
		        		
//配置微信分享参数
function configwxShare(result){
	//发给朋友标题
    var shareTitle = result.data.article.title;
	//分享朋友圈标题
    var shareStr = result.data.article.title;
	//发给好友内容
    var shareFriendStr = "";
	var pubLoType = result.data.article.publishLocationType;
    if(typeof(result.data.article.summary)=="undefined" || result.data.article.summary == null || result.data.article.summary==""){
		shareFriendStr=$(".article-detail").text().substring(0,40);
	        		}else{
		shareFriendStr = result.data.article.summary;
		        }
	//lhj mod
	var paraStr = "&srId=";
	var currUrl = window.location.href;
	var realUrl = "";
	var img = "";
	//说明是分享进来的

	var index = currUrl.indexOf(paraStr);
	if (userTest!=null) {
		realUrl = hostConf + "/article_detail.html?id="+articleId+"&srId="+userTest.id;
	        }else{
		realUrl = hostConf + "/article_detail.html?id="+articleId;
	      }

	//icon:默认为文章首图，内容无图片时获取发贴人头像
    if (result.data.article.homePic.length>0&&result.data.article.homePic!=null&&result.data.article.homePic!="") {
        img = result.data.article.homePic.split(",")[0];
    }else {
		img = insertImgType(result.data.article.author.headPic,3)
}


	shareTitle = result.data.article.title;
	shareStr = result.data.article.title;
	if(result.data.article.content==""||result.data.article.content==null){
		shareFriendStr = "进行讨论、交流和分享";
	}else{
		shareFriendStr = result.data.article.content;
}
	shareTitle = getTextFromHtml(shareTitle);
	shareStr = getTextFromHtml(shareStr);
	shareFriendStr = getTextFromHtml(shareFriendStr);
	wxShareFromUrlEx(shareTitle,shareStr,shareFriendStr,"",img,img,realUrl);
}


