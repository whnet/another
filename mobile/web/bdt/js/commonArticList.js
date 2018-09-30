function listCellSquare(groups,index,currentIndex){
	var cellContent=groups.content;
	var id=cellContent.id;
	var type=groups.type;
	//公共头部
	var createTime=getDateDiff(cellContent.addTime);
	var nickName="";
	var focusStatus="";
	var userId="";
	var headPic="";
	var levelStr="";
	if(type==1){
		userId=cellContent.author.id;
		headPic=cellContent.author.headPic;
		nickName=cellContent.author.nickname;
		focusStatus=cellContent.author.focusStatus;
		levelStr = userLevelStr(cellContent.author.masterLvl,cellContent.author.loupanId);
	}else if(type==2){
		if(cellContent.aStatus==1){
			userId=cellContent.answerUser.id;
			headPic=cellContent.answerUser.headPic;
			nickName=cellContent.answerUser.nickname;
			focusStatus=cellContent.answerUser.focusStatus;
			levelStr = userLevelStr(cellContent.answerUser.masterLvl,cellContent.answerUser.loupanId);
		}else if(cellContent.aStatus==1){
			userId=cellContent.qustionUser.id;
			headPic=cellContent.qustionUser.headPic;
			nickName=cellContent.qustionUser.nickname;
			focusStatus=cellContent.qustionUser.focusStatus;
			levelStr = userLevelStr(cellContent.qustionUser.masterLvl,cellContent.qustionUser.loupanId);
		}
	}else{
		userId=cellContent.sponsor.id;
		headPic=cellContent.sponsor.headPic;
		nickName=cellContent.sponsor.nickname;
		focusStatus=cellContent.sponsor.focusStatus;
		levelStr = userLevelStr(cellContent.sponsor.masterLvl,cellContent.sponsor.loupanId);
	}

	var tophtml=CreateTopHtmlHasAddFocus(userId,headPic,nickName,createTime,focusStatus,levelStr);


	//短文类型 包括图片，语音，视频，文字
	var contentStr = "";
	if (type==1) {//外层类型，短文和长文此时都是1
		if (cellContent.type==0) {//内层短文
			if (cellContent.homePic.length>0) {//有图片的
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreatePics(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
		    }else if (cellContent.voice!=null) {//语音判断
	        	var title=cellContent.title;
	        	var content=cellContent.content;
	        	var voiceId=cellContent.voice.id;
	        	var mediaLen=cellContent.voice.mediaLen;
		    	contentStr=CraeteVoice(id,title,content,voiceId,mediaLen);
	        }else if (cellContent.video!=null) {//视频判断
	        	var poster=cellContent.poster;
	        	var videoId=cellContent.video.id;
	        	var mediaLen=cellContent.video.mediaLen;
	        	contentStr=CreateVideo(id,poster,videoId,mediaLen);
	        }else if (cellContent.redPacketShow!=null) {//红包判断
	        	var redId=cellContent.redPacketShow.id;
	        	var redType=cellContent.redPacketShow.type;
	        	var remainSize=cellContent.redPacketShow.remainSize;
	        	var gainStatus=cellContent.redPacketShow.gainStatus;
	        	var notes=cellContent.redPacketShow.notes;
	        	var nickname=cellContent.author.nickname;
				contentStr=CreateRedPacket(id,redId,redType,remainSize,gainStatus,notes,nickname);
	}else{
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreateShortArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
			}
		}else if (cellContent.type==1){//文章类型 也就是长文
			var title= cellContent.title;
			var content= cellContent.content;
			var homePic= cellContent.homePic;
			var onePicUrl= cellContent.onePicUrl;
			var pubLocateId= cellContent.publishLocationId;
			var pubLocateType= cellContent.publishLocationType;
			var pubLocateNickname=cellContent.publishLocationNickname;
			contentStr=CreateArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
	    }
	}else if (type==2){//提问类型
//		var content= cellContent.content;
//		var linkImg= "";
//		if (cellContent.qustionUser.id==groups.userId) {
//			linkImg = cellContent.answerUser.headPic;
//		}else {
//			linkImg = cellContent.qustionUser.headPic;
//        }
//		contentStr= CreateQanda(id,content,linkImg,1);

		var content = cellContent.content;
		var answerType = cellContent.answerType;
		var aStatus = cellContent.aStatus;
		var listenDispalyStatus = cellContent.listenDispalyStatus;
		var pics = cellContent.pics;
		var qfee = cellContent.qfee;
		var answerLen="";
		if(answerType==1){
			answerLen = cellContent.answerLen+'&quot;';
		}
		contentStr = CreateQanda(id,content,answerType,aStatus,listenDispalyStatus,pics,qfee,answerLen,1,0);

	}else if (type==3){//话题类型
		var title= cellContent.title;
		var summary= cellContent.summary;
		var homePic= cellContent.pics;
		contentStr=CreateTopic(id,title,summary,homePic);
    }

	//公共尾部
	var agreeTimes=cellContent.agreeTimes;
	var replyTimes=cellContent.replyTimes;

	var gotoAnaswer='';
	var readtype = '';
	var clickTimes='';
	var gotoAnswer='';
	if(type==1){
		readtype="阅读";
		if(cellContent.type==0 && cellContent.voice!=null){
			readtype="收听";
		}
		clickTimes=cellContent.clickTimes;
	}else if(type==2){
		readtype="收听";
		clickTimes=cellContent.listenUserTimes;
	}else{
		readtype="讨论";
		clickTimes=cellContent.replyTimes+cellContent.answerTimes;
	}

	var detailPage='';
	if(type==1){//type=1-文章
		if(cellContent.type==1){//cell.type=1-长文
			detailPage='gotoArticDetailHtml('+id+');';
		}else{//cell.type=0-短文
			detailPage='gotoSquareDetailHtml('+id+');';
		}
	}else if(type==2){//type=2-问答
		detailPage='gotoQADetailHtml('+id+');';
	}else{//type=3-话题
		detailPage='gotoTopicDetailHtml('+id+');';
	}

	var agreeClass='';
	if (cellContent.currAttitude==1) {
		agreeClass = "on fc-red";
		}

	var bottomhtml=CreateBottomHtmlHasAct(id,type,detailPage,agreeClass,readtype,clickTimes,agreeTimes,replyTimes,gotoAnswer);

	return tophtml+contentStr+bottomhtml;
	}


///////////////////////////////===========================================================

//我的关注页面的得到HTML 并且有返回
function listCellHC(groups,index,currentIndex){
	var cellContent=groups.content;
	//page产生内容所在页面
	//page=1：首页、广场
	//page=2：行家主页、楼盘主页、我关注的
	//page=3：圈子主页
	//公共头部
	var id=cellContent.id;
	var type=groups.type;
	//公共头部

	var userId="";
	var headPic="";
	var nickName="";
	var levelStr="";
	var createTime="";
	var publishType="";

	if (type==1) {
		userId=cellContent.author.id;
		headPic=cellContent.author.headPic;
		nickName=cellContent.author.nickname;
		createTime=getDateDiff(cellContent.addTime);
		levelStr = userLevelStr(cellContent.author.masterLvl,cellContent.author.loupanId);
		publishType="发表";
	}
	else if(type==2){
		var userIdStr = groups.userId;
		if (cellContent.qustionUser.id==userIdStr) {
			userId=cellContent.qustionUser.id;
			headPic=cellContent.qustionUser.headPic;
			nickName=cellContent.qustionUser.nickname;
			createTime=getDateDiff(cellContent.addTime);
			levelStr = userLevelStr(cellContent.qustionUser.masterLvl,cellContent.qustionUser.loupanId);
			publishType="提问";
		}else{
			userId=cellContent.answerUser.id;
			headPic=cellContent.answerUser.headPic;
			nickName=cellContent.answerUser.nickname;
			createTime=getDateDiff(cellContent.answerTime);
			levelStr = userLevelStr(cellContent.answerUser.masterLvl,cellContent.answerUser.loupanId);
			publishType="回答";
		}
	}

	tophtml=CreateTopHtmlHasPublishType(userId,headPic,nickName,createTime,publishType,levelStr);


	//短文类型 包括图片，语音，视频，文字
	var contentStr = "";
	if (type==1) {//外层类型，短文和长文此时都是1
		if (cellContent.type==0) {//内层短文
			if (cellContent.homePic.length>0) {//有图片的
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreatePics(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
		    }else if (cellContent.voice!=null) {//语音判断
	        	var title=cellContent.title;
	        	var content=cellContent.content;
	        	var voiceId=cellContent.voice.id;
	        	var mediaLen=cellContent.voice.mediaLen;
		    	contentStr=CraeteVoice(id,title,content,voiceId,mediaLen);
	        }else if (cellContent.video!=null) {//视频判断
	        	var poster=cellContent.poster;
	        	var videoId=cellContent.video.id;
	        	var mediaLen=cellContent.video.mediaLen;
	        	contentStr=CreateVideo(id,poster,videoId,mediaLen);
	        }else if (cellContent.redPacketShow!=null) {//红包判断
	        	var redId=cellContent.redPacketShow.id;
	        	var redType=cellContent.redPacketShow.type;
	        	var remainSize=cellContent.redPacketShow.remainSize;
	        	var gainStatus=cellContent.redPacketShow.gainStatus;
	        	var notes=cellContent.redPacketShow.notes;
	        	var nickname=cellContent.author.nickname;
				contentStr=CreateRedPacket(id,redId,redType,remainSize,gainStatus,notes,nickname);
			}else{
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreateShortArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
			}
		}else if (cellContent.type==1){//文章类型 也就是长文
			var title= cellContent.title;
			var content= cellContent.content;
			var homePic= cellContent.homePic;
			var onePicUrl= cellContent.onePicUrl;
			var pubLocateId= cellContent.publishLocationId;
			var pubLocateType= cellContent.publishLocationType;
			var pubLocateNickname=cellContent.publishLocationNickname;
			contentStr=CreateArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
	    }
	}else if (type==2){//提问类型
//		var content= cellContent.content;
//		var linkImg= "";
//		if (cellContent.qustionUser.id==groups.userId) {
//			linkImg = cellContent.answerUser.headPic;
//		}else {
//			linkImg = cellContent.qustionUser.headPic;
//		}
//		contentStr= CreateQanda(id,content,linkImg,1);

		var content = cellContent.content;
		var answerType = cellContent.answerType;
		var aStatus = cellContent.aStatus;
		var listenDispalyStatus = cellContent.listenDispalyStatus;
		var pics = cellContent.pics;
		var qfee = cellContent.qfee;
		var answerLen="";
		if(answerType==1){
			answerLen = cellContent.answerLen+'&quot;';
        }
		contentStr = CreateQanda(id,content,answerType,aStatus,listenDispalyStatus,pics,qfee,answerLen,1,0);

	}else if (type==3){//话题类型
		var title= cellContent.title;
		var summary= cellContent.summary;
		var homePic= cellContent.pics;
		contentStr=CreateTopic(id,title,summary,homePic);
        }


	//公共尾部
	var id=cellContent.id;
	var type=groups.type;
	var agreeTimes=cellContent.agreeTimes;
	var replyTimes=cellContent.replyTimes;

	var readtype = '';
	var clickTimes='';
	var gotoAnswer='';
	if(type==1){
		readtype="阅读";
		if(cellContent.type==0 && cellContent.voice!=null){
			readtype="收听";
		}
		clickTimes=cellContent.clickTimes;
	}else if(type==2){
		readtype="收听";
		clickTimes=cellContent.listenUserTimes;
		}else{
		readtype="讨论";
		clickTimes=cellContent.replyTimes+cellContent.answerTimes;
		}

	var detailPage='';
	if(type==1){//type=1-文章
		if(cellContent.type==1){//cell.type=1-长文
			detailPage='gotoArticDetailHtml('+id+');';
		}else{//cell.type=0-短文
			detailPage='gotoSquareDetailHtml('+id+');';
		}
	}
	else{//type=2-问答
		detailPage='gotoQADetailHtml('+id+');';
	}

	var agreeClass='';
	if (cellContent.currAttitude==1) {
		agreeClass = "on fc-red";
		}

	var bottomhtml=CreateBottomHtmlHasAct(id,type,detailPage,agreeClass,readtype,clickTimes,agreeTimes,replyTimes,gotoAnswer);

	return tophtml+contentStr+bottomhtml;
	}
	

///////////////////////////////===========================================================

//我的关注页面的得到HTML 并且有返回
function listCellLP(groups,index,currentIndex){
	var cellContent=groups.content;
	//page产生内容所在页面
	//page=1：首页、广场
	//page=2：行家主页、楼盘主页、我关注的
	//page=3：圈子主页
	//公共头部
	var id=cellContent.id;
	var type=groups.type;
	//公共头部
	
	var userId="";
	var headPic="";
	var nickName="";
	var levelStr="";
	var createTime="";
	var publishType="";
	
	if (type==1) {
		userId=cellContent.author.id;
		headPic=cellContent.author.headPic;
		nickName=cellContent.author.nickname;
		createTime=getDateDiff(cellContent.addTime);
		levelStr = userLevelStr(cellContent.author.masterLvl,cellContent.author.loupanId);
		publishType="发表";
	}
	else if(type==2){
		var userIdStr = groups.userId;
		if (cellContent.aStatus==0) {
			userId=cellContent.qustionUser.id;
			headPic=cellContent.qustionUser.headPic;
			nickName=cellContent.qustionUser.nickname;
			createTime=getDateDiff(cellContent.addTime);
			levelStr = userLevelStr(cellContent.qustionUser.masterLvl,cellContent.qustionUser.loupanId);
			publishType="提问";
		}else{
			userId=cellContent.answerUser.id;
			headPic=cellContent.answerUser.headPic;
			nickName=cellContent.answerUser.nickname;
			createTime=getDateDiff(cellContent.answerTime);
			levelStr = userLevelStr(cellContent.answerUser.masterLvl,cellContent.answerUser.loupanId);
			publishType="回答";
		}
	}
	
	tophtml=CreateTopHtmlHasPublishType(userId,headPic,nickName,createTime,publishType,levelStr);
	
	
	//短文类型 包括图片，语音，视频，文字
	var contentStr = "";
	if (type==1) {//外层类型，短文和长文此时都是1
		if (cellContent.type==0) {//内层短文
			if (cellContent.homePic.length>0) {//有图片的
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreatePics(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname,"loupan");
		    }else if (cellContent.voice!=null) {//语音判断
	        	var title=cellContent.title;
	        	var content=cellContent.content;
	        	var voiceId=cellContent.voice.id;
	        	var mediaLen=cellContent.voice.mediaLen;
		    	contentStr=CraeteVoice(id,title,content,voiceId,mediaLen);
	        }else if (cellContent.video!=null) {//视频判断
	        	var poster=cellContent.poster;
	        	var videoId=cellContent.video.id;
	        	var mediaLen=cellContent.video.mediaLen;
	        	contentStr=CreateVideo(id,poster,videoId,mediaLen);
	        }else if (cellContent.redPacketShow!=null) {//红包判断
	        	var redId=cellContent.redPacketShow.id;
	        	var redType=cellContent.redPacketShow.type;
	        	var remainSize=cellContent.redPacketShow.remainSize;
	        	var gainStatus=cellContent.redPacketShow.gainStatus;
	        	var notes=cellContent.redPacketShow.notes;
	        	var nickname=cellContent.author.nickname;
				contentStr=CreateRedPacket(id,redId,redType,remainSize,gainStatus,notes,nickname);
			}else{
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreateShortArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname,"loupan");
			}
		}else if (cellContent.type==1){//文章类型 也就是长文
			var title= cellContent.title;
			var content= cellContent.content;
			var homePic= cellContent.homePic;
			var onePicUrl= cellContent.onePicUrl;
			var pubLocateId= cellContent.publishLocationId;
			var pubLocateType= cellContent.publishLocationType;
			var pubLocateNickname=cellContent.publishLocationNickname;
			contentStr=CreateArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname,"loupan");
		}
	}else if (type==2){//提问类型
//		var content= cellContent.content;
//		var linkImg= "";
//		if (cellContent.qustionUser.id==groups.userId) {
//			linkImg = cellContent.answerUser.headPic;
//		}else {
//			linkImg = cellContent.qustionUser.headPic;
//		}
//		contentStr= CreateQanda(id,content,linkImg,1);

		var content = cellContent.content;
		var answerType = cellContent.answerType;
		var aStatus = cellContent.aStatus;
		var listenDispalyStatus = cellContent.listenDispalyStatus;
		var pics = cellContent.pics;
		var qfee = cellContent.qfee;
		var answerLen="";
		if(answerType==1){
			answerLen = cellContent.answerLen+'&quot;';
		}
		contentStr = CreateQanda(id,content,answerType,aStatus,listenDispalyStatus,pics,qfee,answerLen,1,0);
		
	}else if (type==3){//话题类型
		var title= cellContent.title;
		var summary= cellContent.summary;
		var homePic= cellContent.pics;
		contentStr=CreateTopic(id,title,summary,homePic);
	}
	
	
	//公共尾部
	var id=cellContent.id;
	var type=groups.type;
	var agreeTimes=cellContent.agreeTimes;
	var replyTimes=cellContent.replyTimes;
		
	var readtype = '';
	var clickTimes='';
	var gotoAnswer='';
	if(type==1){
		readtype="阅读";
		if(cellContent.type==0 && cellContent.voice!=null){
			readtype="收听";
		}
		clickTimes=cellContent.clickTimes;
	}else if(type==2){
		if(cellContent.aStatus==1){
		readtype="收听";
		clickTimes=cellContent.listenUserTimes;
		}
	}else{
		readtype="讨论";
		clickTimes=cellContent.replyTimes+cellContent.answerTimes;
	}
	
	var detailPage='';
	if(type==1){//type=1-文章
		if(cellContent.type==1){//cell.type=1-长文
			detailPage='gotoArticDetailHtml('+id+');';
		}else{//cell.type=0-短文
			detailPage='gotoSquareDetailHtml('+id+');';
		}
	}
	else{//type=2-问答
		detailPage='gotoQADetailHtml('+id+');';
	}
	
	var agreeClass='';
	if (cellContent.currAttitude==1) {
		agreeClass = "on fc-red";
    }
	
	var bottomhtml=CreateBottomHtmlHasAct(id,type,detailPage,agreeClass,readtype,clickTimes,agreeTimes,replyTimes,gotoAnswer);
	
	return tophtml+contentStr+bottomhtml;
}


///////////////////////////////===========================================================

//行家主页得到HTML 并且有返回
function listCellUP(groups,index,currentIndex,currentUserpic,currentUserID,currentUserNickname){
	var cellContent=groups.content;
	//page产生内容所在页面
	//page=1：首页、广场
	//page=2：行家主页、楼盘主页、我关注的
	//page=3：圈子主页
	//公共头部
	var id=cellContent.id;
	var type=groups.type;
	//公共头部
	
	var userId="";
	var headPic=currentUserpic;
	var nickName=currentUserNickname;
	var levelStr="";
	var createTime="";
	var publishType="";
	
	if (type==1) {
		userId=cellContent.author.id;
		//headPic=cellContent.author.headPic;
		//nickName=cellContent.author.nickname;
		
		createTime=getDateDiff(cellContent.addTime);
		levelStr = userLevelStr(cellContent.author.masterLvl,cellContent.author.loupanId);
		publishType="发表";
	}
	else if(type==2){
		var userIdStr = currentUserID;
		if (cellContent.qustionUser.id==userIdStr) {
			userId=cellContent.qustionUser.id;
			//headPic=cellContent.qustionUser.headPic;
			//nickName=cellContent.qustionUser.nickname;
			createTime=getDateDiff(cellContent.addTime);
			levelStr = userLevelStr(cellContent.qustionUser.masterLvl,cellContent.qustionUser.loupanId);
			publishType="提问";
		}else{
			userId=cellContent.answerUser.id;
			//headPic=cellContent.answerUser.headPic;
			//nickName=cellContent.answerUser.nickname;
			createTime=getDateDiff(cellContent.answerTime);
			levelStr = userLevelStr(cellContent.answerUser.masterLvl,cellContent.answerUser.loupanId);
			publishType="回答";
		}
	}
	
	tophtml=CreateTopHtmlHasPublishType(userId,headPic,nickName,createTime,publishType,levelStr);
	
	
	//短文类型 包括图片，语音，视频，文字
	var contentStr = "";
	if (type==1) {//外层类型，短文和长文此时都是1
		if (cellContent.type==0) {//内层短文
			if (cellContent.homePic.length>0) {//有图片的
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreatePics(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
		    }else if (cellContent.voice!=null) {//语音判断
	        	var title=cellContent.title;
	        	var content=cellContent.content;
	        	var voiceId=cellContent.voice.id;
	        	var mediaLen=cellContent.voice.mediaLen;
		    	contentStr=CraeteVoice(id,title,content,voiceId,mediaLen);
	        }else if (cellContent.video!=null) {//视频判断
	        	var poster=cellContent.poster;
	        	var videoId=cellContent.video.id;
	        	var mediaLen=cellContent.video.mediaLen;
	        	contentStr=CreateVideo(id,poster,videoId,mediaLen);
	        }else if (cellContent.redPacketShow!=null) {//红包判断
	        	var redId=cellContent.redPacketShow.id;
	        	var redType=cellContent.redPacketShow.type;
	        	var remainSize=cellContent.redPacketShow.remainSize;
	        	var gainStatus=cellContent.redPacketShow.gainStatus;
	        	var notes=cellContent.redPacketShow.notes;
	        	var nickname=cellContent.author.nickname;
				contentStr=CreateRedPacket(id,redId,redType,remainSize,gainStatus,notes,nickname);
			}else{
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				var pubLocateId= cellContent.publishLocationId;
				var pubLocateType= cellContent.publishLocationType;
				var pubLocateNickname=cellContent.publishLocationNickname;
				contentStr=CreateShortArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
			}
		}else if (cellContent.type==1){//文章类型 也就是长文
			var title= cellContent.title;
			var content= cellContent.content;
			var homePic= cellContent.homePic;
			var onePicUrl= cellContent.onePicUrl;
			var pubLocateId= cellContent.publishLocationId;
			var pubLocateType= cellContent.publishLocationType;
			var pubLocateNickname=cellContent.publishLocationNickname;
			contentStr=CreateArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname);
		}
	}else if (type==2){//提问类型
//		var content= cellContent.content;
//		var linkImg= "";
//		if (cellContent.qustionUser.id==currentUserID) {
//			linkImg = cellContent.answerUser.headPic;
//		}else {
//			linkImg = cellContent.qustionUser.headPic;
//		}
//		contentStr= CreateQanda(id,content,linkImg,1);

		var content = cellContent.content;
		var answerType = cellContent.answerType;
		var aStatus = cellContent.aStatus;
		var listenDispalyStatus = cellContent.listenDispalyStatus;
		var pics = cellContent.pics;
		var qfee = cellContent.qfee;
		var answerLen="";
		if(answerType==1){
			answerLen = cellContent.answerLen+'&quot;';
		}
		contentStr = CreateQanda(id,content,answerType,aStatus,listenDispalyStatus,pics,qfee,answerLen,1,0);
		
	}else if (type==3){//话题类型
		var title= cellContent.title;
		var summary= cellContent.summary;
		var homePic= cellContent.pics;
		contentStr=CreateTopic(id,title,summary,homePic);
	}
	
	
	//公共尾部
	var id=cellContent.id;
	var type=groups.type;
	var agreeTimes=cellContent.agreeTimes;
	var replyTimes=cellContent.replyTimes;
		
	var readtype = '';
	var clickTimes='';
	var gotoAnswer='';
	if(type==1){
		readtype="阅读";
		if(cellContent.type==0 && cellContent.voice!=null){
			readtype="收听";
		}
		clickTimes=cellContent.clickTimes;
	}else if(type==2){
		readtype="收听";
		clickTimes=cellContent.listenUserTimes;
	}else{
		readtype="讨论";
		clickTimes=cellContent.replyTimes+cellContent.answerTimes;
	}
	
	var detailPage='';
	if(type==1){//type=1-文章
		if(cellContent.type==1){//cell.type=1-长文
			detailPage='gotoArticDetailHtml('+id+');';
		}else{//cell.type=0-短文
			detailPage='gotoSquareDetailHtml('+id+');';
		}
	}
	else{//type=2-问答
		detailPage='gotoQADetailHtml('+id+');';
	}
	
	var agreeClass='';
	if (cellContent.currAttitude==1) {
		agreeClass = "on fc-red";
    }
	
	var bottomhtml=CreateBottomHtmlHasAct(id,type,detailPage,agreeClass,readtype,clickTimes,agreeTimes,replyTimes,gotoAnswer);
	
	return tophtml+contentStr+bottomhtml;
}


///////////////////////////////===========================================================

	
//圈子主页页面的得到HTML 并且有返回
function listCellQZ(groups,index,currentIndex,hostId,currentUserID){
	var cellContent=groups.content;
	//page产生内容所在页面
	//page=1：首页、广场
	//page=2：行家主页、楼盘主页、我关注的
	//page=3：圈子主页
	//公共头部
	var id=cellContent.id;
	var type=groups.type;
	//公共头部
	var levelStr = "";
	var askOrAnswer="";
	var userId=groups.userId;
	var nickName="";
	var createTime="";
	var priorLvl=groups.qzContentPriorLvl;
	var qzContentId=groups.id;
	var headPic="";
	var postUserID="";
	
	if(type==1){
		nickName=cellContent.author.nickname;
		createTime=getDateDiff(cellContent.addTime);
		headPic=cellContent.author.headPic;
		levelStr = userLevelStr(cellContent.author.masterLvl,cellContent.author.loupanId);
		postUserID = cellContent.author.id;
	}else if(type==2){
		if(cellContent.aStatus == 1){
			askOrAnswer='回答了';
			nickName=cellContent.answerUser.nickname;
			createTime=getDateDiff(cellContent.answerTime);
			headPic=cellContent.answerUser.headPic;
			levelStr = userLevelStr(cellContent.answerUser.masterLvl,cellContent.answerUser.loupanId);
			postUserID = cellContent.answerUser.id;
		}else{
			askOrAnswer='提问了';
			nickName=cellContent.qustionUser.nickname;
			createTime=getDateDiff(cellContent.addTime);
			headPic=cellContent.qustionUser.headPic;
			levelStr = userLevelStr(cellContent.qustionUser.masterLvl,cellContent.qustionUser.loupanId);
			postUserID = cellContent.qustionUser.id;
		}
		
	}
	
	tophtml=CreateTopHtmlHasEssence(id,qzContentId,postUserID,hostId,priorLvl,headPic,nickName,createTime,levelStr,askOrAnswer,currentUserID);
	
	
	//短文类型 包括图片，语音，视频，文字
	var contentStr = "";
	if (type==1) {//外层类型，短文和长文此时都是1
		if (cellContent.type==0) {//内层短文
			if (cellContent.homePic.length>0) {//有图片的
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				contentStr=CreatePics(id,title,content,homePic,onePicUrl,0,0,"");
		    }else if (cellContent.voice!=null) {//语音判断
	        	var title=cellContent.title;
	        	var content=cellContent.content;
	        	var voiceId=cellContent.voice.id;
	        	var mediaLen=cellContent.voice.mediaLen;
		    	contentStr=CraeteVoice(id,title,content,voiceId,mediaLen);
	        }else if (cellContent.video!=null) {//视频判断
	        	var poster=cellContent.poster;
	        	var videoId=cellContent.video.id;
	        	var mediaLen=cellContent.video.mediaLen;
	        	contentStr=CreateVideo(id,poster,videoId,mediaLen);
	        }else if (cellContent.redPacketShow!=null) {//红包判断
	        	var redId=cellContent.redPacketShow.id;
	        	var redType=cellContent.redPacketShow.type;
	        	var remainSize=cellContent.redPacketShow.remainSize;
	        	var gainStatus=cellContent.redPacketShow.gainStatus;
	        	var notes=cellContent.redPacketShow.notes;
	        	var nickname=cellContent.author.nickname;
				contentStr=CreateRedPacket(id,redId,redType,remainSize,gainStatus,notes,nickname);
			}else{
				var title= cellContent.title;
				var content= cellContent.content;
				var homePic= cellContent.homePic;
				var onePicUrl= cellContent.onePicUrl;
				contentStr=CreateShortArticle(id,title,content,homePic,onePicUrl,0,0,"");
	}
		}else if (cellContent.type==1){//文章类型 也就是长文
			var title= cellContent.title;
			var content= cellContent.content;
			var homePic= cellContent.homePic;
			var onePicUrl= cellContent.onePicUrl;
			contentStr=CreateArticle(id,title,content,homePic,onePicUrl,0,0,"");
		}
	}else if (type==2){//提问类型
//		var content= cellContent.content;
//		var linkImg= "";
//		if(cellContent.aStatus == 1){
//			linkImg = cellContent.qustionUser.headPic;
//		}else{
//			linkImg = cellContent.answerUser.headPic;
//		}
//		contentStr= CreateQanda(id,content,linkImg,2);

		var content = cellContent.content;
		var answerType = cellContent.answerType;
		var aStatus = cellContent.aStatus;
		var listenDispalyStatus = cellContent.listenDispalyStatus;
		var pics = cellContent.pics;
		var qfee = cellContent.qfee;
		var answerLen="";
		if(answerType==1){
			answerLen = cellContent.answerLen+'&quot;';
		}
		contentStr = CreateQanda(id,content,answerType,aStatus,listenDispalyStatus,pics,qfee,answerLen,2,0);
		
	}else if (type==3){//话题类型
		var title= cellContent.title;
		var summary= cellContent.summary;
		var homePic= cellContent.pics;
		contentStr=CreateTopic(id,title,summary,homePic);
	}
	
	
	//公共尾部
	var id=cellContent.id;
	var type=groups.type;
	var agreeTimes=cellContent.agreeTimes;
	var replyTimes=cellContent.replyTimes;
		
	var readtype = '';
	var clickTimes='';
	var gotoAnswer='';
	if(type==1){
		readtype="阅读";
		if(cellContent.type==0 && cellContent.voice!=null){
			readtype="收听";
			}
		clickTimes=cellContent.clickTimes;
	}else if(type==2){
		if(cellContent.aStatus == 0 && currentUserID==hostId){
			gotoAnswer	= '未回答';
		}else if(cellContent.aStatus == 1){
			if(cellContent.answerType==1){
		readtype="收听";
			}else{
				readtype="阅读";
			}
		clickTimes=cellContent.listenUserTimes;
		}/*else{
			readtype="围观";
			clickTimes=cellContent.listenUserTimes;
		}*/
		
	}else{
		readtype="讨论";
		clickTimes=cellContent.replyTimes+cellContent.answerTimes;
	}
	
	var detailPage='';
	if(type==1){//type=1-文章
		if(cellContent.type==1){//cell.type=1-长文
			detailPage='gotoArticDetailHtml('+id+');';
		}else{//cell.type=0-短文
			detailPage='gotoSquareDetailHtml('+id+');';
		}
	}
	else{//type=2-问答
		detailPage='gotoCircleQADetailHtml('+id+');';
		}
	
	var agreeClass='';
	if (cellContent.currAttitude==1) {
		agreeClass = "on fc-red";
	}
	
	var bottomhtml=CreateBottomHtmlHasAct(id,type,detailPage,agreeClass,readtype,clickTimes,agreeTimes,replyTimes,gotoAnswer);
	
	return tophtml+contentStr+bottomhtml;
	}
	

//有关注按钮的头部
function CreateTopHtmlHasAddFocus(userId,headPic,nickName,createTime,focusStatus,levelStr){
	var tophtml='<div class="f-f-module mb10 bg-white">'+
					'<div class="find-container">'+
						'<div class="find-header">'+
							'<div class="f-h-left">'+
								'<a onclick="gotoUser_pageHtml('+userId+');"><img src="'+insertImgType(headPic,2)+'" />'+levelStr+'</a>'+
								'<div class="f-h-middle">'+
									'<span class="fs30 fc-blue operate" onclick="gotoUser_pageHtml('+userId+');">'+nickName+'</span>'+
									'<span class="fs22 publish-time fc-black456">'+createTime+'</span>'+
								'</div>'+
							'</div>'+
							'<div class="f-h-right">'+
								isFocusStr(userId,focusStatus,2) +//关注：广场里头像右侧是关注按钮
							'</div>'+
						'</div>';
	return tophtml;
}
//带发布类型的头部
function CreateTopHtmlHasPublishType(userId,headPic,nickName,createTime,publishType,levelStr){
		var tophtml='<div class="f-f-module mb10 bg-white">'+
			'<div class="find-container">'+
				'<div class="find-header">'+
					'<div class="f-h-left">'+
					'<a onclick="gotoUser_pageHtml('+userId+');"><img src="'+insertImgType(headPic,2)+'" />'+levelStr+'</a>'+
						'<div class="f-h-middle">'+
						'<span class="fs30 fc-blue operate" onclick="gotoUser_pageHtml('+userId+');">'+nickName+'</span>'+
						'<span class="fs22 publish-time fc-black456">'+createTime+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="f-h-right">'+
						'<span class="pubtype fc-greyabc fs32"><i>·</i><em class="fs24">'+publishType+'</em><i>·</i></span>'+//关注：广场里头像右侧是关注按钮
					'</div>'+
				'</div>';
		return tophtml;
		}

//带精华推荐功能的头部
function CreateTopHtmlHasEssence(id,qzContentId,userId,hostId,priorLvl,headPic,nickName,createTime,levelStr,askOrAnswer,currentUserID){
	var circleActOrStyle = '';
	if(currentUserID == hostId){
		if(priorLvl==0){
			circleActOrStyle = '<a class="recommend-essence fs24 fc-greyabc" id="recommendEssence'+qzContentId+'" date-priorLvl = "1"  onclick="setQzContentPriorLvl('+qzContentId+')">推荐</a>';
		}else{
			circleActOrStyle = '<a class="recommend-essence cancel fs24 fc-red" id="recommendEssence'+qzContentId+'" date-priorLvl = "0"  onclick="setQzContentPriorLvl('+qzContentId+')">精华</a>';
	}
	}else{
		if(priorLvl==1){
			circleActOrStyle = '<span class="essence-tag fs24 fc-red" id="essenceTag">精华</span>';
		}
	}
	
		var tophtml='<div class="f-f-module mb10 bg-white">'+
			'<div class="find-container">'+
				'<div class="find-header">'+
					'<div class="f-h-left">'+
					'<a onclick="gotoUser_pageHtml('+userId+');"><img src="'+insertImgType(headPic,2)+'">'+levelStr+'</a>'+
						'<div class="f-h-middle">'+
						'<span class="fs30 fc-blue operate" onclick="gotoUser_pageHtml('+userId+');">'+
							nickName+
							'<em class="fc-greyabc">'+askOrAnswer+'</em>'+
						'</span>'+
						'<span class="fs22 publish-time fc-black456">'+createTime+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="f-h-right">'+
					circleActOrStyle+
					'</div>'+
				'</div>';
		return tophtml;
    }
    
	
//创建可操作的底部
function CreateBottomHtmlHasAct(id,type,detailPage,agreeClass,readType,clickTimes,agreeTimes,replyTimes,gotoAnswer){
	//type==1-文章：阅读（非语音短文和长文）收听（语音短文），type==2-问答：收听，type==3-话题：收听
	var bottomHtml='<div class="time-statistic fs22" onclick="'+detailPage+'">'+
							'<!--<div>文章来源-暂无</div>-->'+
							'<span class="fc-greyabc"><i>'+clickTimes+'</i>'+readType+'</span>'+
							'<span class="fc-red">'+gotoAnswer+'</span>'+
							'<div class="statistic">'+
								'<a class="like fc-greyabc '+agreeClass+'" onclick="dianzanClick('+id+','+type+')" id="dianzan'+id+'">'+agreeTimes+'</a>'+
								'<a class="comment ml10 fc-greyabc" id="pinglun_'+id+'" onclick="pubcommentClick('+id+','+id+','+type+')">'+replyTimes+'</a>'+
								'<span class="show-comment ml10" id="showComment_'+id+'" onclick="showCommentList('+id+','+type+',0);"><img src="../images/up_more.png"></span>'+
							'</div>'+
						'</div>'+
					'</div>'+
					//评论容器
					'<div class="dynamic-comment bg-greyfa" style="display:none;" onclick="'+detailPage+'" id="commentDiv_'+id+'"></div>'+
				'</div>';
	return bottomHtml;
}

//创建无操作仅有数据统计的底部
function CreateBottomHtmlHasStatistic(detailPage,clickTimes,replyTimes,agreeTimes){
	//type==1-文章：阅读（非语音短文和长文）收听（语音短文），type==2-问答：收听，type==3-话题：收听
	var bottomHtml='<div class="time-statistic fs22 fc-greyabc" onclick="'+detailPage+'">'+
						'<p class="fs24">'+clickTimes+'阅读·'+replyTimes+'评论·'+agreeTimes+'点赞</p>'+
         				'<p class="fs24 fc-greyd">点击查看详情</p>'+
					'</div>'+
				'</div>'+
			'</div>';
	return bottomHtml;
}


//创建红包HTML
function CreateRedPacket(id,redId,redType,remainSize,gainStatus,notes,nickname){
	var fansOrNew =redType==1?"粉丝红包":"新手红包";
	var redPacketText = "";
	var redPacketBtnClass = "";
	//在列表中不区分是否领取过红包
	if (remainSize!=0 && gainStatus == 0) {
		redPacketText = "领红包";
		redPacketBtnClass = "fs24 fc-red bc-red bg-white fwb";
	}else if(gainStatus == 1){
		redPacketText = "已领取";
		redPacketBtnClass = "fs24 fc-greyabc bc-grey bg-white fwb";
	}else{
		redPacketText = "已领完";
		redPacketBtnClass = "fs24 fc-greyabc bc-grey bg-white fwb";
	}
	var notesHtml;
	if(StringFormatConversion('',notes,2)){
        notesHtml = '<p class="text-style fs28 fc-black face_tag mb10">'+notes+'</p>'
	}else{
        notesHtml = '<p class="text-style fs28 fc-black face_tag mb10 hint-more">'+notes+'</p>'
	}
	
	var redhtml=	'<div id="contentDiv'+id+'" class="module-content mt10" onclick="gotoSquareDetailHtml('+id+', this)">'+
						'<div class="text-style">'+
						notesHtml+
						'</div>'+
						'<div class="redpacket-show mt5" onclick="openRedPacket('+redId+',event, '+id+')" id="redPacket'+id+'">'+
							'<img src="../images/hongbao_details.png" />'+
							'<p class="fs30 fc-black">'+nickname+'发的'+fansOrNew+'</p>'+
							'<a class="'+redPacketBtnClass+'">'+redPacketText+'</a>'+
						'</div>'+
					'</div>';
	return redhtml;
}

//创建语音消息
function CraeteVoice(id,title,content,voiceId,mediaLen){
	var voicehtml='<div id="contentDiv'+id+'" class="module-content mt10" onclick="gotoSquareDetailHtml('+id+')">';
	
	if(title!=null && title!=""){
		voicehtml+='<h4 class="f-l-height fs30 find-text fwb mb5">'+title+'</h4>';
	}
	
	voicehtml+=	'<p class="text-style fs28 fc-black face_tag mb10">'+content+'</p>'+
				'<div class="voice-layout">'+
					'<div class="appui-qanda-answer">'+
						'<div class="appui-qanda-answerstyle voice free" id="a_play_0_'+voiceId+'" onclick = "playAudioClickFunction('+voiceId+',1,1,\'a_play_0_'+voiceId+'\');">'+
							'<i></i>'+
							'<span class="appui_qanda-voice-wave">'+
							'<em class="wave1"></em>'+
							'<em class="wave2"></em>'+
							'<em class="wave3"></em>'+
						'</span>'+
							'<em class="tips">免费收听</em>'+
							'<span class="appui_qanda-voice-wait" style="display:none;"></span>'+
						'</div>'+
						'<em class="appui-qanda-answer-time">'+mediaLen+'&quot;</em>'+
					'</div>'+
				'</div>'+
			'</div>';
	
	return voicehtml;
}

//创建标题+内容
function CreateShortArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname,inPage){
	var shortArticleHtml='<div id="contentDiv'+id+'" class="module-content mt10" onclick="gotoSquareDetailHtml('+id+', this);">';
	if(title!=null && title!=""){
		shortArticleHtml+='<h4 class="f-l-height fs30 find-text fwb mb5">'+title+'</h4>';
	}
	
	var squareLabel='';//'<a class="fc-blue" href="javascript:void(0);">#文章#</a>';//topic.html#1
	if(pubLocateType==1){//楼盘
		if(inPage == 'loupan'){//如果是楼盘主页就不需要显示楼盘标签
			squareLabel='';
		}else{
		squareLabel='<a class="fc-blue" href="loupan_page.html?id='+pubLocateId+'">#'+pubLocateNickname+'#</a>';
		}
	};

	squareLabel=squareLabel+content;

	if(squareLabel!=""){
        // 文字未进行截取处理的采用css样式控制
        if(StringFormatConversion('#'+(pubLocateNickname?pubLocateNickname:'文章')+'#',content,2)){
		shortArticleHtml+='<p class="text-style fs28 fc-black face_tag mb10">'+squareLabel+'</p>';
        }else{
            shortArticleHtml+='<p class="text-style fs28 fc-black face_tag mb10 hint-more">'+squareLabel+'</p>';
        }
	}

	//如果有图片放一张图片
	if(homePic!=null && homePic!="" && onePicUrl != null && onePicUrl != ""){
		//使用原图
		shortArticleHtml+='<div class="pic-layout message-pic-1-style mb5">'+
						'<i><img src="'+onePicUrl+'" /></i>'+//cell.homePic.split(",")[0].replace("_min","")
					'</div>';
	}
	shortArticleHtml+='</div>';
	return shortArticleHtml;
}

//创建文章 type=1的
function CreateArticle(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname,inPage){
	var articleHtml='<div id="contentDiv'+id+'" class="module-content mt10" onclick="gotoArticDetailHtml('+id+', this);">';
	if(title!=null && title!=""){
		articleHtml+='<h4 class="f-l-height fs30 find-text fwb mb5">'+title+'</h4>';
	}
	
	var squareLabel='<a class="fc-blue" href="topic.html#1">#文章#</a>';//topic.html#1

	if(pubLocateType==1){//楼盘
		if(inPage == 'loupan'){//如果是楼盘主页就不需要显示楼盘标签
			squareLabel='';
		}else{
		squareLabel='<a class="fc-blue" href="loupan_page.html?id='+pubLocateId+'">#'+pubLocateNickname+'#</a>';
	}
	}
	squareLabel=squareLabel+content;
	if(squareLabel!=""){
    	if(StringFormatConversion('#'+(pubLocateNickname?pubLocateNickname:'文章')+'#',content,2)){
		articleHtml+='<p class="text-style fs28 fc-black face_tag mb10">'+squareLabel+'</p>';
		}else{
            articleHtml+='<p class="text-style fs28 fc-black face_tag mb10 hint-more">'+squareLabel+'</p>';
        }
	}
	
	//如果有图片放一张图片
	if(homePic!=null && homePic!="" && onePicUrl != null && onePicUrl != ""){
		//使用原图
		articleHtml+='<div class="pic-layout message-pic-1-style mb5">'+
						'<i><img src="'+onePicUrl+'" /></i>'+//cell.homePic.split(",")[0].replace("_min","")
					'</div>';
	}
	articleHtml+='</div>';
	return articleHtml;
}

//创建图片消息
function CreatePics(id,title,content,homePic,onePicUrl,pubLocateId,pubLocateType,pubLocateNickname,inPage){
	var arrayPics=new Array();
	if(homePic!=null){
		arrayPics=homePic.split(",");
	}
	var picHtml='<div id="contentDiv'+id+'" class="module-content mt10" onclick="gotoSquareDetailHtml('+id+', this)">';
	if(title!=null && title!=""){
		picHtml+='<h4 class="f-l-height fs30 find-text fwb mb5">'+title+'</h4>';
	}
	
	var squareLabel='';//'<a class="fc-blue" href="javascript:void(0);">#文章#</a>';//topic.html#1
	if(pubLocateType==1){//楼盘
		if(inPage == 'loupan'){//如果是楼盘主页就不需要显示楼盘标签
			squareLabel='';
		}else{
		squareLabel='<a class="fc-blue" href="loupan_page.html?id='+pubLocateId+'">#'+pubLocateNickname+'#</a>';
	}
	}

	if(content!=null && content!=undefined){
		squareLabel=squareLabel+content;
	}
	
	if(squareLabel!="" && squareLabel!=undefined && squareLabel!="undefined"){
		if(StringFormatConversion('#'+(pubLocateNickname?pubLocateNickname:'')+'#',content,2)){
		picHtml+='<p class="text-style fs28 fc-black face_tag mb10">'+squareLabel+'</p>';
		}else{
            picHtml+='<p class="text-style fs28 fc-black face_tag mb10 hint-more">'+squareLabel+'</p>';
		}
	}

	var imageCount=arrayPics.length;
	if (imageCount == 1) {
		//使用原图
		//arrayPics[0]=arrayPics[0].replace("_min","");
		if(onePicUrl != null && onePicUrl != ""){
			arrayPics[0]=onePicUrl;
		}
	   	picHtml+='<div class="pic-layout message-pic-1-style message-gallery-mark" id="pictext_pic_'+id+'">';
	} else if (imageCount == 2 || imageCount == 4) {
		picHtml+='<div class="pic-layout message-pic-2-style message-gallery-mark" id="pictext_pic_'+id+'">';
	} else {
		picHtml+='<div class="pic-layout message-pic-3-style message-gallery-mark" id="pictext_pic_'+id+'">';
	}
	
	for (var i = 0; i < imageCount; i++) {
		picHtml += '<i id="'+i+'"><img src="' + arrayPics[i] + '" /></i>';
	}
	picHtml +='</div></div>';
	return picHtml;
}

//创建视频内容
function CreateVideo(id,poster,videoId,mediaLen){
	var videoHtml=	'<div id="contentDiv'+id+'" class="video-layout mb5">'+
					  '<i><img src="'+poster+'" /></i>'+
					  '<span onclick="playVideo('+id+',event)"><img src="../images/playvideobtn.png" /></span>'+
					  '<em class="fs24 fc-white">'+mediaLen+'</em>'+
					'</div>';
	
	return videoHtml;
}

//创建话题内容
function CreateTopic(id,title,summary,homePic){
	var topicLabel='<a class="fc-blue" href="topic.html#0">#话题#</a>';
	var imgsrc="";
	if(homePic!=null && homePic!=""){
		imgsrc='<img src="'+homePic.split(",")[0]+'">';
	}
	
	var topicHtml='<div id="contentDiv'+id+'" class="ti_content" onclick="gotoTopicDetailHtml('+id+');">'+
					    '<i class="topicbanner">'+imgsrc+'</i>'+
					    '<h1 class="fs32 fc-black">'+title+'</h1>'+
					    '<h2 class="fs26 fc-grey666">'+topicLabel+summary+'</h2>'+
					'</div>';
	return topicHtml;
}

//创建问答链接内容  type表示来源 1-非圈子，2是圈子
function CreateQanda(id,content,answerType,aStatus,listenDispalyStatus,pics,qfee,answerLen,type,index){
	var picsStr="";
	var voiceOrPictext="";
	var payOrFreeOrTime="";
	var tips="";
	var waveOrBook="";
	var playOrReadAnswer="";
	var answerPopo="";
	var questionContent="";
	
	//问答跳转链接
	var openDetailUrl = type==2?'onclick="gotoCircleQADetailHtml('+id+')"':'onclick="gotoQADetailHtml('+id+')"';

	//判断该问题有没有图片
	if (pics!=null&&pics.length>0) {
        picsStr = '<i class="appui-qanda-question-imgtag"><img src="../images/img-tag.png" /></i>';
    };	
	/** 收听状态，用户客户端判断  listenDispalyStatus  0-付费，1-免费，2-限次免费  answerType 1 语音 2文字*/
	if(answerType==1){//语音回答
		voiceOrPictext = 'voice';
		if (listenDispalyStatus==0) {//付费
			tips = qfee+"元收听";
			payOrFreeOrTime = "pay";
		}else if (listenDispalyStatus==1){//免费
			tips = "免费收听";
			payOrFreeOrTime = "free";
		}else if (listenDispalyStatus==2){//限次免费
			tips = "限次收听";
			payOrFreeOrTime = "time";
		}
		waveOrBook = '<span class="appui_qanda-voice-wave"><em class="wave1"></em><em class="wave2"></em><em class="wave3"></em></span>';
	}else{//文字回答
		voiceOrPictext = 'pictext';
		if (listenDispalyStatus==0) {//付费
			tips = qfee+"元阅读";
			payOrFreeOrTime = "pay";
		}else if (listenDispalyStatus==1){//免费
			tips = "免费阅读";
			payOrFreeOrTime = "free";
		}else if (listenDispalyStatus==2){//限次免费
			tips = "限次阅读";
			payOrFreeOrTime = "time";
		}
		waveOrBook = '<span class="appui-qanda-answerstyle-wave"></span>';
	}
	
	
	//播放语音或跳转详情查看文字回答
	playOrReadAnswer = 'onclick="playAudioQaClickFunction('+id+',1,1,\'a_play_'+index+'_'+id+'\');"';
	
	//已回答才有答案
	if(aStatus == 1){
		answerPopo ='<div class="appui-qanda-answer">'+
						'<div class="appui-qanda-answerstyle '+voiceOrPictext+' '+payOrFreeOrTime+'" id="a_play_'+index+'_'+id+'" '+playOrReadAnswer+'>'+
							'<i></i>'+
							waveOrBook+
							'<em class="tips">'+tips+'</em>'+
							'<span class="appui_qanda-voice-wait" style="display:none;"></span>'+
						'</div>'+
						'<em class="appui-qanda-answer-time">'+answerLen+'</em>'+
					'</div>';
	}
	//为标题判断字数是否现实“全文”
	if(StringFormatQanda(content,3)){
        questionContent = '<div class="appui-qanda-question">'+ picsStr+ content+ '</div>';
    }else{
        questionContent = '<div class="appui-qanda-question hint-more">'+ picsStr+ content+ '</div>';
    }
			
	var qandaStr =	'<div class="module-content mt10" id="contentDiv'+id+'" '+openDetailUrl+'>'+
						questionContent+
						answerPopo+
					'</div>';
	return qandaStr;
}

//进入广场详情页面
function gotoSquareDetailHtml(id,obj,e){
	if(typeof obj != 'undefined'){
        setElementClickStyle($(obj).parents(".f-f-module")[0]);
	}else{
        var element = e ? e.target:event.target;
        setElementClickStyle($(element).parents(".f-f-module")[0]);
    }
    window.location.href = "square_detail.html?id="+id;
}

//进入文章详情页面
function gotoArticDetailHtml(id, from, publishtype){

    window.location.href = "/articles/article_detail.html?id="+id+"&from="+from+"&publishtype="+publishtype;
}

//进入话题详情页面
function gotoTopicDetailHtml(id){
	if(window.location.href.indexOf("square")>=0){
		window.location.href = 'topicqanda.html?id='+id+'&from=square';
	}else{
		window.location.href = 'topicqanda.html?id='+id+'&from=index';
	}
    
}

//进入问答详情页面
function gotoQADetailHtml(id, e){
    var element = $((e ? e.target:event.target)).parents(".f-f-module")[0];
    if(typeof element == 'undefined'){
        setElementClickStyle(e ? e.target:event.target);
    }else{
        setElementClickStyle(element);
    }
		window.location.href = "qanda_detail.html?id="+id;
}

//进入圈子问答详情页面
function gotoCircleQADetailHtml(id, e){
    var element = $((e ? e.target:event.target)).parents(".f-f-module")[0];
    if(typeof element == 'undefined'){
        setElementClickStyle(e ? e.target:event.target);
    }else{
        setElementClickStyle(element);
    }
		window.location.href = "circle_qanda_detail.html?id="+id;
}

function openRedPacket(id,e,listId){
    var element = e ? e.target:event.target;
    setElementClickStyle(element);
    e ? e.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
    splitRedPacketFunction(id, listId);
}

function splitRedPacketFunction(id, listId){
	var userTest = getSessionUserNoRedirectEx();
if(userTest == null){
userTest = getSessionUser();
}
    // dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: splitRedPacket,
        dataType: "json",
        async: true,
        // data:{"tot":"红包总金额（分）","packets":"红包总数量","type":"1-粉丝红包，2-新手红包","splitType":"1-拼手气红包，2-普通红包"},
        data:{"id":id},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {  
                // window.location.href = "square.html";
                // .data.status
                window.location.href = "red_packets_open.html?id="+id+"&status="+result.data.status+"&from=square&listId="+listId;
            }else{
                dataLoadedError(result.message);
            }
        }
    });
}

//播放语音
function playVideo(id,e){
    e ? e.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
    $.ajax({
        type: "post",
        url: playMessageVideo,
        dataType: "json",
        async: true,
        data: {
            "id": id,
        },
        success: function(result) {
            if (result.result == "success") {
    			$('#js-gallery-swiper').fadeOut(1000);
				$('.video_dialog').show();
				$('#myVideo').show();
				$('#myVideo>source').attr("src",result.data.voice.srcUrls);
				// $('#video').attr('src', 'http://ac-8wCC2.clouddn.com/6aa6790c7a.mp4');

				$(".appui-mask").click(function(){
					$("#myVideo").get(0).pause();
					$(".video_dialog").hide();
				});
			}
        }
    });
}

//预览图片
function configListDownUI (cell) {
 // //判断是否含有图片；
    if (cell.homePic!=null&&cell.homePic.length>0) {
    	var imgArr = cell.homePic.split(",");
        var resImgArr1 = new Array();
        for (var j = 0; j < imgArr.length; j++) {
            resImgArr1[j] = imgArr[j].replace("_min","");
        };
        
        $.each($('#pictext_pic_'+cell.id+' i'),function(index, val) {
//        	var arrayImg=$('#pictext_pic_'+cell.id+' img');
//        	var resImgArr1=new Array();
//        	for (var j = 0; j < arrayImg.length; j++) {
//              resImgArr1[j] = arrayImg[j].getAttribute("src");
//        	}
            
        	$(this).on('click', function(e) {
                show_img(resImgArr1,index,e);
            });
        });
    } 
}

//图片轮播
function show_img(imgArr,index,e){
    e ? e.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
    imageClickFunction(imgArr,index);
}

//以下以后需要做成通用 点赞 评论
//点赞点踩界面
var ddClick = false;
function dianzanClick(id,type, mid){
		if(mid == undefined){
            dataLoading("请先登录");
            window.location.href="/members/login.html";
        return false;
		}
 		if (ddClick==false) {
     		ddClick=true;
	   		if ($('#dianzan'+id).hasClass("on")) {
				zanOrCaiRequest(0, 1,id);
	    	}else{
				zanOrCaiRequest(1, 1,id);
			}
		}
}
//data:{"articleId":1,"type":"0-取消操作，1-执行操作","status":"0-踩，1-点赞","userId":"userId"}
function zanOrCaiRequest(type, status, id) {
  //currAttitude：0-当前是踩，1-赞，2-无表示
    var csrf = $('input[name="csrf"]').val();
 $.ajax({
     type: "post",
     url: '/dianzan/dianzan.html',
     dataType: "json",
     async: true,
     data: {
         "article_id": id,
         "type": type,
         "_csrf": csrf,
     },
     success: function(result) {
         ddClick = false;
         if (result.result == "success") {
             //"data":{"currStatus":"当前态度：0-踩，1-点赞，2-无表情","totLikes":"总点赞人数","totOppose":"总点踩人数"}
             var zanCount = $('#dianzan'+id).html();
             if (result.data.currStatus==1) {
                 $('#dianzan'+id).addClass('on fc-red');
                 dataLoadedSuccess("点赞成功");
                 $('#dianzan'+id).text(parseInt(zanCount)+1);
             }else if (result.data.currStatus==0) {
                 dataLoadedSuccess("点踩成功");
                 $('#dianzan'+id).text(parseInt(zanCount)-1);
                 $('#dianzan'+id).removeClass('on fc-red');
             }
            }
        }
 });


}


/**
 * 字符串转换添加省略号
 * @param str1 文字前的标题
 * @param str2 文字
 * @param row  设置行数
 * @returns {*}
 * @constructor
 */
function StringFormatConversion(str1,str2,row){
	var backups = str2.replace(/<a([^<]+)>/g, '').replace(/<\/a>/g, '');
	// 部分携带标签的字符处理
	var str = str1+backups;
    // 判断屏幕宽度限制字数
	var limitLength;
	var winWdith = document.body.clientWidth;
	if(winWdith >= 395){
        limitLength = 51*row;
	}else if(winWdith >= 380){
        limitLength = 49*row;
	}else if(winWdith >= 365){
        limitLength = 47*row;
	}else if(winWdith >= 350){
        limitLength = 45*row;
    }else if(winWdith >= 335){
        limitLength = 43*row;
    }else{
        limitLength = 41*row;
    }
    var realLength = 5, charCode = -1, strLength = 0;
    var startIndex = str1.length;

    if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= limitLength - realLength) {
        return true;
    }else{
    	return false;
	}
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
