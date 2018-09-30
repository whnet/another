var user = null;
var feetype=0;
var id = "";

$(document).ready(function() {
	$("#qzmembers").click(function() {
		window.location.href="circle_members.html?id="+id+"&eqfrom=circle_data_expert";
	});
	
	$("#exitCircle").click(function() {
		friendTips("您是否要退出圈子？","取消","确定",0);
	});
	
	/** by wangzhen 20170513 调整back程序
	$("#back").click(function(e) {
//		var url = document.referrer;
//	    if (url!=null&&url.length!=0) {
//	       window.location.href = "javascript:history.back(-1)";
//	    }else{
	       window.location.href = "circle_page.html?id="+request("id");
//	    }
	});
	*/

	$(".cde_share").click(function(e) {
		showHowToShare(1);
	});
	
	$("#closeShare").click(function(e) {
		showHowToShare(2);
	});

});

function initClick(){
	$("#setqzinfo").click(function() {
		window.location.href="circle_creat_free.html?id="+id;
	});
	
	$("#setjoinmethod").click(function() {
		window.location.href="circle_data_adding_method.html?id="+id+"&feetype="+feetype;
	});
	
	$("#setqznickname").click(function() {
		window.location.href="circle_data_name_edit.html?id="+id+"&value="+$("#mynickname").html();
	});
}
	
function saveFunction(index){
	if (index==0) {
		ExtiMember(id);
			// set_focus();
	}
	$("#iosDialog1").fadeOut(100,$("#iosDialog1").remove());
}
//function GetQzMemberCount(qzid){
//	 $.ajax({
//      type: "post",
//      url: getQzMemberCountUrl,
//      dataType: "json",
//      async: true,
//      data: {
//   	   "qzId": qzid
//      },
//      success: function(result) {
//          if (result.result == "success") {
//        	  $("#qztotmember").html(result.data+"位");
//          }
//      }
//  });
//}

 function GetQzMemberList(qzid){
	 $.ajax({
       type: "post",
       url: getQzDetailUrl,
       dataType: "json",
       async: true,
       data: {
    	   "qzId": qzid
       },
       success: function(result) {

           if (result.result == "success") {
        	   //圈子标题
        	   $("#qztitle").html(result.data.qzShow.name);
//        	   var d=new Date(result.data.qzShow.addTime);
        	   var createtime=getDateStringDateWithSeconds(result.data.qzShow.addTime).split(" ")[0];
        	   var createhtml=createtime.split("-")[0]+"年"+createtime.split("-")[1]+"月"+createtime.split("-")[2]+"日 创建本圈子";
        	  
         	  $("#qzname").html(result.data.qzShow.name);//alert(8);
         	  var joinprice="";
 	       	  if(result.data.qzShow.feeType==0){
 	       		joinprice="免费";
 	       	  }else if(result.data.qzShow.feeType==1){
 	       		feetype=1;
 	       		joinprice="￥"+(result.data.qzShow.joinPrice/100)+",年付";
 	       	  }else if(result.data.qzShow.feeType==2){
 	       		feetype=2;
 	       		joinprice="￥"+(result.data.qzShow.joinPrice/100)+",永久";
 	       	  }
 	       	$("#qzjoinprice").html(joinprice);
 	        $("#memberstoptime").html(joinprice);
 	       if(result.data.myMember!=null){
 	    	  $("#mynickname").html(result.data.myMember.qzNickname);
 	       }	   
 	      $("#qztotmember").html(result.data.qzShow.totMembers+"位");
// 	      当前登录人
 	     if(result.data.myMember!=null){
 	    	initClick();
 	    	$(".cde_master").html("<img src='"+result.data.myMember.member.headPic+"'>");
 	    	$("#createname").html(result.data.myMember.qzNickname);
 	    	
 	      if(result.data.myMember!=null && result.data.qzShow.host.id!=result.data.myMember.member.id){
 	    	 $("#creattime").html(result.data.hostMember.qzNickname+" "+createhtml);
 	    	 $("#imgmebber img").attr("src",result.data.qzShow.host.headPic);
 	    	 $("#imgmebber").addClass("cde_master redmaster");
 	    	// $("#imgmebber").append("<i class='fs26 fc-grey666' style='width:100%;position:absolute;left:0;bottom:-1.5rem'>"+result.data.hostMember.qzNickname+"</i>");
 	    	 $("#exitCircle").show();
	    	 $("#setjoinmethod").hide();
	    	 $("#paystoptime").show();
	    	 $("#setqzinfo").hide();
           }else{
        	 $("#creattime").html("你 "+createhtml);
 	    	 $("#exitCircle").hide();
 	    	 $("#setjoinmethod").show();
 	    	 $("#paystoptime").hide();
 	    	 $("#setqzinfo").show();
 	    	 if(result.data.myMember!=null && result.data.qzShow.host.id==result.data.myMember.member.id && result.data.picList.length>9){
				$("#imgmebber img").attr("src",insertImgType(result.data.picList[9],2));
 	    	 }
 	      }

          for (var i = 0; i < result.data.picList.length; i++) {
        	$("#img"+i).attr("src",insertImgType(result.data.picList[i],2));
          }
         
       /*   var realUrl = hostConf + "/circle_share_detail.html?id="+qzid;
          var shareuser=result.data.qzShow.host.nickname;
          if(result.data.myMember!=null && result.data.qzShow.host.id==result.data.myMember.member.id){
        	  shareuser="他";
          }
 	          
          var fxtitle=""+(result.data.myMember!=null?result.data.myMember.member.nickname:"")+" 邀请你加入 "+shareuser+" 的圈子";
      	  wxShareFromUrlEx(fxtitle,fxtitle,result.data.qzShow.summary,"","","",realUrl);*/


      	  //微信分享修改
	      	  // configwxShare(result.data.qzShow);
 	     }else{
 	    	 $("#setqznickname").find("img").remove();
 	    	$("#setqzinfo").find("img").remove();
 	    	$("#setjoinmethod").find("img").remove();
 	    	$("#creattime").html(result.data.hostMember.qzNickname+" "+createhtml);
 	    	$(".cde_master img").attr("src",result.data.qzShow.host.headPic);
 	    	$(".cde_master").removeClass("cde_master").addClass("cde_master redmaster");
 	    	$("#setjoinmethod").show();
 	    	$("#paystoptime").hide();
 	    	$("#setqznickname").hide();
 	     }
 	     	configwxShare(result.data.qzShow);
           }
       }
   });
 }
 
 function ExtiMember(id){
 	var id = request('id');
 	var  csrf = $('input[name="csrf"]').val();
	 $.ajax({
	      type: "post",
	      url: '/circle/exitcircle.html',
	      dataType: "json",
	      async: true,
	      data: {
	   	   "id": id,
			'_csrf':csrf,
	      },
	      success: function(result) {
	          if (result.result == "success") {
	        	  window.location.href="circle_my.html?from=circle_data_expert";
	          }
	      }
	  });
 }
 
 function showHowToShare(type){
     if(type==1){
         $("#shareView").show();
     }else{
         $("#shareView").hide();
     }
}

function configwxShare(groups){
	
	//圈成员分享：我加入+【创建者】的【圈子名称】+，满满干货，现推荐给你! 
    var wxShareSummary = "我加入"+groups.host.nickname+"的"+groups.name+"，满满干货，现推荐给你!";
    //圈主分享：我和朋友们创建+【圈子名称】+的圈子，邀请你也来一起聊聊。
    //圈成员分享：我加入+【创建者】的【圈子名称】+，满满干货，现推荐给你! 
    var wxShareTitle = "我加入"+groups.host.nickname+"的"+groups.name+"，满满干货，现推荐给你!";
    if(user!=null && groups.host.id == user.id){
    	wxShareSummary = "我和朋友们创建"+groups.name+"的圈子，邀请你也来一起聊聊。";
    	wxShareTitle = "我和朋友们创建"+groups.name+"的圈子，邀请你也来一起聊聊。";
    }
    //如果userTest是圈主自己

   /* var userTest = user;
    if(userTest != null && groups.host.id == userTest.id){
    	wxShareTitle = "我和朋友们建了个 "+groups.name+" 的圈子，快来一起聊聊";
    	wxShareSummary = groups.host.nickname+"邀请你加入他的圈子";
    }else{
    	wxShareTitle = "我加入了"+groups.host.nickname+"的圈子 "+groups.name+" ，满满的干货，推荐给你";
    	wxShareSummary = userTest.nickname+"邀请你加入"+groups.host.nickname+"的圈子";
    }*/
    //发给好友内容
    var wxFriendShareStr = groups.summary;//groups.summary;  wxShareTitle

    //分享图片的icon换成圈子的图片
    /*var img = defaultWeixinSharePicUrl;*/
    //圈子背景
    var img = hostConf+groups.bgPic;

    var realUrl = hostConf + "/circle_share_detail.html?id="+groups.id;
    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",img, img, realUrl);
}