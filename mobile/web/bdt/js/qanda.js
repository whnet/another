// 图文回答370 
var currentPage = 1;
var totalPage = 1;

var page = 1;
var flag = 0;
var currentIndex = "";
var waveTime = null ;
var typeid = 0;
var start = 0;
var pernum = 4;
var index = 0;

var categorycurrentVoiceID = 0;
var categoryPreID = -1;
var labelIndex = "";

var backBool = 0;
var firstBool = 0;

var qaline = 0;
var qadefaultName = "";
var qadefaultIndex = 0;
var qafirstId = 0;
var qafirstName = 0;

var windowTop=0; //初始话可视区域距离页面顶端的距离
$(document).ready(function() {
    $("#smallNav").css("height","6rem");
    $(".page__hd-tips").css("top","5.1rem");
	//顶部标签展开更多
    $('#showMoreBtn').on('click',function(event) {
        event.preventDefault();

        var Height=$("#smallNav").height();
        console.log(Height)
        if (Height=="120") {
            $("#smallNav").css("height","auto");
            $("#smallNav>div:nth-of-type(1)").css("height","auto");
            $("#smallNav>div:nth-of-type(1)").css("height","auto");
            $(".page__bd ").css("padding-top",$("#smallNav").height());
            // $(".professList").css("padding-top",0);
        }else{
            $("#smallNav").css("height","6rem");
            $("#smallNav>div:nth-of-type(1)").css("height","6rem");
            $(".page__bd ").css("padding-top","6rem");
        }
    });

    $('#expert').click(function(){
          window.location = "found_expert.html";
    });

    $("#iosDialog1 .tips_close").on('click',function(event) {
        event.preventDefault();
        $("#iosDialog1").hide();
    });

    $("#iosDialog1 .tips_content").on('click',function(event) {
        event.preventDefault();
        location.href = "/mycoupon.html";
    });

    $('.notice-tips').click(function(){
        if (userTest==null) {
            window.location.href = "login.html";
        }else{
            writeClientSession("fromIndex",0);
            window.location = "mynotice.html";
        }

    });
    //初始化时加载默认推荐的
    configQAList(0);
    //下拉滚动
    $('.page__bd').scroll(function(){
        if (flag==0) {
            var a = "";
            if ($('#downloadMoreData').length>0) {
                a = document.getElementById("downloadMoreData").offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
                    flag = -1;
                    downloadMoreData(0);
                }
            }
        }


        var scrolls = $(this).scrollTop();//获取当前可视区域距离页面顶端的距离
        if(scrolls>=windowTop){//当B>A时，表示页面在向下滑动
            //需要执行的操作
            windowTop=scrolls;
        }else{//当B
            //需要执行的操作
            windowTop=scrolls;
            var position = $('.page__bd').scrollTop();
            if (position<10) {
                $('#topDiv').show(200);
                $('#topBigDiv').height("2.5rem");
                $('#topBigDiv').addClass("b-b-grey");
            }
        }
        //$('#openTheNav').css('top','4.15rem');//20170309汪飞注释
        $('#openTheNav').hide();
    });

	//头部搜索点击效果
	$('#searchID , #searchID1').click(function(e) {
        $('body').append(initSearchUI());
        $('#searchText').attr('placeholder',"搜索问答");
        $('.search-container').show();
        set_focus();
    });

});

function audioAutoPlay(id){
    var audio = document.getElementById(id);
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play();
    }, false);
}


function getOpenLabel1(data){
    var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
    }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
    }
    });
    $("#openTheNav p:first").html(openDom);
}

function getOpenLabel2(data) {
    var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex('+index+','+data[index].id+',\''+data[index].name+'\',2)\">'+data[index].name+'</span>';
        }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex('+index+','+data[index].id+',\''+data[index].name+'\',2)\">'+data[index].name+'</span>';
        }
    });
    $("#openTheNav p:last").html(openDom);
}

function getFirstLabel(data) {
   var openDom = "";
    var nowIndex = 0;
    $.each(data,function (index,val) {
        if (data[index].id==labelIndex) {
            nowIndex = index;
            openDom+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
        }else{
            openDom+='<span class="fs28 fc-grey666" onclick=\"judgeIndex1('+index+','+data[index].id+',\''+data[index].name+'\',1)\">'+data[index].name+'</span>';
            qafirstId = data[0].id;
            qafirstName = data[0].name;
        }
    });
    $("#smallNav div:first p").html(openDom);
        }

function getLastLabel(data){
    var html = '';
    var nowIndex = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].id==labelIndex) {
            nowIndex = i;
            html+='<span class="fs28 fc-grey666 active" onclick=\"judgeIndex('+i+','+data[i].id+',\''+data[i].name+'\',2)\">'+data[i].name+'</span>';
        }else{
            html+='<span class="fs28 fc-grey666" onclick=\"judgeIndex('+i+','+data[i].id+',\''+data[i].name+'\',2)\">'+data[i].name+'</span>';
     }
    }
    $("#smallNav div:last p").html(html);
}
function labelCommon(index,id,name) {
    currentIndex = index;
    _hmt.push(['_trackEvent', 'label_lists', 'click', name,'次数']);
    if (categoryPreID == id) {
        $("#openTheNav").hide();
        return;
    }
    var categroyCurrentID  = 'a_play_'+categoryPreID+'_'+categorycurrentVoiceID;
    if ($('#'+categroyCurrentID).length>0){
    if (categorycurrentVoiceID!=0&&categoryPreID !=-1) {
        playAudioClickFunction(categorycurrentVoiceID,1,1,'a_play_'+categoryPreID+'_'+categorycurrentVoiceID);
      };
    };
    categoryPreID = id;
    $("#audio-mc").get(0).pause();
    clearInterval(waveTime);
    $(".appui_qanda-voice-wait").hide();
    $(".appui_qanda-voice-wave").show();
    currentPage = 1;
    totalPage = 1;
    $('#questions').html("");
	if($('#topBigDiv').css('top') != '0px'){
		if($('.page__hd-tips').css('display') != 'none'){
			$('.page__bd').css('padding-top','4.05rem');
		}else{
			$('.page__bd').css('padding-top','2.55rem');
		}
	}
    windowTop = 0;
    firstBool = 1;
    currentPage = 1;
    configQAList(index);
}

//如果点击的是非5个主要标签则替换固定标签栏第6个标签
//展开标签第一排点击效果
function judgeIndex1(indexs,id,name,num){
    index = indexs;
    qaline = 1;
    labelCommon(index,id,name);
    needToMove(index,num,id,name);
    if(index>=15){
        $("#smallNav div:first span").eq(15).remove();
        // $("#smallNav div:first p").append('<span class="fs28 fc-grey666 active" onclick=\"judgeIndex1('+index+','+id+',\''+name+'\',2)\">'+name+'</span>');
        $("#smallNav div:first span").removeClass('active');
        $("#smallNav div:first span").eq(15).addClass('active');
    }
    $("#smallNav div:last span").removeClass('active');
    $("#smallNav p:last span").removeClass('active');
    $("#smallNav span").eq(id).addClass('active');
}
//展开标签第二排点击效果
function judgeIndex(index,id,name,num){
    qaline = 2;
    labelCommon(index,id,name);
    needToMove(index,num,id,name);
	$("#smallNav div:first span").eq(15).remove();
	$("#smallNav div:first p").append('<span class="fs28 fc-grey666 active" onclick=\"judgeIndex('+index+','+id+',\''+name+'\',2)\">'+name+'</span>');
    $("#smallNav div:first span").removeClass('active');
    $("#smallNav div:first span").eq(15).addClass('active');
    $("#openTheNav p:first span").removeClass('active');
}

//点击展开的标签后定位固定标签位置以及展开标签中选中的标签
function needToMove(index,num,id,name) {
	//第一排展开标签
    if(num==1){
        $("#smallNav div:first span").removeClass('active');
        $("#smallNav div:first span").eq(index).addClass('active');
        $("#openTheNav p:first span").removeClass('active');
        $("#openTheNav p:first span").eq(index).addClass('active');
    }
	//第二排展开标签
	else{
        $("#smallNav div:last span").removeClass('active');
        $("#smallNav div:last span").eq(index).addClass('active');
        $("#openTheNav p:last span").removeClass('active');
        $("#openTheNav p:last span").eq(index).addClass('active');
    }
    $("#openTheNav").hide();
}

//标签点击后定位当前点击过的标签为位置
function labelPosWhere(index){
    $("#smallNav div:first p").css("overflow","hidden");
    var isGoLeftNow = (($("#smallNav div:last span").outerWidth()+5)*(index+1))/$("#smallNav").outerWidth();
    var minIndex = Math.floor(($("#smallNav").outerWidth()/$("#smallNav div:last span").outerWidth()-1)/2);
    if(isGoLeftNow > 0.5){
        $("#smallNav div:last").animate({scrollLeft : 50*(index-minIndex)},400);
    }
    if(index<=3){
        $("#smallNav div:last").animate({scrollLeft :0},400);
    }
}
/*
1.首先获取3个问题
2.如果屏幕高度超过规定值，继续请求数据。
 */
//初始化下拉加载
function configQAList(){
    getQuestionList();
}
//动态获取每个类型的专家
function getQuestionList(){
    typeid = index;
    dataLoading("数据加载中");
    var nums = pernum * (currentPage - 1);
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/questions/filter.html',
        dataType: "json",
        data: {"typeid": typeid,'start':nums,'currentPage':currentPage,'pernum':pernum, _csrf:csrf},
        success: function (result) {
            clearToastDialog();
            if (result.result == "success") {
                QuestionList(result,typeid);
            } else {
                dataLoading("数据加载失败，请重新刷新");
            }
        },
        complete: function (XMLHttpRequest, status) {
            clearToastDialog();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            clearToastDialog();
        }
    });
}

//赋值数据
function QuestionList(result,typeid){
    var list = '';
    for(var i = 0; i < result.data.length; i++){
        //判断是否点赞了, 如果点赞中的member_id = mid,则证明一点赞
        onFcRed = "";
        if(result.data[i].dianzan.length){
            for(var j=0;j<result.data[i].dianzan.length;j++){
                if(result.mid == result.data[i].dianzan[j].member_id){
                    onFcRed += 'on fc-red';
                }else{
                    onFcRed += '';
                }
            }
        }

        //循环点赞
        if(result.data[i].dianzan){
            var dianzan = result.data[i].dianzan.length;
        }else{
            var dianzan = 0;
        }
        //循环评论
        if(result.data[i].comment){
            var comment = result.data[i].comment.length;
        }else{
            var comment = 0;
        }
        if(result.data[i].member_id == result.mid || result.data[i].expert_id == result.mid){
            listen_type = 'free';
            type_msg = '点击收听';
            read_msg = '点击阅读';
            topay = 0;
        }else{
            if(result.data[i].listen_type == 0){
                listen_type = 'free';
                type_msg = '点击收听';
                read_msg = '点击阅读';
                topay = 0;
            }else if(result.data[i].listen_type == 1){
                listen_type = 'pay';
                type_msg = result.data[i].open_price+'元收听';
                read_msg = result.data[i].open_price+'元阅读';
                topay = 1;
            }
        }
        //是语音还是文字
        if(result.data[i].voice){
            answerContent = '<div class="appui-qanda-answer">' +
                            '<div class="appui-qanda-expertphoto">'+
                            '<img src="'+result.data[i].member.photo+'">' +
                '<i class="appui-userlevel bc-white">' +
                            '<img src="../bdt/images/v2.png"></i></div>' +
                '<div class="appui-qanda-answerstyle voice '+listen_type+'" id="a_play_0_'+result.data[i].id+'" ' +
                            'onclick="playAudioQaClickFunction('+result.data[i].id+',1,1,\'a_play_0_'+result.data[i].id+'\','+result.data[i].listen_type+','+result.data[i].open_price+','+topay+');">'+
                            '<i></i><span class="appui_qanda-voice-wave"><em class="wave1"></em><em class="wave2">' +
                            '</em><em class="wave3"></em>'+
                            '</span><em class="tips">'+type_msg+'</em><span class="appui_qanda-voice-wait" style="display:none;"></span></div>'+
                            '<em class="appui-qanda-answer-time">'+result.data[i].voice_time+'"</em><span class="appui-qanda-answer-listen"></span>' +
                            '</div> ';
        }else if(result.data[i].article){
            answerContent = '<div class="appui-qanda-answer" onclick="questionDetail('+result.data[i].id+')">' +
                '<div class="appui-qanda-expertphoto">'+
                '<img src="'+result.data[i].member.photo+'"><i class="appui-userlevel bc-white">' +
                '<img src="../bdt/images/v2.png"></i></div><div class="appui-qanda-answerstyle pictext '+listen_type+'"><i></i><span class="appui-qanda-answerstyle-wave"></span><em class="tips">'+read_msg+'</em></div>'+
                '<span class="appui-qanda-answer-listen"></span>' +
                '</div> ';
        }

        list += '<div class="appui-qanda-module mb10"><div class="appui-qanda-question" onclick="questionDetail('+result.data[i].id+')">'+result.data[i].question+'</div>'+answerContent+'<div class="appui-qanda-expertinfo">' +
            '<div class="time-statistic fs22" id="bottom_1_'+result.data[i].id+'">' +
            '<span class="fc-greyabc mr10 "><i>'+getDateDiff(result.data[i].created)+'</i></span>' +
            '<span class="fc-greyabc"><i>'+result.data[i].views+'</i>阅读</span>' +
            '<span class="fc-red"></span><div class="statistic">' +
            '<a class="like fc-greyabc '+onFcRed+'" onclick="dianzanClick('+result.data[i].id+',1,'+result.mid+')" id="dianzan'+result.data[i].id+'">'+dianzan+'</a>' +
            '<a class="comment ml10 fc-greyabc" id="pinglun_'+result.data[i].id+'">'+comment+'</a>' +
            '</div></div></div></div>';
    }
    $('#questions').append(list);
    showMessage(result);
}
function questionDetail(id){
    window.location.href="/questions/qanda_detail.html?id="+id;
}
//各种结果的提示用语，单独写成一个方法
function showMessage(result){
    var autoLoad = 0;
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#questions').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#questions').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.data.length == 0){
        $('#questions').html(commonNoMoreContent("暂无问题"));
    }
}

//拼命加载中...时候进行的网络请求；
function downloadMoreData(index) {
    currentPage++;
    getQuestionList(index);
}
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
            "question_id": id,
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

