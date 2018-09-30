// qanda_detail.js
var g_page_circleType = 2;
var g_page_qz_joinStatus = 1;
var dianzanBool = 0;
var diancaiBool = 0;
var collectionBool = 0;
var nicknameStr ="";
var userTest = "";

var qaId = "";
//var typeId = "";
// var answerIDArray = new Array();
// var localAnswerIDArray = new Array();
// var sectionPlay = 0;
var params = "";
var flag = 0;
var currentPage = 1;
var answerID = "";

var showMsgText = "";
var showIndex=1;
var anchorNode,focusNode,anchorNodeParent,focusNodeParent;
var params = "";


var fromReq = "";
var currUser = "";

var USER_TYPE_OT = 0;//第三者
var USER_TYPE_QU = 1;//提问者
var USER_TYPE_AN = 2;//回答者
var currUserType = USER_TYPE_OT;
var rotateDeg = 0;
var firstAppendCanvas = true;

var commentlocationID = "";
var couponsCount = 0;
var listenDispalyStatus = 0;
var questionFee = 0;
var couponCount = 0;
var answerUserFansCount = 0;

var shareResult = null;

var circleBgPic;
var circleHostNickName;
//app需要的参数
// var appType = readClientSession("appType");
$(document).ready(function() {

	
    // $('body').append(configCommentUI(300));//动态向页面增加评论框容器（隐藏）300:最多评论输入字数
    // stopVoiceFunction();//停止语音播放

    commentlocationID = request('targetId');



	// requestCommentList(qaId,2,2);//请求问答

    $(".page__bd").scroll(function(){
        if (flag==0) {
            var a = "";
            if ($('#loadMore').length>0) {
                a = document.getElementById("loadMore").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {//div在可视范围
                    flag = -1;
                    downloadMoreData();
                }
            }
        };
    });



	// 打赏按钮事件绑定
	$('#rewardBtn').click(function(){
		openRewardPage(request("id"),2,$("#asker_pic_id").attr("src"));
	});
	// GetRewardRecordList(request("id"),2);
});

//完全加载
$(window).load(function(){

});



//初始化信息
function getQaDetailRequest(){
  dataLoading("数据加载中...");
  $.ajax({
        type: "post",
        url: getQaDetail,
        dataType: "json",
        async: true,
        data:{"qaId":qaId},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
            	shareResult = result.data.qaShow;
            	if(currUser != null && currUser.id == shareResult.answerUser.id && shareResult.status==1 && shareResult.aStatus==0 ){
            		customHistoryUtilsPop();
            		window.location.replace("/circle_qanda_record.html?id="+shareResult.id+"&reAnswer=2");
            	}else{
            		configQaDetail(result.data.qaShow);
            		configwxShare(shareResult);
                	setCommentScroll();// 定位评论位置
            	}
            }else{
                dataLoadedError(result.message);
            }
        }
    });
}

//配置初始化问答详情页面
function configQaDetail(qaShow){
	// configwxShare(qaShow);
	answerID = qaShow.answerUser.id;
	listenDispalyStatus = qaShow.listenDispalyStatus;
	if (currUser!=null) {
		if(qaShow.qustionUser.id==currUser.id){
			currUserType = USER_TYPE_QU;
		}else if(answerID==currUser.id){
			currUserType = USER_TYPE_AN;
//          $("#qanda_act_id").show();
//			$('#rewardBtn').show();
		}
//		else{
//			$("#qanda_act_id").show();
//			$('#rewardBtn').show();
//		}
	}

	//优惠券
	//if(listenDispalyStatus==0&&qaShow.qfee>0){
		$.ajax({
			url: getMyCouponsCount,
			type: 'post',
			dataType: 'json',
			data: {"conponsType":"围观券"},
			success: function (result){
				if (result.result == "success") {
					if(result.data.couponsCount>0){
						$("#coupon_count_div").show();
						$("#hasCouponSpace").show();
						$("#noneCouponSpace").hide();
						$("#coupon_count_id").text(result.data.couponsCount);
						couponCount = result.data.couponsCount;
						$("#coupon_count_close").on('click', function(event) {
							event.preventDefault();
							$("#coupon_count_div").hide();
							$("#hasCouponSpace").hide();
							$("#noneCouponSpace").show();
						});
					}
					normalOrShareShowCoupons();
				}
			}
		});
	//}
    
	//标题
    $("#title_id").text(qaShow.qustionUser.nickname+"的提问");
    
    //得到圈子信息，看看这个人后没有创建圈子，如果则显示，没有则隐藏
	getQzInfo(qaShow.publishLocationId,"答主", qaShow);
	
	//价格
	questionFee = qaShow.listAFee;
	if(qaShow.listAFee>0){
		$("#price_id").text("￥"+qaShow.listAFee);
		if((qaShow.status == 1 && qaShow.payPype == 2)&&(currUserType==USER_TYPE_QU || currUserType == USER_TYPE_AN)){
			//使用优惠券
			$("#price_line_id").show();
			$("#price_coupon_id").show();
		}
	}else{
		$("#price_id").text("免费");
	}
    
	//原提问
	$('#asker_pic_id').attr("src",insertImgType(qaShow.qustionUser.headPic, 3));//提问者头像
	$('#asker_pic_id').click(function(){
		createStatWithParamlog(window.location.href,"click","1",window.location.search);
		gotoUser_pageHtml(qaShow.qustionUser.id);
	})
	$('#asker_nickname_id').text(qaShow.qustionUser.nickname);//提问者昵称
	$('#asker_addtime_id').text(getDateDiff(qaShow.addTime));//提问时间
	$('#asker_content_id').html(qaShow.content);//原问题
	if (qaShow.pics!=null&&qaShow.pics.length>0) {//判断是否含有图片
		$('#asker_content_pic_id').show();
		var imgArr = qaShow.pics.split(",");
		var resImgArr = new Array();
		var imgStr = "";
		for (var i = 0; i < imgArr.length; i++) {
			imgStr += '<span><img src="'+imgArr[i]+'" /></span>';
			resImgArr[i] = imgArr[i].replace("_min","");
		};
		$('#asker_content_pic_id').append(imgStr);
	
		$.each($("#asker_content_pic_id span"),function(index, val) {
			$(this).on('click', function() {
				imageClickFunction(resImgArr,index);
			});
		});
	}
    if(qaShow.topicId>0){//如果问答是话题，显示引导回话题内容
    	var topicSrc = "topicqanda.html?id="+qaShow.topicId;
    	$("#topicqanda_back").attr("href",topicSrc);
    	$("#topicqanda_pic").attr("src",qaShow.topicShow.pics.split(",")[0]);
    	$("#topicqanda_back").show();
    }else{
    	$("#topicqanda_back").hide();
    }

    //原回答
	if (qaShow.aStatus == 1) {//已回答
		var tips = "";
		var class_state = "free";
		var class_state2= "voice";
		var answer_mode_ware = true; 
		$("#answer_main_id_1").show();//显示回答
		//收听状态，用户客户端判断  0-付费，1-免费，2-限次免费
		// private byte listenDispalyStatus;
		//回答类型 1-语音，2-文字
		if(currUser==null){
			tips = "登录";
		}else if(listenDispalyStatus==0) {
			if(qaShow.qfee>0){
				tips = qaShow.qfee+"元";
				class_state = "pay";
			}else{
				 tips = "免费";
			}
		}else if (listenDispalyStatus==1) {
			tips = "免费";
		}else if (listenDispalyStatus==2) {
			tips = "限次";
			class_state = "time";
		}
		if(qaShow.answerType==1){
			if (tips=="限次") {
				tips ="限次免费";
	    	}else{
				tips =tips +"收听";
	    	}
			$('#voice_state_time_id_1').html(qaShow.answerLen+"&quot;");
			$('#voice_state_time_id_1').show();
		}
		else{
			if(currUser==null||(listenDispalyStatus==0&&qaShow.qfee>0)){//未登录不可以查看，所以当currUser==null时要显示登录查看
				class_state2 ="pictext";
			}
			else{
			   answer_mode_ware = false;
			}
			if (tips=="限次") {
				tips ="限次免费";
	    	}else{
				tips =tips +"阅读";
	    	}
		}
		if(answer_mode_ware==true){
			$('#voice_state_text_id').text(tips);  
			$('#voice_state_id').addClass(class_state);
			$('#voice_state_id').addClass(class_state2);
			$("#answer_wave_mod_id").show();
			$("#voice_state_id").click(function(){
				if(currUser == null){
					getSessionUser();
				}else{
					//lhj mod
					var srId = request("srId");
					var srPId = request("srPId");
					if(srId==""||srId==null){
					playAudioClickFunction(qaShow.id,1,1,"voice_state_id");
					}else{
						if(srPId==""||srPId==null){
							srPId = "0";
						}
						playAudioClickFunctionEx(qaShow.id,1,1,"voice_state_id",null,parseInt(srId),parseInt(srPId));
					}
				}
		   });
		}
		else{
			var answerValReg = qaShow.answerText.replace(/\n|\r\n/g,"</p><p class=\"pictext-text fc-grey666\">");
			var answerText = '<p class="pictext-text fc-grey666" id="pictext_text_id_2">'+answerValReg+'</p>';
			$("#answer_picmod_mod_id").prepend(answerText);
			if (qaShow.answerPic!=null&&qaShow.answerPic.length>0) {//判断是否含有图片
				$('#pictext_pic_id').show();
				var imgArr = qaShow.answerPic.split(",");
				var resImgArr1 = new Array();
				var imgStr = "";
				for (var i = 0; i < imgArr.length; i++) {
					imgStr += '<span><img src="'+imgArr[i]+'" /></span>';
					resImgArr1[i] = imgArr[i].replace("_min","");
				};
				$('#pictext_pic_id').append(imgStr);
				
				$.each($("#pictext_pic_id span"),function(index, val) {
					$(this).on('click', function() {
						imageClickFunction(resImgArr1,index);
					});
				});
			}
			$("#answer_picmod_mod_id").show();

		}
		
		//回答时间、偷听人数、赞
		var listenOrReadStr = "";
		if(qaShow.aStatus==0){
			listenOrReadStr = "人围观";
		}else if(qaShow.answerType==1){
			listenOrReadStr = "人听过";
		}else{
			listenOrReadStr = "人看过";
		}
		$('#answer_time1').text(getDateDiff(qaShow.answerTime));//回答时间
		$('#listen_times_id_1').text(qaShow.listenUserTimes+listenOrReadStr);//收听人数
    }
	$('#ask_time_id_1').text(getDateDiff(qaShow.addTime));
      
      
	//追问
	if (qaShow.addQuestion!=null&&qaShow.addQuestion.length>0) {//判断是否需要显示追加的问题
		$('#add_question_id').show();
		$('#add_question_text_id').text(qaShow.addQuestion);
		$('#ask_time_statistic2').show();
		$('#ask_time_id_2').text(getDateDiff(qaShow.moreAddTime));
	}
	//追问回答
	if(qaShow.add_aStatus>0){
		listenDispalyStatus = qaShow.listenDispalyStatus;
		var tips = "";
		var class_state = "free";
		var class_state2= "voice";
		var answer_mode_ware = true; 
		$("#answer_main_id_2").show();//显示回答
		//收听状态，用户客户端判断  0-付费，1-免费，2-限次免费
		// private byte listenDispalyStatus;
		//回答类型 1-语音，2-文字
		if(currUser==null){
			tips = "登录";
		}else if(listenDispalyStatus==0) {
			if(qaShow.qfee>0){
				tips = qaShow.qfee+"元";
				class_state = "pay";
			}else{
				tips = "免费";
			}
		}else if (listenDispalyStatus==1) {
			tips = "免费";
		}else if (listenDispalyStatus==2) {
			tips = "限次";
			class_state = "time";
		}
		if(qaShow.addAnswerType==1){
			if (tips=="限次") {
				tips ="限次免费";
	    	}else{
				tips =tips +"收听";
	    	}
			$('#voice_state_time_id_2').html(qaShow.addAnswerLen+"&quot;");
			$('#voice_state_time_id_2').show();
		}
		else{
			if(currUser==null||(listenDispalyStatus==0&&qaShow.qfee>0)){
				class_state2 ="pictext";
			}else{
			   answer_mode_ware = false;
			}
			if (tips=="限次") {
				tips ="限次免费";
	    	}else{
				tips =tips +"阅读";
	    	}
		}
		if(answer_mode_ware==true){
			$('#voice_state_text_id_2').text(tips);  
			$('#voice_state_id_2').addClass(class_state);
			$('#voice_state_id_2').addClass(class_state2);
			$("#answer_wave_mod_id_2").show();
			
			$("#voice_state_id_2").click(function(){
				if(currUser == null){
					getSessionUser();
				}else{
					//lhj mod
					var srId = request("srId");
					var srPId = request("srPId");
					if(srId==""||srId==null){
				         playAudioClickFunction(qaShow.id,2,1,"voice_state_id_2");
				    }else{
				    	if(srPId==""||srPId==null){
							srPId = "0";
				    }
						playAudioClickFunctionEx(qaShow.id,2,1,"voice_state_id_2",null,parseInt(srId),parseInt(srPId));
					}

				}
			});
		}
		else{
			var answerValReg2 = qaShow.addAnswerText.replace(/\n|\r\n/g,"</p><p class=\"pictext-text fc-grey666\">");
			var answerText2 = '<p class="pictext-text fc-grey666" id="pictext_text_id_2">'+answerValReg2+'</p>';
			$("#answer_picmod_mod_id_2").prepend(answerText2);
			if (qaShow.addAnswerPic!=null&&qaShow.addAnswerPic.length>0) {//判断是否含有图片
				$('#pictext_pic_id_2').show();
				var imgArr = qaShow.addAnswerPic.split(",");
				var resImgArr2 = new Array();
				var imgStr = "";
				for (var i = 0; i < imgArr.length; i++) {
					imgStr += '<span><img src="'+imgArr[i]+'" /></span>';
					resImgArr2[i] = imgArr[i].replace("_min","");
				};
				$('#pictext_pic_id_2').append(imgStr);
				
				$.each($("#pictext_pic_id_2 span"),function(index, val) {
					$(this).on('click', function() {
						imageClickFunction(resImgArr2,index);
					});
				});
			}
			$("#answer_picmod_mod_id_2").show();
			//$('.answer-common').css({'background':'#fffff6','padding-top':'0.5rem'});
		}
		//回答时间、偷听人数、赞
		//$('#ask_time_id_2').text(getDateDiff(qaShow.moreAnswerTime));
		$('#answer_time2').text(getDateDiff(qaShow.moreAnswerTime));
	}

	//撤回、追问	
	if ((qaShow.status==1||qaShow.status==5)){
		if(currUserType==USER_TYPE_QU){
			//允许撤销按钮出现addAnswerBtn
			if (qaShow.allowdCancel==1) {
				$("#qanda_act_id").show();
				$('#cancle_qe_id').show();
				var time = params.cancelQuestionExpiredTime*60*1000;
				setTimeout("cancleQeHide()",time);
				$('#cancle_qe_id').click(function(){
					cancelQuestionFunction();
				});
			}
			//允许追问按钮出现
			if (qaShow.aStatus==1&&qaShow.addQuestion.length==0&&qaShow.answerUser.feeAddAsk==1&&(getDateDiffMinute(qaShow.answerTime) < params.zhuiWenExpiredTime *60)){
				$("#qanda_act_id").show();
				$('#addQuestion').show();
			}
		}
	   
		//原问题-重答按钮出现
		else if(currUserType==USER_TYPE_AN){			  
			//是否能够重答原问题
			$('#reanswer_id_1').show();
			$('#reanswer_id_1').click(function(){
				friendTips("是否要重新回答这个问题？","取消","确定",2);
			});


			//是否能够重答追问的问题
			//$('#reanswer_id_2').show();
			//$('#reanswer_id_2').click(function(){
				//friendTips("是否要重新回答这个问题？","取消","确定",3);
			//});
 
			//是否能够回答追问的问题
			//if (qaShow.addAnswer==null&&qaShow.addQuestion.length>0) {
				//$("#qanda_act_id").show();
				//$('#addAnswerBtn').show();
				//$('#addAnswerBtn').click(function(){
					//window.location.href = "qanda_record.html?id="+qaId+"&reAnswer=3";
				//});
			//}  
			
			
			//判断追问下面的回答按钮和重答按钮出现
			//#goAnswerAddQuestBtn回答追问按钮
			//#reanswer_id_2重答题追问按钮
			//是否出现追问“回答”按钮
			//if(qaShow.addAnswer==null&&qaShow.addQuestion.length>0){
			if(qaShow.add_aStatus==0&&qaShow.addQuestion.length>0){
				
				$('#goAnswerAddQuestBtn').show();
				$('#goAnswerAddQuestBtn').click(function(){
					window.location.href = "qanda_record.html?id="+qaId+"&reAnswer=3";
				});
			}
			//是否出现追问“重答”按钮
			if(qaShow.add_aStatus==1&&qaShow.addQuestion.length>0){
				$('#reanswer_id_2').show();
				$('#reanswer_id_2').click(function(){
					friendTips("是否要重新回答这个问题？","取消","确定",3);
				});
			}
			
			
		}
	}

	//回答者信息
	//$('#answer_author_pic_id').attr("src",insertImgType(qaShow.answerUser.headPic, 3));
	$('#answer_author_nickName_id').text(qaShow.answerUser.nickname);
	$('#answer_expert1').text(qaShow.answerUser.nickname);
	$('#answer_expert2').text(qaShow.answerUser.nickname);
	//$('#answer_author_pic_id').after(userLevelStr(qaShow.answerUser.masterLvl,qaShow.answerUser.loupanId));
    $('#answer_author_fans_id').text(qaShow.answerUser.totFans+"粉丝");
    $('#answer_author_lable_id').text(qaShow.answerUser.lable);
    answerUserFansCount = qaShow.answerUser.totFans;
	//$('#answer_author_pic_id').click(function(){
		//createStatWithParamlog(window.location.href,"click","2",window.location.search);
		//gotoUser_pageHtml(qaShow.answerUser.id);
	//})

	$('#answer_expert_pic1').attr("src",insertImgType(qaShow.answerUser.headPic, 3));
	$('#answer_expert_pic2').attr("src",insertImgType(qaShow.answerUser.headPic, 3));
	$('#answer_expert_pic1').after(userLevelStr(qaShow.answerUser.masterLvl,qaShow.answerUser.loupanId));
	$('#answer_expert_pic2').after(userLevelStr(qaShow.answerUser.masterLvl,qaShow.answerUser.loupanId));
	$('.answer-expert-name').click(function(){
    	createStatWithParamlog(window.location.href,"click","2",window.location.search);
        gotoUser_pageHtml(qaShow.answerUser.id);
    })
   
    // /**回答状态：0-尚未回答，1-已回答,2-拒绝*/
    // private int aStatus;
    // /**状态：-1未支付，1-正常，0-未审核，2-已删除，3-已撤回*/
    // private int status;

    /** 问答状态-未支付 11;问答状态-未审核 0; 问答状态-正常 1; 问答状态-已删除  2;问答状态-已撤回 3;问答状态-被拒绝 4**/;
    //如果是已经撤回问题界面
    if (qaShow.status==2) {
		$('#expired_text_id').text("已删除");
    }else if (qaShow.status==3) {
		$('#expired_text_id').text("已撤回");
    }else if(qaShow.status==4){
		$('#expired_text_id').text("已拒绝");
    }else if (qaShow.status==1||qaShow.status==5){
        if(qaShow.status==5){
			$('#expired_text_id').text("已过期");
        }
    }; 	
   
	//添加关注
	$('#expert-follow').append(isFocusStr(qaShow.answerUser.id,qaShow.answerUser.focusStatus));
    //显示评论的总数
	if(qaShow.replyTimes>0){
		$('#CommentModule').show();
    	$('#commentCount').text(qaShow.replyTimes);
	}
    
    //判断当前是否赞过
    judgeCaiOrZanOrCollection(qaShow.currAttitude,qaShow.favoriteStatus);//设置文章的转载量，评论个数
    if (parseInt(qaShow.agreeTimes)>0) {
		$('#dianzan span').show();
    };
    if (parseInt(qaShow.favoriteTimes)>0) {
		$('#collection span').show();
    };
    $('#dianzan span').text(qaShow.agreeTimes);
    $('#collection span').text(qaShow.favoriteTimes);
}

//是否重答
function saveFunction(index){
     //reAnswerStr 0 重答原问题 1重答追问，2回答原问题 ,3回答追问
     if (index==2) {
        createStatWithParamlog(window.location.href,"click","3",window.location.search);
        window.location.href = "circle_qanda_record.html?id="+qaId+"&reAnswer=0";
     }else if(index==3){
     	createStatWithParamlog(window.location.href,"click","4",window.location.search);
		  window.location.href = "circle_qanda_record.html?id="+qaId+"&reAnswer=1";
	 }
	 else if (index==1) {
        // $(".toastDialog").fadeOut(100,$(".toastDialog").remove());
        $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
     };
}

//发送追问
function sendAddQuestion(){
    $('#add-qanda-dialog').fadeOut(); 
    var text = $('#zhuiwenQuestionStr').val();
    if (text==null||text.length==0) {
        dataLoadedError("追问不能为空");
    }else{
        $.ajax({
            type: "post",
            url: askQuestionForZhuiwen,
            dataType: "json",
            async: true,
            data:{"qaId":qaId,"content":text},
            success: function(result) {
                if (result.result == "success") {
                    $('#addQuestion').hide();
					location.reload();
                }else{
                    dataLoadedError(result.message);
                }
            }
        });
    }
}

//隐藏撤回
function cancleQeHide(){
    $('#cancle_qe_id').hide();
}

//撤回按钮
function cancelQuestionFunction(){
     $.ajax({
        type: "post",
        url: cancelQuestion,
        dataType: "json",
        async: true,
        data:{"qaId":qaId},
        success: function(result) {
            if (result.result == "success") {
                dataLoadedSuccess("撤销成功");
                $('#expired_text_id').text("已撤回");
                $("#cancle_qe_id").text("已撤回").unbind("click");
                //backFunction();
            }
        }
    });
}

function gotoBack(){
    writeClientSession("fromBorrowBank",1);
    window.history.back(-1);
}

function genShowText(evTxt){
      showMsgText += showIndex+"=="+evTxt+"=="+"anchorNode="+anchorNode+","+anchorNode.outerHTML;
    showMsgText +=",focusNode="+focusNode+","+focusNode.outerHTML+",selectStart="+selectStart+",selectEnd="+selectEnd;
    showIndex++;
}

// 预览图片的配置
function openTheMaxPic(imgArr,indexNum){
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var items = [];
    $.each(imgArr, function(index, val) {
        items.push({"src":val,"w":800,"h":600});
    });
    console.log(items);
        var options = {
            history: true,
            index: indexNum,
            loop: false,
            showAnimationDuration: 0.3,
            hideAnimationDuration: 0.3
        };
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
}

function myClose(){
	removeClientSession("wxShare");
}


//得到圈子信息，有则显示，没有则隐藏  不通的文章来源圈子信息不同
function getQzInfo(id,hostOrAuthor,qaShow){
	$.ajax({
		type:"post",
		url:getQz,
		dataType:"json",
		async: true,
		data:{"id":id},
		success:function(result){
			if(result.result=="success"){
				if(result.data.qzShow!=null){
					circleBgPic = result.data.qzShow.bgPic;
					circleHostNickName = result.data.qzShow.name;
					configwxShare(qaShow);
					configIntoCircleUI(result.data.qzShow,hostOrAuthor);
				}
			}
		}
	});
}

//配置圈子入口广告
function configIntoCircleUI(groups,hostOrAuthor){
	//判断是否加入了
	var openurl="circle_share_detail.html?id="+groups.id+"&from=qanda_detail";
	if(groups.joinStatus==1){
		openurl="circle_page.html?id="+groups.id+"&from=qanda_detail";
	}
	var intoCircleHtml=	'<div onclick="window.location.href = \''+openurl+'\'" class="add-circle-indetail bg-white">'+
							'<h3 class="fc-black fs24">本文来源于'+
								'<span class="fwb ml5 mr5" id="qzusernickname">'+groups.host.nickname+'</span>的圈子'+
								'<span class="fwb ml5 mr5" id="qzname">'+groups.name+'</span>'+
							'</h3>'+
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
	$("#expert-follow").hide();
	// 定位评论位置
	setCommentScroll();
}


//微信分享参数配置
function configwxShare(qaShow){
	//分享朋友圈
	//提问内容
	var wxShareSummary = qaShow.content;
	 //回答者头像
    var answerHeadPic = qaShow.answerUser.headPic;

	//发给好友
	//标题
	//动态文字内容
    var wxShareTitle = qaShow.content;
    //【当前用户】+推荐【圈主名称】圈子的问答给您！
    var wxFriendShareStr = "推荐"+circleHostNickName+"圈子的问答给您！";
    if(currUser!=null){
    	wxFriendShareStr = currUser.nickname+"推荐"+circleHostNickName+"圈子的问答给您！";
    }
    
    //分享头像为回复者头像
    /*var defaultWeixinSharePicUrl = hostConf+"/"+answerHeadPic;*/

    //圈子头像
    var img = hostConf+circleBgPic;
    /*if(qaShow.answer==""){
    	var questionUserHeadPic = qaShow.qustionUser.headPic;
    	defaultWeixinSharePicUrl = hostConf+"/"+questionUserHeadPic;
    }*/
   	//用户点击分享链接进入的页面
   	var realUrl = window.location.href;

    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",img, img,realUrl);
		
}

function getRealUrl(realUser){
	var realUrl = "";

	var paraStr = "&srId=";
	var paraParentStr = "&srPId=";
	var currUrl = window.location.href;

	var urls = currUrl.split("&");
	for(var i=0;i<urls.length;i++){
		if(i==0){
			realUrl = urls[0];
		}else if(urls[i].indexOf("id=")==0){
			realUrl = realUrl+"&"+urls[i];
		}else if(urls[i].indexOf("srId=")==0){
			if(realUser != null && urls[i] != ("srId="+realUser.id)){
				realUrl = realUrl+"&"+urls[i].replace("srId","srPId");
			}
		}
	}
	if(realUser != null){
		realUrl = realUrl+"&srId="+realUser.id;
	}

	return realUrl;
}

//function set_focus(){
//  var el = $("#edit-mark");
//  el=el[0];// jquery 对象转dom对象
//  el.focus();
//  if($.support.msie){
//    var rng;
//    el.focus();
//    rng = document.selection.createRange();
//    rng.moveStart('character',-el.innerText.length);
//    var text = rng.text;
//    for(var i = 0; i < el.innerText.length; i++){
//      if(el.innerText.substring(0,i+1) == text.substring(text.length - i - 1, text.length)){
//        result = i + 1;
//      }
//    }
//  }else{
//    var range = document.createRange();
//    range.selectNodeContents(el);
//    range.collapse(false);
//    var sel = window.getSelection();
//    sel.removeAllRanges();
//    sel.addRange(range);
//  }
//}

//function setStartAndEnd(evTxt){
//	// alert(anchorNode==null);
//	if(anchorNode!=null && anchorNode!="undefined"){
//		//alert(anchorNode.outerHTML);
//	}
//	
//	var el = $("#edit-mark");
//	selection = window.getSelection();
//	anchorNode = selection.anchorNode;
//	if(anchorNode.id=="edit-mark"){
//		anchorNode = document.getElementById("edit-mark");
//	}else if(anchorNode.previousSibling==null){
//		anchorNode = anchorNode.parentNode.firstChild;
//	}else{
//		anchorNode = anchorNode.previousSibling.nextSibling;
//	}
//	focusNode = selection.focusNode;
//	if(focusNode.id=="edit-mark"){
//		focusNode = document.getElementById("edit-mark");
//	}else if(focusNode.previousSibling==null){
//		focusNode = focusNode.parentNode.firstChild;
//	}else{
//		focusNode = focusNode.previousSibling.nextSibling;
//	}
//	
//	selectStart = selection.anchorOffset;
//	selectEnd = selection.focusOffset; 
//	
//	genShowText(evTxt);
//
//}
