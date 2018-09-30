var page = 1;
var currentPage = 1;
var totalPage = 1;
var moreDataflag = 0;
var pernum=4;
var num = 0;

$(document).ready(function() {
	$('#menmerNum').click(function(){
		window.location.href = "/circle/circle_members.html?id="+request('id');
	});


	$('#moreId').click(function(){
    	window.location.href = "/circle/circle_data_expert.html?id="+request('id');
    });

    $('#back').click(function(){
        window.location.href = "javascript:history.back(-1)";
    });

    //全部主题
    $('#column').click(function(){
    	// $('#expert-pages0').html("");
    	$('.pagenav').removeClass('fwb');
    	$('#column').addClass('fwb');
    	$('.pagenav>i').hide();
    	$('#column>i').show();
    	circleContentType = 0;
    	justHost = 0;
    	priorLvl = 0;
    	currentPageArr[0]=1;

    });

     //只看圈主
    $('#circleMasterContent').click(function(){
    	// $('#expert-pages0').html("");
    	$('.pagenav').removeClass('fwb');
    	$('#circleMasterContent').addClass('fwb');
    	$('.pagenav>i').hide();
    	$('#circleMasterContent>i').show();
    	justHost = 1;
    	circleContentType = 0;
    	priorLvl = 0;
    	currentPageArr[0]=1;
    	getQzContentsData();
    });

	//只看问答
    $('#circleFansQanda').click(function(){
    	// $('#expert-pages0').html("");
    	$('.pagenav').removeClass('fwb');
    	$('#circleFansQanda').addClass('fwb');
    	$('.pagenav>i').hide();
    	$('#circleFansQanda>i').show();
    	circleContentType = 2;
    	justHost = 0;
    	priorLvl = 0;
    	currentPageArr[0]=1;
    	getQzContentsData();
    });

    //只看精华
    $('#circleEssence').click(function(){
    	// $('#expert-pages0').html("");
    	$('.pagenav').removeClass('fwb');
    	$('#circleEssence').addClass('fwb');
    	$('.pagenav>i').hide();
    	$('#circleEssence>i').show();
    	circleContentType = 0;
    	justHost = 0;
    	priorLvl = 1;
    	currentPageArr[0]=1;
    	getQzContentsData();
    });
    //发布
    $('#circlePubBtn').click(function() {
        $('.publish-type').css('display','block');
        $('.publish-type-list').css('margin-top',-$('.publish-type-list').height()/2);
    });
    $('#closePubBtn').click(function() {
        $('.publish-type').css('display','none');
    });
    //页面滚动
    getCircleList();
    $('#page__bd').scroll(function(){
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
//到期日期
//对于圈子去判断是付费还是免费
    yanzheng();


});
//防止多次验证 ，如果状态返回成功就不再请求
function yanzheng(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/circle/deadtime.html',
        dataType: "json",
        async: true,
        data: {
            'id':request('id'),
            "_csrf":csrf,
        },
        success: function(data) {
            if(data.status != 1){
                isFeeQuanzi();
            }
        }
    });
}
//对收费圈子进行判断
function isFeeQuanzi(){
    deadTime();
    var start = setInterval(function(){  deadTime(); }, 2000);
    setTimeout(function(){  delay(start); }, 5000);
}
//取消执行
function delay(start){
    clearInterval(start);
}
//判断到期日期
function deadTime(){
    num++;
    clearToastDialog();
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/circle/deadtime.html',
        dataType: "json",
        async: true,
        data: {
            'id':request('id'),
            "_csrf":csrf,
        },
        success: function(data) {
            if(data.result == 'dead'){
                dataLoading(data.msg);
            }else if(data.result == 'paying'){
                if(data.status != 1){
                    if(num == 1){
                        dataLoading('支付返回结果确认中3秒');
                    }else if(num == 2){
                        dataLoading('支付返回结果确认中2秒');
                    }else if(num == 3){
                        if(data.status == 0){
                            clearToastDialog();
                            dataLoading('支付失败请重新支付');
                            delFailStatus();
                        }

                    }
                }
            }else{
                clearToastDialog();
            }
        }
    });
}
//delete
function delFailStatus(){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/circle/todelete.html',
        dataType: "json",
        async: true,
        data: {
            'id':request('id'),
            "_csrf":csrf,
        },
        success: function(data) {
            window.location.href = '/circle/circle_share_detail.html?id='+request('id');
        }
    });
}
//查看全部的圈内信息
//1.
//发现的数据
function getCircleList(){
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    $.ajax({
        type: "post",
        url: '/articles/circlearticle.html',
        dataType: "json",
        async: true,
        data: {
            "currentPage": currentPage,
            "start":start,
            "pernum":pernum,
			'circle_id':request('id'),
            "_csrf":csrf,
        },
        success: function(result) {
            if (result.result == "success") {
                currentPage = result.data.page.currentPage;
                totalPage = result.data.page.pages;
                circleList(result);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}
function circleList(result){
    var list = "";
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
                '<span class="appui_qanda-voice-wait" style="display:none;"></span></div><em class="appui-qanda-answer-time">3"</em></div></div>';
        }else if(result.data.list[i].videos != "0"){
            detailType = result.data.list[i].content;
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
        if(result.data.list[i].user) {
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
            if(result.data.list[i].expert.vip == 1){
                var vip = '<i><img src="../bdt/images/v2.png"></i>';
                var name = result.data.list[i].expert.realname;
            }else{
                var vip = '';
                var name = result.data.list[i].user.nickname;
            }
            if(result.data.list[i].user){
                list += '<div class="f-f-module mb10 bg-white"><div class="find-container"><div class="find-header"><div class="f-h-left">' +
                    '<a onclick=""><img src="' + result.data.list[i].user.photo + '">' +vip+ '</a><div class="f-h-middle">' +
                    '<span class="fs30 fc-blue operate">' + name + '<em class="fc-greyabc"></em></span>' +
                    '</div></div><div class="f-h-right"></div></div>' + contents + '<div class="time-statistic fs22" id="bottom_1_' + result.data.list[i].id + '">' +
                    '<span class="fc-greyabc mr10"><i>' + getDateDiff(result.data.list[i].created) + '</i></span>' +
                    '<span class="fc-greyabc"><i>' + result.data.list[i].counts + '</i>阅读</span>' +
                    '<span class="fc-red"></span><div class="statistic">' +
                    '<a class="like fc-greyabc ' + onFcRed + '" onclick="dianzanClick(' + result.data.list[i].id + ',1,' + result.mid + ')" id="dianzan' + result.data.list[i].id + '">' + dianzan + '</a>' +
                    '<a class="comment ml10 fc-greyabc" id="pinglun_' + result.data.list[i].id + '" onclick="pubcommentClick(' + result.data.list[i].id + ',' + result.data.list[i].id + ',1)">' + comment + '</a>' +
                    '</div></div></div></div>';
            }
        }

    }

    $('#expert-pages0').append(list);
    showMessage(result);
}


function gotoCircleHtml(id,type){
    window.location.href = "/articles/article_detail.html?id="+id+"&from=circle&publishtype="+type;
}
function showMessage(result){
    if (result.data.page.pages > result.data.page.currentPage) {
        if (moreDataflag=-1) {
            moreDataflag = 0;
        };
        $('#downloadMoreData').remove();
        $('#expert-pages0').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.data.page.pages == result.data.page.currentPage && result.data.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#expert-pages0').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.data.list.length == 0){
        $('#expert-pages0').html(commonNoMoreContent("暂无文章"));
    }
}
//加载更过-拼命加载中；
function downloadMoreData() {
    currentPage++;
    getCircleList();
}




function onloadEvent(){
	$('.dynamic-link').each(function(index, element) {
		$(this).find('span').css('margin-top',-$(this).find('span').height()/2);
	});

	$('.page__bd').scroll(function() {
		// 当滚动到最底部以上161像素时， 给头部导航栏添加暗蓝色背景
		if ($(this).scrollTop() >= 10) {
			$(".userpage-container .page__hd").addClass("bg-white b-b-grey");
			$(".userpage-container .page__hd h2").addClass('fc-black');
			$(".userpage-container .page__hd .statebar .left-act img").attr('src','images/nav_icon_back1.png');
			$(".userpage-container .page__hd .statebar .right-act img").attr('src','images/nav_icon_more1.png');
		}else{
			$(".userpage-container .page__hd").removeClass("bg-white b-b-grey");
			$(".userpage-container .page__hd h2").removeClass('fc-black');
			$(".userpage-container .page__hd .statebar .left-act img").attr('src','images/nav_icon_back.png');
			$(".userpage-container .page__hd .statebar .right-act img").attr('src','images/nav_icon_more.png');
		}
	});

	$('.page__bd').scroll(function() {
		if ($(this).scrollTop() >= 165) {
			$('#circleActbtnBar').css({
				'position':'fixed',
				'top':'2.25rem',
				'left':'0',
				'z-index':'2',
				'box-shadow':'0 0 0.5rem rgba(0,0,0,0.2)'
			});
			$('#expertPageBar').css('padding-top','2.5rem');
		}
		else{
			$('#circleActbtnBar').css({
				'position':'static',
				'box-shadow':'0 0 0.5rem rgba(0,0,0,0)'
			});
			$('#expertPageBar').css('padding-top','0');
		}
	});

	//圈子主业头部背景位置控制
	$('.circle-pagehead-bg').css({
		'margin-top':-$('.circle-pagehead').width()*0.6,
		'top':'50%'
	});
}


function myClose(){
	if (circleName!=null) {
		writeClientSession("cricleName",circleName);
	}
}
function setQzContentPriorLvl(id,priorLvl){
	var plValue = $("#recommendEssence"+id).attr("date-priorLvl");
	$.ajax({
		type:"post",
		url:setQzContentPriorLvlURL,
		dataType:"json",
		async: true,
		data:{"priorLvl":plValue,"id":id},
		success:function(result){
			clearToastDialog();
			if(result.result=="success"){
				if(plValue==1){
					dataLoadedSuccess("推荐成功");
					$("#recommendEssence"+id).attr("date-priorLvl",0);
					$("#recommendEssence"+id).text("精华");
					$("#recommendEssence"+id).removeClass('fc-greyabc').addClass('fc-red cancel');
				}else{
					dataLoadedSuccess("取消成功");
					$("#recommendEssence"+id).attr("date-priorLvl",1);
					$("#recommendEssence"+id).text("推荐");
					$("#recommendEssence"+id).removeClass('fc-red cancel').addClass('fc-greyabc');
				}
			}else{
					dataLoadedError(result.message);
			}
		}
	});
}
