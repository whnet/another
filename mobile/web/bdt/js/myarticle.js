// myarticle.js
var nicknameStr ="";
var userID = "";
var hotActicleStr = "";
var userTest = "";
var datetime = new Date();
var currentPage= 1;
var totalPage = 1;

var flag = 0;
var page = 1;
var backBool = 0;
var isAnswerQuestionBool = false;
var isUnanswerQuestionBool = false;
$(document).ready(function() {
	
	/** by wangzhen 20170513 调整back程序
  $("#back").click(function() {
        if (isNormalBackBool==1) {
      backBool = 1;
      //document.referrer是获取上一页的url
      var url = document.referrer;
      if (url!=null&&url.length!=0) {
        window.location.href = "user_center.html";
      }else{
         window.location.href = "index.html";
      }
        }else{
            historyUtils.back();  
        }
  });
  */
  page = readClientSession('homepage-page');
  pageScroll();
  requestgetMyContentList();
});
function pageScroll(){
    $('#homepage').scroll(function(){
        if (flag==0) {
            var a = "";
            if ($('#downloadMoreData').length>0) {
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height())) {
                    // alert("div在可视范围");
                    flag = -1;
                    downloadMoreData();
                } 
            };
        };
    });
}

function requestgetMyContentList() {
  // userTest = getSessionUser();
  // //     //data:{"page":"获取页","contentType":"1-文章，2-问答","subType":"0-全部，1-我问，20-我答（包含21+22）,21-我已答，22-未答,3-听"}
  // wxUserCenterShare(userTest.nickname);
  //  dataLoading("数据加载中...");
  //   $.ajax({
  //       type: "post",
  //       url: getMyContentList,
  //       dataType: "json",
  //       async: true,
  //       data:{"page":currentPage,"contentType":1,"subType":0},
  //       success: function(result) {
  //           clearToastDialog();
  //           if (result.result == "success") {
  //               currentPage = result.data.page.currentPage;
  //               totalPage = result.data.page.pages;
  //            	configUI(result.data.list);
  //           }else {
  //                dataLoadError(result.message);
  //           }
  //       }
  //   });
}

function configUI(groups){
  var doStr = "";
  var datetimeStr = "";
  var autoLoad = flag;
   for (var i = 0; i < groups.length; i++) {
      var picArray= "";
      var linkString="";
      var imageStr = "";
      var ideaStr = "";
      datetime.setTime(groups[i].lastReplyTime);
      var monthAndDayArray = getDateStringDate(datetime).split("-");
      //type '文章类型：0-短文，1-短图文，2-长图文,4-评论，5-点赞或踩',
      //isForward '文章类型：0-非转发，1-转发
      var type = groups[i].type;
      var isForward = groups[i].isForward;
		
      if (groups[i].homePic.length>0) {
           picArray = groups[i].homePic.split(",");
      };

		  var titleStr = getTextFromHtml(groups[i].title);
      var ideaStr = getTextFromHtml(groups[i].listShowText);

      if (type==0) {
        imageStr = picTypeFunction(picArray);
      }else if (type==1||type==2) {
           linkString = isLinkFunction(picArray, titleStr ,groups[i].id);
         // linkString = isLinkFunction(picArray, groups[i].rootArticle.title,groups[i].rootArticle.id);
      };
		
		
      //isForward 0 不是转发,1转发的
      if (isForward==1) {
          ideaStr = "";
          ideaStr = isCommentList(groups,i);
          if (groups[i].rootArticle.homePic.length>0) {
              picArray = groups[i].rootArticle.homePic.split(",");
          };
          linkString = isLinkFunction(picArray, groups[i].rootArticle.title, groups[i].rootArticle.id);
      };
	
      //如果是同一天发布的文章
       doStr +=  '<a class="my-article-content mb10" onclick="gotoMessageOrAriticle('+groups[i].id+','+type+')">';
       //如果是短文,
           if (type==0&&isForward==0) {
              if (picArray.length<=0) {
            	  if(ideaStr==""){
            		  if(groups[i].voice!=null){
            			  ideaStr="<i><img src='images/message_voice.jpg' style='height:2rem;width:2rem;'/>我发的语音</i>";
            		  }else if(groups[i].video!=null){
            			  ideaStr="<i><img src='images/message_video.jpg' style='height:2rem;width:2rem;'/>我发的视频</i>";
            		  }else if(groups[i].redPacketShow!=null){
            			  ideaStr="<i><img src='images/message_packet.jpg' style='height:2rem;width:2rem;'/>我发的红包</i>";
            		  }else{
            			  ideaStr="<img src='images/message_pic.jpg' style='height:2rem;width:2rem;'/>我发的图片";
            		  }
            	  }
                doStr += '<div class="my-article-alltext bg-greyfa" id="textId'+groups[i].id+'">'+
                        '<p class="fs30 fc-black face_tag">'+ideaStr+'</p>'+
                    '</div>';
              }else{
                doStr += '<div class="my-article-textandpic fs30" id="textId'+groups[i].id+'">'+imageStr+
                    '<p class="text-layout fc-black456 face_tag">'+ideaStr+'</p>'+
                    '<span class="pic-num fc-greyabc fs24">'+picArray.length+'张图片</span>'+
                '</div>';
              }
            }
           //如果是长文;或者转发
            else if (type==1||type==2||isForward==1) {
                doStr += '<div class="my-article-alltext bg-greyfa" id="textId'+groups[i].id+'">'+
                        '<p class="fs30 fc-black face_tag">'+ideaStr+'</p>'+
                    '</div>';
            }
        doStr += linkString+
                '</a>'+
					'<div class="clear">'+'</div>';
					
      if ($('#datetimeId'+getDateStringDate(datetime)+'').length > 0){
          $('#datetimeId'+getDateStringDate(datetime)+'').append(doStr);
      }else{
          datetimeStr = '<div class="my-article-item mb20" id="datetimeId'+getDateStringDate(datetime)+'">'+
								'<span class="fs50">'+
									monthAndDayArray[2]+
									'<i class="fs28">'+monthAndDayArray[1]+'月</i>'+
								'</span>'+
								doStr+
                        '</div>';
          $('#acticlePage').append(datetimeStr);
      }
      //if (ideaStr==null||ideaStr.length==0) {
      //  $('#textId'+groups[i].id+'').hide();
      //};
		
      doStr = "";
      datetimeStr = "";
	}//for结束
	
	
  // 判断加载更多按钮是否出现
   if($('#downloadMoreData').length>0){
        $('#downloadMoreData').remove();
   }
   if (groups.length==0 && $('.appui-nocontent').length == 0) {
		//$('#acticlePage').append('<a class="appui_loadmore fs32 fc-greyabc">暂无更多</a>');
		$('#acticlePage').append(commonNoMoreContent("您还没有发布任何文章"));
      };
    if (totalPage!= currentPage&&groups.length!=0) {
        if (flag==-1) {
            flag = 0;
        };
        $('#acticlePage').append('<a onclick="downloadMoreData();" id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }
    if (totalPage>currentPage && (currentPage!=page&&page!=null)||(totalPage!=1&&currentPage==1)) {
        downloadMoreData();
    }else if (autoLoad==0){
        page = null;
        var position = readClientSession('homepage-position');
        //$(window).scrollTop(position);    
        $('#homepage').scrollTop(position);    
    }
    $('.link-style p').each(function(){
          $(this).css('margin-top',-$(this).height()/2);
    });
}

//判断是否有@数组
function isCommentList(groups1,i){
  var contentStr = "";
  var commentListCount = groups1[i].commentList.length;
  if (commentListCount>0){
      for (var j = 0; j < commentListCount; j++) {
           contentStr += '<span class="fc-navy">//@'+groups1[i].commentList[j].author.nickname+'</span>'+groups1[i].commentList[j].content;
      };
      contentStr = groups1[i].content+contentStr;
  }else{
      contentStr =  groups1[i].content;
  }
  return contentStr;
}
function picTypeFunction(picArray){
  var picStr   = "";
  var imgClass = "";
  var picNumber = picArray.length>4?4:picArray.length;
  switch(picNumber){
          case 1:
           imgClass = "onepic-layout";
           break;
          case 2:
           imgClass = "twopic-layout";
           break;
          case 3:
           imgClass = "threepic-layout";  
           break;
          case 4:
           imgClass = "fourpic-layout";
           break;
          default:
           break;
        }
  for (var i = 0; i < picNumber; i++) {
    picStr+='<i><img src="' + picArray[i] + '" /></i>';
  }
  picStr = '<div class='+imgClass+'>'+picStr+'</div>';
  return picStr;
}
//自己发表的文字
function isIdeaFunction(ideaStr) {
    // var ideaStr = '<p class="text-style fs30 fc-black">'+ideaStr+'</p>';
    var ideaStr = '<p class="mycollect-alltext fs28 fc-black">'+ideaStr+'</p>';
    return ideaStr;
}
// //佩戴链接
function isLinkFunction(picArray, title, linkID) {
    var linkStr = "";
    var imageStr = picArray[0];
    if (picArray.length == 0) {
      //imageStr = "images/article_recommend_1.jpg";
      imageStr = iconDefaultPicForNullUrl;
    }
    linkStr = '<div class="link-style bg-greyfa fs28">' + '<i><img src="' + imageStr + '" /></i>' + '<p class="fc-black">' + title + '</p></div>';
    // onclick="gotoActicleDetailHtml('+linkID+')"
  return linkStr;
}

function gotoMessageOrAriticle(id,from, publishtype, type){
  if (type==0) {
      window.location.href="/articles/square_detail.html?id="+id+"&from="+from+"&publishtype="+publishtype;
  }else{
      window.location.href="/articles/article_detail.html?id="+id+"&from="+from+"&publishtype="+publishtype;
  }
}

function myClose(){
    if (backBool == 1) {
        removeClientSession('homepage-position');
        removeClientSession('homepage-page');
    }else{
    var position = $('#homepage').scrollTop();
    writeClientSession('homepage-position',position);
    writeClientSession('homepage-page',currentPage);
}
}
function downloadMoreData(index) {
    currentPage++;
    requestgetMyContentList();
}