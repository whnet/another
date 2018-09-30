//不是土豪金额
var isTuhaoAct = 0;
var url = location.href;
var payParam = "";
var targetid=0;
var type=0;

var appType = "";
$(document).ready(function() {
    appType = readClientSession("appType");
    /*if (appType==isApp) {
     var oHead = document.getElementsByTagName("head")[0];
     var oScript = document.createElement("script");
     var appVersions = readClientSession("appVersions");
     if (appVersions.indexOf("ios")>-1) {
     oScript.src = "../../themes/js/webApp/ios/cordova.js";
     }else{
     oScript.src = "../../themes/js/webApp/cordova.js";
     }
     oHead.appendChild(oScript);
     }*/

    initOs.setCallBack({
        app: function(){
            initOs.loadOverFn('../../themes/js/webApp/app.js');
        }
    });

    var rewardtips='<div class="js_dialog" id="js_dialog_reward" style="display:none;z-index:5;">'+
        '<div class="appui-mask"></div>'+
        '<div class="appui-helptext bg-white" id="helptext" style="display:none;">'+
        '<h2 class="appui-helptext-hd fs32 fc-black b-b-grey">打赏说明</h2>'+
        '<div class="appui-helptext-bd fc-black456 b-b-grey">'+
        '<div class="appui-helptext-bd-con fc-black">'+
        '<p class="fs30 mb10">1、提问者所提出的问题被成功回答后，通过其他第三人的付费收听来获得收入。每被付费收听一次，获得<span id="touListenFee">0</span>元；</p>'+
        '<p class="fs30 mb10">2、行家通过回答他人提出的问题来获得收入。每成功回答一条，获得相应金额；</p>'+
        '<p class="fs30 mb10">3、行家通过回答问题被第三人付费收听来获得收入。每被付费收听一次，获得<span id="touListenFee1">0</span>元；</p>'+
        '<p class="fs30 mb10">4、若问答被分享，通过分享页面进入付费收听而产生的收益，分享者获得<span id="shareListenShare">0</span>元，提问者与回答者均获得<span id="shareListenQA">0</span>元；</p>'+
        '<!-- 		<p class="fs30 mb10">5、若问答被连续二次分享，通过连续二次分享页面进入且付费收听而产生的收益，二次分享者获得<span id="lv2ShareListenShare">0</span>元，提问者、回答者与一次分享者均获得<span id="lv2ShareListenQA">0</span>元；</p> -->'+
        '<p class="fs30 mb10">5、所有收入扣除<span id="qaFeeRate">0</span>作为平台佣金。账户余额大于<span id="minPayCash">0</span>元，每日21点系统自动将账户里的余额划到微信钱包内，用户也可前往“律乎”公众号提现；</P>'+
        '<p class="fs30 mb10">6、备注：免费围观券收听，行家、提问者、分享者都没有收益。</p>'+
        '</div>'+
        '</div>'+
        '<h2 class="appui-helptext-fd fs32 fc-orange">知道了</h2>'+
        '</div>'+
        '</div>';
    $("body").append(rewardtips);

    var rewardinner="<div id='container-reward' class='container bg-white' style='display:none;z-index:4;'><div id='page'>"+
        "<!--页面导航栏-->"+
        "<div class='page__hd fc-white rewardbg words_act'>"+
        "<div class='statebar'>"+
        "<a class='nav-act left-act' id='certifyHome' href='javascript:void(0);'><img src='../bdt/images/nav_icon_back.png' /></a>"+
        "<h2 class='fs34'>打赏</h2>"+
        "<span class='nav-act right-act fs24 fc-white' style='width:3rem; text-align:center; display:none;' id='rewardTips'>打赏说明</span>"+
        "</div>"+
        "</div>"+
        "<div class='page__bd'>"+
        "<div class='reward-layout'>"+
        "<div class='bg-headpic'>"+
        "<img src='../bdt/images/reward_headbg.png' />"+
        "<i><img id='touserpic' src='' /></i>"+
        "</div>"+
        "<!--打上金额选择-->"+
        "<div class='reward-amount'>"+
        "<h3 class='fs34 fc-red'>请选择打赏金额：</h3>"+
        "<ul class='reward-amount-list fs34'>"+
        "<li class='reward-amount-item mt10' amount='1' changeColor='0'>1元</li>"+
        "<li class='reward-amount-item mt10 on' id='amount5' amount='5' changeColor='1'>5元</li>"+
        "<li class='reward-amount-item mt10' amount='10' changeColor='0'>10元</li>"+
        "<li class='reward-amount-item mt10' amount='20' changeColor='0'>20元</li>"+
        "<li class='reward-amount-item mt10' amount='50' changeColor='0'>50元</li>"+
        "<li class='reward-amount-item mt10' id='tuhaoAct'>土豪随意</li>"+
        "</ul>"+
        "</div>"+
        "<!--土豪做法-->"+
        "<div class='tuhao-reward' id='tuhaoReward' style='display:none;'>"+
        "<h3 class='fs34 fc-red'>土豪请随意：</h3>"+
        "<input type='text' class='amount-input mt10 fs34' placeholder='请输入打赏金额' id='tuhaoRewardAmount' />"+
        "</div>"+
        "<a class='reward-pay fs34' onclick='confirmPayReward()'>确认支付</a>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "</div>";

    $("body").append(rewardinner);


    $('.reward-amount-item').each(function(index, element) {
        $(this).click(function(e) {
            $('.reward-amount-item').removeClass('on');
            $(this).addClass('on');
            if($(this).attr('id')=='tuhaoAct'){
                $('#tuhaoReward').fadeIn();
                isTuhaoAct = 1;

            }
            else{
                $('#tuhaoReward').fadeOut();
                $(".reward-amount-item").attr("changeColor","0");
                $(this).attr("changeColor","1");
                isTuhaoAct = 0;
            }
        });
    });

    //打赏说明
    $('#rewardTips').click(function(e) {

        $('#js_dialog_reward').show();
        $('#helptext').show();
//		setTimeout(function() {
        $('#helptext').css('margin-top', -$('#helptext').height() / 2);
        if ($('#helptext').height() >= Math.floor($('body').height() * 0.70)) {
            $('#helptext').find('.appui-helptext-bd').height($('#helptext').height() - $('.appui-helptext-hd').height() - $('.appui-helptext-fd').height());
        }
//		}, 1000);
    });

    $('.appui-helptext-fd').click(function(e) {
        $('.js_dialog').hide();
        $('#helptext').hide();
        $('#helptext').css({
            'margin-top': '0',
            'height': 'auto'
        });
    });

    //绑定打赏跳转
    $('#certifyHome').click(function(e) {
        $("#container-reward").hide();
// 		$("#livereward").hide();
    });
});
function openRewardPage(targetId,targetType,imgsrc){//alert(88);
    targetid=targetId;
    type=targetType;
    if(imgsrc!=null && (imgsrc.indexOf("_80")>0 || imgsrc.indexOf("_48")>0)){
        imgsrc=imgsrc.replace("_48","_100").replace("_80","_100");
    }else if(imgsrc!=null && imgsrc.indexOf("_100")<0){
        imgsrc=insertImgType(imgsrc,3);
    }
    $("#touserpic").attr("src",imgsrc);
    $('#container-reward').show();
}

//function rewardClose(obj){
//	$('#container').hide();
//}

function confirmPayReward(){
    var amount=0;
    //是土豪
    if(isTuhaoAct){
        amount = $("#tuhaoRewardAmount").val();
        if(amount*100>=1){}else{
            var reg = /^[0-9]+(.[0-9]{2})?$/;
            if(!reg.test(amount)){
                alert("请输入正确格式");
                this.focus();
                return;
            }
        }
    }else{
        var length = $(".reward-amount-item").length;
        for(var i=0; i<length; i++){
            var changeColor = $(".reward-amount-item").eq(i).attr("changeColor");

            if(changeColor=="1"){
                amount = $(".reward-amount-item").eq(i).attr("amount");
                break;
            }
        }
    }
    amount=amount*100;
    submitChatRoomPayRecord(amount,targetid,type);
}


function submitChatRoomPayRecord(amount,targetId,targettype){
    dataLoading("数据加载中...");
    $.ajax({
        type: "post",
        url: "",
        dataType: "json",
        async: true,
        // data:{"tot":"红包总金额（分）","packets":"红包总数量","type":"1-粉丝红包，2-新手红包","splitType":"1-拼手气红包，2-普通红包"},
        data:{"id":targetId,"amount":amount,"type":targettype},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {
                // window.location.href = "square_detail.html?id"+result.data.redPacket.id;
            }else if(result.result=="toPay"){
            //微信支付
            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

function onBridgeReady(){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
            "appId":payParam.appid,
            "timeStamp":payParam.timeStamp,
            "nonceStr":payParam.nonceStr,
            "package":payParam.packageValue,
            "signType":payParam.signType,
            "paySign":payParam.paySign
        },
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                $("#container-reward").hide();
                $('#tuhaoReward').fadeOut();
                $(".reward-amount-item").attr("changeColor","0");
                $('.reward-amount-item').removeClass('on');
                $(".amount5").addClass('on');
                $(".amount5").attr("changeColor","1");
                isTuhaoAct = 0;
                $("#tuhaoRewardAmount").val("");
                $('#container-reward').hide();
//            	ws.send(JSON.stringify({option:3,amount:amount}));
                //显示我的图像在打赏列表中
                GetRewardRecordList(targetid,type);
//				var user=null;
//				if(user == null){
//			        user = getSessionUserNoRedirect();
//			    }
//				$("#waredrecord").append('<i><img src="'+insertImgType(user.headPic,2)+'"></i>');
            }
            else{
                if (res.err_msg=="get_brand_wcpay_request:cancel") {
                    dataLoadedError("取消支付");
                }else if (res.err_msg=="get_brand_wcpay_request:fail") {
                    dataLoadedError("支付失败");
                };
            }
        }
    );
}
//得到打赏记录
function GetRewardRecordList(id,type){
    $.ajax({
        type: "post",
        url: getAwaredListUrl,
        dataType: "json",
        async: true,
        data: {
            "id": id,
            "type":type
        },
        success: function(result) {
            if (result.result == "success") {
                //如果有存在就移除，用于刷新使用的，打赏后刷新列表
                if($(".reward-userlist")!=null){
                    $(".reward-userlist").remove();
                }
                if(result.data.list.length>0){
                    $('#qanda_act_id').append("<div class='reward-userlist mt10' style='text-align:center;'><p class='fs28 fc-black'>本文有这些人打赏</p><div id='waredrecord'></div></div>");
                }
                for (var i = 0; i < result.data.list.length; i++) {//result.data.list.length
                    $("#waredrecord").append('<i><img src="'+insertImgType(result.data.list[i].user.headPic,2)+'"></i>');
//	        		  $("#waredrecord").append('<i><img style="width:2rem;height:2rem;float:left;margin:0.1rem;" src="/data/u18329/18329_1493260130481_min.jpeg?1493260130600"></i>');
                }
            }
        }
    });
}

//app支付后回调函数
function payCallBackFunction(status){
    // 0成功 -1失败 -2取消
    if (status==0) {
        $("#container-reward").hide();
        $('#tuhaoReward').fadeOut();
        $(".reward-amount-item").attr("changeColor","0");
        $('.reward-amount-item').removeClass('on');
        $(".amount5").addClass('on');
        $(".amount5").attr("changeColor","1");
        isTuhaoAct = 0;
        $("#tuhaoRewardAmount").val("");
        $('#container-reward').hide();
        GetRewardRecordList(targetid,type);
    }else if (status==-1) {

    }else if (status==-2) {

    }
}