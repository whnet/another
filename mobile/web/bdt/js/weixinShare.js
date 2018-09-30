//搜索分享
function wxSearchShare(userTest){
    var wxShareTitle = "你的好友邀请你一起来尬聊dream house";
    var wxShareSummary = "你的好友邀请你一起来尬聊dream house";
    if(userTest!=null){
        wxShareTitle = "你的好友"+userTest.nickname+"邀请你一起来尬聊dream house";
        wxShareSummary = "你的好友"+userTest.nickname+"邀请你一起来尬聊dream house";
    }
    var realUrl = hostConf+"/index.html";
    var img = defaultWeixinSharePicUrl;
    var wxFriendShareStr = "律乎，一秒直律乎产专家，干货满满，远离硬广和软文！";
    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",img,img,realUrl);
}
//关于我的分享 
function wxUserCenterShare(nickname){
    var wxShareTitle = "你的好友"+nickname+"邀请你一起来尬聊dream house";
    var wxShareSummary = "你的好友"+nickname+"邀请你一起来尬聊dream house";
    var wxFriendShareStr = "房产大咖聚众密谋大事，此处墙角可偷听！";
    var img = defaultWeixinSharePicUrl;
    var realUrl = hostConf+"/index.html";
    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",img,img,realUrl);
}
function wxShare(wxShareTitle,wxShareSummary,wxFriendShareStr,targetUrl,wxSharePicUrl,wxShareFriendsCirclePicUrl){
    
    var targetUrlHash = window.location.hash;
    if (typeof(wxSharePicUrl) != "undefined") {
    if (wxSharePicUrl!=""&&wxSharePicUrl.indexOf(hostConf)==-1) {
      wxSharePicUrl = hostConf+wxSharePicUrl;
    }
    }
    
    if (typeof(wxShareFriendsCirclePicUrl) != "undefined") {
    if (wxShareFriendsCirclePicUrl!=""&&wxShareFriendsCirclePicUrl.indexOf(hostConf)==-1) {
      wxShareFriendsCirclePicUrl = hostConf+wxShareFriendsCirclePicUrl;
    }
    }
	
    var targetUrlPathname = window.location.pathname;
    // var wxSharePicUrl = hostConf + "images/wenfang.jpg";
    /*if(wxShareTitle=="" && user != null){
      wxShareTitle="您的好友"+user.nickname+"邀您讨论房的事";
    }else if(wxShareTitle==""||typeof(wxShareTitle) == "undefined"){
        wxShareTitle="您的好友邀您讨论房的事";
    }*/
    if (targetUrlPathname=="/index.html" ||targetUrlPathname=="/") {
      wxShareFromUrl(wxShareTitle,"你的好友邀请你讨论房的事","【律乎】专业的房产知识分享平台","","","");
    }else if (targetUrlPathname=="/found_expert.html"){
      wxShareFromUrl(wxShareTitle,"数百位房产高手想把毕生绝学传授给你，快来收听。","数百位房产高手想把毕生绝学传授给你，快来收听。","",wxSharePicUrl);
    }else if (targetUrlPathname=="/invitation.html"){
     wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,targetUrl,wxSharePicUrl,wxShareFriendsCirclePicUrl,targetUrl);
    }else if (targetUrlPathname=="/qanda_detail.html"){
      wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,"",wxSharePicUrl,wxShareFriendsCirclePicUrl);
    }else if (targetUrlPathname=="/user_page.html"){
      wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,"",wxSharePicUrl);
    }else if (targetUrlPathname=="/qanda.html"){
      wxShareFromUrl(wxShareTitle,"头条，精选每日热点，听房产行家亲口说房的事","头条，精选每日热点，听房产行家亲口说房的事。","",wxSharePicUrl);
    }else if (targetUrlPathname=="/myrelations.html"){
      //1关注 2粉丝
      if (targetUrlHash=="#2") {
          wxShareFromUrl(wxShareTitle,"竟然有这么多人在【律乎】上关注我，你想成为我的粉丝吗？","竟然有这么多人在【律乎】上关注我，你想成为我的粉丝吗？","",wxSharePicUrl);
      }else if (targetUrlHash=="#1") {
          wxShareFromUrl(wxShareTitle,"我在【律乎】上关注了这些大咖，邀请你来围观。","我在【律乎】上关注了这些大咖，邀请你来围观。","",wxSharePicUrl);
      }
    }else if (targetUrlPathname=="/topic.html"||targetUrlPathname=="/article.html"){
      wxShareFromUrl(wxShareTitle,"【律乎】头条，精选每日热点，听房产行家亲口说房的事。","【律乎】头条，精选每日热点，听房产行家亲口说房的事。","",wxSharePicUrl);
    }else if (targetUrlPathname=="/article_detail.html"){
      wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,"","");
    }else if (targetUrlPathname=="/myqrcode.html"){
      wxShareFromUrl(wxShareTitle,"我在【律乎】上发布了新的资料，这是你熟悉的我吗？","我在【律乎】上发布了新的资料，这是你熟悉的我吗？","",wxSharePicUrl);
    }else if (targetUrlPathname=="/qanda_questions.html"){
      wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,"",wxSharePicUrl,wxShareFriendsCirclePicUrl);
    }else if (targetUrlPathname=="/user_center.html"){
      wxShareFromUrl(wxShareTitle,"专业的房产知识分享平台","专业的房产知识分享平台","/index.html","","");
    }else if (targetUrlPathname=="/qanda_record.html"){
      wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,"",wxSharePicUrl,wxShareFriendsCirclePicUrl);
    }else if (targetUrlPathname=="/topicqanda.html") {
      wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,targetUrl,wxSharePicUrl,wxShareFriendsCirclePicUrl);
    }
    else{
      wxShareFromUrl("","","","","","");
    }

}

function wxShareFromUrl(wxShareTitle,wxShareSummary,wxFriendShareStr,targetUrl,wxSharePicUrl,wxShareFriendsCirclePicUrl){
	wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,targetUrl,wxSharePicUrl,wxShareFriendsCirclePicUrl,"");
}

 //app分享问题
 var appShareData = "";
/*
如果需要传真正回调URL，就需要调用这个接口，真正回调页面参数为realTargeUrl
*/
function wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,targetUrl,wxSharePicUrl,wxShareFriendsCirclePicUrl,realTargeUrl){
  if (typeof(wxSharePicUrl) != "undefined" && wxSharePicUrl!="" && wxSharePicUrl.indexOf(hostConf)<0) {
      wxSharePicUrl = hostConf+wxSharePicUrl;
  }
    
  if (typeof(wxShareFriendsCirclePicUrl) != "undefined" && wxShareFriendsCirclePicUrl!="" && wxShareFriendsCirclePicUrl.indexOf(hostConf)<0) {
      wxShareFriendsCirclePicUrl = hostConf+wxShareFriendsCirclePicUrl;
  }

  if((wxShareTitle==""||typeof(wxShareTitle) == "undefined") ){
		var user = getSessionUserNoRedirectEx();//lhj mod
      wxShareTitle="您的好友邀您讨论房的事";
		if(user!=null){
           wxShareTitle="您的好友"+user.nickname+"邀您讨论房的事";
		}
  }

    if(wxShareSummary==""||typeof(wxShareSummary) == "undefined"){
    wxShareSummary="行家一对一为您专业解答购房难题";
  }

  if(wxFriendShareStr==""||typeof(wxFriendShareStr) == "undefined"){
    wxFriendShareStr="我在律乎邀您参与讨论，行家一对一为您专业解答购房难题";
  }
    if(realTargeUrl==""||typeof(realTargeUrl) == "undefined"){
  if (targetUrl==""||typeof(targetUrl) == "undefined") {
        targetUrl = window.location.href;
  }else{
      targetUrl = hostConf+"/index.html";
  }
	}
	else{
		targetUrl = realTargeUrl;
	}

  wxShareUrl = window.location.href;
    if(wxSharePicUrl==""||typeof(wxSharePicUrl) == "undefined"){
      wxSharePicUrl = defaultWeixinSharePicUrl;
  }
    if (wxShareFriendsCirclePicUrl==""||typeof(wxShareFriendsCirclePicUrl) == "undefined") {
        wxShareFriendsCirclePicUrl = wxSharePicUrl;
    };

    // if(wxSharePicUrl=="" && user != null){
    //   wxSharePicUrl = hostConf+insertImgType(user.headPic,3);
    // }else if(wxSharePicUrl==""){
    //     wxSharePicUrl = defaultWeixinSharePicUrl;
    // }
    //判断是否带有srId

    if(targetUrl.indexOf("srId")<=-1){

      if(user!=null){
          targetUrl = targetUrl + "&srId="+user.id;
      }

    }
    //app分享问题
    appType = readClientSession("appType");
    if (appType==isApp) {
        appShareData = {"wxShareTitle":wxShareTitle,"wxShareSummary":wxShareSummary,"wxFriendShareStr":wxFriendShareStr,"targetUrl":targetUrl,"wxSharePicUrl":wxSharePicUrl,"wxShareFriendsCirclePicUrl":wxShareFriendsCirclePicUrl}
    };
 $.ajax({
      type:"post",
      url:getWxShareDataUrl,
      dataType:"json",
      async: true,
      data:{"url":wxShareUrl},
      success:function(result){
        if(result.result=="success"){
          wx.config({
              debug: false,
              appId: result.data.appId,
              timestamp: result.data.timestamp,
              nonceStr: result.data.nonceStr,
              signature: result.data.signature,
              jsApiList: [ 
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'startRecord',
                'translateVoice', 
                'stopRecord', 
                'onVoiceRecordEnd', 
                'playVoice', 
                'onVoicePlayEnd', 
                'pauseVoice', 
                'stopVoice', 
                'uploadVoice', 
                'downloadVoice'
              ]
            });

            wx.ready(function () {
              // 在这里调用 API
              wx.checkJsApi({
                      jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                      success: function(res) {
                      }
                  });
                  wx.onMenuShareTimeline({
                        title: wxShareSummary, // 分享描述
                        link: targetUrl, // 分享链接
                        imgUrl: wxShareFriendsCirclePicUrl, // 分享图标
                        success: function () { 
                            var targetUrlPathname = window.location.pathname;
                            if (targetUrlPathname=="/hermon.html") {
                                createStatWithParamlog(window.location.href,"/hermon.html","1",window.location.search);
                            }else{
                            createStatWithParamlog(window.location.href,"/wxTimelineResult.html","0",window.location.search);
                            }
                            if (targetUrlPathname=="/wd51.html") {
                              window.location.href = "index.html";
                            };
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                              createStatWithParamlog(window.location.href,"/wxTimelineResult.html","1",window.location.search);
                        },
                        fail: function () { 
                            // 用户取消分享后执行的回调函数
                              createStatWithParamlog(window.location.href,"/wxTimelineResult.html","2",window.location.search);
                        }
                    });
              //分享到朋友圈
              /**
                  wx.onMenuShareTimeline({
                      title: wxFriendShareStr, // 分享描述
                      link: targetUrl, // 分享链接
                        imgUrl: wxShareFriendsCirclePicUrl, // 分享图标
                      success: function () { 
                      },
                      cancel: function () { 
                          // 用户取消分享后执行的回调函数
                      }
                  });*/
                  //分享给朋友
                  wx.onMenuShareAppMessage({
                      title: wxShareTitle, // 分享标题
                      desc: wxFriendShareStr, // 分享描述wxShareTitle
                      link: targetUrl, // 分享链接
                      imgUrl: wxSharePicUrl, // 分享图标
                      type: '', // 分享类型,music、video或link，不填默认为link
                      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                      success: function () { 
                            var targetUrlPathname = window.location.pathname;
                                if (targetUrlPathname=="/hermon.html") {
                                    createStatWithParamlog(window.location.href,"/hermon.html","2",window.location.search);
                                }else{
                            createStatWithParamlog(window.location.href,"/wxFriendResult.html","0",window.location.search);
                                }
                                if (targetUrlPathname=="/wd51.html") {
                                  window.location.href = "index.html";
                                }
                      },
                      cancel: function () { 
                          // 用户取消分享后执行的回调函数
                            createStatWithParamlog(window.location.href,"/wxFriendResult.html","1",window.location.search);
                        },
                        fail: function () { 
                            // 用户取消分享后执行的回调函数
                            createStatWithParamlog(window.location.href,"/wxFriendResult.html","2",window.location.search);
                      }
                  });     

                    //隐藏接口
                    // wx.hideOptionMenu(); 
            });
        }else{

        }
      }
  });
}
//app分享问题
function shareMethods(){
    appShareFunction();
}

function appShareFunction(){
    cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "MyPlugin", "share", [appShareData.wxShareTitle,appShareData.wxShareSummary,appShareData.wxFriendShareStr,appShareData.wxSharePicUrl,appShareData.wxShareFriendsCirclePicUrl,appShareData.targetUrl]);
}