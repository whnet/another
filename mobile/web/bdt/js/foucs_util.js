// foucs_utils
//判断是否已经关注本大咖

  /**当前用户对他/她的关注状态 focusStatus; 0-未关注，1-已关注 */
  //type 1新用户界面 size 0=fs24 1=fs20 
    var userTest = getSessionUserNoRedirectEx();

function isFocusStr(targetUserID,focusStatus,type,size){
    
    var isFocusStr = "";
    if (type==1) {
        var sizeStr = "fs20";
        if (size==0) {
            sizeStr = "fs24";
        }
        if (focusStatus==0) {
            isFocusStr = '<a class="bc-blue fc-blue '+sizeStr+'" id="focus'+targetUserID+'" onclick="requestDoOrRemoveFocus('+targetUserID+','+type+','+size+',event)" id="focusID'+targetUserID+'">关注</a>';     
        }else{
            isFocusStr = '<a class="fc-greyabc bc-grey '+sizeStr+'" id="focus'+targetUserID+'" onclick="requestDoOrRemoveFocus('+targetUserID+','+type+','+size+',event)"">已关注</a>';   
        }
    }else if (type==2) {
        if (focusStatus==0) {
            isFocusStr = '<a class="add-follow fs20 fc-red bc-grey focus_'+targetUserID+'" onclick="requestDoFocus('+targetUserID+','+type+','+size+',event)" id="focusID'+targetUserID+'">关注</a>';     
        }else{
            isFocusStr = '<a class="add-follow fs20 fc-greyf1 bc-grey focus_'+targetUserID+'">已关注</a>';   
    }
    }else{
        if (focusStatus==0) {
            isFocusStr = '<a class="add-follow fs20 fc-red bc-red" onclick="requestDoFocus('+targetUserID+','+type+','+size+',event)" id="focusID'+targetUserID+'">关注</a>';     
        }else{
            isFocusStr = '<a class="add-follow fs20 fc-greyf1 bc-grey">已关注</a>';   
        }
    }

    // if (type!=1) {
    //     if (focusStatus==0) {
    //         isFocusStr = '<a class="add-follow fs24 fc-red bc-red" onclick="requestDoFocus('+targetUserID+','+type+','+size+',event)" id="focusID'+targetUserID+'">关注</a>';     
    //     }else{
    //         isFocusStr = '<a class="add-follow fs24 fc-greyf1 bc-grey">已关注</a>';   
    //     }
    // }else{
    //     var sizeStr = "fs20";
    //     if (size==0) {
    //         sizeStr = "fs24";
    //     }
    //     if (focusStatus==0) {
    //         isFocusStr = '<a class="bc-blue fc-blue '+sizeStr+'" id="focus'+targetUserID+'" onclick="requestDoOrRemoveFocus('+targetUserID+','+type+','+size+',event)" id="focusID'+targetUserID+'">关注</a>';     
    //     }else{
    //         isFocusStr = '<a class="fc-greyabc bc-grey '+sizeStr+'" id="focus'+targetUserID+'" onclick="requestDoOrRemoveFocus('+targetUserID+','+type+','+size+',event)"">已关注</a>';   
    //     }
    // }
    if (userTest!=null&&userTest.length!=0) {
        if (targetUserID==userTest.id) {
        isFocusStr = "";
      }
    }
    return isFocusStr;
}


// function sureRemoveFoucs(){
//     if ($('#focus'+targetUserID).hasClass("fc-greyabc")||$('#focus'+targetUserID).hasClass("bc-grey")){
//         friendTips("您是否要取消关注？","取消","确定",0);
//     }
// };
//取消关注或者加关注
//避免重复提交
var requestCommentFlag=false;
function requestDoOrRemoveFocus(targetUserID,type,size,e) {
    userTest = getSessionUserNoRedirectEx();
    if(userTest == null){
        userTest = getSessionUser();
    }
    
	if(requestCommentFlag){
	  	return;
	}else{
	  requestCommentFlag=true;
	}
   // dataLoading("取消关注网络请求中...");
// focusStatus; 0-未关注，1-已关注 */
    var focusStatus = "";
    var url = "";
    if ($('#focus'+targetUserID).hasClass("fc-blue")||$('#focus'+targetUserID).hasClass("bc-blue")) {
        url = doFocus;
        focusStatus = 1;
    }else if ($('#focus'+targetUserID).hasClass("fc-greyabc")||$('#focus'+targetUserID).hasClass("bc-grey")){
        url = removeFocus;
        focusStatus = 0;
    }
    
    $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        async: true,
        data:{"targetId":targetUserID},
        success: function(result) {
        	requestCommentFlag=false;
            if (result.result == "success") {
                var targetUrlPathname = window.location.pathname;
                var fansCountStr = $('#fansCount').text();
                if (focusStatus==1) {
                    if (targetUrlPathname=="/loupan_page.html"){
                        focusStatusStr = 1;
                        $('#sendMessage').show();
                    }
                    // $('#sendMessage').show();
                    fansCountStr++;
                    dataLoadedSuccess("关注成功");
                    $('#focus'+targetUserID).text("已关注");
                    $('#focus'+targetUserID).removeClass("bc-blue").addClass("bc-grey");
                    $('#focus'+targetUserID).removeClass("fc-blue").addClass("fc-greyabc");
                }else if (focusStatus==0){
                    if (targetUrlPathname=="/loupan_page.html"){
                        focusStatusStr = 0;
                        $('#sendMessage').hide();
						//AddBut();
                    }
                    // $('#sendMessage').hide();
                    fansCountStr--;
                    dataLoadedSuccess("取消关注成功");
                    $('#focus'+targetUserID).text("关注");
                    $('#focus'+targetUserID).addClass("bc-blue").removeClass("bc-grey");
                    $('#focus'+targetUserID).addClass("fc-blue").removeClass("fc-greyabc");
                }
                $('#fansCount').text(fansCountStr);
             //粉丝数
              // isFocusOn=0;
            } else {
                dataLoadedError(result.message);
            }
        }
    });
    e ? e.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
}
// function saveFunction(){
//   $(".toastDialogSure").fadeOut(100,$(".toastDialogSure").remove());
//   requestRemoveFocus();
// }