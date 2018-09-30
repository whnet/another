// commonQaList.js
function commonQaListFunction (cell,index) {
    var doStr = "";
    var picsStr = "";
    var listenDispalyStatus = cell.listenDispalyStatus;
    var tips = "";
    var statusListen = "";
    var answerType = "";
    var levelStr = userLevelStrOfQA(cell.answerUser.masterLvl,cell.answerUser.loupanId);
    if (cell.pics!=null&&cell.pics.length>0) {
        picsStr = '<i class="appui-qanda-question-imgtag"><img src="../../themes/img/img-tag.png" /></i>';
    };
    /** 收听状态，用户客户端判断  0-付费，1-免费，2-限次免费*/
    // private byte listenDispalyStatus;
    if (listenDispalyStatus==0) {
        statusListen = "pay";
        // tips = cell.qfee+"元";
        if(initOs.getOs() == 'ios'){
            tips = (parseInt(cell.qfee)*100)+"律乎币";
        }else{
        tips = cell.qfee+"元";
        }
    }else if (listenDispalyStatus==1) {
        statusListen = "free";
        tips = "免费";
    }else if (listenDispalyStatus==2) {
        statusListen = "time";
        tips = "限次";
    }
    // answerType 1 语音 2文字
    if (cell.answerType==1) {
    	if (tips=="限次") {
			tips ="限次免费";
    	}else{
		tips =tips +"收听";
    	}
        answerType ='<div class="appui-qanda-answerstyle voice '+statusListen+'" id="a_play_'+index+'_'+cell.id+'" onclick = "playAudioQaClickFunction('+cell.id+',1,1,\'a_play_'+index+'_'+cell.id+'\');">'+
						'<i></i>'+
						'<span class="appui_qanda-voice-wave">'+
							'<em class="wave1"></em>'+
							'<em class="wave2"></em>'+
							'<em class="wave3"></em>'+
						'</span>'+
						'<em class="tips">'+tips+'</em>'+
						'<span class="appui_qanda-voice-wait" style="display:none;"></span>'+
					'</div>'+
					'<em class="appui-qanda-answer-time">'+cell.answerLen+'&quot;</em>'+
					//<!--收听次数-->
					'<span class="appui-qanda-answer-listen">'+cell.listenUserTimes+'人收听</span>';
    }else if (cell.answerType==2) {
    	if (tips=="限次") {
			tips ="限次免费";
    	}else{
		tips =tips +"阅读";
    	}
        answerType = 	'<div class="appui-qanda-answerstyle pictext '+statusListen+'" id="a_play_'+index+'_'+cell.id+'" onclick = "playAudioQaClickFunction('+cell.id+',1,1,\'a_play_'+index+'_'+cell.id+'\');">'+
							'<i></i>'+
							'<span class="appui-qanda-answerstyle-wave"></span>'+
							'<em class="tips">'+tips+'</em>'+
						'</div>'+
						//<!--收听次数-->
						'<span class="appui-qanda-answer-listen">'+cell.listenUserTimes+'人阅读</span>';;
    }
    var expertinfoStr = "";
    if (cell.answerUser.title!="") {
    	expertinfoStr = '<p>'+cell.answerUser.title+'</p>';//cell.answerUser.lable.replace(/,/g,"、")
    }else if(cell.answerUser.lable!=""){
		expertinfoStr = '<p>'+cell.answerUser.lable.replace(/,/g,"、")+'</p>';
	}else{
		expertinfoStr = '<p>'+cell.answerUser.nickname+'</p>';
	}
    //var content;
    //if(StringFormatQanda(cell.content,3)){
        //content = '<div class="appui-qanda-question">'+ picsStr+ cell.content+ '</div>';
    //}else{
        //content = '<div class="appui-qanda-question hint-more">'+ picsStr+ cell.content+ '</div>';
    //}
	doStr =		'<div class="appui-qanda-module mb10" onclick = "gotoQADetailHtml1('+cell.id+','+index+', this)">'+
					//<!--问题信息-->
					//content+
					'<div class="appui-qanda-question">'+ picsStr+ cell.content+ '</div>'+
					//<!--回答信息-->
					'<div class="appui-qanda-answer">'+
						//<!--回答者头像与等级-->
						'<div class="appui-qanda-expertphoto" onclick = "gotoUser_pageHtml('+cell.answerUser.id+')">'+
							'<img src="'+insertImgType(cell.answerUser.headPic,2)+'" />'+
							levelStr+

							// '<i class="appui-userlevel"><img src="../../themes/img/vip2.png" /></i>'+
						'</div>'+
						
						//<!--回答-语音-->
						answerType+

						//<!--时长-->


					'</div>'+

					//<!--回答者信息-->
					
					'<div class="appui-qanda-expertinfo">'+
						'<a>'+cell.answerUser.nickname+'</a>'+
					expertinfoStr+
					'</div>'+

				'</div>';
	return doStr;
}

function gotoQADetailHtml1(id,index,obj){
    (typeof saveStatusBeforeJump!='undefined')&&saveStatusBeforeJump();
    if(typeof obj != 'undefined'){
        setElementClickStyle(obj);
    }

    window.location.href = "qanda_detail.html?id="+id;
    /**
    if (typeof(typeId)=="string"&&typeId=="undefined") {
		window.location.href = "qanda_detail.html?id="+id;
	}else if (typeId == "index") {
    	window.location.href = "qanda_detail.html?id="+id+"&typeId=4";
	}else if (typeId == "qanda") {
    	window.location.href = "qanda_detail.html?id="+id+"&typeId=5";
	}else if (typeId=="qaLable") {
		writeClientSession("qaLable",categoryPreID);
		window.location.href = "qanda_detail.html?id="+id+"&typeId=4";
	}else{
		window.location.href = "qanda_detail.html?id="+id;
	}*/
}
                    /**
 * 字符串转换添加省略号
 * @param str1 字符串
 * @param row 保留行
 * @returns {*}
 * @constructor
 */
function StringFormatQanda(str,row){
    var str = str.replace(/<a([^<]+)>/g, '').replace(/<\/a>/g, '');
    // 判断屏幕宽度限制字数
    var limitLength;
    var winWdith = document.body.clientWidth;
    if(winWdith >= 395){
        limitLength = 49*row;
    }else if(winWdith >= 380){
        limitLength = 47*row;
    }else if(winWdith >= 365){
        limitLength = 45*row;
    }else if(winWdith >= 350){
        limitLength = 43*row;
    }else if(winWdith >= 335){
        limitLength = 41*row;
    }else{
        limitLength = 39*row;
    }
    var realLength = 6, charCode = -1, strLength = 0;
    // 判断字符长度是否符合
    if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= limitLength - realLength) {
        return true;
    }else{
        return false;
    }
}
