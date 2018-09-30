var loupanId = "";
var heightScroll ="";
var userTest = "";
var datetime = new Date();
var currentPageArr = new Array(1,1,1,1);
var totalPageArr = new Array(0,0,0,0);
var flagArr = new Array(0,0,0,0);
var currentIndex = 0;
var backBool = 0;
var appType = "";
var focusStatusStr = 0;
var start= 0;
var pernum = 8;
var currentPage=1;
var flag = 0;

$(document).ready(function() {
	//查看是否关注
    ifconcern();
   //关注
    $('#loupanAddFocus').click(function(e) {//关注
        concern();
    });
    $('#loupanCancelFocus').click(function(e) {//取消关注
        concern();
    });
	//内容切换导航点击效果
	$('#pagenavbar>span').each(function(index, element) {
		$(this).click(function(e) {
			//$('#pagenavbar>span').removeClass('fwb').find('i').hide();
			//$(this).addClass('fwb').find('i').show();
			// columnToggle(index);
		});
	});
    $('#loupanAsk').click(function(){
    	// 初始化
    	start = 0;
        currentPage = 1;
        flag = 0;
    	findExperts();
        $('#downloadMoreData').remove();
        $('#container-expert').show();
    });
    $('#loupanAsk1').click(function(){
        $('#container-expert').show();
        $('.publish-type').css('display','none');
    });
    $('#loupanAskInPub').click(function(){
        $('#container-expert').show();
    });
    $('#closeExpertList').click(function(e) {
        // 初始化
        start = 0;
        currentPage = 1;
        flag = 0;
        requestLoupanInfoData();
        $('#container-expert').hide();
    });

    //显示发布选项
	$('#loupanPub').click(function(e) {
		$('.publish-type').fadeIn();
		$('.publish-type-list').css('margin-top',-$('.publish-type-list').height()/2);
		//绑定楼盘发表下面的提问按钮
		$("#loupanAskInPub").click(function(){
			$('.publish-type').fadeOut();
			$('#container-expert').show();
		}); 
	});
    $('#closePubBtn').click(function() {
        $('.publish-type').css('display','none');
    });

	//页面滚动-分页加载更过数据
    $('#expertpage').scroll(function(){

        if ($(this).scrollTop() >= 150) {
            $(".userpage-container .page__hd").addClass("bg-white b-b-grey");
            $(".userpage-container .page__hd h2").fadeIn().addClass('fc-black');
            $(".userpage-container .page__hd .statebar .left-act img").attr('src','../bdt/images/nav_icon_back1.png');
            $(".userpage-container .page__hd .statebar .right-act img").attr('src','../bdt/images/nav_icon_share1.png');
        }else{
            $(".userpage-container .page__hd").removeClass("bg-white b-b-grey");
            $(".userpage-container .page__hd h2").fadeOut().removeClass('fc-black');
            $(".userpage-container .page__hd .statebar .left-act img").attr('src','../bdt/images/nav_icon_back.png');
            $(".userpage-container .page__hd .statebar .right-act img").attr('src','../bdt/images/nav_icon_share.png');
        }
        if (flag==0){
            var a = "";
            if ($('#downloadMoreData').length > 0){
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    flag = -1;
                    downloadMoreData();
                }
            }
        };
    });

    $('#page__bd').scroll(function(){

        if ($(this).scrollTop() >= 150) {
            $(".userpage-container .page__hd").addClass("bg-white b-b-grey");
            $(".userpage-container .page__hd h2").fadeIn().addClass('fc-black');
            $(".userpage-container .page__hd .statebar .left-act img").attr('src','../bdt/images/nav_icon_back1.png');
            $(".userpage-container .page__hd .statebar .right-act img").attr('src','../bdt/images/nav_icon_share1.png');
        }else{
            $(".userpage-container .page__hd").removeClass("bg-white b-b-grey");
            $(".userpage-container .page__hd h2").fadeOut().removeClass('fc-black');
            $(".userpage-container .page__hd .statebar .left-act img").attr('src','../bdt/images/nav_icon_back.png');
            $(".userpage-container .page__hd .statebar .right-act img").attr('src','../bdt/images/nav_icon_share.png');
        }
        if (flag==0){
            var a = "";
            if ($('#downloadMoreData').length > 0){
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    flag = -1;
                    downloadMoreDataList();
                }
            }
        };
    });
	
//得到关于这个主题的所有文章
    requestLoupanInfoData();

});
//查看是否关注
function ifconcern(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/dianzan/ifconcern.html',
        dataType: "json",
        async: true,
        data:{
            'type':'themes',
            "themeid":request('id'),
            "_csrf":csrf,
        },
        success: function(result) {
            clearToastDialog();
            if (result.result == "success"){
                if(result.data.currStatus == 1){
                    $('#loupanAddFocus').hide();
                    $('#loupanCancelFocus').show();
                }else{
                    $('#loupanAddFocus').show();
                    $('#loupanCancelFocus').hide();
                }

            }else{
                dataLoadedError(result.message);
            }
        }
    });
}
function concern(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/dianzan/concerns.html',
        dataType: "json",
        async: true,
        data:{
        	'type':'themes',
            "themeid":request('id'),
            "_csrf":csrf,
        },
        success: function(result) {
            clearToastDialog();
            if (result.result == "success"){
               if(result.data.currStatus == 1){
                   $('#loupanAddFocus').hide();
                   $('#loupanCancelFocus').show();
			   }else{
                   $('#loupanAddFocus').show();
                   $('#loupanCancelFocus').hide();
			   }

            }else{
                dataLoadedError(result.message);
            }
        }
    });
}


//获取主题信息
function requestLoupanInfoData(){
	dataLoading("数据加载中...");
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
	$.ajax({
		type: "post",
		url: '/articles/themes.html',
		dataType: "json",
		async: true,
		data:{
			"themeid":request('id'),
            'start':start,
            "pernum":pernum,
            "currentPage": currentPage,
            "_csrf":csrf,
		},
		success: function(result) {
            clearToastDialog();
			if (result.result == "success"){
                loupanPageList(result);
			}else{
				dataLoadedError(result.message);
			}
		}
	});
}
//获得主题下的相关信息
function loupanPageList(result){
    var list = '';
    for(var i=0;i<result.format.length;i++){
		time = result.format;
	}
    for(var i=0;i<result.data.length;i++){
        list +='<div class="f-f-module mb10 bg-white"><div class="find-container"><div class="find-header"><div class="f-h-left">' +
			'<a><img src="'+result.file+result.data[i].user.photo+'"><i><img src="../bdt/images/v2.png"></i></a>' +
			'<div class="f-h-middle"><span class="fs30 fc-blue operate"><a>'+result.data[i].user.nickname+'</a></span>' +
			'<span class="fs22 publish-time fc-black456">'+time[i]+'</span></div></div>' +
			'<div class="f-h-right"><span class="pubtype fc-greyabc fs32">' +
			'<i>·</i><em class="fs24">发表</em><i>·</i></span></div></div><a><div onclick="gotoDetail('+result.data[i].id+')" class="module-content mt10">' +
			'<h4 class="f-l-height fs30 find-text fwb mb5">'+result.data[i].title+'</h4>' +
			'<p class="text-style fs28 fc-black face_tag mb10 hint-more">'+result.data[i].summary+'</p></div></a></div></div>';
    }
    $('#loupanPageList').append(list);
    showMessageList(result);
}
function gotoDetail(id){
	window.location.href="/articles/article_detail.html?id="+id;
}
//栏目切换方法
function columnToggle(index){
	currentIndex = index;
	$('#loupanPageList').html('');
	getMyAllContentsData();
	
	$('#pagenavbar>span').removeClass('fwb').find('i').hide();
	$('#pagenav'+currentIndex).addClass('fwb').find('i').show();
	
	currentPageArr = new Array(1,1,1,1);
    totalPageArr = new Array(0,0,0,0);
	flagArr = new Array(0,0,0,0);
}





//寻找专家yanli
function findExperts(){
	var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: '/expert/find.html',
        dataType: "json",
        async: true,
        data:{
        	"typeid":-1,
            'start':start,
            "pernum":pernum,
            "currentPage": currentPage,
			"_csrf":csrf,
        },
        success: function(result){
            clearToastDialog();
            if (result.result == "success"){
                listExperters(result);
            }else{
                dataLoadedError(result.message);
            }
        }
    });
}

//获取每个分类下的专家
function listExperters(result){
    var list = '';
    for(var i=0;i<result.list.length;i++){
        //专家标签
        var tags = "";
        if(result.list[i].user.tags){
            var arraytags = JSON.parse(result.list[i].user.tags);
            if(arraytags.length !=0){
                for (var a = 0; a < arraytags.length; a++) {
                    tags +='<span>'+arraytags[a]+'</span>';
                }
            }
        }
        //专家价格
		if(result.list[i].price == "0.00"){
            price = '免费提问';
            status = 'expert-free-fee';
		}else{
            price = ''+result.list[i].price+'元提问';
            status = 'expert-askbtn';
		}

        list +='<div class="appui-expert bg-white"><div class="appui-expert-headpic-level">' +
			'<img class="appui-expert-headpic" src="../bdt/images/user_25764_100.jpg">' +
			'<i><img src="../bdt/images/v_loupan.png"></i></div>' +
			'<div class="appui-expert-info">' +
			'<a class="appui-expert-askbtn fs24 fc-white '+status+'" onclick="gotoWen('+result.list[i].user.id+')" ' +
			'style="display:block">'+price+'</a> ' +
			'<h3 class="appui-expert-name fs30 fc-black">'+result.list[i].user.nickname+'</h3>' +
			'<p class="appui-expert-introduce fs24 fc-grey666 mt5">'+result.list[i].user.slogan+'</p> ' +
			'<div class="appui-expert-tags fs18 mt5 fc-greyabc">' +
			'<p class="appui-expert-tags-industry">'+tags+'</p><span style="display:block">0个动态</span> </div> </div> </div>';
    }
    $('#expertList').append(list);
    showMessage(result);
}
function gotoWen(id){
	window.location.href="/questions/wen_questions.html?id="+id;
}
function showMessage(result){
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#expertList').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#expertList').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.list.length == 0){
        $('#expertList').html(commonNoMoreContent("暂无专家"));
    }
}
function showMessageList(result){
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#loupanPageList').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#loupanPageList').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.list.length == 0){
        $('#loupanPageList').html(commonNoMoreContent("暂无专家"));
    }
}
//加载更过-拼命加载中...时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    findExperts();
}
function downloadMoreDataList() {
    currentPage++;
    requestLoupanInfoData();
}



//请求楼盘帖子列表
function getMyAllContentsData(){
	// data:{"page":"","loupan":"id"}
	if (currentPageArr[currentIndex]==1) {
		dataLoading("数据加载中...");
	}
	//判断类型
	var curtype="all";
	if(currentIndex==1){
		curtype="jx";
	}else if(currentIndex==2){
		curtype="wd";
	}else if(currentIndex==3){
		curtype="dp";
	}
	$.ajax({
		type: "post",
		url: getLouPanMyAllContents,
		dataType: "json",
		async: true,
		data:{"page":currentPageArr[currentIndex],"loupanId":loupanId,"type":curtype},
		success: function(result){
			clearToastDialog();
			if (result.result == "success"){
				currentPageArr[currentIndex] = result.data.page.currentPage;
				totalPageArr[currentIndex] = result.data.page.pages;
				configMyAllContentsUI(result.data.list,currentIndex);
			}else{
				dataLoadedError(result.message);
			}
		}
	});
}





//去详情
function gotoSquareDetailHtml(id){
    window.location.href = "square_detail.html?id="+id;
}

//去提问-判断是否向自己提问
function gotoQuestionsHtml1(id,e,publishLocationId){
	userTest = getSessionUserNoRedirectEx();
	if(userTest == null){
		userTest = getSessionUser();
	}else if (id==userTest.id) {
        dataLoadedError("非常抱歉您不能向自己提问");
    }else{
        window.location.href = "qanda_questions.html?publishLocationId="+publishLocationId+"&id="+id;
    }
    e ? e.stopPropagation() : event.cancelBubble = true;
    event.cancelBubble = true;
}


//离开页面执行的动作
function myClose(){
    if(backBool == 1) {
     	writeClientSession("sendMessageStatus");
        writeClientSession("loupanIndex");
    }else{
        var sendMessageStatus = readClientSession("sendMessageStatus");
		var position = $('.page__bd').scrollTop();
        if(sendMessageStatus!=0){
        	writeClientSession("sendMessageStatus",1);
        	writeClientSession("loupanIndex",currentIndex);
			writeClientSession('loupan-position',position);
        }
    }
}

