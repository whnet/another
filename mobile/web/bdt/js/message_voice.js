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

var typeId = "";
var userTest = "";
var reAnswerStr = "";
var pics = [];
var from = "";
var currentVoiceObj = "";
var judgeZhuiwen = "";

var topicId = "";
var typeId = "";

var publishLocationId = "0";
var publishLocationType = "";

var appType = "";
$(document).ready(function() {
    appType = readClientSession("appType");
    if (appType==isApp) {
        initAppRecordUI();
    }else{
        $('#messageVoiceId').show();
        initVoice();
        wxRequest1();
    }

    if (isWeiXinBorrower()) {
    dataLoading("页面加载中...");
    }
    from = request("from");
    if (from=="square") {
        publishLocationType = "";
    }else if (from=="circle") {
        publishLocationType = "2";
    }
    publishLocationId = request("publishLocationId");
    if (publishLocationId == null) {
        publishLocationId = "";
    };
    topicId = request("id");
    typeId = request("typeId");
    userTest = getSessionUser();
    $("#textField").keydown(function(event) {
       if($.trim($("#textField").val())!=""){
            $('.send-answer').removeClass('bg-greyabc').addClass('bg-orange');
       }
    });
    $("#textField").keyup(function(event) {
       if($.trim($("#textField").val())==""){
            $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');
       }
    });

    $("#back").click(function() {
        friendTips("是否要放弃您当前编辑的内容?","取消","确定",3);
    });
    // wxRequest1();
    wxShare1();
    
    $("#submitContent").click(function(){
       if (isRecordingBool==1) {
            dataLoadedError("录音进行中，请勿其他操作");
            return;
       };

       if (appType==isApp) {
            // totleSeconds = $('.time-show').text();
            var s = Math.floor(appCurRecordSeconds%6000/100);
            var S = appCurRecordSeconds%100;
            friendTips("您总共录了"+s.toString() + '.' +S.toString()+"s,是否确定发送？","取消","确定",2);
       }else{
       totleSeconds = 0;
       for (var i = 0; i < recordIdArray.length; i++) {
            var seconds = $('#answer-log-item'+i+' span').text();
            seconds = parseInt(seconds.substring(0,seconds.length-1));
            totleSeconds = parseInt(totleSeconds)+seconds;
       };
       // isRefuse = 2;
        friendTips("您总共录了"+recordIdArray.length+"段录音,共计"+totleSeconds+"s,是否确定发送？","取消","确定",2);
       }
    });

	//如果来源于圈子或楼盘就显示编辑标签工具栏
	if(from=='loupan_page'){
	
		$('#editLabel').show();
		LoadLouPanContentType("editLabel");
		$('.edit-tool-bar').css({'bottom':'2.5rem','left':'0','position':'absolute'});
	}
	else if(from=='circle'){
		$('#editLabel').show();
		//根据圈子编号得到圈主
		requestQzShow(publishLocationId);
		$('.edit-tool-bar').css({'bottom':'2.5rem','left':'0','position':'absolute'});
	}
//	$('#showOrHideLabel').click(function(e) {
//		if(from=='loupan_page'){
//			$('#labelList').toggle();
//			$('#fixedLabel').show();
//			$('#myLabel').hide();
//			$('#circleLabel').hide();
//		}else if(from=='circle'){
//			$('#labelList').toggle();
//			$('#fixedLabel').hide();
//			$('#myLabel').show();
//			$('#circleLabel').show();
//		}
//$(this).toggleClass('on');
//	});
//	$('#customTagBtn').click(function(e) {
//		$('#custonTagEditDialog').show();
//	});
//	$('#cancelEditLabel').click(function(e) {
//		$('#custonTagEditDialog').hide();
//	});

});

function saveFunction(type){
    if (type==3) {
        $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
        /**
        var url = document.referrer;
        if (url!=null&&url.length!=0) {
            if (url.indexOf("/square.html")>=0) {
                window.location.href = "/square.html";
            }else{
                if (from=="circle") {
                    writeClientSession("circleRefresh",1);
                };
                window.location.href = "javascript:history.back(-1)";
            }
        }else{
           window.location.href = "index.html";
        }*/
        customHistoryUtilsBack();
    }else{
        $("#iosDialog1").fadeOut(100,$("#iosDialog1").remove());
        var content = trim($('#edit-mark').val());
        if (appType==isApp) {
            if (content==""&&appCurRecordSeconds==0) {
                dataLoadedError("分享内容或者语音不能为空");
            }else if (content!=null&&content!=""&&appCurRecordSeconds<=0) {
                postVoiceMessage("","");
            }else {
                //执行app的操作
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "update", [0]);
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "stop", [0]);
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "upload", [0]);
            }
        }else{
            var voiceLength = recordIdArray.length;
            if (content==""&&voiceLength==0) {
                dataLoadedError("分享内容或者语音不能为空");
            }else if (content!=null&&content!=""&&voiceLength<=0) {
                postVoiceMessage("","");
            }else{
                loadVoice1(0);
            }
        }
    }
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
                dataLoadedError("开启录音错误");
                intRecordPlayFun();
                $('#answer-log-item'+currentVoiceIndex+' i').css('left',0);
                $('#answer-log-item'+currentVoiceIndex+' em').css('width',0);
                $('#answer-log-item'+currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
                // dataLoadedError(JSON.stringify(res));
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
                        postVoiceMessage(wxRecordId,totleSeconds);
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
    });
}


//提交语音消息
function postVoiceMessage(wxRecordId,curCount) {
    var content = trim($('#edit-mark').val());
    dataLoading("数据加载中...");
    var deviceTypeStr = 1;
    if (appType==isApp) {
        deviceTypeStr = 3;
        curCount = Math.floor(curCount%6000/100) + 1;
    }
    $.ajax({
        type: "post",
        url: submitVoiceMessage,
        dataType: "json",
        async: true,
        // 发布短文所在的地盘，如果是专家这里为专家的id，如果是楼盘，为楼盘的id
        data:{"title":$("#message_title").val(),"textContent":content,"deviceType":deviceTypeStr,"url":wxRecordId,"voiceLen":curCount,"publishLocationId":publishLocationId,"publishLocationType":publishLocationType,"tagLabel":tag_cur_name},
        // data:{"topicId":topicId,"deviceType":isVoiceAns,"url":wxRecordId,"answerLen":curCount,"content":content,"pics":pics},
        success: function(result){
            // alert(deviceTypeStr);
            clearToastDialog();
            if (result.result=="success") {
                dataLoadedSuccess("发布语音成功");
                /**
                if (from=="circle") {
                     // window.location.href = "/circle_page.html?id="+publishLocationId;
                    // alert(document.referrer);
                    window.location.href = document.referrer;
                }else if (from=="square") {
                    window.location.href = "square.html";
                }else{
                    window.location.href = document.referrer;
                }*/
                // window.location.href = "topicqanda.html?id="+topicId+"&typeId="+typeId;
                window.location.replace("/square_detail.html?id="+result.data.id);
            }else{
                dataLoadedError(result.message);
            }
        }
    });
}
        
// function saveFunction(){
//     $("#iosDialog1").fadeOut(100,$("#iosDialog1").remove());
//     loadVoice1(0);
// }
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
    }if (isRecordingBool==1) {
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

window.onbeforeunload=function(){
    if (appType==isApp) {
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "del", [0]);
    };
}
function myClose(){
    writeClientSession('topic-sortType',1);
    if (from=="circle") {
        writeClientSession("circleRefresh",1);
    };
}
//app客户端 录音操作
var appCurRecordSeconds = 0; //当前录音时长
var appCurPlayingSeconds = 0;//当前播放时长
var appCurrentVoiceStr = "";
var appTolMaxRecordCount = 600000; //录音最长时间
var playstate = false;
function initAppRecordUI(){
    $('#appMessageVoiceId').show();
    //app录音
    $('#appRecordBtnId').click(function(e) {
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "start", [0]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "start", [0]);
    });
    //停止录音
    $('.record-stop').click(function(e) {
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "stop", [0]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "pause", [0]);
    });
   // 播放录音与暂停录音
    $("#appPlay-btn").click(function(){
        if($('#appPlay-btn').attr("state") == "false") return false;
        if($("#appPlay-btn > img").is(':hidden')){
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "pause", [0]);
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "playPause", [0]);
        }else{
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "open", [0]);
            if(playstate){
                cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "resum", [0]);
        }else{
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "play", [0]);
        }
        }
    }); 
    //重录
    $('#appChonglu-btn').click(function(e) {
        if($('#appChonglu-btn').attr("state") == "false") return false;
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "del", [0]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "restart", [0]);
    });

    // 继续录音
    $("#continue-record").click(function(){
        if($('#continue-record').attr("state") == "false") return false;
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "add", [""]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "start", [0]);
    })
}
function reStartAppRecordUI(){
    if($('#appChonglu-btn').attr("state") == "false") return false;
    isReRecordingBool = 1;
    intAppRecordPlayFunc();//录音控件初始化
    $('.record-tips').stop().text('点击开始录音，每次最多可录'+appTolMaxRecordCount/1000+'秒');//提示----信息更改
    addRecordTime = 0 ;//重录和发送回答后单词录音时长置为0
}
function startAppRecordUI(){
    // alert("开始录音");
    isRecordingBool = 1;
    $('#appRecordBtnId').hide();//隐藏----录音按钮
    $('#appRecord-play').show();//显示----录音&播放按钮
    $('.record-stop').show();
    //清除录音定时器
    recordPercent = 0;
    appCurRecordSeconds = 0;
    $('#recordPercent').removeClass('clip-auto');
    $('#right-record-percent').addClass('wth0');
    // $('#left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},1200);
    clearInterval(recording);//暂停录音----清除录音定时器
    //初始化录音进程容器
    $('.record-percent-circle').stop().css('opacity','1');//将录音进度跳改变透明度1
    $('.play-percent-circle').hide();//隐藏----播放录音进度条
    $('#continue-record').hide();//隐藏----播放录音进度条
    //$('.time-show').show();//显示----录音时长
    $('.record-tips').stop().text('点击可暂停录音');//提示----信息更改
    //开启录音计时
    recording = setInterval("appRecordPercentFun()",10);
    $('#appRecordStop').show();//显示----暂停录音按钮
}

// 继续录音
function continueAppTranscribe(){
    //开启录音计时
    recording = setInterval("appRecordPercentFun()",10);
    $('.record-percent-circle').stop().css('opacity','1');//将录音进度改变透明度0.3
    $('.play-percent-circle').stop().css('opacity','0.3');//将录音进度改变透明度0.3
    $('.record-stop').show(); //显示----暂停录音按钮
    $('#continue-record').hide(); //隐藏----继续录音按钮
    $('#appPlay-btn').css('opacity', '0.3').attr("state", "false"); // 透明度设置并设置状态----播放按钮
    $('#appChonglu-btn').css('opacity', '0.3').attr("state", "false"); // 透明度设置并设置状态----重录按钮
}

//录音计时
function appRecordPercentFun()
{
    //每次录音满60s时停止录音
    if(recordPercent.toFixed(1)==360.0||appCurRecordSeconds==appTolMaxRecordCount){
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "stop", [0]);
        stopAppRecordUI();
        return;
    }
    else if(recordPercent>180.0){
        $('.record-percent-circle').addClass('clip-auto');
        $('.right-record-percent').removeClass('wth0');
    }  
    appCurRecordSeconds++;
    recordPercent = parseFloat(recordPercent) + 0.006;
    $('.left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},1000);
    var m = Math.floor(appCurRecordSeconds/6000)>9?Math.floor(appCurRecordSeconds/6000):'0'+Math.floor(appCurRecordSeconds/6000);
    var s = Math.floor(appCurRecordSeconds%6000/100)>9?Math.floor(appCurRecordSeconds%6000/100):'0'+Math.floor(appCurRecordSeconds%6000/100);
    var S = appCurRecordSeconds%100>9?appCurRecordSeconds%100:'0' + appCurRecordSeconds%100;
    var str = m.toString() +　':' + s.toString() + '.' + S.toString();
    $('.time-show').html(str);
} 
function stopAppRecordUI(){
    isRecordingBool = 0;
    clearInterval(recording);//暂停录音----清除录音定时器
    $('.stop-btn').show();//显示----录音按钮
    $('.play-btn').show();//显示----播放录音按钮
    $('.record-stop').hide();//隐藏----暂停录音按钮
    //初始化录音播放进程容器
    $('.record-percent-circle').stop().css('opacity','0.3');//将录音进度改变透明度0.3
    $('.play-percent-circle').show();//显示----播放录音进度条
    $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
    //其他操作按钮初始化
    $('#appChonglu-btn').fadeIn();//显示----重录按钮
    $('.send-answer').removeClass('bg-greyabc').addClass('bg-orange');//发送回答变成可操作状态
    $('#appPlay-btn').css('opacity', '1').attr("state", "true"); // 透明度设置并设置状态----播放按钮
    $('#appChonglu-btn').css('opacity', '1').attr("state", "true"); // 透明度设置并设置状态----重录按钮
}
function startAppPlayVoiceUI(){
    // dataLoadedError("播放语音的UI");
    clearInterval(playing);//暂停播放----清除播放录音定时器
    $('#continue-record').css('opacity', '0.3').attr("state", "false");//隐藏继续录制按钮
    $('.record-tips').stop().text('暂停播放');//提示----信息更改
    $('#appChonglu-btn').css('opacity', '0.3').attr("state", "false");//隐藏----重录按钮
    $('#appPlay-btn img').hide();
    $('#appPlay-btn span').show();
    //判断上次播放是否已全部播完，已播放完则重新播放，未播放完则继续播
    if(playPercent >= recordPercent)
    {
        playPercent = 0 ;
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
    }
    playing = setInterval("appPlayPercentFun()",10);
}
//发布按钮点击接受语音地址
// function sendAppFileVoice(voiceFile,status){
//     // status 0成功 1失败
//     // alert(voiceFile+"//==============//");
//     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
//         alert("打开的文件系统");
//         console.log('打开的文件系统: ' + fs.name);
//         fs.root.getFile("maili0.mp3", { create: true, exclusive: false },
//         function (fileEntry) {
//             fileEntry.getMetadata(
//                 function (metadata) {
//                       alert(metadata.size); // get file size
//                 },
//                 function (error) {}
//             );
//             alert("是否是个文件？" + fileEntry.isFile.toString());
//             alert("是个文件" + fileEntry.isFile.toString());
//             console.log("是否是个文件？" + fileEntry.isFile.toString());
//             var dataObj = new Blob(['欢迎访问hangge.com'], { type: 'text/plain' });
//             readFile(fileEntry);
//         }, onErrorCreateFile);
//     }, onErrorLoadFs);
// }

//发布按钮点击接受语音地址
function sendAppFileVoice(voiceFile,status){
    // status 0成功 1失败
    // alert(voiceFile+"//==============//");
    if (status==1) {
        dataLoadedError("发布语音失败，请重新发布");
    }else{
        postVoiceMessage(voiceFile,appCurRecordSeconds);
    }
}
//播放录音计时
function appPlayPercentFun()
{
    playstate = true;
    appCurPlayingSeconds++;
    //dataLoadedError(recordPercent);
    //判断是否播放完-是则停止播放
    if(playPercent>=recordPercent){
        playstate = false;
        playPercent=0;
        appCurPlayingSeconds = 0;
        clearInterval(playing);//暂停播放
        $('#continue-record').css('opacity', '1').attr("state", "true");//显示继续录制按钮
        $('#appPlay-btn > img').show(); // 显示播放按钮
        $('#appPlay-btn > span').hide(); // 隐藏暂停按钮
        $('.play-percent-circle').removeClass('clip-auto');
        $('.right-play-percent').addClass('wth0');
        $('#appChonglu-btn').css('opacity', '1').attr("state", "true");//显示----重录按钮
        $('.record-tips').stop().text('重录、试听或者发送');//提示----信息更改
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
        return;
    }else if(playPercent>180) {
        $('.play-percent-circle').addClass('clip-auto');
        $('.right-play-percent').removeClass('wth0');
    }  
    playPercent = playPercent + 0.006;
    $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+playPercent+"deg)"},1000);
    var m = Math.floor(appCurPlayingSeconds/6000)>9?Math.floor(appCurPlayingSeconds/6000):'0'+Math.floor(appCurPlayingSeconds/6000);
    var s = Math.floor(appCurPlayingSeconds%6000/100)>9?Math.floor(appCurPlayingSeconds%6000/100):'0'+Math.floor(appCurPlayingSeconds%6000/100);
    var S = appCurPlayingSeconds%100>9?appCurPlayingSeconds%100:'0' + appCurPlayingSeconds%100;
    var str = m.toString() + ":" + s.toString() + "." + S.toString();
    $('.time-show').html(str);//提示----信息更改
}     
//暂停播放录音
function pauseAppPlayVoiceUI(){
    $('#appChonglu-btn').fadeIn();//显示----重录按钮
    $('#continue-record').css('opacity', '1').attr("state", "true");//显示继续录制按钮
    $('#appChonglu-btn').css('opacity', '1').attr("state", "true");//显示重新录制按钮
    $('#appPlay-btn > img').show(); // 显示播放按钮
    $('#appPlay-btn > span').hide(); // 隐藏暂停按钮
    $('.record-tips').stop().text('重录、试听或者发送');//提示----信息更改
    clearInterval(playing);//暂停播放----清除播放录音定时器
}

//录音控件初始化
function intAppRecordPlayFunc()
{
    //回到初始状态-只有录音按钮可点击
    $('.time-show').html('00:00.00');//隐藏----录音时长
    $('#appChonglu-btn').css('opacity', '0.3').attr("state", "false");//隐藏----重录按钮
    $('#appRecord-play').hide();//隐藏----录音和播放控制按钮容器
    $('.record-stop').hide();//隐藏----暂停录音按钮
    $('.play-start').hide();//隐藏----播放录音按钮
    $('.play-stop').hide();//隐藏----暂停播放按钮
    $('#appPlay-btn').css('opacity', '0.3').attr("state", "false");//隐藏----播放录音按钮
    $('.stop-btn').hide();//隐藏----隐藏继续录音按钮
    // $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');//发送回答变成不可操作状态
    $('#appRecordBtnId').show();//显示----录音按钮
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
    $('.left-record-percent').stop().css({"-webkit-transform":"rotate("+recordPercent+"deg)"},100);
    clearInterval(recording);

    appCurRecordSeconds = 0; //当前录音时长
    appCurPlayingSeconds = 0;//当前播放时长
}