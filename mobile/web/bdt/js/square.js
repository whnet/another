var currentPage = 1;
var totalPage = 1;
var flag = 0;
var userTest;
var pernum = 6;
var start = 0;
$(document).ready(function() {
    getSquarePageListRequest(0);
    $('#sendMessage').click(function() {
        $('.publish-type').fadeIn();
        $('.publish-type-list').css('margin-top',-$('.publish-type-list').height()/2);
    });
    $('#closePubBtn').click(function() {
        $('.publish-type').fadeOut();;
    });
    $('.page__bd').scroll(function(){
        if (flag==0) {
            var a = "";
            if ($('#downloadMoreData').length>0) {
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    flag = -1;
                    downloadMoreData();
                }
            }
        };
    });

     $('.video-layout').width($('.module-content').width()*0.84+12);


	 //筛选按钮点击效果-展开筛选选项
	$('#shaixuanId').click(function(e) {
		if($('#shaixuanListId').is(":hidden")){
		$('#shaixuanListId').slideDown();
		}else{
			$('#shaixuanListId').slideUp();
		}
	});
	//关闭筛选选项
	$('#shaixuanListId').click(function(e) {
		$('#shaixuanListId').slideUp();
	});
	$('.page__bd *').click(function(e) {
		$('#shaixuanListId').slideUp();
	});
    
	//页面筛选的点击事件
    $('.luntantype').click(function(){
        var index = $(this).data('type');
        currentPage=1;
        $("#squareList").html("");
        getSquarePageListRequest(index);
        $(this).not('luntantype').addClass('active');
        $('.luntantype').not(this).removeClass('active').addClass('luntantype');
        $("#shaixuantext").text($(this).text());
        if($("#searchtype")!=null && $("#searchtype").length>0){//表示存在
            $("#searchtype").val(index);
        }else{
            $("body").append("<input type='hidden' id='searchtype' value='"+(index)+"'/>");
        }
    });

});

function getSquarePageListRequest(type){
	//移除暂无发现的
	if($(".appui-nocontent")){
		$(".appui-nocontent").remove();
	}
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: '/articles/getnew.html',
        dataType: "json",
        async: true,
        data: {
            "currentPage": currentPage,
            "type":type,
            "start":start,
            'pernum':pernum,
            "_csrf":csrf,
        },
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
                configListUI(result);

            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

function configListUI(result){
    var list = '';
    for(var i = 0; i < result.data.list.length; i++){
        //文章配图
        if(result.data.list[i].pics){
            pics = '';
            if(result.data.list[i].pics != "[]"){
                var arraypics = JSON.parse(result.data.list[i].pics);
                if(arraypics.length !=0){
                    if(arraypics.length > 3){
                        for (var a = 0; a < 3; a++) {
                            pics +='<img src="'+result.file+arraypics[a]+'" style="width:50px;height:50px;float:left;margin-right:2px">';
                        }
                    }else{
                        for (var a = 0; a < arraypics.length; a++) {
                            pics +='<img src="'+result.file+arraypics[a]+'" style="width:50px;height:50px;float:left;margin-right:2px"> ';
                        }
                    }


                }
            }
        }else{
            pics = '';
        }

        //文章类型
        from = result.data.list[i].from;
        publishtype = result.data.list[i].publishtype;
        type = '';
        if( publishtype != ""){
            if(publishtype == 'fatie'){
                type +='#发帖#';
            }else if(publishtype == 'article'){
                type +='#文章#';
            }else if(publishtype == 'ask'){
                type +='#问答#';
            }else if(publishtype == 'redpack'){
                type +='#红包#';
            }
            // '<a class="fc-blue">'+type+'</a>'+detailType+'</p>' +
        }
        //判断是否点赞了, 如果点赞中的member_id = mid,则证明一点赞
        onFcRed = "";
        if(result.data.list[i].dianzan.length){
            for(var j=0;j<result.data.list[i].dianzan.length;j++){
                if(result.mid == result.data.list[i].dianzan[j].member_id){
                    onFcRed += 'on fc-red';
                }else{
                    onFcRed += '';
                }
            }
        }

        //循环点赞
        if(result.data.list[i].dianzan){
            var dianzan = result.data.list[i].dianzan.length;
        }else{
            var dianzan = 0;
        }
        //循环评论
        if(result.data.list[i].comment){
            var comment = result.data.list[i].comment.length;
        }else{
            var comment = 0;
        }
        //判断发布文章的具体类型，比如语音、图片
        detailType = "";
        if(result.data.list[i].voices){
            detailType = '<div class="voice-layout mt10"><div class="appui-qanda-answer">' +
                '<div class="appui-qanda-answerstyle voice free" id="a_play_0_'+result.data.list[i].id+'" onclick="playAudioQaClickFunction('+result.data.list[i].id+',2,1,\'a_play_0_'+result.data.list[i].id+'\');"><i></i>' +
                '<span class="appui_qanda-voice-wave"><em class="wave1"></em><em class="wave2"></em><em class="wave3"></em></span><em class="tips">点击收听</em>' +
                '<span class="appui_qanda-voice-wait" style="display:none;"></span></div><em class="appui-qanda-answer-time">'+result.data.list[i].voice_time+'"</em></div></div>';
        }else if(result.data.list[i].videos != "0"){
            detailType = result.data.list[i].summary;
        }
        //判断是否已经领过红包,使用1对多关系
        getPocket = "";
        if(result.data.list[i].redid){
            if(result.data.list[i].redpocket.length){
                for(var k=0;k<result.data.list[i].redpocket.length;k++){
                    if(result.mid == result.data.list[i].redpocket[k].member_id){
                        getPocket += 'fs24 fc-greyabc bc-grey bg-white fwb';
                    }else{
                        getPocket += 'fs24 fc-red bc-grey bg-white fwb';
                    }
                }
            }else{
                getPocket += 'fs24 fc-red bc-grey bg-white fwb';
            }

        }
        //判断红包
        if(result.data.list[i].redid != 0){
            if(result.data.list[i].pockets && result.data.list[i].pockets.status == 1) {
                if (result.data.list[i].pockets.give_type == 1) {
                    var type = '给粉丝';
                } else {
                    var type = '给新手';
                }
                //查看
                var articles = '<p class="text-style fs32 fc-black456 face_tag mb5">' + result.data.list[i].title + '</p>' +
                    '<div class="redpacket-show mt5 mb5" onclick="gotoRedPocketDetailHtml(' + result.data.list[i].redid + ', this);" id="redPacket">' +
                    '<img src="../bdt/images/hongbao_details.png"><p class="fs30 fc-black">' + result.data.list[i].user.nickname + type + '发的红包</p>' +
                    '<a class="' + getPocket + '">领红包</a></div>';
                var contents = '<div class="module-content mt10" >' + articles + '</div>';

            }
        }else if(result.data.list[i].redid == 0){
            if(result.data.list[i].publishtype == 'article'){
                var articles = '<h4 class="f-l-height fs30 find-text fwb mb5" onclick=gotoArticDetailHtml('+result.data.list[i].id+',\''+from+'\',\''+publishtype+'\');>'+result.data.list[i].title+'</h4>' +
                    '<p class="text-style fs28 fc-black face_tag mb10">' +
                    '<a class="fc-blue"></a>'+$(result.data.list[i].content).text()+'</p>' +
                    '<div class="pic-layout message-pic-1-style mb5">' +
                    '<i>'+pics+'</i>' +
                    '</div>';
            }else{
                var articles = '<h4 class="f-l-height fs30 find-text fwb mb5" onclick=gotoArticDetailHtml('+result.data.list[i].id+',\''+from+'\',\''+publishtype+'\');>'+result.data.list[i].title+'</h4>' +
                    '<p class="text-style fs28 fc-black face_tag mb10">' +
                    '<a class="fc-blue"></a>'+detailType+'</p>' +
                    '<div class="pic-layout message-pic-1-style mb5">' +
                    '<i>'+pics+'</i>' +
                    '</div>';
            }
            var contents = '<div class="module-content mt10" onclick=gotoArticDetailHtml('+result.data.list[i].id+',\''+from+'\',\''+publishtype+'\');>'+articles+'</div>';
        }
        //判断是否是专家
        if(result.data.list[i].user.vip == 1){
            var vip = '<i><img src="../bdt/images/v2.png"></i>';
        }else{
            var vip = '';
        }
        if(result.data.list[i].user){
            list += '<div class="f-f-module mb10 bg-white"><div class="find-container">' +
                '<div class="find-header" onclick="window.location.href=\'/expert/expert_detail.html?id='+result.data.list[i].user.id+'\'">' +
                '<div class="f-h-left">' +
                '<a onclick=""><img src="' + result.data.list[i].user.photo + '">' +vip+ '</a><div class="f-h-middle">' +
                '<span class="fs30 fc-blue operate" onclick="">' + result.data.list[i].user.nickname + '<em class="fc-greyabc"></em></span>' +
                '</div></div><div class="f-h-right"></div></div>' + contents + '<div class="time-statistic fs22" id="bottom_1_' + result.data.list[i].id + '">' +
                '<span class="fc-greyabc mr10"><i>' + getDateDiff(result.data.list[i].created) + '</i></span>' +
                '<span class="fc-greyabc"><i>' + result.data.list[i].counts + '</i>阅读</span>' +
                '<span class="fc-red"></span><div class="statistic">' +
                '<a class="like fc-greyabc ' + onFcRed + '" onclick="dianzanClick(' + result.data.list[i].id + ',1,' + result.mid + ')" id="dianzan' + result.data.list[i].id + '">' + dianzan + '</a>' +
                '<a class="comment ml10 fc-greyabc" id="pinglun_' + result.data.list[i].id + '" onclick="pubcommentClick(' + result.data.list[i].id + ',' + result.data.list[i].id + ',1)">' + comment + '</a>' +
                '</div></div></div></div>';
        }

    }
    $('#squareList').append(list);
    showMessage(result);
}

//切换状态
function showMessage(result){
    if (result.data.page.pages > result.data.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#squareList').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.data.page.pages == result.data.page.currentPage && result.data.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#squareList').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.data.list.length == 0){
        $('#squareList').html(commonNoMoreContent("暂无发现"));
    }
}
function gotoTopicHtml(id){
    window.location.href ="/articles/topicqanda.html?id="+id;

}
//加载更多时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    var curindex=$("#searchtype").length>0?$("#searchtype").val():0;
    getSquarePageListRequest(curindex);
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
//展开全文按钮
function showAlltext(id){
  // $('#text'+id+'').removeClass("-webkit-line-clamp":5);
 // $('#text'+id+'').toggleClass("text-style-lines");
  if ($('#text'+id+'').hasClass("text-style-lines")) {
    $('.show-more').text("收起");
  }else{
    $('.show-more').text("全文");
  }
  $('#text'+id+'').toggleClass("text-style-lines");
}



function myClose(){
    /**
	var curindex=$("#searchtype").length>0?$("#searchtype").val():0;
	writeClientSession('square-page-searchtype',curindex);
    if (backBool == 1) {
        removeClientSession('square-page'+indexID+'-position');
        removeClientSession('square-page'+indexID+'-page');
    }else{
        var position = $('.page__bd').scrollTop();
        writeClientSession('square-page'+indexID+'-position',position);
        writeClientSession('square-page'+indexID+'-page',currentPage);
    }*/
}

//增加发布按钮
function AddBut(){
    if($("#sendMessage").length>0){
        $("#sendMessage").remove();
    }
    $('body').append('<a class="publish-btn publish-btn-square bg-white " id="sendMessage"><img src="../bdt/images/publish_pen.png" /></a>');
    //显示发布选项

    $('#sendMessage').click(function(e){//显示发布选项
        $('.publish-type').fadeIn();
        $('.publish-type-list').css('margin-top',-$('.publish-type-list').height()/2);
    });
}


function saveStatusBeforeJump(){
    var pageUrl = window.location.href;
    var pageBodyHtml = $("body").html();

    var pageGlobalData = new Object();
    pageGlobalData["currentPage"] = currentPage;
    pageGlobalData['totalPage'] = totalPage;
    pageGlobalData['flag'] = flag;
    pageGlobalData['userTest'] = userTest;
    pageGlobalData['position'] = $('.page__bd').scrollTop();
    //pageGlobalData['backBool'] = 1;
    pageCacheAndBackUtils.cachePageDataBeforeJump(pageUrl,pageGlobalData,pageBodyHtml);
}

$(window).load(function(){
    var scrollPosition = readClientSession("scrollPosition");
    if(scrollPosition != null){
        $('.page__bd').scrollTop(scrollPosition);
    }
    removeClientSession("scrollPosition");

});


