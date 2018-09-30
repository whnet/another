$(document).ready(function() {
    $("#back").click(function() {
        window.location.href = "javascript:history.back(-1)";
    });
		
		
    $('#focusCount').click(function(){
      location.href="myrelations.html#1?userID=";
    });
    $('#fansCount').click(function(){
      location.href="myrelations.html#2?userID=";
    });
	// $('#sendMessage').click(function(){
	// 	window.location.href = "message_edit.html?publishLocationId="+userID;
	// });

    // $('#focusCount').text(parseInt(focusjia)-1);

});

function changeDiv(currentIndex){
	index = currentIndex;
	//$('#expert-pages0').html('');
	//$('#expert-pages1').html('');
	$('#expert-pages').html('');
	getMyAllContentsData();
	currentPageArr[index] = 1;
	totalPageArr[index] = 0;
	flagArr[index] = 0;
	
	$('.pagenav').find('i').hide();
	$('.pagenav').removeClass('fwb');
	$('.pagenav'+index).find('i').show();
	$('.pagenav'+index).addClass('fwb');
	//$(".expert-pages>div").show();
	//if(index==0){
//		$(".expert-pages").stop().css("left","0");
//	}
//	else{
//		$(".expert-pages").stop().css("left","-100%");
//	}
	$('.expert-pages>div').hide();
	$('#expert-pages'+index).show();
}

function scrollView(index){
	$('#expert-pages'+index).scroll(function() {
        if (flagArr[index]==0) {
            var a = "";
            if ($('#downloadMoreData'+index).length>0) {
                a = document.getElementById("downloadMoreData"+index).offsetTop;
                if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height())-365) {
                    // alert("div在可视范围");
                    flagArr[index] = -1;
                    downloadMoreData(index);
                } 
            };
        };
    });
}
//获取个人信息
function requestUserHomePageData() {
	// dataLoading("数据加载中...");
		$.ajax({
				type: "post",
				url: getUserHomePageData,
				dataType: "json",
				async: true,
				data:{"userId":userID},
				success: function(result) {
						if (result.result == "success") {
							if (result.data.hasQz==1) {
								$("#focusDiv").append('<a class="fs24 bc-blue fc-blue ml10" href="circle_page.html?id='+result.data.qz.id+'">进入圈子</a>');
								index=1;
									}
								
							changeDiv(index);
								configUserUI(result.data.userHomeData);
						} else {
								dataLoadedError(result.message);
						}
				}
		});
}


function joinQz(){
    dataLoading("数据加载中...");
    userTest = getSessionUser();
    
    $.ajax({
        type: "post",
        url: joinQzUrl,
        dataType: "json",
        async: true,
		// data:{"tot":"红包总金额（分）","packets":"红包总数量","type":"1-粉丝红包，2-新手红包","splitType":"1-拼手气红包，2-普通红包"},
		data:{"id":qzId},
        success: function(result) {
            clearToastDialog();
            if (result.result == "success") {  
                window.location.href = "circle_page.html?id="+qzId;
            }else if(result.result=="toPay"){
                payParam = result.data.toPayInfo.params;
                tradeId = result.data.toPayInfo.tradeId;
                if (appType!=isApp) {
                if (typeof WeixinJSBridge == "undefined"){
                    dataLoadedError("现在网络有点小故障，正在重试...");
                   if( document.addEventListener ){
                       document.addEventListener('WeixinJSBridgeReady', onBridgeReadyJoinQz, false);
                   }else if (document.attachEvent){
                       document.attachEvent('WeixinJSBridgeReady', onBridgeReadyJoinQz); 
                       document.attachEvent('onWeixinJSBridgeReady', onBridgeReadyJoinQz);
                   }
                }else{
                   onBridgeReadyJoinQz();
                }
            } else {
                    cordova.exec(callAppsSuccessFunction,callAppsFailFunction, "MyPlugin", "wxpay", [0,payParam.partnerid,payParam.prepayid,payParam.nonceStr,payParam.timeStamp,payParam.sign,payParam.appid,payParam.packageValue]);    
                }

            } else {
                dataLoadedError(result.message);
            }
        }
    });
}

function onBridgeReadyJoinQz(){
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
            // alert(res.err_msg);
            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                // getTradeResult();
                dataLoadedSuccess("支付成功");
                setTimeout(gotoCirclePage(qzId), 1500);
            }
            else{
                if (res.err_msg=="get_brand_wcpay_request:cancel") {
                  dataLoadedError("取消支付");
                }else if (res.err_msg=="get_brand_wcpay_request:fail") {
                 // alert(res.err_msg);
                 // alert(res);
                  dataLoadedError("支付失败");
                };
            }
        }
    ); 
}

function gotoCirclePage(id){
	window.location.href = "/circle/circle_page.html?id="+id;
}


//获取专栏数据
function getMyAllContentsData() {
	var url = getMyAllContents;
	var dataStr = {"page":currentPageArr[index],"userId":userID};
	if (index==0) {
		url = getQzContentPageList;
		//$('#addCircleBtn').show();
		dataStr = {"page":currentPageArr[index],"id":qzId,"justHost":0,"priorLvl":0};
	}
	if (currentPageArr[index]==1) {
		dataLoading("数据加载中...");
		// clickItemTimesArr[index] = 1;
	}
		$.ajax({
				type: "post",
		url: url,
				dataType: "json",
				async: true,
		data:dataStr,
				success: function(result) {
			clearToastDialog();
						if (result.result == "success") {
				currentPageArr[index] = result.data.page.currentPage;
              	totalPageArr[index] = result.data.page.pages;
				// if (index==0) {
				configMyAllContentsUI(result.data.list,index);
				// }else{
				// 	configFansUI(result.data.list,index);
				// }
						} else {
								dataLoadedError(result.message);
						}
				}
		});
}

function configMyAllContentsUI(groups,index){
	//alert(index);
	for (var i = 0; i < groups.length; i++) {
		if(index==0){//圈子
			$('#expert-pages').append(listCellHC(groups[i],0,i));
		}else{//专栏
		$('#expert-pages').append(listCellUP(groups[i],0,i,userPic,userID,userNickname));
		}
		
		//判断评论的次数
        if (groups[i].content.replyTimes<=0) {
            $('#showComment_'+groups[i].content.id).css("opacity","0.15");
        }else{
        	//默认展开评论
        	showCommentList(groups[i].content.id,groups[i].type,i);
			}
        
        $("#commentDiv_"+groups[i].content.id).removeAttr("onclick");
        //移除评论打开详情
        $("#dianzan"+groups[i].content.id).parent().parent().removeAttr("onclick");
		}
	//如果是圈子，则不让操作
    if(index==0){
    	$("#expert-pages").find("*").removeAttr("onclick");
    	$("#expert-pages").attr("disabled",true);
    	setTimeout(function(){
    		$("#expert-pages").find("*").removeAttr("onclick");
        	$("#expert-pages").attr("disabled",true);
    	},1000);
    }

	//为每个问答链接的文字内容添加位置：让文字上下垂直居中
	$('.dynamic-link>p').each(function(){
		$(this).css('margin-top',-$(this).height()/2);
	});
	
	// 判断加载更多按钮是否出现
	if($('#downloadMoreData').length>0){
		$('#downloadMoreData').remove();
	}
	if (groups.length==0) {
		$('#expert-pages').html('<a class="appui_loadmore fs28 fc-greyabc">暂无内容</a>');
	};
	if (totalPageArr[index]!= currentPageArr[index]&&groups.length!=0) {
		flagArr[index] = 0;
		$('#expert-pages').append('<a onclick="downloadMoreData('+index+');" id="downloadMoreData" class="appui_loadmore fs28 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
	}else if (totalPageArr[index]==currentPageArr[index]&&totalPageArr[index]>1) {
        $('#expert-pages').append('<a class="appui_loadmore fs32 fc-greyabc">别拉了,已经没有了</a>');
    };
}
function openOrClose(contentType,traceId,id){
	if ($('#showMore_'+contentType+'_'+traceId+'_'+id).height()==60) {
		$('#showMore_'+contentType+'_'+traceId+'_'+id).height("auto");
		$('#showMore_'+contentType+'_'+traceId+'_'+id).find('.more-text>i').text('收起');
	}else{
		$('#showMore_'+contentType+'_'+traceId+'_'+id).height("3rem");
		$('#showMore_'+contentType+'_'+traceId+'_'+id).find('.more-text>i').text('更多');
	}
}

//加载更多时候进行的网络请求；
function downloadMoreData(index) {
		 currentPageArr[index]++;
	// if (index==0) {
		getMyAllContentsData();
	// }else {
	// 	requestContentListByUser(1,index);
	// };
}

function industrylabelFunction(industryTagArray) {
	var industrylabel = "";
	var industryTagStr = "";
	var industryTagCount = industryTagArray.length;
	if (industryTagCount!=0) {
		for (var i = 0; i < industryTagCount; i++) {
			industryTagStr += '<span>'+industryTagArray[i]+'</span>';
		}
		industrylabel = '<p class="appui-expert-tags-industry">'+industryTagStr+'</p>';
	}
	return industrylabel;
}

function addresslabelFunction(addressTagArray) {
	var addresslabelArr = "";
	var addressTagStr = "";
	var addressTagCount = addressTagArray.length;
	if (addressTagCount!=0) {
		for (var i = 0; i < addressTagCount; i++) {
			addressTagStr += '<span>'+addressTagArray[i]+'</span>';
		}
		addresslabelArr = '<p class="appui-expert-tags-address">'+addressTagStr+'</p>';
	}
	return addresslabelArr;
}


//app支付后回调函数
function payCallBackFunction(status){
    // 0成功 -1失败 -2取消
    if (status==0) {
        // getTradeResult();
        dataLoadedSuccess("支付成功");
        setTimeout(gotoCirclePage(qzId), 1500);
         // var id = result.data.qa.id;
         // setTimeout(gotoDetail(targertQuestionId), 1500);
    }else if (status==-1) {

    }else if (status==-2) {
    }
}

