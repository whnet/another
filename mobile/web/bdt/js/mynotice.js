// mynotice
var userTest = "";
var currentIndex = 0;
var currentPageArr = new Array(1,1);
var totalPageArr = new Array(0,0);
var flagArr = new Array(0,0);
var pageArr = new Array(1,1);
var clickItemTimesArr = new Array(0,0);//是否点击过，以避免重复请求服务器
var systemNoticeFlag=false;//存放是否点击了系统消息标识，用于清空系统消息判断

var moreDataflag = 0;
var pernum=6;
var page = 1;
var currentPage = 1;
var totalPage = 1;

$(document).ready(function() {
    getQuestions();
    noRead();
	//问答消息和系统消息点击切换
	$('#noticeSwitch>a').each(function(index, element) {
		$(this).click(function(e) {
			currentIndex = index;
			if(currentIndex == 0){//问答消息
                getQuestions();
            }else if(currentIndex == 1){//系统消息
                $('#noticeListCon0').html('');
			}
			noticeTypeSwitch();
		});
	});

    //问答消息红点
    // $('#noticeSwitch>a').eq(0).find('i').show();
    //系统消息红红点
    // $('#noticeSwitch>a').eq(1).find('i').show();

    //首先请求

    // 下拉加载更多
    $('.page__bd').scroll(function(){
        if (moreDataflag==0){
            var a = "";
            if ($('#downloadMoreData').length>0){
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    moreDataflag = -1;
                    downloadMoreData();
                }
            }
        };
    });
//查看是否有未读消息


});
//notice 加载效果，传入type
//页面滚动加载更多

//请求问答数据
function getQuestions(){
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    var expert = $('input[name="expert"]').val();
    $.ajax({
        type: "post",
        url: '/questions/notice.html',
        dataType: "json",
        async: true,
        data: {
            "currentPage": currentPage,
            "start":start,
            "pernum":pernum,
            "expert":expert,
            "_csrf":csrf,
        },
        success: function(result) {
            if (result.result == "success") {
                currentPage = result.data.page.currentPage;
                totalPage = result.data.page.pages;
                questionList(result,2);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

function questionList(result,index){
    var list = "";
    for(var i = 0; i < result.data.list.length; i++){
        if(result.data.list[i].haveread == 0){
            status = "../bdt/images/unread.png";
        }else{
            status = "../bdt/images/read.png";
        }
        //判断是否使用的微信头像
        var isWeixin = result.data.list[i].user.photo.indexOf('ttp');
        if(isWeixin == 1){
            photo = result.data.list[i].user.photo;
        }else{
            photo = result.file+result.data.list[i].user.photo;
        }

        list +='<div class="notice-item bg-white b-tb-grey hasNotRead" onclick="updateNoticeReadStatus('+result.data.list[i].id+')">' +
            '<div class="notice_head">' +
            '<i><img src="'+photo+'"><i><img src="../bdt/images/v2.png"></i></i>' +
            '<p class="fs28">您收到'+result.data.list[i].user.nickname+'的提问</p><i>' +
            '<img id="isHasRead" src="'+status+'"></i></div>' +
            '<p class="fs30">'+result.data.list[i].question+'</p><div class="notice_bottom">' +
            '<p class="fs22">06-06 09:07</p><p class="fs22">查看详情</p>' +
            '</div></div>';
    }
    $('#noticeListCon0').append(list);
    showMessage(result);
}
function showMessage(result){
    if (result.data.page.pages > result.data.page.currentPage) {
        if (moreDataflag=-1) {
            moreDataflag = 0;
        };
        $('#downloadMoreData').remove();
        $('#noticeListCon0').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.data.page.pages == result.data.page.currentPage && result.data.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#noticeListCon0').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.data.list.length == 0){
        $('#noticeListCon0').html(commonNoMoreContent("暂无消息"));
    }
}
//加载更多
function downloadMoreData() {
    currentPage++;

    getQuestions();
}
//查看消息问答，并且更新阅读状态
function updateNoticeReadStatus(id){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/questions/opened.html',
        dataType: "json",
        async: true,
        data: {
            "id":id,
            "_csrf":csrf,
        },
        success: function(result) {
            if (result.result == "success") {
                window.location.href="/questions/qanda_detail.html?id="+id;
            }
        }
    });

}

//查询是否有未读的消息
function noRead(){
    var csrf = $('input[name="csrf"]').val();
    var expert = $('input[name="expert"]').val();
    $.ajax({
        type: "post",
        url: '/questions/noticestatus.html',
        dataType: "json",
        async: true,
        data: {
            "expert":expert,
            "status":0,
            "type":'question',
            "_csrf":csrf,
        },
        success:function(data){
            if(data.nums){
                $('#noticeSwitch>a').eq(0).find('i').show();
            }
        }
    });

}


//消息列表切换效果
function noticeTypeSwitch(){
	$('#noticeSwitch>a').eq(currentIndex).siblings('a').removeClass("bg-blue fc-white tab-on").addClass("fc-blue");3
	$('#noticeSwitch>a').eq(currentIndex).addClass("bg-blue fc-white tab-on").removeClass("fc-blue");
	$('#noticeListCon'+currentIndex).siblings('div').hide();
	$('#noticeListCon'+currentIndex).show();
	
	window.location.hash = currentIndex;
	if (clickItemTimesArr[currentIndex]==0) {
		clickItemTimesArr[currentIndex]=1;
        getMyPageNoticesFunction();
    }
	if(currentIndex==1){
		systemNoticeFlag=true;//存储是否需要清除系统消息的判断参数
	}
}





//请求消息列表数据
function getMyPageNoticesFunction(fn) {
    var replaceCurrentIndex = currentIndex;
    clickItemTimesArr[replaceCurrentIndex] = 1;
    //替换全局变量防止快速切换出现问答消息与系统消息在同一列

    var type = 1;
    if(currentIndex==0){//问答消息
        type = 1;
    }else {//系统消息
        type = 2;
	}

}


//消息是否已读-消息类型切换按钮上的红点标注
function setNoticeReadStatus(noticeId,i,nextUrl,obj){
    setElementClickStyle(obj);
    var type = "";
    if(currentIndex==0){
        type = 1;
    }else if(currentIndex==1){
        type = 2;
    }
    $.ajax({
        type: "post",
        url: setNoticeReadStatusUrl,
        dataType: "json",
        async: true,
        data:{"id":noticeId},
        success: function(result){
            if (result.result == "success"){
                var newMessageStatus = readClientSession("newMessageStatus");
                if (newMessageStatus!=null) {
                   /* if (newMessageStatus.noticeMsgCnt>0){
                		newMessageStatus.noticeMsgCnt--;
                    }*/
                    //1问答消息
                    if(type==1){
                        if(newMessageStatus.qaNoticeMsgCnt>0){
                            newMessageStatus.qaNoticeMsgCnt--;
                        }
                    }
                    //2系统消息
                    else if(type==2){
                        if(newMessageStatus.sysNoticeMsgCnt>0){
                            newMessageStatus.sysNoticeMsgCnt--;
                        }
                    }


					if(newMessageStatus.noticeMsgCnt==0 && newMessageStatus.newChatMsgCnt==0 && newMessageStatus.qaNoticeMsgCnt==0 && newMessageStatus.sysNoticeMsgCnt ==0 ){
						newMessageStatus.menuNewStatus=0;
					}
                	writeClientSession("newMessageStatus",newMessageStatus);
                };
                //$(".noticePart"+i+" .notice_head img").attr("src","");
                //问答消息列表
              
                $("#isHasRead"+currentIndex+currentPageArr[currentIndex]+i).attr("src", "../themes/img/read.png?v=20170223185829");
              
				(typeof saveStatusBeforeJump!='undefined')&&saveStatusBeforeJump();//首先将当前页面的数据和状态保存下来，方便跳转回来保持状态
                window.location.href = nextUrl;
            }
        }
    });
}


//删除-清空消息
function deleteNoticeFunction(id) {
    //data:{"page":"","type":"1-系统消息，2-互粉消息"}
    $.ajax({
        type: "post",
        url: deleteNotice,
        dataType: "json",
        async: true,
        data:{"id":id},
        success: function(result) {
			if (result.result == "success") {
				if($('#system-messages').children().length==1 && $('.appui-nocontent').length==0 ) {
				$('#system-messages').append(commonNoMoreContent("暂无消息"));
			};
			dataLoadedSuccess("删除消息成功");
			$('#deleteId'+id).parents('.appui-delete-touch').css('border','0');
			$('#deleteId'+id).parents('.appui-delete-touch').stop().animate({height:'0',margin:'0'},300,function(){$('#messageId'+id).remove();});
			// $('#messageId'+id).remove
			}
			else{
				dataLoadedError(result.message);
			}
        }
    });
    
}



