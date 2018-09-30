var waveTime = null;
var waveMcId = null;

var localAnswerIDArray = new Array();
var totalTime = 0;
//播放语音
var playing = false;
var wxplaying = false;
var preVoiceObj = null;
var preVoiceId = null;
var preTips = "";
var currentAudio = null;
var sectionPlay = 0;
//动态播放本地录音
var voiceCount = 0;
var currentVoiceId = "";
var payParam = null;
var answerIDArray = new Array();
var toListen = '/questions/listen.html';
var toListenyiwen = '/questions/listenyiwen.html';
var toListenArticle = '/articles/listen.html';
var toListenTopic = '/questions/listentopic.html';

var csrf = $('input[name="csrf"]').val();
var isWX = "";
var tradeId = 0;

var currPlayId, currPayType, currPayListenType, currPayObjId, currPayAllowPauseBool;

var allowPause = "";

var currentVoiceIdPing = "";

var isCoupon = 0;

var appType = "";
var g_all_contentType = 0;

$(document).ready(function () {
    initAllPlayVoiceState();
});


function onBridgeReady() {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
            "appId": payParam.appid,
            "timeStamp": payParam.timeStamp,
            "nonceStr": payParam.nonceStr,
            "package": payParam.packageValue,
            "signType": payParam.signType,
            "paySign": payParam.paySign
        },
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                getTradeResult();
                if ($('#' + currPayObjId + '').hasClass("pay")) {
                    $('#' + currPayObjId + '').removeClass("pay").addClass("free");
                };
                $('#' + currPayObjId + '>em').text("免费收听");
                judgeEndPlayUI();
            }
            else {
                if (res.err_msg == "get_brand_wcpay_request:cancel") {
                    dataLoadedError("取消支付");
                } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                    dataLoadedError("支付失败");
                };
            }
        }
    );
}

function judgeEndPlayUI() {
    if (currPayObjId.indexOf("ab_play_") > -1) {
        var otherObj = currPayObjId.replace("ab_play_", "a_play_");
        var otherText = $('#' + otherObj + '>em').text();
        if (otherText == "1元阅读" || otherText == "免费阅读" || otherText == "100金额阅读") {
            $('#' + otherObj + '>em').text("免费阅读");
        } else {
            $('#' + otherObj + '>em').text("免费收听");
        }
        if ($('#' + otherObj + '').hasClass("pay")) {
            $('#' + otherObj + '').removeClass("pay").addClass("free");
        };
    } else if (currPayObjId.indexOf("a_play_") > -1) {
        var otherObj = currPayObjId.replace("a_play_", "ab_play_");
        var otherText = $('#' + otherObj + '>em').text();
        if (otherText == "1元阅读" || otherText == "免费阅读" || otherText == "100金额阅读") {
            $('#' + otherObj + '>em').text("免费阅读");
        } else {
            $('#' + otherObj + '>em').text("免费收听");
        }
        if ($('#' + otherObj + '').hasClass("pay")) {
            $('#' + otherObj + '').removeClass("pay").addClass("free");
        };
    }

    //qadetail 界面
    if ($('#voice_state_id_2').length > -1) {
        var otherText = $('#voice_state_id_2>em').text();
        if (otherText == "1元阅读" || otherText == "免费阅读" || otherText == "100金额阅读") {
            $('#voice_state_id_2>em').text("免费阅读");
        } else {
            $('#voice_state_id_2>em').text("免费收听");
        }
        if ($('#voice_state_id_2').hasClass("pay")) {
            $('#voice_state_id_2').removeClass("pay").addClass("free");
        };
    }
    if ($('#voice_state_id').length > -1) {
        var otherText = $('#voice_state_id>em').text();
        if (otherText == "1元阅读" || otherText == "免费阅读" || otherText == "100金额阅读") {
            $('#voice_state_id>em').text("免费阅读");
        } else {
            $('#voice_state_id>em').text("免费收听");
        }
        if ($('#voice_state_id').hasClass("pay")) {
            $('#voice_state_id').removeClass("pay").addClass("free");
        };
    };
}

function getTradeResult() {
    dataLoading("正在确认支付结果...");
    $.ajax({
        type: "post",
        timeout: 3000,
        url: getTradeResultUrl,
        dataType: "json",
        data: {"tradeId": tradeId},
        success: function (result) {
            clearToastDialog();
            if (result.result == "success") {
            } else {
                friendTips("温馨提示", result.message, "取消", "重新加载");
            }
        },
        complete: function (XMLHttpRequest, status) {
            clearToastDialog();
　　    },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            clearToastDialog();
        }
    });
}

// 初始化所有录音播放状态
function initAllPlayVoiceState(){
    var $audio = $("#audio-mc");
    // 加载完成
    $audio.off("canplaythrough");
    // 播放中执行
    $audio.off("timeupdate");
    // 加载出错时
    $audio.off("error");

    // 重置今日头条列表语音样式
    $(".qandamarke").removeClass("playing");
    $(".qandamarke").removeClass("indexPlayVoice");
    // 重置问答精选语音样式
    $(".play-voice-box").find(".appui-loading").remove();
    $(".play-voice-box").find(".suspend-btn").hide();
    $(".play-voice-box").find(".paly-btn").show();
    $(".play-voice-box .circle").removeClass("clip-auto");
    $(".play-voice-box .circle .left").removeAttr("style");
    $(".play-voice-box .circle .right").addClass("wth0");
    $(".play-voice-box").removeClass("play-state-palybg");

    // 重置平台统一播放列表样式
    $(".appui_qanda-voice-ctrlbar").siblings(".tips").text("免费收听");
    $(".appui_qanda-voice-ctrlbar").parent().removeClass("ctrlbar");
    $(".appui_qanda-voice-ctrlbar").siblings(".appui_qanda-voice-wave").show();
    $(".appui_qanda-voice-ctrlbar").remove();
    $('.appui_qanda-voice-wait').hide();
    $(".appui-qanda-answer-time").show();
    $(".appui_qanda-voice-ctrlbar").parent().next().hide();
}

//播放 yl
function playAudioQaClickFunction(id, type, listenType, objId, listen_type, open_price, topay, allowPauseBool=1) {
    if(listen_type == 1 && topay == 1){
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
                    getPayStatus(id,open_price*100,objId);
                    return;
                }else{
                    getVoice(id, type, listenType, objId, allowPauseBool);
                    return;
                }
            }
        });
    }else{
        getVoice(id, type, listenType, objId, allowPauseBool);
    }
}
//加载语音 yl
function getVoice(id, type, listenType, objId, allowPauseBool){
    g_all_contentType = 2;
    playAudioClickFunctionEx(id, type, listenType, objId, allowPauseBool, 0);
}
// getPayStatus
function getPayStatus(id,price,objId){
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
                data.config.package, data.config.signType, data.config.paySign,objId);
        }
    });
}
//获得支付参数
function getWxConfig(timestamp, nonceStr, package, signType, paySign,objId){
    wx.chooseWXPay({
        timestamp: timestamp,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        paySign: paySign,
        success: function (res) {
            $('#' + objId + '').removeClass("pay").addClass("free");
            $('#' + objId + '> .tips').text('点击收听');
        }
    });
}
//播放记录
function listenAudio(id){
    $.ajax({
        type: "POST",
        url: "/articles/detail.html",
        data: {
            id:id,
            _csrf:$('input[name="csrf"]').val()
        },
        dataType: "json",
        success: function(data){
        }
    });
}

function playExpertIntroduceVoice(url,obj){
	initAllPlayVoiceState();
	var $audio = $("#audio-mc");
	var currentAudio = $("#audio-mc").get(0);

	if($audio.attr("src") != url){
		$(obj).removeClass('on');
	}

	if($(obj).hasClass("on")){
		currentAudio.pause();
		$(obj).removeClass('on');
		return false;
	}else{
		$(obj).addClass('on');
	}

	if($audio.attr("src") == url){
		currentAudio.play();
		return false;
	}


	// 加载出错时
	$audio.on("error", function () {
		dataLoadedError("读取语音失败,请重试");
	});

	$audio.attr("src", url);
	currentAudio.play();

}

function playIndexNewsVoice(id, obj){
    g_all_contentType = 2;
    var element = obj;
    var $audio = $("#audio-mc");
    var currentAudio = $("#audio-mc").get(0);

    // 如何在加载中防止重复点击
    if($(element).find("play-state-palybg").length > 0) return false;

    function playNewsVoice(url){
            $(element).addClass("indexPlayVoice");
        if($audio.attr("src") == url){
                currentAudio.play();
                return false;
            }
            // 加载出错时
            $audio.on("error", function () {
                $(element).removeClass("playing");
                $(element).removeClass("indexPlayVoice");
                dataLoadedError("读取语音失败,请重试");
            });

            // 播放结束执行
            currentAudio.addEventListener('ended', function () {
                $(element).removeClass("playing");
                $(element).removeClass("indexPlayVoice");
            }, false);

        $audio.attr("src", url);
            currentAudio.play();
    }

    // 如果是直接传入语音则直接执行播放 否则请求语音
    if(id && id.toString().indexOf("mp3") != -1){
        // 如果正在播放中
        if($(element).hasClass("playing")){
            currentAudio.pause();
            $(element).removeClass("playing");
            $(element).removeClass("indexPlayVoice");
        }else{
            initAllPlayVoiceState();
            $(element).addClass("playing");
            playNewsVoice(id);
        }
    }else{
        // 如果正在播放中
        if($(element).hasClass("playing")){
            currentAudio.pause();
            $(element).removeClass("playing");
            $(element).removeClass("indexPlayVoice");
        }else{
            initAllPlayVoiceState();
            $(element).addClass("playing");
            playAudioClickFunctionEx(id, 1, 1, '', '', '', '', 0, function(voiceUrl){
                playNewsVoice(voiceUrl);
        });
    }
}
}

function playQAHotVoice(id, obj){
    g_all_contentType = 2;
    var element = obj;
    var $audio = $("#audio-mc");
    var currentAudio = $("#audio-mc").get(0);
    // 如何在加载中防止重复点击
    if($(element).find("play-state-palybg").length > 0) return false;

    if($(element).find(".suspend-btn").is(":visible")){
        currentAudio.pause();
        $(element).find(".suspend-btn").hide();
        $(element).find(".paly-btn").show();
    }else{
        playAudioClickFunctionEx(id, 1, 1, '', '', '', '', 0, function(voiceUrl){
            if(voiceUrl == $audio.attr("src")){
                currentAudio.play();
                $(element).find(".paly-btn").hide();
                $(element).find(".suspend-btn").show();
            }else{
                initAllPlayVoiceState();
                $(element).find(".paly-btn").hide();
                $(element).find(".play-voice-state").children("span").append("<i class=\"appui-loading appui-icon_toast\"></i>");
                // 加载完成
                $audio.off("canplaythrough");
                // 播放中执行
                $audio.off("timeupdate");
                // 加载出错时
                $audio.off("error");

                // 加载完成
                $audio.on("canplaythrough ", function () {
                    // 防止加载完没有立即播放
                    setTimeout(function () {
                        $(element).find(".appui-loading").remove();
                        $(element).addClass("play-state-palybg");
                        $(element).find(".suspend-btn").show();
                    }, 300);
                });
                // 播放中执行
                $audio.on("timeupdate", function () {
                    if(!totalTime) return false;
                    var curPalyRatio = Math.round((Math.ceil(currentAudio.currentTime) / Math.ceil(totalTime))*360);
                    if(curPalyRatio >= 360){
                        curPalyRatio=0;
                        $(element).find('.circle').removeClass('clip-auto');
                        $(element).find('.right').addClass('wth0');
                    }else if(curPalyRatio >= 180){
                        $(element).find('.circle').addClass('clip-auto');
                        $(element).find('.right').removeClass('wth0');
                    }
                    $(element).find('.left').css("-webkit-transform","rotate("+curPalyRatio+"deg)");
                });
                // 加载出错时
                $audio.on("error", function () {
                    $(element).find(".appui-loading").remove();
                    $(element).find(".suspend-btn").hide();
                    $(element).find(".paly-btn").show();
                    $(element).removeClass("play-state-palybg");
                    dataLoadedError("读取语音失败,请重试");
                });
                // 播放结束执行
                currentAudio.addEventListener('ended', function () {
                    $(element).find(".appui-loading").remove();
                    $(element).find(".suspend-btn").hide();
                    $(element).find(".paly-btn").show();
                    $(element).removeClass("play-state-palybg");
                }, false);
                $audio.attr("src", voiceUrl);
                currentAudio.play();
            }
        });
    }
}

function playAudioClickFunctionEx(id, type, listenType, objId, allowPauseBool, shareId, srParentId, isIosMoneyToPay, playCallBack) {
    categorycurrentVoiceID = id;
    currPlayId = id;
    currPayType = type;
    currPayListenType = listenType;
    currPayObjId = objId;
    currPayAllowPauseBool = allowPauseBool;
    if (allowPauseBool != null && allowPauseBool == 1) {
        allowPause = allowPauseBool;
    } else {
        allowPause = 0;
    }
    event ? event.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;

    //topic 免费
    var pathname = window.location.pathname;
    if(type == 1){
        url = toListen;
    }else if(type == 2){
        url = toListenArticle
    }
    var voiceFree = 0;
    var csrf = $('input[name="csrf"]').val();
    var dataParam = {"qaId": id, "type": type, "listenType": 1, "srId": shareId, "srPId": srParentId,'_csrf':csrf};

    if (preVoiceObj != objId) {
        $.ajax({
            type: "post",
            url: url,
            dataType: "json",
            async: false,
            data: dataParam,
            success: function (result) {
                if (result.result == "success") {
                    if(voiceFree == 0 && typeof playCallBack == 'function'){
                        if (result.data.answerType == 2 || result.data.addAnswerType == 2) {
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname == "/index.html" || targetUrlPathname == "/index.htm" || targetUrlPathname == "/") {
                                window.location.href = "qanda_detail.html?id=" + id + "&typeId=4";
                            }
                            return;
                        }
                        var hostConf = $('input[name="host"]').val();
                        playCallBack(hostConf+result.data.urls);
                        return false;
                    }

                    var arr = new Array();
                    answerIDArray = new Array();
                    var urlType = "";
                    if (voiceFree == 0) {
                        urlType = result.data.urlType;
                        var freeForTimeStr = $('#' + objId + '>em').text();
                        if (result.data.couponsPayedStatus == 1) {
                            //同步围观券个数
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname == "/qanda_detail.html" && $("#coupon_count_div").is(":visible")) {
                                couponCount--;
                                if (couponCount != 0) {
                                    $("#coupon_count_id").text(couponCount);
                                } else {
                                    $("#coupon_count_div").hide();
                                    $("#hasCouponSpace").hide();
                                    $("#noneCouponSpace").show();
                                }
                            }
                            preTips = "免费收听";
                            isCoupon = 1;
                        }

                        if ($('#' + objId + '').hasClass("pay")) {
                            $('#' + objId + '').removeClass("pay").addClass("free");
                            judgeEndPlayUI();
                        }
                        // answerType 1 语音 2文字
                        if (result.data.answerType == 2 || result.data.addAnswerType == 2) {
                            if (freeForTimeStr != "限次免费") {
                                $('#' + objId + '>em').text("免费阅读");
                            }
                            (typeof saveStatusBeforeJump != 'undefined') && saveStatusBeforeJump();
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname == "/index.html" || targetUrlPathname == "/") {
                                window.location.href = "qanda_detail.html?id=" + id + "&typeId=4";
                            } else if (targetUrlPathname == "/qanda_detail.html") {
                                //解决微信浏览器不刷新问题
                                window.location.href = location.href + '&time=' + ((new Date()).getTime());
                            } else {
                                window.location.href = "qanda_detail.html?id=" + id;
                            }

                            return;
                        } else if (result.data.answerType == 1 || result.data.addAnswerType == 1) {
                            if (freeForTimeStr != "限次免费") {
                                $('#' + objId + '>em').text("免费收听");
                            }
                        }
                        //yanli
                        arr = result.data.urls.split(",");
                    } else {
                        arr = result.data.voice.urls.split(",");
                        urlType = result.data.voice.urlType;
                    }
                    //这里加上了域名
                    var hostConf = $('input[name="host"]').val();
                    for (var i = 0; i < arr.length; i++) {
                        answerIDArray[i] = hostConf + arr[i];
                        urlType = "mp3";
                    }
                    //播放语音
                    audioPlay(answerIDArray, voiceCount, objId, id);
                }
            }
        });
    } else {
        //当前点击的还是自己本身
        if (isWX == 0) {
            audioPlay(answerIDArray, voiceCount, objId, id);//播放语音
        } else {
            customDownloadVoice(answerIDArray, voiceCount, objId);
        }
    }
}
// 追问追答 重新复制一个，避免影响原有逻辑
function playYiwen(id, type, listenType, objId, allowPauseBool, shareId, srParentId, isIosMoneyToPay, playCallBack) {
    categorycurrentVoiceID = id;
    currPlayId = id;
    currPayType = type;
    currPayListenType = listenType;
    currPayObjId = objId;
    currPayAllowPauseBool = allowPauseBool;
    if (allowPauseBool != null && allowPauseBool == 1) {
        allowPause = allowPauseBool;
    } else {
        allowPause = 0;
    }
    event ? event.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;

    //topic 免费
    var pathname = window.location.pathname;
    if(type == 1){
        url = toListenyiwen;
    }else if(type == 2){
        url = toListenArticle
    }
    var voiceFree = 0;
    var csrf = $('input[name="csrf"]').val();
    var dataParam = {"qaId": id, "type": type, "listenType": 1, "srId": shareId, "srPId": srParentId,'_csrf':csrf};

    if (preVoiceObj != objId) {
        $.ajax({
            type: "post",
            url: url,
            dataType: "json",
            async: false,
            data: dataParam,
            success: function (result) {
                if (result.result == "success") {
                    if(voiceFree == 0 && typeof playCallBack == 'function'){
                        if (result.data.answerType == 2 || result.data.addAnswerType == 2) {
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname == "/index.html" || targetUrlPathname == "/index.htm" || targetUrlPathname == "/") {
                                window.location.href = "qanda_detail.html?id=" + id + "&typeId=4";
                            }
                            return;
                        }
                        var hostConf = $('input[name="host"]').val();
                        playCallBack(hostConf+result.data.urls);
                        return false;
                    }

                    var arr = new Array();
                    answerIDArray = new Array();
                    var urlType = "";
                    if (voiceFree == 0) {
                        urlType = result.data.urlType;
                        var freeForTimeStr = $('#' + objId + '>em').text();
                        if (result.data.couponsPayedStatus == 1) {
                            //同步围观券个数
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname == "/qanda_detail.html" && $("#coupon_count_div").is(":visible")) {
                                couponCount--;
                                if (couponCount != 0) {
                                    $("#coupon_count_id").text(couponCount);
                                } else {
                                    $("#coupon_count_div").hide();
                                    $("#hasCouponSpace").hide();
                                    $("#noneCouponSpace").show();
                                }
                            }
                            preTips = "免费收听";
                            isCoupon = 1;
                        }

                        if ($('#' + objId + '').hasClass("pay")) {
                            $('#' + objId + '').removeClass("pay").addClass("free");
                            judgeEndPlayUI();
                        }
                        // answerType 1 语音 2文字
                        if (result.data.answerType == 2 || result.data.addAnswerType == 2) {
                            if (freeForTimeStr != "限次免费") {
                                $('#' + objId + '>em').text("免费阅读");
                            }
                            (typeof saveStatusBeforeJump != 'undefined') && saveStatusBeforeJump();
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname == "/index.html" || targetUrlPathname == "/") {
                                window.location.href = "qanda_detail.html?id=" + id + "&typeId=4";
                            } else if (targetUrlPathname == "/qanda_detail.html") {
                                //解决微信浏览器不刷新问题
                                window.location.href = location.href + '&time=' + ((new Date()).getTime());
                            } else {
                                window.location.href = "qanda_detail.html?id=" + id;
                            }

                            return;
                        } else if (result.data.answerType == 1 || result.data.addAnswerType == 1) {
                            if (freeForTimeStr != "限次免费") {
                                $('#' + objId + '>em').text("免费收听");
                            }
                        }
                        //yanli
                        arr = result.data.urls.split(",");
                    } else {
                        arr = result.data.voice.urls.split(",");
                        urlType = result.data.voice.urlType;
                    }
                    //这里加上了域名
                    var hostConf = $('input[name="host"]').val();
                    for (var i = 0; i < arr.length; i++) {
                        answerIDArray[i] = hostConf + arr[i];
                        urlType = "mp3";
                    }
                    //播放语音
                    audioPlay(answerIDArray, voiceCount, objId, id);
                }
            }
        });
    } else {
        //当前点击的还是自己本身
        if (isWX == 0) {
            audioPlay(answerIDArray, voiceCount, objId, id);//播放语音
        } else {
            customDownloadVoice(answerIDArray, voiceCount, objId);
        }
    }
}

function audioPlay(voiceArray, time, objId, id) {
    var thisObj = $("#" + objId);
    var $audio = $("#audio-mc");
    if (currentAudio == null) {
        currentAudio = $("#audio-mc").get(0);
    }

    // 解除播放中执行关联
    $audio.off("canplaythrough");
    $audio.off("timeupdate");
    $audio.off("error");

    // emptyState();

    initAllPlayVoiceState();


    var playingState = true;
    totalTime = thisObj.next().text().replace('\"', '');
    thisObj.find('.tips').text('语音加载中');
    thisObj.find('.appui_qanda-voice-wait').show();
    thisObj.find('.appui_qanda-voice-wave').hide();
    if (thisObj.find(".appui_qanda-voice-ctrlbar").length == 0) {
        var ctrlbarStr = '<div class="appui_qanda-voice-ctrlbar" style="display: none;">' +
            '<a class="appui_qanda-voice-btn stop" style="display:block;"></a>' +
            '<a class="appui_qanda-voice-btn play"></a>' +
            '<p class="appui_qanda-voice-bar">';
        if(thisObj.hasClass("free")){
            ctrlbarStr += '<span class="appui_qanda-voice-progress-line"></span>';
        }else{
            ctrlbarStr += '<span class="appui_qanda-voice-progress-line restrict-state"></span>';
        }

        ctrlbarStr += '<span class="appui_qanda-voice-progress bg-blue"></span>' +
            '</p>' +
            '<span class="appui_qanda-voice-time fc-greyd fs20">';

        if(thisObj.hasClass("free")){
            //yanli 获取语音的长度
            ctrlbarStr += '<i class="appui_qanda-voice-alltime">' + formattingTime(totalTime) + '</i>';
        }else{
            ctrlbarStr += '<i class="appui_qanda-voice-alltime  restrict-state">' + formattingTime(totalTime) + '</i>';
        }

        ctrlbarStr += '</span>' +
            '<a class="appui_qanda-voice-closebtn"></a>' +
            '</div>';
        $("#" + objId).append(ctrlbarStr);
    }

    thisObj.find(".appui_qanda-voice-ctrlbar").click(function () {
        event ? event.stopPropagation() : event.cancelBubble = true;
        event.cancelBubble = true;
    });

    var slide = {
        parameter: {
            BoxLfet: '',
            startPos: '',
            endPos: '',
            Boxwidth: '',
            cur_Date: '',
            end_Date: '',
            controlPoint: '',
            controlPointline: ''
        },
        start: function (event) {
            event ? event.stopPropagation() : event.cancelBubble = true;
            event.cancelBubble = true;
            slide.parameter.endPos = '';
            playingState = false;
            var touch = event.originalEvent.changedTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            slide.parameter.Boxwidth = $(this).width();
            slide.parameter.BoxLfet = $(this).offset().left;
            slide.parameter.startPos = (touch.pageX - slide.parameter.BoxLfet) / slide.parameter.Boxwidth;    //取第一个touch的坐标值
            slide.parameter.cur_Date = new Date().getTime();
            slide.parameter.controlPoint = $(this).children(".appui_qanda-voice-progress");
            slide.parameter.controlPointline = $(this).children(".appui_qanda-voice-progress-line");
            $(this).on('touchmove', slide.move);
            $(this).on('touchend', slide.end);
            slide.parameter.controlPoint.css("left", slide.parameter.startPos * 100 + '%');
            slide.parameter.controlPointline.css("width", slide.parameter.startPos * 100 + '%');
        },
        //移动
        move: function (event) {
            event ? event.stopPropagation() : event.cancelBubble = true;
            event.preventDefault(); // 阻止浏览器默认事件，重要
            event.cancelBubble = true;
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (event.originalEvent.length > 1) return;
            var touch = event.originalEvent.targetTouches[0];
            slide.parameter.endPos = (touch.pageX - slide.parameter.BoxLfet) / slide.parameter.Boxwidth;
            if (slide.parameter.endPos < 0) {
                slide.parameter.endPos = 0;
            }
            if (slide.parameter.endPos > 1) {
                slide.parameter.endPos = 1;
            };
            slide.parameter.controlPoint.css("left", slide.parameter.endPos * 100 + '%');
            slide.parameter.controlPointline.css("width", slide.parameter.endPos * 100 + '%');
            setPlayTime(slide.parameter.endPos);
        },
        //滑动释放
        end: function (event) {
            slide.parameter.end_Date = new Date().getTime();
            if (slide.parameter.end_Date - slide.parameter.cur_Date < 200 || slide.parameter.endPos == '') {
                var curTime = slide.parameter.startPos;
            } else {
                var curTime = slide.parameter.endPos;
            }
            setPlayTime(curTime, 1);
            //解绑事件
            $(this).off('touchmove', slide.move);
            $(this).off('touchend', slide.end);
        }
    };

    // 清空状态
    function emptyState() {
        $(".appui_qanda-voice-ctrlbar").siblings(".tips").text("免费收听");
        $(".appui_qanda-voice-ctrlbar").parent().removeClass("ctrlbar");
        $(".appui-qanda-answer-time").show();
        $(".appui_qanda-voice-ctrlbar").parent().next().hide();
        $(".appui_qanda-voice-ctrlbar").siblings(".appui_qanda-voice-wave").show();
        $(".appui_qanda-voice-ctrlbar").remove();
        $('.appui_qanda-voice-wait').hide();
    }

    // 格式化事件
    function formattingTime(time) {
        var m = Math.floor(time / 60);
        var s = time % 60;
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        return m + ":" + s
    }

    /**
     * 播放音频进度条展示
     * @param left 百分比进度 0-1
     * @param currentTime 当前播放时间
     * @param total_Time 获取的总时间
     */
    function audioProgressBar(left, currentTime, total_Time) {
        //进度条yanli
        if (left > 1) {
            left = "100%";
        } else if (left < 0) {
            left = "0%";
        } else {
            left = (left * 100).toFixed(2) + "%";
        }

        if (0 > total_Time) {
            total_Time = 0;
        }
        if (total_Time != 'undefined') {
            thisObj.find(".appui_qanda-voice-alltime").text(formattingTime(total_Time));
        }
        thisObj.find(".appui_qanda-voice-currenttime").text(formattingTime(currentTime));
        thisObj.find(".appui_qanda-voice-progress").css("left", left);
        thisObj.find(".appui_qanda-voice-progress-line").css("width", left);
    }

    /**
     * 播放暂停状态切换UI
     * @param start true 播放 false 暂停
     */
    function switchoverAudion(start) {
        if (start) {
            thisObj.find(".stop").show();
            thisObj.find(".play").hide();
        } else {
            thisObj.find(".stop").hide();
            thisObj.find(".play").show();
        }
    }

    /**
     * 设置播放时间
     * @param time 设置当前滑动应该播放的时间 传入0-1 根据总时间修改
     * @param setstate 不传默认不设置 只改变UI 如果设置则需要传入1
     */
    function setPlayTime(currentTime, setstate) {
        var planTime = Math.round(currentTime * totalTime);
        thisObj.find(".appui_qanda-voice-currenttime").text(formattingTime(planTime));
        playingState = false;
        if (setstate && setstate == 1) {
            if (planTime <= Math.floor(currentAudio.seekable.end(0))) {
                currentAudio.currentTime = planTime;
            } else {
                currentAudio.currentTime = Math.floor(currentAudio.seekable.end(0));
            }
            currentAudio.play();
            playingState = true;
        }
    }

    // 加载完成
    $audio.on("canplaythrough ", function () {
        // 防止加载完没有立即播放
        setTimeout(function () {
            switchCrtlBarOrPop(1, objId);
            $('.appui_qanda-voice-wait').hide();
            $('.appui_qanda-voice-bar').off('touchstart', slide.start);
            $('.appui_qanda-voice-bar').on('touchstart', slide.start);
        }, 300);
    });

    // 播放中执行
    $audio.on("timeupdate", function () {
        var play_Time = Math.round(currentAudio.currentTime);
        if (!!totalTime) {
            //获取当前音频的播放时长
            // totalTime = Math.round(totalTime);
            //获得录音的时间，直接从数据库中得到
        }
        if (playingState && play_Time && totalTime) {
            console.log();
            audioProgressBar(currentAudio.currentTime / totalTime, play_Time, totalTime - play_Time);
            switchoverAudion(true);
        }
    });

    // 暂停
    thisObj.find(".stop").unbind().on('click', function () {
        event ? event.stopPropagation() : event.cancelBubble = true;
        event.cancelBubble = true;
        currentAudio.pause();
        setTimeout(function () {
            switchoverAudion(false);
        }, 100);
    });

    // 播放
    thisObj.find(".play").unbind().on('click', function () {
        event ? event.stopPropagation() : event.cancelBubble = true;
        event.cancelBubble = true;
        currentAudio.play();
        setTimeout(function () {
            switchoverAudion(true);
        }, 100);
    });

    // 关闭播放
    thisObj.find(".appui_qanda-voice-closebtn").unbind().on('click', function () {
        event ? event.stopPropagation() : event.cancelBubble = true;
        event.cancelBubble = true;
        currentAudio.pause();
        audioProgressBar(0, 0);
        switchCrtlBarOrPop(0, objId);
        emptyState();
    });

    // 加载出错时
    $audio.on("error", function () {
        thisObj.find('.appui_qanda-voice-wait').hide();
        thisObj.find('.appui_qanda-voice-wave').show();
        $(".toastDialog").remove();
        clearInterval(waveTime);
        $("#" + objId).find('.tips').text('资源加载失败');
    });

    // 播放结束执行
    currentAudio.addEventListener('ended', function () {
        audioProgressBar(0, 0);
        switchCrtlBarOrPop(0, objId);
        emptyState();
    }, false);

    $audio.attr("src", voiceArray[0]);
    currentAudio.play();
}

//语音气泡和播放控制器状态切换方法  sitchBool  1:切换到播放控制器   0：切换到语音气泡
function switchCrtlBarOrPop(sitchBool, objId) {
    $("#" + objId).find('.tips').text('');
    if (sitchBool == 1) {
        //开始播放由播放控制器切换到语音气泡状态
        $("#" + objId).find('.appui_qanda-voice-wave').hide();
        $("#" + objId).siblings('em').hide();
        $("#" + objId).siblings('span').hide();
        $("#" + objId).addClass('ctrlbar');
        $("#" + objId).find('.appui_qanda-voice-ctrlbar').show();
    } else if (sitchBool == 0) {
        //播放完成后由播放控制器切换到语音气泡状态
        $("#" + objId).removeClass('ctrlbar');
        $("#" + objId).find('.appui_qanda-voice-ctrlbar').hide();
        setTimeout(function () {
            $("#" + objId).find('.appui_qanda-voice-wave').show();
            $("#" + objId).siblings('em').show();
            $("#" + objId).siblings('span').show();
        }, 300);
        $("#" + objId).find('.tips').text('再次收听');
    }
}


//app支付后回调函数
function payListenCallBackFunction(status) {
    clearToastDialog();
    // 0成功 -1失败 -2取消
    if (status == 0) {
        // getTradeResult();
        if ($('#' + currPayObjId + '').hasClass("pay")) {
            $('#' + currPayObjId + '').removeClass("pay").addClass("free");
        }
        ;
        $('#' + currPayObjId + '>em').text("免费收听");
        judgeEndPlayUI();
    } else if (status == -1) {

    } else if (status == -2) {

    }
}

function stopVoiceFunction() {
    wx.stopVoice({
        localId: currentVoiceId, // 需要停止的音频的本地ID，由stopRecord接口获得
        success: function (res) {
            currentVoiceId = "";
            wxplaying = false;
        }
    });

    clearInterval(waveTime);
}

