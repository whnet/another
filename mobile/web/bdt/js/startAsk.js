var tiWenQuan = 0;
var currSelectUserId;
var picNextIndex = 0;
var picLen = 0;
var pics = new Array();
var maxInputLength = 140;
var currContent = "";
var currentPage = 1;
var start = 0;
var pernum = 6;

var totalArr = [];

var targertQuestionId = "";
var currentIndex = -1;

var expert_id = '';
var price = '';


$(document).ready(function() {

	// 获取优惠券
    getCoupons(2);

	$("textarea").keyup(function() {
		monitorCount();
	});
	// 获取专家类型yanli
    gotoProfessAjax(0);
    //页面滚动
    $('.page__bd').scroll(function(){
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


});

//优惠券查询
function getCoupons(type){
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        url: '/coupons/nums.html',
        type: 'post',
        dataType: 'json',
        data: {
            "type":type,
            '_csrf':csrf,
        },
        success: function (result){
            if (result.result == "success") {
                if(result.nums>0){
                    tiWenQuan = result.nums;
                    $(".page__hd-tips p span").html(tiWenQuan);
                    $(".page__hd-tips").show();
                    $("#noneCouponSpace").hide();
                    $("#hasCouponSpace").show();
                    $('#coupon_count_id').text(result.nums);
                    $(".page__hd-tips a").on('click', function() {
                        $(".page__hd-tips").hide();
                        $("#noneCouponSpace").show();
                        $("#hasCouponSpace").hide();
                    });
                }else {
                    $(".page__hd-tips").hide();
                    $("#noneCouponSpace").show();
                    $("#hasCouponSpace").hide();
                }
            }
        }
    });
}


function monitorCount() {
	$('textarea').bind('propertychange input', function() {
		var counter = $('textarea').val().length;
		$('#tempNum').text(counter); //每次减去字符长度
		if (counter > maxInputLength) {
			$('#tempNum').text(maxInputLength);
			this.value = this.value.substring(0, 140);
			if ($('.toastDialog').length <= 0) {
				dataLoadedError("您已经超过最大输入个数");
			}
			return false;
		};
	});
}


// 获取行家列表页
function gotoProfessList(index){
	// 保证每次切换都在顶部
	$('#list').scrollTop(0);
    //初始化参数
	if(index != currentIndex){
        currentPage = 1;
        start = 0;
        $('#profCho').html("");
	}

	// 激活标签了，就进行ajax请求

if( $("#oLi" + index).hasClass('active_type') == false){
    gotoProfessAjax(index);
}

}
//筛选专家
function gotoProfessAjax(index){
    $("#typeCho li").removeClass("active_type");
    $("#oLi" + index).addClass('active_type');

	if(index == -1){
		index = currentIndex;
	}
    currentIndex = index;
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    $.ajax({
        url: '/expert/find.html',
        type: 'post',
        dataType: 'json',
        data: {
        	"typeid":index,
            'start':start,
            "pernum":pernum,
            "currentPage": currentPage,
        	"_csrf":csrf,
		},
        success: function(result) {
        	if(result.result == 'success'){
                listExperters(result);
			}

        }
    })

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
                    tags +='<span class="mr5">'+arraytags[a]+'</span>';
                }
            }
        }
        //专家标签
        list +='<div class="appui-expert bg-white">' +
			'<div class="appui-expert-baseinfo">' +
			'<div class="appui-expert-headpic-level" onclick="gotoUserPageHtml('+result.list[i].user.id+')">' +
			'<img class="appui-expert-headpic" src="'+result.list[i].user.photo+'">' +
			'<i><img src="../bdt/images/v2.png"></i>' +
			'</div><div class="appui-expert-info" ' +
			'onclick="askQuestionRequest('+result.list[i].user.id+','+result.list[i].price+',\''+result.list[i].user.nickname+'\',2);">' +
		    '<div class="appui-expert-name-title fs30 fc-black"><p class="appui-expert-name fwb">'+result.list[i].user.nickname+'</p>' +
			'</div>' +
			'<p class="appui-expert-introduce fs26 fc-black mt10">'+result.list[i].des+'</p>' +
			'</div></div>' +
			'</div>';
    }
    $('#profCho').append(list);
    showMessage(result);
}

function showMessage(result){
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#profCho').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#profCho').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.list.length == 0){
        $('#profCho').html(commonNoMoreContent("暂无专家"));
    }
}
//加载更过-拼命加载中...时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    index = currentIndex;
    gotoProfessList(index);
}

// 向行家提问
function askQuestionRequest(userId, money, nickname, level) {
	expert_id = userId;
	price = money;
	if (tiWenQuan) {
		$(".ask_sure span").addClass("use_coupon");
	} else {
		$(".ask_sure span").removeClass("use_coupon");
	}

	if (money > 0) {
		$("#askId").text("￥" + money);
	} else {
		$("#askId").text("免费");
	}
	$("#sendQuest span").text(nickname);
	$("#sendQuest").unbind("click").bind("click",function() {
		currContent = $.trim($("textarea").val());
		if (currContent == "") {
			dataLoadedError("请输入要提问的内容");
			return;
		} else if (userId == 0) {
			dataLoadedError("请选择您想请教的专家。");
			return;
		}
		friendTips("是否确认向这位专家提问", "否", "是", 0);
	});
	$('#page__fd-askBtn').animate({ 'bottom': '0' }, 300);
}
//提交提问信息
function saveFunction(index){
    toSendData();
}
//召唤微信神龙
function toSendData(){
    if(price !=0){

        //发起微信支付，
        var csrf = $('input[name="csrf"]').val();
        $.ajax({
            type: "post",
            url: '/circle/wxpay.html',
            dataType: "json",
            async: true,
            data:{
                "title":'ask',
                "pay_id":expert_id,
                "price":price * 100,
                '_csrf':csrf,
            },
            success: function(data) {
                if(data.result == 'success'){
                    clearToastDialog1(0);
                    getWxConfig(data.config.timestamp, data.config.nonceStr, data.config.package, data.config.signType, data.config.paySign);
                }
            }
        });
    }else{
        askToit();
    }
}
//发起微信支付
function getWxConfig(timestamp, nonceStr, package, signType, paySign){
    wx.chooseWXPay({
        timestamp: timestamp,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        paySign: paySign,
        success: function (res) {
            // 支付成功回调后，向专家提问
            askToit();
        }
    });
}
//提交问题
function askToit(){
    if ($('.qnada-q-data-limit span').attr("class").indexOf("appui_cell__switch-on")>0) {
        var openstatus = 1;
    }else{
        var openstatus = 0;
    }

    if(pics == ''){
        pics = 0;
    }
    var content = $('#content').val();
    var csrf = $('input[name="csrf"]').val();
    dataLoading("向专家提问中...");
    $.ajax({
        url: '/questions/ask.html',
        type: 'post',
        dataType: 'json',
        data: {
            "price": price,
            "expert_id": expert_id,
            "openstatus": openstatus,
            "content": content,
            'pics':pics,
            'from':request('from'),
            'circle_id':request('circle_id'),
            'publishtype':request('publishtype'),
            '_csrf':csrf,
        },
        success: function(result) {
            if (result.result == "success") {
                clearToastDialog();
                dataLoadedSuccess("问题提问成功");
                setTimeout(function() {
                    var id = result.data.id;
                    window.location.replace("qanda_detail.html?id=" + id );
                }, 1500);
            }
        }
    })
}
function loadCurrentProfess(index, event) {
	$(".appui-expert").attr({
		"background": 'transparent',
		"color": '#aabbcc'
	});
}




//app支付后回调函数
function payCallBackFunction(status){
    // 0成功 -1失败 -2取消
    if (status==0) {
		dataLoadedSuccess("问题提问成功");
		setTimeout(function() {
			window.location.href = "qanda_detail.html?id=" + targertQuestionId + "&typeId=3";
		}, 1500);
    }else if (status==-1) {

    }else if (status==-2) {

    }
}

function gotoUserPageHtml(userID){
	window.location.href = "/expert/user_page.html?id="+userID;
}
