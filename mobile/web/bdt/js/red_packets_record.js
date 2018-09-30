// red_packets_record.js

var currentPage = 1;
var totalPage = 1;
var flag = 0;
var currentIndex = 0;
var userTest = "";
$(document).ready(function() {
    // $('.rpf_state>a').each(function(index, element) {
    //     $(this).click(function(e) {
    //         $('.rpf_state>a').removeClass('on');
		// 	$(this).addClass('on');
		// 	$('.packer_record').hide();
		// 	$('#rpr_record'+index).show();
    //         currentIndex = index;
    //         currentPage = 1;
    //         totalPage = 1;
    //         $('#getRedPacketId').html("");
    //         $('#postRedPacketId').html("");
		// 	if (index==0) {
		// 		getUserGainRedPacketRequest();
		// 	}else{
		// 		sendOutRedPacketListRequest();
		// 	}
    //     });
    // });
    // $('.page__bd').scroll(function(){
    //     if (flag==0) {
    //         var a = "";
    //         if ($('#downloadMoreData').length>0) {
    //             a = document.getElementById("downloadMoreData").offsetTop;
    //             if (a >= $(this).scrollTop() && a < ($(this).scrollTop()+$(window).height()-40)) {
    //             // alert("div在可视范围");
    //                 flag = -1;
    //                 downloadMoreData(currentIndex);
    //             }
    //         }
    //     };
    // });

})


                





//我收到的红包UI
function getRedPacketUI(groups){
    var doStr = "";
    for (var i = 0; i < groups.length; i++) {
        doStr += '<li class="packet-record-item b-b-greye6">'+
                    '<span class="pri-type-time">'+
                        '<i class="fs28 fc-black">'+groups[i].user.nickname+'</i>'+
                        '<i class="fs20 fc-grey666">'+getDateDiff(groups[i].addTime)+'</i>'+
                    '</span>'+
                    '<em class="pri-quota fc-black fs24">'+groups[i].amount/100+'元</em>'+
                '</li>';
    }
    $('#getRedPacketId').append(doStr);
    // 判断拼命加载中...按钮是否出现
    if($('#downloadMoreData').length>0){
        $('#downloadMoreData').remove();
    }
    if (groups.length==0) {
        $('#getRedPacketId').html(commonNoMoreContent("您还没有收到任何红包"));
    }
    if (totalPage > currentPage) {
      if (flag==-1) {
          flag = 0;
      };
      $('#getRedPacketId').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (totalPage==currentPage&&totalPage>1) {
        $('#getRedPacketId').append('<a class="appui_loadmore fs32 fc-greyabc">别拉了,已经没有了</a>');
    };
}

//我发送的红包UI
function postRedPacketUI(groups){
    var doStr = "";
    for (var i = 0; i < groups.length; i++) {
        var getStatus = "";
        var splitTypeStr = "";
        // "splitType":"1-拼手气红包，2-普通红包"
        if (groups[i].splitType==1) {
            splitTypeStr = "拼手气红包";
        }else{
            splitTypeStr = "普通红包";
        }
        if (groups[i].remainSize==0) {
            getStatus = '<i class="fs20 fc-grey666">已领完</i>';
        }else{
            var geted = parseInt(groups[i].totSize)-parseInt(groups[i].remainSize);
            var totSize = "已领取"+geted+"/"+groups[i].totSize+"个";
            getStatus = '<i class="fs20 fc-red">'+totSize+'</i>';
        }
        doStr += '<li class="packet-record-item b-b-greye6">'+
                	'<span class="pri-type-time">'+
                        '<i class="fs28 fc-black">'+splitTypeStr+'</i>'+
                        '<i class="fs20 fc-grey666">'+getDateDiff(groups[i].addTime)+'</i>'+
                    '</span>'+
                    '<span class="pri-quota-state">'+
                        '<i class="fs28 fc-black">'+groups[i].totAmount/100+'元</i>'+
                        getStatus+
                    '</span>'+
                '</li>';
    }
    $('#postRedPacketId').append(doStr);
    // 判断拼命加载中...按钮是否出现
    if($('#downloadMoreData').length>0){
        $('#downloadMoreData').remove();
    }
    if (groups.length==0) {
        $('#postRedPacketId').html(commonNoMoreContent("您还没有发出任何红包"));
    }
    if (totalPage > currentPage) {
      if (flag==-1) {
          flag = 0;
      };
      $('#postRedPacketId').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中<i class="loadmore"></i></a>');
    }else if (totalPage==currentPage&&totalPage>1) {
        $('#postRedPacketId').append('<a class="appui_loadmore fs32 fc-greyabc">别拉了,已经没有了</a>');
    };
}

//拼命加载中...时候进行的网络请求；
function downloadMoreData(index) {
    currentPage++;
    if (index==0) {
        getUserGainRedPacketRequest();
    }else{
        sendOutRedPacketListRequest();
    }
}