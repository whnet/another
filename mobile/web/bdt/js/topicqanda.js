// topicqanda.js

var currentPage = 1;
var totalPage = 1;

//回答个数 评论个数
var answerCount = 0;
var commentCount = 0;
var hostConf = "http://shequ.211ic.com";
var page = 1;
var flag = 0;
var backBool = 0;

var sortType = 0;
var currentId = "";
var currentRootId = "";
var totFansCount = "";
var userTest = "";
var topicID = "";
var typeId = "";

var currentCommentPageArr = new Array();
var totalCommentPageArr = new Array();
currentCommentPageArr[0] = new Array();
currentCommentPageArr[1] = new Array();
totalCommentPageArr[0] = new Array();
totalCommentPageArr[1] = new Array();

var appType = "";
var shareResult = "";
$(document).ready(function() {
        $('.topicqanda-summary').append('<span class="more-text fs24 fc-blue"><i>更多</i><img src="../bdt/images/moretext.png" /></span>');
        //文字回答和文字评论部分点击更多-展开或隐藏三行外的文字
        $('.show-text').each(function(index, element) {
            $(this).click(function(e) {
                $(this).toggleClass('hide-text');
                $(this).find('.more-text>i').text() == '更多' ? $(this).find('.more-text>i').text('收起') : $(this).find('.more-text>i').text('更多');
            });
        });
    $('#back').click(function(){
        window.location.href = "javascript:history.back(-1)";
    });

    if (sortType==0) {
    		$('#choicenessId').addClass("fc-red");
			$('#newId').addClass("fc-grey666").removeClass("fc-red");
	}else{
		$('#newId').addClass("fc-red");
		$('#choicenessId').addClass("fc-grey666").removeClass("fc-red");
    }
    $("#page__bd").scroll(function(){
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


	$('#page__bd').scroll(function() {
		// 当滚动到最底部以上161像素时， 给头部导航栏添加暗蓝色背景
		if ($(this).scrollTop() >= 150) {
			$(".topicqanda-container .page__hd").addClass("bg-white b-b-grey");
			$(".topicqanda-container .page__hd h2").fadeIn().addClass('fc-black');
			$(".topicqanda-container .page__hd .statebar .left-act img").attr('src','../bdt/images/nav_icon_back1.png');
			$(".topicqanda-container .page__hd .statebar .right-act img").attr('src','../bdt/images/nav_icon_share1.png');
		}else{
			$(".topicqanda-container .page__hd").removeClass("bg-white b-b-grey");
			$(".topicqanda-container .page__hd h2").fadeOut().removeClass('fc-black');
			$(".topicqanda-container .page__hd .statebar .left-act img").attr('src','../bdt/images/nav_icon_back.png');
			$(".topicqanda-container .page__hd .statebar .right-act img").attr('src','../bdt/images/nav_icon_share.png');
		}
	})
	// $(".appui-mask").click(function(){
	// 	$("#myVideo").get(0).pause();
	// 	$(".video_dialog").hide();
	// })
});



function configUI(){


	$('#SayId').click(function(){
		if(userTest == null){
			userTest = getSessionUser();
		}
		if (userTest.masterLvl<1) {
			commentClick(topicID,topicID);
		}else{
		if (typeId!=null) {
			window.location.href = "topicqanda_record.html?id="+topicID+"&typeId="+typeId+"&from="+request("from");
		}else{
			window.location.href = "topicqanda_record.html?id="+topicID+"&from="+request("from");
		}
		}
	});

    totFansCount = groups.sponsor.totFans;
	//回答者信息
	$('#answer_author_pic_id').attr("src",insertImgType(groups.sponsor.headPic, 3));
	$('#answer_author_nickName_id').text(groups.sponsor.nickname);
	$('#answer_author_pic_id').after(userLevelStr(groups.sponsor.masterLvl,groups.sponsor.loupanId));
    $('#answer_author_fans_id').text(groups.sponsor.totFans+"粉丝");
    $('#answer_author_lable_id').text(groups.sponsor.title);
    $('#answer_author_pic_id').click(function(){
    	// createStatWithParamlog(window.location.href,"click","2",window.location.search);
        gotoUser_pageHtml(groups.sponsor.id);
    })
	//添加关注
    $('#expert-follow').append(isFocusStr(groups.sponsor.id,groups.sponsor.focusStatus));

    //答主 评论个数
    $('#answerCount').text(groups.vipUserCnt);
    $('#commnetCount').text(groups.answerTimes+groups.replyTimes);  

    //精选 最新的操作
    $('#newId').click(function(){
    	if (sortType!=1) {
    		currentPage = 1;
			totalPage = 1;
		sortType = 1;
		$(this).addClass("fc-red");
		$('#choicenessId').addClass("fc-grey666").removeClass("fc-red");
		$('#topicqanda-list').html("");
		// getTopicList();
    	}
	});
    $('#choicenessId').click(function(){
    	if (sortType!=0) {
    		currentPage = 1;
			totalPage = 1;
    	sortType = 0;
		$(this).addClass("fc-red");
		$('#newId').addClass("fc-grey666").removeClass("fc-red");
		$('#topicqanda-list').html("");
		// getTopicList();
		}
	});
    
}

//顶部轮播图
function initSwiper(imgArr){
	var mySwiper = new Swiper('.swiper-container',{
		//pagination: '.swiper-pagination',	//索引class
		// loop:true,	//loop模式,你能够无限滑动滑块，到最后一个之后会跳转回第一个
		grabCursor: true,	//值为true时，光标在Swiper上时成手掌状
		paginationClickable: true,	//索引小圆点是否可点
		//autoplay : 3000, //自动播放
		autoHeight : true ,
		onClick: function(swiper){

	        // $('#js-gallery-swiper').fadeOut(1000);
	       // alert('你tap了Swiper');
	       // $('.video_dialog').show();
	       // alert(mySwiper.activeIndex); 
	       // $('#myVideo').show();
	    },
	});
	// imgArr.length
	for (var i = 0; i < 1; i++) {
		mySwiper.appendSlide('<div class="swiper-slide">'+
								'<img src="'+imgArr[i]+'">'+
							'</div>');
	};
}

//动态随机一个整数
function getRandom(min, max){
	var r = Math.random() * (max - min);
	var re = Math.round(r + min);
	re = Math.max(Math.min(re, max), min)
	return re;
}
// 4.3 获取topic回答及评论列表
// 4.3.1 上行
// url:getTopicPageCommentList
// data:{"page":"","id":"","sortType":"0-精选，1-最新","justAnswer":"0-全部都包括，1-只有回答"}
// 4.3.2 下行
// var result = { 
// 	"result":"success",//success/failure
// 	"message":"错误原因，只有result=failure时才需要处理",
// 	"data":{"page":"","list":""}
// }


//列表UI
function configListUI(groups,index){
	var autoLoad = flag;
	for (var i = 0; i < groups.length; i++) {
			var currentIndex = i+((currentPage-1)*groups.length);
		$('#topicqanda-list').append(commonList(groups[i],index,currentIndex));
		currentCommentPageArr[index][currentIndex] = 1;
		totalCommentPageArr[index][currentIndex] = 0;
		if (index==0) {
			if (groups[i].replyTimes<=0) {
			$('#showComment_'+groups[i].id).css("opacity","0.3");
			}else{
				var commentStr = "";
				var count = groups[i].subComments.length;
				count = count>3?3:count;
				for (var j = 0; j < count; j++) {
					commentStr += commentCell(groups[i].subComments[j],index,groups[i].id);
				}
				$('#commentDiv_'+groups[i].id).fadeIn().append(commentStr);
				if (groups[i].subComments.length>3) {
					$('#commentDiv_'+groups[i].id).append('<a onclick="downloadMoreComment('+currentIndex+','+groups[i].id+','+groups[i].id+',1)"  id="downloadMoreComment_'+groups[i].id+'" class="appui_loadmore fs28 fc-greyabc">加载更多</a>');
				}
				if (count>0) {
					$('#showComment_'+groups[i].id+' img').attr('src',hostConf+"../bdt/images/down_more.png"); 
				}
		}
		}
		configListDownUI(groups[i],index);
	};
	//分页操作
	// 判断拼命加载中...按钮是否出现
    if($('#downloadMoreData').length>0){
          $('#downloadMoreData').remove();
    }
    if (groups.length==0) {
        $('#topicqanda-list').html(commonNoMoreContent("暂无评论"));
        // $('.appui-nocontent').css("margin-top":"2rem");
    }
    if (totalPage > currentPage) {
      if (flag==-1) {
          flag = 0;
      };
      $('#topicqanda-list').append('<a id="downloadMoreData" class="appui_loadmore fs28 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (totalPage==currentPage&&totalPage>1) {
        $('#topicqanda-list').append('<a class="appui_loadmore fs28 fc-greyabc">别拉了,已经没有了</a>');
    };

    if (currentPage!=page&&page!=null) {
        downloadMoreData();
    }else if (autoLoad==0&&page!=null){
        page = null;
        var position = readClientSession('topic-position');
        $('#page__bd').scrollTop(position);    
    }
}

function commonList(cell,index,currentIndex){
	if (cell.status==2) {
		return;
	}
	var doStr = "";
	var contentStr = "";
	var currAttitudeStr = "";
	// currAttitude：0-当前是踩，1-赞，2-无表示
	if (cell.currAttitude==1) {
		currAttitudeStr = "on fc-red";
	}
	
	var levelStr = userLevelStrOfQA(cell.author.masterLvl,cell.author.loupanId);
	if (cell.voiceUrls!=""&&cell.voiceUrls.length>0) {
		<!--回答或评论-语音回答-->	
		// playAudioClickFunction(599,1,1,'a_play_0_599');
		contentStr ='<div class="answer-comment">'+
						'<div class="appui-qanda-answer">'+
							'<div class="appui-qanda-answerstyle voice free" id="a_play_'+index+'_'+cell.id+'" onclick = "playAudioClickFunction('+cell.id+',1,1,\'a_play_'+index+'_'+cell.id+'\');">'+
								'<i></i>'+
								'<span class="appui_qanda-voice-wave">'+
									'<em class="wave1"></em>'+
									'<em class="wave2"></em>'+
									'<em class="wave3"></em>'+
								'</span>'+
								'<em class="tips">免费收听</em>'+
								'<span class="appui_qanda-voice-wait" style="display:none;"></span>'+
							'</div>'+
							'<em class="appui-qanda-answer-time">'+cell.voiceLength+'"</em>'+
							'<span class="appui-qanda-answer-listen">'+cell.listenUserTimes+'人收听</span>'+
						'</div>'+
					'</div>';
	}else{
		var imageStr = "";
		var commentStr = "";
		var userStr = "";
		if (cell.pics!=null&&cell.pics.length>0) {
			<!--回答或评论-图片-->				
			imageStr =  '<div class="answer-piclist" id="answer-piclist'+cell.id+'">'+
						'</div>';
		}
		// subType 0评论 1回答
		// }else if (cell.subType==0) {
		// 	<!--回答或评论-文字回答 是否@人-->
			userStr = isCommentList(cell);
		// }
		<!--回答或评论-文字回答-->
		contentStr ='<div class="answer-comment">'+
						'<div class="show-text hide-text fc-black fs28" onclick="openOrClose('+cell.id+')" id="showMore'+cell.id+'">'+
							// '<a class="fc-blue">@小福福</a><i class=" fc-blue mr5 ml5">||</i>'+
							// '<p id="content'+cell.id+'">'+cell.content+'</p>'+
							userStr+
							// '<span class="more-text fs24 fc-blue"><i>更多</i><img src="../../bdt/images/moretext.png" /></span>'+
						'</div>'+
						imageStr+
					'</div>';
	}
	var titleStr = "";
	if (cell.author.title!=""&&cell.author.title.length>0&&cell.author.title!=null) {
		titleStr = '<i class="line bg-greyd"></i>'+
						'<p class="fc-greyabc fs24">'+cell.author.title+'</p>';
	}
	var dainzanAndPinglunStr = "";
	if (cell.status!=2) {
		var showCommentStr = "";
		if (sortType!=1) {
			showCommentStr = '<span class="show-comment" id="showComment_'+cell.id+'" onclick="showCommentList('+cell.id+','+index+','+currentIndex+')"><img src="../bdt/images/up_more.png" /></span>';
		};
		dainzanAndPinglunStr = 	'<div class="statistic">'+
									'<a class="like '+currAttitudeStr+'" onclick="dianzanClick('+cell.id+')" id="dianzan'+cell.id+'">'+cell.agreeTimes+'</a>'+
									'<a class="comment ml10" id="pinglun_'+cell.id+'" onclick="commentClick('+cell.id+','+cell.id+')">'+cell.replyTimes+'</a>'+
								    showCommentStr+
								'</div>';
	}
	var authorTitle = "";
	if( cell.author.title != null && cell.author.title != "" && cell.author.title.length != 0){
		authorTitle = '<i class="line bg-greyd"></i><p class="fc-greyabc fs24">'+cell.author.title+'</p>';
	}else{
		
	}
	doStr = '<div class="topicqanda-item bg-white mb10" id="topic'+cell.id+'">'+
				'<a class="topicqanda-headpic" onclick="gotoUser_pageHtml('+cell.author.id+')">'+
					'<img src="'+insertImgType(cell.author.headPic,2)+'" />'+
					levelStr+
					// '<i><img id="answer_author_lvl_pic_id" src="../../bdt/images/vip2.png" /></i>'+
				'</a>'+
				'<div class="topicqanda-item-info">'+
					'<div class="name-label">'+
						'<a class="fc-black fs28" onclick="gotoUser_pageHtml('+cell.author.id+')">'+cell.author.nickname+'</a>'+
						authorTitle+
						
					'</div>'+
					contentStr+
					'<div class="time-statistic fc-greyabc fs22">'+
						'<span>'+getDateDiff(cell.addTime)+'</span>'+
						dainzanAndPinglunStr+
						// '<a class="comment ml10" id="comment'+cell.id+'" onclick="commentClick('+cell.id+')">'+cell.replyTimes+'</a>'+
						// '<a class="like ml10 '+currAttitudeStr+'" onclick="dianzanClick('+cell.id+')" id="dianzan'+cell.id+'">'+cell.agreeTimes+'</a>'+
						//'<i>'+groups[i].listenUserTimes+'人收听</i>'+
					'</div>'+
				'</div>'+
				'<div class="topicqanda-item-comment bg-greyfa b-t-grey" style="display:none;" id="commentDiv_'+cell.id+'">'+

					// '<div class="comment-item bc-grey">'+
					// 	'<div class="comment-item-author">'+
					// 		'<a>'+
					// 			'<i><img src="../../bdt/images/photo/user_1_80.jpg"></i>'+
					// 			'<span class="ml5">'+
					// 				'<i class="fs30 fc-navy">eric</i>'+
					// 				'<i class="fs20 fc-greyabc">刚刚发表</i>'+
					// 			'</span>'+
					// 		'</a>'+
					// 	'</div>'+
					// 	'<div class="comment-item-content fs30 fc-black  face_tag">翻噶为尬围观vAWE官方v围观</div>'+
					// '</div>'+
					// '<div class="comment-item bc-grey">'+
					// 	'<div class="comment-item-author">'+
					// 		'<a>'+
					// 			'<i><img src="../../bdt/images/photo/user_1_80.jpg"></i>'+
					// 			'<span class="ml5">'+
					// 				'<i class="fs30 fc-navy">eric</i>'+
					// 				'<i class="fs20 fc-greyabc">刚刚发表</i>'+
					// 			'</span>'+
					// 		'</a>'+
					// 	'</div>'+
					// 	'<div class="comment-item-content fs30 fc-black  face_tag">啊我噶为噶为尬围观</div>'+
					// '</div>'+

				'</div>'+
			'</div>'
	return doStr;
}

//展开评论按钮
function showCommentList(id,index,currentIndex){
	var pinglunCount = $('#pinglun_'+id).text();
	if (pinglunCount==0) {
		return;
	}
	var path = $('#showComment_'+id+' img')[0].src;
	if (path==hostConf+"/bdt/images/up_more.png") {
		$('#commentDiv_'+id).fadeIn();
		if (totalCommentPageArr[index][currentIndex]==0) {
			requestCommentList(id,index,currentIndex,id);
		}
		$('#showComment_'+id+' img').attr('src',hostConf+"/bdt/images/down_more.png");
	}else{
		$('#commentDiv_'+id).fadeOut();
		$('#showComment_'+id+' img').attr('src',hostConf+"/bdt/images/up_more.png");
	}
}

//评论列表的网络请求
function requestCommentList(id,index,currentIndex,rootId){
	dataLoading("数据加载中...");
	$.ajax({
		type:"post",
		url:getPageTopicAnswerCommentList,
		dataType:"json",
		async: true,
		// data:{"page":"获取页","pernum","每页行数","contentType":"内容类型，3-话题","id":"主内容的id，对于话题就是话题的id","subRootId":"子内容id，对于话题就是回答的id"},
		data:{"page":currentCommentPageArr[index][currentIndex],"id":topicID,"contentType":3,"subRootId":id},
		success:function(result){
			clearToastDialog();
			if(result.result=="success"){
				// if (result.data.list.length>0) {
					if (currentCommentPageArr[index][currentIndex]==1) {
						$('#commentDiv_'+rootId).html(""); 
					}
					currentCommentPageArr[index][currentIndex] = result.data.page.currentPage;
					totalCommentPageArr[index][currentIndex] = result.data.page.pages; 
					configCommentUI(result.data.list,index,currentIndex,id,rootId);
				// }else{
				 // $('.comment-list-con').append('<a class="appui_loadmore fs28 fc-greyabc">暂无更多评论</a>');
				// }
			}else{
				dataLoadedError(result.message);
			}
		}
	});
}
//评论请求列表
function configCommentUI(groups,index,currentIndex,id,rootId){
	var commentStr1 = "";
	// var type = "";
	for (var i = 0; i <groups.length ; i++) {
			commentStr1 += commentCell(groups[i],index,rootId);
	};
	$('#commentDiv_'+id).append(commentStr1); 
	 //判断加载更多按钮是否出现
	if($('#downloadMoreComment_'+id).length>0){
		$('#downloadMoreComment_'+id).remove();
	}
	if (groups.length==0) {
		$('#commentDiv_'+id).html('<a class="appui_loadmore fs28 fc-greyabc" id="noComment_'+id+'">暂无更多评论</a>');
	};
	if (currentCommentPageArr[index][currentIndex]!= totalCommentPageArr[index][currentIndex]&&groups.length!=0) {
		$('#commentDiv_'+id).append('<a onclick="downloadMoreComment('+currentIndex+','+id+','+rootId+')"  id="downloadMoreComment_'+id+'" class="appui_loadmore fs28 fc-greyabc">加载更多</a>');
	} 
	//取消按钮
	$('#appiu_js_page-cancel').stop().click(function(e) {
		$('#js-bg').fadeOut();
		$('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300)
	});
}
	
function commentCell(cell,index,rootId){
	var commentStr = '<div class="comment-item" id="commentListID_'+cell.id+'">'+
//						'<div class="comment-item-author">'+
//							'<a onclick="gotoUser_pageHtml('+cell.author.id+')"><i><img src="'+insertImgType(cell.author.headPic,2)+'" /></i>'+
//								'<span class="ml5">'+
//									'<i class="fs30 fc-navy">'+cell.author.nickname+'</i>'+
//									'<i class="fs20 fc-greyabc">'+getDateDiff(cell.addTime)+'</i>'+
//								'</span>'+
//							'</a>'+
//						'</div>'+
						typeComment(cell,index,rootId)+
					'</div>';
	return commentStr;
}

function typeComment(cRecord,index,rootId){
		var str = "";
		var textContent = cRecord.content;
		if(cRecord.status==2){
			textContent = "<i class=\"deletestyle\">"+textContent + "</i>";
		}

		if (cRecord.toUser==null) {
			str = '<div onclick="commentClick('+cRecord.id+','+rootId+',\''+cRecord.author.nickname+'\')" id="comment_'+cRecord.id+'" class="comment-item-content paddingtopleft0 fs28 fc-black face_tag">'+
					'<span class="fc-navy">'+cRecord.author.nickname+'</span>:'+
						textContent+
					'</div>';
					
					
		}else{
				str = '<div onclick="commentClick('+cRecord.id+','+rootId+',\''+cRecord.author.nickname+'\')" id="comment_'+cRecord.id+'" class="comment-item-content paddingtopleft0 fs28 fc-black face_tag">'+
						'<span class="fc-navy">'+cRecord.author.nickname+'</span>'+
						'<span class="fc-black mr5 ml5">回复</span>'+
						'<a class="fc-navy" onclick="gotoUser_pageHtml('+cRecord.toUser.id+')">'+cRecord.toUser.nickname+'</a>:'+
						textContent+
					'</div>';
		}
		return str;
}
function downloadMoreComment (currentIndex,id,rootId,init){
	if (init!=1) {
	currentCommentPageArr[sortType][currentIndex]++;
	}
	
	requestCommentList(id,sortType,currentIndex,rootId);
}


function configListDownUI (cell,index) {
	if ($('#showMore'+cell.id).height()>60) {
		$('#showMore'+cell.id).height("3rem");
		$('#showMore'+cell.id).append('<span class="more-text fs24 fc-blue"><i>更多</i><img src="../../bdt/images/moretext.png" /></span>');
	};

	//判断是否含有图片；
    if (cell.pics!=null&&cell.pics.length>0) {
        var imgArr = cell.pics.split(",");
        var resImgArr = new Array();
        var imgStr = "";
        var count = imgArr.length>3?3:imgArr.length;
        for (var j = 0; j < count; j++) {
        	imgStr += '<span><img src="'+imgArr[j]+'" /></span>';
            resImgArr[j] = imgArr[j].replace("_min","");
        };
        $("#answer-piclist"+cell.id).append(imgStr);
        $.each($('#answer-piclist'+cell.id+' span'),function(index, val) {
            $(this).on('click', function() {
                // imageClickFunction(resImgArr,index);
                show_img(resImgArr,index);
            });
        });
    }	  
}

function openOrClose(id){
	if ($('#showMore'+id).height()==60) {
		$('#showMore'+id).height("auto").removeClass('hide-text');
		$('#showMore'+id).find('.more-text>i').text('收起');
	}else if ($('#showMore'+id).height()>60) {
		$('#showMore'+id).height("3rem").addClass('hide-text');
		$('#showMore'+id).find('.more-text>i').text('更多');
			}
	// $('.show-text').each(function(index, element) {
	// 	$(this).click(function(e) {
	// 		if ($(this).find('.more-text>i').length>0) {
	// 			$(this).toggleClass('hide-text');
	// 			$(this).find('.more-text>i').text() == '更多' ? $(this).find('.more-text>i').text('收起') : $(this).find('.more-text>i').text('更多');
	// 		}
	// 	});
	// });
}
//图片轮播
function show_img(imgArr,index){
	imageClickFunction(imgArr,index);
}
//拼命加载中...时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    // getTopicList();
}


//判断是否有@数组
function isCommentList(groups1){
	var contentStr = "";
	if (groups1.status==2) {
		contentStr = '<p style="font-style:italic;color:#DDD" id="content'+groups1.id+'">'+groups1.content+'</p>';
		return contentStr;
	};
	if (currentId==topicID) {
		contentStr = '<p id="content'+groups1.id+'">'+groups1.content+'</p>';
		return contentStr;
	};
	var commentListCount = groups1.commentList.length;
	if (commentListCount&&groups1.subType==0){
		for (var j = 0; j < commentListCount; j++) {
			if (j > 0) {
				contentStr += '<a class="fc-blue" onclick="gotoUser_pageHtml('+groups1.commentList[j-1].author.id+')">'+
								'<i class="ml5 fc-black"></i>//@'+groups1.commentList[j-1].author.nickname+'<span class="fc-black">:回复</span></a>'+

								'<a class="fc-blue" onclick="gotoUser_pageHtml('+groups1.commentList[j].author.id+')">'+
								'<i class="ml5 fc-black"></i>@'+groups1.commentList[j].author.nickname+'</a>:'+
								groups1.commentList[j-1].content;
								// '<span class="fc-navy">//@'+groups1.commentList[j].author.nickname+'</span>';

			}else{
				var content = "";
				// if (groups1.commentList[j].content==null||groups1.commentList[j].content.length==0||groups1.commentList[j].content=="") {
				// 	content = "语音";
				// }else{
					content = groups1.content;
				// }
				 contentStr += '<a class="fc-blue" onclick="gotoUser_pageHtml('+groups1.commentList[j].author.id+')">'+
			 	                '<span class="fc-black">回复</span>'+
				 					'<i class="ml5 fc-black"></i>@'+groups1.commentList[j].author.nickname+'</a>:'+
			 					content;
				 // '<span class="fc-navy">//@'+groups1.commentList[j].author.nickname+'</span>';
			}
		};
	}else{
		contentStr = '<p id="content'+groups1.id+'">'+groups1.content+'</p>';
	}
	return contentStr;
}

var ddClick = true;
//点赞点踩界面
function dianzanClick(id){
	if (ddClick == true) {
		ddClick = false;
	if ($('#dianzan'+id).hasClass("on")) {
		zanOrCaiRequest(0, 1,id);
	}else{
		zanOrCaiRequest(1, 1,id)
	}
	}
}
//data:{"articleId":1,"type":"0-取消操作，1-执行操作","status":"0-踩，1-点赞","userId":"userId"}
function zanOrCaiRequest(type, status,id) {
	if(userTest == null){
		userTest = getSessionUser();
	}else{
     //currAttitude：0-当前是踩，1-赞，2-无表示
    $.ajax({
        type: "post",
        url: getSetLikeOrOppose,
        dataType: "json",
        async: true,
        data: {
            "id": id,
            "type": type,
            "status": 1,
            "userId": userTest.id,
            "contentType":3,
            "targetType":0,
        },
        success: function(result) {
            if (result.result == "success") {
            	ddClick = true;
                //"data":{"currStatus":"当前态度：0-踩，1-点赞，2-无表情","totLikes":"总点赞人数","totOppose":"总点踩人数"}
                var zanCount = $('#dianzan'+id).html();
                if (result.data.currStatus==1) {
                    $('#dianzan'+id).addClass('on fc-red');
                    dataLoadedSuccess("点赞成功");
                    $('#dianzan'+id).text(parseInt(zanCount)+1);
                }else if (result.data.currStatus==2) {
                    dataLoadedSuccess("取消成功");
                    $('#dianzan'+id).text(parseInt(zanCount)-1);
                    $('#dianzan'+id).removeClass('on fc-red');
                }
               }
           }
    });
}
}


//评论界面
function commentClick(id,rootId,toWho){
	currentRootId = rootId;
	currentId = id;
	var title = "";	
	if (currentId==topicID) {
		title = "回答";
	}else{
		if(toWho != '' && toWho != null && toWho !=undefined){
			title = "回复"+toWho;
		}else{
		title = "评论";
	}
	}
	$('#titleID').text('').text(title);
	$('#container-pop').fadeIn(500);
}
function cancleBtn(){
	setTimeout(function(){friendTips("是否要放弃您当前编辑的内容？","放弃","继续编辑",1);},500);
	
}
function sendBtn(){
	var commentText = $.trim($('#edit-mark').val());  // 用jQuery的trim方法删除前后空格
	//此处应该增加一些判断评论内容的合法性。
	commentText = HTMLEncode(commentText); 
	if (commentText == ''){
		dataLoadedError("评论内容不合法");
	}else{
		if (ddClick==true) {
			ddClick = false;
		if (currentId==topicID) {
			postTopic(commentText);
		}else{
		submitCommentRequest(commentText);
	}
		};
	
}

}

function saveFunction(index){
	if (index==1) {
        // $(".toastDialog").fadeOut(100,$(".toastDialog").remove());
        $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
    };
}

function tipsCancle(){
  $('#container-pop').fadeOut();
}

//普通用户评论话题
function postTopic(content){
	// dataLoading("数据加载中...");
     //dataLoadedError("数据错误");
    $.ajax({
        type: "post",
        url: postTopicAnswer,
        dataType: "json",
        async: true,
		// data:{"topicId":"","deviceType":"1-weixin,2-text","url":"weixin时，输入微信音频上传返回的serverId","answerLen":"","content":"","pics":""}
        data:{"topicId":topicID,"deviceType":2,"url":"","answerLen":"","content":content,"pics":""},
        success: function(result) {
            // clearToastDialog();
            ddClick = true;
            if (result.result == "success") {
				$('#container-pop').fadeOut();
            	$('#edit-mark').val("");

            	// if ($('.appui_loadmore').length>0) {
            	// 	$('.appui_loadmore').before(commonList(result.data.comment,sortType));
            	// }else{
            		$('#topicqanda-list').prepend(commonList(result.data.comment,sortType));
            	// }
            	configListDownUI(result.data.comment,sortType);
            	// var location = $('#topic'+result.data.comment.id).offset().top-$(window).height()+$('#topic'+result.data.comment.id).height()+180;
            	var location = $('#topic'+result.data.comment.id).offset().top+$('#page__bd').scrollTop()-30;
            	// writeClientSession(location,"commentLocation");
            	// if (true) {};
            	// alert(location);
				$('#page__bd').scrollTop(location);
            	// $('#topicqanda-list').append("commonList(cell,sortType)");

            	//答主 评论个数
			    // $('#answerCount').text(groups.vipUserCnt+"个答主回答");
			    var commentCount = $('#commnetCount').text();
			    commnetCount = parseInt(commentCount)+1;
			    $('#commnetCount').text(commnetCount);  

                var cellCommentCount = $('#comment'+currentId).text();
                cellCommentCount = parseInt(cellCommentCount)+1;
				$('#comment'+currentId).text(cellCommentCount);  
            }else {
               dataLoadedError(result.message);
            }
        }
    });

}

function submitCommentRequest(commentText){
	var targetType =0;
	if (currentId==topicID) {
		targetType = 1 ;
	}
	$.ajax({
        type: "post",
        url: submitComment,
        dataType: "json",
        async: true,
		// data:{"id":"id","contentType":"1-文章，2-问答, 3-topic","textContent":"文字内容","forwardStatus":"0-不转发，1-同时转发"}
        data:{"id":currentId,"contentType":3,"textContent":commentText,"forwardStatus":0,"targetType":targetType},        
        // data:{"page":currentPage,"id":id,"sortType":sortType},
        success: function(result) {
        	ddClick = true;
            if (result.result == "success") {
            	$('#container-pop').fadeOut();
            	$('#edit-mark').val("");

            	//最新1 精选0
            	if (currentRootId!=currentId&&sortType==1) {
            	if ($('.appui_loadmore').length>0) {
            		$('.appui_loadmore').before(commonList(result.data.comment,sortType));
            	}else{
            		$('#topicqanda-list').append(commonList(result.data.comment,sortType));
            	}
            	configListDownUI(result.data.comment,sortType);
	            	var location = $('#topic'+result.data.comment.id).offset().top+$('#topic'+result.data.comment.id).height()+$('#page__bd').scrollTop();
				$('#page__bd').scrollTop(location);
            	}else{
					var path = $('#showComment_'+currentRootId+' img')[0].src; 
					if (path==hostConf+"../bdt/images/up_more.png") {
						$('#showComment_'+currentRootId).css("opacity","1");
						$('#showComment_'+currentRootId+' img').attr('src',hostConf+"../bdt/images/down_more.png"); 
					}
					// 	showCommentList(currentId,index,currentIndex);
					// }else{
						$('#commentDiv_'+currentRootId).show();
            		$('#commentDiv_'+currentRootId).prepend(commentCell(result.data.comment,0,currentRootId));
            		var pinglunCount = $('#pinglun_'+currentRootId).text()
            		pinglunCount = parseInt(pinglunCount)+1;
            		$('#pinglun_'+currentRootId).text(pinglunCount);
					// }
            		// 
            	}

			    var commentCount = $('#commnetCount').text();
			    commnetCount = parseInt(commentCount)+1;
			    $('#commnetCount').text(commnetCount);  

                var cellCommentCount = $('#comment'+currentId).text();
                cellCommentCount = parseInt(cellCommentCount)+1;
				$('#comment'+currentId).text(cellCommentCount);  

            }else{
                 dataLoadedError(result.message);
            }
        }
    });
}

function myClose(){
 //   if (backBool == 1) {
//        removeClientSession('topic-position');
//        removeClientSession('topic-page');
//        removeClientSession('topic-sortType');
//    }else{
//        var position = $('#page__bd').scrollTop();
//        writeClientSession('topic-sortType',sortType);
//        writeClientSession('topic-position',position);
//        writeClientSession('topic-page',currentPage);
//    }
}