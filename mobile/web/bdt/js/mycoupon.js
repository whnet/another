
var pageNum = 1;
// var currentPage = 1;
// var totalPage = "";
// var page = 1;
// var flag = -1;
// $(document).ready(function() {
// 	requestGetMyCouponsList();

//     $('.page__bd').scroll(function(){
//         if (flag==0) {
//             var a = "";
//             if ($('#downloadMoreData').length>0) {
//                 a = document.getElementById("downloadMoreData").offsetTop;
//                 if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
//                 // alert("div在可视范围");
//                     flag = -1;
//                     downloadMoreData();
//                 } 
//             }
//         };
//     });
    
// });

// //进行四个导航列表的网络请求
// function requestGetMyCouponsList() {
// $.ajax({
// 		url: getMyCouponsList,
// 		type: 'post',
// 		dataType: 'json',
// 		data: {"page":page},
// 		success: function (result){
// 			if (result.result == "success") {
// 				currentPage = result.data.page.currentPage;
//                 totalPage = result.data.page.pages;
// 				configUI(result.data.list);
// 			}else{
// 				dataLoadedError(result.message);
// 		    }
// 		}
// 	})
// }

// function configUI(lists){
// 	// var lists = result.data.list;
// 	var htmlDom = "";
// 	var whichClass = '';
// 	var useStart,useEnd;
// 	var coupon_coupon = [];
// 	for (var i = 0; i < lists.length; i++) {
// 		function LocaleDateString(timestamp){
// 			var newDate = new Date(timestamp);
// 			return newDate.toLocaleDateString();
// 		}
// 		if (lists[i].isValidity == 0) {
// 			whichClass = "inuse";
// 			coupon_coupon.push(lists[i].coupons.couponsName);
// 		}else if(lists[i].isValidity == 1){
// 			whichClass = "outDate";
// 		}else{
// 			whichClass = "used";
// 		}
// 		useStart = LocaleDateString(lists[i].coupons.useStartTime);
// 		useEnd = LocaleDateString(lists[i].coupons.useEndTime);
// 		htmlDom += '<div class="yhquan '+whichClass+' bg-white">'+
// 						'<div class="bgImg">'+
// 							'<img src="images/youhuiquan.jpg" alt="">'+
// 						'</div>'+
// 						'<p class="quan-type fc-white fs30">'+lists[i].coupons.type+'</p>'+
// 						'<div class="quan-detail">'+
// 							'<h2 class="fs30 fc-black">'+lists[i].coupons.couponsName+'</h2>'+
// 							'<div class="mt15">'+
// 								'<p class="fs24 fc-greyabc">'+useStart+' 至 '+useEnd+' 有效</p>'+
// 								'<p class="fs24 fc-greyabc">'+lists[i].coupons.useRule+'</p>'+
// 							'</div>'+
// 							'<img class="outDateImg" src="images/outDate.png" alt="">'+
// 							'<img class="usedImg" src="images/used.png" alt="">'+
// 							'<span class="fs28 fc-orange inusep">可使用</span>'+
// 						'</div>'+
// 					'</div>'
// 	}
// 	// $(".coupon_tips").html("您当前只有"+coupon_coupon.length+"张优惠券可用");
// 	if (coupon_coupon.length==0) {
// 		$('#couponField').append(commonNoMoreContent("暂无优惠券"));
// 	};
// 	$("#couponField").append(htmlDom);
// 	// 判断拼命加载中...按钮是否出现
// 	if($('#downloadMoreData').length>0){
// 		$('#downloadMoreData').remove();
// 	}
//     if (totalPage > currentPage) {
//       if (flag=-1) {
//           flag = 0;
//       };
//       $('#couponField').append('<a onclick="downloadMoreData();" id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
//     }
// }


function getCouponsList(){
	$.ajax({
		url: getMyCouponsList,
		type: 'post',
		dataType: 'json',
		data: {"page":pageNum},
		success: function (result){
			var htmlDom = "";
			if (result.result == "success") {
				var lists = result.data.list;
	var whichClass = '';
	var useStart,useEnd;
	var coupon_coupon = [];
	for (var i = 0; i < lists.length; i++) {
		function LocaleDateString(timestamp){
			var newDate = new Date(timestamp);
			return newDate.toLocaleDateString();
		}
		if (lists[i].isValidity == 0) {
			whichClass = "inuse";
			coupon_coupon.push(lists[i].coupons.couponsName);
		}else if(lists[i].isValidity == 1){
			whichClass = "outDate";
		}else{
			whichClass = "used";
		}
		useStart = LocaleDateString(lists[i].coupons.useStartTime);
		useEnd = LocaleDateString(lists[i].coupons.useEndTime);
		htmlDom += '<div class="yhquan '+whichClass+' bg-white">'+
						'<div class="bgImg">'+
							'<img src="images/youhuiquan.jpg" alt="">'+
						'</div>'+
						'<p class="quan-type fc-white fs30">'+lists[i].coupons.type+'</p>'+
						'<div class="quan-detail">'+
							'<h2 class="fs30 fc-black">'+lists[i].coupons.couponsName+'</h2>'+
							'<div class="mt15">'+
								'<p class="fs24 fc-greyabc">'+useStart+' 至 '+useEnd+' 有效</p>'+
								'<p class="fs24 fc-greyabc">'+lists[i].coupons.useRule+'</p>'+
							'</div>'+
							'<img class="outDateImg" src="images/outDate.png" alt="">'+
							'<img class="usedImg" src="images/used.png" alt="">'+
							'<span class="fs28 fc-orange inusep">可使用</span>'+
						'</div>'+
					'</div>'
	}
				$(".coupon_tips").html("您当前只有"+coupon_coupon.length+"张优惠券可用");
				$("#couponField").html(htmlDom);
			}else{
				dataLoadedError(result.message);
    }
    }
	})
}
getCouponsList();