var currentPage = 1;
var totalPage = "";
var userTest = "";

var page = 1;
var flag = 0;

var start = 0;
var pernum = 8;

$(document).ready(function() {
    requestProducts();
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
	
	//头部搜索点击效果
	$('#searchID , #searchID1').click(function(e) {
        $('body').append(initSearchUI());
        $('#searchText').attr('placeholder',"搜索楼盘");
        $('.search-container').show();
        set_focus();
    });
	
	
 });
//请求数据
function requestProducts(){
    var csrf = $('input[name="csrf"]').val();
    var start = pernum * (currentPage -1);
    $.ajax({
        url: '/loupan/info.html',
        type: 'post',
        dataType: 'json',
        data:{
            'start':start,
            "pernum":pernum,
            "currentPage": currentPage,
            '_csrf':csrf,
        },
        success: function(result){
            if (result.result == "success") {
                responsList(result);
            }else{
                dataLoadedError(result.message);
            }
        }
    })
}
//将数据转成html
function responsList(result){
    var list = '';
    for(var i=0;i<result.list.length;i++){
        list +='<div class="appui-expert bg-white"><a onclick="gotoLou('+result.list[i].id+')">' +
            '<div class="appui-expert-headpic-level">' +
            '<img class="appui-expert-headpic" src="'+result.file+result.list[i].cover+'"><i>' +
            '<img src="../bdt/images/v_loupan.png"></i></div>' +
            '<div class="appui-expert-info">' +
            '<h3 class="appui-expert-name fs30 fc-black">'+result.list[i].name+'</h3>' +
            '<p class="appui-expert-introduce fs24 fc-grey666 mt5">'+result.list[i].summary+'</p>' +
            '<div class="appui-expert-tags fs18 mt5 fc-greyabc">' +
            '<span style="display:block">查看详情</span></div></div></a></div>';
    }
    $('#professList').append(list);
    showMessage(result);

}
function gotoLou(id){
    window.location.href = "/loupan/loupan_page.html?id="+id;
}
function showMessage(result){
    if (result.page.pages > result.page.currentPage) {
        if (flag=-1) {
            flag = 0;
        };
        $('#downloadMoreData').remove();
        $('#professList').append('<a id="downloadMoreData" class="appui_loadmore fs32 fc-greyabc">拼命加载中1<i class="loadmore"></i></a>');
    }else if (result.page.pages == result.page.currentPage && result.page.pages >= 1) {
        $('#downloadMoreData').remove();
        $('#professList').append('<a class="appui_loadmore fs32 fc-greyabc">已经没有了</a>');
    }else if(result.list.length == 0){
        $('#professList').html(commonNoMoreContent("暂无专家"));
    }
}
//加载更过-拼命加载中...时候进行的网络请求；
function downloadMoreData() {
    currentPage++;
    requestProducts();
}





//推出页面时执行
function myClose(){
	var position = $('.page__bd').scrollTop();
	writeClientSession('loupanlist-position',position);
	writeClientSession('loupanlist-page',currentPage);
}

function WxShareFunction(){
    // icon:律乎 
    // 标题：你的好友+【用户名】+邀请你一起来尬聊dream house   
    // 内容:房产大咖聚众密谋大事，此处墙角可偷听！
    // @一切安好 
     //分享朋友圈标题
    var wxShareSummary = "你的好友邀请你一起来尬聊dream house";
    //发给好友标题
    var wxShareTitle = "你的好友邀请你一起来尬聊dream house";
    if(userTest!=null){
        wxShareSummary = "你的好友"+userTest.nickname+"邀请你一起来尬聊dream house";
        wxShareTitle = "你的好友"+userTest.nickname+"邀请你一起来尬聊dream house";
    }
    var wxFriendShareStr = "房产大咖聚众密谋大事，此处墙角可偷听！";
    var img = defaultWeixinSharePicUrl;
    var realUrl = window.location.href;
    wxShareFromUrlEx(wxShareTitle,wxShareSummary,wxFriendShareStr,"",img, img, realUrl);
}