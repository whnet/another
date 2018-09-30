//圈子id
var id = "";
var price = "";
var payParam = "";
//var tradeId = "";
//var redpacketId = "";

var userTest = "";
var datetime = new Date();
var currentPage = 1;


$(document).ready(function() {
    $("#toPayjoinPrice").click(function(){
        joinQz();
    });



	$('.csd-head-bg').css({
		'margin-top':-$('#container').width()*0.6,
		'top':'50%'
	});
	id = request("id");

});



function chechPayResult(){
	customHistoryUtilsPop();
	dataLoading("正在确认支付结果...");
	var currUrl = window.location.href;
	currUrl = currUrl.replace("needToChkPResult=1","needToChkPResult=0");
	setTimeout(function(){window.location.href=currUrl;},3000);
}



//调起微信支付,如果是免费就直接加入
function joinQz(){
    // dataLoading("数据加载中...");
    var price =$('#toPayjoinPrice').attr('data-price') * 100;
    if(price == 0){
        addCircle(0);
	}else{
        //这里要唤起微信支付
        var csrf = $('input[name="csrf"]').val();
        $.ajax({
            type: "post",
            url: '/circle/wxpay.html',
            dataType: "json",
            async: true,
            data:{
                "title":'circle',
                "pay_id":request('id'),
                "price":price,
                '_csrf':csrf,
            },
            success: function(data) {
              if(data.result == 'success'){
                  getWxConfig(data.config.timestamp, data.config.nonceStr, data.config.package, data.config.signType, data.config.paySign,data.trade);
              }
            }
        });
	}

}
//微信相关
function getWxConfig(timestamp, nonceStr, package, signType, paySign,trade){
    addCircle(trade);
        wx.chooseWXPay({
            timestamp: timestamp,
            nonceStr: nonceStr,
            package: package,
            signType: signType,
            paySign: paySign,
            success: function (res) {
            // 支付成功后的回调后，记录已经加入圈子
                window.location.href = "/circle/circle_page.html?id="+id;
        }
    });
}

//向数据库写数据
function addCircle(trade){

	var csrf = $('input[name="csrf"]').val();
	var price = $('input[name="price"]').val();
	var qid = $('input[name="createid"]').val();//创建者的id
    $.ajax({
        type: "post",
        url: '/circle/addcircle.html',
        dataType: "json",
        async: true,
        data:{
            "cid":id,
            "qid":qid,
            "price":price,
            "trade":trade,
            '_csrf':csrf},
        success: function(result) {
            clearToastDialog();
            if(trade == 0){
                window.location.href = "/circle/circle_page.html?id="+id;
            }

        }
    });
}






function gotoCirclePage(inId){
	window.location.replace("circle_page.html?id="+inId+"&from=index");
}


//获取专栏数据
function getMyAllContentsData() {
	if (currentPage==1) {
		dataLoading("数据加载中...");
	}
	$.ajax({
		type: "post",
		url: getQzContentPageList,
		dataType: "json",
		async: true,
		data:{"page":currentPage,"id":id,"justHost":0,"priorLvl":0},
		success: function(result) {
		clearToastDialog();
		if (result.result == "success") {
			$('#listCount').text("主题预览（"+result.data.page.total+")");
				configMyAllContentsUI(result.data.list);
			} else {
				dataLoadedError(result.message);
			}
		}
	});
}


function configMyAllContentsUI(groups){
	for (var i = 0; i < groups.length; i++) {
		var traceId = 0;
		doStr = listCellHC(groups[i],0);
		$('#listId0').append(doStr);
		$('#showComment_'+groups[i].content.id).css("opacity","0.3");
	}
	// 判断加载更多按钮是否出现
	if($('#downloadMoreData').length>0){
		$('#downloadMoreData').remove();
	}
	if (groups.length==0) {
		$('#listId0').html('<a class="appui_loadmore fs28 fc-greyabc">该圈子暂无内容</a>');
	};	
}


//app支付后回调函数
function payCallBackFunction(status){
    // 0成功 -1失败 -2取消
    if (status==0) {
        dataLoadedSuccess("支付成功");
        setTimeout(gotoCirclePage(id), 1500);
    }else if (status==-1) {

    }else if (status==-2) {

    }
}
