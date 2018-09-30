// commonExpert.js
function commonExpertListFunction (groups,length,publishLocationId,publishLocationType) {
	var expertStr ="";
	var listLength = groups.length;
	if( length == 1 ){
		listLength = 1;
	}
    for (var i = 0; i < listLength; i++) {
        var levelStr = userLevelStr(groups[i].masterLvl,groups[i].loupanId);
		
		//行家抬头
		var expertTitleStr='';
		if( !isUndefined(groups[i].title) && groups[i].title!=null && groups[i].title!=""){
			expertTitleStr='<p class="appui-expert-title fs28">'+groups[i].title+'</p>';
		}
		
		//行家简介
		var expertMasterInfo='';
		if( !isUndefined(groups[i].masterInfo) && groups[i].masterInfo!=null && groups[i].masterInfo!=""){
			expertMasterInfo = '<p class="appui-expert-introduce fs26 fc-black mt10">'+groups[i].masterInfo+'</p>';
		}else{
			if (groups[i].masterLvl>1) {
				expertMasterInfo = '<p class="appui-expert-introduce fs26 fc-black mt10">该行家已经过“律乎”官方认证，欢迎来向Ta提问。</p>'
			}else{
				// 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
				if (groups[i].sex==0) {
					expertMasterInfo = '<p class="appui-expert-introduce fs26 fc-black mt10">未选择性别：这个人太忙了，什么都没留下。</p>'
				}else if (groups[i].sex==1) {
					expertMasterInfo = '<p class="appui-expert-introduce fs26 fc-black mt10">这个人太帅了，什么都没留下。</p>'
				}else if (groups[i].sex==2) {
					expertMasterInfo = '<p class="appui-expert-introduce fs26 fc-black mt10">这个人太美了，什么都没留下。</p>'
				}
			}
        }
		
		//行家擅长==标签
		expertGoodAtTags = '';
		if( (groups[i].lable != null && groups[i].lable != "") || (groups[i].locationLable != null && groups[i].locationLable != "") ){
			//行业标签
			var industryTagArray = groups[i].lable.split(",");
			var industryTagStr='';
			if ( industryTagArray.length != 0) {
				for (var a = 0; a < industryTagArray.length; a++) {
					if(industryTagArray[a]!=null && industryTagArray[a]!=""){
						industryTagStr += '<span class="mr5">'+industryTagArray[a]+'</span>';
					}
				}
			}
			//地区标签
			var addressTagArray = groups[i].locationLable.split(",");
			var addressTagStr='';
			if ( addressTagArray.length != 0 ) {
				for (var b = 0; b < addressTagArray.length; b++) {
					if(addressTagArray[b]!=null && addressTagArray[b]!=""){
						addressTagStr += '<span class="mr5">'+addressTagArray[b]+'</span>';
					}
				}
			}
			//将行业标签和地区标签拼接在一起
			if(industryTagStr != "" || addressTagStr != "" ){
				expertGoodAtTags = '<div class="appui-expert-tags fs24 mt10 fc-grey666">擅长：'+industryTagStr+addressTagStr+'</div>';
			}
		}
		
		//跳转链接=======默认行家列表-点击列表都是进行家主页
		var allUrlToUserpage = 'onclick="gotoUserPageHtml('+groups[i].id+')"';
		var headpicToUserpage = '';
		var allToAsk = '';
		if(publishLocationType==1){//楼盘中的行家列表-只有点击头像才是进入行家主页，点击其他位置都是提问
			allUrlToUserpage = '';
			headpicToUserpage = 'onclick="gotoUserPageHtml('+groups[i].id+')"';
			allToAsk = 'onclick="gotoQuestionsHtml1('+groups[i].id+',event,'+publishLocationId+','+publishLocationType+')"';
		}
		
		//行家数据统计
		var expertHelp = parseInt(groups[i].totAnswers);//帮助
		var expertPublish = parseInt(groups[i].totArticles);//发表观点
		var expertHot = parseInt(groups[i].hotScore);//本周热度
		
		expertStr+=	'<div class="appui-expert bg-white" '+allUrlToUserpage+'>'+
						'<div class="appui-expert-baseinfo">'+
							'<div class="appui-expert-headpic-level" '+headpicToUserpage+'>'+
								'<img class="appui-expert-headpic" src="'+insertImgType(groups[i].headPic,3)+'" />'+
								//'<img class="appui-expert-level" src="../themes/img/vip2.png">'+
								levelStr+
							'</div>'+
							'<div class="appui-expert-info" '+allToAsk+'>'+
								'<div class="appui-expert-name-title fs30 fc-black">'+
									'<p class="appui-expert-name fwb">'+groups[i].nickname+'</p>'+
									expertTitleStr+
								'</div>'+
								expertMasterInfo+
								expertGoodAtTags+
							'</div>'+
						'</div>'+
						'<div class="appui-expert-statistic fs26 fc-black mt15">'+
							'<span>已帮助'+expertHelp+'人</span>'+
							'<span>已发表'+expertPublish+'观点</span>'+
							'<span>本周热度'+expertHot+'</span>'+
						'</div>'+
					'</div>';
    }
    return expertStr;
}

function gotoUserPageHtml(userID,e,publishLocationId){
	window.location.href = "/expert/user_page.html?id="+userID;
}
