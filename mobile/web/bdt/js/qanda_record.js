var maxAudioLength = null;
var wxShareUrl = window.location.href;
var maxAudioTips = "";
var recordStatus = 0;//recordStatus变量，0未录音， 1正在录音，2结束录音

var recordIdArray = new Array();
var recordPercentArray = new Array();
var qaId = "";
var recordId = "";
var datetime = new Date();

var recordPercent=0;    //录音进度
var playPercent=0;      //播放进度
var recording;          //录音定时器
var playing;            //播放录音定时器
var recordTime=0;       //录音累计时长
var addRecordTime=0;    //单次累计时长
var talTime=300;        //最长录音时长

var currentVoiceIndex = 0;
var currentVoiceStr = "";
var addVoiceID = "";
var isRecordingBool = 0;
var isReRecordingBool = 0;
var totleSeconds = 0;
var wxRecordId = "";

var typeId = "";
var userTest = "";
var reAnswerStr = "";
var pics = [];
var from = "";
// var isRefuse = "";
var isVoiceAns = 0;
var currentVoiceObj = "";
var judgeZhuiwen = "";

var appType = initOs.getOs();

var type=1;
var price=0;
$(document).ready(function() {
    var price=$("#askPrice").val();
})
    initOs.setCallBack({
        app: function(){
            $('#appAnswerWay1').show();
            //发送回答
            $('.send-answer').unbind('click').click(function(e) {
                if ($('.send-answer').hasClass("bg-greyabc")) {
                    return false;
                };
                if (isVoiceAns == 0) {
                    if (appType != 'h5' && !!appType) {
                        var s = Math.floor(appCurRecordSeconds%6000/100);
                        var S = appCurRecordSeconds%100;
                        friendTips("您总共录了"+s.toString() + '.' +S.toString()+"s,是否确定发送？","取消","确定",3);
                 }
                }else{
                    var postWhere = "";
                    var isReAns = 0;
                    var isAllowForward=0;
        			if($("#appuiOpenPublish")!=null && $("#appuiOpenPublish").length>0 && $("#appuiOpenPublish").is(".on")==true){
        				isAllowForward=1;
        			}
                    //reAnswerStr 0 重答原问题 1重答追问，2回答原问题 ,3回答追问
                    if (reAnswerStr == 2 || reAnswerStr == 3) {
                        if (reAnswerStr == 2) {
                            postWhere = postAnswer;
                        }else if (reAnswerStr == 3) {
                            postWhere = postAnswerForZhuiwen;
                        }
                        dataLoading("图文回答提交中");
                        $.ajax({
                            url: postWhere,
                            type: 'post',
                            dataType: 'json',
                            data: {"qaId":qaId,
                                "deviceType":2,
                                "url":"",
                                "answerLen":"",
                                "content":$("#textField").val(),
                                "pics":pics,
                                "isAllowForward":isAllowForward
                                // "type",type,
                                // "price",price
                            },
                            success: function(result){
                                clearToastDialog();
                                if (result.result=="success") {
                                    dataLoadedSuccess("提交成功!");
                                    window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
                                }else{
                                    dataLoadedError(result.message);
                                }
                            }
                        });
                    }else if(reAnswerStr == 1 || reAnswerStr == 0){
                        postWhere = reAnswer;
                        isReAns = reAnswerStr;
                        $.ajax({
                            url: postWhere,
                            type: 'post',
                            dataType: 'json',
                            data: {"qaId":qaId,
                                "deviceType":2,
                                "url":"",
                                 "isZhuiwen":isReAns,
                                 "answerLen":"",
                                 "content":$("#textField").val(),
                                 "pics":pics,
                                 "isAllowForward":isAllowForward
                                  // "type",type,
                                  // "price",price
                            },
                            success: function(result){
                                if (result.result=="success") {
                                    dataLoadedSuccess("提交成功!");
                                    window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
                                }else{
                                    dataLoadedError(result.message);
                                }
                            }
                        });
                    }

                }
            });


            window.onbeforeunload = function(){
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction,  "SpeechOFFSynthesize", "del", [0]);
            }
            initOs.loadOverFn('js/webApp/appRecord.js', function(){
                initAppRecordUI();
            });
        },
        h5: function(){
            $('#answerWay1').show();
            initVoice();
            wxRequest1();
    }
    });

    if (isWeiXinBorrower()) {
     dataLoading("页面加载中...");
    }
    qaId = request("id");
    //判断是否自己是否是答主
        $.each($("#chooseAnsWay div"), function(index, val) {
            $(this).on('click', function(event) {
                event.preventDefault();
                $("#chooseAnsWay div").removeClass('active');
                writeClientSession("wayToAns",index);
                if (index == 0) {
                    $(this).addClass('active');
                    isVoiceAns = 0;
                    if($("#textField").val()!=""){
                        friendTips2("您选择的语音回答，会清除已有内容","返回文字回答","继续语音回答",1);
                    }
                    $("#chooseAnsWay i").css("left","25%");
                    $("#chooseAnsWay img").eq(0).attr("src","images/voicemode-1.png");
                    $("#chooseAnsWay img").eq(1).attr("src","images/textmode.png");
                    $("#wayToAnswer").css("left","0");
                }else{
                    if (isRecordingBool==1) {
                        dataLoadedError("录音进行中,请停止录音在进行其他操作");
                        return;
                   }else{
                        $(this).addClass('active');
                        isVoiceAns = 1;
                        if (appType != 'h5' && !!appType) {
                            if (appCurRecordSeconds!=0) {
                                friendTips2("您选择的图文回答，会清除已有录音","返回语音回答","继续文字回答",0);
                            }
                        }else{
                        if (recordIdArray.length!=0) {
                            friendTips2("您选择的图文回答，会清除已有录音","返回语音回答","继续文字回答",0);
                        }
                        }
                        $("#chooseAnsWay i").css("left","75%");
                        $("#chooseAnsWay img").eq(0).attr("src","images/voicemode.png");
                        $("#chooseAnsWay img").eq(1).attr("src","images/textmode-1.png");
                        $("#wayToAnswer").css("left","-100%");
                   }
                }
            })
        });
    $('#textField').bind('propertychange input', function () {
       if($.trim($("#textField").val())==""){
            $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');
        }else{
            $('.send-answer').addClass('bg-orange').removeClass('bg-greyabc');
       }
    });

    uploadImg("#filehidden",5242880,3,".add-qanda-pic1");


    typeId = request("typeId");
    from = request("from");
    if(from == "notice"||from == "wxnotice"){
        typeId = from;
    }
    //typeId 0表示是刚刚支付返回的界面；1表示我问列表 myanswer.html#1 11 myhomepage.html#1,2拒绝回答,3回答问题成功,4重新回答原问题，
    //reAnswerStr 0 重答原问题 1重答追问，2回答原问题 ,3回答追问
    reAnswerStr = request("reAnswer");
    // wxRequest1();
    wxShare1();
    getQaDetailRequest();
    // initVoice();
});

function configwxShare(qaShow){
  var wxShareSummary = "";
    var wxShareTitle = "";
    //分享自己 答主 提问者无关
    var wxFriendShareStr = qaShow.content;
  //lhj mod
  var paraStr = "&srId=";
  var currUrl = window.location.href;
  var realUrl = "";
  //说明是分享进来的
  var index = currUrl.indexOf(paraStr);
    //语音
    var listenOrLookStr = "";
    if(qaShow.aStatus == 0){
      listenOrLookStr = "围观";
    }else if(qaShow.answerType==1){
        listenOrLookStr = "听听";
    }else{
        listenOrLookStr = "看看";
    }

    if (userTest!=null) {
    if(index>0){
      realUrl = currUrl.substr(0,index) + paraStr + userTest.id;
    }else{
        realUrl = window.location.href + paraStr + userTest.id;
    }
    //
    if(qaShow.aStatus == 0){
      //未回答====我在律乎上向方海锋提了一个问题，您也来看看吧
          if (qaShow.answerUser.id==userTest.id) {
              wxShareTitle = qaShow.qustionUser.nickname+"在律乎向"+qaShow.answerUser.nickname+"提问，您也来"+listenOrLookStr+"吧！";
              wxShareSummary = "我在律乎收到提问："+qaShow.content+" 您也来"+listenOrLookStr+"吧！";
        wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",insertImgType(qaShow.answerUser.headPic,3),defaultWeixinSharePicUrl,realUrl);
          }else if (userTest!=null&&qaShow.qustionUser.id==userTest.id){
              wxShareTitle = qaShow.qustionUser.nickname+"在律乎上向"+qaShow.answerUser.nickname+"提问，您也来"+listenOrLookStr+"吧！";
              wxShareSummary = "我在律乎上向"+qaShow.answerUser.nickname+"提问："+qaShow.content+" 您也来"+listenOrLookStr+"吧。";
        wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",insertImgType(qaShow.qustionUser.headPic,3),defaultWeixinSharePicUrl,realUrl);
          }else{
              wxShareTitle = userTest.nickname+"强烈推荐问题，您也来"+listenOrLookStr+"吧！";
              wxShareSummary = userTest.nickname+"推荐问题:"+qaShow.content+" 您也来"+listenOrLookStr+"!";
        wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",insertImgType(userTest.headPic,3),defaultWeixinSharePicUrl,realUrl);
    }
    }else{
        if (qaShow.answerUser.id==userTest.id) {
              wxShareTitle = qaShow.answerUser.nickname+"在律乎回答了"+qaShow.qustionUser.nickname+"的提问，您也来"+listenOrLookStr+"吧！";
              wxShareSummary = "我在律乎回答了："+qaShow.content+" 您也来"+listenOrLookStr+"吧！";
      wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",insertImgType(qaShow.answerUser.headPic,3),defaultWeixinSharePicUrl,realUrl);
        }else if (userTest!=null&&qaShow.qustionUser.id==userTest.id){
              wxShareTitle = qaShow.answerUser.nickname+"回答了我在律乎提出的的问题，您也来"+listenOrLookStr+"吧！";
              wxShareSummary = qaShow.answerUser.nickname+"回答了我在律乎提出的问题："+qaShow.content+" 您也来"+listenOrLookStr+"吧。";
      wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",insertImgType(qaShow.qustionUser.headPic,3),defaultWeixinSharePicUrl,realUrl);
        }else{
              wxShareTitle = userTest.nickname+"强烈推荐"+qaShow.answerUser.nickname+"回答的问题，您也来"+listenOrLookStr+"吧！";
            wxShareSummary = "我推荐"+qaShow.answerUser.nickname+"的回答:"+qaShow.content+" 您也来"+listenOrLookStr+"!";
      wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",insertImgType(userTest.headPic,3),defaultWeixinSharePicUrl,realUrl);
        }
    }

    }else{
    if(index>0){
      realUrl = currUrl.substr(0,index);
    }else{
        realUrl = window.location.href;
    }
    if(qaShow.aStatus == 0){
          wxShareTitle = "强烈推荐"+qaShow.qustionUser.nickname+"的提问，您也来"+listenOrLookStr+"吧！";
          wxShareSummary = "强烈推荐"+qaShow.qustionUser.nickname+"的提问:"+qaShow.content+" 您也来"+listenOrLookStr+"!";
    }else{
          wxShareTitle = "强烈推荐"+qaShow.answerUser.nickname+"回答的问题，您也来"+listenOrLookStr+"吧！";
        wxShareSummary = "强烈推荐"+qaShow.answerUser.nickname+"的回答:"+qaShow.content+" 您也来"+listenOrLookStr+"!";
    }
    //lhj mod
    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",defaultWeixinSharePicUrl,defaultWeixinSharePicUrl,realUrl);
    }
}

function clearToastDialog2(index){
    if (index == 0) {
        isVoiceAns = 1;
        if (appType != 'h5' && !!appType) {
            intAppRecordPlayFunc();
        }else{
        recordIdArray = [];
        recordPercentArray = [];
        currentVoiceIndex = 0;
        intRecordPlayFun();
        initSecondsFunction();
        }
    }else{
        isVoiceAns = 0;
        $("#textField").val("");
        pics = [];
        deletePic(0,3,'.add-qanda-pic1');
        deletePic(1,3,'.add-qanda-pic1');
        deletePic(2,3,'.add-qanda-pic1');
        $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');
    }
        $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
}
function initSecondsFunction(){
        $("#answer-log-item0 em").css("width",0);
        $("#answer-log-item0 span").html("0s");
        $("#answer-log-item1 em").css("width",0);
        $("#answer-log-item1 span").html("0s");
        $("#answer-log-item2 em").css("width",0);
        $("#answer-log-item2 span").html("0s");
        $("#answer-log-item3 em").css("width",0);
        $("#answer-log-item3 span").html("0s");
        $("#answer-log-item4 em").css("width",0);
        $("#answer-log-item4 span").html("0s");
    $('#answer-log-item0 span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
    $('#answer-log-item1 span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
    $('#answer-log-item2 span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
    $('#answer-log-item3 span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
    $('#answer-log-item4 span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
        $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');
}
function ansWithText(index){
    if (index==0) {
        isVoiceAns = 0;
        $("#chooseAnsWay div").removeClass('active');
        $("#chooseAnsWay div").eq(0).addClass('active');
        $("#chooseAnsWay i").css("left","25%");
        $("#chooseAnsWay img").eq(0).attr("src","images/voicemode-1.png");
        $("#chooseAnsWay img").eq(1).attr("src","images/textmode.png");
        $("#wayToAnswer").css("left","0");
    }else{
        $("#chooseAnsWay div").removeClass('active');
        $("#chooseAnsWay div").eq(1).addClass('active');
        $("#chooseAnsWay i").css("left","75%");
        $("#chooseAnsWay img").eq(0).attr("src","images/voicemode.png");
        $("#chooseAnsWay img").eq(1).attr("src","images/textmode-1.png");
        $("#wayToAnswer").css("left","-100%");
        isVoiceAns = 1;
    }
    $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
}
function tipsCancle(){
   $('#js-face').hide();
   $('#container-pop').fadeOut();
}

//初始化信息
function getQaDetailRequest(){
  // dataLoading("数据加载中...");
  $.ajax({
        type: "post",
        url: getQaDetail,
        dataType: "json",
        async: true,
        data:{"qaId":qaId},
        success: function(result) {
            // clearToastDialog();
            if (result.result == "success") {
              configQaDetail(result.data.qaShow);
            }
        }
    });
}

function img_Show(imgArr){
	if(imgArr!=null){
		$.each($("#img_resImgArr_id"), function(index, val) {
			$(this).on('click', function() {
				imageClickFunction(imgArr,index);
			});
		});
	}
}
function configQaDetail(qaShow){
    // judgeSkipToDetailHtml(qaShow);
    //判断是否自己是否是答主
    if (qaShow.answerUser.id != userTest.id ) {
        $('.qanda-record').hide();
        window.location.replace("qanda_detail.html?id="+qaId+"&typeId=4&from=1");
        return;
    }else{
      //有追问并且已回答；
      if (qaShow.add_aStatus==1&&qaShow.addQuestion.length>0&&reAnswerStr!=1&&reAnswerStr!=0) {
          $('.qanda-record').hide();
          window.location.replace("qanda_detail.html?id="+qaId+"&typeId=4&from=1");
          return;
      }
      //有追问并且未回答；
      else if (qaShow.add_aStatus!=1&&qaShow.addQuestion.length>0) {
        if (reAnswerStr==2) {
          reAnswerStr = 3;
        }
      }
      //没追问并且原问题已经回答；
      else if (qaShow.aStatus == 1&&qaShow.addQuestion.length==0&&reAnswerStr!=0) {
          $('.qanda-record').hide();
          window.location.replace("qanda_detail.html?id="+qaId+"&typeId=4&from=1");
          return;
      };
    }
    configwxShare(qaShow);
    currentVoiceObj = "ab_play_"+qaShow.id;
    $('.qanda-record').show();
    // userTest = getSessionUser();
    $('#nickname').text(qaShow.qustionUser.nickname+'的提问');
    var afeeStr = "";
    var refuseAnswerStr = "";
    var lookOriginalQuestionStr = "";
    var firstContent = "";
    var oldQuestionStr = "";
    var oldQuestionTime = "";
    var oldOrAddStr = "";
	var imgStrAdd = "";
    var status = "";
    /** 问答状态 未支付 -1;问答状态-未审核 0; 问答状态-正常 1; 问答状态-已删除2; 问答状态-已撤回3; 问答状态-被拒绝4 问答状态-已过期5*/;
    if (qaShow.afee==0) {
        afeeStr = "免费";
    }else{
        afeeStr = "￥"+qaShow.afee;
    }
    if (qaShow.status==2) {
       status = "已删除";
	   window.location.replace("qanda_detail.html?id="+qaId+"&typeId=notice&from=1");
    }else if (qaShow.status==3) {
        status = "已撤回";
		window.location.replace("qanda_detail.html?id="+qaId+"&typeId=notice&from=1");
        $('.qanda-record').hide();
    }else if(qaShow.status==4){
        status = "已拒绝";
        $('.qanda-record').hide();
		window.location.replace("qanda_detail.html?id="+qaId+"&typeId=notice&from=1");
    }else if(qaShow.status==5){
        status = "已过期";
    }

	//判断是否含有图片；
    var imgStr = "";
	var resImgArr=null;//原提问是否包括图片
	var imgStr_answer = "";
	var resImgArr_answer =null;//原回答是否包括图片
	var imgStrAdd_answer = "";
    if (qaShow.pics!=null&&qaShow.pics.length>0) {
        var imgArr = qaShow.pics.split(",");
        resImgArr = new Array();
        for (var i = 0; i < imgArr.length; i++) {
            imgStr += '<span><img src="'+imgArr[i]+'" /></span>';
            resImgArr[i] = imgArr[i].replace("_min","");
        };
    imgStrAdd =	'<div class="question-piclist" id="img_resImgArr_id">'+
                    imgStr+
                '</div>';
    };

	if (qaShow.answerPic!=null&&qaShow.answerPic.length>0) {
        var imgArr = qaShow.answerPic.split(",");
        resImgArr_answer = new Array();
        for (var i = 0; i < imgArr.length; i++) {
            imgStr_answer += '<span><img src="'+imgArr[i]+'" /></span>';
            resImgArr_answer[i] = imgArr[i].replace("_min","");
        };
		imgStrAdd_answer =	'<div class="question-piclist" id="imgresImgArr_answer_id">'+
             imgStr_answer+
    '</div>';
    };

	//判断是否出现拒绝回答
  if ((qaShow.status==1||qaShow.status==5)&&qaShow.aStatus!=1) {
        refuseAnswerStr = '<a onclick="refuseAnswer()" class="fs24 fc-black456 ml20">拒绝回答</a>';
  }

  //判断是否需要显示追加的问题
  // if (qaShow.addQuestion!=null&&qaShow.addQuestion.length>0&&(reAnswerStr==3||reAnswerStr==1)) {
  if (qaShow.addQuestion!=null&&qaShow.addQuestion.length>0) {
      oldQuestionTime = qaShow.answerTime;
      oldOrAddStr = "的追问";
      $('#nickname').text(qaShow.qustionUser.nickname+'的追问');

		  lookOriginalQuestionStr = '<a class="fs24 fc-blue bg-greyfa mb10" id="lookOriginalQuestion" onClick="lookOriginalQuestion()">查看原问题</a>';
      firstContent = qaShow.addQuestion;
		  var answerContentStr = "";
		  if (qaShow.aStatus == 1) {
				 if(qaShow.answerType==1){
					tips = "免费收听";
					$('#voice_state_time_id_1').text(qaShow.answerLen);
					$('#voice_state_time_id_1').show();
				answerContentStr =	'<div class="appui-qanda-answer" id="answer_wave_mod_id">' +
										//<!--回答-语音voice-语音三种状态-免费free-限次time-收费pay-->
										'<div id="voice_state_id" class="appui-qanda-answerstyle voice free">' +
											'<i></i>' +
											'<span class="appui_qanda-voice-wave">' +
												'<em class="wave1"></em>' +
												'<em class="wave2"></em>' +
												'<em class="wave3"></em>' +
											'</span>' +
											'<em class="tips" id="voice_state_text_id">免费播放</em>' +
											'<span class="appui_qanda-voice-wait" ></span>' +
										'</div>' +
										'<em class="appui-qanda-answer-time" id="voice_state_time_id_1">'+ qaShow.answerLen + '</em>' +
                        '</div>';

				}
				else{
			answerContentStr =	'<div class="pictext-info fs30" id="answer_picmod_mod_id" >' +
										'<p class="pictext-text fc-grey666" id="pictext_text_id">' + qaShow.answerText +'</p>' +
										imgStrAdd_answer +
									'</div>' ;
				}
	     }
         oldQuestionStr =
		 '<div class="old-quest-answer old-problem bg-white mt5" style="display:none;" id="oldQuestAnswer">' +
						//<!--原问--可有图-->
						'<div class="question-common">' +
							//<!--问题内容-->
							'<div class="question-info fs30">' +
								'<span class="question-tag fc-blue fwb mr5">原问</span>' +
								'<p class="question-text fc-black" id="asker_content_id">'+qaShow.content+'</p>' +
							'</div>' +
							//<!--问题图片-问题与回答中图片列表公用部分-->
							imgStrAdd +
							'<div class="answer-time-statistic fs24 fc-grey666">' +
								'<span class="answer-time" id="answer_time_id_1">'+getDateDiff(qaShow.answerTime)+'</span>' +
								'<a class="reanswer-btn bg-greyfa fs24 fc-red ml20" id="reanswer_id_1" onclick="reAnswerFromZhuiWen()">重答</a>' +
								'<p class="answer-statistic"><span id="listen_times_id_1">'+qaShow.listenUserTimes+'人听过</span><span id ="agree_times_id_1">'+"赞" + qaShow.agreeTimes+'</span></p>' +
							'</div>' +
						'</div>' +
						//<!--回答-气泡-语音模式-->
						'<div class="answer-common bg-white" id="answer_main_id_1">'+
							'<div class="answer-common-bg bg-greyfa">'+
								'<div class="answer-tag-expert">'+
									'<span class="fs28 fc-white bg-green">行家说</span>'+
									'<a class="answer-expert">'+
										'<span class="answer-expert-pic mr5">'+
											'<img src="" id="answer_expert_pic1" />'+
										'</span>'+
										'<span class="answer-expert-name">'+
											'<i class="fs28 fc-black" id="answer_expert1">'+qaShow.answerUser.nickname+'</i>'+
											'<i class="fs20 fc-grey999" id="answer_time1"></i>'+
										'</span>'+
									'</a>'+
								'</div>'+
								answerContentStr+
							'</div>'+
						'</div>'+
					'</div>' ;
       imgStrAdd = "";
  }else{
      oldQuestionTime = qaShow.addTime;
      oldOrAddStr = "的提问";
      firstContent = qaShow.content;
  }
  if(qaShow.addQuestion!=null&&qaShow.addQuestion.length>0&&(reAnswerStr==3||reAnswerStr==1)){
    judgeZhuiwen = "追问";
		firstContent =qaShow.addQuestion;
		$('#oldQuestAnswer').show();
		setTimeout("lookOriginalQuestion()",1000);
  }else{
    judgeZhuiwen = "原问";
		firstContent =qaShow.content;
		$('#oldQuestAnswer').hide();

		// //判断是否出现拒绝回答
		if ((qaShow.status==1||qaShow.status==5)&&qaShow.aStatus!=1) {
			refuseAnswerStr = '<a onclick="refuseAnswer()" class="fs24 fc-black456 ml20">拒绝回答</a>';
		}
		else{
			refuseAnswerStr = '';
		}
		lookOriginalQuestionStr = '';
  }
  var doStr = '<div class="asker-price-status bg-white">'+
                  '<a class="asker-info" onclick="gotoUser_pageHtml('+qaShow.qustionUser.id+')">'+
                    '<span class="asker-headpic"><img id="asker_pic_id" src="'+insertImgType(qaShow.qustionUser.headPic, 3)+'"></span>'+
                    '<span class="asker-orther fs28">'+qaShow.qustionUser.nickname+'</span>'+
                  '</a>'+
                  '<div class="price-status">'+
                    '<div class="price-coupon">'+
                      '<span class="price">'+
                        '<i class="fs30 fc-red" id="price_id">'+afeeStr+'</i>'+
                        '<em style="" class="bg-black" id="price_line_id"></em>'+
                      '</span>'+
                      '<span style="" class="coupon" id="price_coupon_id"><img src="images/coupon_icon.png"></span>'+
                          '</div>'+
                    '<span class="status fs20 fc-grey666" style="/* display:none; */" id="expired_text_id">'+status+'</span>'+
                  '</div>'+
                '</div>'+
                '<div class="question-common bg-white">'+
                  '<div class="pictext-info fs30" id="answer_picmod_mod_id" >' +
                      '<span class="answer-tag fc-blue fwb mr5">'+judgeZhuiwen+'</span>' +
                      '<p class="fs32 fc-black pictext-text fc-grey666" id="pictext_text_id">' + firstContent +'</p>' +
                    '</div>'+
					imgStrAdd+
                '</div>'+
                    '<div class="record-orthers bg-white">'+
						  '<span class="fs24 fc-grey999">'+getDateStringDateWithSeconds(oldQuestionTime)+'</span>'+
                          refuseAnswerStr+
                          lookOriginalQuestionStr+
                    '</div>'+
              '</div>'+
              oldQuestionStr;
  $('.qanda-record').before(doStr);

  $('#answer_expert_pic1').attr("src",insertImgType(qaShow.answerUser.headPic, 3));
  $('#answer_expert_pic1').after(userLevelStr(qaShow.answerUser.masterLvl,qaShow.answerUser.loupanId));
  $('#answer_time1').text(getDateDiff(qaShow.moreAnswerTime));

  if(qaShow.payPype != 2||qaShow.afee==0){
      $("#price_line_id").hide();
      $("#price_coupon_id").hide();
  }

  if (qaShow.status != 3 && qaShow.status != 4 && qaShow.status != 5) {
      if(qaShow.payPype == 2||qaShow.afee!=0){
          $(".problem-name").addClass("use_coupon");
      }
  }

  $('.qanda-record-answer').show();
  //图片事件绑定
  if(resImgArr!=null){
	  $.each($("#img_resImgArr_id"), function(index, val) {
			$(this).on('click', function() {
				imageClickFunction(resImgArr,index);
			});
	});
  }
  if(resImgArr_answer!=null){
	  $.each($("#imgresImgArr_answer_id"), function(index, val) {
			$(this).on('click', function() {
				imageClickFunction(resImgArr_answer,index);
			});
	});
  }
   //播放事件绑定
   if(qaShow.answerType==1&&qaShow.aStatus == 1){
       $("#voice_state_id").click(function(){
		  playAudioClickFunction(qaShow.id,1,1,"voice_state_id");
      });
   }

	//判断是否是圈子里面的问答录音-如果是圈子问答录音需要显示公开发布选项
  	if(qaShow.publishLocationType==2){
		$('#appuiOpenPublish').css('display','table');
		$('#appuiOpenPublish').click(function(e) {
			$(this).toggleClass('on');
		});
	}


  // lookOriginalQuestion();
}
//重新回答问题
function reAnswerFromZhuiWen(){
    window.location.replace("qanda_record.html?id="+qaId+"&typeId="+typeId);
}

//查看原问题
function lookOriginalQuestion(){
    $('.old-problem').stop().slideToggle();
    $('#lookOriginalQuestion').text()=='查看原问题'?$('#lookOriginalQuestion').text('收起原问题'):$('#lookOriginalQuestion').text('查看原问题');
}

//拒绝回答
var notes = "";
function refuseAnswer(){
    // isRefuse = 1;
    // friendTips("是否要拒绝回答这个问题？","取消","确定",2)
    var type = "";

    $('#refuse_dialog').show();
    $('#closeID').click(function(){
        $('#refuse_dialog').hide();
    });
    $('.refuse-reason p').each(function(index,element){
        $(this).click(function(){
            type = parseInt(index)+1;
            notes = $(this).text();
            $('.refuse-reason p').addClass('bg-greyfa').removeClass('bg-blue fc-white');
            $(this).addClass('bg-blue fc-white').removeClass('bg-greyfa');
            $('#reasonTextarea').attr('disabled',"true");
            if (index==3) {
                $('#reasonTextarea').attr('disabled',false);
                $('#reasonTextarea').focus();
                $('#configRefuse').removeClass('bg-red').addClass('bg-grey');
            }else{
                refuseClick(type);
                $('#reasonTextarea').val('');
                $('#configRefuse').addClass('bg-red').removeClass('bg-grey');
            }
         })
    });


    monitorCount();

}
function refuseClick(type){
    $('#configRefuse').unbind("click").click(function(){

        if ($(this).hasClass('bg-red')) {
            if (type==4) {
                notes = $('#reasonTextarea').val();
                var counter = $.trim(notes).length;
                if (counter<2&&$("#refuseTips").is(":hidden")) {
                  $('#refuseTips').text("拒绝理由不得少于两个字");
                  $('#refuseTips').show(300).delay(2000).hide(300);
                };
            }

            $.ajax({
                type: "post",
                url: rejectQuestion,
                dataType: "json",
                async: true,
                data:{"qaId":qaId,"type":type,"notes":notes},
                success: function(result) {
                    if (result.result == "success") {
                        $('#refuse_dialog').hide();
                        window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
                    }else{
                         dataLoadedError(result.message);
                    }
                }
            });

        }
    });
}
function monitorCount(){
    $('#reasonTextarea').bind('onpropertychange input', function () {
        var counter = $('#reasonTextarea').val().length;
        if (counter>30) {
            this.value = this.value.substring(0, 30);
            if ($("#refuseTips").is(":hidden")) {
                $('#refuseTips').text("您已经超过最大输入字数");
                $('#refuseTips').show(300).delay(2000).hide(300);
            }
            return false;
        }
        if (counter>0) {
            refuseClick(4);
            $('#configRefuse').addClass('bg-red').removeClass('bg-grey');
        }else{
            $('#configRefuse').removeClass('bg-red').addClass('bg-grey');
        }

    });
}

//重新回答；
function reAnswerFunction(wxRecordId,curCount){
    var deviceTypeStr = 1;
    if (appType != 'h5' && !!appType) {
        deviceTypeStr = 3;
        curCount = Math.floor(curCount/100) + 1;
    }
    dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: reAnswer,
        dataType: "json",
        async: true,
        data:{"qaId":qaId,"deviceType":deviceTypeStr,"url":wxRecordId,"answerLen":curCount,"isZhuiwen":reAnswerStr},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
               dataLoadedSuccess("重新回答问题成功");
               window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
            }else {
               dataLoadedError(result.message);
            }
        }
    });
}
//首次回答成功 或者回答追问
function postAnswerOfQuestionRequest(wxRecordId,curCount) {
    var urlStr = "";
    var deviceTypeStr = 1;
    if (appType != 'h5' && !!appType) {
        deviceTypeStr = 3;
        curCount = Math.floor(curCount/100) + 1;
    }
    if (reAnswerStr==2) {
        urlStr = postAnswer;
    }else if (reAnswerStr==3) {
        urlStr = postAnswerForZhuiwen;
    };
    dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: urlStr,
        dataType: "json",
        async: true,
        // data:{"qaId":"id","deviceType":"1-weixin","url":"weixin时，输入微信音频上传返回的serverId"}
        data:{"qaId":qaId,"deviceType":deviceTypeStr,"url":wxRecordId,"answerLen":curCount},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
               dataLoadedSuccess("回答问题成功");
               window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
            }else {
               dataLoadedError(result.message);
            }
        }
    });
}

//微信语音的一些问题
function wxRequest1(){
  $.ajax({
        type: "post",
        url: getConfigValueUrl,
        dataType: "json",
        async: true,
        data: {
            "keys": "maxAudioLength"
        },
        success: function(result) {
            if (result.result == "success") {
                maxAudioLength = Number(result.data.vals[0]);
                maxAudioTips = "点击开始录音最多录制" + maxAudioLength + "”...";
                $('.record-tips').text(maxAudioTips);
            }
        }
    });
}
function wxShare1() {
    $.ajax({
        type: "post",
        url: getWxShareDataUrl,
        dataType: "json",
        async: true,
        data: {
            "url": wxShareUrl
        },
        success: function(result) {
            if (result.result == "success") {
                wx.config({
                    debug: false,
                    appId: result.data.appId,
                    timestamp: result.data.timestamp,
                    nonceStr: result.data.nonceStr,
                    signature: result.data.signature,
                    jsApiList: ['checkJsApi', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice'],
                });
                wx.ready(function() {
                  clearToastDialog();
                    var voice = {
                        localId: '',
                        serverId: ''
                    };
                    wx.checkJsApi({
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
                        // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success: function(res) {}
                    });
                    // 4.4 监听录音自动停止
                    wx.onVoiceRecordEnd({
                        complete: function(res) {
                            //alert("异常错误"+res);
                            recordIdArray.splice(currentVoiceIndex, 0, res.localId);
                        }
                    });
                    wx.onVoicePlayEnd({
                        complete: function(res) {
                            sectionPlay++;
                            if (sectionPlay<localAnswerIDArray.length) {
                                playVoice(localAnswerIDArray[sectionPlay],preVoiceObj);
                            }else{
                                currentVoiceId = "";
                                playErrorUI(currPayObjId);
                                wxplaying = false;
                            }

                        }
                    });
                    wx.stopRecord();
                });
            } else {
            }
        }
    });
}

//开启录音
function startRecord1(){
    isReRecordingBool = 0;
    wx.startRecord({
            cancel: function() {
              dataLoadedError("取消");
            },
            success: function(res) {
                startRecordUI();
            },
            fail: function(res) {
                intRecordPlayFun();
                $('#answer-log-item'+currentVoiceIndex+' i').css('left',0);
                $('#answer-log-item'+currentVoiceIndex+' em').css('width',0);
                $('#answer-log-item'+currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
                dataLoadedError("开启录音错误");
            }
    });
}
//停止录音
function stopRecord1(){
    wx.stopRecord({
        success: function(res) {
            recordIdArray.splice(currentVoiceIndex, 0, res.localId);
            stopRecordButton();
        },
        fail: function(res) {
            intRecordPlayFun();
            $('#answer-log-item'+currentVoiceIndex+' i').css('left',0);
            $('#answer-log-item'+currentVoiceIndex+' em').css('width',0);
            $('#answer-log-item'+currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
            dataLoadedError("sorry，系统未能识别本段语音，请重录本段录音！");
            // window.location.reload();
        }
    });
}
//暂停播放
function pauseVoice1(voiceId){
    wx.pauseVoice({
        localId: voiceId,
        success: function(res) {
            pauseVoiceUI();
        },
        fail: function(res) {
          dataLoadedError("暂停播放错误");
        }
    });
    // stopVoice(voiceId);
     // pauseVoiceUI();
}
//停止播放
function stopVoice1(voiceId){
    wx.stopVoice({
        localId: voiceId, // 需要停止的音频的本地ID，由stopRecord接口获得
        success: function(res) {
             // dataLoadedError("停止播放语音成功");
        },
    });
}
//上传语音
function loadVoice1(i){
    wx.uploadVoice({
        localId: recordIdArray[i], // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回音频的服务器端ID
                wxRecordId += serverId+',';
                i++;
                if (i < recordIdArray.length) {
                    loadVoice1(i);
                }else{
                    wxRecordId = wxRecordId.substring(0,wxRecordId.length-1);
                    if (reAnswerStr==2||reAnswerStr==3) {
                        postAnswerOfQuestionRequest(wxRecordId,totleSeconds);
                    }else{
                        reAnswerFunction(wxRecordId,totleSeconds);
                    };
                }
            }
        });

}

// 播放音频
 function playVoice1(voiceId){
     // dataLoadedError("播放语音");
    if (voiceId == '') {
        dataLoadedError('请先使用 startRecord 接口录制一段声音');
        return;
    }
    if (voiceId==currentVoiceStr) {
        startPlayVoiceUI1();
    };
    wx.playVoice({
         localId: voiceId,
         success: function(res) {
            currentVoiceStr = voiceId;
             startPlayVoiceUI1();
             // dataLoadedError("播放语音成功");
         },
         fail: function(res) {
             dataLoadedError("播放语音错误");
         }
    });
}
function startPlayVoiceUI1(){
    // dataLoadedError("播放语音的UI");
    clearInterval(playing);//暂停播放----清除播放录音定时器
    $('.play-start').hide();//隐藏----播放录音按钮
    $('.play-stop').show();//显示----暂停播放按钮
    $('.record-tips').stop().text('暂停播放');//提示----信息更改
    $('#chonglu-btn').fadeOut();//隐藏----重录按钮
    $('#addlu-btn').fadeOut();//隐藏----加录按钮
    //判断上次播放是否已全部播完，已播放完则重新播放，未播放完则继续播
    if(playPercent >= recordPercent)
    {
        playPercent = 0 ;
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
    }
    playing = setInterval("playPercentFun()",1000/6);
}
function startRecordUI(){
    isRecordingBool = 1;
    $('#record-btn').hide();//隐藏----录音按钮
    $('#record-play').show();//显示----录音&播放按钮
    //清除录音定时器
    recordPercent = 0;
    $('.record-percent-circle').removeClass('clip-auto');
    $('.right-record-percent').addClass('wth0');
    $('.left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},1000/6);
    clearInterval(recording);//暂停录音----清除录音定时器
    //初始化录音进程容器
    $('.record-percent-circle').stop().css('opacity','1');//将录音进度跳改变透明度1
    $('.play-percent-circle').hide();//隐藏----播放录音进度条
    //$('.time-show').show();//显示----录音时长
    $('.record-tips').stop().text('录制完毕点击停止');//提示----信息更改
    //开启录音计时
    recording = setInterval("recordPercentFun()",1000/6);
    $('.record-stop').show();//显示----暂停录音按钮
}
function pauseVoiceUI(){
    $('#chonglu-btn').fadeIn();//显示----重录按钮
    $('#addlu-btn').fadeIn();//显示----加录按钮
    $('.play-stop').hide();//隐藏----暂停播放按钮
    $('.play-start').show();//显示----播放录音按钮
    $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
    clearInterval(playing);//暂停播放----清除播放录音定时器
    if (recordPercentArray.length==5) {
        $('#addlu-btn').fadeOut();
    }
}

function initVoice(){
    //开始录音
    $('#record-btn').click(function(e) {
        if (isWeiXinBorrower()==true) {
            startRecord1();
        }else{
            dataLoadedError("录音功能仅支持在微信中使用");
        }
    });
    //停止录音
    $('.record-stop').click(function(e) {
        stopRecord1();
    });
    //播放录音
    $('.play-start').click(function(e) {
        playVoice1(recordIdArray[currentVoiceIndex]);
    });

    //暂停播放
    $('.play-stop').click(function(e) {
        pauseVoice1(recordIdArray[currentVoiceIndex]);
    });

    //重录
    $('#chonglu-btn').click(function(e) {
        isReRecordingBool = 1;
        $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');//发送回答变成不可操作状态
        intRecordPlayFun();//录音控件初始化
        $('.record-tips').stop().text('点击开始录音，每次最多可录60秒');//提示----信息更改
        addRecordTime = 0 ;//重录和发送回答后单词录音时长置为0
        //暂停播放全部录音
        recordPercentArray.splice(currentVoiceIndex,1);
        recordIdArray.splice(currentVoiceIndex,1);
        $('#answer-log-item'+currentVoiceIndex+' i').css('left',0);
        $('#answer-log-item'+currentVoiceIndex+' em').css('width',0);
        $('#answer-log-item'+currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
    });

    //加录
    $('#addlu-btn').click(function(e) {
        addVoiceID = 1;
        $('.clear-record-control').show();
        intRecordPlayFun();//录音控件初始化
        $('.record-tips').stop().text('每次加录时长最多60秒，共' + talTime + '秒');//提示----信息更改
        //$('.answer-mc').slideDown();
       // $('.answer-mc>p').stop().text('录音最长' + talTime + '秒，单次录音最长60秒，最多加录4次');//提示----信息更改
        $('.answer-mc>span:nth-of-type(2)').stop().text(talTime + '秒');//提示----信息更改
        if (recordPercentArray.length<5) {
            currentVoiceIndex = recordPercentArray.length;
            // currentVoiceIndex++;
        }else{
            dataLoadedError("您已经无法进行加录");
        }
    });

    //发送回答
    $('.send-answer').click(function(e) {
      if ($('.send-answer').hasClass("bg-greyabc")) {
        return false;
      };
        // intRecordPlayFun();//录音控件初始化
        // $('.record-tips').stop().text('点击开始录音，每次最多可录60秒');//提示----信息更改
        // addRecordTime = 0 ;//重录和发送回答后单词录音时长置为0
        // console.log("状态是"+reAnswerStr);
        // console.log("是不是语音"+isVoiceAns);
        if (isVoiceAns == 0) {
            if (isWeiXinBorrower()==false) {
                dataLoadedError("本语音播放仅支持在微信中播放");
                return;
            }
           if (isRecordingBool==1) {
                dataLoadedError("录音进行中，请勿其他操作");
                return;
           };
           totleSeconds = 0;
           for (var i = 0; i < recordIdArray.length; i++) {
                var seconds = $('#answer-log-item'+i+' span').text();
                seconds = parseInt(seconds.substring(0,seconds.length-1));
                totleSeconds = parseInt(totleSeconds)+seconds;
           };
           // isRefuse = 2;
           friendTips("您总共录了"+recordIdArray.length+"段录音,共计"+totleSeconds+"s,是否确定发送？","取消","确定",2);
        }else{
            var postWhere = "";
            var isReAns = 0;
            //reAnswerStr 0 重答原问题 1重答追问，2回答原问题 ,3回答追问
            if (reAnswerStr == 2 || reAnswerStr == 3) {
                if (reAnswerStr == 2) {
                    postWhere = postAnswer;
                }else if (reAnswerStr == 3) {
                    postWhere = postAnswerForZhuiwen;
                }
                dataLoading("图文回答提交中");
                $.ajax({
                    url: postWhere,
                    type: 'post',
                    dataType: 'json',
                    data: {"qaId":qaId,"deviceType":2,"url":"","answerLen":"","content":$("#textField").val(),"pics":pics},
                    success: function(result){
                        clearToastDialog();
                        if (result.result=="success") {
                            dataLoadedSuccess("提交成功!");
                            window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
                        }else{
                            dataLoadedError(result.message);
                        }
                    }
                });
            }else if(reAnswerStr == 1 || reAnswerStr == 0){
              postWhere = reAnswer;
              isReAns = reAnswerStr;
                /**if (reAnswerStr == 1) {
                postWhere = reAnswer;
                    isReAns = 1;
                }else if (reAnswerStr == 0) {
                    postWhere = reAnswer;
                    isReAns = 0;
                }*/
                $.ajax({
                    url: postWhere,
                    type: 'post',
                    dataType: 'json',
                    data: {"qaId":qaId,"deviceType":2,"url":"","isZhuiwen":isReAns,"answerLen":"","content":$("#textField").val(),"pics":pics},
                    success: function(result){
                        if (result.result=="success") {
                            dataLoadedSuccess("提交成功!");
                            window.location.replace("qanda_detail.html?id="+qaId+"&typeId="+typeId);
                        }else{
                            dataLoadedError(result.message);
                        }
                    }
                });
            }

        }
    });
}

function saveFunction(){
    $("#iosDialog1").fadeOut(100,$("#iosDialog1").remove());
    if (appType != 'h5' && !!appType) {
        if (appCurRecordSeconds==0) {
            dataLoadedError("回答语音时长不能为空");
        }else{
            appReleasedRecord();
        }
    }else{
        loadVoice1(0);
    }
}
function stopRecordButton(){
    isRecordingBool = 0;
    clearInterval(recording);//暂停录音----清除录音定时器
    $('.record-stop').hide();//隐藏----暂停录音按钮
    $('.play-start').show();//显示----播放录音按钮
    //初始化录音播放进程容器
    $('.record-percent-circle').stop().css('opacity','0.3');//将录音进度改变透明度0.3
    $('.play-percent-circle').show();//显示----播放录音进度条
    $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
    //其他操作按钮初始化
    $('#chonglu-btn').fadeIn();//显示----重录按钮
    if (currentVoiceIndex<4) {
        $('#addlu-btn').fadeIn();//显示----加录按钮
    };
    $('.send-answer').removeClass('bg-greyabc').addClass('bg-orange');//发送回答变成可操作状态
    //暂停录音时将已录制的时长传递并换算传递给 ---单次录音时长
    addRecordTime = Math.floor(recordPercent/6);
    //添加动态秒数
    recordPercentArray.splice(currentVoiceIndex, 0, recordPercent);
    var leftAndWidth = addRecordTime/60*100+'%';
    $('#answer-log-item'+currentVoiceIndex+' i').css('left',leftAndWidth);
    $('#answer-log-item'+currentVoiceIndex+' em').css('width',leftAndWidth);
    $('#answer-log-item'+currentVoiceIndex+' span').text(addRecordTime+'s').removeClass('fc-greyabc').addClass('fc-orange');
    if (recordPercentArray.length==5) {
         $('#addlu-btn').fadeOut();
    }
}

//录音控件初始化
function intRecordPlayFun()
{
    //回到初始状态-只有录音按钮可点击
    $('.time-show').html('0s');//隐藏----录音时长
    $('#chonglu-btn').fadeOut();//隐藏----重录按钮
    $('#addlu-btn').fadeOut();//隐藏----加录按钮
    $('#record-play').hide();//隐藏----录音和播放控制按钮容器
    $('.record-stop').hide();//隐藏----暂停录音按钮
    $('.play-start').hide();//隐藏----播放录音按钮
    $('.play-stop').hide();//隐藏----暂停播放按钮
    // $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');//发送回答变成不可操作状态
    $('#record-btn').show();//显示----录音按钮
    //清除播放录音定时器
    playPercent=0;
    $('.play-percent-circle').removeClass('clip-auto');
    $('.right-play-percent').addClass('wth0');
    $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
    clearInterval(playing);

    //清除录音定时器
    recordPercent = 0;
    $('.record-percent-circle').removeClass('clip-auto');
    $('.right-record-percent').addClass('wth0');
    $('.left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},1000/6);
    clearInterval(recording);
}

//录音计时
function recordPercentFun()
{
    //每次录音满60s时停止录音
    if(recordPercent==360){
        // recordPercent=360;//判断录音满60s
        // clearInterval(recording);//暂停录音
        // $('record-stop').hide();//隐藏----暂停录音按钮
        // $('.play-start').show();//显示----播放录音按钮
        // $('.record-percent-circle').stop().css('opacity','0.3');//将录音进度改变透明度0.3
        // $('.play-percent-circle').show();//显示----播放录音进度条
        // $('.send-answer').removeClass('bg-greyabc').addClass('bg-orange');//发送回答变成可操作状态
        // $('#chonglu-btn').fadeIn();//显示----重录按钮
        // if (recordPercentArray.length==5) {
        //    $('#addlu-btn').fadeOut();
        // }else{
        //    $('#addlu-btn').fadeIn();//显示----加录按钮
        // }
        // addRecordTime = Math.floor(recordPercent/6);

        stopRecordButton();
        // stopRecord1();
    }
    else if(recordPercent>180){
        $('.record-percent-circle').addClass('clip-auto');
        $('.right-record-percent').removeClass('wth0');
    }
    $('.left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},1000/6);
    recordPercent = recordPercent + 1 ;
    $('.time-show').html(Math.floor(recordPercent/6) + 's');
}

//播放录音计时
function playPercentFun()
{
    //dataLoadedError(recordPercent);
    //判断是否播放完-是则停止播放
    if(playPercent>=recordPercent)
    {
        playPercent=0;
        clearInterval(playing);//暂停播放
        $('.play-stop').hide();//隐藏----暂停播放按钮
        $('.play-start').show();//显示----播放录音按钮
        $('.play-percent-circle').removeClass('clip-auto');
        $('.right-play-percent').addClass('wth0');
        $('#chonglu-btn').fadeIn();//显示----重录按钮
        $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
        if (recordPercentArray.length==5) {
           $('#addlu-btn').fadeOut();
        }else{
           $('#addlu-btn').fadeIn();//显示----加录按钮
        }
    }else if(playPercent>180)
    {
        $('.play-percent-circle').addClass('clip-auto');
        $('.right-play-percent').removeClass('wth0');
    }
    $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
    playPercent = playPercent + 1 ;
    $('.time-show').html(Math.floor(recordPercent/6)-Math.floor(playPercent/6) + 's');//提示----信息更改
}

//点击各个voice方法
function recordButton(index){
    if (isWeiXinBorrower()==false) {
        dataLoadedError("本语音播放仅支持在微信中播放");
        return;
    }else if (isRecordingBool==1) {
        dataLoadedError("录音进行中，请勿其他操作");
        return;
    }else if (isReRecordingBool==1) {
        dataLoadedError("重录准备中，请勿其他操作");
        return;
    };
    if (recordIdArray[currentVoiceIndex]!=null) {
        stopVoice1(recordIdArray[currentVoiceIndex]);
        //清除播放录音定时器
        playPercent=0;
        $('.play-percent-circle').removeClass('clip-auto');
        $('.right-play-percent').addClass('wth0');
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
        clearInterval(playing);
    };
    if (recordPercentArray.length<index) {
        dataLoadedError("请连续录音");
    }else{
        currentVoiceIndex = index;
        recordPercent = recordPercentArray[currentVoiceIndex];
        if (recordPercent!=null&&recordPercent.length!=0) {
            if(recordPercent>180){
                $('.record-percent-circle').addClass('clip-auto');
                $('.right-record-percent').removeClass('wth0');
            }else{
                $('.record-percent-circle').removeClass('clip-auto');
                $('.right-record-percent').addClass('wth0');
            }
            $('.left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},1000/6);
            $('.time-show').html(Math.floor(recordPercent/6) + 's');
            $('#chonglu-btn').fadeIn();//显示----重录按钮
            if (recordPercentArray.length==5) {
                $('#addlu-btn').fadeOut();
            }else{
                $('#addlu-btn').fadeIn();//显示----加录按钮
            }
            $('#record-btn').hide();//隐藏----录音按钮
            $('#record-play').show();//显示----录音&播放按钮
            $('.play-stop').hide();//隐藏----暂停播放按钮
            $('.play-start').show();//显示----播放录音按钮
        }else{
            $('.clear-record-control').show();
            intRecordPlayFun();//录音控件初始化
            $('.record-tips').stop().text('每次加录时长最多60秒，共' + talTime + '秒');//提示----信息更改
            //$('.answer-mc').slideDown();
          //  $('.answer-mc>p').stop().text('录音最长' + talTime + '秒，单次录音最长60秒，最多加录4次');//提示----信息更改
            $('.answer-mc>span:nth-of-type(2)').stop().text(talTime + '秒');//提示----信息更改
        }
    }
}
//发布按钮点击接受语音地址
function sendAppFileVoice(voiceFile,status){
    // status 0成功 1失败
    if (status==1) {
        dataLoadedError("发布语音失败，请重新发布");
    }else{
        if (reAnswerStr==2||reAnswerStr==3) {
            postAnswerOfQuestionRequest(voiceFile,appCurRecordSeconds);
        }else{
            reAnswerFunction(voiceFile,appCurRecordSeconds);
        };
    }
}


