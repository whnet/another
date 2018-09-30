// red_packets_fightluck.js

var totleMoney = "";
var packetsCount = "";
var type = "";
var splitType = "";
var maxInputLength = 30;
var payParam = "";
var tradeId = "";
var redpacketId = "";
var notesStr = "";

var publishLocationId = "0";
var publishLocationType = "";
var from ="";

var appType = "";
$(document).ready(function() {
    publishLocationId = request("publishLocationId");
    if (publishLocationId==null) {
        publishLocationId = 0;
    };
    from = request("from");
    if (from=="loupan_page") {
        publishLocationType = "1";
        notesStr = "我在楼盘发了红包，先到先得哟!";
    }else if (from=="circle") {
        publishLocationType = "2";
        notesStr = "我在圈子发了红包，先到先得哟!";
    }else{
        publishLocationType = "";
        notesStr = "我在律乎社区发了红包";
    }
    $('.notes').attr("placeholder",notesStr);

	type = request("type");
	splitType = type;
	if (type==2) {
	    $('.rpf_state>a').removeClass('on');
		$('#normalRed').addClass('on');
		$('.rp_fight_luck_content').hide();
		$('#redpacket1').show();
        monitorCount(1);
	}


//  $('.rpf_state>a').each(function(index, element) {
//        $(this).click(function(e) {
//            $('.rpf_state>a').removeClass('on');
//          $(this).addClass('on');
//          $('.rp_fight_luck_content').hide();
//          $('#redpacket'+index).show();
//          if (index==0) {
//              splitType = 1;
//          }else{
//              splitType = 2;
//          }
//            monitorCount(index);
//        });
//    });
	
	$('#changeType0').click(function(e) {
		$('#redpacket0').hide();
		$('#redpacket1').show();
			splitType = 2;
		monitorCount(1);
	});
	$('#changeType1').click(function(e) {
		$('#redpacket1').hide();
		$('#redpacket0').show();
			splitType = 1;
		monitorCount(0);
	});
	
    monitorCount(0);
})

function monitorCount(index){
    $('#redCount'+index).bind('onpropertychange input', function () {  
        judgeParm(index);
    });
    $('#redMoney'+index).bind('onpropertychange input', function () {  
        judgeParm(index);
    });

    $('#notes'+index).bind('propertychange input', function () {  
        var counter = $('#notes'+index).val().length;
        $('#length'+index).text(counter);   //每次减去字符长度
        if (counter>maxInputLength) {
             $('#length'+index).text(maxInputLength);
             this.value = this.value.substring(0, 30);
             if ($('.toastDialog').length<=0) {
                     dataLoadedError("您已经超过最大输入个数");
             }
             return false;
        };
    });
}

function judgeParm(index){
    var r = /^\d+(\.\d+)?$/ ; //非零的浮点数：
    var reg = /^[1-9]\d*$/;//正整数
    var redCount = $('#redCount'+index).val();
    var redMoney = $('#redMoney'+index).val();
    if (redMoney.indexOf(".")>-1) {
        redMoney = redMoney.substring(0,redMoney.indexOf(".") + 3);
        $('#redMoney'+index).val(redMoney);
    }
    if (reg.test(redCount)&&r.test(redMoney)&&redCount>0&&redMoney>0) {
        
		if (index==0) {
			$('#totalMoney'+index).show();
            $('#totalMoneyAmount'+index).text(redMoney);
        }else{
        	var totleMoney = redMoney*redCount;
			$('#totalMoney'+index).show();
        	$('#totalMoneyAmount'+index).text(totleMoney.toFixed(2));
        }
    }
}
function sendRedPacketFunction(index){
	var redCount = $('#redCount'+index).val();
	var redMoney = $('#redMoney'+index).val();
    var r = /^\d+(\.\d+)?$/ ; //非零的浮点数：
	// var reg = /^[0-9]*[1-9][0-9]*$/; //正整数
    var regExp = /^[1-9]\d*$/;
    var minPrice = redMoney / redCount;

	if (!regExp.exec(redCount)) {
		dataLoadedError("请输入正确的红包个数！");
        return;
	}else if (!r.test(redMoney)) {
        dataLoadedError("请输入正确的红包数额！");
        return;
	}
	if (redCount<=0||redCount >2000) {
		dataLoadedError("您输入的红包个数应该在0-2000之间");
        return;
	}else if (redMoney<=0||redMoney>200) {
		dataLoadedError("您输入的红包金额应该在0-200之间");
        return;
	}
    if(minPrice < 0.01){
        dataLoadedError("请检查红包个数, 最低为0.01元！");
        return;
    }

	if (index==0) {
		// totleMoney =  parseFloat(redMoney)*100;
        totleMoney =  redMoney;
	}else if (index==1) {
		// totleMoney = parseFloat(redMoney)*parseInt(redCount)*100;
		totleMoney = redMoney * redCount;
	};
    // totleMoney = Math.round(totleMoney,2);
	packetsCount = redCount;

    var notes = $('#notes'+index).val();
    if (notes!=""&&notes.length>0) {
	notesStr = $('#notes'+index).val();
    }
    //在微信支付成功之后写入数据库
    Wxpay(totleMoney, packetsCount, type, splitType, notesStr);

}
function Wxpay(totleMoney, packetsCount, type, splitType, notesStr){
    //这里要唤起微信支付
    var csrf = $('input[name="csrf"]').val();
    $.ajax({
        type: "post",
        url: '/circle/wxpay.html',
        dataType: "json",
        async: true,
        data:{
            "title":'redpack',
            "pay_id":request('type'),
            "price": totleMoney *100,
            '_csrf':csrf,
        },
        success: function(data) {
            if(data.result == 'success'){
                getWxConfig(data.trade,data.config.timestamp, data.config.nonceStr, data.config.package, data.config.signType, data.config.paySign, totleMoney, packetsCount, type, splitType, notesStr);
            }
        }
    });
}
//唤起微信,支付成功之后再发红包
function getWxConfig(trade,timestamp, nonceStr, package, signType, paySign,totleMoney, packetsCount, type, splitType, notesStr){
    wx.chooseWXPay({
        timestamp: timestamp,
        nonceStr: nonceStr,
        package: package,
        signType: signType,
        paySign: paySign,
        success: function (res) {
            // 支付成功后的回调后，记录已经加入圈子
            postRedPacketRequest(totleMoney, packetsCount, type, splitType, notesStr,trade);
        }
    });
}
function postRedPacketRequest(totleMoney, packetsCount, type, splitType, notesStr,trade){
    dataLoading("数据加载中...");
    var csrf = $('input[name="csrf"]').val();
    var circle_id = request('circle_id');
    if(circle_id){
        circleId = circle_id;
    }else{
        circleId = 0;
    }
    $.ajax({
        type: "post",
        url: '/pockets/redpackets.html',
        dataType: "json",
        async: true,
		// data:{"tot":"红包总金额（元）","packets":"红包总数量","type":"1-粉丝红包，2-新手红包","splitType":"1-拼手气红包，2-普通红包"},
		data:{
            "tot":totleMoney,
            "packets":packetsCount,
            "type":type,
            "trade":trade,
            "splitType":splitType,
            "notes":notesStr,
            "circle_id":circleId,
            "from":request('from'),
            "publishtype":request('publishtype'),
            _csrf:csrf
        },
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
                if(result.type == 'open'){
                    window.location.href = "/articles/square.html";
                }else if(result.type == 'circle'){
                    window.location.href = "/circle/circle_page.html?id="+circle_id;
                }

            }
        }
    });
}




function myClose(){

}