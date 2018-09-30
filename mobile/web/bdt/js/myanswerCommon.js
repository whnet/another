// myanswerCommon.js

// isFrom 0表示从myhomePage 进入
function configUnansweredQuestionList(groups,index,isFrom) {
  $('#unanswered').show();
  var count = groups.length;
  for (var i = 0; i < count; i++) {

    var reAnswer = 2;
    var doStr = "";
    var addQuestionStr = "";
    var yuanOrAddquestionStr = "";
    var expiredStatusStr = "";
    var firstQuestionStr = "";
    var picsStr = "";
		var isCouponClass = "";
		if (groups[i].pics!=null&&groups[i].pics.length>0)
		{
        picsStr = '<i class="has_img"><img src="images/has_img.png" /></i>';
    };
	
	
    if (groups[i].addQuestion!=null&&groups[i].addQuestion.length>0) {
      reAnswer = 3;
		addQuestionStr ='<p class="my-qanda-item-bd fs28 fc-greyabc" onclick="gotoQanda_recordHtml('+groups[i].id+','+groups[i].status+','+isFrom+','+reAnswer+')">'+
							picsStr+
							'<span>原问题：'+
							groups[i].content+
								'</span>'+
						'</p>';
			
      firstQuestionStr = groups[i].addQuestion;
      yuanOrAddquestionStr = "追问";
      if (picsStr.length>0) {
        picsStr = "";
      };
    }else{
      yuanOrAddquestionStr = '￥'+groups[i].afee;
      firstQuestionStr = groups[i].content;
    }
	
	
    if (groups[i].expiredStatus==0) {
      expiredStatusStr = '<span class="fc-blue fs30 ml20" >待回答</span>';
    }else{
      expiredStatusStr = '<span class="fc-greyabc fs30 ml20" >已过期</span>';
    }
	
	
    /** 问答状态 未支付 -1;问答状态-未审核 0; 问答状态-正常 1; 问答状态-已删除2; 问答状态-已撤回3; 问答状态-被拒绝4 问答状态-已过期5*/;
    if (groups[i].status==-1) {
        expiredStatusStr = '<span class="fc-greyabc fs30 ml20" >未支付</span>';
    }else if (groups[i].status==2) {
        expiredStatusStr = '<span class="fc-greyabc fs30 ml20" >已删除</span>';
    }else if (groups[i].status==3) {
        expiredStatusStr = '<span class="fc-greyabc fs30 ml20" >已撤回</span>';
    }else if(groups[i].status==4){
        expiredStatusStr = '<span class="fc-greyabc fs30 ml20" >已拒绝</span>';
    }else if(groups[i].status==5){
        expiredStatusStr = '<span class="fc-greyabc fs30 ml20" >已过期</span>';
    }
		
		if (groups[i].payPype == 2) {
			isCouponClass = " use_coupon";
		}
		if (yuanOrAddquestionStr == "追问"||expiredStatusStr == '<span class="fc-greyabc fs30 ml20" >已撤回</span>' || expiredStatusStr == '<span class="fc-greyabc fs30 ml20" >已拒绝</span>' || expiredStatusStr == '<span class="fc-greyabc fs30 ml20" >已过期</span>') {
			isCouponClass = "";
		}
		doStr = '<div class="my-qanda-item bc-grey bg-white mb10'+isCouponClass+'">'+
                  '<div class="my-qanda-item-hd">'+
						'<a onclick="gotoUser_pageHtml('+groups[i].qustionUser.id+')">'+
							'<i><img src="'+insertImgType(groups[i].qustionUser.headPic,2)+'"></i>'+
							'<span class="fc-navy fs30 ml5">'+groups[i].qustionUser.nickname+'</span>'+
						'</a>'+
						expiredStatusStr+
						'<em class="fc-black fs24 ml10">优惠券</em>'+
						'<div>'+
							'<i class="bg-orange"></i>'+
                        '<span class="fc-orange fs30" onclick="gotoQanda_recordHtml('+groups[i].id+','+groups[i].status+','+isFrom+','+reAnswer+')">'+yuanOrAddquestionStr+'</span>'+
                    '</div>'+
					'</div>'+
					
					'<p class="my-qanda-item-bd fs30 fc-black mt10 face_tag" onclick="gotoQanda_recordHtml('+groups[i].id+','+groups[i].status+','+isFrom+','+reAnswer+')">'+
  					 	picsStr+
  						firstQuestionStr+
					'</p>'+
					
					addQuestionStr+
					
                    '<div class="my-qanda-item-fd">'+
                      '<i class="fs28 fc-greyabc">'+getDateDiff(groups[i].moreAddTime)+'</i>'+
                    '</div>'+
             '</div>';
		
    $('#unansweredList').append(doStr);
  };
	
  if (isFrom!=0) {
      // 判断加载更多按钮是否出现
     if($('#downloadMoreData'+index).length>0){
          $('#downloadMoreData'+index).remove();
     }
     if (groups.length==0) {
			//$('#unansweredList').append('<a class="appui_loadmore fs32 fc-greyabc">暂无更多</a>');
			$('#unansweredList').append(commonNoMoreContent("没有等待回答的问题"));
     }else if (totalPageArr[index]!= currentPageArr[index]) {
          if (flagArr[index]==-1) {
              flagArr[index] = 0;
          };
          $('#unansweredList').append('<a onclick="downloadMoreData1('+index+');" id="downloadMoreData'+index+'" class="appui_loadmore fs32 fc-greyabc">加载更多</a>');
     }
  };
   
}

function configAnsweredQuestionList(groups,index,isFrom) {
   $('#answered').show();
  var count = groups.length;
  for (var i = 0; i < count; i++) {
    var doStr = "";
    var firstQuestionStr = "";
    var addQuestionStr = "";
    var yuanOrAddquestionStr = "";
    var picsStr = "";
    var isCouponClass = "";
    if (groups[i].pics!=null&&groups[i].pics.length>0) {
        picsStr = '<i class="has_img"><img src="images/has_img.png" /></i>';
    };
    if (groups[i].addQuestion!=null&&groups[i].addQuestion.length>0) {
      addQuestionStr = '<p class="my-qanda-item-bd fs28 fc-greyabc"><span>原问题：'+groups[i].content+'</p>';
      firstQuestionStr = groups[i].addQuestion;
      yuanOrAddquestionStr = "追问";
    }else{
      yuanOrAddquestionStr = '￥'+groups[i].afee;
      firstQuestionStr = groups[i].content;
    }
		if (groups[i].payPype == 2) {
			isCouponClass = " use_coupon";
		}
		if (yuanOrAddquestionStr == "追问") {
			isCouponClass = "";
		}
	doStr = '<div class="my-qanda-item bc-grey bg-white mb10'+isCouponClass+'">'+
                  '<div class="my-qanda-item-hd">'+
					'<a onclick="gotoUser_pageHtml('+groups[i].qustionUser.id+')">'+
						'<i><img src="'+insertImgType(groups[i].qustionUser.headPic,2)+'"></i>'+
						'<span class="fc-navy fs30 ml5">'+groups[i].qustionUser.nickname+'</span>'+
					'</a>'+
		             '<em class="fc-black fs24">优惠券</em>'+
		             '<div>'+
             '<i class="bg-orange"></i>'+
                      '<span class="fc-orange fs30" onclick="gotoQanda_detailHtml('+groups[i].id+','+isFrom+')">'+yuanOrAddquestionStr+'</span>'+
		  			'</div>'+
                  '</div>'+
				'<p class="my-qanda-item-bd fs30 fc-black mt10 face_tag" onclick="gotoQanda_detailHtml('+groups[i].id+','+isFrom+')">'+
  					picsStr+
  					firstQuestionStr+
				'</p>'+
				addQuestionStr+
                  '<div class="my-qanda-item-fd">'+
                    '<i class="fs28 fc-greyabc">'+getDateDiff(groups[i].answerTime)+'</i>'+
					'<span class="fs28 fc-greyabc"><i>'+groups[i].listenUserTimes+'</i>人听</span>'+
                  '</div>'+
              '</div>';
    $('#answeredList').append(doStr);
  };
  
  if (isFrom!=0) {
      // 判断加载更多按钮是否出现
       if($('#downloadMoreData'+index).length>0){
            $('#downloadMoreData'+index).remove();
       }
       if (groups.length==0) {
             //$('#answeredList').append('<a class="appui_loadmore fs32 fc-greyabc">暂无更多</a>');
	  	     $('#answeredList').append(commonNoMoreContent("您还没有回答任何问题"));
       }else if (totalPageArr[index]!= currentPageArr[index]) {
          if (flagArr[index]==-1) {
              flagArr[index] = 0;
          };
          $('#answeredList').append('<a onclick="downloadMoreData1('+index+');" id="downloadMoreData'+index+'" class="appui_loadmore bc-grey fs32 fc-greyabc">加载更多</a>');
       }
       commonJS(index);
  };
  
}
//加载更多时候进行的网络请求；
function downloadMoreData1(index) {
    currentPageArr[index]++;
    if (index==0) {
       getContentListByUserRequest(index,22);
    }else{
       getContentListByUserRequest(index,21);
    }
}

// gotoQanda_recordHtml(211,-1,0,2)

function gotoQanda_recordHtml(listId,status,isFrom,reAnswer){
   if (status==1||status==5) {
      if (isFrom!=0) {
          window.location.href = "qanda_record.html?id="+listId+"&reAnswer="+reAnswer+"&typeId=10";
      }else{
          window.location.href = "qanda_record.html?id="+listId+"&reAnswer="+reAnswer+"&typeId=11";
      }
    }else if (status==-1) {
      dataLoadedError("该问题暂未支付");
    }else{
        window.location.href = "qanda_detail.html?id="+listId;
    }
}
function gotoQanda_detailHtml(listId,isFrom){
  // window.location = "found_friends_message_detail.html?id="+acticleID;
  //判断是从那个界面进来的 0从myhome 1myAnswer
  if (isFrom!=0) {
      window.location.href = "qanda_detail.html?id="+listId+"&typeId=1";
  }else{
      window.location.href = "qanda_detail.html?id="+listId+"&typeId=11";
  }
    
}

