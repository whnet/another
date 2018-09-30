var page = 1;
var currentPage = 1;
var totalPage = 1;
var moreDataflag = 0;
var categorycurrentVoiceID = 0;
var userTest = null;
var swiperGroups = null;
var isPcOrMobil = false;//默认移动端
var closeSwiper = 1;
var pernum=6;
var start = 0;

// iosAPP屏蔽 start
window.onload = function(){
        $("#indexNoticeMsg").hide();
};
// iosAPP屏蔽 end


$(document).ready(function() {
    $("#audio-mc").attr("src","");
    configSwiperUI();

    $('#sendMessage').click(function() {
        $('.publish-type').fadeIn();
        $('.publish-type-list').css('margin-top',-$('.publish-type-list').height()/2);
    });
    $('#closePubBtn').click(function() {
        $('.publish-type').fadeOut();;
    });
	
    $("#iosDialog1 .tips_close").on('click',function(event){event.preventDefault();$("#iosDialog1").hide();});//关闭弹框
    $("#iosDialog1 .tips_content").on('click',function(event){event.preventDefault();location.href = "/mycoupon.html";});//优惠券弹框提示点击进入优惠券页面

	
	
	//点击搜索对应操作
    $('#searchID').click(function(){
        $('body').append(initSearchUI());
        $('.search-container').show();
        set_focus();
    });

	//消息提醒点击对应操作
    $('.right-icon').click(function(){
            window.location.href = "/members/myhomepage.html?read=0";
    });
//请求页面数据
    getSquarePageListRequest();
	//页面滚动
	$('.page__bd').scroll(function(){
		if ($(this).scrollTop()<=100){//滚动过程中对头部导航和消息提示做出操作
			$("#topBigDiv").removeClass('b-b-greyf1 bg-white');
			$("#topBigDiv .right-icon>img").attr("src","../bdt/images/notice1.png");
		}
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



	//滚动事件监听-处理头部消息提醒图片问题
	document.addEventListener('touchstart', function (ev) {
		if ($(".index_entrance").offset().top>0){
			closeSwiper = 1;
			$("#topBigDiv").removeClass('b-b-greyf1 bg-white');
			$("#topBigDiv .right-icon>img").attr("src","../bdt/images/notice1.png");
		}
	},false);
	document.addEventListener('touchend', function (ev) {
		if ($(".index_entrance").offset().top<=0) {
			closeSwiper = 0;
			$("#topBigDiv").addClass('b-b-greyf1 bg-white');
			$("#topBigDiv .right-icon>img").attr("src","../bdt/images/notice.png");
		}else{
			closeSwiper = 1;
			$("#topBigDiv").removeClass('b-b-greyf1 bg-white');
			$("#topBigDiv .right-icon>img").attr("src","../bdt/images/notice1.png");

		}
	}, false);
    var expert = $('input[name="expert"]').val();
   if(expert){
       noRead();
   }

});


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
                $('.nums').text(data.nums);
                $('.nums').addClass('bg-red');
                $("#downloadBar").show();
            }
        }
    });

}


//配置轮播图
function configSwiperUI(){
	var mySwiper = new Swiper('.swiper-container',{
		autoplay: 3500,//可选选项，自动滑动
		pagination: '.swiper-pagination',
		paginationClickable: true,
		autoHeight: true,
		autoplayDisableOnInteraction : false,
		onSlideChangeStart: function(swiper){
			var indexNum = swiper.activeIndex;
	    },
	});
	mySwiper.onResize();
}


function gotoQADetailHtml(id, e){
    var element = $((e ? e.target:event.target)).parents(".f-f-module")[0];
    if(typeof element == 'undefined'){
        setElementClickStyle(e ? e.target:event.target);
    }else{
        setElementClickStyle(element);
    }
	(typeof saveStatusBeforeJump!='undefined')&&saveStatusBeforeJump();//首先将当前页面的数据和状态保存下来，方便跳转回来保持状态
	window.location.href = "qanda_detail.html?id="+id;
}

function getSquarePageListRequest(){
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    $.ajax({
        type: "post",
        url: '/articles/recarticle.html',
        dataType: "json",
        async: true,
        data: {
            "currentPage": currentPage,
			"start":start,
			"pernum":pernum,
			"_csrf":csrf,
        },
        success: function(result) {
            if (result.result == "success") {
            	currentPage = result.data.page.currentPage;
				totalPage = result.data.page.pages;
				configDynamicList(result,2);
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}


//生成数据列表
function configDynamicList(result,index){
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
        if(result.data.list[i].expert){
            var vip = '<i><img src="../bdt/images/v2.png"></i>';
            var username = result.data.list[i].expert.realname;
            var info=result.data.list[i].expert.honor;
        }else{
            var vip = '';
            var username = result.data.list[i].user.nickname;
            var info= ' ';
        }
        if(result.data.list[i].user){
            list += '<div class="f-f-module mb10 bg-white"><div class="find-container">' +
                '<div class="find-header" onclick="window.location.href=\'/expert/expert_detail.html?id='+result.data.list[i].user.id+'\'">' +
                '<div class="f-h-left">' +
                '<a><img src="' + result.data.list[i].user.photo + '">' +vip+ '</a><div class="f-h-middle">' +
                '<span class="fs30 fc-blue operate">' + username + '<em class="fc-greyabc"></em></span>' +
                // 专家简介
                '<span class="fs24 operat mt5">' + info + '</span>' +
            '</div></div><div class="f-h-right"></div></div>' + contents + '<div class="time-statistic fs22" id="bottom_1_' + result.data.list[i].id + '">' +
            '<span class="fc-greyabc mr10"><i>' + getDateDiff(result.data.list[i].created) + '</i></span>' +
            '<span class="fc-greyabc"><i>' + result.data.list[i].counts + '</i>阅读</span>' +
            '<span class="fc-red"></span><div class="statistic">' +
            '<a class="like fc-greyabc ' + onFcRed + '" onclick="dianzanClick(' + result.data.list[i].id + ',1,' + result.mid + ')" id="dianzan' + result.data.list[i].id + '">' + dianzan + '</a>' +

            '<a class="comment ml10 fc-greyabc" id="comment' + result.data.list[i].comment + '" onclick="pubcommentClick(' + result.data.list[i].id + ',1,' + result.com + ',this,1)" >' + comment + '</a>' +

            '<a class="comment_num ml10 fc-greyabc" id="comment_num_'+ result.data.list[i].id+'"  href="javascript:void(0)" ></a>'+
            '</div></div></div></div>';
        }
    }

    $('#indexSquareList').append(list);
    showMessage(result);
}
function showMessage(result){
    if (result.data.page.pages > result.data.page.currentPage) {
        if (moreDataflag=-1) {
            moreDataflag = 0;
        };
        $('#downloadMoreData').remove();
        $('#indexSquareList').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.data.page.pages == result.data.page.currentPage && result.data.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#indexSquareList').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.data.list.length == 0){
        $('#indexSquareList').html(commonNoMoreContent("暂无文章"));
    }
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

//加载更过-拼命加载中...时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    getSquarePageListRequest();
}

//audio播放语音
function audioAutoPlay(id){
    var audio = document.getElementById(id);
    audio.play();
    document.addEventListener("WeixinJSBridgeReady", function (){
		audio.play();
    }, false);
}






$(window).load(function(){
    var scrollPosition = readClientSession("scrollPosition");
    if(scrollPosition != null){
        $('.page__bd').scrollTop(scrollPosition);
    }
    removeClientSession("scrollPosition");
    
});



function IsPC()  
{  
   var userAgentInfo = navigator.userAgent;  
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
   var pcOrMobil = true;  
   for (var v = 0; v < Agents.length; v++) {  
	   if (userAgentInfo.indexOf(Agents[v]) > 0) { pcOrMobil = false; break; }  
   }  
   return pcOrMobil;  
}
function gotoLou(id){
    window.location.href = "/loupan/loupan_page.html?id="+id;
}



// 点击查看评论
$(document).ready(function(){
    var comment=$('.comment_num');
     var num=$('.comment_num').parent(".f-f-module").find(".comment").text();
     console.log(num);
    if(num==0){
        $('.comment_num').parent(".f-f-module").find(".comment_num").removeClass("on");
    }else if(num!=0){
        alert("1")
        $('.comment_num').parent(".f-f-module").find(".comment_num").addClass("on");
    }
})



// onFcRed = "";
// if(result.data.list[i].dianzan.length){
//     for(var j=0;j<result.data.list[i].dianzan.length;j++){
//         if(result.mid == result.data.list[i].dianzan[j].member_id){
//             onFcRed += 'on fc-red';
//         }else{
//             onFcRed += '';
//         }
//     }
// }
//
// //循环点赞
// if(result.data.list[i].dianzan){
//     var dianzan = result.data.list[i].dianzan.length;
// }else{
//     var dianzan = 0;
// }
// //循环评论
// if(result.data.list[i].comment){
//     var comment = result.data.list[i].comment.length;
// }else{
//     var comment = 0;
// }

