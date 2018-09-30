var userAgentInfo = navigator.userAgent;
var isAndroid = userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Adr') > -1;//android终端
var isiOS = !!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var appuiOpenPublish = 0;
var updateId = 0;
var editStatus = 0;
// app方法集合
var app = {
    appImgLength: 9,
    fileLength: 9,
    Audio: '',
    doc: 0,
    ppt: 0,
    xls: 0,
    pdf: 0,
    txt: 0,
    other: 0,
    allFileData: [],
    createHtmlData: [],
    playState: 1,
    waveTime: '',
    appVoiceTime: '',
    recordTime: 0,
    // app调用选择图片
    selectphoto: function(){
        showVoiceIcon();
        cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SelectPhotoPlugin", "selectPhoto",[app.appImgLength]);
        cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "selecterImg",[app.appImgLength]);
    },

    // app插入图片方法
    uploadAppImgFuntion: function (fileData){
        var html = "<figure contenteditable=\"false\" id=\"figure_"+h5.picNextIndex+"\">";
        html += 	"<img id=\"img_"+h5.picNextIndex+"\" onClick=\"h5.showPic("+h5.picNextIndex+")\";  src=\""+fileData+"\" />";
        html += 	"<a class=\"loading_progress\"></a>";
        html += 	"<span class=\"bg-orange\" onclick=\"h5.deletePic("+h5.picNextIndex+");\"><img src=\"../bdt/images/img_delete.png\" /></span>";
        html += "</figure>";

        $(".select-view").append(html);
        //移除菊花；
        $(".loading_progress").fadeOut(1000);
        $(".voice-box").hide();
        $(".content-box .voice-box").hide();
        h5.pics[h5.picNextIndex]=fileData;
        var oldIndex = h5.picNextIndex;
        h5.picLen++;
        h5.picNextIndex++;
        app.appImgLength--;
        /*if(picLen>=9){
         $(".add-message-pic").hide();
         }*/
    },

    // app调用选择文件列表
    selectFile: function(TypeArr){
        cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SelectAppFilePlugin", "FileSelect", TypeArr);
    },

    // 生成mp3文件html
    createAudioHtml: function(time){
        $(".select-view").append('' +
            '<div id="voice-box" class="appui-qanda-answerstyle voice free">' +
            '<i></i><span class="appui_qanda-voice-wave">' +
            '<em class="wave1"></em><em class="wave2"></em>' +
            '<em class="wave3"></em></span>' +
            '<em class="tips">播放试听</em>' +
            '<span class="appui_qanda-voice-wait" style="display:none;"></span>' +
            '</div><em class="appui-qanda-answer-time">'+ (Math.round(time) > 0?Math.round(time/1000)+'"':'') +　'</em><span class="delete-voice fs24">删除</span>');
        $(".content-box").hide();
        forbiddenBtn([1,2,3]);
        $(".select-view").show();
        $(".delete-voice").unbind().on('click',deleteVoice);
        $("#voice-box").unbind().on('click', function(){
            if(app.playState == 1){
                app.playState = 2;
                $("#voice-box .tips").text('');
                app.waveTime=setInterval(waveFlash,1200);//启动播放动画
                cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "open", [app.Audio[0].path.toString()]);
            }else{
                $("#voice-box .tips").text('语音暂停中');
                clearInterval(app.waveTime);//先清除所有 waveTime 定时器
                app.playState = 1;
                cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "pause");
            }
        });
    },

    // app选择文件页面
    appFileShow: function(){
        showVoiceIcon();
        $(".edit_box").hide();
        $(".selected-file").show();
        app.fallbackState = true;
    },

    // 计算不同类型文件数量
    setFileTypeNumber: function(){
        app.doc = 0;
        app.ppt = 0;
        app.xls = 0;
        app.pdf = 0;
        app.txt = 0;
        app.other = 0;
        for(var i = 0; i < app.allFileData.length; i++){
            if(app.allFileData[i].type == 'doc' || app.allFileData[i].type == 'docx'){
                app.doc++;
            }else if(app.allFileData[i].type == 'ppt' || app.allFileData[i].type == 'pptx'){
                app.ppt++;
            }else if(app.allFileData[i].type == 'xlsx' || app.allFileData[i].type == 'xls'){
                app.xls++;
            }else if(app.allFileData[i].type == 'pdf'){
                app.pdf++;
            }else if(app.allFileData[i].type == 'txt'){
                app.txt++;
            }else if(app.allFileData[i].type == 'zip'){
                app.other++;
            }
        }

        $(".file-type .type-item .file-number").remove();
        if(app.doc > 0){
            $(".file_doc").append('<i class="file-number"><em>'+ app.doc +'</em></i>')
        }
        if(app.ppt > 0){
            $(".file_ppt").append('<i class="file-number"><em>'+ app.ppt +'</em></i>')
        }
        if(app.xls > 0){
            $(".file_xls").append('<i class="file-number"><em>'+ app.xls +'</em></i>')
        }
        if(app.pdf > 0){
            $(".file_pdf").append('<i class="file-number"><em>'+ app.pdf +'</em></i>')
        }
        if(app.txt > 0){
            $(".file_txt").append('<i class="file-number"><em>'+ app.txt +'</em></i>')
        }
        if(app.other > 0){
            $(".file_q").append('<i class="file-number"><em>'+ app.other +'</em></i>')
        }
    }
};
//app选完图回调
function selectImgSuccess(imgStr){
    $(".select-view").show();
    app.uploadAppImgFuntion(imgStr);
    forbiddenBtn([2,3]);
}
//app文件选择完成回调
function fileSelectCallback(obj,iosFileType){
    var type = request('publishLocationType');
    // ios选择文件
    if(iosFileType && iosFileType == "1" && (type == 1 || type == 2)){
        if(!$(".select-view").hasClass("bg-white")){
            $(".select-view").remove();
            $(".upload-file").before('<div class="select-view bg-white" style="display: block; height: auto;"></div>')
        }
    }

    $(".selected-file").hide();
    $(".edit_box").show();
    if(!!obj){
        if((obj[0].type.toLowerCase() == 'mp3' || obj[0].type.toLowerCase() == 'wav' ||  obj[0].type.toLowerCase() == 'amr') && initOs.getOs() != 'ios'){
            if(obj[0].longSize > (8 * 1024 * 1024)){
                dataLoadedError("文件大小不能超过8M,请控制文件大小.");
                return false;
            }
            app.Audio = obj;
            app.appVoiceTime = Math.round(obj[0].duration/1000);
            app.createAudioHtml(obj[0].duration);
        }else{
            app.allFileData = obj;
            app.createHtmlData = [];
            for(var j = 0; j < app.allFileData.length; j++){
                app.createHtmlData.push({name: app.allFileData[j].name, format: app.allFileData[j].type});
            }
            createFileList(app.createHtmlData);
            app.setFileTypeNumber();
        }
    }else{
        app.allFileData = [];
        app.createHtmlData = [];
        createFileList(app.createHtmlData);
        app.setFileTypeNumber();
    }

    // ios选择文件
    if(iosFileType && iosFileType == "1"){
        $(".nav-type").hide();
        $(".file-item i").remove();

        if(type == 1 || type == 2){
            $(".content-box").prepend('<div class="edit-label-bar bg-white">' +
                '<span class="fs28">' +
                '<img src="../images/edit_label_icon.png" />'+
                '标签分类'+
                '</span>'+
                '<a class="show-hide-labellist" id="tagShowOrHideLabel"></a>'+
                '<i class="arrow bg-greyf1" style="display:none;"></i></div>').show();
            $("#tagShowOrHideLabel").unbind().click(function(){
                if($("#tagLabelList").is(":hidden")){
                    $("#tagLabelList").show();
                }else{
                    $("#tagLabelList").hide();
                }
            });
        }
    }
    $(".select-view").show();
}
//停止播放本地音频文件
function StopLocalVoiceFiles(){
    $("#voice-box .tips").text('播放试听');
    clearInterval(app.waveTime);//先清除所有 waveTime 定时器
    app.playState = 1;
}
//发布按钮点击接受语音地址
function sendAppFileVoice(voiceFile,status,time){
    if (status==1) {
        clearToastDialog();
        dataLoadedError("发布语音失败，请重新发布");
    }else{
        // 判断是否是上传还是录制的音频文件
        if(app.recordTime > 0){
            postVoiceMessage(voiceFile, app.recordTime);
        }else{
            if(time != 'undefined'){
                postVoiceMessage(voiceFile, parseInt(time/10));
            }else {
                postVoiceMessage(voiceFile, app.appVoiceTime);
            }
        }
    }
}


// h5方法集合
var h5 = {
    picLen: 0,
    wximgStr: [],
    wximgCurrStr: [],
    wximgCount:0,
    wxImg: "",
    picNextIndex: 0,
    pics: [],
    voice: '',
    voiceTime: '',

    // 微信选取图片接口
    wxShareImg : function() {
        // dataLoading("正加载中...");
        $.ajax({
            type: "post",
            url: '',
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
                        jsApiList: ['checkJsApi','chooseImage','previewImage','uploadImage','downloadImage','getLocalImgData'],
                    });
                    wx.ready(function() {
                        clearToastDialog();
                        wx.checkJsApi({
                            jsApiList: ['chooseImage','previewImage','uploadImage','downloadImage'],
                            // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function(res) {
                                //alert("weixinApi ready");
                            }
                        });

                    });
                }
            }
        });
    },
    // 微信选取图片问题
    wxSelectImgFunction: function(){
        if(9-h5.picLen == 0){
            dataLoadedError("最多上传9张图片");
            return false;
        }
        wx.chooseImage({
            count: 9-h5.picLen, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                for (var i = 0; i < localIds.length; i++) {
                    h5.wximgStr[h5.wximgCount]= localIds[i];
                    h5.getImgDataFunction(localIds[i]);
                    h5.wximgCount++;
                };
                $(".select-view").show();
                forbiddenBtn([2,3]);
            },
            fail: function(res) {
                dataLoadedError(res.errMsg);
            }
        });
    },
    // 获取本地图片接口
    getImgDataFunction: function(imgId){
        if (isAndroid) {
            h5.configImgUI(imgId);
        }else {
            wx.getLocalImgData({
                localId: imgId, // 图片的localID
                success: function (res) {
                    var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                    h5.configImgUI(localData);
                },
                fail: function (res) {
                    dataLoadedError(res.errMsg);
                }
            });
        }
    },
    //配置微信图片的div
    configImgUI: function(localData){
        showVoiceIcon();
        $(".content-box").hide();
        var html = "<figure contenteditable=\"false\" id=\"figure_"+h5.picNextIndex+"\">";
        html += 	"<img id=\"img_"+h5.picNextIndex+"\" onClick=\"h5.pic_show("+h5.picNextIndex+");\" src=\""+localData+"\" />";
        html += 	"<a class=\"loading_progress\"></a>";
        html += 	"<span class=\"bg-orange\" onclick=\"h5.deletePic("+h5.picNextIndex+");\"><img src=\"../bdt/images/img_delete.png\" /></span>";
        html += "</figure>";

        $(".select-view").append(html);
        $(".loading_progress").fadeOut(1000);
        $(".voice-box").hide();
        $(".content-box .voice-box").hide();
        var oldIndex = h5.picNextIndex;
        h5.picLen++;
        h5.picNextIndex++;
        if(h5.picLen>=9){
            // $(".add-message-pic").hide();
        }
    },
    resetWeixinCurrImg: function(picIndex){
        var currIndex =0;
        var picShowIndex = 0;
        h5.wximgCurrStr = new Array();

        // wximgCurrStr = ;
        for(var i=0;i<h5.picNextIndex;i++){
            if(h5.wximgStr[i]==null){
            }else{
                h5.wximgCurrStr[currIndex] = h5.wximgStr[i];
                if(i==picIndex){
                    picShowIndex = currIndex;
                }
                currIndex++;
            }
        }
        return picShowIndex;
    },
    //微信浏览图片
    pic_show: function(picIndex){
        var picShowIndex = h5.resetWeixinCurrImg(picIndex);
        wx.previewImage({
            current: h5.wximgCurrStr[picShowIndex], // 当前显示图片的http链接
            urls: h5.wximgCurrStr // 需要预览的图片http链接列表
        });
    },

    // web上传调用
    webUploadFn: function(){
        showVoiceIcon();
        var fileLength = $(this).get(0).files.length;
        fileLength = fileLength + $('.select-view').children('figure').length;
        if (fileLength>9) {
            dataLoadedError("很抱歉，最多能上传9张图片");
            return;
        };
        for (var i = 0; i < fileLength; i++) {
            h5.uploadImgFuntion($(this).get(0).files[i]);
        };
    },
    uploadImgFuntion: function(file){
        var imageNameStr = $(this).get(0).value;
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        if (!rFilter.test(file.type) && imageNameStr.indexOf("image")<0) {
            dataLoadedError("请选择jpeg、png格式的图片文件。");
            $("#filehidden").val("");
            return false;
        }else{
            EXIF.getData(file,function(){
                jiaodu=EXIF.getTag(this,'Orientation');
            });
            if (typeof FileReader === 'undefined') {
                alert('Your browser does not support FileReader...');
                return false;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                h5.getImgData(this.result,jiaodu,function(data,srcWidth,srcHight){
                    var html = "<figure contenteditable=\"false\" id=\"figure_"+h5.picNextIndex+"\">";
                    html += 	"<img id=\"img_"+h5.picNextIndex+"\" onClick=\"h5.showPic("+h5.picNextIndex+")\";  src=\""+data+"\" />";
                    html += 	"<a class=\"loading_progress\"></a>";
                    html += 	"<span class=\"bg-orange\" onclick=\"h5.deletePic("+h5.picNextIndex+");\"><img src=\"../bdt/images/img_delete.png\" /></span>";
                    html += "</figure>";

                    $(".select-view").append(html);
                    //移除菊花；
                    $(".loading_progress").fadeOut(1000);
                    $(".voice-box").hide();
                    $(".content-box .voice-box").hide();
                    h5.pics[h5.picNextIndex]=data;
                    var oldIndex = h5.picNextIndex;
                    h5.picLen++;
                    h5.picNextIndex++;
                    $(".select-view").show();
                });
            };
            reader.readAsDataURL(file);
            forbiddenBtn([2,3]);
        }
    },
    deletePic: function(index){
        h5.picLen--;
        if(h5.picLen == 0){
            if(isiOS && initOs.getOs() == 'h5'){
                recoverBtn([2]);
            }else{
                recoverBtn([2,3]);
            }
            $(".select-view").hide();
        }

        if (!isWeiXinBorrower()) {
            $("#figure_"+index).remove();
            h5.pics[index] = null;
            if (readClientSession("appType")==isApp) {
                app.appImgLength++;
            };
        }else{
            $("#figure_"+index).remove();
            h5.wximgStr.splice(index, 1);
        }
    },
    getImgData: function(img,dir,next){
        var image=new Image();
        image.onload=function(){
            var degree=0,drawWidth,drawHeight,width,height;
            drawWidth=this.naturalWidth;
            drawHeight=this.naturalHeight;
            //以下改变一下图片大小
            var newWidth = 0;
            var newHeight = 0;

            if(drawWidth>828){
                newWidth = 828;
                newHeight = drawHeight/drawWidth * newWidth;
            }
            if(newHeight>1472){
                newHeight = 1472;
                newWidth = drawWidth/drawHeight * newHeight;
            }

            if(newWidth<414){
                if(drawWidth>414){
                    newWidth = 414;
                }else{
                    newWidth = drawWidth;
                }
                newHeight = drawHeight/drawWidth * newWidth;
            }

            if(newHeight<500){
                if(drawHeight>500){
                    newHeight = 500;
                }else{
                    newHeight = drawHeight;
                }

                newWidth = drawWidth/drawHeight * newHeight;
            }

            drawWidth = newWidth;
            drawHeight = newHeight;

            var canvas=document.createElement('canvas');
            canvas.width=width=drawWidth;
            canvas.height=height=drawHeight;
            var context=canvas.getContext('2d');
            //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
            switch(dir){
                //iphone横屏拍摄，此时home键在左侧
                case 3:
                    degree=180;
                    drawWidth=-width;
                    drawHeight=-height;
                    break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:
                    canvas.width=height;
                    canvas.height=width;
                    degree=90;
                    drawWidth=width;
                    drawHeight=-height;
                    break;
                //iphone竖屏拍摄，此时home键在上方
                case 8:
                    canvas.width=height;
                    canvas.height=width;
                    degree=270;
                    drawWidth=-width;
                    drawHeight=height;
                    break;
            }
            //使用canvas旋转校正
            context.rotate(degree*Math.PI/180);
            context.drawImage(this,0,0,drawWidth,drawHeight);
            //返回校正图片
            next(canvas.toDataURL("image/jpeg",0.8),Math.abs(canvas.width),Math.abs(canvas.height));
        };
        image.src=img;
    },
    showPic: function(index){
        $('#gallery').fadeIn();
        $('.page__hd').css("z-index",0);
        $('#gallery').click(function(){
            $('.page__hd').css("z-index",2);
            $('#gallery').fadeOut();
        });
        $('.appui-gallery__img img').attr('src',h5.pics[index]);
        if($('.appui-gallery__img img').height() > $('.appui-gallery__img').height()){
            $('.appui-gallery__img img').css({'top':'0','margin-top':'0'});
        }
        else{
            $('.appui-gallery__img img').css({'top':'50%','margin-top':-$('.appui-gallery__img img').height()/2});
        }
    },

    // 初始化web上传
    initWebUpload: function(){
        h5.webUploadVoice();
    },

    // 上传语音
    webUploadVoice: function(){
        var audio;
        var waveTime;
        function audioplay(){
            if(audio.paused){
                $("#voice-box .tips").text('');
                //再开启需要的播放动画
                waveTime=setInterval(waveFlash,1200);//启动播放动画
                audio.play();
            }else{
                $("#voice-box .tips").text('语音暂停中');
                clearInterval(waveTime);//先清除所有 waveTime 定时器
                audio.pause();
            }
        }

        var voicePlayHtml = function(time){
            $(".select-view").append('' +
                '<div id="voice-box" class="appui-qanda-answerstyle voice free" style="margin-left: 0.8rem;">' +
                '<i></i><span class="appui_qanda-voice-wave">' +
                '<em class="wave1"></em><em class="wave2"></em>' +
                '<em class="wave3"></em></span>' +
                '<em class="tips">播放试听</em>' +
                '<span class="appui_qanda-voice-wait" style="display:none;"></span>' +
                '</div><em class="appui-qanda-answer-time">'+ (Math.round(time) > 0?Math.round(time)+'"':'') +　'</em><span class="delete-voice fs24">删除</span>');
            $(".select-view").show();
            $("#voice-box").on('click',audioplay);
            $(".delete-voice").on('click',function (){
                audio.pause();
            });
            $(".delete-voice").on('click',deleteVoice);
            forbiddenBtn([1,2,3]);
        };

        $("#selectRecord").change(function uploadClickFn(e){
            audio = document.createElement("audio");
            if(e.target.files[0].size > (8 * 1024 * 1024)){
                dataLoadedError("文件大小不能超过8M,请控制文件大小.");
                return false;
            }
            h5.voice = e.target.files[0];
            function getFileTime(){
                audio.removeEventListener("canplaythrough", getFileTime, false);
                audio.volume = 0;
                audio.play();
                setTimeout(function(){
                    h5.voiceTime = Math.round(audio.duration);
                    voicePlayHtml(audio.duration);
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 0.8;},100);
            };
            var file = e.target.files[0],
                src = window.createObjectURL&&window.createObjectURL(file)||window.URL&&window.URL.createObjectURL(file)||window.webkitURL && window.webkitURL.createObjectURL(file);
            if(/^audio/i.test(file.type)){
                audio.src=src;
                audio.addEventListener("canplaythrough", getFileTime, false);
                audio.addEventListener('ended', function () {
                    $("#voice-box .tips").text('播放试听');
                    clearInterval(waveTime);//先清除所有 waveTime 定时器
                }, false);
                /*function g(){isNaN(audio.duration) ? requestAnimationFrame(g):voicePlayHtml(audio.duration);}
                 requestAnimationFrame(g);*/
                $(".content-box").hide();
            }else{
                dataLoadedError("请选择正确的音频文件");
            }
        });

        function uploadVoice(file){
            var data = new FormData();
            data.append("myfiles", file);
            $.ajax({
                data: data,
                type: "POST",
                url: "uploadVoiceFileFromApp.html",
                cache: false,
                async: false,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (msg) {
                    dataLoadedError('上传成功.');
                },
                error: function (msg) {
                    dataLoadedError(msg);
                }
            });
        }

    },
    // 非ios,弹出选择层
    popupSelect: function(){
        function popupSelectHide(){
            $(".popup-select").removeClass("popup-select-show");
            setTimeout(function(){$(".popup-select").hide();}, 500);
        }
        $(".popup-select").show(function(){
            $(this).addClass("popup-select-show");
        });
        $(".popup-select p").eq(2).unbind().click(popupSelectHide);
        $(".popup-select").unbind().click(popupSelectHide);
    },

    // 初始化录音
    initVoice: function (){
        //开始录音
        $('#record-btn').click(function(e) {
            // 防止录音快速点击多次导致录音出错
            if($('#record-btn').attr("state") == 1) return false;
            $('#record-btn').attr("state","1");
            if (isWeiXinBorrower()==true) {
                h5_Voice.startRecord1();
            }else{
                dataLoadedError("录音功能仅支持在微信中使用");
                $('#record-btn').attr("state","0");
            }
        });
        //停止录音
        $('.record-stop').click(function(e) {
            // alert('stop');
            h5_Voice.stopRecord1();
        });

        //播放录音
        $('.play-start').click(function(e) {
            h5_Voice.playVoice1(h5_Voice.recordIdArray[h5_Voice.currentVoiceIndex]);
        });

        //暂停播放
        $('.play-stop').click(function(e) {
            h5_Voice.pauseVoice1(h5_Voice.recordIdArray[h5_Voice.currentVoiceIndex]);
        });

        //重录
        $('#chonglu-btn').click(function(e) {
            h5_Voice.isReRecordingBool = 1;
            $('.send-answer').removeClass('bg-orange').addClass('bg-greyabc');//发送回答变成不可操作状态
            h5_Voice.intRecordPlayFun();//录音控件初始化
            $('.record-tips').stop().text('点击开始录音，每次最多可录60秒');//提示----信息更改
            h5_Voice.addRecordTime = 0 ;//重录和发送回答后单词录音时长置为0
            //暂停播放全部录音
            h5_Voice.recordPercentArray.splice(h5_Voice.currentVoiceIndex,1);
            h5_Voice.recordIdArray.splice(h5_Voice.currentVoiceIndex,1);
            $('#answer-log-item'+h5_Voice.currentVoiceIndex+' i').css('left',0);
            $('#answer-log-item'+h5_Voice.currentVoiceIndex+' em').css('width',0);
            $('#answer-log-item'+h5_Voice.currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
            if(h5_Voice.recordPercentArray.length == 0){
                if(isiOS){
                    recoverBtn([1,2]);
                }else{
                    recoverBtn([1,2,3]);
                }
            }
            $(".nav-voice").off('click', switchOvice);
        });

        //加录
        $('#addlu-btn').click(function(e) {
            h5_Voice.addVoiceID = 1;
            $('.clear-record-control').show();
            h5_Voice.intRecordPlayFun();//录音控件初始化
            $('.record-tips').stop().text('每次加录时长最多60秒，共' + h5_Voice.talTime + '秒');//提示----信息更改
            //$('.answer-mc').slideDown();
            // $('.answer-mc>p').stop().text('录音最长' + talTime + '秒，单次录音最长60秒，最多加录4次');//提示----信息更改
            $('.answer-mc>span:nth-of-type(2)').stop().text(h5_Voice.talTime + '秒');//提示----信息更改
            if (h5_Voice.recordPercentArray.length<5) {
                h5_Voice.currentVoiceIndex = h5_Voice.recordPercentArray.length;
                // currentVoiceIndex++;
            }else{
                dataLoadedError("您已经无法进行加录");
            }
        });
    }
};
//微信上传图片问题
function wxuploadImgFunction(index){
    //解决IOS无法上传的坑
    if (isAndroid && h5.wximgCurrStr[index].indexOf("wxlocalresource") != -1){
        h5.wximgCurrStr[index] = h5.wximgCurrStr[index].replace("wxlocalresource", "wxLocalResource");
    }
    wx.uploadImage({
        localId: h5.wximgCurrStr[index], // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            if(h5.wxImg == ""){
                h5.wxImg = serverId;
            }else{
                h5.wxImg = h5.wxImg + "," + serverId;
            }
            index++;
            if (index<h5.wximgCurrStr.length) {
                wxuploadImgFunction(index);
            }else{
                issueSubmit('','','',h5.wxImg);
            }
        },
        fail: function(res) {
            dataLoadedError(res.errMsg);
        }
    });
}


// 微信录音相关
var h5_Voice = {
    //播放录音定时器
    playing: null,
    //录音定时器
    addVoiceID: '',
    talTime: 300,
    recording: null,
    currentVoiceIndex: 0,
    isReRecordingBool: 0,
    recordIdArray: [],
    recordPercentArray: [],
    currentVoiceStr: '',
    isRecordingBool: 0,
    recordPercent: 0,
    playPercent: 0,
    addRecordTime: 0,
    wxRecordId: '',
    voiceState: false,
    //开启录音
    startRecord1: function (){
        h5_Voice.isReRecordingBool = 0;
        wx.startRecord({
            cancel: function() {
                dataLoadedError("取消");
                $('#record-btn').attr("state","0");
            },
            success: function(res) {
                h5_Voice.voiceState = true;
                h5_Voice.startRecordUI();
                forbiddenBtn([1,2,3]);
                $(".nav-voice").removeClass("off");
                $(".nav-voice").on('click', switchOvice);
                $('#record-btn').attr("state","0");
            },
            fail: function(res) {
                dataLoadedError("开启录音错误");
                h5_Voice.intRecordPlayFun();
                $('#answer-log-item'+h5_Voice.currentVoiceIndex+' i').css('left',0);
                $('#answer-log-item'+h5_Voice.currentVoiceIndex+' em').css('width',0);
                $('#answer-log-item'+h5_Voice.currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
                $('#record-btn').attr("state","0");
            }
        });
    },
    //停止录音
    stopRecord1: function(){
        // alert('stopRecord1');
        wx.stopRecord({
            success: function(res) {
                h5_Voice.voiceState = false;
                //自动录音结束，没有 localId,导致不能自动停止播放
                // alert(res.localId);
                if(!res.localId){
                    dataLoadedError("请重录本段录音,合理安排结尾");
                    setTimeout("window.location.reload()",1500);
                }

                h5_Voice.recordIdArray.splice(h5_Voice.currentVoiceIndex, 0, res.localId);
                h5_Voice.stopRecordButton();
            },
            fail: function(res) {
                h5_Voice.intRecordPlayFun();
                $('#answer-log-item'+h5_Voice.currentVoiceIndex+' i').css('left',0);
                $('#answer-log-item'+h5_Voice.currentVoiceIndex+' em').css('width',0);
                $('#answer-log-item'+h5_Voice.currentVoiceIndex+' span').text(0+'s').removeClass('fc-orange').addClass('fc-greyabc');
                dataLoadedError("sorry，系统未能识别本段语音，请重录本段录音！");
                window.location.reload();
            }
        });
    },
    //自动停止录音
    autostopRecord: function(){
        // alert(333);
        wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            success: function(res) {
                // alert(444);
                h5_Voice.voiceState = false;
                //自动录音结束，没有 localId,导致不能自动停止播放
                // alert(res.localId);
                h5_Voice.recordIdArray.splice(h5_Voice.currentVoiceIndex, 0, res.localId);
                h5_Voice.stopRecordButton();
            },
            complete: function (res) {
                alert(res);
                var localId = res.localId;
                h5_Voice.voiceState = false;
                h5_Voice.recordIdArray.splice(h5_Voice.currentVoiceIndex, 0, res.localId);
                h5_Voice.stopRecordButton();
            }
        });
    },
    //暂停播放
    pauseVoice1: function(voiceId){
        wx.pauseVoice({
            localId: voiceId,
            success: function(res) {
                h5_Voice.pauseVoiceUI();

            },
            fail: function(res) {
                dataLoadedError("暂停播放错误");
            }
        });
    },
    //停止播放
    stopVoice1: function(voiceId){
        wx.stopVoice({
            localId: voiceId, // 需要停止的音频的本地ID，由stopRecord接口获得
            success: function(res) {
                // dataLoadedError("停止播放语音成功");
            }
        });
    },
    //上传语音yanli
    loadVoice1: function(index, id){
        var totleSeconds = 0;
        if(id){
            updateId = id;
        }

        wx.uploadVoice({
            localId: h5_Voice.recordIdArray[index], // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId;
                h5_Voice.wxRecordId += serverId+',';
                index++;
                if (index < h5_Voice.recordIdArray.length) {
                    h5_Voice.loadVoice1(index);
                }else{
                    h5_Voice.wxRecordId = h5_Voice.wxRecordId.substring(0,h5_Voice.wxRecordId.length-1);
                    for (var i = 0; i < h5_Voice.recordIdArray.length; i++) {
                        var seconds = $('#answer-log-item'+i+' span').text();
                        seconds = parseInt(seconds.substring(0,seconds.length-1));
                        totleSeconds = parseInt(totleSeconds)+seconds;
                    };
                    if(updateId !=0){
                        postVoiceMessage(h5_Voice.wxRecordId,totleSeconds,updateId);
                    }


                }
            }
        });


    },
    // 播放音频
    playVoice1: function(voiceId){
        // dataLoadedError("播放语音");
        if (voiceId == '') {
            dataLoadedError('请先使用 startRecord 接口录制一段声音');
            return;
        }
        if (voiceId == h5_Voice.currentVoiceStr) {
            h5_Voice.startPlayVoiceUI1();
        };
        wx.playVoice({
            localId: voiceId,
            success: function(res) {
                h5_Voice.currentVoiceStr = voiceId;
                h5_Voice.startPlayVoiceUI1();
                // dataLoadedError("播放语音成功");
            },
            fail: function(res) {
                dataLoadedError("播放语音错误");
            }
        });
    },
    startPlayVoiceUI1: function(){
        // dataLoadedError("播放语音的UI");
        clearInterval(h5_Voice.playing);//暂停播放----清除播放录音定时器
        $('.play-start').hide();//隐藏----播放录音按钮
        $('.play-stop').show();//显示----暂停播放按钮
        $('.record-tips').stop().text('暂停播放');//提示----信息更改
        $('#chonglu-btn').fadeOut();//隐藏----重录按钮
        $('#addlu-btn').fadeOut();//隐藏----加录按钮
        //判断上次播放是否已全部播完，已播放完则重新播放，未播放完则继续播
        if(h5_Voice.playPercent >= h5_Voice.recordPercent)
        {
            h5_Voice.playPercent = 0 ;
            $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+h5_Voice.playPercent+"deg)"},1000);
        }
        if(isiOS){
            h5_Voice.playing = setInterval("h5_Voice.playPercentFun()",1000/6.75);
        }else{
            h5_Voice.playing = setInterval("h5_Voice.playPercentFun()",1000/6);
        }

        // h5_Voice.playing = setTimeout("h5_Voice.playPercentFun()",1000*60);
    },
    startRecordUI: function (){
        h5_Voice.isRecordingBool = 1;
        $('#record-btn').hide();//隐藏----录音按钮
        $('#record-play').show();//显示----录音&播放按钮
        //清除录音定时器
        h5_Voice.recordPercent = 0;
        $('.record-percent-circle').removeClass('clip-auto');
        $('.right-record-percent').addClass('wth0');
        if(isiOS) {
            $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6.75);
        }else{
            $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6);
        }
        clearInterval(h5_Voice.recording);//暂停录音----清除录音定时器
        //初始化录音进程容器
        $('.record-percent-circle').stop().css('opacity','1');//将录音进度跳改变透明度1
        $('.play-percent-circle').hide();//隐藏----播放录音进度条
        //$('.time-show').show();//显示----录音时长
        $('.record-tips').stop().text('合理安排，保证语音的连续性');//提示----信息更改
        //开启录音计时
        if(isiOS) {
            h5_Voice.recording = setInterval("h5_Voice.recordPercentFun()", 1000/6.75);
        }else{
            h5_Voice.recording = setInterval("h5_Voice.recordPercentFun()", 1000/6);
        }
        // h5_Voice.playing = setTimeout("h5_Voice.playPercentFun()",1000*60);
        $('.record-stop').show();//显示----暂停录音按钮
    },
    pauseVoiceUI: function (){
        $('#chonglu-btn').fadeIn();//显示----重录按钮
        $('#addlu-btn').fadeIn();//显示----加录按钮
        $('.play-stop').hide();//隐藏----暂停播放按钮
        $('.play-start').show();//显示----播放录音按钮
        $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
        clearInterval(h5_Voice.playing);//暂停播放----清除播放录音定时器
        if (h5_Voice.recordPercentArray.length==5) {
            $('#addlu-btn').fadeOut();
        }
    },
    intRecordPlayFun: function(){
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
        h5_Voice.playPercent = 0;
        $('.play-percent-circle').removeClass('clip-auto');
        $('.right-play-percent').addClass('wth0');
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+h5_Voice.playPercent+"deg)"},1000);
        clearInterval(h5_Voice.playing);

        //清除录音定时器
        h5_Voice.recordPercent = 0;
        $('.record-percent-circle').removeClass('clip-auto');
        $('.right-record-percent').addClass('wth0');
        if(isiOS) {
            $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6.75);
        }else{
            $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6);
        }
        clearInterval(h5_Voice.recording);
    },
    stopRecordButton: function(){
        // alert('stopRecordButton');
        h5_Voice.isRecordingBool = 0;
        clearInterval(h5_Voice.recording);//暂停录音----清除录音定时器
        $('.record-stop').hide();//隐藏----暂停录音按钮
        $('.play-start').show();//显示----播放录音按钮
        //初始化录音播放进程容器
        $('.record-percent-circle').stop().css('opacity','0.3');//将录音进度改变透明度0.3
        $('.play-percent-circle').show();//显示----播放录音进度条
        $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
        //其他操作按钮初始化
        $('#chonglu-btn').fadeIn();//显示----重录按钮
        if (h5_Voice.currentVoiceIndex<4) {
            $('#addlu-btn').fadeIn();//显示----加录按钮
        };
        $('.send-answer').removeClass('bg-greyabc').addClass('bg-orange');//发送回答变成可操作状态
        //暂停录音时将已录制的时长传递并换算传递给 ---单次录音时长
        h5_Voice.addRecordTime = Math.floor(h5_Voice.recordPercent/6);
        //添加动态秒数
        h5_Voice.recordPercentArray.splice(h5_Voice.currentVoiceIndex, 0, h5_Voice.recordPercent);
        var leftAndWidth = h5_Voice.addRecordTime/60*100+'%';
        $('#answer-log-item'+h5_Voice.currentVoiceIndex+' i').css('left',leftAndWidth);
        $('#answer-log-item'+h5_Voice.currentVoiceIndex+' em').css('width',leftAndWidth);
        $('#answer-log-item'+h5_Voice.currentVoiceIndex+' span').text(h5_Voice.addRecordTime+'s').removeClass('fc-greyabc').addClass('fc-orange');
        //限制加录的时长
        if (h5_Voice.recordPercentArray.length==5) {
            $('#addlu-btn').fadeOut();
        }
    },
    //录音计时
    recordPercentFun: function(){
        //每次录音满60s时停止录音 yanli
        if(h5_Voice.recordPercent==360){

            h5_Voice.stopRecord1();

        }else if(h5_Voice.recordPercent>180){
            $('.record-percent-circle').addClass('clip-auto');
            $('.right-record-percent').removeClass('wth0');
        }
        if(isiOS) {
            $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6.75);
        }else{
            $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6);
        }
        //显示录音时间
        h5_Voice.recordPercent = h5_Voice.recordPercent + 1 ;
        $('.time-show').html(Math.floor(h5_Voice.recordPercent/6) + 's');
    },
    //播放录音计时
    playPercentFun: function() {
        //dataLoadedError(recordPercent);
        //判断是否播放完-是则停止播放
        if(h5_Voice.playPercent>=h5_Voice.recordPercent) {
            h5_Voice.playPercent=0;
            clearInterval(h5_Voice.playing);//暂停播放
            $('.play-stop').hide();//隐藏----暂停播放按钮
            $('.play-start').show();//显示----播放录音按钮
            $('.play-percent-circle').removeClass('clip-auto');
            $('.right-play-percent').addClass('wth0');
            $('#chonglu-btn').fadeIn();//显示----重录按钮
            $('.record-tips').stop().text('重录、加录、试听或者发送');//提示----信息更改
            if (h5_Voice.recordPercentArray.length==5) {
                $('#addlu-btn').fadeOut();
            }else{
                $('#addlu-btn').fadeIn();//显示----加录按钮
            }
        }else if(h5_Voice.playPercent>180)
        {
            $('.play-percent-circle').addClass('clip-auto');
            $('.right-play-percent').removeClass('wth0');
        }
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+h5_Voice.playPercent+"deg)"},1000);
        h5_Voice.playPercent = h5_Voice.playPercent + 1 ;
        $('.time-show').html(Math.floor(h5_Voice.recordPercent/6)-Math.floor(h5_Voice.playPercent/6) + 's');//提示----信息更改
    },
    //微信语音的一些问题
    wxRequest1: function (){

    },
    wxShare1: function() {

    },
};
//点击各个voice方法
function recordButton(index){
    if (isWeiXinBorrower()==false) {
        dataLoadedError("本语音播放仅支持在微信中播放");
        return;
    }if (h5_Voice.isRecordingBool==1) {
        dataLoadedError("录音进行中，请勿其他操作");
        return;
    }else if (h5_Voice.isReRecordingBool==1) {
        dataLoadedError("重录准备中，请勿其他操作");
        return;
    };
    if (h5_Voice.recordIdArray[h5_Voice.currentVoiceIndex]!=null) {
        h5_Voice.stopVoice1(h5_Voice.recordIdArray[h5_Voice.currentVoiceIndex]);
        //清除播放录音定时器
        h5_Voice.playPercent=0;
        $('.play-percent-circle').removeClass('clip-auto');
        $('.right-play-percent').addClass('wth0');
        $('.left-play-percent').stop().css({"-webkit-transform":"rotate("+h5_Voice.playPercent+"deg)"},1000);
        clearInterval(h5_Voice.playing);
    };
    if (h5_Voice.recordPercentArray.length<index) {
        dataLoadedError("请连续录音");
    }else{
        h5_Voice.currentVoiceIndex = index;
        h5_Voice.recordPercent = h5_Voice.recordPercentArray[h5_Voice.currentVoiceIndex];
        if (h5_Voice.recordPercent!=null&&h5_Voice.recordPercent.length!=0) {
            if(h5_Voice.recordPercent>180){
                $('.record-percent-circle').addClass('clip-auto');
                $('.right-record-percent').removeClass('wth0');
            }else{
                $('.record-percent-circle').removeClass('clip-auto');
                $('.right-record-percent').addClass('wth0');
            }
            if(isiOS) {
                $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6.75);
            }else{
                $('.left-record-percent').stop().css({"-webkit-transform": "rotate(" + h5_Voice.recordPercent + "deg)"}, 1000/6);
            }
            $('.time-show').html(Math.floor(h5_Voice.recordPercent/6) + 's');
            $('#chonglu-btn').fadeIn();//显示----重录按钮
            if (h5_Voice.recordPercentArray.length==5) {
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
            h5_Voice.intRecordPlayFun();//录音控件初始化
            $('.record-tips').stop().text('每次加录时长最多60秒，共' + h5_Voice.talTime + '秒');//提示----信息更改
            //$('.answer-mc').slideDown();
            //  $('.answer-mc>p').stop().text('录音最长' + talTime + '秒，单次录音最长60秒，最多加录4次');//提示----信息更改
            $('.answer-mc>span:nth-of-type(2)').stop().text(h5_Voice.talTime + '秒');//提示----信息更改
        }
    }
}

// 上传其他类型文件
var webUploadFile = {
    // 数量
    Length: 9,
    // 文件列表
    fileList: [],
    fileData: [],
    // 选择文件
    selectFile: function(e){
        var file = e.target.files[0];
        if(file.size > (8 * 1024 * 1024)){
            dataLoadedError("文件大小不能超过8M,请控制文件大小.");
            return false;
        }
        this.outerHTML = this.outerHTML;
        $(".nav-file input").on('change', webUploadFile.selectFile);
        if(/((\.doc)|(\.docx)|(\.ppt)|(\.pptx)|(\.xls)|(\.xlsx)|(\.pdf)|(\.txt)|(\.zip))$/gi.test(file.name)){
            /.+(\.[^.])$/.exec(file.name);
            var type = webUploadFile.type = RegExp.$1.replace('.','');
            if(webUploadFile.fileList.length >= webUploadFile.Length){
                dataLoadedError("文件数量已达到上限");
                return false;
            }
            for(var i = 0; i < webUploadFile.fileList.length; i++){
                if(file.name == webUploadFile.fileList[i].name){
                    dataLoadedError("文件已存在");
                    return false;
                }
            }
            webUploadFile.fileList.push(file);
            webUploadFile.fileData.push({name: file.name, format: type});
            createFileList(webUploadFile.fileData);
        }else{
            dataLoadedError("文件格式不支持上传.");
        }
    },
    // 删除文件
    dleFile: function(){
        var index = $(this).parent().index();
        webUploadFile.fileList.splice(index, 1);
        webUploadFile.fileData.splice(index, 1);
        app.allFileData.splice(index, 1);
        app.createHtmlData.splice(index, 1);
        $(this).parent().remove();
        if(webUploadFile.fileList.length == 0 && app.allFileData.length == 0){
            recoverBtn([1,2]);
            $(".select-view").hide();
        }
        app.setFileTypeNumber();
    }
};

// 标签相关
var selectLabel ={
    selectVal: [],
    // 添加自定义标签
    LoadLabel: function(locId,locType){
        LoadTagList.containerId="tagLabelList";
        LoadTagList.LoadTagData(locId,locType,function(element){
            if(locType == 1){
                $(element).parent().siblings().children("a").removeClass("fc-black");
                if($(".select-label").text() == element.html()){
                    $(".select-label").remove();
                    $(element).removeClass("fc-black");
                }else{
                    $(element).addClass("fc-black");
                    $(".select-label").remove();
                    selectLabel.selectVal[0] = element.html();
                    $(".upload-file").append('<span class="select-label fs26">' + element.html() + '<span>');
                }
            }else{
                selectLabel.selectVal.push(element.html());
                $("#edit-mark").insertContent("#"+element.html()+"#");//加入到文本框内容中这个支持textarea
            }
//			insertAIntoCurrSection(tagName);//加入到文本框内容中这个支持DIV
        });
    }
};

// 初始化页面
$(function(){
    initOs.setCallBack({
        app: function(){
            // 选择图片
            $("#selectImg").on('click', app.selectphoto);
            // 加载app相关js执行
            initOs.loadOverFn('../../themes/js/webApp/appRecord.js', function(){
                initAppRecordUI();
                $('#appRecordBtnId').on('click', function(){
                    forbiddenBtn([1,3]);
                });
                $('#appChonglu-btn').on('click', function(){
                    recoverBtn([1,3]);
                });
            });
            if(initOs.getOs() == 'ios'){
                // 选择图片
                $(".nav-file").off('click');
                $(".nav-file").on('click', function(){
                    $("#containerFilehelp").show().animate({"left" : 0}, 300);
                });

                // ios的app上传文件回退
                $("#closeFileHelpBtn").click(function(){
                    $("#containerFilehelp").animate({"left" : "100%"}, 300, function(){
                        $(this).hide();
                    });
                });
            }else{
                $(".nav-file").on('click', app.appFileShow);
            }
            $("#selectRecord").hide();
            $("#file-fileBtn").hide();
            $(".select-list p").eq(0).on('click', function(){
                showVoiceIcon();
                var arr =  ["音频文件","Audio","mp3,wav,amr", '', 1];
                app.selectFile(arr);
            });

            $(".selected-file .file-header-title > div").eq(0).on('click', function(){
                $(".selected-file").hide();
                $(".edit_box").show();
            });

            // 显示录音
            $(".popup-select p").eq(1).unbind().click(function(){
                $(".content-box").show();
                $(".voice-box").show();
                $("#appMessageVoiceId").show();
                $(".label-box").hide();
                showVoiceIcon(1);
            });

            $(".file-type > div").eq(0).on('click', function(){
                var arr =  ["DOC","DOC","doc,docx", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".file-type > div").eq(1).on('click', function(){
                var arr =  ["PPT","PPT","ppt,pptx", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".file-type > div").eq(2).on('click', function(){
                var arr =  ["XLS","XLS","xlsx,xls", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".file-type > div").eq(3).on('click', function(){
                var arr =  ["PDF","PDF","pdf", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".file-type > div").eq(4).on('click', function(){
                var arr =  ["TXT","TXT","txt", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".file-type > div").eq(5).on('click', function(){
                var arr =  ["其他","Other","zip", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });

            $(".app-file > ul > li").eq(0).on('click', function(){
                var arr =  ["密友圈文件","ourFile","doc,docx,ppt,pptx,xlsx,xls,pdf,txt,zip", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".app-file > ul > li").eq(1).on('click', function(){
                var arr =  ["QQ","QQ","doc,docx,ppt,pptx,xlsx,xls,pdf,txt,zip", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".app-file > ul > li").eq(2).on('click', function(){
                var arr =  ["微信","WeiXin","doc,docx,ppt,pptx,xlsx,xls,pdf,txt,zip", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".app-file > ul > li").eq(3).on('click', function(){
                var arr =  ["qq邮箱","QQEmail","doc,docx,ppt,pptx,xlsx,xls,pdf,txt,zip", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });
            $(".newest-file > ul > li").eq(0).on('click', function(){
                var arr =  ["最新文件","news","doc,docx,ppt,pptx,xlsx,xls,pdf,txt,zip", JSON.stringify(app.allFileData), app.fileLength];
                app.selectFile(arr);
            });

            if(isAndroid){
                document.addEventListener("backbutton", function(){
                    cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SelectPhotoPlugin", "back", [""]);
                }, false);
            }
        },
        h5: function(){
            // 选择图片
                $('#selectImg').append('<input style="diplay:block;opacity: 0;" type="file" accept="image/*;capture=camera" multiple="true" name="filehidden" />');
                $("#selectImg input").on('change', h5.webUploadFn);
            // 显示录音
            $(".popup-select p").eq(1).unbind().click(function(){
                $(".content-box").show();
                $(".voice-box").show();
                $("#messageVoiceId").show();
                $(".label-box").hide();
                showVoiceIcon(1);
            });
            h5.initWebUpload();
            h5.initVoice();
            h5_Voice.wxRequest1();
            h5_Voice.wxShare1();
            $(".nav-file").on('change', webUploadFile.selectFile);
        }
    });

    // if($(window).width() < '375'){
    //     $("#edit-mark").css("height", "3.25rem");
    // }else if($(window).width() > '375'){
    //     $("#edit-mark").css("height", "8.05rem");
    // }


    // ios处理
    if(isiOS){
        $("#selectRecord").parent().hide();
        if(initOs.getOs() == 'h5'){
            forbiddenBtn([3]);
            $(".nav-file").hide();
            $(".nav-voice").on('click', function(){
                $('.voice-box').attr('id','voice-box');
                $(".content-box").show();
                $(".voice-box").show();
                $("#messageVoiceId").show();
                $("#appMessageVoiceId").hide();
                $(".label-box").hide();
                showVoiceIcon(1);
            });
        }else{
            $(".nav-voice").on('click', function(){
                $('.voice-box').attr('id','voice-box');
                $(".content-box").show();
                $(".voice-box").show();
                $("#messageVoiceId").hide();
                $("#appMessageVoiceId").show();
                $(".label-box").hide();
                showVoiceIcon(1);
            });
        }
    }else{
        //非ios,需要单独处理,取消选取录音功能
        // $(".nav-voice").on('click', h5.popupSelect);
        forbiddenBtn([3]);
        $(".nav-file").hide();
        $(".nav-voice").on('click', function(){
            $('.voice-box').attr('id','voice-box');
            $(".content-box").show();
            $(".voice-box").show();
            $("#messageVoiceId").show();
            $("#appMessageVoiceId").hide();
            $(".label-box").hide();
            showVoiceIcon(1);
        });
    }

    $("#back-btn").click(function() {
        friendTips1("是否要放弃您当前编辑的内容？","放弃","继续编辑");
    });

    $("#issueBtn").click(function(){
        var titles = $('#message_title').val();
        $('.addtitle').val(titles);

        var editNode = document.getElementById("edit-mark");
        var texts = $('#edit-mark').text();
        // if( $(".select-view > figure").length == 0 && $(".select-view > .file-item").length == 0 && $("#voice-box").length == 0 && !(typeof appCurRecordSeconds != 'undefined' && appCurRecordSeconds > 0) && h5_Voice.recordPercentArray.length == 0 && h5_Voice.recordPercent == 0){
        var title = $('#message_title').val();
        if(title == ''){
            dataLoadedError("请输入标题");
            return false;
        }
        if(texts == ''){
            dataLoadedError("请输入要分享的内容");
            return false;
        }
        $('#js-bg').stop().fadeIn();
        $('#js-recommend').stop().fadeIn(500,function(){$('#js-recommend').stop().animate({'top':'20%'},300);$('.appui-recommend-close').stop().animate({'bottom':'-2.4rem'},300);$('.link-style p').each(function(){
            $(this).css('margin-top',-$(this).height()/2);
        });
        });

    });
    $("#confirmSubmit").click(function(){
        submitssayData();
    });

    // 标题文字控制
    $("#message_title").on('input', function(){
        if($(this).val().length > 40){
            $(this).val($(this).val().substring(0,40));
        }
    });

    if($(".nav-type > div:visible").length == 2){
        $(".nav-type > div").css("width","50%");
    }else if($(".nav-type > div:visible").length == 3){
        $(".nav-type > div").css("width","33.33%");
    }
});

// 切换附件显示录音箭头icon, 不传入则隐藏
function showVoiceIcon(type){
    // 录音icon定位
    if(type == 1){
        if($(".nav-type > div:visible").length == 3){
            $(".active_icon").css("left", '50%');
        }else if($(".nav-type > div:visible").length == 4){
            $(".active_icon").css("left", '37%');
        }else if($(".nav-type > div:visible").length == 2){
            $(".active_icon").css("left", '75%');
        }
        $(".active_icon").show();
        return false;
    }
    // 标签 icon定位
    if(type == 2){
        if($(".nav-type > div:visible").length == 3){
            $(".active_icon").css("left", '83%');
        }else if($(".nav-type > div:visible").length == 4){
            $(".active_icon").css("left", '87%');
        }
        $(".active_icon").show();
        return false;
    }
    $(".active_icon").hide();
}

// $('#edit-mark').css('padding-top','60px');
//
// //选中文本框后 yanli
// function onfoucstexts(){
//     var texts = $('#edit-mark').text();
//     if(texts == ''){
//         $('#edit-mark').css('padding-top','60px');
//     }else{
//         var w = $(document.body).height();
//         var height = $("#edit-mark").text().length;
//         if(height > 500){
//             $('#edit-mark').css('padding-top','60px');
//         }else{
//             $('#edit-mark').css('padding-top','60px');
//         }
//
//     }
// }
//短文编辑页面-计算正文区域高度
var hEdit =  $(window).height() - 100 ;
$('.article-edit-container .edit-content').height(hEdit);
var hEditCon = hEdit-50;
$('.edit-content-container').height(hEditCon);
$(window).resize(function(e) {
    var hEdit =  $(window).height() - 100 ;
    $('.article-edit-container .edit-content').height(hEdit);
    $('.edit-content-container').height(hEditCon);
});

// 生成文件列表
function createFileList(data){
    showVoiceIcon();
    $(".content-box").hide();
    $(".content-box .voice-box").hide();
    $(".content-box .voice-box .message-voice").hide();
    $(".select-view").empty();
    for(var i = 0; i < data.length; i++){
        var contentHtml = '<div class="file-item">' +
            '<img src="$TypeImg" alt="">' +
            '<p class="fs28">$fileName</p>' +
            '<i>X</i>' +
            '</div>';
        if(data[i].format == 'doc' || data[i].format == 'docx'){
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_doc.png?v=20170607121433');
        }else if(data[i].format == 'ppt' || data[i].format == 'pptx'){
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_ppt.png?v=20170607121433');
        }else if(data[i].format == 'xls' || data[i].format == 'xlsx'){
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_xls.png?v=20170607121433');
        }else if(data[i].format == 'pdf'){
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_pdf.png?v=20170607121433');
        }else if(data[i].format == 'txt'){
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_txt.png?v=20170607121433');
        }else if(data[i].format == 'mp3' || data[i].format == 'm4a'){
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_audio.png?v=20170609161010');
        }else{
            contentHtml = contentHtml.replace('\$TypeImg', '../../themes/img/file_q.png?v=20170607121433');
        }
        contentHtml = contentHtml.replace('\$fileName', data[i].name);
        $(".select-view").append(contentHtml);
    }
    $(".select-view").show();
    $(".select-view .file-item i").on('click', webUploadFile.dleFile);
    forbiddenBtn([1,2]);
}

// 禁用按钮
function forbiddenBtn(arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == 1){
            $("#selectImg").parent().addClass("off");
            $("#selectImg input").hide();
            if(initOs.getOs() == 'h5'){
                $("#selectImg").off('click',h5.wxSelectImgFunction);
            }else{
                $("#selectImg").off('click', app.selectphoto);
            }
        }else if(arr[i] == 2){
            $(".nav-voice").addClass("off");
            $(".nav-voice").off('click');
        }else if(arr[i] == 3){
            $(".nav-file").addClass("off");
            $(".nav-file input").hide();
            $(".nav-file").off('click');
        }
    }
}

// 恢复按钮
function recoverBtn(arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == 1){
            $("#selectImg").parent().removeClass("off");
            $("#selectImg input").show();
            if(initOs.getOs() == 'h5'){
                $("#selectImg").off('click',h5.wxSelectImgFunction);
                $("#selectImg").on('click',h5.wxSelectImgFunction);
            }else{
                $("#selectImg").off('click', app.selectphoto);
                $("#selectImg").on('click', app.selectphoto);
            }
        }else if(arr[i] == 2){
            $(".nav-voice").removeClass("off");
            if(isiOS){
                if(initOs.getOs() == 'h5'){
                    $(".nav-voice").on('click', function(){
                        $(".content-box").show();
                        $(".voice-box").show();
                        $("#messageVoiceId").show();
                        $("#appMessageVoiceId").hide();
                        $(".label-box").hide();
                        showVoiceIcon(1);
                    });
                }else{
                    $(".nav-voice").on('click', function(){
                        $(".content-box").show();
                        $(".voice-box").show();
                        $("#messageVoiceId").hide();
                        $("#appMessageVoiceId").show();
                        $(".label-box").hide();
                        showVoiceIcon(1);
                    });
                }
            }else{
                $(".nav-voice").off('click', h5.popupSelect);
                $(".nav-voice").on('click', h5.popupSelect);
            }
        }else if(arr[i] == 3){
            $(".nav-file").removeClass("off");
            if(initOs.getOs() != 'h5'){
                $(".nav-file").off('click');
                if(initOs.getOs() == 'ios'){
                    $(".nav-file").on('click', function(){
                        $("#containerFilehelp").show().animate({"left" : 0}, 300);
                    });
                }else{
                    $(".nav-file").on('click', app.appFileShow);
                }
            }else{
                $(".nav-file input").show();
            }
        }
    }
}

// 播放音频动画
function waveFlash(){
    $('.appui_qanda-voice-wave .wave2 , .appui_qanda-voice-wave .wave3').hide();
    setTimeout(function(){$('.appui_qanda-voice-wave .wave2').show();},400);
    setTimeout(function(){$('.appui_qanda-voice-wave .wave3').show();},800);
}

// 删除上传语音
function deleteVoice(){
    app.appVoiceTime = '';
    $(".select-view").empty();
    recoverBtn([1,2,3]);
    $(".select-view").hide();
    StopLocalVoiceFiles();
    if(initOs.getOs() != 'h5'){
        cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "SpeechOFFSynthesize", "stop");
        app.playState = 1;
    }
}

// 弹框取消
function backFunction(){
    customHistoryUtilsBack();
}
function saveFunction(){
    $("#iosDialog1").remove();
}

// 上传内容代码
function issueContent(){
    dataLoading("发布中,请勿操作...");

    var title = $.trim($("#message_title").val());
    // var title = $.trim($("#edit-mark").text());
    var content = $.trim($("#edit-mark").text());
    var type = $('.publishcolor').data('type');
    var summary = getTextFromHtml(trim($("#summaryInput").val()));
    var csrf = $('input[name="csrf"]').val();
    // 表示有上传图片
    if($(".select-view > figure").length > 0){
        // 上传的图片
        (function(){
            var ImgArr = [];
            for(var i = 0; i <　$(".select-view > figure").length; i++){
                ImgArr.push($(".select-view > figure > img")[i].src);
            }
          //上传图片
            issueSubmit('', '', ImgArr);
        })();
        //yanli
    }else if($("#voice-box").length > 0){
        // 上传的语音
        if(initOs.getOs() == 'h5'){
            //先将数据放到发帖的数据表中

            (function(){
                $.ajax({
                    data: {
                        'title':title,
                        'summary':summary,
                        'content':content,
                        'type':type,
                        'voices':'',//先上传其他的，然后再更新voices
                        'from':request('from'),
                        'publishtype':request('publishtype'),
                        'circle_id':request('circle_id'),
                        '_csrf':csrf,
                    },
                    type: "POST",
                    url: '/articles/fatie.html',
                    cache: false,
                    async:false,
                    dataType:"json",
                    success: function(msg) {
                        if(msg.result == 'success'){
                            h5_Voice.loadVoice1(0,msg.id);
                        }
                    },
                    error: function (msg) {
                        clearToastDialog();
                        dataLoadedError("发布失败,请重试.");
                    }
                });
            })();
        }else{
            cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SelectAppFilePlugin", "UploadFiles", app.Audio);
        }
    }else if(h5_Voice.recordPercent > 0 || h5_Voice.currentVoiceIndex > 0){
        //非iOS录音
        //先将数据放到发帖的数据表中
        (function(){
            $.ajax({
                data: {
                    'title':title,
                    'summary':summary,
                    'content':content,
                    'type':type,
                    'voices':'',//先上传其他的，然后再更新voices
                    'from':request('from'),
                    'publishtype':request('publishtype'),
                    'circle_id':request('circle_id'),
                    '_csrf':csrf,
                },
                type: "POST",
                url: '/articles/fatie.html',
                cache: false,
                async:false,
                dataType:"json",
                success: function(msg) {
                    if(msg.result == 'success'){
                        h5_Voice.loadVoice1(0,msg.id);
                    }
                },
                error: function (msg) {
                    clearToastDialog();
                    dataLoadedError("发布失败,请重试.");
                }
            });
        })();
    }else if(typeof appCurRecordSeconds != 'undefined' && appCurRecordSeconds > 0){
        // alert(4);
        app.recordTime = appCurRecordSeconds;
        // app录音
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "update", [0]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "stop", [0]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "upload", [0]);
    }else if(app.allFileData.length > 0){
        // alert(5);
        // app上传文件
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SelectAppFilePlugin", "UploadFiles", app.allFileData);
    }else if(webUploadFile.fileList.length > 0){
        // alert(6);
        // h5上传文件
        (function(){
            var data = new FormData();
            data.append("filePath", "/data/file");
            for(var i = 0; i < webUploadFile.fileList.length; i++){
                data.append("files", webUploadFile.fileList[i]);
            }
            $.ajax({
                data: data,
                type: "POST",
                url: uploadFiles,
                cache: false,
                async:false,
                dataType:"json",
                contentType: false,
                processData: false,
                success: function(msg) {
                    if(msg.result == 'success'){
                        issueSubmit(msg.filseIds);
                    }
                },
                error: function (msg) {
                    // console.log(msg);
                    clearToastDialog();
                    dataLoadedError("发布失败,请重试.");
                    // dataLoadedError(msg);
                }
            });
        })();
    }else{
        issueSubmit();
    }
}

// ajax提交代码
function issueSubmit(fileId, state, imgArr,wxImg){
    if(!imgArr){
        imgArr = '';
    }
    var csrf = $('input[name="csrf"]').val();
    if(state && state == 1){
        clearToastDialog();
        dataLoadedError("发布失败,请重试.");
        return false;
    }
    var headerTxt = $.trim($("#message_title").val());
    // var headerTxt = $.trim($("#edit-mark").text());
    var contentTxt = $.trim($("#edit-mark").text());
    var content = $.trim($("#edit-mark").text());
    if(headerTxt == ''){
        clearToastDialog();
        dataLoadedError("标题不能为空。");
        return false;
    }
    if(request('from') == 'circle'){
        var type = 0;
    }else{
        var type = $('.publishcolor').data('type');
    }

    var summary = getTextFromHtml(trim($("#summaryInput").val()));
    $.ajax({
        type: "post",
        url: '/articles/article_data.html',
        dataType: "json",
        data: {
            "title":headerTxt,
            "pics": imgArr,
            "videos": '',
            "type": type,
            "summary": summary,
            "content": contentTxt,
            'from':request('from'),
            'circle_id':request('circle_id'),
            'publishtype':request('publishtype'),
            "_csrf":csrf,
        },
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
                dataLoadedSuccess("发布成功,即将跳转");
                window.location.replace("/articles/article_detail.html?id="+result.id+"&from="+request('from')+"&publishtype="+request('publishtype'));
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

// 提交语音消息
function postVoiceMessage(wxRecordId,curCount, id, type) {
    if (initOs.getOs() != 'h5') {
        deviceTypeStr = 3;
        curCount = app.appVoiceTime != ''?app.appVoiceTime:(Math.floor(curCount/100) + 1);
    }
    if(!!type && type == 3){
        deviceTypeStr = 3;
    }
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/record/voicetype.html',
        dataType: "json",
        async: true,
        data:{
            "id": id,
            "url": wxRecordId,
            "type":'fatie',
            "voice_time":curCount,
            'from':request('from'),
            'publishtype':request('publishtype'),
            'circle_id':request('circle_id'),
            '_csrf':csrf,
        },
        success: function(result){
            clearToastDialog();
            if (result.result=="success") {
                dataLoadedSuccess("发布语音成功,跳转中");
                window.location.replace("/articles/article_detail.html?from&id="+id+"&from="+request('from')+"&publishtype="+request('publishtype'));
            }else{
                dataLoadedError(result.message);
            }
        }
    });
}

//得到圈子信息
function FileReleaseRequestQzShow(qzId){
    $.ajax({
        type: "post",
        url: getQz,
        dataType: "json",
        async: true,
        data:{"id":qzId},
        success: function(result) {
            if (result.result == "success") {
                var hostId = result.data.qzShow.host.id;

                var tempUser = getSessionUserNoRedirectEx();
                if(tempUser==null){
                    tempUser=getSessionUser();
                }

                //如果当前登录人是圈主，则可以发表到圈外
                if(userTest!=null && userTest!="" && result.data.qzShow.host.id==userTest.id){
                    // $('#appuiOpenPublish').show();
                    $('#messagePicsId').addClass('b-b-greyf1');

                    /*$('#appuiOpenPublish').click(function(e) {
                     $(this).toggleClass('on');
                     });*/
                    $("#issueBtn").unbind().click(function(){
                        var editNode = document.getElementById("edit-mark");
                        var title = $('#message_title').val();
                        if(title == ''){
                            dataLoadedError("请输入标题");
                            return false;
                        }
                        if(trim(editNode.value.replace(/[\r\n]/g,""))=="" && $(".select-view > figure").length == 0 && $(".select-view > .file-item").length == 0 && $("#voice-box").length == 0 && !(typeof appCurRecordSeconds != 'undefined' && appCurRecordSeconds > 0) && h5_Voice.recordPercentArray.length == 0 && h5_Voice.recordPercent == 0){
                            dataLoadedError("请输入要分享的内容");
                            return false;
                        }
                        pupopConfirm({
                            content: '公开发布（允许转发到圈外）',
                            noTxt: '不公开',
                            yesTxt: '公开'
                        }, function(){
                            appuiOpenPublish = 1;
                            submitssayData();
                        }, function(){
                            appuiOpenPublish = 0;
                            submitssayData();
                        });
                    });
                }
            }
        }
    });
}

//yanli
function submitssayData(){
    if(isWeiXinBorrower() && h5_Voice.voiceState){
        // alert('submitssayData');
        h5_Voice.stopRecord1();
        return false;
    }
    if(initOs.getOs() != "h5"){
        // alert('h5');
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "SpeechOFFSynthesize", "stop", [0]);
        cordova.exec(callAppsSuccessFunction, callAppsFailFunction, "RecorderPlugin", "pause", [0]);
    }
    issueContent();
}

function switchOvice(){
    $(".content-box").show();
    $(".voice-box").show();
    $("#tagLabelList").hide();
}

function retreatState(){
    if($(".selected-file").is(":visible")){
        $(".selected-file").hide();
        $(".edit_box").show();
    }else if($(".popup-select").is(":visible")){
        $(".popup-select").removeClass("popup-select-show");
        $(".popup-select").hide();
    }else{
        historyUtils.back();
    }
};




















