// answer.js
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

var userTest = "";
var reAnswerStr = "";
var pics = [];
var from = "";
// var isRefuse = "";
var isVoiceAns = 1;
var currentVoiceObj = "";
var judgeZhuiwen = "";

var topicId = "";
var topicType = "";
//var typeId = "";

var sendBool = true;
var appType = initOs.getOs();

// app相关接口
var appTopicqandaRecord = {
    appImgLength: 3,
    // app调用选择图片
    selectphoto: function(){
        cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SelectPhotoPlugin", "selectPhoto",[appTopicqandaRecord.appImgLength-picLen]);
        cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "selecterImg",[appTopicqandaRecord.appImgLength-picLen]);
    },
    uploadAppImgFuntion: function(data){
        var html = "<figure contenteditable=\"false\" id=\"figure_"+picNextIndex+"\">";
        html += 	"<img id=\"img_"+picNextIndex+"\"  src=\""+data+"\"/>";
        html += 	"<a class=\"loading_progress\" style=\"display:none;\"></a>";
        html += 	"<span class=\"bg-orange\" onclick=\"deletePic("+picNextIndex+","+ appTopicqandaRecord.appImgLength +",'.add-qanda-pic1');\"><img src=\"../bdt/images/img_delete.png?v=20161201134425\" /></span>";
        html += "</figure>";

        $(".add-qanda-pic1").before(html);
        //移除菊花；
        $(".loading_progress").fadeOut(1000);

        var img=document.getElementById("img_"+picNextIndex);

        pics[picNextIndex]=data;
        var oldIndex = picNextIndex;
        picLen++;
        picNextIndex++;
        if(picLen >= appTopicqandaRecord.appImgLength){
            $(".add-qanda-pic1").hide();
        }
    }
};
//app选完图回调
function selectImgSuccess(imgStr){
    appTopicqandaRecord.uploadAppImgFuntion(imgStr);
}

$(document).ready(function() {
    initOs.setCallBack({
        app: function(){
            $('#appAnswerWay1').show();

            //发送回答
            $('.send-answer').unbind('click').click(function(e) {
                if ($('.send-answer').hasClass("bg-greyabc")) {
                    return false;
                };
                if (isVoiceAns == 1) {
                    // alert("是不是语音"+isVoiceAns);
                    if (appType != 'h5' && !!appType) {
                        var s = Math.floor(appCurRecordSeconds/100) + 1;
                        // totleSeconds = $('.time-show').text();
                        friendTips("您总共录了"+s+"s,是否确定发送？","取消","确定",3);
                    }
                }else{
                    var content = $("#textField").val();
                    if (content.length>0&&content!=null&&content!=""&&sendBool==true) {
                        postAnswerOfQuestionRequest();
                    }else{
                        dataLoadedError("回答内容不能为空");
                    }
                }
            });

            window.onbeforeunload=function(){
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "del", [0]);
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "restart", [0]);
            };
            $("#filehidden").attr("type", "button");
            $("#filehidden").on('click', appTopicqandaRecord.selectphoto);

            initOs.loadOverFn('../../themes/js/webApp/appRecord.js?123', function(){
                initAppRecordUI();
            });
        },
        h5: function(){
            $('#answerWay1').show();
            initVoice();
            wxRequest1();
            // uploadImg("#filehidden",5242880,3,".add-qanda-pic1");
        }
    });


    if (isWeiXinBorrower()) {
        // dataLoading("页面加载中...");
    }
    topicId = request("id");
    topicType = request("topicType");
    if(topicType == 0 || topicType == 1){
        $('#pageTitle').text('发言');
    }else{
        $('#pageTitle').text('回答');
    }

    //typeId = request("typeId");
    userTest = getSessionUser();
    $.each($("#chooseAnsWay div"), function(index, val) {
        $(this).on('click', function(event) {
            event.preventDefault();
            $("#chooseAnsWay div").removeClass('active');
            writeClientSession("wayToAns",index);
            if (index == 0) {
                $(this).addClass('active');
                isVoiceAns = 1;
                if($("#textField").val()!=""){
                    friendTips2("您选择的语音回答，会清除已有内容","返回文字回答","继续语音回答",1);
                }
                $("#chooseAnsWay i").css("left","25%");
                $("#chooseAnsWay img").eq(0).attr("src","../bdt/images/voicemode-1.png?v=20170223120710");
                $("#chooseAnsWay img").eq(1).attr("src","../bdt/images/textmode.png?v=20170223120710");
                $("#wayToAnswer").css("left","0");
            }else{
                if (isRecordingBool==1) {
                    dataLoadedError("录音进行中,请停止录音在进行其他操作");
                    return;
                }else{
                    $(this).addClass('active');
                    isVoiceAns = 2;
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
                    $("#chooseAnsWay img").eq(0).attr("src","../bdt/images/voicemode.png");
                    $("#chooseAnsWay img").eq(1).attr("src","../bdt/images/textmode-1.png");
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


    /** by wangzhen 20170513 调整back程序
     $("#back").click(function() {
        if (isNormalBackBool==1) {
            //document.referrer是获取上一页的url
            if (typeId!=null) {
                    window.location.href = "topicqanda.html?id="+topicId+"&typeId="+typeId+"&from="+request("from");
            }else{
                    window.location.href = "topicqanda.html?id="+topicId+"&from="+request("from");
            }
        }else{
            historyUtils.back();
        }
    });
     */

    // reAnswerStr = request("reAnswer");
    // wxRequest1();
    wxShare1();
    // getQaDetailRequest();
    // initVoice();
    getTopicStr();

    //普通用户只能文字回答-禁止语音回答
    // if(userTest.masterLvl<1){
    //     $('#chooseAnsWay').hide();
    //     $("#wayToAnswer").css("left","-100%").show();
    //     isVoiceAns = 2;
    // }else{
    //     $('#chooseAnsWay').show();
    //     $("#wayToAnswer").show().css("transition","all ease 0.5s");
    // }

    //文字回答和文字评论部分点击更多-展开或隐藏三行外的文字
    $('.show-text').each(function(index, element) {
        $(this).click(function(e) {
            $(this).toggleClass('hide-text');
            $(this).find('.more-text>i').text() == '更多' ? $(this).find('.more-text>i').text('收起') : $(this).find('.more-text>i').text('更多');
        });
    });
});

//获取话题
function getTopicStr(){
    // $.ajax({
    //     type: "post",
    //     url: getTopic,
    //     dataType: "json",
    //     async: true,
    //     data:{"id":topicId},
    //     success: function(result) {
    //         if (result.result == "success") {
    //             configUI(result.data.topic);
    //         }else{
    //             dataLoadedError(result.message);
    //         }
    //     }
    // });
}

//文章的内容
function configUI(groups){
    // configwxShare(groups);

}


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
        isVoiceAns = 2;
        if (appType != 'h5' && !!appType) {
            intAppRecordPlayFunc();
        }else{
            recordIdArray = [];
            recordPercentArray = [];
            currentVoiceIndex = 0;
            intRecordPlayFun();
            initSecondsFunction();
        }
        if(initOs.getOs() == 'ios'){
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "restart", [0]);
        }
    }else{
        isVoiceAns = 1;
        $("#textField").val("");
        pics = [];
        deletePic(0,3,'.add-qanda-pic1');
        deletePic(1,3,'.add-qanda-pic1');
        deletePic(2,3,'.add-qanda-pic1');
        $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');
        if(initOs.getOs() == 'ios'){
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "restart", [0]);
        }
    }
    // alert(isVoiceAns);
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
        isVoiceAns = 1;
        $("#chooseAnsWay div").removeClass('active');
        $("#chooseAnsWay div").eq(0).addClass('active');
        $("#chooseAnsWay i").css("left","25%");
        $("#chooseAnsWay img").eq(0).attr("src","../bdt/images/voicemode-1.png0");
        $("#chooseAnsWay img").eq(1).attr("src","../bdt/images/textmode.png");
        $("#wayToAnswer").css("left","0");
        $('#textField').val('');
    }else{
        isVoiceAns = 2;
        $("#chooseAnsWay div").removeClass('active');
        $("#chooseAnsWay div").eq(1).addClass('active');
        $("#chooseAnsWay i").css("left","75%");
        $("#chooseAnsWay img").eq(0).attr("src","../bdt/images/voicemode.png?v=20170223120710");
        $("#chooseAnsWay img").eq(1).attr("src","../bdt/images/textmode-1.png?v=20170223120710");
        $("#wayToAnswer").css("left","-100%");
    }
    // alert(isVoiceAns);
    $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
}
function tipsCancle(){
    $('#js-face').hide();
    $('#container-pop').fadeOut();
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
//微信语音的一些问题
function wxRequest1(){
    // $.ajax({
    //     type: "post",
    //     url: getConfigValueUrl,
    //     dataType: "json",
    //     async: true,
    //     data: {
    //         "keys": "maxAudioLength"
    //     },
    //     success: function(result) {
    //         if (result.result == "success") {
    //             maxAudioLength = Number(result.data.vals[0]);
    //             maxAudioTips = "点击开始录音最多录制" + maxAudioLength + "”...";
    //             $('.record-tips').text(maxAudioTips);
    //         }
    //     }
    // });
}
function wxShare1() {
    // $.ajax({
    //     type: "post",
    //     url: getWxShareDataUrl,
    //     dataType: "json",
    //     async: true,
    //     data: {
    //         "url": wxShareUrl
    //     },
    //     success: function(result) {
    //         if (result.result == "success") {
    //             wx.config({
    //                 debug: false,
    //                 appId: result.data.appId,
    //                 timestamp: result.data.timestamp,
    //                 nonceStr: result.data.nonceStr,
    //                 signature: result.data.signature,
    //                 jsApiList: ['checkJsApi', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice'],
    //             });
    //             wx.ready(function() {
    //                 clearToastDialog();
    //                 var voice = {
    //                     localId: '',
    //                     serverId: ''
    //                 };
    //                 wx.checkJsApi({
    //                     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
    //                     // 需要检测的JS接口列表，所有JS接口列表见附录2,
    //                     success: function(res) {}
    //                 });
    //                 // 4.4 监听录音自动停止
    //                 wx.onVoiceRecordEnd({
    //                     complete: function(res) {
    //                         recordIdArray.splice(currentVoiceIndex, 0, res.localId);
    //                         // alert(res);
    //                         // clearInterval(recording);//暂停录音----清除录音定时器
    //                         // if(recordPercent!=360){
    //                         //     stopRecordButton();
    //                         // }
    //                     }
    //                 });
    //                 wx.onVoicePlayEnd({
    //                     complete: function(res) {
    //                         sectionPlay++;
    //                         if (sectionPlay<localAnswerIDArray.length) {
    //                             playVoice(localAnswerIDArray[sectionPlay],preVoiceObj);
    //                         }else{
    //                             currentVoiceId = "";
    //                             playErrorUI(currPayObjId);
    //                             wxplaying = false;
    //                         }
    //
    //                     }
    //                 });
    //                 wx.stopRecord();
    //             });
    //         } else {
    //         }
    //     }
    // });
}

//开启录音
function startRecord1(){
    isReRecordingBool = 0;
    wx.startRecord({
        cancel: function() {
        },
        success: function(res) {
            startRecordUI();
        },
        fail: function(res) {
            dataLoadedError("开启录音错误");
            intRecordPlayFun();
            $('#answer-log-item'+currentVoiceIndex+' i').css('left',0);
            $('#answer-log-item'+currentVoiceIndex+' em').css('width',0);
            $('#answer-log-item'+currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
            // dataLoadedError("sorry，系统未能识别本段语音，请重录本段录音！");
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
            // dataLoadedError(JSON.stringify(res));
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
                // if (reAnswerStr==2||reAnswerStr==3) {
                postAnswerOfQuestionRequest(wxRecordId,totleSeconds);
                // }else{
                //     reAnswerFunction(wxRecordId,totleSeconds);
                // };
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
    $('.send-answer').unbind('click').click(function(e) {
        if ($('.send-answer').hasClass("bg-greyabc")) {
            return false;
        };
        if (isVoiceAns == 1) {
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
            var content = $("#textField").val();
            if (content.length>0&&content!=null&&content!=""&&sendBool==true) {
                postAnswerOfQuestionRequest();
            }else{
                dataLoadedError("回答内容不能为空");
            }
        }

    });
}
//发送回答请求
//首次回答成功 或者回答追问
function postAnswerOfQuestionRequest(wxRecordId,curCount) {
    var content = $("#textField").val();
    var id = request('id');
    if (isVoiceAns==1) {
        if (appType != 'h5' && !!appType) {
            isVoiceAns = 3;
            curCount = Math.floor(curCount/100) + 1;
        }
        content = "";
        pics = "";
    }else{
        wxRecordId = "";
        curCount = "";
    }
    if(content){
        type = 'text';
        url = '/comments/topiccomment.html';
    }else{
        type = 'fayan';
        url = '/record/voicetype.html';
    }
    // dataLoading("数据加载中...");
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        async: true,
        // data:{"topicId":"","deviceType":"1-weixin,2-text","url":"weixin时，输入微信音频上传返回的serverId","answerLen":"","content":"","pics":""}
        data:{
            "topicId":topicId,
            "deviceType":isVoiceAns,
            "url":wxRecordId,
            "answerLen":curCount,
            "content":content,
            "pics":pics,
            "id":id,
            "type":type,
            "_csrf":csrf,
        },
        success: function(result){
            clearToastDialog();
            if (result.result=="success") {
                dataLoadedSuccess("回答成功,正在跳转");
                setTimeout("gotoTopic()",2000);
                sendBool = false;

            }else{
                dataLoadedError(result.message);
            }
        }
    });
}

function gotoTopic(){
    var id= request('id');
    window.location.replace("/articles/topicqanda.html?id="+id);
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
        stopRecordButton();
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

function myClose(){
    writeClientSession('topic-sortType',1);
}


//发布按钮点击接受语音地址
function sendAppFileVoice(voiceFile,status){
    // status 0成功 1失败
    if (status==1) {
        dataLoadedError("发布语音失败，请重新发布");
    }else{
        postAnswerOfQuestionRequest(voiceFile,appCurRecordSeconds);
    }
}