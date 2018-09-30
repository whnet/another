// qanda_detail.js
var g_page_circleType = 2;
var g_page_qz_joinStatus = 1;
var dianzanBool = 0;
var diancaiBool = 0;
var collectionBool = 0;
var nicknameStr ="";
var userID = "";

var qaId = request('id');
var typeId = "";
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

var qandaListId = "";

var shareResult = null;
//游戏进来
var fromgame = "";
var active = "";

$(document).ready(function() {
    $('#back').click(function(){
        window.location.href = "javascript:history.back(-1)";
    });
	//打赏按钮事件绑定
	$('#rewardBtn').click(function(){
		$('#container-reward').css('display','block');
    });
    // 展开查看更多
    $(".pay-btn").click(function(){
        id = request('id');
        price_type = $('#price_id').attr('data-type');
        price = $('#price_id').attr('data-price');
        mid = $('#price_id').attr('data-mid');
        if(price_type == 1){
            $.ajax({
                type: "POST",
                url: "/questions/touting.html",
                async:false,
                data: {
                    qid:id,
                    _csrf:$('input[name="csrf"]').val()
                },
                dataType: "json",
                success: function(data){
                    if(data.result == 'error'){
                        // 如果没有付费就引导付费，如果是自己 或者 答主的问题，则直接显示
                        if(data.mid == mid || data.eid == mid){
                            $(".pay-btn").hide();
                            $(".pictext-text").css({"max-height":"100%",})
                        }else{
                            getPayStatus(id,price*100)
                        }
                    }else{
                        // 付费成功的 直接显示
                        $(".pay-btn").hide();
                        $(".pictext-text").css({"max-height":"100%",})

                    }
                }
            });
        }
    });


});
function getPayStatus(id,price){
    $.ajax({
        type: "POST",
        url: "/circle/wxpay.html",
        data: {
            title:'listen',
            pay_id:id,
            price:price,
            _csrf:$('input[name="csrf"]').val()
        },
        dataType: "json",
        success: function(data){
            getWxConfig(data.config.timestamp, data.config.nonceStr,
                data.config.package, data.config.signType, data.config.paySign);
        }
    });
}
//获得支付参数
function getWxConfig(timestamp, nonceStr, package, signType, paySign){
    wx.chooseWXPay({
        timestamp: timestamp,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        paySign: paySign,
        success: function (res) {
        }
    });
}

//生成专属海报提示
function show_prompt(){
	$("#prompt_box").fadeIn();
	$("#prompt_btn").on('click',function(event) {
		event.preventDefault();
		
		dataLoading("您的专属海报生成中");
		canvas_init("0");
	});
	$("#closePrompt").on('click',function(event) {
		event.preventDefault();
		$("#prompt_box").hide();
	});
}
function canvas_init(parent){

	$("#closePosters").on('click',function(event) {
		event.preventDefault();
		$("#posters").fadeOut();
	});
	var realUrl = getRealUrl(currUser)+"&ewm=1&from=qr38";
	$.ajax({
	    url: get38picUrl,
	    type: 'post',
	    dataType: 'json',
	    data: {"userQrUrl":realUrl},
	    success: function (result){
	    	clearToastDialog();		
		    if (result.result == "success") {
				$("#posters").show();	
		    	$("#posters .posterBg").attr("src",result.data.src);
				$("#prompt_box").hide();
				$("#posters h3").show();	
				createStatWithParamlog(window.location.href,"/sharePic.html",parent,window.location.search);
		    }else{
		    	dataLoadedError(result.message);
		    }
		}
	});

}

function showHowToShare(){
	$("#mask_mod").show();
	$("#finishConform2").show();
	$("#finishConform2 .finishTouch2").on('click',function(event) {
		event.preventDefault();
		$("#mask_mod").fadeOut();
	 	$("#finishConform2").fadeOut();

	 	createStatWithParamlog(window.location.href,"/showHowToShare.html","2",window.location.search);
	});
	$("#finishConform2 .closeMail").on('click',function(event) {
		createStatWithParamlog(window.location.href,"/showHowToShare.html","3",window.location.search);
		event.preventDefault();
		$("#mask_mod").fadeOut();
	 	$("#finishConform2").fadeOut();
	});
}
function LocaleDateString(timestamp){
	var newDate = new Date(timestamp);
	var localString = newDate.toLocaleDateString();
	var lastString = localString.substr(localString.length - 4);
	return lastString;
}

// 显示信封
function showMail(){
	var firstShowMail = readClientSession("firstShowMail");
	$("#mail_story .mail_touch").on('click',function(event) {
		$("#mail_story").fadeOut();
		$("#mask_mod").hide();
	});
	$("#mail_story .closeMail").on('click',function(event) {
		$("#mail_story").fadeOut();
		$("#mask_mod").hide();
	});
	//
	if(firstShowMail == null || firstShowMail == "0"){
		$.ajax({
	      	url: checkUserShare38Url,
	      	type: 'post',
	      	dataType: 'json',
	      	data: {},
	      	success: function (result){
		        if (result.result == "success") {
		            if(result.data.newCoupons>0){
						var lists = result.data.coupons;
						for (var i = 0; i < lists.length; i++) {
							useStart = LocaleDateString(lists[i].coupons.useStartTime);
							useEnd = LocaleDateString(lists[i].coupons.useEndTime);
							$("#mail_story h3").text('有效时间:'+useStart+' 至 '+useEnd);
							break;
						}

						$("#mail_story").fadeIn();
						$("#mask_mod").show();
						var sessionNewMessageStatus = readClientSession("newMessageStatus");
						sessionNewMessageStatus.newCouponsStatus = 0;
	            		writeClientSession("newMessageStatus",sessionNewMessageStatus);
						writeClientSession("firstShowMail",1);
						createStatWithParamlog(window.location.href,"/showMail.html","0",window.location.search);
					}
				}
			}
		});
	}
}

//初始化信息
function getQaDetailRequest(){
  // dataLoading("数据加载中...");
  $.ajax({
        type: "post",
        url: 1,
        dataType: "json",
        async: true,
        data:{"qaId":qaId},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
            	shareResult = result.data.qaShow;
            	if(currUser != null && currUser.id == shareResult.answerUser.id && shareResult.status==1 && shareResult.aStatus==0 ){
            		customHistoryUtilsPop();
            		window.location.replace("/qanda_record.html?id="+shareResult.id+"&reAnswer=2");
            	}
            	configwxShare(shareResult);
              configQaDetail(result.data.qaShow);
            }else{
                dataLoadedError(result.message);
            }
        }
    });
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

	return realUrl+"&typeId=0";
}

function configwxShare(qaShow){
	//分享朋友圈标题
	var wxShareSummary = "";
	//分享好友标题
    var wxShareTitle = "";
    //分享内容
    var wxFriendShareStr = qaShow.content;
	//lhj mod
	//var paraStr = "&srId=";
	//var currUrl = window.location.href;
	//var realUrl = "";
	var realUrl = getRealUrl(currUser)+"&ewm=0";
	//说明是分享进来的
	//var index = currUrl.indexOf(paraStr);
    //语音
    var listenOrLookStr = "";
    if(qaShow.aStatus == 0){
    	listenOrLookStr = "围观";
    }else if(qaShow.answerType==1){
        listenOrLookStr = "听听";
    }else{
        listenOrLookStr = "看看";
    }


    	//我推荐【行家名称】回答的问题，你也来看看吧
    	wxFriendShareStr = "推荐"+qaShow.answerUser.nickname+"回答的问题，你也来"+listenOrLookStr+"吧！";
		if (currUser!=null){
			//【分享者名称】+推荐【专家名称】+回答的问题，你也来听听吧！
			//我推荐【行家名称】回答的问题，你也来看看吧
			//wxFriendShareStr = currUser.nickname+"推荐"+qaShow.answerUser.nickname+"回答的问题，你也来"+listenOrLookStr+"吧！";
			wxFriendShareStr = "我推荐"+qaShow.answerUser.nickname+"回答的问题，你也来"+listenOrLookStr+"吧";
    }
		
	wxFriendShareStr = getTextFromHtml(wxFriendShareStr);
	wxShareTitle = getTextFromHtml(qaShow.content);
    wxShareSummary = getTextFromHtml(qaShow.answerUser.nickname+"回答了:"+qaShow.content);
    var img = hostConf + insertImgType(qaShow.answerUser.headPic,3);
    
    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",img, img, realUrl);
}

$(window).load(function(){
	if (shareResult!=null) {
		configwxShare(shareResult);
	}
});

//配置初始化问答详情页面
function configQaDetail(qaShow){
	// configwxShare(qaShow);
	answerID = qaShow.answerUser.id;
	listenDispalyStatus = qaShow.listenDispalyStatus;
	if (currUser!=null) {
		if(qaShow.qustionUser.id==currUser.id){
			currUserType = USER_TYPE_QU;
		}
		else if(answerID==currUser.id){
			currUserType = USER_TYPE_AN;
//			$("#qanda_act_id").show();
//			$('#rewardBtn').show();
		}
//		else{
//			$("#qanda_act_id").show();
//			$('#rewardBtn').show();
//		}
	}
    
	//标题
    $("#title_id").text(qaShow.qustionUser.nickname+"的提问");
    
    //得到圈子信息，看看这个人后没有创建圈子，如果则显示，没有则隐藏
    getQzInfo(qaShow.answerUser.id,1,"答主");

	//优惠券
	// if(listenDispalyStatus==0&&qaShow.qfee>0){

	// }

	// 提示付款退回
    if (currUserType==USER_TYPE_QU&&qaShow.aStatus !=1&&qaShow.status!=4&&qaShow.status!=3&&qaShow.status!=5) {
         $('#tui_expired_text_id').show();
         $('#tui_expired_text_id').text("超过"+params.questionExpiredTime+"小时未回答，付款将按原支付路径全额退款");
    }

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
    
	// if (qaShow.expiredStatus==1) {
	//    $("#expired_text_id").show();
	// }
     
	//原提问
	 $('#asker_pic_id').attr("src",insertImgType(qaShow.qustionUser.headPic, 3));
     $('#asker_nickname_id').text(qaShow.qustionUser.nickname);
	 $('#asker_addtime_id').text(getDateDiff(qaShow.addTime));
	$('#asker_content_id').html(qaShow.content);
	
     
     $('#asker_pic_id').click(function(){
     	createStatWithParamlog(window.location.href,"click","1",window.location.search);
        gotoUser_pageHtml(qaShow.qustionUser.id);
	});
	
	 //判断是否含有图片；
     if (qaShow.pics!=null&&qaShow.pics.length>0) {
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
	
    //如果问答是话题，显示引导回话题内容
    if(qaShow.topicId>0){
    	var topicSrc = "topicqanda.html?id="+qaShow.topicId;
    	$("#topicqanda_back").attr("href",topicSrc);
    	$("#topicqanda_pic").attr("src",qaShow.topicShow.pics.split(",")[0]);
    	$("#topicqanda_back").show();
    }else{
    	$("#topicqanda_back").hide();
    }
	//console.log("qaShow:",qaShow);
	//未回答隐藏中间广告栏
    if (qaShow.aStatus!=1) {
    	$('#openShare').hide();
    }
    
    //原回答
	if (qaShow.aStatus == 1) {//已回答
		var tips = "";
		var class_state = "free";
		var class_state2= "voice";
		var answer_mode_ware = true; 

		/** 收听状态，用户客户端判断  0-付费，1-免费，2-限次免费*/
		// private byte listenDispalyStatus;
		$("#answer_main_id_1").show();
		//$('#ask_time_statistic1').show();

		/** 回答类型 1-语音，2-文字 */
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
			// tips = tips + "收听";
			$('#voice_state_time_id_1').html(qaShow.answerLen+"&quot;");
			$('#voice_state_time_id_1').show();
		}
		else{
			//未登录不可以查看，所以当currUser==null时要显示登录查看
			if(currUser==null||(listenDispalyStatus==0&&qaShow.qfee>0)){
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
			// tips = tips + "阅读";
		}
		if(answer_mode_ware==true){
			$('#voice_state_text_id').text(tips);  
			$('#voice_state_id').addClass(class_state);
			$('#voice_state_id').addClass(class_state2);
			$("#answer_wave_mod_id").show();
			$("#voice_state_id").click(function(){
				if(currUser == null){
					//var nowDatetime = new Date();
					//writeClientSession("insertBeforeLoginUrl",window.location.href);
					//writeClientSession("insertBeforeLoginUrlTime",nowDatetime.getTime());
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
			//判断是否含有图片；
			if (qaShow.answerPic!=null&&qaShow.answerPic.length>0) {
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
			//$('.answer-common').css({'background':'#fffff6','padding-top':'0.5rem'});
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
		$('#answer_time1').text(getDateDiff(qaShow.answerTime));
		$('#listen_times_id_1').text(qaShow.listenUserTimes+listenOrReadStr);
		//$('#agree_times_id_1').text("赞" + qaShow.agreeTimes);

    }
	$('#ask_time_id_1').text(getDateDiff(qaShow.addTime));

      
	  //追问
	  //判断是否需要显示追加的问题
	  //追问回答
      if(qaShow.add_aStatus>0){
		listenDispalyStatus = qaShow.listenDispalyStatus;
		var tips = "";
		var class_state = "free";
		var class_state2= "voice";
		var answer_mode_ware = true; 

		/** 收听状态，用户客户端判断  0-付费，1-免费，2-限次免费*/
		// private byte listenDispalyStatus;
		$("#answer_main_id_2").show();

		/** 回答类型 1-语音，2-文字 */
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
			// tips = tips + "收听";
			$('#voice_state_time_id_2').html(qaShow.addAnswerLen+"&quot;");
			$('#voice_state_time_id_2').show();
		}
		else{
			if(currUser==null||(listenDispalyStatus==0&&qaShow.qfee>0)){
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
			// tips = tips + "阅读";
		}
		if(answer_mode_ware==true){
			$('#voice_state_text_id_2').text(tips);  
			$('#voice_state_id_2').addClass(class_state);
			$('#voice_state_id_2').addClass(class_state2);
			$("#answer_wave_mod_id_2").show();
			
			$("#voice_state_id_2").click(function(){
				if(currUser == null){
					//var nowDatetime = new Date();
					//writeClientSession("insertBeforeLoginUrl",window.location.href);
					//writeClientSession("insertBeforeLoginUrlTime",nowDatetime.getTime());
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
			//判断是否含有图片；
			if (qaShow.addAnswerPic!=null&&qaShow.addAnswerPic.length>0) {
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
		}
		//回答时间、偷听人数、赞
		$('#answer_time2').text(getDateDiff(qaShow.moreAnswerTime));
	  }

	//回答者信息
	$('#answer_author_nickName_id').text(qaShow.answerUser.nickname);
	$('#answer_expert1').text(qaShow.answerUser.nickname);
	$('#answer_expert2').text(qaShow.answerUser.nickname);
    $('#answer_author_fans_id').text(qaShow.answerUser.totFans+"粉丝");
    $('#answer_author_lable_id').text(qaShow.answerUser.lable);
    answerUserFansCount = qaShow.answerUser.totFans;


	$('#answer_expert_pic1').attr("src",insertImgType(qaShow.answerUser.headPic, 3));
	$('#answer_expert_pic2').attr("src",insertImgType(qaShow.answerUser.headPic, 3));
	$('#answer_expert_pic1').after(userLevelStr(qaShow.answerUser.masterLvl,qaShow.answerUser.loupanId));
	$('#answer_expert_pic2').after(userLevelStr(qaShow.answerUser.masterLvl,qaShow.answerUser.loupanId));
	$('.answer-expert-name').click(function(){
    	createStatWithParamlog(window.location.href,"click","2",window.location.search);
        gotoUser_pageHtml(qaShow.answerUser.id);
    });
	$('#expertInfo').click(function(){
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
	   $('#article-comment-module').show();
	}
    $('#commentCount').text(qaShow.replyTimes);
    
    //判断当前是否赞过
    judgeCaiOrZanOrCollection(qaShow.currAttitude,qaShow.favoriteStatus);
    if (parseInt(qaShow.agreeTimes)>0) {
      $('#dianzan span').show();
    };
    if (parseInt(qaShow.favoriteTimes)>0) {
      $('#collection span').show();
    };
    $('#dianzan span').text(qaShow.agreeTimes);
    $('#collection span').text(qaShow.favoriteTimes);

	 requestContentListByUser(answerID,2,qaShow.id);
     qandaListId = qaShow.id;

//    var fromReq = request("from");
//    if((fromReq =="groupmessage" || fromReq =="timeline" || fromReq =="singlemessage") 
//        && qaShow.publishLocationId>0 && qaShow.publishLocationType==g_page_circleType){
//        showCircle(qaShow.publishLocationId);
//    }
                }
                
//function showCircle(inCircleId){
//    $.ajax({
//        type: "post",
//        url: getQz,
//        dataType: "json",
//        async: true,
//        data:{"id":inCircleId},
//        success: function(result) {
//            if (result.result == "success") {
//                if(result.data.qzShow.joinStatus == 1){
//                    $("#addCircleBtn").html("进入圈子");
//                    $("#addCircleBtn").attr("href","circle_page.html?id="+inCircleId);
//                }else{
//                    $("#addCircleBtn").html("喜欢就看看他的圈子");
//                    $("#addCircleBtn").attr("href","circle_share_detail.html?id="+inCircleId);
//                }
//                
//                $("#addCircleBtn").show();
//            } else {
//                dataLoadedError(result.data);
//            }
//}
//    });
//}


//答主问答推荐
function requestContentListByUser(inAnswerId,inContentType,inContentId) {
    $.ajax({
        type: "post",
        url: getAdQa,
        dataType: "json",
        async: true,
       // data:{"page":"获取页","userId":id,"contentType":"1-文章，2-问答","subType":"0-全部，1-我问，20-我答（包含21+22）,21-我已答，22-未答"}
        data:{"userId":inAnswerId,"contentType":inContentType,"contentId":inContentId},
        success: function(result) {
            if (result.result == "success") {
				if(result.data.list.length>1){
					$('#answerQaList').show();
            	configQaListUI(result.data.list);
                    // 定位评论位置
                    setCommentScroll();
				}else{
					$('#answerQaList').hide();
				}
            } else {
              dataLoadedError(result.message);
            }
        }
    });
}

//问答界面的list
function configQaListUI(groups){
    	var count = 0;
	var preId = "";
    for (var i = 0; i <groups.length; i++) {
    	if (groups[i].id!=qandaListId&&preId!=groups[i].id&&count<3) {
    		count++;
    		preId=groups[i].id;
        	$('#answerQaList').append(qaListFunction(groups[i],i,100));
    	}
    }
}

function qaListFunction (cell,index) {
    var doStr = "";
    var picsStr = "";
    var listenDispalyStatus = cell.listenDispalyStatus;
    var tips = "";
    var statusListen = "";
    var answerType = "";
    var levelStr = userLevelStrOfQA(cell.answerUser.masterLvl,cell.answerUser.loupanId);
	
	var listenOrRead = "";
	
    if (cell.pics!=null&&cell.pics.length>0) {
        picsStr = '<i class="appui-qanda-question-imgtag"><img src="../images/img-tag.png" /></i>';
    };
    /** 收听状态，用户客户端判断  0-付费，1-免费，2-限次免费*/
    // private byte listenDispalyStatus;
    if(currUser==null){
		tips = "登录";
		statusListen = "free";
	}else if (listenDispalyStatus==0) {
        statusListen = "pay";
        tips = cell.qfee+"元";
    }else if (listenDispalyStatus==1) {
        statusListen = "free";
        tips = "免费";
    }else if (listenDispalyStatus==2) {
        statusListen = "time";
        tips = "限次";
    }
	if (cell.answerType==1){
		listenOrRead = "收听";
	}else if (cell.answerType==2) {
		listenOrRead = "阅读";
	}
	doStr = '<div class="recommend-qanda-item bg-white"  onclick = "gotoQADetail('+cell.id+','+index+',\''+typeId+'\')">'+
				'<h3 class="fs30 fc-black">'+ picsStr + cell.content +'</h3>'+
				'<p class="fs24 fc-grey999 mt5">'+
					'<span>'+ cell.answerUser.nickname +'</span>'+
					'<span>'+ cell.listenUserTimes +'人'+listenOrRead+'</span>'+
				'</p>'+
				'<span><img src="../images/icon06.png" /></span>'+
			'</div>';

	return doStr;
}

function gotoQADetail(id,index,typeId, e){
	window.location.href = "/questions/qanda_detail.html?id="+id+"&typeId="+typeId;
}
     
function saveFunction(index){
     //reAnswerStr 0 重答原问题 1重答追问，2回答原问题 ,3回答追问
     if (index==2) {
        createStatWithParamlog(window.location.href,"click","3",window.location.search);
        window.location.href = "qanda_record.html?id="+qaId+"&reAnswer=0&typeId="+typeId;
     }else if(index==3){
     	createStatWithParamlog(window.location.href,"click","4",window.location.search);
		  window.location.href = "qanda_record.html?id="+qaId+"&reAnswer=1&typeId="+typeId;
	 }
	 else if (index==1) {
        // $(".toastDialog").fadeOut(100,$(".toastDialog").remove());
        $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
     };
}

//发送追问
function sendAddQuestion(){
    var text = $('#zhuiwenQuestionStr').val();
    if (text==null||text.length==0) {
        dataLoadedError("追问不能为空");
        return;
    }else{
        $.ajax({
            type: "post",
            url: '/questions/continueask.html',
            dataType: "json",
            async: true,
            data:{"qaId":qaId,"content":text,'_csrf':$('input[name="csrf"]').val()},
            success: function(result) {
                if (result.result == "success") {
                    $('#addQuestion').hide();
                    $('#qanda_act_id').hide();
                    window.location.href = "/members/myhomepage.html?type=wen";
                }else{
                    dataLoadedError(result.message);
                }
            }
        });
    }
}

function backFunction() {
        var url = document.referrer;
        if (url!=null&&url.length!=0) {
           	window.location.href = "javascript:history.back(-1)";
        }else{
            window.location.href = "index.html";
        }
}


//评论请求列表
function configCommentUI(groups){
    var commentStr1 = "";
    var type = "";
    for (var i = 0; i <groups.length ; i++) {
        commentStr1 +=  '<div class="comment-item bc-grey" id="commentListID'+groups[i].id+'">'+
							'<div class="comment-item-author">'+
								'<a onclick="gotoUser_pageHtml('+groups[i].author.id+')">'+
									'<i>'+
										'<img src="'+insertImgType(groups[i].author.headPic,2)+'" />'+
									'</i>'+
									
									'<span class="ml5">'+
										'<i class="fs30 fc-navy">'+groups[i].author.nickname+'</i>'+
										'<i class="fs20 fc-greyabc">'+getDateDiff(groups[i].addTime)+'</i>'+
									'</span>'+
								'</a>'+
							'</div>'+
							typeComment(groups[i])+
						'</div>';
    };
   $('.comment-list-con').append(commentStr1); 
   // document.write("<script type='text/javascript' src='js/common.js'><\/script>");
   //判断加载更多按钮是否出现
   if($('.appui_loadmore').length>0){
        $('.appui_loadmore').remove();
   }
   if (totalPage != currentPage) {
   		downloadMoreData();
   }else{
   	    if (commentlocationID!="") {
	        var location = $('#commentListID'+commentlocationID).offset().top-$(window).height()+$('#commentListID'+commentlocationID).height()+80;
	        $('.page__bd').scrollTop(location);
        }
   }
//文章链接
   $("#articleLink").click(function(){
    window.location.href ="article_detail.html?id="+articleId;
   });
//取消按钮
   $('#appiu_js_page-cancel').stop().click(function(e) {
        //alert('ok');
        //$('body').css({'height':'auto','overflow':'auto'},300);
        $('#js-bg').fadeOut();
        $('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300);
        //$('#container').animate({'opacity':'1'},300)
    });

    // 点击评论进入该页面的定位;
    setCommentScroll();
}
//弹出详情底部操作界面
function commonJS(authorID,commentID){
	var userID = $('input[name="member"]').val();
      if(authorID == userID){
          var str=  '<a  id="deleatID" class="fc-black page-cancel">删除</a>';
	  }else{
         var str = '<a id="replayID" class="bc-grey fc-black page-cancel">回复</a>';
	  }
	  $('#commentObject').show();
	  $('#appiu_js_page-actID').html(str);

	  $('.page-cancel').click(function(e) {
				$('#js-bg').fadeOut();
				$('#js-page').animate({'bottom':'-30rem' , 'opacity':'0'},300);
	  });

	  var nicknameStr = $('#comment'+commentID+'').prev().find('span i:first').text();    
	  var commentStr = nicknameStr+":"+$('#comment'+commentID+'').text();
	  $('#commentObject').text(commentStr);

    $('#deleatID').click(function(){
        deleteComment(commentID);
    });

	  $('#replayID').click(function(){
          commentReplayBtn(authorID,commentID);
	  });

	  $('#forwardID').click(function(){
          commentReplayBtn(authorID,commentID);
	  });
	  $('#js-bg').fadeIn();
	  $('#js-page').animate({'bottom':'0' , 'opacity':'1'},300);
   }

function tipsCancle(){
  fadeOutComment();
}
function fadeOutComment(){
  $('#js-face').hide();
  $('#container-pop').fadeOut();
  $('.article-comment-edit-module').removeClass('article-forward-edit-module');
  $('.forward-link').hide();
}
function gotoBack(){
    writeClientSession("fromBorrowBank",1);
    window.history.back(-1);
}

function setStartAndEnd(evTxt){
   if(anchorNode!=null && anchorNode!="undefined"){
      }

  var el = $("#edit-mark");
  selection = window.getSelection();
  anchorNode = selection.anchorNode;
  if(anchorNode.id=="edit-mark"){
    anchorNode = document.getElementById("edit-mark");
  }else if(anchorNode.previousSibling==null){
    anchorNode = anchorNode.parentNode.firstChild;
      }else{
    anchorNode = anchorNode.previousSibling.nextSibling;
      }
  focusNode = selection.focusNode;
if(focusNode.id=="edit-mark"){
    focusNode = document.getElementById("edit-mark");
  }else if(focusNode.previousSibling==null){
    focusNode = focusNode.parentNode.firstChild;
      }else{
    focusNode = focusNode.previousSibling.nextSibling;
      }
      
  selectStart = selection.anchorOffset;
  selectEnd = selection.focusOffset; 

genShowText(evTxt);

}

//删除自己的评论
function deleteComment(commentID){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
      type:"post",
      url:'/comments/delcomment.html',
      dataType:"json",
      async: true,
      data:{
      	"commentId":commentID,
      	"_csrf":csrf,

      },
      success:function(result){
        if(result.status=="success"){
          $('#commentListID'+commentID+'').remove();
          $('#commentList'+commentID+'').remove();
          var count = $('#commentCount').text();
            $('#commentCount').text(count - 1);
          dataLoadedSuccess("删除评论成功");

          setTimeout("fadeOutComment()",2000);
        }else{
          dataLoadedError(result.message);
        }
      }
    });
}
//加载更多时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    requestCommentList();
}
function genShowText(evTxt){
      showMsgText += showIndex+"=="+evTxt+"=="+"anchorNode="+anchorNode+","+anchorNode.outerHTML;
    showMsgText +=",focusNode="+focusNode+","+focusNode.outerHTML+",selectStart="+selectStart+",selectEnd="+selectEnd;
    showIndex++;
}

function showMsg(){
        //alert(showMsgText);
};

//播放语音完成回调
function showCouposView(){
    // wxShare 1通过分享进来的 isActivity 0非活动 未关注 refreshBool 0
    var wxShare = readClientSession("wxShare");
    if (wxShare==1) {
        // alert(isActivity);
        if (isActivity==0) {

        	//正常进入问答详情界面，未关注律乎 refreshBool 0，公众号送券 hasCouponsTo 1 用户优惠券个数couponCount，
        	var refreshBool = readClientSession("refreshBool");
			var hasCouponsTo = readClientSession("hasCouponsTo");
        	if (hasCouponsTo==1&&refreshBool==0&&couponCount<=0) {
        		if(getNeedNextSHowQr()){
        			createStatWithParamlog(window.location.href,"/coupons.html","4",window.location.search);
        			qrcodeDialog('images/qrcodebg3.png' , '送优惠券啦' , '关注律乎可领取免费围观券<br />免费偷听收费问题！' , 'listen-detail' );
        		}//qrcodeDialog('images/qrcodebg3.png' , '快来关注吧' , '关注律乎获得最新消息推送！' , 'listen-detail' );
        	}else{
	            $('#shareView').show();
	            $('.closePopShare_dd').unbind("click").click(function(){
	                $('#shareView').hide();
	            });
            createStatWithParamlog(window.location.href,"/adQaShare.html","1",window.location.search);
        	}
        }else{
            showHowToShare();
            createStatWithParamlog(window.location.href,"/showHowToShare.html","0",window.location.search);
        }
        removeClientSession("wxShare");
    }
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
//得到圈子信息，有则显示，没有则隐藏
function getQzInfo(id,type,title){
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
		        		var openurl="circle_share_detail.html?id="+result.data.qzShow.id+"&from=square_detail";
	        		//判断是否加入了
	        		if(result.data.qzShow.joinStatus==1){
		        			openurl="circle_page.html?id="+result.data.qzShow.id+"&from=square_detail";
		        		}
		        		
		        		var qzHtml='<div onclick="gotoCirclePage(\''+openurl+'\')" class="add-circle-indetail bg-white">'+
						'<h3 class="fc-black fs24">本文来源于<span class="fwb ml5 mr5" id="qzusernickname">'+result.data.qzShow.host.nickname+'</span>的圈子<span class="fwb ml5 mr5" id="qzname">'+result.data.qzShow.name+'</span></h3>'+
						'<div class="circle-and-expert mt20">'+
							'<i><img src="'+result.data.qzShow.bgPic+'" id="qzbgpic"/></i>'+
							'<div class="cae-middle">'+
								'<h3 class="fs30 fwb fc-black" id="qzname1">'+result.data.qzShow.name+'</h3>'+
								'<p class="fs20 fc-grey999">'+
									'<span class="expert-name" id="qzusernickname1">'+result.data.qzShow.host.nickname+'</span>'+
									'<span class="circle-members" id="qzmembers">'+result.data.qzShow.totMembers+'</span>'+
								'</p>'+
							'</div>'+
							'<a class="add-circle-btn bc-grey fc-red fs24" href="'+openurl+'" id="artaddCircleBtn">去逛逛</a>'+
						'</div>'+
						'<p class="circle-discript fs24 fc-grey999 mt10" id="qzmemo">'+result.data.qzShow.summary+'</p>'+
					'</div>';
		        	$("#articleqzinfo").html(qzHtml);	
		        	$("#articleqzinfo").show();
		        	$("#expert-follow").hide();
                    // 定位评论位置
                    setCommentScroll();
		        }else{}
	        		}else{
		          dataLoadedError(result.message);
		        }
		      }
	        			});
	}else if(type==1){//来自外面
		$.ajax({
		      type:"post",
		      url:getMyQzByUserId,
		      dataType:"json",
		      async: true,
	      data:{"userId":id},
		      success:function(result){
		        if(result.result=="success"){
		        	if(result.data.qzShow!=null){
		        		var openurl="circle_share_detail.html?id="+result.data.qzShow.id+"&from=square_detail";
		        		//判断是否加入了
		        		if(result.data.qzShow.joinStatus==1){
		        			openurl="circle_page.html?id="+result.data.qzShow.id+"&from=square_detail";
	        		}
//		        		'<h3 class="fc-black fs24">本文答主创建了<span class="fwb ml5 mr5" id="qzname"></span>圈子</h3>'+
		        		var qzHtml='<div onclick="gotoCirclePage(\''+openurl+'\')" class="add-circle-indetail bg-white">'+
						'<h3 class="fc-black fs24">本文'+title+'创建了<span class="fwb ml5 mr5" id="qzname">'+result.data.qzShow.name+'</span>圈子</h3>'+
						'<div class="circle-and-expert mt20">'+
							'<i><img src="'+result.data.qzShow.bgPic+'" id="qzbgpic"/></i>'+
							'<div class="cae-middle">'+
								'<h3 class="fs30 fwb fc-black" id="qzname1">'+result.data.qzShow.name+'</h3>'+
								'<p class="fs20 fc-grey999">'+
									'<span class="expert-name" id="qzusernickname1">'+result.data.qzShow.host.nickname+'</span>'+
									'<span class="circle-members" id="qzmembers">'+result.data.qzShow.totMembers+'+</span>'+
								'</p>'+
							'</div>'+
							'<a class="add-circle-btn bc-grey fc-red fs24" href="'+openurl+'" id="artaddCircleBtn">去逛逛</a>'+
						'</div>'+
						'<p class="circle-discript fs24 fc-grey999 mt10" id="qzmemo">'+result.data.qzShow.summary+'</p>'+
					'</div>';
		        	$("#articleqzinfo").html(qzHtml);
		        	$("#articleqzinfo").show();
		        	$("#expert-follow").hide();
		        	// 定位评论位置
					setCommentScroll();
	        	}else{
	        	}
	        }else{
	          dataLoadedError(result.message);
	        }
	      }
	    });
}
}
//进入圈子
function gotoCirclePage(url){
	window.location.href = url;
}